import {
    ValueAndComparators_Utils,
    Utils_ClientErrorCode,
    Lang_Utils,
    Helpers_Misc,
    Lang_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WarEventFullData } from "../../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WecEventCalledCount } from "../../../proto/schema/CommonProto/WarEvent/WecEventCalledCount.ts";

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecEventCalledCount>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0096,
        Lang_Utils.getComparatorName(data.getEventsCountComparator()),
        data.getEventsCount(),
    );
}
export function getDetailedDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecEventCalledCount>): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const eventIdArray = data.getEventIdArray();
        if (eventIdArray?.length) {
            subTextArray.push(`- ${Lang_Utils.getFormattedText(
                Lang_Constants.TextType.F0095,
                eventIdArray.join(` ${Lang_Utils.getText(Lang_Constants.TextType.Or)} `),
            )}`);
        }
    }
    {
        const timesInTurn = data.getTimesInTurn();
        if (timesInTurn != null) {
            subTextArray.push(`- ${Lang_Utils.getFormattedText(
                Lang_Constants.TextType.F0094,
                Lang_Utils.getComparatorName(Helpers_Misc.getExisted(data.getTimesInTurnComparator())),
                timesInTurn,
            )}`);
        }
    }
    {
        const timesTotal = data.getTimesTotal();
        if (timesTotal != null) {
            subTextArray.push(`- ${Lang_Utils.getFormattedText(
                Lang_Constants.TextType.F0105,
                Lang_Utils.getComparatorName(Helpers_Misc.getExisted(data.getTimesTotalComparator())),
                timesTotal,
            )}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.A0944));
    }

    return [
        Lang_Utils.getFormattedText(
            Lang_Constants.TextType.F0104,
            Lang_Utils.getComparatorName(data.getEventsCountComparator()),
            data.getEventsCount(),
        ),
        ...subTextArray,
    ].join(`\n`);
}
export function getErrorTip(data: WecEventCalledCount, fullData: WarEventFullData): string | null {
    if (data.getEventsCount() == null) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0788));
    }

    {
        const comparator = data.getEventsCountComparator();
        if ((comparator == null) || (!ValueAndComparators_Utils.checkIsValidValueComparatorId(comparator))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Comparator));
        }
    }

    if (data.getEventIdArray()?.some(eventId => !fullData.getEventArray()?.some(v => eventId === v.getEventId()))) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0462));
    }

    {
        const comparator = data.getTimesTotalComparator();
        if ((comparator == null) || (!ValueAndComparators_Utils.checkIsValidValueComparatorId(comparator))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Comparator));
        }
    }

    {
        const comparator = data.getTimesInTurnComparator();
        if ((comparator == null) || (!ValueAndComparators_Utils.checkIsValidValueComparatorId(comparator))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Comparator));
        }
    }

    return null;
}

export function checkIsValid(condition: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecEventCalledCount>): boolean {
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
        if ((comparator == null) || (!ValueAndComparators_Utils.checkIsValidValueComparatorId(comparator))) {
            return false;
        }
    }

    {
        const comparator = condition.getTimesInTurnComparator();
        if ((comparator == null) || (!ValueAndComparators_Utils.checkIsValidValueComparatorId(comparator))) {
            return false;
        }
    }

    {
        const comparator = condition.getTimesTotalComparator();
        if ((comparator == null) || (!ValueAndComparators_Utils.checkIsValidValueComparatorId(comparator))) {
            return false;
        }
    }

    return true;
}

export function checkIsMeet(condition: WecEventCalledCount, war: BaseWar_Interface_IBwWar.IBwWar): boolean {
    const eventIdArray          = condition.getEventIdArray();
    const timesInTurn           = condition.getTimesInTurn();
    const timesTotal            = condition.getTimesTotal();
    const timesInTurnComparator = Helpers_Misc.getExisted(condition.getTimesInTurnComparator(), Utils_ClientErrorCode.ClientErrorCode.BwWarEventManager_CheckIsMeetConEventCalledCount_00);
    const timesTotalComparator  = Helpers_Misc.getExisted(condition.getTimesTotalComparator(), Utils_ClientErrorCode.ClientErrorCode.BwWarEventManager_CheckIsMeetConEventCalledCount_01);
    const warEventManager       = war.getWarEventManager();

    let eventsCount = 0;
    for (const warEvent of war.getCommonSettingManager().getInstanceWarRule().getWarEventFullData()?.getEventArray() ?? []) {
        const eventId = warEvent.getEventId();
        if ((eventIdArray.length) && (eventIdArray.indexOf(eventId) < 0)) {
            continue;
        }

        if ((timesInTurn != null)                   &&
            (!ValueAndComparators_Utils.checkIsMeet1({
                comparator  : timesInTurnComparator,
                targetValue : timesInTurn,
                actualValue : warEventManager.getWarEventCalledCountInPlayerTurn(eventId),
            }))
        ) {
            continue;
        }

        if ((timesTotal != null)                    &&
            (!ValueAndComparators_Utils.checkIsMeet1({
                comparator  : timesTotalComparator,
                targetValue : timesTotal,
                actualValue : warEventManager.getWarEventCalledCountTotal(eventId),
            }))
        ) {
            continue;
        }

        ++eventsCount;
    }

    return ValueAndComparators_Utils.checkIsMeet1({
        comparator  : condition.getEventsCountComparator(),
        targetValue : condition.getEventsCount(),
        actualValue : eventsCount,
    });
}
