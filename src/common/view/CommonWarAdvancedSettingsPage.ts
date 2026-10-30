import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { ModeId } from "../../gameModes/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getExisted } from "../../helpers/Misc.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getText,
    getTextForYesOrNo,
    getPlayerRuleHelpText,
    getPlayerRuleName,
} from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { RuleTypeId } from "../../playerRules/Constants.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type { InstanceWarRule } from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiOpenableComponent } from "../../ui/components/UiOpenableComponent.ts";
import {
    type DataForUiPlayerRuleRenderer,
    UiPlayerRuleRenderer,
} from "../../ui/components/UiPlayerRuleRenderer.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiList } from "../../ui/interfaces/IUiList.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import { UiHorizontalAlign } from "../../ui/types/UiHorizontalAlign.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { UiVerticalAlign } from "../../ui/types/UiVerticalAlign.ts";
import { loadSkinByPath } from "../../ui/utils/UiSkinHelpers.ts";

export type OpenData = {
    canModify       : boolean;
    instanceWarRule : InstanceWarRule;
    gameModeId      : ModeId;
    gcData          : GameConfig;
} | null;
export class Page extends UiOpenableComponent<OpenData> {
    private readonly _scroller!     : IUiScroller<IUiContainer>;
    private readonly _btnBatch!     : IUiButton;
    private readonly _listPlayer!   : IUiScrollList<DataForPlayerRenderer>;
    private readonly _listTitle!    : IUiScrollList<DataForTitleRenderer>;
    private readonly _listInfo!     : IUiList<DataForUiPlayerRuleRenderer>;

    private _isBatch                = false;

    public constructor() {
        super();

        loadSkinByPath(this, "common/CommonWarAdvancedSettingsPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBatch,   callback: this._onTouchedBtnBatch },
        ]);

        this._listTitle.setItemRendererClass(RuleTitleRenderer);
        this._listPlayer.setItemRendererClass(PlayerRenderer);
        this._listInfo.setItemRendererClass(UiPlayerRuleRenderer);
        this._btnBatch.setIsVisible(false);

        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiHorizontalAlign.Center },
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
        openPanel(getDict().CommonConfirmPanel, {
            getContent          : () => getText(TextType.A0940),
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

        const playerRuleArray   = getExisted(openData.instanceWarRule?.getWarRuleCommonData()?.getPlayerRuleList());
        const dataArray         : DataForPlayerRenderer[] = [];
        for (let playerIndex = PlayerIndex.First; playerIndex <= playerRuleArray.length; ++playerIndex) {
            dataArray.push({
                playerIndex: playerIndex,
            });
        }
        await this._listPlayer.bindData(dataArray);
    }

    private async _updateListTitle(playerRuleTypeArray: RuleTypeId[]): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playersCountUnneutral = getExisted(openData.instanceWarRule?.getWarRuleCommonData()?.getPlayerRuleList()).length;
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

    private async _updateListInfo(playerRuleTypeArray: RuleTypeId[]): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const canModify             = openData.canModify;
        const gcData                = openData.gcData;
        const instanceWarRule       = openData.instanceWarRule;
        const gameModeId            = openData.gameModeId;
        const warRuleCommonData     = getExisted(instanceWarRule.getWarRuleCommonData());
        const playerRuleArray       = warRuleCommonData.getPlayerRuleList();
        const playersCountUnneutral = playerRuleArray.length;
        const getIsBatch            = () => this.getIsBatch();
        const dataArray             : DataForUiPlayerRuleRenderer[] = [];
        for (const ruleType of playerRuleTypeArray) {
            for (let playerIndex = PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
                dataArray.push({
                    canModify           : canModify,
                    gcData              : gcData,
                    gameModeId          : gameModeId,
                    instanceWarRule     : instanceWarRule,
                    warRuleCommonData   : warRuleCommonData,
                    playerRuleType      : ruleType,
                    playerRule          : getExisted(playerRuleArray.find(v => v.getPlayerIndex() === playerIndex)),
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
            btn.setText(`${getText(TextType.B1373)}: ${getTextForYesOrNo(this.getIsBatch())}`);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// RuleTitleRenderer
////////////////////////////////////////////////////////////////////////////////////////////////////
interface DataForTitleRenderer extends UiListItemData {
    playerRuleType  : RuleTypeId;
    rendererWidth   : number;
}
class RuleTitleRenderer extends UiListItemRenderer<DataForTitleRenderer> {
    private readonly _labelName!    : IUiLabel;
    private readonly _btnHelp!      : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedBtnHelp(): void {
        const playerRuleType    = this.getOpenData()?.playerRuleType;
        const text              = playerRuleType == null ? null : getPlayerRuleHelpText(playerRuleType);
        if (text) {
            openPanel(getDict().CommonHelpPanel, {
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
        this._labelName.setText(getPlayerRuleName(playerRuleType) ?? UndefinedError);
        this._btnHelp.setIsVisible(!!getPlayerRuleHelpText(playerRuleType));
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// PlayerRenderer
////////////////////////////////////////////////////////////////////////////////////////////////////
interface DataForPlayerRenderer extends UiListItemData {
    playerIndex : number;
}
class PlayerRenderer extends UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _labelPlayerIndex! : IUiLabel;

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        this._labelPlayerIndex.setText(`P${openData?.playerIndex}`);
    }
}

function getPlayerRuleTypeArray(gameModeId: ModeId): RuleTypeId[] {
    if (gameModeId === ModeId.Versus) {
        return [
            RuleTypeId.TeamIndex,
            RuleTypeId.BannedCoCategoryIdArray,
            RuleTypeId.McwHumanCoCategoryIdArray,
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
            RuleTypeId.AttackPowerModifier,
            RuleTypeId.DefenseModifier,
            RuleTypeId.UnitVisionRangeModifier,
            RuleTypeId.TileVisionRangeModifier,
            RuleTypeId.LuckLowerLimit,
            RuleTypeId.LuckUpperLimit,
        ];
    } else if (gameModeId === ModeId.Coop) {
        return [
            RuleTypeId.TeamIndex,
            RuleTypeId.BannedCoCategoryIdArray,
            RuleTypeId.CcwHumanCoCategoryIdArray,
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
            RuleTypeId.AttackPowerModifier,
            RuleTypeId.DefenseModifier,
            RuleTypeId.UnitVisionRangeModifier,
            RuleTypeId.TileVisionRangeModifier,
            RuleTypeId.LuckLowerLimit,
            RuleTypeId.LuckUpperLimit,
        ];
    } else {
        return [
            RuleTypeId.TeamIndex,
            RuleTypeId.BannedCoCategoryIdArray,
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
            RuleTypeId.AttackPowerModifier,
            RuleTypeId.DefenseModifier,
            RuleTypeId.UnitVisionRangeModifier,
            RuleTypeId.TileVisionRangeModifier,
            RuleTypeId.LuckLowerLimit,
            RuleTypeId.LuckUpperLimit,
        ];
    }
}
