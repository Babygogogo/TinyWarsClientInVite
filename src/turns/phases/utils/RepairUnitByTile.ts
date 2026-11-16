import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    Helpers_Team,
    ReplayWar_Model_RwWarBase,
    Turns_Phases_Utils_SortRepairUnits,
    Visibilities_Utils,
    type Turns_Manager,
    type Units_Unit,
} from "../../../internal.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function runAsOuterWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): void {
    // nothing to do
}

export function runAsInnerWar(turnManager: Turns_Manager.Manager): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    return runAsLocalWar(turnManager, true);
}

export function runAsUnifiedWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    return runAsLocalWar(turnManager, isFastExecute);
}

function runAsLocalWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
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
    for (const unit of allUnitsOnMap.sort(Turns_Phases_Utils_SortRepairUnits.sorterForRepairUnits)) {
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
