import {
    Graphics_Constants,
    WarEvents_Constants,
    WarEvents_Actions_Utils_Common,
    WarEvents_Conditions_Utils_Common,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    GamePanels_Manager,
    FloatText,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import type { ConditionIdAndFlags } from "../../proto/schema/CommonProto/WarEvent/ConditionIdAndFlags.ts";
import type { NodeIdAndFlags } from "../../proto/schema/CommonProto/WarEvent/NodeIdAndFlags.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";

let _isShowDetail           = false;

export interface OpenData {
    warEventFullData    : WarEventFullData;
    warEventIdArray     : number[];
    gameConfig          : GameConfigs_GameConfig.GameConfig;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnShowDetail!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnShowBrief!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelp!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _listWarEventId!       : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForWarEventIdRenderer>;
    private readonly _listWarEventDetail!   : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForWarEventDetailRenderer>;
    private readonly _labelNoEvent!         : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnShowDetail,          callback : this._onTouchedBtnShowDetail },
            { ui : this._btnShowBrief,           callback : this._onTouchedBtnIsShowBrief },
            { ui : this._btnHelp,                callback : this._onTouchedBtnHelp },
            { ui : this._btnClose,               callback : this.closePanel },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",            callback : this._onNotifyLanguageChanged },
            { type : "WarEventFullDataChanged",    callback : this._onNotifyMeWarEventFullDataChanged },
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
        await this._resetListWarEventId(this._listWarEventId.getFirstSelectedData()?.eventId ?? null);
        await this._updateListWarEventDetailAndLabelNoEvent();
    }

    private _updateComponentsForLanguage(): void {
        this._labelNoEvent.setLangText(Lang_Constants.TextType.A0821);
        this._labelTitle.setLangText(Lang_Constants.TextType.B0461);
        this._btnClose.setLangText(Lang_Constants.TextType.B0146);
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
                fullData   : fullData,
                eventId    : eventId,
                gameConfig : gameConfig,
            }));
        }

        this._labelNoEvent.setIsVisible(!dataArray.length);
        await this._listWarEventDetail.bindData(dataArray);
    }
}

function generateDataArrayForListWarEventDesc({ fullData, gameConfig, eventId }: {
    fullData    : WarEventFullData;
    gameConfig  : GameConfigs_GameConfig.GameConfig;
    eventId     : number;
}): DataForWarEventDetailRenderer[] {
    const prefixArray   = [`E${eventId}`];
    const dataArray     : DataForWarEventDetailRenderer[] = [{
        fullData    : fullData,
        descType    : WarEvents_Constants.DescType.EventName,
        gameConfig  : gameConfig,
        prefixArray : prefixArray,
        eventId     : eventId,
    }];

    const warEvent = fullData.getEventArray()?.find(v => v.getEventId() === eventId);
    if (warEvent == null) {
        return dataArray;
    }

    dataArray.push(
        {
            fullData    : fullData,
            descType    : WarEvents_Constants.DescType.EventMaxCallCountInPlayerTurn,
            gameConfig  : gameConfig,
            prefixArray : prefixArray,
            eventId     : eventId,
        },
        {
            fullData    : fullData,
            descType    : WarEvents_Constants.DescType.EventMaxCallCountTotal,
            gameConfig  : gameConfig,
            prefixArray : prefixArray,
            eventId     : eventId,
        },
    );

    for (const rootNodeAndActionsArray of warEvent.getRootNodeAndActionsArray()) {
        {
            const nodeIdAndFlags = rootNodeAndActionsArray.getNodeIdAndFlags();
            if (nodeIdAndFlags != null) {
                dataArray.push(...generateNodeDataArrayForListWarEventDesc({
                    fullData       : fullData,
                    eventId        : eventId,
                    gameConfig     : gameConfig,
                    parentNodeId   : null,
                    nodeIdAndFlags : nodeIdAndFlags,
                    prefixArray    : prefixArray.concat(`${nodeIdAndFlags.getIsNegated() ? `! ` : ``}N${nodeIdAndFlags.getNodeId()}`),
                }));
            }
        }

        let actionIndex = 0;
        for (const actionId of rootNodeAndActionsArray.getActionIdArray()) {
            dataArray.push({
                fullData    : fullData,
                descType    : WarEvents_Constants.DescType.Action,
                gameConfig  : gameConfig,
                prefixArray : prefixArray.concat(`A${actionId}`),
                eventId     : eventId,
                actionId    : actionId,
                actionIndex : actionIndex++,
            });
        }
    }

    return dataArray;
}
function generateNodeDataArrayForListWarEventDesc({ fullData, eventId, gameConfig, parentNodeId, nodeIdAndFlags: nodeId, prefixArray }: {
    fullData        : WarEventFullData;
    eventId         : number;
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    parentNodeId    : NodeIdAndFlags | null;
    nodeIdAndFlags  : NodeIdAndFlags;
    prefixArray     : string[];
}): DataForWarEventDetailRenderer[] {
    const dataArray: DataForWarEventDetailRenderer[] = [{
        fullData             : fullData,
        descType             : WarEvents_Constants.DescType.ConditionNode,
        gameConfig           : gameConfig,
        prefixArray          : prefixArray,
        eventId              : eventId,
        parentNodeIdAndFlags : parentNodeId ?? void 0,
        nodeId               : nodeId,
    }];

    const node = fullData.getConditionNodeArray().find(v => v.getNodeId() === nodeId.getNodeId());
    if (node == null) {
        return dataArray;
    }

    for (const conditionIdAndFlags of node.getConditionIdAndFlagsArray()) {
        dataArray.push({
            fullData             : fullData,
            descType             : WarEvents_Constants.DescType.Condition,
            gameConfig           : gameConfig,
            prefixArray          : prefixArray.concat([`${conditionIdAndFlags.getIsNegated() ? `! ` : ``}C${conditionIdAndFlags.getConditionId()}`]),
            eventId              : eventId,
            parentNodeIdAndFlags : nodeId,
            conditionIdAndFlags  : conditionIdAndFlags,
        });
    }

    for (const subNodeIdAndFlags of node.getSubNodeIdAndFlagsArray()) {
        dataArray.push(...generateNodeDataArrayForListWarEventDesc({
            fullData       : fullData,
            eventId        : eventId,
            gameConfig     : gameConfig,
            parentNodeId   : nodeId,
            nodeIdAndFlags : subNodeIdAndFlags,
            prefixArray    : prefixArray.concat([`${subNodeIdAndFlags.getIsNegated() ? `! ` : ``}N${subNodeIdAndFlags.getNodeId()}`]),
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
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForWarEventIdRenderer> {
    private readonly _labelId! : Ui_Interfaces_IUiLabel.IUiLabel;

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

interface DataForWarEventDetailRenderer extends Ui_Types_UiListItemData.UiListItemData {
    fullData                : WarEventFullData;
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    descType                : WarEvents_Constants.DescType;
    prefixArray             : string[];
    eventId                 : number;
    actionId?               : number;
    actionIndex?            : number;
    conditionIdAndFlags?    : ConditionIdAndFlags;
    parentNodeIdAndFlags?   : NodeIdAndFlags;
    nodeId?                 : NodeIdAndFlags;
}
class WarEventDetailRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForWarEventDetailRenderer> {
    private readonly _btnModify!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _groupDesc!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelDesc!        : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",    callback : this._onNotifyLanguageChanged },
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
            const labelDesc                 = this._labelDesc;
            const prefixArray               = openData.prefixArray;
            // const prefix        = prefixArray.join(`.`);
            this._btnModify.setText(prefixArray[prefixArray.length - 1]);
            labelDesc.setTextColor(Graphics_Constants.ColorValue.Yellow);
            labelDesc.setLangText(Lang_Constants.TextType.A0166);
            this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
        }
    }
    private _updateForEvent(data: DataForWarEventDetailRenderer): void {                      // DONE
        const fullData                  = data.fullData;
        const eventId                   = data.eventId;
        const event                     = Helpers_Misc.getExisted(fullData.getEventArray().find(v => v.getEventId() === eventId));
        const prefixArray               = data.prefixArray;
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText(`${Lang_Utils.getLanguageText({ textArray : event.getEventNameArray() })}`);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
    }
    private _updateForEventCallCountInPlayerTurn(data: DataForWarEventDetailRenderer): void { // DONE
        const eventId               = data.eventId;
        const event                 = Helpers_Misc.getExisted(data.fullData.getEventArray().find(v => v.getEventId() === eventId));
        const prefixArray           = data.prefixArray;
        const textForMaxCallCount   = `${Lang_Utils.getText(Lang_Constants.TextType.B0476)}: ${event.getMaxCallCountInPlayerTurn()}`;
        const textForTrigger        = `${Lang_Utils.getText(Lang_Constants.TextType.B1400)}: ${Lang_Utils.getTextForYesOrNo(event.getCanBeTriggeredRightAfterAnyEvent())}`;
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText(`${textForMaxCallCount}, ${textForTrigger}`);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
    }
    private _updateForEventCallCountTotal(data: DataForWarEventDetailRenderer): void {        // DONE
        const eventId                   = data.eventId;
        const event                     = Helpers_Misc.getExisted(data.fullData.getEventArray().find(v => v.getEventId() === eventId));
        const prefixArray               = data.prefixArray;
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0477)}: ${event.getMaxCallCountTotal()}`);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
    }
    private _updateForConditionNode(data: DataForWarEventDetailRenderer): void {              // DONE
        const fullData                  = data.fullData;
        const nodeId                    = data.nodeId?.getNodeId();
        const node                      = Helpers_Misc.getExisted(fullData.getConditionNodeArray().find(v => v.getNodeId() === nodeId));
        const prefixArray               = data.prefixArray;
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);

        const desc                      = Lang_Utils.getWarEventConditionNodeDesc(node.getIsNeedAnd(), node.getIsNeedFalse());
        this._labelDesc.setText((_isShowDetail
            ? desc
            : (Lang_Utils.getLanguageText({ textArray : node.getNodeNameArray() }) ?? desc)
        ));
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
    }
    private _updateForCondition(data: DataForWarEventDetailRenderer): void {                  // DONE
        const fullData                  = data.fullData;
        const conditionId               = Helpers_Misc.getExisted(data.conditionIdAndFlags?.getConditionId());
        const condition                 = Helpers_Misc.getExisted(fullData.getConditionArray().find(v => v.getWecCommonData()?.getConditionId() === conditionId));
        const prefixArray               = data.prefixArray;
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText((_isShowDetail
            ? WarEvents_Conditions_Utils_Common.getDetailedDescForCondition(condition, data.gameConfig)
            : (
                Lang_Utils.getLanguageText({ textArray : condition.getWecCommonData()?.getConditionNameArray() })        ??
                WarEvents_Conditions_Utils_Common.getBriefDescForCondition(condition, data.gameConfig)
            )
        ) ?? Lang_Constants.UndefinedError);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
    }
    private _updateForAction(data: DataForWarEventDetailRenderer): void {                     // DONE
        const fullData                  = data.fullData;
        const actionId                  = data.actionId;
        const action                    = Helpers_Misc.getExisted(fullData.getActionArray().find(v => v.getWeaCommonData()?.getActionId() === actionId));
        const prefixArray               = data.prefixArray;
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText((_isShowDetail
            ? WarEvents_Actions_Utils_Common.getDetailDescForAction(action, data.gameConfig)
            : (
                Lang_Utils.getLanguageText({ textArray : action.getWeaCommonData()?.getActionNameArray() })      ??
                WarEvents_Actions_Utils_Common.getBriefDescForAction(action, data.gameConfig)
            )
        ) ?? Lang_Constants.UndefinedError);
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
