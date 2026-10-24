import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoWarEventConditionNodeAndActions from "../../proto/schema/CommonProto/WarEvent/ConditionNodeAndActions.ts";
import * as ProtoSchemaCommonProtoWarEventNodeIdAndFlags from "../../proto/schema/CommonProto/WarEvent/NodeIdAndFlags.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as WarEventsConditionNodesUtils from "../../warEvents/conditionNodes/Utils.ts";
import * as WarEventsFullDatasUtils from "../../warEvents/fullDatas/Utils.ts";

type WarEventFullData   = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;

export interface OpenData {
    eventId         : number;
    parentNodeId?   : number;
    oldNodeId       : number | null;
    fullData        : WarEventFullData;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listNode!     : UiInterfacesIUiScrollList.IUiScrollList<DataForNodeRenderer>;
    private readonly _labelTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNoNode!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!     : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        this._labelTitle.setLangText(LangConstants.TextType.B0258);
        this._labelNoNode.setLangText(LangConstants.TextType.B0278);
        this._btnClose.setLangText(LangConstants.TextType.B0146);
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

interface DataForNodeRenderer extends UiTypesUiListItemData.UiListItemData {
    eventId         : number;
    parentNodeId?   : number;
    oldNodeId       : number | null;
    candidateNodeId : number;
    fullData        : WarEventFullData;
}
class NodeRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForNodeRenderer> {
    private readonly _labelNodeId!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSubNode!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSubCondition!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnCopy!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSelect!            : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnCopy,    callback: this._onTouchedBtnCopy },
            { ui: this._btnSelect,  callback: this._onTouchedBtnSelect },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        const candidateNode     = HelpersMisc.getExisted(fullData.getConditionNodeArray().find(v => v.getNodeId() === candidateNodeId), UtilsClientErrorCode.ClientErrorCode.WeNodeReplacePanel_NodeRenderer_OnTouchedBtnCopy_00);
        const isNeedAnd         = candidateNode.getIsNeedAnd();
        const isNeedFalse       = candidateNode.getIsNeedFalse();
        if (parentNodeId == null) {
            if (srcNodeId == null) {
                FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            } else {
                if (WarEventsConditionNodesUtils.createAndReplaceRootNodeInEvent({
                    fullData                    : fullData,
                    eventId                     : openData.eventId,
                    oldRootNodeId               : srcNodeId,
                    isNeedAnd                   : isNeedAnd,
                    isNeedFalse                 : isNeedFalse,
                    conditionIdAndFlagsArray    : candidateNode.getConditionIdAndFlagsArray(),
                    subNodeIdAndFlagsArray      : candidateNode.getSubNodeIdAndFlagsArray(),
                }) != null) {
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            }
        } else {
            if (getAllSubNodesAndConditionsForNode({ fullData, nodeId: candidateNodeId }).nodeIdSet.has(parentNodeId)) {
                FloatText2.show(LangUtils.getText(LangConstants.TextType.A0179));
                return;
            }

            if (cloneAndReplaceNodeInParentNode({
                fullData        : fullData,
                parentNodeId    : parentNodeId,
                nodeIdForClone  : candidateNodeId,
                nodeIdForDelete : srcNodeId,
            }) != null) {
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
                    FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
                } else {
                    FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
                    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeNodeReplacePanel);
                    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeCommandPanel);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            } else {
                if (!replaceRootNodeInEvent({
                    fullData    : fullData,
                    eventId     : openData.eventId,
                    oldNodeId   : srcNodeId,
                    newNodeId   : newNodeId,
                })) {
                    FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
                } else {
                    FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
                    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeNodeReplacePanel);
                    GamePanelsManager.closePanel(GamePanelsDict.getDict().WeCommandPanel);
                    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
                }
            }
        } else {
            if (getAllSubNodesAndConditionsForNode({ fullData, nodeId: newNodeId }).nodeIdSet.has(parentNodeId)) {
                FloatText2.show(LangUtils.getText(LangConstants.TextType.A0179));
                return;
            }

            if (!replaceSubNodeInParentNode({
                fullData        : fullData,
                parentNodeId    : parentNodeId,
                oldNodeId       : srcNodeId,
                newNodeId       : newNodeId,
            })) {
                FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            } else {
                FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
                GamePanelsManager.closePanel(GamePanelsDict.getDict().WeNodeReplacePanel);
                GamePanelsManager.closePanel(GamePanelsDict.getDict().WeCommandPanel);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            }
        }
    }
    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnCopy.setText(LangUtils.getText(LangConstants.TextType.B0487));
        this._btnSelect.setText(LangUtils.getText(LangConstants.TextType.B0492));

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
            this._labelNodeId.setText(`N${nodeId} (${LangUtils.getText(LangConstants.TextType.B0749)}: ${obtainerNameArray.length ? obtainerNameArray.join(`, `) : LangUtils.getText(LangConstants.TextType.None)})`);
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
            label.setText(LangUtils.getText(LangConstants.TextType.A0160));
        } else {
            const textArray: string[] = [];
            for (const subNodeIdAndFlags of node.getSubNodeIdAndFlagsArray().concat().sort((v1, v2) => v1.getNodeId() - v2.getNodeId())) {
                textArray.push(`${subNodeIdAndFlags.getIsNegated() ? `! ` : ``}N${subNodeIdAndFlags.getNodeId()}`);
            }

            label.setText(`${LangUtils.getText(LangConstants.TextType.B0489)}: ${textArray.length ? textArray.join(`, `) : LangUtils.getText(LangConstants.TextType.None)}`);
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

            label.setText(`${LangUtils.getText(LangConstants.TextType.B0490)}: ${textArray.length ? textArray.join(`, `) : LangUtils.getText(LangConstants.TextType.None)}`);
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

        const node = WarEventsFullDatasUtils.getNode(fullData, nodeIdForSearch);
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

    const parentNode = WarEventsFullDatasUtils.getNode(fullData, parentNodeId);
    if (parentNode == null) {
        return null;
    }

    const srcNode = WarEventsFullDatasUtils.getNode(fullData, nodeIdForClone);
    if (srcNode == null) {
        return null;
    }
    const newNode = srcNode.clone();

    for (let nodeId = 1; ; ++nodeId) {
        if (!nodeArray.some(v => v.getNodeId() === nodeId)) {
            newNode.setNodeId(nodeId);
            nodeArray.push(newNode);
            nodeArray.sort((v1, v2) => HelpersMisc.getExisted(v1.getNodeId()) - HelpersMisc.getExisted(v2.getNodeId()));

            const arr = parentNode.getSubNodeIdAndFlagsArray();
            HelpersCollection.deleteElementFromList2(arr, v => v.getNodeId() === nodeIdForDelete);
            arr.push(ProtoSchemaCommonProtoWarEventNodeIdAndFlags.NodeIdAndFlags.fromJson({ nodeId: nodeId}));
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
    if (WarEventsFullDatasUtils.getNode(fullData, newNodeId) == null) {
        return false;
    }

    const rootNodeAndActionsArray = WarEventsFullDatasUtils.getEvent(fullData, eventId)?.getRootNodeAndActionsArray();
    if ((rootNodeAndActionsArray == null)                                                       ||
        (rootNodeAndActionsArray.some(v => v.getNodeIdAndFlags()?.getNodeId() === newNodeId))
    ) {
        return false;
    }

    rootNodeAndActionsArray.push(ProtoSchemaCommonProtoWarEventConditionNodeAndActions.ConditionNodeAndActions.fromJson({
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

    if (WarEventsFullDatasUtils.getNode(fullData, newNodeId) == null) {
        return false;
    }

    const rootNodeAndActionsArray = WarEventsFullDatasUtils.getEvent(fullData, eventId)?.getRootNodeAndActionsArray();
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

    if (WarEventsFullDatasUtils.getNode(fullData, newNodeId) == null) {
        return false;
    }

    const parentNode = WarEventsFullDatasUtils.getNode(fullData, parentNodeId);
    if (parentNode == null) {
        return false;
    }

    const nodeIdAndFlagsArray = parentNode.getSubNodeIdAndFlagsArray();
    HelpersCollection.deleteElementFromList2(nodeIdAndFlagsArray, v => v.getNodeId() === oldNodeId);
    nodeIdAndFlagsArray.push(ProtoSchemaCommonProtoWarEventNodeIdAndFlags.NodeIdAndFlags.fromJson({ nodeId: newNodeId }));
    // nodeIdAndFlagsArray.sort((v1, v2) => v1.getNodeId() - v2.getNodeId());
    // checkAndDeleteUnusedNode(fullData, oldNodeId);

    return true;
}
