import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    Helpers_Misc,
    Lang_Constants, Lang_TextType,
    Lang_Utils,
    Sounds_SoundPlayer,
    Sounds_Utils,
    Users_Model,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
    type GameConfigs_GameConfig,
} from "../../../internal.ts";
import type { WeaPlayBgm } from "../../../proto/schema/CommonProto/WarEvent/WeaPlayBgm.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        return Lang_Utils.getText(Lang_TextType.TextType.A0262);
    } else {
        const bgmCode = data.getBgmCode();
        return `${Lang_Utils.getText(Lang_TextType.TextType.B0750)}: ${(bgmCode == null ? null : Lang_Utils.getBgmSfxName(bgmCode, gameConfig)) ?? Lang_Constants.UndefinedError}`;
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
        ? Lang_Utils.getText(Lang_TextType.TextType.A0263)
        : null;
}

export async function executeAsOuterWar(action: WeaPlayBgm, war: BaseWar_Model_War.War, isFastExecute: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
    return executeAsLocalWar(action, war, isFastExecute);
}
export async function executeAsLocalWar(action: WeaPlayBgm, war: BaseWar_Model_War.War, isFastExecute: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
    if (isFastExecute) {
        return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
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

    return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
}
