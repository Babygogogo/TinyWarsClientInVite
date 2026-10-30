import { MovePath } from "../../../auxiliaryTypes/MovePath.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { destroyUnitOnMap } from "../../../destructions/Utils.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { encodeTeamIndex } from "../../../helpers/Team.ts";
import type { WoUnitSelfDetonate } from "../../../proto/schema/CommonProto/WarOperation/WoUnitSelfDetonate.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import {
    ActionStateId,
    Hp,
} from "../../../units/Constants.ts";
import type { IUnit } from "../../../units/IUnit.ts";
import { getNormalizedHp } from "../../../units/utils/Common.ts";
import { getObserverTeamIndexListForUnitOnMap } from "../../../visibilities/Utils.ts";
import {
    handleCommonExtraData,
    handlePostOperationPlunder,
} from "./Common.ts";

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
        handleCommonExtraData({
            war             : war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData()),
            isFastExecute   : true,
        });
    } else {
        const revisedPath   = MovePath.create(getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = revisedPath.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(ActionStateId.Acted);

        const isBlocked = revisedPath.isBlocked;
        if (isBlocked) {
            // nothing to do.
        } else {
            const warStatisticsManager  = war.getWarStatisticsManager();
            const selfDetonateCfg       = getExisted(focusUnit.getTemplateCfg().getSelfDetonateCfg());
            const destination           = pathNodes[pathNodes.length - 1];
            for (const targetGridIndex of destination.getGridsWithinDistance({
                minDistance : 1,
                maxDistance : selfDetonateCfg.getRadius(),
                mapSize     : unitMap.getMapSize(),
            })) {
                const targetUnit = unitMap.getUnitOnMap(targetGridIndex);
                if ((targetUnit != null) && (targetUnit != focusUnit)) {
                    const currentHp   = targetUnit.getCurrentHp();
                    const newHp       = Math.max(1, currentHp - (selfDetonateCfg.getDamage()) * Hp.Normalizer);
                    if (currentHp != newHp) {
                        targetUnit.setCurrentHp(newHp);

                        {
                            const unitLostNormalizedHp2 = getNormalizedHp(currentHp) - targetUnit.getNormalizedCurrentHp();
                            if (unitLostNormalizedHp2 != 0) {
                                const observerTeamIndexes = getObserverTeamIndexListForUnitOnMap({ war, gridIndex: targetGridIndex });
                                if (observerTeamIndexes) {
                                    warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                        unitType                    : targetUnit.getUnitType(),
                                        dstPlayerIndex              : targetUnit.getPlayerIndex(),
                                        normalizedHpGain            : 0,
                                        normalizedHpLoss            : unitLostNormalizedHp2,
                                        unitGain                    : 0,
                                        unitLoss                    : 0,
                                        groupedObserverTeamIndexes  : encodeTeamIndex(observerTeamIndexes),
                                    }));
                                }
                            }
                        }
                    }
                }
            }

            destroyUnitOnMap(war, destination, false);
        }

        handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitSelfDetonate(war: IBwWar, action: WoUnitSelfDetonate): Promise<void> {
    // const desc = await war.getDescForExeUnitSelfDetonate(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = getExisted(actionExtraData.getCommonExtraData());
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        handleCommonExtraData({
            war             : war,
            commonExtraData : commonExtraData,
            isFastExecute   : false,
        });

    } else {
        const revisedPath   = MovePath.create(getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = revisedPath.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(ActionStateId.Acted);

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
            const selfDetonateCfg       = getExisted(focusUnit.getTemplateCfg().getSelfDetonateCfg());
            const destination           = pathNodes[pathNodes.length - 1];
            const targetUnits           : IUnit[] = [];
            for (const targetGridIndex of destination.getGridsWithinDistance({
                minDistance : 1,
                maxDistance : selfDetonateCfg.getRadius(),
                mapSize     : unitMap.getMapSize()
            })) {
                const targetUnit = unitMap.getUnitOnMap(targetGridIndex);
                if ((targetUnit != null) && (targetUnit != focusUnit)) {
                    targetUnits.push(targetUnit);

                    const currentHp   = targetUnit.getCurrentHp();
                    const newHp       = Math.max(1, currentHp - (selfDetonateCfg.getDamage()) * Hp.Normalizer);
                    if (currentHp != newHp) {
                        targetUnit.setCurrentHp(newHp);

                        {
                            const unitLostNormalizedHp2 = getNormalizedHp(currentHp) - targetUnit.getNormalizedCurrentHp();
                            if (unitLostNormalizedHp2 != 0) {
                                const observerTeamIndexes = getObserverTeamIndexListForUnitOnMap({ war, gridIndex: targetGridIndex });
                                if (observerTeamIndexes) {
                                    warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                        unitType                    : targetUnit.getUnitType(),
                                        dstPlayerIndex              : targetUnit.getPlayerIndex(),
                                        normalizedHpGain            : 0,
                                        normalizedHpLoss            : unitLostNormalizedHp2,
                                        unitGain                    : 0,
                                        unitLoss                    : 0,
                                        groupedObserverTeamIndexes  : encodeTeamIndex(observerTeamIndexes),
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

            destroyUnitOnMap(war, destination, true);

            const gridVisionEffect = war.getGridVisualEffect();
            for (const unit of targetUnits) {
                unit.updateView();
                gridVisionEffect.showEffectDamage(unit.getGridIndex());
            }
        }

        handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}
