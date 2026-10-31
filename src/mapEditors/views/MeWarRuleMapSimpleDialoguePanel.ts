import {
    Helpers_Collection,
    Notifications_Dispatcher,
    GamePanels_Dict,
    Lang_Utils,
    Helpers_Text,
    GamePanels_Manager,
    FloatText,
    Lang_Constants,
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
            { type : "LanguageChanged",                             callback : this._onNotifyLanguageChanged },
            { type : "MeMapSimpleDialogueChanged",                  callback : this._onNotifyMeMapSimpleDialogueChanged },
            { type : "MeWarRuleMapSimpleDialogueIdArrayChanged",    callback : this._onNotifyMeWarRuleMapSimpleDialogueIdArrayChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,       callback : this.closePanel },
            { ui : this._btnAdd,         callback : this._onTouchedBtnAdd },
            { ui : this._btnDeleteAll,   callback : this._onTouchedBtnDeleteAll },
            { ui : this._btnModify,      callback : this._onTouchedBtnModify },
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
    private _onNotifyMeMapSimpleDialogueChanged(): void {
        this._updateView();
    }
    private _onNotifyMeWarRuleMapSimpleDialogueIdArrayChanged(): void {
        this._updateView();
    }
    private _onTouchedBtnAdd(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war                       = openData.war;
        const mapSimpleDialogueArray    = war.getMapSimpleDialogueArray();
        if ((war.getIsReviewingMap()) || (mapSimpleDialogueArray == null)) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            const templateWarRule           = openData.templateWarRule;
            const allDialogueIdSet          = new Set(mapSimpleDialogueArray.map(v => v.getDialogueId()));
            const currentDialogueIdArray    = templateWarRule.getMapSimpleDialogueIdArray();
            for (const dialogueId of currentDialogueIdArray) {
                allDialogueIdSet.delete(dialogueId);
            }
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
                availableNumberArray : [...allDialogueIdSet].sort((v1, v2) => v1 - v2),
                currentNumberArray   : [],
                showNumber           : true,
                getTitleText         : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.B1095)),
                getNumberMainText    : dialogueId => Helpers_Text.getTruncatedText(
                    Lang_Utils.getLanguageText({
                        textArray : mapSimpleDialogueArray.find(v => (v.getDialogueId()) === dialogueId)?.getDialogueNameArray(),
                    }) ?? Lang_Constants.UndefinedError,
                    15,
                ),
                callbackOnConfirm : additionalDialogueIdArray => {
                    if (!currentDialogueIdArray) {
                        templateWarRule.setMapSimpleDialogueIdArray(additionalDialogueIdArray);
                    } else {
                        for (const dialogueId of additionalDialogueIdArray) {
                            if (currentDialogueIdArray.indexOf(dialogueId) < 0) {
                                currentDialogueIdArray.push(dialogueId);
                            }
                        }
                    }
                    Notifications_Dispatcher.dispatch("MeWarRuleMapSimpleDialogueIdArrayChanged");
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
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0803),
                callback   : () => {
                    openData.templateWarRule.setMapSimpleDialogueIdArray([]);
                    Notifications_Dispatcher.dispatch("MeWarRuleMapSimpleDialogueIdArrayChanged");
                },
            });
        }
    }
    private _onTouchedBtnModify(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MeMapSimpleDialogueMainPanel, {
            war : war,
        });
        this.closePanel();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListConditionAndLabelNoCondition();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1095)} (R${this.getOpenData()?.templateWarRule.getRuleId()})`);
        this._labelNoData.setLangText(Lang_Constants.TextType.A0842);
    }
    private async _updateListConditionAndLabelNoCondition(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war                   = openData.war;
        const templateWarRule       = openData.templateWarRule;
        const dataArray             : DataForItemRenderer[] = [];
        for (const dialogueId of templateWarRule.getMapSimpleDialogueIdArray()) {
            dataArray.push({
                war             : war,
                templateWarRule : templateWarRule,
                dialogueId      : dialogueId,
            });
        }

        this._labelNoData.setIsVisible(!dataArray.length);
        await this._list.bindData(dataArray);
    }
}

interface DataForItemRenderer extends Ui_Types_UiListItemData.UiListItemData {
    war                 : MapEditor_Interface_IMeWar.IMeWar;
    dialogueId          : number;
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
            { ui : this._btnUp,          callback : this._onTouchedBtnUp },
            { ui : this._btnDown,        callback : this._onTouchedBtnDown },
            { ui : this._btnDelete,      callback : this._onTouchedBtnDelete },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",    callback : this._onNotifyLanguageChanged },
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
            const dialogueIdArray = openData.templateWarRule.getMapSimpleDialogueIdArray();
            if (dialogueIdArray) {
                Helpers_Collection.moveElementInList(dialogueIdArray, openData.dialogueId, -1);
                Notifications_Dispatcher.dispatch("MeWarRuleMapSimpleDialogueIdArrayChanged");
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
            const dialogueIdArray = openData.templateWarRule.getMapSimpleDialogueIdArray();
            if (dialogueIdArray) {
                Helpers_Collection.moveElementInList(dialogueIdArray, openData.dialogueId, 1);
                Notifications_Dispatcher.dispatch("MeWarRuleMapSimpleDialogueIdArrayChanged");
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
            const dialogueIdArray = openData.templateWarRule.getMapSimpleDialogueIdArray();
            if (dialogueIdArray) {
                Helpers_Collection.deleteElementFromList(dialogueIdArray, openData.dialogueId);
                Notifications_Dispatcher.dispatch("MeWarRuleMapSimpleDialogueIdArrayChanged");
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

        const dialogueId = openData.dialogueId;
        this._labelId.setText(`#${dialogueId}`);
        this._labelName.setText(Helpers_Text.getTruncatedText(
            Lang_Utils.getLanguageText({
                textArray : openData.war.getMapSimpleDialogueArray().find(v => (v.getDialogueId()) === dialogueId)?.getDialogueNameArray(),
            }) ?? Lang_Constants.UndefinedError,
            30,
        ));
        this._layoutName.arrangeItems();
    }
}
