import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { Constants } from "../../../customCounters/Constants.ts";
import { checkIsValidIdSubset } from "../../../customCounters/Utils.ts";
import { getNonNullElements } from "../../../helpers/Collection.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText, getText, getComparatorName } from "../../../lang/Utils.ts";
import type { WecCustomCounter } from "../../../proto/schema/CommonProto/WarEvent/WecCustomCounter.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { checkIsValidValueComparatorId, checkIsMeet1 } from "../../../valueAndComparators/Utils.ts";

export function getBriefDesc(data: Undefinable<WecCustomCounter>): string | null {
    if (data == null) {
        return null;
    }

    const counterIdArray        = data.getCounterIdArray();
    const textForCounterIdArray = counterIdArray?.length
        ? counterIdArray.join(`/`)
        : getFormattedText(TextType.F0097, getText(TextType.B0792));

    const targetValue           = data.getValue();
    const textForTargetValue    = targetValue != null
        ? getFormattedText(TextType.F0112, getComparatorName(getExisted(data.getValueComparator())), targetValue)
        : null;

    const valueDivider      = data.getValueDivider();
    const valueRemainder    = data.getValueRemainder();
    const textForRemainder  = (valueDivider ?? valueRemainder != null)
        ? getFormattedText(TextType.F0113, valueDivider ?? UndefinedError, getComparatorName(getExisted(data.getValueRemainderComparator())), valueRemainder ?? UndefinedError)
        : null;

    const textArrayForSubConditions = getNonNullElements([
        textForTargetValue,
        textForRemainder,
    ]);
    return getFormattedText(
        TextType.F0111,
        textForCounterIdArray,
        textArrayForSubConditions.length ? textArrayForSubConditions.map(v => `${getText(TextType.B0783)}${v}`).join(``) : ``,
        getComparatorName(data.getCounterCountComparator()),
        data.getCounterCount(),
    );
}
export function getDetailedDesc(data: Undefinable<WecCustomCounter>): string | null {
    return getBriefDesc(data);
}
export function getErrorTip(data: WecCustomCounter): string | null {
    if (data.getCounterCount() == null) {
        return getFormattedText(TextType.F0091, getText(TextType.B0801));
    }

    {
        const comparator = data.getCounterCountComparator();
        if ((comparator == null) || (!checkIsValidValueComparatorId(comparator))) {
            return getFormattedText(TextType.F0091, getText(TextType.Comparator));
        }
    }

    {
        const comparator = data.getValueComparator();
        if ((comparator == null) || (!checkIsValidValueComparatorId(comparator))) {
            return getFormattedText(TextType.F0091, getText(TextType.Comparator));
        }
    }

    {
        const divider   = data.getValueDivider();
        const remainder = data.getValueRemainder();
        if (divider == null) {
            if (remainder != null) {
                return getText(TextType.A0265);
            }
        } else {
            if ((divider <= 1) || (remainder == null)) {
                return getText(TextType.A0265);
            }
        }
    }

    {
        const comparator = data.getValueRemainderComparator();
        if ((comparator == null) || (!checkIsValidValueComparatorId(comparator))) {
            return getFormattedText(TextType.F0091, getText(TextType.Comparator));
        }
    }

    return null;
}

export function checkIsValid(condition: Undefinable<WecCustomCounter>): boolean {
    if (condition == null) {
        return false;
    }

    {
        const counterIdArray = condition.getCounterIdArray();
        if ((counterIdArray?.length) && (!checkIsValidIdSubset(counterIdArray))) {
            return false;
        }
    }

    if (condition.getCounterCount() == null) {
        return false;
    }

    {
        const comparator = condition.getCounterCountComparator();
        if ((comparator == null) || (!checkIsValidValueComparatorId(comparator))) {
            return false;
        }
    }

    {
        const comparator = condition.getValueComparator();
        if ((comparator == null) || (!checkIsValidValueComparatorId(comparator))) {
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
        if ((comparator == null) || (!checkIsValidValueComparatorId(comparator))) {
            return false;
        }
    }

    return true;
}

export function checkIsMeet(condition: WecCustomCounter, war: IBwWar): boolean {
    const counterIdArray        = condition.getCounterIdArray();
    const targetValue           = condition.getValue();
    const valueComparator       = getExisted(condition.getValueComparator(), ClientErrorCode.BwWarEventManager_CheckIsMeetConCustomCounter_00);
    const valueDivider          = condition.getValueDivider();
    const valueRemainder        = condition.getValueRemainder();
    const remainderComparator   = getExisted(condition.getValueRemainderComparator(), ClientErrorCode.BwWarEventManager_CheckIsMeetConCustomCounter_01);
    const warEventManager       = war.getWarEventManager();
    let counter                 = 0;
    for (let counterId = Constants.MinId; counterId <= Constants.MaxId; ++counterId) {
        if ((counterIdArray.length) && (counterIdArray.indexOf(counterId) < 0)) {
            continue;
        }

        const value = warEventManager.getCustomCounter(counterId);
        if ((targetValue != null)                   &&
            (!checkIsMeet1({
                comparator  : valueComparator,
                targetValue,
                actualValue : value,
            }))
        ) {
            continue;
        }

        if ((valueDivider != null)                  &&
            (valueRemainder != null)                &&
            (!checkIsMeet1({
                comparator  : remainderComparator,
                targetValue : valueRemainder,
                actualValue : value % valueDivider,
            }))
        ) {
            continue;
        }

        ++counter;
    }

    return checkIsMeet1({
        comparator  : condition.getCounterCountComparator(),
        targetValue : condition.getCounterCount(),
        actualValue : counter,
    });
}
