import * as FloatText2 from "../../FloatText.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocalDataStorage from "../../localData/Storage.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiPromptedInput from "../../ui/interfaces/IUiPromptedInput.ts";
import * as UsersModel from "../Model.ts";
import * as UsersProxy from "../Proxy.ts";
import * as UsersUtils from "../Utils.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelOldPasswordTitle!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputOldPassword!         : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _labelNewPasswordTitle0!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputNewPassword0!        : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _labelNewPasswordTitle1!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputNewPassword1!        : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _btnConfirm!               : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserSetPassword,  callback: this._onMsgUserSetPassword },
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
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0148));

        const password = this._inputNewPassword0.trimInputText() ?? ``;
        LocalDataStorage.setPassword(password);
        UsersModel.setSelfPassword(password);
        this.closePanel();
    }
    private _onNotifyLanguageChanged(): void {
        this._updateOnLanguageChanged();
    }

    private _onTouchedBtnConfirm(): void {
        const newPassword = this._inputNewPassword0.trimInputText() ?? ``;
        if (!UsersUtils.checkIsPasswordValid(newPassword)) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0003));
        } else if (newPassword !== this._inputNewPassword1.trimInputText()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0147));
        } else {
            UsersProxy.reqUserSetPassword(this._inputOldPassword.trimInputText() ?? ``, newPassword);
        }
    }

    private _updateOnLanguageChanged(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0426));
        this._labelOldPasswordTitle.setText(LangUtils.getText(LangConstants.TextType.B0427));
        this._labelNewPasswordTitle0.setText(LangUtils.getText(LangConstants.TextType.B0428));
        this._labelNewPasswordTitle1.setText(LangUtils.getText(LangConstants.TextType.B0429));
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
        this._btnClose.setText(LangUtils.getText(LangConstants.TextType.B0154));
    }
}
