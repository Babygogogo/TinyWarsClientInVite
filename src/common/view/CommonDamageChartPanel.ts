import { getUnitAnimationTickCount, getCachedTileObjectImageSource, getTileAnimationTickCount } from "../model/CommonModel.ts";
import { SkinId } from "../../forceSkins/Constants.ts";
import { getDefaultSkinId } from "../../forceSkins/Utils.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TypeName } from "../../gameVersions/Constants.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getUnitName, getSecondaryLanguageType, getMoveTypeName, getUnitCategoryName } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type { UnitTemplateCfg } from "../../proto/schema/CommonProto/Config/UnitTemplateCfg.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { ThemeTypeId } from "../../tiles/constants/Common.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { UiUnitViewData } from "../../ui/types/UiUnitViewData.ts";
import { getUiUnitViewClass, getUiTileViewClass } from "../../ui/utils/UiFactory.ts";
import { WeaponTypeId } from "../../units/Constants.ts";
import { createDefault } from "../../units/utils/Serialization.ts";
import { getSelfSettingsTextureVersion } from "../../users/Model.ts";

// eslint-disable-next-line no-shadow
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
    gameConfig   : GameConfig;
};
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _listUnit!             : IUiScrollList<DataForUnitRenderer>;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnSwitch!            : IUiButton;

    private readonly _groupInfo!            : IUiContainer;
    private readonly _conUnitView!          : IUiContainer;
    private readonly _layoutName!           : IUiLayout;
    private readonly _labelName!            : IUiLabel;
    private readonly _labelName1!           : IUiLabel;

    private readonly _groupDamage!          : IUiContainer;
    private readonly _groupDamageTitle!     : IUiContainer;
    private readonly _listInfo!             : IUiScrollList<DataForInfoRenderer>;
    private readonly _listDamageChart!      : IUiScrollList<DataForDamageRenderer>;
    private readonly _layoutDamage1!        : IUiLayout;
    private readonly _layoutDamage2!        : IUiLayout;
    private readonly _labelOffense!         : IUiLabel;
    private readonly _labelDefense!         : IUiLabel;
    private readonly _labelMain1!           : IUiLabel;
    private readonly _labelSub1!            : IUiLabel;
    private readonly _labelMain2!           : IUiLabel;
    private readonly _labelSub2!            : IUiLabel;

    private readonly _groupMoveCost!        : IUiContainer;
    private readonly _groupMoveCostTitle!   : IUiContainer;
    private readonly _layoutMoveCost1!      : IUiLayout;
    private readonly _layoutMoveCost2!      : IUiLayout;
    private readonly _labelMoveCostTitle1!  : IUiLabel;
    private readonly _labelMoveCostTitle2!  : IUiLabel;
    private readonly _labelMoveCost1!       : IUiLabel;
    private readonly _labelMoveCost2!       : IUiLabel;
    private readonly _listMoveCost!         : IUiScrollList<DataForMoveCostRenderer>;

    private _isShowDamage                   = true;
    private readonly _unitView              = new (getUiUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.UnitAnimationTick,           callback: this._onNotifyUnitAnimationTick },
            { type: TypeId.StateIndicatorTick,          callback: this._onNotifyUnitStateIndicatorTick },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnSwitch,          callback: this._onTouchedBtnSwitch },
            { ui: this._groupDamageTitle,   callback: this._onTouchedGroupDamageTitle },
            { ui: this._groupMoveCostTitle, callback: this._onTouchedGroupMoveCostTitle },
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
        this._unitView.updateOnAnimationTick(getUnitAnimationTickCount());
    }

    private _onNotifyUnitStateIndicatorTick(): void {
        this._unitView.updateOnStateIndicatorTick();
    }

    private _onTouchedBtnSwitch(): void {
        openPanel(getDict().CommonTileChartPanel, {
            gameConfig: this.getOpenData()?.gameConfig,
        });
        this.closePanel();
    }

    private _onTouchedGroupDamageTitle(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        this._isShowDamage = false;
        this._updateGroupDamage();
        this._updateGroupMoveCost();
    }

    private _onTouchedGroupMoveCostTitle(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        this._isShowDamage = true;
        this._updateGroupDamage();
        this._updateGroupMoveCost();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.Units);
        this._labelOffense.setLangText(TextType.B0694);
        this._labelDefense.setLangText(TextType.B0695);
        this._labelMain1.setLangText(TextType.B0692);
        this._labelSub1.setLangText(TextType.B0693);
        this._labelMain2.setLangText(TextType.B0692);
        this._labelSub2.setLangText(TextType.B0693);
        this._labelMoveCostTitle1.setLangText(TextType.B0351);
        this._labelMoveCostTitle2.setLangText(TextType.B0351);
        this._labelMoveCost1.setLangText(TextType.B1282);
        this._labelMoveCost2.setLangText(TextType.B1282);

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
        const playerIndex   = PlayerIndex.First;
        this._labelName.setText(getUnitName(unitType, gameConfig) ?? UndefinedError);
        this._labelName1.setText(getUnitName(unitType, gameConfig, getSecondaryLanguageType()) ?? UndefinedError);
        this._unitView.update(new UiUnitViewData({
            gameConfig          : gameConfig,
            skinId              : getDefaultSkinId(playerIndex),
            overridingSkinId    : undefined,
            unitData            : createDefault({
                gridIndex   : { x: 0, y: 0 },
                playerIndex : playerIndex,
                unitTypeId  : unitType,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }), getUnitAnimationTickCount());
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
            const unitTemplateCfg   = getExisted(gameConfig.getUnitTemplateCfg(unitType));
            const dataArray         : DataForInfoRenderer[] = getNonNullElements([
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
    private _createInfoHp(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer {
        return {
            index           : 0,
            infoType        : UnitInfoType.Hp,
            unitTemplateCfg,
            gameConfig,
        };
    }
    private _createInfoProductionCost(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.ProductionCost,
            unitTemplateCfg,
            gameConfig,
        };
    }
    private _createInfoEnergyPerNormalizedHp(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
        const gameVersion = window.GAME_VERSION;
        if ((gameVersion !== TypeName.Test) &&
            (gameVersion !== TypeName.Trilogy)
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
    private _createInfoMovement(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.Movement,
            unitTemplateCfg,
            gameConfig,
        };
    }
    private _createInfoFuel(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.Fuel,
            unitTemplateCfg,
            gameConfig,
        };
    }
    private _createInfoAttackRange(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
        return unitTemplateCfg.getMinAttackRange() == null
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.AttackRange,
                unitTemplateCfg,
                gameConfig,
            };
    }
    private _createInfoVision(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.Vision,
            unitTemplateCfg,
            gameConfig,
        };
    }
    private _createInfoPrimaryWeaponAmmo(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
        return unitTemplateCfg.getPrimaryWeaponMaxAmmo() == null
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.PrimaryWeaponAmmo,
                unitTemplateCfg,
                gameConfig,
            };
    }
    private _createInfoBuildMaterial(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
        return unitTemplateCfg.getMaxBuildMaterial() == null
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.BuildMaterial,
                unitTemplateCfg,
                gameConfig,
            };
    }
    private _createInfoProduceMaterial(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
        return unitTemplateCfg.getMaxProduceMaterial() == null
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.ProduceMaterial,
                unitTemplateCfg,
                gameConfig,
            };
    }
    private _createInfoFlareAmmo(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
        return unitTemplateCfg.getFlareMaxAmmo() == null
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.FlareAmmo,
                unitTemplateCfg,
                gameConfig,
            };
    }
    private _createInfoIsDiver(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
        return unitTemplateCfg.getDiveCfg() == null
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.IsDiver,
                unitTemplateCfg,
                gameConfig,
            };
    }
    private _createInfoLoadUnit(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
        return unitTemplateCfg.getLoadUnitCategoryId() == null
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.LoadUnit,
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
            const playerIndex       = PlayerIndex.First;
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
                    index           : index,
                    gameConfig      : gameConfig,
                    attackUnitType  : attackUnitType,
                    targetTileType  : targetTileType,
                    playerIndex     : playerIndex,
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
                    tileType    : tileType,
                    gameConfig  : gameConfig,
                    unitType    : unitType,
                    index       : index++,
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
                unitType: unitTypes[index],
                panel   : this,
            });
        }

        return data;
    }
}

interface DataForUnitRenderer extends UiListItemData {
    gameConfig      : GameConfig;
    unitType        : number;
    index           : number;
    panel           : Panel;
}
class UnitRenderer extends UiListItemRenderer<DataForUnitRenderer> {
    private readonly _conUnitView!  : IUiContainer;
    private readonly _layoutName!   : IUiLayout;
    private readonly _labelId!      : IUiLabel;
    private readonly _labelName!    : IUiLabel;

    private readonly _unitView      = new (getUiUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.UnitAnimationTick,       callback: this._onNotifyUnitAnimationTick },
            { type: TypeId.StateIndicatorTick,      callback: this._onNotifyUnitStateIndicatorTick },
        ]);
        this._applySettingsForWholeTouch();

        this._conUnitView.addUiChild(this._unitView);
    }

    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(getUnitAnimationTickCount());
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
        const playerIndex   = PlayerIndex.First;
        this._labelId.setText(`#${unitType}`);
        this._labelName.setText(getUnitName(unitType, gameConfig) ?? UndefinedError);
        this._layoutName.arrangeItems();
        this._unitView.update(new UiUnitViewData({
            gameConfig          : gameConfig,
            skinId              : getDefaultSkinId(playerIndex),
            overridingSkinId    : undefined,
            unitData            : createDefault({
                gridIndex   : { x: 0, y: 0 },
                unitTypeId  : unitType,
                playerIndex : playerIndex,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }), getUnitAnimationTickCount());
    }

    public onItemTapEvent(): void {
        this.getOpenData()?.panel.updateOnSelectedUnit();
    }
}

interface DataForInfoRenderer extends UiListItemData {
    index           : number;
    infoType        : UnitInfoType;
    unitTemplateCfg : UnitTemplateCfg;
    gameConfig      : GameConfig;
}
class InfoRenderer extends UiListItemRenderer<DataForInfoRenderer> {
    private readonly _imgBg!            : IUiImage;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _labelValue!       : IUiLabel;
    private readonly _groupExtra!       : IUiContainer;
    private readonly _labelExtraInfo!   : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
            throw newError(`Invalid infoType: ${infoType}`);
        }
    }
    private _updateViewAsAttackRange(): void {
        const unit = this.getOpenData()?.unitTemplateCfg;
        if (unit == null) {
            return;
        }

        const minRange  = unit.getMinAttackRange();
        const maxRange  = unit.getMaxAttackRange();
        this._labelTitle.setLangText(TextType.B0696);
        this._labelValue.setText(minRange == null ? `--` : `${minRange} - ${maxRange}`);

        const groupExtra = this._groupExtra;
        if (!unit.getCanAttackAfterMove()) {
            groupExtra.setIsVisible(false);
        } else {
            groupExtra.setIsVisible(true);
            this._labelExtraInfo.setLangText(TextType.B0697);
        }
    }
    private _updateViewAsBuildMaterial(): void {
        const unit = this.getOpenData()?.unitTemplateCfg;
        if (unit == null) {
            return;
        }

        const currentValue          = unit.getMaxBuildMaterial();
        const maxValue              = unit.getMaxBuildMaterial();
        this._labelTitle.setLangText(TextType.BuildMaterial);
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
        this._labelTitle.setLangText(TextType.FlareAmmo);
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
        this._labelTitle.setLangText(TextType.Fuel);
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
        this._labelTitle.setLangText(TextType.Hp);
        this._labelValue.setText(`${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsIsDiver(): void {
        const unit = this.getOpenData()?.unitTemplateCfg;
        this._labelTitle.setLangText(TextType.B0371);
        this._labelValue.setLangText(unit?.getDiveCfg() != null ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsMovement(): void {
        const data = this.getOpenData();
        if (data == null) {
            return;
        }

        const unit                  = data.unitTemplateCfg;
        const currentValue          = unit.getMoveRange();
        this._labelTitle.setLangText(TextType.B0340);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(true);
        this._labelExtraInfo.setText(getMoveTypeName(unit.getMoveTypeId(), data.gameConfig) ?? UndefinedError);
    }
    private _updateViewAsPrimaryWeaponAmmo(): void {
        const unit = this.getOpenData()?.unitTemplateCfg;
        if (unit == null) {
            return;
        }

        const currentValue  = unit.getPrimaryWeaponMaxAmmo();
        const maxValue      = unit.getPrimaryWeaponMaxAmmo();
        this._labelTitle.setLangText(TextType.PrimaryWeaponAmmo);
        this._labelValue.setText(currentValue == null ? `--` : `${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
        this._labelExtraInfo.setLangText(TextType.B1070);
    }
    private _updateViewAsProduceMaterial(): void {
        const data = this.getOpenData();
        if (data == null) {
            return;
        }

        const unit                  = data.unitTemplateCfg;
        const currentValue          = unit.getMaxProduceMaterial();
        const maxValue              = unit.getMaxProduceMaterial();
        this._labelTitle.setLangText(TextType.ProductionMaterial);
        this._labelValue.setText(currentValue == null ? `--` : `${currentValue} / ${maxValue}`);

        const groupExtra = this._groupExtra;
        if (currentValue == null) {
            groupExtra.setIsVisible(false);
        } else {
            groupExtra.setIsVisible(true);
            this._labelExtraInfo.setText(getUnitName(
                getExisted(unit.getProduceUnitTypeId()),
                data.gameConfig
            ) ?? UndefinedError);
        }
    }
    private _updateViewAsProductionCost(): void {
        this._labelTitle.setLangText(TextType.B0341);
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
        this._labelTitle.setLangText(TextType.B1474);
        this._labelValue.setText(`${energy * gcData.getTrilogyEnergyGainRateForAttacker() / 100} / ${energy * gcData.getTrilogyEnergyGainRateForDefender() / 100}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsVision(): void {
        const unit          = this.getOpenData()?.unitTemplateCfg;
        const currentValue  = unit?.getVisionRange();
        this._labelTitle.setLangText(TextType.VisionRange);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLoadUnit(): void {
        this._labelTitle.setLangText(TextType.B0698);

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
            this._labelExtraInfo.setText(getUnitCategoryName(
                getExisted(unit.getLoadUnitCategoryId()),
                data.gameConfig
            ) ?? UndefinedError);
        }
    }
}

interface DataForDamageRenderer extends UiListItemData {
    gameConfig      : GameConfig;
    index           : number;
    attackUnitType  : number;
    playerIndex     : number;
    targetUnitType? : number;
    targetTileType? : number;
}
class DamageRenderer extends UiListItemRenderer<DataForDamageRenderer> {
    private readonly _group!                : IUiContainer;
    private readonly _imgBg!                : IUiImage;
    private readonly _conView!              : IUiContainer;
    private readonly _tileView!             : IUiImage;
    private readonly _labelPrimaryAttack!   : IUiLabel;
    private readonly _labelSecondaryAttack! : IUiLabel;
    private readonly _labelPrimaryDefend!   : IUiLabel;
    private readonly _labelSecondaryDefend! : IUiLabel;

    private readonly _unitView              = new (getUiUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.UnitAnimationTick,       callback: this._onNotifyUnitAnimationTick },
            { type: TypeId.StateIndicatorTick,  callback: this._onNotifyUnitStateIndicatorTick },
        ]);
        this.setIsTouchChildrenEnabled(false);

        this._conView.addUiChild(this._unitView);
    }

    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(getUnitAnimationTickCount());
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
            this._unitView.update(new UiUnitViewData({
                gameConfig          : gameConfig,
                skinId              : getDefaultSkinId(playerIndex),
                overridingSkinId    : undefined,
                unitData            : createDefault({
                    gridIndex   : { x: 0, y: 0 },
                    unitTypeId  : targetUnitType,
                    playerIndex : playerIndex,
                    unitId      : -1,
                    gcData      : gameConfig,
                }),
            }), getUnitAnimationTickCount());

            const attackCfg                 = getExisted(gameConfig.getDamageChartCfgs(attackUnitType));
            const targetArmorType           = getExisted(gameConfig.getUnitTemplateCfg(targetUnitType)?.getArmorTypeId());
            const primaryAttackDamage       = attackCfg[targetArmorType][WeaponTypeId.Primary].getDamage();
            const secondaryAttackDamage     = attackCfg[targetArmorType][WeaponTypeId.Secondary].getDamage();
            this._labelPrimaryAttack.setText(primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`);
            this._labelSecondaryAttack.setText(secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`);

            const defendCfg                 = getExisted(gameConfig.getDamageChartCfgs(targetUnitType));
            const attackerArmorType         = getExisted(gameConfig.getUnitTemplateCfg(attackUnitType)?.getArmorTypeId());
            const primaryDefendDamage       = defendCfg[attackerArmorType][WeaponTypeId.Primary].getDamage();
            const secondaryDefendDamage     = defendCfg[attackerArmorType][WeaponTypeId.Secondary].getDamage();
            this._labelPrimaryDefend.setText(primaryDefendDamage == null ? `--` : `${primaryDefendDamage}`);
            this._labelSecondaryDefend.setText(secondaryDefendDamage == null ? `--` : `${secondaryDefendDamage}`);

        } else {
            this._unitView.setIsVisible(false);
            this._tileView.setIsVisible(true);

            const targetTileType            = getExisted(openData.targetTileType);
            const attackCfg                 = getExisted(gameConfig.getDamageChartCfgs(attackUnitType));
            const targetCfg                 = getExisted(gameConfig.getTileTemplateCfg(targetTileType));
            const targetArmorType           = getExisted(targetCfg.getArmorTypeId());
            const primaryAttackDamage       = attackCfg[targetArmorType][WeaponTypeId.Primary].getDamage();
            const secondaryAttackDamage     = attackCfg[targetArmorType][WeaponTypeId.Secondary].getDamage();
            this._tileView.loadSource(getCachedTileObjectImageSource({
                version     : getSelfSettingsTextureVersion(),
                themeType   : ThemeTypeId.Normal,
                skinId      : SkinId.Neutral,
                objectType  : getExisted(gameConfig.getTileObjectTypeByTileType(targetTileType)),
                isDark      : false,
                shapeId     : 0,
                tickCount   : getTileAnimationTickCount(),
            }));
            this._labelPrimaryAttack.setText(primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`);
            this._labelSecondaryAttack.setText(secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`);
            this._labelPrimaryDefend.setText(`--`);
            this._labelSecondaryDefend.setText(`--`);
        }
    }
}

interface DataForMoveCostRenderer extends UiListItemData {
    index           : number;
    gameConfig      : GameConfig;
    tileType        : number;
    unitType        : number;
}
class MoveCostRenderer extends UiListItemRenderer<DataForMoveCostRenderer> {
    private readonly _group!            : IUiContainer;
    private readonly _imgBg!            : IUiImage;
    private readonly _conView!          : IUiContainer;
    private readonly _labelMoveCost!    : IUiLabel;

    private readonly _tileView          = new (getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.TileAnimationTick,   callback: this._onNotifyTileAnimationTick },
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
        const moveCostCfg   = getExisted(gameConfig.getMoveCostCfg(tileType));
        const moveCost      = moveCostCfg[getExisted(gameConfig.getUnitTemplateCfg(openData.unitType)?.getMoveTypeId())].getCost();
        this._labelMoveCost.setText(moveCost != null ? `${moveCost}` : `--`);

        const tileView          = this._tileView;
        const tileTemplateCfg   = gameConfig.getTileTemplateCfg(tileType);
        tileView.init({
            tileBaseType            : tileTemplateCfg?.getToTileBaseTypeId() ?? null,
            tileBaseShapeId         : 0,
            tileDecorationType      : null,
            tileDecorationShapeId   : null,
            tileObjectType          : tileTemplateCfg?.getToTileObjectTypeId() ?? null,
            tileObjectShapeId       : 0,
            skinId                  : PlayerIndex.Neutral,
            overridingSkinId        : undefined,
            gameConfig              : gameConfig,
        });
        tileView.updateView();
    }
}
