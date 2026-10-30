import {
    Players_Constants,
    Units_Constants,
    type Notifications_DataTypes,
    AuxiliaryTypes_ChatToTarget,
    Timer_TimerModel,
    Chat_Model,
    GamePanels_Manager,
    Notifications_Dispatcher,
    Cos_Constants,
    Keyboard_KbTypes,
    Common_Model_CommonModel,
    Helpers_ImageSource,
    GamePanels_Dict,
    ForceSkins_Utils,
    Lang_Utils,
    LocalData_Storage,
    Users_Model,
    Stages_StageManager,
    ActionPlanners_States_Idle,
    type HalfwayReplayWar_Interface_IHrwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    Sounds_SoundPlayer,
    Sounds_Constants,
    FloatText,
    CoSkills_Constants,
    Lang_Constants,
    Notifications_TypeId,
    type Ui_Types_UiListItemData,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
} from "../../internal.ts";

export interface OpenData {
    war : HalfwayReplayWar_Interface_IHrwWar.IHrwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _btnPlayerList!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnWeather!           : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupPlayerList!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listPlayer!           : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForListPlayer>;

    private readonly _btnUnitInfo!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnChat!              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupPauseTime!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutPauseTime!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelPauseTimeTitle!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPauseTime!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupVisionTeam!      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutVisionTeam!     : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelVisionTeamTitle! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelVisionTeam!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupProgress!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutProgress!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _layoutTurn!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelTurnTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTurn!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _layoutAction!         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelActionTitle!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelAction!          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupCo!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgCo!                : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgSkin!              : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _btnRewindBegin!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnRewindTurn!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnRewindAction!      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnForwardAction!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnForwardTurn!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnForwardEnd!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnPlay!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnPause!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnPlayAction!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnInfo!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnMenu!              : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                 callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.BwPlayerIndexInTurnChanged,      callback : this._onNotifyBwPlayerIndexInTurnChanged },
            { type : Notifications_TypeId.TypeId.BwOverridingSkinIdChanged,       callback : this._onNotifyBwOverridingSkinIdChanged },
            { type : Notifications_TypeId.TypeId.ReplayTick,                      callback : this._onNotifyReplayTick },
            { type : Notifications_TypeId.TypeId.BwCoEnergyChanged,               callback : this._onNotifyBwCoEnergyChanged },
            { type : Notifications_TypeId.TypeId.BwCoUsingSkillTypeChanged,       callback : this._onNotifyBwCoUsingSkillChanged },
            { type : Notifications_TypeId.TypeId.ReplayAutoReplayChanged,         callback : this._onNotifyReplayAutoReplayChanged },
            { type : Notifications_TypeId.TypeId.MsgChatGetAllReadProgressList,   callback : this._onNotifyMsgChatGetAllReadProgressList },
            { type : Notifications_TypeId.TypeId.MsgChatUpdateReadProgress,       callback : this._onNotifyMsgChatUpdateReadProgress },
            { type : Notifications_TypeId.TypeId.MsgChatGetAllMessages,           callback : this._onNotifyMsgChatGetAllMessages },
            { type : Notifications_TypeId.TypeId.MsgChatAddMessage,               callback : this._onNotifyMsgChatAddMessage },
            { type : Notifications_TypeId.TypeId.RwPauseTimeChanged,              callback : this._onNotifyRwPauseTimeChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnPlayerList,      callback : this._onTouchedBtnPlayerList },
            { ui : this._groupCo,            callback : this._onTouchedGroupCo },
            { ui : this._btnWeather,         callback : this._onTouchedBtnWeather },
            { ui : this._btnUnitInfo,        callback : this._onTouchedBtnUnitInfo },
            { ui : this._btnChat,            callback : this._onTouchedBtnChat },
            { ui : this._groupPauseTime,     callback : this._onTouchedGroupPauseTime },
            { ui : this._groupVisionTeam,    callback : this._onTouchedGroupVisionTeam },
            { ui : this._groupProgress,      callback : this._onTouchedGroupProgress },
            { ui : this._btnRewindAction,    callback : this._onTouchedBtnRewindAction },
            { ui : this._btnRewindTurn,      callback : this._onTouchedBtnRewindTurn },
            { ui : this._btnRewindBegin,     callback : this._onTouchedBtnRewindBegin },
            { ui : this._btnForwardAction,   callback : this._onTouchedBtnForwardAction },
            { ui : this._btnForwardTurn,     callback : this._onTouchedBtnForwardTurn },
            { ui : this._btnForwardEnd,      callback : this._onTouchedBtnForwardEnd },
            { ui : this._btnPlay,            callback : this._onTouchedBtnPlay },
            { ui : this._btnPause,           callback : this._onTouchedBtnPause },
            { ui : this._btnPlayAction,      callback : this._onTouchedBtnPlayAction },

            { ui : this._btnInfo,            callback : this._onTouchedBtnInfo },
            { ui : this._btnMenu,            callback : this._onTouchedBtnMenu },
        ]);
        this._setKeyboardListener({
            callback   : this._onKeyboard,
            thisObject : this,
            priority   : 1,
        });
        this._listPlayer.setItemRendererClass(PlayerRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._initGroupPlayerList();
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listPlayer.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyBwPlayerIndexInTurnChanged(): void {
        this._updateView();

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        Sounds_SoundPlayer.playCoBgmWithWar({
            war                            : war,
            force                          : false,
            coBgmCodeArrayFromUserSettings : Users_Model.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
        });
    }
    private _onNotifyBwOverridingSkinIdChanged(): void {
        this._updateGroupCo();
    }
    private _onNotifyReplayTick(): void {
        this._updateLabelAction();
        this._updateLabelTurn();
        this._updateBtnWeather();
    }
    private _onNotifyBwCoEnergyChanged(): void {
        this._updateGroupCo();
    }
    private _onNotifyBwCoUsingSkillChanged(): void {
        this._updateGroupCo();

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        Sounds_SoundPlayer.playCoBgmWithWar({
            war                            : war,
            force                          : false,
            coBgmCodeArrayFromUserSettings : Users_Model.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
        });
    }
    private _onNotifyReplayAutoReplayChanged(): void {
        this._updateView();
    }
    private _onNotifyRwPauseTimeChanged(): void {
        this._updateLabelPauseTime();
    }
    private _onNotifyMsgChatGetAllReadProgressList(): void {
        this._updateBtnChat();
    }
    private _onNotifyMsgChatUpdateReadProgress(): void {
        this._updateBtnChat();
    }
    private _onNotifyMsgChatGetAllMessages(): void {
        this._updateBtnChat();
    }
    private _onNotifyMsgChatAddMessage(): void {
        this._updateBtnChat();
    }

    private _onTouchedBtnPlayerList(): void {
        const group = this._groupPlayerList;
        group.setIsVisible(!group.getIsVisible());
    }
    private _onTouchedGroupCo(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonCoListPanel, {
            war         : war,
            playerIndex : war.getPlayerIndexInTurn(),
        });
    }
    private _onTouchedBtnWeather(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.Weather),
            getContent : () => war.getWeatherManager().getDesc(),
        });
    }
    private _onTouchedBtnInfo(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const actionPlanner = war.getActionPlanner();
        if (!actionPlanner.checkIsStateRequesting()) {
            ActionPlanners_States_Idle.Idle.getInstance().apply(actionPlanner);
        }
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwWarInfoPanel, { war });
    }
    private _onTouchedBtnUnitInfo(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if ((war.getIsAutoReplay()) || (war.getIsExecutingAction())) {
            FloatText.showLang(Lang_Constants.TextType.A0412);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwUnitListPanel, {
            war                   : war,
            callbackForMoveCursor : unit => {
                const gridIndex = unit.getGridIndex();
                const cursor    = war.getCursor();
                cursor.setGridIndex(gridIndex);
                cursor.updateView();
                war.getView().tweenGridToCentralArea(gridIndex);
                war.getGridVisualEffect().showEffectAiming(gridIndex, 800);
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            },
            callbackForSelectUnit : unit => {
                const gridIndex = unit.getGridIndex();
                war.getCursor().setGridIndex(gridIndex);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwCursorTapped, {
                    current  : gridIndex,
                    tappedOn : gridIndex,
                } as Notifications_DataTypes.BwCursorTapped);
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().BwUnitListPanel);
            },
        });
    }
    private _onTouchedBtnChat(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ChatPanel, { toTarget : new AuxiliaryTypes_ChatToTarget.ChatToTarget({}) });
    }
    private _onTouchedGroupPauseTime(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().RwPauseTimePanel, { war });
    }
    private _onTouchedGroupProgress(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        if (war.getIsAutoReplay()) {
            war.setIsAutoReplay(false);
            this._updateView();
        }

        if (!war.getIsRunning()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0040));
        } else if (war.getIsExecutingAction()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0044));
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().RwReplayProgressPanel, { war });
        }
    }
    private _onTouchedGroupVisionTeam(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        war.tickVisionTeamIndex();
        war.updateTilesAndUnitsOnVisibilityChanged(false);

        this._updateLabelVisionTeam();
    }
    private async _onTouchedBtnRewindAction(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }
        war.setIsAutoReplay(false);

        if (!war.getIsRunning()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0040));
        } else if (war.getIsExecutingAction()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0044));
        } else if (war.checkIsInBeginning()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0042));
        } else if (war.getIsTickingReplay()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            await Timer_TimerModel.checkAndCallLater();
            await war.loadPreviousAction();
            await Timer_TimerModel.checkAndCallLater();
            this._updateView();
        }
    }
    private async _onTouchedBtnRewindTurn(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }
        war.setIsAutoReplay(false);

        if (!war.getIsRunning()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0040));
        } else if (war.getIsExecutingAction()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0044));
        } else if (war.checkIsInBeginning()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0042));
        } else if (war.getIsTickingReplay()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            await Timer_TimerModel.checkAndCallLater();
            await war.loadPreviousCheckpoint();
            await Timer_TimerModel.checkAndCallLater();
            this._updateView();
        }
    }
    private async _onTouchedBtnRewindBegin(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }
        war.setIsAutoReplay(false);

        if (!war.getIsRunning()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0040));
        } else if (war.getIsExecutingAction()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0044));
        } else if (war.checkIsInBeginning()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0042));
        } else if (war.getIsTickingReplay()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            await Timer_TimerModel.checkAndCallLater();
            await war.loadCheckpoint(0);
            await Timer_TimerModel.checkAndCallLater();
            this._updateView();
        }
    }
    private async _onTouchedBtnForwardAction(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }
        war.setIsAutoReplay(false);

        if (!war.getIsRunning()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0040));
        } else if (war.getIsExecutingAction()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0044));
        } else if (war.checkIsInEnd()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0043));
        } else if (war.getIsTickingReplay()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            await Timer_TimerModel.checkAndCallLater();
            await war.loadNextAction();
            await Timer_TimerModel.checkAndCallLater();
            this._updateView();
        }
    }
    private async _onTouchedBtnForwardTurn(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }
        war.setIsAutoReplay(false);

        if (!war.getIsRunning()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0040));
        } else if (war.getIsExecutingAction()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0044));
        } else if (war.checkIsInEnd()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0043));
        } else if (war.getIsTickingReplay()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            await Timer_TimerModel.checkAndCallLater();
            await war.loadNextCheckpoint();
            await Timer_TimerModel.checkAndCallLater();
            this._updateView();
        }
    }
    private async _onTouchedBtnForwardEnd(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }
        war.setIsAutoReplay(false);

        if (!war.getIsRunning()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0040));
        } else if (war.getIsExecutingAction()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0044));
        } else if (war.checkIsInEnd()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0043));
        } else if (war.getIsTickingReplay()) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
        } else {
            await Timer_TimerModel.checkAndCallLater();

            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonBlockPanel, {
                title   : Lang_Utils.getText(Lang_Constants.TextType.B0088),
                content : Lang_Utils.getText(Lang_Constants.TextType.A0040),
            });
            await war.loadCheckpoint(war.getAllCheckpointInfoArray().length - 1);
            GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonBlockPanel);

            await Timer_TimerModel.checkAndCallLater();
            this._updateView();
        }
    }
    private _onTouchedBtnPlay(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.checkIsInEnd()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0041));
        } else {
            war.setIsAutoReplay(true);
        }
    }
    private _onTouchedBtnPause(): void {
        this.getOpenData()?.war.setIsAutoReplay(false);
    }
    private _onTouchedBtnPlayAction(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.checkIsInEnd()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0041));
        } else {
            war.setIsAutoReplay(true);
            war.setIsAutoReplay(false);
        }
    }
    private _onTouchedBtnMenu(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const actionPlanner = war.getActionPlanner();
        if (!actionPlanner.checkIsStateRequesting()) {
            ActionPlanners_States_Idle.Idle.getInstance().apply(actionPlanner);
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().HrwWarMenuPanel, { war });
    }

    private _onKeyboard(data: Keyboard_KbTypes.EventData): void {
        if (this._getIsShowingCloseAnimation()) {
            return;
        }

        if (data.isHandled) {
            return;
        }

        const newKeys   = data.newKeys;
        const hasKeyAlt = data.allKeys.has(Keyboard_KbTypes.KeyCode.Alt);
        if (newKeys.has(Keyboard_KbTypes.KeyCode.Num3)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            data.isHandled = true;

            if (hasKeyAlt) {
                this._onTouchedBtnRewindBegin();
            } else {
                this._onTouchedBtnForwardEnd();
            }

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.Num2)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            data.isHandled = true;

            if (hasKeyAlt) {
                this._onTouchedBtnRewindTurn();
            } else {
                this._onTouchedBtnForwardTurn();
            }

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.Num1)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            data.isHandled = true;

            if (hasKeyAlt) {
                this._onTouchedBtnRewindAction();
            } else {
                this._onTouchedBtnForwardAction();
            }

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.Whitespace)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            data.isHandled = true;

            if (data.allKeys.has(Keyboard_KbTypes.KeyCode.Shift)) {
                this._onTouchedBtnPlayAction();
            } else {
                if (this._btnPlay.getIsVisible()) {
                    this._onTouchedBtnPlay();
                } else {
                    this._onTouchedBtnPause();
                }
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for views.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateBtnWeather();
        this._updateLabelPauseTime();
        this._updateLabelVisionTeam();
        this._updateLabelTurn();
        this._updateLabelAction();
        this._updateGroupCo();
        this._updateBtnPlay();
        this._updateBtnPause();
        this._updateBtnChat();
    }

    private async _initGroupPlayerList(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const playersCountUnneutral = war.getPlayersCountUnneutral();
        const dataArray             : DataForListPlayer[] = [];
        for (let playerIndex = Players_Constants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
            dataArray.push({
                playerIndex : playerIndex,
                war         : war,
            });
        }
        this._groupPlayerList.setUnscaledManualHeight(Math.min(dataArray.length * 74, Stages_StageManager.getStage().stageHeight - 120));
        await this._listPlayer.bindData(dataArray, true);
    }

    private _updateComponentsForLanguage(): void {
        this._labelTurnTitle.setLangText(Lang_Constants.TextType.Turns);
        this._labelActionTitle.setLangText(Lang_Constants.TextType.B0090);
        this._labelPauseTimeTitle.setLangText(Lang_Constants.TextType.B0846);
        this._labelVisionTeamTitle.setLangText(Lang_Constants.TextType.B0891);
        this._btnRewindAction.setLangText(Lang_Constants.TextType.B0616);
        this._btnRewindTurn.setLangText(Lang_Constants.TextType.B0191);
        this._btnForwardTurn.setLangText(Lang_Constants.TextType.B0191);
        this._btnForwardAction.setLangText(Lang_Constants.TextType.B0616);
        this._btnInfo.setLangText(Lang_Constants.TextType.B0223);
        this._btnMenu.setLangText(Lang_Constants.TextType.B0155);

        this._layoutPauseTime.arrangeItems();
        this._layoutVisionTeam.arrangeItems();
        this._layoutTurn.arrangeItems();
        this._layoutAction.arrangeItems();
        this._layoutProgress.arrangeItems();

        this._updateLabelPauseTime();
        this._updateLabelVisionTeam();
    }

    private _updateBtnWeather(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        this._btnWeather.setIconSource(war.getGcData().getWeatherCfg(war.getWeatherManager().getCurrentWeatherType())?.getIcon() ?? ``);
    }

    private _updateLabelPauseTime(): void {
        this._labelPauseTime.setText(`${LocalData_Storage.getReplayPauseTime()}${Lang_Utils.getText(Lang_Constants.TextType.B1290)}`);
        this._layoutPauseTime.arrangeItems();
    }

    private _updateLabelVisionTeam(): void {
        const teamIndex = this.getOpenData()?.war.getVisionTeamIndex();
        this._labelVisionTeam.setText(teamIndex == null
            ? Lang_Utils.getText(Lang_Constants.TextType.B0890)
            : (Lang_Utils.getPlayerTeamName(teamIndex) ?? Lang_Constants.UndefinedError),
        );
        this._layoutVisionTeam.arrangeItems();
    }

    private _updateLabelTurn(): void {
        this._labelTurn.setText(`${this.getOpenData()?.war.getTurnManager().getTurnIndex()}`);
        this._layoutTurn.arrangeItems();
        this._layoutProgress.arrangeItems();
    }

    private _updateLabelAction(): void {
        this._labelAction.setText(`${this.getOpenData()?.war.getNextOperationId()}`);
        this._layoutAction.arrangeItems();
        this._layoutProgress.arrangeItems();
    }

    private _updateGroupCo(): void {
        const war = this.getOpenData()?.war;
        if ((war) && (war.getIsRunning())) {
            const player = war.getPlayerInTurn();
            this._imgSkin.loadSource(Helpers_ImageSource.getCoEyeBackground(ForceSkins_Utils.getFinalSkinId(war, player.getPlayerIndex())));
            this._imgCo.loadSource(Helpers_ImageSource.getCoEye(war.getGcData(), player.getCoId(), player.getAliveState() !== Players_Constants.AliveStateId.Dead) ?? Lang_Constants.UndefinedError);
        }
    }

    private _updateBtnPlay(): void {
        this._btnPlay.setIsVisible(!this.getOpenData()?.war.getIsAutoReplay());
    }

    private _updateBtnPause(): void {
        this._btnPause.setIsVisible(!!this.getOpenData()?.war.getIsAutoReplay());
    }

    private _updateBtnChat(): void {
        this._btnChat.setRedVisible(Chat_Model.checkHasUnreadMessage());
    }
}

interface DataForListPlayer extends Ui_Types_UiListItemData.UiListItemData {
    war         : HalfwayReplayWar_Interface_IHrwWar.IHrwWar;
    playerIndex : number;
}
class PlayerRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForListPlayer> {
    private readonly _imgInTurn!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _layoutContent!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelTeam!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelNickname!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutCo!             : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _imgSkin!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgCo!                : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _layoutOuterEnergy!    : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelEnergy!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _layoutEnergy!         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelEnergy1!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelEnergy2!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelFund!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelIncome!          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _imgUnit!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelUnitCount!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelUnitValue!       : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.ReplayTick,                  callback : this._onNotifyReplayTick },
            { type : Notifications_TypeId.TypeId.BwOverridingSkinIdChanged,   callback : this._onNotifyBwOverridingSkinIdChanged },
        ]);
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onNotifyReplayTick(): void {
        this._updateComponentsForWarInfo();
    }
    private _onNotifyBwOverridingSkinIdChanged(): void {
        this._updateComponentsForWarInfo();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const userId = openData.war.getPlayer(openData.playerIndex).getUserId();
        if (userId != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, { userId });
        }
    }

    private _updateView(): void {
        this._updateComponentsForWarInfo();
    }

    private async _updateComponentsForWarInfo(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war           = openData.war;
        const playerIndex   = openData.playerIndex;
        const player        = war.getPlayer(playerIndex);
        this._imgInTurn.setIsVisible(war.getPlayerIndexInTurn() === playerIndex);
        this._imgSkin.loadSource(Helpers_ImageSource.getCoEyeBackground(ForceSkins_Utils.getFinalSkinId(war, playerIndex)));
        this._imgCo.loadSource(Helpers_ImageSource.getCoEye(war.getGcData(), player.getCoId(), player.getAliveState() !== Players_Constants.AliveStateId.Dead) ?? Lang_Constants.UndefinedError);
        this._imgUnit.loadSource(Common_Model_CommonModel.getCachedUnitImageSource({
            gcData        : war.getGcData(),
            version       : Users_Model.getSelfSettingsTextureVersion(),
            skinId        : player.getUnitAndTileSkinId(),
            unitType      : Units_Constants.UnitTypeId.First,
            isDark        : false,
            animationType : Units_Constants.AnimationTypeId.Stand,
            tickCount     : 0,
        }));

        await this._updateLabelTeamAndNickname();
        this._updateComponentsForEnergy();
        this._updateComponentsForFund();
        this._updateComponentsForUnit();
        this._layoutContent.arrangeItems();
    }

    private async _updateLabelTeamAndNickname(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const player    = openData.war.getPlayer(openData.playerIndex);
        const userId    = player.getUserId();
        this._labelTeam.setText(String.fromCharCode(`A`.charCodeAt(0) + (player.getTeamIndex() - 1)));
        this._labelNickname.setText(userId == null ? Lang_Utils.getText(Lang_Constants.TextType.B0607) : (await Users_Model.getUserNickname(userId) ?? Lang_Constants.UndefinedError));
    }

    private _updateComponentsForEnergy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war           = openData.war;
        const player        = war.getPlayer(openData.playerIndex);
        const skillType     = player.getCoUsingSkillType();
        const label         = this._labelEnergy;
        const currentEnergy = player.getCoCurrentEnergy();
        if (skillType === CoSkills_Constants.SkillTypeId.Power) {
            label.setText(`E: ${currentEnergy}(P)`);
        } else if (skillType === CoSkills_Constants.SkillTypeId.SuperPower) {
            label.setText(`E: ${currentEnergy}(SP)`);
        } else {
            label.setText(player.getCoEnergyType() === Cos_Constants.EnergyTypeId.Trilogy
                ? `E: ${player.getCoCurrentEnergy()}`
                : `E: ${player.getCoCurrentEnergy()}  Z: ${player.getCoZoneRadius()}`,
            );
        }

        const energy1           = player.getCoPowerEnergy();
        const labelEnergy1      = this._labelEnergy1;
        labelEnergy1.setText(`${energy1 ?? `--`}`);
        labelEnergy1.setTextColor(energy1 == null || currentEnergy < energy1 ? 0xFFFFFF : 0x00FF00);

        const energy2           = player.getCoSuperPowerEnergy();
        const labelEnergy2      = this._labelEnergy2;
        labelEnergy2.setText(`${energy2 ?? `--`}`);
        labelEnergy2.setTextColor(energy2 == null || currentEnergy < energy2 ? 0xFFFFFF : 0x00FF00);

        this._layoutEnergy.arrangeItems();
        this._layoutOuterEnergy.arrangeItems();
        this._layoutCo.arrangeItems();
    }

    private _updateComponentsForFund(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war           = openData.war;
        const playerIndex   = openData.playerIndex;
        const player        = war.getPlayer(playerIndex);
        const labelFund     = this._labelFund;
        const labelIncome   = this._labelIncome;
        if ((war.getFogMap().checkHasFogCurrently())                                                &&
            (!war.getPlayerManager().getWatcherTeamIndexesForSelf().has(player.getTeamIndex()))
        ) {
            labelFund.setText(`????`);
            labelIncome.setText(`(+??)`);
        } else {
            const tileMap = war.getTileMap();
            labelFund.setText(`${player.getFund()}`);
            labelIncome.setText(`(+${tileMap.getTotalIncomeForPlayer(playerIndex)}, ${tileMap.getTilesCountForPlayer(playerIndex)})`);
        }
    }

    private _updateComponentsForUnit(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war           = openData.war;
        const unitMap       = war.getUnitMap();
        const playerIndex   = openData.playerIndex;
        let count           = 0;
        let value           = 0;
        for (const unit of unitMap.getAllUnitsOnMap()) {
            if (unit.getPlayerIndex() === playerIndex) {
                ++count;
                value += Math.floor(unit.getProductionFinalCost() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp());

                for (const unitLoaded of unitMap.getUnitsLoadedByLoader(unit, true)) {
                    ++count;
                    value += Math.floor(unitLoaded.getProductionFinalCost() * unitLoaded.getNormalizedCurrentHp() / unitLoaded.getNormalizedMaxHp());
                }
            }
        }

        this._labelUnitCount.setText(`${count}`);
        this._labelUnitValue.setText(`(${value})`);
    }
}
