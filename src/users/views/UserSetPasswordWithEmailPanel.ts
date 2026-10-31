import {
    type Notifications_Mapping,
    Users_Utils,
    Users_Constants,
    Emails_Constants,
    Lang_Utils,
    Timer_TimerModel,
    Users_Proxy,
    FloatText,
    Lang_Constants,
    Ui_Types_UiInputEventType,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiPromptedInput,
} from "../../internal.ts";
import type { S as UserRequestPasswordVerificationCodeResponse } from "../../proto/schema/CommonProto/NetMessage/MsgUserRequestPasswordVerificationCode/S.ts";

let _lastRequestTimestamp = 0;

export interface OpenData {
    account     : string;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutContent!            : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _layoutStep1!              : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelStep1!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelAccount!             : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputAccount!             : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _btnRequest!               : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutStep2!              : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelStep2!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelVerificationCode!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputVerificationCode!    : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _labelPassword0!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputPassword0!           : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _labelPassword1!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputPassword1!           : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _btnReset!                 : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                                 callback : this._onNotifyLanguageChanged },
            { type : "MsgUserRequestPasswordVerificationCode",          callback : this._onNotifyMsgUserRequestPasswordVerificationCode },
            { type : "MsgUserRequestPasswordVerificationCodeFailed",    callback : this._onNotifyMsgUserRequestPasswordVerificationCodeFailed },
            { type : "MsgUserResetPasswordWithEmail",                   callback : this._onNotifyMsgUserResetPasswordWithEmail },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,               callback : this.closePanel },
            { ui : this._btnRequest,             callback : this._onTouchedBtnRequest },
            { ui : this._btnReset,               callback : this._onTouchedBtnReset },
        ]);
        this._setInputListenerArray([
            { ui : this._inputAccount,           callback : this._onFocusOutInputAccount,             eventType : Ui_Types_UiInputEventType.UiInputEventType.FocusOut },
            { ui : this._inputVerificationCode,  callback : this._onFocusOutInputVerificationCode,    eventType : Ui_Types_UiInputEventType.UiInputEventType.FocusOut },
            { ui : this._inputPassword0,         callback : this._onFocusOutInputPassword0,           eventType : Ui_Types_UiInputEventType.UiInputEventType.FocusOut },
            { ui : this._inputPassword1,         callback : this._onFocusOutInputPassword1,           eventType : Ui_Types_UiInputEventType.UiInputEventType.FocusOut },
        ]);
        this._setIsTouchMaskEnabled();
        // this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._inputAccount.setInputMaxLength(Users_Constants.Common.AccountMaxLength);
        this._inputPassword0.setInputMaxLength(Users_Constants.Common.RawPasswordMaxLength);
        this._inputPassword1.setInputMaxLength(Users_Constants.Common.RawPasswordMaxLength);
        this._inputVerificationCode.setInputMaxLength(Emails_Constants.Common.VerificationCodeLength);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateInputAccount();
    }

    private _onNotifyMsgUserRequestPasswordVerificationCode(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgUserRequestPasswordVerificationCode"]>): void {
        FloatText.showLang(Lang_Constants.TextType.A0863);

        _lastRequestTimestamp = (((e.data as { msg: UserRequestPasswordVerificationCodeResponse }).msg).getEndTimestamp() ?? 0) - Emails_Constants.Common.VerificationCodeExpiration;
    }
    private _onNotifyMsgUserRequestPasswordVerificationCodeFailed(): void {
        // nothing to do
    }

    private _onNotifyMsgUserResetPasswordWithEmail(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onFocusOutInputAccount(): void {
        const input = this._inputAccount;
        input.setInputText(input.getInputText()?.trim() ?? ``);
    }
    private _onTouchedBtnRequest(): void {
        const account = this._inputAccount.getInputText()?.trim() ?? ``;
        if (!Users_Utils.checkIsAccountValid(account)) {
            FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0170)));
            return;
        }

        const cd = Emails_Constants.Common.VerificationCodeRefreshInterval - (Timer_TimerModel.getServerTimestamp() - _lastRequestTimestamp);
        if (cd >= 0) {
            FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0204, cd));
        } else {
            Users_Proxy.reqUserRequestPasswordVerificationCode(account);
            FloatText.showLang(Lang_Constants.TextType.A0867);
        }
    }

    private _onFocusOutInputVerificationCode(): void {
        const input = this._inputVerificationCode;
        input.setInputText(input.getInputText()?.trim() ?? ``);
    }
    private _onFocusOutInputPassword0(): void {
        const input = this._inputPassword0;
        input.setInputText(input.getInputText()?.trim() ?? ``);
    }
    private _onFocusOutInputPassword1(): void {
        const input = this._inputPassword1;
        input.setInputText(input.getInputText()?.trim() ?? ``);
    }
    private _onTouchedBtnReset(): void {
        const verificationCode = this._inputVerificationCode.getInputText()?.trim() ?? ``;
        if (verificationCode.length !== Emails_Constants.Common.VerificationCodeLength) {
            FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B1334)));
            return;
        }

        const account = this._inputAccount.getInputText()?.trim() ?? ``;
        if (!Users_Utils.checkIsAccountValid(account)) {
            FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0170)));
            return;
        }

        const password = this._inputPassword0.getInputText()?.trim() ?? ``;
        if (password !== this._inputPassword1.getInputText()?.trim()) {
            FloatText.showLang(Lang_Constants.TextType.A0147);
            return;
        }

        Users_Proxy.reqUserResetPasswordWithEmail(verificationCode, account, password);
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1336);
        this._labelAccount.setLangText(Lang_Constants.TextType.B0170);
        this._labelVerificationCode.setLangText(Lang_Constants.TextType.B1334);
        this._labelPassword0.setLangText(Lang_Constants.TextType.B0171);
        this._labelPassword1.setLangText(Lang_Constants.TextType.B0429);
        this._btnRequest.setLangText(Lang_Constants.TextType.B0382);
        this._btnReset.setLangText(Lang_Constants.TextType.B0567);
        this._labelStep1.setLangText(Lang_Constants.TextType.A0868);
        this._labelStep2.setLangText(Lang_Constants.TextType.A0869);

        this._layoutStep1.arrangeItems();
        this._layoutStep2.arrangeItems();
        this._layoutContent.arrangeItems();
        this._group.setUnscaledManualHeight(this._layoutContent.getScaledHeight() + 80);
    }

    private _updateInputAccount(): void {
        this._inputAccount.setInputText(this.getOpenData()?.account ?? ``);
    }
}
