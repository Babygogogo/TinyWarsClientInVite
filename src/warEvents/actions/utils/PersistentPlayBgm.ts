import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GcData } from "../../../gameConfigs/GcData.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getText, getBgmSfxName } from "../../../lang/Utils.ts";
import type { WeaPersistentPlayBgm } from "../../../proto/schema/CommonProto/WarEvent/WeaPersistentPlayBgm.ts";
import { playBgm } from "../../../sounds/SoundPlayer.ts";
import { checkIsBgm } from "../../../sounds/Utils.ts";

export function checkIsValid(action: Undefinable<WeaPersistentPlayBgm>): boolean {
    if (action == null) {
        return false;
    }

    const bgmCode = action.getBgmCode();
    return (bgmCode != null) && (checkIsBgm(bgmCode));
}

export function getBriefDesc(data: Undefinable<WeaPersistentPlayBgm>, gameConfig: GcData): string | null {
    if (data == null) {
        return null;
    }

    const bgmCode = data.getBgmCode();
    return `${getText(TextType.B1083)}: ${(bgmCode == null ? null : getBgmSfxName(bgmCode, gameConfig) ?? UndefinedError)}`;
}
export function getDetailDesc(data: Undefinable<WeaPersistentPlayBgm>, gameConfig: GcData): string | null {
    return getBriefDesc(data, gameConfig);
}

export function getErrorTip(data: WeaPersistentPlayBgm): string | null {
    const bgmCode = data.getBgmCode();
    return ((bgmCode == null) || (!checkIsBgm(bgmCode)))
        ? getText(TextType.A0263)
        : null;
}

export function applyWithExtraData(action: WeaPersistentPlayBgm, isFastExecute: boolean, actionId: number, war: IBwWar): void {
    return applyWithoutExtraData(action, isFastExecute, actionId, war);
}
export function applyWithoutExtraData(action: WeaPersistentPlayBgm, isFastExecute: boolean, actionId: number, war: IBwWar): void {
    war.getWarEventManager().updateOpaIdArrayOnExecuteAction(actionId);

    if (!isFastExecute) {
        playBgm(getExisted(action.getBgmCode()));
    }
}
