import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as FloatText2 from "../../../FloatText.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../../mapEditor/interface/IMeWar.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoSystemEndWar from "../../../proto/schema/CommonProto/WarOperation/WoSystemEndWar.ts";
import type * as ReplayWarInterfaceIRwWarBase from "../../../replayWar/interface/IRwWarBase.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type * as TestWarInterfaceITwWar from "../../../testWar/interface/ITwWar.ts";

type WoSystemEndWar = ProtoSchemaCommonProtoWarOperationWoSystemEndWar.WoSystemEndWar;
type IBwWar         = BaseWarInterfaceIBwWar.IBwWar;

let _meWarClass     : new () => MapEditorInterfaceIMeWar.IMeWar;
let _mpwWarClass    : new () => MultiPlayerWarInterfaceIMpwWar.IMpwWar;
let _rwWarBaseClass : new () => ReplayWarInterfaceIRwWarBase.IRwWarBase;
let _spwWarClass    : new () => SinglePlayerWarInterfaceISpwWar.ISpwWar;
let _twWarClass     : new () => TestWarInterfaceITwWar.ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoSystemEndWar, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeSystemEndWar(war, action);
    } else {
        await normalExeSystemEndWar(war, action);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function fastExeSystemEndWar(war: IBwWar, action: WoSystemEndWar): void {
    war.setIsEnded(true);
}

async function normalExeSystemEndWar(war: IBwWar, action: WoSystemEndWar): Promise<void> {
    const desc = await getDesc(war, action);
    (desc) && (FloatText2.show(desc));

    war.setIsEnded(true);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoSystemEndWar): Promise<string | null> {
    _meWarClass     ??= GameHelpersGhFactory.getMeWarClass();
    _mpwWarClass    ??= GameHelpersGhFactory.getMpwWarClass();
    _rwWarBaseClass ??= GameHelpersGhFactory.getRwWarBaseClass();
    _spwWarClass    ??= GameHelpersGhFactory.getSpwWarClass();
    _twWarClass     ??= GameHelpersGhFactory.getTwWarClass();

    if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        return `${LangUtils.getText(LangConstants.TextType.B0087)}`;
    } else if (war instanceof _rwWarBaseClass) {
        return `${LangUtils.getText(LangConstants.TextType.B0087)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return `${LangUtils.getText(LangConstants.TextType.B0087)}`;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
