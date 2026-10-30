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
    Utils_ClientErrorCode,
    GamePanels_Dict,
    Helpers_Misc,
    Users_Model,
    Lang_Utils,
    WarOperations_Executors_Utils_Common,
    GamePanels_Manager,
    Players_Constants,
    Lang_Constants,
} from "../../../internal.ts";

import type { WoUnitBuildTile } from "../../../proto/schema/CommonProto/WarOperation/WoUnitBuildTile.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitBuildTile, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitBuildTile(war, action);
    } else {
        await normalExeUnitBuildTile(war, action);
    }
}

function fastExeUnitBuildTile(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitBuildTile): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitBuildTile_00),
            isFastExecute   : true,
        });
    } else {
        const path          = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        if (!path.isBlocked) {
            const destination   = focusUnit.getGridIndex();
            const tile          = war.getTileMap().getTile(destination);
            const buildAmount   = Helpers_Misc.getExisted(focusUnit.getBuildAmount());
            const maxBuildPoint = Helpers_Misc.getExisted(tile.getMaxBuildPoint());
            const newBuildPoint = tile.getCurrentBuildPoint() + buildAmount;

            if (newBuildPoint < maxBuildPoint) {
                tile.setCurrentBuildPoint(newBuildPoint);
            } else {
                focusUnit.setCurrentBuildMaterial(focusUnit.getCurrentBuildMaterial() - 1);

                const targetTileCfg = Helpers_Misc.getExisted(focusUnit.getBuildTargetTileCfg(tile.getBaseType(), tile.getObjectType()), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitBuildTile_01);
                tile.resetByTypeAndPlayerIndex({
                    baseType        : targetTileCfg.getDstTileBaseTypeId(),
                    objectType      : targetTileCfg.getDstTileObjectTypeId(),
                    playerIndex     : targetTileCfg.getIsDstNeutral() ? Players_Constants.PlayerIndex.Neutral : focusUnit.getPlayerIndex(),
                });
                tile.setCurrentBuildPoint(0);
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitBuildTile(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitBuildTile): Promise<void> {
    // const desc = await war.getDescForExeUnitBuildTile(action);
    // (desc) && (FloatText.show(desc));

    const unitMap           = war.getUnitMap();
    const isSelfInTurn      = war.getPlayerInTurn().getUserId() === Users_Model.getSelfUserId();
    const tileMap           = war.getTileMap();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData   = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitBuildTile_00);
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
                const gridIndex             = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(lastNode.getGridIndex()));
                const tile                  = tileMap.getTile(gridIndex);
                const maxBuildPoint         = Helpers_Misc.getExisted(tile.getMaxBuildPoint());
                const currentBuildPoint     = tile.getCurrentBuildPoint();
                const tileDataAfterAction   = Helpers_Misc.getExisted(
                    commonExtraData
                        .getTileArrayAfterAction()
                        .find(v =>
                            gridIndex.checkIsEqual(Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v.getGridIndex())))
                        ),
                    Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitBuildTile_01
                );
                const rawNewBuildPoint = tileDataAfterAction.getCurrentBuildPoint();

                await new Promise<void>(resolve => {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwCaptureProgressPanel, {
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

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute   : false,
        });

    } else {
        const path          = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
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

                const targetTileCfg = Helpers_Misc.getExisted(focusUnit.getBuildTargetTileCfg(tile.getBaseType(), tile.getObjectType()), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitBuildTile_01);
                tile.resetByTypeAndPlayerIndex({
                    baseType        : targetTileCfg.getDstTileBaseTypeId(),
                    objectType      : targetTileCfg.getDstTileObjectTypeId(),
                    playerIndex     : targetTileCfg.getIsDstNeutral() ? Players_Constants.PlayerIndex.Neutral : focusUnit.getPlayerIndex(),
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
                        maxValue            : maxBuildPoint,
                        newValue            : newBuildPoint,
                        currentValue        : currentBuildPoint,
                        callbackOnFinish    : () => resolve(),
                    });
                });
            }
            focusUnit.updateView();
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitBuildTile): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0099)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
