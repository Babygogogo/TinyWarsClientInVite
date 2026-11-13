import {
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWars_War,
    TestWar_Model_TwWar,
    Lang_Utils,
    Lang_Constants,
    type BaseWar_Model_War,
} from "../../../internal.ts";

import type { WoSystemEndTurn } from "../../../proto/schema/CommonProto/WarOperation/WoSystemEndTurn.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoSystemEndTurn, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeSystemEndTurn(war, action);
    } else {
        await normalExeSystemEndTurn(war, action);
    }
}

function fastExeSystemEndTurn(war: BaseWar_Model_War.War, action: WoSystemEndTurn): void {
    if (action.getExtraData()) {
        war.getTurnManager().endPhaseMainWithExtraData(action, true);
    } else {
        war.getTurnManager().endPhaseMainWithoutExtraData(true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

function normalExeSystemEndTurn(war: BaseWar_Model_War.War, action: WoSystemEndTurn): void {
    if (action.getExtraData()) {
        war.getTurnManager().endPhaseMainWithExtraData(action, false);
    } else {
        war.getTurnManager().endPhaseMainWithoutExtraData(false);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoSystemEndTurn): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn());
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn());
    } else if (war instanceof SinglePlayerWars_War.War) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn());
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
