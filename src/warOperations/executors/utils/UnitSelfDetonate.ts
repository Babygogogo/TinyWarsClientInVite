import * as AuxiliaryTypesMovePath from "../../../auxiliaryTypes/MovePath.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as DestructionsUtils from "../../../destructions/Utils.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as HelpersTeam from "../../../helpers/Team.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoUnitSelfDetonate from "../../../proto/schema/CommonProto/WarOperation/WoUnitSelfDetonate.ts";
import * as ProtoSchemaCommonProtoWarSerializationWsUnitStatistics from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import type * as UnitsIUnit from "../../../units/IUnit.ts";
import * as UnitsUtilsCommon from "../../../units/utils/Common.ts";
import * as VisibilitiesUtils from "../../../visibilities/Utils.ts";
import * as WarOperationsExecutorsUtilsCommon from "./Common.ts";

type WoUnitSelfDetonate     = ProtoSchemaCommonProtoWarOperationWoUnitSelfDetonate.WoUnitSelfDetonate;
type IBwUnit                = UnitsIUnit.IUnit;
type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoUnitSelfDetonate, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitSelfDetonate(war, action);
    } else {
        await normalExeUnitSelfDetonate(war, action);
    }
}

function fastExeUnitSelfDetonate(war: IBwWar, action: WoUnitSelfDetonate): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war             : war,
            commonExtraData : HelpersMisc.getExisted(actionExtraData.getCommonExtraData()),
            isFastExecute   : true,
        });
    } else {
        const revisedPath   = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = revisedPath.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = HelpersMisc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

        const isBlocked = revisedPath.isBlocked;
        if (isBlocked) {
            // nothing to do.
        } else {
            const warStatisticsManager  = war.getWarStatisticsManager();
            const selfDetonateCfg       = HelpersMisc.getExisted(focusUnit.getTemplateCfg().getSelfDetonateCfg());
            const destination           = pathNodes[pathNodes.length - 1];
            for (const targetGridIndex of destination.getGridsWithinDistance({
                minDistance : 1,
                maxDistance : selfDetonateCfg.getRadius(),
                mapSize     : unitMap.getMapSize(),
            })) {
                const targetUnit = unitMap.getUnitOnMap(targetGridIndex);
                if ((targetUnit != null) && (targetUnit != focusUnit)) {
                    const currentHp   = targetUnit.getCurrentHp();
                    const newHp       = Math.max(1, currentHp - (selfDetonateCfg.getDamage()) * UnitsConstants.Hp.Normalizer);
                    if (currentHp != newHp) {
                        targetUnit.setCurrentHp(newHp);

                        {
                            const unitLostNormalizedHp2 = UnitsUtilsCommon.getNormalizedHp(currentHp) - targetUnit.getNormalizedCurrentHp();
                            if (unitLostNormalizedHp2 != 0) {
                                const observerTeamIndexes = VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex: targetGridIndex });
                                if (observerTeamIndexes) {
                                    warStatisticsManager.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                                        unitType                    : targetUnit.getUnitType(),
                                        dstPlayerIndex              : targetUnit.getPlayerIndex(),
                                        normalizedHpGain            : 0,
                                        normalizedHpLoss            : unitLostNormalizedHp2,
                                        unitGain                    : 0,
                                        unitLoss                    : 0,
                                        groupedObserverTeamIndexes  : HelpersTeam.encodeTeamIndex(observerTeamIndexes),
                                    }));
                                }
                            }
                        }
                    }
                }
            }

            DestructionsUtils.destroyUnitOnMap(war, destination, false);
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitSelfDetonate(war: IBwWar, action: WoUnitSelfDetonate): Promise<void> {
    // const desc = await war.getDescForExeUnitSelfDetonate(action);
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
            war             : war,
            commonExtraData : commonExtraData,
            isFastExecute   : false,
        });

    } else {
        const revisedPath   = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = revisedPath.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = HelpersMisc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

        const isBlocked = revisedPath.isBlocked;
        if (isBlocked) {
            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : isBlocked,
                aiming              : null,
                updateViewAfterMove : true,
            });

        } else {
            const warStatisticsManager  = war.getWarStatisticsManager();
            const selfDetonateCfg       = HelpersMisc.getExisted(focusUnit.getTemplateCfg().getSelfDetonateCfg());
            const destination           = pathNodes[pathNodes.length - 1];
            const targetUnits           : IBwUnit[] = [];
            for (const targetGridIndex of destination.getGridsWithinDistance({
                minDistance : 1,
                maxDistance : selfDetonateCfg.getRadius(),
                mapSize     : unitMap.getMapSize()
            })) {
                const targetUnit = unitMap.getUnitOnMap(targetGridIndex);
                if ((targetUnit != null) && (targetUnit != focusUnit)) {
                    targetUnits.push(targetUnit);

                    const currentHp   = targetUnit.getCurrentHp();
                    const newHp       = Math.max(1, currentHp - (selfDetonateCfg.getDamage()) * UnitsConstants.Hp.Normalizer);
                    if (currentHp != newHp) {
                        targetUnit.setCurrentHp(newHp);

                        {
                            const unitLostNormalizedHp2 = UnitsUtilsCommon.getNormalizedHp(currentHp) - targetUnit.getNormalizedCurrentHp();
                            if (unitLostNormalizedHp2 != 0) {
                                const observerTeamIndexes = VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex: targetGridIndex });
                                if (observerTeamIndexes) {
                                    warStatisticsManager.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                                        unitType                    : targetUnit.getUnitType(),
                                        dstPlayerIndex              : targetUnit.getPlayerIndex(),
                                        normalizedHpGain            : 0,
                                        normalizedHpLoss            : unitLostNormalizedHp2,
                                        unitGain                    : 0,
                                        unitLoss                    : 0,
                                        groupedObserverTeamIndexes  : HelpersTeam.encodeTeamIndex(observerTeamIndexes),
                                    }));
                                }
                            }
                        }
                    }
                }
            }

            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : isBlocked,
                aiming              : null,
                updateViewAfterMove : true,
            });

            DestructionsUtils.destroyUnitOnMap(war, destination, true);

            const gridVisionEffect = war.getGridVisualEffect();
            for (const unit of targetUnits) {
                unit.updateView();
                gridVisionEffect.showEffectDamage(unit.getGridIndex());
            }
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}
