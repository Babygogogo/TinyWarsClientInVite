import {
    WarEvents_Actions_Utils_Common,
    WarEvents_Conditions_Utils_Common,
    WarEvents_Events_Utils,
    WarEvents_FullDatas_Utils,
    Graphics_Constants,
    WarEvents_ConditionNodes_Utils,
    Helpers_Collection,
    WarEvents_Constants,
    Notifications_Dispatcher,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    GamePanels_Manager,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

let _isShowDetail           = false;
let _prevWarEventId         : number | null = null;

export interface OpenData {
    war: MapEditor_Interface_IMeWar.IMeWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnShowDetail!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnShowBrief!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteRedundancy!  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAddEvent!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteEvent!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnEventList!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelp!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _listWarEventId!       : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForWarEventIdRenderer>;
    private readonly _listWarEventDetail!   : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForWarEventDetailRenderer>;
    private readonly _labelNoEvent!         : Ui_Interfaces_IUiLabel.IUiLabel;

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
            { type: Notifications_TypeId.TypeId.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.WarEventFullDataChanged,    callback: this._onNotifyMeWarEventFullDataChanged },
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
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0188),
            callback: () => {
                const result = WarEvents_FullDatas_Utils.checkAndDeleteUnusedComponents(Helpers_Misc.getExisted(war.getWarEventManager().getWarEventFullData()));
                FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0063, result.deletedNodesCount, result.deletedConditionsCount, result.deletedActionsCount));
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnAddEvent(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const fullData  = Helpers_Misc.getExisted(war.getWarEventManager().getWarEventFullData());
        const eventId   = WarEvents_Events_Utils.addEvent(fullData);
        if (eventId != null) {
            const subNodeId = WarEvents_ConditionNodes_Utils.createAndAddRootNodeInEvent({
                fullData    : fullData,
                eventId     : eventId,
                isNeedAnd   : true,
                isNeedFalse : null,
            });
            if (subNodeId != null) {
                WarEvents_Conditions_Utils_Common.addDefaultCondition(fullData, subNodeId);
                WarEvents_Actions_Utils_Common.addDefaultAction({
                    fullData    : fullData,
                    eventId     : eventId,
                    nodeId      : subNodeId,
                    actionIndex : null,
                });
            }

            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
        }
    }

    private _onTouchedBtnDeleteEvent(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const eventId = this._listWarEventId.getFirstSelectedData()?.eventId;
        if (eventId == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => `${Lang_Utils.getText(Lang_Constants.TextType.B0479)} E${eventId}`,
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0935),
            callback: () => {
                const eventArray = Helpers_Misc.getExisted(war.getWarEventManager().getWarEventFullData()?.getEventArray());
                Helpers_Collection.deleteElementFromList(eventArray, eventArray.find(v => v.getEventId() === eventId));

                for (const templateWarRule of war.getTemplateWarRuleArray()) {
                    const arr = templateWarRule.getWarEventIdArray();
                    if (arr) {
                        Helpers_Collection.deleteElementFromList(arr, eventId);
                    }
                }

                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            },
        });
    }

    private _onTouchedBtnEventList(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeEventNameListPanel, {
            war                     : war,
            gameConfig              : war.getGcData(),
            templateWarRuleArray    : war.getTemplateWarRuleArray(),
            fullData                : Helpers_Misc.getExisted(war.getWarEventManager().getWarEventFullData()),
            selectedEventId         : this._listWarEventId.getFirstSelectedData()?.eventId ?? null,
        });
    }

    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0793),
        });
    }

    private async _onTouchedBtnShowDetail(): Promise<void> {
        _isShowDetail = true;
        this._updateBtnShowDetail();
        this._updateBtnShowBrief();
        await this._updateListWarEventDetailAndLabelNoEvent();

        FloatText.showLang(Lang_Constants.TextType.A0845);
    }
    private async _onTouchedBtnIsShowBrief(): Promise<void> {
        _isShowDetail = false;
        this._updateBtnShowDetail();
        this._updateBtnShowBrief();
        await this._updateListWarEventDetailAndLabelNoEvent();

        FloatText.showLang(Lang_Constants.TextType.A0844);
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
        this._labelNoEvent.setLangText(Lang_Constants.TextType.A0821);
        this._labelTitle.setLangText(Lang_Constants.TextType.B0461);
        this._btnDeleteRedundancy.setLangText(Lang_Constants.TextType.B0498);
    }

    private async _resetListWarEventId(eventId: number | null): Promise<void> {
        const dataArray: DataForWarEventIdRenderer[] = [];
        for (const warEvent of (this.getOpenData()?.war.getWarEventManager().getWarEventFullData()?.getEventArray() ?? [])) {
            dataArray.push({
                eventId : warEvent.getEventId(),
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
    war         : MapEditor_Interface_IMeWar.IMeWar;
    eventId     : number;
}): DataForWarEventDetailRenderer[] {
    const prefixArray   = [`E${eventId}`];
    const dataArray     : DataForWarEventDetailRenderer[] = [{
        isSeparator     : false,
        war             : war,
        descType        : WarEvents_Constants.DescType.EventName,
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
            descType        : WarEvents_Constants.DescType.EventMaxCallCountInPlayerTurn,
            prefixArray     : prefixArray,
            eventId         : eventId,
        },
        {
            isSeparator     : false,
            war             : war,
            descType        : WarEvents_Constants.DescType.EventMaxCallCountTotal,
            prefixArray     : prefixArray,
            eventId         : eventId,
        },
    );

    for (const rootNodeAndActionsArray of warEvent.getRootNodeAndActionsArray()) {
        dataArray.push({
            isSeparator     : true,
            war             : war,
            descType        : WarEvents_Constants.DescType.ConditionNode,
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
                    descType            : WarEvents_Constants.DescType.Action,
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
    war         : MapEditor_Interface_IMeWar.IMeWar;
    eventId     : number;
    parentNodeId: number | null;
    nodeId      : number;
    prefixArray : string[];
}): DataForWarEventDetailRenderer[] {
    const dataArray: DataForWarEventDetailRenderer[] = [{
        isSeparator     : false,
        war             : war,
        descType        : WarEvents_Constants.DescType.ConditionNode,
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
            descType        : WarEvents_Constants.DescType.Condition,
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

interface DataForWarEventIdRenderer extends Ui_Types_UiListItemData.UiListItemData {
    eventId : number;
    panel   : Panel;
}
class WarEventIdRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForWarEventIdRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForWarEventIdRenderer>
{
    private readonly _labelId! : Ui_Interfaces_IUiLabel.IUiLabel;

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

interface DataForWarEventDetailRenderer extends Ui_Types_UiListItemData.UiListItemData {
    isSeparator         : boolean;
    war                 : MapEditor_Interface_IMeWar.IMeWar;
    descType            : WarEvents_Constants.DescType;
    prefixArray         : string[];
    eventId             : number;
    actionId?           : number;
    actionIndex?        : number;
    actionBoundNodeId?  : number;
    conditionId?        : number;
    parentNodeId?       : number;
    nodeId?             : number;
}
class WarEventDetailRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForWarEventDetailRenderer> {
    private readonly _imgSeparator!     : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _groupMain!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnModify!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _groupDesc!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelDesc!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelError!       : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnModify, callback: this._onTouchedBtnModify },
        ]);
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnModify(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeCommandPanel, {
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
        if (descType === WarEvents_Constants.DescType.EventName) {
            this._updateForEvent(openData);
        } else if (descType === WarEvents_Constants.DescType.EventMaxCallCountInPlayerTurn) {
            this._updateForEventCallCountInPlayerTurn(openData);
        } else if (descType === WarEvents_Constants.DescType.EventMaxCallCountTotal) {
            this._updateForEventCallCountTotal(openData);
        } else if (descType === WarEvents_Constants.DescType.ConditionNode) {
            this._updateForConditionNode(openData);
        } else if (descType === WarEvents_Constants.DescType.Condition) {
            this._updateForCondition(openData);
        } else if (descType === WarEvents_Constants.DescType.Action) {
            this._updateForAction(openData);
        } else {
            const labelDesc     = this._labelDesc;
            const prefixArray   = openData.prefixArray;
            this._btnModify.setText(prefixArray[prefixArray.length - 1]);
            labelDesc.setTextColor(Graphics_Constants.ColorValue.Yellow);
            labelDesc.setLangText(Lang_Constants.TextType.A0166);
            this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length, false);
        }
    }
    private _updateForEvent(data: DataForWarEventDetailRenderer): void {                      // DONE
        const fullData                  = Helpers_Misc.getExisted(data.war.getWarEventManager().getWarEventFullData());
        const eventId                   = data.eventId;
        const event                     = Helpers_Misc.getExisted(fullData.getEventArray()?.find(v => v.getEventId() === eventId));
        const prefixArray               = data.prefixArray;
        const errorTip                  = WarEvents_Events_Utils.getErrorTipForEvent(fullData, event);
        const labelError                = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Yellow : Graphics_Constants.ColorValue.Green);
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText(`${Lang_Utils.getLanguageText({ textArray: event.getEventNameArray() })}`);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length, false);
    }
    private _updateForEventCallCountInPlayerTurn(data: DataForWarEventDetailRenderer): void { // DONE
        const eventId               = data.eventId;
        const event                 = Helpers_Misc.getExisted(data.war.getWarEventManager().getWarEventFullData()?.getEventArray()?.find(v => v.getEventId() === eventId));
        const prefixArray           = data.prefixArray;
        const errorTip              = WarEvents_Events_Utils.getErrorTipForEventCallCountInPlayerTurn(event);
        const textForMaxCallCount   = `${Lang_Utils.getText(Lang_Constants.TextType.B0476)}: ${event.getMaxCallCountInPlayerTurn()}`;
        const textForTrigger        = `${Lang_Utils.getText(Lang_Constants.TextType.B1400)}: ${Lang_Utils.getTextForYesOrNo(event.getCanBeTriggeredRightAfterAnyEvent())}`;
        const labelError            = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Yellow : Graphics_Constants.ColorValue.Green);
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText(`${textForMaxCallCount}, ${textForTrigger}`);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length, false);
    }
    private _updateForEventCallCountTotal(data: DataForWarEventDetailRenderer): void {        // DONE
        const eventId                   = data.eventId;
        const event                     = Helpers_Misc.getExisted(data.war.getWarEventManager().getWarEventFullData()?.getEventArray()?.find(v => v.getEventId() === eventId));
        const prefixArray               = data.prefixArray;
        const errorTip                  = WarEvents_Events_Utils.getErrorTipForEventCallCountTotal(event);
        const labelError                = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Yellow : Graphics_Constants.ColorValue.Green);
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0477)}: ${event.getMaxCallCountTotal()}`);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length, false);
    }
    private _updateForConditionNode(data: DataForWarEventDetailRenderer): void {              // DONE
        const fullData                  = Helpers_Misc.getExisted(data.war.getWarEventManager().getWarEventFullData());
        const nodeId                    = data.nodeId;
        const node                      = Helpers_Misc.getExisted(fullData.getConditionNodeArray()?.find(v => v.getNodeId() === nodeId));
        const prefixArray               = data.prefixArray;
        const errorTip                  = WarEvents_ConditionNodes_Utils.getErrorTipForConditionNode(fullData, node);
        const labelError                = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Yellow : Graphics_Constants.ColorValue.Green);
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);

        const desc                      = Lang_Utils.getWarEventConditionNodeDesc(node.getIsNeedAnd(), node.getIsNeedFalse());
        this._labelDesc.setText((_isShowDetail
            ? desc
            : (Lang_Utils.getLanguageText({ textArray: node.getNodeNameArray() }) ?? desc)
        ));
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length, false);
    }
    private _updateForCondition(data: DataForWarEventDetailRenderer): void {                  // DONE
        const war                       = data.war;
        const fullData                  = Helpers_Misc.getExisted(data.war.getWarEventManager().getWarEventFullData());
        const conditionId               = data.conditionId;
        const condition                 = Helpers_Misc.getExisted(fullData.getConditionArray()?.find(v => v.getWecCommonData()?.getConditionId() === conditionId));
        const prefixArray               = data.prefixArray;
        const errorTip                  = WarEvents_Conditions_Utils_Common.getErrorTipForCondition(fullData, condition, war);
        const labelError                = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Yellow : Graphics_Constants.ColorValue.Green);
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText((_isShowDetail
            ? WarEvents_Conditions_Utils_Common.getDetailedDescForCondition(condition, war.getGcData())
            : (
                Lang_Utils.getLanguageText({ textArray: condition.getWecCommonData()?.getConditionNameArray() })        ??
                WarEvents_Conditions_Utils_Common.getBriefDescForCondition(condition, war.getGcData())
            )
        ) ?? Lang_Constants.UndefinedError);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length, false);
    }
    private _updateForAction(data: DataForWarEventDetailRenderer): void {                     // DONE
        const war                       = data.war;
        const fullData                  = Helpers_Misc.getExisted(war.getWarEventManager().getWarEventFullData());
        const actionId                  = data.actionId;
        const action                    = Helpers_Misc.getExisted(fullData.getActionArray()?.find(v => v.getWeaCommonData()?.getActionId() === actionId));
        const prefixArray               = data.prefixArray;
        const errorTip                  = WarEvents_Actions_Utils_Common.getErrorTipForAction(fullData, action, war);
        const labelError                = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Yellow : Graphics_Constants.ColorValue.Green);
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText((_isShowDetail
            ? WarEvents_Actions_Utils_Common.getDetailDescForAction(action, war.getGcData())
            : (
                Lang_Utils.getLanguageText({ textArray: action.getWeaCommonData()?.getActionNameArray() })      ??
                WarEvents_Actions_Utils_Common.getBriefDescForAction(action, war.getGcData())
            )
        ) ?? Lang_Constants.UndefinedError);
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
