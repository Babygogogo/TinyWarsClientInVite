import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../../mapEditor/interface/IMeWar.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoSystemEndTurn from "../../../proto/schema/CommonProto/WarOperation/WoSystemEndTurn.ts";
import type * as ReplayWarInterfaceIRwWarBase from "../../../replayWar/interface/IRwWarBase.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type * as TestWarInterfaceITwWar from "../../../testWar/interface/ITwWar.ts";

type WoSystemEndTurn    = ProtoSchemaCommonProtoWarOperationWoSystemEndTurn.WoSystemEndTurn;
type IBwWar             = BaseWarInterfaceIBwWar.IBwWar;

let _meWarClass     : new () => MapEditorInterfaceIMeWar.IMeWar;
let _mpwWarClass    : new () => MultiPlayerWarInterfaceIMpwWar.IMpwWar;
let _rwWarBaseClass : new () => ReplayWarInterfaceIRwWarBase.IRwWarBase;
let _spwWarClass    : new () => SinglePlayerWarInterfaceISpwWar.ISpwWar;
let _twWarClass     : new () => TestWarInterfaceITwWar.ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoSystemEndTurn, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeSystemEndTurn(war, action);
    } else {
        await normalExeSystemEndTurn(war, action);
    }
}

function fastExeSystemEndTurn(war: IBwWar, action: WoSystemEndTurn): void {
    war.getTurnManager().endPhaseMain(action, true);
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

function normalExeSystemEndTurn(war: IBwWar, action: WoSystemEndTurn): void {
    // const desc = await war.getDescForExeSystemEndTurn(action);
    // (desc) && (FloatText.show(desc));

    war.getTurnManager().endPhaseMain(action, false);
    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoSystemEndTurn): Promise<string | null> {
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
        return LangUtils.getFormattedText(LangConstants.TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn());
    } else if (war instanceof _spwWarClass) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn());
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
