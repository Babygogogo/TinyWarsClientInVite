import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GmModelGmProxy from "../model/GmProxy.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoUserUserPrivilege from "../../proto/schema/CommonProto/User/UserPrivilege.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as UsersModel from "../../users/Model.ts";

export interface OpenData {
    userId  : number;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnSearchUser!                : UiInterfacesIUiButton.IUiButton;
    private readonly _labelUserName!                : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupPrivilege!               : UiInterfacesIUiLayout.IUiLayout;

    private readonly _groupIsAdmin!                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgIsAdmin!                   : UiInterfacesIUiImage.IUiImage;
    private readonly _labelIsAdmin!                 : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupCanLogin!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgCanLogin!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _labelCanLogin!                : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupIsMapCommittee!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgIsMapCommittee!            : UiInterfacesIUiImage.IUiImage;
    private readonly _labelIsMapCommittee!          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupIsChangeLogEditor!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgIsChangeLogEditor!         : UiInterfacesIUiImage.IUiImage;
    private readonly _labelIsChangeLogEditor!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupIsCampaignManager!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgIsCampaignManager!         : UiInterfacesIUiImage.IUiImage;
    private readonly _labelIsCampaignManager!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupCanChat!                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgCanChat!                   : UiInterfacesIUiImage.IUiImage;
    private readonly _labelCanChat!                 : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupChatManager!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgChatManager!               : UiInterfacesIUiImage.IUiImage;
    private readonly _labelChatManager!             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupAutoTourneyCommittee!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgAutoTourneyCommittee!      : UiInterfacesIUiImage.IUiImage;
    private readonly _labelAutoTourneyCommittee!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnCancel!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _btnConfirm!                   : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgGmSetUserPrivilege,   callback: this._onNotifyMsgUserSetPrivilege },
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
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0157));
    }

    private _onTouchedBtnSearchUser(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonSearchSingleUserPanel, {
            getTitleText        : null,
            callbackOnConfirm   : userId => GamePanelsManager.openPanel(GamePanelsDict.getDict().GmSetUserFullPrivilegePanel, {
                userId  : userId,
            }),
        });
    }

    private _onTouchedBtnConfirm(): void {
        const userId = this._getUserId();
        if (userId) {
            GmModelGmProxy.reqGmSetUserPrivilege(userId, ProtoSchemaCommonProtoUserUserPrivilege.UserPrivilege.fromJson({
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
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        const img = this._imgCanChat;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupChatManager(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        const img = this._imgChatManager;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupAutoTourneyCommittee(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        const img = this._imgAutoTourneyCommittee;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupCanLogin(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        const img = this._imgCanLogin;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupIsAdmin(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        const img = this._imgIsAdmin;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupIsChangeLogEditor(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        const img = this._imgIsChangeLogEditor;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupIsMapCommittee(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        const img = this._imgIsMapCommittee;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupIsCampaignManager(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        const img = this._imgIsCampaignManager;
        img.setIsVisible(!img.getIsVisible());
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0460));
        this._btnSearchUser.setText(LangUtils.getText(LangConstants.TextType.B0228));
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
        this._btnCancel.setText(LangUtils.getText(LangConstants.TextType.B0154));
        this._labelCanChat.setText(LangUtils.getText(LangConstants.TextType.B0383));
        this._labelCanLogin.setText(LangUtils.getText(LangConstants.TextType.B0173));
        this._labelIsAdmin.setText(LangUtils.getText(LangConstants.TextType.B1116));
        this._labelChatManager.setText(LangUtils.getText(LangConstants.TextType.B1117));
        this._labelIsChangeLogEditor.setText(LangUtils.getText(LangConstants.TextType.B1118));
        this._labelIsMapCommittee.setText(LangUtils.getText(LangConstants.TextType.B1119));
        this._labelAutoTourneyCommittee.setText(LangUtils.getText(LangConstants.TextType.B1120));
        this._labelIsCampaignManager.setText(LangUtils.getText(LangConstants.TextType.B1132));
        this._updateLabelUserName();
    }
    private async _updateLabelUserName(): Promise<void> {
        const userId = this._getUserId();
        if (userId == null) {
            return;
        }

        const nickname = await UsersModel.getUserNickname(userId);
        if (userId === this._getUserId()) {
            this._labelUserName.setText(`#${userId} ${nickname ?? LangConstants.UndefinedError}`);
        }
    }

    private _resetComponentsForPrivilege(): void {
        this._resetComponentsForSelfPrivilege();
        this._resetComponentsForTargetPrivilege();
    }
    private _resetComponentsForSelfPrivilege(): void {
        const group = this._groupPrivilege;
        group.removeAllItems(false);

        const privilege = UsersModel.getSelfUserPrivilege();
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

        const privilege = (await UsersModel.getUserPublicInfo(userId))?.getUserPrivilege();
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

function applyTouchEnabled(container: UiInterfacesIUiContainer.IUiContainer): void {
    container.setIsTouchEnabled(true);
    container.setIsTouchChildrenEnabled(false);
    container.setMouseStyle(HelpersPointerInput.MouseStyleType.Pointer);
}
