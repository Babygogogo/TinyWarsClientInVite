import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as FloatText2 from "../../../FloatText.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../../mapEditor/interface/IMeWar.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoPlayerVoteForDraw from "../../../proto/schema/CommonProto/WarOperation/WoPlayerVoteForDraw.ts";
import type * as ReplayWarInterfaceIRwWarBase from "../../../replayWar/interface/IRwWarBase.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type * as TestWarInterfaceITwWar from "../../../testWar/interface/ITwWar.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as WarOperationsExecutorsUtilsCommon from "./Common.ts";

type WoPlayerVoteForDraw    = ProtoSchemaCommonProtoWarOperationWoPlayerVoteForDraw.WoPlayerVoteForDraw;
type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;

let _meWarClass     : new () => MapEditorInterfaceIMeWar.IMeWar;
let _mpwWarClass    : new () => MultiPlayerWarInterfaceIMpwWar.IMpwWar;
let _rwWarBaseClass : new () => ReplayWarInterfaceIRwWarBase.IRwWarBase;
let _spwWarClass    : new () => SinglePlayerWarInterfaceISpwWar.ISpwWar;
let _twWarClass     : new () => TestWarInterfaceITwWar.ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoPlayerVoteForDraw, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExePlayerVoteForDraw(war, action);
    } else {
        await normalExePlayerVoteForDraw(war, action);
    }
}

function fastExePlayerVoteForDraw(war: IBwWar, action: WoPlayerVoteForDraw): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war,
            commonExtraData : HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExePlayerVoteForDraw_00),
            isFastExecute   : true,
        });
    }

    war.getDrawVoteManager().handleVote(
        (actionExtraData ? actionExtraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn(),
        !!(actionExtraData ? actionExtraData.getIsAgree() : action.getIsAgree())
    );
}

async function normalExePlayerVoteForDraw(war: IBwWar, action: WoPlayerVoteForDraw): Promise<void> {
    const desc = await getDesc(war, action);
    (desc) && (FloatText2.show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExePlayerVoteForDraw_00);
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war             : war,
            commonExtraData : commonExtraData,
            isFastExecute   : false,
        });
    }

    war.getDrawVoteManager().handleVote(
        (actionExtraData ? actionExtraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn(),
        !!(actionExtraData ? actionExtraData.getIsAgree() : action.getIsAgree())
    );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoPlayerVoteForDraw): Promise<string | null> {
    _meWarClass     ??= GameHelpersGhFactory.getMeWarClass();
    _mpwWarClass    ??= GameHelpersGhFactory.getMpwWarClass();
    _rwWarBaseClass ??= GameHelpersGhFactory.getRwWarBaseClass();
    _spwWarClass    ??= GameHelpersGhFactory.getSpwWarClass();
    _twWarClass     ??= GameHelpersGhFactory.getTwWarClass();

    if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        const extraData     = action.getExtraData();
        const playerIndex   = (extraData ? extraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn();
        const nickname      = await war.getPlayer(playerIndex).getNickname();

        if (!(extraData ? extraData.getIsAgree() : action.getIsAgree())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0017, playerIndex, nickname);
        } else {
            if (war.getDrawVoteManager().checkHasOngoingVote()) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0018, playerIndex, nickname);
            } else {
                return LangUtils.getFormattedText(LangConstants.TextType.F0019, playerIndex, nickname);
            }
        }
    } else if (war instanceof _rwWarBaseClass) {
        const extraData     = action.getExtraData();
        const playerIndex   = (extraData ? extraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn();
        const nickname      = await war.getPlayer(playerIndex).getNickname();
        const suffix        = war.getWarOperationDescSuffix();

        if (!(extraData ? extraData.getIsAgree() : action.getIsAgree())) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0017, playerIndex, nickname)} ${suffix}`;
        } else {
            if (war.getDrawVoteManager().checkHasOngoingVote()) {
                return `${LangUtils.getFormattedText(LangConstants.TextType.F0018, playerIndex, nickname)} ${suffix}`;
            } else {
                return `${LangUtils.getFormattedText(LangConstants.TextType.F0019, playerIndex, nickname)} ${suffix}`;
            }
        }
    } else if (war instanceof _spwWarClass) {
        const extraData     = action.getExtraData();
        const playerIndex   = (extraData ? extraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn();
        const nickname      = await war.getPlayer(playerIndex).getNickname();

        if (!(extraData ? extraData.getIsAgree() : action.getIsAgree())) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0017, playerIndex, nickname);
        } else {
            if (war.getDrawVoteManager().checkHasOngoingVote()) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0018, playerIndex, nickname);
            } else {
                return LangUtils.getFormattedText(LangConstants.TextType.F0019, playerIndex, nickname);
            }
        }
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
