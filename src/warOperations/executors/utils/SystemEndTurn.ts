import type { IBwWar as BaseWarInterfaceIBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { getMeWarClass, getMpwWarClass, getRwWarBaseClass, getSpwWarClass, getTwWarClass } from "../../../gameHelpers/GhFactory.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
import type { IMpwWar } from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type {
    WoSystemEndTurn as ProtoSchemaCommonProtoWarOperationWoSystemEndTurn,
} from "../../../proto/schema/CommonProto/WarOperation/WoSystemEndTurn.ts";
import type { IRwWarBase } from "../../../replayWar/interface/IRwWarBase.ts";
import type { ISpwWar } from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type { ITwWar } from "../../../testWar/interface/ITwWar.ts";

type WoSystemEndTurn    = ProtoSchemaCommonProtoWarOperationWoSystemEndTurn;
type IBwWar             = BaseWarInterfaceIBwWar;

let _meWarClass     : new () => IMeWar;
let _mpwWarClass    : new () => IMpwWar;
let _rwWarBaseClass : new () => IRwWarBase;
let _spwWarClass    : new () => ISpwWar;
let _twWarClass     : new () => ITwWar;

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
    _meWarClass     ??= getMeWarClass();
    _mpwWarClass    ??= getMpwWarClass();
    _rwWarBaseClass ??= getRwWarBaseClass();
    _spwWarClass    ??= getSpwWarClass();
    _twWarClass     ??= getTwWarClass();

    if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        return getFormattedText(TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn());
    } else if (war instanceof _rwWarBaseClass) {
        return getFormattedText(TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn());
    } else if (war instanceof _spwWarClass) {
        return getFormattedText(TextType.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn());
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
