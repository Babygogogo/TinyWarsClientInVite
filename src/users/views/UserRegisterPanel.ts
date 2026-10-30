import { show } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import {
    setAccount,
    setPassword,
} from "../../localData/Storage.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S as UserRegisterResponse } from "../../proto/schema/CommonProto/NetMessage/MsgUserRegister/S.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiPromptedInput } from "../../ui/interfaces/IUiPromptedInput.ts";
import {
    setSelfAccount,
    setSelfPassword,
} from "../Model.ts";
import {
    reqLogin,
    reqUserRegister,
} from "../Proxy.ts";
import {
    checkIsAccountValid,
    checkIsPasswordValid,
    checkIsNicknameValid,
} from "../Utils.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import type { Event } from "../../egret/Egret.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnClose!         : IUiButton;
    private readonly _btnHelp!          : IUiButton;

    private readonly _labelAccount!     : IUiLabel;
    private readonly _inputAccount!     : IUiPromptedInput;
    private readonly _labelPassword!    : IUiLabel;
    private readonly _inputPassword!    : IUiPromptedInput;
    private readonly _labelNickname!    : IUiLabel;
    private readonly _inputNickname!    : IUiPromptedInput;
    private readonly _btnRegister!      : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserRegister, callback: this._onMsgUserRegister },
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

        this._btnRegister.setShortSfxCode(ShortSfxCode.ButtonConfirm01);

        this._updateComponentsForLanguage();
    }

    private _onMsgUserRegister(e: Event): void {
        const data = e.data as UserRegisterResponse;
        show(getText(TextType.A0004));

        const account   = getExisted(data.getAccount(), ClientErrorCode.UserRegisterPanel_OnMsgUserRegister_00);
        const password  = this._inputPassword.getInputText() ?? ``;
        setAccount(account);
        setPassword(password);
        setSelfAccount(account);
        setSelfPassword(password);
        reqLogin(account, password, false);
    }
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.R0005),
        });
    }

    private _onTouchedBtnRegister(): void {
        const account  = this._inputAccount.getInputText() ?? ``;
        const password = this._inputPassword.getInputText() ?? ``;
        const nickname = this._inputNickname.getInputText() ?? ``;
        if (!checkIsAccountValid(account)) {
            show(getText(TextType.A0001));
        } else if (account.toLocaleLowerCase().indexOf("guest_") === 0) {
            show(getText(TextType.A0367));
        } else if (!checkIsPasswordValid(password)) {
            show(getText(TextType.A0003));
        } else if (!checkIsNicknameValid(nickname)) {
            show(getText(TextType.A0002));
        } else if (nickname.toLocaleLowerCase().indexOf("guest_") === 0) {
            show(getText(TextType.A0368));
        } else {
            reqUserRegister(account, password, nickname);
        }
    }

    private _updateComponentsForLanguage(): void {
        this._btnRegister.setLangText(TextType.B0174);
        this._btnClose.setLangText(TextType.B0154);
        this._labelTitle.setLangText(TextType.B0174);
        this._labelAccount.setLangText(TextType.B0170);
        this._labelPassword.setLangText(TextType.B0171);
        this._labelNickname.setLangText(TextType.B0175);
    }
}
