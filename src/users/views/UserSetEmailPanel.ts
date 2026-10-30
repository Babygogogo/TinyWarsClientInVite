import {
    Graphics_Constants,
    Emails_Constants,
    GamePanels_Dict,
    Lang_Utils,
    Users_Model,
    Timer_TimerModel,
    GamePanels_Manager,
    Users_Proxy,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
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
import type { S as UserRequestEmailVerificationCodeResponse } from "../../proto/schema/CommonProto/NetMessage/MsgUserRequestEmailVerificationCode/S.ts";

let _lastRequestTimestamp = 0;

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelp!                  : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupStep!                : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _groupStep1!               : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelStep1!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelEmail!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputEmail!               : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _labelEmailState!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnRequest!               : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupStep2!               : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelStep2!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelVerificationCode!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputVerificationCode!    : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _btnVerify!                : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                             callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgUserRequestEmailVerificationCode,         callback : this._onNotifyMsgUserRequestEmailVerificationCode },
            { type : Notifications_TypeId.TypeId.MsgUserRequestEmailVerificationCodeFailed,   callback : this._onNotifyMsgUserRequestEmailVerificationCodeFailed },
            { type : Notifications_TypeId.TypeId.MsgUserVerifyEmail,                          callback : this._onNotifyMsgUserVerifyEmail },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,               callback : this.closePanel },
            { ui : this._btnHelp,                callback : this._onTouchedBtnHelp },

            { ui : this._btnRequest,             callback : this._onTouchedBtnRequest },
            { ui : this._btnVerify,              callback : this._onTouchedBtnVerify },
        ]);
        this._setInputListenerArray([
            { ui : this._inputEmail,             callback : this._onFocusOutInputEmail,               eventType : Ui_Types_UiInputEventType.UiInputEventType.FocusOut },
            { ui : this._inputVerificationCode,  callback : this._onFocusOutInputVerificationCode,    eventType : Ui_Types_UiInputEventType.UiInputEventType.FocusOut },
        ]);
        this._setIsTouchMaskEnabled();
        // this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._inputEmail.setInputMaxLength(Emails_Constants.Common.MaxAddressLength);
        this._inputVerificationCode.setInputMaxLength(Emails_Constants.Common.VerificationCodeLength);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateInputEmail();
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgUserRequestEmailVerificationCode(e: Egret_Egret.Event): void {
        FloatText.showLang(Lang_Constants.TextType.A0863);

        _lastRequestTimestamp = ((e.data as UserRequestEmailVerificationCodeResponse).getEndTimestamp() ?? 0) - Emails_Constants.Common.VerificationCodeExpiration;
        this._updateLabelEmailState();
    }
    private _onNotifyMsgUserRequestEmailVerificationCodeFailed(): void {
        // nothing to do
    }

    private _onNotifyMsgUserVerifyEmail(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
        this._updateLabelEmailState();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0862),
        });
    }

    private _onFocusOutInputEmail(): void {
        this._inputEmail.trimInputText();
        this._updateLabelEmailState();
    }
    private _onTouchedBtnRequest(): void {
        const address = this._inputEmail.trimInputText() ?? ``;
        if (!validateEmail(address)) {
            FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B1333)));
            return;
        }

        const cd = Emails_Constants.Common.VerificationCodeRefreshInterval - (Timer_TimerModel.getServerTimestamp() - _lastRequestTimestamp);
        if (cd >= 0) {
            FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0204, cd));
        } else {
            Users_Proxy.reqUserRequestEmailVerificationCode(address);
            FloatText.showLang(Lang_Constants.TextType.A0867);
        }
    }

    private _onFocusOutInputVerificationCode(): void {
        this._inputVerificationCode.trimInputText();
    }
    private _onTouchedBtnVerify(): void {
        const text = this._inputVerificationCode.trimInputText() ?? ``;
        if (text.length !== Emails_Constants.Common.VerificationCodeLength) {
            FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B1334)));
        } else {
            Users_Proxy.reqUserVerifyEmail(text);
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1332);
        this._labelEmail.setLangText(Lang_Constants.TextType.B1333);
        this._labelVerificationCode.setLangText(Lang_Constants.TextType.B1334);
        this._btnRequest.setLangText(Lang_Constants.TextType.B0382);
        this._btnVerify.setLangText(Lang_Constants.TextType.B1335);
        this._labelStep1.setLangText(Lang_Constants.TextType.A0860);
        this._labelStep2.setLangText(Lang_Constants.TextType.A0861);
        this._updateLabelEmailState();

        this._groupStep1.arrangeItems();
        this._groupStep2.arrangeItems();

        const groupStep = this._groupStep;
        groupStep.arrangeItems();
        this._group.setUnscaledManualHeight(groupStep.getScaledHeight() + 80);
    }

    private _updateInputEmail(): void {
        const selfInfo          = Users_Model.getSelfInfo();
        const userComplexInfo   = selfInfo?.getUserComplexInfo();
        const verifiedAddress   = selfInfo?.getEmailAddress() ?? ``;
        const input             = this._inputEmail;
        if (userComplexInfo) {
            const endTimestamp = userComplexInfo.getEmailVerificationEndTimestamp();
            if ((endTimestamp) && (endTimestamp > Timer_TimerModel.getServerTimestamp())) {
                input.setInputText(userComplexInfo.getUnverifiedEmailAddress() ?? verifiedAddress);
                return;
            }
        }

        input.setInputText(verifiedAddress);
    }

    private _updateLabelEmailState(): void {
        const text      = this._inputEmail.trimInputText();
        const label     = this._labelEmailState;
        const selfInfo  = Users_Model.getSelfInfo();
        if ((text) && (text === selfInfo?.getEmailAddress())) {
            label.setLangText(Lang_Constants.TextType.A0864);
            label.setTextColor(Graphics_Constants.ColorValue.Green);
        } else if ((text) && (text === selfInfo?.getUserComplexInfo()?.getUnverifiedEmailAddress())) {
            label.setLangText(Lang_Constants.TextType.A0866);
            label.setTextColor(Graphics_Constants.ColorValue.Yellow);
        } else {
            label.setLangText(Lang_Constants.TextType.A0865);
            label.setTextColor(Graphics_Constants.ColorValue.Dark);
        }
    }
}

function validateEmail(email: string): RegExpMatchArray | null {
    return email.toLocaleLowerCase().match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    );
}
