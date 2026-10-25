import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../auxiliaryTypes/MapSize.ts";
import { checkIsValidId, checkIsValidName } from "../../customCounters/Utils.ts";
import type { GcData } from "../../gameConfig/GcData.ts";
import { deleteElementFromList } from "../../helpers/Collection.ts";
import { getExisted } from "../../helpers/Misc.ts";
import type { WarEvent as ProtoSchemaCommonProtoWarEventWarEvent } from "../../proto/schema/CommonProto/WarEvent/WarEvent.ts";
import type {
    WarEventAction as ProtoSchemaCommonProtoWarEventWarEventAction,
} from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type {
    WarEventCondition as ProtoSchemaCommonProtoWarEventWarEventCondition,
} from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type {
    WarEventConditionNode as ProtoSchemaCommonProtoWarEventWarEventConditionNode,
} from "../../proto/schema/CommonProto/WarEvent/WarEventConditionNode.ts";
import { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { MaxCounts } from "../actions/constants/Common.ts";
import { checkIsValidWarEventActionId, checkIsValidWarEventAction } from "../actions/utils/Common.ts";
import { checkIsValidWarEventConditionNode } from "../conditionNodes/Utils.ts";
import { MaxCountPerMap } from "../conditions/Constants.ts";
import { checkIsValidWarEventCondition } from "../conditions/utils/Common.ts";
import { ConditionNode, Event } from "../Constants.ts";
import { checkIsValidWarEvent } from "../events/Utils.ts";

type WarEvent               = ProtoSchemaCommonProtoWarEventWarEvent;
type WarEventAction         = ProtoSchemaCommonProtoWarEventWarEventAction;
type WarEventCondition      = ProtoSchemaCommonProtoWarEventWarEventCondition;
type WarEventConditionNode  = ProtoSchemaCommonProtoWarEventWarEventConditionNode;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;

export function getEvent(fullData: WarEventFullData, eventId: number): Undefinable<WarEvent> {
    return fullData.getEventArray().find(v => v.getEventId() === eventId);
}
export function getCondition(fullData: WarEventFullData, conditionId: number): Undefinable<WarEventCondition> {
    return fullData.getConditionArray().find(v => v.getWecCommonData()?.getConditionId() === conditionId);
}
export function getNode(fullData: WarEventFullData, nodeId: number): Undefinable<WarEventConditionNode> {
    return fullData.getConditionNodeArray().find(v => v.getNodeId() === nodeId);
}
export function getAction(fullData: WarEventFullData, actionId: number): Undefinable<WarEventAction> {
    return fullData.getActionArray().find(v => v.getWeaCommonData()?.getActionId() === actionId);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getAllWarEventIdArray(fullData: Undefinable<WarEventFullData>): number[] {
    const idArray: number[] = [];
    for (const event of fullData?.getEventArray() ?? []) {
        const eventId = event.getEventId();
        if (eventId != null) {
            idArray.push(eventId);
        }
    }
    return idArray;
}

export function checkIsEmptyWarEventFullData(warEventFullData: Undefinable<WarEventFullData>): boolean {
    if (warEventFullData == null) {
        return true;
    }

    return (!warEventFullData.getEventArray().length)
        && (!warEventFullData.getActionArray().length)
        && (!warEventFullData.getConditionArray().length)
        && (!warEventFullData.getConditionNodeArray().length);
}

export function trimWarEventFullData(fullData: Undefinable<WarEventFullData>, eventIdArray: Undefinable<number[]>, needClone: boolean): WarEventFullData {
    const trimmedData = new WarEventFullData();
    if ((fullData == null) || (eventIdArray == null)) {
        return trimmedData;
    }

    const dstEventArray     = trimmedData.getEventArray();
    const dstNodeArray      = trimmedData.getConditionNodeArray();
    const dstConditionArray = trimmedData.getConditionArray();
    const dstActionArray    = trimmedData.getActionArray();
    const srcEventArray     = fullData.getEventArray();
    const srcNodeArray      = fullData.getConditionNodeArray();
    const srcConditionArray = fullData.getConditionArray();
    const srcActionArray    = fullData.getActionArray();
    trimmedData.setCustomCounterNameArray(fullData.getCustomCounterNameArray().map(v => v.clone()));

    for (const eventId of eventIdArray) {
        const event = srcEventArray.find(v => v.getEventId() === eventId);
        if ((event == null) || (dstEventArray.indexOf(event) >= 0)) {
            continue;
        }
        dstEventArray.push(event);

        for (const rootNodeAndActions of event.getRootNodeAndActionsArray()) {
            for (const actionId of rootNodeAndActions.getActionIdArray()) {
                const action = srcActionArray.find(v => {
                    const commonData = v.getWeaCommonData();
                    return (!!commonData) && (commonData.getActionId() === actionId);
                });
                if ((action == null) || (dstActionArray.indexOf(action) >= 0)) {
                    continue;
                }

                dstActionArray.push(action);
            }
        }

        {
            const nodeIdAndFlagsArray = event.getRootNodeAndActionsArray().map(v => getExisted(v.getNodeIdAndFlags()));
            for (let i = 0; i < nodeIdAndFlagsArray.length; ++i) {
                const nodeId    = nodeIdAndFlagsArray[i].getNodeId();
                const node      = srcNodeArray.find(v => v.getNodeId() === nodeId);
                if ((node == null) || (dstNodeArray.indexOf(node) >= 0)) {
                    continue;
                }

                dstNodeArray.push(node);
                nodeIdAndFlagsArray.push(...node.getSubNodeIdAndFlagsArray());

                for (const conditionIdAndFlags of node.getConditionIdAndFlagsArray()) {
                    const conditionId   = conditionIdAndFlags.getConditionId();
                    const condition     = srcConditionArray.find(v => {
                        const commonData = v.getWecCommonData();
                        return (!!commonData) && (commonData.getConditionId() === conditionId);
                    });
                    if ((condition == null) || (dstConditionArray.indexOf(condition) >= 0)) {
                        continue;
                    }

                    dstConditionArray.push(condition);
                }
            }
        }
    }

    return needClone ? trimmedData.clone() : trimmedData;
}

type WarEventDict               = Map<number, WarEvent>;
type WarEventActionDict         = Map<number, WarEventAction>;
type WarEventConditionDict      = Map<number, WarEventCondition>;
type WarEventConditionNodeDict  = Map<number, WarEventConditionNode>;
export function getErrorCodeForWarEventFullData({ warEventFullData, gameConfig, mapSize, playersCountUnneutral }: {
    warEventFullData        : Undefinable<WarEventFullData>;
    gameConfig              : GcData;
    mapSize                 : MapSize;
    playersCountUnneutral   : number;
}): ClientErrorCode {   // DONE
    if (warEventFullData == null) {
        return ClientErrorCode.NoError;
    }

    const actionDict = new Map<number, WarEventAction>();
    for (const action of warEventFullData.getActionArray()) {
        const actionId = action.getWeaCommonData()?.getActionId();
        if ((actionId == null)                                              ||
            (actionDict.has(actionId))                                      ||
            (!checkIsValidWarEventActionId(actionId))
        ) {
            return ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_00;
        }
        actionDict.set(actionId, action);
    }
    if (actionDict.size > MaxCounts.PerMap) {
        return ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_01;
    }

    const conditionDict = new Map<number, WarEventCondition>();
    for (const condition of warEventFullData.getConditionArray()) {
        const conditionId = condition.getWecCommonData()?.getConditionId();
        if ((conditionId == null) || (conditionDict.has(conditionId))) {
            return ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_02;
        }
        conditionDict.set(conditionId, condition);
    }
    if (conditionDict.size > MaxCountPerMap) {
        return ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_03;
    }

    const nodeDict = new Map<number, WarEventConditionNode>();
    for (const node of warEventFullData.getConditionNodeArray()) {
        const nodeId = node.getNodeId();
        if ((nodeId == null) || (nodeDict.has(nodeId))) {
            return ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_04;
        }
        nodeDict.set(nodeId, node);
    }
    if (nodeDict.size > ConditionNode.MaxCountPerMap) {
        return ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_05;
    }

    const eventDict = new Map<number, WarEvent>();
    for (const event of warEventFullData.getEventArray()) {
        const eventId = event.getEventId();
        if ((eventId == null) || (eventDict.has(eventId))) {
            return ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_06;
        }
        eventDict.set(eventId, event);
    }
    if (eventDict.size > Event.MaxEventsPerMap) {
        return ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_07;
    }

    const customCounterNameDict = new Map<number, string>();
    for (const idAndName of warEventFullData.getCustomCounterNameArray()) {
        const id = idAndName.getId() ?? 0;
        if (!checkIsValidId(id)) {
            return ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_08;
        }
        if (customCounterNameDict.has(id)) {
            return ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_09;
        }

        const name = idAndName.getName() ?? ``;
        if (!checkIsValidName(name)) {
            return ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_10;
        }
        for (const [, value] of customCounterNameDict) {
            if (name == value) {
                return ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_11;
            }
        }

        customCounterNameDict.set(id, name);
    }

    if (!checkIsEveryWarEventActionInUse(actionDict, eventDict)) {
        return ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_12;
    }
    if (!checkIsEveryWarEventConditionInUse(conditionDict, nodeDict)) {
        return ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_13;
    }
    if (!checkIsEveryWarEventConditionNodeInUse(nodeDict, eventDict)) {
        return ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_14;
    }

    const customCounterNameSet = new Set(customCounterNameDict.values());
    for (const [, action] of actionDict) {
        if (!checkIsValidWarEventAction({ action, mapSize, gameConfig, playersCountUnneutral, customCounterNameSet })) {
            return ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_15;
        }
    }
    for (const [, condition] of conditionDict) {
        if (!checkIsValidWarEventCondition({ condition, mapSize, gameConfig, playersCountUnneutral, customCounterNameSet })) {
            return ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_16;
        }
    }
    for (const [, conditionNode] of nodeDict) {
        if (!checkIsValidWarEventConditionNode({ conditionNode, conditionDict, nodeDict })) {
            return ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_17;
        }
    }
    for (const [, warEvent] of eventDict) {
        if (!checkIsValidWarEvent({ warEvent, nodeDict, actionDict })) {
            return ClientErrorCode.WarEventHelper_GetErrorCodeForWarEventFullData_18;
        }
    }

    return ClientErrorCode.NoError;
}
function checkIsEveryWarEventActionInUse(actionDict: WarEventActionDict, eventDict: WarEventDict): boolean {    // DONE
    for (const [actionId] of actionDict) {
        let isInUse = false;
        for (const [, event] of eventDict) {
            if (event.getRootNodeAndActionsArray().some(v => v.getActionIdArray().includes(actionId))) {
                isInUse = true;
                break;
            }
        }
        if (!isInUse) {
            return false;
        }
    }

    return true;
}
function checkIsEveryWarEventConditionInUse(conditionDict: WarEventConditionDict, nodeDict: WarEventConditionNodeDict): boolean {   // DONE
    for (const [conditionId] of conditionDict) {
        let isInUse = false;
        for (const [, node] of nodeDict) {
            if (node.getConditionIdAndFlagsArray().some(v => v.getConditionId() === conditionId)) {
                isInUse = true;
                break;
            }
        }
        if (!isInUse) {
            return false;
        }
    }

    return true;
}
function checkIsEveryWarEventConditionNodeInUse(nodeDict: WarEventConditionNodeDict, eventDict: WarEventDict): boolean {    // DONE
    for (const [nodeId] of nodeDict) {
        let isInUse = false;
        for (const [, event] of eventDict) {
            if (event.getRootNodeAndActionsArray().some(v => v.getNodeIdAndFlags()?.getNodeId() === nodeId)) {
                isInUse = true;
                break;
            }
        }
        if (isInUse) {
            continue;
        }

        for (const [, node] of nodeDict) {
            if (node.getSubNodeIdAndFlagsArray().some(v => v.getNodeId() === nodeId)) {
                isInUse = true;
                break;
            }
        }
        if (!isInUse) {
            return false;
        }
    }

    return true;
}

export function checkAndDeleteUnusedComponents(fullData: WarEventFullData): {
    deletedNodesCount       : number;
    deletedConditionsCount  : number;
    deletedActionsCount     : number;
} {
    let deletedNodesCount = 0;
    for (const node of fullData.getConditionNodeArray().concat()) {
        deletedNodesCount += checkAndDeleteUnusedNode(fullData, getExisted(node.getNodeId()), true);
    }

    let deletedConditionsCount = 0;
    for (const condition of fullData.getConditionArray().concat()) {
        deletedConditionsCount += checkAndDeleteUnusedCondition(fullData, getExisted(condition.getWecCommonData()?.getConditionId()));
    }

    let deletedActionsCount = 0;
    for (const action of fullData.getActionArray().concat()) {
        deletedActionsCount += checkAndDeleteUnusedAction(fullData, getExisted(action.getWeaCommonData()?.getActionId()));
    }

    return {
        deletedNodesCount,
        deletedConditionsCount,
        deletedActionsCount,
    };
}
function checkAndDeleteUnusedNode(fullData: WarEventFullData, nodeId: number, isRecursive: boolean): number {
    const nodeArray = fullData.getConditionNodeArray();
    let deleteCount = 0;
    if (nodeArray == null) {
        return deleteCount;
    }

    const node = getNode(fullData, nodeId);
    if (node == null) {
        return deleteCount;
    }

    if ((fullData.getEventArray().some(evt => evt.getRootNodeAndActionsArray().some(v => v.getNodeIdAndFlags()?.getNodeId() === nodeId)))   ||
        (nodeArray.some(v => v.getSubNodeIdAndFlagsArray().some(c => c.getNodeId() === nodeId)))
    ) {
        return deleteCount;
    }

    deleteElementFromList(nodeArray, node);
    ++deleteCount;

    if (isRecursive) {
        for (const subNodeIdAndFlags of node.getSubNodeIdAndFlagsArray()) {
            deleteCount += checkAndDeleteUnusedNode(fullData, subNodeIdAndFlags.getNodeId(), true);
        }
    }

    return deleteCount;
}
function checkAndDeleteUnusedCondition(fullData: WarEventFullData, conditionId: number): number {
    const conditionArray = fullData.getConditionArray();
    if (conditionArray == null) {
        return 0;
    }

    const condition = getCondition(fullData, conditionId);
    if (condition == null) {
        return 0;
    }

    if (fullData.getConditionNodeArray().some(v => v.getConditionIdAndFlagsArray().some(c => c.getConditionId() === conditionId))) {
        return 0;
    }

    return deleteElementFromList(conditionArray, condition);
}
function checkAndDeleteUnusedAction(fullData: WarEventFullData, actionId: number): number {
    const actionArray = fullData.getActionArray();
    if (actionArray == null) {
        return 0;
    }

    const action = getAction(fullData, actionId);
    if (action == null) {
        return 0;
    }

    if (fullData.getEventArray().some(evt => evt.getRootNodeAndActionsArray().some(v => v.getActionIdArray().includes(actionId)))) {
        return 0;
    }

    return deleteElementFromList(actionArray, action);
}
