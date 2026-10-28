import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../interface/IBwWar.ts";
import { TimerTypeId } from "../../bootTimers/Constants.ts";
import { EnergyHardLimit } from "../../cos/Constants.ts";
import { getFinalSkinId } from "../../forceSkins/Utils.ts";
import {
    getSpwWarClass,
    getRwWarClass,
    getScwWarClass,
    getSfwWarClass,
    getAtwWarClass,
    getMrwWarClass,
    getMmwWarClass,
    getRwWarBaseClass,
} from "../../gameHelpers/GhFactory.ts";
import { getEnum } from "../../gameModes/Utils.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel, closePanel } from "../../gamePanels/Manager.ts";
import { getCoEyeBackground, getCoEye } from "../../helpers/ImageSource.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getFormattedText, getPlayerTeamName, getTimeDurationText2, getPlayerRuleName } from "../../lang/Utils.ts";
import type { BwCursorTapped } from "../../notifications/DataTypes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { RuleTypeId, InitialFund } from "../../playerRules/Constants.ts";
import { AliveStateId, PlayerIndex } from "../../players/Constants.ts";
import { checkAndHandleAutoActionsAndRobotRecursively } from "../../singlePlayerWar/model/SpwModel.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import { type DataForUiPlayerRuleRenderer, UiPlayerRuleRenderer } from "../../ui/components/UiPlayerRuleRenderer.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiList } from "../../ui/interfaces/IUiList.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { getSelfUserId, getUserNickname } from "../../users/Model.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { getPlayerRule } from "../../warRules/utils/CommonData.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";

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
    RuleTypeId.BannedUnitTypeArray,
    RuleTypeId.InitialFund,
    RuleTypeId.IncomeMultiplier,
    RuleTypeId.MaxUnitsCount,
    RuleTypeId.EnergyAddPctOnCoBoard,
    RuleTypeId.EnergyLossPctOnCoDie,
    RuleTypeId.EnergyGrowthMultiplier,
    RuleTypeId.CanActivateCoSkill,
    RuleTypeId.CanCoBoard,
    RuleTypeId.CanUnitJoin,
    RuleTypeId.MoveRangeModifier,
    RuleTypeId.UnitVisionRangeModifier,
    RuleTypeId.TileVisionRangeModifier,
    RuleTypeId.AttackPowerModifier,
    RuleTypeId.DefenseModifier,
    RuleTypeId.LuckLowerLimit,
    RuleTypeId.LuckUpperLimit,
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
    war : IBwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _group!                    : IUiContainer;
    private readonly _labelTitle!               : IUiLabel;
    private readonly _labelTips!                : IUiLabel;

    private readonly _groupTopButton!           : IUiLayout;
    private readonly _btnSwitch!                : IUiButton;
    private readonly _btnUnits!                 : IUiButton;
    private readonly _btnTiles!                 : IUiButton;
    private readonly _btnInfo!                  : IUiButton;
    private readonly _btnClose!                 : IUiButton;

    private readonly _groupPlayer1!             : IUiContainer;
    private readonly _labelPlayerIndex1!        : IUiLabel;
    private readonly _imgCo1!                   : IUiImage;
    private readonly _imgSkin1!                 : IUiImage;

    private readonly _groupPlayer2!             : IUiContainer;
    private readonly _labelPlayerIndex2!        : IUiLabel;
    private readonly _imgCo2!                   : IUiImage;
    private readonly _imgSkin2!                 : IUiImage;

    private readonly _groupPlayer3!             : IUiContainer;
    private readonly _labelPlayerIndex3!        : IUiLabel;
    private readonly _imgCo3!                   : IUiImage;
    private readonly _imgSkin3!                 : IUiImage;

    private readonly _groupPlayer4!             : IUiContainer;
    private readonly _labelPlayerIndex4!        : IUiLabel;
    private readonly _imgCo4!                   : IUiImage;
    private readonly _imgSkin4!                 : IUiImage;

    private readonly _scroller!                 : IUiScroller<IUiContainer>;
    private readonly _listRuleTitle!            : IUiList<DataForRuleTitleRenderer>;
    private readonly _listPlayerInfo1!          : IUiList<DataForInfoRenderer>;
    private readonly _listPlayerInfo2!          : IUiList<DataForInfoRenderer>;
    private readonly _listPlayerInfo3!          : IUiList<DataForInfoRenderer>;
    private readonly _listPlayerInfo4!          : IUiList<DataForInfoRenderer>;
    private readonly _groupRule!                : IUiContainer;
    private readonly _listPlayerRule1!          : IUiList<DataForUiPlayerRuleRenderer>;
    private readonly _listPlayerRule2!          : IUiList<DataForUiPlayerRuleRenderer>;
    private readonly _listPlayerRule3!          : IUiList<DataForUiPlayerRuleRenderer>;
    private readonly _listPlayerRule4!          : IUiList<DataForUiPlayerRuleRenderer>;

    private _pageIndex                          = 0;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.BwCoIdChanged,               callback: this._onNotifyBwCoIdChanged },
            { type: TypeId.BwOverridingSkinIdChanged,   callback: this._onNotifyBwOverridingSkinIdChanged },
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
        this._listPlayerRule1.setItemRendererClass(UiPlayerRuleRenderer);
        this._listPlayerRule2.setItemRendererClass(UiPlayerRuleRenderer);
        this._listPlayerRule3.setItemRendererClass(UiPlayerRuleRenderer);
        this._listPlayerRule4.setItemRendererClass(UiPlayerRuleRenderer);
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

        if (war instanceof getSpwWarClass()) {
            checkAndHandleAutoActionsAndRobotRecursively(war);
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

        openPanel(getDict().BwWarExtraInfoPanel, {
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

        openPanel(getDict().BwUnitListPanel, {
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
                playShortSfx(ShortSfxCode.ButtonNeutral01);
            },
            callbackForSelectUnit   : unit => {
                if ((war.getIsExecutingAction()) || (war.getActionPlanner().checkIsStateRequesting())) {
                    return;
                }

                const gridIndex = unit.getGridIndex();
                war.getCursor().setGridIndex(gridIndex);
                dispatch(TypeId.BwCursorTapped, {
                    current : gridIndex,
                    tappedOn: gridIndex,
                } as BwCursorTapped);
                closePanel(getDict().BwUnitListPanel);
            },
        });
        this.closePanel();
    }
    private _onTouchedBtnTiles(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().BwTileStatisticsPanel, {
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

        openPanel(getDict().CommonCoListPanel, {
            war         : war,
            playerIndex : playerIndex,
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
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
        if (war instanceof getRwWarClass()) {
            if (war.getSettingsForSrw()) {
                label.setLangText(TextType.B1115);
            } else {
                label.setText(`${getText(TextType.B0710)} #${war.getReplayId()}`);
            }
        } else {
            const warId = war.getWarId();
            label.setText(warId == null
                ? getText(TextType.B0223)
                : `${getText(TextType.B0719)} #${warId}`
            );
        }
    }

    private _updateLabelTips(): void {
        const war = this.getOpenData()?.war;
        this._labelTips.setText((war instanceof getScwWarClass()) || (war instanceof getSfwWarClass())
            ? getText(TextType.A0998)
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

    private _updateGroupPlayer(playerIndex: number, group: IUiContainer, labelPlayerIndex: IUiLabel, imgSkin: IUiImage, imgCo: IUiImage): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getPlayersCountUnneutral() < playerIndex) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);

            const player = war.getPlayer(playerIndex);
            imgSkin.loadSource(getCoEyeBackground(getFinalSkinId(war, playerIndex)));
            imgCo.loadSource(getCoEye(war.getGcData(), player.getCoId(), player.getAliveState() !== AliveStateId.Dead) ?? UndefinedError);
            labelPlayerIndex.setText(`P${playerIndex}`);
        }
    }

    private async _updateListPlayerInfo(playerIndex: number, list: IUiList<DataForInfoRenderer>, infoTypeArray: InfoType[]): Promise<void> {
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

    private async _updateListPlayerRule(playerIndex: number, list: IUiList<DataForUiPlayerRuleRenderer>): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war.getPlayersCountUnneutral() < playerIndex) {
            await list.removeAllItems();
        } else {
            const canModify         = war.getCanCheat();
            const gcData            = war.getGcData();
            const gameModeId        = getEnum(war.getWarType());
            const warRuleCommonData = getExisted(war.getCommonSettingManager().getInstanceWarRule().getWarRuleCommonData());
            const playerRule        = getExisted(warRuleCommonData.getPlayerRuleList().find(v => v.getPlayerIndex() === playerIndex));
            const getIsBatch        = () => false;
            const dataArray         : DataForUiPlayerRuleRenderer[] = [];
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
interface DataForRuleTitleRenderer extends UiListItemData {
    index       : number;
    infoType    : InfoType;
    war         : IBwWar;
}
class RuleTitleRenderer extends UiListItemRenderer<DataForRuleTitleRenderer> {
    private readonly _imgBg!        : IUiImage;
    private readonly _labelName!    : IUiLabel;
    private readonly _groupHelp!    : IUiContainer;
    private readonly _imgHelp!      : IUiImage;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
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
        this._labelName.setText(getInfoTypeName(infoType) ?? UndefinedError);
        this._imgHelp.setIsVisible(infoType === InfoType.BannedCo);
    }

    private _onTouchedGroupHelpForBannedCo(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const gameConfig    = war.getGcData();
        const dict          = new Map<number, number[]>();
        for (const [playerIndex] of war.getPlayerManager().getAllPlayersDict()) {
            if (playerIndex === PlayerIndex.Neutral) {
                continue;
            }

            dict.set(playerIndex, getBannedCoCategoryIdArray(war, playerIndex) ?? []);
        }

        openPanel(getDict().CommonShowSelectedCoCategoryIdPanel, {
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
interface DataForInfoRenderer extends UiListItemData {
    war                 : IBwWar;
    infoType            : InfoType;
    playerIndex         : number;
}
class InfoRenderer extends UiListItemRenderer<DataForInfoRenderer> {
    private readonly _layoutValue!  : IUiLayout;
    private readonly _btnModify!    : IUiButton;
    private readonly _labelValue!   : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnModify,          callback: this._onTouchedBtnModify },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.TimeTick,    callback: this._onNotifyTimeTick },
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
            default                     : throw newError(`Invalid infoType: ${infoType}`, ClientErrorCode.BwWarInfoPanel_InfoRenderer_OnTouchedBtnModify_00);
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
        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => isHuman ? getText(TextType.A0110) : getText(TextType.A0111),
            callback: () => {
                player.setUserId(isHuman ? null : getSelfUserId());
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
        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getFormattedText(TextType.F0072, playerIndex),
            callback: () => {
                const warRuleCommonData = getExisted(war.getInstanceWarRule().getWarRuleCommonData());
                const playerRule        = getPlayerRule(warRuleCommonData, playerIndex);
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
        openPanel(getDict().CommonChooseSingleCoIdPanel, {
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
        openPanel(getDict().CommonShowCoCategoryIdPanel, {
            gameConfig                      : gameConfig,
            availableCoCategoryIdArray      : gameConfig.getAllEnabledCoCategoryIdArray(),
            currentCoCategoryIdArray        : getBannedCoCategoryIdArray(war, playerIndex),
            isBan                           : true,
            getTitleText                    : () => `${getText(TextType.B0403)} (P${playerIndex})`,
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
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => `P${playerIndex} ${getText(TextType.B0033)}`,
            currentValue    : currValue,
            minValue        : EnergyHardLimit.Min,
            maxValue        : EnergyHardLimit.Max,
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
        const maxValue              = InitialFund.MaxLimit;
        const minValue              = InitialFund.MinLimit;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle           : () => `P${player.getPlayerIndex()} ${getText(TextType.Fund)}`,
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
            default                             : throw newError(`Invalid infoType: ${infoType}`, ClientErrorCode.BwWarInfoPanel_InfoRenderer_UpdateView_00);
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
            ? getText(TextType.B0607)
            : getExisted(await getUserNickname(userId), ClientErrorCode.BwWarInfoPanel_InfoRenderer_UpdateViewAsPlayer_00)
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
        labelValue.setText(getPlayerTeamName(teamIndex) ?? UndefinedError);
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
        labelValue.setText(war.getGcData().getCoNameAndTierText(war.getPlayer(openData.playerIndex).getCoId()) ?? UndefinedError);
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
            const textForAddTime    = params[0] === TimerTypeId.Incremental
                ? `(+${params[2] * war.getUnitMap().getAllUnits().filter(v => v.getPlayerIndex() === playerIndex).length + (params[3] ?? 0)}s)`
                : ``;

            label.setText(`${getTimeDurationText2(restTime)}${textForAddTime}`);
            label.setTextColor(restTime >= 30 * 60
                ? 0xFFFFFF
                : (restTime >= 5 * 60 ? 0xFFFF00 : 0xFF4400)
            );
        }

        this._btnModify.setIsVisible(false);
        this._layoutValue.arrangeItems();
    }
}

function getInfoTypesForTitleList(war: Undefinable<IBwWar>): InfoType[] {
    if (war == null) {
        return [];
    }

    return [
        ...getInfoTypesForInfoList(war),
        ...CommonInfoTypes,
    ];
}
function getInfoTypesForInfoList(war: Undefinable<IBwWar>): InfoType[] {
    if (war == null) {
        return [];
    }

    if (getBannedCoCategoryIdArray(war, PlayerIndex.First)) {
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
        case InfoType.Player                    : return getText(TextType.B0031);
        case InfoType.TeamIndex                 : return getText(TextType.B0019);
        case InfoType.Co                        : return getText(TextType.B0425);
        case InfoType.BannedCo                  : return getText(TextType.B0403);
        case InfoType.Energy                    : return getText(TextType.B0033);
        case InfoType.CurrentFund               : return getText(TextType.Fund);
        case InfoType.BuildingsAndIncome        : return getText(TextType.B0689);
        case InfoType.UnitsAndValue             : return getText(TextType.B0688);
        case InfoType.TimeLimit                 : return getText(TextType.B0021);
        case InfoType.BannedUnitTypeArray       : return getPlayerRuleName(RuleTypeId.BannedUnitTypeArray);
        case InfoType.InitialFund               : return getPlayerRuleName(RuleTypeId.InitialFund);
        case InfoType.IncomeMultiplier          : return getPlayerRuleName(RuleTypeId.IncomeMultiplier);
        case InfoType.MaxUnitsCount             : return getPlayerRuleName(RuleTypeId.MaxUnitsCount);
        case InfoType.EnergyAddPctOnCoBoard     : return getPlayerRuleName(RuleTypeId.EnergyAddPctOnCoBoard);
        case InfoType.EnergyLossPctOnCoDie      : return getPlayerRuleName(RuleTypeId.EnergyLossPctOnCoDie);
        case InfoType.EnergyGrowthMultiplier    : return getPlayerRuleName(RuleTypeId.EnergyGrowthMultiplier);
        case InfoType.CanActivateCoSkill        : return getPlayerRuleName(RuleTypeId.CanActivateCoSkill);
        case InfoType.CanCoBoard                : return getPlayerRuleName(RuleTypeId.CanCoBoard);
        case InfoType.CanUnitJoin               : return getPlayerRuleName(RuleTypeId.CanUnitJoin);
        case InfoType.MoveRangeModifier         : return getPlayerRuleName(RuleTypeId.MoveRangeModifier);
        case InfoType.UnitVisionRangeModifier   : return getPlayerRuleName(RuleTypeId.UnitVisionRangeModifier);
        case InfoType.TileVisionRangeModifier   : return getPlayerRuleName(RuleTypeId.TileVisionRangeModifier);
        case InfoType.AttackPowerModifier       : return getPlayerRuleName(RuleTypeId.AttackPowerModifier);
        case InfoType.DefenseModifier           : return getPlayerRuleName(RuleTypeId.DefenseModifier);
        case InfoType.LuckLowerLimit            : return getPlayerRuleName(RuleTypeId.LuckLowerLimit);
        case InfoType.LuckUpperLimit            : return getPlayerRuleName(RuleTypeId.LuckUpperLimit);
        default                                 : return null;
    }
}
function checkCanModifyPlayerInfo(war: IBwWar): boolean {
    const warType = war.getWarType();
    return (warType === WarTypeId.ScwFog)
        || (warType === WarTypeId.ScwStd)
        || (warType === WarTypeId.SfwFog)
        || (warType === WarTypeId.SfwStd);
}
function getBannedCoCategoryIdArray(war: IBwWar, playerIndex: number): number[] | null {
    const bannedCoIdArray = getBannedCoIdArray(war, playerIndex);
    if (bannedCoIdArray == null) {
        return null;
    } else {
        const gameConfig = war.getGcData();
        return bannedCoIdArray.map(v => gameConfig.getCoBasicCfg(v)?.getCoCategoryId() ?? 0);
    }
}
function getBannedCoIdArray(war: IBwWar, playerIndex: number): number[] | null {
    if (war instanceof getAtwWarClass()) {
        return war.getSettingsForAtw().getDataArrayForBanCo().find(v => (v.getSrcPlayerIndex()) === playerIndex)?.getBannedCoIdArray() ?? [];
    } else if (war instanceof getMrwWarClass()) {
        return war.getSettingsForMrw().getDataArrayForBanCo().find(v => (v.getSrcPlayerIndex()) === playerIndex)?.getBannedCoIdArray() ?? [];
    } else if (war instanceof getMmwWarClass()) {
        return war.getSettingsForMmw().getDataArrayForBanCo().find(v => (v.getSrcPlayerIndex()) === playerIndex)?.getBannedCoIdArray() ?? [];
    } else if (war instanceof getRwWarBaseClass()) {
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
