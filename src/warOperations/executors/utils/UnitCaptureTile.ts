import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import * as AuxiliaryTypesMovePath from "../../../auxiliaryTypes/MovePath.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../../mapEditor/interface/IMeWar.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../../../multiPlayerWar/interface/IMpwWar.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoUnitCaptureTile from "../../../proto/schema/CommonProto/WarOperation/WoUnitCaptureTile.ts";
import type * as ReplayWarInterfaceIRwWarBase from "../../../replayWar/interface/IRwWarBase.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type * as TestWarInterfaceITwWar from "../../../testWar/interface/ITwWar.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import * as UsersModel from "../../../users/Model.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as WarOperationsExecutorsUtilsCommon from "./Common.ts";

type WoUnitCaptureTile  = ProtoSchemaCommonProtoWarOperationWoUnitCaptureTile.WoUnitCaptureTile;
type IBwWar             = BaseWarInterfaceIBwWar.IBwWar;

let _meWarClass     : new () => MapEditorInterfaceIMeWar.IMeWar;
let _mpwWarClass    : new () => MultiPlayerWarInterfaceIMpwWar.IMpwWar;
let _rwWarBaseClass : new () => ReplayWarInterfaceIRwWarBase.IRwWarBase;
let _spwWarClass    : new () => SinglePlayerWarInterfaceISpwWar.ISpwWar;
let _twWarClass     : new () => TestWarInterfaceITwWar.ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoUnitCaptureTile, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitCaptureTile(war, action);
    } else {
        await normalExeUnitCaptureTile(war, action);
    }
}

function fastExeUnitCaptureTile(war: IBwWar, action: WoUnitCaptureTile): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war,
            commonExtraData : HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitCaptureTile_00),
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
            const destination       = focusUnit.getGridIndex();
            const tile              = war.getTileMap().getTile(destination);
            const captureAmount     = HelpersMisc.getExisted(focusUnit.getFinalCaptureAmount(destination));
            const maxCapturePoint   = HelpersMisc.getExisted(tile.getMaxCapturePoint());
            const newCapturePoint   = (tile.getCurrentCapturePoint() ?? 0) + captureAmount;

            if (newCapturePoint < maxCapturePoint) {
                tile.setCurrentCapturePoint(newCapturePoint);
            } else {
                if (tile.getIsDefeatedOnCapture()) {
                    tile.getPlayer().setAliveState(PlayersConstants.AliveStateId.Dying);
                }

                tile.resetByTypeAndPlayerIndex({
                    baseType    : tile.getBaseType(),
                    objectType  : tile.getTemplateCfg().getTileObjectTypeIdAfterOwnerChanged() ?? tile.getObjectType(),
                    playerIndex : focusUnit.getPlayerIndex(),
                });
                tile.setCurrentCapturePoint(0);
            }
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitCaptureTile(war: IBwWar, action: WoUnitCaptureTile): Promise<void> {
    // const desc = await war.getDescForExeUnitCaptureTile(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData   = action.getExtraData();
    const unitMap           = war.getUnitMap();
    const tileMap           = war.getTileMap();
    const playerInTurn      = war.getPlayerInTurn();
    const isSelfInTurn      = playerInTurn.getUserId() === UsersModel.getSelfUserId();
    if (actionExtraData) {
        const commonExtraData       = HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitCaptureTile_00);
        const movingUnitAndPath     = commonExtraData.getMovingUnitAndPath();
        const extraUnit             = await war.moveExtraUnit({
            movingUnitAndPath,
            aiming                  : null,
            deleteViewAfterMoving   : false,
        });

        {
            const movingPath    = movingUnitAndPath?.getPath();
            const lastNode      = movingPath ? movingPath[movingPath.length - 1] : null;
            if ((isSelfInTurn) && (lastNode) && (!lastNode.getIsBlocked())) {
                const gridIndex             = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(lastNode.getGridIndex()), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitCaptureTile_01);
                const tile                  = tileMap.getTile(gridIndex);
                const maxCapturePoint       = HelpersMisc.getExisted(tile.getMaxCapturePoint(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitCaptureTile_02);
                const currentCapturePoint   = tile.getCurrentCapturePoint();
                const tileDataAfterAction   = HelpersMisc.getExisted(
                    commonExtraData
                        .getTileArrayAfterAction()
                        .find(v =>
                            gridIndex.checkIsEqual(HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(v.getGridIndex())))
                        ),
                    UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitCaptureTile_04
                );
                const rawNewCapturePoint   = tileDataAfterAction.getCurrentCapturePoint();

                await new Promise<void>(resolve => {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwCaptureProgressPanel, {
                        maxValue            : maxCapturePoint,
                        currentValue        : currentCapturePoint,
                        newValue            : rawNewCapturePoint > currentCapturePoint
                            ? rawNewCapturePoint
                            : Math.max(rawNewCapturePoint, maxCapturePoint),
                        callbackOnFinish    : () => resolve(),
                    });
                });
            }
        }

        if (extraUnit) {
            unitMap.getView().removeUnit(extraUnit.getView());
            extraUnit.stopRunning();
        }

        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute       : false,
        });

    } else {
        const path          = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
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
            const destination           = focusUnit.getGridIndex();
            const tile                  = war.getTileMap().getTile(destination);
            const captureAmount         = HelpersMisc.getExisted(focusUnit.getFinalCaptureAmount(destination));
            const maxCapturePoint       = HelpersMisc.getExisted(tile.getMaxCapturePoint());
            const currentCapturePoint   = tile.getCurrentCapturePoint() ?? 0;
            const newCapturePoint       = currentCapturePoint + captureAmount;

            if (newCapturePoint < maxCapturePoint) {
                tile.setCurrentCapturePoint(newCapturePoint);
            } else {
                if (tile.getIsDefeatedOnCapture()) {
                    tile.getPlayer().setAliveState(PlayersConstants.AliveStateId.Dying);
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
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwCaptureProgressPanel, {
                        maxValue            : maxCapturePoint,
                        newValue            : newCapturePoint,
                        currentValue        : currentCapturePoint,
                        callbackOnFinish    : () => resolve(),
                    });
                });
            }
            focusUnit.updateView();
            tile.flushDataToView();
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitCaptureTile): Promise<string | null> {
    _meWarClass     ??= GameHelpersGhFactory.getMeWarClass();
    _mpwWarClass    ??= GameHelpersGhFactory.getMpwWarClass();
    _rwWarBaseClass ??= GameHelpersGhFactory.getRwWarBaseClass();
    _spwWarClass    ??= GameHelpersGhFactory.getSpwWarClass();
    _twWarClass     ??= GameHelpersGhFactory.getTwWarClass();

    if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        return null;
    } else if (war instanceof _rwWarBaseClass) {
        return `${LangUtils.getText(LangConstants.TextType.B0100)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
