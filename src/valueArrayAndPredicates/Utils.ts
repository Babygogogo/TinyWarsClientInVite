import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as LangConstants from "../lang/Constants.ts";
import * as LangUtils from "../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoStructureValueArrayAndPredicate from "../proto/schema/CommonProto/Structure/ValueArrayAndPredicate.ts";

type ValueArrayAndPredicate = ProtoSchemaCommonProtoStructureValueArrayAndPredicate.ValueArrayAndPredicate;

export function getDesc(data: ValueArrayAndPredicate, valueName: string, getValueText: (v: number) => AuxiliaryTypesAuxiliaryTypes.Undefinable<string>): string {
    return LangUtils.getFormattedText(
        data.getIsOneOf() ? LangConstants.TextType.F0228 : LangConstants.TextType.F0229,
        valueName,
        data.getValueArray()?.map(v => getValueText(v)).join(`, `) ?? LangConstants.UndefinedError
    );
}

export function tickIsOneOf(data: ValueArrayAndPredicate): void {
    data.setIsOneOf(!data.getIsOneOf());
}

export function checkIsValid(data: ValueArrayAndPredicate): boolean {
    const arr = data.getValueArray();
    return (arr != null) && (arr.length > 0) && (arr.length === new Set(arr).size);
}

export function checkIsMeet(data: ValueArrayAndPredicate, value: number): boolean {
    const valueArray = data.getValueArray();
    return data.getIsOneOf()
        ? !!valueArray?.includes(value)
        : !valueArray?.includes(value);
}
