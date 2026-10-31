import {
    type Notifications_Mapping,
    Cos_Constants,
    Stages_Constants,
    Notifications_Dispatcher,
    Helpers_ImageSource,
    GamePanels_Dict,
    Helpers_Misc,
    PlayerRules_Utils,
    GameConfigs_Provider,
    Lang_Utils,
    WarRules_Utils_CommonData,
    SinglePlayerMode_Model_SpmModel,
    Users_Model,
    Helpers_Text,
    Numbers_Utils,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    SinglePlayerMode_Model_SpmProxy,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type SingleRankRoom_Model_SrrWarCreator,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export interface OpenData {
    warCreator: SingleRankRoom_Model_SrrWarCreator.SrrWarCreator;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelWarRuleTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelWarRule!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnModifyWarRule!     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutHighScore!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelHighScoreTitle!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelHighScore!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnStart!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listPlayer!           : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForPlayerRenderer>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",        callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,           callback : this.closePanel },
            { ui : this._btnModifyWarRule,   callback : this._onTouchedBtnModifyWarRule },
            { ui : this._btnStart,           callback : this._onTouchedBtnStart },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listPlayer.setItemRendererClass(PlayerRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
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

    private async _onTouchedBtnModifyWarRule(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warCreator    = openData.warCreator;
        const warRuleId     = warCreator.getInstanceWarRule().getTemplateWarRuleId();
        warCreator.tickTemplateWarRuleId();
        this._updateView();

        if (warRuleId == warCreator.getInstanceWarRule().getTemplateWarRuleId()) {
            FloatText.showLang(Lang_Constants.TextType.A0857);
        }
    }

    private async _onTouchedBtnStart(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warCreator = openData.warCreator;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleSpmSaveSlotPanel, {
            currentSlotIndex     : warCreator.getSaveSlotIndex(),
            needComment          : false,
            needConfirmOverwrite : true,
            callback             : slotIndex => {
                warCreator.setSaveSlotIndex(slotIndex);
                SinglePlayerMode_Model_SpmProxy.reqSpmCreateSrw(warCreator.generateData());
            },
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateBtnModifyWarRule();
        this._updateLabelWarRule();
        this._updateLabelHighScore();
        this._updateListPlayer();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0908);
        this._labelWarRuleTitle.setLangText(Lang_Constants.TextType.B0909);
        this._labelHighScoreTitle.setLangText(Lang_Constants.TextType.B0907);
        this._btnStart.setLangText(Lang_Constants.TextType.B0249);

        this._layoutHighScore.arrangeItems();
    }

    private async _updateBtnModifyWarRule(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warCreator = openData.warCreator;
        this._btnModifyWarRule.setIsVisible(((await warCreator.getMapRawData()).getTemplateWarRuleArray().filter(v => v.getRuleAvailability()?.getCanSrw()).length) > 1);
    }
    private async _updateLabelWarRule(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warCreator        = openData.warCreator;
        const templateWarRuleId = warCreator.getInstanceWarRule().getTemplateWarRuleId();
        const templateWarRule   = (await warCreator.getMapRawData()).getTemplateWarRuleArray().find(v => v.getRuleId() === templateWarRuleId);
        this._labelWarRule.setText(templateWarRule
            ? `#${templateWarRuleId} ${Lang_Utils.getLanguageText({ textArray : templateWarRule.getRuleNameArray() }) ?? Lang_Constants.UndefinedError}`
            : Lang_Constants.UndefinedError,
        );
    }
    private async _updateLabelHighScore(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warCreator    = openData.warCreator;
        const ruleId        = warCreator.getInstanceWarRule().getTemplateWarRuleId();
        const label         = this._labelHighScore;
        const layout        = this._layoutHighScore;
        if (ruleId == null) {
            label.setText(`--`);
            layout.arrangeItems();
            return;
        }

        const normalMapId   = warCreator.getMapRawData().getNormalMapId();
        const configVersion = await GameConfigs_Provider.getLatestConfigVersion();
        const score         = Users_Model.getSelfInfo()?.getUserComplexInfo()?.getUserWarStatistics()?.getSrwArray().find(v => (v.getConfigVersion() === configVersion) && (v.getNormalMapId() === normalMapId) && (v.getRuleId() === ruleId))?.getHighScore();
        if (score == null) {
            label.setText(`--`);
        } else {
            const rankIndex = await SinglePlayerMode_Model_SpmModel.getRankIndex(normalMapId, ruleId, score);
            label.setText(((rankIndex != null) && (rankIndex > 0))
                ? `${score} (${rankIndex}${Helpers_Text.getSuffixForRankIndex(rankIndex)})`
                : `${score} (--)`,
            );
        }
        layout.arrangeItems();
    }
    private async _updateListPlayer(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warCreator    = openData.warCreator;
        const mapRawData    = await warCreator.getMapRawData();
        const listPlayer    = this._listPlayer;
        const dataArray     = mapRawData ? this._createDataForListPlayer(mapRawData.getPlayersCountUnneutral()) : [];
        await listPlayer.bindData(dataArray);

        const count = dataArray.length;
        this._group.setUnscaledManualWidth(Numbers_Utils.getValueInRange({
            maxValue : Stages_Constants.Dimension.DesignWidth,
            minValue : 330,
            rawValue : count * 140 + (count - 1) * 10 + 40,
        }));
    }

    private _createDataForListPlayer(playersCountUnneutral: number): DataForPlayerRenderer[] {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const warCreator   = openData.warCreator;
        const dataList      : DataForPlayerRenderer[] = [];
        for (let playerIndex = 1; playerIndex <= playersCountUnneutral; ++playerIndex) {
            dataList.push({
                warCreator  : warCreator,
                playerIndex : playerIndex,
            });
        }

        return dataList;
    }
}

interface DataForPlayerRenderer extends Ui_Types_UiListItemData.UiListItemData {
    warCreator      : SingleRankRoom_Model_SrrWarCreator.SrrWarCreator;
    playerIndex     : number;
}
class PlayerRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _groupCo!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgSkin!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgCoHead!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelCo!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPlayerType!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _labelPlayerIndex!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTeamIndex!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnChangeCo!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnChangeSkinId!      : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._groupCo,                callback : this._onTouchedGroupCo },
            { ui : this._btnChangeCo,            callback : this._onTouchedBtnChangeCo },
            { ui : this._btnChangeSkinId,        callback : this._onTouchedBtnChangeSkinId },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                callback : this._onNotifyLanguageChanged },
            { type : "WarCreator_PlayerInfoChanged",     callback : this._onNotifySrrCreatePlayerInfoChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    protected override _doApplyOpenData(): void {
        this._updateComponentsForSettings();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warRuleCommonData = Helpers_Misc.getExisted(openData.warCreator.getInstanceWarRule().getWarRuleCommonData());
        const playerRule        = WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, openData.playerIndex);
        this._btnChangeCo.setIsVisible(playerRule.getSrwAiCoId() == null);
    }

    private async _onTouchedGroupCo(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const warCreator    = openData.warCreator;
        const playerData    = warCreator.getPlayerInfo(openData.playerIndex);
        const coId          = playerData ? playerData.getCoId() : null;
        if ((coId != null) && (coId !== Cos_Constants.CoId.Empty)) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonCoInfoPanel, {
                gameConfig : warCreator.getGcData(),
                coId       : coId,
            });
        }
    }

    private _onTouchedBtnChangeSkinId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openData.warCreator.tickUnitAndTileSkinId(openData.playerIndex);
    }

    private async _onTouchedBtnChangeCo(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warCreator        = openData.warCreator;
        const playerIndex       = openData.playerIndex;
        const gcData            = warCreator.getGcData();
        const playerInfo        = warCreator.getPlayerInfo(playerIndex);
        const currentCoId       = playerInfo.getCoId();
        const warRuleCommonData = Helpers_Misc.getExisted(warCreator.getInstanceWarRule().getWarRuleCommonData());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleCoIdPanel, {
            gameConfig         : gcData,
            currentCoId        : currentCoId,
            isBan              : false,
            availableCoIdArray : [...PlayerRules_Utils.getFinalSrwHumanCoIdSet({
                playerRule      : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex),
                gameConfig      : gcData,
                hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
                includeRandom   : false,
            })],
            callbackOnConfirm : newCoId => {
                if (newCoId != currentCoId) {
                    playerInfo.setCoId(newCoId);
                    Notifications_Dispatcher.dispatch("WarCreator_PlayerInfoChanged", { playerIndex });
                }
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifySrrCreatePlayerInfoChanged(e: Egret_Egret.Event<Notifications_Mapping.Mapping["WarCreator_PlayerInfoChanged"]>): void {
        const eventData = e.data as Notifications_Mapping.Mapping["WarCreator_PlayerInfoChanged"];
        if (eventData.playerIndex === this.getOpenData()?.playerIndex) {
            this._updateComponentsForSettings();
        }
    }

    private _updateComponentsForLanguage(): void {
        this._btnChangeCo.setLangText(Lang_Constants.TextType.B0230);
        this._btnChangeSkinId.setLangText(Lang_Constants.TextType.B0609);
    }

    private async _updateComponentsForSettings(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const warCreator        = openData.warCreator;
        const playerIndex       = openData.playerIndex;
        const settingsForCommon = warCreator.getSettingsForCommon();
        const warRuleCommonData = Helpers_Misc.getExisted(warCreator.getInstanceWarRule().getWarRuleCommonData());
        this._labelPlayerIndex.setText(Lang_Utils.getPlayerForceName(playerIndex));
        this._labelTeamIndex.setText(Lang_Utils.getPlayerTeamName(WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex()) || Lang_Constants.UndefinedError);

        const playerData = warCreator.getPlayerInfo(openData.playerIndex);
        this._imgSkin.loadSource(Helpers_ImageSource.getCoHeadFrame(playerData.getUnitAndTileSkinId()));
        this._labelPlayerType.setLangText(playerData.getUserId() == null ? Lang_Constants.TextType.B0607 : Lang_Constants.TextType.B0031);

        const coId          = playerData.getCoId();
        const gameConfig    = await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion()));
        const coCfg         = gameConfig.getCoBasicCfg(coId);
        this._labelCo.setText(coCfg ? coCfg.getName() : `??`);
        this._imgCoHead.loadSource(Helpers_ImageSource.getCoHead(gameConfig, coId) ?? Lang_Constants.UndefinedError);
    }
}
