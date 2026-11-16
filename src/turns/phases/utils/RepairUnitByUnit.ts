import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    Helpers_Misc,
    Helpers_Team,
    ReplayWar_Model_RwWarBase,
    Turns_Phases_Utils_SortRepairUnits,
    Utils_ClientErrorCode,
    Visibilities_Utils,
    type Turns_Manager,
    type Units_Unit,
} from "../../../internal.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function runAsOuterWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): void {
    // nothing to do
}

export function runAsLocalWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const playerIndex       = turnManager.getPlayerIndexInTurn();
    const war               = Helpers_Misc.getExisted(turnManager.getWar());
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
    for (const unit of allUnitsLoaded.sort(Turns_Phases_Utils_SortRepairUnits.sorterForRepairUnits)) {
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
