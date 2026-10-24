import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaPlaySfx from "../../../proto/schema/CommonProto/WarEvent/WeaPlaySfx.ts";
import * as SoundsSoundPlayer from "../../../sounds/SoundPlayer.ts";
import * as SoundsUtils from "../../../sounds/Utils.ts";

type WeaPlaySfx         = ProtoSchemaCommonProtoWarEventWeaPlaySfx.WeaPlaySfx;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaPlaySfx>): boolean {
    if (action == null) {
        return false;
    }

    return SoundsUtils.checkIsSfx(action.getSfxCode() ?? 0);
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaPlaySfx>, gameConfig: GameConfigGcData.GcData): string | null {
    if (data == null) {
        return null;
    }

    const sfxCode = data.getSfxCode() ?? 0;
    return `${LangUtils.getText(LangConstants.TextType.B1164)}: ${LangUtils.getBgmSfxName(sfxCode, gameConfig) ?? LangConstants.UndefinedError}`;
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaPlaySfx>, gameConfig: GameConfigGcData.GcData): string | null {
    return getBriefDesc(data, gameConfig);
}

export function getErrorTip(data: WeaPlaySfx): string | null {
    return !SoundsUtils.checkIsSfx(data.getSfxCode() ?? 0)
        ? LangUtils.getText(LangConstants.TextType.A0497)
        : null;
}

export async function applyWithExtraData(action: WeaPlaySfx, isFast: boolean): Promise<void> {
    return applyWithoutExtraData(action, isFast);
}
export async function applyWithoutExtraData(action: WeaPlaySfx, isFast: boolean): Promise<void> {
    if (isFast) {
        return;
    }

    SoundsSoundPlayer.playShortSfx(action.getSfxCode() ?? 0);
}
