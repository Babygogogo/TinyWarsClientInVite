import {
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_ThingsForMovePath,
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
    WarOperations_Executors_Utils_Common,
    WarOperations_Executors_Types,
    type AuxiliaryTypes_MovePath,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

import type { WoUnitLaunchFlare } from "../../../proto/schema/CommonProto/WarOperation/WoUnitLaunchFlare.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoUnitLaunchFlare, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitLaunchFlare(war, action);
    } else {
        await normalExeUnitLaunchFlare(war, action);
    }
}

function fastExeUnitLaunchFlare(war: BaseWar_Model_War.War, action: WoUnitLaunchFlare): void {
    const fogMap            = war.getFogMap();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitLaunchFlare_01),
            isFastExecute   : true,
        });
    } else {
        const path          = Helpers_Misc.getExisted(action.getPath());
        const pathNodes     = path.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({
            pathNodes       : pathNodes,
            launchUnitId    : launchUnitId,
            fuelConsumption : path.getFuelConsumption(),
        });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        if (!path.getIsBlocked()) {
            focusUnit.setFlareCurrentAmmo(focusUnit.getFlareCurrentAmmo() - 1);
            fogMap.updateMapFromPathsByFlare(
                focusUnit.getPlayerIndex(),
                Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex())),
                Helpers_Misc.getExisted(focusUnit.getFlareRadius(pathNodes[pathNodes.length - 1])),
            );
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitLaunchFlare(war: BaseWar_Model_War.War, action: WoUnitLaunchFlare): Promise<void> {
    // const desc = await war.getDescForExeUnitLaunchFlare(action);
    // (desc) && (FloatText.show(desc));

    const gridVisualEffect  = war.getGridVisualEffect();
    const mapSize           = war.getTileMap().getMapSize();
    const fogMap            = war.getFogMap();
    const playerIndexInTurn = war.getPlayerIndexInTurn();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitLaunchFlare_00);
        await war.showTempUnitMoveAnimation({
            movingUnitAndPath : commonExtraData.getMovingUnitAndPath(),
            aiming            : null,
            callback          : undefined,
        });

        const targetGridIndex   = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(actionExtraData.getTargetGridIndex());
        if (targetGridIndex) {
            const flareRadius = Helpers_Misc.getExisted(actionExtraData.getFlareRadius(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitLaunchFlare_01);
            for (const grid of targetGridIndex.getGridsWithinDistance({ minDistance : 0, maxDistance : flareRadius, mapSize : mapSize })) {
                gridVisualEffect?.showEffectFlare(grid);
            }
        }

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : commonExtraData,
            isFastExecute   : false,
        });

    } else {
        const path          = Helpers_Misc.getExisted(action.getPath());
        const pathNodes     = path.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({
            pathNodes       : pathNodes,
            launchUnitId    : launchUnitId,
            fuelConsumption : path.getFuelConsumption(),
        });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        const isFlareSucceeded  = !path.getIsBlocked();
        const flareRadius       = Helpers_Misc.getExisted(focusUnit.getFlareRadius(pathNodes[pathNodes.length - 1]));
        const targetGridIndex   = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex());
        if (isFlareSucceeded) {
            if (targetGridIndex == null) {
                throw Helpers_Misc.newError(`Empty targetGridIndex.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitLaunchFlare_02);
            }

            focusUnit.setFlareCurrentAmmo(focusUnit.getFlareCurrentAmmo() - 1);
            fogMap.updateMapFromPathsByFlare(playerIndexInTurn, targetGridIndex, flareRadius);
        }

        await focusUnit.moveViewAlongPath({
            pathNodes           : pathNodes,
            isDiving            : focusUnit.getIsDiving(),
            isBlocked           : path.getIsBlocked(),
            aiming              : null,
            updateViewAfterMove : true,
        });
        if ((isFlareSucceeded) && (war.getPlayerManager().getWatcherTeamIndexesForSelf().has(focusUnit.getTeamIndex()))) {
            if (targetGridIndex == null) {
                throw Helpers_Misc.newError(`Empty targetGridIndex.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitLaunchFlare_03);
            }

            for (const grid of targetGridIndex.getGridsWithinDistance({ minDistance : 0, maxDistance : flareRadius, mapSize : mapSize })) {
                gridVisualEffect?.showEffectFlare(grid);
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function executeForInnerWar(war: SinglePlayerWars_War.War, operation: WoUnitLaunchFlare, revisedPath: AuxiliaryTypes_MovePath.MovePath): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
    const unitMap                              = war.getUnitMap();
    const pathNodes                            = revisedPath.getNodes().map(v => v.gridIndex);
    const launchUnitId                         = revisedPath.getLaunchUnitId();
    const focusUnit                            = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
    const targetGridIndex                      = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(operation.getTargetGridIndex()));
    const focusUnitDataBeforeAction            = focusUnit.serialize();
    const allTileAppearanceInfosBeforeAction   = war.getTileMap().generateAllTileAppearanceInfos();
    const visibilityArrayFromPathsBeforeAction = war.getFogMap().getVisibilityArrayFromPaths(war.getPlayerIndexInTurn());
    const visibleThingsForEachTeamBeforeAction = war.getVisibleThingsForEachTeam();
    const unitGridIdsForEachTeamBeforeAction   = unitMap.getUnitGridIdArrayForEachTeam();
    const changedThings                        = war.moveUnit({ pathNodes : pathNodes, launchUnitId : launchUnitId, fuelConsumption : revisedPath.getFuelConsumption() });
    const flareRadius                          = Helpers_Misc.getExisted(focusUnit.getFlareRadius(pathNodes[pathNodes.length - 1]));
    unitMap.setUnitOnMap(focusUnit);
    focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

    if (!revisedPath.getIsBlocked()) {
        focusUnit.setFlareCurrentAmmo(focusUnit.getFlareCurrentAmmo() - 1);
        war.getFogMap().updateMapFromPathsByFlare(focusUnit.getPlayerIndex(), targetGridIndex, flareRadius);
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

            const extraData = woContainer.createIfNotExistsWoUnitLaunchFlare().createIfNotExistsExtraData();
            extraData.setCommonExtraData(commonExtraData);

            if (!revisedPath.getIsBlocked()) {
                extraData.setTargetGridIndex(targetGridIndex.toProto());
                extraData.setFlareRadius(flareRadius);
            }

            return woContainer;
        },
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoUnitLaunchFlare): Promise<string | null> {
    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0104)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWars_War.War) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
