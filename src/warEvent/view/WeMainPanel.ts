import { showLang, show } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { deleteElementFromList } from "../../helpers/Collection.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getFormattedText, getLanguageText, getTextForYesOrNo, getWarEventConditionNodeDesc } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiListItemRenderer } from "../../ui/interfaces/IUiListItemRenderer.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import {
    addDefaultAction,
    getErrorTipForAction,
    getDetailDescForAction,
    getBriefDescForAction,
} from "../../warEvents/actions/utils/Common.ts";
import { createAndAddRootNodeInEvent, getErrorTipForConditionNode } from "../../warEvents/conditionNodes/Utils.ts";
import {
    addDefaultCondition,
    getErrorTipForCondition,
    getDetailedDescForCondition,
    getBriefDescForCondition,
} from "../../warEvents/conditions/utils/Common.ts";
import { DescType } from "../../warEvents/Constants.ts";
import {
    addEvent,
    getErrorTipForEvent,
    getErrorTipForEventCallCountInPlayerTurn,
    getErrorTipForEventCallCountTotal,
} from "../../warEvents/events/Utils.ts";
import { checkAndDeleteUnusedComponents } from "../../warEvents/fullDatas/Utils.ts";

let _isShowDetail           = false;
let _prevWarEventId         : number | null = null;

export interface OpenData {
    war: IMeWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _btnShowDetail!        : IUiButton;
    private readonly _btnShowBrief!         : IUiButton;
    private readonly _btnDeleteRedundancy!  : IUiButton;
    private readonly _btnAddEvent!          : IUiButton;
    private readonly _btnDeleteEvent!       : IUiButton;
    private readonly _btnEventList!         : IUiButton;
    private readonly _btnHelp!              : IUiButton;
    private readonly _btnClose!             : IUiButton;
    private readonly _labelTitle!           : IUiLabel;

    private readonly _listWarEventId!       : IUiScrollList<DataForWarEventIdRenderer>;
    private readonly _listWarEventDetail!   : IUiScrollList<DataForWarEventDetailRenderer>;
    private readonly _labelNoEvent!         : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnDeleteRedundancy,    callback: this._onTouchedBtnDeleteRedundancy },
            { ui: this._btnAddEvent,            callback: this._onTouchedBtnAddEvent },
            { ui: this._btnDeleteEvent,         callback: this._onTouchedBtnDeleteEvent },
            { ui: this._btnEventList,           callback: this._onTouchedBtnEventList },
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
        const index             = getExisted(listWarEventId.getRevisedFirstIndex(v => v?.eventId === newEventId));
        _prevWarEventId         = newEventId;
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

    private _onTouchedBtnDeleteRedundancy(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0188),
            callback: () => {
                const result = checkAndDeleteUnusedComponents(getExisted(war.getWarEventManager().getWarEventFullData()));
                show(getFormattedText(TextType.F0063, result.deletedNodesCount, result.deletedConditionsCount, result.deletedActionsCount));
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnAddEvent(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const fullData  = getExisted(war.getWarEventManager().getWarEventFullData());
        const eventId   = addEvent(fullData);
        if (eventId != null) {
            const subNodeId = createAndAddRootNodeInEvent({
                fullData    : fullData,
                eventId     : eventId,
                isNeedAnd   : true,
                isNeedFalse : null,
            });
            if (subNodeId != null) {
                addDefaultCondition(fullData, subNodeId);
                addDefaultAction({
                    fullData    : fullData,
                    eventId     : eventId,
                    nodeId      : subNodeId,
                    actionIndex : null,
                });
            }

            dispatch(TypeId.WarEventFullDataChanged);
        }
    }

    private _onTouchedBtnDeleteEvent(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const eventId = this._listWarEventId.getFirstSelectedData()?.eventId;
        if (eventId == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => `${getText(TextType.B0479)} E${eventId}`,
            getContent : () => getText(TextType.A0935),
            callback: () => {
                const eventArray = getExisted(war.getWarEventManager().getWarEventFullData()?.getEventArray());
                deleteElementFromList(eventArray, eventArray.find(v => v.getEventId() === eventId));

                for (const templateWarRule of war.getTemplateWarRuleArray()) {
                    const arr = templateWarRule.getWarEventIdArray();
                    if (arr) {
                        deleteElementFromList(arr, eventId);
                    }
                }

                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnEventList(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().WeEventNameListPanel, {
            war                     : war,
            gameConfig              : war.getGcData(),
            templateWarRuleArray    : war.getTemplateWarRuleArray(),
            fullData                : getExisted(war.getWarEventManager().getWarEventFullData()),
            selectedEventId         : this._listWarEventId.getFirstSelectedData()?.eventId ?? null,
        });
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
        await this._resetListWarEventId(this._listWarEventId.getFirstSelectedData()?.eventId ?? _prevWarEventId);
        await this._updateListWarEventDetailAndLabelNoEvent();
    }

    private _updateComponentsForLanguage(): void {
        this._labelNoEvent.setText(getText(TextType.A0821));
        this._labelTitle.setText(getText(TextType.B0461));
        this._btnDeleteRedundancy.setText(getText(TextType.B0498));
    }

    private async _resetListWarEventId(eventId: number | null): Promise<void> {
        const dataArray: DataForWarEventIdRenderer[] = [];
        for (const warEvent of (this.getOpenData()?.war.getWarEventManager().getWarEventFullData()?.getEventArray() ?? [])) {
            dataArray.push({
                eventId : getExisted(warEvent.getEventId()),
                panel   : this,
            });
        }

        const list      = this._listWarEventId;
        _prevWarEventId = eventId;
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
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const dataArray : DataForWarEventDetailRenderer[] = [];
        const eventId   = this._listWarEventId.getFirstSelectedData()?.eventId;
        if (eventId != null) {
            dataArray.push(...generateDataArrayForListWarEventDesc({
                war,
                eventId,
            }));
        }

        this._labelNoEvent.setIsVisible(!dataArray.length);
        await this._listWarEventDetail.bindData(dataArray);
    }
}

function generateDataArrayForListWarEventDesc({ war, eventId }: {
    war         : IMeWar;
    eventId     : number;
}): DataForWarEventDetailRenderer[] {
    const prefixArray   = [`E${eventId}`];
    const dataArray     : DataForWarEventDetailRenderer[] = [{
        isSeparator     : false,
        war             : war,
        descType        : DescType.EventName,
        prefixArray     : prefixArray,
        eventId         : eventId,
    }];

    const warEvent = war.getWarEventManager().getWarEventFullData()?.getEventArray().find(v => v.getEventId() === eventId);
    if (warEvent == null) {
        return dataArray;
    }

    dataArray.push(
        {
            isSeparator     : false,
            war             : war,
            descType        : DescType.EventMaxCallCountInPlayerTurn,
            prefixArray     : prefixArray,
            eventId         : eventId,
        },
        {
            isSeparator     : false,
            war             : war,
            descType        : DescType.EventMaxCallCountTotal,
            prefixArray     : prefixArray,
            eventId         : eventId,
        },
    );

    for (const rootNodeAndActionsArray of warEvent.getRootNodeAndActionsArray()) {
        dataArray.push({
            isSeparator     : true,
            war             : war,
            descType        : DescType.ConditionNode,
            prefixArray     : prefixArray,
            eventId         : eventId,
        });

        {
            const nodeIdAndFlags = rootNodeAndActionsArray.getNodeIdAndFlags();
            if (nodeIdAndFlags != null) {
                const nodeId = nodeIdAndFlags.getNodeId();
                dataArray.push(...generateNodeDataArrayForListWarEventDesc({
                    war             : war,
                    eventId         : eventId,
                    parentNodeId    : null,
                    nodeId          : nodeId,
                    prefixArray     : prefixArray.slice(1).concat(`${nodeIdAndFlags.getIsNegated() ? `! ` : ``}N${nodeId}`),
                }));
            }
        }

        {
            let actionIndex = 0;
            for (const actionId of rootNodeAndActionsArray.getActionIdArray()) {
                dataArray.push({
                    isSeparator     : false,
                    war                 : war,
                    descType            : DescType.Action,
                    prefixArray         : prefixArray.slice(1).concat(`A${actionId}`),
                    eventId             : eventId,
                    actionId            : actionId,
                    actionIndex         : actionIndex++,
                    actionBoundNodeId   : rootNodeAndActionsArray.getNodeIdAndFlags()?.getNodeId(),
                });
            }
        }
    }

    return dataArray;
}
function generateNodeDataArrayForListWarEventDesc({ war, eventId, parentNodeId, nodeId, prefixArray }: {
    war         : IMeWar;
    eventId     : number;
    parentNodeId: number | null;
    nodeId      : number;
    prefixArray : string[];
}): DataForWarEventDetailRenderer[] {
    const dataArray: DataForWarEventDetailRenderer[] = [{
        isSeparator     : false,
        war             : war,
        descType        : DescType.ConditionNode,
        prefixArray     : prefixArray,
        eventId         : eventId,
        parentNodeId    : parentNodeId ?? void 0,
        nodeId          : nodeId,
    }];

    const node = war.getWarEventManager().getWarEventFullData()?.getConditionNodeArray().find(v => v.getNodeId() === nodeId);
    if (node == null) {
        return dataArray;
    }

    for (const conditionIdAndFlags of node.getConditionIdAndFlagsArray()) {
        const conditionId = conditionIdAndFlags.getConditionId();
        dataArray.push({
            isSeparator     : false,
            war             : war,
            descType        : DescType.Condition,
            prefixArray     : prefixArray.concat([`${conditionIdAndFlags.getIsNegated() ? `! ` : ``}C${conditionId}`]),
            eventId         : eventId,
            parentNodeId    : nodeId,
            conditionId     : conditionId,
        });
    }

    for (const subNodeIdAndFlags of node.getSubNodeIdAndFlagsArray()) {
        const subNodeId = subNodeIdAndFlags.getNodeId();
        dataArray.push(...generateNodeDataArrayForListWarEventDesc({
            war             : war,
            eventId         : eventId,
            parentNodeId    : nodeId,
            nodeId          : subNodeId,
            prefixArray     : prefixArray.concat([`${subNodeIdAndFlags.getIsNegated() ? `! ` : ``}N${subNodeId}`]),
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
        if (openData == null) {
            return;
        }

        openData.panel.setAndReviseSelectedEventId(openData.eventId, false);
    }
}

interface DataForWarEventDetailRenderer extends UiListItemData {
    isSeparator         : boolean;
    war                 : IMeWar;
    descType            : DescType;
    prefixArray         : string[];
    eventId             : number;
    actionId?           : number;
    actionIndex?        : number;
    actionBoundNodeId?  : number;
    conditionId?        : number;
    parentNodeId?       : number;
    nodeId?             : number;
}
class WarEventDetailRenderer extends UiListItemRenderer<DataForWarEventDetailRenderer> {
    private readonly _imgSeparator!     : IUiImage;
    private readonly _groupMain!        : IUiContainer;
    private readonly _btnModify!        : IUiButton;
    private readonly _groupDesc!        : IUiContainer;
    private readonly _labelDesc!        : IUiLabel;
    private readonly _labelError!       : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnModify, callback: this._onTouchedBtnModify },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnModify(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openPanel(getDict().WeCommandPanel, {
            war                 : openData.war,
            descType            : openData.descType,
            eventId             : openData.eventId,
            actionId            : openData.actionId,
            actionIndex         : openData.actionIndex,
            actionBoundNodeId   : openData.actionBoundNodeId,
            conditionId         : openData.conditionId,
            parentNodeId        : openData.parentNodeId,
            nodeId              : openData.nodeId,
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _updateComponentsForLanguage(): void {
        this._updateView();
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const isSeparator = openData.isSeparator;
        this._imgSeparator.setIsVisible(isSeparator);
        this._groupMain.setIsVisible(!isSeparator);

        if (isSeparator) {
            this.setUnscaledManualHeight(1);
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
            const labelDesc     = this._labelDesc;
            const prefixArray   = openData.prefixArray;
            this._btnModify.setText(prefixArray[prefixArray.length - 1]);
            labelDesc.setTextColor(ColorValue.Yellow);
            labelDesc.setText(`${getText(TextType.A0166)}`);
            this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length, false);
        }
    }
    private _updateForEvent(data: DataForWarEventDetailRenderer): void {                      // DONE
        const fullData                  = getExisted(data.war.getWarEventManager().getWarEventFullData());
        const eventId                   = data.eventId;
        const event                     = getExisted(fullData.getEventArray()?.find(v => v.getEventId() === eventId));
        const prefixArray               = data.prefixArray;
        const errorTip                  = getErrorTipForEvent(fullData, event);
        const labelError                = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Yellow : ColorValue.Green);
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText(`${getLanguageText({ textArray: event.getEventNameArray() })}`);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length, false);
    }
    private _updateForEventCallCountInPlayerTurn(data: DataForWarEventDetailRenderer): void { // DONE
        const eventId               = data.eventId;
        const event                 = getExisted(data.war.getWarEventManager().getWarEventFullData()?.getEventArray()?.find(v => v.getEventId() === eventId));
        const prefixArray           = data.prefixArray;
        const errorTip              = getErrorTipForEventCallCountInPlayerTurn(event);
        const textForMaxCallCount   = `${getText(TextType.B0476)}: ${event.getMaxCallCountInPlayerTurn()}`;
        const textForTrigger        = `${getText(TextType.B1400)}: ${getTextForYesOrNo(event.getCanBeTriggeredRightAfterAnyEvent() ?? true)}`;
        const labelError            = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Yellow : ColorValue.Green);
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText(`${textForMaxCallCount}, ${textForTrigger}`);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length, false);
    }
    private _updateForEventCallCountTotal(data: DataForWarEventDetailRenderer): void {        // DONE
        const eventId                   = data.eventId;
        const event                     = getExisted(data.war.getWarEventManager().getWarEventFullData()?.getEventArray()?.find(v => v.getEventId() === eventId));
        const prefixArray               = data.prefixArray;
        const errorTip                  = getErrorTipForEventCallCountTotal(event);
        const labelError                = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Yellow : ColorValue.Green);
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText(`${getText(TextType.B0477)}: ${event.getMaxCallCountTotal()}`);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length, false);
    }
    private _updateForConditionNode(data: DataForWarEventDetailRenderer): void {              // DONE
        const fullData                  = getExisted(data.war.getWarEventManager().getWarEventFullData());
        const nodeId                    = data.nodeId;
        const node                      = getExisted(fullData.getConditionNodeArray()?.find(v => v.getNodeId() === nodeId));
        const prefixArray               = data.prefixArray;
        const errorTip                  = getErrorTipForConditionNode(fullData, node);
        const labelError                = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Yellow : ColorValue.Green);
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);

        const desc                      = getWarEventConditionNodeDesc(node.getIsNeedAnd(), node.getIsNeedFalse());
        this._labelDesc.setText((_isShowDetail
            ? desc
            : (getLanguageText({ textArray: node.getNodeNameArray() }) ?? desc)
        ) ?? UndefinedError);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length, false);
    }
    private _updateForCondition(data: DataForWarEventDetailRenderer): void {                  // DONE
        const war                       = data.war;
        const fullData                  = getExisted(data.war.getWarEventManager().getWarEventFullData());
        const conditionId               = data.conditionId;
        const condition                 = getExisted(fullData.getConditionArray()?.find(v => v.getWecCommonData()?.getConditionId() === conditionId));
        const prefixArray               = data.prefixArray;
        const errorTip                  = getErrorTipForCondition(fullData, condition, war);
        const labelError                = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Yellow : ColorValue.Green);
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText((_isShowDetail
            ? getDetailedDescForCondition(condition, war.getGcData())
            : (
                getLanguageText({ textArray: condition.getWecCommonData()?.getConditionNameArray() })        ??
                getBriefDescForCondition(condition, war.getGcData())
            )
        ) ?? UndefinedError);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length, false);
    }
    private _updateForAction(data: DataForWarEventDetailRenderer): void {                     // DONE
        const war                       = data.war;
        const fullData                  = getExisted(war.getWarEventManager().getWarEventFullData());
        const actionId                  = data.actionId;
        const action                    = getExisted(fullData.getActionArray()?.find(v => v.getWeaCommonData()?.getActionId() === actionId));
        const prefixArray               = data.prefixArray;
        const errorTip                  = getErrorTipForAction(fullData, action, war);
        const labelError                = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Yellow : ColorValue.Green);
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText((_isShowDetail
            ? getDetailDescForAction(action, war.getGcData())
            : (
                getLanguageText({ textArray: action.getWeaCommonData()?.getActionNameArray() })      ??
                getBriefDescForAction(action, war.getGcData())
            )
        ) ?? UndefinedError);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length, false);
    }
    private _updatePositionForBtnModifyAndGroupDesc(prefixArrayLength: number, isSeparator: boolean): void {
        const placeholderWidth  = (prefixArrayLength - 1) * 16;
        const btnModify         = this._btnModify;
        btnModify.setX(placeholderWidth);

        const groupDesc     = this._groupDesc;
        groupDesc.setX(placeholderWidth + btnModify.getScaledWidth() + 4);
        groupDesc.setUnscaledManualWidth(690 - groupDesc.getX());

        const labelError    = this._labelError;
        labelError.setUnscaledManualWidth(groupDesc.getScaledWidth());

        const labelDesc     = this._labelDesc;
        labelDesc.setUnscaledManualWidth(labelError.getScaledWidth());
        labelDesc.setY(labelError.getY() + labelError.getScaledHeight() + 2);

        // btnModify.width         = 60 + placeholderWidth;
        // this._groupDesc.left    = btnModify.width + 4;

        this._imgSeparator.setIsVisible(isSeparator);
        this._groupMain.setIsVisible(!isSeparator);
        this.setUnscaledManualHeight(isSeparator
            ? 1
            : Math.max(30, labelDesc.getY() + labelDesc.getScaledHeight())
        );
    }
}
