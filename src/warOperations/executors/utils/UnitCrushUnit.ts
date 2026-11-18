import {
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_ThingsForMovePath,
    Destructions_Utils,
    Helpers_Misc,
    Players_Constants,
    Units_Constants,
    WarOperations_Executors_Types,
    WarOperations_Executors_Utils_Common,
    type AuxiliaryTypes_MovePath,
    type BaseWar_Model_War,
    type SinglePlayerWars_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitCrushUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitCrushUnit.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function executeAsOuterWar(war: BaseWar_Model_War.War, action: WoUnitCrushUnit, isFast: boolean): Promise<void> {
    const actionExtraData = Helpers_Misc.getExisted(action.getExtraData());
    const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData());
    if (!isFast) {
        await war.showTempUnitMoveAnimation({
            movingUnitAndPath : commonExtraData.getMovingUnitAndPath(),
            aiming            : null,
            callback          : undefined,
        });

        // TODO 焦点部队移动到目标格子的动画
    }

    WarOperations_Executors_Utils_Common.handleCommonExtraData({
        war             : war,
        commonExtraData : commonExtraData,
        isFastExecute   : isFast,
    });

    war.updateTilesAndUnitsOnVisibilityChanged(isFast);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function executeAsInnerWar(war: SinglePlayerWars_War.War, operation: WoUnitCrushUnit, revisedPath: AuxiliaryTypes_MovePath.MovePath): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
    const unitMap                              = war.getUnitMap();
    const pathNodes                            = revisedPath.getNodes().map(v => v.gridIndex);
    const launchUnitId                         = revisedPath.getLaunchUnitId();
    const focusUnit                            = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
    const targetGridIndex                     = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(operation.getTargetGridIndex()));
    const focusUnitDataBeforeAction            = focusUnit.serialize();
    const allTileAppearanceInfosBeforeAction   = war.getTileMap().generateAllTileAppearanceInfos();
    const visibilityArrayFromPathsBeforeAction = war.getFogMap().getVisibilityArrayFromPaths(war.getPlayerIndexInTurn());
    const visibleThingsForEachTeamBeforeAction = war.getVisibleThingsForEachTeam();
    const unitGridIdsForEachTeamBeforeAction   = unitMap.getUnitGridIdArrayForEachTeam();
    const changedThings                       = war.moveUnit({ pathNodes : pathNodes, launchUnitId : launchUnitId, fuelConsumption : revisedPath.getFuelConsumption() });
    unitMap.setUnitOnMap(focusUnit);
    focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

    if (!revisedPath.getIsBlocked()) {
        const targetPlayer = Helpers_Misc.getExisted(unitMap.getUnitOnMap(targetGridIndex)?.getPlayer());
        changedThings.mergeFrom(Destructions_Utils.destroyUnitOnMap(war, targetGridIndex, false));
        changedThings.mergeFrom(war.moveUnit({
            pathNodes       : [pathNodes[pathNodes.length - 1], targetGridIndex],
            launchUnitId    : launchUnitId,
            fuelConsumption : 0,
        }));
        unitMap.setUnitOnMap(focusUnit);

        if ((!targetPlayer.checkIsNeutral()) &&
            (targetPlayer.getAliveState() !== Players_Constants.AliveStateId.Dead) &&
            (!unitMap.checkHasUnitForPlayer(targetPlayer.getPlayerIndex()))
        ) {
            targetPlayer.setAliveState(Players_Constants.AliveStateId.Dying);
            changedThings.addPlayer(targetPlayer);
        }
    }
    changedThings.mergeFrom(WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true));

    return (extraChangedThings, operationId) => WarOperations_Executors_Utils_Common.postProcessInnerWarOperation({
        war                                  : war,
        allTileAppearanceInfosBeforeAction   : allTileAppearanceInfosBeforeAction,
        visibleThingsForEachTeamBeforeAction : visibleThingsForEachTeamBeforeAction,
        visibilityArrayFromPathsBeforeAction : visibilityArrayFromPathsBeforeAction,
        changedThings                        : changedThings.mergeFrom(extraChangedThings),
        thingsForMovePath                    : new AuxiliaryTypes_ThingsForMovePath.ThingsForMovePath(unitGridIdsForEachTeamBeforeAction, focusUnitDataBeforeAction, revisedPath, undefined),
        createMessage                        : commonExtraData => {
            const woContainer = new WoContainer();
            woContainer.setOperationId(operationId);

            const extraData = woContainer.createIfNotExistsWoUnitCrushUnit().createIfNotExistsExtraData();
            extraData.setCommonExtraData(commonExtraData);
            extraData.setTargetGridIndex(revisedPath.getIsBlocked() ? undefined : targetGridIndex.toProto());

            return woContainer;
        },
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function executeAsUnifiedWar(war: BaseWar_Model_War.War, action: WoUnitCrushUnit, isFast: boolean): Promise<void> {
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
        if (!isFast) {
            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : true,
                aiming              : null,
                updateViewAfterMove : true,
            });
        }

    } else {
        const targetGridIndex = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex()));
        const targetPlayer    = Helpers_Misc.getExisted(unitMap.getUnitOnMap(targetGridIndex)?.getPlayer());

        if (!isFast) {
            await focusUnit.moveViewAlongPath({
                pathNodes           : [...pathNodes, targetGridIndex],
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : false,
                aiming              : null,
                updateViewAfterMove : true,
            });
        }

        Destructions_Utils.destroyUnitOnMap(war, targetGridIndex, !isFast);
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

    WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, isFast);

    war.updateTilesAndUnitsOnVisibilityChanged(isFast);
}
