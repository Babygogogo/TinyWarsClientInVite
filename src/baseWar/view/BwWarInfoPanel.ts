import {
    Cos_Constants,
    ForceSkins_Utils,
    type BaseWar_Interface_IBwWar,
    MultiMatchWar_Model_MmwWar,
    MultiRankWar_Model_MrwWar,
    ReplayWar_Model_RwWar,
    ReplayWar_Model_RwWarBase,
    SingleCustomWar_Model_ScwWar,
    SingleFreeWar_Model_SfwWar,
    SinglePlayerWar_Model_SpwWar,
    BootTimers_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
    AutoTourneys_Wars_War,
    Players_Constants,
    type Notifications_DataTypes,
    SinglePlayerWar_Model_SpwModel,
    Utils_ClientErrorCode,
    GamePanels_Manager,
    Ui_Components_UiPlayerRuleRenderer,
    Notifications_Dispatcher,
    Helpers_ImageSource,
    GamePanels_Dict,
    GameModes_Utils,
    Helpers_Misc,
    Lang_Utils,
    WarRules_Utils_CommonData,
    Users_Model,
    PlayerRules_Constants,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiList,
    type Ui_Interfaces_IUiScroller,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    type Ui_Types_UiListItemData,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    WarTypes_Constants,
} from "../../internal.ts";

 
const enum InfoType {
    Player,
    TeamIndex,
    Co,
    BannedCo,
    Energy,
    CurrentFund,
    BuildingsAndIncome,
    UnitsAndValue,
    TimeLimit,

    BannedUnitTypeArray,
    InitialFund,
    IncomeMultiplier,
    MaxUnitsCount,
    EnergyAddPctOnCoBoard,
    EnergyLossPctOnCoDie,
    EnergyGrowthMultiplier,
    CanActivateCoSkill,
    CanCoBoard,
    CanUnitJoin,
    MoveRangeModifier,
    UnitVisionRangeModifier,
    TileVisionRangeModifier,
    AttackPowerModifier,
    DefenseModifier,
    LuckLowerLimit,
    LuckUpperLimit,
}
const CommonPlayerRuleTypes = [
    PlayerRules_Constants.RuleTypeId.BannedUnitTypeArray,
    PlayerRules_Constants.RuleTypeId.InitialFund,
    PlayerRules_Constants.RuleTypeId.IncomeMultiplier,
    PlayerRules_Constants.RuleTypeId.MaxUnitsCount,
    PlayerRules_Constants.RuleTypeId.EnergyAddPctOnCoBoard,
    PlayerRules_Constants.RuleTypeId.EnergyLossPctOnCoDie,
    PlayerRules_Constants.RuleTypeId.EnergyGrowthMultiplier,
    PlayerRules_Constants.RuleTypeId.CanActivateCoSkill,
    PlayerRules_Constants.RuleTypeId.CanCoBoard,
    PlayerRules_Constants.RuleTypeId.CanUnitJoin,
    PlayerRules_Constants.RuleTypeId.MoveRangeModifier,
    PlayerRules_Constants.RuleTypeId.UnitVisionRangeModifier,
    PlayerRules_Constants.RuleTypeId.TileVisionRangeModifier,
    PlayerRules_Constants.RuleTypeId.AttackPowerModifier,
    PlayerRules_Constants.RuleTypeId.DefenseModifier,
    PlayerRules_Constants.RuleTypeId.LuckLowerLimit,
    PlayerRules_Constants.RuleTypeId.LuckUpperLimit,
];
const CommonInfoTypes = [   // 需要和 CommonPlayerRuleTypes 保持一一对应的关系
    InfoType.BannedUnitTypeArray,
    InfoType.InitialFund,
    InfoType.IncomeMultiplier,
    InfoType.MaxUnitsCount,
    InfoType.EnergyAddPctOnCoBoard,
    InfoType.EnergyLossPctOnCoDie,
    InfoType.EnergyGrowthMultiplier,
    InfoType.CanActivateCoSkill,
    InfoType.CanCoBoard,
    InfoType.CanUnitJoin,
    InfoType.MoveRangeModifier,
    InfoType.UnitVisionRangeModifier,
    InfoType.TileVisionRangeModifier,
    InfoType.AttackPowerModifier,
    InfoType.DefenseModifier,
    InfoType.LuckLowerLimit,
    InfoType.LuckUpperLimit,
];

export interface OpenData {
    war : BaseWar_Interface_IBwWar.IBwWar;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTips!                : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupTopButton!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnSwitch!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnUnits!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnTiles!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnInfo!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupPlayer1!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelPlayerIndex1!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgCo1!                   : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgSkin1!                 : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupPlayer2!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelPlayerIndex2!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgCo2!                   : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgSkin2!                 : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupPlayer3!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelPlayerIndex3!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgCo3!                   : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgSkin3!                 : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupPlayer4!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelPlayerIndex4!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgCo4!                   : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgSkin4!                 : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _scroller!                 : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiContainer.IUiContainer>;
    private readonly _listRuleTitle!            : Ui_Interfaces_IUiList.IUiList<DataForRuleTitleRenderer>;
    private readonly _listPlayerInfo1!          : Ui_Interfaces_IUiList.IUiList<DataForInfoRenderer>;
    private readonly _listPlayerInfo2!          : Ui_Interfaces_IUiList.IUiList<DataForInfoRenderer>;
    private readonly _listPlayerInfo3!          : Ui_Interfaces_IUiList.IUiList<DataForInfoRenderer>;
    private readonly _listPlayerInfo4!          : Ui_Interfaces_IUiList.IUiList<DataForInfoRenderer>;
    private readonly _groupRule!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listPlayerRule1!          : Ui_Interfaces_IUiList.IUiList<Ui_Components_UiPlayerRuleRenderer.DataForUiPlayerRuleRenderer>;
    private readonly _listPlayerRule2!          : Ui_Interfaces_IUiList.IUiList<Ui_Components_UiPlayerRuleRenderer.DataForUiPlayerRuleRenderer>;
    private readonly _listPlayerRule3!          : Ui_Interfaces_IUiList.IUiList<Ui_Components_UiPlayerRuleRenderer.DataForUiPlayerRuleRenderer>;
    private readonly _listPlayerRule4!          : Ui_Interfaces_IUiList.IUiList<Ui_Components_UiPlayerRuleRenderer.DataForUiPlayerRuleRenderer>;

    private _pageIndex                          = 0;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,             callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.BwCoIdChanged,               callback : this._onNotifyBwCoIdChanged },
            { type : Notifications_TypeId.TypeId.BwOverridingSkinIdChanged,   callback : this._onNotifyBwOverridingSkinIdChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,               callback : this.closePanel },
            { ui : this._btnInfo,                callback : this._onTouchedBtnInfo },
            { ui : this._btnSwitch,              callback : this._onTouchedBtnSwitch },
            { ui : this._btnUnits,               callback : this._onTouchedBtnUnits },
            { ui : this._btnTiles,               callback : this._onTouchedBtnTiles },
            { ui : this._groupPlayer1,           callback : this._onTouchedGroupPlayer1 },
            { ui : this._groupPlayer2,           callback : this._onTouchedGroupPlayer2 },
            { ui : this._groupPlayer3,           callback : this._onTouchedGroupPlayer3 },
            { ui : this._groupPlayer4,           callback : this._onTouchedGroupPlayer4 },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listRuleTitle.setItemRendererClass(RuleTitleRenderer);
        this._listPlayerInfo1.setItemRendererClass(InfoRenderer);
        this._listPlayerInfo2.setItemRendererClass(InfoRenderer);
        this._listPlayerInfo3.setItemRendererClass(InfoRenderer);
        this._listPlayerInfo4.setItemRendererClass(InfoRenderer);
        this._listPlayerRule1.setItemRendererClass(Ui_Components_UiPlayerRuleRenderer.UiPlayerRuleRenderer);
        this._listPlayerRule2.setItemRendererClass(Ui_Components_UiPlayerRuleRenderer.UiPlayerRuleRenderer);
        this._listPlayerRule3.setItemRendererClass(Ui_Components_UiPlayerRuleRenderer.UiPlayerRuleRenderer);
        this._listPlayerRule4.setItemRendererClass(Ui_Components_UiPlayerRuleRenderer.UiPlayerRuleRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this.getPreviousOpenData()?.war.setIsViewingWarInfo(false);
        this.getOpenData()?.war.setIsViewingWarInfo(true);

        this._pageIndex = 0;
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        const war = this.getOpenData()?.war;
        war?.setIsViewingWarInfo(false);

        if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
            SinglePlayerWar_Model_SpwModel.checkAndHandleAutoActionsAndRobotRecursively(war);
        }

        await Promise.all([
            this._listRuleTitle.removeAllItems(),
            this._listPlayerInfo1.removeAllItems(),
            this._listPlayerInfo2.removeAllItems(),
            this._listPlayerInfo3.removeAllItems(),
            this._listPlayerInfo4.removeAllItems(),
            this._listPlayerRule1.removeAllItems(),
            this._listPlayerRule2.removeAllItems(),
            this._listPlayerRule3.removeAllItems(),
            this._listPlayerRule4.removeAllItems(),
        ]);

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyBwCoIdChanged(): void {
        this._updateAllGroupPlayer();
    }
    private _onNotifyBwOverridingSkinIdChanged(): void {
        this._updateAllGroupPlayer();
    }
    private _onTouchedBtnInfo(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwWarExtraInfoPanel, {
            war : war,
        });
    }
    private _onTouchedBtnSwitch(): void {
        this._pageIndex = 1 - this._pageIndex;
        this._updateComponentsForPlayerInfo();
    }
    private _onTouchedBtnUnits(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwUnitListPanel, {
            war                   : war,
            callbackForMoveCursor : unit => {
                if ((war.getIsExecutingAction()) || (war.getActionPlanner().checkIsStateRequesting())) {
                    return;
                }

                const gridIndex = unit.getGridIndex();
                const cursor    = war.getCursor();
                cursor.setGridIndex(gridIndex);
                cursor.updateView();
                war.getView().tweenGridToCentralArea(gridIndex);
                war.getGridVisualEffect().showEffectAiming(gridIndex, 800);
                Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            },
            callbackForSelectUnit : unit => {
                if ((war.getIsExecutingAction()) || (war.getActionPlanner().checkIsStateRequesting())) {
                    return;
                }

                const gridIndex = unit.getGridIndex();
                war.getCursor().setGridIndex(gridIndex);
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwCursorTapped, {
                    current  : gridIndex,
                    tappedOn : gridIndex,
                } as Notifications_DataTypes.BwCursorTapped);
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().BwUnitListPanel);
            },
        });
        this.closePanel();
    }
    private _onTouchedBtnTiles(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwTileStatisticsPanel, {
            war : war,
        });
        this.closePanel();
    }
    private _onTouchedGroupPlayer1(): void {
        this._handleTouchForGroupPlayers(this._pageIndex * 4 + 1);
    }
    private _onTouchedGroupPlayer2(): void {
        this._handleTouchForGroupPlayers(this._pageIndex * 4 + 2);
    }
    private _onTouchedGroupPlayer3(): void {
        this._handleTouchForGroupPlayers(this._pageIndex * 4 + 3);
    }
    private _onTouchedGroupPlayer4(): void {
        this._handleTouchForGroupPlayers(this._pageIndex * 4 + 4);
    }
    private _handleTouchForGroupPlayers(playerIndex: number): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonCoListPanel, {
            war         : war,
            playerIndex : playerIndex,
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateGroupTopButton();

        this._initListRuleTitle();
        this._updateComponentsForPlayerInfo();
    }

    private _updateComponentsForPlayerInfo(): void {
        this._updateAllGroupPlayer();

        const pageIndex = this._pageIndex;
        {
            const infoTypes = getInfoTypesForInfoList(this.getOpenData()?.war);
            this._updateListPlayerInfo(pageIndex * 4 + 1, this._listPlayerInfo1, infoTypes);
            this._updateListPlayerInfo(pageIndex * 4 + 2, this._listPlayerInfo2, infoTypes);
            this._updateListPlayerInfo(pageIndex * 4 + 3, this._listPlayerInfo3, infoTypes);
            this._updateListPlayerInfo(pageIndex * 4 + 4, this._listPlayerInfo4, infoTypes);
            this._groupRule.setY(infoTypes.length * 32);
        }
        {
            this._updateListPlayerRule(pageIndex * 4 + 1, this._listPlayerRule1);
            this._updateListPlayerRule(pageIndex * 4 + 2, this._listPlayerRule2);
            this._updateListPlayerRule(pageIndex * 4 + 3, this._listPlayerRule3);
            this._updateListPlayerRule(pageIndex * 4 + 4, this._listPlayerRule4);
        }
    }
    private _updateAllGroupPlayer(): void {
        const pageIndex = this._pageIndex;
        this._updateGroupPlayer(pageIndex * 4 + 1, this._groupPlayer1, this._labelPlayerIndex1, this._imgSkin1, this._imgCo1);
        this._updateGroupPlayer(pageIndex * 4 + 2, this._groupPlayer2, this._labelPlayerIndex2, this._imgSkin2, this._imgCo2);
        this._updateGroupPlayer(pageIndex * 4 + 3, this._groupPlayer3, this._labelPlayerIndex3, this._imgSkin3, this._imgCo3);
        this._updateGroupPlayer(pageIndex * 4 + 4, this._groupPlayer4, this._labelPlayerIndex4, this._imgSkin4, this._imgCo4);
    }

    private _updateComponentsForLanguage(): void {
        this._updateLabelTitle();
        this._updateLabelTips();
    }

    private _updateGroupTopButton(): void {
        const group = this._groupTopButton;
        group.removeAllItems(false);

        group.addItem(this._btnUnits, false);
        group.addItem(this._btnTiles, false);
        if ((this.getOpenData()?.war.getPlayersCountUnneutral() ?? 0) > 4) {
            group.addItem(this._btnSwitch, false);
        }
        group.addItem(this._btnInfo, false);
        group.addItem(this._btnClose, false);

        group.arrangeItems();
    }

    private _updateLabelTitle(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const label = this._labelTitle;
        if (war instanceof ReplayWar_Model_RwWar.RwWar) {
            if (war.getSettingsForSrw()) {
                label.setLangText(Lang_Constants.TextType.B1115);
            } else {
                label.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0710)} #${war.getReplayId()}`);
            }
        } else {
            const warId = war.getWarId();
            label.setText(warId == null
                ? Lang_Utils.getText(Lang_Constants.TextType.B0223)
                : `${Lang_Utils.getText(Lang_Constants.TextType.B0719)} #${warId}`,
            );
        }
    }

    private _updateLabelTips(): void {
        const war = this.getOpenData()?.war;
        this._labelTips.setText((war instanceof SingleCustomWar_Model_ScwWar.ScwWar) || (war instanceof SingleFreeWar_Model_SfwWar.SfwWar)
            ? Lang_Utils.getText(Lang_Constants.TextType.A0998)
            : ``,
        );
    }

    private async _initListRuleTitle(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const dataArray : DataForRuleTitleRenderer[] = [];
        let index       = 0;
        for (const playerRuleType of getInfoTypesForTitleList(war)) {
            dataArray.push({
                index    : index++,
                infoType : playerRuleType,
                war      : war,
            });
        }
        await this._listRuleTitle.bindData(dataArray);
    }

    // private _updateListPlayer(infoTypeArray: InfoType[]): void {
    //     const war               = this._getOpenData().war;
    //     const playerRuleArray   = Helpers.getExisted(war.getInstanceWarRule().ruleForPlayers?.playerRuleDataArray, ClientErrorCode.BwWarInfoPanel_UpdateListPlayer_00);
    //     const dataArray         : DataForPlayerRenderer[] = [];
    //     for (let playerIndex = GameConfig.Player.PlayerIndex.Const.First; playerIndex <= playerRuleArray.length; ++playerIndex) {
    //         dataArray.push({
    //             war,
    //             playerIndex,
    //             playerRule      : Helpers.getExisted(playerRuleArray.find(v => v.playerIndex === playerIndex), ClientErrorCode.BwWarInfoPanel_UpdateListPlayer_01),
    //             infoTypeArray,
    //         });
    //     }
    //     this._listPlayerInfo1.bindData(dataArray);
    // }

    private _updateGroupPlayer(playerIndex: number, group: Ui_Interfaces_IUiContainer.IUiContainer, labelPlayerIndex: Ui_Interfaces_IUiLabel.IUiLabel, imgSkin: Ui_Interfaces_IUiImage.IUiImage, imgCo: Ui_Interfaces_IUiImage.IUiImage): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getPlayersCountUnneutral() < playerIndex) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);

            const player = war.getPlayer(playerIndex);
            imgSkin.loadSource(Helpers_ImageSource.getCoEyeBackground(ForceSkins_Utils.getFinalSkinId(war, playerIndex)));
            imgCo.loadSource(Helpers_ImageSource.getCoEye(war.getGcData(), player.getCoId(), player.getAliveState() !== Players_Constants.AliveStateId.Dead) ?? Lang_Constants.UndefinedError);
            labelPlayerIndex.setText(`P${playerIndex}`);
        }
    }

    private async _updateListPlayerInfo(playerIndex: number, list: Ui_Interfaces_IUiList.IUiList<DataForInfoRenderer>, infoTypeArray: InfoType[]): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getPlayersCountUnneutral() < playerIndex) {
            await list.removeAllItems();
        } else {
            const dataArray: DataForInfoRenderer[] = [];
            for (const infoType of infoTypeArray) {
                dataArray.push({
                    war         : war,
                    infoType    : infoType,
                    playerIndex : playerIndex,
                });
            }
            await list.bindData(dataArray);
        }
    }

    private async _updateListPlayerRule(playerIndex: number, list: Ui_Interfaces_IUiList.IUiList<Ui_Components_UiPlayerRuleRenderer.DataForUiPlayerRuleRenderer>): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getPlayersCountUnneutral() < playerIndex) {
            await list.removeAllItems();
        } else {
            const canModify         = war.getCanCheat();
            const gcData            = war.getGcData();
            const gameModeId        = GameModes_Utils.getEnum(war.getWarType());
            const warRuleCommonData = Helpers_Misc.getExisted(war.getCommonSettingManager().getInstanceWarRule().getWarRuleCommonData());
            const playerRule        = Helpers_Misc.getExisted(warRuleCommonData.getPlayerRuleList().find(v => v.getPlayerIndex() === playerIndex));
            const getIsBatch        = () => false;
            const dataArray         : Ui_Components_UiPlayerRuleRenderer.DataForUiPlayerRuleRenderer[] = [];
            for (const playerRuleType of CommonPlayerRuleTypes) {
                dataArray.push({
                    canModify         : canModify,
                    gcData            : gcData,
                    gameModeId        : gameModeId,
                    instanceWarRule   : null,
                    warRuleCommonData : warRuleCommonData,
                    playerRule        : playerRule,
                    playerRuleType    : playerRuleType,
                    getIsBatch        : getIsBatch,
                });
            }
            await list.bindData(dataArray);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// RuleTitleRenderer
////////////////////////////////////////////////////////////////////////////////////////////////////
interface DataForRuleTitleRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index       : number;
    infoType    : InfoType;
    war         : BaseWar_Interface_IBwWar.IBwWar;
}
class RuleTitleRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForRuleTitleRenderer> {
    private readonly _imgBg!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupHelp!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgHelp!      : Ui_Interfaces_IUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,     callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._groupHelp,                  callback : this._onTouchedGroupHelp },
        ]);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateView();
    }
    private _onTouchedGroupHelp(): void {
        switch (this.getOpenData()?.infoType) {
            case InfoType.BannedCo  : return this._onTouchedGroupHelpForBannedCo();
        }
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const infoType = openData.infoType;
        this._imgBg.setIsVisible(openData.index % 2 === 0);
        this._labelName.setText(getInfoTypeName(infoType) ?? Lang_Constants.UndefinedError);
        this._imgHelp.setIsVisible(infoType === InfoType.BannedCo);
    }

    private _onTouchedGroupHelpForBannedCo(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const gameConfig    = war.getGcData();
        const dict          = new Map<number, number[]>();
        for (const [playerIndex] of war.getPlayerManager().getAllPlayersDict()) {
            if (playerIndex === Players_Constants.PlayerIndex.Neutral) {
                continue;
            }

            dict.set(playerIndex, getBannedCoCategoryIdArray(war, playerIndex) ?? []);
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowSelectedCoCategoryIdPanel, {
            selectedCoCategoryIdDict   : dict,
            availableCoCategoryIdArray : gameConfig.getEnabledCoCategoryIdArray(war.getWarType()),
            isBan                      : true,
            gameConfig                 : gameConfig,
        });
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// InfoRenderer
////////////////////////////////////////////////////////////////////////////////////////////////////
interface DataForInfoRenderer extends Ui_Types_UiListItemData.UiListItemData {
    war                 : BaseWar_Interface_IBwWar.IBwWar;
    infoType            : InfoType;
    playerIndex         : number;
}
class InfoRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
    private readonly _layoutValue!  : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnModify!    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelValue!   : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnModify,          callback : this._onTouchedBtnModify },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.TimeTick,    callback : this._onNotifyTimeTick },
        ]);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedBtnModify(): void {
        const infoType = this.getOpenData()?.infoType;
        if (infoType == null) {
            return;
        }

        switch (infoType) {
            case InfoType.Player        : return this._modifyAsPlayer();
            case InfoType.TeamIndex     : return this._modifyAsTeamIndex();
            case InfoType.Co            : return this._modifyAsCo();
            case InfoType.BannedCo      : return this._modifyAsBannedCo();
            case InfoType.Energy        : return this._modifyAsEnergy();
            case InfoType.CurrentFund   : return this._modifyAsCurrentFund();
            default                     : throw Helpers_Misc.newError(`Invalid infoType: ${infoType}`, Utils_ClientErrorCode.ClientErrorCode.BwWarInfoPanel_InfoRenderer_OnTouchedBtnModify_00);
        }
    }
    private _onNotifyTimeTick(): void {
        if (this.getOpenData()?.infoType === InfoType.TimeLimit) {
            this._updateViewAsTimeLimit();
        }
    }
    private _modifyAsPlayer(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { playerIndex, war }  = openData;
        const player                = war.getPlayer(playerIndex);
        const isHuman               = player.getUserId() != null;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => isHuman ? Lang_Utils.getText(Lang_Constants.TextType.A0110) : Lang_Utils.getText(Lang_Constants.TextType.A0111),
            callback   : () => {
                player.setUserId(isHuman ? null : Users_Model.getSelfUserId());
                this._updateView();
            },
        });
    }
    private _modifyAsTeamIndex(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { playerIndex, war }  = openData;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0072, playerIndex),
            callback   : () => {
                const warRuleCommonData = Helpers_Misc.getExisted(war.getInstanceWarRule().getWarRuleCommonData());
                const playerRule        = WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex);
                playerRule.setTeamIndex((playerRule.getTeamIndex() % war.getPlayerManager().getTotalPlayersCount(false)) + 1);
                this._updateView();
            },
        });
    }
    private _modifyAsCo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { playerIndex, war }  = openData;
        const player                = war.getPlayer(playerIndex);
        const gameConfig            = war.getGcData();
        const currentCoId           = player.getCoId();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleCoIdPanel, {
            gameConfig         : gameConfig,
            currentCoId        : currentCoId,
            availableCoIdArray : gameConfig.getEnabledCoArray(war.getWarType()).map(v => v.getCoId()),
            isBan              : false,
            callbackOnConfirm  : newCoId => {
                if (newCoId !== currentCoId) {
                    player.setCoId(newCoId);

                    war.getTileMap().getView().updateCoZone();
                    this._updateView();
                }
            },
        });
    }
    private _modifyAsBannedCo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { playerIndex, war }  = openData;
        const gameConfig            = war.getGcData();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowCoCategoryIdPanel, {
            gameConfig                 : gameConfig,
            availableCoCategoryIdArray : gameConfig.getAllEnabledCoCategoryIdArray(),
            currentCoCategoryIdArray   : getBannedCoCategoryIdArray(war, playerIndex),
            isBan                      : true,
            getTitleText               : () => `${Lang_Utils.getText(Lang_Constants.TextType.B0403)} (P${playerIndex})`,
        });
    }
    private _modifyAsEnergy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { playerIndex, war }  = openData;
        const player                = war.getPlayer(playerIndex);
        const currValue             = player.getCoCurrentEnergy();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => `P${playerIndex} ${Lang_Utils.getText(Lang_Constants.TextType.B0033)}`,
            currentValue : currValue,
            minValue     : Cos_Constants.EnergyHardLimit.Min,
            maxValue     : Cos_Constants.EnergyHardLimit.Max,
            callback     : value => {
                player.setAndValidateCoCurrentEnergy(value);
                this._updateView();
            },
        });
    }
    private _modifyAsCurrentFund(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { playerIndex, war }  = openData;
        const player                = war.getPlayer(playerIndex);
        const currValue             = player.getFund();
        const maxValue              = PlayerRules_Constants.InitialFund.MaxLimit;
        const minValue              = PlayerRules_Constants.InitialFund.MinLimit;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => `P${player.getPlayerIndex()} ${Lang_Utils.getText(Lang_Constants.TextType.Fund)}`,
            currentValue : currValue,
            minValue,
            maxValue,
            callback     : value => {
                player.setFund(value);
                this._updateView();
            },
        });
    }

    private _updateView(): void {
        const infoType = this.getOpenData()?.infoType;
        if (infoType == null) {
            return;
        }

        switch (infoType) {
            case InfoType.Player                : this._updateViewAsPlayer();               break;
            case InfoType.TeamIndex             : this._updateViewAsTeamIndex();            break;
            case InfoType.Co                    : this._updateViewAsCo();                   break;
            case InfoType.BannedCo              : this._updateViewAsBannedCo();             break;
            case InfoType.Energy                : this._updateViewAsEnergy();               break;
            case InfoType.CurrentFund           : this._updateViewAsCurrentFund();          break;
            case InfoType.BuildingsAndIncome    : this._updateViewAsBuildingsAndIncome();   break;
            case InfoType.UnitsAndValue         : this._updateViewAsUnitsAndValue();        break;
            case InfoType.TimeLimit             : this._updateViewAsTimeLimit();            break;
            default                             : throw Helpers_Misc.newError(`Invalid infoType: ${infoType}`, Utils_ClientErrorCode.ClientErrorCode.BwWarInfoPanel_InfoRenderer_UpdateView_00);
        }
    }
    private async _updateViewAsPlayer(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { playerIndex, war }  = openData;
        const userId                = war.getPlayer(playerIndex).getUserId();
        const labelValue            = this._labelValue;
        labelValue.setText(userId == null
            ? Lang_Utils.getText(Lang_Constants.TextType.B0607)
            : Helpers_Misc.getExisted(await Users_Model.getUserNickname(userId), Utils_ClientErrorCode.ClientErrorCode.BwWarInfoPanel_InfoRenderer_UpdateViewAsPlayer_00),
        );
        labelValue.setTextColor(0xFFFFFF);

        const canModify = checkCanModifyPlayerInfo(war);
        this._btnModify.setIsVisible(canModify);
        this._layoutValue.arrangeItems();
    }
    private _updateViewAsTeamIndex(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war               = openData.war;
        const teamIndex         = war.getPlayer(openData.playerIndex).getTeamIndex();
        const labelValue        = this._labelValue;
        labelValue.setText(Lang_Utils.getPlayerTeamName(teamIndex) ?? Lang_Constants.UndefinedError);
        labelValue.setTextColor(0xFFFFFF);

        const canModify         = checkCanModifyPlayerInfo(war);
        this._btnModify.setIsVisible(canModify);
        this._layoutValue.arrangeItems();
    }
    private _updateViewAsCo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war           = openData.war;
        const labelValue    = this._labelValue;
        labelValue.setText(war.getGcData().getCoNameAndTierText(war.getPlayer(openData.playerIndex).getCoId()) ?? Lang_Constants.UndefinedError);
        labelValue.setTextColor(0xFFFFFF);

        const canModify = checkCanModifyPlayerInfo(war);
        this._btnModify.setIsVisible(canModify);
        this._layoutValue.arrangeItems();
    }
    private _updateViewAsBannedCo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const labelValue        = this._labelValue;
        const coCategoryIdArray = getBannedCoCategoryIdArray(openData.war, openData.playerIndex);
        labelValue.setText(coCategoryIdArray == null ? `--` : `${coCategoryIdArray.length}`);
        labelValue.setTextColor(0xFFFFFF);

        const canSeeDetail      = !!coCategoryIdArray?.length;
        this._btnModify.setIsVisible(canSeeDetail);
        this._layoutValue.arrangeItems();
    }
    private _updateViewAsEnergy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war           = openData.war;
        const labelValue    = this._labelValue;
        labelValue.setText(`${war.getPlayer(openData.playerIndex).getCoCurrentEnergy()}`);
        labelValue.setTextColor(0xFFFFFF);

        const canModify         = checkCanModifyPlayerInfo(war);
        this._btnModify.setIsVisible(canModify);
        this._layoutValue.arrangeItems();
    }
    private _updateViewAsCurrentFund(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war           = openData.war;
        const player        = war.getPlayer(openData.playerIndex);
        const labelValue    = this._labelValue;
        labelValue.setTextColor(0xFFFFFF);
        if ((war.getFogMap().checkHasFogCurrently())                                                    &&
            (!war.getPlayerManager().getWatcherTeamIndexesForSelf().has(player.getTeamIndex()))
        ) {
            labelValue.setText(`????`);
        } else {
            labelValue.setText(`${player.getFund()}`);
        }

        const canModify         = checkCanModifyPlayerInfo(war);
        this._btnModify.setIsVisible(canModify);
        this._layoutValue.arrangeItems();
    }
    private _updateViewAsBuildingsAndIncome(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war           = openData.war;
        const playerIndex   = openData.playerIndex;
        const labelValue    = this._labelValue;
        labelValue.setTextColor(0xFFFFFF);
        if ((war.getFogMap().checkHasFogCurrently())                                                                    &&
            (!war.getPlayerManager().getWatcherTeamIndexesForSelf().has(war.getPlayer(playerIndex).getTeamIndex()))
        ) {
            labelValue.setText(`????`);
        } else {
            const tileMap   = war.getTileMap();
            labelValue.setText(`${tileMap.getTilesCountForPlayer(playerIndex)}, +${tileMap.getTotalIncomeForPlayer(playerIndex)}`);
        }
        this._btnModify.setIsVisible(false);
        this._layoutValue.arrangeItems();
    }
    private _updateViewAsUnitsAndValue(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war           = openData.war;
        const playerIndex   = openData.playerIndex;
        const labelValue    = this._labelValue;
        labelValue.setTextColor(0xFFFFFF);
        if ((war.getFogMap().checkHasFogCurrently())                                                                    &&
            (!war.getPlayerManager().getWatcherTeamIndexesForSelf().has(war.getPlayer(playerIndex).getTeamIndex()))
        ) {
            labelValue.setText(`????`);
        } else {
            const unitMap   = war.getUnitMap();
            let count       = 0;
            let value       = 0;
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
            labelValue.setText(`${count}, ${value}`);
        }

        this._btnModify.setIsVisible(false);
        this._layoutValue.arrangeItems();
    }
    private _updateViewAsTimeLimit(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war           = openData.war;
        const playerIndex   = openData.playerIndex;
        const restTime      = war.getBootRestTime(playerIndex);
        const label         = this._labelValue;
        if (restTime == null) {
            label.setText(`--`);
            label.setTextColor(0xffffff);
        } else {
            const params            = war.getSettingsBootTimerParams();
            const textForAddTime    = params[0] === BootTimers_Constants.TimerTypeId.Incremental
                ? `(+${params[2] * war.getUnitMap().getAllUnits().filter(v => v.getPlayerIndex() === playerIndex).length + (params[3] ?? 0)}s)`
                : ``;

            label.setText(`${Lang_Utils.getTimeDurationText2(restTime)}${textForAddTime}`);
            label.setTextColor(restTime >= 30 * 60
                ? 0xFFFFFF
                : (restTime >= 5 * 60 ? 0xFFFF00 : 0xFF4400),
            );
        }

        this._btnModify.setIsVisible(false);
        this._layoutValue.arrangeItems();
    }
}

function getInfoTypesForTitleList(war: AuxiliaryTypes_AuxiliaryTypes.Undefinable<BaseWar_Interface_IBwWar.IBwWar>): InfoType[] {
    if (war == null) {
        return [];
    }

    return [
        ...getInfoTypesForInfoList(war),
        ...CommonInfoTypes,
    ];
}
function getInfoTypesForInfoList(war: AuxiliaryTypes_AuxiliaryTypes.Undefinable<BaseWar_Interface_IBwWar.IBwWar>): InfoType[] {
    if (war == null) {
        return [];
    }

    if (getBannedCoCategoryIdArray(war, Players_Constants.PlayerIndex.First)) {
        return [
            InfoType.Player,
            InfoType.TeamIndex,
            InfoType.Co,
            InfoType.BannedCo,
            InfoType.Energy,
            InfoType.CurrentFund,
            InfoType.BuildingsAndIncome,
            InfoType.UnitsAndValue,
            InfoType.TimeLimit,
        ];
    } else {
        return [
            InfoType.Player,
            InfoType.TeamIndex,
            InfoType.Co,
            InfoType.Energy,
            InfoType.CurrentFund,
            InfoType.BuildingsAndIncome,
            InfoType.UnitsAndValue,
            InfoType.TimeLimit,
        ];
    }
}

function getInfoTypeName(type: InfoType): string | null {
    switch (type) {
        case InfoType.Player                    : return Lang_Utils.getText(Lang_Constants.TextType.B0031);
        case InfoType.TeamIndex                 : return Lang_Utils.getText(Lang_Constants.TextType.B0019);
        case InfoType.Co                        : return Lang_Utils.getText(Lang_Constants.TextType.B0425);
        case InfoType.BannedCo                  : return Lang_Utils.getText(Lang_Constants.TextType.B0403);
        case InfoType.Energy                    : return Lang_Utils.getText(Lang_Constants.TextType.B0033);
        case InfoType.CurrentFund               : return Lang_Utils.getText(Lang_Constants.TextType.Fund);
        case InfoType.BuildingsAndIncome        : return Lang_Utils.getText(Lang_Constants.TextType.B0689);
        case InfoType.UnitsAndValue             : return Lang_Utils.getText(Lang_Constants.TextType.B0688);
        case InfoType.TimeLimit                 : return Lang_Utils.getText(Lang_Constants.TextType.B0021);
        case InfoType.BannedUnitTypeArray       : return Lang_Utils.getPlayerRuleName(PlayerRules_Constants.RuleTypeId.BannedUnitTypeArray);
        case InfoType.InitialFund               : return Lang_Utils.getPlayerRuleName(PlayerRules_Constants.RuleTypeId.InitialFund);
        case InfoType.IncomeMultiplier          : return Lang_Utils.getPlayerRuleName(PlayerRules_Constants.RuleTypeId.IncomeMultiplier);
        case InfoType.MaxUnitsCount             : return Lang_Utils.getPlayerRuleName(PlayerRules_Constants.RuleTypeId.MaxUnitsCount);
        case InfoType.EnergyAddPctOnCoBoard     : return Lang_Utils.getPlayerRuleName(PlayerRules_Constants.RuleTypeId.EnergyAddPctOnCoBoard);
        case InfoType.EnergyLossPctOnCoDie      : return Lang_Utils.getPlayerRuleName(PlayerRules_Constants.RuleTypeId.EnergyLossPctOnCoDie);
        case InfoType.EnergyGrowthMultiplier    : return Lang_Utils.getPlayerRuleName(PlayerRules_Constants.RuleTypeId.EnergyGrowthMultiplier);
        case InfoType.CanActivateCoSkill        : return Lang_Utils.getPlayerRuleName(PlayerRules_Constants.RuleTypeId.CanActivateCoSkill);
        case InfoType.CanCoBoard                : return Lang_Utils.getPlayerRuleName(PlayerRules_Constants.RuleTypeId.CanCoBoard);
        case InfoType.CanUnitJoin               : return Lang_Utils.getPlayerRuleName(PlayerRules_Constants.RuleTypeId.CanUnitJoin);
        case InfoType.MoveRangeModifier         : return Lang_Utils.getPlayerRuleName(PlayerRules_Constants.RuleTypeId.MoveRangeModifier);
        case InfoType.UnitVisionRangeModifier   : return Lang_Utils.getPlayerRuleName(PlayerRules_Constants.RuleTypeId.UnitVisionRangeModifier);
        case InfoType.TileVisionRangeModifier   : return Lang_Utils.getPlayerRuleName(PlayerRules_Constants.RuleTypeId.TileVisionRangeModifier);
        case InfoType.AttackPowerModifier       : return Lang_Utils.getPlayerRuleName(PlayerRules_Constants.RuleTypeId.AttackPowerModifier);
        case InfoType.DefenseModifier           : return Lang_Utils.getPlayerRuleName(PlayerRules_Constants.RuleTypeId.DefenseModifier);
        case InfoType.LuckLowerLimit            : return Lang_Utils.getPlayerRuleName(PlayerRules_Constants.RuleTypeId.LuckLowerLimit);
        case InfoType.LuckUpperLimit            : return Lang_Utils.getPlayerRuleName(PlayerRules_Constants.RuleTypeId.LuckUpperLimit);
        default                                 : return null;
    }
}
function checkCanModifyPlayerInfo(war: BaseWar_Interface_IBwWar.IBwWar): boolean {
    const warType = war.getWarType();
    return (warType === WarTypes_Constants.WarTypeId.ScwFog)
        || (warType === WarTypes_Constants.WarTypeId.ScwStd)
        || (warType === WarTypes_Constants.WarTypeId.SfwFog)
        || (warType === WarTypes_Constants.WarTypeId.SfwStd);
}
function getBannedCoCategoryIdArray(war: BaseWar_Interface_IBwWar.IBwWar, playerIndex: number): number[] | null {
    const bannedCoIdArray = getBannedCoIdArray(war, playerIndex);
    if (bannedCoIdArray == null) {
        return null;
    } else {
        const gameConfig = war.getGcData();
        return bannedCoIdArray.map(v => gameConfig.getCoBasicCfg(v)?.getCoCategoryId() ?? 0);
    }
}
function getBannedCoIdArray(war: BaseWar_Interface_IBwWar.IBwWar, playerIndex: number): number[] | null {
    if (war instanceof AutoTourneys_Wars_War.War) {
        return war.getSettingsForAtw().getDataArrayForBanCo().find(v => (v.getSrcPlayerIndex()) === playerIndex)?.getBannedCoIdArray() ?? [];
    } else if (war instanceof MultiRankWar_Model_MrwWar.MrwWar) {
        return war.getSettingsForMrw().getDataArrayForBanCo().find(v => (v.getSrcPlayerIndex()) === playerIndex)?.getBannedCoIdArray() ?? [];
    } else if (war instanceof MultiMatchWar_Model_MmwWar.MmwWar) {
        return war.getSettingsForMmw().getDataArrayForBanCo().find(v => (v.getSrcPlayerIndex()) === playerIndex)?.getBannedCoIdArray() ?? [];
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        {
            const settingsForAtw = war.getSettingsForAtw();
            if (settingsForAtw) {
                return settingsForAtw.getDataArrayForBanCo().find(v => (v.getSrcPlayerIndex()) === playerIndex)?.getBannedCoIdArray() ?? [];
            }
        }
        {
            const settingsForMrw = war.getSettingsForMrw();
            if (settingsForMrw) {
                return settingsForMrw.getDataArrayForBanCo().find(v => (v.getSrcPlayerIndex()) === playerIndex)?.getBannedCoIdArray() ?? [];
            }
        }
        {
            const settingsForMmw = war.getSettingsForMmw();
            if (settingsForMmw) {
                return settingsForMmw.getDataArrayForBanCo().find(v => (v.getSrcPlayerIndex()) === playerIndex)?.getBannedCoIdArray() ?? [];
            }
        }
        return null;
    } else {
        return null;
    }
}
