import {
    Sounds_Utils,
    Lang_Utils,
    Helpers_Misc,
    Users_Model,
    Sounds_SoundPlayer,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaPlayBgm } from "../../../proto/schema/CommonProto/WarEvent/WeaPlayBgm.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaPlayBgm>, gameConfig: GameConfigs_GameConfig.GameConfig): boolean {
    if (action == null) {
        return false;
    }

    if (action.getUseCoBgm()) {
        return true;
    }

    const bgmCode = action.getBgmCode();
    return (bgmCode != null) && (Sounds_Utils.checkIsBgm(bgmCode));
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaPlayBgm>, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    if (data == null) {
        return null;
    }

    if (data.getUseCoBgm()) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0262);
    } else {
        const bgmCode = data.getBgmCode();
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0750)}: ${(bgmCode == null ? null : Lang_Utils.getBgmSfxName(bgmCode, gameConfig)) ?? Lang_Constants.UndefinedError}`;
    }
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaPlayBgm>, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    return getBriefDesc(data, gameConfig);
}

export function getErrorTip(data: WeaPlayBgm): string | null {
    if (data.getUseCoBgm()) {
        return null;
    }

    const bgmCode = data.getBgmCode();
    return ((bgmCode == null) || (!Sounds_Utils.checkIsBgm(bgmCode)))
        ? Lang_Utils.getText(Lang_Constants.TextType.A0263)
        : null;
}

export async function applyWithExtraData(action: WeaPlayBgm, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    return applyWithoutExtraData(action, isFast, war);
}
export async function applyWithoutExtraData(action: WeaPlayBgm, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    if (isFast) {
        return;
    }

    if (action.getUseCoBgm()) {
        Sounds_SoundPlayer.playCoBgmWithWar({
            war                            : war,
            force                          : false,
            coBgmCodeArrayFromUserSettings : Users_Model.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
        });
    } else {
        Sounds_SoundPlayer.playBgm(Helpers_Misc.getExisted(action.getBgmCode()));
    }
}
