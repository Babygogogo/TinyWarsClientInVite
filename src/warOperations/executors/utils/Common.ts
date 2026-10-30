import type { BattleInfo } from "../../../auxiliaryTypes/BattleInfo.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { getTotalOffset } from "../../../coSkills/utils/instantMisc/SelfUnitHpAfterWait.ts";
import type { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import { getUnitClass } from "../../../gameHelpers/GhFactory.ts";
import {
    getExisted,
    newError,
    createLazyFunc,
} from "../../../helpers/Misc.ts";
import { getValidFund } from "../../../players/utils/Common.ts";
import type { CommonExtraDataForWarOperation } from "../../../proto/schema/CommonProto/Structure/CommonExtraDataForWarOperation.ts";
import { TileBuff } from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type { SerialUnit } from "../../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import { ShortSfxCode } from "../../../sounds/Constants.ts";
import { playShortSfx } from "../../../sounds/SoundPlayer.ts";
import { TeamIndex } from "../../../teams/Constants.ts";
import { BuffTypeId } from "../../../tileBuffs/Constants.ts";
import type { IUnit } from "../../../units/IUnit.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";

/**
 * @return the war view is vibrated or not
 */
export function handleCommonExtraData({ war, commonExtraData, isFastExecute, isUnitJoinUnit = false }: {
    war                 : IBwWar;
    commonExtraData     : CommonExtraDataForWarOperation;
    isFastExecute       : boolean;
    isUnitJoinUnit?     : boolean;
}): boolean {
    const playerIndexInTurn = war.getPlayerIndexInTurn();
    const fogMap            = war.getFogMap();
    {
        const visibilityArrayFromPathsAfterAction = commonExtraData.getVisibilityArrayFromPathsAfterAction();
        if (visibilityArrayFromPathsAfterAction) {
            fogMap.updateMapFromPathsByVisibilityArray(playerIndexInTurn, visibilityArrayFromPathsAfterAction);
        }
    }
    {
        const array = commonExtraData.getVisibilityArrayFromPathsAfterWarEvent();
        if (array) {
            fogMap.updateMapFromPathsByUnitMovePathVisibilityArrayForWarEvent(array);
        }
    }

    const gameConfig                = war.getGcData();
    const playerArrayAfterAction    = commonExtraData.getPlayerArrayAfterAction();
    for (const playerData of playerArrayAfterAction) {
        const player = war.getPlayer(playerData.getPlayerIndex());
        player.init(playerData, gameConfig);
        player.startRunning(war);
    }

    const unitMap = war.getUnitMap();
    unitMap.setNextUnitId(getExisted(commonExtraData.getNextUnitId(), ClientErrorCode.WarCommonHelpers_HandleCommonExtraDataForWarOperation_01));

    const unitArrayAfterAction  = commonExtraData.getUnitArrayAfterAction();
    const destroyedUnitIdArray  = commonExtraData.getDestroyedUnitIdArray();
    if (unitArrayAfterAction.some(v => destroyedUnitIdArray.includes(v.getUnitId()))) {
        throw newError(`WarCommonHelpers.handleCommonExtraDataForWarOperations() unitArrayAfterAction and destroyedUnitIdArray overlapped!`, ClientErrorCode.WarCommonHelpers_HandleCommonExtraDataForWarOperation_03);
    }

    const movingUnitAndPath     = commonExtraData.getMovingUnitAndPath();
    const movingUnitData        = movingUnitAndPath ? getExisted(movingUnitAndPath.getUnit()) : null;
    const movingUnitId          = movingUnitData ? movingUnitData.getUnitId() : null;
    // const movingUnit            = movingUnitId == null ? null : unitMap.getUnitById(movingUnitId);
    const gridVisualEffect      = war.getGridVisualEffect();
    let isShownExplosionEffect  = false;
    {
        const movingPath            = movingUnitAndPath?.getPath();
        const movingDestination     = movingPath ? movingPath[movingPath.length - 1] : null;
        const destinationGridIndex  = movingDestination?.getIsVisible() ? GridIndex.convertGridIndex(movingDestination.getGridIndex()) : null;
        for (const unitId of destroyedUnitIdArray) {
            const unit = unitMap.getUnitById(unitId);
            if (unit == null) {
                continue;
            }

            if (unit.getLoaderUnitId()) {
                unitMap.removeUnitLoaded(unitId).stopRunning();

            } else {
                const gridIndex = unit.getGridIndex();
                unitMap.removeUnitOnMap(gridIndex, true)?.stopRunning();

                if (!isFastExecute) {
                    // 这段代码会导致我方自杀式攻击时，在该部队的起点和终点分别出现一个爆炸特效（起点的是多余的）；在第三势力看来，如果进攻方从明处走到暗处进行自杀式攻击，也会在起点出现多余的爆炸特效
                    // if ((destinationGridIndex == null)                                      ||
                    //     (unit.getPlayerIndex() !== movingUnitPlayerIndex)                   ||
                    //     (!GridIndex.checkIsEqual(destinationGridIndex, gridIndex))
                    // ) {
                    //     gridVisualEffect.showEffectExplosion(gridIndex);
                    //     isShownExplosionEffect = true;
                    // }
                    // 暂时改成下面这段代码，不确定有没有问题
                    if (unitId !== movingUnitId) {
                        gridVisualEffect.showEffectExplosion(gridIndex);
                        isShownExplosionEffect = true;
                    } else {
                        if (destinationGridIndex) {
                            gridVisualEffect.showEffectExplosion(destinationGridIndex);
                            isShownExplosionEffect = true;
                        }
                    }
                }
            }
        }
    }

    // 先把unitArrayAfterAction涉及的部队全部从地图上移除，然后再重新加回来，否则如果遇到有部队互相交换了位置之类的复杂情况就会报错（因为尝试把A移动到B所在位置时，B仍然占着位置，A就无法移动过去）
    const tempRemovedUnits      = new Map<number, IUnit>(); // 此临时变量仅用于优化性能，在后续把部队加回来的过程中可以直接从这里取，而不必重新创建
    // const tempRemovedLoadedUnits: IUnit[] = [];
    const hiddenUnitIdArray     = commonExtraData.getHiddenUnitIdArray();  // 如果观战者同时观战多个队伍，则此集合会包含所有相关队伍各自的hiddenUnitIdArray，实际上是不准确的；但由于后续的unitArrayAfterAction同样如此，所以正好能把实际上不是hidden的部队重新加回来，负负得正
    if (hiddenUnitIdArray.length) {
        for (const unitId of hiddenUnitIdArray) {
            const unit = unitMap.removeUnitById(unitId, true);
            if (unit != null) {
                unit.stopRunning();
                tempRemovedUnits.set(unitId, unit);
            }
        }
    } else {
        // 由于后端没有明确告诉前端哪些部队在动作过后消失，所以只能前端假定movingUnit和其搭载的部队会消失，在这里预先移除它们。若实际上没有消失，则unitArrayAfterAction会包含它们，从而可以重新加回来。
        // 但实际上存在一种特殊情况，比如装载了部队的运输部队原地待机或装载co，那么由于被装载的部队没有发生变化，所以unitArrayAfterAction不会包含它们，导致动作执行完后，被装载的部队假性消失
        // 等当前进行中的局全部结束后，就可以通过hiddenUnitIdArray来准确移除消失的部队，不用假定movingUnit消失，从而可以删掉这些代码
        // if ((movingUnitId != null) && (movingUnit)) {
        //     unitMap.removeUnitById(movingUnitId, true);
        //     tempRemovedUnits.set(movingUnitId, movingUnit);

        //     for (const loadedUnit of unitMap.getUnitsLoadedByLoader(movingUnit, true)) {
        //         const loadedUnitId = loadedUnit.getUnitId();
        //         unitMap.removeUnitLoaded(loadedUnitId);
        //         tempRemovedUnits.set(loadedUnitId, loadedUnit);
        //         tempRemovedLoadedUnits.push(loadedUnit);
        //     }
        // }
    }
    for (const unitData of unitArrayAfterAction) {
        const unitId    = unitData.getUnitId();
        const unit      = unitMap.getUnitById(unitId);
        if (unit) {
            unitMap.removeUnitById(unitId, true)?.stopRunning();
            tempRemovedUnits.set(unitId, unit);
        }
    }

    const tileMap = war.getTileMap();
    for (const tileData of commonExtraData.getTileArrayAfterAction()) {
        const gridIndex             = getExisted(GridIndex.convertGridIndex(tileData.getGridIndex()), ClientErrorCode.WarCommonHelpers_HandleCommonExtraDataForWarOperation_07);
        const tile                  = tileMap.getTile(gridIndex);
        const hpBeforeAction        = tile.getCurrentHp();
        const hasMaxHpBeforeAction  = tile.getMaxHp() != null;
        tile.init(tileData, gameConfig);
        tile.startRunning(war);
        tile.startRunningView();

        if (!isFastExecute) {
            if (hasMaxHpBeforeAction) {
                if (tile.getMaxHp() == null) {
                    gridVisualEffect.showEffectExplosion(gridIndex);
                    isShownExplosionEffect = true;
                } else if (tile.getCurrentHp() < hpBeforeAction) {
                    gridVisualEffect.showEffectDamage(gridIndex);
                }
            }
        }
    }

    const updatedViewUnits = new Set<IUnit>();
    for (const unitData of unitArrayAfterAction) {
        const unitId        = unitData.getUnitId();
        const existingUnit  = tempRemovedUnits.get(unitId);
        if (existingUnit) {
            const existingUnitData = existingUnit.serialize();
            existingUnit.init(unitData, gameConfig);
            if (existingUnit.getLoaderUnitId() == null) {
                unitMap.setUnitOnMap(existingUnit);
            } else {
                unitMap.setUnitLoaded(existingUnit);

                if (!isFastExecute) {
                    const loaderUnit = unitMap.getUnitOnMap(existingUnit.getGridIndex());
                    if (loaderUnit) {
                        loaderUnit.updateView();
                        updatedViewUnits.add(loaderUnit);
                    }
                }
            }
            existingUnit.startRunning(war);
            existingUnit.startRunningView();
            updatedViewUnits.add(existingUnit);

            if (!isFastExecute) {
                const gridIndex = existingUnit.getGridIndex();
                if (!isUnitJoinUnit) {
                    if (checkIsUnitRepaired(existingUnitData, unitData)) {
                        gridVisualEffect.showEffectRepair(gridIndex);
                    } else if (checkIsUnitSupplied(existingUnitData, unitData, gameConfig)) {
                        gridVisualEffect.showEffectSupply(gridIndex);
                    }
                }

                if (checkIsUnitDamaged(existingUnitData, unitData)) {
                    gridVisualEffect.showEffectDamage(gridIndex);
                }
            }

        } else {
            const unit = new (getUnitClass())();
            unit.init(unitData, gameConfig);

            if (unit.getLoaderUnitId() == null) {
                unitMap.setUnitOnMap(unit);
            } else {
                unitMap.setUnitLoaded(unit);

                if (!isFastExecute) {
                    const loaderUnit = unitMap.getUnitOnMap(unit.getGridIndex());
                    if (loaderUnit) {
                        loaderUnit.updateView();
                        updatedViewUnits.add(loaderUnit);
                    }
                }
            }
            unit.startRunning(war);
            unit.startRunningView();
            updatedViewUnits.add(unit);
        }
    }
    {
        const loaderUnitId = movingUnitData?.getLoaderUnitId();
        if (loaderUnitId != null) {
            const unit = unitMap.getUnitById(loaderUnitId);
            if ((unit) && (!updatedViewUnits.has(unit))) {
                updatedViewUnits.add(unit);
                unit.updateView();
            }
        }
    }
    // if (hiddenUnitIdArray.length) {
    //     // nothing to do
    // } else {
    //     // HACK：临时处理 类似装载了部队的运输船原地待机后被装载物假性消失的问题
    //     // 等当前进行中的局全部结束后，就可以通过hiddenUnitIdArray完成相同逻辑，从而可以删掉这些代码
    //     if ((movingUnitId != null) && (unitMap.getUnitById(movingUnitId) != null)) {
    //         let hasAdd = false;
    //         for (const loadedUnit of tempRemovedLoadedUnits) {
    //             if (unitMap.getUnitById(loadedUnit.getUnitId()) == null) {
    //                 unitMap.setUnitLoaded(loadedUnit);
    //                 hasAdd = true;
    //             }
    //         }
    //         if (hasAdd) {
    //             unitMap.getUnitById(movingUnitId)?.updateView();
    //         }
    //     }
    // }

    {
        const weatherManagerData = commonExtraData.getWeatherManager();
        if (weatherManagerData != null) {
            const weatherManager = war.getWeatherManager();
            weatherManager.init(weatherManagerData);

            if (!isFastExecute) {
                weatherManager.getView().resetView(false);
            }
        }
    }

    {
        const warEventManager = war.getWarEventManager();
        for (const data of commonExtraData.getCustomCounterArray()) {
            warEventManager.setCustomCounter(data.getCustomCounterId(), data.getValue());
        }
    }

    {
        const forceFog = commonExtraData.getForceFog();
        if (forceFog != null) {
            fogMap.setForceFogCode(getExisted(forceFog.getForceFogCode()));
            fogMap.setForceExpirePlayerIndex(forceFog.getExpirePlayerIndex());
            fogMap.setForceExpireTurnIndex(forceFog.getExpireTurnIndex());
        }
    }

    {
        const taskObjectiveManager = war.getTaskObjectiveManager();
        for (const taskObjectiveState of commonExtraData.getTaskObjectiveStateArray()) {
            taskObjectiveManager.updateState(taskObjectiveState);
        }
    }

    if ((!isFastExecute) && (playerArrayAfterAction.length)) {
        for (const unit of unitMap.getAllUnitsOnMap()) {
            if ((!updatedViewUnits.has(unit))                                               &&
                (playerArrayAfterAction.some(v => v.getPlayerIndex() === unit.getPlayerIndex()))
            ) {
                unit.updateView();
            }
        }
    }

    if ((!isFastExecute) && (isShownExplosionEffect)) {
        war.getView().showVibration();
        playShortSfx(ShortSfxCode.Explode);
        return true;
    } else {
        return false;
    }
}

function checkIsUnitRepaired(oldUnitData: SerialUnit, newUnitData: SerialUnit): boolean {
    if (oldUnitData.getUnitType() != newUnitData.getUnitType()) {
        return false;
    }

    return (newUnitData.getCurrentHp()) > (oldUnitData.getCurrentHp());
}
function checkIsUnitSupplied(oldUnitData: SerialUnit, newUnitData: SerialUnit, gameConfig: GameConfig): boolean {
    const unitType = newUnitData.getUnitType();
    if (oldUnitData.getUnitType() != unitType) {
        return false;
    }

    const unitCfg = getExisted(gameConfig.getUnitTemplateCfg(unitType), ClientErrorCode.WarCommonHelpers_CheckIsUnitSupplied_00);
    {
        if ((newUnitData.getCurrentFuel()) > (oldUnitData.getCurrentFuel())) {
            return true;
        }
    }

    {
        const maxAmmo = unitCfg.getPrimaryWeaponMaxAmmo();
        if ((maxAmmo != null)                                                                                       &&
            ((newUnitData.getPrimaryWeaponCurrentAmmo()) > (oldUnitData.getPrimaryWeaponCurrentAmmo()))
        ) {
            return true;
        }
    }

    {
        const maxAmmo = unitCfg.getFlareMaxAmmo();
        if ((maxAmmo != null)                                                                       &&
            ((newUnitData.getFlareCurrentAmmo()) > (oldUnitData.getFlareCurrentAmmo()))
        ) {
            return true;
        }
    }

    {
        const maxMaterial = unitCfg.getMaxProduceMaterial();
        if ((maxMaterial != null)                                                                                       &&
            ((newUnitData.getCurrentProduceMaterial()) > (oldUnitData.getCurrentProduceMaterial()))
        ) {
            return true;
        }
    }

    {
        const maxMaterial = unitCfg.getMaxBuildMaterial();
        if ((maxMaterial != null)                                                                                   &&
            ((newUnitData.getCurrentBuildMaterial()) > (oldUnitData.getCurrentBuildMaterial()))
        ) {
            return true;
        }
    }

    return false;
}
function checkIsUnitDamaged(oldUnitData: SerialUnit, newUnitData: SerialUnit): boolean {
    if (oldUnitData.getUnitType() != newUnitData.getUnitType()) {
        return false;
    }

    return (newUnitData.getCurrentHp()) < (oldUnitData.getCurrentHp());
}

export function handleViewForBattle(battleInfo: BattleInfo, war: IBwWar, allVisibleUnits: Set<IUnit>): void {
    const gridVisualEffect      = war.getGridVisualEffect();
    let isVisibleUnitDestroyed  = false;
    let isVisibleUnitDamaged    = false;
    {
        const unitMap                   = war.getUnitMap();
        const mapSize                   = unitMap.getMapSize();
        const unitMapView               = unitMap.getView();
        const destroyedUnits            = battleInfo.destroyedUnits;
        const destroyedUnitGridIdSet    = new Set<number>();
        for (const [, unit] of destroyedUnits) {
            unitMapView.removeUnit(unit.getView());

            if (allVisibleUnits.has(unit)) {
                isVisibleUnitDestroyed = true;
                destroyedUnitGridIdSet.add(unit.getGridIndex().getGridId(mapSize));
            }
        }

        const damagedUnitGridIdSet = new Set<number>();
        for (const [unitId, unit] of battleInfo.damagedUnits) {
            if (destroyedUnits.has(unitId)) {
                continue;
            }

            unit.updateView();

            if (allVisibleUnits.has(unit)) {
                isVisibleUnitDamaged = true;

                const gridId = unit.getGridIndex().getGridId(mapSize);
                if (!destroyedUnitGridIdSet.has(gridId)) {
                    damagedUnitGridIdSet.add(gridId);
                }
            }
        }

        for (const gridId of destroyedUnitGridIdSet) {
            gridVisualEffect.showEffectExplosion(GridIndex.getGridIndexByGridId(gridId, mapSize));
        }
        for (const gridId of damagedUnitGridIdSet) {
            gridVisualEffect.showEffectDamage(GridIndex.getGridIndexByGridId(gridId, mapSize));
        }
    }

    const destroyedTiles = battleInfo.destroyedTiles;
    for (const [, tile] of destroyedTiles) {
        tile.flushDataToView();
        gridVisualEffect.showEffectExplosion(tile.getGridIndex());
    }

    const damagedTiles = battleInfo.damagedTiles;
    for (const [gridId, tile] of damagedTiles) {
        if (!destroyedTiles.has(gridId)) {
            tile.flushDataToView();
            gridVisualEffect.showEffectDamage(tile.getGridIndex());
        }
    }

    if ((isVisibleUnitDestroyed) || (destroyedTiles.size)) {
        war.getView().showVibration();
        playShortSfx(ShortSfxCode.Explode);
    } else {
        if ((isVisibleUnitDamaged) || (damagedTiles.size)) {
            playShortSfx(ShortSfxCode.Attack);
        }
    }
}

export function handleSelfUnitHpAfterWait(focusUnit: IUnit, isFastExecute: boolean): void {
    const war       = focusUnit.getWar();
    const gridIndex = focusUnit.getGridIndex();
    if (war.getUnitMap().getUnitOnMap(gridIndex) != focusUnit) {
        return;
    }

    const isCoOnboard               = focusUnit.getIsCoOnboard();
    const focusPlayer               = focusUnit.getPlayer();
    const maxHp                     = focusUnit.getMaxHp();
    const currentHp                 = focusUnit.getCurrentHp();
    const focusCoZoneRadius         = focusPlayer.getCoZoneRadius();
    const gameConfig                = war.getGcData();
    const getCoGridIndexArrayOnMap  = createLazyFunc(() => focusPlayer.getCoGridIndexListOnMap());
    let newHp                       = currentHp;
    for (const skillId of focusPlayer.getCoCurrentSkills()) {
        const skillCfg = gameConfig.getCoSkillCfg(skillId)?.getInstantMisc()?.getSelfUnitHpAfterWait();
        if (skillCfg == null) {
            continue;
        }

        if ((!isCoOnboard) && (!gridIndex.checkIsInsideCoSkillArea({
            coSkillAreaType             : skillCfg.getCoSkillAreaTypeId(),
            coZoneRadius                : focusCoZoneRadius,
            getCoGridIndexArrayOnMap    : getCoGridIndexArrayOnMap
        }))) {
            continue;
        }

        newHp += getTotalOffset({
            cfg         : skillCfg,
            gameConfig  : gameConfig,
            maxHp       : maxHp,
            currentHp   : newHp,
        });
    }

    if (newHp != currentHp) {
        focusUnit.setCurrentHp(newHp);

        if (!isFastExecute) {
            focusUnit.updateView();
        }
    }
}

export function handlePostOperationPlunder(focusUnit: IUnit, isFastExecute: boolean): void {
    const gridIndex = focusUnit.getGridIndex();
    const war       = focusUnit.getWar();
    if (war.getUnitMap().getUnitOnMap(gridIndex) !== focusUnit) {
        return;
    }

    const tile = war.getTileMap().getTile(gridIndex);
    if (tile.getUnfixedBuffList()?.some(v => v.getBuffTypeId() === BuffTypeId.NoIncome)) {
        return;
    }

    const focusUnitType             = focusUnit.getUnitType();
    const focusTeamIndex            = focusUnit.getTeamIndex();
    const focusPlayerIndex          = focusUnit.getPlayerIndex();
    const isCoOnboard               = focusUnit.getIsCoOnboard();
    const focusPlayer               = focusUnit.getPlayer();
    const focusCoZoneRadius         = focusPlayer.getCoZoneRadius();
    const tileTeamIndex             = tile.getTeamIndex();
    const tileType                  = tile.getTileTypeId();
    const tilePlayerIndex           = tile.getPlayerIndex();
    const gameConfig                = war.getGcData();
    const turnIndex                 = war.getTurnManager().getTurnIndex();
    const getCoGridIndexArrayOnMap  = createLazyFunc(() => focusPlayer.getCoGridIndexListOnMap());
    for (const skillId of focusPlayer.getCoCurrentSkills()) {
        const skillCfg = gameConfig.getCoSkillCfg(skillId)?.getInstantMisc()?.getSelfPostOperationPlunder();
        if (skillCfg == null) {
            continue;
        }

        const multiple = skillCfg.getMultiple();
        if (multiple <= 0) {
            continue;
        }

        if ((tileTeamIndex === TeamIndex.Neutral) && (!skillCfg.getCanPlunderNeutral())) {
            continue;
        } else if ((tileTeamIndex === focusTeamIndex) && (!skillCfg.getCanPlunderSelf())) {
            continue;
        } else if (!skillCfg.getCanPlunderEnemy()) {
            continue;
        }

        if (!gameConfig.checkIsUnitTypeInCategory(focusUnitType, skillCfg.getUnitCategoryId())) {
            continue;
        }
        if (!gameConfig.checkIsTileTypeInCategory(tileType, skillCfg.getTargetTileCategoryId())) {
            continue;
        }

        if ((!isCoOnboard) && (!gridIndex.checkIsInsideCoSkillArea({
            coSkillAreaType             : skillCfg.getCoSkillAreaTypeId(),
            coZoneRadius                : focusCoZoneRadius,
            getCoGridIndexArrayOnMap    : getCoGridIndexArrayOnMap,
        }))) {
            continue;
        }

        focusPlayer.setFund(getValidFund(focusPlayer.getFund() + tile.getIncomeForPlayer(tilePlayerIndex) * multiple));
        tile.addUnfixedBuff(TileBuff.fromJson({
            buffTypeId          : BuffTypeId.NoIncome,
            expiringTurnIndex   : turnIndex + multiple,
            expiringPlayerIndex : focusPlayerIndex,
            extraParamArray     : [],
        }), !isFastExecute);

        return;
    }
}
