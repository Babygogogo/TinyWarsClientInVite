import {
    Destructions_Utils,
    AuxiliaryTypes_GridIndex,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWar_Model_SpwWar,
    TestWar_Model_TwWar,
    type BaseWar_Interface_IBwWar,
    Utils_ClientErrorCode,
    Helpers_Misc,
    Lang_Utils,
    WarOperations_Executors_Utils_Common,
    Lang_Constants,
} from "../../../internal.ts";

import type { WoPlayerDeleteUnit } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerDeleteUnit.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Interface_IBwWar.IBwWar, action: WoPlayerDeleteUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExePlayerDeleteUnit(war, action);
    } else {
        await normalExePlayerDeleteUnit(war, action);
    }
}

function fastExePlayerDeleteUnit(war: BaseWar_Interface_IBwWar.IBwWar, action: WoPlayerDeleteUnit): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExePlayerDeleteUnit_00),
            isFastExecute   : true,
        });
    } else {
        const gridIndex = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(action.getGridIndex()));
        const focusUnit = war.getUnitMap().getUnitOnMap(gridIndex);
        if (focusUnit) {
            if (war.getGcData().getSystemCfg().getIsPathVisionEnabled()) {
                war.getFogMap().updateMapFromPathsByUnitAndPath({
                    unit           : focusUnit,
                    unitVisionInfo : focusUnit.getVisionInfo(),
                    path           : [gridIndex],
                });
            }

            Destructions_Utils.destroyUnitOnMap(war, gridIndex, false);
        }
    }

    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExePlayerDeleteUnit(war: BaseWar_Interface_IBwWar.IBwWar, action: WoPlayerDeleteUnit): Promise<void> {
    // const desc = await war.getDescForExePlayerDeleteUnit(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExePlayerDeleteUnit_00);
        await war.moveExtraUnit({
            movingUnitAndPath     : commonExtraData.getMovingUnitAndPath(),
            aiming                : null,
            deleteViewAfterMoving : true,
        });

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute : false,
        });

    } else {
        const gridIndex = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(action.getGridIndex()));
        const focusUnit = war.getUnitMap().getUnitOnMap(gridIndex);
        if (focusUnit) {
            if (war.getGcData().getSystemCfg().getIsPathVisionEnabled()) {
                war.getFogMap().updateMapFromPathsByUnitAndPath({
                    unit           : focusUnit,
                    unitVisionInfo : focusUnit.getVisionInfo(),
                    path           : [gridIndex],
                });
            }

            Destructions_Utils.destroyUnitOnMap(war, gridIndex, true);
        }
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Interface_IBwWar.IBwWar, action: WoPlayerDeleteUnit): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0081)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
