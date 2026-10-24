import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as FogMapsUtils from "../../../fogMaps/Utils.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetForceFogCodeSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetForceFogCodeSimple.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";

type WeaSetForceFogCodeSimple   = ProtoSchemaCommonProtoWarEventWeaSetForceFogCodeSimple.WeaSetForceFogCodeSimple;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetForceFogCodeSimple>): boolean {
    if (action == null) {
        return false;
    }

    const forceFogCode = action.getForceFogCode();
    return (forceFogCode != null)
        && (FogMapsUtils.checkIsValidForcedFogCode(forceFogCode))
        && (action.getTurnsCount() != null);
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetForceFogCodeSimple>): string | null {
    if (data == null) {
        return null;
    }

    const turnsCount            = HelpersMisc.getExisted(data.getTurnsCount(), UtilsClientErrorCode.ClientErrorCode.WarEventHelper_GetDescForWeaSetHasFog_00);
    const textForForceFogCode   = LangUtils.getForceFogCodeName(HelpersMisc.getExisted(data.getForceFogCode(), UtilsClientErrorCode.ClientErrorCode.WarEventHelper_GetDescForWeaSetHasFog_01)) ?? LangConstants.UndefinedError;
    return (turnsCount == 0)
        ? LangUtils.getFormattedText(LangConstants.TextType.F0109, textForForceFogCode)
        : LangUtils.getFormattedText(LangConstants.TextType.F0108, textForForceFogCode, turnsCount);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetForceFogCodeSimple>): string | null {
    return getBriefDesc(data);
}

export function getErrorTip(data: WeaSetForceFogCodeSimple): string | null {
    const forceFogCode = data.getForceFogCode();
    if ((forceFogCode == null) || (!FogMapsUtils.checkIsValidForcedFogCode(forceFogCode))) {
        return LangUtils.getText(LangConstants.TextType.A0264);
    }

    if (data.getTurnsCount() == null) {
        return LangUtils.getText(LangConstants.TextType.A0253);
    }

    return null;
}

export function applyWithExtraData(action: WeaSetForceFogCodeSimple, war: BaseWarInterfaceIBwWar.IBwWar, isFast: boolean): Promise<void> {
    return apply(action, war, isFast);
}
export function applyWithoutExtraData(action: WeaSetForceFogCodeSimple, war: BaseWarInterfaceIBwWar.IBwWar, isFast: boolean): Promise<void> {
    return apply(action, war, isFast);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function apply(action: WeaSetForceFogCodeSimple, war: BaseWarInterfaceIBwWar.IBwWar, isFast: boolean): Promise<void> {
    const fogMap = war.getFogMap();
    fogMap.setForceFogCode(HelpersMisc.getExisted(action.getForceFogCode()));

    const turnsCount = HelpersMisc.getExisted(action.getTurnsCount());
    if (turnsCount == 0) {
        fogMap.setForceExpirePlayerIndex(null);
        fogMap.setForceExpireTurnIndex(null);
    } else {
        fogMap.setForceExpirePlayerIndex(war.getPlayerIndexInTurn());
        fogMap.setForceExpireTurnIndex(war.getTurnManager().getTurnIndex() + turnsCount);
    }
}
