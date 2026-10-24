import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayerRulesConstants from "../../playerRules/Constants.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type * as ProtoSchemaCommonProtoWarRulePlayerRule from "../../proto/schema/CommonProto/WarRule/PlayerRule.ts";
import type * as ProtoSchemaCommonProtoWarRuleTemplateWarRule from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import * as UiComponentsUiPlayerRuleRenderer from "../../ui/components/UiPlayerRuleRenderer.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiList from "../../ui/interfaces/IUiList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

type TemplateWarRule    = ProtoSchemaCommonProtoWarRuleTemplateWarRule.TemplateWarRule;
type PlayerRule         = ProtoSchemaCommonProtoWarRulePlayerRule.PlayerRule;
type GcData             = GameConfigGcData.GcData;

export interface OpenData {
    gcData                  : GcData;
    mapRawData              : ProtoSchemaCommonProtoMapMapRawData.MapRawData;
    templateWarRule         : TemplateWarRule;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelp!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnBatch!         : UiInterfacesIUiButton.IUiButton;

    private readonly _listRuleTitle!    : UiInterfacesIUiList.IUiList<DataForRuleTitleRenderer>;
    private readonly _listPlayerIndex!  : UiInterfacesIUiList.IUiList<DataForPlayerIndexRenderer>;
    private readonly _listPlayerRule!   : UiInterfacesIUiList.IUiList<UiComponentsUiPlayerRuleRenderer.DataForUiPlayerRuleRenderer>;
    private readonly _labelNoData!      : UiInterfacesIUiLabel.IUiLabel;

    private _isBatch                    = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MeMapSimpleDialogueChanged,                  callback: this._onNotifyMeMapSimpleDialogueChanged },
            { type: NotificationsTypeId.TypeId.MeWarRuleMapSimpleDialogueIdArrayChanged,    callback: this._onNotifyMeWarRuleMapSimpleDialogueIdArrayChanged },
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
        this._listPlayerRule.setItemRendererClass(UiComponentsUiPlayerRuleRenderer.UiPlayerRuleRenderer);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0785),
        });
    }
    private _onTouchedBtnBatch(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent             : () => LangUtils.getText(LangConstants.TextType.A0940),
            callback            : () => {
                this._setIsBatch(true);
                this._updateBtnBatch();
            },
            callbackOnCancel    : () => {
                this._setIsBatch(false);
                this._updateBtnBatch();
            },
            getTextForConfirm  : () => LangUtils.getTextForYesOrNo(true),
            getTextForCancel   : () => LangUtils.getTextForYesOrNo(false),
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateComponentsForPlayerRule();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0407)} (R${this.getOpenData()?.templateWarRule.getRuleId()})`);
        this._labelNoData.setText(LangUtils.getText(LangConstants.TextType.B0278));
        this._updateBtnBatch();
    }
    private _updateBtnBatch(): void {
        this._btnBatch.setText(`${LangUtils.getText(LangConstants.TextType.B1373)}: ${LangUtils.getTextForYesOrNo(this._isBatch)}`);
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
        const warRuleCommonData     = HelpersMisc.getExisted(templateWarRule.getWarRuleCommonData());
        const revisedPlayersCount   = Math.max(2, playerRulesCount);
        const widthForListRuleTitle = revisedPlayersCount * 80 + (revisedPlayersCount - 1) + 130;
        const getIsBatch            = () => this.getIsBatch();
        this._group.setUnscaledManualWidth(widthForListRuleTitle + 40);
        this._labelNoData.setIsVisible(!playerRulesCount);

        const dataArrayForListRuleTitle     = this._createDataArrayForListRuleTitle(widthForListRuleTitle);
        const dataArrayForListPlayerIndex   = playerRuleArray?.map(v => ({ playerRule: v }) as DataForPlayerIndexRenderer);
        const dataArrayForListPlayerRule    : UiComponentsUiPlayerRuleRenderer.DataForUiPlayerRuleRenderer[] = [];
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
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.TeamIndex },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.BannedCoCategoryIdArray },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.BannedUnitTypeArray },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.CanActivateCoSkill },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.CanCoBoard },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.CanUnitJoin },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.InitialFund },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.IncomeMultiplier },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.MaxUnitsCount },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.EnergyAddPctOnCoBoard },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.EnergyLossPctOnCoDie },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.EnergyGrowthMultiplier },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.MoveRangeModifier },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.AttackPowerModifier },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.DefenseModifier },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.UnitVisionRangeModifier },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.TileVisionRangeModifier },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.LuckLowerLimit },
            { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.LuckUpperLimit },
        ];
        if (this.getOpenData()?.mapRawData.getCampaignMapData()) {
            dataArray.push(
                { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.CampaignHumanCoIdArray },
                { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.CampaignAiCoId },
                { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.CampaignSkinId },
            );
        } else {
            dataArray.push(
                { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.McwHumanCoCategoryIdArray },
                { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.MmwHumanCoCategoryIdArray },
                { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.MrwHumanCoCategoryIdArray },
                { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.AtwHumanCoCategoryIdArray },
                { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.CcwHumanCoCategoryIdArray },
                { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.CcwAiCoId },
                { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.WarRoomHumanCoCategoryIdArray },
                { index: 0, itemWidth: itemWidth, ruleType: PlayerRulesConstants.RuleTypeId.WarRoomAiCoId },
            );
        }
        for (let i = 0; i < dataArray.length; ++i) {
            dataArray[i].index = i;
        }
        return dataArray;
    }
}

interface DataForRuleTitleRenderer extends UiTypesUiListItemData.UiListItemData {
    itemWidth   : number;
    index       : number;
    ruleType    : PlayerRulesConstants.RuleTypeId;
}
class RuleTitleRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForRuleTitleRenderer> {
    private readonly _imgBg!        : UiInterfacesIUiImage.IUiImage;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupHelp!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnHelp0!     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelp1!     : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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

        const text = LangUtils.getPlayerRuleHelpText(ruleType);
        if (text) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
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
        if (LangUtils.getPlayerRuleHelpText(openData.ruleType)) {
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

        this._labelName.setText(LangUtils.getPlayerRuleName(ruleType) ?? LangConstants.UndefinedError);
    }
    private _updateGroupHelp(): void {
        const ruleType = this.getOpenData()?.ruleType;
        this._groupHelp.setIsVisible(ruleType == null ? false : (LangUtils.getPlayerRuleHelpText(ruleType) != null));
    }
}

interface DataForPlayerIndexRenderer extends UiTypesUiListItemData.UiListItemData {
    playerRule  : PlayerRule;
}
class PlayerIndexRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForPlayerIndexRenderer> {
    private readonly _labelPlayerIndex! : UiInterfacesIUiLabel.IUiLabel;

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _updateView(): void {
        this._labelPlayerIndex.setText(`P${this.getOpenData()?.playerRule.getPlayerIndex() ?? 0}`);
    }
}
