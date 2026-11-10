import {
    AuxiliaryTypes_GridIndex,
    Helpers_Misc,
    Helpers_Team,
    Units_Constants,
    Visibilities_Utils,
    WarOperations_Executors_Utils_Common,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import type { WoUnitRepairUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitRepairUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoUnitRepairUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitRepairUnit(war, action);
    } else {
        await normalExeUnitRepairUnit(war, action);
    }
}

function fastExeUnitRepairUnit(war: BaseWar_Model_War.War, action: WoUnitRepairUnit): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData()),
            isFastExecute   : true,
        });
    } else {
        const path          = Helpers_Misc.getExisted(action.getPath());
        const pathNodes     = path.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
        const launchUnitId  = action.getLaunchUnitId();
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({
            pathNodes       : pathNodes,
            launchUnitId    : launchUnitId,
            fuelConsumption : path.getFuelConsumption(),
        });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        if (path.getIsBlocked()) {
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

async function normalExeUnitRepairUnit(war: BaseWar_Model_War.War, action: WoUnitRepairUnit): Promise<void> {
    // const desc = await war.getDescForExeUnitRepairUnit(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData());
        await war.showTempUnitMoveAnimation({
            movingUnitAndPath : commonExtraData.getMovingUnitAndPath(),
            aiming            : null,
            callback          : undefined,
        });

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : commonExtraData,
            isFastExecute   : false,
        });

    } else {
        const path          = Helpers_Misc.getExisted(action.getPath());
        const pathNodes     = path.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
        const launchUnitId  = action.getLaunchUnitId();
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({
            pathNodes       : pathNodes,
            launchUnitId    : launchUnitId,
            fuelConsumption : path.getFuelConsumption(),
        });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        if (path.getIsBlocked()) {
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
                        const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex : targetGridIndex });
                        if (observerTeamIndexes != null) {
                            war.getWarStatisticsManager().addUnitStatistics(WsUnitStatistics.fromJson({
                                unitType                   : targetUnit.getUnitTypeId(),
                                dstPlayerIndex             : targetUnit.getPlayerIndex(),
                                unitGain                   : 0,
                                unitLoss                   : 0,
                                normalizedHpGain           : 1,
                                normalizedHpLoss           : 0,
                                groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                            }));
                        }
                    }
                }
            }

            targetUnit.flushDataToView();
            war.getGridVisualEffect()?.showEffectRepair(targetGridIndex);
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}
