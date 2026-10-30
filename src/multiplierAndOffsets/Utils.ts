import {
    WarEvents_Constants,
    Lang_Utils,
    Numbers_Utils,
    Lang_Constants,
} from "../internal.ts";
import type { MultiplierAndOffset } from "../proto/schema/CommonProto/Structure/MultiplierAndOffset.ts";

export function checkIsValid(data: MultiplierAndOffset): boolean {
    return getErrorTip(data) == null;
}

export function checkIsDefault(data: MultiplierAndOffset): boolean {
    return ((data.getMultiplierPct()) === 100)
        && ((data.getOffset()) === 0);
}

export function getResultValue(data: MultiplierAndOffset, rawValue: number): number {
    return Numbers_Utils.getValueInInt32(rawValue * (data.getMultiplierPct()) / 100 + (data.getOffset()));
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

    return `${Lang_Utils.getText(Lang_Constants.TextType.B0317)} ${name}: ${textForMultiplierPct} ${textForOffset}`;
}

export function getErrorTip(data: MultiplierAndOffset): string | null {
    const multiplierPct = data.getMultiplierPct();
    if (Math.abs(multiplierPct) > WarEvents_Constants.Event.MaxMultiplier) {
        return Lang_Utils.getText(Lang_Constants.TextType.Multiplier);
    }

    const offset = data.getOffset();
    if (Math.abs(offset) > WarEvents_Constants.Event.MaxOffset) {
        return Lang_Utils.getText(Lang_Constants.TextType.Offset);
    }

    if ((multiplierPct === 100) && (offset === 0)) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0957);
    }

    return null;
}
