import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as CustomCountersConstants from "../../../customCounters/Constants.ts";
import * as CustomCountersUtils from "../../../customCounters/Utils.ts";
import * as HelpersCollection from "../../../helpers/Collection.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWecCustomCounter from "../../../proto/schema/CommonProto/WarEvent/WecCustomCounter.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as ValueAndComparatorsUtils from "../../../valueAndComparators/Utils.ts";

type WecCustomCounter           = ProtoSchemaCommonProtoWarEventWecCustomCounter.WecCustomCounter;

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecCustomCounter>): string | null {
    if (data == null) {
        return null;
    }

    const counterIdArray        = data.getCounterIdArray();
    const textForCounterIdArray = counterIdArray?.length
        ? counterIdArray.join(`/`)
        : LangUtils.getFormattedText(LangConstants.TextType.F0097, LangUtils.getText(LangConstants.TextType.B0792));

    const targetValue           = data.getValue();
    const textForTargetValue    = targetValue != null
        ? LangUtils.getFormattedText(LangConstants.TextType.F0112, LangUtils.getComparatorName(HelpersMisc.getExisted(data.getValueComparator())), targetValue)
        : null;

    const valueDivider      = data.getValueDivider();
    const valueRemainder    = data.getValueRemainder();
    const textForRemainder  = (valueDivider ?? valueRemainder != null)
        ? LangUtils.getFormattedText(LangConstants.TextType.F0113, valueDivider ?? LangConstants.UndefinedError, LangUtils.getComparatorName(HelpersMisc.getExisted(data.getValueRemainderComparator())), valueRemainder ?? LangConstants.UndefinedError)
        : null;

    const textArrayForSubConditions = HelpersCollection.getNonNullElements([
        textForTargetValue,
        textForRemainder,
    ]);
    return LangUtils.getFormattedText(
        LangConstants.TextType.F0111,
        textForCounterIdArray,
        textArrayForSubConditions.length ? textArrayForSubConditions.map(v => `${LangUtils.getText(LangConstants.TextType.B0783)}${v}`).join(``) : ``,
        LangUtils.getComparatorName(HelpersMisc.getExisted(data.getCounterCountComparator())),
        data.getCounterCount() ?? LangConstants.UndefinedError,
    );
}
export function getDetailedDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecCustomCounter>): string | null {
    return getBriefDesc(data);
}
export function getErrorTip(data: WecCustomCounter): string | null {
    if (data.getCounterCount() == null) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0801));
    }

    {
        const comparator = data.getCounterCountComparator();
        if ((comparator == null) || (!ValueAndComparatorsUtils.checkIsValidValueComparatorId(comparator))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Comparator));
        }
    }

    {
        const comparator = data.getValueComparator();
        if ((comparator == null) || (!ValueAndComparatorsUtils.checkIsValidValueComparatorId(comparator))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Comparator));
        }
    }

    {
        const divider   = data.getValueDivider();
        const remainder = data.getValueRemainder();
        if (divider == null) {
            if (remainder != null) {
                return LangUtils.getText(LangConstants.TextType.A0265);
            }
        } else {
            if ((divider <= 1) || (remainder == null)) {
                return LangUtils.getText(LangConstants.TextType.A0265);
            }
        }
    }

    {
        const comparator = data.getValueRemainderComparator();
        if ((comparator == null) || (!ValueAndComparatorsUtils.checkIsValidValueComparatorId(comparator))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Comparator));
        }
    }

    return null;
}

export function checkIsValid(condition: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecCustomCounter>): boolean {
    if (condition == null) {
        return false;
    }

    {
        const counterIdArray = condition.getCounterIdArray();
        if ((counterIdArray?.length) && (!CustomCountersUtils.checkIsValidIdSubset(counterIdArray))) {
            return false;
        }
    }

    if (condition.getCounterCount() == null) {
        return false;
    }

    {
        const comparator = condition.getCounterCountComparator();
        if ((comparator == null) || (!ValueAndComparatorsUtils.checkIsValidValueComparatorId(comparator))) {
            return false;
        }
    }

    {
        const comparator = condition.getValueComparator();
        if ((comparator == null) || (!ValueAndComparatorsUtils.checkIsValidValueComparatorId(comparator))) {
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
        if ((comparator == null) || (!ValueAndComparatorsUtils.checkIsValidValueComparatorId(comparator))) {
            return false;
        }
    }

    return true;
}

export function checkIsMeet(condition: WecCustomCounter, war: BaseWarInterfaceIBwWar.IBwWar): boolean {
    const counterIdArray        = condition.getCounterIdArray() ?? [];
    const targetValue           = condition.getValue();
    const valueComparator       = HelpersMisc.getExisted(condition.getValueComparator(), UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_CheckIsMeetConCustomCounter_00);
    const valueDivider          = condition.getValueDivider();
    const valueRemainder        = condition.getValueRemainder();
    const remainderComparator   = HelpersMisc.getExisted(condition.getValueRemainderComparator(), UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_CheckIsMeetConCustomCounter_01);
    const warEventManager       = war.getWarEventManager();
    let counter                 = 0;
    for (let counterId = CustomCountersConstants.Constants.MinId; counterId <= CustomCountersConstants.Constants.MaxId; ++counterId) {
        if ((counterIdArray.length) && (counterIdArray.indexOf(counterId) < 0)) {
            continue;
        }

        const value = warEventManager.getCustomCounter(counterId);
        if ((targetValue != null)                   &&
            (!ValueAndComparatorsUtils.checkIsMeet1({
                comparator  : valueComparator,
                targetValue,
                actualValue : value,
            }))
        ) {
            continue;
        }

        if ((valueDivider != null)                  &&
            (valueRemainder != null)                &&
            (!ValueAndComparatorsUtils.checkIsMeet1({
                comparator  : remainderComparator,
                targetValue : valueRemainder,
                actualValue : value % valueDivider,
            }))
        ) {
            continue;
        }

        ++counter;
    }

    return ValueAndComparatorsUtils.checkIsMeet1({
        comparator  : HelpersMisc.getExisted(condition.getCounterCountComparator(), UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_CheckIsMeetConCustomCounter_02),
        targetValue : HelpersMisc.getExisted(condition.getCounterCount(), UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_CheckIsMeetConCustomCounter_03),
        actualValue : counter,
    });
}
