import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as UsersConstants from "../Constants.ts";
import * as UsersModel from "../Model.ts";
import * as UsersProxy from "../Proxy.ts";
import * as UsersUtils from "../Utils.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _scroller!                 : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiContainer.IUiContainer>;

    private readonly _groupButtons!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnChangeAvatar!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnChangeNickname!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnChangePassword!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnChangeDiscordId!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnChangeMedal!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnChangeEmail!           : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserGetPublicInfo,            callback: this._onMsgUserGetPublicInfo },
            { type: NotificationsTypeId.TypeId.MsgUserSetNickname,              callback: this._onMsgUserSetNickname },
            { type: NotificationsTypeId.TypeId.MsgUserSetDiscordInfo,           callback: this._onMsgUserSetDiscordId },
            { type: NotificationsTypeId.TypeId.MsgUserSetShowMedalIdArray,      callback: this._onMsgUserSetShowMedalIdArray },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnChangeAvatar,        callback: this._onTouchedBtnChangeAvatar },
            { ui: this._btnChangeNickname,      callback: this._onTouchedBtnChangeNickname },
            { ui: this._btnChangePassword,      callback: this._onTouchedBtnChangePassword },
            { ui: this._btnChangeDiscordId,     callback: this._onTouchedBtnChangeDiscordId },
            { ui: this._btnChangeMedal,         callback: this._onTouchedBtnChangeMedal },
            { ui: this._btnChangeEmail,         callback: this._onTouchedBtnChangeEmail },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._scroller.scrollTop();
        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onMsgUserGetPublicInfo(): void {
        this._updateView();
    }
    private _onMsgUserSetNickname(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);

        const selfUserId = HelpersMisc.getExisted(UsersModel.getSelfUserId());
        UsersProxy.reqUserGetPublicInfo(selfUserId);
    }
    private _onMsgUserSetDiscordId(): void {
        const selfUserId = HelpersMisc.getExisted(UsersModel.getSelfUserId());
        UsersProxy.reqUserGetPublicInfo(selfUserId);
    }
    private _onMsgUserSetShowMedalIdArray(): void {
        FloatText2.show(LangUtils.getText(LangConstants.TextType.OperationSucceeded));
    }

    private _onTouchedBtnChangeAvatar(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserSetAvatarPanel, void 0);
    }
    private _onTouchedBtnChangeNickname(): void {
        const currentNickname = UsersModel.getSelfNickname() ?? ``;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
            title           : LangUtils.getText(LangConstants.TextType.B0149),
            tips            : LangUtils.getText(LangConstants.TextType.A0066),
            minLength       : UsersConstants.Common.NicknameMinLength,
            maxChars        : UsersConstants.Common.NicknameMaxLength,
            charRestrict    : null,
            currentValue    : currentNickname,
            callback        : panel => {
                const nickname = panel.getInputText();
                if (nickname === currentNickname) {
                    return;
                }

                if (!UsersUtils.checkIsNicknameValid(nickname)) {
                    FloatText2.showLang(LangConstants.TextType.A0002);
                } else {
                    UsersProxy.reqSetNickname(nickname);
                }
            },
        });
    }
    private _onTouchedBtnChangePassword(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserSetPasswordPanel, void 0);
    }
    private _onTouchedBtnChangeDiscordId(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserSetDiscordInfoPanel, void 0);
    }
    private _onTouchedBtnChangeMedal(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserMedalPanel, void 0);
    }
    private _onTouchedBtnChangeEmail(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserSetEmailPanel, void 0);
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateGroupButtons();
    }

    private _updateGroupButtons(): void {
        // nothing to do
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0560));
        this._btnChangeAvatar.setText(LangUtils.getText(LangConstants.TextType.B0707));
        this._btnChangeNickname.setText(LangUtils.getText(LangConstants.TextType.B0175));
        this._btnChangePassword.setText(LangUtils.getText(LangConstants.TextType.B0171));
        this._btnChangeDiscordId.setText(LangUtils.getText(LangConstants.TextType.B0150));
        this._btnChangeMedal.setText(LangUtils.getText(LangConstants.TextType.B1018));
        this._btnChangeEmail.setText(LangUtils.getText(LangConstants.TextType.B1332));
    }
}
