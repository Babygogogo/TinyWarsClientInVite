import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText, getComparatorName, getText } from "../../../lang/Utils.ts";
import type { WarEventFullData } from "../../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WecEventCalledCount } from "../../../proto/schema/CommonProto/WarEvent/WecEventCalledCount.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { checkIsValidValueComparatorId, checkIsMeet1 } from "../../../valueAndComparators/Utils.ts";

export function getBriefDesc(data: Undefinable<WecEventCalledCount>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(
        TextType.F0096,
        getComparatorName(getExisted(data.getEventsCountComparator())),
        data.getEventsCount() ?? UndefinedError
    );
}
export function getDetailedDesc(data: Undefinable<WecEventCalledCount>): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const eventIdArray = data.getEventIdArray();
        if (eventIdArray?.length) {
            subTextArray.push(`- ${getFormattedText(
                TextType.F0095,
                eventIdArray.join(` ${getText(TextType.Or)} `)
            )}`);
        }
    }
    {
        const timesInTurn = data.getTimesInTurn();
        if (timesInTurn != null) {
            subTextArray.push(`- ${getFormattedText(
                TextType.F0094,
                getComparatorName(getExisted(data.getTimesInTurnComparator())),
                timesInTurn
            )}`);
        }
    }
    {
        const timesTotal = data.getTimesTotal();
        if (timesTotal != null) {
            subTextArray.push(`- ${getFormattedText(
                TextType.F0105,
                getComparatorName(getExisted(data.getTimesTotalComparator())),
                timesTotal
            )}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(getText(TextType.A0944));
    }

    return [
        getFormattedText(
            TextType.F0104,
            getComparatorName(getExisted(data.getEventsCountComparator())),
            data.getEventsCount() ?? UndefinedError
        ),
        ...subTextArray
    ].join(`\n`);
}
export function getErrorTip(data: WecEventCalledCount, fullData: WarEventFullData): string | null {
    if (data.getEventsCount() == null) {
        return getFormattedText(TextType.F0091, getText(TextType.B0788));
    }

    {
        const comparator = data.getEventsCountComparator();
        if ((comparator == null) || (!checkIsValidValueComparatorId(comparator))) {
            return getFormattedText(TextType.F0091, getText(TextType.Comparator));
        }
    }

    if (data.getEventIdArray()?.some(eventId => !fullData.getEventArray()?.some(v => eventId === v.getEventId()))) {
        return getFormattedText(TextType.F0091, getText(TextType.B0462));
    }

    {
        const comparator = data.getTimesTotalComparator();
        if ((comparator == null) || (!checkIsValidValueComparatorId(comparator))) {
            return getFormattedText(TextType.F0091, getText(TextType.Comparator));
        }
    }

    {
        const comparator = data.getTimesInTurnComparator();
        if ((comparator == null) || (!checkIsValidValueComparatorId(comparator))) {
            return getFormattedText(TextType.F0091, getText(TextType.Comparator));
        }
    }

    return null;
}

export function checkIsValid(condition: Undefinable<WecEventCalledCount>): boolean {
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
        if ((comparator == null) || (!checkIsValidValueComparatorId(comparator))) {
            return false;
        }
    }

    {
        const comparator = condition.getTimesInTurnComparator();
        if ((comparator == null) || (!checkIsValidValueComparatorId(comparator))) {
            return false;
        }
    }

    {
        const comparator = condition.getTimesTotalComparator();
        if ((comparator == null) || (!checkIsValidValueComparatorId(comparator))) {
            return false;
        }
    }

    return true;
}

export function checkIsMeet(condition: WecEventCalledCount, war: IBwWar): boolean {
    const eventIdArray          = condition.getEventIdArray() ?? [];
    const timesInTurn           = condition.getTimesInTurn();
    const timesTotal            = condition.getTimesTotal();
    const timesInTurnComparator = getExisted(condition.getTimesInTurnComparator(), ClientErrorCode.BwWarEventManager_CheckIsMeetConEventCalledCount_00);
    const timesTotalComparator  = getExisted(condition.getTimesTotalComparator(), ClientErrorCode.BwWarEventManager_CheckIsMeetConEventCalledCount_01);
    const warEventManager       = war.getWarEventManager();

    let eventsCount = 0;
    for (const warEvent of war.getCommonSettingManager().getInstanceWarRule().getWarEventFullData()?.getEventArray() ?? []) {
        const eventId = getExisted(warEvent.getEventId(), ClientErrorCode.BwWarEventManager_CheckIsMeetConEventCalledCount_02);
        if ((eventIdArray.length) && (eventIdArray.indexOf(eventId) < 0)) {
            continue;
        }

        if ((timesInTurn != null)                   &&
            (!checkIsMeet1({
                comparator  : timesInTurnComparator,
                targetValue : timesInTurn,
                actualValue : warEventManager.getWarEventCalledCountInPlayerTurn(eventId),
            }))
        ) {
            continue;
        }

        if ((timesTotal != null)                    &&
            (!checkIsMeet1({
                comparator  : timesTotalComparator,
                targetValue : timesTotal,
                actualValue : warEventManager.getWarEventCalledCountTotal(eventId),
            }))
        ) {
            continue;
        }

        ++eventsCount;
    }

    return checkIsMeet1({
        comparator  : getExisted(condition.getEventsCountComparator(), ClientErrorCode.BwWarEventManager_CheckIsMeetConEventCalledCount_03),
        targetValue : getExisted(condition.getEventsCount(), ClientErrorCode.BwWarEventManager_CheckIsMeetConEventCalledCount_04),
        actualValue : eventsCount,
    });
}
