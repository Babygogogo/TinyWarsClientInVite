import {
    Ui_Components_UiPlayerRuleRenderer,
    type GameConfigs_GameConfig,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiList,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    PlayerRules_Constants,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    type Ui_Types_UiListItemData,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
} from "../../internal.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { PlayerRule } from "../../proto/schema/CommonProto/WarRule/PlayerRule.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";

export interface OpenData {
    gcData                  : GameConfigs_GameConfig.GameConfig;
    mapRawData              : MapRawData;
    templateWarRule         : TemplateWarRule;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnBatch!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listRuleTitle!    : Ui_Interfaces_IUiList.IUiList<DataForRuleTitleRenderer>;
    private readonly _listPlayerIndex!  : Ui_Interfaces_IUiList.IUiList<DataForPlayerIndexRenderer>;
    private readonly _listPlayerRule!   : Ui_Interfaces_IUiList.IUiList<Ui_Components_UiPlayerRuleRenderer.DataForUiPlayerRuleRenderer>;
    private readonly _labelNoData!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private _isBatch                    = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                             callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.MeMapSimpleDialogueChanged,                  callback: this._onNotifyMeMapSimpleDialogueChanged },
            { type: Notifications_TypeId.TypeId.MeWarRuleMapSimpleDialogueIdArrayChanged,    callback: this._onNotifyMeWarRuleMapSimpleDialogueIdArrayChanged },
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
        this._listPlayerRule.setItemRendererClass(Ui_Components_UiPlayerRuleRenderer.UiPlayerRuleRenderer);
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0785),
        });
    }
    private _onTouchedBtnBatch(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent             : () => Lang_Utils.getText(Lang_Constants.TextType.A0940),
            callback            : () => {
                this._setIsBatch(true);
                this._updateBtnBatch();
            },
            callbackOnCancel    : () => {
                this._setIsBatch(false);
                this._updateBtnBatch();
            },
            getTextForConfirm  : () => Lang_Utils.getTextForYesOrNo(true),
            getTextForCancel   : () => Lang_Utils.getTextForYesOrNo(false),
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateComponentsForPlayerRule();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0407)} (R${this.getOpenData()?.templateWarRule.getRuleId()})`);
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
        this._updateBtnBatch();
    }
    private _updateBtnBatch(): void {
        this._btnBatch.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1373)}: ${Lang_Utils.getTextForYesOrNo(this._isBatch)}`);
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
        const warRuleCommonData     = Helpers_Misc.getExisted(templateWarRule.getWarRuleCommonData());
        const revisedPlayersCount   = Math.max(2, playerRulesCount);
        const widthForListRuleTitle = revisedPlayersCount * 80 + (revisedPlayersCount - 1) + 130;
        const getIsBatch            = () => this.getIsBatch();
        this._group.setUnscaledManualWidth(widthForListRuleTitle + 40);
        this._labelNoData.setIsVisible(!playerRulesCount);

        const dataArrayForListRuleTitle     = this._createDataArrayForListRuleTitle(widthForListRuleTitle);
        const dataArrayForListPlayerIndex   = playerRuleArray?.map(v => ({ playerRule: v }) as DataForPlayerIndexRenderer);
        const dataArrayForListPlayerRule    : Ui_Components_UiPlayerRuleRenderer.DataForUiPlayerRuleRenderer[] = [];
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
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.TeamIndex },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.BannedCoCategoryIdArray },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.BannedUnitTypeArray },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.CanActivateCoSkill },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.CanCoBoard },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.CanUnitJoin },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.InitialFund },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.IncomeMultiplier },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.MaxUnitsCount },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.EnergyAddPctOnCoBoard },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.EnergyLossPctOnCoDie },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.EnergyGrowthMultiplier },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.MoveRangeModifier },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.AttackPowerModifier },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.DefenseModifier },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.UnitVisionRangeModifier },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.TileVisionRangeModifier },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.LuckLowerLimit },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.LuckUpperLimit },
        ];
        if (this.getOpenData()?.mapRawData.getCampaignMapData()) {
            dataArray.push(
                { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.CampaignHumanCoIdArray },
                { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.CampaignAiCoId },
                { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.CampaignSkinId },
            );
        } else {
            dataArray.push(
                { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.McwHumanCoCategoryIdArray },
                { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.MmwHumanCoCategoryIdArray },
                { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.MrwHumanCoCategoryIdArray },
                { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.AtwHumanCoCategoryIdArray },
                { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.CcwHumanCoCategoryIdArray },
                { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.CcwAiCoId },
                { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.WarRoomHumanCoCategoryIdArray },
                { index: 0, itemWidth: itemWidth, ruleType: PlayerRules_Constants.RuleTypeId.WarRoomAiCoId },
            );
        }
        for (let i = 0; i < dataArray.length; ++i) {
            dataArray[i].index = i;
        }
        return dataArray;
    }
}

interface DataForRuleTitleRenderer extends Ui_Types_UiListItemData.UiListItemData {
    itemWidth   : number;
    index       : number;
    ruleType    : PlayerRules_Constants.RuleTypeId;
}
class RuleTitleRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForRuleTitleRenderer> {
    private readonly _imgBg!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupHelp!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnHelp0!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelp1!     : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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

        const text = Lang_Utils.getPlayerRuleHelpText(ruleType);
        if (text) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
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
        if (Lang_Utils.getPlayerRuleHelpText(openData.ruleType)) {
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

        this._labelName.setText(Lang_Utils.getPlayerRuleName(ruleType) ?? Lang_Constants.UndefinedError);
    }
    private _updateGroupHelp(): void {
        const ruleType = this.getOpenData()?.ruleType;
        this._groupHelp.setIsVisible(ruleType == null ? false : (Lang_Utils.getPlayerRuleHelpText(ruleType) != null));
    }
}

interface DataForPlayerIndexRenderer extends Ui_Types_UiListItemData.UiListItemData {
    playerRule  : PlayerRule;
}
class PlayerIndexRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForPlayerIndexRenderer> {
    private readonly _labelPlayerIndex! : Ui_Interfaces_IUiLabel.IUiLabel;

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _updateView(): void {
        this._labelPlayerIndex.setText(`P${this.getOpenData()?.playerRule.getPlayerIndex() ?? 0}`);
    }
}
