import {
    AuxiliaryTypes_AttackableArea,
    AuxiliaryTypes_ChangedThingsForWarOperation,
    AuxiliaryTypes_GridIndex,
    BootTimers_Constants,
    CoSkills_Constants,
    Destructions_Utils,
    Helpers_Misc,
    Helpers_Team,
    Numbers_Utils,
    Players_Constants,
    Players_Utils_Common,
    ReplayWar_Model_RwWarBase,
    Tiles_Constants_MapWeapon,
    Timer_TimerModel,
    Turns_Constants,
    UnitBuffs_Constants,
    Units_Constants,
    Utils_ClientErrorCode,
    Visibilities_Utils,
    type BaseWar_Model_War,
    type Tiles_Tile,
    type Turns_Manager,
    type Units_Unit,
} from "../../internal.ts";
import { WsUnitStatistics } from "../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

export async function endPhaseStandby(turnManager: Turns_Manager.Manager, isFastExecute: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
    const phaseCode = turnManager.getPhaseCode();
    if (phaseCode !== Turns_Constants.PhaseCode.WaitBeginTurn) {
        throw Helpers_Misc.newError(`Invalid phaseCode: ${phaseCode}`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithoutExtraData_00);
    }

    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation()
        .mergeFrom(runPhaseResetHasUnitOnBeginningTurn(turnManager, isFastExecute))
        .mergeFrom(runPhaseHandleUnitBuffEffect(turnManager, isFastExecute))
        .mergeFrom(runPhaseGetFund(turnManager, isFastExecute))
        .mergeFrom(runPhaseConsumeFuel(turnManager, isFastExecute))
        .mergeFrom(runPhaseRecoverUnitByCo(turnManager, isFastExecute, CoSkills_Constants.AutoRecoveryTimingId.BeforeRegularRepair))
        .mergeFrom(runPhaseRepairUnitByTile(turnManager, isFastExecute))
        .mergeFrom(runPhaseDestroyUnitsOutOfFuel(turnManager, isFastExecute))
        .mergeFrom(runPhaseRepairUnitByUnit(turnManager, isFastExecute))
        .mergeFrom(runPhaseRecoverUnitByCo(turnManager, isFastExecute, CoSkills_Constants.AutoRecoveryTimingId.AfterRegularRepair))
        .mergeFrom(await runPhaseActivateMapWeapon(turnManager, isFastExecute))
        .mergeFrom(runPhaseCheckAndUpdateUnitAiMode(turnManager, isFastExecute))
        .mergeFrom(runPhaseMain(turnManager, isFastExecute));

    turnManager.setPhaseCode(Turns_Constants.PhaseCode.Main, true);

    return changedThings;
}

export function endPhaseMain(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const phaseCode = turnManager.getPhaseCode();
    if (phaseCode !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid phaseCode: ${phaseCode}`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseMainWithoutExtraData_00);
    }

    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation()
        .mergeFrom(runPhaseRecoverUnitByCo(turnManager, isFastExecute, CoSkills_Constants.AutoRecoveryTimingId.BeforeEndTurn))
        .mergeFrom(runPhaseResetUnitState(turnManager, isFastExecute))
        .mergeFrom(runPhaseResetVisionForCurrentPlayer(turnManager, isFastExecute))
        .mergeFrom(runPhaseHandleUnitBuffEffect2(turnManager, isFastExecute))
        .mergeFrom(runPhaseTickTurnAndPlayerIndex(turnManager, isFastExecute))
        .mergeFrom(runPhaseResetSkillState(turnManager, isFastExecute))
        .mergeFrom(runPhaseResetVotesForDraw(turnManager, isFastExecute))
        .mergeFrom(runPhaseUpdateWeatherAndForceFog(turnManager, isFastExecute))
        .mergeFrom(runPhaseUpdateAllTileBuffArray(turnManager, isFastExecute))
        .mergeFrom(runPhaseUpdateAllUnitBuffArray(turnManager, isFastExecute))
        .mergeFrom(runPhaseResetVisionForNextPlayer(turnManager, isFastExecute))
        .mergeFrom(runPhaseWaitBeginTurn(turnManager, isFastExecute));

    turnManager.setPhaseCode(Turns_Constants.PhaseCode.WaitBeginTurn, true);

    return changedThings;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetHasUnitOnBeginningTurn(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    turnManager.setHasUnitOnBeginningTurn(turnManager.getWar().getUnitMap().checkHasUnitForPlayer(turnManager.getPlayerIndexInTurn()));
    return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
}

function runPhaseHandleUnitBuffEffect(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const war           = turnManager.getWar();
    const unitMap       = war.getUnitMap();
    const units         = unitMap.getAllUnits().filter(v => v.getPlayerIndex() === playerIndex).sort((v1, v2) => v1.getUnitId() - v2.getUnitId());
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
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
                    changedThings.addUnit(unit);

                } else {
                    if (unit.getLoaderUnitId() != null) {
                        changedThings.mergeFrom(Destructions_Utils.destroyUnitLoaded(war, unitId));
                    } else {
                        changedThings.mergeFrom(Destructions_Utils.destroyUnitOnMap(war, gridIndex, !isFastExecute));
                    }
                    break;
                }
            }
        }

        if ((isModified) && (!isFastExecute) && (unitMap.getUnit(gridIndex, unitId))) {
            unit.flushDataToView();
        }
    }

    return changedThings;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseGetFund(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const war           = turnManager.getWar();
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const player        = war.getPlayer(playerIndex);
    const currentFund   = player.getFund();
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    let totalIncome     = war.getTileMap().getTotalIncomeForPlayer(playerIndex);
    if (turnManager.getTurnIndex() === Turns_Constants.TurnIndex.FirstIndex) {
        totalIncome += war.getCommonSettingManager().getPlayerRule(playerIndex).getInitialFund();
    }

    player.setFund(currentFund + totalIncome);
    changedThings.addPlayer(player);

    return changedThings;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseConsumeFuel(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const turnIndex     = turnManager.getTurnIndex();
    const war           = turnManager.getWar();
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    if (turnIndex > Turns_Constants.TurnIndex.FirstIndex) {
        for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
            if (unit.getPlayerIndex() === playerIndex) {
                const currentFuel = unit.getCurrentFuel();
                const consumption = unit.getFuelConsumptionPerTurn();
                if (consumption !== 0) {
                    unit.setCurrentFuel(Math.max(0, currentFuel - consumption));
                    changedThings.addUnit(unit);
                }
            }
        }
    }

    return changedThings;
}
function runPhaseRecoverUnitByCo(turnManager: Turns_Manager.Manager, isFastExecute: boolean, timing: number): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const war           = turnManager.getWar();
    const player        = war.getPlayer(playerIndex);
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    if (!player.getCoId()) {
        return changedThings;
    }

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
                const targetUnits       : Units_Unit.Unit[] = [];
                for (const unit of unitMap.getAllUnits()) {
                    const unitType      = unit.getUnitTypeId();
                    const unitGridIndex = unit.getGridIndex();
                    if ((unit.getPlayerIndex() !== playerIndex)                                                 ||
                        (!gameConfig.checkIsUnitTypeInCategory(unitType, recoverCfg.getUnitCategoryId()))  ||
                        (!unit.checkIsMeetLoadedState(loadedState))                                             ||
                        ((unitActionStateId != null) && (unit.getActionState() !== unitActionStateId))          ||
                        (!unitGridIndex.checkIsInsideCoSkillArea({
                            coSkillAreaType          : recoverCfg.getCoSkillAreaTypeId(),
                            coZoneRadius             : coZoneRadius,
                            getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
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
                            Math.floor(currentFund * normalizedMaxHp / revisedProductionCost),
                        );
                    const repairAmount = (normalizedRepairHp + normalizedCurrentHp) * Units_Constants.Hp.Normalizer - currentHp;

                    if (repairAmount > 0) {
                        unit.addCurrentHp(repairAmount);

                        const offsetFund = - Math.floor(normalizedRepairHp * revisedProductionCost / normalizedMaxHp);
                        player.setFund(Players_Utils_Common.getValidFund(currentFund + offsetFund));

                        {
                            const offsetNormalizedHp = unit.getNormalizedCurrentHp() - normalizedCurrentHp;
                            if (offsetNormalizedHp !== 0) {
                                const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war : war, gridIndex : unit.getGridIndex() });
                                if (observerTeamIndexes != null) {
                                    warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                        unitType                   : unit.getUnitTypeId(),
                                        dstPlayerIndex             : playerIndex,
                                        unitGain                   : 0,
                                        unitLoss                   : 0,
                                        normalizedHpGain           : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                                        normalizedHpLoss           : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                                        groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                                    }));
                                }
                            }
                        }

                        changedThings.addUnit(unit);

                        if (offsetFund != 0) {
                            changedThings.addPlayer(player);
                        }

                        if ((!isFastExecute) && (visibleUnits?.has(unit))) {
                            gridVisionEffect?.showEffectRepair(unit.getGridIndex());
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
                    const unitType      = unit.getUnitTypeId();
                    const unitGridIndex = unit.getGridIndex();
                    if ((unit.getPlayerIndex() === playerIndex)                                                 &&
                        (gameConfig.checkIsUnitTypeInCategory(unitType, recoverCfg.getUnitCategoryId()))   &&
                        (unit.checkIsMeetLoadedState(loadedState))                                              &&
                        (unitGridIndex.checkIsInsideCoSkillArea({
                            coSkillAreaType          : recoverCfg.getCoSkillAreaTypeId(),
                            coZoneRadius             : coZoneRadius,
                            getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
                        }))
                    ) {
                        const maxFuel       = unit.getMaxFuel();
                        const currentFuel   = unit.getCurrentFuel();
                        const offsetFuel    = Math.min(Math.floor(maxFuel * (recoverCfg.getFuelGainPct()) / 100), maxFuel - currentFuel);
                        unit.addCurrentFuel(offsetFuel);

                        if (offsetFuel != 0) {
                            changedThings.addUnit(unit);
                        }

                        if ((!isFastExecute) && (visibleUnits?.has(unit))) {
                            if (offsetFuel > 0) {
                                gridVisionEffect?.showEffectSupply(unitGridIndex);
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
                    const unitType      = unit.getUnitTypeId();
                    const unitGridIndex = unit.getGridIndex();
                    if ((unit.getPlayerIndex() === playerIndex)                                                 &&
                        (gameConfig.checkIsUnitTypeInCategory(unitType, recoverCfg.getUnitCategoryId()))   &&
                        (unit.checkIsMeetLoadedState(loadedState))                                              &&
                        (unitGridIndex.checkIsInsideCoSkillArea({
                            coSkillAreaType          : recoverCfg.getCoSkillAreaTypeId(),
                            coZoneRadius             : coZoneRadius,
                            getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
                        }))
                    ) {
                        const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
                        if (maxAmmo) {
                            const currentAmmo               = unit.getPrimaryWeaponCurrentAmmo();
                            const offsetPrimaryWeaponAmmo   = Math.min(Math.floor(maxAmmo * (recoverCfg.getAmmoGainPct()) / 100), maxAmmo - currentAmmo);
                            unit.addAndValidatePrimaryWeaponCurrentAmmo(offsetPrimaryWeaponAmmo);

                            if (offsetPrimaryWeaponAmmo != 0) {
                                changedThings.addUnit(unit);
                            }

                            if ((!isFastExecute) && (visibleUnits?.has(unit))) {
                                if (offsetPrimaryWeaponAmmo > 0) {
                                    gridVisionEffect?.showEffectSupply(unitGridIndex);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return changedThings;
}
function runPhaseRepairUnitByTile(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const war           = turnManager.getWar();
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    const player        = war.getPlayer(playerIndex);
    const allUnitsOnMap : Units_Unit.Unit[] = [];
    for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
        if (unit.getPlayerIndex() === playerIndex) {
            allUnitsOnMap.push(unit);
        }
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

            const offsetFund = -repairData.cost;
            player.setFund(fund + offsetFund);

            {
                const offsetNormalizedHp = unit.getNormalizedCurrentHp() - oldNormalizedHp;
                if (offsetNormalizedHp != 0) {
                    const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({
                        war       : war,
                        gridIndex : gridIndex,
                    });
                    if (observerTeamIndexes != null) {
                        warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                            unitType                   : unit.getUnitTypeId(),
                            dstPlayerIndex             : playerIndex,
                            unitGain                   : 0,
                            unitLoss                   : 0,
                            normalizedHpGain           : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                            normalizedHpLoss           : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                            groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                        }));
                    }
                }
            }

            if ((offsetHp != 0) || (offsetFuel != 0) || (offsetPrimaryWeaponAmmo != 0) || (offsetFlareAmmo != 0)) {
                changedThings.addUnit(unit);
            }
            if (offsetFund != 0) {
                changedThings.addPlayer(player);
            }

            if ((!isFastExecute) && (visibleUnits?.has(unit))) {
                if (offsetHp) {
                    gridVisionEffect?.showEffectRepair(gridIndex);
                } else if ((offsetFlareAmmo) || (offsetFuel) || (offsetPrimaryWeaponAmmo)) {
                    gridVisionEffect?.showEffectSupply(gridIndex);
                }
                unit.flushDataToView();
            }
        }
    }

    return changedThings;
}
function runPhaseDestroyUnitsOutOfFuel(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const playerIndex           = turnManager.getPlayerIndexInTurn();
    const war                   = turnManager.getWar();
    const fogMap                = war.getFogMap();
    const isPathVisionEnabled   = war.getGcData().getSystemCfg().getIsPathVisionEnabled();
    const changedThings         = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();

    for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
        if ((unit.checkIsDestroyedOnOutOfFuel())    &&
            (unit.getCurrentFuel() <= 0)            &&
            (unit.getPlayerIndex() === playerIndex)
        ) {
            const gridIndex = unit.getGridIndex();
            if (isPathVisionEnabled) {
                fogMap.updateMapFromPathsByUnitAndPath({
                    unit           : unit,
                    unitVisionInfo : unit.getVisionInfo(),
                    path           : [gridIndex],
                });
            }

            changedThings.mergeFrom(Destructions_Utils.destroyUnitOnMap(war, gridIndex, !isFastExecute));
        }
    }

    return changedThings;
}
function runPhaseRepairUnitByUnit(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const playerIndex       = turnManager.getPlayerIndexInTurn();
    const war               = turnManager.getWar();
    const player            = war.getPlayer(playerIndex);
    const unitMap           = war.getUnitMap();
    const mapSize           = unitMap.getMapSize();
    const gridVisionEffect  = war.getGridVisualEffect();
    const changedThings     = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    const visibleUnits      = ((war instanceof ReplayWar_Model_RwWarBase.RwWarBase) && (war.getIsBatchExecuteAction()))
        ? null
        : Visibilities_Utils.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getWatcherTeamIndexesForSelf());
    const allUnitsLoaded    : Units_Unit.Unit[] = [];
    for (const unit of unitMap.getAllUnitsLoaded()) {
        if (unit.getPlayerIndex() === playerIndex) {
            allUnitsLoaded.push(unit);
        }
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

            const offsetFund = -repairData.cost;
            player.setFund(player.getFund() + offsetFund);

            {
                const offsetNormalizedHp = unit.getNormalizedCurrentHp() - oldNormalizedHp;
                if (offsetNormalizedHp !== 0) {
                    const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war : war, gridIndex : gridIndex });
                    if (observerTeamIndexes != null) {
                        warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                            unitType                   : unit.getUnitTypeId(),
                            dstPlayerIndex             : playerIndex,
                            unitGain                   : 0,
                            unitLoss                   : 0,
                            normalizedHpGain           : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                            normalizedHpLoss           : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                            groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                        }));
                    }
                }
            }

            if ((offsetHp != 0) || (offsetFuel != 0) || (offsetPrimaryWeaponAmmo != 0) || (offsetFlareAmmo != 0)) {
                changedThings.addUnit(unit);
            }
            if (offsetFund != 0) {
                changedThings.addPlayer(player);
            }

            if ((!isFastExecute) && (visibleUnits?.has(loader))) {
                if (offsetHp) {
                    gridVisionEffect?.showEffectRepair(gridIndex);
                } else if ((offsetFlareAmmo) || (offsetFuel) || (offsetPrimaryWeaponAmmo)) {
                    gridVisionEffect?.showEffectSupply(gridIndex);
                }
            }

        } else if (loader.checkCanSupplyLoadedUnit()) {
            const offsetFuel                = unit.getUsedFuel();
            const offsetPrimaryWeaponAmmo   = unit.getPrimaryWeaponUsedAmmo() ?? 0;
            const offsetFlareAmmo           = unit.getFlareUsedAmmo() ?? 0;
            unit.addCurrentFuel(offsetFuel);
            unit.addAndValidatePrimaryWeaponCurrentAmmo(offsetPrimaryWeaponAmmo);
            unit.addFlareCurrentAmmo(offsetFlareAmmo);

            if ((offsetFuel != 0) || (offsetPrimaryWeaponAmmo != 0) || (offsetFlareAmmo != 0)) {
                changedThings.addUnit(unit);
            }

            if ((!isFastExecute) && (visibleUnits?.has(loader))) {
                if ((offsetFlareAmmo) || (offsetFuel) || (offsetPrimaryWeaponAmmo)) {
                    gridVisionEffect?.showEffectSupply(gridIndex);
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
                    if ((offsetFuel != 0) || (offsetPrimaryWeaponAmmo != 0) || (offsetFlareAmmo != 0)) {
                        changedThings.addUnit(unit);
                    }

                    if ((!isFastExecute) && (visibleUnits?.has(unit))) {
                        if ((offsetFlareAmmo) || (offsetFuel) || (offsetPrimaryWeaponAmmo)) {
                            gridVisionEffect?.showEffectSupply(gridIndex);
                        }
                    }
                }
            }
        }
    }

    return changedThings;
}

async function runPhaseActivateMapWeapon(turnManager: Turns_Manager.Manager, isFastExecute: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
    const war           = turnManager.getWar();
    const playerIndex   = war.getPlayerIndexInTurn();
    const tileMap       = war.getTileMap();
    const mapSize       = tileMap.getMapSize();
    const allTileArray  = tileMap.getAllTiles().filter(v => v.getPlayerIndex() === playerIndex);
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();

    {
        const crystalArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.Crystal)
            .sort((v1, v2) => v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize));
        for (const tile of crystalArray) {
            changedThings.mergeFrom(await handleMapWeaponTileCrystal(war, tile, isFastExecute));
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
            changedThings.mergeFrom(await handleMapWeaponTileCrystal(war, tile, isFastExecute));
        }
    }
    {
        const cannonArray = allTileArray.filter(v => v.checkIsNormalCannon())
            .sort((v1, v2) => v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize));
        for (const tile of cannonArray) {
            changedThings.mergeFrom(await handleMapWeaponTileCannon(war, tile, isFastExecute));
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
            changedThings.mergeFrom(await handleMapWeaponTileCannon(war, tile, isFastExecute));
        }
    }
    {
        const laserTurretArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.LaserTurret)
            .sort((v1, v2) => v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize));
        for (const tile of laserTurretArray) {
            changedThings.mergeFrom(await handleMapWeaponTileLaserTurret(war, tile, isFastExecute));
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
            changedThings.mergeFrom(await handleMapWeaponTileLaserTurret(war, tile, isFastExecute));
        }
    }

    return changedThings;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseCheckAndUpdateUnitAiMode(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const war           = turnManager.getWar();
    const playerInTurn  = war.getPlayerInTurn();
    const changedTings  = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    if (playerInTurn.getUserId() == null) {
        const playerIndex = playerInTurn.getPlayerIndex();
        for (const unit of war.getUnitMap().getAllUnits()) {
            if ((unit.getPlayerIndex() === playerIndex) && (unit.checkAndUpdateAiMode())) {
                changedTings.addUnit(unit);
            }
        }
    }

    return changedTings;
}
function runPhaseMain(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const war           = turnManager.getWar();
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const player        = war.getPlayer(playerIndex);
    const unitMap       = war.getUnitMap();
    const hasUnit       = unitMap.checkHasUnitForPlayer(playerIndex);
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    if ((turnManager.getHasUnitOnBeginningTurn())   &&
        (!hasUnit)
    ) {
        player.setAliveState(Players_Constants.AliveStateId.Dying);
        changedThings.addPlayer(player);
    }

    if ((!isFastExecute) && (hasUnit)) {
        for (const unit of unitMap.getAllUnitsOnMap()) {
            if (unit.getPlayerIndex() === playerIndex) {
                unit.flushDataToView();
            }
        }
    }

    return changedThings;
}


function runPhaseResetUnitState(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    for (const unit of (turnManager.getWar()).getUnitMap().getAllUnits()) {
        if (unit.getPlayerIndex() === playerIndex) {
            unit.setActionState(Units_Constants.ActionStateId.Idle);
            changedThings.addUnit(unit);

            if (!isFastExecute) {
                unit.flushDataToView();
            }
        }
    }

    return changedThings;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetVisionForCurrentPlayer(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const war = turnManager.getWar();
    war.getFogMap().resetMapFromPathsForPlayerWithEncodedData(war.getPlayerIndexInTurn());

    return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
}

function runPhaseHandleUnitBuffEffect2(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const war           = turnManager.getWar();
    const unitMap       = war.getUnitMap();
    const units         = unitMap.getAllUnits().filter(v => v.getPlayerIndex() === playerIndex).sort((v1, v2) => v1.getUnitId() - v2.getUnitId());
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
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
                    changedThings.addUnit(unit);
                } else {
                    if (unit.getLoaderUnitId() != null) {
                        changedThings.mergeFrom(Destructions_Utils.destroyUnitLoaded(war, unitId));
                    } else {
                        changedThings.mergeFrom(Destructions_Utils.destroyUnitOnMap(war, gridIndex, !isFastExecute));
                    }
                    break;
                }
            }
        }

        if ((isModified) && (!isFastExecute) && (unitMap.getUnit(gridIndex, unitId))) {
            unit.flushDataToView();
        }
    }

    return changedThings;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseTickTurnAndPlayerIndex(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const playerIndex       = turnManager.getPlayerIndexInTurn();
    const war               = turnManager.getWar();
    const currTime          = Timer_TimerModel.getServerTimestamp();
    const changedThings     = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
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
    changedThings.addPlayer(player);

    const info = turnManager.getNextTurnAndPlayerIndex();
    turnManager.setTurnIndex(info.turnIndex);
    turnManager.setPlayerIndexInTurn(info.playerIndex, true);
    turnManager.setEnterTurnTime(Timer_TimerModel.getServerTimestamp());
    war.getWarEventManager().updateWarEventCalledCountOnPlayerTurnSwitched();

    return changedThings;
}

function runPhaseResetSkillState(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const war       = turnManager.getWar();
    const player    = war.getPlayerInTurn();
    player.setCoIsDestroyedInTurn(false);
    player.setCoUsingSkillType(CoSkills_Constants.SkillTypeId.Passive);

    if (!isFastExecute) {
        war.getTileMap().getView()?.updateCoZone();
    }

    return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation({ players : [player] });
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetVotesForDraw(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    return turnManager.getWar().getDrawVoteManager().handleTurnPhaseResetVotesForDraw();
}

function runPhaseUpdateWeatherAndForceFog(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const war               = turnManager.getWar();
    const weatherManager    = war.getWeatherManager();
    weatherManager.updateOnPlayerTurnSwitched();
    war.getFogMap().updateOnPlayerTurnSwitched();

    if (!isFastExecute) {
        weatherManager.getView()?.resetView(false);
    }

    return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
}

function runPhaseUpdateAllTileBuffArray(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation({
        tiles : turnManager.getWar().getTileMap().getAllTiles().filter(v => v.updateUnfixedBuffArrayOnPlayerTurnSwitched(!isFastExecute)),
    });
}

function runPhaseUpdateAllUnitBuffArray(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation({
        units : turnManager.getWar().getUnitMap().getAllUnits().filter(v => v.updateBuffArrayOnPlayerTurnSwitched(!isFastExecute)),
    });
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetVisionForNextPlayer(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
}

function runPhaseWaitBeginTurn(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    if (!isFastExecute) {
        turnManager.getWar().getTileMap().getView()?.resetMarkLayer();
    }
    return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
}

async function handleMapWeaponTileCrystal(war: BaseWar_Model_War.War, tile: Tiles_Tile.Tile, isFastExecute: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
    const gridVisualEffect  = war.getGridVisualEffect();
    const tileGridIndex     = tile.getGridIndex();
    if (!isFastExecute) {
        war.getView()?.moveGridToCenter(tileGridIndex);
        gridVisualEffect?.showEffectCharge(tileGridIndex);
        await Timer_TimerModel.wait(400);
    }

    const unitMap           = war.getUnitMap();
    const playerIndexInTurn = tile.getPlayerIndex();
    const teamIndexInTurn   = tile.getTeamIndex();
    const data              = Helpers_Misc.getExisted(tile.getFinalCrystalData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_HandleMapWeaponTileCrystal_00);
    const affectedUnits     = new Set<Units_Unit.Unit>();
    const canAffectAlly     = data.getCanAffectAlly();
    const canAffectEnemy    = data.getCanAffectEnemy();
    const canAffectSelf     = data.getCanAffectSelf();
    const changedThings     = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();

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
                        changedThings.addPlayer(player);
                    }

                    if (deltaEnergyPercentage) {
                        if (deltaEnergyPercentage < 0) {
                            player.addAndValidateCoCurrentEnergy(player.getCoCurrentEnergy() * deltaEnergyPercentage / 100);
                        } else {
                            player.addAndValidateCoCurrentEnergy(player.getCoMaxEnergy() * deltaEnergyPercentage / 100);
                        }
                        changedThings.addPlayer(player);
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
            for (const gridIndex of tile.getGridIndex().getGridsWithinDistance({ minDistance : 0, maxDistance : data.getRadius(), mapSize : unitMap.getMapSize() })) {
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
                                Math.floor(unit.getCurrentFuel() * (100 + deltaFuelPercentage) / 100),
                            ));
                        } else {
                            const maxFuel = unit.getMaxFuel();
                            unit.setCurrentFuel(Math.min(
                                maxFuel,
                                Math.floor(unit.getCurrentFuel() + maxFuel * deltaFuelPercentage / 100),
                            ));
                        }
                        changedThings.addUnit(unit);
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
                            changedThings.addUnit(unit);
                        }
                    }

                    if (deltaHp) {
                        const oldNormalizedHp       = unit.getNormalizedCurrentHp();
                        const warStatisticsUpdater  = () => {
                            const offsetNormalizedHp = unit.getNormalizedCurrentHp() - oldNormalizedHp;
                            if (offsetNormalizedHp != 0) {
                                const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war : war, gridIndex : gridIndex });
                                if (observerTeamIndexes != null) {
                                    warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                        unitType                   : unit.getUnitTypeId(),
                                        dstPlayerIndex             : unit.getPlayerIndex(),
                                        unitGain                   : 0,
                                        unitLoss                   : 0,
                                        normalizedHpGain           : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                                        normalizedHpLoss           : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                                        groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                                    }));
                                }
                            }
                        };

                        if (deltaHp > 0) {
                            unit.setCurrentHp(Math.min(
                                unit.getMaxHp(),
                                (oldNormalizedHp + deltaHp) * Units_Constants.Hp.Normalizer),
                            );
                            warStatisticsUpdater();

                        } else {
                            const rawNewHp = unit.getCurrentHp() + deltaHp * Units_Constants.Hp.Normalizer;
                            if ((rawNewHp <= 0) && (canBeFatal)) {
                                changedThings.mergeFrom(Destructions_Utils.destroyUnitOnMap(war, gridIndex, !isFastExecute));
                            } else {
                                unit.setCurrentHp(Numbers_Utils.getValueInRange({
                                    rawValue : rawNewHp,
                                    minValue : 1,
                                    maxValue : unit.getMaxHp(),
                                }));
                                warStatisticsUpdater();
                            }
                        }

                        changedThings.addUnit(unit);
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
                    gridVisualEffect?.showEffectDamage(new AuxiliaryTypes_GridIndex.GridIndex(x, y));
                }
            }
        }
        await Timer_TimerModel.wait(200);

        for (const unit of affectedUnits) {
            unit.flushDataToView();
        }
        await Timer_TimerModel.wait(400);
    }

    return changedThings;
}

async function handleMapWeaponTileCannon(war: BaseWar_Model_War.War, tile: Tiles_Tile.Tile, isFastExecute: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
    const gridVisualEffect  = war.getGridVisualEffect();
    const tileGridIndex     = tile.getGridIndex();
    if (!isFastExecute) {
        war.getView()?.moveGridToCenter(tileGridIndex);
        gridVisualEffect?.showEffectCharge(tileGridIndex);
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
    const affectedUnits                 = new Set<Units_Unit.Unit>();
    const changedThings                 = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();

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
                        Math.floor(unit.getCurrentFuel() * (100 + deltaFuelPercentage) / 100),
                    ));
                } else {
                    const maxFuel = unit.getMaxFuel();
                    unit.setCurrentFuel(Math.min(
                        maxFuel,
                        Math.floor(unit.getCurrentFuel() + maxFuel * deltaFuelPercentage / 100),
                    ));
                }
                changedThings.addUnit(unit);
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
                    changedThings.addUnit(unit);
                }
            }

            if (deltaHp) {
                const oldNormalizedHp       = unit.getNormalizedCurrentHp();
                const warStatisticsUpdater  = () => {
                    const offsetNormalizedHp = unit.getNormalizedCurrentHp() - oldNormalizedHp;
                    if (offsetNormalizedHp != 0) {
                        const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war : war, gridIndex : unit.getGridIndex() });
                        if (observerTeamIndexes != null) {
                            warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                unitType                   : unit.getUnitTypeId(),
                                dstPlayerIndex             : unit.getPlayerIndex(),
                                unitGain                   : 0,
                                unitLoss                   : 0,
                                normalizedHpGain           : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                                normalizedHpLoss           : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                                groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                            }));
                        }
                    }
                };

                if (deltaHp > 0) {
                    unit.setCurrentHp(Math.min(
                        unit.getMaxHp(),
                        (oldNormalizedHp + deltaHp) * Units_Constants.Hp.Normalizer),
                    );
                    warStatisticsUpdater();

                } else {
                    const rawNewHp = unit.getCurrentHp() + deltaHp * Units_Constants.Hp.Normalizer;
                    if ((rawNewHp <= 0) && (canBeFatal)) {
                        changedThings.mergeFrom(Destructions_Utils.destroyUnitOnMap(war, unit.getGridIndex(), !isFastExecute));
                    } else {
                        unit.setCurrentHp(Numbers_Utils.getValueInRange({
                            rawValue : rawNewHp,
                            minValue : 1,
                            maxValue : unit.getMaxHp(),
                        }));
                        warStatisticsUpdater();
                    }
                }

                changedThings.addUnit(unit);
            }

            affectedUnits.add(unit);
        }
    }

    if (!isFastExecute) {
        if (affectedUnits.size) {
            for (const unit of affectedUnits) {
                gridVisualEffect?.showEffectDamage(unit.getGridIndex());
            }
            await Timer_TimerModel.wait(200);

            for (const unit of affectedUnits) {
                unit.flushDataToView();
            }
            await Timer_TimerModel.wait(400);
        }
    }

    return changedThings;
}
function generateCandidateUnitArrayForCannon(war: BaseWar_Model_War.War, tile: Tiles_Tile.Tile): Units_Unit.Unit[] {
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

    const unitAndFinalCostArray: { unit: Units_Unit.Unit, cost: number }[] = [];
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
            unit : unit,
            cost : unit.getProductionFinalCost() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp(),
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

    const candidateUnitArray: Units_Unit.Unit[] = [];
    for (const info of unitAndFinalCostArray) {
        candidateUnitArray.push(info.unit);
    }

    return candidateUnitArray;
}

async function handleMapWeaponTileLaserTurret(war: BaseWar_Model_War.War, tile: Tiles_Tile.Tile, isFastExecute: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
    const gridVisualEffect  = war.getGridVisualEffect();
    const tileGridIndex     = tile.getGridIndex();
    if (!isFastExecute) {
        war.getView()?.moveGridToCenter(tileGridIndex);
        gridVisualEffect?.showEffectCharge(tileGridIndex);
        await Timer_TimerModel.wait(400);
    }

    const data                  = Helpers_Misc.getExisted(tile.getFinalLaserTurretData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_HandleMapWeaponTileLaserTurret_00);
    const candidateUnitArray    = generateCandidateUnitArrayForLaserTurret(war, tile);
    const affectedUnits         = new Set<Units_Unit.Unit>();
    const changedThings         = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
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
                            Math.floor(unit.getCurrentFuel() * (100 + deltaFuelPercentage) / 100),
                        ));
                    } else {
                        const maxFuel = unit.getMaxFuel();
                        unit.setCurrentFuel(Math.min(
                            maxFuel,
                            Math.floor(unit.getCurrentFuel() + maxFuel * deltaFuelPercentage / 100),
                        ));
                    }
                    changedThings.addUnit(unit);
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
                        changedThings.addUnit(unit);
                    }
                }

                if (deltaHp) {
                    const oldNormalizedHp       = unit.getNormalizedCurrentHp();
                    const warStatisticsUpdater  = () => {
                        const offsetNormalizedHp = unit.getNormalizedCurrentHp() - oldNormalizedHp;
                        if (offsetNormalizedHp != 0) {
                            const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war : war, gridIndex : unit.getGridIndex() });
                            if (observerTeamIndexes != null) {
                                warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                    unitType                   : unit.getUnitTypeId(),
                                    dstPlayerIndex             : unit.getPlayerIndex(),
                                    unitGain                   : 0,
                                    unitLoss                   : 0,
                                    normalizedHpGain           : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                                    normalizedHpLoss           : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                                    groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                                }));
                            }
                        }
                    };

                    if (deltaHp > 0) {
                        unit.setCurrentHp(Math.min(
                            unit.getMaxHp(),
                            (oldNormalizedHp + deltaHp) * Units_Constants.Hp.Normalizer),
                        );
                        warStatisticsUpdater();

                    } else {
                        const rawNewHp = unit.getCurrentHp() + deltaHp * Units_Constants.Hp.Normalizer;
                        if ((rawNewHp <= 0) && (canBeFatal)) {
                            changedThings.mergeFrom(Destructions_Utils.destroyUnitOnMap(war, unit.getGridIndex(), !isFastExecute));
                        } else {
                            unit.setCurrentHp(Numbers_Utils.getValueInRange({
                                rawValue : rawNewHp,
                                minValue : 1,
                                maxValue : unit.getMaxHp(),
                            }));
                            warStatisticsUpdater();
                        }
                    }

                    changedThings.addUnit(unit);
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
                    gridVisualEffect?.showEffectDamage(new AuxiliaryTypes_GridIndex.GridIndex(x, y));
                }
            }
        }
        await Timer_TimerModel.wait(200);

        for (const unit of affectedUnits) {
            unit.flushDataToView();
        }
        await Timer_TimerModel.wait(400);
    }

    return changedThings;
}
function generateCandidateUnitArrayForLaserTurret(war: BaseWar_Model_War.War, tile: Tiles_Tile.Tile): Units_Unit.Unit[] {
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
    const candidateUnitArray    : Units_Unit.Unit[] = [];
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

function sorterForRepairUnits(unit1: Units_Unit.Unit, unit2: Units_Unit.Unit): number {
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
