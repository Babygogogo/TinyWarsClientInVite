import {
    AuxiliaryTypes_GridIndex,
    MapEditor_Model_MeWar,
    AuxiliaryTypes_MovePath,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWar_Model_SpwWar,
    TestWar_Model_TwWar,
    type BaseWar_Interface_IBwWar,
    Units_Constants,
    Players_Constants,
    Utils_ClientErrorCode,
    GamePanels_Dict,
    Helpers_Misc,
    Users_Model,
    Lang_Utils,
    WarOperations_Executors_Utils_Common,
    GamePanels_Manager,
    Lang_Constants,
} from "../../../internal.ts";

import type { WoUnitCaptureTile } from "../../../proto/schema/CommonProto/WarOperation/WoUnitCaptureTile.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitCaptureTile, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitCaptureTile(war, action);
    } else {
        await normalExeUnitCaptureTile(war, action);
    }
}

function fastExeUnitCaptureTile(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitCaptureTile): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitCaptureTile_00),
            isFastExecute   : true,
        });
    } else {
        const path          = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption : path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        if (path.isBlocked) {
            // nothing to do.
        } else {
            const destination       = focusUnit.getGridIndex();
            const tile              = war.getTileMap().getTile(destination);
            const captureAmount     = Helpers_Misc.getExisted(focusUnit.getFinalCaptureAmount(destination));
            const maxCapturePoint   = Helpers_Misc.getExisted(tile.getMaxCapturePoint());
            const newCapturePoint   = (tile.getCurrentCapturePoint()) + captureAmount;

            if (newCapturePoint < maxCapturePoint) {
                tile.setCurrentCapturePoint(newCapturePoint);
            } else {
                if (tile.getIsDefeatedOnCapture()) {
                    tile.getPlayer().setAliveState(Players_Constants.AliveStateId.Dying);
                }

                tile.resetByTypeAndPlayerIndex({
                    baseType    : tile.getBaseType(),
                    objectType  : tile.getTemplateCfg().getTileObjectTypeIdAfterOwnerChanged() ?? tile.getObjectType(),
                    playerIndex : focusUnit.getPlayerIndex(),
                });
                tile.setCurrentCapturePoint(0);
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitCaptureTile(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitCaptureTile): Promise<void> {
    // const desc = await war.getDescForExeUnitCaptureTile(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData   = action.getExtraData();
    const unitMap           = war.getUnitMap();
    const tileMap           = war.getTileMap();
    const playerInTurn      = war.getPlayerInTurn();
    const isSelfInTurn      = playerInTurn.getUserId() === Users_Model.getSelfUserId();
    if (actionExtraData) {
        const commonExtraData       = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitCaptureTile_00);
        const movingUnitAndPath     = commonExtraData.getMovingUnitAndPath();
        const extraUnit             = await war.moveExtraUnit({
            movingUnitAndPath,
            aiming                : null,
            deleteViewAfterMoving : false,
        });

        {
            const movingPath    = movingUnitAndPath?.getPath();
            const lastNode      = movingPath ? movingPath[movingPath.length - 1] : null;
            if ((isSelfInTurn) && (lastNode) && (!lastNode.getIsBlocked())) {
                const gridIndex             = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(lastNode.getGridIndex()), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitCaptureTile_01);
                const tile                  = tileMap.getTile(gridIndex);
                const maxCapturePoint       = Helpers_Misc.getExisted(tile.getMaxCapturePoint(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitCaptureTile_02);
                const currentCapturePoint   = tile.getCurrentCapturePoint();
                const tileDataAfterAction   = Helpers_Misc.getExisted(
                    commonExtraData
                        .getTileArrayAfterAction()
                        .find(v =>
                            gridIndex.checkIsEqual(Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v.getGridIndex()))),
                        ),
                    Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitCaptureTile_04,
                );
                const rawNewCapturePoint   = tileDataAfterAction.getCurrentCapturePoint();

                await new Promise<void>(resolve => {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwCaptureProgressPanel, {
                        maxValue     : maxCapturePoint,
                        currentValue : currentCapturePoint,
                        newValue     : rawNewCapturePoint > currentCapturePoint
                            ? rawNewCapturePoint
                            : Math.max(rawNewCapturePoint, maxCapturePoint),
                        callbackOnFinish : () => resolve(),
                    });
                });
            }
        }

        if (extraUnit) {
            unitMap.getView().removeUnit(extraUnit.getView());
            extraUnit.stopRunning();
        }

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute : false,
        });

    } else {
        const path          = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption : path.fuelConsumption });
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
            const destination           = focusUnit.getGridIndex();
            const tile                  = war.getTileMap().getTile(destination);
            const captureAmount         = Helpers_Misc.getExisted(focusUnit.getFinalCaptureAmount(destination));
            const maxCapturePoint       = Helpers_Misc.getExisted(tile.getMaxCapturePoint());
            const currentCapturePoint   = tile.getCurrentCapturePoint();
            const newCapturePoint       = currentCapturePoint + captureAmount;

            if (newCapturePoint < maxCapturePoint) {
                tile.setCurrentCapturePoint(newCapturePoint);
            } else {
                if (tile.getIsDefeatedOnCapture()) {
                    tile.getPlayer().setAliveState(Players_Constants.AliveStateId.Dying);
                }

                tile.resetByTypeAndPlayerIndex({
                    baseType    : tile.getBaseType(),
                    objectType  : tile.getTemplateCfg().getTileObjectTypeIdAfterOwnerChanged() ?? tile.getObjectType(),
                    playerIndex : focusUnit.getPlayerIndex(),
                });
                tile.setCurrentCapturePoint(0);
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
                        maxValue         : maxCapturePoint,
                        newValue         : newCapturePoint,
                        currentValue     : currentCapturePoint,
                        callbackOnFinish : () => resolve(),
                    });
                });
            }
            focusUnit.updateView();
            tile.flushDataToView();
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitCaptureTile): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0100)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
