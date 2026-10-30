import { ReplayFilter } from "../../auxiliaryTypes/ReplayFilter.ts";
import { EnergyTypeId } from "../../cos/Constants.ts";
import { getCoMaxEnergy } from "../../cos/Utils.ts";
import { SkillTypeId } from "../../coSkills/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { gotoRwReplayListPanel } from "../../helpers/GameFlow.ts";
import { getCoBust } from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getText,
    getFormattedText,
    getCoSkillDescArray,
    getCurrentLanguageType,
    getCoEnergyTypeName,
    getCoSkillTypeName,
} from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiListItemRenderer } from "./UiListItemRenderer.ts";
import { UiOpenableComponent } from "./UiOpenableComponent.ts";
import type { IUiButton } from "../interfaces/IUiButton.ts";
import type { IUiCoInfo } from "../interfaces/IUiCoInfo.ts";
import type { IUiContainer } from "../interfaces/IUiContainer.ts";
import type { IUiImage } from "../interfaces/IUiImage.ts";
import type { IUiLabel } from "../interfaces/IUiLabel.ts";
import type { IUiLayout } from "../interfaces/IUiLayout.ts";
import type { IUiListItemRenderer } from "../interfaces/IUiListItemRenderer.ts";
import type { IUiScrollList } from "../interfaces/IUiScrollList.ts";
import type { UiCoData } from "../types/UiCoData.ts";
import { UiCoInfoType } from "../types/UiCoInfoType.ts";
import type { UiListItemData } from "../types/UiListItemData.ts";
import { getUiLayoutClass } from "../utils/UiFactory.ts";

export class UiCoInfo extends UiOpenableComponent<UiCoData> implements IUiCoInfo {
    private readonly _groupDorBasicInfo!            : IUiContainer;
    private readonly _layoutDorBasicInfo!           : IUiLayout;
    private readonly _groupDorArtDesigner!          : IUiContainer;
    private readonly _labelDorArtDesignerTitle!     : IUiLabel;
    private readonly _labelDorArtDesigner!          : IUiLabel;
    private readonly _groupDorDataDesigner!         : IUiContainer;
    private readonly _labelDorDataDesignerTitle!    : IUiLabel;
    private readonly _labelDorDataDesigner!         : IUiLabel;
    private readonly _btnDorReplay!                 : IUiButton;

    private readonly _groupDorCoType!               : IUiContainer;
    private readonly _labelDorCoTypeTitle!          : IUiLabel;
    private readonly _labelDorCoType!               : IUiLabel;

    private readonly _groupDorBoardCost!            : IUiContainer;
    private readonly _labelDorBoardCostTitle!       : IUiLabel;
    private readonly _labelDorBoardCost!            : IUiLabel;

    private readonly _groupDorZoneRadius!           : IUiContainer;
    private readonly _labelDorZoneRadiusTitle!      : IUiLabel;
    private readonly _labelDorZoneRadius!           : IUiLabel;

    private readonly _groupDorZoneExpansion!        : IUiContainer;
    private readonly _labelDorZoneExpansionTitle!   : IUiLabel;
    private readonly _labelDorZoneExpansion!        : IUiLabel;

    private readonly _groupDorMaxEnergy!            : IUiContainer;
    private readonly _labelDorMaxEnergyTitle!       : IUiLabel;
    private readonly _labelDorMaxEnergy!            : IUiLabel;

    private readonly _groupDorEnergyBar!            : IUiContainer;
    private readonly _labelDorEnergyBarTitle!       : IUiLabel;
    private readonly _labelDorEnergyBar!            : IUiLabel;

    private readonly _groupTriBasicInfo!            : IUiContainer;
    private readonly _layoutTriBasicInfo!           : IUiLayout;
    private readonly _labelTriArtDesignerTitle!     : IUiLabel;
    private readonly _labelTriArtDesigner!          : IUiLabel;
    private readonly _labelTriDataDesignerTitle!    : IUiLabel;
    private readonly _labelTriDataDesigner!         : IUiLabel;
    private readonly _btnTriReplay!                 : IUiButton;

    private readonly _groupTriCoType!               : IUiContainer;
    private readonly _labelTriCoTypeTitle!          : IUiLabel;
    private readonly _labelTriCoType!               : IUiLabel;

    private readonly _groupTriEnergyBar!            : IUiContainer;
    private readonly _labelTriEnergyBarTitle!       : IUiLabel;
    private readonly _labelTriEnergyBar!            : IUiLabel;

    private readonly _groupTriMaxEnergy!            : IUiContainer;
    private readonly _labelTriMaxEnergyTitle!       : IUiLabel;
    private readonly _labelTriMaxEnergy!            : IUiLabel;

    private readonly _groupSkillInfo!               : IUiLayout;
    private readonly _groupSkillType!               : IUiLayout;
    private readonly _labelSkillTypeTitle!          : IUiLabel;
    private readonly _labelSkillType!               : IUiLabel;
    private readonly _groupEnergyCost!              : IUiLayout;
    private readonly _labelEnergyCostTitle!         : IUiLabel;
    private readonly _labelEnergyCost!              : IUiLabel;
    private readonly _layoutSkillDesc!              : IUiLayout;
    private readonly _layoutSkillDescTitle!         : IUiLayout;
    private readonly _labelSkillDescTitle!          : IUiLabel;
    private readonly _groupSkillDescHelp!           : IUiContainer;
    private readonly _listSkillDesc!                : IUiScrollList<DataForSkillDescRenderer>;

    private readonly _listInfoType!                 : IUiScrollList<DataForInfoTypeRenderer>;
    private readonly _imgCoPortrait!                : IUiImage;
    private readonly _labelCoName!                  : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,  callback: this._onNotifyLanguageChanged },
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
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0817),
        });
    }
    private _onTouchedGroupDorBoardCost(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0813),
        });
    }
    private _onTouchedGroupDorZoneRadius(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0814),
        });
    }
    private _onTouchedGroupDorZoneExpansion(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0815),
        });
    }
    private _onTouchedGroupDorMaxEnergy(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const multiplier1 = gameConfig.getDorEnergyGainRateForAttacker();
        const multiplier2 = gameConfig.getDorEnergyGainRateForDefender();
        if ((multiplier1 === 1) && (multiplier2 === 0)) {
            openPanel(getDict().CommonHelpPanel, {
                getContent : () => getText(TextType.A0816),
            });
        } else {
            openPanel(getDict().CommonHelpPanel, {
                getContent : () => getFormattedText(
                    TextType.F0117,
                    multiplier1 === 1 ? `` : ` * ${multiplier1}`,
                    multiplier2 === 1 ? `` : ` * ${multiplier2}`,
                ),
            });
        }
    }
    private _onTouchedGroupDorEnergyBar(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0874),
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

        openPanel(getDict().CommonConfirmPanel, {
            getContent  : () => getText(TextType.A0953),
            callback    : () => gotoRwReplayListPanel({
                usePreviousFilter       : false,
                usePreviousPageIndex    : false,
                filter                  : new ReplayFilter({
                    coCategoryId    : coCategoryId,
                }),
            }),
        });
    }
    private _onTouchedGroupTriCoType(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0817),
        });
    }
    private _onTouchedGroupTriEnergyBar(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0818),
        });
    }
    private _onTouchedGroupTriMaxEnergy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const gameConfig    = openData.gameConfig;
        const param1        = gameConfig.getTrilogyEnergyGainRateForAttacker();
        const param2        = gameConfig.getTrilogyEnergyGainRateForDefender();
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getFormattedText(
                TextType.F0134,
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

        openPanel(getDict().CommonConfirmPanel, {
            getContent  : () => getText(TextType.A0953),
            callback    : () => gotoRwReplayListPanel({
                usePreviousFilter       : false,
                usePreviousPageIndex    : false,
                filter                  : new ReplayFilter({
                    coCategoryId    : coCategoryId,
                }),
            }),
        });
    }
    private _onTouchedGroupSkillType(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0819),
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

        const extraDesc     = getCoSkillDescArray({
            coId            : openData.coId,
            skillType       : skillType,
            gameConfig      : openData.gameConfig,
            languageType    : getCurrentLanguageType(),
            isExtra         : true,
        });
        if (extraDesc) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);

            openPanel(getDict().CommonHelpPanel, {
                getContent : () => extraDesc.map(v => `- ${v}`).join(`\n`),
                getTitle   : () => getText(TextType.B1215),
            });
        }
    }

    public updateOnSelectedInfoType(): void {
        this._updateComponentsForInfo();
    }
    public getSelectedInfoType(): UiCoInfoType | null {
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
                infoType    : UiCoInfoType.Basic,
                skillType   : null,
                component   : this,
                isDark      : false,
            },
            {
                infoType    : UiCoInfoType.Passive,
                skillType   : SkillTypeId.Passive,
                component   : this,
                isDark      : !coBasicCfg?.getPassiveSkillIds()?.length,
            },
            {
                infoType    : UiCoInfoType.Power,
                skillType   : SkillTypeId.Power,
                component   : this,
                isDark      : !coBasicCfg?.getPowerSkillIds()?.length,
            },
            {
                infoType    : UiCoInfoType.SuperPower,
                skillType   : SkillTypeId.SuperPower,
                component   : this,
                isDark      : !coBasicCfg?.getSuperPowerSkillIds()?.length,
            },
        ], undefined, true);
    }

    private _updateComponentsForLanguage(): void {
        setTextAndArrange(this._labelDorArtDesignerTitle, TextType.B0839);
        setTextAndArrange(this._labelDorDataDesignerTitle, TextType.B0840);
        setTextAndArrange(this._labelDorCoTypeTitle, TextType.B1268);
        setTextAndArrange(this._labelDorBoardCostTitle, TextType.B0164);
        setTextAndArrange(this._labelDorZoneRadiusTitle, TextType.B0165);
        setTextAndArrange(this._labelDorZoneExpansionTitle, TextType.B0166);
        setTextAndArrange(this._labelDorMaxEnergyTitle, TextType.B1272);
        setTextAndArrange(this._labelDorEnergyBarTitle, TextType.B1267);
        setTextAndArrange(this._labelTriArtDesignerTitle, TextType.B0839);
        setTextAndArrange(this._labelTriDataDesignerTitle, TextType.B0840);
        setTextAndArrange(this._labelTriCoTypeTitle, TextType.B1268);
        setTextAndArrange(this._labelTriEnergyBarTitle, TextType.B1271);
        setTextAndArrange(this._labelTriMaxEnergyTitle, TextType.B1272);
        setTextAndArrange(this._labelEnergyCostTitle, TextType.B0167);
        setTextAndArrange(this._labelSkillDescTitle, TextType.B1215);
        setTextAndArrange(this._labelSkillTypeTitle, TextType.B1273);

        this._btnDorReplay.setLangText(TextType.B0710);
        this._btnTriReplay.setLangText(TextType.B0710);
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
        imgCoPortrait.loadSource(getCoBust(gameConfig, coId) ?? UndefinedError);

        const infoType = this.getSelectedInfoType();
        if (infoType == null) {
            groupDorBasicInfo.setIsVisible(false);
            groupTriBasicInfo.setIsVisible(false);
            groupSkillInfo.setIsVisible(false);
            return;
        }

        {
            const label = this._labelCoName;
            label.setText(gameConfig.getCoBasicCfg(coId)?.getName() ?? UndefinedError);

            const parent = label.getParent();
            if (parent instanceof getUiLayoutClass()) {
                parent.arrangeItems();
            }
        }

        if (infoType === UiCoInfoType.Basic) {
            const coEnergyType = gameConfig.getCoEnergyType(coId);
            if (coEnergyType === EnergyTypeId.Dor) {
                groupDorBasicInfo.setIsVisible(true);
                groupTriBasicInfo.setIsVisible(false);
                groupSkillInfo.setIsVisible(false);

                this._updateGroupDorBasicInfo();

            } else if (coEnergyType === EnergyTypeId.Trilogy) {
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
        if (coEnergyType !== EnergyTypeId.Dor) {
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
        this._labelDorCoType.setText(getCoEnergyTypeName(coEnergyType) ?? UndefinedError);
        this._labelDorZoneRadius.setText(`${coBasicCfg?.getZoneRadius()}`);
        this._labelDorMaxEnergy.setText(coBasicCfg == null ? `--` : `${getCoMaxEnergy(coBasicCfg)}`);
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
        if (coEnergyType !== EnergyTypeId.Trilogy) {
            return;
        }

        const coBasicCfg                = gameConfig.getCoBasicCfg(coId);
        this._labelTriArtDesigner.setText(coBasicCfg?.getArtDesigner() ?? ``);
        this._labelTriDataDesigner.setText(coBasicCfg?.getDataDesigner() ?? ``);
        this._labelTriCoType.setText(getCoEnergyTypeName(coEnergyType) ?? UndefinedError);
        this._labelTriMaxEnergy.setText(coBasicCfg == null ? `--` : `${getCoMaxEnergy(coBasicCfg)}`);

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
        const skillType             = getExisted(this._listInfoType.getFirstSelectedItem()?.getOpenData()?.skillType);
        const skillIdArray          = gameConfig.getCoSkillArray(coId, skillType) ?? [];
        const hasSkill              = !!skillIdArray.length;
        this._labelSkillType.setText(getCoSkillTypeName(skillType) ?? UndefinedError);

        {
            const groupEnergyCost = this._groupEnergyCost;
            if (!hasSkill) {
                groupEnergyCost.setIsVisible(false);
            } else {
                const labelEnergyCost = this._labelEnergyCost;
                const powerEnergyList = gameConfig.getCoBasicCfg(coId)?.getPowerEnergyList() ?? [];
                if (skillType === SkillTypeId.Passive) {
                    groupEnergyCost.setIsVisible(false);
                } else if (skillType === SkillTypeId.Power) {
                    groupEnergyCost.setIsVisible(true);
                    labelEnergyCost.setText(`${powerEnergyList[0]}`);
                } else if (skillType === SkillTypeId.SuperPower) {
                    groupEnergyCost.setIsVisible(true);
                    labelEnergyCost.setText(`${powerEnergyList[1]}`);
                }
            }
        }

        {
            const hasExtraDesc = getCoSkillDescArray({
                coId            : coId,
                skillType       : skillType,
                gameConfig      : gameConfig,
                languageType    : getCurrentLanguageType(),
                isExtra         : true,
            }) != null;
            this._groupSkillDescHelp.setIsVisible(hasExtraDesc);
            this._layoutSkillDescTitle.setIsTouchEnabled(hasExtraDesc);
        }

        {
            const dataArrayForListSkillDesc : DataForSkillDescRenderer[] = [];
            const descArray                 = getCoSkillDescArray({
                coId            : coId,
                skillType       : skillType,
                gameConfig      : gameConfig,
                languageType    : getCurrentLanguageType(),
                isExtra         : false
            });
            if (!descArray?.length) {
                dataArrayForListSkillDesc.push({ desc: UndefinedError });
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

interface DataForInfoTypeRenderer extends UiListItemData {
    infoType    : UiCoInfoType;
    skillType   : SkillTypeId | null;
    component   : IUiCoInfo;
    isDark      : boolean;
}
class InfoTypeRenderer
    extends     UiListItemRenderer<DataForInfoTypeRenderer>
    implements  IUiListItemRenderer<DataForInfoTypeRenderer>
{
    private readonly _labelType!    : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const labelType = this._labelType;
        labelType.setText(getInfoTypeName(openData.infoType) ?? UndefinedError);
        labelType.setAlpha(openData.isDark ? 0.25 : 1);
    }

    public override onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData != null) {
            openData.component.updateOnSelectedInfoType();
        }
    }
}

interface DataForSkillDescRenderer extends UiListItemData {
    // skillId         : number;
    // configVersion   : string;
    desc            : string;
}
class SkillDescRenderer extends UiListItemRenderer<DataForSkillDescRenderer> {
    private readonly _labelDesc!    : IUiLabel;

    protected override _doApplyOpenData(): void {
        const label = this._labelDesc;
        label.setText(`- ${this.getOpenData()?.desc || UndefinedError}`);

        this.setUnscaledManualHeight(label.getScaledHeight());
    }
}

function getInfoTypeName(infoType: UiCoInfoType): string | null {
    switch (infoType) {
        case UiCoInfoType.Basic         : return `INFO`;
        case UiCoInfoType.Passive       : return getText(TextType.B0576);
        case UiCoInfoType.Power         : return getText(TextType.B0577);
        case UiCoInfoType.SuperPower    : return getText(TextType.B0578);
        default                                 : return null;
    }
}

function setTextAndArrange(label: IUiLabel, langTextType: TextType): void {
    label.setLangText(langTextType);

    const parent        = label.getParent();
    const layoutClass   = getUiLayoutClass();
    if (parent instanceof layoutClass) {
        parent.arrangeItems();

        const parent2 = parent.getParent();
        if (parent2 instanceof layoutClass) {
            parent2.arrangeItems();
        }
    }
}
