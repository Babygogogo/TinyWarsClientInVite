import { TextType } from "../lang/Constants.ts";
import { getText } from "../lang/Utils.ts";
import { getValueInInt32 } from "../numbers/Utils.ts";
import type { MultiplierAndOffset } from "../proto/schema/CommonProto/Structure/MultiplierAndOffset.ts";
import { Event } from "../warEvents/Constants.ts";

export function checkIsValid(data: MultiplierAndOffset): boolean {
    return getErrorTip(data) == null;
}

export function checkIsDefault(data: MultiplierAndOffset): boolean {
    return ((data.getMultiplierPct()) === 100)
        && ((data.getOffset()) === 0);
}

export function getResultValue(data: MultiplierAndOffset, rawValue: number): number {
    return getValueInInt32(rawValue * (data.getMultiplierPct()) / 100 + (data.getOffset()));
}

export function getBriefDesc(data: MultiplierAndOffset): string {
    const multiplierPct         = data.getMultiplierPct();
    const textForMultiplierPct  = multiplierPct >= 0 ? `* ${multiplierPct}%` : `* (${multiplierPct})%`;
    const offset                = data.getOffset();
    const textForOffset         = offset >= 0 ? `+ ${offset}` : `- ${-offset}`;

    return `${textForMultiplierPct} ${textForOffset}`;
}
export function getDesc(data: MultiplierAndOffset, name: string): string {
    const multiplierPct         = data.getMultiplierPct();
    const textForMultiplierPct  = multiplierPct >= 0 ? `* ${multiplierPct}%` : `* (${multiplierPct})%`;
    const offset                = data.getOffset();
    const textForOffset         = offset >= 0 ? `+ ${offset}` : `- ${-offset}`;

    return `${getText(TextType.B0317)} ${name}: ${textForMultiplierPct} ${textForOffset}`;
}

export function getErrorTip(data: MultiplierAndOffset): string | null {
    const multiplierPct = data.getMultiplierPct();
    if (Math.abs(multiplierPct) > Event.MaxMultiplier) {
        return getText(TextType.Multiplier);
    }

    const offset = data.getOffset();
    if (Math.abs(offset) > Event.MaxOffset) {
        return getText(TextType.Offset);
    }

    if ((multiplierPct === 100) && (offset === 0)) {
        return getText(TextType.A0957);
    }

    return null;
}
