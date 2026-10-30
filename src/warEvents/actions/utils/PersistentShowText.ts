import {
    Lang_Utils,
    WarEvents_Actions_Constants_PersistentShowText,
    Lang_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaPersistentShowText } from "../../../proto/schema/CommonProto/WarEvent/WeaPersistentShowText.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaPersistentShowText>): boolean {
    if (action == null) {
        return false;
    }

    if (!Lang_Utils.checkIsValidLanguageTextArray({
        list          : action.getTextArray(),
        minTextCount  : 1,
        minTextLength : 1,
        maxTextLength : WarEvents_Actions_Constants_PersistentShowText.Common.MaxLength,
    })) {
        return false;
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaPersistentShowText>): string | null {
    if (data == null) {
        return null;
    }

    const rawText = Lang_Utils.getLanguageText({ textArray : data.getTextArray() });
    if (rawText == null) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0131, Lang_Constants.UndefinedError);
    } else {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0131, rawText.length > 20 ? `${rawText?.substring(0, 20)}...` : rawText);
    }
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaPersistentShowText>): string | null {
    return getBriefDesc(data);
}

export function getErrorTip(data: WeaPersistentShowText): string | null {
    if (!Lang_Utils.checkIsValidLanguageTextArray({
        list          : data.getTextArray(),
        minTextCount  : 1,
        minTextLength : 1,
        maxTextLength : WarEvents_Actions_Constants_PersistentShowText.Common.MaxLength,
    })) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0308);
    }

    return null;
}

export function applyWithExtraData(_action: WeaPersistentShowText, actionId: number, war: BaseWar_Interface_IBwWar.IBwWar): void {
    war.getWarEventManager().updateOpaIdArrayOnExecuteAction(actionId);
}
export function applyWithoutExtraData(_action: WeaPersistentShowText, actionId: number, war: BaseWar_Interface_IBwWar.IBwWar): void {
    war.getWarEventManager().updateOpaIdArrayOnExecuteAction(actionId);
}
