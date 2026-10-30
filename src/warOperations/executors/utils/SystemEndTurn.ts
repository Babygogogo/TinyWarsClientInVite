import {
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWar_Model_SpwWar,
    TestWar_Model_TwWar,
    type BaseWar_Interface_IBwWar,
    Lang_Utils,
    Lang_Constants,
} from "../../../internal.ts";

import type { WoSystemEndTurn } from "../../../proto/schema/CommonProto/WarOperation/WoSystemEndTurn.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Interface_IBwWar.IBwWar, action: WoSystemEndTurn, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeSystemEndTurn(war, action);
    } else {
        await normalExeSystemEndTurn(war, action);
    }
}

function fastExeSystemEndTurn(war: BaseWar_Interface_IBwWar.IBwWar, action: WoSystemEndTurn): void {
    war.getTurnManager().endPhaseMain(action, true);
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

function normalExeSystemEndTurn(war: BaseWar_Interface_IBwWar.IBwWar, action: WoSystemEndTurn): void {
    // const desc = await war.getDescForExeSystemEndTurn(action);
    // (desc) && (FloatText.show(desc));

    war.getTurnManager().endPhaseMain(action, false);
    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Interface_IBwWar.IBwWar, action: WoSystemEndTurn): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn());
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn());
    } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn());
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
