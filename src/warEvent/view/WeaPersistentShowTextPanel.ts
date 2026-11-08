import {
    Graphics_Constants,
    WarEvents_Actions_Constants_PersistentShowText,
    Helpers_Collection,
    Notifications_Dispatcher,
    WarEvents_Actions_Utils_Common,
    Lang_Utils,
    GamePanels_Dict,
    GamePanels_Manager,
    Lang_Constants,
    Ui_Components_UiPanel,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScroller,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import { LanguageText } from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaPersistentShowText } from "../../proto/schema/CommonProto/WarEvent/WeaPersistentShowText.ts";

export interface OpenData {
    war         : MapEditor_Interface_IMeWar.IMeWar;
    fullData    : WarEventFullData;
    action      : WarEventAction;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnType!                                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupDesc!                                : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDesc!                                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelError!                               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _scrExpression!                            : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiLayout.IUiLayout>;
    private readonly _groupExpression!                          : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _groupAct!                                 : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _groupActLang1!                            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActLang1!                            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActLang1!                              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupActLang2!                            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelActLang2!                            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnActLang2!                              : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                     callback : this._onNotifyLanguageChanged },
            { type : "WarEventFullDataChanged",             callback : this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                                   callback : this.closePanel },
            { ui : this._btnType,                                    callback : this._onTouchedBtnType },

            { ui : this._btnActLang1,                                callback : this._onTouchedBtnActLang1 },
            { ui : this._btnActLang2,                                callback : this._onTouchedBtnActLang2 },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyWarEventFullDataChanged(): void {
        this._updateView();
    }
    private _onTouchedBtnType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeActionTypeListPanel, {
            fullData : openData.fullData,
            action   : openData.action,
            war      : openData.war,
        });
    }

    private _onTouchedBtnActLang1(): void {
        const action = this.getAction();
        if (action == null) {
            return;
        }

        const languageType1     = Lang_Utils.getCurrentLanguageType();
        const textArray         = action.getTextArray();
        const textData          = textArray.find(v => (v.getLanguageType()) === languageType1);
        const currentText       = textData?.getText();

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
            title        : Lang_Utils.getText(Lang_Constants.TextType.B0455),
            currentValue : currentText || ``,
            charRestrict : null,
            maxChars     : WarEvents_Actions_Constants_PersistentShowText.Common.MaxLength,
            tips         : Lang_Utils.getFormattedText(Lang_Constants.TextType.F0020, WarEvents_Actions_Constants_PersistentShowText.Common.MaxLength),
            canBeEmpty   : true,
            isMultiLine  : true,
            callback     : panel => {
                const text = (panel.getInputText() || ``).trim();
                if (text === currentText) {
                    return;
                }

                if (!text.length) {
                    Helpers_Collection.deleteElementFromList(textArray, textData);
                } else {
                    if (textData) {
                        textData.setText(text);
                    } else {
                        textArray.push(LanguageText.fromJson({
                            languageType : languageType1,
                            text         : text,
                        }));
                    }
                }
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }
    private _onTouchedBtnActLang2(): void {
        const action = this.getAction();
        if (action == null) {
            return;
        }

        const languageType1     = Lang_Utils.getSecondaryLanguageType();
        const textArray         = action.getTextArray();
        const textData          = textArray.find(v => (v.getLanguageType()) === languageType1);
        const currentText       = textData?.getText();

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
            title        : Lang_Utils.getText(Lang_Constants.TextType.B0455),
            currentValue : currentText || ``,
            charRestrict : null,
            maxChars     : WarEvents_Actions_Constants_PersistentShowText.Common.MaxLength,
            tips         : Lang_Utils.getFormattedText(Lang_Constants.TextType.F0020, WarEvents_Actions_Constants_PersistentShowText.Common.MaxLength),
            canBeEmpty   : true,
            isMultiLine  : true,
            callback     : panel => {
                const text = (panel.getInputText() || ``).trim();
                if (text === currentText) {
                    return;
                }

                if (!text.length) {
                    Helpers_Collection.deleteElementFromList(textArray, textData);
                } else {
                    if (textData) {
                        textData.setText(text);
                    } else {
                        textArray.push(LanguageText.fromJson({
                            languageType : languageType1,
                            text         : text,
                        }));
                    }
                }
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
            },
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();

        this._updateInputs();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0533)} A${this.getOpenData()?.action.getWeaCommonData()?.getActionId()}`);
        this._btnType.setLangText(Lang_Constants.TextType.B0516);

        this._btnActLang1.setText(Lang_Utils.getLanguageTypeName(Lang_Utils.getCurrentLanguageType()) ?? Lang_Constants.UndefinedError);
        this._btnActLang2.setText(Lang_Utils.getLanguageTypeName(Lang_Utils.getSecondaryLanguageType()) ?? Lang_Constants.UndefinedError);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const action            = openData.action;
        const war               = openData.war;
        const errorTip          = WarEvents_Actions_Utils_Common.getErrorTipForAction(openData.fullData, action, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Yellow : Graphics_Constants.ColorValue.Green);
        this._labelDesc.setText(WarEvents_Actions_Utils_Common.getBriefDescForAction(action, war.getGcData()) || Lang_Constants.UndefinedError);
        this._groupDesc.arrangeItems();
    }

    private _updateInputs(): void {
        const action = this.getAction();
        if (action == null) {
            return;
        }

        const textArray = action.getTextArray();
        const langType1 = Lang_Utils.getCurrentLanguageType();
        const langType2 = Lang_Utils.getSecondaryLanguageType();

        {
            const label = this._labelActLang1;
            label.setText(Lang_Utils.getLanguageText({ textArray, languageType : langType1, useAlternate : false }) ?? ``);
            this._groupActLang1.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }
        {
            const label = this._labelActLang2;
            label.setText(Lang_Utils.getLanguageText({ textArray, languageType : langType2, useAlternate : false }) ?? ``);
            this._groupActLang2.setUnscaledManualHeight(Math.max(30, label.getScaledHeight()));
        }

        const groupExpression   = this._groupExpression;
        const scrExpression     = this._scrExpression;
        this._groupAct.arrangeItems();
        groupExpression.arrangeItems();
        scrExpression.updateOnItemsChanged();
        scrExpression.setUnscaledManualHeight(Math.min(380, groupExpression.getScaledHeight()));
    }

    private getAction(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaPersistentShowText> {
        return this.getOpenData()?.action.getWeaPersistentShowText();
    }
}
