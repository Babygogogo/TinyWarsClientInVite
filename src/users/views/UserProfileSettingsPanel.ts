import {
    Users_Utils,
    Users_Constants,
    GamePanels_Dict,
    Helpers_Misc,
    Users_Model,
    Lang_Utils,
    GamePanels_Manager,
    Users_Proxy,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScroller,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _scroller!                 : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiContainer.IUiContainer>;

    private readonly _groupButtons!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnChangeAvatar!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnChangeNickname!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnChangePassword!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnChangeDiscordId!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnChangeMedal!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnChangeEmail!           : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.MsgUserGetPublicInfo,            callback: this._onMsgUserGetPublicInfo },
            { type: Notifications_TypeId.TypeId.MsgUserSetNickname,              callback: this._onMsgUserSetNickname },
            { type: Notifications_TypeId.TypeId.MsgUserSetDiscordInfo,           callback: this._onMsgUserSetDiscordId },
            { type: Notifications_TypeId.TypeId.MsgUserSetShowMedalIdArray,      callback: this._onMsgUserSetShowMedalIdArray },
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
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);

        const selfUserId = Helpers_Misc.getExisted(Users_Model.getSelfUserId());
        Users_Proxy.reqUserGetPublicInfo(selfUserId);
    }
    private _onMsgUserSetDiscordId(): void {
        const selfUserId = Helpers_Misc.getExisted(Users_Model.getSelfUserId());
        Users_Proxy.reqUserGetPublicInfo(selfUserId);
    }
    private _onMsgUserSetShowMedalIdArray(): void {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.OperationSucceeded));
    }

    private _onTouchedBtnChangeAvatar(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserSetAvatarPanel, void 0);
    }
    private _onTouchedBtnChangeNickname(): void {
        const currentNickname = Users_Model.getSelfNickname() ?? ``;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
            title           : Lang_Utils.getText(Lang_Constants.TextType.B0149),
            tips            : Lang_Utils.getText(Lang_Constants.TextType.A0066),
            minLength       : Users_Constants.Common.NicknameMinLength,
            maxChars        : Users_Constants.Common.NicknameMaxLength,
            charRestrict    : null,
            currentValue    : currentNickname,
            callback        : panel => {
                const nickname = panel.getInputText();
                if (nickname === currentNickname) {
                    return;
                }

                if (!Users_Utils.checkIsNicknameValid(nickname)) {
                    FloatText.showLang(Lang_Constants.TextType.A0002);
                } else {
                    Users_Proxy.reqSetNickname(nickname);
                }
            },
        });
    }
    private _onTouchedBtnChangePassword(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserSetPasswordPanel, void 0);
    }
    private _onTouchedBtnChangeDiscordId(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserSetDiscordInfoPanel, void 0);
    }
    private _onTouchedBtnChangeMedal(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserMedalPanel, void 0);
    }
    private _onTouchedBtnChangeEmail(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserSetEmailPanel, void 0);
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateGroupButtons();
    }

    private _updateGroupButtons(): void {
        // nothing to do
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0560);
        this._btnChangeAvatar.setLangText(Lang_Constants.TextType.B0707);
        this._btnChangeNickname.setLangText(Lang_Constants.TextType.B0175);
        this._btnChangePassword.setLangText(Lang_Constants.TextType.B0171);
        this._btnChangeDiscordId.setLangText(Lang_Constants.TextType.B0150);
        this._btnChangeMedal.setLangText(Lang_Constants.TextType.B1018);
        this._btnChangeEmail.setLangText(Lang_Constants.TextType.B1332);
    }
}
