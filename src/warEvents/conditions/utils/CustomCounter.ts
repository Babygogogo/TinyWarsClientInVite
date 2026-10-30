import {
    ValueAndComparators_Utils,
    CustomCounters_Utils,
    Utils_ClientErrorCode,
    CustomCounters_Constants,
    Lang_Utils,
    Helpers_Misc,
    Helpers_Collection,
    Lang_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WecCustomCounter } from "../../../proto/schema/CommonProto/WarEvent/WecCustomCounter.ts";

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecCustomCounter>): string | null {
    if (data == null) {
        return null;
    }

    const counterIdArray        = data.getCounterIdArray();
    const textForCounterIdArray = counterIdArray?.length
        ? counterIdArray.join(`/`)
        : Lang_Utils.getFormattedText(Lang_Constants.TextType.F0097, Lang_Utils.getText(Lang_Constants.TextType.B0792));

    const targetValue           = data.getValue();
    const textForTargetValue    = targetValue != null
        ? Lang_Utils.getFormattedText(Lang_Constants.TextType.F0112, Lang_Utils.getComparatorName(Helpers_Misc.getExisted(data.getValueComparator())), targetValue)
        : null;

    const valueDivider      = data.getValueDivider();
    const valueRemainder    = data.getValueRemainder();
    const textForRemainder  = (valueDivider ?? valueRemainder != null)
        ? Lang_Utils.getFormattedText(Lang_Constants.TextType.F0113, valueDivider ?? Lang_Constants.UndefinedError, Lang_Utils.getComparatorName(Helpers_Misc.getExisted(data.getValueRemainderComparator())), valueRemainder ?? Lang_Constants.UndefinedError)
        : null;

    const textArrayForSubConditions = Helpers_Collection.getNonNullElements([
        textForTargetValue,
        textForRemainder,
    ]);
    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0111,
        textForCounterIdArray,
        textArrayForSubConditions.length ? textArrayForSubConditions.map(v => `${Lang_Utils.getText(Lang_Constants.TextType.B0783)}${v}`).join(``) : ``,
        Lang_Utils.getComparatorName(data.getCounterCountComparator()),
        data.getCounterCount(),
    );
}
export function getDetailedDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecCustomCounter>): string | null {
    return getBriefDesc(data);
}
export function getErrorTip(data: WecCustomCounter): string | null {
    if (data.getCounterCount() == null) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0801));
    }

    {
        const comparator = data.getCounterCountComparator();
        if ((comparator == null) || (!ValueAndComparators_Utils.checkIsValidValueComparatorId(comparator))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Comparator));
        }
    }

    {
        const comparator = data.getValueComparator();
        if ((comparator == null) || (!ValueAndComparators_Utils.checkIsValidValueComparatorId(comparator))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Comparator));
        }
    }

    {
        const divider   = data.getValueDivider();
        const remainder = data.getValueRemainder();
        if (divider == null) {
            if (remainder != null) {
                return Lang_Utils.getText(Lang_Constants.TextType.A0265);
            }
        } else {
            if ((divider <= 1) || (remainder == null)) {
                return Lang_Utils.getText(Lang_Constants.TextType.A0265);
            }
        }
    }

    {
        const comparator = data.getValueRemainderComparator();
        if ((comparator == null) || (!ValueAndComparators_Utils.checkIsValidValueComparatorId(comparator))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Comparator));
        }
    }

    return null;
}

export function checkIsValid(condition: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecCustomCounter>): boolean {
    if (condition == null) {
        return false;
    }

    {
        const counterIdArray = condition.getCounterIdArray();
        if ((counterIdArray?.length) && (!CustomCounters_Utils.checkIsValidIdSubset(counterIdArray))) {
            return false;
        }
    }

    if (condition.getCounterCount() == null) {
        return false;
    }

    {
        const comparator = condition.getCounterCountComparator();
        if ((comparator == null) || (!ValueAndComparators_Utils.checkIsValidValueComparatorId(comparator))) {
            return false;
        }
    }

    {
        const comparator = condition.getValueComparator();
        if ((comparator == null) || (!ValueAndComparators_Utils.checkIsValidValueComparatorId(comparator))) {
            return false;
        }
    }

    {
        const divider   = condition.getValueDivider();
        const remainder = condition.getValueRemainder();
        if (divider == null) {
            if (remainder != null) {
                return false;
            }
        } else {
            if ((divider <= 1) || (remainder == null)) {
                return false;
            }
        }
    }

    {
        const comparator = condition.getValueRemainderComparator();
        if ((comparator == null) || (!ValueAndComparators_Utils.checkIsValidValueComparatorId(comparator))) {
            return false;
        }
    }

    return true;
}

export function checkIsMeet(condition: WecCustomCounter, war: BaseWar_Interface_IBwWar.IBwWar): boolean {
    const counterIdArray        = condition.getCounterIdArray();
    const targetValue           = condition.getValue();
    const valueComparator       = Helpers_Misc.getExisted(condition.getValueComparator(), Utils_ClientErrorCode.ClientErrorCode.BwWarEventManager_CheckIsMeetConCustomCounter_00);
    const valueDivider          = condition.getValueDivider();
    const valueRemainder        = condition.getValueRemainder();
    const remainderComparator   = Helpers_Misc.getExisted(condition.getValueRemainderComparator(), Utils_ClientErrorCode.ClientErrorCode.BwWarEventManager_CheckIsMeetConCustomCounter_01);
    const warEventManager       = war.getWarEventManager();
    let counter                 = 0;
    for (let counterId = CustomCounters_Constants.Constants.MinId; counterId <= CustomCounters_Constants.Constants.MaxId; ++counterId) {
        if ((counterIdArray.length) && (counterIdArray.indexOf(counterId) < 0)) {
            continue;
        }

        const value = warEventManager.getCustomCounter(counterId);
        if ((targetValue != null)                   &&
            (!ValueAndComparators_Utils.checkIsMeet1({
                comparator  : valueComparator,
                targetValue,
                actualValue : value,
            }))
        ) {
            continue;
        }

        if ((valueDivider != null)                  &&
            (valueRemainder != null)                &&
            (!ValueAndComparators_Utils.checkIsMeet1({
                comparator  : remainderComparator,
                targetValue : valueRemainder,
                actualValue : value % valueDivider,
            }))
        ) {
            continue;
        }

        ++counter;
    }

    return ValueAndComparators_Utils.checkIsMeet1({
        comparator  : condition.getCounterCountComparator(),
        targetValue : condition.getCounterCount(),
        actualValue : counter,
    });
}
