import { StateId } from "../../actionPlanners/Constants.ts";
import type { PlayerInfo2 } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { ChatToTarget } from "../../auxiliaryTypes/ChatToTarget.ts";
import { reqCampaignSaveWar } from "../../campaigns/mains/Gateway.ts";
import { checkHasUnreadMessage } from "../../chat/Model.ts";
import { SkillTypeId } from "../../coSkills/Constants.ts";
import {
    showLang,
    show,
} from "../../FloatText.ts";
import { getFinalSkinId } from "../../forceSkins/Utils.ts";
import {
    getSfwWarClass,
    getScwWarClass,
    getSrwWarClass,
    getCawWarClass,
} from "../../gameHelpers/GhFactory.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import {
    openPanel,
    closePanel,
} from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { gotoSinglePlayerWar } from "../../helpers/GameFlow.ts";
import {
    getCoEyeBackground,
    getCoEye,
} from "../../helpers/ImageSource.ts";
import {
    getExisted,
    newError,
} from "../../helpers/Misc.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import type {
    BwCoIdChanged,
    BwPlayerFundChanged,
} from "../../notifications/DataTypes.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import {
    AliveStateId,
    PlayerIndex,
} from "../../players/Constants.ts";
import type { S as SpmCreateSfwResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSfw/S.ts";
import { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import {
    getAvailableSlotIndex,
    getSlotFullData,
} from "../../singlePlayerMode/model/SpmModel.ts";
import {
    reqSpmCreateSfw,
    reqSpmSaveScw,
    reqSpmSaveSfw,
    reqSpmSaveSrw,
} from "../../singlePlayerMode/model/SpmProxy.ts";
import type { ISpwWar } from "../interface/ISpwWar.ts";
import { checkAndHandleAutoActionsAndRobotRecursively } from "../model/SpwModel.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import {
    playCoBgmWithWar,
    playShortSfx,
} from "../../sounds/SoundPlayer.ts";
import { PhaseCode } from "../../turns/Constants.ts";
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
import { getSelfSettingsCoBgmCodeArray } from "../../users/Model.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import type { Event } from "../../egret/Egret.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";

// eslint-disable-next-line no-shadow
enum PanelSkinState {
    Normal,
    Expanded,
}

export interface OpenData {
    war     : ISpwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _listPlayer!           : IUiScrollList<DataForListPlayer>;
    private readonly _btnWeather!           : IUiButton;
    private readonly _btnSave!              : IUiLabel;
    private readonly _btnLoad!              : IUiLabel;
    private readonly _btnChat!              : IUiButton;

    private readonly _groupCo!              : IUiContainer;
    private readonly _imgSkin!              : IUiImage;
    private readonly _imgCo!                : IUiImage;

    private readonly _groupPlayer!          : IUiLayout;
    private readonly _labelPlayer!          : IUiLabel;
    private readonly _labelTurnIndex!       : IUiLabel;

    private readonly _groupScore!           : IUiContainer;
    private readonly _labelScore!           : IUiLabel;

    private readonly _groupPauseAi!         : IUiContainer;
    private readonly _layoutPauseAi!        : IUiLayout;
    private readonly _labelPauseAiTitle!    : IUiLabel;
    private readonly _labelPauseAi!         : IUiLabel;

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
            { type: TypeId.BwPlayerFundChanged,             callback: this._onNotifyBwPlayerFundChanged },
            { type: TypeId.BwPlayerIndexInTurnChanged,      callback: this._onNotifyBwPlayerIndexInTurnChanged },
            { type: TypeId.BwTurnIndexChanged,              callback: this._onNotifyBwTurnIndexChanged },
            { type: TypeId.BwCoEnergyChanged,               callback: this._onNotifyBwCoEnergyChanged },
            { type: TypeId.BwCoUsingSkillTypeChanged,       callback: this._onNotifyBwCoUsingSkillChanged },
            { type: TypeId.BwCoIdChanged,                   callback: this._onNotifyBwCoIdChanged },
            { type: TypeId.BwForceWeatherTypeChanged,       callback: this._onNotifyBwForceWeatherTypeChanged },
            { type: TypeId.BwOverridingSkinIdChanged,       callback: this._onNotifyBwOverridingSkinIdChanged },
            { type: TypeId.WarOperationNormalExecuted,      callback: this._onNotifyWarOperationNormalExecuted },
            { type: TypeId.MsgChatGetAllReadProgressList,   callback: this._onNotifyMsgChatGetAllReadProgressList },
            { type: TypeId.MsgChatUpdateReadProgress,       callback: this._onNotifyMsgChatUpdateReadProgress },
            { type: TypeId.MsgChatGetAllMessages,           callback: this._onNotifyMsgChatGetAllMessages },
            { type: TypeId.MsgChatAddMessage,               callback: this._onNotifyMsgChatAddMessage },
            { type: TypeId.MsgSpmCreateSfw,                 callback: this._onNotifyMsgSpmCreateSfw },
            { type: TypeId.MsgSpmSaveScw,                   callback: this._onNotifyMsgSpmSaveScw },
            { type: TypeId.MsgSpmSaveSfw,                   callback: this._onNotifyMsgSpmSaveSfw },
            { type: TypeId.MsgSpmSaveSrw,                   callback: this._onNotifyMsgSpmSaveSrw },
            { type: TypeId.MsgCampaignSaveWar,              callback: this._onNotifyMsgCampaignSaveWar },
        ]);
        this._setUiListenerArray([
            { ui: this._btnWeather,         callback: this._onTouchedBtnWeather },
            { ui: this._groupPlayer,        callback: this._onTouchedGroupPlayer },
            { ui: this._groupScore,         callback: this._onTouchedGroupScore },
            { ui: this._groupCo,            callback: this._onTouchedGroupCo },
            { ui: this._groupInfo,          callback: this._onTouchedGroupInfo },
            { ui: this._btnSave,            callback: this._onTouchedBtnSave },
            { ui: this._btnLoad,            callback: this._onTouchedBtnLoad },
            { ui: this._btnChat,            callback: this._onTouchedBtnChat },
            { ui: this._btnExpand,          callback: this._onTouchedBtnExpand },
            { ui: this._btnNarrow,          callback: this._onTouchedBtnNarrow },
            { ui: this._groupPauseAi,       callback: this._onTouchedGroupPauseAi },
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
    private _onNotifyBwPlayerFundChanged(): void {
        this._updateLabelFundAndAddFund();
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
    }
    private _onNotifyBwTurnIndexChanged(): void {
        this._updateLabelTurnIndex();
    }
    private _onNotifyBwCoEnergyChanged(): void {
        this._updateLabelEnergy();
    }
    private _onNotifyBwCoUsingSkillChanged(): void {
        this._updateLabelEnergy();

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
    private _onNotifyBwCoIdChanged(e: Event): void {
        const eventData = e.data as BwCoIdChanged;
        if (eventData === this.getOpenData()?.war.getPlayerInTurn()) {
            this._updateImgSkinAndCo();
        }
    }
    private _onNotifyBwForceWeatherTypeChanged(): void {
        this._updateBtnWeather();
    }
    private _onNotifyBwOverridingSkinIdChanged(): void {
        this._updateImgSkinAndCo();
    }
    private _onNotifyWarOperationNormalExecuted(): void {
        this._updateLabelFundAndAddFund();
        this._updateGroupScore();
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

    private _onNotifyMsgSpmCreateSfw(e: Event): void {
        showLang(TextType.OperationSucceeded);

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const data = e.data as SpmCreateSfwResponse;
        if (war.getSaveSlotIndex() == null) {
            war.setSaveSlotIndex(getExisted(data.getSlotIndex()));

            if (war.getSaveSlotExtraData() == null) {
                war.setSaveSlotExtraData(data.getExtraData() ?? null);
            }
        }
    }
    private _onNotifyMsgSpmSaveScw(): void {
        show(getText(TextType.A0073));
    }
    private _onNotifyMsgSpmSaveSfw(): void {
        show(getText(TextType.A0073));
    }
    private _onNotifyMsgSpmSaveSrw(): void {
        show(getText(TextType.A0073));
    }
    private _onNotifyMsgCampaignSaveWar(): void {
        show(getText(TextType.A0073));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks for touch.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
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
        if (war != null) {
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
                warId           : null,
                gameConfig      : war.getGcData(),
                playerInfoArray : playerInfoArray,
            });
            playShortSfx(ShortSfxCode.ButtonNeutral01);
        }
    }

    private _onTouchedGroupScore(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent  : () => getText(TextType.A0997),
        });
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
        closePanel(getDict().SpwWarMenuPanel);
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
        closePanel(getDict().SpwWarMenuPanel);
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private async _onTouchedBtnSave(): Promise<void> {
        if (!this._checkCanDoAction()) {
            show(getText(TextType.A0273));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getSaveSlotIndex() == null) {
            openPanel(getDict().CommonChooseSingleSpmSaveSlotPanel, {
                currentSlotIndex        : await getAvailableSlotIndex(),
                needComment             : true,
                needConfirmOverwrite    : true,
                callback                : (slotIndex, comment) => {
                    const saveSlotExtraData = war.getSaveSlotExtraData();
                    reqSpmCreateSfw({
                        slotIndex       : slotIndex,
                        slotExtraData   : SpmWarSaveSlotExtraData.fromJson({
                            slotComment             : comment,
                            mpwWarId                : saveSlotExtraData.getMpwWarId(),
                            overridingSkinIdArray   : [],
                            gridMarkData            : saveSlotExtraData.getGridMarkData()?.toJson(),
                        }),
                        warData         : war.serializeForCreateSfw(),
                    });
                }
            });
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0260),
            getContent : () => getText(TextType.A0071),
            callback: () => {
                const warType = war.getWarType();
                if ((warType === WarTypeId.ScwFog) || (warType === WarTypeId.ScwStd)) {
                    reqSpmSaveScw(war);
                } else if ((warType === WarTypeId.SfwFog) || (warType === WarTypeId.SfwStd)) {
                    reqSpmSaveSfw(war);
                } else if ((warType === WarTypeId.SrwFog) || (warType === WarTypeId.SrwStd)) {
                    reqSpmSaveSrw(war);
                } else if ((warType === WarTypeId.CampFog) || (warType === WarTypeId.CampStd)) {
                    reqCampaignSaveWar(war);
                } else {
                    throw newError(`Invalid warType: ${warType}`, ClientErrorCode.SpwWarMenuPanel_OnTOuchedBtnSaveGame_00);
                }
            },
        });
    }

    private async _onTouchedBtnLoad(): Promise<void> {
        if (!this._checkCanDoAction()) {
            show(getText(TextType.A0273));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const slotIndex = war.getSaveSlotIndex();
        if (slotIndex == null) {
            showLang(TextType.A0930);
            return;
        }

        const slotInfo = await getSlotFullData(slotIndex);
        if (slotInfo == null) {
            show(getText(TextType.A0303));
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getTitle    : () => getText(TextType.B0261),
            getContent  : () => getText(TextType.A0072),
            callback    : () => {
                gotoSinglePlayerWar({
                    slotIndex           : slotInfo.slotIndex,
                    warData             : slotInfo.warData,
                    slotExtraData       : slotInfo.extraData,
                    overridingBgmCode   : war.getOverridingBgmCode(),
                });
            },
        });
    }

    private _onTouchedBtnChat(): void {
        closePanel(getDict().SpwWarMenuPanel);
        openPanel(getDict().ChatPanel, { toTarget: new ChatToTarget({}) });
    }

    private _onTouchedBtnExpand(): void {
        this._setPanelSkinState(PanelSkinState.Expanded);
    }

    private _onTouchedBtnNarrow(): void {
        this._setPanelSkinState(PanelSkinState.Normal);
    }

    private _onTouchedGroupPauseAi(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const isPaused = !war.getIsAiPaused();
        war.setIsAiPaused(isPaused);
        this._updateGroupPauseAi();

        if (!isPaused) {
            checkAndHandleAutoActionsAndRobotRecursively(war);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for views.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateBtnWeather();
        this._updateListPlayer();
        this._updateImgSkinAndCo();
        this._updateLabelPlayer();
        this._updateLabelTurnIndex();
        this._updateLabelFundAndAddFund();
        this._updateLabelEnergy();
        this._updateBtnChat();
    }

    private _updateComponentsForLanguage(): void {
        this._updateBtnWeather();
        this._updateLabelTurnIndex();
        this._updateGroupPauseAi();
        this._updateGroupScore();
    }

    private _updateBtnWeather(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        this._btnWeather.setIconSource(war.getGcData().getWeatherCfg(war.getWeatherManager().getCurrentWeatherType())?.getIcon() ?? ``);
    }

    private async _updateListPlayer(): Promise<void> {
        await this._listPlayer.bindData(this._createDataArrayForListPlayer());
    }

    private _updateLabelTurnIndex(): void {
        this._labelTurnIndex.setText(`${getText(TextType.B0191)} ${this.getOpenData()?.war.getTurnManager().getTurnIndex()}`);
        this._groupPlayer.arrangeItems();
    }

    private _updateGroupPauseAi(): void {
        const group = this._groupPauseAi;
        const war   = this.getOpenData()?.war;
        if (war == null) {
            group.setIsVisible(false);
            return;
        }
        if ((!(war instanceof getSfwWarClass()))  &&
            (!(war instanceof getScwWarClass()))
        ) {
            group.setIsVisible(false);
            return;
        }

        group.setIsVisible(true);

        this._labelPauseAiTitle.setLangText(TextType.B1399);

        const labelPauseAi  = this._labelPauseAi;
        const isPaused      = war.getIsAiPaused();
        labelPauseAi.setLangText(isPaused ? TextType.Yes : TextType.No);
        labelPauseAi.setTextColor(isPaused ? ColorValue.Yellow : ColorValue.White);

        this._layoutPauseAi.arrangeItems();
    }

    private async _updateLabelPlayer(): Promise<void> {
        this._labelPlayer.setText(`${await this.getOpenData()?.war.getPlayerInTurn()?.getNickname()}`);
        this._groupPlayer.arrangeItems();
    }

    private _updateGroupScore(): void {
        const group = this._groupScore;
        const war   = this.getOpenData()?.war;
        if (war == null) {
            group.setIsVisible(false);
            return;
        }
        if ((!(war instanceof getSrwWarClass())) &&
            (!(war instanceof getCawWarClass()))
        ) {
            group.setIsVisible(false);
            return;
        }

        group.setIsVisible(true);
        this._labelScore.setText(`${getText(TextType.B1114)} ${war.calculateTotalScore()}`);
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
        if (war == null) {
            return;
        }

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

        const zoneEnergyText = (player.getCoZoneExpansionEnergyList() || []).join(` / `);
        this._labelZoneEnergy.setText(`Z:${zoneEnergyText.length ? zoneEnergyText : `--`}`);

        this._layoutPowerEnergy.arrangeItems();
        this._layoutMaxEnergy.arrangeItems();
        this._layoutEnergy.arrangeItems();
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

    private _checkCanDoAction(): boolean {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return false;
        }

        return (war.checkIsHumanInTurn())
            && (war.getTurnManager().getPhaseCode() === PhaseCode.Main)
            && (war.getActionPlanner().getStateId() === StateId.Idle);
    }
}

interface DataForListPlayer extends UiListItemData {
    war         : ISpwWar;
    playerIndex : number;
}
class PlayerRenderer extends UiListItemRenderer<DataForListPlayer> {
    private readonly _imgSkin!          : IUiImage;
    private readonly _imgCo!            : IUiImage;

    private readonly _labelEnergy!      : IUiLabel;
    private readonly _layoutEnergy!     : IUiLayout;
    private readonly _labelEnergy1!     : IUiLabel;
    private readonly _labelEnergy2!     : IUiLabel;

    private readonly _labelFund!        : IUiLabel;
    private readonly _labelAddFund!     : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.BwPlayerFundChanged,         callback: this._onNotifyBwPlayerFundChanged },
            { type: TypeId.WarOperationNormalExecuted,  callback: this._onNotifyWarOperationNormalExecuted },
            { type: TypeId.BwCoUsingSkillTypeChanged,   callback: this._onNotifyBwCoUsingSkillChanged },
            { type: TypeId.BwCoEnergyChanged,           callback: this._onNotifyBwCoEnergyChanged },
            { type: TypeId.BwCoIdChanged,               callback: this._onNotifyBwCoIdChanged },
            { type: TypeId.BwOverridingSkinIdChanged,   callback: this._onNotifyBwOverridingSkinIdChanged },
        ]);
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._updateImgSkin();
        this._updateImgCo();
        this._updateLabelFundAndAddFund();
        this._updateLabelEnergy();
    }

    private _onNotifyBwPlayerFundChanged(e: Event): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventData = e.data as BwPlayerFundChanged;
        if (eventData === openData.war.getPlayer(openData.playerIndex)) {
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

    private _onNotifyBwCoIdChanged(e: Event): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventData = e.data as BwCoIdChanged;
        if (eventData === openData.war.getPlayer(openData.playerIndex)) {
            this._updateImgCo();
        }
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

    private _updateImgSkin(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgSkin.loadSource(getCoEyeBackground(getFinalSkinId(openData.war, openData.playerIndex)));
    }

    private _updateImgCo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war       = openData.war;
        const player    = war.getPlayer(openData.playerIndex);
        this._imgCo.loadSource(getCoEye(war.getGcData(), player.getCoId(), player.getAliveState() !== AliveStateId.Dead) ?? UndefinedError);
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

        const energy1       = player.getCoPowerEnergy();
        const labelEnergy1  = this._labelEnergy1;
        labelEnergy1.setText(`${energy1 ?? `--`}`);
        labelEnergy1.setTextColor(energy1 == null || currentEnergy < energy1 ? 0xFFFFFF : 0x00FF00);

        const energy2       = player.getCoSuperPowerEnergy();
        const labelEnergy2  = this._labelEnergy2;
        labelEnergy2.setText(`${energy2 ?? `--`}`);
        labelEnergy2.setTextColor(energy2 == null || currentEnergy < energy2 ? 0xFFFFFF : 0x00FF00);

        this._layoutEnergy.arrangeItems();
    }
}
