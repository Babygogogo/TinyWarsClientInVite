import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { checkIsValidForcedFogCode } from "../../../fogMaps/Utils.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { UndefinedError, TextType } from "../../../lang/Constants.ts";
import { getForceFogCodeName, getFormattedText, getText } from "../../../lang/Utils.ts";
import type { WeaSetForceFogCodeSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetForceFogCodeSimple.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";

export function checkIsValid(action: Undefinable<WeaSetForceFogCodeSimple>): boolean {
    if (action == null) {
        return false;
    }

    const forceFogCode = action.getForceFogCode();
    return (forceFogCode != null)
        && (checkIsValidForcedFogCode(forceFogCode))
        && (action.getTurnsCount() != null);
}

export function getBriefDesc(data: Undefinable<WeaSetForceFogCodeSimple>): string | null {
    if (data == null) {
        return null;
    }

    const turnsCount            = getExisted(data.getTurnsCount(), ClientErrorCode.WarEventHelper_GetDescForWeaSetHasFog_00);
    const textForForceFogCode   = getForceFogCodeName(getExisted(data.getForceFogCode(), ClientErrorCode.WarEventHelper_GetDescForWeaSetHasFog_01)) ?? UndefinedError;
    return (turnsCount == 0)
        ? getFormattedText(TextType.F0109, textForForceFogCode)
        : getFormattedText(TextType.F0108, textForForceFogCode, turnsCount);
}
export function getDetailDesc(data: Undefinable<WeaSetForceFogCodeSimple>): string | null {
    return getBriefDesc(data);
}

export function getErrorTip(data: WeaSetForceFogCodeSimple): string | null {
    const forceFogCode = data.getForceFogCode();
    if ((forceFogCode == null) || (!checkIsValidForcedFogCode(forceFogCode))) {
        return getText(TextType.A0264);
    }

    if (data.getTurnsCount() == null) {
        return getText(TextType.A0253);
    }

    return null;
}

export function applyWithExtraData(action: WeaSetForceFogCodeSimple, war: IBwWar, isFast: boolean): Promise<void> {
    return apply(action, war, isFast);
}
export function applyWithoutExtraData(action: WeaSetForceFogCodeSimple, war: IBwWar, isFast: boolean): Promise<void> {
    return apply(action, war, isFast);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function apply(action: WeaSetForceFogCodeSimple, war: IBwWar, isFast: boolean): Promise<void> {
    const fogMap = war.getFogMap();
    fogMap.setForceFogCode(getExisted(action.getForceFogCode()));

    const turnsCount = getExisted(action.getTurnsCount());
    if (turnsCount == 0) {
        fogMap.setForceExpirePlayerIndex(null);
        fogMap.setForceExpireTurnIndex(null);
    } else {
        fogMap.setForceExpirePlayerIndex(war.getPlayerIndexInTurn());
        fogMap.setForceExpireTurnIndex(war.getTurnManager().getTurnIndex() + turnsCount);
    }
}
