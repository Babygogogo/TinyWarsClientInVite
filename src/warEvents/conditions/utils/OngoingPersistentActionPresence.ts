import {
    ValueAndComparators_Utils,
    WarEvents_Actions_Utils_Common,
    Lang_Utils,
    Lang_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WecOngoingPersistentActionPresence } from "../../../proto/schema/CommonProto/WarEvent/WecOngoingPersistentActionPresence.ts";

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecOngoingPersistentActionPresence>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0135,
        Lang_Utils.getComparatorName(data.getOngoingActionsCountComparator()),
        data.getOngoingActionsCount(),
    );
}
export function getDetailedDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecOngoingPersistentActionPresence>): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const actionIdArray = data.getOngoingActionIdArray();
        if (actionIdArray?.length) {
            subTextArray.push(`- ${Lang_Utils.getFormattedText(
                Lang_Constants.TextType.F0226,
                actionIdArray.join(` ${Lang_Utils.getText(Lang_Constants.TextType.Or)} `)
            )}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.A0944));
    }

    return [
        Lang_Utils.getFormattedText(
            Lang_Constants.TextType.F0225,
            Lang_Utils.getComparatorName(data.getOngoingActionsCountComparator()),
            data.getOngoingActionsCount(),
        ),
        ...subTextArray
    ].join(`\n`);
}
export function getErrorTip(data: WecOngoingPersistentActionPresence): string | null {
    if (data.getOngoingActionsCount() == null) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0902));
    }

    {
        const comparator = data.getOngoingActionsCountComparator();
        if ((comparator == null) || (!ValueAndComparators_Utils.checkIsValidValueComparatorId(comparator))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Comparator));
        }
    }

    {
        const actionIdArray = data.getOngoingActionIdArray();
        if ((actionIdArray) && (!WarEvents_Actions_Utils_Common.checkIsValidWarEventActionIdSubset(actionIdArray))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0889));
        }
    }

    return null;
}

export function checkIsValid(condition: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecOngoingPersistentActionPresence>): boolean {
    if (condition == null) {
        return false;
    }

    {
        const actionIdArray = condition.getOngoingActionIdArray();
        if ((actionIdArray) && (!WarEvents_Actions_Utils_Common.checkIsValidWarEventActionIdSubset(actionIdArray))) {
            return false;
        }
    }

    if (condition.getOngoingActionsCount() == null) {
        return false;
    }

    {
        const comparator = condition.getOngoingActionsCountComparator();
        if ((comparator == null) || (!ValueAndComparators_Utils.checkIsValidValueComparatorId(comparator))) {
            return false;
        }
    }

    return true;
}

export function checkIsMeet(condition: WecOngoingPersistentActionPresence, war: BaseWar_Interface_IBwWar.IBwWar): boolean {
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

    return ValueAndComparators_Utils.checkIsMeet1({
        comparator  : condition.getOngoingActionsCountComparator(),
        targetValue : condition.getOngoingActionsCount(),
        actualValue : counter,
    });
}
