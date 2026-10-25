import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import { MovePath } from "../../../auxiliaryTypes/MovePath.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { getMeWarClass, getMpwWarClass, getRwWarBaseClass, getSpwWarClass, getTwWarClass } from "../../../gameHelpers/GhFactory.ts";
import { getDict } from "../../../gamePanels/Dict.ts";
import { openPanel } from "../../../gamePanels/Manager.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
import type { IMpwWar } from "../../../multiPlayerWar/interface/IMpwWar.ts";
import { AliveStateId } from "../../../players/Constants.ts";
import type { WoUnitCaptureTile } from "../../../proto/schema/CommonProto/WarOperation/WoUnitCaptureTile.ts";
import type { IRwWarBase } from "../../../replayWar/interface/IRwWarBase.ts";
import type { ISpwWar } from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type { ITwWar } from "../../../testWar/interface/ITwWar.ts";
import { ActionStateId } from "../../../units/Constants.ts";
import { getSelfUserId } from "../../../users/Model.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { handleCommonExtraData, handlePostOperationPlunder } from "./Common.ts";

let _meWarClass     : new () => IMeWar;
let _mpwWarClass    : new () => IMpwWar;
let _rwWarBaseClass : new () => IRwWarBase;
let _spwWarClass    : new () => ISpwWar;
let _twWarClass     : new () => ITwWar;

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
        handleCommonExtraData({
            war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_FastExeUnitCaptureTile_00),
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
            const destination       = focusUnit.getGridIndex();
            const tile              = war.getTileMap().getTile(destination);
            const captureAmount     = getExisted(focusUnit.getFinalCaptureAmount(destination));
            const maxCapturePoint   = getExisted(tile.getMaxCapturePoint());
            const newCapturePoint   = (tile.getCurrentCapturePoint() ?? 0) + captureAmount;

            if (newCapturePoint < maxCapturePoint) {
                tile.setCurrentCapturePoint(newCapturePoint);
            } else {
                if (tile.getIsDefeatedOnCapture()) {
                    tile.getPlayer().setAliveState(AliveStateId.Dying);
                }

                tile.resetByTypeAndPlayerIndex({
                    baseType    : tile.getBaseType(),
                    objectType  : tile.getTemplateCfg().getTileObjectTypeIdAfterOwnerChanged() ?? tile.getObjectType(),
                    playerIndex : focusUnit.getPlayerIndex(),
                });
                tile.setCurrentCapturePoint(0);
            }
        }

        handlePostOperationPlunder(focusUnit, true);
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
    const isSelfInTurn      = playerInTurn.getUserId() === getSelfUserId();
    if (actionExtraData) {
        const commonExtraData       = getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_NormalExeUnitCaptureTile_00);
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
                const gridIndex             = getExisted(GridIndex.convertGridIndex(lastNode.getGridIndex()), ClientErrorCode.WarOperationExecutor_NormalExeUnitCaptureTile_01);
                const tile                  = tileMap.getTile(gridIndex);
                const maxCapturePoint       = getExisted(tile.getMaxCapturePoint(), ClientErrorCode.WarOperationExecutor_NormalExeUnitCaptureTile_02);
                const currentCapturePoint   = tile.getCurrentCapturePoint();
                const tileDataAfterAction   = getExisted(
                    commonExtraData
                        .getTileArrayAfterAction()
                        .find(v =>
                            gridIndex.checkIsEqual(getExisted(GridIndex.convertGridIndex(v.getGridIndex())))
                        ),
                    ClientErrorCode.WarOperationExecutor_NormalExeUnitCaptureTile_04
                );
                const rawNewCapturePoint   = tileDataAfterAction.getCurrentCapturePoint();

                await new Promise<void>(resolve => {
                    openPanel(getDict().BwCaptureProgressPanel, {
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

        handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute       : false,
        });

    } else {
        const path          = MovePath.create(getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
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
            const destination           = focusUnit.getGridIndex();
            const tile                  = war.getTileMap().getTile(destination);
            const captureAmount         = getExisted(focusUnit.getFinalCaptureAmount(destination));
            const maxCapturePoint       = getExisted(tile.getMaxCapturePoint());
            const currentCapturePoint   = tile.getCurrentCapturePoint() ?? 0;
            const newCapturePoint       = currentCapturePoint + captureAmount;

            if (newCapturePoint < maxCapturePoint) {
                tile.setCurrentCapturePoint(newCapturePoint);
            } else {
                if (tile.getIsDefeatedOnCapture()) {
                    tile.getPlayer().setAliveState(AliveStateId.Dying);
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
                    openPanel(getDict().BwCaptureProgressPanel, {
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

        handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitCaptureTile): Promise<string | null> {
    _meWarClass     ??= getMeWarClass();
    _mpwWarClass    ??= getMpwWarClass();
    _rwWarBaseClass ??= getRwWarBaseClass();
    _spwWarClass    ??= getSpwWarClass();
    _twWarClass     ??= getTwWarClass();

    if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        return null;
    } else if (war instanceof _rwWarBaseClass) {
        return `${getText(TextType.B0100)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
