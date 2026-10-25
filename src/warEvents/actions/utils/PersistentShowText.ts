import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { checkIsValidLanguageTextArray, getLanguageText, getFormattedText, getText } from "../../../lang/Utils.ts";
import type {
    WeaPersistentShowText as ProtoSchemaCommonProtoWarEventWeaPersistentShowText,
} from "../../../proto/schema/CommonProto/WarEvent/WeaPersistentShowText.ts";
import { Common } from "../constants/PersistentShowText.ts";

type WeaPersistentShowText  = ProtoSchemaCommonProtoWarEventWeaPersistentShowText;

export function checkIsValid(action: Undefinable<WeaPersistentShowText>): boolean {
    if (action == null) {
        return false;
    }

    if (!checkIsValidLanguageTextArray({
        list            : action.getTextArray(),
        minTextCount    : 1,
        minTextLength   : 1,
        maxTextLength   : Common.MaxLength,
    })) {
        return false;
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaPersistentShowText>): string | null {
    if (data == null) {
        return null;
    }

    const rawText = getLanguageText({ textArray: data.getTextArray() });
    if (rawText == null) {
        return getFormattedText(TextType.F0131, UndefinedError);
    } else {
        return getFormattedText(TextType.F0131, rawText.length > 20 ? `${rawText?.substring(0, 20)}...` : rawText);
    }
}
export function getDetailDesc(data: Undefinable<WeaPersistentShowText>): string | null {
    return getBriefDesc(data);
}

export function getErrorTip(data: WeaPersistentShowText): string | null {
    if (!checkIsValidLanguageTextArray({
        list            : data.getTextArray(),
        minTextCount    : 1,
        minTextLength   : 1,
        maxTextLength   : Common.MaxLength
    })) {
        return getText(TextType.A0308);
    }

    return null;
}

export function applyWithExtraData(_action: WeaPersistentShowText, actionId: number, war: IBwWar): void {
    war.getWarEventManager().updateOpaIdArrayOnExecuteAction(actionId);
}
export function applyWithoutExtraData(_action: WeaPersistentShowText, actionId: number, war: IBwWar): void {
    war.getWarEventManager().updateOpaIdArrayOnExecuteAction(actionId);
}
