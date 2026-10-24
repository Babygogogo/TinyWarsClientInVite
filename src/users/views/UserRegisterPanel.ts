import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocalDataStorage2 from "../../localData/Storage.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserRegisterS from "../../proto/schema/CommonProto/NetMessage/MsgUserRegister/S.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiPromptedInput from "../../ui/interfaces/IUiPromptedInput.ts";
import * as UsersModel from "../Model.ts";
import * as UsersProxy from "../Proxy.ts";
import * as UsersUtils from "../Utils.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelp!          : UiInterfacesIUiButton.IUiButton;

    private readonly _labelAccount!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputAccount!     : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _labelPassword!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputPassword!    : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _labelNickname!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputNickname!    : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _btnRegister!      : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserRegister, callback: this._onMsgUserRegister },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
            { ui: this._btnHelp,        callback: this._onTouchedBtnHelp },
            { ui: this._btnRegister,    callback: this._onTouchedBtnRegister },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._btnRegister.setShortSfxCode(SoundsConstants.ShortSfxCode.ButtonConfirm01);

        this._updateComponentsForLanguage();
    }

    private _onMsgUserRegister(e: VendorEgretEgret.Event): void {
        const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserRegisterS.S;
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0004));

        const account   = HelpersMisc.getExisted(data.getAccount(), UtilsClientErrorCode.ClientErrorCode.UserRegisterPanel_OnMsgUserRegister_00);
        const password  = this._inputPassword.getInputText() ?? ``;
        LocalDataStorage2.setAccount(account);
        LocalDataStorage2.setPassword(password);
        UsersModel.setSelfAccount(account);
        UsersModel.setSelfPassword(password);
        UsersProxy.reqLogin(account, password, false);
    }
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.R0005),
        });
    }

    private _onTouchedBtnRegister(): void {
        const account  = this._inputAccount.getInputText() ?? ``;
        const password = this._inputPassword.getInputText() ?? ``;
        const nickname = this._inputNickname.getInputText() ?? ``;
        if (!UsersUtils.checkIsAccountValid(account)) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0001));
        } else if (account.toLocaleLowerCase().indexOf("guest_") === 0) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0367));
        } else if (!UsersUtils.checkIsPasswordValid(password)) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0003));
        } else if (!UsersUtils.checkIsNicknameValid(nickname)) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0002));
        } else if (nickname.toLocaleLowerCase().indexOf("guest_") === 0) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0368));
        } else {
            UsersProxy.reqUserRegister(account, password, nickname);
        }
    }

    private _updateComponentsForLanguage(): void {
        this._btnRegister.setLangText(LangConstants.TextType.B0174);
        this._btnClose.setLangText(LangConstants.TextType.B0154);
        this._labelTitle.setLangText(LangConstants.TextType.B0174);
        this._labelAccount.setLangText(LangConstants.TextType.B0170);
        this._labelPassword.setLangText(LangConstants.TextType.B0171);
        this._labelNickname.setLangText(LangConstants.TextType.B0175);
    }
}
