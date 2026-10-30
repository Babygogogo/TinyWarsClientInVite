import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import { MovePath } from "../../../auxiliaryTypes/MovePath.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { encodeTeamIndex } from "../../../helpers/Team.ts";
import type { WoUnitRepairUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitRepairUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import {
    ActionStateId,
    Hp,
} from "../../../units/Constants.ts";
import { getObserverTeamIndexListForUnitOnMap } from "../../../visibilities/Utils.ts";
import {
    handleCommonExtraData,
    handlePostOperationPlunder,
} from "./Common.ts";

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
        handleCommonExtraData({
            war             : war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData()),
            isFastExecute   : true,
        });
    } else {
        const path          = MovePath.create(getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(ActionStateId.Acted);

        if (path.isBlocked) {
            // nothing to do.
        } else {
            const targetGridIndex   = getExisted(GridIndex.convertGridIndex(action.getTargetGridIndex()));
            const targetUnit        = getExisted(unitMap.getUnitOnMap(targetGridIndex));
            targetUnit.setCurrentFuel(targetUnit.getMaxFuel());
            targetUnit.addAndValidatePrimaryWeaponCurrentAmmo(targetUnit.getPrimaryWeaponUsedAmmo() ?? 0);
            targetUnit.setCurrentHp(targetUnit.getNormalizedCurrentHp() * Hp.Normalizer);

            const normalizedCurrentHp = targetUnit.getNormalizedCurrentHp();
            if (normalizedCurrentHp < targetUnit.getNormalizedMaxHp()) {
                const repairCost  = Math.floor(targetUnit.getProductionFinalCost() / 10);
                const player      = focusUnit.getPlayer();
                const fund        = player.getFund();
                if (fund >= repairCost) {
                    player.setFund(fund - repairCost);
                    targetUnit.setCurrentHp((normalizedCurrentHp + 1) * Hp.Normalizer);
                }
            }
        }

        handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitRepairUnit(war: IBwWar, action: WoUnitRepairUnit): Promise<void> {
    // const desc = await war.getDescForExeUnitRepairUnit(action);
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
            war                 : war,
            commonExtraData     : commonExtraData,
            isFastExecute       : false,
        });

    } else {
        const path          = MovePath.create(getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(ActionStateId.Acted);

        if (path.isBlocked) {
            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : true,
                aiming              : null,
                updateViewAfterMove : true,
            });

        } else {
            const targetGridIndex = getExisted(GridIndex.convertGridIndex(action.getTargetGridIndex()));
            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : false,
                aiming              : null,
                updateViewAfterMove : true,
            });

            const targetUnit = getExisted(unitMap.getUnitOnMap(targetGridIndex));
            targetUnit.setCurrentFuel(targetUnit.getMaxFuel());
            targetUnit.addAndValidatePrimaryWeaponCurrentAmmo(targetUnit.getPrimaryWeaponUsedAmmo() ?? 0);
            targetUnit.setCurrentHp(targetUnit.getNormalizedCurrentHp() * Hp.Normalizer);

            const normalizedCurrentHp = targetUnit.getNormalizedCurrentHp();
            if (normalizedCurrentHp < targetUnit.getNormalizedMaxHp()) {
                const repairCost  = Math.floor(targetUnit.getProductionFinalCost() / 10);
                const player      = focusUnit.getPlayer();
                const fund        = player.getFund();
                if (fund >= repairCost) {
                    player.setFund(fund - repairCost);
                    targetUnit.setCurrentHp((normalizedCurrentHp + 1) * Hp.Normalizer);

                    {
                        const observerTeamIndexes = getObserverTeamIndexListForUnitOnMap({ war, gridIndex: targetGridIndex });
                        if (observerTeamIndexes != null) {
                            war.getWarStatisticsManager().addUnitStatistics(WsUnitStatistics.fromJson({
                                unitType                    : targetUnit.getUnitType(),
                                dstPlayerIndex              : targetUnit.getPlayerIndex(),
                                unitGain                    : 0,
                                unitLoss                    : 0,
                                normalizedHpGain            : 1,
                                normalizedHpLoss            : 0,
                                groupedObserverTeamIndexes  : encodeTeamIndex(observerTeamIndexes),
                            }));
                        }
                    }
                }
            }

            targetUnit.updateView();
            war.getGridVisualEffect().showEffectRepair(targetGridIndex);
        }

        handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}
