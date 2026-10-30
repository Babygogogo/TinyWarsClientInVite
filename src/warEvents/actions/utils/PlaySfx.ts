import {
    Sounds_Utils,
    Lang_Utils,
    Sounds_SoundPlayer,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaPlaySfx } from "../../../proto/schema/CommonProto/WarEvent/WeaPlaySfx.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaPlaySfx>): boolean {
    if (action == null) {
        return false;
    }

    return Sounds_Utils.checkIsSfx(action.getSfxCode() ?? 0);
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaPlaySfx>, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    if (data == null) {
        return null;
    }

    const sfxCode = data.getSfxCode() ?? 0;
    return `${Lang_Utils.getText(Lang_Constants.TextType.B1164)}: ${Lang_Utils.getBgmSfxName(sfxCode, gameConfig) ?? Lang_Constants.UndefinedError}`;
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaPlaySfx>, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    return getBriefDesc(data, gameConfig);
}

export function getErrorTip(data: WeaPlaySfx): string | null {
    return !Sounds_Utils.checkIsSfx(data.getSfxCode() ?? 0)
        ? Lang_Utils.getText(Lang_Constants.TextType.A0497)
        : null;
}

export async function applyWithExtraData(action: WeaPlaySfx, isFast: boolean): Promise<void> {
    return applyWithoutExtraData(action, isFast);
}
export async function applyWithoutExtraData(action: WeaPlaySfx, isFast: boolean): Promise<void> {
    if (isFast) {
        return;
    }

    Sounds_SoundPlayer.playShortSfx(action.getSfxCode() ?? 0);
}
