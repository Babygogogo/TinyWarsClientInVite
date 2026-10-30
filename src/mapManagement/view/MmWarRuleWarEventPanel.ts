import {
    Helpers_Collection,
    Notifications_Dispatcher,
    GamePanels_Dict,
    Lang_Utils,
    Helpers_Text,
    GamePanels_Manager,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import type { WarEvent } from "../../proto/schema/CommonProto/WarEvent/WarEvent.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";

export interface OpenData {
    warEventArray       : WarEvent[];
    templateWarRule     : TemplateWarRule;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAdd!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteAll!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listEvent!            : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForEventRenderer>;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNoEvent!         : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.WarEventFullDataChanged,         callback: this._onNotifyWarEventFullDataChanged },
            { type: Notifications_TypeId.TypeId.MeWarRuleWarEventIdArrayChanged, callback: this._onNotifyMeWarRuleWarEventIdArrayChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
            { ui: this._btnAdd,         callback: this._onTouchedBtnAdd },
            { ui: this._btnDeleteAll,   callback: this._onTouchedBtnDeleteAll },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listEvent.setItemRendererClass(ConditionRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listEvent.removeAllItems();

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyWarEventFullDataChanged(): void {
        this._updateView();
    }
    private _onNotifyMeWarRuleWarEventIdArrayChanged(): void {
        this._updateView();
    }
    private _onTouchedBtnAdd(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warEventArray             = openData.warEventArray;
        const templateWarRule           = openData.templateWarRule;
        const allWarEventIdSet          = new Set(warEventArray.map(v => v.getEventId()));
        const currentWarEventIdArray    = templateWarRule.getWarEventIdArray();
        for (const warEventId of currentWarEventIdArray) {
            allWarEventIdSet.delete(warEventId);
        }
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            availableNumberArray        : [...allWarEventIdSet],
            currentNumberArray          : [],
            showNumber                  : true,
            getTitleText                : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.B0461)),
            getNumberMainText           : warEventId => Helpers_Text.getTruncatedText(
                Lang_Utils.getLanguageText({
                    textArray: warEventArray.find(v => v.getEventId() === warEventId)?.getEventNameArray()
                }) ?? Lang_Constants.UndefinedError,
                15
            ),
            callbackOnConfirm           : additionalWarEventIdArray => {
                if (!currentWarEventIdArray) {
                    templateWarRule.setWarEventIdArray(additionalWarEventIdArray);
                } else {
                    for (const warEventId of additionalWarEventIdArray) {
                        if (currentWarEventIdArray.indexOf(warEventId) < 0) {
                            currentWarEventIdArray.push(warEventId);
                        }
                    }
                }
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeWarRuleWarEventIdArrayChanged);
            },
        });
    }
    private _onTouchedBtnDeleteAll(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0801),
            callback: () => {
                openData.templateWarRule.setWarEventIdArray([]);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeWarRuleWarEventIdArrayChanged);
            },
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListConditionAndLabelNoCondition();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0461)} (R${this.getOpenData()?.templateWarRule.getRuleId()})`);
        this._labelNoEvent.setLangText(Lang_Constants.TextType.B0278);
    }
    private async _updateListConditionAndLabelNoCondition(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warEventArray     = openData.warEventArray;
        const templateWarRule   = openData.templateWarRule;
        const dataArray         : DataForEventRenderer[] = [];
        for (const warEventId of templateWarRule.getWarEventIdArray()) {
            dataArray.push({
                warEventArray   : warEventArray,
                templateWarRule : templateWarRule,
                warEventId      : warEventId,
            });
        }

        this._labelNoEvent.setIsVisible(!dataArray.length);
        await this._listEvent.bindData(dataArray);
    }
}

interface DataForEventRenderer extends Ui_Types_UiListItemData.UiListItemData {
    warEventArray       : WarEvent[];
    warEventId          : number;
    templateWarRule     : TemplateWarRule;
}
class ConditionRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForEventRenderer> {
    private readonly _layoutName!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelEventId!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelEventName!   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnUp!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDown!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDelete!        : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnUp,          callback: this._onTouchedBtnUp },
            { ui: this._btnDown,        callback: this._onTouchedBtnDown },
            { ui: this._btnDelete,      callback: this._onTouchedBtnDelete },
        ]);
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    protected override _doApplyOpenData(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnUp(): void {          // DONE
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warEventIdArray = openData.templateWarRule.getWarEventIdArray();
        if (warEventIdArray) {
            Helpers_Collection.moveElementInList(warEventIdArray, openData.warEventId, -1);
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeWarRuleWarEventIdArrayChanged);
        }
    }
    private _onTouchedBtnDown(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warEventIdArray = openData.templateWarRule.getWarEventIdArray();
        if (warEventIdArray) {
            Helpers_Collection.moveElementInList(warEventIdArray, openData.warEventId, 1);
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeWarRuleWarEventIdArrayChanged);
        }
    }
    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warEventIdArray = openData.templateWarRule.getWarEventIdArray();
        if (warEventIdArray) {
            Helpers_Collection.deleteElementFromList(warEventIdArray, openData.warEventId);
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeWarRuleWarEventIdArrayChanged);
        }
    }
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventId = openData.warEventId;
        this._labelEventId.setText(`E${eventId}`);
        this._labelEventName.setText(Helpers_Text.getTruncatedText(
            Lang_Utils.getLanguageText({
                textArray: openData.warEventArray.find(v => v.getEventId() === eventId)?.getEventNameArray()
            }) ?? Lang_Constants.UndefinedError,
            30
        ));
        this._layoutName.arrangeItems();
    }
}
