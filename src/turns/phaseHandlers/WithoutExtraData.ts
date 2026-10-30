import {
    AuxiliaryTypes_AttackableArea,
    CoSkills_Constants,
    Destructions_Utils,
    AuxiliaryTypes_GridIndex,
    BootTimers_Constants,
    ReplayWar_Model_RwWarBase,
    type BaseWar_Interface_IBwWar,
    Units_Constants,
    Players_Constants,
    UnitBuffs_Constants,
    Utils_ClientErrorCode,
    Helpers_Misc,
    Helpers_Team,
    Visibilities_Utils,
    Timer_TimerModel,
    Players_Utils_Common,
    Numbers_Utils,
    Turns_Constants,
    Tiles_Constants_MapWeapon,
    type Tiles_ITile,
    type Turns_ITurnManager,
    type Units_IUnit,
} from "../../internal.ts";

import { WsUnitStatistics } from "../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

export async function endPhaseStandby(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): Promise<void> {
    const phaseCode = turnManager.getPhaseCode();
    if (phaseCode !== Turns_Constants.PhaseCode.WaitBeginTurn) {
        throw Helpers_Misc.newError(`Invalid phaseCode: ${phaseCode}`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithoutExtraData_00);
    }

    runPhaseResetHasUnitOnBeginningTurn(turnManager, isFastExecute);
    runPhaseHandleUnitBuffEffect(turnManager, isFastExecute);
    runPhaseGetFund(turnManager, isFastExecute);
    runPhaseConsumeFuel(turnManager, isFastExecute);
    runPhaseRecoverUnitByCo(turnManager, isFastExecute, CoSkills_Constants.AutoRecoveryTimingId.BeforeRegularRepair);
    runPhaseRepairUnitByTile(turnManager, isFastExecute);
    runPhaseDestroyUnitsOutOfFuel(turnManager, isFastExecute);
    runPhaseRepairUnitByUnit(turnManager, isFastExecute);
    runPhaseRecoverUnitByCo(turnManager, isFastExecute, CoSkills_Constants.AutoRecoveryTimingId.AfterRegularRepair);
    await runPhaseActivateMapWeapon(turnManager, isFastExecute);
    runPhaseCheckAndUpdateUnitAiMode(turnManager, isFastExecute);
    runPhaseMain(turnManager, isFastExecute);

    turnManager.setPhaseCode(Turns_Constants.PhaseCode.Main);
}

export function endPhaseMain(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): void {
    const phaseCode = turnManager.getPhaseCode();
    if (phaseCode !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid phaseCode: ${phaseCode}`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseMainWithoutExtraData_00);
    }

    runPhaseRecoverUnitByCo(turnManager, isFastExecute, CoSkills_Constants.AutoRecoveryTimingId.BeforeEndTurn);
    runPhaseResetUnitState(turnManager, isFastExecute);
    runPhaseResetVisionForCurrentPlayer(turnManager, isFastExecute);
    runPhaseHandleUnitBuffEffect2(turnManager, isFastExecute);
    runPhaseTickTurnAndPlayerIndex(turnManager, isFastExecute);
    runPhaseResetSkillState(turnManager, isFastExecute);
    runPhaseResetVotesForDraw(turnManager, isFastExecute);
    runPhaseUpdateWeatherAndForceFog(turnManager, isFastExecute);
    runPhaseUpdateAllTileBuffArray(turnManager, isFastExecute);
    runPhaseUpdateAllUnitBuffArray(turnManager, isFastExecute);
    runPhaseResetVisionForNextPlayer(turnManager, isFastExecute);
    runPhaseWaitBeginTurn(turnManager, isFastExecute);

    turnManager.setPhaseCode(Turns_Constants.PhaseCode.WaitBeginTurn);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetHasUnitOnBeginningTurn(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): void {
    turnManager.setHasUnitOnBeginningTurn(turnManager.getWar().getUnitMap().checkHasUnitForPlayer(turnManager.getPlayerIndexInTurn()));
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseHandleUnitBuffEffect(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): void {
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const war           = turnManager.getWar();
    const unitMap       = war.getUnitMap();
    const units         = unitMap.getAllUnits().filter(v => v.getPlayerIndex() === playerIndex).sort((v1, v2) => v1.getUnitId() - v2.getUnitId());
    for (const unit of units) {
        const gridIndex = unit.getGridIndex();
        const unitId    = unit.getUnitId();
        if (unitMap.getUnit(gridIndex, unitId) == null) {
            continue;
        }

        let isModified = false;
        for (const buff of unit.getBuffList()) {
            const buffTypeId = buff.getBuffTypeId();
            if (buffTypeId === UnitBuffs_Constants.BuffTypeId.Fire) {
                isModified = true;

                const newHp = unit.getCurrentHp() - 10;
                if (newHp > 0) {
                    unit.setCurrentHp(newHp);
                } else {
                    if (unit.getLoaderUnitId() != null) {
                        Destructions_Utils.destroyUnitLoaded(war, unitId);
                    } else {
                        Destructions_Utils.destroyUnitOnMap(war, gridIndex, !isFastExecute);
                    }
                    break;
                }
            }
        }

        if ((isModified) && (!isFastExecute) && (unitMap.getUnit(gridIndex, unitId))) {
            unit.updateView();
        }
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseGetFund(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): void {
    const war           = turnManager.getWar();
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const player        = war.getPlayer(playerIndex);
    const currentFund   = player.getFund();
    let totalIncome     = war.getTileMap().getTotalIncomeForPlayer(playerIndex);
    if (turnManager.getTurnIndex() === Turns_Constants.TurnIndex.FirstIndex) {
        totalIncome += war.getCommonSettingManager().getPlayerRule(playerIndex).getInitialFund();
    }

    player.setFund(currentFund + totalIncome);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseConsumeFuel(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): void {
    const playerIndex = turnManager.getPlayerIndexInTurn();
    const turnIndex = turnManager.getTurnIndex();
    const war = turnManager.getWar();
    if (turnIndex > Turns_Constants.TurnIndex.FirstIndex) {
        for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
            if (unit.getPlayerIndex() === playerIndex) {
                const currentFuel = unit.getCurrentFuel();
                const consumption = unit.getFuelConsumptionPerTurn();
                unit.setCurrentFuel(Math.max(0, currentFuel - consumption));
            }
        }
    }
}
function runPhaseRecoverUnitByCo(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean, timing: number): void {
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const war           = turnManager.getWar();
    const player        = war.getPlayer(playerIndex);
    if (player.getCoId()) {
        const gameConfig                = war.getGcData();
        const coZoneRadius              = player.getCoZoneRadius();
        const unitMap                   = war.getUnitMap();
        const tileMap                   = war.getTileMap();
        const gridVisionEffect          = war.getGridVisualEffect();
        const warStatisticsManager      = war.getWarStatisticsManager();
        const getCoGridIndexArrayOnMap  = Helpers_Misc.createLazyFunc(() => player.getCoGridIndexListOnMap());
        const visibleUnits              = ((war instanceof ReplayWar_Model_RwWarBase.RwWarBase) && (war.getIsBatchExecuteAction()))
            ? null
            : Visibilities_Utils.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getWatcherTeamIndexesForSelf());
        for (const skillId of player.getCoCurrentSkills() || []) {
            const skillCfg = gameConfig.getCoSkillCfg(skillId);

            {
                const recoverCfg = skillCfg?.getInstantPeriodic()?.getSelfHpRecovery();
                if ((recoverCfg) && ((recoverCfg.getTiming()) === timing)) {
                    const loadedState       = recoverCfg.getUnitLoadedStateId();
                    const unitActionStateId = recoverCfg.getUnitActionStateId();
                    const tileCategoryId    = recoverCfg.getTileCategoryId();
                    const conNeedOwnTile    = recoverCfg.getConNeedOwnTile();
                    const targetUnits       : Units_IUnit.IUnit[] = [];
                    for (const unit of unitMap.getAllUnits()) {
                        const unitType      = unit.getUnitType();
                        const unitGridIndex = unit.getGridIndex();
                        if ((unit.getPlayerIndex() !== playerIndex)                                                 ||
                            (!gameConfig.checkIsUnitTypeInCategory(unitType, recoverCfg.getUnitCategoryId()))  ||
                            (!unit.checkIsMeetLoadedState(loadedState))                                             ||
                            ((unitActionStateId != null) && (unit.getActionState() !== unitActionStateId))          ||
                            (!unitGridIndex.checkIsInsideCoSkillArea({
                                coSkillAreaType             : recoverCfg.getCoSkillAreaTypeId(),
                                coZoneRadius                : coZoneRadius,
                                getCoGridIndexArrayOnMap    : getCoGridIndexArrayOnMap,
                            }))
                        ) {
                            continue;
                        }

                        const tile = tileMap.getTile(unit.getGridIndex());
                        if (((conNeedOwnTile != null) && ((tile.getPlayerIndex() == playerIndex) != conNeedOwnTile))                    ||
                            ((tileCategoryId != null) && (!gameConfig.checkIsTileTypeInCategory(tile.getTileTypeId(), tileCategoryId)))
                        ) {
                            continue;
                        }

                        targetUnits.push(unit);
                    }

                    const recoverAmount         = recoverCfg.getHpGain();
                    const recoverCostModifier   = (recoverCfg.getCostMultiplierPct()) / 100;
                    for (const unit of targetUnits.sort(sorterForRepairUnits)) {
                        const normalizedMaxHp       = unit.getNormalizedMaxHp();
                        const normalizedCurrentHp   = unit.getNormalizedCurrentHp();
                        const currentFund           = player.getFund();
                        const revisedProductionCost = unit.getProductionFinalCost() * recoverCostModifier;
                        const currentHp             = unit.getCurrentHp();
                        const normalizedRepairHp    = revisedProductionCost <= 0
                            ? Math.min(
                                normalizedMaxHp - normalizedCurrentHp,
                                recoverAmount,
                            )
                            : Math.min(
                                normalizedMaxHp - normalizedCurrentHp,
                                recoverAmount,
                                Math.floor(currentFund * normalizedMaxHp / revisedProductionCost)
                            );
                        const repairAmount = (normalizedRepairHp + normalizedCurrentHp) * Units_Constants.Hp.Normalizer - currentHp;

                        if (repairAmount > 0) {
                            unit.addCurrentHp(repairAmount);
                            player.setFund(Players_Utils_Common.getValidFund(currentFund - Math.floor(normalizedRepairHp * revisedProductionCost / normalizedMaxHp)));

                            {
                                const offsetNormalizedHp = unit.getNormalizedCurrentHp() - normalizedCurrentHp;
                                if (offsetNormalizedHp !== 0) {
                                    const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex: unit.getGridIndex() });
                                    if (observerTeamIndexes != null) {
                                        warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                            unitType                    : unit.getUnitType(),
                                            dstPlayerIndex              : playerIndex,
                                            unitGain                    : 0,
                                            unitLoss                    : 0,
                                            normalizedHpGain            : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                                            normalizedHpLoss            : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                                            groupedObserverTeamIndexes  : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                                        }));
                                    }
                                }
                            }

                            if ((!isFastExecute) && (visibleUnits?.has(unit))) {
                                gridVisionEffect.showEffectRepair(unit.getGridIndex());
                            }
                        }
                    }
                }
            }

            {
                const recoverCfg = skillCfg?.getInstantPeriodic()?.getSelfFuelRecovery();
                if ((recoverCfg) && ((recoverCfg.getTiming()) === timing)) {
                    const loadedState   = recoverCfg.getUnitLoadedStateId();
                    for (const unit of unitMap.getAllUnits()) {
                        const unitType      = unit.getUnitType();
                        const unitGridIndex = unit.getGridIndex();
                        if ((unit.getPlayerIndex() === playerIndex)                                                 &&
                            (gameConfig.checkIsUnitTypeInCategory(unitType, recoverCfg.getUnitCategoryId()))   &&
                            (unit.checkIsMeetLoadedState(loadedState))                                              &&
                            (unitGridIndex.checkIsInsideCoSkillArea({
                                coSkillAreaType             : recoverCfg.getCoSkillAreaTypeId(),
                                coZoneRadius                : coZoneRadius,
                                getCoGridIndexArrayOnMap    : getCoGridIndexArrayOnMap,
                            }))
                        ) {
                            const maxFuel       = unit.getMaxFuel();
                            const currentFuel   = unit.getCurrentFuel();
                            const offsetFuel    = Math.min(Math.floor(maxFuel * (recoverCfg.getFuelGainPct()) / 100), maxFuel - currentFuel);
                            unit.addCurrentFuel(offsetFuel);

                            if ((!isFastExecute) && (visibleUnits?.has(unit))) {
                                if (offsetFuel > 0) {
                                    gridVisionEffect.showEffectSupply(unitGridIndex);
                                }
                            }
                        }
                    }
                }
            }

            {
                const recoverCfg = skillCfg?.getInstantPeriodic()?.getSelfPrimaryAmmoRecovery();
                if ((recoverCfg) && ((recoverCfg.getTiming()) === timing)) {
                    const loadedState   = recoverCfg.getUnitLoadedStateId();
                    for (const unit of unitMap.getAllUnits()) {
                        const unitType      = unit.getUnitType();
                        const unitGridIndex = unit.getGridIndex();
                        if ((unit.getPlayerIndex() === playerIndex)                                                 &&
                            (gameConfig.checkIsUnitTypeInCategory(unitType, recoverCfg.getUnitCategoryId()))   &&
                            (unit.checkIsMeetLoadedState(loadedState))                                              &&
                            (unitGridIndex.checkIsInsideCoSkillArea({
                                coSkillAreaType             : recoverCfg.getCoSkillAreaTypeId(),
                                coZoneRadius                : coZoneRadius,
                                getCoGridIndexArrayOnMap    : getCoGridIndexArrayOnMap,
                            }))
                        ) {
                            const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                            if (maxAmmo) {
                                const currentAmmo               = unit.getPrimaryWeaponCurrentAmmo();
                                const offsetPrimaryWeaponAmmo   = Math.min(Math.floor(maxAmmo * (recoverCfg.getAmmoGainPct()) / 100), maxAmmo - currentAmmo);
                                unit.addAndValidatePrimaryWeaponCurrentAmmo(offsetPrimaryWeaponAmmo);

                                if ((!isFastExecute) && (visibleUnits?.has(unit))) {
                                    if (offsetPrimaryWeaponAmmo > 0) {
                                        gridVisionEffect.showEffectSupply(unitGridIndex);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
function runPhaseRepairUnitByTile(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): void {
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const war           = turnManager.getWar();
    const player        = war.getPlayer(playerIndex);
    const allUnitsOnMap : Units_IUnit.IUnit[] = [];
    for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
        (unit.getPlayerIndex() === playerIndex) && (allUnitsOnMap.push(unit));
    }

    const tileMap               = war.getTileMap();
    const warStatisticsManager  = war.getWarStatisticsManager();
    const gridVisionEffect      = war.getGridVisualEffect();
    const visibleUnits          = ((war instanceof ReplayWar_Model_RwWarBase.RwWarBase) && (war.getIsBatchExecuteAction()))
        ? null
        : Visibilities_Utils.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getWatcherTeamIndexesForSelf());
    for (const unit of allUnitsOnMap.sort(sorterForRepairUnits)) {
        const gridIndex     = unit.getGridIndex();
        const tile          = tileMap.getTile(gridIndex);
        const repairData    = tile.getRepairHpAndCostForUnit(unit);
        if (repairData) {
            const fund                      = player.getFund();
            const offsetHp                  = repairData.hp;
            const offsetFuel                = unit.getUsedFuel();
            const offsetPrimaryWeaponAmmo   = unit.getPrimaryWeaponUsedAmmo() ?? 0;
            const offsetFlareAmmo           = unit.getFlareUsedAmmo() ?? 0;
            const oldNormalizedHp           = unit.getNormalizedCurrentHp();
            unit.addCurrentHp(offsetHp);
            unit.addCurrentFuel(offsetFuel);
            unit.addAndValidatePrimaryWeaponCurrentAmmo(offsetPrimaryWeaponAmmo);
            unit.addFlareCurrentAmmo(offsetFlareAmmo);

            player.setFund(fund - repairData.cost);

            {
                const offsetNormalizedHp = unit.getNormalizedCurrentHp() - oldNormalizedHp;
                if (offsetNormalizedHp != 0) {
                    const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex });
                    if (observerTeamIndexes != null) {
                        warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                            unitType                    : unit.getUnitType(),
                            dstPlayerIndex              : playerIndex,
                            unitGain                    : 0,
                            unitLoss                    : 0,
                            normalizedHpGain            : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                            normalizedHpLoss            : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                            groupedObserverTeamIndexes  : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                        }));
                    }
                }
            }

            if ((!isFastExecute) && (visibleUnits?.has(unit))) {
                if (offsetHp) {
                    gridVisionEffect.showEffectRepair(gridIndex);
                } else if ((offsetFlareAmmo) || (offsetFuel) || (offsetPrimaryWeaponAmmo)) {
                    gridVisionEffect.showEffectSupply(gridIndex);
                }
                unit.updateView();
            }
        }
    }
}
function runPhaseDestroyUnitsOutOfFuel(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): void {
    const playerIndex           = turnManager.getPlayerIndexInTurn();
    const war                   = turnManager.getWar();
    const fogMap                = war.getFogMap();
    const isPathVisionEnabled   = war.getGcData().getSystemCfg().getIsPathVisionEnabled();

    for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
        if ((unit.checkIsDestroyedOnOutOfFuel())    &&
            (unit.getCurrentFuel() <= 0)            &&
            (unit.getPlayerIndex() === playerIndex)
        ) {
            const gridIndex = unit.getGridIndex();
            if (isPathVisionEnabled) {
                fogMap.updateMapFromPathsByUnitAndPath({
                    unit            : unit,
                    unitVisionInfo  : unit.getVisionInfo(),
                    path            : [gridIndex],
                });
            }

            Destructions_Utils.destroyUnitOnMap(war, gridIndex, !isFastExecute);
        }
    }
}
function runPhaseRepairUnitByUnit(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): void {
    const playerIndex       = turnManager.getPlayerIndexInTurn();
    const war               = turnManager.getWar();
    const player            = war.getPlayer(playerIndex);
    const unitMap           = war.getUnitMap();
    const mapSize           = unitMap.getMapSize();
    const gridVisionEffect  = war.getGridVisualEffect();
    const visibleUnits      = ((war instanceof ReplayWar_Model_RwWarBase.RwWarBase) && (war.getIsBatchExecuteAction()))
        ? null
        : Visibilities_Utils.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getWatcherTeamIndexesForSelf());
    const allUnitsLoaded    : Units_IUnit.IUnit[] = [];
    for (const unit of unitMap.getAllUnitsLoaded()) {
        (unit.getPlayerIndex() === playerIndex) && (allUnitsLoaded.push(unit));
    }

    const warStatisticsManager = war.getWarStatisticsManager();
    for (const unit of allUnitsLoaded.sort(sorterForRepairUnits)) {
        const loader        = Helpers_Misc.getExisted(unit.getLoaderUnit(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_RunPhaseRepairUnitByUnitWithoutExtraData_00);
        const gridIndex     = loader.getGridIndex();
        const repairData    = loader.getRepairHpAndCostForLoadedUnit(unit);
        if (repairData) {
            const offsetHp                  = repairData.hp;
            const offsetFuel                = unit.getUsedFuel();
            const offsetPrimaryWeaponAmmo   = unit.getPrimaryWeaponUsedAmmo() ?? 0;
            const offsetFlareAmmo           = unit.getFlareUsedAmmo() ?? 0;
            const oldNormalizedHp           = unit.getNormalizedCurrentHp();
            unit.addCurrentHp(offsetHp);
            unit.addCurrentFuel(offsetFuel);
            unit.addAndValidatePrimaryWeaponCurrentAmmo(offsetPrimaryWeaponAmmo);
            unit.addFlareCurrentAmmo(offsetFlareAmmo);

            player.setFund(player.getFund() - repairData.cost);

            {
                const offsetNormalizedHp = unit.getNormalizedCurrentHp() - oldNormalizedHp;
                if (offsetNormalizedHp !== 0) {
                    const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex });
                    if (observerTeamIndexes != null) {
                        warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                            unitType                    : unit.getUnitType(),
                            dstPlayerIndex              : playerIndex,
                            unitGain                    : 0,
                            unitLoss                    : 0,
                            normalizedHpGain            : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                            normalizedHpLoss            : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                            groupedObserverTeamIndexes  : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                        }));
                    }
                }
            }

            if ((!isFastExecute) && (visibleUnits?.has(loader))) {
                if (offsetHp) {
                    gridVisionEffect.showEffectRepair(gridIndex);
                } else if ((offsetFlareAmmo) || (offsetFuel) || (offsetPrimaryWeaponAmmo)) {
                    gridVisionEffect.showEffectSupply(gridIndex);
                }
            }

        } else if (loader.checkCanSupplyLoadedUnit()) {
            const offsetFuel                = unit.getUsedFuel();
            const offsetPrimaryWeaponAmmo   = unit.getPrimaryWeaponUsedAmmo() ?? 0;
            const offsetFlareAmmo           = unit.getFlareUsedAmmo() ?? 0;
            unit.addCurrentFuel(offsetFuel);
            unit.addAndValidatePrimaryWeaponCurrentAmmo(offsetPrimaryWeaponAmmo);
            unit.addFlareCurrentAmmo(offsetFlareAmmo);

            if ((!isFastExecute) && (visibleUnits?.has(loader))) {
                if ((offsetFlareAmmo) || (offsetFuel) || (offsetPrimaryWeaponAmmo)) {
                    gridVisionEffect.showEffectSupply(gridIndex);
                }
            }
        }
    }

    const suppliedUnitIds = new Set<number>();
    for (const supplier of unitMap.getAllUnitsOnMap()) {
        if ((supplier.getPlayerIndex() === playerIndex) && (supplier.checkIsAdjacentUnitSupplier())) {
            const supplierGridIndex = supplier.getGridIndex();
            for (const gridIndex of supplierGridIndex.getAdjacentGrids(mapSize)) {
                const unit      = unitMap.getUnitOnMap(gridIndex);
                const unitId    = unit ? unit.getUnitId() : null;
                if ((unitId != null) && (unit) && (!suppliedUnitIds.has(unitId)) && (supplier.checkCanSupplyAdjacentUnit(unit))) {
                    const offsetFuel                = unit.getUsedFuel();
                    const offsetPrimaryWeaponAmmo   = unit.getPrimaryWeaponUsedAmmo() ?? 0;
                    const offsetFlareAmmo           = unit.getFlareUsedAmmo() ?? 0;
                    unit.addCurrentFuel(offsetFuel);
                    unit.addAndValidatePrimaryWeaponCurrentAmmo(offsetPrimaryWeaponAmmo);
                    unit.addFlareCurrentAmmo(offsetFlareAmmo);

                    suppliedUnitIds.add(unitId);

                    if ((!isFastExecute) && (visibleUnits?.has(unit))) {
                        if ((offsetFlareAmmo) || (offsetFuel) || (offsetPrimaryWeaponAmmo)) {
                            gridVisionEffect.showEffectSupply(gridIndex);
                        }
                    }
                }
            }
        }
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function runPhaseActivateMapWeapon(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): Promise<void> {
    const war               = turnManager.getWar();
    const playerIndex       = war.getPlayerIndexInTurn();
    const tileMap           = war.getTileMap();
    const mapSize           = tileMap.getMapSize();
    const allTileArray      = tileMap.getAllTiles().filter(v => v.getPlayerIndex() === playerIndex);

    {
        const crystalArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.Crystal)
            .sort((v1, v2) => v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize));
        for (const tile of crystalArray) {
            await handleMapWeaponTileCrystal(war, tile, isFastExecute);
        }
    }
    {
        const customCrystalArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.CustomCrystal)
            .sort((v1, v2) => {
                const priority1 = Helpers_Misc.getExisted(v1.getFinalCrystalData()).getPriority();
                const priority2 = Helpers_Misc.getExisted(v2.getFinalCrystalData()).getPriority();
                if (priority1 !== priority2) {
                    return priority2 - priority1;
                } else {
                    return v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize);
                }
            });
        for (const tile of customCrystalArray) {
            await handleMapWeaponTileCrystal(war, tile, isFastExecute);
        }
    }
    {
        const cannonArray = allTileArray.filter(v => v.checkIsNormalCannon())
            .sort((v1, v2) => v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize));
        for (const tile of cannonArray) {
            await handleMapWeaponTileCannon(war, tile, isFastExecute);
        }
    }
    {
        const customCannonArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.CustomCannon)
            .sort((v1, v2) => {
                const priority1 = Helpers_Misc.getExisted(v1.getFinalCannonData()).getPriority();
                const priority2 = Helpers_Misc.getExisted(v2.getFinalCannonData()).getPriority();
                if (priority1 !== priority2) {
                    return priority2 - priority1;
                } else {
                    return v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize);
                }
            });
        for (const tile of customCannonArray) {
            await handleMapWeaponTileCannon(war, tile, isFastExecute);
        }
    }
    {
        const laserTurretArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.LaserTurret)
            .sort((v1, v2) => v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize));
        for (const tile of laserTurretArray) {
            await handleMapWeaponTileLaserTurret(war, tile, isFastExecute);
        }
    }
    {
        const customLaserTurretArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)
            .sort((v1, v2) => {
                const priority1 = Helpers_Misc.getExisted(v1.getFinalLaserTurretData()).getPriority();
                const priority2 = Helpers_Misc.getExisted(v2.getFinalLaserTurretData()).getPriority();
                if (priority1 !== priority2) {
                    return priority2 - priority1;
                } else {
                    return v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize);
                }
            });
        for (const tile of customLaserTurretArray) {
            await handleMapWeaponTileLaserTurret(war, tile, isFastExecute);
        }
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseCheckAndUpdateUnitAiMode(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): void {
    const war           = turnManager.getWar();
    const playerInTurn  = war.getPlayerInTurn();
    if (playerInTurn.getUserId() == null) {
        const playerIndex = playerInTurn.getPlayerIndex();
        for (const unit of war.getUnitMap().getAllUnits()) {
            if (unit.getPlayerIndex() === playerIndex) {
                unit.checkAndUpdateAiMode();
            }
        }
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseMain(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): void {
    const war           = turnManager.getWar();
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const player        = war.getPlayer(playerIndex);
    const unitMap       = war.getUnitMap();
    const hasUnit       = unitMap.checkHasUnitForPlayer(playerIndex);
    if ((turnManager.getHasUnitOnBeginningTurn())                     &&
        (!hasUnit)
    ) {
        player.setAliveState(Players_Constants.AliveStateId.Dying);
    }

    if (hasUnit) {
        for (const unit of unitMap.getAllUnitsOnMap()) {
            (unit.getPlayerIndex() === playerIndex) && (unit.updateView());
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetUnitState(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): void {
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const war           = turnManager.getWar();
    for (const unit of war.getUnitMap().getAllUnits()) {
        if (unit.getPlayerIndex() === playerIndex) {
            unit.setActionState(Units_Constants.ActionStateId.Idle);
            unit.updateView();
        }
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetVisionForCurrentPlayer(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): void {
    const war = turnManager.getWar();
    war.getFogMap().resetMapFromPathsForPlayerWithEncodedData(war.getPlayerIndexInTurn());
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseHandleUnitBuffEffect2(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): void {
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const war           = turnManager.getWar();
    const unitMap       = war.getUnitMap();
    const units         = unitMap.getAllUnits().filter(v => v.getPlayerIndex() === playerIndex).sort((v1, v2) => v1.getUnitId() - v2.getUnitId());
    for (const unit of units) {
        const gridIndex = unit.getGridIndex();
        const unitId    = unit.getUnitId();
        if (unitMap.getUnit(gridIndex, unitId) == null) {
            continue;
        }

        let isModified = false;
        for (const buff of unit.getBuffList()) {
            const buffTypeId = buff.getBuffTypeId();
            if (buffTypeId === UnitBuffs_Constants.BuffTypeId.Disease) {
                isModified = true;

                const newHp = unit.getCurrentHp() - 10;
                if (newHp > 0) {
                    unit.setCurrentHp(newHp);
                } else {
                    if (unit.getLoaderUnitId() != null) {
                        Destructions_Utils.destroyUnitLoaded(war, unitId);
                    } else {
                        Destructions_Utils.destroyUnitOnMap(war, gridIndex, !isFastExecute);
                    }
                    break;
                }
            }
        }

        if ((isModified) && (!isFastExecute) && (unitMap.getUnit(gridIndex, unitId))) {
            unit.updateView();
        }
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseTickTurnAndPlayerIndex(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): void {
    const playerIndex       = turnManager.getPlayerIndexInTurn();
    const war               = turnManager.getWar();
    const currTime          = Timer_TimerModel.getServerTimestamp();
    const player            = war.getPlayer(playerIndex);
    const bootTimerParams   = war.getSettingsBootTimerParams();
    const timerType         : BootTimers_Constants.TimerTypeId = bootTimerParams[0];
    if (timerType === BootTimers_Constants.TimerTypeId.NoBoot) {
        player.setRestTimeToBoot(0);

    } else if (timerType === BootTimers_Constants.TimerTypeId.Regular) {
        player.setRestTimeToBoot(Helpers_Misc.getExisted(bootTimerParams[1], Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_RunPhaseTickTurnAndPlayerIndexWithoutExtraData_00));

    } else if (timerType === BootTimers_Constants.TimerTypeId.Incremental) {
        const oldRestTimeToBoot         = player.getRestTimeToBoot();
        const enterTurnTime             = turnManager.getEnterTurnTime();
        const incrementalTimePerUnit    = Helpers_Misc.getExisted(bootTimerParams[2], Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_RunPhaseTickTurnAndPlayerIndexWithoutExtraData_01);
        const incrementalTimePerTurn    = bootTimerParams[3] ?? 0;
        const restTimeToBoot            = Math.max(
            0,
            Math.min(
                BootTimers_Constants.Incremental.MaxLimit,
                oldRestTimeToBoot - (currTime - enterTurnTime) + incrementalTimePerUnit * war.getUnitMap().countAllUnitsForPlayer(playerIndex) + incrementalTimePerTurn,
            ),
        );
        player.setRestTimeToBoot(restTimeToBoot);

    } else {
        throw Helpers_Misc.newError(`Invalid timerType: ${timerType}`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_RunPhaseTickTurnAndPlayerIndexWithoutExtraData_02);
    }

    player.setIsSkipTurn(false);

    const info = turnManager.getNextTurnAndPlayerIndex();
    turnManager.setTurnIndex(info.turnIndex);
    turnManager.setPlayerIndexInTurn(info.playerIndex);
    turnManager.setEnterTurnTime(Timer_TimerModel.getServerTimestamp());
    war.getWarEventManager().updateWarEventCalledCountOnPlayerTurnSwitched();
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetSkillState(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): void {
    const war       = turnManager.getWar();
    const player    = war.getPlayerInTurn();
    player.setCoIsDestroyedInTurn(false);

    if (player.checkCoIsUsingActiveSkill()) {
        player.setCoUsingSkillType(CoSkills_Constants.SkillTypeId.Passive);
        war.getTileMap().getView().updateCoZone();
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetVotesForDraw(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): void {
    turnManager.getWar().getDrawVoteManager().handleTurnPhaseResetVotesForDraw();
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseUpdateWeatherAndForceFog(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): void {
    const war               = turnManager.getWar();
    const weatherManager    = war.getWeatherManager();
    weatherManager.updateOnPlayerTurnSwitched();
    war.getFogMap().updateOnPlayerTurnSwitched();

    if (!isFastExecute) {
        weatherManager.getView().resetView(false);
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseUpdateAllTileBuffArray(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): void {
    for (const tile of turnManager.getWar().getTileMap().getAllTiles()) {
        tile.updateUnfixedBuffArrayOnPlayerTurnSwitched(!isFastExecute);
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseUpdateAllUnitBuffArray(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): void {
    for (const unit of turnManager.getWar().getUnitMap().getAllUnits()) {
        unit.updateBuffArrayOnPlayerTurnSwitched(!isFastExecute);
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetVisionForNextPlayer(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): void {
    // if (!isFastExecute) {
    //     turnManager.getWar().updateTilesAndUnitsOnVisibilityChanged();
    // }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseWaitBeginTurn(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean): void {
    if (!isFastExecute) {
        turnManager.getWar().getTileMap().getView().resetMarkLayer();
    }
}

async function handleMapWeaponTileCrystal(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile, isFastExecute: boolean): Promise<void> {
    const gridVisualEffect  = war.getGridVisualEffect();
    const tileGridIndex     = tile.getGridIndex();
    if (!isFastExecute) {
        war.getView().moveGridToCenter(tileGridIndex);
        gridVisualEffect.showEffectCharge(tileGridIndex);
        await Timer_TimerModel.wait(400);
    }

    const unitMap           = war.getUnitMap();
    const playerIndexInTurn = tile.getPlayerIndex();
    const teamIndexInTurn   = tile.getTeamIndex();
    const data              = Helpers_Misc.getExisted(tile.getFinalCrystalData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_HandleMapWeaponTileCrystal_00);
    const affectedUnits     = new Set<Units_IUnit.IUnit>();
    const canAffectAlly     = data.getCanAffectAlly();
    const canAffectEnemy    = data.getCanAffectEnemy();
    const canAffectSelf     = data.getCanAffectSelf();

    {
        const deltaFund             = data.getOffsetFund();
        const deltaEnergyPercentage = data.getOffsetEnergyPercentage();
        if (deltaFund || deltaEnergyPercentage) {
            for (const player of war.getPlayerManager().getAllPlayers()) {
                const teamIndex = player.getTeamIndex();
                if (((canAffectSelf) && (player.getPlayerIndex() === playerIndexInTurn))    ||
                    ((canAffectAlly) && (teamIndex === teamIndexInTurn))                    ||
                    ((canAffectEnemy) && (teamIndex !== teamIndexInTurn))
                ) {
                    if (deltaFund) {
                        player.setFund(Math.max(0, player.getFund() + deltaFund));
                    }

                    if (deltaEnergyPercentage) {
                        if (deltaEnergyPercentage < 0) {
                            player.addAndValidateCoCurrentEnergy(player.getCoCurrentEnergy() * deltaEnergyPercentage / 100);
                        } else {
                            player.addAndValidateCoCurrentEnergy(player.getCoMaxEnergy() * deltaEnergyPercentage / 100);
                        }
                    }
                }
            }
        }
    }
    {
        const deltaHp                       = data.getOffsetHp();
        const deltaFuelPercentage           = data.getOffsetFuelPercentage();
        const deltaPrimaryAmmoPercentage    = data.getOffsetPrimaryAmmoPercentage();
        if (deltaHp || deltaFuelPercentage || deltaPrimaryAmmoPercentage) {
            const warStatisticsManager  = war.getWarStatisticsManager();
            const canBeFatal            = data.getCanBeFatal();
            for (const gridIndex of tile.getGridIndex().getGridsWithinDistance({ minDistance: 0, maxDistance: data.getRadius(), mapSize: unitMap.getMapSize() })) {
                const unit = unitMap.getUnitOnMap(gridIndex);
                if (unit == null) {
                    continue;
                }

                const unitTeamIndex = unit.getTeamIndex();
                if (((canAffectSelf) && (unit.getPlayerIndex() === playerIndexInTurn))    ||
                    ((canAffectAlly) && (unitTeamIndex === teamIndexInTurn))              ||
                    ((canAffectEnemy) && (unitTeamIndex !== teamIndexInTurn))
                ) {
                    if (deltaFuelPercentage) {
                        if (deltaFuelPercentage < 0) {
                            unit.setCurrentFuel(Math.max(
                                0,
                                Math.floor(unit.getCurrentFuel() * (100 + deltaFuelPercentage) / 100)
                            ));
                        } else {
                            const maxFuel = unit.getMaxFuel();
                            unit.setCurrentFuel(Math.min(
                                maxFuel,
                                Math.floor(unit.getCurrentFuel() + maxFuel * deltaFuelPercentage / 100)
                            ));
                        }
                    }

                    if (deltaPrimaryAmmoPercentage) {
                        const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                        if (maxAmmo != null) {
                            const currentAmmo = unit.getPrimaryWeaponCurrentAmmo();
                            if (deltaPrimaryAmmoPercentage < 0) {
                                unit.addAndValidatePrimaryWeaponCurrentAmmo(currentAmmo * deltaPrimaryAmmoPercentage / 100);
                            } else {
                                unit.addAndValidatePrimaryWeaponCurrentAmmo(maxAmmo * deltaPrimaryAmmoPercentage / 100);
                            }
                        }
                    }

                    if (deltaHp) {
                        const oldNormalizedHp       = unit.getNormalizedCurrentHp();
                        const warStatisticsUpdater  = () => {
                            const offsetNormalizedHp = unit.getNormalizedCurrentHp() - oldNormalizedHp;
                            if (offsetNormalizedHp != 0) {
                                const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex });
                                if (observerTeamIndexes != null) {
                                    warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                        unitType                    : unit.getUnitType(),
                                        dstPlayerIndex              : unit.getPlayerIndex(),
                                        unitGain                    : 0,
                                        unitLoss                    : 0,
                                        normalizedHpGain            : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                                        normalizedHpLoss            : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                                        groupedObserverTeamIndexes  : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                                    }));
                                }
                            }
                        };

                        if (deltaHp > 0) {
                            unit.setCurrentHp(Math.min(
                                unit.getMaxHp(),
                                (oldNormalizedHp + deltaHp) * Units_Constants.Hp.Normalizer)
                            );
                            warStatisticsUpdater();

                        } else {
                            const rawNewHp = unit.getCurrentHp() + deltaHp * Units_Constants.Hp.Normalizer;
                            if ((rawNewHp <= 0) && (canBeFatal)) {
                                Destructions_Utils.destroyUnitOnMap(war, gridIndex, !isFastExecute);
                            } else {
                                unit.setCurrentHp(Numbers_Utils.getValueInRange({
                                    rawValue    : rawNewHp,
                                    minValue    : 1,
                                    maxValue    : unit.getMaxHp(),
                                }));
                                warStatisticsUpdater();
                            }
                        }
                    }

                    affectedUnits.add(unit);
                }
            }
        }
    }

    if (!isFastExecute) {
        const mapSize           = war.getTileMap().getMapSize();
        const attackableArea    = AuxiliaryTypes_AttackableArea.AttackableArea.createForTile(tile, mapSize);
        const { width, height } = mapSize.getWH();
        for (let x = 0; x < width; ++x) {
            const column = attackableArea.getColumn(x);
            if (column == null) {
                continue;
            }

            for (let y = 0; y < height; ++y) {
                if (column[y]) {
                    gridVisualEffect.showEffectDamage(new AuxiliaryTypes_GridIndex.GridIndex(x, y));
                }
            }
        }
        await Timer_TimerModel.wait(200);

        for (const unit of affectedUnits) {
            unit.updateView();
        }
        await Timer_TimerModel.wait(400);
    }
}

async function handleMapWeaponTileCannon(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile, isFastExecute: boolean): Promise<void> {
    const gridVisualEffect  = war.getGridVisualEffect();
    const tileGridIndex     = tile.getGridIndex();
    if (!isFastExecute) {
        war.getView().moveGridToCenter(tileGridIndex);
        gridVisualEffect.showEffectCharge(tileGridIndex);
        await Timer_TimerModel.wait(400);
    }

    const warStatisticsManager          = war.getWarStatisticsManager();
    const data                          = Helpers_Misc.getExisted(tile.getFinalCannonData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_HandleMapWeaponTileCannon_00);
    const getCandidateUnitArray         = Helpers_Misc.createLazyFunc(() => generateCandidateUnitArrayForCannon(war, tile));
    const maxTargetCount                = data.getMaxTargetCount();
    const deltaHp                       = data.getOffsetHp();
    const deltaFuelPercentage           = data.getOffsetFuelPercentage();
    const deltaPrimaryAmmoPercentage    = data.getOffsetPrimaryAmmoPercentage();
    const canBeFatal                    = data.getCanBeFatal();
    const affectedUnits                 = new Set<Units_IUnit.IUnit>();
    for (let i = 0; i < maxTargetCount; ++i) {
        const unit = getCandidateUnitArray()[i];
        if (unit == null) {
            break;
        }

        if (deltaHp || deltaFuelPercentage || deltaPrimaryAmmoPercentage) {
            if (deltaFuelPercentage) {
                if (deltaFuelPercentage < 0) {
                    unit.setCurrentFuel(Math.max(
                        0,
                        Math.floor(unit.getCurrentFuel() * (100 + deltaFuelPercentage) / 100)
                    ));
                } else {
                    const maxFuel = unit.getMaxFuel();
                    unit.setCurrentFuel(Math.min(
                        maxFuel,
                        Math.floor(unit.getCurrentFuel() + maxFuel * deltaFuelPercentage / 100)
                    ));
                }
            }

            if (deltaPrimaryAmmoPercentage) {
                const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                if (maxAmmo != null) {
                    const currentAmmo = unit.getPrimaryWeaponCurrentAmmo();
                    if (deltaPrimaryAmmoPercentage < 0) {
                        unit.addAndValidatePrimaryWeaponCurrentAmmo(currentAmmo * deltaPrimaryAmmoPercentage / 100);
                    } else {
                        unit.addAndValidatePrimaryWeaponCurrentAmmo(maxAmmo * deltaPrimaryAmmoPercentage / 100);
                    }
                }
            }

            if (deltaHp) {
                const oldNormalizedHp       = unit.getNormalizedCurrentHp();
                const warStatisticsUpdater  = () => {
                    const offsetNormalizedHp = unit.getNormalizedCurrentHp() - oldNormalizedHp;
                    if (offsetNormalizedHp != 0) {
                        const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex: unit.getGridIndex() });
                        if (observerTeamIndexes != null) {
                            warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                unitType                    : unit.getUnitType(),
                                dstPlayerIndex              : unit.getPlayerIndex(),
                                unitGain                    : 0,
                                unitLoss                    : 0,
                                normalizedHpGain            : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                                normalizedHpLoss            : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                                groupedObserverTeamIndexes  : Helpers_Team.encodeTeamIndex(observerTeamIndexes)
                            }));
                        }
                    }
                };

                if (deltaHp > 0) {
                    unit.setCurrentHp(Math.min(
                        unit.getMaxHp(),
                        (oldNormalizedHp + deltaHp) * Units_Constants.Hp.Normalizer)
                    );
                    warStatisticsUpdater();

                } else {
                    const rawNewHp = unit.getCurrentHp() + deltaHp * Units_Constants.Hp.Normalizer;
                    if ((rawNewHp <= 0) && (canBeFatal)) {
                        Destructions_Utils.destroyUnitOnMap(war, unit.getGridIndex(), !isFastExecute);
                    } else {
                        unit.setCurrentHp(Numbers_Utils.getValueInRange({
                            rawValue    : rawNewHp,
                            minValue    : 1,
                            maxValue    : unit.getMaxHp(),
                        }));
                        warStatisticsUpdater();
                    }
                }
            }

            affectedUnits.add(unit);
        }
    }

    if (!isFastExecute) {
        if (affectedUnits.size) {
            for (const unit of affectedUnits) {
                gridVisualEffect.showEffectDamage(unit.getGridIndex());
            }
            await Timer_TimerModel.wait(200);

            for (const unit of affectedUnits) {
                unit.updateView();
            }
            await Timer_TimerModel.wait(400);
        }
    }
}
function generateCandidateUnitArrayForCannon(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): Units_IUnit.IUnit[] {
    const data              = Helpers_Misc.getExisted(tile.getFinalCannonData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_GenerateCandidateUnitArrayForCannon_00);
    const playerIndexInTurn = tile.getPlayerIndex();
    const teamIndexInTurn   = tile.getTeamIndex();
    const tileX             = tile.getGridX();
    const tileY             = tile.getGridY();
    const canAffectAlly     = data.getCanAffectAlly();
    const canAffectEnemy    = data.getCanAffectEnemy();
    const canAffectSelf     = data.getCanAffectSelf();
    const rangeForDown      = data.getRangeForDown();
    const rangeForUp        = data.getRangeForUp();
    const rangeForLeft      = data.getRangeForLeft();
    const rangeForRight     = data.getRangeForRight();

    const unitAndFinalCostArray: { unit: Units_IUnit.IUnit, cost: number }[] = [];
    for (const unit of [...Visibilities_Utils.getAllUnitsOnMapVisibleToTeams(war, new Set([teamIndexInTurn]))].filter(u => {
        const unitTeamIndex = u.getTeamIndex();
        if (((canAffectSelf) && (u.getPlayerIndex() === playerIndexInTurn))     ||
            ((canAffectAlly) && (unitTeamIndex === teamIndexInTurn))            ||
            ((canAffectEnemy) && (unitTeamIndex !== teamIndexInTurn))
        ) {
            const deltaX = u.getGridX() - tileX;
            const deltaY = u.getGridY() - tileY;
            return ((rangeForDown) && (Math.abs(deltaX) < Math.abs(deltaY)) && (deltaY > 0) && (deltaY <= rangeForDown))
                || ((rangeForUp) && (Math.abs(deltaX) < Math.abs(deltaY)) && (deltaY < 0) && (Math.abs(deltaY) <= rangeForUp))
                || ((rangeForLeft) && (Math.abs(deltaY) < Math.abs(deltaX)) && (deltaX < 0) && (Math.abs(deltaX) <= rangeForLeft))
                || ((rangeForRight) && (Math.abs(deltaY) < Math.abs(deltaX)) && (deltaX > 0) && (deltaX <= rangeForRight));
        } else {
            return false;
        }
    })) {
        unitAndFinalCostArray.push({
            unit,
            cost    : unit.getProductionFinalCost() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp(),
        });
    }
    unitAndFinalCostArray.sort((info1, info2) => {
        const cost1 = info1.cost;
        const cost2 = info2.cost;
        if (cost1 !== cost2) {
            return cost2 - cost1;
        } else {
            return info1.unit.getUnitId() - info2.unit.getUnitId();
        }
    });

    const candidateUnitArray: Units_IUnit.IUnit[] = [];
    for (const info of unitAndFinalCostArray) {
        candidateUnitArray.push(info.unit);
    }

    return candidateUnitArray;
}

async function handleMapWeaponTileLaserTurret(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile, isFastExecute: boolean): Promise<void> {
    const gridVisualEffect  = war.getGridVisualEffect();
    const tileGridIndex     = tile.getGridIndex();
    if (!isFastExecute) {
        war.getView().moveGridToCenter(tileGridIndex);
        gridVisualEffect.showEffectCharge(tileGridIndex);
        await Timer_TimerModel.wait(400);
    }

    const data                  = Helpers_Misc.getExisted(tile.getFinalLaserTurretData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_HandleMapWeaponTileLaserTurret_00);
    const candidateUnitArray    = generateCandidateUnitArrayForLaserTurret(war, tile);
    const affectedUnits         = new Set<Units_IUnit.IUnit>();
    {
        const deltaHp                       = data.getOffsetHp();
        const deltaFuelPercentage           = data.getOffsetFuelPercentage();
        const deltaPrimaryAmmoPercentage    = data.getOffsetPrimaryAmmoPercentage();
        if (deltaHp || deltaFuelPercentage || deltaPrimaryAmmoPercentage) {
            const warStatisticsManager  = war.getWarStatisticsManager();
            const canBeFatal            = data.getCanBeFatal();
            for (const unit of candidateUnitArray) {
                if (deltaFuelPercentage) {
                    if (deltaFuelPercentage < 0) {
                        unit.setCurrentFuel(Math.max(
                            0,
                            Math.floor(unit.getCurrentFuel() * (100 + deltaFuelPercentage) / 100)
                        ));
                    } else {
                        const maxFuel = unit.getMaxFuel();
                        unit.setCurrentFuel(Math.min(
                            maxFuel,
                            Math.floor(unit.getCurrentFuel() + maxFuel * deltaFuelPercentage / 100)
                        ));
                    }
                }

                if (deltaPrimaryAmmoPercentage) {
                    const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                    if (maxAmmo != null) {
                        const currentAmmo = unit.getPrimaryWeaponCurrentAmmo();
                        if (deltaPrimaryAmmoPercentage < 0) {
                            unit.addAndValidatePrimaryWeaponCurrentAmmo(currentAmmo * deltaPrimaryAmmoPercentage / 100);
                        } else {
                            unit.addAndValidatePrimaryWeaponCurrentAmmo(maxAmmo * deltaPrimaryAmmoPercentage / 100);
                        }
                    }
                }

                if (deltaHp) {
                    const oldNormalizedHp       = unit.getNormalizedCurrentHp();
                    const warStatisticsUpdater  = () => {
                        const offsetNormalizedHp = unit.getNormalizedCurrentHp() - oldNormalizedHp;
                        if (offsetNormalizedHp != 0) {
                            const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex: unit.getGridIndex() });
                            if (observerTeamIndexes != null) {
                                warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                    unitType                    : unit.getUnitType(),
                                    dstPlayerIndex              : unit.getPlayerIndex(),
                                    unitGain                    : 0,
                                    unitLoss                    : 0,
                                    normalizedHpGain            : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                                    normalizedHpLoss            : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                                    groupedObserverTeamIndexes  : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                                }));
                            }
                        }
                    };

                    if (deltaHp > 0) {
                        unit.setCurrentHp(Math.min(
                            unit.getMaxHp(),
                            (oldNormalizedHp + deltaHp) * Units_Constants.Hp.Normalizer)
                        );
                        warStatisticsUpdater();

                    } else {
                        const rawNewHp = unit.getCurrentHp() + deltaHp * Units_Constants.Hp.Normalizer;
                        if ((rawNewHp <= 0) && (canBeFatal)) {
                            Destructions_Utils.destroyUnitOnMap(war, unit.getGridIndex(), !isFastExecute);
                        } else {
                            unit.setCurrentHp(Numbers_Utils.getValueInRange({
                                rawValue    : rawNewHp,
                                minValue    : 1,
                                maxValue    : unit.getMaxHp(),
                            }));
                            warStatisticsUpdater();
                        }
                    }
                }

                affectedUnits.add(unit);
            }
        }
    }

    if (!isFastExecute) {
        const mapSize           = war.getTileMap().getMapSize();
        const attackableArea    = AuxiliaryTypes_AttackableArea.AttackableArea.createForTile(tile, mapSize);
        const { width, height } = mapSize.getWH();
        for (let x = 0; x < width; ++x) {
            const column = attackableArea.getColumn(x);
            if (column == null) {
                continue;
            }

            for (let y = 0; y < height; ++y) {
                if (column[y]) {
                    gridVisualEffect.showEffectDamage(new AuxiliaryTypes_GridIndex.GridIndex(x, y));
                }
            }
        }
        await Timer_TimerModel.wait(200);

        for (const unit of affectedUnits) {
            unit.updateView();
        }
        await Timer_TimerModel.wait(400);
    }
}
function generateCandidateUnitArrayForLaserTurret(war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_ITile.ITile): Units_IUnit.IUnit[] {
    const data                  = Helpers_Misc.getExisted(tile.getFinalLaserTurretData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_GenerateCandidateUnitArrayForLaserTurret_00);
    const playerIndexInTurn     = tile.getPlayerIndex();
    const teamIndexInTurn       = tile.getTeamIndex();
    const tileGridX             = tile.getGridX();
    const tileGridY             = tile.getGridY();
    const unitMap               = war.getUnitMap();
    const mapSize               = unitMap.getMapSize();
    const rangeForUp            = data.getRangeForUp();
    const rangeForDown          = data.getRangeForDown();
    const rangeForLeft          = data.getRangeForLeft();
    const rangeForRight         = data.getRangeForRight();
    const canAffectAlly         = data.getCanAffectAlly();
    const canAffectEnemy        = data.getCanAffectEnemy();
    const canAffectSelf         = data.getCanAffectSelf();
    const candidateUnitArray    : Units_IUnit.IUnit[] = [];
    const checkAndAddUnit       = (gridIndex: AuxiliaryTypes_GridIndex.GridIndex) => {
        const unit = unitMap.getUnitOnMap(gridIndex);
        if (unit == null) {
            return;
        }

        const unitTeamIndex = unit.getTeamIndex();
        if (((canAffectSelf) && (unit.getPlayerIndex() === playerIndexInTurn))    ||
            ((canAffectAlly) && (unitTeamIndex === teamIndexInTurn))              ||
            ((canAffectEnemy) && (unitTeamIndex !== teamIndexInTurn))
        ) {
            candidateUnitArray.push(unit);
        }
    };

    for (let deltaX = 0; deltaX < rangeForRight; ++deltaX) {
        const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(tileGridX + deltaX + 1, tileGridY);
        if (!gridIndex.checkIsInsideMap(mapSize)) {
            break;
        }
        checkAndAddUnit(gridIndex);
    }
    for (let deltaX = 0; deltaX < rangeForLeft; ++deltaX) {
        const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(tileGridX - deltaX - 1, tileGridY);
        if (!gridIndex.checkIsInsideMap(mapSize)) {
            break;
        }
        checkAndAddUnit(gridIndex);
    }
    for (let deltaY = 0; deltaY < rangeForDown; ++deltaY) {
        const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(tileGridX, tileGridY + deltaY + 1);
        if (!gridIndex.checkIsInsideMap(mapSize)) {
            break;
        }
        checkAndAddUnit(gridIndex);
    }
    for (let deltaY = 0; deltaY < rangeForUp; ++deltaY) {
        const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(tileGridX, tileGridY - deltaY - 1);
        if (!gridIndex.checkIsInsideMap(mapSize)) {
            break;
        }
        checkAndAddUnit(gridIndex);
    }

    return candidateUnitArray;
}

function sorterForRepairUnits(unit1: Units_IUnit.IUnit, unit2: Units_IUnit.IUnit): number {
    const cost1 = unit1.getProductionFinalCost();
    if (cost1 == null) {
        throw Helpers_Misc.newError(`Empty cost1.`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_SorterForRepairUnits_00);
    }

    const cost2 = unit2.getProductionFinalCost();
    if (cost2 == null) {
        throw Helpers_Misc.newError(`Empty cost2.`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_SorterForRepairUnits_01);
    }

    if (cost1 !== cost2) {
        return cost2 - cost1;
    } else {
        const unitId1 = unit1.getUnitId();
        if (unitId1 == null) {
            throw Helpers_Misc.newError(`Empty unitId1.`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_SorterForRepairUnits_02);
        }

        const unitId2 = unit2.getUnitId();
        if (unitId2 == null) {
            throw Helpers_Misc.newError(`Empty unitId2.`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_SorterForRepairUnits_03);
        }

        return unitId1 - unitId2;
    }
}
