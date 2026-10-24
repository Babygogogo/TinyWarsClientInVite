import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiListItemRenderer from "../../ui/interfaces/IUiListItemRenderer.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as WarEventsActionsUtilsCommon from "../../warEvents/actions/utils/Common.ts";
import * as WarEventsConditionNodesUtils from "../../warEvents/conditionNodes/Utils.ts";
import * as WarEventsConditionsUtilsCommon from "../../warEvents/conditions/utils/Common.ts";
import * as WarEventsConstants from "../../warEvents/Constants.ts";
import * as WarEventsEventsUtils from "../../warEvents/events/Utils.ts";
import * as WarEventsFullDatasUtils from "../../warEvents/fullDatas/Utils.ts";

type IMeWar                 = MapEditorInterfaceIMeWar.IMeWar;

let _isShowDetail           = false;
let _prevWarEventId         : number | null = null;

export interface OpenData {
    war: IMeWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnShowDetail!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnShowBrief!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteRedundancy!  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAddEvent!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteEvent!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnEventList!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelp!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _listWarEventId!       : UiInterfacesIUiScrollList.IUiScrollList<DataForWarEventIdRenderer>;
    private readonly _listWarEventDetail!   : UiInterfacesIUiScrollList.IUiScrollList<DataForWarEventDetailRenderer>;
    private readonly _labelNoEvent!         : UiInterfacesIUiLabel.IUiLabel;

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
            { type: NotificationsTypeId.TypeId.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged,    callback: this._onNotifyMeWarEventFullDataChanged },
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
        const index             = HelpersMisc.getExisted(listWarEventId.getRevisedFirstIndex(v => v?.eventId === newEventId));
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
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0188),
            callback: () => {
                const result = WarEventsFullDatasUtils.checkAndDeleteUnusedComponents(HelpersMisc.getExisted(war.getWarEventManager().getWarEventFullData()));
                FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0063, result.deletedNodesCount, result.deletedConditionsCount, result.deletedActionsCount));
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnAddEvent(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const fullData  = HelpersMisc.getExisted(war.getWarEventManager().getWarEventFullData());
        const eventId   = WarEventsEventsUtils.addEvent(fullData);
        if (eventId != null) {
            const subNodeId = WarEventsConditionNodesUtils.createAndAddRootNodeInEvent({
                fullData    : fullData,
                eventId     : eventId,
                isNeedAnd   : true,
                isNeedFalse : null,
            });
            if (subNodeId != null) {
                WarEventsConditionsUtilsCommon.addDefaultCondition(fullData, subNodeId);
                WarEventsActionsUtilsCommon.addDefaultAction({
                    fullData    : fullData,
                    eventId     : eventId,
                    nodeId      : subNodeId,
                    actionIndex : null,
                });
            }

            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
        }
    }

    private _onTouchedBtnDeleteEvent(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const eventId = this._listWarEventId.getFirstSelectedData()?.eventId;
        if (eventId == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle   : () => `${LangUtils.getText(LangConstants.TextType.B0479)} E${eventId}`,
            getContent : () => LangUtils.getText(LangConstants.TextType.A0935),
            callback: () => {
                const eventArray = HelpersMisc.getExisted(war.getWarEventManager().getWarEventFullData()?.getEventArray());
                HelpersCollection.deleteElementFromList(eventArray, eventArray.find(v => v.getEventId() === eventId));

                for (const templateWarRule of war.getTemplateWarRuleArray()) {
                    const arr = templateWarRule.getWarEventIdArray();
                    if (arr) {
                        HelpersCollection.deleteElementFromList(arr, eventId);
                    }
                }

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnEventList(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeEventNameListPanel, {
            war                     : war,
            gameConfig              : war.getGcData(),
            templateWarRuleArray    : war.getTemplateWarRuleArray(),
            fullData                : HelpersMisc.getExisted(war.getWarEventManager().getWarEventFullData()),
            selectedEventId         : this._listWarEventId.getFirstSelectedData()?.eventId ?? null,
        });
    }

    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0793),
        });
    }

    private async _onTouchedBtnShowDetail(): Promise<void> {
        _isShowDetail = true;
        this._updateBtnShowDetail();
        this._updateBtnShowBrief();
        await this._updateListWarEventDetailAndLabelNoEvent();

        FloatText2.showLang(LangConstants.TextType.A0845);
    }
    private async _onTouchedBtnIsShowBrief(): Promise<void> {
        _isShowDetail = false;
        this._updateBtnShowDetail();
        this._updateBtnShowBrief();
        await this._updateListWarEventDetailAndLabelNoEvent();

        FloatText2.showLang(LangConstants.TextType.A0844);
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
        this._labelNoEvent.setText(LangUtils.getText(LangConstants.TextType.A0821));
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0461));
        this._btnDeleteRedundancy.setText(LangUtils.getText(LangConstants.TextType.B0498));
    }

    private async _resetListWarEventId(eventId: number | null): Promise<void> {
        const dataArray: DataForWarEventIdRenderer[] = [];
        for (const warEvent of (this.getOpenData()?.war.getWarEventManager().getWarEventFullData()?.getEventArray() ?? [])) {
            dataArray.push({
                eventId : HelpersMisc.getExisted(warEvent.getEventId()),
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
        descType        : WarEventsConstants.DescType.EventName,
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
            descType        : WarEventsConstants.DescType.EventMaxCallCountInPlayerTurn,
            prefixArray     : prefixArray,
            eventId         : eventId,
        },
        {
            isSeparator     : false,
            war             : war,
            descType        : WarEventsConstants.DescType.EventMaxCallCountTotal,
            prefixArray     : prefixArray,
            eventId         : eventId,
        },
    );

    for (const rootNodeAndActionsArray of warEvent.getRootNodeAndActionsArray()) {
        dataArray.push({
            isSeparator     : true,
            war             : war,
            descType        : WarEventsConstants.DescType.ConditionNode,
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
                    descType            : WarEventsConstants.DescType.Action,
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
        descType        : WarEventsConstants.DescType.ConditionNode,
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
            descType        : WarEventsConstants.DescType.Condition,
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

interface DataForWarEventIdRenderer extends UiTypesUiListItemData.UiListItemData {
    eventId : number;
    panel   : Panel;
}
class WarEventIdRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForWarEventIdRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForWarEventIdRenderer>
{
    private readonly _labelId! : UiInterfacesIUiLabel.IUiLabel;

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

interface DataForWarEventDetailRenderer extends UiTypesUiListItemData.UiListItemData {
    isSeparator         : boolean;
    war                 : IMeWar;
    descType            : WarEventsConstants.DescType;
    prefixArray         : string[];
    eventId             : number;
    actionId?           : number;
    actionIndex?        : number;
    actionBoundNodeId?  : number;
    conditionId?        : number;
    parentNodeId?       : number;
    nodeId?             : number;
}
class WarEventDetailRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForWarEventDetailRenderer> {
    private readonly _imgSeparator!     : UiInterfacesIUiImage.IUiImage;
    private readonly _groupMain!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnModify!        : UiInterfacesIUiButton.IUiButton;
    private readonly _groupDesc!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelDesc!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!       : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnModify, callback: this._onTouchedBtnModify },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnModify(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeCommandPanel, {
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
        if (descType === WarEventsConstants.DescType.EventName) {
            this._updateForEvent(openData);
        } else if (descType === WarEventsConstants.DescType.EventMaxCallCountInPlayerTurn) {
            this._updateForEventCallCountInPlayerTurn(openData);
        } else if (descType === WarEventsConstants.DescType.EventMaxCallCountTotal) {
            this._updateForEventCallCountTotal(openData);
        } else if (descType === WarEventsConstants.DescType.ConditionNode) {
            this._updateForConditionNode(openData);
        } else if (descType === WarEventsConstants.DescType.Condition) {
            this._updateForCondition(openData);
        } else if (descType === WarEventsConstants.DescType.Action) {
            this._updateForAction(openData);
        } else {
            const labelDesc     = this._labelDesc;
            const prefixArray   = openData.prefixArray;
            this._btnModify.setText(prefixArray[prefixArray.length - 1]);
            labelDesc.setTextColor(GraphicsConstants.ColorValue.Yellow);
            labelDesc.setText(`${LangUtils.getText(LangConstants.TextType.A0166)}`);
            this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length, false);
        }
    }
    private _updateForEvent(data: DataForWarEventDetailRenderer): void {                      // DONE
        const fullData                  = HelpersMisc.getExisted(data.war.getWarEventManager().getWarEventFullData());
        const eventId                   = data.eventId;
        const event                     = HelpersMisc.getExisted(fullData.getEventArray()?.find(v => v.getEventId() === eventId));
        const prefixArray               = data.prefixArray;
        const errorTip                  = WarEventsEventsUtils.getErrorTipForEvent(fullData, event);
        const labelError                = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Yellow : GraphicsConstants.ColorValue.Green);
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText(`${LangUtils.getLanguageText({ textArray: event.getEventNameArray() })}`);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length, false);
    }
    private _updateForEventCallCountInPlayerTurn(data: DataForWarEventDetailRenderer): void { // DONE
        const eventId               = data.eventId;
        const event                 = HelpersMisc.getExisted(data.war.getWarEventManager().getWarEventFullData()?.getEventArray()?.find(v => v.getEventId() === eventId));
        const prefixArray           = data.prefixArray;
        const errorTip              = WarEventsEventsUtils.getErrorTipForEventCallCountInPlayerTurn(event);
        const textForMaxCallCount   = `${LangUtils.getText(LangConstants.TextType.B0476)}: ${event.getMaxCallCountInPlayerTurn()}`;
        const textForTrigger        = `${LangUtils.getText(LangConstants.TextType.B1400)}: ${LangUtils.getTextForYesOrNo(event.getCanBeTriggeredRightAfterAnyEvent() ?? true)}`;
        const labelError            = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Yellow : GraphicsConstants.ColorValue.Green);
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText(`${textForMaxCallCount}, ${textForTrigger}`);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length, false);
    }
    private _updateForEventCallCountTotal(data: DataForWarEventDetailRenderer): void {        // DONE
        const eventId                   = data.eventId;
        const event                     = HelpersMisc.getExisted(data.war.getWarEventManager().getWarEventFullData()?.getEventArray()?.find(v => v.getEventId() === eventId));
        const prefixArray               = data.prefixArray;
        const errorTip                  = WarEventsEventsUtils.getErrorTipForEventCallCountTotal(event);
        const labelError                = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Yellow : GraphicsConstants.ColorValue.Green);
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText(`${LangUtils.getText(LangConstants.TextType.B0477)}: ${event.getMaxCallCountTotal()}`);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length, false);
    }
    private _updateForConditionNode(data: DataForWarEventDetailRenderer): void {              // DONE
        const fullData                  = HelpersMisc.getExisted(data.war.getWarEventManager().getWarEventFullData());
        const nodeId                    = data.nodeId;
        const node                      = HelpersMisc.getExisted(fullData.getConditionNodeArray()?.find(v => v.getNodeId() === nodeId));
        const prefixArray               = data.prefixArray;
        const errorTip                  = WarEventsConditionNodesUtils.getErrorTipForConditionNode(fullData, node);
        const labelError                = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Yellow : GraphicsConstants.ColorValue.Green);
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);

        const desc                      = LangUtils.getWarEventConditionNodeDesc(node.getIsNeedAnd(), node.getIsNeedFalse());
        this._labelDesc.setText((_isShowDetail
            ? desc
            : (LangUtils.getLanguageText({ textArray: node.getNodeNameArray() }) ?? desc)
        ) ?? LangConstants.UndefinedError);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length, false);
    }
    private _updateForCondition(data: DataForWarEventDetailRenderer): void {                  // DONE
        const war                       = data.war;
        const fullData                  = HelpersMisc.getExisted(data.war.getWarEventManager().getWarEventFullData());
        const conditionId               = data.conditionId;
        const condition                 = HelpersMisc.getExisted(fullData.getConditionArray()?.find(v => v.getWecCommonData()?.getConditionId() === conditionId));
        const prefixArray               = data.prefixArray;
        const errorTip                  = WarEventsConditionsUtilsCommon.getErrorTipForCondition(fullData, condition, war);
        const labelError                = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Yellow : GraphicsConstants.ColorValue.Green);
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText((_isShowDetail
            ? WarEventsConditionsUtilsCommon.getDetailedDescForCondition(condition, war.getGcData())
            : (
                LangUtils.getLanguageText({ textArray: condition.getWecCommonData()?.getConditionNameArray() })        ??
                WarEventsConditionsUtilsCommon.getBriefDescForCondition(condition, war.getGcData())
            )
        ) ?? LangConstants.UndefinedError);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length, false);
    }
    private _updateForAction(data: DataForWarEventDetailRenderer): void {                     // DONE
        const war                       = data.war;
        const fullData                  = HelpersMisc.getExisted(war.getWarEventManager().getWarEventFullData());
        const actionId                  = data.actionId;
        const action                    = HelpersMisc.getExisted(fullData.getActionArray()?.find(v => v.getWeaCommonData()?.getActionId() === actionId));
        const prefixArray               = data.prefixArray;
        const errorTip                  = WarEventsActionsUtilsCommon.getErrorTipForAction(fullData, action, war);
        const labelError                = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Yellow : GraphicsConstants.ColorValue.Green);
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText((_isShowDetail
            ? WarEventsActionsUtilsCommon.getDetailDescForAction(action, war.getGcData())
            : (
                LangUtils.getLanguageText({ textArray: action.getWeaCommonData()?.getActionNameArray() })      ??
                WarEventsActionsUtilsCommon.getBriefDescForAction(action, war.getGcData())
            )
        ) ?? LangConstants.UndefinedError);
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
