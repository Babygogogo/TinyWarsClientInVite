import * as ActionPlannersStatesIdle from "../../actionPlanners/states/Idle.ts";
import * as AuxiliaryTypesChatToTarget from "../../auxiliaryTypes/ChatToTarget.ts";
import * as ChatModel from "../../chat/Model.ts";
import * as CommonModelCommonModel from "../../common/model/CommonModel.ts";
import * as CosConstants from "../../cos/Constants.ts";
import * as CoSkillsConstants from "../../coSkills/Constants.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as KeyboardKbTypes from "../../keyboard/KbTypes.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocalDataStorage from "../../localData/Storage.ts";
import type * as NotificationsDataTypes from "../../notifications/DataTypes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ReplayWarInterfaceIRwWar from "../interface/IRwWar.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as StagesStageManager from "../../stages/StageManager.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import * as UsersModel from "../../users/Model.ts";

export interface OpenData {
    war : ReplayWarInterfaceIRwWar.IRwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _btnPlayerList!        : UiInterfacesIUiButton.IUiButton;

    private readonly _btnWeather!           : UiInterfacesIUiButton.IUiButton;

    private readonly _groupPlayerList!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listPlayer!           : UiInterfacesIUiScrollList.IUiScrollList<DataForListPlayer>;

    private readonly _btnUnitInfo!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnChat!              : UiInterfacesIUiButton.IUiButton;

    private readonly _groupPauseTime!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutPauseTime!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelPauseTimeTitle!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPauseTime!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupShowUnits!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutShowUnits!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelShowUnitsTitle!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelShowUnits!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupVisionTeam!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutVisionTeam!     : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelVisionTeamTitle! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelVisionTeam!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupProgress!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutProgress!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _layoutTurn!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelTurnTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTurn!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _layoutAction!         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelActionTitle!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelAction!          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupCo!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgCo!                : UiInterfacesIUiImage.IUiImage;
    private readonly _imgSkin!              : UiInterfacesIUiImage.IUiImage;

    private readonly _btnRewindBegin!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnRewindTurn!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnRewindAction!      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnForwardAction!     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnForwardTurn!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnForwardEnd!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnPlay!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnPause!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnPlayAction!        : UiInterfacesIUiButton.IUiButton;

    private readonly _btnInfo!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnMenu!              : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.BwPlayerIndexInTurnChanged,      callback: this._onNotifyBwPlayerIndexInTurnChanged },
            { type: NotificationsTypeId.TypeId.ReplayTick,                      callback: this._onNotifyReplayTick },
            { type: NotificationsTypeId.TypeId.BwCoEnergyChanged,               callback: this._onNotifyBwCoEnergyChanged },
            { type: NotificationsTypeId.TypeId.BwCoUsingSkillTypeChanged,       callback: this._onNotifyBwCoUsingSkillChanged },
            { type: NotificationsTypeId.TypeId.BwOverridingSkinIdChanged,       callback: this._onNotifyBwOverridingSkinIdChanged },
            { type: NotificationsTypeId.TypeId.ReplayAutoReplayChanged,         callback: this._onNotifyReplayAutoReplayChanged },
            { type: NotificationsTypeId.TypeId.RwPauseTimeChanged,              callback: this._onNotifyRwPauseTimeChanged },
            { type: NotificationsTypeId.TypeId.MsgChatGetAllReadProgressList,   callback: this._onNotifyMsgChatGetAllReadProgressList },
            { type: NotificationsTypeId.TypeId.MsgChatUpdateReadProgress,       callback: this._onNotifyMsgChatUpdateReadProgress },
            { type: NotificationsTypeId.TypeId.MsgChatGetAllMessages,           callback: this._onNotifyMsgChatGetAllMessages },
            { type: NotificationsTypeId.TypeId.MsgChatAddMessage,               callback: this._onNotifyMsgChatAddMessage },
        ]);
        this._setUiListenerArray([
            { ui: this._btnPlayerList,      callback: this._onTouchedBtnPlayerList },
            { ui: this._groupCo,            callback: this._onTouchedGroupCo },
            { ui: this._btnWeather,         callback: this._onTouchedBtnWeather },
            { ui: this._btnUnitInfo,        callback: this._onTouchedBtnUnitInfo },
            { ui: this._btnChat,            callback: this._onTouchedBtnChat },
            { ui: this._groupPauseTime,     callback: this._onTouchedGroupPauseTime },
            { ui: this._groupShowUnits,     callback: this._onTouchedGroupShowUnits },
            { ui: this._groupVisionTeam,    callback: this._onTouchedGroupVisionTeam },
            { ui: this._groupProgress,      callback: this._onTouchedGroupProgress },
            { ui: this._btnRewindAction,    callback: this._onTouchedBtnRewindAction },
            { ui: this._btnRewindTurn,      callback: this._onTouchedBtnRewindTurn },
            { ui: this._btnRewindBegin,     callback: this._onTouchedBtnRewindBegin },
            { ui: this._btnForwardAction,   callback: this._onTouchedBtnForwardAction, },
            { ui: this._btnForwardTurn,     callback: this._onTouchedBtnForwardTurn, },
            { ui: this._btnForwardEnd,      callback: this._onTouchedBtnForwardEnd, },
            { ui: this._btnPlay,            callback: this._onTouchedBtnPlay, },
            { ui: this._btnPause,           callback: this._onTouchedBtnPause, },
            { ui: this._btnPlayAction,      callback: this._onTouchedBtnPlayAction },

            { ui: this._btnInfo,            callback: this._onTouchedBtnInfo },
            { ui: this._btnMenu,            callback: this._onTouchedBtnMenu, },
        ]);
        this._setKeyboardListener({
            callback    : this._onKeyboard,
            thisObject  : this,
            priority    : 1,
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

        SoundsSoundPlayer.playCoBgmWithWar({
            war                             : war,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : UsersModel.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
        });
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

        SoundsSoundPlayer.playCoBgmWithWar({
            war                             : war,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : UsersModel.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
        });
    }
    private _onNotifyBwOverridingSkinIdChanged(): void {
        this._updateGroupCo();
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonCoListPanel, {
            war         : war,
            playerIndex : war.getPlayerIndexInTurn(),
        });
    }
    private _onTouchedBtnWeather(): void {
        const desc = this.getOpenData()?.war.getWeatherManager().getDesc();
        if (desc == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.Weather),
            getContent : () => desc,
        });
    }
    private _onTouchedBtnInfo(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const actionPlanner = war.getActionPlanner();
        if (!actionPlanner.checkIsStateRequesting()) {
            ActionPlannersStatesIdle.Idle.getInstance().apply(actionPlanner);
        }
        GamePanelsManager.openPanel(GamePanelsDict.getDict().BwWarInfoPanel, { war: war });
    }
    private _onTouchedBtnUnitInfo(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if ((war.getIsAutoReplay()) || (war.getIsExecutingAction())) {
            FloatText2.showLang(LangConstants.TextType.A0412);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().BwUnitListPanel, {
            war                     : war,
            callbackForMoveCursor   : unit => {
                const gridIndex = unit.getGridIndex();
                const cursor    = war.getCursor();
                cursor.setGridIndex(gridIndex);
                cursor.updateView();
                war.getView().tweenGridToCentralArea(gridIndex);
                war.getGridVisualEffect().showEffectAiming(gridIndex, 800);
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
            },
            callbackForSelectUnit   : unit => {
                const gridIndex = unit.getGridIndex();
                war.getCursor().setGridIndex(gridIndex);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwCursorTapped, {
                    current : gridIndex,
                    tappedOn: gridIndex,
                } as NotificationsDataTypes.BwCursorTapped);
                GamePanelsManager.closePanel(GamePanelsDict.getDict().BwUnitListPanel);
            },
        });
    }
    private _onTouchedBtnChat(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().ChatPanel, { toTarget: new AuxiliaryTypesChatToTarget.ChatToTarget({}) });
    }
    private _onTouchedGroupProgress(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        if (war.getIsAutoReplay()) {
            war.setIsAutoReplay(false);
            this._updateView();
        }

        if (!war.getIsRunning()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0040));
        } else if (war.getIsExecutingAction()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0044));
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().RwReplayProgressPanel, { war });
        }
    }
    private _onTouchedGroupPauseTime(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().RwPauseTimePanel, {
            war     : war,
        });
    }
    private _onTouchedGroupShowUnits(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        war.setIsShowAllUnits(!war.getIsShowAllUnits());
        war.updateTilesAndUnitsOnVisibilityChanged(false);

        this._updateLabelShowUnits();
    }
    private _onTouchedGroupVisionTeam(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

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
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0040));
        } else if (war.getIsExecutingAction()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0044));
        } else if (war.checkIsInBeginning()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0042));
        } else if (war.getIsTickingReplay()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            await TimerTimerModel.checkAndCallLater();
            await war.loadPreviousAction();
            await TimerTimerModel.checkAndCallLater();
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
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0040));
        } else if (war.getIsExecutingAction()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0044));
        } else if (war.checkIsInBeginning()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0042));
        } else if (war.getIsTickingReplay()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            await TimerTimerModel.checkAndCallLater();
            await war.loadPreviousCheckpoint();
            await TimerTimerModel.checkAndCallLater();
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
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0040));
        } else if (war.getIsExecutingAction()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0044));
        } else if (war.checkIsInBeginning()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0042));
        } else if (war.getIsTickingReplay()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            await TimerTimerModel.checkAndCallLater();
            await war.loadCheckpoint(0);
            await TimerTimerModel.checkAndCallLater();
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
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0040));
        } else if (war.getIsExecutingAction()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0044));
        } else if (war.checkIsInEnd()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0043));
        } else if (war.getIsTickingReplay()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            await TimerTimerModel.checkAndCallLater();
            await war.loadNextAction();
            await TimerTimerModel.checkAndCallLater();
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
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0040));
        } else if (war.getIsExecutingAction()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0044));
        } else if (war.checkIsInEnd()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0043));
        } else if (war.getIsTickingReplay()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            await TimerTimerModel.checkAndCallLater();
            await war.loadNextCheckpoint();
            await TimerTimerModel.checkAndCallLater();
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
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0040));
        } else if (war.getIsExecutingAction()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0044));
        } else if (war.checkIsInEnd()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0043));
        } else if (war.getIsTickingReplay()) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
        } else {
            await TimerTimerModel.checkAndCallLater();

            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonBlockPanel, {
                title   : LangUtils.getText(LangConstants.TextType.B0088),
                content : LangUtils.getText(LangConstants.TextType.A0040),
            });
            await war.loadCheckpoint(war.getAllCheckpointInfoArray().length - 1);
            GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonBlockPanel);

            await TimerTimerModel.checkAndCallLater();
            this._updateView();
        }
    }
    private _onTouchedBtnPlay(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.checkIsInEnd()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0041));
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
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0041));
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
            ActionPlannersStatesIdle.Idle.getInstance().apply(actionPlanner);
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().RwWarMenuPanel, { war: war });
    }

    private _onKeyboard(data: KeyboardKbTypes.EventData): void {
        if (this._getIsShowingCloseAnimation()) {
            return;
        }

        if (data.isHandled) {
            return;
        }

        const newKeys   = data.newKeys;
        const hasKeyAlt = data.allKeys.has(KeyboardKbTypes.KeyCode.Alt);
        if (newKeys.has(KeyboardKbTypes.KeyCode.Num3)) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
            data.isHandled = true;

            if (hasKeyAlt) {
                this._onTouchedBtnRewindBegin();
            } else {
                this._onTouchedBtnForwardEnd();
            }

        } else if (newKeys.has(KeyboardKbTypes.KeyCode.Num2)) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
            data.isHandled = true;

            if (hasKeyAlt) {
                this._onTouchedBtnRewindTurn();
            } else {
                this._onTouchedBtnForwardTurn();
            }

        } else if (newKeys.has(KeyboardKbTypes.KeyCode.Num1)) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
            data.isHandled = true;

            if (hasKeyAlt) {
                this._onTouchedBtnRewindAction();
            } else {
                this._onTouchedBtnForwardAction();
            }

        } else if (newKeys.has(KeyboardKbTypes.KeyCode.Whitespace)) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
            data.isHandled = true;

            if (data.allKeys.has(KeyboardKbTypes.KeyCode.Shift)) {
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

    protected override _updateOnResize(): void {
        this._updateGroupPlayerListHeight();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for views.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateBtnWeather();
        this._updateLabelPauseTime();
        this._updateLabelShowUnits();
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
        for (let playerIndex = PlayersConstants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
            dataArray.push({
                playerIndex : playerIndex,
                war         : war,
            });
        }
        const list = this._listPlayer;
        await list.bindData(dataArray, true);

        this._updateGroupPlayerListHeight();
    }
    private _updateGroupPlayerListHeight(): void {
        this._groupPlayerList.setUnscaledManualHeight(Math.min((this._listPlayer.getBoundDataArray()?.length ?? 0) * 74, StagesStageManager.getStage().stageHeight - 120));
    }

    private _updateComponentsForLanguage(): void {
        this._labelTurnTitle.setText(LangUtils.getText(LangConstants.TextType.Turns));
        this._labelActionTitle.setText(LangUtils.getText(LangConstants.TextType.B0090));
        this._labelPauseTimeTitle.setText(LangUtils.getText(LangConstants.TextType.B0846));
        this._labelShowUnitsTitle.setText(LangUtils.getText(LangConstants.TextType.B1175));
        this._labelVisionTeamTitle.setText(LangUtils.getText(LangConstants.TextType.B0891));
        this._btnRewindAction.setText(LangUtils.getText(LangConstants.TextType.B0616));
        this._btnRewindTurn.setText(LangUtils.getText(LangConstants.TextType.B0191));
        this._btnForwardTurn.setText(LangUtils.getText(LangConstants.TextType.B0191));
        this._btnForwardAction.setText(LangUtils.getText(LangConstants.TextType.B0616));
        this._btnInfo.setText(LangUtils.getText(LangConstants.TextType.B0223));
        this._btnMenu.setText(LangUtils.getText(LangConstants.TextType.B0155));

        this._updateLabelPauseTime();
        this._updateLabelShowUnits();
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
        this._labelPauseTime.setText(`${LocalDataStorage.getReplayPauseTime()}${LangUtils.getText(LangConstants.TextType.B1290)}`);
        this._layoutPauseTime.arrangeItems();
    }

    private _updateLabelShowUnits(): void {
        this._labelShowUnits.setText(LangUtils.getText(this.getOpenData()?.war.getIsShowAllUnits() ? LangConstants.TextType.B0120 : LangConstants.TextType.B1174));
        this._layoutShowUnits.arrangeItems();
    }

    private _updateLabelVisionTeam(): void {
        const teamIndex = this.getOpenData()?.war.getVisionTeamIndex();
        this._labelVisionTeam.setText(teamIndex == null
            ? LangUtils.getText(LangConstants.TextType.B0890)
            : (LangUtils.getPlayerTeamName(teamIndex) ?? LangConstants.UndefinedError)
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
        if (war?.getIsRunning()) {
            const player = war.getPlayerInTurn();
            this._imgSkin.loadSource(HelpersImageSource.getCoEyeBackground(ForceSkinsUtils.getFinalSkinId(war, player.getPlayerIndex())));
            this._imgCo.loadSource(HelpersImageSource.getCoEye(war.getGcData(), player.getCoId(), player.getAliveState() !== PlayersConstants.AliveStateId.Dead) ?? LangConstants.UndefinedError);
        }
    }

    private _updateBtnPlay(): void {
        this._btnPlay.setIsVisible(!this.getOpenData()?.war.getIsAutoReplay());
    }

    private _updateBtnPause(): void {
        this._btnPause.setIsVisible(!!this.getOpenData()?.war.getIsAutoReplay());
    }

    private _updateBtnChat(): void {
        this._btnChat.setRedVisible(ChatModel.checkHasUnreadMessage());
    }
}

interface DataForListPlayer extends UiTypesUiListItemData.UiListItemData {
    war         : ReplayWarInterfaceIRwWar.IRwWar;
    playerIndex : number;
}
class PlayerRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForListPlayer> {
    private readonly _imgInTurn!            : UiInterfacesIUiImage.IUiImage;
    private readonly _layoutContent!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelTeam!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelNickname!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutCo!             : UiInterfacesIUiLayout.IUiLayout;
    private readonly _imgSkin!              : UiInterfacesIUiImage.IUiImage;
    private readonly _imgCo!                : UiInterfacesIUiImage.IUiImage;

    private readonly _layoutOuterEnergy!    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelEnergy!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _layoutEnergy!         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelEnergy1!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelEnergy2!         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelFund!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelIncome!          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _imgUnit!              : UiInterfacesIUiImage.IUiImage;
    private readonly _labelUnitCount!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelUnitValue!       : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.ReplayTick,                      callback: this._onNotifyReplayTick },
            { type: NotificationsTypeId.TypeId.BwOverridingSkinIdChanged,       callback: this._onNotifyBwOverridingSkinIdChanged },
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
        this._updateImgSkin();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const userId    = openData.war.getPlayer(openData.playerIndex).getUserId();
        if (userId != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId });
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

        const war               = openData.war;
        const playerIndex       = openData.playerIndex;
        const player            = war.getPlayer(playerIndex);
        this._imgInTurn.setIsVisible(war.getPlayerIndexInTurn() === playerIndex);
        this._imgCo.loadSource(HelpersImageSource.getCoEye(war.getGcData(), player.getCoId(), player.getAliveState() !== PlayersConstants.AliveStateId.Dead) ?? LangConstants.UndefinedError);
        this._imgUnit.loadSource(CommonModelCommonModel.getCachedUnitImageSource({
            gcData      : war.getGcData(),
            version         : UsersModel.getSelfSettingsTextureVersion(),
            skinId          : player.getUnitAndTileSkinId(),
            unitType        : UnitsConstants.UnitTypeId.First,
            isDark          : false,
            animationType   : UnitsConstants.AnimationTypeId.Stand,
            tickCount       : 0,
        }));
        this._updateImgSkin();

        await this._updateLabelTeamAndNickname();
        this._updateComponentsForEnergy();
        this._updateComponentsForFund();
        this._updateComponentsForUnit();
        this._layoutContent.arrangeItems();
    }

    private _updateImgSkin(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgSkin.loadSource(HelpersImageSource.getCoEyeBackground(ForceSkinsUtils.getFinalSkinId(openData.war, openData.playerIndex)));
    }

    private async _updateLabelTeamAndNickname(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const player    = openData.war.getPlayer(openData.playerIndex);
        const userId    = player.getUserId();
        this._labelTeam.setText(String.fromCharCode(`A`.charCodeAt(0) + (player.getTeamIndex() - 1)));
        this._labelNickname.setText(userId == null ? LangUtils.getText(LangConstants.TextType.B0607) : (await UsersModel.getUserNickname(userId) ?? LangConstants.UndefinedError));
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
        if (skillType === CoSkillsConstants.SkillTypeId.Power) {
            label.setText(`E: ${currentEnergy}(P)`);
        } else if (skillType === CoSkillsConstants.SkillTypeId.SuperPower) {
            label.setText(`E: ${currentEnergy}(SP)`);
        } else {
            label.setText(player.getCoEnergyType() === CosConstants.EnergyTypeId.Trilogy
                ? `E: ${player.getCoCurrentEnergy()}`
                : `E: ${player.getCoCurrentEnergy()}  Z: ${player.getCoZoneRadius()}`
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
        const tileMap       = war.getTileMap();
        labelFund.setText(`${player.getFund()}`);
        labelIncome.setText(`(+${tileMap.getTotalIncomeForPlayer(playerIndex)}, ${tileMap.getTilesCountForPlayer(playerIndex)})`);
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
