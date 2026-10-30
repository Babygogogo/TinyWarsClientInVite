import {
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    FloatText,
    SinglePlayerWar_Model_SpwWar,
    TestWar_Model_TwWar,
    type BaseWar_Interface_IBwWar,
    Players_Constants,
    GamePanels_Dict,
    Lang_Utils,
    GamePanels_Manager,
    Lang_Constants,
} from "../../../internal.ts";

import type { WoSystemBeginTurn } from "../../../proto/schema/CommonProto/WarOperation/WoSystemBeginTurn.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Interface_IBwWar.IBwWar, action: WoSystemBeginTurn, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeSystemBeginTurn(war, action);
    } else {
        await normalExeSystemBeginTurn(war, action);
    }
}

async function fastExeSystemBeginTurn(war: BaseWar_Interface_IBwWar.IBwWar, action: WoSystemBeginTurn): Promise<void> {
    await war.getTurnManager().endPhaseStandby(action, true);
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeSystemBeginTurn(war: BaseWar_Interface_IBwWar.IBwWar, action: WoSystemBeginTurn): Promise<void> {
    // const desc = await war.getDescForExeSystemBeginTurn(action);
    // (desc) && (FloatText.show(desc));

    // return war.getTurnManager().endPhaseWaitBeginTurn(action);

    const playerInTurn  = war.getPlayerInTurn();
    const playerIndex   = playerInTurn.getPlayerIndex();
    if ((playerIndex !== Players_Constants.PlayerIndex.Neutral)         &&
        (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Dead)
    ) {
        const nickname = await playerInTurn.getNickname();
        if ((war instanceof ReplayWar_Model_RwWarBase.RwWarBase) && (!war.getIsShowTurnStartPopUp())) {
            FloatText.show(`[P${playerIndex} ${nickname}] ${Lang_Utils.getText(Lang_Constants.TextType.B0679)}`);
        } else {
            await new Promise<void>(resolve => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwBeginTurnPanel, {
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
async function getDesc(war: BaseWar_Interface_IBwWar.IBwWar, action: WoSystemBeginTurn): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        const playerIndex = war.getPlayerIndexInTurn();
        if (playerIndex === Players_Constants.PlayerIndex.Neutral) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0022, Lang_Utils.getText(Lang_Constants.TextType.B0111), playerIndex);
        } else {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0022, await war.getPlayerInTurn().getNickname(), playerIndex);
        }
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `P${war.getPlayerIndexInTurn()} ${await war.getPlayerInTurn().getNickname()} ${Lang_Utils.getText(Lang_Constants.TextType.B0094)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
        const playerIndex = war.getPlayerIndexInTurn();
        if (playerIndex === Players_Constants.PlayerIndex.Neutral) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0022, Lang_Utils.getText(Lang_Constants.TextType.B0111), playerIndex);
        } else {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0022, await war.getPlayerInTurn().getNickname(), playerIndex);
        }
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
