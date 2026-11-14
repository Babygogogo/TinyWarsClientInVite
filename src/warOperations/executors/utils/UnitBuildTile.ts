import {
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_ThingsForMovePath,
    GamePanels_Dict,
    GamePanels_Manager,
    Helpers_Misc,
    Lang_Constants,
    Lang_Utils,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    Players_Constants,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWars_War,
    TestWar_Model_TwWar,
    Units_Constants,
    Users_Model,
    Utils_ClientErrorCode,
    WarOperations_Executors_Utils_Common,
    type AuxiliaryTypes_MovePath,
    type BaseWar_Model_War,
    type WarOperations_Executors_Types,
} from "../../../internal.ts";

import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitBuildTile } from "../../../proto/schema/CommonProto/WarOperation/WoUnitBuildTile.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoUnitBuildTile, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitBuildTile(war, action);
    } else {
        await normalExeUnitBuildTile(war, action);
    }
}

function fastExeUnitBuildTile(war: BaseWar_Model_War.War, action: WoUnitBuildTile): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitBuildTile_00),
            isFastExecute   : true,
        });
    } else {
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

        if (!path.getIsBlocked()) {
            const destination   = focusUnit.getGridIndex();
            const tile          = war.getTileMap().getTile(destination);
            const buildAmount   = Helpers_Misc.getExisted(focusUnit.getBuildAmount());
            const maxBuildPoint = Helpers_Misc.getExisted(tile.getMaxBuildPoint());
            const newBuildPoint = tile.getCurrentBuildPoint() + buildAmount;

            if (newBuildPoint < maxBuildPoint) {
                tile.setCurrentBuildPoint(newBuildPoint);
            } else {
                focusUnit.setCurrentBuildMaterial(focusUnit.getCurrentBuildMaterial() - 1);

                const targetTileCfg = Helpers_Misc.getExisted(focusUnit.getBuildTargetTileCfg(tile.getBaseTypeId(), tile.getObjectTypeId()), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitBuildTile_01);
                tile.resetByTypeAndPlayerIndex({
                    baseType    : targetTileCfg.getDstTileBaseTypeId(),
                    objectType  : targetTileCfg.getDstTileObjectTypeId(),
                    playerIndex : targetTileCfg.getIsDstNeutral() ? Players_Constants.PlayerIndex.Neutral : focusUnit.getPlayerIndex(),
                });
                tile.setCurrentBuildPoint(0);
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitBuildTile(war: BaseWar_Model_War.War, action: WoUnitBuildTile): Promise<void> {
    // const desc = await war.getDescForExeUnitBuildTile(action);
    // (desc) && (FloatText.show(desc));

    const unitMap           = war.getUnitMap();
    const isSelfInTurn      = war.getPlayerInTurn().getUserId() === Users_Model.getSelfUserId();
    const tileMap           = war.getTileMap();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData   = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitBuildTile_00);
        const movingUnitAndPath = commonExtraData.getMovingUnitAndPath();
        await war.showTempUnitMoveAnimation({
            movingUnitAndPath : movingUnitAndPath,
            aiming            : null,
            callback          : async () => {
                const movingPath    = movingUnitAndPath?.getPath();
                const lastNode      = movingPath ? movingPath[movingPath.length - 1] : null;
                if ((isSelfInTurn) && (lastNode) && (!lastNode.getIsBlocked())) {
                    const gridIndex             = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(lastNode.getGridIndex()));
                    const tile                  = tileMap.getTile(gridIndex);
                    const maxBuildPoint         = Helpers_Misc.getExisted(tile.getMaxBuildPoint());
                    const currentBuildPoint     = tile.getCurrentBuildPoint();
                    const tileDataAfterAction   = Helpers_Misc.getExisted(
                        commonExtraData
                            .getTileArrayAfterAction()
                            .find(v =>
                                gridIndex.checkIsEqual(Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v.getGridIndex()))),
                            ),
                        Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitBuildTile_01,
                    );
                    const rawNewBuildPoint = tileDataAfterAction.getCurrentBuildPoint();

                    await new Promise<void>(resolve => {
                        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwCaptureProgressPanel, {
                            maxValue     : maxBuildPoint,
                            currentValue : currentBuildPoint,
                            newValue     : rawNewBuildPoint > currentBuildPoint
                                ? rawNewBuildPoint
                                : Math.max(rawNewBuildPoint, maxBuildPoint),
                            callbackOnFinish : () => resolve(),
                        });
                    });
                }
            },
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
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({
            pathNodes       : pathNodes,
            launchUnitId    : launchUnitId,
            fuelConsumption : path.getFuelConsumption(),
        });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        if (path.getIsBlocked()) {
            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : true,
                aiming              : null,
                updateViewAfterMove : true,
            });

        } else {
            const destination       = focusUnit.getGridIndex();
            const tile              = war.getTileMap().getTile(destination);
            const buildAmount       = Helpers_Misc.getExisted(focusUnit.getBuildAmount());
            const maxBuildPoint     = Helpers_Misc.getExisted(tile.getMaxBuildPoint());
            const currentBuildPoint = tile.getCurrentBuildPoint();
            const newBuildPoint     = currentBuildPoint + buildAmount;

            if (newBuildPoint < maxBuildPoint) {
                tile.setCurrentBuildPoint(newBuildPoint);
            } else {
                focusUnit.setCurrentBuildMaterial(focusUnit.getCurrentBuildMaterial() - 1);

                const targetTileCfg = Helpers_Misc.getExisted(focusUnit.getBuildTargetTileCfg(tile.getBaseTypeId(), tile.getObjectTypeId()), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitBuildTile_01);
                tile.resetByTypeAndPlayerIndex({
                    baseType    : targetTileCfg.getDstTileBaseTypeId(),
                    objectType  : targetTileCfg.getDstTileObjectTypeId(),
                    playerIndex : targetTileCfg.getIsDstNeutral() ? Players_Constants.PlayerIndex.Neutral : focusUnit.getPlayerIndex(),
                });
                tile.setCurrentBuildPoint(0);
            }

            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : false,
                aiming              : null,
                updateViewAfterMove : false,
            });
            if (isSelfInTurn) {
                await new Promise<void>(resolve => {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwCaptureProgressPanel, {
                        maxValue         : maxBuildPoint,
                        newValue         : newBuildPoint,
                        currentValue     : currentBuildPoint,
                        callbackOnFinish : () => resolve(),
                    });
                });
            }
            focusUnit.flushDataToView();
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function executeForInnerWar(war: SinglePlayerWars_War.War, operation: WoUnitBuildTile, revisedPath: AuxiliaryTypes_MovePath.MovePath): WarOperations_Executors_Types.ExecutionResultForInnerWarOperation {
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
        const tile          = war.getTileMap().getTile(focusUnit.getGridIndex());
        const buildAmount   = Helpers_Misc.getExisted(focusUnit.getBuildAmount());
        const maxBuildPoint = Helpers_Misc.getExisted(tile.getMaxBuildPoint());
        const newBuildPoint = tile.getCurrentBuildPoint() + buildAmount;
        if (newBuildPoint < maxBuildPoint) {
            tile.setCurrentBuildPoint(newBuildPoint);
        } else {
            focusUnit.setCurrentBuildMaterial(focusUnit.getCurrentBuildMaterial() - 1);
            const targetTileCfg = Helpers_Misc.getExisted(focusUnit.getBuildTargetTileCfg(tile.getBaseTypeId(), tile.getObjectTypeId()));
            tile.resetByTypeAndPlayerIndex({
                baseType    : targetTileCfg.getDstTileBaseTypeId(),
                objectType  : targetTileCfg.getDstTileObjectTypeId(),
                playerIndex : targetTileCfg.getIsDstNeutral() ? Players_Constants.PlayerIndex.Neutral : focusUnit.getPlayerIndex(),
            });
            tile.setCurrentBuildPoint(0);
        }
        changedThings.addTile(tile);
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
            woContainer.createIfNotExistsWoUnitBuildTile().createIfNotExistsExtraData().setCommonExtraData(commonExtraData);

            return woContainer;
        },
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoUnitBuildTile): Promise<string | null> {
    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0099)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWars_War.War) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
