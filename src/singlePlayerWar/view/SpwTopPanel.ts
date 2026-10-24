import * as ActionPlannersConstants from "../../actionPlanners/Constants.ts";
import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesChatToTarget from "../../auxiliaryTypes/ChatToTarget.ts";
import * as CampaignsMainsGateway from "../../campaigns/mains/Gateway.ts";
import * as ChatModel from "../../chat/Model.ts";
import * as CoSkillsConstants from "../../coSkills/Constants.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as NotificationsDataTypes from "../../notifications/DataTypes.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmCreateSfwS from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSfw/S.ts";
import * as ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import * as SinglePlayerModeModelSpmModel from "../../singlePlayerMode/model/SpmModel.ts";
import * as SinglePlayerModeModelSpmProxy from "../../singlePlayerMode/model/SpmProxy.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../interface/ISpwWar.ts";
import * as SinglePlayerWarModelSpwModel from "../model/SpwModel.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TurnsConstants from "../../turns/Constants.ts";
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
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";

// eslint-disable-next-line no-shadow
enum PanelSkinState {
    Normal,
    Expanded,
}

export interface OpenData {
    war     : SinglePlayerWarInterfaceISpwWar.ISpwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _listPlayer!           : UiInterfacesIUiScrollList.IUiScrollList<DataForListPlayer>;
    private readonly _btnWeather!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSave!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnLoad!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnChat!              : UiInterfacesIUiButton.IUiButton;

    private readonly _groupCo!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgSkin!              : UiInterfacesIUiImage.IUiImage;
    private readonly _imgCo!                : UiInterfacesIUiImage.IUiImage;

    private readonly _groupPlayer!          : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelPlayer!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTurnIndex!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupScore!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelScore!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupPauseAi!         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutPauseAi!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelPauseAiTitle!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPauseAi!         : UiInterfacesIUiLabel.IUiLabel;

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
            { type: NotificationsTypeId.TypeId.BwPlayerFundChanged,             callback: this._onNotifyBwPlayerFundChanged },
            { type: NotificationsTypeId.TypeId.BwPlayerIndexInTurnChanged,      callback: this._onNotifyBwPlayerIndexInTurnChanged },
            { type: NotificationsTypeId.TypeId.BwTurnIndexChanged,              callback: this._onNotifyBwTurnIndexChanged },
            { type: NotificationsTypeId.TypeId.BwCoEnergyChanged,               callback: this._onNotifyBwCoEnergyChanged },
            { type: NotificationsTypeId.TypeId.BwCoUsingSkillTypeChanged,       callback: this._onNotifyBwCoUsingSkillChanged },
            { type: NotificationsTypeId.TypeId.BwCoIdChanged,                   callback: this._onNotifyBwCoIdChanged },
            { type: NotificationsTypeId.TypeId.BwForceWeatherTypeChanged,       callback: this._onNotifyBwForceWeatherTypeChanged },
            { type: NotificationsTypeId.TypeId.BwOverridingSkinIdChanged,       callback: this._onNotifyBwOverridingSkinIdChanged },
            { type: NotificationsTypeId.TypeId.WarOperationNormalExecuted,      callback: this._onNotifyWarOperationNormalExecuted },
            { type: NotificationsTypeId.TypeId.MsgChatGetAllReadProgressList,   callback: this._onNotifyMsgChatGetAllReadProgressList },
            { type: NotificationsTypeId.TypeId.MsgChatUpdateReadProgress,       callback: this._onNotifyMsgChatUpdateReadProgress },
            { type: NotificationsTypeId.TypeId.MsgChatGetAllMessages,           callback: this._onNotifyMsgChatGetAllMessages },
            { type: NotificationsTypeId.TypeId.MsgChatAddMessage,               callback: this._onNotifyMsgChatAddMessage },
            { type: NotificationsTypeId.TypeId.MsgSpmCreateSfw,                 callback: this._onNotifyMsgSpmCreateSfw },
            { type: NotificationsTypeId.TypeId.MsgSpmSaveScw,                   callback: this._onNotifyMsgSpmSaveScw },
            { type: NotificationsTypeId.TypeId.MsgSpmSaveSfw,                   callback: this._onNotifyMsgSpmSaveSfw },
            { type: NotificationsTypeId.TypeId.MsgSpmSaveSrw,                   callback: this._onNotifyMsgSpmSaveSrw },
            { type: NotificationsTypeId.TypeId.MsgCampaignSaveWar,              callback: this._onNotifyMsgCampaignSaveWar },
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
        SoundsSoundPlayer.playCoBgmWithWar({
            war                             : war,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : UsersModel.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
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

        SoundsSoundPlayer.playCoBgmWithWar({
            war                             : war,
            force                           : false,
            coBgmCodeArrayFromUserSettings  : UsersModel.getSelfSettingsCoBgmCodeArray(war.getPlayerInTurn().getCoCategoryId()),
        });
    }
    private _onNotifyBwCoIdChanged(e: VendorEgretEgret.Event): void {
        const eventData = e.data as NotificationsDataTypes.BwCoIdChanged;
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

    private _onNotifyMsgSpmCreateSfw(e: VendorEgretEgret.Event): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const data = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmCreateSfwS.S;
        if (war.getSaveSlotIndex() == null) {
            war.setSaveSlotIndex(HelpersMisc.getExisted(data.getSlotIndex()));

            if (war.getSaveSlotExtraData() == null) {
                war.setSaveSlotExtraData(data.getExtraData() ?? null);
            }
        }
    }
    private _onNotifyMsgSpmSaveScw(): void {
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0073));
    }
    private _onNotifyMsgSpmSaveSfw(): void {
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0073));
    }
    private _onNotifyMsgSpmSaveSrw(): void {
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0073));
    }
    private _onNotifyMsgCampaignSaveWar(): void {
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0073));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks for touch.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
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
        if (war != null) {
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
                warId           : null,
                gameConfig      : war.getGcData(),
                playerInfoArray : playerInfoArray,
            });
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        }
    }

    private _onTouchedGroupScore(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent  : () => LangUtils.getText(LangConstants.TextType.A0997),
        });
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
        GamePanelsManager.closePanel(GamePanelsDict.getDict().SpwWarMenuPanel);
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
        GamePanelsManager.closePanel(GamePanelsDict.getDict().SpwWarMenuPanel);
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    private async _onTouchedBtnSave(): Promise<void> {
        if (!this._checkCanDoAction()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0273));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getSaveSlotIndex() == null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleSpmSaveSlotPanel, {
                currentSlotIndex        : await SinglePlayerModeModelSpmModel.getAvailableSlotIndex(),
                needComment             : true,
                needConfirmOverwrite    : true,
                callback                : (slotIndex, comment) => {
                    const saveSlotExtraData = war.getSaveSlotExtraData();
                    SinglePlayerModeModelSpmProxy.reqSpmCreateSfw({
                        slotIndex       : slotIndex,
                        slotExtraData   : ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData.fromJson({
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.B0260),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0071),
            callback: () => {
                const warType = war.getWarType();
                if ((warType === WarTypesConstants.WarTypeId.ScwFog) || (warType === WarTypesConstants.WarTypeId.ScwStd)) {
                    SinglePlayerModeModelSpmProxy.reqSpmSaveScw(war);
                } else if ((warType === WarTypesConstants.WarTypeId.SfwFog) || (warType === WarTypesConstants.WarTypeId.SfwStd)) {
                    SinglePlayerModeModelSpmProxy.reqSpmSaveSfw(war);
                } else if ((warType === WarTypesConstants.WarTypeId.SrwFog) || (warType === WarTypesConstants.WarTypeId.SrwStd)) {
                    SinglePlayerModeModelSpmProxy.reqSpmSaveSrw(war);
                } else if ((warType === WarTypesConstants.WarTypeId.CampFog) || (warType === WarTypesConstants.WarTypeId.CampStd)) {
                    CampaignsMainsGateway.reqCampaignSaveWar(war);
                } else {
                    throw HelpersMisc.newError(`Invalid warType: ${warType}`, UtilsClientErrorCode.ClientErrorCode.SpwWarMenuPanel_OnTOuchedBtnSaveGame_00);
                }
            },
        });
    }

    private async _onTouchedBtnLoad(): Promise<void> {
        if (!this._checkCanDoAction()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0273));
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const slotIndex = war.getSaveSlotIndex();
        if (slotIndex == null) {
            FloatText2.showLang(LangConstants.TextType.A0930);
            return;
        }

        const slotInfo = await SinglePlayerModeModelSpmModel.getSlotFullData(slotIndex);
        if (slotInfo == null) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0303));
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getTitle    : () => LangUtils.getText(LangConstants.TextType.B0261),
            getContent  : () => LangUtils.getText(LangConstants.TextType.A0072),
            callback    : () => {
                HelpersGameFlow.gotoSinglePlayerWar({
                    slotIndex           : slotInfo.slotIndex,
                    warData             : slotInfo.warData,
                    slotExtraData       : slotInfo.extraData,
                    overridingBgmCode   : war.getOverridingBgmCode(),
                });
            },
        });
    }

    private _onTouchedBtnChat(): void {
        GamePanelsManager.closePanel(GamePanelsDict.getDict().SpwWarMenuPanel);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().ChatPanel, { toTarget: new AuxiliaryTypesChatToTarget.ChatToTarget({}) });
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const isPaused = !war.getIsAiPaused();
        war.setIsAiPaused(isPaused);
        this._updateGroupPauseAi();

        if (!isPaused) {
            SinglePlayerWarModelSpwModel.checkAndHandleAutoActionsAndRobotRecursively(war);
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
        this._labelTurnIndex.setText(`${LangUtils.getText(LangConstants.TextType.B0191)} ${this.getOpenData()?.war.getTurnManager().getTurnIndex()}`);
        this._groupPlayer.arrangeItems();
    }

    private _updateGroupPauseAi(): void {
        const group = this._groupPauseAi;
        const war   = this.getOpenData()?.war;
        if (war == null) {
            group.setIsVisible(false);
            return;
        }
        if ((!(war instanceof GameHelpersGhFactory.getSfwWarClass()))  &&
            (!(war instanceof GameHelpersGhFactory.getScwWarClass()))
        ) {
            group.setIsVisible(false);
            return;
        }

        group.setIsVisible(true);

        this._labelPauseAiTitle.setLangText(LangConstants.TextType.B1399);

        const labelPauseAi  = this._labelPauseAi;
        const isPaused      = war.getIsAiPaused();
        labelPauseAi.setText(LangUtils.getTextForYesOrNo(isPaused));
        labelPauseAi.setTextColor(isPaused ? GraphicsConstants.ColorValue.Yellow : GraphicsConstants.ColorValue.White);

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
        if ((!(war instanceof GameHelpersGhFactory.getSrwWarClass())) &&
            (!(war instanceof GameHelpersGhFactory.getCawWarClass()))
        ) {
            group.setIsVisible(false);
            return;
        }

        group.setIsVisible(true);
        this._labelScore.setText(`${LangUtils.getText(LangConstants.TextType.B1114)} ${war.calculateTotalScore()}`);
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
        if (war == null) {
            return;
        }

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

        const zoneEnergyText = (player.getCoZoneExpansionEnergyList() || []).join(` / `);
        this._labelZoneEnergy.setText(`Z:${zoneEnergyText.length ? zoneEnergyText : `--`}`);

        this._layoutPowerEnergy.arrangeItems();
        this._layoutMaxEnergy.arrangeItems();
        this._layoutEnergy.arrangeItems();
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

    private _checkCanDoAction(): boolean {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return false;
        }

        return (war.checkIsHumanInTurn())
            && (war.getTurnManager().getPhaseCode() === TurnsConstants.PhaseCode.Main)
            && (war.getActionPlanner().getStateId() === ActionPlannersConstants.StateId.Idle);
    }
}

interface DataForListPlayer extends UiTypesUiListItemData.UiListItemData {
    war         : SinglePlayerWarInterfaceISpwWar.ISpwWar;
    playerIndex : number;
}
class PlayerRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForListPlayer> {
    private readonly _imgSkin!          : UiInterfacesIUiImage.IUiImage;
    private readonly _imgCo!            : UiInterfacesIUiImage.IUiImage;

    private readonly _labelEnergy!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _layoutEnergy!     : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelEnergy1!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelEnergy2!     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _labelFund!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelAddFund!     : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.BwPlayerFundChanged,         callback: this._onNotifyBwPlayerFundChanged },
            { type: NotificationsTypeId.TypeId.WarOperationNormalExecuted,  callback: this._onNotifyWarOperationNormalExecuted },
            { type: NotificationsTypeId.TypeId.BwCoUsingSkillTypeChanged,   callback: this._onNotifyBwCoUsingSkillChanged },
            { type: NotificationsTypeId.TypeId.BwCoEnergyChanged,           callback: this._onNotifyBwCoEnergyChanged },
            { type: NotificationsTypeId.TypeId.BwCoIdChanged,               callback: this._onNotifyBwCoIdChanged },
            { type: NotificationsTypeId.TypeId.BwOverridingSkinIdChanged,   callback: this._onNotifyBwOverridingSkinIdChanged },
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

    private _onNotifyBwPlayerFundChanged(e: VendorEgretEgret.Event): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventData = e.data as NotificationsDataTypes.BwPlayerFundChanged;
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

    private _onNotifyBwCoIdChanged(e: VendorEgretEgret.Event): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const eventData = e.data as NotificationsDataTypes.BwCoIdChanged;
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonCoListPanel, {
            war         : openData.war,
            playerIndex : openData.playerIndex,
        });
    }

    private _updateImgSkin(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgSkin.loadSource(HelpersImageSource.getCoEyeBackground(ForceSkinsUtils.getFinalSkinId(openData.war, openData.playerIndex)));
    }

    private _updateImgCo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war       = openData.war;
        const player    = war.getPlayer(openData.playerIndex);
        this._imgCo.loadSource(HelpersImageSource.getCoEye(war.getGcData(), player.getCoId(), player.getAliveState() !== PlayersConstants.AliveStateId.Dead) ?? LangConstants.UndefinedError);
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
