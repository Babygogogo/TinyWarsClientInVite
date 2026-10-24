import * as LangConstants from "../lang/Constants.ts";
import * as LangUtils from "../lang/Utils.ts";
import * as NumbersUtils from "../numbers/Utils.ts";
import type * as ProtoSchemaCommonProtoStructureMultiplierAndOffset from "../proto/schema/CommonProto/Structure/MultiplierAndOffset.ts";
import * as WarEventsConstants from "../warEvents/Constants.ts";

type MultiplierAndOffsetSchema  = ProtoSchemaCommonProtoStructureMultiplierAndOffset.MultiplierAndOffset;

export function checkIsValid(data: MultiplierAndOffsetSchema): boolean {
    return getErrorTip(data) == null;
}

export function checkIsDefault(data: MultiplierAndOffsetSchema): boolean {
    return ((data.getMultiplierPct() ?? 100) === 100)
        && ((data.getOffset() ?? 0) === 0);
}

export function getResultValue(data: MultiplierAndOffsetSchema, rawValue: number): number {
    return NumbersUtils.getValueInInt32(rawValue * (data.getMultiplierPct() ?? 100) / 100 + (data.getOffset() ?? 0));
}

export function getBriefDesc(data: MultiplierAndOffsetSchema): string {
    const multiplierPct         = data.getMultiplierPct() ?? 100;
    const textForMultiplierPct  = multiplierPct >= 0 ? `* ${multiplierPct}%` : `* (${multiplierPct})%`;
    const offset                = data.getOffset() ?? 0;
    const textForOffset         = offset >= 0 ? `+ ${offset}` : `- ${-offset}`;

    return `${textForMultiplierPct} ${textForOffset}`;
}
export function getDesc(data: MultiplierAndOffsetSchema, name: string): string {
    const multiplierPct         = data.getMultiplierPct() ?? 100;
    const textForMultiplierPct  = multiplierPct >= 0 ? `* ${multiplierPct}%` : `* (${multiplierPct})%`;
    const offset                = data.getOffset() ?? 0;
    const textForOffset         = offset >= 0 ? `+ ${offset}` : `- ${-offset}`;

    return `${LangUtils.getText(LangConstants.TextType.B0317)} ${name}: ${textForMultiplierPct} ${textForOffset}`;
}

export function getErrorTip(data: MultiplierAndOffsetSchema): string | null {
    const multiplierPct = data.getMultiplierPct() ?? 100;
    if (Math.abs(multiplierPct) > WarEventsConstants.Event.MaxMultiplier) {
        return LangUtils.getText(LangConstants.TextType.Multiplier);
    }

    const offset = data.getOffset() ?? 0;
    if (Math.abs(offset) > WarEventsConstants.Event.MaxOffset) {
        return LangUtils.getText(LangConstants.TextType.Offset);
    }

    if ((multiplierPct === 100) && (offset === 0)) {
        return LangUtils.getText(LangConstants.TextType.A0957);
    }

    return null;
}
