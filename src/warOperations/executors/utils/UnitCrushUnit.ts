import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import { MovePath } from "../../../auxiliaryTypes/MovePath.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { destroyUnitOnMap } from "../../../destructions/Utils.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { AliveStateId } from "../../../players/Constants.ts";
import type { WoUnitCrushUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitCrushUnit.ts";
import { ActionStateId } from "../../../units/Constants.ts";
import {
    handleCommonExtraData,
    handlePostOperationPlunder,
} from "./Common.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoUnitCrushUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitCrushUnit(war, action);
    } else {
        await normalExeUnitCrushUnit(war, action);
    }
}

function fastExeUnitCrushUnit(war: IBwWar, action: WoUnitCrushUnit): void {
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
            const targetGridIndex = getExisted(GridIndex.convertGridIndex(action.getTargetGridIndex()));
            const targetPlayer    = getExisted(unitMap.getUnitOnMap(targetGridIndex)?.getPlayer());

            destroyUnitOnMap(war, targetGridIndex, false);
            war.moveUnit({
                pathNodes       : [pathNodes[pathNodes.length - 1], targetGridIndex],
                launchUnitId    : launchUnitId,
                fuelConsumption : 0,
            });
            unitMap.setUnitOnMap(focusUnit);

            if ((!targetPlayer.checkIsNeutral())                                        &&
                (targetPlayer.getAliveState() != AliveStateId.Dead) &&
                (!unitMap.checkHasUnitForPlayer(targetPlayer.getPlayerIndex()))
            ) {
                targetPlayer.setAliveState(AliveStateId.Dying);
            }
        }

        handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitCrushUnit(war: IBwWar, action: WoUnitCrushUnit): Promise<void> {
    // const desc = await war.getDescForExeUnitCrushUnit(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = getExisted(actionExtraData.getCommonExtraData());
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        // TODO 焦点部队移动到目标格子的动画

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
            const targetPlayer    = getExisted(unitMap.getUnitOnMap(targetGridIndex)?.getPlayer());

            await focusUnit.moveViewAlongPath({
                pathNodes           : [...pathNodes, targetGridIndex],
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : false,
                aiming              : null,
                updateViewAfterMove : true,
            });

            destroyUnitOnMap(war, targetGridIndex, true);
            war.moveUnit({
                pathNodes       : [pathNodes[pathNodes.length - 1], targetGridIndex],
                launchUnitId    : launchUnitId,
                fuelConsumption : 0,
            });
            unitMap.setUnitOnMap(focusUnit);

            if ((!targetPlayer.checkIsNeutral())                                        &&
                (targetPlayer.getAliveState() != AliveStateId.Dead) &&
                (!unitMap.checkHasUnitForPlayer(targetPlayer.getPlayerIndex()))
            ) {
                targetPlayer.setAliveState(AliveStateId.Dying);
            }
        }

        handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}
