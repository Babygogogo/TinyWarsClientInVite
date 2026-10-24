import * as FloatText2 from "../../FloatText.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiPromptedInput from "../../ui/interfaces/IUiPromptedInput.ts";
import * as UiTypesUiInputEventType from "../../ui/types/UiInputEventType.ts";

export type OpenData = {
    title           : string;
    currentValue    : string;
    tips            : string | null;
    minLength?      : number;
    maxChars        : number | null;
    charRestrict    : string | null;
    canBeEmpty?     : boolean;
    isMultiLine?    : boolean;
    isAutoClose?    : boolean;          // 留空=true
    callback        : (panel: Panel) => any;
};
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _input!        : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _btnDelete!    : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCancel!    : UiInterfacesIUiButton.IUiButton;
    private readonly _btnConfirm!   : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnDelete,  callback: this._onTouchedBtnDelete },
            { ui: this._btnCancel,  callback: this.closePanel, },
            { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm, },
        ]);
        this._setInputListenerArray([
            { ui: this._input,      callback: this._onFocusOutInput,    eventType: UiTypesUiInputEventType.UiInputEventType.FocusOut },
        ]);
        this._setIsTouchMaskEnabled();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setText(openData.title);

        const input = this._input;
        const text  = openData.currentValue;
        input.setInputText(text);
        input.setInputMaxLength(openData.maxChars ?? undefined);
        input.setInputRestrict(openData.charRestrict ?? undefined);
        input.setPromptText(openData.tips ?? ``);
        input.setInputMultiline(!!openData.isMultiLine);

        // egret.setTimeout(() => this._activateInput(), null, GameConfig.Graphic.TweenConst.DefaultDuration + 50);
    }

    public getInputText(): string {
        return this._input.trimInputText() ?? ``;
    }

    private _onTouchedBtnDelete(): void {
        this._input.setInputText(``);
    }

    private _onTouchedBtnConfirm(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const text          = this.getInputText();
        const textLength    = text.length;
        if ((!openData.canBeEmpty) && (!textLength)) {
            FloatText2.showLang(LangConstants.TextType.A0787);
            return;
        }

        const minLength = openData.minLength;
        if ((minLength != null) && (textLength < minLength)) {
            FloatText2.showLang(LangConstants.TextType.A0155);
            return;
        }

        openData.callback(this);

        if (openData.isAutoClose !== false) {
            this.closePanel();
        }
    }

    private _onFocusOutInput(): void {
        this._input.trimInputText();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
        this._btnCancel.setText(LangUtils.getText(LangConstants.TextType.B0154));
    }
}
