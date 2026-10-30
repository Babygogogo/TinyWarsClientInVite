import { Common as EmailsCommon } from "../../emails/Constants.ts";
import {
    showLang,
    show,
} from "../../FloatText.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getFormattedText,
    getText,
} from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S as UserRequestPasswordVerificationCodeResponse } from "../../proto/schema/CommonProto/NetMessage/MsgUserRequestPasswordVerificationCode/S.ts";
import { getServerTimestamp } from "../../timer/TimerModel.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiPromptedInput } from "../../ui/interfaces/IUiPromptedInput.ts";
import { UiInputEventType } from "../../ui/types/UiInputEventType.ts";
import { Common as ConstantsCommon } from "../Constants.ts";
import {
    reqUserRequestPasswordVerificationCode,
    reqUserResetPasswordWithEmail,
} from "../Proxy.ts";
import { checkIsAccountValid } from "../Utils.ts";
import type { Event } from "../../egret/Egret.ts";

let _lastRequestTimestamp = 0;

export interface OpenData {
    account     : string;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _group!                    : IUiContainer;
    private readonly _labelTitle!               : IUiLabel;
    private readonly _btnClose!                 : IUiButton;
    private readonly _layoutContent!            : IUiLayout;

    private readonly _layoutStep1!              : IUiLayout;
    private readonly _labelStep1!               : IUiLabel;
    private readonly _labelAccount!             : IUiLabel;
    private readonly _inputAccount!             : IUiPromptedInput;
    private readonly _btnRequest!               : IUiButton;

    private readonly _layoutStep2!              : IUiLayout;
    private readonly _labelStep2!               : IUiLabel;
    private readonly _labelVerificationCode!    : IUiLabel;
    private readonly _inputVerificationCode!    : IUiPromptedInput;
    private readonly _labelPassword0!           : IUiLabel;
    private readonly _inputPassword0!           : IUiPromptedInput;
    private readonly _labelPassword1!           : IUiLabel;
    private readonly _inputPassword1!           : IUiPromptedInput;
    private readonly _btnReset!                 : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserRequestPasswordVerificationCode,          callback: this._onNotifyMsgUserRequestPasswordVerificationCode },
            { type: TypeId.MsgUserRequestPasswordVerificationCodeFailed,    callback: this._onNotifyMsgUserRequestPasswordVerificationCodeFailed },
            { type: TypeId.MsgUserResetPasswordWithEmail,                   callback: this._onNotifyMsgUserResetPasswordWithEmail },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnRequest,             callback: this._onTouchedBtnRequest },
            { ui: this._btnReset,               callback: this._onTouchedBtnReset },
        ]);
        this._setInputListenerArray([
            { ui: this._inputAccount,           callback: this._onFocusOutInputAccount,             eventType: UiInputEventType.FocusOut },
            { ui: this._inputVerificationCode,  callback: this._onFocusOutInputVerificationCode,    eventType: UiInputEventType.FocusOut },
            { ui: this._inputPassword0,         callback: this._onFocusOutInputPassword0,           eventType: UiInputEventType.FocusOut },
            { ui: this._inputPassword1,         callback: this._onFocusOutInputPassword1,           eventType: UiInputEventType.FocusOut },
        ]);
        this._setIsTouchMaskEnabled();
        // this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._inputAccount.setInputMaxLength(ConstantsCommon.AccountMaxLength);
        this._inputPassword0.setInputMaxLength(ConstantsCommon.RawPasswordMaxLength);
        this._inputPassword1.setInputMaxLength(ConstantsCommon.RawPasswordMaxLength);
        this._inputVerificationCode.setInputMaxLength(EmailsCommon.VerificationCodeLength);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateInputAccount();
    }

    private _onNotifyMsgUserRequestPasswordVerificationCode(e: Event): void {
        showLang(TextType.A0863);

        _lastRequestTimestamp = ((e.data as UserRequestPasswordVerificationCodeResponse).getEndTimestamp() ?? 0) - EmailsCommon.VerificationCodeExpiration;
    }
    private _onNotifyMsgUserRequestPasswordVerificationCodeFailed(): void {
        // nothing to do
    }

    private _onNotifyMsgUserResetPasswordWithEmail(): void {
        showLang(TextType.OperationSucceeded);
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
        if (!checkIsAccountValid(account)) {
            show(getFormattedText(TextType.F0091, getText(TextType.B0170)));
            return;
        }

        const cd = EmailsCommon.VerificationCodeRefreshInterval - (getServerTimestamp() - _lastRequestTimestamp);
        if (cd >= 0) {
            show(getFormattedText(TextType.F0204, cd));
        } else {
            reqUserRequestPasswordVerificationCode(account);
            showLang(TextType.A0867);
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
        if (verificationCode.length !== EmailsCommon.VerificationCodeLength) {
            show(getFormattedText(TextType.F0091, getText(TextType.B1334)));
            return;
        }

        const account = this._inputAccount.getInputText()?.trim() ?? ``;
        if (!checkIsAccountValid(account)) {
            show(getFormattedText(TextType.F0091, getText(TextType.B0170)));
            return;
        }

        const password = this._inputPassword0.getInputText()?.trim() ?? ``;
        if (password !== this._inputPassword1.getInputText()?.trim()) {
            showLang(TextType.A0147);
            return;
        }

        reqUserResetPasswordWithEmail(verificationCode, account, password);
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B1336);
        this._labelAccount.setLangText(TextType.B0170);
        this._labelVerificationCode.setLangText(TextType.B1334);
        this._labelPassword0.setLangText(TextType.B0171);
        this._labelPassword1.setLangText(TextType.B0429);
        this._btnRequest.setLangText(TextType.B0382);
        this._btnReset.setLangText(TextType.B0567);
        this._labelStep1.setLangText(TextType.A0868);
        this._labelStep2.setLangText(TextType.A0869);

        this._layoutStep1.arrangeItems();
        this._layoutStep2.arrangeItems();
        this._layoutContent.arrangeItems();
        this._group.setUnscaledManualHeight(this._layoutContent.getScaledHeight() + 80);
    }

    private _updateInputAccount(): void {
        this._inputAccount.setInputText(this.getOpenData()?.account ?? ``);
    }
}
