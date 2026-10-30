import {
    Units_Constants,
    Players_Constants,
    Destructions_Utils,
    Helpers_Misc,
    AuxiliaryTypes_GridIndex,
    WarOperations_Executors_Utils_Common,
    AuxiliaryTypes_MovePath,
    type BaseWar_Interface_IBwWar,
} from "../../../internal.ts";
import type { WoUnitCrushUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitCrushUnit.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitCrushUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitCrushUnit(war, action);
    } else {
        await normalExeUnitCrushUnit(war, action);
    }
}

function fastExeUnitCrushUnit(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitCrushUnit): void {
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
            const targetGridIndex = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex()));
            const targetPlayer    = Helpers_Misc.getExisted(unitMap.getUnitOnMap(targetGridIndex)?.getPlayer());

            Destructions_Utils.destroyUnitOnMap(war, targetGridIndex, false);
            war.moveUnit({
                pathNodes       : [pathNodes[pathNodes.length - 1], targetGridIndex],
                launchUnitId    : launchUnitId,
                fuelConsumption : 0,
            });
            unitMap.setUnitOnMap(focusUnit);

            if ((!targetPlayer.checkIsNeutral())                                        &&
                (targetPlayer.getAliveState() != Players_Constants.AliveStateId.Dead) &&
                (!unitMap.checkHasUnitForPlayer(targetPlayer.getPlayerIndex()))
            ) {
                targetPlayer.setAliveState(Players_Constants.AliveStateId.Dying);
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitCrushUnit(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitCrushUnit): Promise<void> {
    // const desc = await war.getDescForExeUnitCrushUnit(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData());
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        // TODO 焦点部队移动到目标格子的动画

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
            const targetPlayer    = Helpers_Misc.getExisted(unitMap.getUnitOnMap(targetGridIndex)?.getPlayer());

            await focusUnit.moveViewAlongPath({
                pathNodes           : [...pathNodes, targetGridIndex],
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : false,
                aiming              : null,
                updateViewAfterMove : true,
            });

            Destructions_Utils.destroyUnitOnMap(war, targetGridIndex, true);
            war.moveUnit({
                pathNodes       : [pathNodes[pathNodes.length - 1], targetGridIndex],
                launchUnitId    : launchUnitId,
                fuelConsumption : 0,
            });
            unitMap.setUnitOnMap(focusUnit);

            if ((!targetPlayer.checkIsNeutral())                                        &&
                (targetPlayer.getAliveState() != Players_Constants.AliveStateId.Dead) &&
                (!unitMap.checkHasUnitForPlayer(targetPlayer.getPlayerIndex()))
            ) {
                targetPlayer.setAliveState(Players_Constants.AliveStateId.Dying);
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}
