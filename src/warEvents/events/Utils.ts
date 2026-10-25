import { getExisted } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    checkIsValidLanguageTextArray,
    getText,
    getFormattedText,
    getCurrentLanguageType,
    getSecondaryLanguageType,
} from "../../lang/Utils.ts";
import { WarEvent as ProtoSchemaCommonProtoWarEventWarEvent } from "../../proto/schema/CommonProto/WarEvent/WarEvent.ts";
import type {
    WarEventAction as ProtoSchemaCommonProtoWarEventWarEventAction,
} from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type {
    WarEventConditionNode as ProtoSchemaCommonProtoWarEventWarEventConditionNode,
} from "../../proto/schema/CommonProto/WarEvent/WarEventConditionNode.ts";
import type {
    WarEventFullData as ProtoSchemaCommonProtoWarEventWarEventFullData,
} from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import { MaxCounts } from "../actions/constants/Common.ts";
import { cloneAction } from "../actions/utils/Common.ts";
import { cloneNode } from "../conditionNodes/Utils.ts";
import { Event, ConditionNode } from "../Constants.ts";

type WarEventFullData       = ProtoSchemaCommonProtoWarEventWarEventFullData;
type WarEvent               = ProtoSchemaCommonProtoWarEventWarEvent;
type WarEventAction         = ProtoSchemaCommonProtoWarEventWarEventAction;
type WarEventConditionNode  = ProtoSchemaCommonProtoWarEventWarEventConditionNode;

export function checkIsValidWarEvent({ warEvent, nodeDict, actionDict }: { // DONE
    warEvent    : WarEvent;
    nodeDict    : Map<number, WarEventConditionNode>;
    actionDict  : Map<number, WarEventAction>;
}): boolean {
    const eventNameArray = warEvent.getEventNameArray();
    if ((eventNameArray == null)                                     ||
        (!checkIsValidLanguageTextArray({
            list            : eventNameArray,
            maxTextLength   : Event.MaxNameLength,
            minTextLength   : 1,
            minTextCount    : 1,
        }))
    ) {
        return false;
    }

    {
        const count = warEvent.getMaxCallCountInPlayerTurn();
        if ((count == null) || (count < 1)) {
            return false;
        }

        const canBeTriggeredRightAfterAnyEvent = warEvent.getCanBeTriggeredRightAfterAnyEvent() ?? true;
        if (((canBeTriggeredRightAfterAnyEvent) && (count > Event.MaxCallCountInPlayerTurn))    ||
            ((!canBeTriggeredRightAfterAnyEvent) && (count > Event.MaxCallCountTotal))
        ) {
            return false;
        }
    }

    const maxCallCountTotal = warEvent.getMaxCallCountTotal();
    if ((maxCallCountTotal == null)                                     ||
        (maxCallCountTotal < 1)                                         ||
        (maxCallCountTotal > Event.MaxCallCountTotal)
    ) {
        return false;
    }

    {
        const rootNodeAndActionsArray = warEvent.getRootNodeAndActionsArray();
        if ((rootNodeAndActionsArray.length <= 0)                                                       ||
            (rootNodeAndActionsArray.length > ConditionNode.MaxCountPerEventRoot)
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
            if ((actionIdArray.length > MaxCounts.PerEvent) ||
                (actionIdArray.length <= 0)                                                     ||
                (actionIdArray.some(v => !actionDict.has(v)))
            ) {
                return false;
            }
        }
    }

    return true;
}

export function getErrorTipForEvent(fullData: WarEventFullData, event: WarEvent): string | null {
    const eventsCount = fullData.getEventArray().length;
    if (eventsCount > Event.MaxEventsPerMap) {
        return `${getText(TextType.A0182)} (${eventsCount}/${Event.MaxEventsPerMap})`;
    }

    const rootNodeAndActionsArray = event.getRootNodeAndActionsArray();
    {
        const count     = rootNodeAndActionsArray.length;
        const minCount  = 1;
        const maxCount  = ConditionNode.MaxCountPerEventRoot;
        if ((count < minCount) || (count > maxCount)) {
            return getFormattedText(TextType.F0267, minCount, maxCount, count);
        }
    }

    for (const rootNodeAndActions of rootNodeAndActionsArray) {
        const nodeIdAndFlags = rootNodeAndActions.getNodeIdAndFlags();
        if (nodeIdAndFlags == null) {
            return getText(TextType.A0159);
        }

        {
            const count     = rootNodeAndActions.getActionIdArray().length;
            const minCount  = 1;
            const maxCount  = MaxCounts.PerEvent;
            if ((count < minCount) || (count > maxCount)) {
                return getFormattedText(TextType.F0268, `N${nodeIdAndFlags.getNodeId()}`, `E${event.getEventId()}`, minCount, maxCount, count);
            }
        }
    }

    return null;
}

export function getErrorTipForEventCallCountInPlayerTurn(event: WarEvent): string | null {
    const count = event.getMaxCallCountInPlayerTurn();
    if ((count == null) || (count < 1)) {
        return getText(TextType.A0181);
    }

    const canBeTriggeredRightAfterAnyEvent = event.getCanBeTriggeredRightAfterAnyEvent() ?? true;
    if (((canBeTriggeredRightAfterAnyEvent) && (count > Event.MaxCallCountInPlayerTurn))    ||
        ((!canBeTriggeredRightAfterAnyEvent) && (count > Event.MaxCallCountTotal))
    ) {
        return getText(TextType.A0181);
    }

    return null;
}

export function getErrorTipForEventCallCountTotal(event: WarEvent): string | null {
    const count = event.getMaxCallCountTotal();
    if ((count == null) || (count < 1) || (count > Event.MaxCallCountTotal)) {
        return getText(TextType.A0181);
    }

    return null;
}

export function addEvent(fullData: WarEventFullData): number | null {
    const eventArray = fullData.getEventArray();
    for (let eventId = 1; ; ++eventId) {
        if (!eventArray.some(v => v.getEventId() === eventId)) {
            eventArray.push(ProtoSchemaCommonProtoWarEventWarEvent.fromJson({
                eventId                             : eventId,
                maxCallCountInPlayerTurn            : 1,
                maxCallCountTotal                   : 1,
                canBeTriggeredRightAfterAnyEvent    : false,
                rootNodeAndActionsArray             : [],
                eventNameArray                      : [
                    { languageType: getCurrentLanguageType(), text: `${getText(TextType.B0469)} #${eventId}` },
                    { languageType: getSecondaryLanguageType(), text: `${getText(TextType.B0469, getSecondaryLanguageType())} #${eventId}` },
                ],
                deprecatedActionIdArray             : [],
            }));
            eventArray.sort((v1, v2) => getExisted(v1.getEventId()) - getExisted(v2.getEventId()));
            return eventId;
        }
    }
}
export function cloneEvent(fullData: WarEventFullData, srcEventId: number, isShallowClone: boolean): number {
    const eventArray    = getExisted(fullData.getEventArray());
    const srcEvent      = getExisted(eventArray.find(v => v.getEventId() === srcEventId));
    for (let eventId = 1; ; ++eventId) {
        if (eventArray.some(v => v.getEventId() === eventId)) {
            continue;
        }

        const srcRootNodeAndActionsArray = srcEvent.getRootNodeAndActionsArray();
        if (isShallowClone) {
            eventArray.push(ProtoSchemaCommonProtoWarEventWarEvent.fromJson({
                eventId                             : eventId,
                eventNameArray                      : srcEvent.getEventNameArray().map(v => v.toJson()),
                maxCallCountInPlayerTurn            : srcEvent.getMaxCallCountInPlayerTurn(),
                canBeTriggeredRightAfterAnyEvent    : srcEvent.getCanBeTriggeredRightAfterAnyEvent() ?? true,
                maxCallCountTotal                   : srcEvent.getMaxCallCountTotal(),
                rootNodeAndActionsArray             : srcRootNodeAndActionsArray.map(v => v.toJson()),
                deprecatedActionIdArray             : [],
            }));
        } else {
            eventArray.push(ProtoSchemaCommonProtoWarEventWarEvent.fromJson({
                eventId                             : eventId,
                eventNameArray                      : srcEvent.getEventNameArray().map(v => v.clone().toJson()),
                maxCallCountInPlayerTurn            : srcEvent.getMaxCallCountInPlayerTurn(),
                canBeTriggeredRightAfterAnyEvent    : srcEvent.getCanBeTriggeredRightAfterAnyEvent() ?? true,
                maxCallCountTotal                   : srcEvent.getMaxCallCountTotal(),
                // actionIdArray                       : srcEvent.getActionIdArray().map(v => GhWarEventAction.cloneAction(fullData, v)),
                // rootConditionNodeIdAndFlags         : srcRootNodeAndActionsArray == null
                //     ? null
                //     : {
                //         nodeId      : GhWarEventConditionNode.cloneNode(fullData, srcRootNodeAndActionsArray.getNodeId(), isShallowClone),
                //         isNegated   : srcRootNodeAndActionsArray.getIsNegated(),
                //     }
                rootNodeAndActionsArray             : srcRootNodeAndActionsArray.map(root => {
                    const nodeIdAndFlags = root.getNodeIdAndFlags();
                    return {
                        nodeIdAndFlags  : nodeIdAndFlags == null
                            ? null
                            : {
                                nodeId      : cloneNode(fullData, nodeIdAndFlags.getNodeId(), isShallowClone),
                                isNegated   : nodeIdAndFlags.getIsNegated(),
                            },
                        actionIdArray   : root.getActionIdArray().map(v => cloneAction(fullData, v)),
                    };
                }),
                deprecatedActionIdArray             : [],
            }));
        }

        eventArray.sort((v1, v2) => getExisted(v1.getEventId()) - getExisted(v2.getEventId()));
        return eventId;
    }
}
