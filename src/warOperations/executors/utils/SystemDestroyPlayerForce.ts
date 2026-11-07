import {
    Destructions_Utils,
    HalfwayReplayWar_Model_HrwWar,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWar,
    SinglePlayerWar_Model_SpwWar,
    TestWar_Model_TwWar,
    Utils_ClientErrorCode,
    Helpers_Misc,
    Lang_Utils,
    WarOperations_Executors_Utils_Common,
    Lang_Constants,
    type BaseWar_Model_War,
} from "../../../internal.ts";

import type { WoSystemDestroyPlayerForce } from "../../../proto/schema/CommonProto/WarOperation/WoSystemDestroyPlayerForce.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoSystemDestroyPlayerForce, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeSystemDestroyPlayerForce(war, action);
    } else {
        await normalExeSystemDestroyPlayerForce(war, action);
    }
}

function fastExeSystemDestroyPlayerForce(war: BaseWar_Model_War.War, action: WoSystemDestroyPlayerForce): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeSystemDestroyPlayerForce_00),
            isFastExecute   : true,
        });
        war.getDrawVoteManager().handlePlayerForceDestruction();
    } else {
        Destructions_Utils.destroyPlayerForce(war, Helpers_Misc.getExisted(action.getTargetPlayerIndex()), false);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeSystemDestroyPlayerForce(war: BaseWar_Model_War.War, action: WoSystemDestroyPlayerForce): Promise<void> {
    // const desc = await war.getDescForExeSystemDestroyPlayerForce(action);
    // (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeSystemDestroyPlayerForce_00);
        await war.showTempUnitMoveAnimation({
            movingUnitAndPath : commonExtraData.getMovingUnitAndPath(),
            aiming            : null,
            callback          : undefined,
        });

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : commonExtraData,
            isFastExecute   : false,
        });
        war.getDrawVoteManager().handlePlayerForceDestruction();

    } else {
        Destructions_Utils.destroyPlayerForce(war, Helpers_Misc.getExisted(action.getTargetPlayerIndex()), true);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoSystemDestroyPlayerForce): Promise<string | null> {

    if (war instanceof HalfwayReplayWar_Model_HrwWar.HrwWar) {
        const playerIndex = Helpers_Misc.getExisted(action.getExtraData()?.getTargetPlayerIndex());
        return `P${playerIndex} ${await war.getPlayer(playerIndex).getNickname()} ${Lang_Utils.getText(Lang_Constants.TextType.B0450)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        const playerIndex = Helpers_Misc.getExisted(action.getExtraData()?.getTargetPlayerIndex());
        return `p${playerIndex} ${await war.getPlayer(playerIndex).getNickname()} ${Lang_Utils.getText(Lang_Constants.TextType.B0450)}`;
    } else if (war instanceof ReplayWar_Model_RwWar.RwWar) {
        const playerIndex = Helpers_Misc.getExisted(action.getTargetPlayerIndex());
        return `P${playerIndex} ${await war.getPlayer(playerIndex).getNickname()} ${Lang_Utils.getText(Lang_Constants.TextType.B0450)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
        const playerIndex = Helpers_Misc.getExisted(action.getTargetPlayerIndex());
        return `p${playerIndex} ${await war.getPlayer(playerIndex).getNickname()} ${Lang_Utils.getText(Lang_Constants.TextType.B0450)}`;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
