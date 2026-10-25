import { showLang, show } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { closePanel } from "../../gamePanels/Manager.ts";
import { deleteElementFromList2 } from "../../helpers/Collection.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ConditionNodeAndActions } from "../../proto/schema/CommonProto/WarEvent/ConditionNodeAndActions.ts";
import { NodeIdAndFlags } from "../../proto/schema/CommonProto/WarEvent/NodeIdAndFlags.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { createAndReplaceRootNodeInEvent } from "../../warEvents/conditionNodes/Utils.ts";
import { getNode, getEvent } from "../../warEvents/fullDatas/Utils.ts";

export interface OpenData {
    eventId         : number;
    parentNodeId?   : number;
    oldNodeId       : number | null;
    fullData        : WarEventFullData;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!      : IUiImage;
    private readonly _group!        : IUiContainer;
    private readonly _listNode!     : IUiScrollList<DataForNodeRenderer>;
    private readonly _labelTitle!   : IUiLabel;
    private readonly _labelNoNode!  : IUiLabel;
    private readonly _btnClose!     : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listNode.setItemRendererClass(NodeRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listNode.removeAllItems();

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListNodeAndLabelNoNode();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0258);
        this._labelNoNode.setLangText(TextType.B0278);
        this._btnClose.setLangText(TextType.B0146);
    }
    private async _updateListNodeAndLabelNoNode(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventId       = openData.eventId;
        const parentNodeId  = openData.parentNodeId;
        const oldNodeId     = openData.oldNodeId;
        const fullData      = openData.fullData;

        const dataArray: DataForNodeRenderer[] = [];
        for (const node of openData.fullData.getConditionNodeArray()) {
            dataArray.push({
                eventId         : eventId,
                parentNodeId    : parentNodeId,
                oldNodeId       : oldNodeId,
                candidateNodeId : node.getNodeId(),
                fullData        : fullData,
            });
        }

        this._labelNoNode.setIsVisible(!dataArray.length);
        await this._listNode.bindData(dataArray);
    }
}

interface DataForNodeRenderer extends UiListItemData {
    eventId         : number;
    parentNodeId?   : number;
    oldNodeId       : number | null;
    candidateNodeId : number;
    fullData        : WarEventFullData;
}
class NodeRenderer extends UiListItemRenderer<DataForNodeRenderer> {
    private readonly _labelNodeId!          : IUiLabel;
    private readonly _labelSubNode!         : IUiLabel;
    private readonly _labelSubCondition!    : IUiLabel;
    private readonly _btnCopy!              : IUiButton;
    private readonly _btnSelect!            : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnCopy,    callback: this._onTouchedBtnCopy },
            { ui: this._btnSelect,  callback: this._onTouchedBtnSelect },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this._btnCopy.setIsVisible(false);
        this._updateComponentsForLanguage();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateLabelNodeId();
        this._updateLabelSubNode();
        this._updateLabelSubCondition();
        this._updateBtnSelect();
    }

    private _onTouchedBtnCopy(): void {          // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const fullData          = openData.fullData;
        const parentNodeId      = openData.parentNodeId;
        const candidateNodeId   = openData.candidateNodeId;
        const srcNodeId         = openData.oldNodeId;
        const candidateNode     = getExisted(fullData.getConditionNodeArray().find(v => v.getNodeId() === candidateNodeId), ClientErrorCode.WeNodeReplacePanel_NodeRenderer_OnTouchedBtnCopy_00);
        const isNeedAnd         = candidateNode.getIsNeedAnd();
        const isNeedFalse       = candidateNode.getIsNeedFalse();
        if (parentNodeId == null) {
            if (srcNodeId == null) {
                showLang(TextType.YouCanNotDoThisRightNow);
            } else {
                if (createAndReplaceRootNodeInEvent({
                    fullData                    : fullData,
                    eventId                     : openData.eventId,
                    oldRootNodeId               : srcNodeId,
                    isNeedAnd                   : isNeedAnd,
                    isNeedFalse                 : isNeedFalse,
                    conditionIdAndFlagsArray    : candidateNode.getConditionIdAndFlagsArray(),
                    subNodeIdAndFlagsArray      : candidateNode.getSubNodeIdAndFlagsArray(),
                }) != null) {
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            }
        } else {
            if (getAllSubNodesAndConditionsForNode({ fullData, nodeId: candidateNodeId }).nodeIdSet.has(parentNodeId)) {
                show(getText(TextType.A0179));
                return;
            }

            if (cloneAndReplaceNodeInParentNode({
                fullData        : fullData,
                parentNodeId    : parentNodeId,
                nodeIdForClone  : candidateNodeId,
                nodeIdForDelete : srcNodeId,
            }) != null) {
                dispatch(TypeId.WarEventFullDataChanged);
            }
        }
    }
    private _onTouchedBtnSelect(): void {        // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const parentNodeId  = openData.parentNodeId;
        const fullData      = openData.fullData;
        const newNodeId     = openData.candidateNodeId;
        const srcNodeId     = openData.oldNodeId;
        if (parentNodeId == null) {
            if (srcNodeId == null) {
                if (!addRootNodeInEvent({
                    fullData    : fullData,
                    eventId     : openData.eventId,
                    newNodeId   : newNodeId,
                })) {
                    showLang(TextType.YouCanNotDoThisRightNow);
                } else {
                    showLang(TextType.OperationSucceeded);
                    closePanel(getDict().WeNodeReplacePanel);
                    closePanel(getDict().WeCommandPanel);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            } else {
                if (!replaceRootNodeInEvent({
                    fullData    : fullData,
                    eventId     : openData.eventId,
                    oldNodeId   : srcNodeId,
                    newNodeId   : newNodeId,
                })) {
                    showLang(TextType.YouCanNotDoThisRightNow);
                } else {
                    showLang(TextType.OperationSucceeded);
                    closePanel(getDict().WeNodeReplacePanel);
                    closePanel(getDict().WeCommandPanel);
                    dispatch(TypeId.WarEventFullDataChanged);
                }
            }
        } else {
            if (getAllSubNodesAndConditionsForNode({ fullData, nodeId: newNodeId }).nodeIdSet.has(parentNodeId)) {
                show(getText(TextType.A0179));
                return;
            }

            if (!replaceSubNodeInParentNode({
                fullData        : fullData,
                parentNodeId    : parentNodeId,
                oldNodeId       : srcNodeId,
                newNodeId       : newNodeId,
            })) {
                showLang(TextType.YouCanNotDoThisRightNow);
            } else {
                showLang(TextType.OperationSucceeded);
                closePanel(getDict().WeNodeReplacePanel);
                closePanel(getDict().WeCommandPanel);
                dispatch(TypeId.WarEventFullDataChanged);
            }
        }
    }
    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnCopy.setText(getText(TextType.B0487));
        this._btnSelect.setText(getText(TextType.B0492));

        this._updateLabelNodeId();
        this._updateLabelSubNode();
        this._updateLabelSubCondition();
    }

    private _updateLabelNodeId(): void {
        const data = this.getOpenData();
        if (data) {
            const nodeId            = data.candidateNodeId;
            const fullData          = data.fullData;
            const obtainerNameArray = (fullData.getConditionNodeArray().filter(node => node.getSubNodeIdAndFlagsArray().some(v => v.getNodeId() === nodeId)).map(v => `N${v.getNodeId()}`))
                .concat(fullData.getEventArray().filter(event => event.getRootNodeAndActionsArray().some(v => v.getNodeIdAndFlags()?.getNodeId() === nodeId)).map(v => `E${v.getEventId()}`));
            this._labelNodeId.setText(`N${nodeId} (${getText(TextType.B0749)}: ${obtainerNameArray.length ? obtainerNameArray.join(`, `) : getText(TextType.None)})`);
        }
    }
    private _updateLabelSubNode(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const node  = openData.fullData.getConditionNodeArray().find(v => v.getNodeId() === openData.candidateNodeId);
        const label = this._labelSubNode;
        if (node == null) {
            label.setText(getText(TextType.A0160));
        } else {
            const textArray: string[] = [];
            for (const subNodeIdAndFlags of node.getSubNodeIdAndFlagsArray().concat().sort((v1, v2) => v1.getNodeId() - v2.getNodeId())) {
                textArray.push(`${subNodeIdAndFlags.getIsNegated() ? `! ` : ``}N${subNodeIdAndFlags.getNodeId()}`);
            }

            label.setText(`${getText(TextType.B0489)}: ${textArray.length ? textArray.join(`, `) : getText(TextType.None)}`);
        }
    }
    private _updateLabelSubCondition(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const node  = openData.fullData.getConditionNodeArray().find(v => v.getNodeId() === openData.candidateNodeId);
        const label = this._labelSubCondition;
        if (node == null) {
            label.setText(``);
        } else {
            const textArray: string[] = [];
            for (const conditionIdAndFlags of node.getConditionIdAndFlagsArray().concat().sort((v1, v2) => v1.getConditionId() - v2.getConditionId())) {
                textArray.push(`${conditionIdAndFlags.getIsNegated() ? `! ` : ``}C${conditionIdAndFlags.getConditionId()}`);
            }

            label.setText(`${getText(TextType.B0490)}: ${textArray.length ? textArray.join(`, `) : getText(TextType.None)}`);
        }

        const labelSubNode  = this._labelSubNode;
        label.setY(labelSubNode.getY() + labelSubNode.getScaledHeight() + 2);
        this.setUnscaledManualHeight(label.getY() + label.getScaledHeight() + 2);
    }
    private _updateBtnSelect(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._btnSelect.setIsVisible(openData.candidateNodeId !== openData.oldNodeId);
    }
}

function getAllSubNodesAndConditionsForNode({ fullData, nodeId, ignoreNodeIdSet }: {
    fullData        : WarEventFullData;
    nodeId          : number;
    ignoreNodeIdSet?: Set<number>;
}): {
    conditionIdSet  : Set<number>;
    nodeIdSet       : Set<number>;
} {
    const conditionIdSet        = new Set<number>();
    const nodeIdSet             = new Set<number>();
    const nodeIdArrayForSearch  = [nodeId];
    for (const nodeIdForSearch of nodeIdArrayForSearch) {
        if (((ignoreNodeIdSet) && (ignoreNodeIdSet.has(nodeIdForSearch))) ||
            (nodeIdSet.has(nodeIdForSearch))
        ) {
            continue;
        }

        nodeIdSet.add(nodeIdForSearch);

        const node = getNode(fullData, nodeIdForSearch);
        if (node) {
            for (const conditionIdAndFlags of node.getConditionIdAndFlagsArray()) {
                conditionIdSet.add(conditionIdAndFlags.getConditionId());
            }
            nodeIdArrayForSearch.push(...(node.getSubNodeIdAndFlagsArray().map(v => v.getNodeId())));
        }
    }

    return {
        nodeIdSet,
        conditionIdSet,
    };
}

function cloneAndReplaceNodeInParentNode({ fullData, parentNodeId, nodeIdForDelete, nodeIdForClone }: {   // DONE
    fullData        : WarEventFullData;
    parentNodeId    : number;
    nodeIdForDelete : number | null;
    nodeIdForClone  : number;
}): number | null {
    const nodeArray = fullData.getConditionNodeArray();
    if (nodeArray == null) {
        return null;
    }

    const parentNode = getNode(fullData, parentNodeId);
    if (parentNode == null) {
        return null;
    }

    const srcNode = getNode(fullData, nodeIdForClone);
    if (srcNode == null) {
        return null;
    }
    const newNode = srcNode.clone();

    for (let nodeId = 1; ; ++nodeId) {
        if (!nodeArray.some(v => v.getNodeId() === nodeId)) {
            newNode.setNodeId(nodeId);
            nodeArray.push(newNode);
            nodeArray.sort((v1, v2) => getExisted(v1.getNodeId()) - getExisted(v2.getNodeId()));

            const arr = parentNode.getSubNodeIdAndFlagsArray();
            deleteElementFromList2(arr, v => v.getNodeId() === nodeIdForDelete);
            arr.push(NodeIdAndFlags.fromJson({ nodeId: nodeId}));
            // arr.sort((v1, v2) => v1.getNodeId() - v2.getNodeId());

            return nodeId;
        }
    }
}

function addRootNodeInEvent({ fullData, eventId, newNodeId }: {
    fullData    : WarEventFullData;
    eventId     : number;
    newNodeId   : number;
}): boolean {
    if (getNode(fullData, newNodeId) == null) {
        return false;
    }

    const rootNodeAndActionsArray = getEvent(fullData, eventId)?.getRootNodeAndActionsArray();
    if ((rootNodeAndActionsArray == null)                                                       ||
        (rootNodeAndActionsArray.some(v => v.getNodeIdAndFlags()?.getNodeId() === newNodeId))
    ) {
        return false;
    }

    rootNodeAndActionsArray.push(ConditionNodeAndActions.fromJson({
        nodeIdAndFlags  : {
            nodeId  : newNodeId,
        },
        actionIdArray   : [],
    }));

    return true;
}

function replaceRootNodeInEvent({ fullData, eventId, oldNodeId, newNodeId }: {                       // DONE
    fullData    : WarEventFullData;
    eventId     : number;
    oldNodeId   : number;
    newNodeId   : number;
}): boolean {
    if (oldNodeId === newNodeId) {
        return false;
    }

    if (getNode(fullData, newNodeId) == null) {
        return false;
    }

    const rootNodeAndActionsArray = getEvent(fullData, eventId)?.getRootNodeAndActionsArray();
    if ((rootNodeAndActionsArray == null)                                                       ||
        (rootNodeAndActionsArray.some(v => v.getNodeIdAndFlags()?.getNodeId() === newNodeId))
    ) {
        return false;
    }

    const rootNodeAndActions = rootNodeAndActionsArray.find(v => v.getNodeIdAndFlags()?.getNodeId() === oldNodeId);
    if (rootNodeAndActions == null) {
        return false;
    }

    rootNodeAndActions.getNodeIdAndFlags()?.setNodeId(newNodeId);
    // checkAndDeleteUnusedNode(fullData, oldNodeId);

    return true;
}

function replaceSubNodeInParentNode({ fullData, parentNodeId, oldNodeId, newNodeId }: {  // DONE
    fullData    : WarEventFullData;
    parentNodeId: number;
    oldNodeId   : number | null;
    newNodeId   : number;
}): boolean {
    if (oldNodeId === newNodeId) {
        return false;
    }

    if (getNode(fullData, newNodeId) == null) {
        return false;
    }

    const parentNode = getNode(fullData, parentNodeId);
    if (parentNode == null) {
        return false;
    }

    const nodeIdAndFlagsArray = parentNode.getSubNodeIdAndFlagsArray();
    deleteElementFromList2(nodeIdAndFlagsArray, v => v.getNodeId() === oldNodeId);
    nodeIdAndFlagsArray.push(NodeIdAndFlags.fromJson({ nodeId: newNodeId }));
    // nodeIdAndFlagsArray.sort((v1, v2) => v1.getNodeId() - v2.getNodeId());
    // checkAndDeleteUnusedNode(fullData, oldNodeId);

    return true;
}
