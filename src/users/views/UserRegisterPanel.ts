import {
    Users_Utils,
    Utils_ClientErrorCode,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    GamePanels_Manager,
    Users_Proxy,
    LocalData_Storage,
    Users_Model,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiPromptedInput,
} from "../../internal.ts";
import type { S as UserRegisterResponse } from "../../proto/schema/CommonProto/NetMessage/MsgUserRegister/S.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelp!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelAccount!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputAccount!     : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _labelPassword!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputPassword!    : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _labelNickname!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputNickname!    : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _btnRegister!      : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged, callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgUserRegister, callback : this._onMsgUserRegister },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,       callback : this.closePanel },
            { ui : this._btnHelp,        callback : this._onTouchedBtnHelp },
            { ui : this._btnRegister,    callback : this._onTouchedBtnRegister },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._btnRegister.setShortSfxCode(Sounds_Constants.ShortSfxCode.ButtonConfirm01);

        this._updateComponentsForLanguage();
    }

    private _onMsgUserRegister(e: Egret_Egret.Event): void {
        const data = e.data as UserRegisterResponse;
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0004));

        const account   = Helpers_Misc.getExisted(data.getAccount(), Utils_ClientErrorCode.ClientErrorCode.UserRegisterPanel_OnMsgUserRegister_00);
        const password  = this._inputPassword.getInputText() ?? ``;
        LocalData_Storage.setAccount(account);
        LocalData_Storage.setPassword(password);
        Users_Model.setSelfAccount(account);
        Users_Model.setSelfPassword(password);
        Users_Proxy.reqLogin(account, password, false);
    }
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.R0005),
        });
    }

    private _onTouchedBtnRegister(): void {
        const account  = this._inputAccount.getInputText() ?? ``;
        const password = this._inputPassword.getInputText() ?? ``;
        const nickname = this._inputNickname.getInputText() ?? ``;
        if (!Users_Utils.checkIsAccountValid(account)) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0001));
        } else if (account.toLocaleLowerCase().indexOf("guest_") === 0) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0367));
        } else if (!Users_Utils.checkIsPasswordValid(password)) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0003));
        } else if (!Users_Utils.checkIsNicknameValid(nickname)) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0002));
        } else if (nickname.toLocaleLowerCase().indexOf("guest_") === 0) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0368));
        } else {
            Users_Proxy.reqUserRegister(account, password, nickname);
        }
    }

    private _updateComponentsForLanguage(): void {
        this._btnRegister.setLangText(Lang_Constants.TextType.B0174);
        this._btnClose.setLangText(Lang_Constants.TextType.B0154);
        this._labelTitle.setLangText(Lang_Constants.TextType.B0174);
        this._labelAccount.setLangText(Lang_Constants.TextType.B0170);
        this._labelPassword.setLangText(Lang_Constants.TextType.B0171);
        this._labelNickname.setLangText(Lang_Constants.TextType.B0175);
    }
}
