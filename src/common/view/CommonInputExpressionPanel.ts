import {
    Graphics_Constants,
    WarEvents_Constants,
    GamePanels_Dict,
    Lang_Utils,
    GamePanels_Manager,
    ExpressionParsers_Parser,
    Lang_Constants,
    Ui_Types_UiInputEventType,
    Ui_Components_UiPanel,
    type ExpressionParsers_Types,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiPromptedInput,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";

export interface OpenData {
    currentValue    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>;
    expressionInfo  : ExpressionParsers_Types.EpExpressionInfo;
    fullData        : WarEventFullData;
    isReviewingMap  : boolean;
    callback        : (text: string | null) => any;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnIdentifier!    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCustomCounter! : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelp!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelError!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _input!            : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _btnDelete!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCancel!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm!       : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",    callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnIdentifier,      callback : this._onTouchedBtnIdentifier },
            { ui : this._btnCustomCounter,   callback : this._onTouchedBtnCustomCounter },
            { ui : this._btnHelp,            callback : this._onTouchedBtnHelp },

            { ui : this._btnDelete,          callback : this._onTouchedBtnDelete },
            { ui : this._btnCancel,          callback : this.closePanel },
            { ui : this._btnConfirm,         callback : this._onTouchedBtnConfirm },
        ]);
        this._setInputListenerArray([
            { ui : this._input,              callback : this._onFocusOutInput,            eventType : Ui_Types_UiInputEventType.UiInputEventType.FocusOut },
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
        input.setInputMaxLength(WarEvents_Constants.Event.MaxExpressionLength);

        this._updateComponentsForLanguage();
        // egret.setTimeout(() => this._activateInput(), null, GameConfig.Graphic.TweenConst.DefaultDuration + 50);
    }

    private _onTouchedBtnIdentifier(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonApiPanel, {
            contextType : this.getOpenData()?.expressionInfo.contextType,
        });
    }

    private _onTouchedBtnCustomCounter(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeCustomCounterNameListPanel, {
            isReviewingMap : openData.isReviewingMap,
            fullData       : openData.fullData,
        });
    }

    private _onTouchedBtnHelp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
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
        this._btnIdentifier.setLangText(Lang_Constants.TextType.B0131);
        this._btnCustomCounter.setLangText(Lang_Constants.TextType.B1143);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnCancel.setLangText(Lang_Constants.TextType.B0154);
        this._input.setPromptText(Lang_Utils.getText(expressionInfo.isRequired ? Lang_Constants.TextType.B1310 : Lang_Constants.TextType.B1311));
        this._updateLabelError();
    }

    private _updateLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const expressionInfo    = openData.expressionInfo;
        const errorData         = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : this._input.trimInputText(),
            expressionInfo       : expressionInfo,
            customCounterNameSet : new Set(openData.fullData.getCustomCounterNameArray().map(v => v.getName() ?? ``)),
        });
        const errorText = errorData.errorCode
            ? `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, expressionInfo.getTitleText())} ${errorData.errorText}`
            : null;
        const label = this._labelError;
        label.setText(errorText ?? Lang_Utils.getText(Lang_Constants.TextType.B0493));
        label.setTextColor(errorText ? Graphics_Constants.ColorValue.Yellow : Graphics_Constants.ColorValue.Green);
    }
}
