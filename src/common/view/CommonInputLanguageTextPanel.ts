import { show } from "../../FloatText.ts";
import { getExisted } from "../../helpers/Misc.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getText,
    getCurrentLanguageType,
    getSecondaryLanguageType,
    getFormattedText,
    getLanguageText,
    getLanguageTypeName,
} from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { LanguageText } from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiPromptedInput } from "../../ui/interfaces/IUiPromptedInput.ts";

export interface OpenData {
    maxLength           : number;
    currentTextArray    : LanguageText[] | null;
    isMultiline?        : boolean;
    getTitle            : () => string;
    callback            : (languageTextArray: LanguageText[]) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;

    private readonly _input1!           : IUiPromptedInput;
    private readonly _btnDelete1!       : IUiButton;
    private readonly _label1!           : IUiLabel;

    private readonly _input2!           : IUiPromptedInput;
    private readonly _btnDelete2!       : IUiButton;
    private readonly _label2!           : IUiLabel;

    private readonly _btnClose!         : IUiButton;
    private readonly _btnConfirm!       : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnDelete1,         callback: this._onTouchedBtnDelete1 },
            { ui: this._btnDelete2,         callback: this._onTouchedBtnDelete2 },
            { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
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
            show(getText(TextType.A0156));
            return;
        }

        const textArray : LanguageText[] = [];
        if (text1) {
            textArray.push(LanguageText.fromJson({ languageType: getCurrentLanguageType(), text: text1 }));
        }
        if (text2) {
            textArray.push(LanguageText.fromJson({ languageType: getSecondaryLanguageType(), text: text2 }));
        }

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const maxLength = openData.maxLength;
        if (textArray.every(v => getExisted(v.getText()).length <= 0)) {
            show(getText(TextType.A0155));
        } else if (textArray.some(v => getExisted(v.getText()).length > maxLength)) {
            show(getFormattedText(TextType.F0034, maxLength));
        } else {
            openData.callback(textArray);
            this.closePanel();
        }
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        const textArray = this.getOpenData()?.currentTextArray ?? [];
        this._input1.setInputText(getLanguageText({ textArray, languageType: getCurrentLanguageType(), useAlternate: false }) ?? ``);
        this._input2.setInputText(getLanguageText({ textArray, languageType: getSecondaryLanguageType(), useAlternate: false }) ?? ``);
    }

    private _updateComponentsForLanguage(): void {
        this._btnClose.setLangText(TextType.B0154);
        this._btnConfirm.setLangText(TextType.B0026);
        this._label1.setText(getLanguageTypeName(getCurrentLanguageType()) ?? UndefinedError);
        this._label2.setText(getLanguageTypeName(getSecondaryLanguageType()) ?? UndefinedError);
        this._labelTitle.setText(this.getOpenData()?.getTitle() ?? UndefinedError);
    }
}
