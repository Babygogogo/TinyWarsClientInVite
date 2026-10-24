import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as ExpressionParsersParser from "../../expressionParsers/Parser.ts";
import type * as ExpressionParsersTypes from "../../expressionParsers/Types.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiPromptedInput from "../../ui/interfaces/IUiPromptedInput.ts";
import * as UiTypesUiInputEventType from "../../ui/types/UiInputEventType.ts";
import * as WarEventsConstants from "../../warEvents/Constants.ts";

export interface OpenData {
    currentValue    : AuxiliaryTypesAuxiliaryTypes.Undefinable<string>;
    expressionInfo  : ExpressionParsersTypes.EpExpressionInfo;
    fullData        : ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
    isReviewingMap  : boolean;
    callback        : (text: string | null) => any;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnIdentifier!    : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCustomCounter! : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelp!          : UiInterfacesIUiButton.IUiButton;

    private readonly _labelError!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _input!            : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _btnDelete!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCancel!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnConfirm!       : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
            { ui: this._input,              callback: this._onFocusOutInput,            eventType: UiTypesUiInputEventType.UiInputEventType.FocusOut },
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
        input.setInputMaxLength(WarEventsConstants.Event.MaxExpressionLength);

        this._updateComponentsForLanguage();
        // egret.setTimeout(() => this._activateInput(), null, GameConfig.Graphic.TweenConst.DefaultDuration + 50);
    }

    private _onTouchedBtnIdentifier(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonApiPanel, {
            contextType : this.getOpenData()?.expressionInfo.contextType,
        });
    }

    private _onTouchedBtnCustomCounter(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeCustomCounterNameListPanel, {
            isReviewingMap  : openData.isReviewingMap,
            fullData        : openData.fullData,
        });
    }

    private _onTouchedBtnHelp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
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
        this._btnIdentifier.setText(LangUtils.getText(LangConstants.TextType.B0131));
        this._btnCustomCounter.setText(LangUtils.getText(LangConstants.TextType.B1143));
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
        this._btnCancel.setText(LangUtils.getText(LangConstants.TextType.B0154));
        this._input.setPromptText(LangUtils.getText(expressionInfo.isRequired ? LangConstants.TextType.B1310 : LangConstants.TextType.B1311));
        this._updateLabelError();
    }

    private _updateLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const expressionInfo    = openData.expressionInfo;
        const errorData         = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : this._input.trimInputText(),
            expressionInfo          : expressionInfo,
            customCounterNameSet    : new Set(openData.fullData.getCustomCounterNameArray().map(v => v.getName() ?? ``)),
        });
        const errorText = errorData.errorCode
            ? `${LangUtils.getFormattedText(LangConstants.TextType.F0091, expressionInfo.getTitleText())} ${errorData.errorText}`
            : null;
        const label = this._labelError;
        label.setText(errorText ?? LangUtils.getText(LangConstants.TextType.B0493));
        label.setTextColor(errorText ? GraphicsConstants.ColorValue.Yellow : GraphicsConstants.ColorValue.Green);
    }
}
