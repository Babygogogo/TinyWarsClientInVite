import * as FloatText2 from "../../FloatText.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoWarEventConditionIdAndFlags from "../../proto/schema/CommonProto/WarEvent/ConditionIdAndFlags.ts";
import type * as ProtoSchemaCommonProtoWarEventNodeIdAndFlags from "../../proto/schema/CommonProto/WarEvent/NodeIdAndFlags.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
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
import * as WarEventsConditionsUtilsCommon from "../../warEvents/conditions/utils/Common.ts";
import * as WarEventsConstants from "../../warEvents/Constants.ts";

type WarEventFullData       = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;

let _isShowDetail           = false;

export interface OpenData {
    warEventFullData    : WarEventFullData;
    warEventIdArray     : number[];
    gameConfig          : GameConfigGcData.GcData;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnShowDetail!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnShowBrief!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelp!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _listWarEventId!       : UiInterfacesIUiScrollList.IUiScrollList<DataForWarEventIdRenderer>;
    private readonly _listWarEventDetail!   : UiInterfacesIUiScrollList.IUiScrollList<DataForWarEventDetailRenderer>;
    private readonly _labelNoEvent!         : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
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
        await this._resetListWarEventId(this._listWarEventId.getFirstSelectedData()?.eventId ?? null);
        await this._updateListWarEventDetailAndLabelNoEvent();
    }

    private _updateComponentsForLanguage(): void {
        this._labelNoEvent.setText(LangUtils.getText(LangConstants.TextType.A0821));
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0461));
        this._btnClose.setText(LangUtils.getText(LangConstants.TextType.B0146));
    }

    private async _resetListWarEventId(eventId: number | null): Promise<void> {
        const dataArray: DataForWarEventIdRenderer[] = [];
        for (const warEvent of (this.getOpenData()?.warEventFullData.getEventArray() ?? [])) {
            dataArray.push({
                eventId : HelpersMisc.getExisted(warEvent.getEventId()),
                panel   : this,
            });
        }

        const list = this._listWarEventId;
        await list.bindData(dataArray.sort((v1, v2) => v1.eventId - v2.eventId));
        list.setSelectedItemIndex(list.getRevisedFirstIndex(v => v?.eventId === eventId) ?? (dataArray.length ? 0 : -1));
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
    gameConfig  : GameConfigGcData.GcData;
    eventId     : number;
}): DataForWarEventDetailRenderer[] {
    const prefixArray   = [`E${eventId}`];
    const dataArray     : DataForWarEventDetailRenderer[] = [{
        fullData        : fullData,
        descType        : WarEventsConstants.DescType.EventName,
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
            descType        : WarEventsConstants.DescType.EventMaxCallCountInPlayerTurn,
            gameConfig      : gameConfig,
            prefixArray     : prefixArray,
            eventId         : eventId,
        },
        {
            fullData        : fullData,
            descType        : WarEventsConstants.DescType.EventMaxCallCountTotal,
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
                descType        : WarEventsConstants.DescType.Action,
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
    gameConfig      : GameConfigGcData.GcData;
    parentNodeId    : ProtoSchemaCommonProtoWarEventNodeIdAndFlags.NodeIdAndFlags | null;
    nodeIdAndFlags  : ProtoSchemaCommonProtoWarEventNodeIdAndFlags.NodeIdAndFlags;
    prefixArray     : string[];
}): DataForWarEventDetailRenderer[] {
    const dataArray: DataForWarEventDetailRenderer[] = [{
        fullData                : fullData,
        descType                : WarEventsConstants.DescType.ConditionNode,
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
            descType                : WarEventsConstants.DescType.Condition,
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
        openData?.panel.setAndReviseSelectedEventId(openData.eventId, false);
    }
}

interface DataForWarEventDetailRenderer extends UiTypesUiListItemData.UiListItemData {
    fullData                : WarEventFullData;
    gameConfig              : GameConfigGcData.GcData;
    descType                : WarEventsConstants.DescType;
    prefixArray             : string[];
    eventId                 : number;
    actionId?               : number;
    actionIndex?            : number;
    conditionIdAndFlags?    : ProtoSchemaCommonProtoWarEventConditionIdAndFlags.ConditionIdAndFlags;
    parentNodeIdAndFlags?   : ProtoSchemaCommonProtoWarEventNodeIdAndFlags.NodeIdAndFlags;
    nodeId?                 : ProtoSchemaCommonProtoWarEventNodeIdAndFlags.NodeIdAndFlags;
}
class WarEventDetailRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForWarEventDetailRenderer> {
    private readonly _btnModify!        : UiInterfacesIUiButton.IUiButton;
    private readonly _groupDesc!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelDesc!        : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
            const labelDesc                 = this._labelDesc;
            const prefixArray               = openData.prefixArray;
            // const prefix        = prefixArray.join(`.`);
            this._btnModify.setText(prefixArray[prefixArray.length - 1]);
            labelDesc.setTextColor(GraphicsConstants.ColorValue.Yellow);
            labelDesc.setText(`${LangUtils.getText(LangConstants.TextType.A0166)}`);
            this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
        }
    }
    private _updateForEvent(data: DataForWarEventDetailRenderer): void {                      // DONE
        const fullData                  = data.fullData;
        const eventId                   = data.eventId;
        const event                     = HelpersMisc.getExisted(fullData.getEventArray().find(v => v.getEventId() === eventId));
        const prefixArray               = data.prefixArray;
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText(`${LangUtils.getLanguageText({ textArray: event.getEventNameArray() })}`);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
    }
    private _updateForEventCallCountInPlayerTurn(data: DataForWarEventDetailRenderer): void { // DONE
        const eventId               = data.eventId;
        const event                 = HelpersMisc.getExisted(data.fullData.getEventArray().find(v => v.getEventId() === eventId));
        const prefixArray           = data.prefixArray;
        const textForMaxCallCount   = `${LangUtils.getText(LangConstants.TextType.B0476)}: ${event.getMaxCallCountInPlayerTurn()}`;
        const textForTrigger        = `${LangUtils.getText(LangConstants.TextType.B1400)}: ${LangUtils.getTextForYesOrNo(event.getCanBeTriggeredRightAfterAnyEvent() ?? true)}`;
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText(`${textForMaxCallCount}, ${textForTrigger}`);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
    }
    private _updateForEventCallCountTotal(data: DataForWarEventDetailRenderer): void {        // DONE
        const eventId                   = data.eventId;
        const event                     = HelpersMisc.getExisted(data.fullData.getEventArray().find(v => v.getEventId() === eventId));
        const prefixArray               = data.prefixArray;
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText(`${LangUtils.getText(LangConstants.TextType.B0477)}: ${event.getMaxCallCountTotal()}`);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
    }
    private _updateForConditionNode(data: DataForWarEventDetailRenderer): void {              // DONE
        const fullData                  = data.fullData;
        const nodeId                    = data.nodeId?.getNodeId();
        const node                      = HelpersMisc.getExisted(fullData.getConditionNodeArray().find(v => v.getNodeId() === nodeId));
        const prefixArray               = data.prefixArray;
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);

        const desc                      = LangUtils.getWarEventConditionNodeDesc(node.getIsNeedAnd(), node.getIsNeedFalse());
        this._labelDesc.setText((_isShowDetail
            ? desc
            : (LangUtils.getLanguageText({ textArray: node.getNodeNameArray() }) ?? desc)
        ) ?? LangConstants.UndefinedError);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
    }
    private _updateForCondition(data: DataForWarEventDetailRenderer): void {                  // DONE
        const fullData                  = data.fullData;
        const conditionId               = HelpersMisc.getExisted(data.conditionIdAndFlags?.getConditionId());
        const condition                 = HelpersMisc.getExisted(fullData.getConditionArray().find(v => v.getWecCommonData()?.getConditionId() === conditionId));
        const prefixArray               = data.prefixArray;
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText((_isShowDetail
            ? WarEventsConditionsUtilsCommon.getDetailedDescForCondition(condition, data.gameConfig)
            : (
                LangUtils.getLanguageText({ textArray: condition.getWecCommonData()?.getConditionNameArray() })        ??
                WarEventsConditionsUtilsCommon.getBriefDescForCondition(condition, data.gameConfig)
            )
        ) ?? LangConstants.UndefinedError);
        this._updatePositionForBtnModifyAndGroupDesc(prefixArray.length);
    }
    private _updateForAction(data: DataForWarEventDetailRenderer): void {                     // DONE
        const fullData                  = data.fullData;
        const actionId                  = data.actionId;
        const action                    = HelpersMisc.getExisted(fullData.getActionArray().find(v => v.getWeaCommonData()?.getActionId() === actionId));
        const prefixArray               = data.prefixArray;
        this._btnModify.setText(prefixArray[prefixArray.length - 1]);
        this._labelDesc.setText((_isShowDetail
            ? WarEventsActionsUtilsCommon.getDetailDescForAction(action, data.gameConfig)
            : (
                LangUtils.getLanguageText({ textArray: action.getWeaCommonData()?.getActionNameArray() })      ??
                WarEventsActionsUtilsCommon.getBriefDescForAction(action, data.gameConfig)
            )
        ) ?? LangConstants.UndefinedError);
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
