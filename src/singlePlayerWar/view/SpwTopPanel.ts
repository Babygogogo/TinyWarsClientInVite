import {
    AuxiliaryTypes_ChatToTarget,
    Chat_Model,
    ForceSkins_Utils,
    Campaigns_Mains_Gateway,
    SingleCustomWar_Model_ScwWar,
    SingleFreeWar_Model_SfwWar,
    FloatText,
    CoSkills_Constants,
    SingleRankWar_Model_SrwWar,
    ActionPlanners_Constants,
    Campaigns_Wars_War,
    type AuxiliaryTypes_AuxiliaryTypes,
    Players_Constants,
    SinglePlayerWar_Model_SpwModel,
    Utils_ClientErrorCode,
    GamePanels_Manager,
    Graphics_Constants,
    SinglePlayerMode_Model_SpmModel,
    Helpers_ImageSource,
    GamePanels_Dict,
    Helpers_Misc,
    Users_Model,
    Lang_Utils,
    Helpers_GameFlow,
    Ui_Utils_UiSkinHelpers,
    Turns_Constants,
    Sounds_SoundPlayer,
    SinglePlayerMode_Model_SpmProxy,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Ui_Types_UiSkinState,
    WarTypes_Constants,
    type Notifications_DataTypes,
    type Egret_Egret,
    type SinglePlayerWar_Interface_ISpwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

import type { S as SpmCreateSfwResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSfw/S.ts";
import { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";

 
enum PanelSkinState {
    Normal,
    Expanded,
}

export interface OpenData {
    war     : SinglePlayerWar_Interface_ISpwWar.ISpwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _listPlayer!           : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForListPlayer>;
    private readonly _btnWeather!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSave!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnLoad!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnChat!              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupCo!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgSkin!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgCo!                : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupPlayer!          : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelPlayer!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTurnIndex!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupScore!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelScore!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupPauseAi!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutPauseAi!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelPauseAiTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPauseAi!         : Ui_Interfaces_IUiLabel.IUiLabel;

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
            { type : Notifications_TypeId.TypeId.BwPlayerFundChanged,             callback : this._onNotifyBwPlayerFundChanged },
            { type : Notifications_TypeId.TypeId.BwPlayerIndexInTurnChanged,      callback : this._onNotifyBwPlayerIndexInTurnChanged },
            { type : Notifications_TypeId.TypeId.BwTurnIndexChanged,              callback : this._onNotifyBwTurnIndexChanged },
            { type : Notifications_TypeId.TypeId.BwCoEnergyChanged,               callback : this._onNotifyBwCoEnergyChanged },
            { type : Notifications_TypeId.TypeId.BwCoUsingSkillTypeChanged,       callback : this._onNotifyBwCoUsingSkillChanged },
            { type : Notifications_TypeId.TypeId.BwCoIdChanged,                   callback : this._onNotifyBwCoIdChanged },
            { type : Notifications_TypeId.TypeId.BwForceWeatherTypeChanged,       callback : this._onNotifyBwForceWeatherTypeChanged },
            { type : Notifications_TypeId.TypeId.BwOverridingSkinIdChanged,       callback : this._onNotifyBwOverridingSkinIdChanged },
            { type : Notifications_TypeId.TypeId.WarOperationNormalExecuted,      callback : this._onNotifyWarOperationNormalExecuted },
            { type : Notifications_TypeId.TypeId.MsgChatGetAllReadProgressList,   callback : this._onNotifyMsgChatGetAllReadProgressList },
            { type : Notifications_TypeId.TypeId.MsgChatUpdateReadProgress,       callback : this._onNotifyMsgChatUpdateReadProgress },
            { type : Notifications_TypeId.TypeId.MsgChatGetAllMessages,           callback : this._onNotifyMsgChatGetAllMessages },
            { type : Notifications_TypeId.TypeId.MsgChatAddMessage,               callback : this._onNotifyMsgChatAddMessage },
            { type : Notifications_TypeId.TypeId.MsgSpmCreateSfw,                 callback : this._onNotifyMsgSpmCreateSfw },
            { type : Notifications_TypeId.TypeId.MsgSpmSaveScw,                   callback : this._onNotifyMsgSpmSaveScw },
            { type : Notifications_TypeId.TypeId.MsgSpmSaveSfw,                   callback : this._onNotifyMsgSpmSaveSfw },
            { type : Notifications_TypeId.TypeId.MsgSpmSaveSrw,                   callback : this._onNotifyMsgSpmSaveSrw },
            { type : Notifications_TypeId.TypeId.MsgCampaignSaveWar,              callback : this._onNotifyMsgCampaignSaveWar },
        ]);
        this._setUiListenerArray([
            { ui : this._btnWeather,         callback : this._onTouchedBtnWeather },
            { ui : this._groupPlayer,        callback : this._onTouchedGroupPlayer },
            { ui : this._groupScore,         callback : this._onTouchedGroupScore },
            { ui : this._groupCo,            callback : this._onTouchedGroupCo },
            { ui : this._groupInfo,          callback : this._onTouchedGroupInfo },
            { ui : this._btnSave,            callback : this._onTouchedBtnSave },
            { ui : this._btnLoad,            callback : this._onTouchedBtnLoad },
            { ui : this._btnChat,            callback : this._onTouchedBtnChat },
            { ui : this._btnExpand,          callback : this._onTouchedBtnExpand },
            { ui : this._btnNarrow,          callback : this._onTouchedBtnNarrow },
            { ui : this._groupPauseAi,       callback : this._onTouchedGroupPauseAi },
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
        Sounds_SoundPlayer.playCoBgmWithWar({
            war                            : war,
            force                          : false,
            coBgmCodeArrayFromUserSettings : Users_Model.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
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

        Sounds_SoundPlayer.playCoBgmWithWar({
            war                            : war,
            force                          : false,
            coBgmCodeArrayFromUserSettings : Users_Model.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
        });
    }
    private _onNotifyBwCoIdChanged(e: Egret_Egret.Event): void {
        const eventData = e.data as Notifications_DataTypes.BwCoIdChanged;
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

    private _onNotifyMsgSpmCreateSfw(e: Egret_Egret.Event): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const data = e.data as SpmCreateSfwResponse;
        if (war.getSaveSlotIndex() == null) {
            war.setSaveSlotIndex(Helpers_Misc.getExisted(data.getSlotIndex()));

            if (war.getSaveSlotExtraData() == null) {
                war.setSaveSlotExtraData(data.getExtraData() ?? null);
            }
        }
    }
    private _onNotifyMsgSpmSaveScw(): void {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0073));
    }
    private _onNotifyMsgSpmSaveSfw(): void {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0073));
    }
    private _onNotifyMsgSpmSaveSrw(): void {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0073));
    }
    private _onNotifyMsgCampaignSaveWar(): void {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0073));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks for touch.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
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
        if (war != null) {
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
                warId           : null,
                gameConfig      : war.getGcData(),
                playerInfoArray : playerInfoArray,
            });
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        }
    }

    private _onTouchedGroupScore(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0997),
        });
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
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().SpwWarMenuPanel);
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
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().SpwWarMenuPanel);
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private async _onTouchedBtnSave(): Promise<void> {
        if (!this._checkCanDoAction()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0273));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getSaveSlotIndex() == null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleSpmSaveSlotPanel, {
                currentSlotIndex     : await SinglePlayerMode_Model_SpmModel.getAvailableSlotIndex(),
                needComment          : true,
                needConfirmOverwrite : true,
                callback             : (slotIndex, comment) => {
                    const saveSlotExtraData = war.getSaveSlotExtraData();
                    SinglePlayerMode_Model_SpmProxy.reqSpmCreateSfw({
                        slotIndex     : slotIndex,
                        slotExtraData : SpmWarSaveSlotExtraData.fromJson({
                            slotComment           : comment,
                            mpwWarId              : saveSlotExtraData.getMpwWarId(),
                            overridingSkinIdArray : [],
                            gridMarkData          : saveSlotExtraData.getGridMarkData()?.toJson(),
                        }),
                        warData : war.serializeForCreateSfw(),
                    });
                },
            });
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0260),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0071),
            callback   : () => {
                const warType = war.getWarType();
                if ((warType === WarTypes_Constants.WarTypeId.ScwFog) || (warType === WarTypes_Constants.WarTypeId.ScwStd)) {
                    SinglePlayerMode_Model_SpmProxy.reqSpmSaveScw(war);
                } else if ((warType === WarTypes_Constants.WarTypeId.SfwFog) || (warType === WarTypes_Constants.WarTypeId.SfwStd)) {
                    SinglePlayerMode_Model_SpmProxy.reqSpmSaveSfw(war);
                } else if ((warType === WarTypes_Constants.WarTypeId.SrwFog) || (warType === WarTypes_Constants.WarTypeId.SrwStd)) {
                    SinglePlayerMode_Model_SpmProxy.reqSpmSaveSrw(war);
                } else if ((warType === WarTypes_Constants.WarTypeId.CampFog) || (warType === WarTypes_Constants.WarTypeId.CampStd)) {
                    Campaigns_Mains_Gateway.reqCampaignSaveWar(war);
                } else {
                    throw Helpers_Misc.newError(`Invalid warType: ${warType}`, Utils_ClientErrorCode.ClientErrorCode.SpwWarMenuPanel_OnTOuchedBtnSaveGame_00);
                }
            },
        });
    }

    private async _onTouchedBtnLoad(): Promise<void> {
        if (!this._checkCanDoAction()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0273));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const slotIndex = war.getSaveSlotIndex();
        if (slotIndex == null) {
            FloatText.showLang(Lang_Constants.TextType.A0930);
            return;
        }

        const slotInfo = await SinglePlayerMode_Model_SpmModel.getSlotFullData(slotIndex);
        if (slotInfo == null) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0303));
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0261),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0072),
            callback   : () => {
                Helpers_GameFlow.gotoSinglePlayerWar({
                    slotIndex         : slotInfo.slotIndex,
                    warData           : slotInfo.warData,
                    slotExtraData     : slotInfo.extraData,
                    overridingBgmCode : war.getOverridingBgmCode(),
                });
            },
        });
    }

    private _onTouchedBtnChat(): void {
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().SpwWarMenuPanel);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ChatPanel, { toTarget : new AuxiliaryTypes_ChatToTarget.ChatToTarget({}) });
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

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const isPaused = !war.getIsAiPaused();
        war.setIsAiPaused(isPaused);
        this._updateGroupPauseAi();

        if (!isPaused) {
            SinglePlayerWar_Model_SpwModel.checkAndHandleAutoActionsAndRobotRecursively(war);
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
        this._labelTurnIndex.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0191)} ${this.getOpenData()?.war.getTurnManager().getTurnIndex()}`);
        this._groupPlayer.arrangeItems();
    }

    private _updateGroupPauseAi(): void {
        const group = this._groupPauseAi;
        const war   = this.getOpenData()?.war;
        if (war == null) {
            group.setIsVisible(false);
            return;
        }
        if ((!(war instanceof SingleFreeWar_Model_SfwWar.SfwWar))  &&
            (!(war instanceof SingleCustomWar_Model_ScwWar.ScwWar))
        ) {
            group.setIsVisible(false);
            return;
        }

        group.setIsVisible(true);

        this._labelPauseAiTitle.setLangText(Lang_Constants.TextType.B1399);

        const labelPauseAi  = this._labelPauseAi;
        const isPaused      = war.getIsAiPaused();
        labelPauseAi.setLangText(isPaused ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        labelPauseAi.setTextColor(isPaused ? Graphics_Constants.ColorValue.Yellow : Graphics_Constants.ColorValue.White);

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
        if ((!(war instanceof SingleRankWar_Model_SrwWar.SrwWar)) &&
            (!(war instanceof Campaigns_Wars_War.War))
        ) {
            group.setIsVisible(false);
            return;
        }

        group.setIsVisible(true);
        this._labelScore.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1114)} ${war.calculateTotalScore()}`);
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
        if (war == null) {
            return;
        }

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

        const zoneEnergyText = (player.getCoZoneExpansionEnergyList() || []).join(` / `);
        this._labelZoneEnergy.setText(`Z:${zoneEnergyText.length ? zoneEnergyText : `--`}`);

        this._layoutPowerEnergy.arrangeItems();
        this._layoutMaxEnergy.arrangeItems();
        this._layoutEnergy.arrangeItems();
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

    private _checkCanDoAction(): boolean {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return false;
        }

        return (war.checkIsHumanInTurn())
            && (war.getTurnManager().getPhaseCode() === Turns_Constants.PhaseCode.Main)
            && (war.getActionPlanner().getStateId() === ActionPlanners_Constants.StateId.Idle);
    }
}

interface DataForListPlayer extends Ui_Types_UiListItemData.UiListItemData {
    war         : SinglePlayerWar_Interface_ISpwWar.ISpwWar;
    playerIndex : number;
}
class PlayerRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForListPlayer> {
    private readonly _imgSkin!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgCo!            : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _labelEnergy!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _layoutEnergy!     : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelEnergy1!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelEnergy2!     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelFund!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelAddFund!     : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.BwPlayerFundChanged,         callback : this._onNotifyBwPlayerFundChanged },
            { type : Notifications_TypeId.TypeId.WarOperationNormalExecuted,  callback : this._onNotifyWarOperationNormalExecuted },
            { type : Notifications_TypeId.TypeId.BwCoUsingSkillTypeChanged,   callback : this._onNotifyBwCoUsingSkillChanged },
            { type : Notifications_TypeId.TypeId.BwCoEnergyChanged,           callback : this._onNotifyBwCoEnergyChanged },
            { type : Notifications_TypeId.TypeId.BwCoIdChanged,               callback : this._onNotifyBwCoIdChanged },
            { type : Notifications_TypeId.TypeId.BwOverridingSkinIdChanged,   callback : this._onNotifyBwOverridingSkinIdChanged },
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

    private _onNotifyBwPlayerFundChanged(e: Egret_Egret.Event): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventData = e.data as Notifications_DataTypes.BwPlayerFundChanged;
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

    private _onNotifyBwCoIdChanged(e: Egret_Egret.Event): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventData = e.data as Notifications_DataTypes.BwCoIdChanged;
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonCoListPanel, {
            war         : openData.war,
            playerIndex : openData.playerIndex,
        });
    }

    private _updateImgSkin(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgSkin.loadSource(Helpers_ImageSource.getCoEyeBackground(ForceSkins_Utils.getFinalSkinId(openData.war, openData.playerIndex)));
    }

    private _updateImgCo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war       = openData.war;
        const player    = war.getPlayer(openData.playerIndex);
        this._imgCo.loadSource(Helpers_ImageSource.getCoEye(war.getGcData(), player.getCoId(), player.getAliveState() !== Players_Constants.AliveStateId.Dead) ?? Lang_Constants.UndefinedError);
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
