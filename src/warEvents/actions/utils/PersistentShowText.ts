import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaPersistentShowText from "../../../proto/schema/CommonProto/WarEvent/WeaPersistentShowText.ts";
import * as WarEventsActionsConstantsPersistentShowText from "../constants/PersistentShowText.ts";

type WeaPersistentShowText  = ProtoSchemaCommonProtoWarEventWeaPersistentShowText.WeaPersistentShowText;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaPersistentShowText>): boolean {
    if (action == null) {
        return false;
    }

    if (!LangUtils.checkIsValidLanguageTextArray({
        list            : action.getTextArray(),
        minTextCount    : 1,
        minTextLength   : 1,
        maxTextLength   : WarEventsActionsConstantsPersistentShowText.Common.MaxLength,
    })) {
        return false;
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaPersistentShowText>): string | null {
    if (data == null) {
        return null;
    }

    const rawText = LangUtils.getLanguageText({ textArray: data.getTextArray() });
    if (rawText == null) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0131, LangConstants.UndefinedError);
    } else {
        return LangUtils.getFormattedText(LangConstants.TextType.F0131, rawText.length > 20 ? `${rawText?.substring(0, 20)}...` : rawText);
    }
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaPersistentShowText>): string | null {
    return getBriefDesc(data);
}

export function getErrorTip(data: WeaPersistentShowText): string | null {
    if (!LangUtils.checkIsValidLanguageTextArray({
        list            : data.getTextArray(),
        minTextCount    : 1,
        minTextLength   : 1,
        maxTextLength   : WarEventsActionsConstantsPersistentShowText.Common.MaxLength
    })) {
        return LangUtils.getText(LangConstants.TextType.A0308);
    }

    return null;
}

export function applyWithExtraData(_action: WeaPersistentShowText, actionId: number, war: BaseWarInterfaceIBwWar.IBwWar): void {
    war.getWarEventManager().updateOpaIdArrayOnExecuteAction(actionId);
}
export function applyWithoutExtraData(_action: WeaPersistentShowText, actionId: number, war: BaseWarInterfaceIBwWar.IBwWar): void {
    war.getWarEventManager().updateOpaIdArrayOnExecuteAction(actionId);
}
