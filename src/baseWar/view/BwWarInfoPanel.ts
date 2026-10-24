import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../interface/IBwWar.ts";
import * as BootTimersConstants from "../../bootTimers/Constants.ts";
import * as CosConstants from "../../cos/Constants.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GameModesUtils from "../../gameModes/Utils.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as NotificationsDataTypes from "../../notifications/DataTypes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayerRulesConstants from "../../playerRules/Constants.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as SinglePlayerWarModelSpwModel from "../../singlePlayerWar/model/SpwModel.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import * as UiComponentsUiPlayerRuleRenderer from "../../ui/components/UiPlayerRuleRenderer.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiList from "../../ui/interfaces/IUiList.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UsersModel from "../../users/Model.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";

// eslint-disable-next-line no-shadow
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
    PlayerRulesConstants.RuleTypeId.BannedUnitTypeArray,
    PlayerRulesConstants.RuleTypeId.InitialFund,
    PlayerRulesConstants.RuleTypeId.IncomeMultiplier,
    PlayerRulesConstants.RuleTypeId.MaxUnitsCount,
    PlayerRulesConstants.RuleTypeId.EnergyAddPctOnCoBoard,
    PlayerRulesConstants.RuleTypeId.EnergyLossPctOnCoDie,
    PlayerRulesConstants.RuleTypeId.EnergyGrowthMultiplier,
    PlayerRulesConstants.RuleTypeId.CanActivateCoSkill,
    PlayerRulesConstants.RuleTypeId.CanCoBoard,
    PlayerRulesConstants.RuleTypeId.CanUnitJoin,
    PlayerRulesConstants.RuleTypeId.MoveRangeModifier,
    PlayerRulesConstants.RuleTypeId.UnitVisionRangeModifier,
    PlayerRulesConstants.RuleTypeId.TileVisionRangeModifier,
    PlayerRulesConstants.RuleTypeId.AttackPowerModifier,
    PlayerRulesConstants.RuleTypeId.DefenseModifier,
    PlayerRulesConstants.RuleTypeId.LuckLowerLimit,
    PlayerRulesConstants.RuleTypeId.LuckUpperLimit,
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
    war : BaseWarInterfaceIBwWar.IBwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTips!                : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupTopButton!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnSwitch!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnUnits!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnTiles!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnInfo!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;

    private readonly _groupPlayer1!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelPlayerIndex1!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgCo1!                   : UiInterfacesIUiImage.IUiImage;
    private readonly _imgSkin1!                 : UiInterfacesIUiImage.IUiImage;

    private readonly _groupPlayer2!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelPlayerIndex2!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgCo2!                   : UiInterfacesIUiImage.IUiImage;
    private readonly _imgSkin2!                 : UiInterfacesIUiImage.IUiImage;

    private readonly _groupPlayer3!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelPlayerIndex3!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgCo3!                   : UiInterfacesIUiImage.IUiImage;
    private readonly _imgSkin3!                 : UiInterfacesIUiImage.IUiImage;

    private readonly _groupPlayer4!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelPlayerIndex4!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgCo4!                   : UiInterfacesIUiImage.IUiImage;
    private readonly _imgSkin4!                 : UiInterfacesIUiImage.IUiImage;

    private readonly _scroller!                 : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiContainer.IUiContainer>;
    private readonly _listRuleTitle!            : UiInterfacesIUiList.IUiList<DataForRuleTitleRenderer>;
    private readonly _listPlayerInfo1!          : UiInterfacesIUiList.IUiList<DataForInfoRenderer>;
    private readonly _listPlayerInfo2!          : UiInterfacesIUiList.IUiList<DataForInfoRenderer>;
    private readonly _listPlayerInfo3!          : UiInterfacesIUiList.IUiList<DataForInfoRenderer>;
    private readonly _listPlayerInfo4!          : UiInterfacesIUiList.IUiList<DataForInfoRenderer>;
    private readonly _groupRule!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listPlayerRule1!          : UiInterfacesIUiList.IUiList<UiComponentsUiPlayerRuleRenderer.DataForUiPlayerRuleRenderer>;
    private readonly _listPlayerRule2!          : UiInterfacesIUiList.IUiList<UiComponentsUiPlayerRuleRenderer.DataForUiPlayerRuleRenderer>;
    private readonly _listPlayerRule3!          : UiInterfacesIUiList.IUiList<UiComponentsUiPlayerRuleRenderer.DataForUiPlayerRuleRenderer>;
    private readonly _listPlayerRule4!          : UiInterfacesIUiList.IUiList<UiComponentsUiPlayerRuleRenderer.DataForUiPlayerRuleRenderer>;

    private _pageIndex                          = 0;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.BwCoIdChanged,               callback: this._onNotifyBwCoIdChanged },
            { type: NotificationsTypeId.TypeId.BwOverridingSkinIdChanged,   callback: this._onNotifyBwOverridingSkinIdChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnInfo,                callback: this._onTouchedBtnInfo },
            { ui: this._btnSwitch,              callback: this._onTouchedBtnSwitch },
            { ui: this._btnUnits,               callback: this._onTouchedBtnUnits },
            { ui: this._btnTiles,               callback: this._onTouchedBtnTiles },
            { ui: this._groupPlayer1,           callback: this._onTouchedGroupPlayer1 },
            { ui: this._groupPlayer2,           callback: this._onTouchedGroupPlayer2 },
            { ui: this._groupPlayer3,           callback: this._onTouchedGroupPlayer3 },
            { ui: this._groupPlayer4,           callback: this._onTouchedGroupPlayer4 },
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
        this._listPlayerRule1.setItemRendererClass(UiComponentsUiPlayerRuleRenderer.UiPlayerRuleRenderer);
        this._listPlayerRule2.setItemRendererClass(UiComponentsUiPlayerRuleRenderer.UiPlayerRuleRenderer);
        this._listPlayerRule3.setItemRendererClass(UiComponentsUiPlayerRuleRenderer.UiPlayerRuleRenderer);
        this._listPlayerRule4.setItemRendererClass(UiComponentsUiPlayerRuleRenderer.UiPlayerRuleRenderer);
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

        if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
            SinglePlayerWarModelSpwModel.checkAndHandleAutoActionsAndRobotRecursively(war);
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().BwWarExtraInfoPanel, {
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().BwUnitListPanel, {
            war                     : war,
            callbackForMoveCursor   : unit => {
                if ((war.getIsExecutingAction()) || (war.getActionPlanner().checkIsStateRequesting())) {
                    return;
                }

                const gridIndex = unit.getGridIndex();
                const cursor    = war.getCursor();
                cursor.setGridIndex(gridIndex);
                cursor.updateView();
                war.getView().tweenGridToCentralArea(gridIndex);
                war.getGridVisualEffect().showEffectAiming(gridIndex, 800);
                SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
            },
            callbackForSelectUnit   : unit => {
                if ((war.getIsExecutingAction()) || (war.getActionPlanner().checkIsStateRequesting())) {
                    return;
                }

                const gridIndex = unit.getGridIndex();
                war.getCursor().setGridIndex(gridIndex);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwCursorTapped, {
                    current : gridIndex,
                    tappedOn: gridIndex,
                } as NotificationsDataTypes.BwCursorTapped);
                GamePanelsManager.closePanel(GamePanelsDict.getDict().BwUnitListPanel);
            },
        });
        this.closePanel();
    }
    private _onTouchedBtnTiles(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().BwTileStatisticsPanel, {
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonCoListPanel, {
            war         : war,
            playerIndex : playerIndex,
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
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
        if (war instanceof GameHelpersGhFactory.getRwWarClass()) {
            if (war.getSettingsForSrw()) {
                label.setText(`${LangUtils.getText(LangConstants.TextType.B1115)}`);
            } else {
                label.setText(`${LangUtils.getText(LangConstants.TextType.B0710)} #${war.getReplayId()}`);
            }
        } else {
            const warId = war.getWarId();
            label.setText(warId == null
                ? LangUtils.getText(LangConstants.TextType.B0223)
                : `${LangUtils.getText(LangConstants.TextType.B0719)} #${warId}`
            );
        }
    }

    private _updateLabelTips(): void {
        const war = this.getOpenData()?.war;
        this._labelTips.setText((war instanceof GameHelpersGhFactory.getScwWarClass()) || (war instanceof GameHelpersGhFactory.getSfwWarClass())
            ? LangUtils.getText(LangConstants.TextType.A0998)
            : ``
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
                index       : index++,
                infoType    : playerRuleType,
                war         : war,
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

    private _updateGroupPlayer(playerIndex: number, group: UiInterfacesIUiContainer.IUiContainer, labelPlayerIndex: UiInterfacesIUiLabel.IUiLabel, imgSkin: UiInterfacesIUiImage.IUiImage, imgCo: UiInterfacesIUiImage.IUiImage): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getPlayersCountUnneutral() < playerIndex) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);

            const player = war.getPlayer(playerIndex);
            imgSkin.loadSource(HelpersImageSource.getCoEyeBackground(ForceSkinsUtils.getFinalSkinId(war, playerIndex)));
            imgCo.loadSource(HelpersImageSource.getCoEye(war.getGcData(), player.getCoId(), player.getAliveState() !== PlayersConstants.AliveStateId.Dead) ?? LangConstants.UndefinedError);
            labelPlayerIndex.setText(`P${playerIndex}`);
        }
    }

    private async _updateListPlayerInfo(playerIndex: number, list: UiInterfacesIUiList.IUiList<DataForInfoRenderer>, infoTypeArray: InfoType[]): Promise<void> {
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
                    war             : war,
                    infoType        : infoType,
                    playerIndex     : playerIndex,
                });
            }
            await list.bindData(dataArray);
        }
    }

    private async _updateListPlayerRule(playerIndex: number, list: UiInterfacesIUiList.IUiList<UiComponentsUiPlayerRuleRenderer.DataForUiPlayerRuleRenderer>): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getPlayersCountUnneutral() < playerIndex) {
            await list.removeAllItems();
        } else {
            const canModify         = war.getCanCheat();
            const gcData            = war.getGcData();
            const gameModeId        = GameModesUtils.getEnum(war.getWarType());
            const warRuleCommonData = HelpersMisc.getExisted(war.getCommonSettingManager().getInstanceWarRule().getWarRuleCommonData());
            const playerRule        = HelpersMisc.getExisted(warRuleCommonData.getPlayerRuleList().find(v => v.getPlayerIndex() === playerIndex));
            const getIsBatch        = () => false;
            const dataArray         : UiComponentsUiPlayerRuleRenderer.DataForUiPlayerRuleRenderer[] = [];
            for (const playerRuleType of CommonPlayerRuleTypes) {
                dataArray.push({
                    canModify               : canModify,
                    gcData                  : gcData,
                    gameModeId              : gameModeId,
                    instanceWarRule         : null,
                    warRuleCommonData       : warRuleCommonData,
                    playerRule              : playerRule,
                    playerRuleType          : playerRuleType,
                    getIsBatch              : getIsBatch,
                });
            }
            await list.bindData(dataArray);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// RuleTitleRenderer
////////////////////////////////////////////////////////////////////////////////////////////////////
interface DataForRuleTitleRenderer extends UiTypesUiListItemData.UiListItemData {
    index       : number;
    infoType    : InfoType;
    war         : BaseWarInterfaceIBwWar.IBwWar;
}
class RuleTitleRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForRuleTitleRenderer> {
    private readonly _imgBg!        : UiInterfacesIUiImage.IUiImage;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupHelp!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgHelp!      : UiInterfacesIUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupHelp,                  callback: this._onTouchedGroupHelp },
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
        this._labelName.setText(getInfoTypeName(infoType) ?? LangConstants.UndefinedError);
        this._imgHelp.setIsVisible(infoType === InfoType.BannedCo);
    }

    private _onTouchedGroupHelpForBannedCo(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const gameConfig    = war.getGcData();
        const dict          = new Map<number, number[]>();
        for (const [playerIndex] of war.getPlayerManager().getAllPlayersDict()) {
            if (playerIndex === PlayersConstants.PlayerIndex.Neutral) {
                continue;
            }

            dict.set(playerIndex, getBannedCoCategoryIdArray(war, playerIndex) ?? []);
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowSelectedCoCategoryIdPanel, {
            selectedCoCategoryIdDict    : dict,
            availableCoCategoryIdArray  : gameConfig.getEnabledCoCategoryIdArray(war.getWarType()),
            isBan                       : true,
            gameConfig                  : gameConfig,
        });
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// InfoRenderer
////////////////////////////////////////////////////////////////////////////////////////////////////
interface DataForInfoRenderer extends UiTypesUiListItemData.UiListItemData {
    war                 : BaseWarInterfaceIBwWar.IBwWar;
    infoType            : InfoType;
    playerIndex         : number;
}
class InfoRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
    private readonly _layoutValue!  : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnModify!    : UiInterfacesIUiButton.IUiButton;
    private readonly _labelValue!   : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnModify,          callback: this._onTouchedBtnModify },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.TimeTick,    callback: this._onNotifyTimeTick },
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
            default                     : throw HelpersMisc.newError(`Invalid infoType: ${infoType}`, UtilsClientErrorCode.ClientErrorCode.BwWarInfoPanel_InfoRenderer_OnTouchedBtnModify_00);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => isHuman ? LangUtils.getText(LangConstants.TextType.A0110) : LangUtils.getText(LangConstants.TextType.A0111),
            callback: () => {
                player.setUserId(isHuman ? null : UsersModel.getSelfUserId());
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils.getFormattedText(LangConstants.TextType.F0072, playerIndex),
            callback: () => {
                const warRuleCommonData = HelpersMisc.getExisted(war.getInstanceWarRule().getWarRuleCommonData());
                const playerRule        = WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleCoIdPanel, {
            gameConfig          : gameConfig,
            currentCoId         : currentCoId,
            availableCoIdArray  : gameConfig.getEnabledCoArray(war.getWarType()).map(v => v.getCoId()),
            isBan               : false,
            callbackOnConfirm   : newCoId => {
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowCoCategoryIdPanel, {
            gameConfig                      : gameConfig,
            availableCoCategoryIdArray      : gameConfig.getAllEnabledCoCategoryIdArray(),
            currentCoCategoryIdArray        : getBannedCoCategoryIdArray(war, playerIndex),
            isBan                           : true,
            getTitleText                    : () => `${LangUtils.getText(LangConstants.TextType.B0403)} (P${playerIndex})`,
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => `P${playerIndex} ${LangUtils.getText(LangConstants.TextType.B0033)}`,
            currentValue    : currValue,
            minValue        : CosConstants.EnergyHardLimit.Min,
            maxValue        : CosConstants.EnergyHardLimit.Max,
            callback        : value => {
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
        const maxValue              = PlayerRulesConstants.InitialFund.MaxLimit;
        const minValue              = PlayerRulesConstants.InitialFund.MinLimit;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle           : () => `P${player.getPlayerIndex()} ${LangUtils.getText(LangConstants.TextType.Fund)}`,
            currentValue    : currValue,
            minValue,
            maxValue,
            callback        : value => {
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
            default                             : throw HelpersMisc.newError(`Invalid infoType: ${infoType}`, UtilsClientErrorCode.ClientErrorCode.BwWarInfoPanel_InfoRenderer_UpdateView_00);
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
            ? LangUtils.getText(LangConstants.TextType.B0607)
            : HelpersMisc.getExisted(await UsersModel.getUserNickname(userId), UtilsClientErrorCode.ClientErrorCode.BwWarInfoPanel_InfoRenderer_UpdateViewAsPlayer_00)
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
        labelValue.setText(LangUtils.getPlayerTeamName(teamIndex) ?? LangConstants.UndefinedError);
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
        labelValue.setText(war.getGcData().getCoNameAndTierText(war.getPlayer(openData.playerIndex).getCoId()) ?? LangConstants.UndefinedError);
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
            const textForAddTime    = params[0] === BootTimersConstants.TimerTypeId.Incremental
                ? `(+${params[2] * war.getUnitMap().getAllUnits().filter(v => v.getPlayerIndex() === playerIndex).length + (params[3] ?? 0)}s)`
                : ``;

            label.setText(`${LangUtils.getTimeDurationText2(restTime)}${textForAddTime}`);
            label.setTextColor(restTime >= 30 * 60
                ? 0xFFFFFF
                : (restTime >= 5 * 60 ? 0xFFFF00 : 0xFF4400)
            );
        }

        this._btnModify.setIsVisible(false);
        this._layoutValue.arrangeItems();
    }
}

function getInfoTypesForTitleList(war: AuxiliaryTypesAuxiliaryTypes.Undefinable<BaseWarInterfaceIBwWar.IBwWar>): InfoType[] {
    if (war == null) {
        return [];
    }

    return [
        ...getInfoTypesForInfoList(war),
        ...CommonInfoTypes,
    ];
}
function getInfoTypesForInfoList(war: AuxiliaryTypesAuxiliaryTypes.Undefinable<BaseWarInterfaceIBwWar.IBwWar>): InfoType[] {
    if (war == null) {
        return [];
    }

    if (getBannedCoCategoryIdArray(war, PlayersConstants.PlayerIndex.First)) {
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
        case InfoType.Player                    : return LangUtils.getText(LangConstants.TextType.B0031);
        case InfoType.TeamIndex                 : return LangUtils.getText(LangConstants.TextType.B0019);
        case InfoType.Co                        : return LangUtils.getText(LangConstants.TextType.B0425);
        case InfoType.BannedCo                  : return LangUtils.getText(LangConstants.TextType.B0403);
        case InfoType.Energy                    : return LangUtils.getText(LangConstants.TextType.B0033);
        case InfoType.CurrentFund               : return LangUtils.getText(LangConstants.TextType.Fund);
        case InfoType.BuildingsAndIncome        : return LangUtils.getText(LangConstants.TextType.B0689);
        case InfoType.UnitsAndValue             : return LangUtils.getText(LangConstants.TextType.B0688);
        case InfoType.TimeLimit                 : return LangUtils.getText(LangConstants.TextType.B0021);
        case InfoType.BannedUnitTypeArray       : return LangUtils.getPlayerRuleName(PlayerRulesConstants.RuleTypeId.BannedUnitTypeArray);
        case InfoType.InitialFund               : return LangUtils.getPlayerRuleName(PlayerRulesConstants.RuleTypeId.InitialFund);
        case InfoType.IncomeMultiplier          : return LangUtils.getPlayerRuleName(PlayerRulesConstants.RuleTypeId.IncomeMultiplier);
        case InfoType.MaxUnitsCount             : return LangUtils.getPlayerRuleName(PlayerRulesConstants.RuleTypeId.MaxUnitsCount);
        case InfoType.EnergyAddPctOnCoBoard     : return LangUtils.getPlayerRuleName(PlayerRulesConstants.RuleTypeId.EnergyAddPctOnCoBoard);
        case InfoType.EnergyLossPctOnCoDie      : return LangUtils.getPlayerRuleName(PlayerRulesConstants.RuleTypeId.EnergyLossPctOnCoDie);
        case InfoType.EnergyGrowthMultiplier    : return LangUtils.getPlayerRuleName(PlayerRulesConstants.RuleTypeId.EnergyGrowthMultiplier);
        case InfoType.CanActivateCoSkill        : return LangUtils.getPlayerRuleName(PlayerRulesConstants.RuleTypeId.CanActivateCoSkill);
        case InfoType.CanCoBoard                : return LangUtils.getPlayerRuleName(PlayerRulesConstants.RuleTypeId.CanCoBoard);
        case InfoType.CanUnitJoin               : return LangUtils.getPlayerRuleName(PlayerRulesConstants.RuleTypeId.CanUnitJoin);
        case InfoType.MoveRangeModifier         : return LangUtils.getPlayerRuleName(PlayerRulesConstants.RuleTypeId.MoveRangeModifier);
        case InfoType.UnitVisionRangeModifier   : return LangUtils.getPlayerRuleName(PlayerRulesConstants.RuleTypeId.UnitVisionRangeModifier);
        case InfoType.TileVisionRangeModifier   : return LangUtils.getPlayerRuleName(PlayerRulesConstants.RuleTypeId.TileVisionRangeModifier);
        case InfoType.AttackPowerModifier       : return LangUtils.getPlayerRuleName(PlayerRulesConstants.RuleTypeId.AttackPowerModifier);
        case InfoType.DefenseModifier           : return LangUtils.getPlayerRuleName(PlayerRulesConstants.RuleTypeId.DefenseModifier);
        case InfoType.LuckLowerLimit            : return LangUtils.getPlayerRuleName(PlayerRulesConstants.RuleTypeId.LuckLowerLimit);
        case InfoType.LuckUpperLimit            : return LangUtils.getPlayerRuleName(PlayerRulesConstants.RuleTypeId.LuckUpperLimit);
        default                                 : return null;
    }
}
function checkCanModifyPlayerInfo(war: BaseWarInterfaceIBwWar.IBwWar): boolean {
    const warType = war.getWarType();
    return (warType === WarTypesConstants.WarTypeId.ScwFog)
        || (warType === WarTypesConstants.WarTypeId.ScwStd)
        || (warType === WarTypesConstants.WarTypeId.SfwFog)
        || (warType === WarTypesConstants.WarTypeId.SfwStd);
}
function getBannedCoCategoryIdArray(war: BaseWarInterfaceIBwWar.IBwWar, playerIndex: number): number[] | null {
    const bannedCoIdArray = getBannedCoIdArray(war, playerIndex);
    if (bannedCoIdArray == null) {
        return null;
    } else {
        const gameConfig = war.getGcData();
        return bannedCoIdArray.map(v => gameConfig.getCoBasicCfg(v)?.getCoCategoryId() ?? 0);
    }
}
function getBannedCoIdArray(war: BaseWarInterfaceIBwWar.IBwWar, playerIndex: number): number[] | null {
    if (war instanceof GameHelpersGhFactory.getAtwWarClass()) {
        return war.getSettingsForAtw().getDataArrayForBanCo().find(v => (v.getSrcPlayerIndex() ?? 0) === playerIndex)?.getBannedCoIdArray() ?? [];
    } else if (war instanceof GameHelpersGhFactory.getMrwWarClass()) {
        return war.getSettingsForMrw().getDataArrayForBanCo().find(v => (v.getSrcPlayerIndex() ?? 0) === playerIndex)?.getBannedCoIdArray() ?? [];
    } else if (war instanceof GameHelpersGhFactory.getMmwWarClass()) {
        return war.getSettingsForMmw().getDataArrayForBanCo().find(v => (v.getSrcPlayerIndex() ?? 0) === playerIndex)?.getBannedCoIdArray() ?? [];
    } else if (war instanceof GameHelpersGhFactory.getRwWarBaseClass()) {
        {
            const settingsForAtw = war.getSettingsForAtw();
            if (settingsForAtw) {
                return settingsForAtw.getDataArrayForBanCo().find(v => (v.getSrcPlayerIndex() ?? 0) === playerIndex)?.getBannedCoIdArray() ?? [];
            }
        }
        {
            const settingsForMrw = war.getSettingsForMrw();
            if (settingsForMrw) {
                return settingsForMrw.getDataArrayForBanCo().find(v => (v.getSrcPlayerIndex() ?? 0) === playerIndex)?.getBannedCoIdArray() ?? [];
            }
        }
        {
            const settingsForMmw = war.getSettingsForMmw();
            if (settingsForMmw) {
                return settingsForMmw.getDataArrayForBanCo().find(v => (v.getSrcPlayerIndex() ?? 0) === playerIndex)?.getBannedCoIdArray() ?? [];
            }
        }
        return null;
    } else {
        return null;
    }
}
