import type { PlayerInfo2 } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { ChatToTarget } from "../../auxiliaryTypes/ChatToTarget.ts";
import { checkHasUnreadMessage } from "../../chat/Model.ts";
import { SkillTypeId } from "../../coSkills/Constants.ts";
import { getFinalSkinId } from "../../forceSkins/Utils.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel, closePanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { getCoEyeBackground, getCoEye, getUserOnlineState } from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getPlayerTeamName, getTimeDurationText2 } from "../../lang/Utils.ts";
import type { IMpwWar } from "../interface/IMpwWar.ts";
import { reqMpwCommonHandleBoot } from "../model/MpwProxy.ts";
import type { BwPlayerFundChanged } from "../../notifications/DataTypes.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { AliveStateId, PlayerIndex } from "../../players/Constants.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgUserGetOnlineState/S.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playCoBgmWithWar, playShortSfx } from "../../sounds/SoundPlayer.ts";
import { getServerTimestamp } from "../../timer/TimerModel.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { UiSkinState } from "../../ui/types/UiSkinState.ts";
import { loadSkinStateRecursively } from "../../ui/utils/UiSkinHelpers.ts";
import { getSelfUserId, getUserOnlineState as UsersModelGetUserOnlineState, getSelfSettingsCoBgmCodeArray } from "../../users/Model.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

// eslint-disable-next-line no-shadow
enum PanelSkinState {
    Normal,
    Expanded,
}

export interface OpenData {
    war     : IMpwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _listPlayer!           : IUiScrollList<DataForListPlayer>;

    private readonly _layoutButton!         : IUiLayout;
    private readonly _groupVisionTeam!      : IUiLayout;
    private readonly _labelVisionTeamTitle! : IUiLabel;
    private readonly _labelVisionTeam!      : IUiLabel;

    private readonly _groupTimer!           : IUiLayout;
    private readonly _labelTimerTitle!      : IUiLabel;
    private readonly _labelTimer!           : IUiLabel;

    private readonly _btnWeather!           : IUiButton;
    private readonly _btnChat!              : IUiButton;

    private readonly _groupCo!              : IUiContainer;
    private readonly _imgSkin!              : IUiImage;
    private readonly _imgCo!                : IUiImage;

    private readonly _groupPlayer!          : IUiLayout;
    private readonly _labelPlayer!          : IUiLabel;
    private readonly _labelPlayerState!     : IUiLabel;
    private readonly _labelTurnIndex!       : IUiLabel;

    private readonly _groupInfo!            : IUiContainer;
    private readonly _layoutEnergy!         : IUiLayout;
    private readonly _labelCurrEnergy!      : IUiLabel;
    private readonly _layoutMaxEnergy!      : IUiLayout;
    private readonly _layoutPowerEnergy!    : IUiLayout;
    private readonly _labelPowerEnergy1!    : IUiLabel;
    private readonly _labelPowerEnergy2!    : IUiLabel;
    private readonly _labelZoneEnergy!      : IUiLabel;

    private readonly _layoutFund!           : IUiLayout;
    private readonly _labelFund!            : IUiLabel;
    private readonly _labelAddFund!         : IUiLabel;

    private readonly _btnExpand!            : IUiButton;
    private readonly _btnNarrow!            : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.TimeTick,                        callback: this._onNotifyTimeTick },
            { type: TypeId.BwPlayerFundChanged,             callback: this._onNotifyBwPlayerFundChanged },
            { type: TypeId.BwTurnIndexChanged,              callback: this._onNotifyBwTurnIndexChanged },
            { type: TypeId.BwPlayerIndexInTurnChanged,      callback: this._onNotifyBwPlayerIndexInTurnChanged },
            { type: TypeId.BwCoEnergyChanged,               callback: this._onNotifyBwCoEnergyChanged },
            { type: TypeId.BwCoUsingSkillTypeChanged,       callback: this._onNotifyBwCoUsingSkillChanged },
            { type: TypeId.WarOperationNormalExecuted,      callback: this._onNotifyWarOperationNormalExecuted },
            { type: TypeId.BwForceWeatherTypeChanged,       callback: this._onNotifyBwForceWeatherTypeChanged },
            { type: TypeId.BwOverridingSkinIdChanged,       callback: this._onNotifyBwOverridingSkinIdChanged },
            { type: TypeId.MsgChatGetAllReadProgressList,   callback: this._onNotifyMsgChatGetAllReadProgressList },
            { type: TypeId.MsgChatUpdateReadProgress,       callback: this._onNotifyMsgChatUpdateReadProgress },
            { type: TypeId.MsgChatGetAllMessages,           callback: this._onNotifyMsgChatGetAllMessages },
            { type: TypeId.MsgChatAddMessage,               callback: this._onNotifyMsgChatAddMessage },
            { type: TypeId.MsgUserGetOnlineState,           callback: this._onNotifyMsgUserGetOnlineState },
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
            reqMpwCommonHandleBoot(getExisted(war.getWarId()));
        }

        const userId = war.getPlayerInTurn().getUserId();
        if ((userId != null)                            &&
            (userId !== getSelfUserId()) &&
            (getServerTimestamp() % 10 == 0)
        ) {
            UsersModelGetUserOnlineState(userId);
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
        playCoBgmWithWar({
            war                             : war,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
        });

        const userId = war.getPlayerInTurn().getUserId();
        if ((userId != null) && (userId !== getSelfUserId())) {
            UsersModelGetUserOnlineState(userId);
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
        playCoBgmWithWar({
            war                             : war,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
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
    private _onNotifyMsgUserGetOnlineState(e: Event): void {
        const data = e.data as S;
        if (data.getUserId() === this.getOpenData()?.war.getPlayerInTurn().getUserId()) {
            this._updateLabelPlayerState();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks for touch.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedGroupTimer(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0826),
        });
    }

    private _onTouchedGroupVisionTeam(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        war.tickVisionTeamIndex();
        war.updateTilesAndUnitsOnVisibilityChanged(false);

        this._updateGroupVisionTeam();
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

    private _onTouchedGroupPlayer(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const playerInfoArray: PlayerInfo2[] = [];
        for (const player of war.getPlayerManager().getAllPlayers(false)) {
            playerInfoArray.push({
                playerIndex : player.getPlayerIndex(),
                teamIndex   : player.getTeamIndex(),
                userId      : player.getUserId(),
                coId        : player.getCoId(),
                skinId      : player.getUnitAndTileSkinId(),
                isAlive     : player.getAliveState() !== AliveStateId.Dead,
            });
        }

        openPanel(getDict().CommonShowPlayerListPanel, {
            warId           : war.getWarId(),
            gameConfig      : war.getGcData(),
            playerInfoArray : playerInfoArray,
        });

        const userId = war.getPlayerInTurn().getUserId();
        if ((userId != null) && (userId !== getSelfUserId())) {
            UsersModelGetUserOnlineState(userId);
        }
    }

    private _onTouchedGroupCo(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().CommonCoListPanel, {
            war         : war,
            playerIndex : war.getPlayerIndexInTurn(),
        });
        closePanel(getDict().MpwWarMenuPanel);
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedGroupInfo(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().CommonCoListPanel, {
            war         : war,
            playerIndex : war.getPlayerIndexInTurn(),
        });
        closePanel(getDict().MpwWarMenuPanel);
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onTouchedBtnChat(): void {
        closePanel(getDict().MpwWarMenuPanel);
        openPanel(getDict().ChatPanel, { toTarget: new ChatToTarget({}) });
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
        this._labelTimerTitle.setLangText(TextType.B0188);
        this._labelVisionTeamTitle.setLangText(TextType.B0891);

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
        if ((userId == null) || (userId === getSelfUserId())) {
            label.setLangText(TextType.B0676);
            label.setTextColor(ColorValue.Green);
        } else {
            const userOnlineState = await UsersModelGetUserOnlineState(userId);
            if ((userOnlineState == null) || (!userOnlineState.isOnline)) {
                label.setLangText(TextType.B0677);
                label.setTextColor(ColorValue.Red);
            } else {
                label.setLangText(TextType.B0676);
                label.setTextColor((getServerTimestamp() - userOnlineState.lastActivityTimestamp > 60) ? ColorValue.Yellow : ColorValue.Green);
            }
        }
        this._groupPlayer.arrangeItems();
    }

    private async _updateLabelPlayer(): Promise<void> {
        this._labelPlayer.setText(`${await this.getOpenData()?.war.getPlayerInTurn()?.getNickname()}`);
        this._groupPlayer.arrangeItems();
    }

    private _updateLabelTurnIndex(): void {
        this._labelTurnIndex.setText(`${getText(TextType.B0191)} ${this.getOpenData()?.war.getTurnManager().getTurnIndex()}`);
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
                ? getText(TextType.B0890)
                : (getPlayerTeamName(teamIndex) ?? UndefinedError)
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
            label.setText(getTimeDurationText2(restTime));
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
        this._imgSkin.loadSource(getCoEyeBackground(getFinalSkinId(war, player.getPlayerIndex())));
        this._imgCo.loadSource(getCoEye(war.getGcData(), player.getCoId(), player.getAliveState() !== AliveStateId.Dead) ?? UndefinedError);
    }

    private _updateLabelEnergy(): void {
        const war = this.getOpenData()?.war;
        if ((war) && (war.getIsRunning())) {
            const player            = war.getPlayerInTurn();
            const skillType         = player.getCoUsingSkillType();
            const labelCurrEnergy   = this._labelCurrEnergy;
            const currentEnergy     = player.getCoCurrentEnergy();
            if (skillType === SkillTypeId.Power) {
                labelCurrEnergy.setText(`${currentEnergy}(P)`);
            } else if (skillType === SkillTypeId.SuperPower) {
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
        this._btnChat.setRedVisible(checkHasUnreadMessage());
    }

    private _setPanelSkinState(state: PanelSkinState): void {
        loadSkinStateRecursively(this, state === PanelSkinState.Normal ? UiSkinState.Normal : UiSkinState.Expanded);

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
        for (let playerIndex = PlayerIndex.First; playerIndex < playerIndexInTurn; ++playerIndex) {
            dataArray.push({
                war,
                playerIndex,
            });
        }
        return dataArray;
    }
}

interface DataForListPlayer extends UiListItemData {
    war         : IMpwWar;
    playerIndex : number;
}
class PlayerRenderer extends UiListItemRenderer<DataForListPlayer> {
    private readonly _imgSkin!          : IUiImage;
    private readonly _imgCo!            : IUiImage;
    private readonly _imgOnlineState!   : IUiImage;

    private readonly _layoutEnergy!     : IUiLayout;
    private readonly _labelEnergy!      : IUiLabel;
    private readonly _labelEnergy1!     : IUiLabel;
    private readonly _labelEnergy2!     : IUiLabel;

    private readonly _labelFund!        : IUiLabel;
    private readonly _labelAddFund!     : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.MsgUserGetOnlineState,       callback: this._onNotifyMsgUserGetOnlineState },
            { type: TypeId.TimeTick,                    callback: this._onNotifyTimeTick },
            { type: TypeId.BwPlayerFundChanged,         callback: this._onNotifyBwPlayerFundChanged },
            { type: TypeId.WarOperationNormalExecuted,  callback: this._onNotifyWarOperationNormalExecuted },
            { type: TypeId.BwCoUsingSkillTypeChanged,   callback: this._onNotifyBwCoUsingSkillChanged },
            { type: TypeId.BwCoEnergyChanged,           callback: this._onNotifyBwCoEnergyChanged },
            { type: TypeId.BwOverridingSkinIdChanged,   callback: this._onNotifyBwOverridingSkinIdChanged },
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
            (userId !== getSelfUserId())  &&
            (getServerTimestamp() % 60 == 0)
        ) {
            UsersModelGetUserOnlineState(userId);
        }
    }

    private _onNotifyBwPlayerFundChanged(e: Event): void {
        const eventData = e.data as BwPlayerFundChanged;
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

        openPanel(getDict().CommonCoListPanel, {
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
        this._imgCo.loadSource(getCoEye(war.getGcData(), player.getCoId(), player.getAliveState() !== AliveStateId.Dead) ?? UndefinedError);
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

        this._imgSkin.loadSource(getCoEyeBackground(getFinalSkinId(openData.war, openData.playerIndex)));
    }

    private async _updateImgOnlineState(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const userId    = openData.war.getPlayer(openData.playerIndex).getUserId();
        const img       = this._imgOnlineState;
        if ((userId == null) || (userId === getSelfUserId())) {
            img.loadSource(`uncompressedColorGreen0000`);
        } else {
            img.loadSource(getUserOnlineState(await UsersModelGetUserOnlineState(userId)));
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
        if (skillType === SkillTypeId.Power) {
            labelEnergy.setText(`${currentEnergy}(P)`);
        } else if (skillType === SkillTypeId.SuperPower) {
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
