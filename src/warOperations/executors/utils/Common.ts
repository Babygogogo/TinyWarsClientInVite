import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_RawMovingUnitAndPath,
    AuxiliaryTypes_ThingsForMovePath,
    AuxiliaryTypes_TileAppearanceInfo,
    AuxiliaryTypes_VisibleThings,
    Helpers_Misc,
    Players_Utils_Common,
    SinglePlayerWars_War,
    Sounds_Constants,
    Sounds_SoundPlayer,
    Teams_Constants,
    TileBuffs_Constants,
    Tiles_Tile,
    Units_Unit,
    Utils_ClientErrorCode,
    type AuxiliaryTypes_BattleInfo,
    type BaseWar_Model_War,
    type GameConfigs_GameConfig,
} from "../../../internal.ts";
import { CommonExtraDataForWarOperation } from "../../../proto/schema/CommonProto/Structure/CommonExtraDataForWarOperation.ts";
import type { MovingUnitAndPath } from "../../../proto/schema/CommonProto/Structure/MovingUnitAndPath.ts";
import { TileBuff } from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { SerialTile } from "../../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import type { SerialUnit } from "../../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";

type MessageCreator = (extraData: CommonExtraDataForWarOperation, movingUnitAndPathList: MovingUnitAndPath[]) => WoContainer;

/**
 * @return the war view is vibrated or not
 */
export function handleCommonExtraData({ war, commonExtraData, isFastExecute, isUnitJoinUnit = false }: {
    war                 : BaseWar_Model_War.War;
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
    unitMap.setNextUnitId(Helpers_Misc.getExisted(commonExtraData.getNextUnitId(), Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_HandleCommonExtraDataForWarOperation_01));

    const unitArrayAfterAction  = commonExtraData.getUnitArrayAfterAction();
    const destroyedUnitIdArray  = commonExtraData.getDestroyedUnitIdArray();
    if (unitArrayAfterAction.some(v => destroyedUnitIdArray.includes(v.getUnitId()))) {
        throw Helpers_Misc.newError(`WarCommonHelpers.handleCommonExtraDataForWarOperations() unitArrayAfterAction and destroyedUnitIdArray overlapped!`, Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_HandleCommonExtraDataForWarOperation_03);
    }

    const movingUnitAndPath     = commonExtraData.getMovingUnitAndPath();
    const movingUnitData        = movingUnitAndPath ? Helpers_Misc.getExisted(movingUnitAndPath.getUnit()) : null;
    const movingUnitId          = movingUnitData ? movingUnitData.getUnitId() : null;
    // const movingUnit            = movingUnitId == null ? null : unitMap.getUnitById(movingUnitId);
    const gridVisualEffect      = war.getGridVisualEffect();
    let isShownExplosionEffect  = false;
    {
        const movingPath            = movingUnitAndPath?.getPath();
        const movingDestination     = movingPath ? movingPath[movingPath.length - 1] : null;
        const destinationGridIndex  = movingDestination?.getIsVisible() ? AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(movingDestination.getGridIndex()) : null;
        for (const unitId of destroyedUnitIdArray) {
            const unit = unitMap.getUnitById(unitId);
            if (unit == null) {
                continue;
            }

            if (unit.getLoaderUnitId()) {
                unitMap.deleteUnitLoaded(unitId).dispose();

            } else {
                const gridIndex = unit.getGridIndex();
                unitMap.deleteUnitOnMap(gridIndex, true)?.dispose();

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
                        gridVisualEffect?.showEffectExplosion(gridIndex);
                        isShownExplosionEffect = true;
                    } else {
                        if (destinationGridIndex) {
                            gridVisualEffect?.showEffectExplosion(destinationGridIndex);
                            isShownExplosionEffect = true;
                        }
                    }
                }
            }
        }
    }

    // 先把unitArrayAfterAction涉及的部队全部从地图上移除，然后再重新加回来，否则如果遇到有部队互相交换了位置之类的复杂情况就会报错（因为尝试把A移动到B所在位置时，B仍然占着位置，A就无法移动过去）
    const tempRemovedUnits      = new Map<number, Units_Unit.Unit>(); // 此临时变量仅用于优化性能，在后续把部队加回来的过程中可以直接从这里取，而不必重新创建
    // const tempRemovedLoadedUnits: Units_Unit.Unit[] = [];
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
        const gridIndex             = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(tileData.getGridIndex()), Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_HandleCommonExtraDataForWarOperation_07);
        const tile                  = tileMap.getTile(gridIndex);
        const hpBeforeAction        = tile.getCurrentHp();
        const hasMaxHpBeforeAction  = tile.getMaxHp() != null;
        tile.init(tileData, gameConfig);
        tile.startRunning(war);
        tile.flushDataToView();

        if (!isFastExecute) {
            if (hasMaxHpBeforeAction) {
                if (tile.getMaxHp() == null) {
                    gridVisualEffect?.showEffectExplosion(gridIndex);
                    isShownExplosionEffect = true;
                } else if (tile.getCurrentHp() < hpBeforeAction) {
                    gridVisualEffect?.showEffectDamage(gridIndex);
                }
            }
        }
    }

    const updatedViewUnits = new Set<Units_Unit.Unit>();
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
                        loaderUnit.flushDataToView();
                        updatedViewUnits.add(loaderUnit);
                    }
                }
            }
            existingUnit.startRunning(war);
            existingUnit.flushDataToView();
            updatedViewUnits.add(existingUnit);

            if (!isFastExecute) {
                const gridIndex = existingUnit.getGridIndex();
                if (!isUnitJoinUnit) {
                    if (checkIsUnitRepaired(existingUnitData, unitData)) {
                        gridVisualEffect?.showEffectRepair(gridIndex);
                    } else if (checkIsUnitSupplied(existingUnitData, unitData, gameConfig)) {
                        gridVisualEffect?.showEffectSupply(gridIndex);
                    }
                }

                if (checkIsUnitDamaged(existingUnitData, unitData)) {
                    gridVisualEffect?.showEffectDamage(gridIndex);
                }
            }

        } else {
            const unit = new Units_Unit.Unit(true);
            unit.init(unitData, gameConfig);

            if (unit.getLoaderUnitId() == null) {
                unitMap.setUnitOnMap(unit);
            } else {
                unitMap.setUnitLoaded(unit);

                if (!isFastExecute) {
                    const loaderUnit = unitMap.getUnitOnMap(unit.getGridIndex());
                    if (loaderUnit) {
                        loaderUnit.flushDataToView();
                        updatedViewUnits.add(loaderUnit);
                    }
                }
            }
            unit.startRunning(war);
            unit.flushDataToView();
            updatedViewUnits.add(unit);
        }
    }
    {
        const loaderUnitId = movingUnitData?.getLoaderUnitId();
        if (loaderUnitId != null) {
            const unit = unitMap.getUnitById(loaderUnitId);
            if ((unit) && (!updatedViewUnits.has(unit))) {
                updatedViewUnits.add(unit);
                unit.flushDataToView();
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
                weatherManager.getView()?.resetView(false);
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
            fogMap.setForceFogCode(Helpers_Misc.getExisted(forceFog.getForceFogCode()));
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
                unit.flushDataToView();
            }
        }
    }

    if ((!isFastExecute) && (isShownExplosionEffect)) {
        war.getView()?.showVibration();
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.Explode);
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
function checkIsUnitSupplied(oldUnitData: SerialUnit, newUnitData: SerialUnit, gameConfig: GameConfigs_GameConfig.GameConfig): boolean {
    const unitType = newUnitData.getUnitType();
    if (oldUnitData.getUnitType() != unitType) {
        return false;
    }

    const unitCfg = Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(unitType), Utils_ClientErrorCode.ClientErrorCode.WarCommonHelpers_CheckIsUnitSupplied_00);
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

export function handleViewForBattle(battleInfo: AuxiliaryTypes_BattleInfo.BattleInfo, war: BaseWar_Model_War.War, allVisibleUnits: Set<Units_Unit.Unit>): void {
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
            const view = unit.getView();
            if (view) {
                unitMapView?.deleteUnitView(view);
            }
            unit.dispose();

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

            unit.flushDataToView();

            if (allVisibleUnits.has(unit)) {
                isVisibleUnitDamaged = true;

                const gridId = unit.getGridIndex().getGridId(mapSize);
                if (!destroyedUnitGridIdSet.has(gridId)) {
                    damagedUnitGridIdSet.add(gridId);
                }
            }
        }

        for (const gridId of destroyedUnitGridIdSet) {
            gridVisualEffect?.showEffectExplosion(AuxiliaryTypes_GridIndex.GridIndex.getGridIndexByGridId(gridId, mapSize));
        }
        for (const gridId of damagedUnitGridIdSet) {
            gridVisualEffect?.showEffectDamage(AuxiliaryTypes_GridIndex.GridIndex.getGridIndexByGridId(gridId, mapSize));
        }
    }

    const destroyedTiles = battleInfo.destroyedTiles;
    for (const [, tile] of destroyedTiles) {
        tile.flushDataToView();
        gridVisualEffect?.showEffectExplosion(tile.getGridIndex());
    }

    const damagedTiles = battleInfo.damagedTiles;
    for (const [gridId, tile] of damagedTiles) {
        if (!destroyedTiles.has(gridId)) {
            tile.flushDataToView();
            gridVisualEffect?.showEffectDamage(tile.getGridIndex());
        }
    }

    if ((isVisibleUnitDestroyed) || (destroyedTiles.size)) {
        war.getView()?.showVibration();
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.Explode);
    } else {
        if ((isVisibleUnitDamaged) || (damagedTiles.size)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.Attack);
        }
    }
}

export function handlePostOperationPlunder(focusUnit: Units_Unit.Unit, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const gridIndex = focusUnit.getGridIndex();
    const war       = focusUnit.getWar();
    if (war.getUnitMap().getUnitOnMap(gridIndex) !== focusUnit) {
        return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    }

    const tile = war.getTileMap().getTile(gridIndex);
    if (tile.getUnfixedBuffList()?.some(v => v.getBuffTypeId() === TileBuffs_Constants.BuffTypeId.NoIncome)) {
        return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    }

    const focusUnitType             = focusUnit.getUnitTypeId();
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
    const getCoGridIndexArrayOnMap  = Helpers_Misc.createLazyFunc(() => focusPlayer.getCoGridIndexListOnMap());
    for (const skillId of focusPlayer.getCoCurrentSkills()) {
        const skillCfg = gameConfig.getCoSkillCfg(skillId)?.getInstantMisc()?.getSelfPostOperationPlunder();
        if (skillCfg == null) {
            continue;
        }

        const multiple = skillCfg.getMultiple();
        if (multiple <= 0) {
            continue;
        }

        if ((tileTeamIndex === Teams_Constants.TeamIndex.Neutral) && (!skillCfg.getCanPlunderNeutral())) {
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
            coSkillAreaType          : skillCfg.getCoSkillAreaTypeId(),
            coZoneRadius             : focusCoZoneRadius,
            getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
        }))) {
            continue;
        }

        focusPlayer.setFund(Players_Utils_Common.getValidFund(focusPlayer.getFund() + tile.getIncomeForPlayer(tilePlayerIndex) * multiple));
        tile.addUnfixedBuff(TileBuff.fromJson({
            buffTypeId          : TileBuffs_Constants.BuffTypeId.NoIncome,
            expiringTurnIndex   : turnIndex + multiple,
            expiringPlayerIndex : focusPlayerIndex,
            extraParamArray     : [],
        }), !isFastExecute);

        return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation({ players : [focusPlayer], tiles : [tile] });
    }

    return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function postProcessInnerWarOperation({ war, allTileAppearanceInfosBeforeAction, visibilityArrayFromPathsBeforeAction, visibleThingsForEachTeamBeforeAction, changedThings, thingsForMovePath, createMessage }: {
    war                                     : SinglePlayerWars_War.War;
    allTileAppearanceInfosBeforeAction      : Map<Tiles_Tile.Tile, AuxiliaryTypes_TileAppearanceInfo.TileAppearanceInfo>;
    visibilityArrayFromPathsBeforeAction    : number[] | undefined;
    visibleThingsForEachTeamBeforeAction    : Map<number, AuxiliaryTypes_VisibleThings.VisibleThings>;
    changedThings                           : AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation;
    thingsForMovePath                       : AuxiliaryTypes_ThingsForMovePath.ThingsForMovePath | undefined;
    createMessage                           : MessageCreator;
}): Map<number, WoContainer> {
    const destroyedUnitIdArray                  = war.getUnitMap().getAllDestroyedUnitIdArray(changedThings.getUnits() ?? new Set());
    const currentVisibleThingsForEachTeam       = war.getVisibleThingsForEachTeam();
    const visibilityArrayFromPathsAfterAction   = visibilityArrayFromPathsBeforeAction != null
        ? getDifferencesForVisibilityArray(visibilityArrayFromPathsBeforeAction, war.getFogMap().getVisibilityArrayFromPaths(war.getPlayerInTurn().getPlayerIndex()))
        : undefined;
    const serializedVisibleTiles    = new Map<number, SerialTile>();
    const serializedInvisibleTiles  = new Map<number, SerialTile>();
    const serializedUnits           = new Map<number, SerialUnit>();
    const outerWarOpDict            = new Map<number, WoContainer>();   // teamIndex, warOp

    for (const teamIndex of war.getPlayerManager().getAllTeamIndexes(true)) {
        outerWarOpDict.set(
            teamIndex,
            generateOuterWarOperation({
                war                                  : war,
                teamIndexes                          : new Set([teamIndex]),
                allTileAppearanceInfosBeforeAction   : allTileAppearanceInfosBeforeAction,
                visibleThingsForEachTeamBeforeAction : visibleThingsForEachTeamBeforeAction,
                currentVisibleThingsForEachTeam      : currentVisibleThingsForEachTeam,
                affectedThings                       : changedThings,
                destroyedUnitIdArray                 : destroyedUnitIdArray,
                visibilityArrayFromPathsAfterAction  : visibilityArrayFromPathsAfterAction,
                thingsForMovePath                    : thingsForMovePath,
                serializedVisibleTiles               : serializedVisibleTiles,
                serializedInvisibleTiles             : serializedInvisibleTiles,
                serializedUnits                      : serializedUnits,
                createMessage                        : createMessage,
            }),
        );
    }

    return outerWarOpDict;
}

function generateOuterWarOperation({
    war,
    teamIndexes,
    allTileAppearanceInfosBeforeAction,
    visibleThingsForEachTeamBeforeAction,
    currentVisibleThingsForEachTeam,
    affectedThings,
    destroyedUnitIdArray,
    visibilityArrayFromPathsAfterAction,
    thingsForMovePath,
    serializedVisibleTiles,
    serializedInvisibleTiles,
    serializedUnits,
    createMessage,
}: {
    war                                     : SinglePlayerWars_War.War;
    teamIndexes                             : Set<number>;
    allTileAppearanceInfosBeforeAction      : Map<Tiles_Tile.Tile, AuxiliaryTypes_TileAppearanceInfo.TileAppearanceInfo>;
    visibleThingsForEachTeamBeforeAction    : Map<number, AuxiliaryTypes_VisibleThings.VisibleThings>;
    currentVisibleThingsForEachTeam         : Map<number, AuxiliaryTypes_VisibleThings.VisibleThings>;
    affectedThings                          : AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation;
    destroyedUnitIdArray                    : number[];
    visibilityArrayFromPathsAfterAction     : number[] | undefined;
    thingsForMovePath                       : AuxiliaryTypes_ThingsForMovePath.ThingsForMovePath | undefined;
    serializedVisibleTiles                  : Map<number, SerialTile>;
    serializedInvisibleTiles                : Map<number, SerialTile>;
    serializedUnits                         : Map<number, SerialUnit>;
    createMessage                           : MessageCreator;
}): WoContainer {
    const visibleTilesToSend            = new Set<Tiles_Tile.Tile>();
    const invisibleTilesToSend          = new Set<Tiles_Tile.Tile>();
    const unitsToSend                   = new Set<Units_Unit.Unit>();
    const visibleUnitIdSetBeforeAction  = new Set<number>();
    const visibleUnitIdSetAfterAction   = new Set<number>();
    const rawMovingUnitAndPath          = thingsForMovePath != null ? AuxiliaryTypes_RawMovingUnitAndPath.RawMovingUnitAndPath.create(thingsForMovePath.getFocusUnitDataBeforeAction(), thingsForMovePath.getRevisedPath()) : undefined;
    const rawDroppingUnitAndPathArray   = thingsForMovePath?.getRevisedDropInfo()?.map(v => AuxiliaryTypes_RawMovingUnitAndPath.RawMovingUnitAndPath.create2(v)) ?? [];
    const affectedTiles                 = affectedThings.getTiles();
    const affectedUnits                 = affectedThings.getUnits();
    for (const teamIndex of teamIndexes) {
        const visibleThingsBeforeAction = visibleThingsForEachTeamBeforeAction.get(teamIndex);
        const visibleThingsAfterAction  = currentVisibleThingsForEachTeam.get(teamIndex);
        {
            const previousVisibleTiles  = visibleThingsBeforeAction?.getTiles() ?? new Set();
            const currentVisibleTiles   = visibleThingsAfterAction?.getTiles() ?? new Set();
            if (affectedTiles != null) {
                for (const tile of affectedTiles) {
                    if (currentVisibleTiles.has(tile)) {
                        visibleTilesToSend.add(tile);
                    } else {
                        if ((previousVisibleTiles.has(tile))                                    ||
                            (!allTileAppearanceInfosBeforeAction.get(tile)?.checkIsSame(tile))
                        ) {
                            invisibleTilesToSend.add(tile);
                        }
                    }
                }
            }
            for (const tile of currentVisibleTiles) {
                if (!previousVisibleTiles.has(tile)) {
                    visibleTilesToSend.add(tile);
                }
            }
        }

        {
            const previousVisibleUnits = visibleThingsBeforeAction?.getUnits() ?? new Set();
            for (const unit of visibleThingsAfterAction?.getUnits() ?? new Set()) {
                visibleUnitIdSetAfterAction.add(unit.getUnitId());
                if ((affectedUnits?.has(unit) === true) || (!previousVisibleUnits.has(unit))) {
                    unitsToSend.add(unit);
                }
            }
            for (const unit of previousVisibleUnits) {
                visibleUnitIdSetBeforeAction.add(unit.getUnitId());
            }
        }

        if (thingsForMovePath != null) {
            const visibilityMap                         = visibleThingsBeforeAction?.getVisibilityMap();
            const unitGridIdsForEachTeamBeforeAction    = thingsForMovePath.getUnitGridIdsForEachTeamBeforeAction();
            rawMovingUnitAndPath?.updatePathToSend(
                war,
                teamIndex,
                unitGridIdsForEachTeamBeforeAction,
                visibilityMap,
            );
            for (const unitAndPath of rawDroppingUnitAndPathArray) {
                unitAndPath.updatePathToSend(
                    war,
                    teamIndex,
                    unitGridIdsForEachTeamBeforeAction,
                    visibilityMap,
                );
            }
        }
    }

    const mapSize               = war.getTileMap().getMapSize();
    const tileArrayAfterAction  : SerialTile[] = [];
    for (const tile of visibleTilesToSend) {
        const gridId = tile.getGridIndex().getGridId(mapSize);
        if (!serializedVisibleTiles.has(gridId)) {
            serializedVisibleTiles.set(gridId, tile.serialize());
        }
        tileArrayAfterAction.push(serializedVisibleTiles.get(gridId)!);
    }
    for (const tile of invisibleTilesToSend) {
        if (visibleTilesToSend.has(tile)) {
            continue;
        }

        const gridId = tile.getGridIndex().getGridId(mapSize);
        if (!serializedInvisibleTiles.has(gridId)) {
            serializedInvisibleTiles.set(gridId, tile.serializeAsInvisible());
        }
        tileArrayAfterAction.push(serializedInvisibleTiles.get(gridId)!);
    }

    const unitArrayAfterAction : SerialUnit[] = [];
    for (const unit of unitsToSend) {
        const unitId = unit.getUnitId();
        if (!serializedUnits.has(unitId)) {
            serializedUnits.set(unitId, unit.serialize());
        }
        unitArrayAfterAction.push(serializedUnits.get(unitId)!);
    }

    const hiddenUnitIdSet = new Set(visibleUnitIdSetBeforeAction);
    for (const unitId of visibleUnitIdSetAfterAction) {
        hiddenUnitIdSet.delete(unitId);
    }
    for (const unitId of destroyedUnitIdArray) {
        hiddenUnitIdSet.delete(unitId);
    }

    const commonExtraData = CommonExtraDataForWarOperation.fromJson({
        nextUnitId                            : war.getUnitMap().getNextUnitId(),
        movingUnitAndPath                     : rawMovingUnitAndPath?.createFinalMovingUnitAndPath()?.toJson(),
        weatherManager                        : affectedThings.getWeatherManager()?.toJson(),
        forceFog                              : affectedThings.getForceFog()?.toJson(),
        playerArrayAfterAction                : [...affectedThings.getPlayers() ?? new Set()].map(v => v.serializeForTeamIndexes(teamIndexes).toJson()),
        unitArrayAfterAction                  : unitArrayAfterAction.map(v => v.toJson()),
        destroyedUnitIdArray                  : destroyedUnitIdArray,
        tileArrayAfterAction                  : tileArrayAfterAction.map(v => v.toJson()),
        visibilityArrayFromPathsAfterWarEvent : [],
        visibilityArrayFromPathsAfterAction   : teamIndexes.has(war.getPlayerInTurn().getTeamIndex()) ? visibilityArrayFromPathsAfterAction ?? [] : [],
        hiddenUnitIdArray                     : [...hiddenUnitIdSet],
        customCounterArray                    : affectedThings.getCustomCounters().map(v => v.toJson()),
        taskObjectiveStateArray               : affectedThings.getTaskObjectiveStates().map(v => v.toJson()),
    });
    {
        const affectedUnitMovePathVisibilityDictForWarEvent = affectedThings.getUnitMovePathVisibilityDictForWarEvent();
        if (affectedUnitMovePathVisibilityDictForWarEvent != null) {
            const playerManager = war.getPlayerManager();
            for (const [key, visibility] of affectedUnitMovePathVisibilityDictForWarEvent) {
                if (teamIndexes.has(playerManager.getPlayer(key % 100).getTeamIndex())) {
                    commonExtraData.getVisibilityArrayFromPathsAfterWarEvent().push((key * 10) + visibility);
                }
            }
        }
    }

    const droppingMovingUnitAndPathList: MovingUnitAndPath[] = [];
    for (const v of rawDroppingUnitAndPathArray) {
        const movingUnitAndPath = v.createFinalMovingUnitAndPath();
        if (movingUnitAndPath != null) {
            droppingMovingUnitAndPathList.push(movingUnitAndPath);
        }
    }
    return createMessage(commonExtraData, droppingMovingUnitAndPathList);
}

function getDifferencesForVisibilityArray(arrayBeforeAction: number[], arrayAfterAction: number[]): number[] {
    const differences: number[] = [];
    for (let i = arrayAfterAction.length - 1; i >= 0; --i) {
        const valueAfterAction = arrayAfterAction[i];
        if (arrayBeforeAction[i] != valueAfterAction) {
            differences.push(valueAfterAction);
        }
    }
    return differences;
}
