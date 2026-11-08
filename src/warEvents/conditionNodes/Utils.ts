import {
    Lang_Utils,
    WarEvents_Conditions_Utils_Common,
    WarEvents_Constants,
    WarEvents_FullDatas_Utils,
    Helpers_Misc,
    WarEvents_Actions_Constants_Common,
    Lang_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import { ConditionIdAndFlags } from "../../proto/schema/CommonProto/WarEvent/ConditionIdAndFlags.ts";
import { ConditionNodeAndActions } from "../../proto/schema/CommonProto/WarEvent/ConditionNodeAndActions.ts";
import { NodeIdAndFlags } from "../../proto/schema/CommonProto/WarEvent/NodeIdAndFlags.ts";
import type { WarEventCondition } from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import { WarEventConditionNode } from "../../proto/schema/CommonProto/WarEvent/WarEventConditionNode.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";

export function checkIsValidWarEventConditionNode({ conditionNode, conditionDict, nodeDict }: {    // DONE
    conditionNode   : WarEventConditionNode;
    conditionDict   : Map<number, WarEventCondition>;
    nodeDict        : Map<number, WarEventConditionNode>;
}): boolean {
    const currNodeId = conditionNode.getNodeId();
    if (currNodeId == null) {
        return false;
    }

    if (!Lang_Utils.checkIsValidLanguageTextArray({
        list          : conditionNode.getNodeNameArray(),
        maxTextLength : WarEvents_Constants.Event.MaxNameLength,
        minTextLength : 1,
        minTextCount  : 0,
    })) {
        return false;
    }

    const conditionIdAndFlagsArray  = conditionNode.getConditionIdAndFlagsArray();
    const subNodeIdAndFlagsArray    = conditionNode.getSubNodeIdAndFlagsArray();
    if (conditionIdAndFlagsArray.length + subNodeIdAndFlagsArray.length <= 0) {
        return false;
    }

    for (const conditionId of conditionIdAndFlagsArray.map(v => v.getConditionId())) {
        if (!conditionDict.has(conditionId)) {
            return false;
        }
    }

    for (const subNodeId of subNodeIdAndFlagsArray.map(v => v.getNodeId())) {
        if (!nodeDict.has(subNodeId)) {
            return false;
        }
    }

    const usedNodeIdArray       = [currNodeId];
    const usedNodeIdSet         = new Set<number>();
    const usedConditionIdSet    = new Set<number>();
    for (let i = 0; i < usedNodeIdArray.length; ++i) {
        const nodeId = usedNodeIdArray[i];
        if (usedNodeIdSet.has(nodeId)) {
            return false;
        }
        usedNodeIdSet.add(nodeId);

        const subNode = nodeDict.get(nodeId);
        if (subNode == null) {
            return false;
        }

        usedNodeIdArray.push(...subNode.getSubNodeIdAndFlagsArray().map(v => v.getNodeId()));

        for (const conId of subNode.getConditionIdAndFlagsArray().map(v => v.getConditionId())) {
            if (usedConditionIdSet.has(conId)) {
                return false;
            }
            usedConditionIdSet.add(conId);
        }
    }

    return true;
}

export function getErrorTipForConditionNode(fullData: WarEventFullData, node: WarEventConditionNode): string | null {
    const nodeId = node.getNodeId();
    for (const warEvent of fullData.getEventArray()) {
        for (const rootNodeAndActions of warEvent.getRootNodeAndActionsArray()) {
            if (rootNodeAndActions.getNodeIdAndFlags()?.getNodeId() === nodeId) {
                const count     = rootNodeAndActions.getActionIdArray().length;
                const minCount  = 1;
                const maxCount  = WarEvents_Actions_Constants_Common.MaxCounts.PerEvent;
                if ((count < minCount) || (count > maxCount)) {
                    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0268, `N${nodeId}`, `E${warEvent.getEventId()}`, minCount, maxCount, count);
                }
            }
        }
    }

    const nodesCount = fullData.getConditionNodeArray().length;
    if (nodesCount > WarEvents_Constants.ConditionNode.MaxCountPerMap) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.A0183)} (${nodesCount}/${WarEvents_Constants.ConditionNode.MaxCountPerMap})`;
    }

    if ((node.getSubNodeIdAndFlagsArray().length + node.getConditionIdAndFlagsArray().length) <= 0) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0161);
    }

    const duplicatedNodeId  = getDuplicatedSubNodeId(fullData, nodeId);
    if (duplicatedNodeId != null) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0061, `N${duplicatedNodeId}`);
    }

    const duplicatedConditionId = getDuplicatedConditionId(fullData, nodeId);
    if (duplicatedConditionId != null) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0062, `C${duplicatedConditionId}`);
    }

    return null;
}

function getDuplicatedSubNodeId(fullData: WarEventFullData, parentNodeId: number): number | null {
    const nodeIdArray   = [parentNodeId];
    const usedNodeIdSet = new Set<number>();
    for (const nodeId of nodeIdArray) {
        if (usedNodeIdSet.has(nodeId)) {
            return nodeId;
        }
        usedNodeIdSet.add(nodeId);

        nodeIdArray.push(...WarEvents_FullDatas_Utils.getNode(fullData, nodeId)?.getSubNodeIdAndFlagsArray().map(v => v.getNodeId()) ?? []);
    }
    return null;
}
function getDuplicatedConditionId(fullData: WarEventFullData, parentNodeId: number): number | null {
    const nodeIdArray           = [parentNodeId];
    const usedConditionIdSet    = new Set<number>();
    for (const nodeId of nodeIdArray) {
        const node = WarEvents_FullDatas_Utils.getNode(fullData, nodeId);
        if (node) {
            nodeIdArray.push(...node.getSubNodeIdAndFlagsArray().map(v => v.getNodeId()));
            for (const conditionId of node.getConditionIdAndFlagsArray().map(v => v.getConditionId())) {
                if (usedConditionIdSet.has(conditionId)) {
                    return conditionId;
                }
                usedConditionIdSet.add(conditionId);
            }
        }
    }
    return null;
}

export function cloneNode(fullData: WarEventFullData, srcNodeId: number, isShallowClone: boolean): number {
    const nodeArray = fullData.getConditionNodeArray();
    const srcNode   = Helpers_Misc.getExisted(nodeArray.find(v => v.getNodeId() === srcNodeId));
    for (let nodeId = 1; ; ++nodeId) {
        if (nodeArray.some(v => v.getNodeId() === nodeId)) {
            continue;
        }

        const newNode = srcNode.clone();
        newNode.setNodeId(nodeId);
        nodeArray.push(newNode);
        if (!isShallowClone) {
            {
                const newConditionIdAndFlagsArray: ConditionIdAndFlags[] = [];
                for (const conditionIdAndFlags of srcNode.getConditionIdAndFlagsArray()) {
                    newConditionIdAndFlagsArray.push(ConditionIdAndFlags.fromJson({
                        conditionId : WarEvents_Conditions_Utils_Common.cloneCondition(fullData, conditionIdAndFlags.getConditionId()),
                        isNegated   : conditionIdAndFlags.getIsNegated(),
                    }));
                }
                newNode.setConditionIdAndFlagsArray(newConditionIdAndFlagsArray);
            }

            {
                const newSubNodeIdAndFlagsArray: NodeIdAndFlags[] = [];
                for (const subNodeIdAndFlags of srcNode.getSubNodeIdAndFlagsArray()) {
                    newSubNodeIdAndFlagsArray.push(NodeIdAndFlags.fromJson({
                        nodeId    : cloneNode(fullData, subNodeIdAndFlags.getNodeId(), isShallowClone),
                        isNegated : subNodeIdAndFlags.getIsNegated(),
                    }));
                }
                newNode.setSubNodeIdAndFlagsArray(newSubNodeIdAndFlagsArray);
            }
        }

        nodeArray.sort((v1, v2) => v1.getNodeId() - v2.getNodeId());
        return nodeId;
    }
}

export function createAndAddRootNodeInEvent({ fullData, eventId, isNeedAnd, isNeedFalse, conditionIdAndFlagsArray = [], subNodeIdAndFlagsArray = [] }: {   // DONE
    fullData                    : WarEventFullData;
    eventId                     : number;
    isNeedAnd                   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<boolean>;
    isNeedFalse                 : AuxiliaryTypes_AuxiliaryTypes.Undefinable<boolean>;
    conditionIdAndFlagsArray?   : ConditionIdAndFlags[];
    subNodeIdAndFlagsArray?     : NodeIdAndFlags[];
}): number | null {
    const event = WarEvents_FullDatas_Utils.getEvent(fullData, eventId);
    if (event == null) {
        return null;
    }

    const rootNodeAndActionsArray = event.getRootNodeAndActionsArray();
    if (rootNodeAndActionsArray.length >= WarEvents_Constants.ConditionNode.MaxCountPerEventRoot) {
        return null;
    }

    const nodeArray = fullData.getConditionNodeArray();
    for (let newNodeId = 1; ; ++newNodeId) {
        if (!nodeArray.some(v => v.getNodeId() === newNodeId)) {
            nodeArray.push(WarEventConditionNode.fromJson({
                nodeId                     : newNodeId,
                isNeedAnd                  : isNeedAnd,
                isNeedFalse                : isNeedFalse,
                conditionIdAndFlagsArray   : conditionIdAndFlagsArray.map(v => v.toJson()),
                subNodeIdAndFlagsArray     : subNodeIdAndFlagsArray.map(v => v.toJson()),
                nodeNameArray              : [],
                deprecatedSubNodeIdArray   : [],
                deprecatedConditionIdArray : [],
            }));
            nodeArray.sort((v1, v2) => v1.getNodeId() - v2.getNodeId());

            // const oldNodeId         = event.conditionNodeId;
            rootNodeAndActionsArray.push(ConditionNodeAndActions.fromJson({
                nodeIdAndFlags : {
                    nodeId    : newNodeId,
                    isNegated : false,
                },
                actionIdArray : [],
            }));
            // checkAndDeleteUnusedNode(fullData, oldNodeId);

            return newNodeId;
        }
    }
}
export function createAndReplaceRootNodeInEvent({ fullData, eventId, oldRootNodeId, isNeedAnd, isNeedFalse, conditionIdAndFlagsArray = [], subNodeIdAndFlagsArray = [] }: {   // DONE
    fullData                    : WarEventFullData;
    eventId                     : number;
    oldRootNodeId               : number;
    isNeedAnd                   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<boolean>;
    isNeedFalse                 : AuxiliaryTypes_AuxiliaryTypes.Undefinable<boolean>;
    conditionIdAndFlagsArray?   : ConditionIdAndFlags[];
    subNodeIdAndFlagsArray?     : NodeIdAndFlags[];
}): number | null {
    const event = WarEvents_FullDatas_Utils.getEvent(fullData, eventId);
    if (event == null) {
        return null;
    }

    const existingRootNodeAndActions = event.getRootNodeAndActionsArray().find(v => v.getNodeIdAndFlags()?.getNodeId() === oldRootNodeId);
    if (existingRootNodeAndActions == null) {
        return null;
    }

    const nodeArray = fullData.getConditionNodeArray();
    for (let nodeId = 1; ; ++nodeId) {
        if (!nodeArray.some(v => v.getNodeId() === nodeId)) {
            nodeArray.push(WarEventConditionNode.fromJson({
                nodeId                     : nodeId,
                isNeedAnd                  : isNeedAnd,
                isNeedFalse                : isNeedFalse,
                conditionIdAndFlagsArray   : conditionIdAndFlagsArray.map(v => v.toJson()),
                subNodeIdAndFlagsArray     : subNodeIdAndFlagsArray.map(v => v.toJson()),
                nodeNameArray              : [],
                deprecatedSubNodeIdArray   : [],
                deprecatedConditionIdArray : [],
            }));
            nodeArray.sort((v1, v2) => v1.getNodeId() - v2.getNodeId());

            // const oldNodeId         = event.conditionNodeId;
            existingRootNodeAndActions.getNodeIdAndFlags()?.setNodeId(nodeId);
            // checkAndDeleteUnusedNode(fullData, oldNodeId);

            return nodeId;
        }
    }
}
