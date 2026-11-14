import {
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_ThingsForMovePath,
    DamageCalculators_Utils,
    Helpers_Misc,
    Lang_Constants,
    Lang_Utils,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWars_War,
    TestWar_Model_TwWar,
    Units_Constants,
    Utils_ClientErrorCode,
    Visibilities_Utils,
    WarOperations_Executors_Utils_Common,
    WarOperations_Executors_Types,
    type AuxiliaryTypes_MovePath,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

import type { WoUnitAttackTile } from "../../../proto/schema/CommonProto/WarOperation/WoUnitAttackTile.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoUnitAttackTile, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitAttackTile(war, action);
    } else {
        await normalExeUnitAttackTile(war, action);
    }
}

function fastExeUnitAttackTile(war: BaseWar_Model_War.War, action: WoUnitAttackTile): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitAttackTile_00),
            isFastExecute   : true,
        });

    } else {
        const path          = Helpers_Misc.getExisted(action.getPath());
        const pathNodes     = path.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
        const launchUnitId  = action.getLaunchUnitId();
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        if (path.getIsBlocked()) {
            war.moveUnit({
                pathNodes       : pathNodes,
                launchUnitId    : launchUnitId,
                fuelConsumption : path.getFuelConsumption(),
            });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        } else {
            const maxAttackRange1       = focusUnit.getFinalMaxAttackRange();
            const canAttackAfterMoving1 = focusUnit.getFinalCanAttackAfterMoving();
            war.moveUnit({
                pathNodes       : pathNodes,
                launchUnitId    : launchUnitId,
                fuelConsumption : path.getFuelConsumption(),
            });
            unitMap.setUnitOnMap(focusUnit);

            const battleInfo = DamageCalculators_Utils.runBattleForAttackTile({
                war                   : war,
                movePath1             : pathNodes,
                launchUnitId1         : launchUnitId,
                maxAttackRange1       : maxAttackRange1,
                canAttackAfterMoving1 : canAttackAfterMoving1,
                gridIndex2            : Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex())),
                maxAttackRange2       : null,
                canAttackAfterMoving2 : false,
            });
            focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

            const unitMapView = unitMap.getView();
            for (const [, unit] of battleInfo.destroyedUnits) {
                const view = unit.getView();
                if (view) {
                    unitMapView?.deleteUnitView(view);
                }
                unit.dispose();
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}
async function normalExeUnitAttackTile(war: BaseWar_Model_War.War, action: WoUnitAttackTile): Promise<void> {
    // const desc = await war.getDescForExeUnitAttackTile(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitAttackTile_00);
        const targetGridIndex = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(actionExtraData.getTargetGridIndex());
        await war.showTempUnitMoveAnimation({
            movingUnitAndPath : commonExtraData.getMovingUnitAndPath(),
            aiming            : targetGridIndex == null ? null : [targetGridIndex],
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
        if (path.getIsBlocked()) {
            war.moveUnit({
                pathNodes       : pathNodes,
                launchUnitId    : launchUnitId,
                fuelConsumption : path.getFuelConsumption(),
            });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : true,
                aiming              : null,
                updateViewAfterMove : true,
            });

        } else {
            const maxAttackRange1       = focusUnit.getFinalMaxAttackRange();
            const canAttackAfterMoving1 = focusUnit.getFinalCanAttackAfterMoving();
            war.moveUnit({
                pathNodes       : pathNodes,
                launchUnitId    : launchUnitId,
                fuelConsumption : path.getFuelConsumption(),
            });
            unitMap.setUnitOnMap(focusUnit);

            const gridIndex2        = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex()), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitAttackTile_01);
            const allVisibleUnits   = Visibilities_Utils.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getWatcherTeamIndexesForSelf());
            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : false,
                aiming              : gridIndex2,
                updateViewAfterMove : false,
            });

            const battleInfo = DamageCalculators_Utils.runBattleForAttackTile({
                war                   : war,
                movePath1             : pathNodes,
                launchUnitId1         : launchUnitId,
                maxAttackRange1       : maxAttackRange1,
                canAttackAfterMoving1 : canAttackAfterMoving1,
                gridIndex2            : gridIndex2,
                maxAttackRange2       : null,
                canAttackAfterMoving2 : false,
            });
            focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

            WarOperations_Executors_Utils_Common.handleViewForBattle(battleInfo, war, allVisibleUnits);
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function executeForInnerWar(war: SinglePlayerWars_War.War, operation: WoUnitAttackTile, revisedPath: AuxiliaryTypes_MovePath.MovePath): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
    const unitMap                              = war.getUnitMap();
    const pathNodes                            = revisedPath.getNodes().map(v => v.gridIndex);
    const launchUnitId                         = revisedPath.getLaunchUnitId();
    const focusUnit                            = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
    const focusUnitDataBeforeAction            = focusUnit.serialize();
    const allTileAppearanceInfosBeforeAction   = war.getTileMap().generateAllTileAppearanceInfos();
    const visibilityArrayFromPathsBeforeAction = war.getFogMap().getVisibilityArrayFromPaths(war.getPlayerIndexInTurn());
    const visibleThingsForEachTeamBeforeAction = war.getVisibleThingsForEachTeam();
    const unitGridIdsForEachTeamBeforeAction   = unitMap.getUnitGridIdArrayForEachTeam();

    if (revisedPath.getIsBlocked()) {
        const changedThings = war.moveUnit({
            pathNodes       : pathNodes,
            launchUnitId    : launchUnitId,
            fuelConsumption : revisedPath.getFuelConsumption(),
        });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);
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
                woContainer.createIfNotExistsWoUnitAttackTile().createIfNotExistsExtraData().setCommonExtraData(commonExtraData);

                return woContainer;
            },
        });

    } else {
        const targetGridIndex       = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(operation.getTargetGridIndex()));
        const maxAttackRange1       = focusUnit.getFinalMaxAttackRange();
        const canAttackAfterMoving1 = focusUnit.getFinalCanAttackAfterMoving();
        const changedThings         = war.moveUnit({
            pathNodes       : pathNodes,
            launchUnitId    : launchUnitId,
            fuelConsumption : revisedPath.getFuelConsumption(),
        });
        unitMap.setUnitOnMap(focusUnit);

        const battleInfo = DamageCalculators_Utils.runBattleForAttackTile({
            war                   : war,
            movePath1             : pathNodes,
            launchUnitId1         : launchUnitId,
            maxAttackRange1       : maxAttackRange1,
            canAttackAfterMoving1 : canAttackAfterMoving1,
            gridIndex2            : targetGridIndex,
            maxAttackRange2       : null,
            canAttackAfterMoving2 : false,
        });
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);
        changedThings.addUnit(focusUnit);
        changedThings.mergeFrom(battleInfo.changedThings);
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

                const extraData = woContainer.createIfNotExistsWoUnitAttackTile().createIfNotExistsExtraData();
                extraData.setCommonExtraData(commonExtraData);
                extraData.setTargetGridIndex(targetGridIndex.toProto());

                return woContainer;
            },
        });
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoUnitAttackTile): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0097)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWars_War.War) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
