import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWecEventCalledCount from "../../../proto/schema/CommonProto/WarEvent/WecEventCalledCount.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as ValueAndComparatorsUtils from "../../../valueAndComparators/Utils.ts";

type WecEventCalledCount        = ProtoSchemaCommonProtoWarEventWecEventCalledCount.WecEventCalledCount;
type WarEventFullData           = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecEventCalledCount>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0096,
        LangUtils.getComparatorName(HelpersMisc.getExisted(data.getEventsCountComparator())),
        data.getEventsCount() ?? LangConstants.UndefinedError
    );
}
export function getDetailedDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecEventCalledCount>): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const eventIdArray = data.getEventIdArray();
        if (eventIdArray?.length) {
            subTextArray.push(`- ${LangUtils.getFormattedText(
                LangConstants.TextType.F0095,
                eventIdArray.join(` ${LangUtils.getText(LangConstants.TextType.Or)} `)
            )}`);
        }
    }
    {
        const timesInTurn = data.getTimesInTurn();
        if (timesInTurn != null) {
            subTextArray.push(`- ${LangUtils.getFormattedText(
                LangConstants.TextType.F0094,
                LangUtils.getComparatorName(HelpersMisc.getExisted(data.getTimesInTurnComparator())),
                timesInTurn
            )}`);
        }
    }
    {
        const timesTotal = data.getTimesTotal();
        if (timesTotal != null) {
            subTextArray.push(`- ${LangUtils.getFormattedText(
                LangConstants.TextType.F0105,
                LangUtils.getComparatorName(HelpersMisc.getExisted(data.getTimesTotalComparator())),
                timesTotal
            )}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(LangUtils.getText(LangConstants.TextType.A0944));
    }

    return [
        LangUtils.getFormattedText(
            LangConstants.TextType.F0104,
            LangUtils.getComparatorName(HelpersMisc.getExisted(data.getEventsCountComparator())),
            data.getEventsCount() ?? LangConstants.UndefinedError
        ),
        ...subTextArray
    ].join(`\n`);
}
export function getErrorTip(data: WecEventCalledCount, fullData: WarEventFullData): string | null {
    if (data.getEventsCount() == null) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0788));
    }

    {
        const comparator = data.getEventsCountComparator();
        if ((comparator == null) || (!ValueAndComparatorsUtils.checkIsValidValueComparatorId(comparator))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Comparator));
        }
    }

    if (data.getEventIdArray()?.some(eventId => !fullData.getEventArray()?.some(v => eventId === v.getEventId()))) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0462));
    }

    {
        const comparator = data.getTimesTotalComparator();
        if ((comparator == null) || (!ValueAndComparatorsUtils.checkIsValidValueComparatorId(comparator))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Comparator));
        }
    }

    {
        const comparator = data.getTimesInTurnComparator();
        if ((comparator == null) || (!ValueAndComparatorsUtils.checkIsValidValueComparatorId(comparator))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Comparator));
        }
    }

    return null;
}

export function checkIsValid(condition: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecEventCalledCount>): boolean {
    if (condition == null) {
        return false;
    }

    {
        const eventIdArray = condition.getEventIdArray();
        if (eventIdArray) {
            if (new Set(eventIdArray).size !== eventIdArray.length) {
                return false;
            }
        }
    }

    if (condition.getEventsCount() == null) {
        return false;
    }

    {
        const comparator = condition.getEventsCountComparator();
        if ((comparator == null) || (!ValueAndComparatorsUtils.checkIsValidValueComparatorId(comparator))) {
            return false;
        }
    }

    {
        const comparator = condition.getTimesInTurnComparator();
        if ((comparator == null) || (!ValueAndComparatorsUtils.checkIsValidValueComparatorId(comparator))) {
            return false;
        }
    }

    {
        const comparator = condition.getTimesTotalComparator();
        if ((comparator == null) || (!ValueAndComparatorsUtils.checkIsValidValueComparatorId(comparator))) {
            return false;
        }
    }

    return true;
}

export function checkIsMeet(condition: WecEventCalledCount, war: BaseWarInterfaceIBwWar.IBwWar): boolean {
    const eventIdArray          = condition.getEventIdArray() ?? [];
    const timesInTurn           = condition.getTimesInTurn();
    const timesTotal            = condition.getTimesTotal();
    const timesInTurnComparator = HelpersMisc.getExisted(condition.getTimesInTurnComparator(), UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_CheckIsMeetConEventCalledCount_00);
    const timesTotalComparator  = HelpersMisc.getExisted(condition.getTimesTotalComparator(), UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_CheckIsMeetConEventCalledCount_01);
    const warEventManager       = war.getWarEventManager();

    let eventsCount = 0;
    for (const warEvent of war.getCommonSettingManager().getInstanceWarRule().getWarEventFullData()?.getEventArray() ?? []) {
        const eventId = HelpersMisc.getExisted(warEvent.getEventId(), UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_CheckIsMeetConEventCalledCount_02);
        if ((eventIdArray.length) && (eventIdArray.indexOf(eventId) < 0)) {
            continue;
        }

        if ((timesInTurn != null)                   &&
            (!ValueAndComparatorsUtils.checkIsMeet1({
                comparator  : timesInTurnComparator,
                targetValue : timesInTurn,
                actualValue : warEventManager.getWarEventCalledCountInPlayerTurn(eventId),
            }))
        ) {
            continue;
        }

        if ((timesTotal != null)                    &&
            (!ValueAndComparatorsUtils.checkIsMeet1({
                comparator  : timesTotalComparator,
                targetValue : timesTotal,
                actualValue : warEventManager.getWarEventCalledCountTotal(eventId),
            }))
        ) {
            continue;
        }

        ++eventsCount;
    }

    return ValueAndComparatorsUtils.checkIsMeet1({
        comparator  : HelpersMisc.getExisted(condition.getEventsCountComparator(), UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_CheckIsMeetConEventCalledCount_03),
        targetValue : HelpersMisc.getExisted(condition.getEventsCount(), UtilsClientErrorCode.ClientErrorCode.BwWarEventManager_CheckIsMeetConEventCalledCount_04),
        actualValue : eventsCount,
    });
}
