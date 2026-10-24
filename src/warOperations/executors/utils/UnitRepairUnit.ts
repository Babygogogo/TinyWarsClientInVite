import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import * as AuxiliaryTypesMovePath from "../../../auxiliaryTypes/MovePath.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as HelpersTeam from "../../../helpers/Team.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoUnitRepairUnit from "../../../proto/schema/CommonProto/WarOperation/WoUnitRepairUnit.ts";
import * as ProtoSchemaCommonProtoWarSerializationWsUnitStatistics from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import * as VisibilitiesUtils from "../../../visibilities/Utils.ts";
import * as WarOperationsExecutorsUtilsCommon from "./Common.ts";

type WoUnitRepairUnit       = ProtoSchemaCommonProtoWarOperationWoUnitRepairUnit.WoUnitRepairUnit;
type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoUnitRepairUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitRepairUnit(war, action);
    } else {
        await normalExeUnitRepairUnit(war, action);
    }
}

function fastExeUnitRepairUnit(war: IBwWar, action: WoUnitRepairUnit): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war             : war,
            commonExtraData : HelpersMisc.getExisted(actionExtraData.getCommonExtraData()),
            isFastExecute   : true,
        });
    } else {
        const path          = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = HelpersMisc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

        if (path.isBlocked) {
            // nothing to do.
        } else {
            const targetGridIndex   = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex()));
            const targetUnit        = HelpersMisc.getExisted(unitMap.getUnitOnMap(targetGridIndex));
            targetUnit.setCurrentFuel(targetUnit.getMaxFuel());
            targetUnit.addAndValidatePrimaryWeaponCurrentAmmo(targetUnit.getPrimaryWeaponUsedAmmo() ?? 0);
            targetUnit.setCurrentHp(targetUnit.getNormalizedCurrentHp() * UnitsConstants.Hp.Normalizer);

            const normalizedCurrentHp = targetUnit.getNormalizedCurrentHp();
            if (normalizedCurrentHp < targetUnit.getNormalizedMaxHp()) {
                const repairCost  = Math.floor(targetUnit.getProductionFinalCost() / 10);
                const player      = focusUnit.getPlayer();
                const fund        = player.getFund();
                if (fund >= repairCost) {
                    player.setFund(fund - repairCost);
                    targetUnit.setCurrentHp((normalizedCurrentHp + 1) * UnitsConstants.Hp.Normalizer);
                }
            }
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitRepairUnit(war: IBwWar, action: WoUnitRepairUnit): Promise<void> {
    // const desc = await war.getDescForExeUnitRepairUnit(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = HelpersMisc.getExisted(actionExtraData.getCommonExtraData());
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war                 : war,
            commonExtraData     : commonExtraData,
            isFastExecute       : false,
        });

    } else {
        const path          = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = HelpersMisc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

        if (path.isBlocked) {
            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : true,
                aiming              : null,
                updateViewAfterMove : true,
            });

        } else {
            const targetGridIndex = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex()));
            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : false,
                aiming              : null,
                updateViewAfterMove : true,
            });

            const targetUnit = HelpersMisc.getExisted(unitMap.getUnitOnMap(targetGridIndex));
            targetUnit.setCurrentFuel(targetUnit.getMaxFuel());
            targetUnit.addAndValidatePrimaryWeaponCurrentAmmo(targetUnit.getPrimaryWeaponUsedAmmo() ?? 0);
            targetUnit.setCurrentHp(targetUnit.getNormalizedCurrentHp() * UnitsConstants.Hp.Normalizer);

            const normalizedCurrentHp = targetUnit.getNormalizedCurrentHp();
            if (normalizedCurrentHp < targetUnit.getNormalizedMaxHp()) {
                const repairCost  = Math.floor(targetUnit.getProductionFinalCost() / 10);
                const player      = focusUnit.getPlayer();
                const fund        = player.getFund();
                if (fund >= repairCost) {
                    player.setFund(fund - repairCost);
                    targetUnit.setCurrentHp((normalizedCurrentHp + 1) * UnitsConstants.Hp.Normalizer);

                    {
                        const observerTeamIndexes = VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex: targetGridIndex });
                        if (observerTeamIndexes != null) {
                            war.getWarStatisticsManager().addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                                unitType                    : targetUnit.getUnitType(),
                                dstPlayerIndex              : targetUnit.getPlayerIndex(),
                                unitGain                    : 0,
                                unitLoss                    : 0,
                                normalizedHpGain            : 1,
                                normalizedHpLoss            : 0,
                                groupedObserverTeamIndexes  : HelpersTeam.encodeTeamIndex(observerTeamIndexes),
                            }));
                        }
                    }
                }
            }

            targetUnit.updateView();
            war.getGridVisualEffect().showEffectRepair(targetGridIndex);
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}
