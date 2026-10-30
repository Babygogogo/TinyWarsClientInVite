import {
    Users_Utils,
    Lang_Utils,
    Users_Proxy,
    LocalData_Storage,
    Users_Model,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiPromptedInput,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelOldPasswordTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputOldPassword!         : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _labelNewPasswordTitle0!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputNewPassword0!        : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _labelNewPasswordTitle1!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputNewPassword1!        : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _btnConfirm!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.MsgUserSetPassword,  callback: this._onMsgUserSetPassword },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,   callback: this.closePanel },
            { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._updateOnLanguageChanged();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        // nothing to do
    }

    private _onMsgUserSetPassword(): void {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0148));

        const password = this._inputNewPassword0.trimInputText() ?? ``;
        LocalData_Storage.setPassword(password);
        Users_Model.setSelfPassword(password);
        this.closePanel();
    }
    private _onNotifyLanguageChanged(): void {
        this._updateOnLanguageChanged();
    }

    private _onTouchedBtnConfirm(): void {
        const newPassword = this._inputNewPassword0.trimInputText() ?? ``;
        if (!Users_Utils.checkIsPasswordValid(newPassword)) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0003));
        } else if (newPassword !== this._inputNewPassword1.trimInputText()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0147));
        } else {
            Users_Proxy.reqUserSetPassword(this._inputOldPassword.trimInputText() ?? ``, newPassword);
        }
    }

    private _updateOnLanguageChanged(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0426);
        this._labelOldPasswordTitle.setLangText(Lang_Constants.TextType.B0427);
        this._labelNewPasswordTitle0.setLangText(Lang_Constants.TextType.B0428);
        this._labelNewPasswordTitle1.setLangText(Lang_Constants.TextType.B0429);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnClose.setLangText(Lang_Constants.TextType.B0154);
    }
}
