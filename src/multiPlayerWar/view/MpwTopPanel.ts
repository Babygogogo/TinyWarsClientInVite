import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesChatToTarget from "../../auxiliaryTypes/ChatToTarget.ts";
import * as ChatModel from "../../chat/Model.ts";
import * as CoSkillsConstants from "../../coSkills/Constants.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../interface/IMpwWar.ts";
import * as MultiPlayerWarModelMpwProxy from "../model/MpwProxy.ts";
import type * as NotificationsDataTypes from "../../notifications/DataTypes.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgUserGetOnlineStateS from "../../proto/schema/CommonProto/NetMessage/MsgUserGetOnlineState/S.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
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
import * as UiTypesUiSkinState from "../../ui/types/UiSkinState.ts";
import * as UiUtilsUiSkinHelpers from "../../ui/utils/UiSkinHelpers.ts";
import * as UsersModel from "../../users/Model.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

// eslint-disable-next-line no-shadow
enum PanelSkinState {
    Normal,
    Expanded,
}

export interface OpenData {
    war     : MultiPlayerWarInterfaceIMpwWar.IMpwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _listPlayer!           : UiInterfacesIUiScrollList.IUiScrollList<DataForListPlayer>;

    private readonly _layoutButton!         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupVisionTeam!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelVisionTeamTitle! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelVisionTeam!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupTimer!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelTimerTitle!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTimer!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnWeather!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnChat!              : UiInterfacesIUiButton.IUiButton;

    private readonly _groupCo!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgSkin!              : UiInterfacesIUiImage.IUiImage;
    private readonly _imgCo!                : UiInterfacesIUiImage.IUiImage;

    private readonly _groupPlayer!          : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelPlayer!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPlayerState!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTurnIndex!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupInfo!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutEnergy!         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelCurrEnergy!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _layoutMaxEnergy!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _layoutPowerEnergy!    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelPowerEnergy1!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPowerEnergy2!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelZoneEnergy!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _layoutFund!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelFund!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelAddFund!         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnExpand!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnNarrow!            : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.TimeTick,                        callback: this._onNotifyTimeTick },
            { type: NotificationsTypeId.TypeId.BwPlayerFundChanged,             callback: this._onNotifyBwPlayerFundChanged },
            { type: NotificationsTypeId.TypeId.BwTurnIndexChanged,              callback: this._onNotifyBwTurnIndexChanged },
            { type: NotificationsTypeId.TypeId.BwPlayerIndexInTurnChanged,      callback: this._onNotifyBwPlayerIndexInTurnChanged },
            { type: NotificationsTypeId.TypeId.BwCoEnergyChanged,               callback: this._onNotifyBwCoEnergyChanged },
            { type: NotificationsTypeId.TypeId.BwCoUsingSkillTypeChanged,       callback: this._onNotifyBwCoUsingSkillChanged },
            { type: NotificationsTypeId.TypeId.WarOperationNormalExecuted,      callback: this._onNotifyWarOperationNormalExecuted },
            { type: NotificationsTypeId.TypeId.BwForceWeatherTypeChanged,       callback: this._onNotifyBwForceWeatherTypeChanged },
            { type: NotificationsTypeId.TypeId.BwOverridingSkinIdChanged,       callback: this._onNotifyBwOverridingSkinIdChanged },
            { type: NotificationsTypeId.TypeId.MsgChatGetAllReadProgressList,   callback: this._onNotifyMsgChatGetAllReadProgressList },
            { type: NotificationsTypeId.TypeId.MsgChatUpdateReadProgress,       callback: this._onNotifyMsgChatUpdateReadProgress },
            { type: NotificationsTypeId.TypeId.MsgChatGetAllMessages,           callback: this._onNotifyMsgChatGetAllMessages },
            { type: NotificationsTypeId.TypeId.MsgChatAddMessage,               callback: this._onNotifyMsgChatAddMessage },
            { type: NotificationsTypeId.TypeId.MsgUserGetOnlineState,           callback: this._onNotifyMsgUserGetOnlineState },
        ]);
        this._setUiListenerArray([
            { ui: this._groupTimer,         callback: this._onTouchedGroupTimer },
            { ui: this._groupVisionTeam,    callback: this._onTouchedGroupVisionTeam },
            { ui: this._btnWeather,         callback: this._onTouchedBtnWeather },
            { ui: this._groupPlayer,        callback: this._onTouchedGroupPlayer },
            { ui: this._groupCo,            callback: this._onTouchedGroupCo },
            { ui: this._groupInfo,          callback: this._onTouchedGroupInfo },
            { ui: this._btnChat,            callback: this._onTouchedBtnChat },
            { ui: this._btnExpand,          callback: this._onTouchedBtnExpand },
            { ui: this._btnNarrow,          callback: this._onTouchedBtnNarrow },
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
            MultiPlayerWarModelMpwProxy.reqMpwCommonHandleBoot(HelpersMisc.getExisted(war.getWarId()));
        }

        const userId = war.getPlayerInTurn().getUserId();
        if ((userId != null)                            &&
            (userId !== UsersModel.getSelfUserId()) &&
            (TimerTimerModel.getServerTimestamp() % 10 == 0)
        ) {
            UsersModel.getUserOnlineState(userId);
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
        SoundsSoundPlayer.playCoBgmWithWar({
            war                             : war,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : UsersModel.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
        });

        const userId = war.getPlayerInTurn().getUserId();
        if ((userId != null) && (userId !== UsersModel.getSelfUserId())) {
            UsersModel.getUserOnlineState(userId);
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
        SoundsSoundPlayer.playCoBgmWithWar({
            war                             : war,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : UsersModel.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
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
    private _onNotifyMsgUserGetOnlineState(e: VendorEgretEgret.Event): void {
        const data = e.data as ProtoSchemaCommonProtoNetMessageMsgUserGetOnlineStateS.S;
        if (data.getUserId() === this.getOpenData()?.war.getPlayerInTurn().getUserId()) {
            this._updateLabelPlayerState();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks for touch.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedGroupTimer(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0826),
        });
    }

    private _onTouchedGroupVisionTeam(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        war.tickVisionTeamIndex();
        war.updateTilesAndUnitsOnVisibilityChanged(false);

        this._updateGroupVisionTeam();
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

    private _onTouchedGroupPlayer(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const playerInfoArray: AuxiliaryTypesAuxiliaryTypes.PlayerInfo2[] = [];
        for (const player of war.getPlayerManager().getAllPlayers(false)) {
            playerInfoArray.push({
                playerIndex : player.getPlayerIndex(),
                teamIndex   : player.getTeamIndex(),
                userId      : player.getUserId(),
                coId        : player.getCoId(),
                skinId      : player.getUnitAndTileSkinId(),
                isAlive     : player.getAliveState() !== PlayersConstants.AliveStateId.Dead,
            });
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowPlayerListPanel, {
            warId           : war.getWarId(),
            gameConfig      : war.getGcData(),
            playerInfoArray : playerInfoArray,
        });

        const userId = war.getPlayerInTurn().getUserId();
        if ((userId != null) && (userId !== UsersModel.getSelfUserId())) {
            UsersModel.getUserOnlineState(userId);
        }
    }

    private _onTouchedGroupCo(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonCoListPanel, {
            war         : war,
            playerIndex : war.getPlayerIndexInTurn(),
        });
        GamePanelsManager.closePanel(GamePanelsDict.getDict().MpwWarMenuPanel);
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupInfo(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonCoListPanel, {
            war         : war,
            playerIndex : war.getPlayerIndexInTurn(),
        });
        GamePanelsManager.closePanel(GamePanelsDict.getDict().MpwWarMenuPanel);
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnChat(): void {
        GamePanelsManager.closePanel(GamePanelsDict.getDict().MpwWarMenuPanel);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().ChatPanel, { toTarget: new AuxiliaryTypesChatToTarget.ChatToTarget({}) });
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
        this._labelTimerTitle.setText(LangUtils.getText(LangConstants.TextType.B0188));
        this._labelVisionTeamTitle.setText(LangUtils.getText(LangConstants.TextType.B0891));

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
        if ((userId == null) || (userId === UsersModel.getSelfUserId())) {
            label.setText(LangUtils.getText(LangConstants.TextType.B0676));
            label.setTextColor(GraphicsConstants.ColorValue.Green);
        } else {
            const userOnlineState = await UsersModel.getUserOnlineState(userId);
            if ((userOnlineState == null) || (!userOnlineState.isOnline)) {
                label.setText(LangUtils.getText(LangConstants.TextType.B0677));
                label.setTextColor(GraphicsConstants.ColorValue.Red);
            } else {
                label.setText(LangUtils.getText(LangConstants.TextType.B0676));
                label.setTextColor((TimerTimerModel.getServerTimestamp() - HelpersMisc.getExisted(userOnlineState.lastActivityTimestamp) > 60) ? GraphicsConstants.ColorValue.Yellow : GraphicsConstants.ColorValue.Green);
            }
        }
        this._groupPlayer.arrangeItems();
    }

    private async _updateLabelPlayer(): Promise<void> {
        this._labelPlayer.setText(`${await this.getOpenData()?.war.getPlayerInTurn()?.getNickname()}`);
        this._groupPlayer.arrangeItems();
    }

    private _updateLabelTurnIndex(): void {
        this._labelTurnIndex.setText(`${LangUtils.getText(LangConstants.TextType.B0191)} ${this.getOpenData()?.war.getTurnManager().getTurnIndex()}`);
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
                ? LangUtils.getText(LangConstants.TextType.B0890)
                : (LangUtils.getPlayerTeamName(teamIndex) ?? LangConstants.UndefinedError)
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
            label.setText(LangUtils.getTimeDurationText2(restTime));
            label.setTextColor(restTime >= 30 * 60
                ? 0xFFFFFF
                : (restTime >= 5 * 60 ? 0xFFFF00 : 0xFF4400)
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
        this._imgSkin.loadSource(HelpersImageSource.getCoEyeBackground(ForceSkinsUtils.getFinalSkinId(war, player.getPlayerIndex())));
        this._imgCo.loadSource(HelpersImageSource.getCoEye(war.getGcData(), player.getCoId(), player.getAliveState() !== PlayersConstants.AliveStateId.Dead) ?? LangConstants.UndefinedError);
    }

    private _updateLabelEnergy(): void {
        const war = this.getOpenData()?.war;
        if ((war) && (war.getIsRunning())) {
            const player            = war.getPlayerInTurn();
            const skillType         = player.getCoUsingSkillType();
            const labelCurrEnergy   = this._labelCurrEnergy;
            const currentEnergy     = player.getCoCurrentEnergy();
            if (skillType === CoSkillsConstants.SkillTypeId.Power) {
                labelCurrEnergy.setText(`${currentEnergy}(P)`);
            } else if (skillType === CoSkillsConstants.SkillTypeId.SuperPower) {
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
        this._btnChat.setRedVisible(ChatModel.checkHasUnreadMessage());
    }

    private _setPanelSkinState(state: PanelSkinState): void {
        UiUtilsUiSkinHelpers.loadSkinStateRecursively(this, state === PanelSkinState.Normal ? UiTypesUiSkinState.UiSkinState.Normal : UiTypesUiSkinState.UiSkinState.Expanded);

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
        for (let playerIndex = PlayersConstants.PlayerIndex.First; playerIndex < playerIndexInTurn; ++playerIndex) {
            dataArray.push({
                war,
                playerIndex,
            });
        }
        return dataArray;
    }
}

interface DataForListPlayer extends UiTypesUiListItemData.UiListItemData {
    war         : MultiPlayerWarInterfaceIMpwWar.IMpwWar;
    playerIndex : number;
}
class PlayerRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForListPlayer> {
    private readonly _imgSkin!          : UiInterfacesIUiImage.IUiImage;
    private readonly _imgCo!            : UiInterfacesIUiImage.IUiImage;
    private readonly _imgOnlineState!   : UiInterfacesIUiImage.IUiImage;

    private readonly _layoutEnergy!     : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelEnergy!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelEnergy1!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelEnergy2!     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelFund!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelAddFund!     : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.MsgUserGetOnlineState,       callback: this._onNotifyMsgUserGetOnlineState },
            { type: NotificationsTypeId.TypeId.TimeTick,                    callback: this._onNotifyTimeTick },
            { type: NotificationsTypeId.TypeId.BwPlayerFundChanged,         callback: this._onNotifyBwPlayerFundChanged },
            { type: NotificationsTypeId.TypeId.WarOperationNormalExecuted,  callback: this._onNotifyWarOperationNormalExecuted },
            { type: NotificationsTypeId.TypeId.BwCoUsingSkillTypeChanged,   callback: this._onNotifyBwCoUsingSkillChanged },
            { type: NotificationsTypeId.TypeId.BwCoEnergyChanged,           callback: this._onNotifyBwCoEnergyChanged },
            { type: NotificationsTypeId.TypeId.BwOverridingSkinIdChanged,   callback: this._onNotifyBwOverridingSkinIdChanged },
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
            (userId !== UsersModel.getSelfUserId())  &&
            (TimerTimerModel.getServerTimestamp() % 60 == 0)
        ) {
            UsersModel.getUserOnlineState(userId);
        }
    }

    private _onNotifyBwPlayerFundChanged(e: VendorEgretEgret.Event): void {
        const eventData = e.data as NotificationsDataTypes.BwPlayerFundChanged;
        const openData  = this.getOpenData();
        if (eventData === openData?.war.getPlayer(openData.playerIndex)) {
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonCoListPanel, {
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
        this._imgCo.loadSource(HelpersImageSource.getCoEye(war.getGcData(), player.getCoId(), player.getAliveState() !== PlayersConstants.AliveStateId.Dead) ?? LangConstants.UndefinedError);
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

        this._imgSkin.loadSource(HelpersImageSource.getCoEyeBackground(ForceSkinsUtils.getFinalSkinId(openData.war, openData.playerIndex)));
    }

    private async _updateImgOnlineState(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const userId    = openData.war.getPlayer(openData.playerIndex).getUserId();
        const img       = this._imgOnlineState;
        if ((userId == null) || (userId === UsersModel.getSelfUserId())) {
            img.loadSource(`uncompressedColorGreen0000`);
        } else {
            img.loadSource(HelpersImageSource.getUserOnlineState(await UsersModel.getUserOnlineState(userId)));
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
        if (skillType === CoSkillsConstants.SkillTypeId.Power) {
            labelEnergy.setText(`${currentEnergy}(P)`);
        } else if (skillType === CoSkillsConstants.SkillTypeId.SuperPower) {
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
