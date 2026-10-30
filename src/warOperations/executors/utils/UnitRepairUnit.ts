import {
    Units_Constants,
    Helpers_Team,
    Helpers_Misc,
    Visibilities_Utils,
    AuxiliaryTypes_GridIndex,
    WarOperations_Executors_Utils_Common,
    AuxiliaryTypes_MovePath,
    type BaseWar_Interface_IBwWar,
} from "../../../internal.ts";
import type { WoUnitRepairUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitRepairUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitRepairUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitRepairUnit(war, action);
    } else {
        await normalExeUnitRepairUnit(war, action);
    }
}

function fastExeUnitRepairUnit(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitRepairUnit): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData()),
            isFastExecute   : true,
        });
    } else {
        const path          = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        if (path.isBlocked) {
            // nothing to do.
        } else {
            const targetGridIndex   = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex()));
            const targetUnit        = Helpers_Misc.getExisted(unitMap.getUnitOnMap(targetGridIndex));
            targetUnit.setCurrentFuel(targetUnit.getMaxFuel());
            targetUnit.addAndValidatePrimaryWeaponCurrentAmmo(targetUnit.getPrimaryWeaponUsedAmmo() ?? 0);
            targetUnit.setCurrentHp(targetUnit.getNormalizedCurrentHp() * Units_Constants.Hp.Normalizer);

            const normalizedCurrentHp = targetUnit.getNormalizedCurrentHp();
            if (normalizedCurrentHp < targetUnit.getNormalizedMaxHp()) {
                const repairCost  = Math.floor(targetUnit.getProductionFinalCost() / 10);
                const player      = focusUnit.getPlayer();
                const fund        = player.getFund();
                if (fund >= repairCost) {
                    player.setFund(fund - repairCost);
                    targetUnit.setCurrentHp((normalizedCurrentHp + 1) * Units_Constants.Hp.Normalizer);
                }
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitRepairUnit(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitRepairUnit): Promise<void> {
    // const desc = await war.getDescForExeUnitRepairUnit(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData());
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war                 : war,
            commonExtraData     : commonExtraData,
            isFastExecute       : false,
        });

    } else {
        const path          = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        if (path.isBlocked) {
            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : true,
                aiming              : null,
                updateViewAfterMove : true,
            });

        } else {
            const targetGridIndex = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex()));
            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : false,
                aiming              : null,
                updateViewAfterMove : true,
            });

            const targetUnit = Helpers_Misc.getExisted(unitMap.getUnitOnMap(targetGridIndex));
            targetUnit.setCurrentFuel(targetUnit.getMaxFuel());
            targetUnit.addAndValidatePrimaryWeaponCurrentAmmo(targetUnit.getPrimaryWeaponUsedAmmo() ?? 0);
            targetUnit.setCurrentHp(targetUnit.getNormalizedCurrentHp() * Units_Constants.Hp.Normalizer);

            const normalizedCurrentHp = targetUnit.getNormalizedCurrentHp();
            if (normalizedCurrentHp < targetUnit.getNormalizedMaxHp()) {
                const repairCost  = Math.floor(targetUnit.getProductionFinalCost() / 10);
                const player      = focusUnit.getPlayer();
                const fund        = player.getFund();
                if (fund >= repairCost) {
                    player.setFund(fund - repairCost);
                    targetUnit.setCurrentHp((normalizedCurrentHp + 1) * Units_Constants.Hp.Normalizer);

                    {
                        const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex: targetGridIndex });
                        if (observerTeamIndexes != null) {
                            war.getWarStatisticsManager().addUnitStatistics(WsUnitStatistics.fromJson({
                                unitType                    : targetUnit.getUnitType(),
                                dstPlayerIndex              : targetUnit.getPlayerIndex(),
                                unitGain                    : 0,
                                unitLoss                    : 0,
                                normalizedHpGain            : 1,
                                normalizedHpLoss            : 0,
                                groupedObserverTeamIndexes  : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                            }));
                        }
                    }
                }
            }

            targetUnit.updateView();
            war.getGridVisualEffect().showEffectRepair(targetGridIndex);
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}
