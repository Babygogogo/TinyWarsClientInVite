import {
    FogMaps_Utils,
    Lang_Utils,
    Lang_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaSetForceFogCodeSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetForceFogCodeSimple.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetForceFogCodeSimple>): boolean {
    if (action == null) {
        return false;
    }

    const forceFogCode = action.getForceFogCode();
    return (forceFogCode != null)
        && (FogMaps_Utils.checkIsValidForcedFogCode(forceFogCode))
        && (action.getTurnsCount() != null);
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetForceFogCodeSimple>): string | null {
    if (data == null) {
        return null;
    }

    const turnsCount            = data.getTurnsCount();
    const textForForceFogCode   = Lang_Utils.getForceFogCodeName(data.getForceFogCode()) ?? Lang_Constants.UndefinedError;
    return (turnsCount == 0)
        ? Lang_Utils.getFormattedText(Lang_Constants.TextType.F0109, textForForceFogCode)
        : Lang_Utils.getFormattedText(Lang_Constants.TextType.F0108, textForForceFogCode, turnsCount);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetForceFogCodeSimple>): string | null {
    return getBriefDesc(data);
}

export function getErrorTip(data: WeaSetForceFogCodeSimple): string | null {
    const forceFogCode = data.getForceFogCode();
    if ((forceFogCode == null) || (!FogMaps_Utils.checkIsValidForcedFogCode(forceFogCode))) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0264);
    }

    if (data.getTurnsCount() == null) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0253);
    }

    return null;
}

export function applyWithExtraData(action: WeaSetForceFogCodeSimple, war: BaseWar_Interface_IBwWar.IBwWar, isFast: boolean): Promise<void> {
    return apply(action, war, isFast);
}
export function applyWithoutExtraData(action: WeaSetForceFogCodeSimple, war: BaseWar_Interface_IBwWar.IBwWar, isFast: boolean): Promise<void> {
    return apply(action, war, isFast);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function apply(action: WeaSetForceFogCodeSimple, war: BaseWar_Interface_IBwWar.IBwWar, isFast: boolean): Promise<void> {
    const fogMap = war.getFogMap();
    fogMap.setForceFogCode(action.getForceFogCode());

    const turnsCount = action.getTurnsCount();
    if (turnsCount == 0) {
        fogMap.setForceExpirePlayerIndex(null);
        fogMap.setForceExpireTurnIndex(null);
    } else {
        fogMap.setForceExpirePlayerIndex(war.getPlayerIndexInTurn());
        fogMap.setForceExpireTurnIndex(war.getTurnManager().getTurnIndex() + turnsCount);
    }
}
