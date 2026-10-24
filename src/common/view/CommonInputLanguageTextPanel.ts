import * as FloatText2 from "../../FloatText.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoStructureLanguageText from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiPromptedInput from "../../ui/interfaces/IUiPromptedInput.ts";

export interface OpenData {
    maxLength           : number;
    currentTextArray    : ProtoSchemaCommonProtoStructureLanguageText.LanguageText[] | null;
    isMultiline?        : boolean;
    getTitle            : () => string;
    callback            : (languageTextArray: ProtoSchemaCommonProtoStructureLanguageText.LanguageText[]) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _input1!           : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _btnDelete1!       : UiInterfacesIUiButton.IUiButton;
    private readonly _label1!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _input2!           : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _btnDelete2!       : UiInterfacesIUiButton.IUiButton;
    private readonly _label2!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnConfirm!       : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0156));
            return;
        }

        const textArray : ProtoSchemaCommonProtoStructureLanguageText.LanguageText[] = [];
        if (text1) {
            textArray.push(ProtoSchemaCommonProtoStructureLanguageText.LanguageText.fromJson({ languageType: LangUtils.getCurrentLanguageType(), text: text1 }));
        }
        if (text2) {
            textArray.push(ProtoSchemaCommonProtoStructureLanguageText.LanguageText.fromJson({ languageType: LangUtils.getSecondaryLanguageType(), text: text2 }));
        }

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const maxLength = openData.maxLength;
        if (textArray.every(v => HelpersMisc.getExisted(v.getText()).length <= 0)) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0155));
        } else if (textArray.some(v => HelpersMisc.getExisted(v.getText()).length > maxLength)) {
            FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0034, maxLength));
        } else {
            openData.callback(textArray);
            this.closePanel();
        }
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        const textArray = this.getOpenData()?.currentTextArray ?? [];
        this._input1.setInputText(LangUtils.getLanguageText({ textArray, languageType: LangUtils.getCurrentLanguageType(), useAlternate: false }) ?? ``);
        this._input2.setInputText(LangUtils.getLanguageText({ textArray, languageType: LangUtils.getSecondaryLanguageType(), useAlternate: false }) ?? ``);
    }

    private _updateComponentsForLanguage(): void {
        this._btnClose.setLangText(LangConstants.TextType.B0154);
        this._btnConfirm.setLangText(LangConstants.TextType.B0026);
        this._label1.setText(LangUtils.getLanguageTypeName(LangUtils.getCurrentLanguageType()) ?? LangConstants.UndefinedError);
        this._label2.setText(LangUtils.getLanguageTypeName(LangUtils.getSecondaryLanguageType()) ?? LangConstants.UndefinedError);
        this._labelTitle.setText(this.getOpenData()?.getTitle() ?? LangConstants.UndefinedError);
    }
}
