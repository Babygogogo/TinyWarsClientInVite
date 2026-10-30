import {
    Sounds_Utils,
    Lang_Utils,
    Helpers_Misc,
    Sounds_SoundPlayer,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaPersistentPlayBgm } from "../../../proto/schema/CommonProto/WarEvent/WeaPersistentPlayBgm.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaPersistentPlayBgm>): boolean {
    if (action == null) {
        return false;
    }

    const bgmCode = action.getBgmCode();
    return (bgmCode != null) && (Sounds_Utils.checkIsBgm(bgmCode));
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaPersistentPlayBgm>, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    if (data == null) {
        return null;
    }

    const bgmCode = data.getBgmCode();
    return `${Lang_Utils.getText(Lang_Constants.TextType.B1083)}: ${(bgmCode == null ? null : Lang_Utils.getBgmSfxName(bgmCode, gameConfig) ?? Lang_Constants.UndefinedError)}`;
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaPersistentPlayBgm>, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    return getBriefDesc(data, gameConfig);
}

export function getErrorTip(data: WeaPersistentPlayBgm): string | null {
    const bgmCode = data.getBgmCode();
    return ((bgmCode == null) || (!Sounds_Utils.checkIsBgm(bgmCode)))
        ? Lang_Utils.getText(Lang_Constants.TextType.A0263)
        : null;
}

export function applyWithExtraData(action: WeaPersistentPlayBgm, isFastExecute: boolean, actionId: number, war: BaseWar_Interface_IBwWar.IBwWar): void {
    return applyWithoutExtraData(action, isFastExecute, actionId, war);
}
export function applyWithoutExtraData(action: WeaPersistentPlayBgm, isFastExecute: boolean, actionId: number, war: BaseWar_Interface_IBwWar.IBwWar): void {
    war.getWarEventManager().updateOpaIdArrayOnExecuteAction(actionId);

    if (!isFastExecute) {
        Sounds_SoundPlayer.playBgm(Helpers_Misc.getExisted(action.getBgmCode()));
    }
}
