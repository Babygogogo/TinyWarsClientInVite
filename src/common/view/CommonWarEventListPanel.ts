import { showLang } from "../../FloatText.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getLanguageText, getTextForYesOrNo, getWarEventConditionNodeDesc } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { ConditionIdAndFlags } from "../../proto/schema/CommonProto/WarEvent/ConditionIdAndFlags.ts";
import type { NodeIdAndFlags } from "../../proto/schema/CommonProto/WarEvent/NodeIdAndFlags.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiListItemRenderer } from "../../ui/interfaces/IUiListItemRenderer.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getDetailDescForAction, getBriefDescForAction } from "../../warEvents/actions/utils/Common.ts";
import { getDetailedDescForCondition, getBriefDescForCondition } from "../../warEvents/conditions/utils/Common.ts";
import { DescType } from "../../warEvents/Constants.ts";

let _isShowDetail           = false;

export interface OpenData {
    warEventFullData    : WarEventFullData;
    warEventIdArray     : number[];
    gameConfig          : GameConfig;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _btnShowDetail!        : IUiButton;
    private readonly _btnShowBrief!         : IUiButton;
    private readonly _btnHelp!              : IUiButton;
    private readonly _btnClose!             : IUiButton;
    private readonly _labelTitle!           : IUiLabel;

    private readonly _listWarEventId!       : IUiScrollList<DataForWarEventIdRenderer>;
    private readonly _listWarEventDetail!   : IUiScrollList<DataForWarEventDetailRenderer>;
    private readonly _labelNoEvent!         : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnShowDetail,          callback: this._onTouchedBtnShowDetail },
            { ui: this._btnShowBrief,           callback: this._onTouchedBtnIsShowBrief },
            { ui: this._btnHelp,                callback: this._onTouchedBtnHelp },
            { ui: this._btnClose,               callback: this.closePanel },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged,    callback: this._onNotifyMeWarEventFullDataChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listWarEventId.setItemRendererClass(WarEventIdRenderer);
        this._listWarEventDetail.setItemRendererClass(WarEventDetailRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listWarEventDetail.removeAllItems(),
            this._listWarEventId.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public async setAndReviseSelectedEventId(newEventId: number, needScroll: boolean): Promise<void> {
        const listWarEventId    = this._listWarEventId;
        const index             = listWarEventId.getRevisedFirstIndex(v => v?.eventId === newEventId);
        listWarEventId.setSelectedItemIndex(index);
        if (needScroll) {
            listWarEventId.scrollToItem(index);
        }

        await this._updateListWarEventDetailAndLabelNoEvent();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private async _onNotifyMeWarEventFullDataChanged(): Promise<void> {
        await this._resetListWarEventId(this._listWarEventId.getFirstSelectedData()?.eventId ?? null);
        await this._updateListWarEventDetailAndLabelNoEvent();
    }

    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0793),
        });
    }

    private async _onTouchedBtnShowDetail(): Promise<void> {
        _isShowDetail = true;
        this._updateBtnShowDetail();
        this._updateBtnShowBrief();
        await this._updateListWarEventDetailAndLabelNoEvent();

        showLang(TextType.A0845);
    }
    private async _onTouchedBtnIsShowBrief(): Promise<void> {
        _isShowDetail = false;
        this._updateBtnShowDetail();
        this._updateBtnShowBrief();
        await this._updateListWarEventDetailAndLabelNoEvent();

        showLang(TextType.A0844);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateBtnShowDetail();
        this._updateBtnShowBrief();
        await this._resetListWarEventId(this._listWarEventId.getFirstSelectedData()?.eventId ?? null);
        await this._updateListWarEventDetailAndLabelNoEvent();
    }

    private _updateComponentsForLanguage(): void {
        this._labelNoEvent.setLangText(TextType.A0821);
        this._labelTitle.setLangText(TextType.B0461);
        this._btnClose.setLangText(TextType.B0146);
    }

    private async _resetListWarEventId(eventId: number | null): Promise<void> {
        const dataArray: DataForWarEventIdRenderer[] = [];
        for (const warEvent of (this.getOpenData()?.warEventFullData.getEventArray() ?? [])) {
            dataArray.push({
                eventId : warEvent.getEventId(),
                panel   : this,
            });
        }

        const list = this._listWarEventId;
        await list.bindData(dataArray.sort((v1, v2) => v1.eventId - v2.eventId));
        list.setSelectedItemIndex(list.getRevisedFirstIndex(v => v?.eventId === eventId));
    }

    private _updateBtnShowDetail(): void {
        this._btnShowDetail.setIsVisible(!_isShowDetail);
    }
    private _updateBtnShowBrief(): void {
        this._btnShowBrief.setIsVisible(_isShowDetail);
    }
    private async _updateListWarEventDetailAndLabelNoEvent(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const fullData      = openData.warEventFullData;
        const gameConfig    = openData.gameConfig;
        const dataArray     : DataForWarEventDetailRenderer[] = [];
        const eventId   = this._listWarEventId.getFirstSelectedData()?.eventId;
        if (eventId != null) {
            dataArray.push(...generateDataArrayForListWarEventDesc({
                fullData    : fullData,
                eventId     : eventId,
                gameConfig  : gameConfig,
            }));
        }

        this._labelNoEvent.setIsVisible(!dataArray.length);
        await this._listWarEventDetail.bindData(dataArray);
    }
}

function generateDataArrayForListWarEventDesc({ fullData, gameConfig, eventId }: {
    fullData    : WarEventFullData;
    gameConfig  : GameConfig;
    eventId     : number;
}): DataForWarEventDetailRenderer[] {
    const prefixArray   = [`E${eventId}`];
    const dataArray     : DataForWarEventDetailRenderer[] = [{
        fullData        : fullData,
        descType        : DescType.EventName,
        gameConfig      : gameConfig,
        prefixArray     : prefixArray,
        eventId         : eventId,
    }];

    const warEvent = fullData.getEventArray()?.find(v => v.getEventId() === eventId);
    if (warEvent == null) {
        return dataArray;
    }

    dataArray.push(
        {
            fullData        : fullData,
            descType        : DescType.EventMaxCallCountInPlayerTurn,
            gameConfig      : gameConfig,
            prefixArray     : prefixArray,
            eventId         : eventId,
        },
        {
            fullData        : fullData,
            descType        : DescType.EventMaxCallCountTotal,
            gameConfig      : gameConfig,
            prefixArray     : prefixArray,
            eventId         : eventId,
        },
    );

    for (const rootNodeAndActionsArray of warEvent.getRootNodeAndActionsArray()) {
        {
            const nodeIdAndFlags = rootNodeAndActionsArray.getNodeIdAndFlags();
            if (nodeIdAndFlags != null) {
                dataArray.push(...generateNodeDataArrayForListWarEventDesc({
                    fullData        : fullData,
                    eventId         : eventId,
                    gameConfig      : gameConfig,
                    parentNodeId    : null,
                    nodeIdAndFlags  : nodeIdAndFlags,
                    prefixArray     : prefixArray.concat(`${nodeIdAndFlags.getIsNegated() ? `! ` : ``}N${nodeIdAndFlags.getNodeId()}`),
                }));
            }
        }

        let actionIndex = 0;
        for (const actionId of rootNodeAndActionsArray.getActionIdArray()) {
            dataArray.push({
                fullData        : fullData,
                descType        : DescType.Action,
                gameConfig      : gameConfig,
                prefixArray     : prefixArray.concat(`A${actionId}`),
                eventId         : eventId,
                actionId        : actionId,
                actionIndex     : actionIndex++,
            });
        }
    }

    return dataArray;
}
function generateNodeDataArrayForListWarEventDesc({ fullData, eventId, gameConfig, parentNodeId, nodeIdAndFlags: nodeId, prefixArray }: {
    fullData        : WarEventFullData;
    eventId         : number;
    gameConfig      : GameConfig;
    parentNodeId    : NodeIdAndFlags | null;
    nodeIdAndFlags  : NodeIdAndFlags;
    prefixArray     : string[];
}): DataForWarEventDetailRenderer[] {
    const dataArray: DataForWarEventDetailRenderer[] = [{
        fullData                : fullData,
        descType                : DescType.ConditionNode,
        gameConfig              : gameConfig,
        prefixArray             : prefixArray,
        eventId                 : eventId,
        parentNodeIdAndFlags    : parentNodeId ?? void 0,
        nodeId                  : nodeId,
    }];

    const node = fullData.getConditionNodeArray().find(v => v.getNodeId() === nodeId.getNodeId());
    if (node == null) {
        return dataArray;
    }

    for (const conditionIdAndFlags of node.getConditionIdAndFlagsArray()) {
        dataArray.push({
            fullData                : fullData,
            descType                : DescType.Condition,
            gameConfig              : gameConfig,
            prefixArray             : prefixArray.concat([`${conditionIdAndFlags.getIsNegated() ? `! ` : ``}C${conditionIdAndFlags.getConditionId()}`]),
            eventId                 : eventId,
            parentNodeIdAndFlags    : nodeId,
            conditionIdAndFlags     : conditionIdAndFlags,
        });
    }

    for (const subNodeIdAndFlags of node.getSubNodeIdAndFlagsArray()) {
        dataArray.push(...generateNodeDataArrayForListWarEventDesc({
            fullData        : fullData,
            eventId         : eventId,
            gameConfig      : gameConfig,
            parentNodeId    : nodeId,
            nodeIdAndFlags  : subNodeIdAndFlags,
            prefixArray     : prefixArray.concat([`${subNodeIdAndFlags.getIsNegated() ? `! ` : ``}N${subNodeIdAndFlags.getNodeId()}`]),
        }));
    }

    return dataArray;
}

interface DataForWarEventIdRenderer extends UiListItemData {
    eventId : number;
    panel   : Panel;
}
class WarEventIdRenderer
    extends     UiListItemRenderer<DataForWarEventIdRenderer>
    implements  IUiListItemRenderer<DataForWarEventIdRenderer>
{
    private readonly _labelId! : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._labelId.setText(`E${this.getOpenData()?.eventId}`);
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedEventId(openData.eventId, false);
    }
}

interface DataForWarEventDetailRenderer extends UiListItemData {
    fullData                : WarEventFullData;
    gameConfig              : GameConfig;
    descType                : DescType;
    prefixArray             : string[];
    eventId                 : number;
    actionId?               : number;
    actionIndex?            : number;
    conditionIdAndFlags?    : ConditionIdAndFlags;
    parentNodeIdAndFlags?   : NodeIdAndFlags;
    nodeId?                 : NodeIdAndFlags;
}
class WarEventDetailRenderer extends UiListItemRenderer<DataForWarEventDetailRenderer> {
    private readonly _btnModify!        : IUiButton;
    private readonly _groupDesc!        : IUiContainer;
    private readonly _labelDesc!        : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._updateComponentsForLanguage();

        this._btnModify.setIsTouchEnabled(false);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    protected override _doApplyOpenData(): void {
        this._updateLabelDescAndError();
    }

    private _updateComponentsForLanguage(): void {
        this._updateLabelDescAndError();
    }

    private _updateLabelDescAndError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const descType = openData.descType;
        if (descType === DescType.EventName) {
            this._updateForEvent(openData);
        } else if (descType === DescType.EventMaxCallCountInPlayerTurn) {
            this._updateForEventCallCountInPlayerTurn(openData);
        } else if (descType === DescType.EventMaxCallCountTotal) {
            this._updateForEventCallCountTotal(openData);
        } else if (descType === DescType.ConditionNode) {
            this._updateForConditionNode(openData);
        } else if (descType === DescType.Condition) {
            this._updateForCondition(openData);
        } else if (descType === DescType.Action) {
            this._updateForAction(openData);
        } else {
            const labelDesc                 = this._labelDesc;
            const prefixArray               = openData.prefixArray;
            // const prefix        = prefixArray.join(`.`);
            this._btnModify.setText(prefixArray[prefixArray.length - 1]);
            labelDesc.setTextColor(ColorValue.Yellow);
            labelDesc.setLangText(TextType.A0166);
            this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
        }
    }
    private _updateForEvent(data: DataForWarEventDetailRenderer): void {                      // DONE
        const fullData                  = data.fullData;
        const eventId                   = data.eventId;
        const event                     = getExisted(fullData.getEventArray().find(v => v.getEventId() === eventId));
        const prefixArray               = data.prefixArray;
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText(`${getLanguageText({ textArray: event.getEventNameArray() })}`);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
    }
    private _updateForEventCallCountInPlayerTurn(data: DataForWarEventDetailRenderer): void { // DONE
        const eventId               = data.eventId;
        const event                 = getExisted(data.fullData.getEventArray().find(v => v.getEventId() === eventId));
        const prefixArray           = data.prefixArray;
        const textForMaxCallCount   = `${getText(TextType.B0476)}: ${event.getMaxCallCountInPlayerTurn()}`;
        const textForTrigger        = `${getText(TextType.B1400)}: ${getTextForYesOrNo(event.getCanBeTriggeredRightAfterAnyEvent())}`;
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText(`${textForMaxCallCount}, ${textForTrigger}`);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
    }
    private _updateForEventCallCountTotal(data: DataForWarEventDetailRenderer): void {        // DONE
        const eventId                   = data.eventId;
        const event                     = getExisted(data.fullData.getEventArray().find(v => v.getEventId() === eventId));
        const prefixArray               = data.prefixArray;
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText(`${getText(TextType.B0477)}: ${event.getMaxCallCountTotal()}`);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
    }
    private _updateForConditionNode(data: DataForWarEventDetailRenderer): void {              // DONE
        const fullData                  = data.fullData;
        const nodeId                    = data.nodeId?.getNodeId();
        const node                      = getExisted(fullData.getConditionNodeArray().find(v => v.getNodeId() === nodeId));
        const prefixArray               = data.prefixArray;
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);

        const desc                      = getWarEventConditionNodeDesc(node.getIsNeedAnd(), node.getIsNeedFalse());
        this._labelDesc.setText((_isShowDetail
            ? desc
            : (getLanguageText({ textArray: node.getNodeNameArray() }) ?? desc)
        ));
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
    }
    private _updateForCondition(data: DataForWarEventDetailRenderer): void {                  // DONE
        const fullData                  = data.fullData;
        const conditionId               = getExisted(data.conditionIdAndFlags?.getConditionId());
        const condition                 = getExisted(fullData.getConditionArray().find(v => v.getWecCommonData()?.getConditionId() === conditionId));
        const prefixArray               = data.prefixArray;
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText((_isShowDetail
            ? getDetailedDescForCondition(condition, data.gameConfig)
            : (
                getLanguageText({ textArray: condition.getWecCommonData()?.getConditionNameArray() })        ??
                getBriefDescForCondition(condition, data.gameConfig)
            )
        ) ?? UndefinedError);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
    }
    private _updateForAction(data: DataForWarEventDetailRenderer): void {                     // DONE
        const fullData                  = data.fullData;
        const actionId                  = data.actionId;
        const action                    = getExisted(fullData.getActionArray().find(v => v.getWeaCommonData()?.getActionId() === actionId));
        const prefixArray               = data.prefixArray;
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText((_isShowDetail
            ? getDetailDescForAction(action, data.gameConfig)
            : (
                getLanguageText({ textArray: action.getWeaCommonData()?.getActionNameArray() })      ??
                getBriefDescForAction(action, data.gameConfig)
            )
        ) ?? UndefinedError);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
    }
    private _updatePositionForBtnModifyAndGroupDesc(prefixArrayLength: number): void {
        const placeholderWidth  = (prefixArrayLength - 1) * 16;
        const btnModify         = this._btnModify;
        btnModify.setX(placeholderWidth);

        const groupDesc     = this._groupDesc;
        groupDesc.setX(placeholderWidth + btnModify.getScaledWidth() + 4);
        groupDesc.setUnscaledManualWidth(690 - groupDesc.getX());

        const labelDesc     = this._labelDesc;
        labelDesc.setUnscaledManualWidth(groupDesc.getScaledWidth());

        // btnModify.width         = 60 + placeholderWidth;
        // this._groupDesc.left    = btnModify.width + 4;

        this.setUnscaledManualHeight(Math.max(30, labelDesc.getScaledHeight()));
    }
}
