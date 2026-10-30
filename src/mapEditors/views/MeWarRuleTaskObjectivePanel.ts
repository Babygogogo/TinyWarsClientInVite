import {
    Helpers_Collection,
    Notifications_Dispatcher,
    GamePanels_Dict,
    Lang_Utils,
    Helpers_Text,
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
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";

export interface OpenData {
    war                     : MapEditor_Interface_IMeWar.IMeWar;
    templateWarRule         : TemplateWarRule;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAdd!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteAll!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnModify!            : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _list!                 : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForItemRenderer>;
    private readonly _labelNoData!          : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                         callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.MeTaskObjectiveFullDataChanged,          callback: this._onNotifyMeTaskObjectiveFullDataChanged },
            { type: Notifications_TypeId.TypeId.MeWarRuleTaskObjectiveIdArrayChanged,    callback: this._onNotifyMeWarRuleTaskObjectiveIdArrayChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
            { ui: this._btnAdd,         callback: this._onTouchedBtnAdd },
            { ui: this._btnDeleteAll,   callback: this._onTouchedBtnDeleteAll },
            { ui: this._btnModify,      callback: this._onTouchedBtnModify },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._list.setItemRendererClass(ItemRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._list.removeAllItems();

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMeTaskObjectiveFullDataChanged(): void {
        this._updateView();
    }
    private _onNotifyMeWarRuleTaskObjectiveIdArrayChanged(): void {
        this._updateView();
    }
    private _onTouchedBtnAdd(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war                   = openData.war;
        const taskObjectiveFullData = war.getTaskObjectiveFullData();
        if ((war.getIsReviewingMap()) || (taskObjectiveFullData == null)) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            const templateWarRule               = openData.templateWarRule;
            const allTaskObjectiveIdSet         = new Set(taskObjectiveFullData.getTaskObjectiveArray().map(v => v.getObjectiveId()));
            const currentTaskObjectiveIdArray   = templateWarRule.getTaskObjectiveIdArray();
            for (const taskObjectiveId of currentTaskObjectiveIdArray) {
                allTaskObjectiveIdSet.delete(taskObjectiveId);
            }
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
                availableNumberArray            : [...allTaskObjectiveIdSet],
                currentNumberArray              : [],
                showNumber                      : true,
                getTitleText                    : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.B1214)),
                getNumberMainText               : taskObjectiveId => Helpers_Text.getTruncatedText(
                    Lang_Utils.getLanguageText({
                        textArray: taskObjectiveFullData.getTaskObjectiveArray().find(v => (v.getObjectiveId()) === taskObjectiveId)?.getDesc()
                    }) ?? Lang_Constants.UndefinedError,
                    15
                ),
                callbackOnConfirm               : additionalTaskObjectiveIdArray => {
                    if (!currentTaskObjectiveIdArray) {
                        templateWarRule.setTaskObjectiveIdArray(additionalTaskObjectiveIdArray);
                    } else {
                        for (const taskObjectiveId of additionalTaskObjectiveIdArray) {
                            if (currentTaskObjectiveIdArray.indexOf(taskObjectiveId) < 0) {
                                currentTaskObjectiveIdArray.push(taskObjectiveId);
                            }
                        }
                    }
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeWarRuleTaskObjectiveIdArrayChanged);
                },
            });
        }
    }
    private _onTouchedBtnDeleteAll(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0802),
                callback: () => {
                    openData.templateWarRule.setTaskObjectiveIdArray([]);
                    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeWarRuleTaskObjectiveIdArrayChanged);
                },
            });
        }
    }
    private _onTouchedBtnModify(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeTaskObjectiveListPanel, {
            war : war,
        });
        this.closePanel();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListConditionAndLabelNoCondition();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1214)} (R${this.getOpenData()?.templateWarRule.getRuleId()})`);
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
    }
    private async _updateListConditionAndLabelNoCondition(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war                   = openData.war;
        const templateWarRule       = openData.templateWarRule;
        const dataArray             : DataForItemRenderer[] = [];
        for (const taskObjectiveId of templateWarRule.getTaskObjectiveIdArray()) {
            dataArray.push({
                war                 : war,
                templateWarRule     : templateWarRule,
                taskObjectiveId     : taskObjectiveId,
            });
        }

        this._labelNoData.setIsVisible(!dataArray.length);
        await this._list.bindData(dataArray);
    }
}

interface DataForItemRenderer extends Ui_Types_UiListItemData.UiListItemData {
    war                 : MapEditor_Interface_IMeWar.IMeWar;
    taskObjectiveId     : number;
    templateWarRule     : TemplateWarRule;
}
class ItemRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForItemRenderer> {
    private readonly _layoutName!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelId!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnUp!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDown!      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDelete!    : Ui_Interfaces_IUiButton.IUiButton;

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

        if (openData.war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            const taskObjectiveIdArray = openData.templateWarRule.getTaskObjectiveIdArray();
            if (taskObjectiveIdArray) {
                Helpers_Collection.moveElementInList(taskObjectiveIdArray, openData.taskObjectiveId, -1);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeWarRuleTaskObjectiveIdArrayChanged);
            }
        }
    }
    private _onTouchedBtnDown(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            const taskObjectiveIdArray = openData.templateWarRule.getTaskObjectiveIdArray();
            if (taskObjectiveIdArray) {
                Helpers_Collection.moveElementInList(taskObjectiveIdArray, openData.taskObjectiveId, 1);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeWarRuleTaskObjectiveIdArrayChanged);
            }
        }
    }
    private _onTouchedBtnDelete(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.war.getIsReviewingMap()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            const taskObjectiveIdArray = openData.templateWarRule.getTaskObjectiveIdArray();
            if (taskObjectiveIdArray) {
                Helpers_Collection.deleteElementFromList(taskObjectiveIdArray, openData.taskObjectiveId);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MeWarRuleTaskObjectiveIdArrayChanged);
            }
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

        const taskObjectiveId = openData.taskObjectiveId;
        this._labelId.setText(`#${taskObjectiveId}`);
        this._labelName.setText(Helpers_Text.getTruncatedText(
            Lang_Utils.getLanguageText({
                textArray: openData.war.getTaskObjectiveFullData()?.getTaskObjectiveArray().find(v => (v.getObjectiveId()) === taskObjectiveId)?.getDesc()
            }) ?? Lang_Constants.UndefinedError,
            30
        ));
        this._layoutName.arrangeItems();
    }
}
