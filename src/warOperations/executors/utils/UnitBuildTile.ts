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
import { PlayerIndex } from "../../../players/Constants.ts";
import type { WoUnitBuildTile } from "../../../proto/schema/CommonProto/WarOperation/WoUnitBuildTile.ts";
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
export async function execute(war: IBwWar, action: WoUnitBuildTile, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitBuildTile(war, action);
    } else {
        await normalExeUnitBuildTile(war, action);
    }
}

function fastExeUnitBuildTile(war: IBwWar, action: WoUnitBuildTile): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        handleCommonExtraData({
            war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_FastExeUnitBuildTile_00),
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

        if (!path.isBlocked) {
            const destination   = focusUnit.getGridIndex();
            const tile          = war.getTileMap().getTile(destination);
            const buildAmount   = getExisted(focusUnit.getBuildAmount());
            const maxBuildPoint = getExisted(tile.getMaxBuildPoint());
            const newBuildPoint = tile.getCurrentBuildPoint() + buildAmount;

            if (newBuildPoint < maxBuildPoint) {
                tile.setCurrentBuildPoint(newBuildPoint);
            } else {
                focusUnit.setCurrentBuildMaterial(focusUnit.getCurrentBuildMaterial() - 1);

                const targetTileCfg = getExisted(focusUnit.getBuildTargetTileCfg(tile.getBaseType(), tile.getObjectType()), ClientErrorCode.WarOperationExecutor_FastExeUnitBuildTile_01);
                tile.resetByTypeAndPlayerIndex({
                    baseType        : targetTileCfg.getDstTileBaseTypeId(),
                    objectType      : targetTileCfg.getDstTileObjectTypeId(),
                    playerIndex     : targetTileCfg.getIsDstNeutral() ? PlayerIndex.Neutral : focusUnit.getPlayerIndex(),
                });
                tile.setCurrentBuildPoint(0);
            }
        }

        handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitBuildTile(war: IBwWar, action: WoUnitBuildTile): Promise<void> {
    // const desc = await war.getDescForExeUnitBuildTile(action);
    // (desc) && (FloatText.show(desc));

    const unitMap           = war.getUnitMap();
    const isSelfInTurn      = war.getPlayerInTurn().getUserId() === getSelfUserId();
    const tileMap           = war.getTileMap();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData   = getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_NormalExeUnitBuildTile_00);
        const movingUnitAndPath = commonExtraData.getMovingUnitAndPath();
        const extraUnit         = await war.moveExtraUnit({
            movingUnitAndPath       : movingUnitAndPath,
            aiming                  : null,
            deleteViewAfterMoving   : false,
        });

        {
            const movingPath    = movingUnitAndPath?.getPath();
            const lastNode      = movingPath ? movingPath[movingPath.length - 1] : null;
            if ((isSelfInTurn) && (lastNode) && (!lastNode.getIsBlocked())) {
                const gridIndex             = getExisted(GridIndex.convertGridIndex(lastNode.getGridIndex()));
                const tile                  = tileMap.getTile(gridIndex);
                const maxBuildPoint         = getExisted(tile.getMaxBuildPoint());
                const currentBuildPoint     = tile.getCurrentBuildPoint();
                const tileDataAfterAction   = getExisted(
                    commonExtraData
                        .getTileArrayAfterAction()
                        .find(v =>
                            gridIndex.checkIsEqual(getExisted(GridIndex.convertGridIndex(v.getGridIndex())))
                        ),
                    ClientErrorCode.WarOperationExecutor_NormalExeUnitBuildTile_01
                );
                const rawNewBuildPoint = tileDataAfterAction.getCurrentBuildPoint();

                await new Promise<void>(resolve => {
                    openPanel(getDict().BwCaptureProgressPanel, {
                        maxValue            : maxBuildPoint,
                        currentValue        : currentBuildPoint,
                        newValue            : rawNewBuildPoint > currentBuildPoint
                            ? rawNewBuildPoint
                            : Math.max(rawNewBuildPoint, maxBuildPoint),
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
            isFastExecute   : false,
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
            const destination       = focusUnit.getGridIndex();
            const tile              = war.getTileMap().getTile(destination);
            const buildAmount       = getExisted(focusUnit.getBuildAmount());
            const maxBuildPoint     = getExisted(tile.getMaxBuildPoint());
            const currentBuildPoint = tile.getCurrentBuildPoint();
            const newBuildPoint     = currentBuildPoint + buildAmount;

            if (newBuildPoint < maxBuildPoint) {
                tile.setCurrentBuildPoint(newBuildPoint);
            } else {
                focusUnit.setCurrentBuildMaterial(focusUnit.getCurrentBuildMaterial() - 1);

                const targetTileCfg = getExisted(focusUnit.getBuildTargetTileCfg(tile.getBaseType(), tile.getObjectType()), ClientErrorCode.WarOperationExecutor_NormalExeUnitBuildTile_01);
                tile.resetByTypeAndPlayerIndex({
                    baseType        : targetTileCfg.getDstTileBaseTypeId(),
                    objectType      : targetTileCfg.getDstTileObjectTypeId(),
                    playerIndex     : targetTileCfg.getIsDstNeutral() ? PlayerIndex.Neutral : focusUnit.getPlayerIndex(),
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
                    openPanel(getDict().BwCaptureProgressPanel, {
                        maxValue            : maxBuildPoint,
                        newValue            : newBuildPoint,
                        currentValue        : currentBuildPoint,
                        callbackOnFinish    : () => resolve(),
                    });
                });
            }
            focusUnit.updateView();
        }

        handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitBuildTile): Promise<string | null> {
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
        return `${getText(TextType.B0099)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
