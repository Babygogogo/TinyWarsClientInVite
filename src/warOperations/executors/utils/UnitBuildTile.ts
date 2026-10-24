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
import type * as ProtoSchemaCommonProtoWarOperationWoUnitBuildTile from "../../../proto/schema/CommonProto/WarOperation/WoUnitBuildTile.ts";
import type * as ReplayWarInterfaceIRwWarBase from "../../../replayWar/interface/IRwWarBase.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type * as TestWarInterfaceITwWar from "../../../testWar/interface/ITwWar.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import * as UsersModel from "../../../users/Model.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as WarOperationsExecutorsUtilsCommon from "./Common.ts";

type WoUnitBuildTile    = ProtoSchemaCommonProtoWarOperationWoUnitBuildTile.WoUnitBuildTile;
type IBwWar             = BaseWarInterfaceIBwWar.IBwWar;

let _meWarClass     : new () => MapEditorInterfaceIMeWar.IMeWar;
let _mpwWarClass    : new () => MultiPlayerWarInterfaceIMpwWar.IMpwWar;
let _rwWarBaseClass : new () => ReplayWarInterfaceIRwWarBase.IRwWarBase;
let _spwWarClass    : new () => SinglePlayerWarInterfaceISpwWar.ISpwWar;
let _twWarClass     : new () => TestWarInterfaceITwWar.ITwWar;

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
        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war,
            commonExtraData : HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitBuildTile_00),
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

        if (!path.isBlocked) {
            const destination   = focusUnit.getGridIndex();
            const tile          = war.getTileMap().getTile(destination);
            const buildAmount   = HelpersMisc.getExisted(focusUnit.getBuildAmount());
            const maxBuildPoint = HelpersMisc.getExisted(tile.getMaxBuildPoint());
            const newBuildPoint = tile.getCurrentBuildPoint() + buildAmount;

            if (newBuildPoint < maxBuildPoint) {
                tile.setCurrentBuildPoint(newBuildPoint);
            } else {
                focusUnit.setCurrentBuildMaterial(HelpersMisc.getExisted(focusUnit.getCurrentBuildMaterial()) - 1);

                const targetTileCfg = HelpersMisc.getExisted(focusUnit.getBuildTargetTileCfg(tile.getBaseType(), tile.getObjectType()), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitBuildTile_01);
                tile.resetByTypeAndPlayerIndex({
                    baseType        : HelpersMisc.getExisted(targetTileCfg.getDstTileBaseTypeId()),
                    objectType      : HelpersMisc.getExisted(targetTileCfg.getDstTileObjectTypeId()),
                    playerIndex     : targetTileCfg.getIsDstNeutral() ? PlayersConstants.PlayerIndex.Neutral : focusUnit.getPlayerIndex(),
                });
                tile.setCurrentBuildPoint(0);
            }
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitBuildTile(war: IBwWar, action: WoUnitBuildTile): Promise<void> {
    // const desc = await war.getDescForExeUnitBuildTile(action);
    // (desc) && (FloatText.show(desc));

    const unitMap           = war.getUnitMap();
    const isSelfInTurn      = war.getPlayerInTurn().getUserId() === UsersModel.getSelfUserId();
    const tileMap           = war.getTileMap();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData   = HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitBuildTile_00);
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
                const gridIndex             = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(lastNode.getGridIndex()));
                const tile                  = tileMap.getTile(gridIndex);
                const maxBuildPoint         = HelpersMisc.getExisted(tile.getMaxBuildPoint());
                const currentBuildPoint     = tile.getCurrentBuildPoint();
                const tileDataAfterAction   = HelpersMisc.getExisted(
                    commonExtraData
                        .getTileArrayAfterAction()
                        .find(v =>
                            gridIndex.checkIsEqual(HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(v.getGridIndex())))
                        ),
                    UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitBuildTile_01
                );
                const rawNewBuildPoint = tileDataAfterAction.getCurrentBuildPoint();

                await new Promise<void>(resolve => {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwCaptureProgressPanel, {
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

        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute   : false,
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
            const destination       = focusUnit.getGridIndex();
            const tile              = war.getTileMap().getTile(destination);
            const buildAmount       = HelpersMisc.getExisted(focusUnit.getBuildAmount());
            const maxBuildPoint     = HelpersMisc.getExisted(tile.getMaxBuildPoint());
            const currentBuildPoint = tile.getCurrentBuildPoint();
            const newBuildPoint     = currentBuildPoint + buildAmount;

            if (newBuildPoint < maxBuildPoint) {
                tile.setCurrentBuildPoint(newBuildPoint);
            } else {
                focusUnit.setCurrentBuildMaterial(HelpersMisc.getExisted(focusUnit.getCurrentBuildMaterial()) - 1);

                const targetTileCfg = HelpersMisc.getExisted(focusUnit.getBuildTargetTileCfg(tile.getBaseType(), tile.getObjectType()), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitBuildTile_01);
                tile.resetByTypeAndPlayerIndex({
                    baseType        : HelpersMisc.getExisted(targetTileCfg.getDstTileBaseTypeId()),
                    objectType      : HelpersMisc.getExisted(targetTileCfg.getDstTileObjectTypeId()),
                    playerIndex     : targetTileCfg.getIsDstNeutral() ? PlayersConstants.PlayerIndex.Neutral : focusUnit.getPlayerIndex(),
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
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().BwCaptureProgressPanel, {
                        maxValue            : maxBuildPoint,
                        newValue            : newBuildPoint,
                        currentValue        : currentBuildPoint,
                        callbackOnFinish    : () => resolve(),
                    });
                });
            }
            focusUnit.updateView();
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitBuildTile): Promise<string | null> {
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
        return `${LangUtils.getText(LangConstants.TextType.B0099)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
