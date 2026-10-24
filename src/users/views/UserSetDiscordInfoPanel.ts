import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiPromptedInput from "../../ui/interfaces/IUiPromptedInput.ts";
import * as UrlsConstants from "../../urls/Constants.ts";
import * as UsersModel from "../Model.ts";
import * as UsersProxy from "../Proxy.ts";
import * as UsersUtils from "../Utils.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelp!          : UiInterfacesIUiButton.IUiButton;

    private readonly _labelDiscordId!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _inputDiscordId!   : UiInterfacesIUiPromptedInput.IUiPromptedInput;

    private readonly _btnConfirm!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDiscord!       : UiInterfacesIUiButton.IUiButton;

    private readonly _groupTurn!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgTurn!          : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTurn!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupRankPhase!   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgRankPhase!     : UiInterfacesIUiImage.IUiImage;
    private readonly _labelRankPhase!   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupRoom!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgRoom!          : UiInterfacesIUiImage.IUiImage;
    private readonly _labelRoom!        : UiInterfacesIUiLabel.IUiLabel;

    private _isRequesting   = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserSetDiscordInfo,           callback: this._onMsgUserSetDiscordId },
            { type: NotificationsTypeId.TypeId.MsgUserSetDiscordInfoFailed,     callback: this._onMsgUserSetDiscordIdFailed },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnHelp,            callback: this._onTouchedBtnHelp },

            { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
            { ui: this._btnDiscord,         callback: this._onTouchedBtnDiscord },

            { ui: this._groupTurn,          callback: this._onTouchedGroupTurn },
            { ui: this._groupRankPhase,     callback: this._onTouchedGroupRankPhase },
            { ui: this._groupRoom,          callback: this._onTouchedGroupRoom },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._isRequesting = false;

        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const discordInfo = UsersModel.getSelfDiscordInfo();
        this._inputDiscordId.setInputText(discordInfo?.getDiscordId() ?? ``);
        this._imgRankPhase.setIsVisible(!discordInfo?.getIgnoreRankPhaseNotification());
        this._imgRoom.setIsVisible(!discordInfo?.getIgnoreRoomNotification());
        this._imgTurn.setIsVisible(!discordInfo?.getIgnoreTurnNotification());
    }

    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0067),
        });
    }
    private _onTouchedBtnConfirm(): void {
        if (this._isRequesting) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0046));
        } else {
            const discordId = this._inputDiscordId.getInputText() ?? ``;
            if (!UsersUtils.checkIsDiscordIdValid(discordId)) {
                FloatText2.show(LangUtils.getText(LangConstants.TextType.A0048));
            } else {
                this._isRequesting = true;
                UsersProxy.reqSetDiscordInfo({
                    discordId,
                    ignoreRankPhaseNotification : this._imgRankPhase.getIsVisible() ? null : true,
                    ignoreRoomNotification      : this._imgRoom.getIsVisible() ? null : true,
                    ignoreTurnNotification      : this._imgTurn.getIsVisible() ? null : true,
                });
            }
        }
    }

    private _onTouchedBtnDiscord(): void {
        if ((window) && (window.open)) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getFormattedText(LangConstants.TextType.F0065, `Discord`),
                callback: () => {
                    window.open(UrlsConstants.Constants.DiscordUrl);
                },
            });
        }
    }

    private _onTouchedGroupTurn(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const img   = this._imgTurn;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupRankPhase(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const img   = this._imgRankPhase;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupRoom(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const img   = this._imgRoom;
        img.setIsVisible(!img.getIsVisible());
    }

    private _onMsgUserSetDiscordId(): void {
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0049));
        this.closePanel();
    }
    private _onMsgUserSetDiscordIdFailed(): void {
        this._isRequesting = false;
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B0150);
        this._labelDiscordId.setLangText(LangConstants.TextType.B0243);
        this._btnConfirm.setLangText(LangConstants.TextType.B0026);
        this._btnDiscord.setLangText(LangConstants.TextType.B1330);
        this._labelTurn.setLangText(LangConstants.TextType.B0918);
        this._labelRankPhase.setLangText(LangConstants.TextType.B0919);
        this._labelRoom.setLangText(LangConstants.TextType.B0920);
    }
}
