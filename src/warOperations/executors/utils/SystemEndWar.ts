import type { IBwWar as BaseWarInterfaceIBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { show } from "../../../FloatText.ts";
import { getMeWarClass, getMpwWarClass, getRwWarBaseClass, getSpwWarClass, getTwWarClass } from "../../../gameHelpers/GhFactory.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
import type { IMpwWar } from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type {
    WoSystemEndWar as ProtoSchemaCommonProtoWarOperationWoSystemEndWar,
} from "../../../proto/schema/CommonProto/WarOperation/WoSystemEndWar.ts";
import type { IRwWarBase } from "../../../replayWar/interface/IRwWarBase.ts";
import type { ISpwWar } from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type { ITwWar } from "../../../testWar/interface/ITwWar.ts";

type WoSystemEndWar = ProtoSchemaCommonProtoWarOperationWoSystemEndWar;
type IBwWar         = BaseWarInterfaceIBwWar;

let _meWarClass     : new () => IMeWar;
let _mpwWarClass    : new () => IMpwWar;
let _rwWarBaseClass : new () => IRwWarBase;
let _spwWarClass    : new () => ISpwWar;
let _twWarClass     : new () => ITwWar;

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
    (desc) && (show(desc));

    war.setIsEnded(true);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoSystemEndWar): Promise<string | null> {
    _meWarClass     ??= getMeWarClass();
    _mpwWarClass    ??= getMpwWarClass();
    _rwWarBaseClass ??= getRwWarBaseClass();
    _spwWarClass    ??= getSpwWarClass();
    _twWarClass     ??= getTwWarClass();

    if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        return `${getText(TextType.B0087)}`;
    } else if (war instanceof _rwWarBaseClass) {
        return `${getText(TextType.B0087)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return `${getText(TextType.B0087)}`;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
