import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GcData } from "../../../gameConfigs/GcData.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getText, getBgmSfxName } from "../../../lang/Utils.ts";
import type { WeaPlayBgm } from "../../../proto/schema/CommonProto/WarEvent/WeaPlayBgm.ts";
import { playCoBgmWithWar, playBgm } from "../../../sounds/SoundPlayer.ts";
import { checkIsBgm } from "../../../sounds/Utils.ts";
import { getSelfSettingsCoBgmCodeArray } from "../../../users/Model.ts";

export function checkIsValid(action: Undefinable<WeaPlayBgm>, gameConfig: GcData): boolean {
    if (action == null) {
        return false;
    }

    if (action.getUseCoBgm()) {
        return true;
    }

    const bgmCode = action.getBgmCode();
    return (bgmCode != null) && (checkIsBgm(bgmCode));
}

export function getBriefDesc(data: Undefinable<WeaPlayBgm>, gameConfig: GcData): string | null {
    if (data == null) {
        return null;
    }

    if (data.getUseCoBgm()) {
        return getText(TextType.A0262);
    } else {
        const bgmCode = data.getBgmCode();
        return `${getText(TextType.B0750)}: ${(bgmCode == null ? null : getBgmSfxName(bgmCode, gameConfig)) ?? UndefinedError}`;
    }
}
export function getDetailDesc(data: Undefinable<WeaPlayBgm>, gameConfig: GcData): string | null {
    return getBriefDesc(data, gameConfig);
}

export function getErrorTip(data: WeaPlayBgm): string | null {
    if (data.getUseCoBgm()) {
        return null;
    }

    const bgmCode = data.getBgmCode();
    return ((bgmCode == null) || (!checkIsBgm(bgmCode)))
        ? getText(TextType.A0263)
        : null;
}

export async function applyWithExtraData(action: WeaPlayBgm, isFast: boolean, war: IBwWar): Promise<void> {
    return applyWithoutExtraData(action, isFast, war);
}
export async function applyWithoutExtraData(action: WeaPlayBgm, isFast: boolean, war: IBwWar): Promise<void> {
    if (isFast) {
        return;
    }

    if (action.getUseCoBgm()) {
        playCoBgmWithWar({
            war                             : war,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
        });
    } else {
        playBgm(getExisted(action.getBgmCode()));
    }
}
