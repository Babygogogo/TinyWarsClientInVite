import {
    Lang_Utils,
    GamePanels_Dict,
    Helpers_Misc,
    GamePanels_Manager,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiPromptedInput,
} from "../../internal.ts";
import { LanguageText } from "../../proto/schema/CommonProto/Structure/LanguageText.ts";

export interface OpenData {
    currentTextArray    : LanguageText[];
    maxTextLength       : number;
    allowEmpty?         : boolean;
    getTitleText?       : () => string;
    getHelpText?        : () => string;
    callback            : (textArray: LanguageText[]) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _input1!           : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _btnDelete1!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _label1!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _input2!           : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _btnDelete2!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _label2!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConfirm!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,           callback : this.closePanel },
            { ui : this._btnHelp,            callback : this._onTouchedBtnHelp },
            { ui : this._btnDelete1,         callback : this._onTouchedBtnDelete1 },
            { ui : this._btnDelete2,         callback : this._onTouchedBtnDelete2 },
            { ui : this._btnConfirm,         callback : this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const maxLength = this.getOpenData()?.maxTextLength;
        this._input1.setInputMaxLength(maxLength);
        this._input2.setInputMaxLength(maxLength);

        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnHelp(): void {
        const func = this.getOpenData()?.getHelpText;
        const text = func ? func() : null;
        if (text) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getContent : () => text,
            });
        }
    }
    private _onTouchedBtnDelete1(): void {
        this._input1.setInputText(``);
    }
    private _onTouchedBtnDelete2(): void {
        this._input2.setInputText(``);
    }
    private _onTouchedBtnConfirm(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const text1 = this._input1.trimInputText();
        const text2 = this._input2.trimInputText();
        if ((!text1) && (!text2)) {
            if (!openData.allowEmpty) {
                FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0156));
            } else {
                openData.callback([]);
                this.closePanel();
            }
            return;
        }

        const textArray : LanguageText[] = [];
        if (text1) {
            textArray.push(LanguageText.fromJson({ languageType : Lang_Utils.getCurrentLanguageType(), text : text1 }));
        }
        if (text2) {
            textArray.push(LanguageText.fromJson({ languageType : Lang_Utils.getSecondaryLanguageType(), text : text2 }));
        }

        const maxLength = openData.maxTextLength;
        if (textArray.every(v => Helpers_Misc.getExisted(v.getText()).length <= 0)) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0155));
        } else if (textArray.some(v => Helpers_Misc.getExisted(v.getText()).length > maxLength)) {
            FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0034, maxLength));
        } else {
            openData.callback(textArray);
            this.closePanel();
        }
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const textArray = openData.currentTextArray;
        this._btnHelp.setIsVisible(!!openData.getHelpText);
        this._input1.setInputText(Lang_Utils.getLanguageText({ textArray : textArray, languageType : Lang_Utils.getCurrentLanguageType(), useAlternate : false }) ?? ``);
        this._input2.setInputText(Lang_Utils.getLanguageText({ textArray : textArray, languageType : Lang_Utils.getSecondaryLanguageType(), useAlternate : false }) ?? ``);
    }

    private _updateComponentsForLanguage(): void {
        const getTitleText = this.getOpenData()?.getTitleText;
        this._labelTitle.setText(getTitleText ? getTitleText() : Lang_Utils.getText(Lang_Constants.TextType.B0708));
        this._btnClose.setLangText(Lang_Constants.TextType.B0154);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._label1.setText(Lang_Utils.getLanguageTypeName(Lang_Utils.getCurrentLanguageType()) ?? Lang_Constants.UndefinedError);
        this._label2.setText(Lang_Utils.getLanguageTypeName(Lang_Utils.getSecondaryLanguageType()) ?? Lang_Constants.UndefinedError);
    }
}
