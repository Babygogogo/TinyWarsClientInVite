import {
    Utils_ClientErrorCode,
    GamePanels_Manager,
    WarEvents_ConditionNodes_Utils,
    Helpers_Collection,
    Notifications_Dispatcher,
    GamePanels_Dict,
    WarEvents_FullDatas_Utils,
    Helpers_Misc,
    Lang_Utils,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import { ConditionNodeAndActions } from "../../proto/schema/CommonProto/WarEvent/ConditionNodeAndActions.ts";
import { NodeIdAndFlags } from "../../proto/schema/CommonProto/WarEvent/NodeIdAndFlags.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";

export interface OpenData {
    eventId         : number;
    parentNodeId?   : number;
    oldNodeId       : number | null;
    fullData        : WarEventFullData;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listNode!     : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForNodeRenderer>;
    private readonly _labelTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNoNode!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!     : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B0258);
        this._labelNoNode.setLangText(Lang_Constants.TextType.B0278);
        this._btnClose.setLangText(Lang_Constants.TextType.B0146);
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

interface DataForNodeRenderer extends Ui_Types_UiListItemData.UiListItemData {
    eventId         : number;
    parentNodeId?   : number;
    oldNodeId       : number | null;
    candidateNodeId : number;
    fullData        : WarEventFullData;
}
class NodeRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForNodeRenderer> {
    private readonly _labelNodeId!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSubNode!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSubCondition!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnCopy!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSelect!            : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnCopy,    callback: this._onTouchedBtnCopy },
            { ui: this._btnSelect,  callback: this._onTouchedBtnSelect },
        ]);
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        const candidateNode     = Helpers_Misc.getExisted(fullData.getConditionNodeArray().find(v => v.getNodeId() === candidateNodeId), Utils_ClientErrorCode.ClientErrorCode.WeNodeReplacePanel_NodeRenderer_OnTouchedBtnCopy_00);
        const isNeedAnd         = candidateNode.getIsNeedAnd();
        const isNeedFalse       = candidateNode.getIsNeedFalse();
        if (parentNodeId == null) {
            if (srcNodeId == null) {
                FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            } else {
                if (WarEvents_ConditionNodes_Utils.createAndReplaceRootNodeInEvent({
                    fullData                    : fullData,
                    eventId                     : openData.eventId,
                    oldRootNodeId               : srcNodeId,
                    isNeedAnd                   : isNeedAnd,
                    isNeedFalse                 : isNeedFalse,
                    conditionIdAndFlagsArray    : candidateNode.getConditionIdAndFlagsArray(),
                    subNodeIdAndFlagsArray      : candidateNode.getSubNodeIdAndFlagsArray(),
                }) != null) {
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            }
        } else {
            if (getAllSubNodesAndConditionsForNode({ fullData, nodeId: candidateNodeId }).nodeIdSet.has(parentNodeId)) {
                FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0179));
                return;
            }

            if (cloneAndReplaceNodeInParentNode({
                fullData        : fullData,
                parentNodeId    : parentNodeId,
                nodeIdForClone  : candidateNodeId,
                nodeIdForDelete : srcNodeId,
            }) != null) {
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
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
                    FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
                } else {
                    FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
                    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeNodeReplacePanel);
                    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeCommandPanel);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            } else {
                if (!replaceRootNodeInEvent({
                    fullData    : fullData,
                    eventId     : openData.eventId,
                    oldNodeId   : srcNodeId,
                    newNodeId   : newNodeId,
                })) {
                    FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
                } else {
                    FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
                    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeNodeReplacePanel);
                    GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeCommandPanel);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
                }
            }
        } else {
            if (getAllSubNodesAndConditionsForNode({ fullData, nodeId: newNodeId }).nodeIdSet.has(parentNodeId)) {
                FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0179));
                return;
            }

            if (!replaceSubNodeInParentNode({
                fullData        : fullData,
                parentNodeId    : parentNodeId,
                oldNodeId       : srcNodeId,
                newNodeId       : newNodeId,
            })) {
                FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            } else {
                FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeNodeReplacePanel);
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeCommandPanel);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            }
        }
    }
    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnCopy.setLangText(Lang_Constants.TextType.B0487);
        this._btnSelect.setLangText(Lang_Constants.TextType.B0492);

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
            this._labelNodeId.setText(`N${nodeId} (${Lang_Utils.getText(Lang_Constants.TextType.B0749)}: ${obtainerNameArray.length ? obtainerNameArray.join(`, `) : Lang_Utils.getText(Lang_Constants.TextType.None)})`);
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
            label.setLangText(Lang_Constants.TextType.A0160);
        } else {
            const textArray: string[] = [];
            for (const subNodeIdAndFlags of node.getSubNodeIdAndFlagsArray().concat().sort((v1, v2) => v1.getNodeId() - v2.getNodeId())) {
                textArray.push(`${subNodeIdAndFlags.getIsNegated() ? `! ` : ``}N${subNodeIdAndFlags.getNodeId()}`);
            }

            label.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0489)}: ${textArray.length ? textArray.join(`, `) : Lang_Utils.getText(Lang_Constants.TextType.None)}`);
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

            label.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0490)}: ${textArray.length ? textArray.join(`, `) : Lang_Utils.getText(Lang_Constants.TextType.None)}`);
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

        const node = WarEvents_FullDatas_Utils.getNode(fullData, nodeIdForSearch);
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

    const parentNode = WarEvents_FullDatas_Utils.getNode(fullData, parentNodeId);
    if (parentNode == null) {
        return null;
    }

    const srcNode = WarEvents_FullDatas_Utils.getNode(fullData, nodeIdForClone);
    if (srcNode == null) {
        return null;
    }
    const newNode = srcNode.clone();

    for (let nodeId = 1; ; ++nodeId) {
        if (!nodeArray.some(v => v.getNodeId() === nodeId)) {
            newNode.setNodeId(nodeId);
            nodeArray.push(newNode);
            nodeArray.sort((v1, v2) => v1.getNodeId() - v2.getNodeId());

            const arr = parentNode.getSubNodeIdAndFlagsArray();
            Helpers_Collection.deleteElementFromList2(arr, v => v.getNodeId() === nodeIdForDelete);
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
    if (WarEvents_FullDatas_Utils.getNode(fullData, newNodeId) == null) {
        return false;
    }

    const rootNodeAndActionsArray = WarEvents_FullDatas_Utils.getEvent(fullData, eventId)?.getRootNodeAndActionsArray();
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

    if (WarEvents_FullDatas_Utils.getNode(fullData, newNodeId) == null) {
        return false;
    }

    const rootNodeAndActionsArray = WarEvents_FullDatas_Utils.getEvent(fullData, eventId)?.getRootNodeAndActionsArray();
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

    if (WarEvents_FullDatas_Utils.getNode(fullData, newNodeId) == null) {
        return false;
    }

    const parentNode = WarEvents_FullDatas_Utils.getNode(fullData, parentNodeId);
    if (parentNode == null) {
        return false;
    }

    const nodeIdAndFlagsArray = parentNode.getSubNodeIdAndFlagsArray();
    Helpers_Collection.deleteElementFromList2(nodeIdAndFlagsArray, v => v.getNodeId() === oldNodeId);
    nodeIdAndFlagsArray.push(NodeIdAndFlags.fromJson({ nodeId: newNodeId }));
    // nodeIdAndFlagsArray.sort((v1, v2) => v1.getNodeId() - v2.getNodeId());
    // checkAndDeleteUnusedNode(fullData, oldNodeId);

    return true;
}
