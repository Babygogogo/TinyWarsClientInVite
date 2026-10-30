import {
    Users_Utils,
    Urls_Constants,
    GamePanels_Dict,
    Lang_Utils,
    Users_Model,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Users_Proxy,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiPromptedInput,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelp!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelDiscordId!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _inputDiscordId!   : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;

    private readonly _btnConfirm!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDiscord!       : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupTurn!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgTurn!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTurn!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupRankPhase!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgRankPhase!     : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelRankPhase!   : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupRoom!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgRoom!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelRoom!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private _isRequesting   = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                 callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgUserSetDiscordInfo,           callback : this._onMsgUserSetDiscordId },
            { type : Notifications_TypeId.TypeId.MsgUserSetDiscordInfoFailed,     callback : this._onMsgUserSetDiscordIdFailed },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,           callback : this.closePanel },
            { ui : this._btnHelp,            callback : this._onTouchedBtnHelp },

            { ui : this._btnConfirm,         callback : this._onTouchedBtnConfirm },
            { ui : this._btnDiscord,         callback : this._onTouchedBtnDiscord },

            { ui : this._groupTurn,          callback : this._onTouchedGroupTurn },
            { ui : this._groupRankPhase,     callback : this._onTouchedGroupRankPhase },
            { ui : this._groupRoom,          callback : this._onTouchedGroupRoom },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._isRequesting = false;

        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const discordInfo = Users_Model.getSelfDiscordInfo();
        this._inputDiscordId.setInputText(discordInfo?.getDiscordId() ?? ``);
        this._imgRankPhase.setIsVisible(!discordInfo?.getIgnoreRankPhaseNotification());
        this._imgRoom.setIsVisible(!discordInfo?.getIgnoreRoomNotification());
        this._imgTurn.setIsVisible(!discordInfo?.getIgnoreTurnNotification());
    }

    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0067),
        });
    }
    private _onTouchedBtnConfirm(): void {
        if (this._isRequesting) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0046));
        } else {
            const discordId = this._inputDiscordId.getInputText() ?? ``;
            if (!Users_Utils.checkIsDiscordIdValid(discordId)) {
                FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0048));
            } else {
                this._isRequesting = true;
                Users_Proxy.reqSetDiscordInfo({
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0065, `Discord`),
                callback   : () => {
                    window.open(Urls_Constants.Constants.DiscordUrl);
                },
            });
        }
    }

    private _onTouchedGroupTurn(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const img   = this._imgTurn;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupRankPhase(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const img   = this._imgRankPhase;
        img.setIsVisible(!img.getIsVisible());
    }
    private _onTouchedGroupRoom(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const img   = this._imgRoom;
        img.setIsVisible(!img.getIsVisible());
    }

    private _onMsgUserSetDiscordId(): void {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0049));
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B0150);
        this._labelDiscordId.setLangText(Lang_Constants.TextType.B0243);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnDiscord.setLangText(Lang_Constants.TextType.B1330);
        this._labelTurn.setLangText(Lang_Constants.TextType.B0918);
        this._labelRankPhase.setLangText(Lang_Constants.TextType.B0919);
        this._labelRoom.setLangText(Lang_Constants.TextType.B0920);
    }
}
