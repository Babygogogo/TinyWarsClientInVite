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
    Visibilities_Utils,
    WarOperations_Executors_Utils_Common,
    type AuxiliaryTypes_MovePath,
    type BaseWar_Model_War,
    type WarOperations_Executors_Types,
} from "../../../internal.ts";

import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitSurface } from "../../../proto/schema/CommonProto/WarOperation/WoUnitSurface.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoUnitSurface, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitSurface(war, action);
    } else {
        await normalExeUnitSurface(war, action);
    }
}

function fastExeUnitSurface(war: BaseWar_Model_War.War, action: WoUnitSurface): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitSurface_00),
            isFastExecute   : true,
        });
    } else {
        const unitMap       = war.getUnitMap();
        const path          = Helpers_Misc.getExisted(action.getPath());
        const pathNodes     = path.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        const isSuccessful  = !path.getIsBlocked();
        war.moveUnit({
            pathNodes       : pathNodes,
            launchUnitId    : launchUnitId,
            fuelConsumption : path.getFuelConsumption(),
        });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);
        if (isSuccessful) {
            focusUnit.setIsDiving(false);
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitSurface(war: BaseWar_Model_War.War, action: WoUnitSurface): Promise<void> {
    // const desc = await war.getDescForExeUnitSurface(action);
    // (desc) && (FloatText.show(desc));

    const gridVisualEffect  = war.getGridVisualEffect();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData   = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitSurface_00);
        const movingUnitAndPath = commonExtraData.getMovingUnitAndPath();
        await war.showTempUnitMoveAnimation({
            movingUnitAndPath : movingUnitAndPath,
            aiming            : null,
            callback          : undefined,
        });

        const movingPath    = movingUnitAndPath?.getPath();
        const lastNode      = movingPath ? movingPath[movingPath?.length - 1] : null;
        if ((lastNode?.getIsVisible()) && (!lastNode.getIsBlocked())) {
            gridVisualEffect?.showEffectSurface(Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(lastNode.getGridIndex()), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitSurface_01));
        }

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : commonExtraData,
            isFastExecute   : false,
        });

    } else {
        const unitMap       = war.getUnitMap();
        const path          = Helpers_Misc.getExisted(action.getPath());
        const pathNodes     = path.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        const isSuccessful  = !path.getIsBlocked();
        war.moveUnit({
            pathNodes       : pathNodes,
            launchUnitId    : launchUnitId,
            fuelConsumption : path.getFuelConsumption(),
        });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);
        if (isSuccessful) {
            focusUnit.setIsDiving(false);
        }

        await focusUnit.moveViewAlongPath({
            pathNodes           : pathNodes,
            isDiving            : true,
            isBlocked           : path.getIsBlocked(),
            aiming              : null,
            updateViewAfterMove : true,
        });
        if (isSuccessful) {
            const endingGridIndex = pathNodes[pathNodes.length - 1];
            if (Visibilities_Utils.checkIsUnitOnMapVisibleToTeams({
                war                 : war,
                unitType            : focusUnit.getUnitTypeId(),
                unitPlayerIndex     : focusUnit.getPlayerIndex(),
                gridIndex           : endingGridIndex,
                observerTeamIndexes : war.getPlayerManager().getWatcherTeamIndexesForSelf(),
                isDiving            : false,
                isInvisible         : focusUnit.checkIsInvisible(endingGridIndex),
            })) {
                gridVisualEffect?.showEffectSurface(endingGridIndex);
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function executeForInnerWar(war: SinglePlayerWars_War.War, operation: WoUnitSurface, revisedPath: AuxiliaryTypes_MovePath.MovePath): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
    const unitMap                               = war.getUnitMap();
    const pathNodes                             = revisedPath.getNodes().map(v => v.gridIndex);
    const launchUnitId                          = revisedPath.getLaunchUnitId();
    const focusUnit                             = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
    const focusUnitDataBeforeAction             = focusUnit.serialize();
    const allTileAppearanceInfosBeforeAction    = war.getTileMap().generateAllTileAppearanceInfos();
    const visibilityArrayFromPathsBeforeAction  = war.getFogMap().getVisibilityArrayFromPaths(war.getPlayerIndexInTurn());
    const visibleThingsForEachTeamBeforeAction  = war.getVisibleThingsForEachTeam();
    const unitGridIdsForEachTeamBeforeAction    = unitMap.getUnitGridIdArrayForEachTeam();
    const changedThings                         = war.moveUnit({
        pathNodes       : pathNodes,
        launchUnitId    : launchUnitId,
        fuelConsumption : revisedPath.getFuelConsumption(),
    });
    unitMap.setUnitOnMap(focusUnit);
    focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

    if (!revisedPath.getIsBlocked()) {
        focusUnit.setIsDiving(false);
    }
    changedThings.mergeFrom(WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true));

    return (extraChangedThings, operationId) => WarOperations_Executors_Utils_Common.postProcessInnerWarOperation({
        war                                  : war,
        allTileAppearanceInfosBeforeAction   : allTileAppearanceInfosBeforeAction,
        visibleThingsForEachTeamBeforeAction : visibleThingsForEachTeamBeforeAction,
        visibilityArrayFromPathsBeforeAction : visibilityArrayFromPathsBeforeAction,
        changedThings                        : changedThings.mergeFrom(extraChangedThings),
        thingsForMovePath                    : new AuxiliaryTypes_ThingsForMovePath.ThingsForMovePath(
            unitGridIdsForEachTeamBeforeAction,
            focusUnitDataBeforeAction,
            revisedPath,
            undefined,
        ),
        createMessage : commonExtraData => {
            const woContainer = new WoContainer();
            woContainer.setOperationId(operationId);
            woContainer.createIfNotExistsWoUnitSurface().createIfNotExistsExtraData().setCommonExtraData(commonExtraData);

            return woContainer;
        },
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoUnitSurface): Promise<string | null> {
    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0108)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWars_War.War) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
