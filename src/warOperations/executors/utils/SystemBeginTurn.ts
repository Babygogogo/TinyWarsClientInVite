import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { show } from "../../../FloatText.ts";
import {
    getRwWarBaseClass,
    getMeWarClass,
    getMpwWarClass,
    getSpwWarClass,
    getTwWarClass,
} from "../../../gameHelpers/GhFactory.ts";
import { getDict } from "../../../gamePanels/Dict.ts";
import { openPanel } from "../../../gamePanels/Manager.ts";
import { TextType } from "../../../lang/Constants.ts";
import {
    getText,
    getFormattedText,
} from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
import type { IMpwWar } from "../../../multiPlayerWar/interface/IMpwWar.ts";
import {
    PlayerIndex,
    AliveStateId,
} from "../../../players/Constants.ts";
import type { WoSystemBeginTurn } from "../../../proto/schema/CommonProto/WarOperation/WoSystemBeginTurn.ts";
import type { IRwWarBase } from "../../../replayWar/interface/IRwWarBase.ts";
import type { ISpwWar } from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type { ITwWar } from "../../../testWar/interface/ITwWar.ts";

let _meWarClass     : new () => IMeWar;
let _mpwWarClass    : new () => IMpwWar;
let _rwWarBaseClass : new () => IRwWarBase;
let _spwWarClass    : new () => ISpwWar;
let _twWarClass     : new () => ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoSystemBeginTurn, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeSystemBeginTurn(war, action);
    } else {
        await normalExeSystemBeginTurn(war, action);
    }
}

async function fastExeSystemBeginTurn(war: IBwWar, action: WoSystemBeginTurn): Promise<void> {
    await war.getTurnManager().endPhaseStandby(action, true);
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeSystemBeginTurn(war: IBwWar, action: WoSystemBeginTurn): Promise<void> {
    // const desc = await war.getDescForExeSystemBeginTurn(action);
    // (desc) && (FloatText.show(desc));

    // return war.getTurnManager().endPhaseWaitBeginTurn(action);

    const playerInTurn  = war.getPlayerInTurn();
    const playerIndex   = playerInTurn.getPlayerIndex();
    if ((playerIndex !== PlayerIndex.Neutral)         &&
        (playerInTurn.getAliveState() !== AliveStateId.Dead)
    ) {
        const nickname = await playerInTurn.getNickname();
        if ((war instanceof getRwWarBaseClass()) && (!war.getIsShowTurnStartPopUp())) {
            show(`[P${playerIndex} ${nickname}] ${getText(TextType.B0679)}`);
        } else {
            await new Promise<void>(resolve => {
                openPanel(getDict().BwBeginTurnPanel, {
                    gameConfig          : war.getGcData(),
                    playerIndex         : playerIndex,
                    teamIndex           : playerInTurn.getTeamIndex(),
                    nickname            : nickname,
                    coId                : playerInTurn.getCoId(),
                    unitAndTileSkinId   : playerInTurn.getUnitAndTileSkinId(),
                    callbackOnFinish    : () => resolve(),
                });
            });
        }
    }

    await war.getTurnManager().endPhaseStandby(action, false);
    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoSystemBeginTurn): Promise<string | null> {
    _meWarClass     ??= getMeWarClass();
    _mpwWarClass    ??= getMpwWarClass();
    _rwWarBaseClass ??= getRwWarBaseClass();
    _spwWarClass    ??= getSpwWarClass();
    _twWarClass     ??= getTwWarClass();

    if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        const playerIndex = war.getPlayerIndexInTurn();
        if (playerIndex === PlayerIndex.Neutral) {
            return getFormattedText(TextType.F0022, getText(TextType.B0111), playerIndex);
        } else {
            return getFormattedText(TextType.F0022, await war.getPlayerInTurn().getNickname(), playerIndex);
        }
    } else if (war instanceof _rwWarBaseClass) {
        return `P${war.getPlayerIndexInTurn()} ${await war.getPlayerInTurn().getNickname()} ${getText(TextType.B0094)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        const playerIndex = war.getPlayerIndexInTurn();
        if (playerIndex === PlayerIndex.Neutral) {
            return getFormattedText(TextType.F0022, getText(TextType.B0111), playerIndex);
        } else {
            return getFormattedText(TextType.F0022, await war.getPlayerInTurn().getNickname(), playerIndex);
        }
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
