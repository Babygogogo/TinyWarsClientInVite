import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameModesConstants from "../../gameModes/Constants.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayerRulesConstants from "../../playerRules/Constants.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoWarRuleInstanceWarRule from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiOpenableComponent from "../../ui/components/UiOpenableComponent.ts";
import * as UiComponentsUiPlayerRuleRenderer from "../../ui/components/UiPlayerRuleRenderer.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiList from "../../ui/interfaces/IUiList.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import * as UiTypesUiHorizontalAlign from "../../ui/types/UiHorizontalAlign.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UiTypesUiVerticalAlign from "../../ui/types/UiVerticalAlign.ts";
import * as UiUtilsUiSkinHelpers from "../../ui/utils/UiSkinHelpers.ts";

type GcData                 = GameConfigGcData.GcData;

export type OpenData = {
    canModify       : boolean;
    instanceWarRule : ProtoSchemaCommonProtoWarRuleInstanceWarRule.InstanceWarRule;
    gameModeId      : GameModesConstants.ModeId;
    gcData          : GcData;
} | null;
export class Page extends UiComponentsUiOpenableComponent.UiOpenableComponent<OpenData> {
    private readonly _scroller!     : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiContainer.IUiContainer>;
    private readonly _btnBatch!     : UiInterfacesIUiButton.IUiButton;
    private readonly _listPlayer!   : UiInterfacesIUiScrollList.IUiScrollList<DataForPlayerRenderer>;
    private readonly _listTitle!    : UiInterfacesIUiScrollList.IUiScrollList<DataForTitleRenderer>;
    private readonly _listInfo!     : UiInterfacesIUiList.IUiList<UiComponentsUiPlayerRuleRenderer.DataForUiPlayerRuleRenderer>;

    private _isBatch                = false;

    public constructor() {
        super();

        UiUtilsUiSkinHelpers.loadSkinByPath(this, "common/CommonWarAdvancedSettingsPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBatch,   callback: this._onTouchedBtnBatch },
        ]);

        this._listTitle.setItemRendererClass(RuleTitleRenderer);
        this._listPlayer.setItemRendererClass(PlayerRenderer);
        this._listInfo.setItemRendererClass(UiComponentsUiPlayerRuleRenderer.UiPlayerRuleRenderer);
        this._btnBatch.setIsVisible(false);

        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiTypesUiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiTypesUiHorizontalAlign.UiHorizontalAlign.Center },
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent          : () => LangUtils.getText(LangConstants.TextType.A0940),
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

        const playerRuleArray   = HelpersMisc.getExisted(openData.instanceWarRule?.getWarRuleCommonData()?.getPlayerRuleList());
        const dataArray         : DataForPlayerRenderer[] = [];
        for (let playerIndex = PlayersConstants.PlayerIndex.First; playerIndex <= playerRuleArray.length; ++playerIndex) {
            dataArray.push({
                playerIndex: playerIndex,
            });
        }
        await this._listPlayer.bindData(dataArray);
    }

    private async _updateListTitle(playerRuleTypeArray: PlayerRulesConstants.RuleTypeId[]): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playersCountUnneutral = HelpersMisc.getExisted(openData.instanceWarRule?.getWarRuleCommonData()?.getPlayerRuleList()).length;
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

    private async _updateListInfo(playerRuleTypeArray: PlayerRulesConstants.RuleTypeId[]): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const canModify             = openData.canModify;
        const gcData                = openData.gcData;
        const instanceWarRule       = openData.instanceWarRule;
        const gameModeId            = openData.gameModeId;
        const warRuleCommonData     = HelpersMisc.getExisted(instanceWarRule.getWarRuleCommonData());
        const playerRuleArray       = warRuleCommonData.getPlayerRuleList();
        const playersCountUnneutral = playerRuleArray.length;
        const getIsBatch            = () => this.getIsBatch();
        const dataArray             : UiComponentsUiPlayerRuleRenderer.DataForUiPlayerRuleRenderer[] = [];
        for (const ruleType of playerRuleTypeArray) {
            for (let playerIndex = PlayersConstants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
                dataArray.push({
                    canModify           : canModify,
                    gcData              : gcData,
                    gameModeId          : gameModeId,
                    instanceWarRule     : instanceWarRule,
                    warRuleCommonData   : warRuleCommonData,
                    playerRuleType      : ruleType,
                    playerRule          : HelpersMisc.getExisted(playerRuleArray.find(v => v.getPlayerIndex() === playerIndex)),
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
            btn.setText(`${LangUtils.getText(LangConstants.TextType.B1373)}: ${LangUtils.getTextForYesOrNo(this.getIsBatch())}`);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// RuleTitleRenderer
////////////////////////////////////////////////////////////////////////////////////////////////////
interface DataForTitleRenderer extends UiTypesUiListItemData.UiListItemData {
    playerRuleType  : PlayerRulesConstants.RuleTypeId;
    rendererWidth   : number;
}
class RuleTitleRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForTitleRenderer> {
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelp!      : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedBtnHelp(): void {
        const playerRuleType    = this.getOpenData()?.playerRuleType;
        const text              = playerRuleType == null ? null : LangUtils.getPlayerRuleHelpText(playerRuleType);
        if (text) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
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
        this._labelName.setText(LangUtils.getPlayerRuleName(playerRuleType) ?? LangConstants.UndefinedError);
        this._btnHelp.setIsVisible(!!LangUtils.getPlayerRuleHelpText(playerRuleType));
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// PlayerRenderer
////////////////////////////////////////////////////////////////////////////////////////////////////
interface DataForPlayerRenderer extends UiTypesUiListItemData.UiListItemData {
    playerIndex : number;
}
class PlayerRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _labelPlayerIndex! : UiInterfacesIUiLabel.IUiLabel;

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        this._labelPlayerIndex.setText(`P${openData?.playerIndex}`);
    }
}

function getPlayerRuleTypeArray(gameModeId: GameModesConstants.ModeId): PlayerRulesConstants.RuleTypeId[] {
    if (gameModeId === GameModesConstants.ModeId.Versus) {
        return [
            PlayerRulesConstants.RuleTypeId.TeamIndex,
            PlayerRulesConstants.RuleTypeId.BannedCoCategoryIdArray,
            PlayerRulesConstants.RuleTypeId.McwHumanCoCategoryIdArray,
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
            PlayerRulesConstants.RuleTypeId.AttackPowerModifier,
            PlayerRulesConstants.RuleTypeId.DefenseModifier,
            PlayerRulesConstants.RuleTypeId.UnitVisionRangeModifier,
            PlayerRulesConstants.RuleTypeId.TileVisionRangeModifier,
            PlayerRulesConstants.RuleTypeId.LuckLowerLimit,
            PlayerRulesConstants.RuleTypeId.LuckUpperLimit,
        ];
    } else if (gameModeId === GameModesConstants.ModeId.Coop) {
        return [
            PlayerRulesConstants.RuleTypeId.TeamIndex,
            PlayerRulesConstants.RuleTypeId.BannedCoCategoryIdArray,
            PlayerRulesConstants.RuleTypeId.CcwHumanCoCategoryIdArray,
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
            PlayerRulesConstants.RuleTypeId.AttackPowerModifier,
            PlayerRulesConstants.RuleTypeId.DefenseModifier,
            PlayerRulesConstants.RuleTypeId.UnitVisionRangeModifier,
            PlayerRulesConstants.RuleTypeId.TileVisionRangeModifier,
            PlayerRulesConstants.RuleTypeId.LuckLowerLimit,
            PlayerRulesConstants.RuleTypeId.LuckUpperLimit,
        ];
    } else {
        return [
            PlayerRulesConstants.RuleTypeId.TeamIndex,
            PlayerRulesConstants.RuleTypeId.BannedCoCategoryIdArray,
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
            PlayerRulesConstants.RuleTypeId.AttackPowerModifier,
            PlayerRulesConstants.RuleTypeId.DefenseModifier,
            PlayerRulesConstants.RuleTypeId.UnitVisionRangeModifier,
            PlayerRulesConstants.RuleTypeId.TileVisionRangeModifier,
            PlayerRulesConstants.RuleTypeId.LuckLowerLimit,
            PlayerRulesConstants.RuleTypeId.LuckUpperLimit,
        ];
    }
}
