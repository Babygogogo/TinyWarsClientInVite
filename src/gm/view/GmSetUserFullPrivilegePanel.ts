import { show } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { reqGmSetUserPrivilege } from "../model/GmProxy.ts";
import { MouseStyleType } from "../../helpers/PointerInput.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UserPrivilege } from "../../proto/schema/CommonProto/User/UserPrivilege.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { getUserNickname, getSelfUserPrivilege, getUserPublicInfo } from "../../users/Model.ts";

export interface OpenData {
    userId  : number;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                      : IUiImage;
    private readonly _group!                        : IUiContainer;
    private readonly _labelTitle!                   : IUiLabel;
    private readonly _btnSearchUser!                : IUiButton;
    private readonly _labelUserName!                : IUiLabel;

    private readonly _groupPrivilege!               : IUiLayout;

    private readonly _groupIsAdmin!                 : IUiContainer;
    private readonly _imgIsAdmin!                   : IUiImage;
    private readonly _labelIsAdmin!                 : IUiLabel;

    private readonly _groupCanLogin!                : IUiContainer;
    private readonly _imgCanLogin!                  : IUiImage;
    private readonly _labelCanLogin!                : IUiLabel;

    private readonly _groupIsMapCommittee!          : IUiContainer;
    private readonly _imgIsMapCommittee!            : IUiImage;
    private readonly _labelIsMapCommittee!          : IUiLabel;

    private readonly _groupIsChangeLogEditor!       : IUiContainer;
    private readonly _imgIsChangeLogEditor!         : IUiImage;
    private readonly _labelIsChangeLogEditor!       : IUiLabel;

    private readonly _groupIsCampaignManager!       : IUiContainer;
    private readonly _imgIsCampaignManager!         : IUiImage;
    private readonly _labelIsCampaignManager!       : IUiLabel;

    private readonly _groupCanChat!                 : IUiContainer;
    private readonly _imgCanChat!                   : IUiImage;
    private readonly _labelCanChat!                 : IUiLabel;

    private readonly _groupChatManager!             : IUiContainer;
    private readonly _imgChatManager!               : IUiImage;
    private readonly _labelChatManager!             : IUiLabel;

    private readonly _groupAutoTourneyCommittee!    : IUiContainer;
    private readonly _imgAutoTourneyCommittee!      : IUiImage;
    private readonly _labelAutoTourneyCommittee!    : IUiLabel;

    private readonly _btnCancel!                    : IUiButton;
    private readonly _btnConfirm!                   : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgGmSetUserPrivilege,   callback: this._onNotifyMsgUserSetPrivilege },
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
        show(getText(TextType.A0157));
    }

    private _onTouchedBtnSearchUser(): void {
        openPanel(getDict().CommonSearchSingleUserPanel, {
            getTitleText        : null,
            callbackOnConfirm   : userId => openPanel(getDict().GmSetUserFullPrivilegePanel, {
                userId  : userId,
            }),
        });
    }

    private _onTouchedBtnConfirm(): void {
        const userId = this._getUserId();
        if (userId) {
            reqGmSetUserPrivilege(userId, UserPrivilege.fromJson({
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
        playShortSfx(ShortSfxCode.ButtonNeutral01);
        const img = this._imgCanChat;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupChatManager(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
        const img = this._imgChatManager;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupAutoTourneyCommittee(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
        const img = this._imgAutoTourneyCommittee;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupCanLogin(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
        const img = this._imgCanLogin;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupIsAdmin(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
        const img = this._imgIsAdmin;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupIsChangeLogEditor(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
        const img = this._imgIsChangeLogEditor;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupIsMapCommittee(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
        const img = this._imgIsMapCommittee;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupIsCampaignManager(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);
        const img = this._imgIsCampaignManager;
        img.setIsVisible(!img.getIsVisible());
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0460);
        this._btnSearchUser.setLangText(TextType.B0228);
        this._btnConfirm.setLangText(TextType.B0026);
        this._btnCancel.setLangText(TextType.B0154);
        this._labelCanChat.setLangText(TextType.B0383);
        this._labelCanLogin.setLangText(TextType.B0173);
        this._labelIsAdmin.setLangText(TextType.B1116);
        this._labelChatManager.setLangText(TextType.B1117);
        this._labelIsChangeLogEditor.setLangText(TextType.B1118);
        this._labelIsMapCommittee.setLangText(TextType.B1119);
        this._labelAutoTourneyCommittee.setLangText(TextType.B1120);
        this._labelIsCampaignManager.setLangText(TextType.B1132);
        this._updateLabelUserName();
    }
    private async _updateLabelUserName(): Promise<void> {
        const userId = this._getUserId();
        if (userId == null) {
            return;
        }

        const nickname = await getUserNickname(userId);
        if (userId === this._getUserId()) {
            this._labelUserName.setText(`#${userId} ${nickname ?? UndefinedError}`);
        }
    }

    private _resetComponentsForPrivilege(): void {
        this._resetComponentsForSelfPrivilege();
        this._resetComponentsForTargetPrivilege();
    }
    private _resetComponentsForSelfPrivilege(): void {
        const group = this._groupPrivilege;
        group.removeAllItems(false);

        const privilege = getSelfUserPrivilege();
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

        const privilege = (await getUserPublicInfo(userId))?.getUserPrivilege();
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

function applyTouchEnabled(container: IUiContainer): void {
    container.setIsTouchEnabled(true);
    container.setIsTouchChildrenEnabled(false);
    container.setMouseStyle(MouseStyleType.Pointer);
}
