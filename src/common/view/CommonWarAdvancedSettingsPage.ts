import {
    Ui_Components_UiPlayerRuleRenderer,
    type GameConfigs_GameConfig,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiList,
    type Ui_Interfaces_IUiScroller,
    type Ui_Interfaces_IUiScrollList,
    Ui_Utils_UiSkinHelpers,
    GameModes_Constants,
    GamePanels_Manager,
    Players_Constants,
    PlayerRules_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Types_UiHorizontalAlign,
    type Ui_Types_UiListItemData,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiOpenableComponent,
    Ui_Types_UiVerticalAlign,
} from "../../internal.ts";
import type { InstanceWarRule } from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";

export type OpenData = {
    canModify       : boolean;
    instanceWarRule : InstanceWarRule;
    gameModeId      : GameModes_Constants.ModeId;
    gcData          : GameConfigs_GameConfig.GameConfig;
} | null;
export class Page extends Ui_Components_UiOpenableComponent.UiOpenableComponent<OpenData> {
    private readonly _scroller!     : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiContainer.IUiContainer>;
    private readonly _btnBatch!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _listPlayer!   : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForPlayerRenderer>;
    private readonly _listTitle!    : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTitleRenderer>;
    private readonly _listInfo!     : Ui_Interfaces_IUiList.IUiList<Ui_Components_UiPlayerRuleRenderer.DataForUiPlayerRuleRenderer>;

    private _isBatch                = false;

    public constructor() {
        super();

        Ui_Utils_UiSkinHelpers.loadSkinByPath(this, "common/CommonWarAdvancedSettingsPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBatch,   callback: this._onTouchedBtnBatch },
        ]);

        this._listTitle.setItemRendererClass(RuleTitleRenderer);
        this._listPlayer.setItemRendererClass(PlayerRenderer);
        this._listInfo.setItemRendererClass(Ui_Components_UiPlayerRuleRenderer.UiPlayerRuleRenderer);
        this._btnBatch.setIsVisible(false);

        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align       : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center },
            width           : { percentage  : 100 },
            height          : { percentage  : 100 },
        });
    }
    protected override _doApplyOpenData(): void | Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listInfo.removeAllItems(),
            this._listPlayer.removeAllItems(),
            this._listTitle.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public getIsBatch(): boolean {
        return this._isBatch;
    }
    private _setIsBatch(isBatch: boolean): void {
        this._isBatch = isBatch;
    }

    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onTouchedBtnBatch(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent          : () => Lang_Utils.getText(Lang_Constants.TextType.A0940),
            callback            : () => {
                this._setIsBatch(true);
                this._updateBtnBatch();
            },
            callbackOnCancel    : () => {
                this._setIsBatch(false);
                this._updateBtnBatch();
            },
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerRuleTypeArray = getPlayerRuleTypeArray(openData.gameModeId);
        this._updateComponentsForLanguage();
        this._updateListPlayer();
        this._updateListTitle(playerRuleTypeArray);
        this._updateListInfo(playerRuleTypeArray);
    }

    private _updateComponentsForLanguage(): void {
        this._updateBtnBatch();
    }

    private async _updateListPlayer(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerRuleArray   = Helpers_Misc.getExisted(openData.instanceWarRule?.getWarRuleCommonData()?.getPlayerRuleList());
        const dataArray         : DataForPlayerRenderer[] = [];
        for (let playerIndex = Players_Constants.PlayerIndex.First; playerIndex <= playerRuleArray.length; ++playerIndex) {
            dataArray.push({
                playerIndex: playerIndex,
            });
        }
        await this._listPlayer.bindData(dataArray);
    }

    private async _updateListTitle(playerRuleTypeArray: PlayerRules_Constants.RuleTypeId[]): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playersCountUnneutral = Helpers_Misc.getExisted(openData.instanceWarRule?.getWarRuleCommonData()?.getPlayerRuleList()).length;
        const rendererWidth         = 150 + playersCountUnneutral * 78;
        const dataArray             : DataForTitleRenderer[] = [];
        for (const playerRuleType of playerRuleTypeArray) {
            dataArray.push({
                playerRuleType  : playerRuleType,
                rendererWidth   : rendererWidth,
            });
        }
        await this._listTitle.bindData(dataArray);
    }

    private async _updateListInfo(playerRuleTypeArray: PlayerRules_Constants.RuleTypeId[]): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const canModify             = openData.canModify;
        const gcData                = openData.gcData;
        const instanceWarRule       = openData.instanceWarRule;
        const gameModeId            = openData.gameModeId;
        const warRuleCommonData     = Helpers_Misc.getExisted(instanceWarRule.getWarRuleCommonData());
        const playerRuleArray       = warRuleCommonData.getPlayerRuleList();
        const playersCountUnneutral = playerRuleArray.length;
        const getIsBatch            = () => this.getIsBatch();
        const dataArray             : Ui_Components_UiPlayerRuleRenderer.DataForUiPlayerRuleRenderer[] = [];
        for (const ruleType of playerRuleTypeArray) {
            for (let playerIndex = Players_Constants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
                dataArray.push({
                    canModify           : canModify,
                    gcData              : gcData,
                    gameModeId          : gameModeId,
                    instanceWarRule     : instanceWarRule,
                    warRuleCommonData   : warRuleCommonData,
                    playerRuleType      : ruleType,
                    playerRule          : Helpers_Misc.getExisted(playerRuleArray.find(v => v.getPlayerIndex() === playerIndex)),
                    getIsBatch          : getIsBatch,
                });
            }
        }

        const list = this._listInfo;
        list.setUnscaledManualWidth(playersCountUnneutral * 78);
        await list.bindData(dataArray);
    }

    private _updateBtnBatch(): void {
        const btn = this._btnBatch;
        if (!this.getOpenData()?.canModify) {
            btn.setIsVisible(false);
        } else {
            btn.setIsVisible(true);
            btn.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1373)}: ${Lang_Utils.getTextForYesOrNo(this.getIsBatch())}`);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// RuleTitleRenderer
////////////////////////////////////////////////////////////////////////////////////////////////////
interface DataForTitleRenderer extends Ui_Types_UiListItemData.UiListItemData {
    playerRuleType  : PlayerRules_Constants.RuleTypeId;
    rendererWidth   : number;
}
class RuleTitleRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForTitleRenderer> {
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!      : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
        ]);
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedBtnHelp(): void {
        const playerRuleType    = this.getOpenData()?.playerRuleType;
        const text              = playerRuleType == null ? null : Lang_Utils.getPlayerRuleHelpText(playerRuleType);
        if (text) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getContent : () => text,
            });
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateView();
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this.setUnscaledManualWidth(openData.rendererWidth);

        const playerRuleType = openData.playerRuleType;
        this._labelName.setText(Lang_Utils.getPlayerRuleName(playerRuleType) ?? Lang_Constants.UndefinedError);
        this._btnHelp.setIsVisible(!!Lang_Utils.getPlayerRuleHelpText(playerRuleType));
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// PlayerRenderer
////////////////////////////////////////////////////////////////////////////////////////////////////
interface DataForPlayerRenderer extends Ui_Types_UiListItemData.UiListItemData {
    playerIndex : number;
}
class PlayerRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _labelPlayerIndex! : Ui_Interfaces_IUiLabel.IUiLabel;

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        this._labelPlayerIndex.setText(`P${openData?.playerIndex}`);
    }
}

function getPlayerRuleTypeArray(gameModeId: GameModes_Constants.ModeId): PlayerRules_Constants.RuleTypeId[] {
    if (gameModeId === GameModes_Constants.ModeId.Versus) {
        return [
            PlayerRules_Constants.RuleTypeId.TeamIndex,
            PlayerRules_Constants.RuleTypeId.BannedCoCategoryIdArray,
            PlayerRules_Constants.RuleTypeId.McwHumanCoCategoryIdArray,
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
            PlayerRules_Constants.RuleTypeId.AttackPowerModifier,
            PlayerRules_Constants.RuleTypeId.DefenseModifier,
            PlayerRules_Constants.RuleTypeId.UnitVisionRangeModifier,
            PlayerRules_Constants.RuleTypeId.TileVisionRangeModifier,
            PlayerRules_Constants.RuleTypeId.LuckLowerLimit,
            PlayerRules_Constants.RuleTypeId.LuckUpperLimit,
        ];
    } else if (gameModeId === GameModes_Constants.ModeId.Coop) {
        return [
            PlayerRules_Constants.RuleTypeId.TeamIndex,
            PlayerRules_Constants.RuleTypeId.BannedCoCategoryIdArray,
            PlayerRules_Constants.RuleTypeId.CcwHumanCoCategoryIdArray,
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
            PlayerRules_Constants.RuleTypeId.AttackPowerModifier,
            PlayerRules_Constants.RuleTypeId.DefenseModifier,
            PlayerRules_Constants.RuleTypeId.UnitVisionRangeModifier,
            PlayerRules_Constants.RuleTypeId.TileVisionRangeModifier,
            PlayerRules_Constants.RuleTypeId.LuckLowerLimit,
            PlayerRules_Constants.RuleTypeId.LuckUpperLimit,
        ];
    } else {
        return [
            PlayerRules_Constants.RuleTypeId.TeamIndex,
            PlayerRules_Constants.RuleTypeId.BannedCoCategoryIdArray,
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
            PlayerRules_Constants.RuleTypeId.AttackPowerModifier,
            PlayerRules_Constants.RuleTypeId.DefenseModifier,
            PlayerRules_Constants.RuleTypeId.UnitVisionRangeModifier,
            PlayerRules_Constants.RuleTypeId.TileVisionRangeModifier,
            PlayerRules_Constants.RuleTypeId.LuckLowerLimit,
            PlayerRules_Constants.RuleTypeId.LuckUpperLimit,
        ];
    }
}
