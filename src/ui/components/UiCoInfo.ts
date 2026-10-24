import * as AuxiliaryTypesReplayFilter from "../../auxiliaryTypes/ReplayFilter.ts";
import * as CosConstants from "../../cos/Constants.ts";
import * as CosUtils from "../../cos/Utils.ts";
import * as CoSkillsConstants from "../../coSkills/Constants.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiListItemRenderer from "./UiListItemRenderer.ts";
import * as UiComponentsUiOpenableComponent from "./UiOpenableComponent.ts";
import type * as UiInterfacesIUiButton from "../interfaces/IUiButton.ts";
import type * as UiInterfacesIUiCoInfo from "../interfaces/IUiCoInfo.ts";
import type * as UiInterfacesIUiContainer from "../interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiListItemRenderer from "../interfaces/IUiListItemRenderer.ts";
import type * as UiInterfacesIUiScrollList from "../interfaces/IUiScrollList.ts";
import type * as UiTypesUiCoData from "../types/UiCoData.ts";
import * as UiTypesUiCoInfoType from "../types/UiCoInfoType.ts";
import type * as UiTypesUiListItemData from "../types/UiListItemData.ts";
import * as UiUtilsUiFactory from "../utils/UiFactory.ts";

export class UiCoInfo extends UiComponentsUiOpenableComponent.UiOpenableComponent<UiTypesUiCoData.UiCoData> implements UiInterfacesIUiCoInfo.IUiCoInfo {
    private readonly _groupDorBasicInfo!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutDorBasicInfo!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupDorArtDesigner!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelDorArtDesignerTitle!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDorArtDesigner!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupDorDataDesigner!         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelDorDataDesignerTitle!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDorDataDesigner!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnDorReplay!                 : UiInterfacesIUiButton.IUiButton;

    private readonly _groupDorCoType!               : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelDorCoTypeTitle!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDorCoType!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupDorBoardCost!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelDorBoardCostTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDorBoardCost!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupDorZoneRadius!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelDorZoneRadiusTitle!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDorZoneRadius!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupDorZoneExpansion!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelDorZoneExpansionTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDorZoneExpansion!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupDorMaxEnergy!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelDorMaxEnergyTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDorMaxEnergy!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupDorEnergyBar!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelDorEnergyBarTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDorEnergyBar!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupTriBasicInfo!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutTriBasicInfo!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelTriArtDesignerTitle!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTriArtDesigner!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTriDataDesignerTitle!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTriDataDesigner!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnTriReplay!                 : UiInterfacesIUiButton.IUiButton;

    private readonly _groupTriCoType!               : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTriCoTypeTitle!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTriCoType!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupTriEnergyBar!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTriEnergyBarTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTriEnergyBar!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupTriMaxEnergy!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTriMaxEnergyTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTriMaxEnergy!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupSkillInfo!               : UiInterfacesIUiLayout.IUiLayout;
    private readonly _groupSkillType!               : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelSkillTypeTitle!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSkillType!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupEnergyCost!              : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelEnergyCostTitle!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelEnergyCost!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _layoutSkillDesc!              : UiInterfacesIUiLayout.IUiLayout;
    private readonly _layoutSkillDescTitle!         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelSkillDescTitle!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupSkillDescHelp!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listSkillDesc!                : UiInterfacesIUiScrollList.IUiScrollList<DataForSkillDescRenderer>;

    private readonly _listInfoType!                 : UiInterfacesIUiScrollList.IUiScrollList<DataForInfoTypeRenderer>;
    private readonly _imgCoPortrait!                : UiInterfacesIUiImage.IUiImage;
    private readonly _labelCoName!                  : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,  callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupDorCoType,             callback: this._onTouchedGroupDorCoType },
            { ui: this._groupDorBoardCost,          callback: this._onTouchedGroupDorBoardCost },
            { ui: this._groupDorZoneRadius,         callback: this._onTouchedGroupDorZoneRadius },
            { ui: this._groupDorZoneExpansion,      callback: this._onTouchedGroupDorZoneExpansion },
            { ui: this._groupDorMaxEnergy,          callback: this._onTouchedGroupDorMaxEnergy },
            { ui: this._groupDorEnergyBar,          callback: this._onTouchedGroupDorEnergyBar },
            { ui: this._btnDorReplay,               callback: this._onTouchedBtnDorReplay },

            { ui: this._groupTriCoType,             callback: this._onTouchedGroupTriCoType },
            { ui: this._groupTriEnergyBar,          callback: this._onTouchedGroupTriEnergyBar },
            { ui: this._groupTriMaxEnergy,          callback: this._onTouchedGroupTriMaxEnergy },
            { ui: this._btnTriReplay,               callback: this._onTouchedBtnTriReplay },

            { ui: this._groupSkillType,             callback: this._onTouchedGroupSkillType },
            { ui: this._layoutSkillDescTitle,       callback: this._onTouchedLayoutSkillDescTitle },
        ]);
        this._listSkillDesc.setItemRendererClass(SkillDescRenderer);
        this._listInfoType.setItemRendererClass(InfoTypeRenderer);

        this._updateComponentsForLanguage();
        this._updateComponentsForInfo();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateOnOpenDataChanged();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listInfoType.removeAllItems(),
            this._listSkillDesc.removeAllItems(),
        ]);

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
        this._updateComponentsForInfo();
    }

    private _onTouchedGroupDorCoType(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0817),
        });
    }
    private _onTouchedGroupDorBoardCost(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0813),
        });
    }
    private _onTouchedGroupDorZoneRadius(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0814),
        });
    }
    private _onTouchedGroupDorZoneExpansion(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0815),
        });
    }
    private _onTouchedGroupDorMaxEnergy(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const multiplier1 = gameConfig.getDorEnergyGainRateForAttacker();
        const multiplier2 = gameConfig.getDorEnergyGainRateForDefender();
        if ((multiplier1 === 1) && (multiplier2 === 0)) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getContent : () => LangUtils.getText(LangConstants.TextType.A0816),
            });
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getContent : () => LangUtils.getFormattedText(
                    LangConstants.TextType.F0117,
                    multiplier1 === 1 ? `` : ` * ${multiplier1}`,
                    multiplier2 === 1 ? `` : ` * ${multiplier2}`,
                ),
            });
        }
    }
    private _onTouchedGroupDorEnergyBar(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0874),
        });
    }
    private _onTouchedBtnDorReplay(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const coCategoryId = openData.gameConfig.getCoBasicCfg(openData.coId)?.getCoCategoryId();
        if (coCategoryId == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent  : () => LangUtils.getText(LangConstants.TextType.A0953),
            callback    : () => HelpersGameFlow.gotoRwReplayListPanel({
                usePreviousFilter       : false,
                usePreviousPageIndex    : false,
                filter                  : new AuxiliaryTypesReplayFilter.ReplayFilter({
                    coCategoryId    : coCategoryId,
                }),
            }),
        });
    }
    private _onTouchedGroupTriCoType(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0817),
        });
    }
    private _onTouchedGroupTriEnergyBar(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0818),
        });
    }
    private _onTouchedGroupTriMaxEnergy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const gameConfig    = openData.gameConfig;
        const param1        = gameConfig.getTrilogyEnergyGainRateForAttacker();
        const param2        = gameConfig.getTrilogyEnergyGainRateForDefender();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getFormattedText(
                LangConstants.TextType.F0134,
                param1 === 100 ? `` : ` * ${param1}%`,
                param2 === 100 ? `` : ` * ${param2}%`,
            ),
        });
    }
    private _onTouchedBtnTriReplay(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const coCategoryId = openData.gameConfig.getCoBasicCfg(openData.coId)?.getCoCategoryId();
        if (coCategoryId == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent  : () => LangUtils.getText(LangConstants.TextType.A0953),
            callback    : () => HelpersGameFlow.gotoRwReplayListPanel({
                usePreviousFilter       : false,
                usePreviousPageIndex    : false,
                filter                  : new AuxiliaryTypesReplayFilter.ReplayFilter({
                    coCategoryId    : coCategoryId,
                }),
            }),
        });
    }
    private _onTouchedGroupSkillType(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0819),
        });
    }
    private _onTouchedLayoutSkillDescTitle(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const skillType = this._listInfoType.getFirstSelectedItem()?.getOpenData()?.skillType;
        if (skillType == null) {
            return;
        }

        const extraDesc     = LangUtils.getCoSkillDescArray({
            coId            : openData.coId,
            skillType       : skillType,
            gameConfig      : openData.gameConfig,
            languageType    : LangUtils.getCurrentLanguageType(),
            isExtra         : true,
        });
        if (extraDesc) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getContent : () => extraDesc.map(v => `- ${v}`).join(`\n`),
                getTitle   : () => LangUtils.getText(LangConstants.TextType.B1215),
            });
        }
    }

    public updateOnSelectedInfoType(): void {
        this._updateComponentsForInfo();
    }
    public getSelectedInfoType(): UiTypesUiCoInfoType.UiCoInfoType | null {
        return this._listInfoType.getFirstSelectedItem()?.getOpenData()?.infoType ?? null;
    }

    private async _updateOnOpenDataChanged(): Promise<void> {
        await this._updateListInfoType();
        this._updateComponentsForInfo();
    }

    private async _updateListInfoType(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const coBasicCfg = openData.gameConfig.getCoBasicCfg(openData.coId);
        await this._listInfoType.bindData([
            {
                infoType    : UiTypesUiCoInfoType.UiCoInfoType.Basic,
                skillType   : null,
                component   : this,
                isDark      : false,
            },
            {
                infoType    : UiTypesUiCoInfoType.UiCoInfoType.Passive,
                skillType   : CoSkillsConstants.SkillTypeId.Passive,
                component   : this,
                isDark      : !coBasicCfg?.getPassiveSkillIds()?.length,
            },
            {
                infoType    : UiTypesUiCoInfoType.UiCoInfoType.Power,
                skillType   : CoSkillsConstants.SkillTypeId.Power,
                component   : this,
                isDark      : !coBasicCfg?.getPowerSkillIds()?.length,
            },
            {
                infoType    : UiTypesUiCoInfoType.UiCoInfoType.SuperPower,
                skillType   : CoSkillsConstants.SkillTypeId.SuperPower,
                component   : this,
                isDark      : !coBasicCfg?.getSuperPowerSkillIds()?.length,
            },
        ], undefined, true);
    }

    private _updateComponentsForLanguage(): void {
        setTextAndArrange(this._labelDorArtDesignerTitle, LangConstants.TextType.B0839);
        setTextAndArrange(this._labelDorDataDesignerTitle, LangConstants.TextType.B0840);
        setTextAndArrange(this._labelDorCoTypeTitle, LangConstants.TextType.B1268);
        setTextAndArrange(this._labelDorBoardCostTitle, LangConstants.TextType.B0164);
        setTextAndArrange(this._labelDorZoneRadiusTitle, LangConstants.TextType.B0165);
        setTextAndArrange(this._labelDorZoneExpansionTitle, LangConstants.TextType.B0166);
        setTextAndArrange(this._labelDorMaxEnergyTitle, LangConstants.TextType.B1272);
        setTextAndArrange(this._labelDorEnergyBarTitle, LangConstants.TextType.B1267);
        setTextAndArrange(this._labelTriArtDesignerTitle, LangConstants.TextType.B0839);
        setTextAndArrange(this._labelTriDataDesignerTitle, LangConstants.TextType.B0840);
        setTextAndArrange(this._labelTriCoTypeTitle, LangConstants.TextType.B1268);
        setTextAndArrange(this._labelTriEnergyBarTitle, LangConstants.TextType.B1271);
        setTextAndArrange(this._labelTriMaxEnergyTitle, LangConstants.TextType.B1272);
        setTextAndArrange(this._labelEnergyCostTitle, LangConstants.TextType.B0167);
        setTextAndArrange(this._labelSkillDescTitle, LangConstants.TextType.B1215);
        setTextAndArrange(this._labelSkillTypeTitle, LangConstants.TextType.B1273);

        this._btnDorReplay.setLangText(LangConstants.TextType.B0710);
        this._btnTriReplay.setLangText(LangConstants.TextType.B0710);
        this._layoutDorBasicInfo.arrangeItems();
        this._layoutTriBasicInfo.arrangeItems();
    }

    private _updateComponentsForInfo(): void {
        const groupDorBasicInfo     = this._groupDorBasicInfo;
        const groupTriBasicInfo     = this._groupTriBasicInfo;
        const groupSkillInfo        = this._groupSkillInfo;
        const openData              = this.getOpenData();
        if (openData == null) {
            groupDorBasicInfo.setIsVisible(false);
            groupTriBasicInfo.setIsVisible(false);
            groupSkillInfo.setIsVisible(false);
            return;
        }

        const coId              = openData.coId;
        const gameConfig        = openData.gameConfig;
        const imgCoPortrait     = this._imgCoPortrait;
        imgCoPortrait.loadSource(``);
        imgCoPortrait.loadSource(HelpersImageSource.getCoBust(gameConfig, coId) ?? LangConstants.UndefinedError);

        const infoType = this.getSelectedInfoType();
        if (infoType == null) {
            groupDorBasicInfo.setIsVisible(false);
            groupTriBasicInfo.setIsVisible(false);
            groupSkillInfo.setIsVisible(false);
            return;
        }

        {
            const label = this._labelCoName;
            label.setText(gameConfig.getCoBasicCfg(coId)?.getName() ?? LangConstants.UndefinedError);

            const parent = label.getParent();
            if (parent instanceof UiUtilsUiFactory.getUiLayoutClass()) {
                parent.arrangeItems();
            }
        }

        if (infoType === UiTypesUiCoInfoType.UiCoInfoType.Basic) {
            const coEnergyType = gameConfig.getCoEnergyType(coId);
            if (coEnergyType === CosConstants.EnergyTypeId.Dor) {
                groupDorBasicInfo.setIsVisible(true);
                groupTriBasicInfo.setIsVisible(false);
                groupSkillInfo.setIsVisible(false);

                this._updateGroupDorBasicInfo();

            } else if (coEnergyType === CosConstants.EnergyTypeId.Trilogy) {
                groupDorBasicInfo.setIsVisible(false);
                groupTriBasicInfo.setIsVisible(true);
                groupSkillInfo.setIsVisible(false);

                this._updateGroupTriBasicInfo();

            } else {
                groupDorBasicInfo.setIsVisible(false);
                groupTriBasicInfo.setIsVisible(false);
                groupSkillInfo.setIsVisible(false);
            }

        } else {
            groupDorBasicInfo.setIsVisible(false);
            groupTriBasicInfo.setIsVisible(false);
            groupSkillInfo.setIsVisible(true);

            this._updateGroupSkillInfo();
        }
    }
    private _updateGroupDorBasicInfo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const coId          = openData.coId;
        const gameConfig    = openData.gameConfig;
        const coEnergyType  = gameConfig.getCoEnergyType(coId);
        if (coEnergyType !== CosConstants.EnergyTypeId.Dor) {
            return;
        }

        const coBasicCfg    = gameConfig.getCoBasicCfg(coId);
        const parameters    = coBasicCfg?.getCoEnergyRequirementParams();
        const layout        = this._layoutDorBasicInfo;
        {
            layout.removeAllItems(false);
            layout.addItem(this._groupDorCoType, false);
            layout.addItem(this._groupDorBoardCost, false);
            layout.addItem(this._groupDorZoneRadius, false);
            layout.addItem(this._groupDorZoneExpansion, false);
            layout.addItem(this._groupDorMaxEnergy, false);
            if ((parameters?.length) && (parameters[1] !== 0)) {
                layout.addItem(this._groupDorEnergyBar, false);
            }
            layout.addItem(this._groupDorArtDesigner, false);
            layout.addItem(this._groupDorDataDesigner, false);
            layout.arrangeItems();
        }

        this._labelDorArtDesigner.setText(coBasicCfg?.getArtDesigner() ?? ``);
        this._labelDorDataDesigner.setText(coBasicCfg?.getDataDesigner() ?? ``);
        this._labelDorCoType.setText(LangUtils.getCoEnergyTypeName(coEnergyType) ?? LangConstants.UndefinedError);
        this._labelDorZoneRadius.setText(`${coBasicCfg?.getZoneRadius()}`);
        this._labelDorMaxEnergy.setText(coBasicCfg == null ? `--` : `${CosUtils.getCoMaxEnergy(coBasicCfg)}`);
        this._labelDorZoneExpansion.setText((coBasicCfg?.getZoneExpansionEnergyList() || []).join(` / `) || `--`);

        {
            const boardCostPercentage   = coBasicCfg?.getBoardCostPercentage() ?? 0;
            const label                 = this._labelDorBoardCost;
            label.setText(`${boardCostPercentage}%`);
            label.setTextColor(boardCostPercentage === 50
                ? 0xFFFFFF
                : (boardCostPercentage > 50 ? 0xFFFF00 : 0x00FF00)
            );
        }

        const labelDorEnergyBar = this._labelDorEnergyBar;
        if (!parameters?.length) {
            labelDorEnergyBar.setText(`--`);
        } else {
            labelDorEnergyBar.setText(`${parameters[0]}%, ${parameters[1]}`);
        }

        layout.arrangeItems();
    }
    private _updateGroupTriBasicInfo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const coId          = openData.coId;
        const gameConfig    = openData.gameConfig;
        const coEnergyType  = gameConfig.getCoEnergyType(coId);
        if (coEnergyType !== CosConstants.EnergyTypeId.Trilogy) {
            return;
        }

        const coBasicCfg                = gameConfig.getCoBasicCfg(coId);
        this._labelTriArtDesigner.setText(coBasicCfg?.getArtDesigner() ?? ``);
        this._labelTriDataDesigner.setText(coBasicCfg?.getDataDesigner() ?? ``);
        this._labelTriCoType.setText(LangUtils.getCoEnergyTypeName(coEnergyType) ?? LangConstants.UndefinedError);
        this._labelTriMaxEnergy.setText(coBasicCfg == null ? `--` : `${CosUtils.getCoMaxEnergy(coBasicCfg)}`);

        const parameters        = coBasicCfg?.getCoEnergyRequirementParams();
        const labelTriEnergyBar = this._labelTriEnergyBar;
        if (!parameters?.length) {
            labelTriEnergyBar.setText(`--`);
        } else {
            labelTriEnergyBar.setText(`${parameters[0]}%, ${parameters[1]}`);
        }

        this._layoutTriBasicInfo.arrangeItems();
    }
    private async _updateGroupSkillInfo(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const coId                  = openData.coId;
        const gameConfig            = openData.gameConfig;
        const skillType             = HelpersMisc.getExisted(this._listInfoType.getFirstSelectedItem()?.getOpenData()?.skillType);
        const skillIdArray          = gameConfig.getCoSkillArray(coId, skillType) ?? [];
        const hasSkill              = !!skillIdArray.length;
        this._labelSkillType.setText(LangUtils.getCoSkillTypeName(skillType) ?? LangConstants.UndefinedError);

        {
            const groupEnergyCost = this._groupEnergyCost;
            if (!hasSkill) {
                groupEnergyCost.setIsVisible(false);
            } else {
                const labelEnergyCost = this._labelEnergyCost;
                const powerEnergyList = gameConfig.getCoBasicCfg(coId)?.getPowerEnergyList() ?? [];
                if (skillType === CoSkillsConstants.SkillTypeId.Passive) {
                    groupEnergyCost.setIsVisible(false);
                } else if (skillType === CoSkillsConstants.SkillTypeId.Power) {
                    groupEnergyCost.setIsVisible(true);
                    labelEnergyCost.setText(`${powerEnergyList[0]}`);
                } else if (skillType === CoSkillsConstants.SkillTypeId.SuperPower) {
                    groupEnergyCost.setIsVisible(true);
                    labelEnergyCost.setText(`${powerEnergyList[1]}`);
                }
            }
        }

        {
            const hasExtraDesc = LangUtils.getCoSkillDescArray({
                coId            : coId,
                skillType       : skillType,
                gameConfig      : gameConfig,
                languageType    : LangUtils.getCurrentLanguageType(),
                isExtra         : true,
            }) != null;
            this._groupSkillDescHelp.setIsVisible(hasExtraDesc);
            this._layoutSkillDescTitle.setIsTouchEnabled(hasExtraDesc);
        }

        {
            const dataArrayForListSkillDesc : DataForSkillDescRenderer[] = [];
            const descArray                 = LangUtils.getCoSkillDescArray({
                coId            : coId,
                skillType       : skillType,
                gameConfig      : gameConfig,
                languageType    : LangUtils.getCurrentLanguageType(),
                isExtra         : false
            });
            if (!descArray?.length) {
                dataArrayForListSkillDesc.push({ desc: LangConstants.UndefinedError });
            } else {
                for (const desc of descArray) {
                    dataArrayForListSkillDesc.push({
                        desc    : desc,
                    });
                }
            }
            await this._listSkillDesc.bindData(dataArrayForListSkillDesc);
        }

        this._groupSkillType.arrangeItems();
        this._groupEnergyCost.arrangeItems();
        this._layoutSkillDesc.arrangeItems();
        this._groupSkillInfo.arrangeItems();
    }
}

interface DataForInfoTypeRenderer extends UiTypesUiListItemData.UiListItemData {
    infoType    : UiTypesUiCoInfoType.UiCoInfoType;
    skillType   : CoSkillsConstants.SkillTypeId | null;
    component   : UiInterfacesIUiCoInfo.IUiCoInfo;
    isDark      : boolean;
}
class InfoTypeRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForInfoTypeRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForInfoTypeRenderer>
{
    private readonly _labelType!    : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const labelType = this._labelType;
        labelType.setText(getInfoTypeName(openData.infoType) ?? LangConstants.UndefinedError);
        labelType.setAlpha(openData.isDark ? 0.25 : 1);
    }

    public override onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData != null) {
            openData.component.updateOnSelectedInfoType();
        }
    }
}

interface DataForSkillDescRenderer extends UiTypesUiListItemData.UiListItemData {
    // skillId         : number;
    // configVersion   : string;
    desc            : string;
}
class SkillDescRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForSkillDescRenderer> {
    private readonly _labelDesc!    : UiInterfacesIUiLabel.IUiLabel;

    protected override _doApplyOpenData(): void {
        const label = this._labelDesc;
        label.setText(`- ${this.getOpenData()?.desc || LangConstants.UndefinedError}`);

        this.setUnscaledManualHeight(label.getScaledHeight());
    }
}

function getInfoTypeName(infoType: UiTypesUiCoInfoType.UiCoInfoType): string | null {
    switch (infoType) {
        case UiTypesUiCoInfoType.UiCoInfoType.Basic         : return `INFO`;
        case UiTypesUiCoInfoType.UiCoInfoType.Passive       : return LangUtils.getText(LangConstants.TextType.B0576);
        case UiTypesUiCoInfoType.UiCoInfoType.Power         : return LangUtils.getText(LangConstants.TextType.B0577);
        case UiTypesUiCoInfoType.UiCoInfoType.SuperPower    : return LangUtils.getText(LangConstants.TextType.B0578);
        default                                 : return null;
    }
}

function setTextAndArrange(label: UiInterfacesIUiLabel.IUiLabel, langTextType: LangConstants.TextType): void {
    label.setLangText(langTextType);

    const parent        = label.getParent();
    const layoutClass   = UiUtilsUiFactory.getUiLayoutClass();
    if (parent instanceof layoutClass) {
        parent.arrangeItems();

        const parent2 = parent.getParent();
        if (parent2 instanceof layoutClass) {
            parent2.arrangeItems();
        }
    }
}
