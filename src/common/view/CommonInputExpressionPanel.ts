import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { Parser } from "../../expressionParsers/Parser.ts";
import type { EpExpressionInfo } from "../../expressionParsers/Types.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText, getFormattedText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiPromptedInput } from "../../ui/interfaces/IUiPromptedInput.ts";
import { UiInputEventType } from "../../ui/types/UiInputEventType.ts";
import { Event } from "../../warEvents/Constants.ts";

export interface OpenData {
    currentValue    : Undefinable<string>;
    expressionInfo  : EpExpressionInfo;
    fullData        : WarEventFullData;
    isReviewingMap  : boolean;
    callback        : (text: string | null) => any;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnIdentifier!    : IUiButton;
    private readonly _btnCustomCounter! : IUiButton;
    private readonly _btnHelp!          : IUiButton;

    private readonly _labelError!       : IUiLabel;
    private readonly _input!            : IUiPromptedInput;
    private readonly _btnDelete!        : IUiButton;
    private readonly _btnCancel!        : IUiButton;
    private readonly _btnConfirm!       : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnIdentifier,      callback: this._onTouchedBtnIdentifier },
            { ui: this._btnCustomCounter,   callback: this._onTouchedBtnCustomCounter },
            { ui: this._btnHelp,            callback: this._onTouchedBtnHelp },

            { ui: this._btnDelete,          callback: this._onTouchedBtnDelete },
            { ui: this._btnCancel,          callback: this.closePanel, },
            { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm, },
        ]);
        this._setInputListenerArray([
            { ui: this._input,              callback: this._onFocusOutInput,            eventType: UiInputEventType.FocusOut },
        ]);
        this._setIsTouchMaskEnabled();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const input     = this._input;
        const text      = openData.currentValue ?? ``;
        input.setInputText(text);
        input.setInputMaxLength(Event.MaxExpressionLength);

        this._updateComponentsForLanguage();
        // egret.setTimeout(() => this._activateInput(), null, GameConfig.Graphic.TweenConst.DefaultDuration + 50);
    }

    private _onTouchedBtnIdentifier(): void {
        openPanel(getDict().CommonApiPanel, {
            contextType : this.getOpenData()?.expressionInfo.contextType,
        });
    }

    private _onTouchedBtnCustomCounter(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openPanel(getDict().WeCustomCounterNameListPanel, {
            isReviewingMap  : openData.isReviewingMap,
            fullData        : openData.fullData,
        });
    }

    private _onTouchedBtnHelp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openPanel(getDict().CommonHelpPanel, {
            getContent : () => openData.expressionInfo.getHelpText(),
        });
    }

    private _onTouchedBtnDelete(): void {
        this._input.setInputText(``);
        this._updateLabelError();
    }

    private _onTouchedBtnConfirm(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openData.callback(this._input.trimInputText() ?? ``);
        this.closePanel();
    }

    private _onFocusOutInput(): void {
        this._input.trimInputText();
        this._updateLabelError();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        const expressionInfo = this.getOpenData()?.expressionInfo;
        if (expressionInfo == null) {
            return;
        }

        this._labelTitle.setText(expressionInfo.getTitleText());
        this._btnIdentifier.setLangText(TextType.B0131);
        this._btnCustomCounter.setLangText(TextType.B1143);
        this._btnConfirm.setLangText(TextType.B0026);
        this._btnCancel.setLangText(TextType.B0154);
        this._input.setPromptText(getText(expressionInfo.isRequired ? TextType.B1310 : TextType.B1311));
        this._updateLabelError();
    }

    private _updateLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const expressionInfo    = openData.expressionInfo;
        const errorData         = Parser.getErrorDataForString2({
            str                     : this._input.trimInputText(),
            expressionInfo          : expressionInfo,
            customCounterNameSet    : new Set(openData.fullData.getCustomCounterNameArray().map(v => v.getName() ?? ``)),
        });
        const errorText = errorData.errorCode
            ? `${getFormattedText(TextType.F0091, expressionInfo.getTitleText())} ${errorData.errorText}`
            : null;
        const label = this._labelError;
        label.setText(errorText ?? getText(TextType.B0493));
        label.setTextColor(errorText ? ColorValue.Yellow : ColorValue.Green);
    }
}
