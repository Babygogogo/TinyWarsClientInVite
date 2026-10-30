import {
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    FloatText,
    SinglePlayerWar_Model_SpwWar,
    TestWar_Model_TwWar,
    type BaseWar_Interface_IBwWar,
    Utils_ClientErrorCode,
    Helpers_Misc,
    Lang_Utils,
    WarOperations_Executors_Utils_Common,
    Lang_Constants,
} from "../../../internal.ts";

import type { WoPlayerVoteForDraw } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerVoteForDraw.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Interface_IBwWar.IBwWar, action: WoPlayerVoteForDraw, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExePlayerVoteForDraw(war, action);
    } else {
        await normalExePlayerVoteForDraw(war, action);
    }
}

function fastExePlayerVoteForDraw(war: BaseWar_Interface_IBwWar.IBwWar, action: WoPlayerVoteForDraw): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExePlayerVoteForDraw_00),
            isFastExecute   : true,
        });
    }

    war.getDrawVoteManager().handleVote(
        (actionExtraData ? actionExtraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn(),
        !!(actionExtraData ? actionExtraData.getIsAgree() : action.getIsAgree()),
    );
}

async function normalExePlayerVoteForDraw(war: BaseWar_Interface_IBwWar.IBwWar, action: WoPlayerVoteForDraw): Promise<void> {
    const desc = await getDesc(war, action);
    (desc) && (FloatText.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExePlayerVoteForDraw_00);
        await war.moveExtraUnit({
            movingUnitAndPath     : commonExtraData.getMovingUnitAndPath(),
            aiming                : null,
            deleteViewAfterMoving : true,
        });

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war             : war,
            commonExtraData : commonExtraData,
            isFastExecute   : false,
        });
    }

    war.getDrawVoteManager().handleVote(
        (actionExtraData ? actionExtraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn(),
        !!(actionExtraData ? actionExtraData.getIsAgree() : action.getIsAgree()),
    );
}

 
async function getDesc(war: BaseWar_Interface_IBwWar.IBwWar, action: WoPlayerVoteForDraw): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        const extraData     = action.getExtraData();
        const playerIndex   = (extraData ? extraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn();
        const nickname      = await war.getPlayer(playerIndex).getNickname();

        if (!(extraData ? extraData.getIsAgree() : action.getIsAgree())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0017, playerIndex, nickname);
        } else {
            if (war.getDrawVoteManager().checkHasOngoingVote()) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0018, playerIndex, nickname);
            } else {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0019, playerIndex, nickname);
            }
        }
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        const extraData     = action.getExtraData();
        const playerIndex   = (extraData ? extraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn();
        const nickname      = await war.getPlayer(playerIndex).getNickname();
        const suffix        = war.getWarOperationDescSuffix();

        if (!(extraData ? extraData.getIsAgree() : action.getIsAgree())) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0017, playerIndex, nickname)} ${suffix}`;
        } else {
            if (war.getDrawVoteManager().checkHasOngoingVote()) {
                return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0018, playerIndex, nickname)} ${suffix}`;
            } else {
                return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0019, playerIndex, nickname)} ${suffix}`;
            }
        }
    } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
        const extraData     = action.getExtraData();
        const playerIndex   = (extraData ? extraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn();
        const nickname      = await war.getPlayer(playerIndex).getNickname();

        if (!(extraData ? extraData.getIsAgree() : action.getIsAgree())) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0017, playerIndex, nickname);
        } else {
            if (war.getDrawVoteManager().checkHasOngoingVote()) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0018, playerIndex, nickname);
            } else {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0019, playerIndex, nickname);
            }
        }
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
