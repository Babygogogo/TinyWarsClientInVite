import {
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_MovePath,
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
    type BaseWar_Model_War,
} from "../../../internal.ts";

import type { WoUnitDive } from "../../../proto/schema/CommonProto/WarOperation/WoUnitDive.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoUnitDive, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitDive(war, action);
    } else {
        await normalExeUnitDive(war, action);
    }
}

function fastExeUnitDive(war: BaseWar_Model_War.War, action: WoUnitDive): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitDive_00),
            isFastExecute   : true,
        });
    } else {
        const path          = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        const isSuccessful  = !path.isBlocked;
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption : path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);
        if (isSuccessful) {
            focusUnit.setIsDiving(true);
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitDive(war: BaseWar_Model_War.War, action: WoUnitDive): Promise<void> {
    // const desc = await war.getDescForExeUnitDive(action);
    // (desc) && (FloatText.show(desc));

    const gridVisualEffect  = war.getGridVisualEffect();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData   = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitDive_00);
        const movingUnitAndPath = commonExtraData.getMovingUnitAndPath();
        await war.showTempUnitMoveAnimation({
            movingUnitAndPath : movingUnitAndPath,
            aiming            : null,
            callback          : undefined,
        });

        const movingPath    = movingUnitAndPath?.getPath();
        const lastNode      = movingPath ? movingPath[movingPath?.length - 1] : null;
        if ((lastNode?.getIsVisible()) && (!lastNode.getIsBlocked())) {
            gridVisualEffect?.showEffectDive(Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(lastNode.getGridIndex()), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitDive_01));
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
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        const isSuccessful  = !path.isBlocked;
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption : path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);
        if (isSuccessful) {
            focusUnit.setIsDiving(true);
        }

        await focusUnit.moveViewAlongPath({
            pathNodes           : pathNodes,
            isDiving            : false,
            isBlocked           : path.isBlocked,
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
                gridVisualEffect?.showEffectDive(endingGridIndex);
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoUnitDive): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0101)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWars_War.War) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
