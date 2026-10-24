import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaPlayBgm from "../../../proto/schema/CommonProto/WarEvent/WeaPlayBgm.ts";
import * as SoundsSoundPlayer from "../../../sounds/SoundPlayer.ts";
import * as SoundsUtils from "../../../sounds/Utils.ts";
import * as UsersModel from "../../../users/Model.ts";

type WeaPlayBgm         = ProtoSchemaCommonProtoWarEventWeaPlayBgm.WeaPlayBgm;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaPlayBgm>, gameConfig: GameConfigGcData.GcData): boolean {
    if (action == null) {
        return false;
    }

    if (action.getUseCoBgm()) {
        return true;
    }

    const bgmCode = action.getBgmCode();
    return (bgmCode != null) && (SoundsUtils.checkIsBgm(bgmCode));
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaPlayBgm>, gameConfig: GameConfigGcData.GcData): string | null {
    if (data == null) {
        return null;
    }

    if (data.getUseCoBgm()) {
        return LangUtils.getText(LangConstants.TextType.A0262);
    } else {
        const bgmCode = data.getBgmCode();
        return `${LangUtils.getText(LangConstants.TextType.B0750)}: ${(bgmCode == null ? null : LangUtils.getBgmSfxName(bgmCode, gameConfig)) ?? LangConstants.UndefinedError}`;
    }
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaPlayBgm>, gameConfig: GameConfigGcData.GcData): string | null {
    return getBriefDesc(data, gameConfig);
}

export function getErrorTip(data: WeaPlayBgm): string | null {
    if (data.getUseCoBgm()) {
        return null;
    }

    const bgmCode = data.getBgmCode();
    return ((bgmCode == null) || (!SoundsUtils.checkIsBgm(bgmCode)))
        ? LangUtils.getText(LangConstants.TextType.A0263)
        : null;
}

export async function applyWithExtraData(action: WeaPlayBgm, isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    return applyWithoutExtraData(action, isFast, war);
}
export async function applyWithoutExtraData(action: WeaPlayBgm, isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    if (isFast) {
        return;
    }

    if (action.getUseCoBgm()) {
        SoundsSoundPlayer.playCoBgmWithWar({
            war                             : war,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : UsersModel.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
        });
    } else {
        SoundsSoundPlayer.playBgm(HelpersMisc.getExisted(action.getBgmCode()));
    }
}
