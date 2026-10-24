import * as EmailsConstants from "../../emails/Constants.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserRequestEmailVerificationCodeS from "../../proto/schema/CommonProto/NetMessage/MsgUserRequestEmailVerificationCode/S.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiPromptedInput from "../../ui/interfaces/IUiPromptedInput.ts";
import * as UiTypesUiInputEventType from "../../ui/types/UiInputEventType.ts";
import * as UsersModel from "../Model.ts";
import * as UsersProxy from "../Proxy.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

let _lastRequestTimestamp = 0;

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelp!                  : UiInterfacesIUiButton.IUiButton;

    private readonly _groupStep!                : UiInterfacesIUiLayout.IUiLayout;

    private readonly _groupStep1!               : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelStep1!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelEmail!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputEmail!               : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _labelEmailState!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnRequest!               : UiInterfacesIUiButton.IUiButton;

    private readonly _groupStep2!               : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelStep2!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelVerificationCode!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputVerificationCode!    : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _btnVerify!                : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserRequestEmailVerificationCode,         callback: this._onNotifyMsgUserRequestEmailVerificationCode },
            { type: NotificationsTypeId.TypeId.MsgUserRequestEmailVerificationCodeFailed,   callback: this._onNotifyMsgUserRequestEmailVerificationCodeFailed },
            { type: NotificationsTypeId.TypeId.MsgUserVerifyEmail,                          callback: this._onNotifyMsgUserVerifyEmail },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnHelp,                callback: this._onTouchedBtnHelp },

            { ui: this._btnRequest,             callback: this._onTouchedBtnRequest },
            { ui: this._btnVerify,              callback: this._onTouchedBtnVerify },
        ]);
        this._setInputListenerArray([
            { ui: this._inputEmail,             callback: this._onFocusOutInputEmail,               eventType: UiTypesUiInputEventType.UiInputEventType.FocusOut },
            { ui: this._inputVerificationCode,  callback: this._onFocusOutInputVerificationCode,    eventType: UiTypesUiInputEventType.UiInputEventType.FocusOut },
        ]);
        this._setIsTouchMaskEnabled();
        // this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._inputEmail.setInputMaxLength(EmailsConstants.Common.MaxAddressLength);
        this._inputVerificationCode.setInputMaxLength(EmailsConstants.Common.VerificationCodeLength);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateInputEmail();
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgUserRequestEmailVerificationCode(e: VendorEgretEgret.Event): void {
        FloatText2.showLang(LangConstants.TextType.A0863);

        _lastRequestTimestamp = ((e.data as ProtoSchemaCommonProtoNetMessageMsgUserRequestEmailVerificationCodeS.S).getEndTimestamp() ?? 0) - EmailsConstants.Common.VerificationCodeExpiration;
        this._updateLabelEmailState();
    }
    private _onNotifyMsgUserRequestEmailVerificationCodeFailed(): void {
        // nothing to do
    }

    private _onNotifyMsgUserVerifyEmail(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
        this._updateLabelEmailState();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0862),
        });
    }

    private _onFocusOutInputEmail(): void {
        this._inputEmail.trimInputText();
        this._updateLabelEmailState();
    }
    private _onTouchedBtnRequest(): void {
        const address = this._inputEmail.trimInputText() ?? ``;
        if (!validateEmail(address)) {
            FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1333)));
            return;
        }

        const cd = EmailsConstants.Common.VerificationCodeRefreshInterval - (TimerTimerModel.getServerTimestamp() - _lastRequestTimestamp);
        if (cd >= 0) {
            FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0204, cd));
        } else {
            UsersProxy.reqUserRequestEmailVerificationCode(address);
            FloatText2.showLang(LangConstants.TextType.A0867);
        }
    }

    private _onFocusOutInputVerificationCode(): void {
        this._inputVerificationCode.trimInputText();
    }
    private _onTouchedBtnVerify(): void {
        const text = this._inputVerificationCode.trimInputText() ?? ``;
        if (text.length !== EmailsConstants.Common.VerificationCodeLength) {
            FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1334)));
        } else {
            UsersProxy.reqUserVerifyEmail(text);
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B1332));
        this._labelEmail.setText(LangUtils.getText(LangConstants.TextType.B1333));
        this._labelVerificationCode.setText(LangUtils.getText(LangConstants.TextType.B1334));
        this._btnRequest.setText(LangUtils.getText(LangConstants.TextType.B0382));
        this._btnVerify.setText(LangUtils.getText(LangConstants.TextType.B1335));
        this._labelStep1.setText(LangUtils.getText(LangConstants.TextType.A0860));
        this._labelStep2.setText(LangUtils.getText(LangConstants.TextType.A0861));
        this._updateLabelEmailState();

        this._groupStep1.arrangeItems();
        this._groupStep2.arrangeItems();

        const groupStep = this._groupStep;
        groupStep.arrangeItems();
        this._group.setUnscaledManualHeight(groupStep.getScaledHeight() + 80);
    }

    private _updateInputEmail(): void {
        const selfInfo          = UsersModel.getSelfInfo();
        const userComplexInfo   = selfInfo?.getUserComplexInfo();
        const verifiedAddress   = selfInfo?.getEmailAddress() ?? ``;
        const input             = this._inputEmail;
        if (userComplexInfo) {
            const endTimestamp = userComplexInfo.getEmailVerificationEndTimestamp();
            if ((endTimestamp) && (endTimestamp > TimerTimerModel.getServerTimestamp())) {
                input.setInputText(userComplexInfo.getUnverifiedEmailAddress() ?? verifiedAddress);
                return;
            }
        }

        input.setInputText(verifiedAddress);
    }

    private _updateLabelEmailState(): void {
        const text      = this._inputEmail.trimInputText();
        const label     = this._labelEmailState;
        const selfInfo  = UsersModel.getSelfInfo();
        if ((text) && (text === selfInfo?.getEmailAddress())) {
            label.setText(LangUtils.getText(LangConstants.TextType.A0864));
            label.setTextColor(GraphicsConstants.ColorValue.Green);
        } else if ((text) && (text === selfInfo?.getUserComplexInfo()?.getUnverifiedEmailAddress())) {
            label.setText(LangUtils.getText(LangConstants.TextType.A0866));
            label.setTextColor(GraphicsConstants.ColorValue.Yellow);
        } else {
            label.setText(LangUtils.getText(LangConstants.TextType.A0865));
            label.setTextColor(GraphicsConstants.ColorValue.Dark);
        }
    }
}

function validateEmail(email: string): RegExpMatchArray | null {
    return email.toLocaleLowerCase().match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    );
}
