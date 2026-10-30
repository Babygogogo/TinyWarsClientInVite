import {
    GamePanels_Manager,
    Notifications_Dispatcher,
    WarEvents_FullDatas_Utils,
    WarEvents_Actions_Utils_Common,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type BaseWar_Interface_IBwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";

export interface OpenData {
    war             : BaseWar_Interface_IBwWar.IBwWar;
    fullData        : WarEventFullData;
    eventId         : number;
    nodeId          : number;
    oldActionId     : number | null;
    oldActionIndex  : number | null;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listAction!       : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForActionRenderer>;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNoAction!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,       callback : this.closePanel },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listAction.setItemRendererClass(ActionRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listAction.removeAllItems();

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateComponentsForAction();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0615)} A${this.getOpenData()?.oldActionId}`);
        this._labelNoAction.setLangText(Lang_Constants.TextType.B0278);
        this._btnClose.setLangText(Lang_Constants.TextType.B0146);
    }
    private async _updateComponentsForAction(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventId           = openData.eventId;
        const nodeId            = openData.nodeId;
        const oldActionId       = openData.oldActionId;
        const oldActionIndex    = openData.oldActionIndex;
        const fullData          = openData.fullData;
        const war               = openData.war;
        const dataArray         : DataForActionRenderer[] = [];
        for (const action of openData.fullData.getActionArray()) {
            dataArray.push({
                war               : war,
                eventId           : eventId,
                nodeId            : nodeId,
                oldActionId       : oldActionId,
                oldActionIndex    : oldActionIndex,
                candidateActionId : Helpers_Misc.getExisted(action.getWeaCommonData()?.getActionId()),
                fullData          : fullData,
            });
        }

        this._labelNoAction.setIsVisible(!dataArray.length);
        await this._listAction.bindData(dataArray);
    }
}

interface DataForActionRenderer extends Ui_Types_UiListItemData.UiListItemData {
    war                 : BaseWar_Interface_IBwWar.IBwWar;
    eventId             : number;
    nodeId              : number;
    oldActionId         : number | null;
    oldActionIndex      : number | null;
    candidateActionId   : number;
    fullData            : WarEventFullData;
}
class ActionRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForActionRenderer> {
    private readonly _labelActionId!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelAction!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnCopy!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSelect!        : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnCopy,    callback : this._onTouchedBtnCopy },
            { ui : this._btnSelect,  callback : this._onTouchedBtnSelect },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
        ]);

        this._btnCopy.setIsVisible(false);
        this._updateComponentsForLanguage();
    }

    protected override _doApplyOpenData(): void {
        this._updateLabelActionId();
        this._updateLabelAction();
        this._updateBtnSelect();
    }

    private _onTouchedBtnCopy(): void {          // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (cloneAndReplaceActionInEvent({
            fullData         : openData.fullData,
            eventId          : openData.eventId,
            nodeId           : openData.nodeId,
            oldActionIndex   : openData.oldActionIndex,
            actionIdForClone : openData.candidateActionId,
        }) != null) {
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
            GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeActionReplacePanel);
        }
    }
    private _onTouchedBtnSelect(): void {        // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventId           = openData.eventId;
        const nodeId            = openData.nodeId;
        const oldActionIndex    = openData.oldActionIndex;
        const newActionId       = openData.candidateActionId;
        const actionIdArray     = Helpers_Misc.getExisted(openData.fullData.getEventArray()
            .find(v => v.getEventId() === eventId)
            ?.getRootNodeAndActionsArray()
            .find(v => v.getNodeIdAndFlags()?.getNodeId() === nodeId)
            ?.getActionIdArray());

        if (oldActionIndex == null) {
            actionIdArray.push(newActionId);
        } else {
            actionIdArray[oldActionIndex] = openData.candidateActionId;
        }

        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarEventFullDataChanged);
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeActionReplacePanel);
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().WeCommandPanel);
    }
    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnCopy.setLangText(Lang_Constants.TextType.B0487);
        this._btnSelect.setLangText(Lang_Constants.TextType.B0492);

        this._updateLabelActionId();
        this._updateLabelAction();
    }

    private _updateLabelActionId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const actionId          = openData.candidateActionId;
        const eventNameArray    = openData.fullData.getEventArray().filter(event => event.getRootNodeAndActionsArray()?.some(v => v.getActionIdArray().includes(actionId))).map(v => `E${v.getEventId()}`);
        this._labelActionId.setText(`A${actionId} (${Lang_Utils.getText(Lang_Constants.TextType.B0749)}: ${eventNameArray?.length ? eventNameArray.join(`, `) : Lang_Utils.getText(Lang_Constants.TextType.None)})`);
    }
    private _updateLabelAction(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action    = openData.fullData.getActionArray().find(v => v.getWeaCommonData()?.getActionId() === openData.candidateActionId);
        const label     = this._labelAction;
        if (action == null) {
            label.setLangText(Lang_Constants.TextType.A0168);
        } else {
            label.setText(WarEvents_Actions_Utils_Common.getBriefDescForAction(action, openData.war.getGcData()) || Lang_Constants.UndefinedError);
        }

        this.setUnscaledManualHeight(label.getY() + label.getScaledHeight() + 2);
    }
    private _updateBtnSelect(): void {
        const openData = this.getOpenData();
        this._btnSelect.setIsVisible(openData?.oldActionId !== openData?.candidateActionId);
    }
}

function cloneAndReplaceActionInEvent({ fullData, eventId, nodeId, oldActionIndex, actionIdForClone }: {
    fullData            : WarEventFullData;
    eventId             : number;
    nodeId              : number;
    oldActionIndex      : number | null;
    actionIdForClone    : number;
}): number | null {
    const eventData = WarEvents_FullDatas_Utils.getEvent(fullData, eventId);
    if (eventData == null) {
        return null;
    }

    const fullActionArray   = fullData.getActionArray();
    const srcAction         = WarEvents_FullDatas_Utils.getAction(fullData, actionIdForClone);
    if (srcAction == null) {
        return null;
    }

    const actionIdArray = eventData.getRootNodeAndActionsArray().find(v => v.getNodeIdAndFlags()?.getNodeId() === nodeId)?.getActionIdArray();
    if (actionIdArray == null) {
        return null;
    }

    const newAction = srcAction.clone();
    for (let newActionId = 1; ; ++newActionId) {
        if (!fullActionArray.some(v => v.getWeaCommonData()?.getActionId() === newActionId)) {
            Helpers_Misc.getExisted(newAction.getWeaCommonData()).setActionId(newActionId);
            fullActionArray.push(newAction);
            fullActionArray.sort((v1, v2) => Helpers_Misc.getExisted(v1.getWeaCommonData()?.getActionId()) - Helpers_Misc.getExisted(v2.getWeaCommonData()?.getActionId()));

            if (oldActionIndex != null) {
                actionIdArray[oldActionIndex] = newActionId;
            } else {
                actionIdArray.push(newActionId);
            }
            // actionIdArray.sort((v1, v2) => v1 - v2);

            return newActionId;
        }
    }
}
