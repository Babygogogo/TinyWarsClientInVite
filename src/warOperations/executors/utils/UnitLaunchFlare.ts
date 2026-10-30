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
    Helpers_Misc,
    Lang_Utils,
    WarOperations_Executors_Utils_Common,
    Lang_Constants,
} from "../../../internal.ts";

import type { WoUnitLaunchFlare } from "../../../proto/schema/CommonProto/WarOperation/WoUnitLaunchFlare.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitLaunchFlare, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitLaunchFlare(war, action);
    } else {
        await normalExeUnitLaunchFlare(war, action);
    }
}

function fastExeUnitLaunchFlare(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitLaunchFlare): void {
    const fogMap            = war.getFogMap();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitLaunchFlare_01),
            isFastExecute   : true,
        });
    } else {
        const path          = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption : path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        if (!path.isBlocked) {
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

async function normalExeUnitLaunchFlare(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitLaunchFlare): Promise<void> {
    // const desc = await war.getDescForExeUnitLaunchFlare(action);
    // (desc) && (FloatText.show(desc));

    const gridVisualEffect  = war.getGridVisualEffect();
    const mapSize           = war.getTileMap().getMapSize();
    const fogMap            = war.getFogMap();
    const playerIndexInTurn = war.getPlayerIndexInTurn();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitLaunchFlare_00);
        await war.moveExtraUnit({
            movingUnitAndPath     : commonExtraData.getMovingUnitAndPath(),
            aiming                : null,
            deleteViewAfterMoving : true,
        });

        const targetGridIndex   = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(actionExtraData.getTargetGridIndex());
        if (targetGridIndex) {
            const flareRadius = Helpers_Misc.getExisted(actionExtraData.getFlareRadius(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitLaunchFlare_01);
            for (const grid of targetGridIndex.getGridsWithinDistance({ minDistance : 0, maxDistance : flareRadius, mapSize })) {
                gridVisualEffect.showEffectFlare(grid);
            }
        }

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute : false,
        });

    } else {
        const path          = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption : path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        const isFlareSucceeded  = !path.isBlocked;
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
            isBlocked           : path.isBlocked,
            aiming              : null,
            updateViewAfterMove : true,
        });
        if ((isFlareSucceeded) && (war.getPlayerManager().getWatcherTeamIndexesForSelf().has(focusUnit.getTeamIndex()))) {
            if (targetGridIndex == null) {
                throw Helpers_Misc.newError(`Empty targetGridIndex.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitLaunchFlare_03);
            }

            for (const grid of targetGridIndex.getGridsWithinDistance({ minDistance : 0, maxDistance : flareRadius, mapSize })) {
                gridVisualEffect.showEffectFlare(grid);
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitLaunchFlare): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0104)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
