import {
    Players_Constants,
    AuxiliaryTypes_ChatToTarget,
    Chat_Model,
    GamePanels_Manager,
    Graphics_Constants,
    Helpers_ImageSource,
    GamePanels_Dict,
    Helpers_Misc,
    ForceSkins_Utils,
    Users_Model,
    Lang_Utils,
    Timer_TimerModel,
    Ui_Utils_UiSkinHelpers,
    Sounds_SoundPlayer,
    MultiPlayerWar_Model_MpwProxy,
    Sounds_Constants,
    CoSkills_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Ui_Types_UiSkinState,
    type Notifications_DataTypes,
    type Egret_Egret,
    type MultiPlayerWar_Interface_IMpwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type AuxiliaryTypes_AuxiliaryTypes,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import type { S as UserGetOnlineStateResponse } from "../../proto/schema/CommonProto/NetMessage/MsgUserGetOnlineState/S.ts";

 
enum PanelSkinState {
    Normal,
    Expanded,
}

export interface OpenData {
    war     : MultiPlayerWar_Interface_IMpwWar.IMpwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _listPlayer!           : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForListPlayer>;

    private readonly _layoutButton!         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _groupVisionTeam!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelVisionTeamTitle! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelVisionTeam!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupTimer!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelTimerTitle!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTimer!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnWeather!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnChat!              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupCo!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgSkin!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgCo!                : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupPlayer!          : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelPlayer!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPlayerState!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTurnIndex!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupInfo!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutEnergy!         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelCurrEnergy!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _layoutMaxEnergy!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _layoutPowerEnergy!    : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelPowerEnergy1!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPowerEnergy2!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelZoneEnergy!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _layoutFund!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelFund!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelAddFund!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnExpand!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnNarrow!            : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                 callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.TimeTick,                        callback : this._onNotifyTimeTick },
            { type : Notifications_TypeId.TypeId.BwPlayerFundChanged,             callback : this._onNotifyBwPlayerFundChanged },
            { type : Notifications_TypeId.TypeId.BwTurnIndexChanged,              callback : this._onNotifyBwTurnIndexChanged },
            { type : Notifications_TypeId.TypeId.BwPlayerIndexInTurnChanged,      callback : this._onNotifyBwPlayerIndexInTurnChanged },
            { type : Notifications_TypeId.TypeId.BwCoEnergyChanged,               callback : this._onNotifyBwCoEnergyChanged },
            { type : Notifications_TypeId.TypeId.BwCoUsingSkillTypeChanged,       callback : this._onNotifyBwCoUsingSkillChanged },
            { type : Notifications_TypeId.TypeId.WarOperationNormalExecuted,      callback : this._onNotifyWarOperationNormalExecuted },
            { type : Notifications_TypeId.TypeId.BwForceWeatherTypeChanged,       callback : this._onNotifyBwForceWeatherTypeChanged },
            { type : Notifications_TypeId.TypeId.BwOverridingSkinIdChanged,       callback : this._onNotifyBwOverridingSkinIdChanged },
            { type : Notifications_TypeId.TypeId.MsgChatGetAllReadProgressList,   callback : this._onNotifyMsgChatGetAllReadProgressList },
            { type : Notifications_TypeId.TypeId.MsgChatUpdateReadProgress,       callback : this._onNotifyMsgChatUpdateReadProgress },
            { type : Notifications_TypeId.TypeId.MsgChatGetAllMessages,           callback : this._onNotifyMsgChatGetAllMessages },
            { type : Notifications_TypeId.TypeId.MsgChatAddMessage,               callback : this._onNotifyMsgChatAddMessage },
            { type : Notifications_TypeId.TypeId.MsgUserGetOnlineState,           callback : this._onNotifyMsgUserGetOnlineState },
        ]);
        this._setUiListenerArray([
            { ui : this._groupTimer,         callback : this._onTouchedGroupTimer },
            { ui : this._groupVisionTeam,    callback : this._onTouchedGroupVisionTeam },
            { ui : this._btnWeather,         callback : this._onTouchedBtnWeather },
            { ui : this._groupPlayer,        callback : this._onTouchedGroupPlayer },
            { ui : this._groupCo,            callback : this._onTouchedGroupCo },
            { ui : this._groupInfo,          callback : this._onTouchedGroupInfo },
            { ui : this._btnChat,            callback : this._onTouchedBtnChat },
            { ui : this._btnExpand,          callback : this._onTouchedBtnExpand },
            { ui : this._btnNarrow,          callback : this._onTouchedBtnNarrow },
        ]);
        this._listPlayer.setItemRendererClass(PlayerRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._setPanelSkinState(PanelSkinState.Normal);

        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listPlayer.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks for notify.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyTimeTick(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        this._updateGroupTimer();

        if ((!war.getIsExecutingAction()) && (war.checkIsBoot())) {
            MultiPlayerWar_Model_MpwProxy.reqMpwCommonHandleBoot(Helpers_Misc.getExisted(war.getWarId()));
        }

        const userId = war.getPlayerInTurn().getUserId();
        if ((userId != null)                            &&
            (userId !== Users_Model.getSelfUserId()) &&
            (Timer_TimerModel.getServerTimestamp() % 10 == 0)
        ) {
            Users_Model.getUserOnlineState(userId);
        }
    }
    private _onNotifyBwPlayerFundChanged(): void {
        this._updateLabelFundAndAddFund();
    }
    private _onNotifyBwTurnIndexChanged(): void {
        this._updateLabelTurnIndex();
    }
    private _onNotifyBwPlayerIndexInTurnChanged(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        this._updateView();
        Sounds_SoundPlayer.playCoBgmWithWar({
            war                            : war,
            force                          : false,
            coBgmCodeArrayFromUserSettings : Users_Model.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
        });

        const userId = war.getPlayerInTurn().getUserId();
        if ((userId != null) && (userId !== Users_Model.getSelfUserId())) {
            Users_Model.getUserOnlineState(userId);
        }
    }
    private _onNotifyBwCoEnergyChanged(): void {
        this._updateLabelEnergy();
    }
    private _onNotifyBwCoUsingSkillChanged(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        this._updateLabelEnergy();
        Sounds_SoundPlayer.playCoBgmWithWar({
            war                            : war,
            force                          : false,
            coBgmCodeArrayFromUserSettings : Users_Model.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
        });
    }
    private _onNotifyWarOperationNormalExecuted(): void {
        this._updateLabelFundAndAddFund();
    }
    private _onNotifyBwForceWeatherTypeChanged(): void {
        this._updateBtnWeather();
    }
    private _onNotifyBwOverridingSkinIdChanged(): void {
        this._updateImgSkinAndCo();
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
    private _onNotifyMsgUserGetOnlineState(e: Egret_Egret.Event): void {
        const data = e.data as UserGetOnlineStateResponse;
        if (data.getUserId() === this.getOpenData()?.war.getPlayerInTurn().getUserId()) {
            this._updateLabelPlayerState();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks for touch.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedGroupTimer(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0826),
        });
    }

    private _onTouchedGroupVisionTeam(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        war.tickVisionTeamIndex();
        war.updateTilesAndUnitsOnVisibilityChanged(false);

        this._updateGroupVisionTeam();
    }

    private _onTouchedBtnWeather(): void {
        const desc = this.getOpenData()?.war.getWeatherManager().getDesc();
        if (desc == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.Weather),
            getContent : () => desc,
        });
    }

    private _onTouchedGroupPlayer(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const playerInfoArray: AuxiliaryTypes_AuxiliaryTypes.PlayerInfo2[] = [];
        for (const player of war.getPlayerManager().getAllPlayers(false)) {
            playerInfoArray.push({
                playerIndex : player.getPlayerIndex(),
                teamIndex   : player.getTeamIndex(),
                userId      : player.getUserId(),
                coId        : player.getCoId(),
                skinId      : player.getUnitAndTileSkinId(),
                isAlive     : player.getAliveState() !== Players_Constants.AliveStateId.Dead,
            });
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowPlayerListPanel, {
            warId           : war.getWarId(),
            gameConfig      : war.getGcData(),
            playerInfoArray : playerInfoArray,
        });

        const userId = war.getPlayerInTurn().getUserId();
        if ((userId != null) && (userId !== Users_Model.getSelfUserId())) {
            Users_Model.getUserOnlineState(userId);
        }
    }

    private _onTouchedGroupCo(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonCoListPanel, {
            war         : war,
            playerIndex : war.getPlayerIndexInTurn(),
        });
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().MpwWarMenuPanel);
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupInfo(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonCoListPanel, {
            war         : war,
            playerIndex : war.getPlayerIndexInTurn(),
        });
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().MpwWarMenuPanel);
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnChat(): void {
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().MpwWarMenuPanel);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ChatPanel, { toTarget : new AuxiliaryTypes_ChatToTarget.ChatToTarget({}) });
    }

    private _onTouchedBtnExpand(): void {
        this._setPanelSkinState(PanelSkinState.Expanded);
    }

    private _onTouchedBtnNarrow(): void {
        this._setPanelSkinState(PanelSkinState.Normal);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for views.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListPlayer();
        this._updateImgSkinAndCo();
        this._updateLabelPlayerState();
        this._updateLabelPlayer();
        this._updateLabelTurnIndex();
        this._updateBtnWeather();
        this._updateGroupTimer();
        this._updateLabelFundAndAddFund();
        this._updateLabelEnergy();
        this._updateBtnChat();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTimerTitle.setLangText(Lang_Constants.TextType.B0188);
        this._labelVisionTeamTitle.setLangText(Lang_Constants.TextType.B0891);

        this._updateGroupVisionTeam();
        this._updateLabelPlayerState();
        this._updateLabelTurnIndex();
    }

    private async _updateListPlayer(): Promise<void> {
        await this._listPlayer.bindData(this._createDataArrayForListPlayer());
    }

    private async _updateLabelPlayerState(): Promise<void> {
        const userId    = this.getOpenData()?.war.getPlayerInTurn().getUserId();
        const label     = this._labelPlayerState;
        if ((userId == null) || (userId === Users_Model.getSelfUserId())) {
            label.setLangText(Lang_Constants.TextType.B0676);
            label.setTextColor(Graphics_Constants.ColorValue.Green);
        } else {
            const userOnlineState = await Users_Model.getUserOnlineState(userId);
            if ((userOnlineState == null) || (!userOnlineState.isOnline)) {
                label.setLangText(Lang_Constants.TextType.B0677);
                label.setTextColor(Graphics_Constants.ColorValue.Red);
            } else {
                label.setLangText(Lang_Constants.TextType.B0676);
                label.setTextColor((Timer_TimerModel.getServerTimestamp() - userOnlineState.lastActivityTimestamp > 60) ? Graphics_Constants.ColorValue.Yellow : Graphics_Constants.ColorValue.Green);
            }
        }
        this._groupPlayer.arrangeItems();
    }

    private async _updateLabelPlayer(): Promise<void> {
        this._labelPlayer.setText(`${await this.getOpenData()?.war.getPlayerInTurn()?.getNickname()}`);
        this._groupPlayer.arrangeItems();
    }

    private _updateLabelTurnIndex(): void {
        this._labelTurnIndex.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0191)} ${this.getOpenData()?.war.getTurnManager().getTurnIndex()}`);
        this._groupPlayer.arrangeItems();
    }

    private _updateGroupVisionTeam(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const group = this._groupVisionTeam;
        if (!war.checkCanTickVisionTeamIndex()) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);

            const teamIndex = war.getVisionTeamIndex();
            this._labelVisionTeam.setText(teamIndex == null
                ? Lang_Utils.getText(Lang_Constants.TextType.B0890)
                : (Lang_Utils.getPlayerTeamName(teamIndex) ?? Lang_Constants.UndefinedError),
            );

            group.arrangeItems();
            this._layoutButton.arrangeItems();
        }
    }

    private _updateBtnWeather(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        this._btnWeather.setIconSource(war.getGcData().getWeatherCfg(war.getWeatherManager().getCurrentWeatherType())?.getIcon() ?? ``);
    }

    private _updateGroupTimer(): void {
        const war       = this.getOpenData()?.war;
        const group     = this._groupTimer;
        const restTime  = war ? war.getBootRestTime(war.getPlayerIndexInTurn()) : null;
        if (restTime == null) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);

            const label     = this._labelTimer;
            label.setText(Lang_Utils.getTimeDurationText2(restTime));
            label.setTextColor(restTime >= 30 * 60
                ? 0xFFFFFF
                : (restTime >= 5 * 60 ? 0xFFFF00 : 0xFF4400),
            );

            group.arrangeItems();
            this._layoutButton.arrangeItems();
        }
    }

    private _updateLabelFundAndAddFund(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const playerInTurn  = war.getPlayerInTurn();
        const labelFund     = this._labelFund;
        const labelAddFund  = this._labelAddFund;
        if ((war.getFogMap().checkHasFogCurrently())                                                        &&
            (!war.getPlayerManager().getWatcherTeamIndexesForSelf().has(playerInTurn.getTeamIndex()))
        ) {
            labelFund.setText(`????`);
            labelAddFund.setText(`(+??)`);
        } else {
            labelFund.setText(`${playerInTurn.getFund()}`);
            labelAddFund.setText(`(+${war.getTileMap().getTotalIncomeForPlayer(playerInTurn.getPlayerIndex())})`);
        }
        this._layoutFund.arrangeItems();
    }

    private _updateImgSkinAndCo(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const player = war.getPlayerInTurn();
        this._imgSkin.loadSource(Helpers_ImageSource.getCoEyeBackground(ForceSkins_Utils.getFinalSkinId(war, player.getPlayerIndex())));
        this._imgCo.loadSource(Helpers_ImageSource.getCoEye(war.getGcData(), player.getCoId(), player.getAliveState() !== Players_Constants.AliveStateId.Dead) ?? Lang_Constants.UndefinedError);
    }

    private _updateLabelEnergy(): void {
        const war = this.getOpenData()?.war;
        if ((war) && (war.getIsRunning())) {
            const player            = war.getPlayerInTurn();
            const skillType         = player.getCoUsingSkillType();
            const labelCurrEnergy   = this._labelCurrEnergy;
            const currentEnergy     = player.getCoCurrentEnergy();
            if (skillType === CoSkills_Constants.SkillTypeId.Power) {
                labelCurrEnergy.setText(`${currentEnergy}(P)`);
            } else if (skillType === CoSkills_Constants.SkillTypeId.SuperPower) {
                labelCurrEnergy.setText(`${currentEnergy}(SP)`);
            } else {
                labelCurrEnergy.setText(`${player.getCoCurrentEnergy()}`);
            }

            const powerEnergy           = player.getCoPowerEnergy();
            const superPowerEnergy      = player.getCoSuperPowerEnergy();
            const labelPowerEnergy1     = this._labelPowerEnergy1;
            const labelPowerEnergy2     = this._labelPowerEnergy2;
            labelPowerEnergy1.setText(`${powerEnergy == null ? `--` : powerEnergy}`);
            labelPowerEnergy1.setTextColor((powerEnergy != null) && (currentEnergy >= powerEnergy) ? 0x00FF00 : 0xFFFFFF);
            labelPowerEnergy2.setText(`${superPowerEnergy == null ? `--` : superPowerEnergy}`);
            labelPowerEnergy2.setTextColor((superPowerEnergy != null) && (currentEnergy >= superPowerEnergy) ? 0x00FF00 : 0xFFFFFF);

            const zoneEnergyText        = (player.getCoZoneExpansionEnergyList() || []).join(` / `);
            this._labelZoneEnergy.setText(`Z:${zoneEnergyText.length ? zoneEnergyText : `--`}`);

            this._layoutPowerEnergy.arrangeItems();
            this._layoutMaxEnergy.arrangeItems();
            this._layoutEnergy.arrangeItems();
        }
    }

    private _updateBtnChat(): void {
        this._btnChat.setRedVisible(Chat_Model.checkHasUnreadMessage());
    }

    private _setPanelSkinState(state: PanelSkinState): void {
        Ui_Utils_UiSkinHelpers.loadSkinStateRecursively(this, state === PanelSkinState.Normal ? Ui_Types_UiSkinState.UiSkinState.Normal : Ui_Types_UiSkinState.UiSkinState.Expanded);

        this._btnExpand.setIsVisible((state === PanelSkinState.Normal) && ((this.getOpenData()?.war.getPlayersCountUnneutral() ?? 0) > 2));
        this._listPlayer.scrollTop();
    }

    private _createDataArrayForListPlayer(): DataForListPlayer[] {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return [];
        }

        const playerIndexInTurn     = war.getPlayerIndexInTurn();
        const playersCountUnneutral = war.getPlayerManager().getTotalPlayersCount(false);
        const dataArray             : DataForListPlayer[] = [];
        for (let playerIndex = playerIndexInTurn + 1; playerIndex <= playersCountUnneutral; ++playerIndex) {
            dataArray.push({
                war,
                playerIndex,
            });
        }
        for (let playerIndex = Players_Constants.PlayerIndex.First; playerIndex < playerIndexInTurn; ++playerIndex) {
            dataArray.push({
                war,
                playerIndex,
            });
        }
        return dataArray;
    }
}

interface DataForListPlayer extends Ui_Types_UiListItemData.UiListItemData {
    war         : MultiPlayerWar_Interface_IMpwWar.IMpwWar;
    playerIndex : number;
}
class PlayerRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForListPlayer> {
    private readonly _imgSkin!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgCo!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgOnlineState!   : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _layoutEnergy!     : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelEnergy!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelEnergy1!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelEnergy2!     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelFund!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelAddFund!     : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.MsgUserGetOnlineState,       callback : this._onNotifyMsgUserGetOnlineState },
            { type : Notifications_TypeId.TypeId.TimeTick,                    callback : this._onNotifyTimeTick },
            { type : Notifications_TypeId.TypeId.BwPlayerFundChanged,         callback : this._onNotifyBwPlayerFundChanged },
            { type : Notifications_TypeId.TypeId.WarOperationNormalExecuted,  callback : this._onNotifyWarOperationNormalExecuted },
            { type : Notifications_TypeId.TypeId.BwCoUsingSkillTypeChanged,   callback : this._onNotifyBwCoUsingSkillChanged },
            { type : Notifications_TypeId.TypeId.BwCoEnergyChanged,           callback : this._onNotifyBwCoEnergyChanged },
            { type : Notifications_TypeId.TypeId.BwOverridingSkinIdChanged,   callback : this._onNotifyBwOverridingSkinIdChanged },
        ]);
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onNotifyMsgUserGetOnlineState(): void {
        this._updateImgOnlineState();
    }

    private _onNotifyTimeTick(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war       = openData.war;
        const userId    = war.getPlayer(openData.playerIndex).getUserId();
        if ((userId != null)                        &&
            (userId !== Users_Model.getSelfUserId())  &&
            (Timer_TimerModel.getServerTimestamp() % 60 == 0)
        ) {
            Users_Model.getUserOnlineState(userId);
        }
    }

    private _onNotifyBwPlayerFundChanged(e: Egret_Egret.Event): void {
        const eventData = e.data as Notifications_DataTypes.BwPlayerFundChanged;
        const openData  = this.getOpenData();
        if (eventData.player === openData?.war.getPlayer(openData.playerIndex)) {
            this._updateLabelFundAndAddFund();
        }
    }

    private _onNotifyWarOperationNormalExecuted(): void {
        this._updateLabelFundAndAddFund();
    }

    private _onNotifyBwCoUsingSkillChanged(): void {
        this._updateLabelEnergy();
    }

    private _onNotifyBwCoEnergyChanged(): void {
        this._updateLabelEnergy();
    }

    private _onNotifyBwOverridingSkinIdChanged(): void {
        this._updateImgSkin();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonCoListPanel, {
            war         : openData.war,
            playerIndex : openData.playerIndex,
        });
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war       = openData.war;
        const player    = war.getPlayer(openData.playerIndex);
        this._imgCo.loadSource(Helpers_ImageSource.getCoEye(war.getGcData(), player.getCoId(), player.getAliveState() !== Players_Constants.AliveStateId.Dead) ?? Lang_Constants.UndefinedError);
        this._updateImgSkin();
        this._updateImgOnlineState();
        this._updateLabelFundAndAddFund();
        this._updateLabelEnergy();
    }

    private _updateImgSkin(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgSkin.loadSource(Helpers_ImageSource.getCoEyeBackground(ForceSkins_Utils.getFinalSkinId(openData.war, openData.playerIndex)));
    }

    private async _updateImgOnlineState(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const userId    = openData.war.getPlayer(openData.playerIndex).getUserId();
        const img       = this._imgOnlineState;
        if ((userId == null) || (userId === Users_Model.getSelfUserId())) {
            img.loadSource(`uncompressedColorGreen0000`);
        } else {
            img.loadSource(Helpers_ImageSource.getUserOnlineState(await Users_Model.getUserOnlineState(userId)));
        }
    }

    private _updateLabelFundAndAddFund(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war           = openData.war;
        const player        = war.getPlayer(openData.playerIndex);
        const labelFund     = this._labelFund;
        const labelAddFund  = this._labelAddFund;
        if ((war.getFogMap().checkHasFogCurrently())                                                &&
            (!war.getPlayerManager().getWatcherTeamIndexesForSelf().has(player.getTeamIndex()))
        ) {
            labelFund.setText(`????`);
            labelAddFund.setText(`(+??)`);
        } else {
            labelFund.setText(`${player.getFund()}`);
            labelAddFund.setText(`(+${war.getTileMap().getTotalIncomeForPlayer(player.getPlayerIndex())})`);
        }
    }

    private _updateLabelEnergy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war           = openData.war;
        const player        = war.getPlayer(openData.playerIndex);
        const skillType     = player.getCoUsingSkillType();
        const labelEnergy   = this._labelEnergy;
        const currentEnergy = player.getCoCurrentEnergy();
        if (skillType === CoSkills_Constants.SkillTypeId.Power) {
            labelEnergy.setText(`${currentEnergy}(P)`);
        } else if (skillType === CoSkills_Constants.SkillTypeId.SuperPower) {
            labelEnergy.setText(`${currentEnergy}(SP)`);
        } else {
            labelEnergy.setText(`${player.getCoCurrentEnergy()}`);
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
    }
}
