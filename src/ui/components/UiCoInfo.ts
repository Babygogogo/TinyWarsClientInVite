import {
    Cos_Constants,
    Helpers_ImageSource,
    Lang_Utils,
    Cos_Utils,
    GamePanels_Dict,
    Helpers_Misc,
    Helpers_GameFlow,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    AuxiliaryTypes_ReplayFilter,
    Sounds_Constants,
    CoSkills_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Types_UiCoInfoType,
    Ui_Components_UiLayout,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiOpenableComponent,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiCoInfo,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiCoData,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export class UiCoInfo extends Ui_Components_UiOpenableComponent.UiOpenableComponent<Ui_Types_UiCoData.UiCoData> implements Ui_Interfaces_IUiCoInfo.IUiCoInfo {
    private readonly _groupDorBasicInfo!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutDorBasicInfo!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _groupDorArtDesigner!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelDorArtDesignerTitle!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDorArtDesigner!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupDorDataDesigner!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelDorDataDesignerTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDorDataDesigner!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnDorReplay!                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupDorCoType!               : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelDorCoTypeTitle!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDorCoType!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupDorBoardCost!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelDorBoardCostTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDorBoardCost!            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupDorZoneRadius!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelDorZoneRadiusTitle!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDorZoneRadius!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupDorZoneExpansion!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelDorZoneExpansionTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDorZoneExpansion!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupDorMaxEnergy!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelDorMaxEnergyTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDorMaxEnergy!            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupDorEnergyBar!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelDorEnergyBarTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDorEnergyBar!            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupTriBasicInfo!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutTriBasicInfo!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelTriArtDesignerTitle!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTriArtDesigner!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTriDataDesignerTitle!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTriDataDesigner!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnTriReplay!                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupTriCoType!               : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTriCoTypeTitle!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTriCoType!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupTriEnergyBar!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTriEnergyBarTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTriEnergyBar!            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupTriMaxEnergy!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTriMaxEnergyTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTriMaxEnergy!            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupSkillInfo!               : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _groupSkillType!               : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelSkillTypeTitle!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSkillType!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupEnergyCost!              : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelEnergyCostTitle!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelEnergyCost!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _layoutSkillDesc!              : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _layoutSkillDescTitle!         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelSkillDescTitle!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupSkillDescHelp!           : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listSkillDesc!                : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForSkillDescRenderer>;

    private readonly _listInfoType!                 : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForInfoTypeRenderer>;
    private readonly _imgCoPortrait!                : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelCoName!                  : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,  callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._groupDorCoType,             callback : this._onTouchedGroupDorCoType },
            { ui : this._groupDorBoardCost,          callback : this._onTouchedGroupDorBoardCost },
            { ui : this._groupDorZoneRadius,         callback : this._onTouchedGroupDorZoneRadius },
            { ui : this._groupDorZoneExpansion,      callback : this._onTouchedGroupDorZoneExpansion },
            { ui : this._groupDorMaxEnergy,          callback : this._onTouchedGroupDorMaxEnergy },
            { ui : this._groupDorEnergyBar,          callback : this._onTouchedGroupDorEnergyBar },
            { ui : this._btnDorReplay,               callback : this._onTouchedBtnDorReplay },

            { ui : this._groupTriCoType,             callback : this._onTouchedGroupTriCoType },
            { ui : this._groupTriEnergyBar,          callback : this._onTouchedGroupTriEnergyBar },
            { ui : this._groupTriMaxEnergy,          callback : this._onTouchedGroupTriMaxEnergy },
            { ui : this._btnTriReplay,               callback : this._onTouchedBtnTriReplay },

            { ui : this._groupSkillType,             callback : this._onTouchedGroupSkillType },
            { ui : this._layoutSkillDescTitle,       callback : this._onTouchedLayoutSkillDescTitle },
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
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0817),
        });
    }
    private _onTouchedGroupDorBoardCost(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0813),
        });
    }
    private _onTouchedGroupDorZoneRadius(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0814),
        });
    }
    private _onTouchedGroupDorZoneExpansion(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0815),
        });
    }
    private _onTouchedGroupDorMaxEnergy(): void {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const multiplier1 = gameConfig.getDorEnergyGainRateForAttacker();
        const multiplier2 = gameConfig.getDorEnergyGainRateForDefender();
        if ((multiplier1 === 1) && (multiplier2 === 0)) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0816),
            });
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getContent : () => Lang_Utils.getFormattedText(
                    Lang_Constants.TextType.F0117,
                    multiplier1 === 1 ? `` : ` * ${multiplier1}`,
                    multiplier2 === 1 ? `` : ` * ${multiplier2}`,
                ),
            });
        }
    }
    private _onTouchedGroupDorEnergyBar(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0874),
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0953),
            callback   : () => Helpers_GameFlow.gotoRwReplayListPanel({
                usePreviousFilter    : false,
                usePreviousPageIndex : false,
                filter               : new AuxiliaryTypes_ReplayFilter.ReplayFilter({
                    coCategoryId : coCategoryId,
                }),
            }),
        });
    }
    private _onTouchedGroupTriCoType(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0817),
        });
    }
    private _onTouchedGroupTriEnergyBar(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0818),
        });
    }
    private _onTouchedGroupTriMaxEnergy(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const gameConfig    = openData.gameConfig;
        const param1        = gameConfig.getTrilogyEnergyGainRateForAttacker();
        const param2        = gameConfig.getTrilogyEnergyGainRateForDefender();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getFormattedText(
                Lang_Constants.TextType.F0134,
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0953),
            callback   : () => Helpers_GameFlow.gotoRwReplayListPanel({
                usePreviousFilter    : false,
                usePreviousPageIndex : false,
                filter               : new AuxiliaryTypes_ReplayFilter.ReplayFilter({
                    coCategoryId : coCategoryId,
                }),
            }),
        });
    }
    private _onTouchedGroupSkillType(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0819),
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

        const extraDesc     = Lang_Utils.getCoSkillDescArray({
            coId         : openData.coId,
            skillType    : skillType,
            gameConfig   : openData.gameConfig,
            languageType : Lang_Utils.getCurrentLanguageType(),
            isExtra      : true,
        });
        if (extraDesc) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getContent : () => extraDesc.map(v => `- ${v}`).join(`\n`),
                getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B1215),
            });
        }
    }

    public updateOnSelectedInfoType(): void {
        this._updateComponentsForInfo();
    }
    public getSelectedInfoType(): Ui_Types_UiCoInfoType.UiCoInfoType | null {
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
                infoType  : Ui_Types_UiCoInfoType.UiCoInfoType.Basic,
                skillType : null,
                component : this,
                isDark    : false,
            },
            {
                infoType  : Ui_Types_UiCoInfoType.UiCoInfoType.Passive,
                skillType : CoSkills_Constants.SkillTypeId.Passive,
                component : this,
                isDark    : !coBasicCfg?.getPassiveSkillIds()?.length,
            },
            {
                infoType  : Ui_Types_UiCoInfoType.UiCoInfoType.Power,
                skillType : CoSkills_Constants.SkillTypeId.Power,
                component : this,
                isDark    : !coBasicCfg?.getPowerSkillIds()?.length,
            },
            {
                infoType  : Ui_Types_UiCoInfoType.UiCoInfoType.SuperPower,
                skillType : CoSkills_Constants.SkillTypeId.SuperPower,
                component : this,
                isDark    : !coBasicCfg?.getSuperPowerSkillIds()?.length,
            },
        ], undefined, true);
    }

    private _updateComponentsForLanguage(): void {
        setTextAndArrange(this._labelDorArtDesignerTitle, Lang_Constants.TextType.B0839);
        setTextAndArrange(this._labelDorDataDesignerTitle, Lang_Constants.TextType.B0840);
        setTextAndArrange(this._labelDorCoTypeTitle, Lang_Constants.TextType.B1268);
        setTextAndArrange(this._labelDorBoardCostTitle, Lang_Constants.TextType.B0164);
        setTextAndArrange(this._labelDorZoneRadiusTitle, Lang_Constants.TextType.B0165);
        setTextAndArrange(this._labelDorZoneExpansionTitle, Lang_Constants.TextType.B0166);
        setTextAndArrange(this._labelDorMaxEnergyTitle, Lang_Constants.TextType.B1272);
        setTextAndArrange(this._labelDorEnergyBarTitle, Lang_Constants.TextType.B1267);
        setTextAndArrange(this._labelTriArtDesignerTitle, Lang_Constants.TextType.B0839);
        setTextAndArrange(this._labelTriDataDesignerTitle, Lang_Constants.TextType.B0840);
        setTextAndArrange(this._labelTriCoTypeTitle, Lang_Constants.TextType.B1268);
        setTextAndArrange(this._labelTriEnergyBarTitle, Lang_Constants.TextType.B1271);
        setTextAndArrange(this._labelTriMaxEnergyTitle, Lang_Constants.TextType.B1272);
        setTextAndArrange(this._labelEnergyCostTitle, Lang_Constants.TextType.B0167);
        setTextAndArrange(this._labelSkillDescTitle, Lang_Constants.TextType.B1215);
        setTextAndArrange(this._labelSkillTypeTitle, Lang_Constants.TextType.B1273);

        this._btnDorReplay.setLangText(Lang_Constants.TextType.B0710);
        this._btnTriReplay.setLangText(Lang_Constants.TextType.B0710);
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
        imgCoPortrait.loadSource(Helpers_ImageSource.getCoBust(gameConfig, coId) ?? Lang_Constants.UndefinedError);

        const infoType = this.getSelectedInfoType();
        if (infoType == null) {
            groupDorBasicInfo.setIsVisible(false);
            groupTriBasicInfo.setIsVisible(false);
            groupSkillInfo.setIsVisible(false);
            return;
        }

        {
            const label = this._labelCoName;
            label.setText(gameConfig.getCoBasicCfg(coId)?.getName() ?? Lang_Constants.UndefinedError);

            const parent = label.getParent();
            if (parent instanceof Ui_Components_UiLayout.UiLayout) {
                parent.arrangeItems();
            }
        }

        if (infoType === Ui_Types_UiCoInfoType.UiCoInfoType.Basic) {
            const coEnergyType = gameConfig.getCoEnergyType(coId);
            if (coEnergyType === Cos_Constants.EnergyTypeId.Dor) {
                groupDorBasicInfo.setIsVisible(true);
                groupTriBasicInfo.setIsVisible(false);
                groupSkillInfo.setIsVisible(false);

                this._updateGroupDorBasicInfo();

            } else if (coEnergyType === Cos_Constants.EnergyTypeId.Trilogy) {
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
        if (coEnergyType !== Cos_Constants.EnergyTypeId.Dor) {
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
        this._labelDorCoType.setText(Lang_Utils.getCoEnergyTypeName(coEnergyType) ?? Lang_Constants.UndefinedError);
        this._labelDorZoneRadius.setText(`${coBasicCfg?.getZoneRadius()}`);
        this._labelDorMaxEnergy.setText(coBasicCfg == null ? `--` : `${Cos_Utils.getCoMaxEnergy(coBasicCfg)}`);
        this._labelDorZoneExpansion.setText((coBasicCfg?.getZoneExpansionEnergyList() || []).join(` / `) || `--`);

        {
            const boardCostPercentage   = coBasicCfg?.getBoardCostPercentage() ?? 0;
            const label                 = this._labelDorBoardCost;
            label.setText(`${boardCostPercentage}%`);
            label.setTextColor(boardCostPercentage === 50
                ? 0xFFFFFF
                : (boardCostPercentage > 50 ? 0xFFFF00 : 0x00FF00),
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
        if (coEnergyType !== Cos_Constants.EnergyTypeId.Trilogy) {
            return;
        }

        const coBasicCfg                = gameConfig.getCoBasicCfg(coId);
        this._labelTriArtDesigner.setText(coBasicCfg?.getArtDesigner() ?? ``);
        this._labelTriDataDesigner.setText(coBasicCfg?.getDataDesigner() ?? ``);
        this._labelTriCoType.setText(Lang_Utils.getCoEnergyTypeName(coEnergyType) ?? Lang_Constants.UndefinedError);
        this._labelTriMaxEnergy.setText(coBasicCfg == null ? `--` : `${Cos_Utils.getCoMaxEnergy(coBasicCfg)}`);

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
        const skillType             = Helpers_Misc.getExisted(this._listInfoType.getFirstSelectedItem()?.getOpenData()?.skillType);
        const skillIdArray          = gameConfig.getCoSkillArray(coId, skillType) ?? [];
        const hasSkill              = !!skillIdArray.length;
        this._labelSkillType.setText(Lang_Utils.getCoSkillTypeName(skillType) ?? Lang_Constants.UndefinedError);

        {
            const groupEnergyCost = this._groupEnergyCost;
            if (!hasSkill) {
                groupEnergyCost.setIsVisible(false);
            } else {
                const labelEnergyCost = this._labelEnergyCost;
                const powerEnergyList = gameConfig.getCoBasicCfg(coId)?.getPowerEnergyList() ?? [];
                if (skillType === CoSkills_Constants.SkillTypeId.Passive) {
                    groupEnergyCost.setIsVisible(false);
                } else if (skillType === CoSkills_Constants.SkillTypeId.Power) {
                    groupEnergyCost.setIsVisible(true);
                    labelEnergyCost.setText(`${powerEnergyList[0]}`);
                } else if (skillType === CoSkills_Constants.SkillTypeId.SuperPower) {
                    groupEnergyCost.setIsVisible(true);
                    labelEnergyCost.setText(`${powerEnergyList[1]}`);
                }
            }
        }

        {
            const hasExtraDesc = Lang_Utils.getCoSkillDescArray({
                coId         : coId,
                skillType    : skillType,
                gameConfig   : gameConfig,
                languageType : Lang_Utils.getCurrentLanguageType(),
                isExtra      : true,
            }) != null;
            this._groupSkillDescHelp.setIsVisible(hasExtraDesc);
            this._layoutSkillDescTitle.setIsTouchEnabled(hasExtraDesc);
        }

        {
            const dataArrayForListSkillDesc : DataForSkillDescRenderer[] = [];
            const descArray                 = Lang_Utils.getCoSkillDescArray({
                coId         : coId,
                skillType    : skillType,
                gameConfig   : gameConfig,
                languageType : Lang_Utils.getCurrentLanguageType(),
                isExtra      : false,
            });
            if (!descArray?.length) {
                dataArrayForListSkillDesc.push({ desc : Lang_Constants.UndefinedError });
            } else {
                for (const desc of descArray) {
                    dataArrayForListSkillDesc.push({
                        desc : desc,
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

interface DataForInfoTypeRenderer extends Ui_Types_UiListItemData.UiListItemData {
    infoType    : Ui_Types_UiCoInfoType.UiCoInfoType;
    skillType   : CoSkills_Constants.SkillTypeId | null;
    component   : Ui_Interfaces_IUiCoInfo.IUiCoInfo;
    isDark      : boolean;
}
class InfoTypeRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForInfoTypeRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForInfoTypeRenderer> {
    private readonly _labelType!    : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const labelType = this._labelType;
        labelType.setText(getInfoTypeName(openData.infoType) ?? Lang_Constants.UndefinedError);
        labelType.setAlpha(openData.isDark ? 0.25 : 1);
    }

    public override onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData != null) {
            openData.component.updateOnSelectedInfoType();
        }
    }
}

interface DataForSkillDescRenderer extends Ui_Types_UiListItemData.UiListItemData {
    // skillId         : number;
    // configVersion   : string;
    desc            : string;
}
class SkillDescRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForSkillDescRenderer> {
    private readonly _labelDesc!    : Ui_Interfaces_IUiLabel.IUiLabel;

    protected override _doApplyOpenData(): void {
        const label = this._labelDesc;
        label.setText(`- ${this.getOpenData()?.desc || Lang_Constants.UndefinedError}`);

        this.setUnscaledManualHeight(label.getScaledHeight());
    }
}

function getInfoTypeName(infoType: Ui_Types_UiCoInfoType.UiCoInfoType): string | null {
    switch (infoType) {
        case Ui_Types_UiCoInfoType.UiCoInfoType.Basic         : return `INFO`;
        case Ui_Types_UiCoInfoType.UiCoInfoType.Passive       : return Lang_Utils.getText(Lang_Constants.TextType.B0576);
        case Ui_Types_UiCoInfoType.UiCoInfoType.Power         : return Lang_Utils.getText(Lang_Constants.TextType.B0577);
        case Ui_Types_UiCoInfoType.UiCoInfoType.SuperPower    : return Lang_Utils.getText(Lang_Constants.TextType.B0578);
        default                                 : return null;
    }
}

function setTextAndArrange(label: Ui_Interfaces_IUiLabel.IUiLabel, langTextType: Lang_Constants.TextType): void {
    label.setLangText(langTextType);

    const parent        = label.getParent();
    const layoutClass   = Ui_Components_UiLayout.UiLayout;
    if (parent instanceof layoutClass) {
        parent.arrangeItems();

        const parent2 = parent.getParent();
        if (parent2 instanceof layoutClass) {
            parent2.arrangeItems();
        }
    }
}
