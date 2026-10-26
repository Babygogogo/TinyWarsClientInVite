import type { GcData } from "../../gameConfigs/GcData.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getTextForYesOrNo, getPlayerRuleHelpText, getPlayerRuleName } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { RuleTypeId } from "../../playerRules/Constants.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { PlayerRule } from "../../proto/schema/CommonProto/WarRule/PlayerRule.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import { type DataForUiPlayerRuleRenderer, UiPlayerRuleRenderer } from "../../ui/components/UiPlayerRuleRenderer.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiList } from "../../ui/interfaces/IUiList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    gcData                  : GcData;
    mapRawData              : MapRawData;
    templateWarRule         : TemplateWarRule;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnHelp!          : IUiButton;
    private readonly _btnClose!         : IUiButton;
    private readonly _btnBatch!         : IUiButton;

    private readonly _listRuleTitle!    : IUiList<DataForRuleTitleRenderer>;
    private readonly _listPlayerIndex!  : IUiList<DataForPlayerIndexRenderer>;
    private readonly _listPlayerRule!   : IUiList<DataForUiPlayerRuleRenderer>;
    private readonly _labelNoData!      : IUiLabel;

    private _isBatch                    = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                             callback: this._onNotifyLanguageChanged },
            { type: TypeId.MeMapSimpleDialogueChanged,                  callback: this._onNotifyMeMapSimpleDialogueChanged },
            { type: TypeId.MeWarRuleMapSimpleDialogueIdArrayChanged,    callback: this._onNotifyMeWarRuleMapSimpleDialogueIdArrayChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
            { ui: this._btnHelp,        callback: this._onTouchedBtnHelp },
            { ui: this._btnBatch,       callback: this._onTouchedBtnBatch },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listRuleTitle.setItemRendererClass(RuleTitleRenderer);
        this._listPlayerIndex.setItemRendererClass(PlayerIndexRenderer);
        this._listPlayerRule.setItemRendererClass(UiPlayerRuleRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listRuleTitle.removeAllItems(),
            this._listPlayerIndex.removeAllItems(),
            this._listPlayerRule.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public getIsBatch(): boolean {
        return this._isBatch;
    }
    private _setIsBatch(isBatch: boolean): void {
        this._isBatch = isBatch;
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMeMapSimpleDialogueChanged(): void {
        this._updateView();
    }
    private _onNotifyMeWarRuleMapSimpleDialogueIdArrayChanged(): void {
        this._updateView();
    }
    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0785),
        });
    }
    private _onTouchedBtnBatch(): void {
        openPanel(getDict().CommonConfirmPanel, {
            getContent             : () => getText(TextType.A0940),
            callback            : () => {
                this._setIsBatch(true);
                this._updateBtnBatch();
            },
            callbackOnCancel    : () => {
                this._setIsBatch(false);
                this._updateBtnBatch();
            },
            getTextForConfirm  : () => getTextForYesOrNo(true),
            getTextForCancel   : () => getTextForYesOrNo(false),
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateComponentsForPlayerRule();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${getText(TextType.B0407)} (R${this.getOpenData()?.templateWarRule.getRuleId()})`);
        this._labelNoData.setText(getText(TextType.B0278));
        this._updateBtnBatch();
    }
    private _updateBtnBatch(): void {
        this._btnBatch.setText(`${getText(TextType.B1373)}: ${getTextForYesOrNo(this._isBatch)}`);
    }
    private async _updateComponentsForPlayerRule(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const templateWarRule       = openData.templateWarRule;
        const gcData                = openData.gcData;
        const playerRuleArray       = templateWarRule.getWarRuleCommonData()?.getPlayerRuleList() ?? [];
        const playerRulesCount      = playerRuleArray.length;
        const warRuleCommonData     = getExisted(templateWarRule.getWarRuleCommonData());
        const revisedPlayersCount   = Math.max(2, playerRulesCount);
        const widthForListRuleTitle = revisedPlayersCount * 80 + (revisedPlayersCount - 1) + 130;
        const getIsBatch            = () => this.getIsBatch();
        this._group.setUnscaledManualWidth(widthForListRuleTitle + 40);
        this._labelNoData.setIsVisible(!playerRulesCount);

        const dataArrayForListRuleTitle     = this._createDataArrayForListRuleTitle(widthForListRuleTitle);
        const dataArrayForListPlayerIndex   = playerRuleArray?.map(v => ({ playerRule: v }) as DataForPlayerIndexRenderer);
        const dataArrayForListPlayerRule    : DataForUiPlayerRuleRenderer[] = [];
        for (const dataForListRuleTitle of dataArrayForListRuleTitle) {
            const ruleType = dataForListRuleTitle.ruleType;
            for (const playerRule of playerRuleArray) {
                dataArrayForListPlayerRule.push({
                    canModify           : true,
                    gcData              : gcData,
                    gameModeId          : null,
                    instanceWarRule     : null,
                    warRuleCommonData   : warRuleCommonData,
                    playerRule          : playerRule,
                    playerRuleType      : ruleType,
                    getIsBatch          : getIsBatch,
                });
            }
        }

        const listPlayerRule = this._listPlayerRule;
        listPlayerRule.setUnscaledRequestedWidth(Math.max(0, playerRulesCount * 80 + (playerRulesCount - 1)));
        await Promise.all([
            listPlayerRule.bindData(dataArrayForListPlayerRule),
            this._listPlayerIndex.bindData(dataArrayForListPlayerIndex),
            this._listRuleTitle.bindData(dataArrayForListRuleTitle),
        ]);
    }

    private _createDataArrayForListRuleTitle(itemWidth: number): DataForRuleTitleRenderer[] {
        const dataArray: DataForRuleTitleRenderer[] = [
            { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.TeamIndex },
            { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.BannedCoCategoryIdArray },
            { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.BannedUnitTypeArray },
            { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.CanActivateCoSkill },
            { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.CanCoBoard },
            { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.CanUnitJoin },
            { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.InitialFund },
            { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.IncomeMultiplier },
            { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.MaxUnitsCount },
            { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.EnergyAddPctOnCoBoard },
            { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.EnergyLossPctOnCoDie },
            { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.EnergyGrowthMultiplier },
            { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.MoveRangeModifier },
            { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.AttackPowerModifier },
            { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.DefenseModifier },
            { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.UnitVisionRangeModifier },
            { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.TileVisionRangeModifier },
            { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.LuckLowerLimit },
            { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.LuckUpperLimit },
        ];
        if (this.getOpenData()?.mapRawData.getCampaignMapData()) {
            dataArray.push(
                { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.CampaignHumanCoIdArray },
                { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.CampaignAiCoId },
                { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.CampaignSkinId },
            );
        } else {
            dataArray.push(
                { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.McwHumanCoCategoryIdArray },
                { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.MmwHumanCoCategoryIdArray },
                { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.MrwHumanCoCategoryIdArray },
                { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.AtwHumanCoCategoryIdArray },
                { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.CcwHumanCoCategoryIdArray },
                { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.CcwAiCoId },
                { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.WarRoomHumanCoCategoryIdArray },
                { index: 0, itemWidth: itemWidth, ruleType: RuleTypeId.WarRoomAiCoId },
            );
        }
        for (let i = 0; i < dataArray.length; ++i) {
            dataArray[i].index = i;
        }
        return dataArray;
    }
}

interface DataForRuleTitleRenderer extends UiListItemData {
    itemWidth   : number;
    index       : number;
    ruleType    : RuleTypeId;
}
class RuleTitleRenderer extends UiListItemRenderer<DataForRuleTitleRenderer> {
    private readonly _imgBg!        : IUiImage;
    private readonly _labelName!    : IUiLabel;

    private readonly _groupHelp!    : IUiContainer;
    private readonly _btnHelp0!     : IUiButton;
    private readonly _btnHelp1!     : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupHelp,  callback: this._onTouchedGroupHelp },
        ]);
    }
    private _onNotifyLanguageChanged(): void {
        this._updateLabelName();
    }
    private _onTouchedGroupHelp(): void {
        const ruleType = this.getOpenData()?.ruleType;
        if (ruleType == null) {
            return;
        }

        const text = getPlayerRuleHelpText(ruleType);
        if (text) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            openPanel(getDict().CommonHelpPanel, {
                getContent : () => text,
            });
        }
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const isBgVisible = openData.index % 2 == 0;
        this._imgBg.setIsVisible(isBgVisible);
        this.setUnscaledManualWidth(openData.itemWidth);

        const btnHelp0 = this._btnHelp0;
        const btnHelp1 = this._btnHelp1;
        if (getPlayerRuleHelpText(openData.ruleType)) {
            btnHelp0.setIsVisible(!isBgVisible);
            btnHelp1.setIsVisible(isBgVisible);
        } else {
            btnHelp0.setIsVisible(false);
            btnHelp1.setIsVisible(false);
        }

        this._updateLabelName();
        this._updateGroupHelp();
    }
    private _updateLabelName(): void {
        const ruleType = this.getOpenData()?.ruleType;
        if (ruleType == null) {
            return;
        }

        this._labelName.setText(getPlayerRuleName(ruleType) ?? UndefinedError);
    }
    private _updateGroupHelp(): void {
        const ruleType = this.getOpenData()?.ruleType;
        this._groupHelp.setIsVisible(ruleType == null ? false : (getPlayerRuleHelpText(ruleType) != null));
    }
}

interface DataForPlayerIndexRenderer extends UiListItemData {
    playerRule  : PlayerRule;
}
class PlayerIndexRenderer extends UiListItemRenderer<DataForPlayerIndexRenderer> {
    private readonly _labelPlayerIndex! : IUiLabel;

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _updateView(): void {
        this._labelPlayerIndex.setText(`P${this.getOpenData()?.playerRule.getPlayerIndex() ?? 0}`);
    }
}
