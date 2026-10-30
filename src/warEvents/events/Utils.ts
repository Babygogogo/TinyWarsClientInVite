import {
    Lang_Utils,
    WarEvents_Actions_Utils_Common,
    WarEvents_ConditionNodes_Utils,
    WarEvents_Constants,
    Helpers_Misc,
    WarEvents_Actions_Constants_Common,
    Lang_Constants,
} from "../../internal.ts";
import { WarEvent as ProtoWarEvent } from "../../proto/schema/CommonProto/WarEvent/WarEvent.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventConditionNode } from "../../proto/schema/CommonProto/WarEvent/WarEventConditionNode.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";

export function checkIsValidWarEvent({ warEvent, nodeDict, actionDict }: { // DONE
    warEvent    : ProtoWarEvent;
    nodeDict    : Map<number, WarEventConditionNode>;
    actionDict  : Map<number, WarEventAction>;
}): boolean {
    const eventNameArray = warEvent.getEventNameArray();
    if ((eventNameArray == null)                                     ||
        (!Lang_Utils.checkIsValidLanguageTextArray({
            list          : eventNameArray,
            maxTextLength : WarEvents_Constants.Event.MaxNameLength,
            minTextLength : 1,
            minTextCount  : 1,
        }))
    ) {
        return false;
    }

    {
        const count = warEvent.getMaxCallCountInPlayerTurn();
        if ((count == null) || (count < 1)) {
            return false;
        }

        const canBeTriggeredRightAfterAnyEvent = warEvent.getCanBeTriggeredRightAfterAnyEvent();
        if (((canBeTriggeredRightAfterAnyEvent) && (count > WarEvents_Constants.Event.MaxCallCountInPlayerTurn))    ||
            ((!canBeTriggeredRightAfterAnyEvent) && (count > WarEvents_Constants.Event.MaxCallCountTotal))
        ) {
            return false;
        }
    }

    const maxCallCountTotal = warEvent.getMaxCallCountTotal();
    if ((maxCallCountTotal == null)                                     ||
        (maxCallCountTotal < 1)                                         ||
        (maxCallCountTotal > WarEvents_Constants.Event.MaxCallCountTotal)
    ) {
        return false;
    }

    {
        const rootNodeAndActionsArray = warEvent.getRootNodeAndActionsArray();
        if ((rootNodeAndActionsArray.length <= 0)                                                       ||
            (rootNodeAndActionsArray.length > WarEvents_Constants.ConditionNode.MaxCountPerEventRoot)
        ) {
            return false;
        }

        const usedNodeIdSet = new Set<number>();
        for (const rootNodeAndActions of rootNodeAndActionsArray) {
            const nodeIdAndFlags = rootNodeAndActions.getNodeIdAndFlags();
            if (nodeIdAndFlags == null) {
                return false;
            }

            const nodeId = nodeIdAndFlags.getNodeId();
            if ((usedNodeIdSet.has(nodeId)) ||
                (!nodeDict.has(nodeId))
            ) {
                return false;
            }
            usedNodeIdSet.add(nodeId);

            const actionIdArray = rootNodeAndActions.getActionIdArray();
            if ((actionIdArray.length > WarEvents_Actions_Constants_Common.MaxCounts.PerEvent) ||
                (actionIdArray.length <= 0)                                                     ||
                (actionIdArray.some(v => !actionDict.has(v)))
            ) {
                return false;
            }
        }
    }

    return true;
}

export function getErrorTipForEvent(fullData: WarEventFullData, event: ProtoWarEvent): string | null {
    const eventsCount = fullData.getEventArray().length;
    if (eventsCount > WarEvents_Constants.Event.MaxEventsPerMap) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.A0182)} (${eventsCount}/${WarEvents_Constants.Event.MaxEventsPerMap})`;
    }

    const rootNodeAndActionsArray = event.getRootNodeAndActionsArray();
    {
        const count     = rootNodeAndActionsArray.length;
        const minCount  = 1;
        const maxCount  = WarEvents_Constants.ConditionNode.MaxCountPerEventRoot;
        if ((count < minCount) || (count > maxCount)) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0267, minCount, maxCount, count);
        }
    }

    for (const rootNodeAndActions of rootNodeAndActionsArray) {
        const nodeIdAndFlags = rootNodeAndActions.getNodeIdAndFlags();
        if (nodeIdAndFlags == null) {
            return Lang_Utils.getText(Lang_Constants.TextType.A0159);
        }

        {
            const count     = rootNodeAndActions.getActionIdArray().length;
            const minCount  = 1;
            const maxCount  = WarEvents_Actions_Constants_Common.MaxCounts.PerEvent;
            if ((count < minCount) || (count > maxCount)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0268, `N${nodeIdAndFlags.getNodeId()}`, `E${event.getEventId()}`, minCount, maxCount, count);
            }
        }
    }

    return null;
}

export function getErrorTipForEventCallCountInPlayerTurn(event: ProtoWarEvent): string | null {
    const count = event.getMaxCallCountInPlayerTurn();
    if ((count == null) || (count < 1)) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0181);
    }

    const canBeTriggeredRightAfterAnyEvent = event.getCanBeTriggeredRightAfterAnyEvent();
    if (((canBeTriggeredRightAfterAnyEvent) && (count > WarEvents_Constants.Event.MaxCallCountInPlayerTurn))    ||
        ((!canBeTriggeredRightAfterAnyEvent) && (count > WarEvents_Constants.Event.MaxCallCountTotal))
    ) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0181);
    }

    return null;
}

export function getErrorTipForEventCallCountTotal(event: ProtoWarEvent): string | null {
    const count = event.getMaxCallCountTotal();
    if ((count == null) || (count < 1) || (count > WarEvents_Constants.Event.MaxCallCountTotal)) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0181);
    }

    return null;
}

export function addEvent(fullData: WarEventFullData): number | null {
    const eventArray = fullData.getEventArray();
    for (let eventId = 1; ; ++eventId) {
        if (!eventArray.some(v => v.getEventId() === eventId)) {
            eventArray.push(ProtoWarEvent.fromJson({
                eventId                          : eventId,
                maxCallCountInPlayerTurn         : 1,
                maxCallCountTotal                : 1,
                canBeTriggeredRightAfterAnyEvent : false,
                rootNodeAndActionsArray          : [],
                eventNameArray                   : [
                    { languageType : Lang_Utils.getCurrentLanguageType(), text : `${Lang_Utils.getText(Lang_Constants.TextType.B0469)} #${eventId}` },
                    { languageType : Lang_Utils.getSecondaryLanguageType(), text : `${Lang_Utils.getText(Lang_Constants.TextType.B0469, Lang_Utils.getSecondaryLanguageType())} #${eventId}` },
                ],
                deprecatedActionIdArray : [],
            }));
            eventArray.sort((v1, v2) => v1.getEventId() - v2.getEventId());
            return eventId;
        }
    }
}
export function cloneEvent(fullData: WarEventFullData, srcEventId: number, isShallowClone: boolean): number {
    const eventArray    = fullData.getEventArray();
    const srcEvent      = Helpers_Misc.getExisted(eventArray.find(v => v.getEventId() === srcEventId));
    for (let eventId = 1; ; ++eventId) {
        if (eventArray.some(v => v.getEventId() === eventId)) {
            continue;
        }

        const srcRootNodeAndActionsArray = srcEvent.getRootNodeAndActionsArray();
        if (isShallowClone) {
            eventArray.push(ProtoWarEvent.fromJson({
                eventId                          : eventId,
                eventNameArray                   : srcEvent.getEventNameArray().map(v => v.toJson()),
                maxCallCountInPlayerTurn         : srcEvent.getMaxCallCountInPlayerTurn(),
                canBeTriggeredRightAfterAnyEvent : srcEvent.getCanBeTriggeredRightAfterAnyEvent(),
                maxCallCountTotal                : srcEvent.getMaxCallCountTotal(),
                rootNodeAndActionsArray          : srcRootNodeAndActionsArray.map(v => v.toJson()),
                deprecatedActionIdArray          : [],
            }));
        } else {
            eventArray.push(ProtoWarEvent.fromJson({
                eventId                          : eventId,
                eventNameArray                   : srcEvent.getEventNameArray().map(v => v.clone().toJson()),
                maxCallCountInPlayerTurn         : srcEvent.getMaxCallCountInPlayerTurn(),
                canBeTriggeredRightAfterAnyEvent : srcEvent.getCanBeTriggeredRightAfterAnyEvent(),
                maxCallCountTotal                : srcEvent.getMaxCallCountTotal(),
                // actionIdArray                       : srcEvent.getActionIdArray().map(v => GhWarEventAction.cloneAction(fullData, v)),
                // rootConditionNodeIdAndFlags         : srcRootNodeAndActionsArray == null
                //     ? null
                //     : {
                //         nodeId      : GhWarEventConditionNode.cloneNode(fullData, srcRootNodeAndActionsArray.getNodeId(), isShallowClone),
                //         isNegated   : srcRootNodeAndActionsArray.getIsNegated(),
                //     }
                rootNodeAndActionsArray          : srcRootNodeAndActionsArray.map(root => {
                    const nodeIdAndFlags = root.getNodeIdAndFlags();
                    return {
                        nodeIdAndFlags : nodeIdAndFlags == null
                            ? null
                            : {
                                nodeId    : WarEvents_ConditionNodes_Utils.cloneNode(fullData, nodeIdAndFlags.getNodeId(), isShallowClone),
                                isNegated : nodeIdAndFlags.getIsNegated(),
                            },
                        actionIdArray : root.getActionIdArray().map(v => WarEvents_Actions_Utils_Common.cloneAction(fullData, v)),
                    };
                }),
                deprecatedActionIdArray : [],
            }));
        }

        eventArray.sort((v1, v2) => v1.getEventId() - v2.getEventId());
        return eventId;
    }
}
