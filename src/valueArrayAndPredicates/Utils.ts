import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { TextType } from "../lang/Constants.ts";
import { getFormattedText } from "../lang/Utils.ts";
import type { ValueArrayAndPredicate } from "../proto/schema/CommonProto/Structure/ValueArrayAndPredicate.ts";

export function getDesc(data: ValueArrayAndPredicate, valueName: string, getValueText: (v: number) => Undefinable<string>): string {
    return getFormattedText(
        data.getIsOneOf() ? TextType.F0228 : TextType.F0229,
        valueName,
        data.getValueArray()?.map(v => getValueText(v)).join(`, `)
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
