import { Common } from "../../emails/Constants.ts";
import {
    showLang,
    show,
} from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getText,
    getFormattedText,
} from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S as UserRequestEmailVerificationCodeResponse } from "../../proto/schema/CommonProto/NetMessage/MsgUserRequestEmailVerificationCode/S.ts";
import { getServerTimestamp } from "../../timer/TimerModel.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiPromptedInput } from "../../ui/interfaces/IUiPromptedInput.ts";
import { UiInputEventType } from "../../ui/types/UiInputEventType.ts";
import { getSelfInfo } from "../Model.ts";
import {
    reqUserRequestEmailVerificationCode,
    reqUserVerifyEmail,
} from "../Proxy.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

let _lastRequestTimestamp = 0;

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _group!                    : IUiContainer;
    private readonly _labelTitle!               : IUiLabel;
    private readonly _btnClose!                 : IUiButton;
    private readonly _btnHelp!                  : IUiButton;

    private readonly _groupStep!                : IUiLayout;

    private readonly _groupStep1!               : IUiLayout;
    private readonly _labelStep1!               : IUiLabel;
    private readonly _labelEmail!               : IUiLabel;
    private readonly _inputEmail!               : IUiPromptedInput;
    private readonly _labelEmailState!          : IUiLabel;
    private readonly _btnRequest!               : IUiButton;

    private readonly _groupStep2!               : IUiLayout;
    private readonly _labelStep2!               : IUiLabel;
    private readonly _labelVerificationCode!    : IUiLabel;
    private readonly _inputVerificationCode!    : IUiPromptedInput;
    private readonly _btnVerify!                : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                             callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserRequestEmailVerificationCode,         callback: this._onNotifyMsgUserRequestEmailVerificationCode },
            { type: TypeId.MsgUserRequestEmailVerificationCodeFailed,   callback: this._onNotifyMsgUserRequestEmailVerificationCodeFailed },
            { type: TypeId.MsgUserVerifyEmail,                          callback: this._onNotifyMsgUserVerifyEmail },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnHelp,                callback: this._onTouchedBtnHelp },

            { ui: this._btnRequest,             callback: this._onTouchedBtnRequest },
            { ui: this._btnVerify,              callback: this._onTouchedBtnVerify },
        ]);
        this._setInputListenerArray([
            { ui: this._inputEmail,             callback: this._onFocusOutInputEmail,               eventType: UiInputEventType.FocusOut },
            { ui: this._inputVerificationCode,  callback: this._onFocusOutInputVerificationCode,    eventType: UiInputEventType.FocusOut },
        ]);
        this._setIsTouchMaskEnabled();
        // this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._inputEmail.setInputMaxLength(Common.MaxAddressLength);
        this._inputVerificationCode.setInputMaxLength(Common.VerificationCodeLength);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateInputEmail();
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgUserRequestEmailVerificationCode(e: Event): void {
        showLang(TextType.A0863);

        _lastRequestTimestamp = ((e.data as UserRequestEmailVerificationCodeResponse).getEndTimestamp() ?? 0) - Common.VerificationCodeExpiration;
        this._updateLabelEmailState();
    }
    private _onNotifyMsgUserRequestEmailVerificationCodeFailed(): void {
        // nothing to do
    }

    private _onNotifyMsgUserVerifyEmail(): void {
        showLang(TextType.OperationSucceeded);
        this._updateLabelEmailState();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0862),
        });
    }

    private _onFocusOutInputEmail(): void {
        this._inputEmail.trimInputText();
        this._updateLabelEmailState();
    }
    private _onTouchedBtnRequest(): void {
        const address = this._inputEmail.trimInputText() ?? ``;
        if (!validateEmail(address)) {
            show(getFormattedText(TextType.F0091, getText(TextType.B1333)));
            return;
        }

        const cd = Common.VerificationCodeRefreshInterval - (getServerTimestamp() - _lastRequestTimestamp);
        if (cd >= 0) {
            show(getFormattedText(TextType.F0204, cd));
        } else {
            reqUserRequestEmailVerificationCode(address);
            showLang(TextType.A0867);
        }
    }

    private _onFocusOutInputVerificationCode(): void {
        this._inputVerificationCode.trimInputText();
    }
    private _onTouchedBtnVerify(): void {
        const text = this._inputVerificationCode.trimInputText() ?? ``;
        if (text.length !== Common.VerificationCodeLength) {
            show(getFormattedText(TextType.F0091, getText(TextType.B1334)));
        } else {
            reqUserVerifyEmail(text);
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B1332);
        this._labelEmail.setLangText(TextType.B1333);
        this._labelVerificationCode.setLangText(TextType.B1334);
        this._btnRequest.setLangText(TextType.B0382);
        this._btnVerify.setLangText(TextType.B1335);
        this._labelStep1.setLangText(TextType.A0860);
        this._labelStep2.setLangText(TextType.A0861);
        this._updateLabelEmailState();

        this._groupStep1.arrangeItems();
        this._groupStep2.arrangeItems();

        const groupStep = this._groupStep;
        groupStep.arrangeItems();
        this._group.setUnscaledManualHeight(groupStep.getScaledHeight() + 80);
    }

    private _updateInputEmail(): void {
        const selfInfo          = getSelfInfo();
        const userComplexInfo   = selfInfo?.getUserComplexInfo();
        const verifiedAddress   = selfInfo?.getEmailAddress() ?? ``;
        const input             = this._inputEmail;
        if (userComplexInfo) {
            const endTimestamp = userComplexInfo.getEmailVerificationEndTimestamp();
            if ((endTimestamp) && (endTimestamp > getServerTimestamp())) {
                input.setInputText(userComplexInfo.getUnverifiedEmailAddress() ?? verifiedAddress);
                return;
            }
        }

        input.setInputText(verifiedAddress);
    }

    private _updateLabelEmailState(): void {
        const text      = this._inputEmail.trimInputText();
        const label     = this._labelEmailState;
        const selfInfo  = getSelfInfo();
        if ((text) && (text === selfInfo?.getEmailAddress())) {
            label.setLangText(TextType.A0864);
            label.setTextColor(ColorValue.Green);
        } else if ((text) && (text === selfInfo?.getUserComplexInfo()?.getUnverifiedEmailAddress())) {
            label.setLangText(TextType.A0866);
            label.setTextColor(ColorValue.Yellow);
        } else {
            label.setLangText(TextType.A0865);
            label.setTextColor(ColorValue.Dark);
        }
    }
}

function validateEmail(email: string): RegExpMatchArray | null {
    return email.toLocaleLowerCase().match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    );
}
