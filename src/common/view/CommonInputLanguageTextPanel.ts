import {
    Lang_Utils,
    Helpers_Misc,
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
    maxLength           : number;
    currentTextArray    : LanguageText[] | null;
    isMultiline?        : boolean;
    getTitle            : () => string;
    callback            : (languageTextArray: LanguageText[]) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _input1!           : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _btnDelete1!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _label1!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _input2!           : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _btnDelete2!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _label2!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm!       : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,           callback : this.closePanel },
            { ui : this._btnDelete1,         callback : this._onTouchedBtnDelete1 },
            { ui : this._btnDelete2,         callback : this._onTouchedBtnDelete2 },
            { ui : this._btnConfirm,         callback : this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const maxLength     = openData.maxLength;
        const isMultiline   = !!openData.isMultiline;
        const input1        = this._input1;
        const input2        = this._input2;
        input1.setInputMaxLength(maxLength);
        input2.setInputMaxLength(maxLength);
        input1.setInputMultiline(isMultiline);
        input2.setInputMultiline(isMultiline);

        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnDelete1(): void {
        this._input1.setInputText(``);
    }
    private _onTouchedBtnDelete2(): void {
        this._input2.setInputText(``);
    }
    private _onTouchedBtnConfirm(): void {
        const text1 = this._input1.trimInputText() ?? ``;
        const text2 = this._input2.trimInputText() ?? ``;
        if ((!text1) && (!text2)) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0156));
            return;
        }

        const textArray : LanguageText[] = [];
        if (text1) {
            textArray.push(LanguageText.fromJson({ languageType : Lang_Utils.getCurrentLanguageType(), text : text1 }));
        }
        if (text2) {
            textArray.push(LanguageText.fromJson({ languageType : Lang_Utils.getSecondaryLanguageType(), text : text2 }));
        }

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const maxLength = openData.maxLength;
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

        const textArray = this.getOpenData()?.currentTextArray ?? [];
        this._input1.setInputText(Lang_Utils.getLanguageText({ textArray, languageType : Lang_Utils.getCurrentLanguageType(), useAlternate : false }) ?? ``);
        this._input2.setInputText(Lang_Utils.getLanguageText({ textArray, languageType : Lang_Utils.getSecondaryLanguageType(), useAlternate : false }) ?? ``);
    }

    private _updateComponentsForLanguage(): void {
        this._btnClose.setLangText(Lang_Constants.TextType.B0154);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._label1.setText(Lang_Utils.getLanguageTypeName(Lang_Utils.getCurrentLanguageType()) ?? Lang_Constants.UndefinedError);
        this._label2.setText(Lang_Utils.getLanguageTypeName(Lang_Utils.getSecondaryLanguageType()) ?? Lang_Constants.UndefinedError);
        this._labelTitle.setText(this.getOpenData()?.getTitle() ?? Lang_Constants.UndefinedError);
    }
}
