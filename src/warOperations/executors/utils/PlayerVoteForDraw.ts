import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { show } from "../../../FloatText.ts";
import {
    getMeWarClass,
    getMpwWarClass,
    getRwWarBaseClass,
    getSpwWarClass,
    getTwWarClass,
} from "../../../gameHelpers/GhFactory.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
import type { IMpwWar } from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type { WoPlayerVoteForDraw } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerVoteForDraw.ts";
import type { IRwWarBase } from "../../../replayWar/interface/IRwWarBase.ts";
import type { ISpwWar } from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type { ITwWar } from "../../../testWar/interface/ITwWar.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { handleCommonExtraData } from "./Common.ts";

let _meWarClass     : new () => IMeWar;
let _mpwWarClass    : new () => IMpwWar;
let _rwWarBaseClass : new () => IRwWarBase;
let _spwWarClass    : new () => ISpwWar;
let _twWarClass     : new () => ITwWar;

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
        handleCommonExtraData({
            war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_FastExePlayerVoteForDraw_00),
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
    (desc) && (show(desc));

    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_NormalExePlayerVoteForDraw_00);
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        handleCommonExtraData({
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
    _meWarClass     ??= getMeWarClass();
    _mpwWarClass    ??= getMpwWarClass();
    _rwWarBaseClass ??= getRwWarBaseClass();
    _spwWarClass    ??= getSpwWarClass();
    _twWarClass     ??= getTwWarClass();

    if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        const extraData     = action.getExtraData();
        const playerIndex   = (extraData ? extraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn();
        const nickname      = await war.getPlayer(playerIndex).getNickname();

        if (!(extraData ? extraData.getIsAgree() : action.getIsAgree())) {
            return getFormattedText(TextType.F0017, playerIndex, nickname);
        } else {
            if (war.getDrawVoteManager().checkHasOngoingVote()) {
                return getFormattedText(TextType.F0018, playerIndex, nickname);
            } else {
                return getFormattedText(TextType.F0019, playerIndex, nickname);
            }
        }
    } else if (war instanceof _rwWarBaseClass) {
        const extraData     = action.getExtraData();
        const playerIndex   = (extraData ? extraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn();
        const nickname      = await war.getPlayer(playerIndex).getNickname();
        const suffix        = war.getWarOperationDescSuffix();

        if (!(extraData ? extraData.getIsAgree() : action.getIsAgree())) {
            return `${getFormattedText(TextType.F0017, playerIndex, nickname)} ${suffix}`;
        } else {
            if (war.getDrawVoteManager().checkHasOngoingVote()) {
                return `${getFormattedText(TextType.F0018, playerIndex, nickname)} ${suffix}`;
            } else {
                return `${getFormattedText(TextType.F0019, playerIndex, nickname)} ${suffix}`;
            }
        }
    } else if (war instanceof _spwWarClass) {
        const extraData     = action.getExtraData();
        const playerIndex   = (extraData ? extraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn();
        const nickname      = await war.getPlayer(playerIndex).getNickname();

        if (!(extraData ? extraData.getIsAgree() : action.getIsAgree())) {
            return getFormattedText(TextType.F0017, playerIndex, nickname);
        } else {
            if (war.getDrawVoteManager().checkHasOngoingVote()) {
                return getFormattedText(TextType.F0018, playerIndex, nickname);
            } else {
                return getFormattedText(TextType.F0019, playerIndex, nickname);
            }
        }
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
