import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../../mapEditor/interface/IMeWar.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn from "../../../proto/schema/CommonProto/WarOperation/WoPlayerEndTurn.ts";
import type * as ReplayWarInterfaceIRwWarBase from "../../../replayWar/interface/IRwWarBase.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type * as TestWarInterfaceITwWar from "../../../testWar/interface/ITwWar.ts";

type IBwWar             = BaseWarInterfaceIBwWar.IBwWar;
type WoPlayerEndTurn    = ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn.WoPlayerEndTurn;

let _meWarClass     : new () => MapEditorInterfaceIMeWar.IMeWar;
let _mpwWarClass    : new () => MultiPlayerWarInterfaceIMpwWar.IMpwWar;
let _rwWarBaseClass : new () => ReplayWarInterfaceIRwWarBase.IRwWarBase;
let _spwWarClass    : new () => SinglePlayerWarInterfaceISpwWar.ISpwWar;
let _twWarClass     : new () => TestWarInterfaceITwWar.ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoPlayerEndTurn, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExePlayerEndTurn(war, action);
    } else {
        await normalExePlayerEndTurn(war, action);
    }
}

function fastExePlayerEndTurn(war: IBwWar, action: WoPlayerEndTurn): void {
    war.getTurnManager().endPhaseMain(action, true);
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

function normalExePlayerEndTurn(war: IBwWar, action: WoPlayerEndTurn): void {
    // const desc = await war.getDescForExePlayerEndTurn(action);
    // (desc) && (FloatText.show(desc));

    war.getTurnManager().endPhaseMain(action, false);
    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoPlayerEndTurn): Promise<string | null> {
    _meWarClass     ??= GameHelpersGhFactory.getMeWarClass();
    _mpwWarClass    ??= GameHelpersGhFactory.getMpwWarClass();
    _rwWarBaseClass ??= GameHelpersGhFactory.getRwWarBaseClass();
    _spwWarClass    ??= GameHelpersGhFactory.getSpwWarClass();
    _twWarClass     ??= GameHelpersGhFactory.getTwWarClass();

    if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn());
    } else if (war instanceof _rwWarBaseClass) {
        return `${LangUtils.getFormattedText(LangConstants.TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn())} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn());
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
