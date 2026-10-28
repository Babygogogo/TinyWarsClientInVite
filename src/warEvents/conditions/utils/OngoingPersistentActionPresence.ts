import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getFormattedText, getComparatorName, getText } from "../../../lang/Utils.ts";
import type { WecOngoingPersistentActionPresence } from "../../../proto/schema/CommonProto/WarEvent/WecOngoingPersistentActionPresence.ts";
import { checkIsValidValueComparatorId, checkIsMeet1 } from "../../../valueAndComparators/Utils.ts";
import { checkIsValidWarEventActionIdSubset } from "../../actions/utils/Common.ts";

export function getBriefDesc(data: Undefinable<WecOngoingPersistentActionPresence>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(
        TextType.F0135,
        getComparatorName(data.getOngoingActionsCountComparator()),
        data.getOngoingActionsCount(),
    );
}
export function getDetailedDesc(data: Undefinable<WecOngoingPersistentActionPresence>): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const actionIdArray = data.getOngoingActionIdArray();
        if (actionIdArray?.length) {
            subTextArray.push(`- ${getFormattedText(
                TextType.F0226,
                actionIdArray.join(` ${getText(TextType.Or)} `)
            )}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(getText(TextType.A0944));
    }

    return [
        getFormattedText(
            TextType.F0225,
            getComparatorName(data.getOngoingActionsCountComparator()),
            data.getOngoingActionsCount(),
        ),
        ...subTextArray
    ].join(`\n`);
}
export function getErrorTip(data: WecOngoingPersistentActionPresence): string | null {
    if (data.getOngoingActionsCount() == null) {
        return getFormattedText(TextType.F0091, getText(TextType.B0902));
    }

    {
        const comparator = data.getOngoingActionsCountComparator();
        if ((comparator == null) || (!checkIsValidValueComparatorId(comparator))) {
            return getFormattedText(TextType.F0091, getText(TextType.Comparator));
        }
    }

    {
        const actionIdArray = data.getOngoingActionIdArray();
        if ((actionIdArray) && (!checkIsValidWarEventActionIdSubset(actionIdArray))) {
            return getFormattedText(TextType.F0091, getText(TextType.B0889));
        }
    }

    return null;
}

export function checkIsValid(condition: Undefinable<WecOngoingPersistentActionPresence>): boolean {
    if (condition == null) {
        return false;
    }

    {
        const actionIdArray = condition.getOngoingActionIdArray();
        if ((actionIdArray) && (!checkIsValidWarEventActionIdSubset(actionIdArray))) {
            return false;
        }
    }

    if (condition.getOngoingActionsCount() == null) {
        return false;
    }

    {
        const comparator = condition.getOngoingActionsCountComparator();
        if ((comparator == null) || (!checkIsValidValueComparatorId(comparator))) {
            return false;
        }
    }

    return true;
}

export function checkIsMeet(condition: WecOngoingPersistentActionPresence, war: IBwWar): boolean {
    const conActionIdArray  = condition.getOngoingActionIdArray();
    const opaIdArray        = war.getWarEventManager().getOpaIdArray();
    let counter                 = 0;
    if (!conActionIdArray?.length) {
        counter = opaIdArray.length;
    } else {
        const opaIdSet = new Set(opaIdArray);
        for (const actionId of conActionIdArray) {
            if (opaIdSet.has(actionId)) {
                ++counter;
            }
        }
    }

    return checkIsMeet1({
        comparator  : condition.getOngoingActionsCountComparator(),
        targetValue : condition.getOngoingActionsCount(),
        actualValue : counter,
    });
}
