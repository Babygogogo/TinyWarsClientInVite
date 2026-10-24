import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import * as AuxiliaryTypesMovePath from "../../../auxiliaryTypes/MovePath.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as DestructionsUtils from "../../../destructions/Utils.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoUnitCrushUnit from "../../../proto/schema/CommonProto/WarOperation/WoUnitCrushUnit.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import * as WarOperationsExecutorsUtilsCommon from "./Common.ts";

type WoUnitCrushUnit        = ProtoSchemaCommonProtoWarOperationWoUnitCrushUnit.WoUnitCrushUnit;
type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;

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
            const targetGridIndex = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex()));
            const targetPlayer    = HelpersMisc.getExisted(unitMap.getUnitOnMap(targetGridIndex)?.getPlayer());

            DestructionsUtils.destroyUnitOnMap(war, targetGridIndex, false);
            war.moveUnit({
                pathNodes       : [pathNodes[pathNodes.length - 1], targetGridIndex],
                launchUnitId    : launchUnitId,
                fuelConsumption : 0,
            });
            unitMap.setUnitOnMap(focusUnit);

            if ((!targetPlayer.checkIsNeutral())                                        &&
                (targetPlayer.getAliveState() != PlayersConstants.AliveStateId.Dead) &&
                (!unitMap.checkHasUnitForPlayer(targetPlayer.getPlayerIndex()))
            ) {
                targetPlayer.setAliveState(PlayersConstants.AliveStateId.Dying);
            }
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitCrushUnit(war: IBwWar, action: WoUnitCrushUnit): Promise<void> {
    // const desc = await war.getDescForExeUnitCrushUnit(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = HelpersMisc.getExisted(actionExtraData.getCommonExtraData());
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        // TODO 焦点部队移动到目标格子的动画

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
            const targetPlayer    = HelpersMisc.getExisted(unitMap.getUnitOnMap(targetGridIndex)?.getPlayer());

            await focusUnit.moveViewAlongPath({
                pathNodes           : [...pathNodes, targetGridIndex],
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : false,
                aiming              : null,
                updateViewAfterMove : true,
            });

            DestructionsUtils.destroyUnitOnMap(war, targetGridIndex, true);
            war.moveUnit({
                pathNodes       : [pathNodes[pathNodes.length - 1], targetGridIndex],
                launchUnitId    : launchUnitId,
                fuelConsumption : 0,
            });
            unitMap.setUnitOnMap(focusUnit);

            if ((!targetPlayer.checkIsNeutral())                                        &&
                (targetPlayer.getAliveState() != PlayersConstants.AliveStateId.Dead) &&
                (!unitMap.checkHasUnitForPlayer(targetPlayer.getPlayerIndex()))
            ) {
                targetPlayer.setAliveState(PlayersConstants.AliveStateId.Dying);
            }
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}
