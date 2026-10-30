import {
    Units_Constants,
    Destructions_Utils,
    Helpers_Team,
    Helpers_Misc,
    Units_Utils_Common,
    Visibilities_Utils,
    WarOperations_Executors_Utils_Common,
    AuxiliaryTypes_MovePath,
    type BaseWar_Interface_IBwWar,
    type Units_IUnit,
} from "../../../internal.ts";
import type { WoUnitSelfDetonate } from "../../../proto/schema/CommonProto/WarOperation/WoUnitSelfDetonate.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitSelfDetonate, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitSelfDetonate(war, action);
    } else {
        await normalExeUnitSelfDetonate(war, action);
    }
}

function fastExeUnitSelfDetonate(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitSelfDetonate): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData()),
            isFastExecute   : true,
        });
    } else {
        const revisedPath   = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = revisedPath.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption : revisedPath.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        const isBlocked = revisedPath.isBlocked;
        if (isBlocked) {
            // nothing to do.
        } else {
            const warStatisticsManager  = war.getWarStatisticsManager();
            const selfDetonateCfg       = Helpers_Misc.getExisted(focusUnit.getTemplateCfg().getSelfDetonateCfg());
            const destination           = pathNodes[pathNodes.length - 1];
            for (const targetGridIndex of destination.getGridsWithinDistance({
                minDistance : 1,
                maxDistance : selfDetonateCfg.getRadius(),
                mapSize     : unitMap.getMapSize(),
            })) {
                const targetUnit = unitMap.getUnitOnMap(targetGridIndex);
                if ((targetUnit != null) && (targetUnit != focusUnit)) {
                    const currentHp   = targetUnit.getCurrentHp();
                    const newHp       = Math.max(1, currentHp - (selfDetonateCfg.getDamage()) * Units_Constants.Hp.Normalizer);
                    if (currentHp != newHp) {
                        targetUnit.setCurrentHp(newHp);

                        {
                            const unitLostNormalizedHp2 = Units_Utils_Common.getNormalizedHp(currentHp) - targetUnit.getNormalizedCurrentHp();
                            if (unitLostNormalizedHp2 != 0) {
                                const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex : targetGridIndex });
                                if (observerTeamIndexes) {
                                    warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                        unitType                   : targetUnit.getUnitType(),
                                        dstPlayerIndex             : targetUnit.getPlayerIndex(),
                                        normalizedHpGain           : 0,
                                        normalizedHpLoss           : unitLostNormalizedHp2,
                                        unitGain                   : 0,
                                        unitLoss                   : 0,
                                        groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                                    }));
                                }
                            }
                        }
                    }
                }
            }

            Destructions_Utils.destroyUnitOnMap(war, destination, false);
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitSelfDetonate(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitSelfDetonate): Promise<void> {
    // const desc = await war.getDescForExeUnitSelfDetonate(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData());
        await war.moveExtraUnit({
            movingUnitAndPath     : commonExtraData.getMovingUnitAndPath(),
            aiming                : null,
            deleteViewAfterMoving : true,
        });

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : commonExtraData,
            isFastExecute   : false,
        });

    } else {
        const revisedPath   = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = revisedPath.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption : revisedPath.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

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
            const selfDetonateCfg       = Helpers_Misc.getExisted(focusUnit.getTemplateCfg().getSelfDetonateCfg());
            const destination           = pathNodes[pathNodes.length - 1];
            const targetUnits           : Units_IUnit.IUnit[] = [];
            for (const targetGridIndex of destination.getGridsWithinDistance({
                minDistance : 1,
                maxDistance : selfDetonateCfg.getRadius(),
                mapSize     : unitMap.getMapSize(),
            })) {
                const targetUnit = unitMap.getUnitOnMap(targetGridIndex);
                if ((targetUnit != null) && (targetUnit != focusUnit)) {
                    targetUnits.push(targetUnit);

                    const currentHp   = targetUnit.getCurrentHp();
                    const newHp       = Math.max(1, currentHp - (selfDetonateCfg.getDamage()) * Units_Constants.Hp.Normalizer);
                    if (currentHp != newHp) {
                        targetUnit.setCurrentHp(newHp);

                        {
                            const unitLostNormalizedHp2 = Units_Utils_Common.getNormalizedHp(currentHp) - targetUnit.getNormalizedCurrentHp();
                            if (unitLostNormalizedHp2 != 0) {
                                const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex : targetGridIndex });
                                if (observerTeamIndexes) {
                                    warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                        unitType                   : targetUnit.getUnitType(),
                                        dstPlayerIndex             : targetUnit.getPlayerIndex(),
                                        normalizedHpGain           : 0,
                                        normalizedHpLoss           : unitLostNormalizedHp2,
                                        unitGain                   : 0,
                                        unitLoss                   : 0,
                                        groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
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

            Destructions_Utils.destroyUnitOnMap(war, destination, true);

            const gridVisionEffect = war.getGridVisualEffect();
            for (const unit of targetUnits) {
                unit.updateView();
                gridVisionEffect.showEffectDamage(unit.getGridIndex());
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}
