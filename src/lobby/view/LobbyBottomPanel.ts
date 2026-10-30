import {
    AuxiliaryTypes_ChatToTarget,
    Chat_Model,
    Lobby_Model_LobbyModel,
    GamePanels_Manager,
    Tween_Executor,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    Helpers_Compatibility,
    Users_Model,
    Timer_TimerModel,
    Helpers_GameFlow,
    Helpers_PointerInput,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Graphics_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    WarTypes_Constants,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupBottom!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupContainer!   : Ui_Interfaces_IUiContainer.IUiContainer;

    // private readonly _groupStart!       : Ui.Interfaces.IUiContainer;
    private readonly _btnStart!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _imgStart!         : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupVersion!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelVersion!     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupProfile!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutProfile!    : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelProfile1!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelProfile2!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupChat!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutChat!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelChat1!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelChat2!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgChatRed!       : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupMapEditor!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutMapEditor!  : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMapEditor1!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapEditor2!  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupGameChart!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutGameChart!  : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelGameChart1!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelGameChart2!  : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnStart,           callback : this._onTouchedBtnStart },
            { ui : this._groupProfile,       callback : this._onTouchedGroupProfile },
            { ui : this._groupChat,          callback : this._onTouchedGroupChat },
            { ui : this._groupMapEditor,     callback : this._onTouchedGroupMapEditor },
            { ui : this._groupGameChart,     callback : this._onTouchedGroupGameChart },
            { ui : this._groupVersion,       callback : this._onTouchedGroupVersion },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                 callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.TimeTick,                        callback : this._onNotifyTimeTick },
            { type : Notifications_TypeId.TypeId.MsgUserLogout,                   callback : this._onMsgUserLogout },
            { type : Notifications_TypeId.TypeId.MsgChatGetAllReadProgressList,   callback : this._onMsgChatGetAllReadProgressList },
            { type : Notifications_TypeId.TypeId.MsgChatUpdateReadProgress,       callback : this._onMsgChatUpdateReadProgress },
            { type : Notifications_TypeId.TypeId.MsgChatGetAllMessages,           callback : this._onMsgChatGetAllMessages },
            { type : Notifications_TypeId.TypeId.MsgChatAddMessage,               callback : this._onMsgChatAddMessages },
        ]);

        applyTouchEnabled(this._groupProfile);
        applyTouchEnabled(this._groupChat);
        applyTouchEnabled(this._groupMapEditor);
        applyTouchEnabled(this._groupGameChart);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgStart = this._imgStart;
        imgStart.setAlpha(0);
        Tween_Executor.Executor.removeTweens(imgStart);
        Tween_Executor.Executor.get(imgStart, { loop : true })
            .to({ customAlpha : 0.8 }, 500)
            .to({ customAlpha : 0 }, 500);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateImgStart();
        this._updateBtnChat();
    }
    protected override async _onClosed(): Promise<void> {
        Tween_Executor.Executor.removeTweens(this._imgStart);

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        const languageType2 = Lang_Utils.getSecondaryLanguageType();
        this._labelProfile1.setLangText(Lang_Constants.TextType.B1375);
        this._labelProfile2.setLangText(Lang_Constants.TextType.B1375, languageType2);
        this._labelChat1.setLangText(Lang_Constants.TextType.B1376);
        this._labelChat2.setLangText(Lang_Constants.TextType.B1376, languageType2);
        this._labelMapEditor1.setLangText(Lang_Constants.TextType.B1377);
        this._labelMapEditor2.setLangText(Lang_Constants.TextType.B1377, languageType2);
        this._labelGameChart1.setLangText(Lang_Constants.TextType.B0900);
        this._labelGameChart2.setLangText(Lang_Constants.TextType.B0900, languageType2);
        this._labelVersion.setText(Lang_Utils.getGameVersionName(window.GAME_VERSION) ?? Lang_Constants.UndefinedError);

        this._imgChatRed.setX(this._layoutChat.getX() + this._labelChat1.getScaledWidth());

        this._layoutProfile.arrangeItems();
        this._layoutChat.arrangeItems();
        this._layoutMapEditor.arrangeItems();
        this._layoutGameChart.arrangeItems();
    }

    private _onTouchedBtnStart(): void {
        this._updateImgStart();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyStartPanel, void 0);
    }

    private _onTouchedGroupProfile(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().UserOnlineUsersPanel);
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().ChatPanel);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, {
            userId : Helpers_Misc.getExisted(Users_Model.getSelfUserId()),
        });
    }

    private _onTouchedGroupChat(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().UserOnlineUsersPanel);
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().UserPanel);
        if (!GamePanels_Manager.getRunningPanel(GamePanels_Dict.getDict().ChatPanel)) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ChatPanel, { toTarget : new AuxiliaryTypes_ChatToTarget.ChatToTarget({}) });
        } else {
            GamePanels_Manager.closePanel(GamePanels_Dict.getDict().ChatPanel);
        }
    }

    private _onTouchedGroupMapEditor(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        Helpers_GameFlow.gotoMyWarListPanel(WarTypes_Constants.WarTypeId.Me);
    }

    private _onTouchedGroupGameChart(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonGameChartPanel, void 0);
    }

    private _onTouchedGroupVersion(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChangeVersionPanel, void 0);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyTimeTick(): void {
        if ((Timer_TimerModel.getServerTimestamp() % 10 === 0)                                 &&
            (!Helpers_Compatibility.getIsGameHidden())                               &&
            (!GamePanels_Manager.getRunningPanel(GamePanels_Dict.getDict().LobbyStartPanel))
        ) {
            this._updateImgStart();
        }
    }
    private _onMsgUserLogout(): void {
        this.closePanel();
    }
    private _onMsgChatGetAllReadProgressList(): void {
        this._updateBtnChat();
    }
    private _onMsgChatUpdateReadProgress(): void {
        this._updateBtnChat();
    }
    private _onMsgChatGetAllMessages(): void {
        this._updateBtnChat();
    }
    private _onMsgChatAddMessages(): void {
        this._updateBtnChat();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _updateImgStart(): Promise<void> {
        this._imgStart.setIsVisible(await Lobby_Model_LobbyModel.checkIsRedForStartButton());
    }

    private _updateBtnChat(): void {
        this._imgChatRed.setIsVisible(Chat_Model.checkHasUnreadMessage());
    }

    protected async _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._groupContainer,
            beginProps : { customAlpha : 0, customY : 40 },
            endProps   : { customAlpha : 1, customY : 0 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupProfile,
            beginProps : { customAlpha : 0, customY : 40 },
            endProps   : { customAlpha : 1, customY : 0 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupChat,
            beginProps : { customAlpha : 0, customY : 40 },
            endProps   : { customAlpha : 1, customY : 0 },
            waitTime   : 66,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupMapEditor,
            beginProps : { customAlpha : 0, customY : 40 },
            endProps   : { customAlpha : 1, customY : 0 },
            waitTime   : 132,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupGameChart,
            beginProps : { customAlpha : 0, customY : 40 },
            endProps   : { customAlpha : 1, customY : 0 },
            waitTime   : 200,
        });

        await Timer_TimerModel.wait(200 + Graphics_Constants.Tween.DefaultDuration);
    }
    protected async _showCloseAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._groupContainer,
            beginProps : { customAlpha : 1, customY : 0 },
            endProps   : { customAlpha : 0, customY : 40 },
        });

        await Timer_TimerModel.wait();
    }
}

function applyTouchEnabled(container: Ui_Interfaces_IUiContainer.IUiContainer): void {
    container.setIsTouchEnabled(true);
    container.setIsTouchChildrenEnabled(false);
    container.setMouseStyle(Helpers_PointerInput.MouseStyleType.Pointer);
}
