import {
    Common_Model_CommonModel,
    ForceSkins_Utils,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    Helpers_Collection,
    GamePanels_Manager,
    Players_Constants,
    Sounds_SoundPlayer,
    Sounds_Constants,
    ForceSkins_Constants,
    Lang_Constants,
    Tiles_Constants_Common,
    GameVersions_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Ui_Components_UiTileView,
    Ui_Components_UiUnitView,
    Ui_Types_UiUnitViewData,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
    Units_Utils_Serialization,
    Users_Model,
    Units_Constants,
} from "../../internal.ts";
import type { UnitTemplateCfg } from "../../proto/schema/CommonProto/Config/UnitTemplateCfg.ts";

 
const enum UnitInfoType {
    Hp,
    ProductionCost,
    EnergyPerNormalizedHp,
    Movement,
    Fuel,
    AttackRange,
    Vision,
    PrimaryWeaponAmmo,
    FlareAmmo,
    BuildMaterial,
    ProduceMaterial,
    IsDiver,
    LoadUnit,
}
export type OpenData = {
    gameConfig   : GameConfigs_GameConfig.GameConfig;
};
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listUnit!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForUnitRenderer>;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSwitch!            : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupInfo!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _conUnitView!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutName!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelName!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName1!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupDamage!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupDamageTitle!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listInfo!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForInfoRenderer>;
    private readonly _listDamageChart!      : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForDamageRenderer>;
    private readonly _layoutDamage1!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _layoutDamage2!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelOffense!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDefense!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMain1!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSub1!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMain2!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSub2!            : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupMoveCost!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupMoveCostTitle!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutMoveCost1!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _layoutMoveCost2!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMoveCostTitle1!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMoveCostTitle2!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMoveCost1!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMoveCost2!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listMoveCost!         : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForMoveCostRenderer>;

    private _isShowDamage                   = true;
    private readonly _unitView              = new Ui_Components_UiUnitView.UiUnitView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",             callback : this._onNotifyLanguageChanged },
            { type : "UnitAnimationTick",           callback : this._onNotifyUnitAnimationTick },
            { type : "StateIndicatorTick",          callback : this._onNotifyUnitStateIndicatorTick },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,           callback : this.closePanel },
            { ui : this._btnSwitch,          callback : this._onTouchedBtnSwitch },
            { ui : this._groupDamageTitle,   callback : this._onTouchedGroupDamageTitle },
            { ui : this._groupMoveCostTitle, callback : this._onTouchedGroupMoveCostTitle },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listUnit.setItemRendererClass(UnitRenderer);
        this._listDamageChart.setItemRendererClass(DamageRenderer);
        this._listInfo.setItemRendererClass(InfoRenderer);
        this._listMoveCost.setItemRendererClass(MoveCostRenderer);

        this._conUnitView.addUiChild(this._unitView);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const listUnit = this._listUnit;
        await listUnit.bindData(this._createDataForListUnit(), true);

        this._updateComponentsForLanguage();
        this.updateOnSelectedUnit();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listDamageChart.removeAllItems(),
            this._listInfo.removeAllItems(),
            this._listMoveCost.removeAllItems(),
            this._listUnit.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public updateOnSelectedUnit(): void {
        this._updateUnitViewAndLabelName();
        this._updateListInfo();
        this._updateGroupDamage();
        this._updateGroupMoveCost();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(Common_Model_CommonModel.getUnitAnimationTickCount());
    }

    private _onNotifyUnitStateIndicatorTick(): void {
        this._unitView.updateOnStateIndicatorTick();
    }

    private _onTouchedBtnSwitch(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonTileChartPanel, {
            gameConfig : this.getOpenData()?.gameConfig,
        });
        this.closePanel();
    }

    private _onTouchedGroupDamageTitle(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        this._isShowDamage = false;
        this._updateGroupDamage();
        this._updateGroupMoveCost();
    }

    private _onTouchedGroupMoveCostTitle(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        this._isShowDamage = true;
        this._updateGroupDamage();
        this._updateGroupMoveCost();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.Units);
        this._labelOffense.setLangText(Lang_Constants.TextType.B0694);
        this._labelDefense.setLangText(Lang_Constants.TextType.B0695);
        this._labelMain1.setLangText(Lang_Constants.TextType.B0692);
        this._labelSub1.setLangText(Lang_Constants.TextType.B0693);
        this._labelMain2.setLangText(Lang_Constants.TextType.B0692);
        this._labelSub2.setLangText(Lang_Constants.TextType.B0693);
        this._labelMoveCostTitle1.setLangText(Lang_Constants.TextType.B0351);
        this._labelMoveCostTitle2.setLangText(Lang_Constants.TextType.B0351);
        this._labelMoveCost1.setLangText(Lang_Constants.TextType.B1282);
        this._labelMoveCost2.setLangText(Lang_Constants.TextType.B1282);

        this._layoutDamage1.arrangeItems();
        this._layoutDamage2.arrangeItems();
        this._layoutMoveCost1.arrangeItems();
        this._layoutMoveCost2.arrangeItems();
    }

    private _updateUnitViewAndLabelName(): void {
        const data = this._listUnit.getFirstSelectedData();
        if (data == null) {
            return;
        }

        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const unitType      = data.unitType;
        const playerIndex   = Players_Constants.PlayerIndex.First;
        this._labelName.setText(Lang_Utils.getUnitName(unitType, gameConfig) ?? Lang_Constants.UndefinedError);
        this._labelName1.setText(Lang_Utils.getUnitName(unitType, gameConfig, Lang_Utils.getSecondaryLanguageType()) ?? Lang_Constants.UndefinedError);
        this._unitView.update(new Ui_Types_UiUnitViewData.UiUnitViewData({
            gameConfig       : gameConfig,
            skinId           : ForceSkins_Utils.getDefaultSkinId(playerIndex),
            overridingSkinId : undefined,
            unitData         : Units_Utils_Serialization.createDefault({
                gridIndex   : { x : 0, y : 0 },
                playerIndex : playerIndex,
                unitTypeId  : unitType,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }), Common_Model_CommonModel.getUnitAnimationTickCount());
        this._layoutName.arrangeItems();
    }

    private async _updateListInfo(): Promise<void> {
        const unitData  = this._listUnit.getFirstSelectedData();
        const listInfo  = this._listInfo;
        if (unitData == null) {
            await listInfo.removeAllItems();
        } else {
            const gameConfig        = unitData.gameConfig;
            const unitType          = unitData.unitType;
            const unitTemplateCfg   = Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(unitType));
            const dataArray         : DataForInfoRenderer[] = Helpers_Collection.getNonNullElements([
                this._createInfoHp(unitTemplateCfg, gameConfig),
                this._createInfoProductionCost(unitTemplateCfg, gameConfig),
                this._createInfoEnergyPerNormalizedHp(unitTemplateCfg, gameConfig),
                this._createInfoMovement(unitTemplateCfg, gameConfig),
                this._createInfoFuel(unitTemplateCfg, gameConfig),
                this._createInfoAttackRange(unitTemplateCfg, gameConfig),
                this._createInfoVision(unitTemplateCfg, gameConfig),
                this._createInfoPrimaryWeaponAmmo(unitTemplateCfg, gameConfig),
                this._createInfoBuildMaterial(unitTemplateCfg, gameConfig),
                this._createInfoProduceMaterial(unitTemplateCfg, gameConfig),
                this._createInfoFlareAmmo(unitTemplateCfg, gameConfig),
                this._createInfoIsDiver(unitTemplateCfg, gameConfig),
                this._createInfoLoadUnit(unitTemplateCfg, gameConfig),
            ]);
            let index = 0;
            for (const data of dataArray) {
                data.index = index++;
            }

            await listInfo.bindData(dataArray);
        }
    }

    private async _updateGroupDamage(): Promise<void> {
        const group = this._groupDamage;
        if (!this._isShowDamage) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);

            const list = this._listDamageChart;
            await list.bindData(this._createDataForListDamageChart());
            list.scrollTop();
        }
    }

    private async _updateGroupMoveCost(): Promise<void> {
        const group = this._groupMoveCost;
        if (this._isShowDamage) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);

            const list = this._listMoveCost;
            await list.bindData(this._createDataForListMoveCost());
            list.scrollTop();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Util functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _createInfoHp(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer {
        return {
            index    : 0,
            infoType : UnitInfoType.Hp,
            unitTemplateCfg,
            gameConfig,
        };
    }
    private _createInfoProductionCost(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer {
        return {
            index    : 0,
            infoType : UnitInfoType.ProductionCost,
            unitTemplateCfg,
            gameConfig,
        };
    }
    private _createInfoEnergyPerNormalizedHp(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
        const gameVersion = window.GAME_VERSION;
        if ((gameVersion !== GameVersions_Constants.TypeName.Test) &&
            (gameVersion !== GameVersions_Constants.TypeName.Trilogy)
        ) {
            return null;
        } else {
            return {
                index           : 0,
                infoType        : UnitInfoType.EnergyPerNormalizedHp,
                unitTemplateCfg : unitTemplateCfg,
                gameConfig      : gameConfig,
            };
        }
    }
    private _createInfoMovement(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer {
        return {
            index    : 0,
            infoType : UnitInfoType.Movement,
            unitTemplateCfg,
            gameConfig,
        };
    }
    private _createInfoFuel(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer {
        return {
            index    : 0,
            infoType : UnitInfoType.Fuel,
            unitTemplateCfg,
            gameConfig,
        };
    }
    private _createInfoAttackRange(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
        return unitTemplateCfg.getMinAttackRange() == null
            ? null
            : {
                index    : 0,
                infoType : UnitInfoType.AttackRange,
                unitTemplateCfg,
                gameConfig,
            };
    }
    private _createInfoVision(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer {
        return {
            index    : 0,
            infoType : UnitInfoType.Vision,
            unitTemplateCfg,
            gameConfig,
        };
    }
    private _createInfoPrimaryWeaponAmmo(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
        return unitTemplateCfg.getPrimaryWeaponMaxAmmo() == null
            ? null
            : {
                index    : 0,
                infoType : UnitInfoType.PrimaryWeaponAmmo,
                unitTemplateCfg,
                gameConfig,
            };
    }
    private _createInfoBuildMaterial(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
        return unitTemplateCfg.getMaxBuildMaterial() == null
            ? null
            : {
                index    : 0,
                infoType : UnitInfoType.BuildMaterial,
                unitTemplateCfg,
                gameConfig,
            };
    }
    private _createInfoProduceMaterial(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
        return unitTemplateCfg.getMaxProduceMaterial() == null
            ? null
            : {
                index    : 0,
                infoType : UnitInfoType.ProduceMaterial,
                unitTemplateCfg,
                gameConfig,
            };
    }
    private _createInfoFlareAmmo(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
        return unitTemplateCfg.getFlareMaxAmmo() == null
            ? null
            : {
                index    : 0,
                infoType : UnitInfoType.FlareAmmo,
                unitTemplateCfg,
                gameConfig,
            };
    }
    private _createInfoIsDiver(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
        return unitTemplateCfg.getDiveCfg() == null
            ? null
            : {
                index    : 0,
                infoType : UnitInfoType.IsDiver,
                unitTemplateCfg,
                gameConfig,
            };
    }
    private _createInfoLoadUnit(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
        return unitTemplateCfg.getLoadUnitCategoryId() == null
            ? null
            : {
                index    : 0,
                infoType : UnitInfoType.LoadUnit,
                unitTemplateCfg,
                gameConfig,
            };
    }

    private _createDataForListDamageChart(): DataForDamageRenderer[] {
        const dataForUnit   = this._listUnit.getFirstSelectedData();
        const dataArray     : DataForDamageRenderer[] = [];
        if (dataForUnit) {
            const gameConfig        = dataForUnit.gameConfig;
            const attackUnitType    = dataForUnit.unitType;
            const playerIndex       = Players_Constants.PlayerIndex.First;
            let index               = 0;
            for (const targetUnitType of gameConfig.getAllUnitTypeArray()) {
                dataArray.push({
                    index,
                    gameConfig,
                    attackUnitType,
                    targetUnitType,
                    playerIndex,
                });
                ++index;
            }
            for (const targetTileType of gameConfig.getTileTypeArrayForDamageChart()) {
                dataArray.push({
                    index          : index,
                    gameConfig     : gameConfig,
                    attackUnitType : attackUnitType,
                    targetTileType : targetTileType,
                    playerIndex    : playerIndex,
                });
                ++index;
            }
        }

        return dataArray.sort((v1, v2) => v1.attackUnitType - v2.attackUnitType);
    }

    private _createDataForListMoveCost(): DataForMoveCostRenderer[] {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return [];
        }

        const dataArray : DataForMoveCostRenderer[] = [];
        const unitType  = this._listUnit.getFirstSelectedData()?.unitType;
        if (unitType != null) {
            let index           = 0;
            for (const tileType of gameConfig.getTileTypeArrayForTileChart()) {
                dataArray.push({
                    tileType   : tileType,
                    gameConfig : gameConfig,
                    unitType   : unitType,
                    index      : index++,
                });
            }
        }

        return dataArray;
    }

    private _createDataForListUnit(): DataForUnitRenderer[] {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return [];
        }

        const data      : DataForUnitRenderer[] = [];
        const unitTypes = gameConfig.getAllUnitTypeArray();
        for (let index = 0; index < unitTypes.length; ++index) {
            data.push({
                gameConfig,
                index,
                unitType : unitTypes[index],
                panel    : this,
            });
        }

        return data;
    }
}

interface DataForUnitRenderer extends Ui_Types_UiListItemData.UiListItemData {
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    unitType        : number;
    index           : number;
    panel           : Panel;
}
class UnitRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
    private readonly _conUnitView!  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutName!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelId!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _unitView      = new Ui_Components_UiUnitView.UiUnitView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "UnitAnimationTick",       callback : this._onNotifyUnitAnimationTick },
            { type : "StateIndicatorTick",      callback : this._onNotifyUnitStateIndicatorTick },
        ]);
        this._applySettingsForWholeTouch();

        this._conUnitView.addUiChild(this._unitView);
    }

    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(Common_Model_CommonModel.getUnitAnimationTickCount());
    }

    private _onNotifyUnitStateIndicatorTick(): void {
        this._unitView.updateOnStateIndicatorTick();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gameConfig    = openData.gameConfig;
        const unitType      = openData.unitType;
        const playerIndex   = Players_Constants.PlayerIndex.First;
        this._labelId.setText(`#${unitType}`);
        this._labelName.setText(Lang_Utils.getUnitName(unitType, gameConfig) ?? Lang_Constants.UndefinedError);
        this._layoutName.arrangeItems();
        this._unitView.update(new Ui_Types_UiUnitViewData.UiUnitViewData({
            gameConfig       : gameConfig,
            skinId           : ForceSkins_Utils.getDefaultSkinId(playerIndex),
            overridingSkinId : undefined,
            unitData         : Units_Utils_Serialization.createDefault({
                gridIndex   : { x : 0, y : 0 },
                unitTypeId  : unitType,
                playerIndex : playerIndex,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }), Common_Model_CommonModel.getUnitAnimationTickCount());
    }

    public onItemTapEvent(): void {
        this.getOpenData()?.panel.updateOnSelectedUnit();
    }
}

interface DataForInfoRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index           : number;
    infoType        : UnitInfoType;
    unitTemplateCfg : UnitTemplateCfg;
    gameConfig      : GameConfigs_GameConfig.GameConfig;
}
class InfoRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
    private readonly _imgBg!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelValue!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupExtra!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelExtraInfo!   : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged", callback : this._onNotifyLanguageChanged },
        ]);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateView();
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgBg.setIsVisible(openData.index % 2 === 0);

        const infoType = openData.infoType;
        if (infoType === UnitInfoType.AttackRange) {
            this._updateViewAsAttackRange();
        } else if (infoType === UnitInfoType.BuildMaterial) {
            this._updateViewAsBuildMaterial();
        } else if (infoType === UnitInfoType.FlareAmmo) {
            this._updateViewAsFlareAmmo();
        } else if (infoType === UnitInfoType.Fuel) {
            this._updateViewAsFuel();
        } else if (infoType === UnitInfoType.Hp) {
            this._updateViewAsHp();
        } else if (infoType === UnitInfoType.IsDiver) {
            this._updateViewAsIsDiver();
        } else if (infoType === UnitInfoType.Movement) {
            this._updateViewAsMovement();
        } else if (infoType === UnitInfoType.PrimaryWeaponAmmo) {
            this._updateViewAsPrimaryWeaponAmmo();
        } else if (infoType === UnitInfoType.ProduceMaterial) {
            this._updateViewAsProduceMaterial();
        } else if (infoType === UnitInfoType.ProductionCost) {
            this._updateViewAsProductionCost();
        } else if (infoType === UnitInfoType.EnergyPerNormalizedHp) {
            this._updateViewAsEnergyPerNormalizedHp();
        } else if (infoType === UnitInfoType.Vision) {
            this._updateViewAsVision();
        } else if (infoType === UnitInfoType.LoadUnit) {
            this._updateViewAsLoadUnit();
        } else {
            throw Helpers_Misc.newError(`Invalid infoType: ${infoType}`);
        }
    }
    private _updateViewAsAttackRange(): void {
        const unit = this.getOpenData()?.unitTemplateCfg;
        if (unit == null) {
            return;
        }

        const minRange  = unit.getMinAttackRange();
        const maxRange  = unit.getMaxAttackRange();
        this._labelTitle.setLangText(Lang_Constants.TextType.B0696);
        this._labelValue.setText(minRange == null ? `--` : `${minRange} - ${maxRange}`);

        const groupExtra = this._groupExtra;
        if (!unit.getCanAttackAfterMove()) {
            groupExtra.setIsVisible(false);
        } else {
            groupExtra.setIsVisible(true);
            this._labelExtraInfo.setLangText(Lang_Constants.TextType.B0697);
        }
    }
    private _updateViewAsBuildMaterial(): void {
        const unit = this.getOpenData()?.unitTemplateCfg;
        if (unit == null) {
            return;
        }

        const currentValue          = unit.getMaxBuildMaterial();
        const maxValue              = unit.getMaxBuildMaterial();
        this._labelTitle.setLangText(Lang_Constants.TextType.BuildMaterial);
        this._labelValue.setText(currentValue == null ? `--` : `${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsFlareAmmo(): void {
        const unit = this.getOpenData()?.unitTemplateCfg;
        if (unit == null) {
            return;
        }

        const currentValue          = unit.getFlareMaxAmmo();
        const maxValue              = unit.getFlareMaxAmmo();
        this._labelTitle.setLangText(Lang_Constants.TextType.FlareAmmo);
        this._labelValue.setText(currentValue == null ? `--` : `${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsFuel(): void {
        const unit = this.getOpenData()?.unitTemplateCfg;
        if (unit == null) {
            return;
        }

        const currentValue          = unit.getMaxFuel();
        const maxValue              = unit.getMaxFuel();
        this._labelTitle.setLangText(Lang_Constants.TextType.Fuel);
        this._labelValue.setText(`${currentValue} / ${maxValue}`);

        const fuelConsumption   = unit.getFuelConsumptionPerTurn();
        const groupExtra        = this._groupExtra;
        if (fuelConsumption == 0) {
            groupExtra.setIsVisible(false);
        } else {
            groupExtra.setIsVisible(true);
            this._labelExtraInfo.setText(fuelConsumption < 0 ? `+${-fuelConsumption}` : `-${fuelConsumption}`);
        }
    }
    private _updateViewAsHp(): void {
        const unit = this.getOpenData()?.unitTemplateCfg;
        if (unit == null) {
            return;
        }

        const currentValue          = unit.getMaxHp();
        const maxValue              = unit.getMaxHp();
        this._labelTitle.setLangText(Lang_Constants.TextType.Hp);
        this._labelValue.setText(`${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsIsDiver(): void {
        const unit = this.getOpenData()?.unitTemplateCfg;
        this._labelTitle.setLangText(Lang_Constants.TextType.B0371);
        this._labelValue.setLangText(unit?.getDiveCfg() != null ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsMovement(): void {
        const data = this.getOpenData();
        if (data == null) {
            return;
        }

        const unit                  = data.unitTemplateCfg;
        const currentValue          = unit.getMoveRange();
        this._labelTitle.setLangText(Lang_Constants.TextType.B0340);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(true);
        this._labelExtraInfo.setText(Lang_Utils.getMoveTypeName(unit.getMoveTypeId(), data.gameConfig) ?? Lang_Constants.UndefinedError);
    }
    private _updateViewAsPrimaryWeaponAmmo(): void {
        const unit = this.getOpenData()?.unitTemplateCfg;
        if (unit == null) {
            return;
        }

        const currentValue  = unit.getPrimaryWeaponMaxAmmo();
        const maxValue      = unit.getPrimaryWeaponMaxAmmo();
        this._labelTitle.setLangText(Lang_Constants.TextType.PrimaryWeaponAmmo);
        this._labelValue.setText(currentValue == null ? `--` : `${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
        this._labelExtraInfo.setLangText(Lang_Constants.TextType.B1070);
    }
    private _updateViewAsProduceMaterial(): void {
        const data = this.getOpenData();
        if (data == null) {
            return;
        }

        const unit                  = data.unitTemplateCfg;
        const currentValue          = unit.getMaxProduceMaterial();
        const maxValue              = unit.getMaxProduceMaterial();
        this._labelTitle.setLangText(Lang_Constants.TextType.ProductionMaterial);
        this._labelValue.setText(currentValue == null ? `--` : `${currentValue} / ${maxValue}`);

        const groupExtra = this._groupExtra;
        if (currentValue == null) {
            groupExtra.setIsVisible(false);
        } else {
            groupExtra.setIsVisible(true);
            this._labelExtraInfo.setText(Lang_Utils.getUnitName(
                Helpers_Misc.getExisted(unit.getProduceUnitTypeId()),
                data.gameConfig,
            ) ?? Lang_Constants.UndefinedError);
        }
    }
    private _updateViewAsProductionCost(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0341);
        this._labelValue.setText(`${this.getOpenData()?.unitTemplateCfg.getProductionCost()}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsEnergyPerNormalizedHp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const energy    = openData.unitTemplateCfg.getEnergyPerNormalizedHp();
        const gcData    = openData.gameConfig;
        this._labelTitle.setLangText(Lang_Constants.TextType.B1474);
        this._labelValue.setText(`${energy * gcData.getTrilogyEnergyGainRateForAttacker() / 100} / ${energy * gcData.getTrilogyEnergyGainRateForDefender() / 100}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsVision(): void {
        const unit          = this.getOpenData()?.unitTemplateCfg;
        const currentValue  = unit?.getVisionRange();
        this._labelTitle.setLangText(Lang_Constants.TextType.VisionRange);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLoadUnit(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0698);

        const data = this.getOpenData();
        if (data == null) {
            return;
        }

        const unit          = data.unitTemplateCfg;
        const maxValue      = unit.getMaxLoadUnitsCount();
        const labelValue    = this._labelValue;
        const groupExtra    = this._groupExtra;
        if (maxValue == null) {
            labelValue.setText(`--`);
            groupExtra.setIsVisible(false);
        } else {
            labelValue.setText(`0 / ${maxValue}`);
            groupExtra.setIsVisible(true);
            this._labelExtraInfo.setText(Lang_Utils.getUnitCategoryName(
                Helpers_Misc.getExisted(unit.getLoadUnitCategoryId()),
                data.gameConfig,
            ) ?? Lang_Constants.UndefinedError);
        }
    }
}

interface DataForDamageRenderer extends Ui_Types_UiListItemData.UiListItemData {
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    index           : number;
    attackUnitType  : number;
    playerIndex     : number;
    targetUnitType? : number;
    targetTileType? : number;
}
class DamageRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForDamageRenderer> {
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBg!                : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _conView!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _tileView!             : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelPrimaryAttack!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSecondaryAttack! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPrimaryDefend!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSecondaryDefend! : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _unitView              = new Ui_Components_UiUnitView.UiUnitView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "UnitAnimationTick",       callback : this._onNotifyUnitAnimationTick },
            { type : "StateIndicatorTick",  callback : this._onNotifyUnitStateIndicatorTick },
        ]);
        this.setIsTouchChildrenEnabled(false);

        this._conView.addUiChild(this._unitView);
    }

    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(Common_Model_CommonModel.getUnitAnimationTickCount());
    }

    private _onNotifyUnitStateIndicatorTick(): void {
        this._unitView.updateOnStateIndicatorTick();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgBg.setIsVisible(openData.index % 2 === 1);

        const gameConfig        = openData.gameConfig;
        const attackUnitType    = openData.attackUnitType;
        const targetUnitType    = openData.targetUnitType;
        if (targetUnitType != null) {
            const playerIndex = openData.playerIndex;
            this._unitView.setIsVisible(true);
            this._tileView.setIsVisible(false);
            this._unitView.update(new Ui_Types_UiUnitViewData.UiUnitViewData({
                gameConfig       : gameConfig,
                skinId           : ForceSkins_Utils.getDefaultSkinId(playerIndex),
                overridingSkinId : undefined,
                unitData         : Units_Utils_Serialization.createDefault({
                    gridIndex   : { x : 0, y : 0 },
                    unitTypeId  : targetUnitType,
                    playerIndex : playerIndex,
                    unitId      : -1,
                    gcData      : gameConfig,
                }),
            }), Common_Model_CommonModel.getUnitAnimationTickCount());

            const attackCfg                 = Helpers_Misc.getExisted(gameConfig.getDamageChartCfgs(attackUnitType));
            const targetArmorType           = Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(targetUnitType)?.getArmorTypeId());
            const primaryAttackDamage       = attackCfg[targetArmorType][Units_Constants.WeaponTypeId.Primary].getDamage();
            const secondaryAttackDamage     = attackCfg[targetArmorType][Units_Constants.WeaponTypeId.Secondary].getDamage();
            this._labelPrimaryAttack.setText(primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`);
            this._labelSecondaryAttack.setText(secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`);

            const defendCfg                 = Helpers_Misc.getExisted(gameConfig.getDamageChartCfgs(targetUnitType));
            const attackerArmorType         = Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(attackUnitType)?.getArmorTypeId());
            const primaryDefendDamage       = defendCfg[attackerArmorType][Units_Constants.WeaponTypeId.Primary].getDamage();
            const secondaryDefendDamage     = defendCfg[attackerArmorType][Units_Constants.WeaponTypeId.Secondary].getDamage();
            this._labelPrimaryDefend.setText(primaryDefendDamage == null ? `--` : `${primaryDefendDamage}`);
            this._labelSecondaryDefend.setText(secondaryDefendDamage == null ? `--` : `${secondaryDefendDamage}`);

        } else {
            this._unitView.setIsVisible(false);
            this._tileView.setIsVisible(true);

            const targetTileType            = Helpers_Misc.getExisted(openData.targetTileType);
            const attackCfg                 = Helpers_Misc.getExisted(gameConfig.getDamageChartCfgs(attackUnitType));
            const targetCfg                 = Helpers_Misc.getExisted(gameConfig.getTileTemplateCfg(targetTileType));
            const targetArmorType           = Helpers_Misc.getExisted(targetCfg.getArmorTypeId());
            const primaryAttackDamage       = attackCfg[targetArmorType][Units_Constants.WeaponTypeId.Primary].getDamage();
            const secondaryAttackDamage     = attackCfg[targetArmorType][Units_Constants.WeaponTypeId.Secondary].getDamage();
            this._tileView.loadSource(Common_Model_CommonModel.getCachedTileObjectImageSource({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                themeType  : Tiles_Constants_Common.ThemeTypeId.Normal,
                skinId     : ForceSkins_Constants.SkinId.Neutral,
                objectType : Helpers_Misc.getExisted(gameConfig.getTileObjectTypeByTileType(targetTileType)),
                isDark     : false,
                shapeId    : 0,
                tickCount  : Common_Model_CommonModel.getTileAnimationTickCount(),
            }));
            this._labelPrimaryAttack.setText(primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`);
            this._labelSecondaryAttack.setText(secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`);
            this._labelPrimaryDefend.setText(`--`);
            this._labelSecondaryDefend.setText(`--`);
        }
    }
}

interface DataForMoveCostRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index           : number;
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    tileType        : number;
    unitType        : number;
}
class MoveCostRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForMoveCostRenderer> {
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBg!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _conView!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelMoveCost!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _tileView          = new Ui_Components_UiTileView.UiTileView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "TileAnimationTick",   callback : this._onNotifyTileAnimationTick },
        ]);
        this.setIsTouchChildrenEnabled(false);

        const conView   = this._conView;
        const tileView  = this._tileView;
        conView.addUiChild(tileView.getImgBase());
        conView.addUiChild(tileView.getImgDecoration());
        conView.addUiChild(tileView.getImgObject());
    }

    private _onNotifyTileAnimationTick(): void {
        this._tileView.updateOnAnimationTick();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgBg.setIsVisible(openData.index % 4 === 2);

        const gameConfig    = openData.gameConfig;
        const tileType      = openData.tileType;
        const moveCostCfg   = Helpers_Misc.getExisted(gameConfig.getMoveCostCfg(tileType));
        const moveCost      = moveCostCfg[Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(openData.unitType)?.getMoveTypeId())].getCost();
        this._labelMoveCost.setText(moveCost != null ? `${moveCost}` : `--`);

        const tileView          = this._tileView;
        const tileTemplateCfg   = gameConfig.getTileTemplateCfg(tileType);
        tileView.init({
            tileBaseType          : tileTemplateCfg?.getToTileBaseTypeId() ?? null,
            tileBaseShapeId       : 0,
            tileDecorationType    : null,
            tileDecorationShapeId : null,
            tileObjectType        : tileTemplateCfg?.getToTileObjectTypeId() ?? null,
            tileObjectShapeId     : 0,
            skinId                : Players_Constants.PlayerIndex.Neutral,
            overridingSkinId      : undefined,
            gameConfig            : gameConfig,
        });
        tileView.updateView();
    }
}
