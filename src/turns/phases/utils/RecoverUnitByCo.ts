import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    Helpers_Misc,
    Helpers_Team,
    Players_Utils_Common,
    ReplayWar_Model_RwWarBase,
    Turns_Phases_Utils_SortRepairUnits,
    Units_Constants,
    Visibilities_Utils,
    type Turns_Manager,
    type Units_Unit,
} from "../../../internal.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function runAsOuterWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean, timing: number): void {
    // nothing to do
}

export function runAsLocalWar(turnManager: Turns_Manager.Manager, timing: number, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const war           = Helpers_Misc.getExisted(turnManager.getWar());
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
                for (const unit of targetUnits.sort(Turns_Phases_Utils_SortRepairUnits.sorterForRepairUnits)) {
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
                        player.setFund(Players_Utils_Common.getValidFund(currentFund + offsetFund), !isFastExecute);

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
