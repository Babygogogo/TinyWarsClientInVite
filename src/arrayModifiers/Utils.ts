import * as LangConstants from "../lang/Constants.ts";
import * as LangUtils from "../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoStructureArrayModifier from "../proto/schema/CommonProto/Structure/ArrayModifier.ts";

type ArrayModifier  = ProtoSchemaCommonProtoStructureArrayModifier.ArrayModifier;

export function checkIsValid(data: ArrayModifier, allowedValueSet: Set<number>): boolean {
    return getErrorTip(data, allowedValueSet) == null;
}

export function checkIsDefault(data: ArrayModifier): boolean {
    return (!data.getAddIntArray()?.length)
        && (!data.getDeleteIntArray()?.length);
}

export function getResultValue(data: ArrayModifier, rawValue: number[]): number[] {
    const result = new Set(rawValue);
    for (const num of data.getAddIntArray()) {
        result.add(num);
    }
    for (const num of data.getDeleteIntArray()) {
        result.delete(num);
    }
    return [...result].sort((v1, v2) => v1 - v2);
}

export function getDesc(data: ArrayModifier, name: string): string {
    const textArray: string[] = [];
    {
        const addIntArray = data.getAddIntArray();
        if (addIntArray?.length) {
            textArray.push(`- ${LangUtils.getText(LangConstants.TextType.B1425)}: ${addIntArray.join(`, `)}`);
        }
    }
    {
        const deleteIntArray = data.getDeleteIntArray();
        if (deleteIntArray?.length) {
            textArray.push(`- ${LangUtils.getText(LangConstants.TextType.B1426)}: ${deleteIntArray.join(`, `)}`);
        }
    }

    if (!textArray.length) {
        textArray.push(`- ${LangUtils.getText(LangConstants.TextType.A0957)}`);
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0256, name, textArray.join(`\n`));
}

export function getErrorTip(data: ArrayModifier, allowedValueSet: Set<number>): string | null {
    const addIntArray = data.getAddIntArray();
    const addIntSet     = new Set(addIntArray);
    {
        if (addIntSet.size !== addIntArray.length) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1425));
        }
        for (const num of addIntSet) {
            if (!allowedValueSet.has(num)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1425));
            }
        }
    }

    const deleteIntArray    = data.getDeleteIntArray();
    const deleteIntSet      = new Set(deleteIntArray);
    {
        if (deleteIntSet.size !== deleteIntArray.length) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1426));
        }
        for (const num of deleteIntSet) {
            if (!allowedValueSet.has(num)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1426));
            }
        }
    }

    {
        if ((!addIntArray.length) && (!deleteIntArray.length)) {
            return LangUtils.getText(LangConstants.TextType.A0957);
        }
        for (const num of addIntSet) {
            if (deleteIntSet.has(num)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0560));
            }
        }
    }

    return null;
}
