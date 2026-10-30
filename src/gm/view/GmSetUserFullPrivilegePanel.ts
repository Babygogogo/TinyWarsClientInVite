import {
    GamePanels_Dict,
    Users_Model,
    Lang_Utils,
    Helpers_PointerInput,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Gm_Model_GmProxy,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";
import { UserPrivilege } from "../../proto/schema/CommonProto/User/UserPrivilege.ts";

export interface OpenData {
    userId  : number;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnSearchUser!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelUserName!                : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupPrivilege!               : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _groupIsAdmin!                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgIsAdmin!                   : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelIsAdmin!                 : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupCanLogin!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgCanLogin!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelCanLogin!                : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupIsMapCommittee!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgIsMapCommittee!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelIsMapCommittee!          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupIsChangeLogEditor!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgIsChangeLogEditor!         : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelIsChangeLogEditor!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupIsCampaignManager!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgIsCampaignManager!         : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelIsCampaignManager!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupCanChat!                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgCanChat!                   : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelCanChat!                 : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupChatManager!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgChatManager!               : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelChatManager!             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupAutoTourneyCommittee!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgAutoTourneyCommittee!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelAutoTourneyCommittee!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnCancel!                    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm!                   : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.MsgGmSetUserPrivilege,   callback: this._onNotifyMsgUserSetPrivilege },
        ]);
        this._setUiListenerArray([
            { ui: this._btnSearchUser,                  callback: this._onTouchedBtnSearchUser },
            { ui: this._btnConfirm,                     callback: this._onTouchedBtnConfirm },
            { ui: this._btnCancel,                      callback: this.closePanel },
            { ui: this._groupCanChat,                   callback: this._onTouchedGroupCanChat },
            { ui: this._groupChatManager,               callback: this._onTouchedGroupChatManager },
            { ui: this._groupAutoTourneyCommittee,      callback: this._onTouchedGroupAutoTourneyCommittee },
            { ui: this._groupCanLogin,                  callback: this._onTouchedGroupCanLogin },
            { ui: this._groupIsAdmin,                   callback: this._onTouchedGroupIsAdmin },
            { ui: this._groupIsChangeLogEditor,         callback: this._onTouchedGroupIsChangeLogEditor },
            { ui: this._groupIsMapCommittee,            callback: this._onTouchedGroupIsMapCommittee },
            { ui: this._groupIsCampaignManager,         callback: this._onTouchedGroupIsCampaignManager },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        applyTouchEnabled(this._groupAutoTourneyCommittee);
        applyTouchEnabled(this._groupCanChat);
        applyTouchEnabled(this._groupCanLogin);
        applyTouchEnabled(this._groupChatManager);
        applyTouchEnabled(this._groupIsAdmin);
        applyTouchEnabled(this._groupIsCampaignManager);
        applyTouchEnabled(this._groupIsChangeLogEditor);
        applyTouchEnabled(this._groupIsMapCommittee);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._resetComponentsForPrivilege();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgUserSetPrivilege(): void {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0157));
    }

    private _onTouchedBtnSearchUser(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonSearchSingleUserPanel, {
            getTitleText        : null,
            callbackOnConfirm   : userId => GamePanels_Manager.openPanel(GamePanels_Dict.getDict().GmSetUserFullPrivilegePanel, {
                userId  : userId,
            }),
        });
    }

    private _onTouchedBtnConfirm(): void {
        const userId = this._getUserId();
        if (userId) {
            Gm_Model_GmProxy.reqGmSetUserPrivilege(userId, UserPrivilege.fromJson({
                canChat                 : !!this._imgCanChat.getIsVisible(),
                canLogin                : !!this._imgCanLogin.getIsVisible(),
                isAdmin                 : !!this._imgIsAdmin.getIsVisible(),
                isChangeLogEditor       : !!this._imgIsChangeLogEditor.getIsVisible(),
                isMapCommittee          : !!this._imgIsMapCommittee.getIsVisible(),
                isChatManager           : !!this._imgChatManager.getIsVisible(),
                isAutoTourneyCommittee  : !!this._imgAutoTourneyCommittee.getIsVisible(),
                isCampaignManager       : !!this._imgIsCampaignManager.getIsVisible(),
            }));
        }
    }

    private _onTouchedGroupCanChat(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        const img = this._imgCanChat;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupChatManager(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        const img = this._imgChatManager;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupAutoTourneyCommittee(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        const img = this._imgAutoTourneyCommittee;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupCanLogin(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        const img = this._imgCanLogin;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupIsAdmin(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        const img = this._imgIsAdmin;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupIsChangeLogEditor(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        const img = this._imgIsChangeLogEditor;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupIsMapCommittee(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        const img = this._imgIsMapCommittee;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupIsCampaignManager(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        const img = this._imgIsCampaignManager;
        img.setIsVisible(!img.getIsVisible());
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0460);
        this._btnSearchUser.setLangText(Lang_Constants.TextType.B0228);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnCancel.setLangText(Lang_Constants.TextType.B0154);
        this._labelCanChat.setLangText(Lang_Constants.TextType.B0383);
        this._labelCanLogin.setLangText(Lang_Constants.TextType.B0173);
        this._labelIsAdmin.setLangText(Lang_Constants.TextType.B1116);
        this._labelChatManager.setLangText(Lang_Constants.TextType.B1117);
        this._labelIsChangeLogEditor.setLangText(Lang_Constants.TextType.B1118);
        this._labelIsMapCommittee.setLangText(Lang_Constants.TextType.B1119);
        this._labelAutoTourneyCommittee.setLangText(Lang_Constants.TextType.B1120);
        this._labelIsCampaignManager.setLangText(Lang_Constants.TextType.B1132);
        this._updateLabelUserName();
    }
    private async _updateLabelUserName(): Promise<void> {
        const userId = this._getUserId();
        if (userId == null) {
            return;
        }

        const nickname = await Users_Model.getUserNickname(userId);
        if (userId === this._getUserId()) {
            this._labelUserName.setText(`#${userId} ${nickname ?? Lang_Constants.UndefinedError}`);
        }
    }

    private _resetComponentsForPrivilege(): void {
        this._resetComponentsForSelfPrivilege();
        this._resetComponentsForTargetPrivilege();
    }
    private _resetComponentsForSelfPrivilege(): void {
        const group = this._groupPrivilege;
        group.removeAllItems(false);

        const privilege = Users_Model.getSelfUserPrivilege();
        if (privilege == null) {
            return;
        }

        let canSetIsAdmin               = false;
        let canSetChatManager           = false;
        let canSetIsChangeLogEditor     = false;
        let canSetAutoTourneyCommittee  = false;
        let canSetIsMapCommittee        = false;
        let canSetCanLogin              = false;
        let canSetCanChat               = false;
        let canSetIsCampaignManager     = false;

        if (privilege.getIsAdmin()) {
            canSetIsAdmin               = true;
            canSetChatManager           = true;
            canSetIsChangeLogEditor     = true;
            canSetAutoTourneyCommittee  = true;
            canSetIsMapCommittee        = true;
            canSetCanLogin              = true;
            canSetCanChat               = true;
            canSetIsCampaignManager     = true;
        }
        if (privilege.getIsChatManager()) {
            canSetCanChat = true;
        }

        (canSetIsAdmin)                 && (group.addItem(this._groupIsAdmin, false));
        (canSetChatManager)             && (group.addItem(this._groupChatManager, false));
        (canSetIsChangeLogEditor)       && (group.addItem(this._groupIsChangeLogEditor, false));
        (canSetAutoTourneyCommittee)    && (group.addItem(this._groupAutoTourneyCommittee, false));
        (canSetIsMapCommittee)          && (group.addItem(this._groupIsMapCommittee, false));
        (canSetIsCampaignManager)       && (group.addItem(this._groupIsCampaignManager, false));
        (canSetCanLogin)                && (group.addItem(this._groupCanLogin, false));
        (canSetCanChat)                 && (group.addItem(this._groupCanChat, false));

        group.arrangeItems();
    }
    private async _resetComponentsForTargetPrivilege(): Promise<void> {
        const userId = this._getUserId();
        if (userId == null) {
            return;
        }

        const privilege = (await Users_Model.getUserPublicInfo(userId))?.getUserPrivilege();
        const isValid   = userId === this._getUserId();
        this._imgCanChat.setIsVisible((isValid) && (privilege != null) && (privilege.getCanChat()));
        this._imgChatManager.setIsVisible((isValid) && (privilege != null) && (privilege.getIsChatManager()));
        this._imgCanLogin.setIsVisible((isValid) && (privilege != null) && (privilege.getCanLogin()));
        this._imgIsAdmin.setIsVisible((isValid) && (privilege != null) && (privilege.getIsAdmin()));
        this._imgIsChangeLogEditor.setIsVisible((isValid) && (privilege != null) && (privilege.getIsChangeLogEditor()));
        this._imgIsMapCommittee.setIsVisible((isValid) && (privilege != null) && (privilege.getIsMapCommittee()));
        this._imgAutoTourneyCommittee.setIsVisible((isValid) && (privilege != null) && (privilege.getIsAutoTourneyCommittee()));
        this._imgIsCampaignManager.setIsVisible((isValid) && (privilege != null) && (privilege.getIsCampaignManager()));
    }

    private _getUserId(): number | undefined {
        return this.getOpenData()?.userId;
    }
}

function applyTouchEnabled(container: Ui_Interfaces_IUiContainer.IUiContainer): void {
    container.setIsTouchEnabled(true);
    container.setIsTouchChildrenEnabled(false);
    container.setMouseStyle(Helpers_PointerInput.MouseStyleType.Pointer);
}
