import { Idle } from "../../actionPlanners/states/Idle.ts";
import { ChatToTarget } from "../../auxiliaryTypes/ChatToTarget.ts";
import { checkHasUnreadMessage } from "../../chat/Model.ts";
import { getCachedUnitImageSource } from "../../common/model/CommonModel.ts";
import { EnergyTypeId } from "../../cos/Constants.ts";
import { SkillTypeId } from "../../coSkills/Constants.ts";
import { showLang, show } from "../../FloatText.ts";
import { getFinalSkinId } from "../../forceSkins/Utils.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel, closePanel } from "../../gamePanels/Manager.ts";
import { getCoEyeBackground, getCoEye } from "../../helpers/ImageSource.ts";
import { type EventData, KeyCode } from "../../keyboard/KbTypes.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getPlayerTeamName } from "../../lang/Utils.ts";
import { getReplayPauseTime } from "../../localData/Storage.ts";
import type { BwCursorTapped } from "../../notifications/DataTypes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex, AliveStateId } from "../../players/Constants.ts";
import type { IRwWar } from "../interface/IRwWar.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playCoBgmWithWar, playShortSfx } from "../../sounds/SoundPlayer.ts";
import { getStage } from "../../stages/StageManager.ts";
import { checkAndCallLater } from "../../timer/TimerModel.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { UnitTypeId, AnimationTypeId } from "../../units/Constants.ts";
import { getSelfSettingsCoBgmCodeArray, getSelfSettingsTextureVersion, getUserNickname } from "../../users/Model.ts";

export interface OpenData {
    war : IRwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _btnPlayerList!        : IUiButton;

    private readonly _btnWeather!           : IUiButton;

    private readonly _groupPlayerList!      : IUiContainer;
    private readonly _listPlayer!           : IUiScrollList<DataForListPlayer>;

    private readonly _btnUnitInfo!          : IUiButton;
    private readonly _btnChat!              : IUiButton;

    private readonly _groupPauseTime!       : IUiContainer;
    private readonly _layoutPauseTime!      : IUiLayout;
    private readonly _labelPauseTimeTitle!  : IUiLabel;
    private readonly _labelPauseTime!       : IUiLabel;

    private readonly _groupShowUnits!       : IUiContainer;
    private readonly _layoutShowUnits!      : IUiLayout;
    private readonly _labelShowUnitsTitle!  : IUiLabel;
    private readonly _labelShowUnits!       : IUiLabel;

    private readonly _groupVisionTeam!      : IUiContainer;
    private readonly _layoutVisionTeam!     : IUiLayout;
    private readonly _labelVisionTeamTitle! : IUiLabel;
    private readonly _labelVisionTeam!      : IUiLabel;

    private readonly _groupProgress!        : IUiContainer;
    private readonly _layoutProgress!       : IUiLayout;
    private readonly _layoutTurn!           : IUiLayout;
    private readonly _labelTurnTitle!       : IUiLabel;
    private readonly _labelTurn!            : IUiLabel;
    private readonly _layoutAction!         : IUiLayout;
    private readonly _labelActionTitle!     : IUiLabel;
    private readonly _labelAction!          : IUiLabel;

    private readonly _groupCo!              : IUiContainer;
    private readonly _imgCo!                : IUiImage;
    private readonly _imgSkin!              : IUiImage;

    private readonly _btnRewindBegin!       : IUiButton;
    private readonly _btnRewindTurn!        : IUiButton;
    private readonly _btnRewindAction!      : IUiButton;
    private readonly _btnForwardAction!     : IUiButton;
    private readonly _btnForwardTurn!       : IUiButton;
    private readonly _btnForwardEnd!        : IUiButton;
    private readonly _btnPlay!              : IUiButton;
    private readonly _btnPause!             : IUiButton;
    private readonly _btnPlayAction!        : IUiButton;

    private readonly _btnInfo!              : IUiButton;
    private readonly _btnMenu!              : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.BwPlayerIndexInTurnChanged,      callback: this._onNotifyBwPlayerIndexInTurnChanged },
            { type: TypeId.ReplayTick,                      callback: this._onNotifyReplayTick },
            { type: TypeId.BwCoEnergyChanged,               callback: this._onNotifyBwCoEnergyChanged },
            { type: TypeId.BwCoUsingSkillTypeChanged,       callback: this._onNotifyBwCoUsingSkillChanged },
            { type: TypeId.BwOverridingSkinIdChanged,       callback: this._onNotifyBwOverridingSkinIdChanged },
            { type: TypeId.ReplayAutoReplayChanged,         callback: this._onNotifyReplayAutoReplayChanged },
            { type: TypeId.RwPauseTimeChanged,              callback: this._onNotifyRwPauseTimeChanged },
            { type: TypeId.MsgChatGetAllReadProgressList,   callback: this._onNotifyMsgChatGetAllReadProgressList },
            { type: TypeId.MsgChatUpdateReadProgress,       callback: this._onNotifyMsgChatUpdateReadProgress },
            { type: TypeId.MsgChatGetAllMessages,           callback: this._onNotifyMsgChatGetAllMessages },
            { type: TypeId.MsgChatAddMessage,               callback: this._onNotifyMsgChatAddMessage },
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

        playCoBgmWithWar({
            war                             : war,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
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

        playCoBgmWithWar({
            war                             : war,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
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

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonCoListPanel, {
            war         : war,
            playerIndex : war.getPlayerIndexInTurn(),
        });
    }
    private _onTouchedBtnWeather(): void {
        const desc = this.getOpenData()?.war.getWeatherManager().getDesc();
        if (desc == null) {
            return;
        }

        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.Weather),
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
            Idle.getInstance().apply(actionPlanner);
        }
        openPanel(getDict().BwWarInfoPanel, { war: war });
    }
    private _onTouchedBtnUnitInfo(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if ((war.getIsAutoReplay()) || (war.getIsExecutingAction())) {
            showLang(TextType.A0412);
            return;
        }

        openPanel(getDict().BwUnitListPanel, {
            war                     : war,
            callbackForMoveCursor   : unit => {
                const gridIndex = unit.getGridIndex();
                const cursor    = war.getCursor();
                cursor.setGridIndex(gridIndex);
                cursor.updateView();
                war.getView().tweenGridToCentralArea(gridIndex);
                war.getGridVisualEffect().showEffectAiming(gridIndex, 800);
                playShortSfx(ShortSfxCode.ButtonNeutral01);
            },
            callbackForSelectUnit   : unit => {
                const gridIndex = unit.getGridIndex();
                war.getCursor().setGridIndex(gridIndex);
                dispatch(TypeId.BwCursorTapped, {
                    current : gridIndex,
                    tappedOn: gridIndex,
                } as BwCursorTapped);
                closePanel(getDict().BwUnitListPanel);
            },
        });
    }
    private _onTouchedBtnChat(): void {
        openPanel(getDict().ChatPanel, { toTarget: new ChatToTarget({}) });
    }
    private _onTouchedGroupProgress(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        if (war.getIsAutoReplay()) {
            war.setIsAutoReplay(false);
            this._updateView();
        }

        if (!war.getIsRunning()) {
            show(getText(TextType.A0040));
        } else if (war.getIsExecutingAction()) {
            show(getText(TextType.A0044));
        } else {
            openPanel(getDict().RwReplayProgressPanel, { war });
        }
    }
    private _onTouchedGroupPauseTime(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().RwPauseTimePanel, {
            war     : war,
        });
    }
    private _onTouchedGroupShowUnits(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        war.setIsShowAllUnits(!war.getIsShowAllUnits());
        war.updateTilesAndUnitsOnVisibilityChanged(false);

        this._updateLabelShowUnits();
    }
    private _onTouchedGroupVisionTeam(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

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
            show(getText(TextType.A0040));
        } else if (war.getIsExecutingAction()) {
            show(getText(TextType.A0044));
        } else if (war.checkIsInBeginning()) {
            show(getText(TextType.A0042));
        } else if (war.getIsTickingReplay()) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            await checkAndCallLater();
            await war.loadPreviousAction();
            await checkAndCallLater();
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
            show(getText(TextType.A0040));
        } else if (war.getIsExecutingAction()) {
            show(getText(TextType.A0044));
        } else if (war.checkIsInBeginning()) {
            show(getText(TextType.A0042));
        } else if (war.getIsTickingReplay()) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            await checkAndCallLater();
            await war.loadPreviousCheckpoint();
            await checkAndCallLater();
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
            show(getText(TextType.A0040));
        } else if (war.getIsExecutingAction()) {
            show(getText(TextType.A0044));
        } else if (war.checkIsInBeginning()) {
            show(getText(TextType.A0042));
        } else if (war.getIsTickingReplay()) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            await checkAndCallLater();
            await war.loadCheckpoint(0);
            await checkAndCallLater();
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
            show(getText(TextType.A0040));
        } else if (war.getIsExecutingAction()) {
            show(getText(TextType.A0044));
        } else if (war.checkIsInEnd()) {
            show(getText(TextType.A0043));
        } else if (war.getIsTickingReplay()) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            await checkAndCallLater();
            await war.loadNextAction();
            await checkAndCallLater();
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
            show(getText(TextType.A0040));
        } else if (war.getIsExecutingAction()) {
            show(getText(TextType.A0044));
        } else if (war.checkIsInEnd()) {
            show(getText(TextType.A0043));
        } else if (war.getIsTickingReplay()) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            await checkAndCallLater();
            await war.loadNextCheckpoint();
            await checkAndCallLater();
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
            show(getText(TextType.A0040));
        } else if (war.getIsExecutingAction()) {
            show(getText(TextType.A0044));
        } else if (war.checkIsInEnd()) {
            show(getText(TextType.A0043));
        } else if (war.getIsTickingReplay()) {
            showLang(TextType.YouCanNotDoThisRightNow);
        } else {
            await checkAndCallLater();

            openPanel(getDict().CommonBlockPanel, {
                title   : getText(TextType.B0088),
                content : getText(TextType.A0040),
            });
            await war.loadCheckpoint(war.getAllCheckpointInfoArray().length - 1);
            closePanel(getDict().CommonBlockPanel);

            await checkAndCallLater();
            this._updateView();
        }
    }
    private _onTouchedBtnPlay(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.checkIsInEnd()) {
            show(getText(TextType.A0041));
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
            show(getText(TextType.A0041));
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
            Idle.getInstance().apply(actionPlanner);
        }

        openPanel(getDict().RwWarMenuPanel, { war: war });
    }

    private _onKeyboard(data: EventData): void {
        if (this._getIsShowingCloseAnimation()) {
            return;
        }

        if (data.isHandled) {
            return;
        }

        const newKeys   = data.newKeys;
        const hasKeyAlt = data.allKeys.has(KeyCode.Alt);
        if (newKeys.has(KeyCode.Num3)) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            data.isHandled = true;

            if (hasKeyAlt) {
                this._onTouchedBtnRewindBegin();
            } else {
                this._onTouchedBtnForwardEnd();
            }

        } else if (newKeys.has(KeyCode.Num2)) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            data.isHandled = true;

            if (hasKeyAlt) {
                this._onTouchedBtnRewindTurn();
            } else {
                this._onTouchedBtnForwardTurn();
            }

        } else if (newKeys.has(KeyCode.Num1)) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            data.isHandled = true;

            if (hasKeyAlt) {
                this._onTouchedBtnRewindAction();
            } else {
                this._onTouchedBtnForwardAction();
            }

        } else if (newKeys.has(KeyCode.Whitespace)) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            data.isHandled = true;

            if (data.allKeys.has(KeyCode.Shift)) {
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
        for (let playerIndex = PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
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
        this._groupPlayerList.setUnscaledManualHeight(Math.min((this._listPlayer.getBoundDataArray()?.length ?? 0) * 74, getStage().stageHeight - 120));
    }

    private _updateComponentsForLanguage(): void {
        this._labelTurnTitle.setLangText(TextType.Turns);
        this._labelActionTitle.setLangText(TextType.B0090);
        this._labelPauseTimeTitle.setLangText(TextType.B0846);
        this._labelShowUnitsTitle.setLangText(TextType.B1175);
        this._labelVisionTeamTitle.setLangText(TextType.B0891);
        this._btnRewindAction.setLangText(TextType.B0616);
        this._btnRewindTurn.setLangText(TextType.B0191);
        this._btnForwardTurn.setLangText(TextType.B0191);
        this._btnForwardAction.setLangText(TextType.B0616);
        this._btnInfo.setLangText(TextType.B0223);
        this._btnMenu.setLangText(TextType.B0155);

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
        this._labelPauseTime.setText(`${getReplayPauseTime()}${getText(TextType.B1290)}`);
        this._layoutPauseTime.arrangeItems();
    }

    private _updateLabelShowUnits(): void {
        this._labelShowUnits.setLangText(this.getOpenData()?.war.getIsShowAllUnits() ? TextType.B0120 : TextType.B1174);
        this._layoutShowUnits.arrangeItems();
    }

    private _updateLabelVisionTeam(): void {
        const teamIndex = this.getOpenData()?.war.getVisionTeamIndex();
        this._labelVisionTeam.setText(teamIndex == null
            ? getText(TextType.B0890)
            : (getPlayerTeamName(teamIndex) ?? UndefinedError)
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
            this._imgSkin.loadSource(getCoEyeBackground(getFinalSkinId(war, player.getPlayerIndex())));
            this._imgCo.loadSource(getCoEye(war.getGcData(), player.getCoId(), player.getAliveState() !== AliveStateId.Dead) ?? UndefinedError);
        }
    }

    private _updateBtnPlay(): void {
        this._btnPlay.setIsVisible(!this.getOpenData()?.war.getIsAutoReplay());
    }

    private _updateBtnPause(): void {
        this._btnPause.setIsVisible(!!this.getOpenData()?.war.getIsAutoReplay());
    }

    private _updateBtnChat(): void {
        this._btnChat.setRedVisible(checkHasUnreadMessage());
    }
}

interface DataForListPlayer extends UiListItemData {
    war         : IRwWar;
    playerIndex : number;
}
class PlayerRenderer extends UiListItemRenderer<DataForListPlayer> {
    private readonly _imgInTurn!            : IUiImage;
    private readonly _layoutContent!        : IUiLayout;
    private readonly _labelTeam!            : IUiLabel;
    private readonly _labelNickname!        : IUiLabel;

    private readonly _layoutCo!             : IUiLayout;
    private readonly _imgSkin!              : IUiImage;
    private readonly _imgCo!                : IUiImage;

    private readonly _layoutOuterEnergy!    : IUiLayout;
    private readonly _labelEnergy!          : IUiLabel;
    private readonly _layoutEnergy!         : IUiLayout;
    private readonly _labelEnergy1!         : IUiLabel;
    private readonly _labelEnergy2!         : IUiLabel;

    private readonly _labelFund!            : IUiLabel;
    private readonly _labelIncome!          : IUiLabel;

    private readonly _imgUnit!              : IUiImage;
    private readonly _labelUnitCount!       : IUiLabel;
    private readonly _labelUnitValue!       : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.ReplayTick,                      callback: this._onNotifyReplayTick },
            { type: TypeId.BwOverridingSkinIdChanged,       callback: this._onNotifyBwOverridingSkinIdChanged },
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
            openPanel(getDict().UserPanel, { userId });
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
        this._imgCo.loadSource(getCoEye(war.getGcData(), player.getCoId(), player.getAliveState() !== AliveStateId.Dead) ?? UndefinedError);
        this._imgUnit.loadSource(getCachedUnitImageSource({
            gcData      : war.getGcData(),
            version         : getSelfSettingsTextureVersion(),
            skinId          : player.getUnitAndTileSkinId(),
            unitType        : UnitTypeId.First,
            isDark          : false,
            animationType   : AnimationTypeId.Stand,
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

        this._imgSkin.loadSource(getCoEyeBackground(getFinalSkinId(openData.war, openData.playerIndex)));
    }

    private async _updateLabelTeamAndNickname(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const player    = openData.war.getPlayer(openData.playerIndex);
        const userId    = player.getUserId();
        this._labelTeam.setText(String.fromCharCode(`A`.charCodeAt(0) + (player.getTeamIndex() - 1)));
        this._labelNickname.setText(userId == null ? getText(TextType.B0607) : (await getUserNickname(userId) ?? UndefinedError));
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
        if (skillType === SkillTypeId.Power) {
            label.setText(`E: ${currentEnergy}(P)`);
        } else if (skillType === SkillTypeId.SuperPower) {
            label.setText(`E: ${currentEnergy}(SP)`);
        } else {
            label.setText(player.getCoEnergyType() === EnergyTypeId.Trilogy
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
