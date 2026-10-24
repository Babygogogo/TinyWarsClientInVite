import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as ProtoSchemaCommonProtoWarEventWarEvent from "../../proto/schema/CommonProto/WarEvent/WarEvent.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventConditionNode from "../../proto/schema/CommonProto/WarEvent/WarEventConditionNode.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import * as WarEventsActionsConstantsCommon from "../actions/constants/Common.ts";
import * as WarEventsActionsUtilsCommon from "../actions/utils/Common.ts";
import * as WarEventsConditionNodesUtils from "../conditionNodes/Utils.ts";
import * as WarEventsConstants from "../Constants.ts";

type WarEventFullData       = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEvent               = ProtoSchemaCommonProtoWarEventWarEvent.WarEvent;
type WarEventAction         = ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction;
type WarEventConditionNode  = ProtoSchemaCommonProtoWarEventWarEventConditionNode.WarEventConditionNode;

export function checkIsValidWarEvent({ warEvent, nodeDict, actionDict }: { // DONE
    warEvent    : WarEvent;
    nodeDict    : Map<number, WarEventConditionNode>;
    actionDict  : Map<number, WarEventAction>;
}): boolean {
    const eventNameArray = warEvent.getEventNameArray();
    if ((eventNameArray == null)                                     ||
        (!LangUtils.checkIsValidLanguageTextArray({
            list            : eventNameArray,
            maxTextLength   : WarEventsConstants.Event.MaxNameLength,
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
        if (((canBeTriggeredRightAfterAnyEvent) && (count > WarEventsConstants.Event.MaxCallCountInPlayerTurn))    ||
            ((!canBeTriggeredRightAfterAnyEvent) && (count > WarEventsConstants.Event.MaxCallCountTotal))
        ) {
            return false;
        }
    }

    const maxCallCountTotal = warEvent.getMaxCallCountTotal();
    if ((maxCallCountTotal == null)                                     ||
        (maxCallCountTotal < 1)                                         ||
        (maxCallCountTotal > WarEventsConstants.Event.MaxCallCountTotal)
    ) {
        return false;
    }

    {
        const rootNodeAndActionsArray = warEvent.getRootNodeAndActionsArray();
        if ((rootNodeAndActionsArray.length <= 0)                                                       ||
            (rootNodeAndActionsArray.length > WarEventsConstants.ConditionNode.MaxCountPerEventRoot)
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
            if ((actionIdArray.length > WarEventsActionsConstantsCommon.MaxCounts.PerEvent) ||
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
    if (eventsCount > WarEventsConstants.Event.MaxEventsPerMap) {
        return `${LangUtils.getText(LangConstants.TextType.A0182)} (${eventsCount}/${WarEventsConstants.Event.MaxEventsPerMap})`;
    }

    const rootNodeAndActionsArray = event.getRootNodeAndActionsArray();
    {
        const count     = rootNodeAndActionsArray.length;
        const minCount  = 1;
        const maxCount  = WarEventsConstants.ConditionNode.MaxCountPerEventRoot;
        if ((count < minCount) || (count > maxCount)) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0267, minCount, maxCount, count);
        }
    }

    for (const rootNodeAndActions of rootNodeAndActionsArray) {
        const nodeIdAndFlags = rootNodeAndActions.getNodeIdAndFlags();
        if (nodeIdAndFlags == null) {
            return LangUtils.getText(LangConstants.TextType.A0159);
        }

        {
            const count     = rootNodeAndActions.getActionIdArray().length;
            const minCount  = 1;
            const maxCount  = WarEventsActionsConstantsCommon.MaxCounts.PerEvent;
            if ((count < minCount) || (count > maxCount)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0268, `N${nodeIdAndFlags.getNodeId()}`, `E${event.getEventId()}`, minCount, maxCount, count);
            }
        }
    }

    return null;
}

export function getErrorTipForEventCallCountInPlayerTurn(event: WarEvent): string | null {
    const count = event.getMaxCallCountInPlayerTurn();
    if ((count == null) || (count < 1)) {
        return LangUtils.getText(LangConstants.TextType.A0181);
    }

    const canBeTriggeredRightAfterAnyEvent = event.getCanBeTriggeredRightAfterAnyEvent() ?? true;
    if (((canBeTriggeredRightAfterAnyEvent) && (count > WarEventsConstants.Event.MaxCallCountInPlayerTurn))    ||
        ((!canBeTriggeredRightAfterAnyEvent) && (count > WarEventsConstants.Event.MaxCallCountTotal))
    ) {
        return LangUtils.getText(LangConstants.TextType.A0181);
    }

    return null;
}

export function getErrorTipForEventCallCountTotal(event: WarEvent): string | null {
    const count = event.getMaxCallCountTotal();
    if ((count == null) || (count < 1) || (count > WarEventsConstants.Event.MaxCallCountTotal)) {
        return LangUtils.getText(LangConstants.TextType.A0181);
    }

    return null;
}

export function addEvent(fullData: WarEventFullData): number | null {
    const eventArray = fullData.getEventArray();
    for (let eventId = 1; ; ++eventId) {
        if (!eventArray.some(v => v.getEventId() === eventId)) {
            eventArray.push(ProtoSchemaCommonProtoWarEventWarEvent.WarEvent.fromJson({
                eventId                             : eventId,
                maxCallCountInPlayerTurn            : 1,
                maxCallCountTotal                   : 1,
                canBeTriggeredRightAfterAnyEvent    : false,
                rootNodeAndActionsArray             : [],
                eventNameArray                      : [
                    { languageType: LangUtils.getCurrentLanguageType(), text: `${LangUtils.getText(LangConstants.TextType.B0469)} #${eventId}` },
                    { languageType: LangUtils.getSecondaryLanguageType(), text: `${LangUtils.getText(LangConstants.TextType.B0469, LangUtils.getSecondaryLanguageType())} #${eventId}` },
                ],
                deprecatedActionIdArray             : [],
            }));
            eventArray.sort((v1, v2) => HelpersMisc.getExisted(v1.getEventId()) - HelpersMisc.getExisted(v2.getEventId()));
            return eventId;
        }
    }
}
export function cloneEvent(fullData: WarEventFullData, srcEventId: number, isShallowClone: boolean): number {
    const eventArray    = HelpersMisc.getExisted(fullData.getEventArray());
    const srcEvent      = HelpersMisc.getExisted(eventArray.find(v => v.getEventId() === srcEventId));
    for (let eventId = 1; ; ++eventId) {
        if (eventArray.some(v => v.getEventId() === eventId)) {
            continue;
        }

        const srcRootNodeAndActionsArray = srcEvent.getRootNodeAndActionsArray();
        if (isShallowClone) {
            eventArray.push(ProtoSchemaCommonProtoWarEventWarEvent.WarEvent.fromJson({
                eventId                             : eventId,
                eventNameArray                      : srcEvent.getEventNameArray().map(v => v.toJson()),
                maxCallCountInPlayerTurn            : srcEvent.getMaxCallCountInPlayerTurn(),
                canBeTriggeredRightAfterAnyEvent    : srcEvent.getCanBeTriggeredRightAfterAnyEvent() ?? true,
                maxCallCountTotal                   : srcEvent.getMaxCallCountTotal(),
                rootNodeAndActionsArray             : srcRootNodeAndActionsArray.map(v => v.toJson()),
                deprecatedActionIdArray             : [],
            }));
        } else {
            eventArray.push(ProtoSchemaCommonProtoWarEventWarEvent.WarEvent.fromJson({
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
                                nodeId      : WarEventsConditionNodesUtils.cloneNode(fullData, nodeIdAndFlags.getNodeId(), isShallowClone),
                                isNegated   : nodeIdAndFlags.getIsNegated(),
                            },
                        actionIdArray   : root.getActionIdArray().map(v => WarEventsActionsUtilsCommon.cloneAction(fullData, v)),
                    };
                }),
                deprecatedActionIdArray             : [],
            }));
        }

        eventArray.sort((v1, v2) => HelpersMisc.getExisted(v1.getEventId()) - HelpersMisc.getExisted(v2.getEventId()));
        return eventId;
    }
}
