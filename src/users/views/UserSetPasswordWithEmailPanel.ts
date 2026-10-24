import * as EmailsConstants from "../../emails/Constants.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserRequestPasswordVerificationCodeS from "../../proto/schema/CommonProto/NetMessage/MsgUserRequestPasswordVerificationCode/S.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiPromptedInput from "../../ui/interfaces/IUiPromptedInput.ts";
import * as UiTypesUiInputEventType from "../../ui/types/UiInputEventType.ts";
import * as UsersConstants from "../Constants.ts";
import * as UsersProxy from "../Proxy.ts";
import * as UsersUtils from "../Utils.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

let _lastRequestTimestamp = 0;

export interface OpenData {
    account     : string;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutContent!            : UiInterfacesIUiLayout.IUiLayout;

    private readonly _layoutStep1!              : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelStep1!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelAccount!             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputAccount!             : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _btnRequest!               : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutStep2!              : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelStep2!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelVerificationCode!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputVerificationCode!    : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _labelPassword0!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputPassword0!           : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _labelPassword1!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputPassword1!           : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _btnReset!                 : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserRequestPasswordVerificationCode,          callback: this._onNotifyMsgUserRequestPasswordVerificationCode },
            { type: NotificationsTypeId.TypeId.MsgUserRequestPasswordVerificationCodeFailed,    callback: this._onNotifyMsgUserRequestPasswordVerificationCodeFailed },
            { type: NotificationsTypeId.TypeId.MsgUserResetPasswordWithEmail,                   callback: this._onNotifyMsgUserResetPasswordWithEmail },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnRequest,             callback: this._onTouchedBtnRequest },
            { ui: this._btnReset,               callback: this._onTouchedBtnReset },
        ]);
        this._setInputListenerArray([
            { ui: this._inputAccount,           callback: this._onFocusOutInputAccount,             eventType: UiTypesUiInputEventType.UiInputEventType.FocusOut },
            { ui: this._inputVerificationCode,  callback: this._onFocusOutInputVerificationCode,    eventType: UiTypesUiInputEventType.UiInputEventType.FocusOut },
            { ui: this._inputPassword0,         callback: this._onFocusOutInputPassword0,           eventType: UiTypesUiInputEventType.UiInputEventType.FocusOut },
            { ui: this._inputPassword1,         callback: this._onFocusOutInputPassword1,           eventType: UiTypesUiInputEventType.UiInputEventType.FocusOut },
        ]);
        this._setIsTouchMaskEnabled();
        // this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._inputAccount.setInputMaxLength(UsersConstants.Common.AccountMaxLength);
        this._inputPassword0.setInputMaxLength(UsersConstants.Common.RawPasswordMaxLength);
        this._inputPassword1.setInputMaxLength(UsersConstants.Common.RawPasswordMaxLength);
        this._inputVerificationCode.setInputMaxLength(EmailsConstants.Common.VerificationCodeLength);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateInputAccount();
    }

    private _onNotifyMsgUserRequestPasswordVerificationCode(e: VendorEgretEgret.Event): void {
        FloatText2.showLang(LangConstants.TextType.A0863);

        _lastRequestTimestamp = ((e.data as ProtoSchemaCommonProtoNetMessageMsgUserRequestPasswordVerificationCodeS.S).getEndTimestamp() ?? 0) - EmailsConstants.Common.VerificationCodeExpiration;
    }
    private _onNotifyMsgUserRequestPasswordVerificationCodeFailed(): void {
        // nothing to do
    }

    private _onNotifyMsgUserResetPasswordWithEmail(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
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
        if (!UsersUtils.checkIsAccountValid(account)) {
            FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0170)));
            return;
        }

        const cd = EmailsConstants.Common.VerificationCodeRefreshInterval - (TimerTimerModel.getServerTimestamp() - _lastRequestTimestamp);
        if (cd >= 0) {
            FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0204, cd));
        } else {
            UsersProxy.reqUserRequestPasswordVerificationCode(account);
            FloatText2.showLang(LangConstants.TextType.A0867);
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
        if (verificationCode.length !== EmailsConstants.Common.VerificationCodeLength) {
            FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1334)));
            return;
        }

        const account = this._inputAccount.getInputText()?.trim() ?? ``;
        if (!UsersUtils.checkIsAccountValid(account)) {
            FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0170)));
            return;
        }

        const password = this._inputPassword0.getInputText()?.trim() ?? ``;
        if (password !== this._inputPassword1.getInputText()?.trim()) {
            FloatText2.showLang(LangConstants.TextType.A0147);
            return;
        }

        UsersProxy.reqUserResetPasswordWithEmail(verificationCode, account, password);
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B1336));
        this._labelAccount.setText(LangUtils.getText(LangConstants.TextType.B0170));
        this._labelVerificationCode.setText(LangUtils.getText(LangConstants.TextType.B1334));
        this._labelPassword0.setText(LangUtils.getText(LangConstants.TextType.B0171));
        this._labelPassword1.setText(LangUtils.getText(LangConstants.TextType.B0429));
        this._btnRequest.setText(LangUtils.getText(LangConstants.TextType.B0382));
        this._btnReset.setText(LangUtils.getText(LangConstants.TextType.B0567));
        this._labelStep1.setText(LangUtils.getText(LangConstants.TextType.A0868));
        this._labelStep2.setText(LangUtils.getText(LangConstants.TextType.A0869));

        this._layoutStep1.arrangeItems();
        this._layoutStep2.arrangeItems();
        this._layoutContent.arrangeItems();
        this._group.setUnscaledManualHeight(this._layoutContent.getScaledHeight() + 80);
    }

    private _updateInputAccount(): void {
        this._inputAccount.setInputText(this.getOpenData()?.account ?? ``);
    }
}
