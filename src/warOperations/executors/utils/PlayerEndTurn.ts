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

import type { WoPlayerEndTurn } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerEndTurn.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoPlayerEndTurn, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExePlayerEndTurn(war, action);
    } else {
        await normalExePlayerEndTurn(war, action);
    }
}

function fastExePlayerEndTurn(war: BaseWar_Model_War.War, action: WoPlayerEndTurn): void {
    war.getTurnManager().endPhaseMain(action, true);
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

function normalExePlayerEndTurn(war: BaseWar_Model_War.War, action: WoPlayerEndTurn): void {
    // const desc = await war.getDescForExePlayerEndTurn(action);
    // (desc) && (FloatText.show(desc));

    war.getTurnManager().endPhaseMain(action, false);
    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoPlayerEndTurn): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn());
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn())} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWars_War.War) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn());
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
