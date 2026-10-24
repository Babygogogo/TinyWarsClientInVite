import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaPersistentPlayBgm from "../../../proto/schema/CommonProto/WarEvent/WeaPersistentPlayBgm.ts";
import * as SoundsSoundPlayer from "../../../sounds/SoundPlayer.ts";
import * as SoundsUtils from "../../../sounds/Utils.ts";

type WeaPersistentPlayBgm   = ProtoSchemaCommonProtoWarEventWeaPersistentPlayBgm.WeaPersistentPlayBgm;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaPersistentPlayBgm>): boolean {
    if (action == null) {
        return false;
    }

    const bgmCode = action.getBgmCode();
    return (bgmCode != null) && (SoundsUtils.checkIsBgm(bgmCode));
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaPersistentPlayBgm>, gameConfig: GameConfigGcData.GcData): string | null {
    if (data == null) {
        return null;
    }

    const bgmCode = data.getBgmCode();
    return `${LangUtils.getText(LangConstants.TextType.B1083)}: ${(bgmCode == null ? null : LangUtils.getBgmSfxName(bgmCode, gameConfig) ?? LangConstants.UndefinedError)}`;
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaPersistentPlayBgm>, gameConfig: GameConfigGcData.GcData): string | null {
    return getBriefDesc(data, gameConfig);
}

export function getErrorTip(data: WeaPersistentPlayBgm): string | null {
    const bgmCode = data.getBgmCode();
    return ((bgmCode == null) || (!SoundsUtils.checkIsBgm(bgmCode)))
        ? LangUtils.getText(LangConstants.TextType.A0263)
        : null;
}

export function applyWithExtraData(action: WeaPersistentPlayBgm, isFastExecute: boolean, actionId: number, war: BaseWarInterfaceIBwWar.IBwWar): void {
    return applyWithoutExtraData(action, isFastExecute, actionId, war);
}
export function applyWithoutExtraData(action: WeaPersistentPlayBgm, isFastExecute: boolean, actionId: number, war: BaseWarInterfaceIBwWar.IBwWar): void {
    war.getWarEventManager().updateOpaIdArrayOnExecuteAction(actionId);

    if (!isFastExecute) {
        SoundsSoundPlayer.playBgm(HelpersMisc.getExisted(action.getBgmCode()));
    }
}
