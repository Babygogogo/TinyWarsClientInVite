import {
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    FloatText,
    SinglePlayerWars_War,
    TestWar_Model_TwWar,
    Players_Constants,
    Utils_ClientErrorCode,
    Helpers_Misc,
    Lang_Utils,
    WarOperations_Executors_Utils_Common,
    Lang_Constants,
    type BaseWar_Model_War,
} from "../../../internal.ts";

import type { WoSystemHandleBootPlayer } from "../../../proto/schema/CommonProto/WarOperation/WoSystemHandleBootPlayer.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoSystemHandleBootPlayer, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeSystemHandleBootPlayer(war, action);
    } else {
        await normalExeSystemHandleBootPlayer(war, action);
    }
}

function fastExeSystemHandleBootPlayer(war: BaseWar_Model_War.War, action: WoSystemHandleBootPlayer): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeSystemHandleBootPlayer_00),
            isFastExecute   : true,
        });
    } else {
        war.getPlayerInTurn().setAliveState(Players_Constants.AliveStateId.Dying);
    }
}

async function normalExeSystemHandleBootPlayer(war: BaseWar_Model_War.War, action: WoSystemHandleBootPlayer): Promise<void> {
    const desc = await getDesc(war, action);
    (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeSystemHandleBootPlayer_00);
        await war.showTempUnitMoveAnimation({
            movingUnitAndPath : commonExtraData.getMovingUnitAndPath(),
            aiming            : null,
            callback          : undefined,
        });

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute : false,
        });

    } else {
        war.getPlayerInTurn().setAliveState(Players_Constants.AliveStateId.Dying);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoSystemHandleBootPlayer): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0028, await war.getPlayerInTurn().getNickname());
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0028, await war.getPlayerInTurn().getNickname());
    } else if (war instanceof SinglePlayerWars_War.War) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0028, await war.getPlayerInTurn().getNickname());
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
