import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as FloatText2 from "../../../FloatText.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../../gamePanels/Manager.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../../mapEditor/interface/IMeWar.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../../../multiPlayerWar/interface/IMpwWar.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn from "../../../proto/schema/CommonProto/WarOperation/WoSystemBeginTurn.ts";
import type * as ReplayWarInterfaceIRwWarBase from "../../../replayWar/interface/IRwWarBase.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type * as TestWarInterfaceITwWar from "../../../testWar/interface/ITwWar.ts";

type WoSystemBeginTurn  = ProtoSchemaCommonProtoWarOperationWoSystemBeginTurn.WoSystemBeginTurn;
type IBwWar             = BaseWarInterfaceIBwWar.IBwWar;

let _meWarClass     : new () => MapEditorInterfaceIMeWar.IMeWar;
let _mpwWarClass    : new () => MultiPlayerWarInterfaceIMpwWar.IMpwWar;
let _rwWarBaseClass : new () => ReplayWarInterfaceIRwWarBase.IRwWarBase;
let _spwWarClass    : new () => SinglePlayerWarInterfaceISpwWar.ISpwWar;
let _twWarClass     : new () => TestWarInterfaceITwWar.ITwWar;

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
    if ((playerIndex !== PlayersConstants.PlayerIndex.Neutral)         &&
        (playerInTurn.getAliveState() !== PlayersConstants.AliveStateId.Dead)
    ) {
        const nickname = await playerInTurn.getNickname();
        if ((war instanceof GameHelpersGhFactory.getRwWarBaseClass()) && (!war.getIsShowTurnStartPopUp())) {
            FloatText2.show(`[P${playerIndex} ${nickname}] ${LangUtils.getText(LangConstants.TextType.B0679)}`);
        } else {
            await new Promise<void>(resolve => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().BwBeginTurnPanel, {
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
    _meWarClass     ??= GameHelpersGhFactory.getMeWarClass();
    _mpwWarClass    ??= GameHelpersGhFactory.getMpwWarClass();
    _rwWarBaseClass ??= GameHelpersGhFactory.getRwWarBaseClass();
    _spwWarClass    ??= GameHelpersGhFactory.getSpwWarClass();
    _twWarClass     ??= GameHelpersGhFactory.getTwWarClass();

    if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        const playerIndex = war.getPlayerIndexInTurn();
        if (playerIndex === PlayersConstants.PlayerIndex.Neutral) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0022, LangUtils.getText(LangConstants.TextType.B0111), playerIndex);
        } else {
            return LangUtils.getFormattedText(LangConstants.TextType.F0022, await war.getPlayerInTurn().getNickname(), playerIndex);
        }
    } else if (war instanceof _rwWarBaseClass) {
        return `P${war.getPlayerIndexInTurn()} ${await war.getPlayerInTurn().getNickname()} ${LangUtils.getText(LangConstants.TextType.B0094)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        const playerIndex = war.getPlayerIndexInTurn();
        if (playerIndex === PlayersConstants.PlayerIndex.Neutral) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0022, LangUtils.getText(LangConstants.TextType.B0111), playerIndex);
        } else {
            return LangUtils.getFormattedText(LangConstants.TextType.F0022, await war.getPlayerInTurn().getNickname(), playerIndex);
        }
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
