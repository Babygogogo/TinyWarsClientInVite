import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GcData } from "../../../gameConfig/GcData.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getText, getBgmSfxName } from "../../../lang/Utils.ts";
import type { WeaPlaySfx } from "../../../proto/schema/CommonProto/WarEvent/WeaPlaySfx.ts";
import { playShortSfx } from "../../../sounds/SoundPlayer.ts";
import { checkIsSfx } from "../../../sounds/Utils.ts";

export function checkIsValid(action: Undefinable<WeaPlaySfx>): boolean {
    if (action == null) {
        return false;
    }

    return checkIsSfx(action.getSfxCode() ?? 0);
}

export function getBriefDesc(data: Undefinable<WeaPlaySfx>, gameConfig: GcData): string | null {
    if (data == null) {
        return null;
    }

    const sfxCode = data.getSfxCode() ?? 0;
    return `${getText(TextType.B1164)}: ${getBgmSfxName(sfxCode, gameConfig) ?? UndefinedError}`;
}
export function getDetailDesc(data: Undefinable<WeaPlaySfx>, gameConfig: GcData): string | null {
    return getBriefDesc(data, gameConfig);
}

export function getErrorTip(data: WeaPlaySfx): string | null {
    return !checkIsSfx(data.getSfxCode() ?? 0)
        ? getText(TextType.A0497)
        : null;
}

export async function applyWithExtraData(action: WeaPlaySfx, isFast: boolean): Promise<void> {
    return applyWithoutExtraData(action, isFast);
}
export async function applyWithoutExtraData(action: WeaPlaySfx, isFast: boolean): Promise<void> {
    if (isFast) {
        return;
    }

    playShortSfx(action.getSfxCode() ?? 0);
}
