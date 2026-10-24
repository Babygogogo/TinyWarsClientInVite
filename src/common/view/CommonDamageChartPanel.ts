import * as CommonModelCommonModel from "../model/CommonModel.ts";
import * as ForceSkinsConstants from "../../forceSkins/Constants.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GameVersionsConstants from "../../gameVersions/Constants.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoConfigUnitTemplateCfg from "../../proto/schema/CommonProto/Config/UnitTemplateCfg.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TilesConstantsCommon from "../../tiles/constants/Common.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UiTypesUiUnitViewData from "../../ui/types/UiUnitViewData.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import * as UnitsUtilsSerialization from "../../units/utils/Serialization.ts";
import * as UsersModel from "../../users/Model.ts";

type UnitTemplateCfg    = ProtoSchemaCommonProtoConfigUnitTemplateCfg.UnitTemplateCfg;

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
    gameConfig   : GameConfigGcData.GcData;
};
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listUnit!             : UiInterfacesIUiScrollList.IUiScrollList<DataForUnitRenderer>;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSwitch!            : UiInterfacesIUiButton.IUiButton;

    private readonly _groupInfo!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _conUnitView!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutName!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelName!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName1!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupDamage!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupDamageTitle!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listInfo!             : UiInterfacesIUiScrollList.IUiScrollList<DataForInfoRenderer>;
    private readonly _listDamageChart!      : UiInterfacesIUiScrollList.IUiScrollList<DataForDamageRenderer>;
    private readonly _layoutDamage1!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _layoutDamage2!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelOffense!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDefense!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMain1!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSub1!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMain2!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSub2!            : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupMoveCost!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupMoveCostTitle!   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutMoveCost1!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _layoutMoveCost2!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMoveCostTitle1!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMoveCostTitle2!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMoveCost1!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMoveCost2!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listMoveCost!         : UiInterfacesIUiScrollList.IUiScrollList<DataForMoveCostRenderer>;

    private _isShowDamage                   = true;
    private readonly _unitView              = new (UiUtilsUiFactory.getUiUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.UnitAnimationTick,           callback: this._onNotifyUnitAnimationTick },
            { type: NotificationsTypeId.TypeId.StateIndicatorTick,          callback: this._onNotifyUnitStateIndicatorTick },
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
        this._unitView.updateOnAnimationTick(CommonModelCommonModel.getUnitAnimationTickCount());
    }

    private _onNotifyUnitStateIndicatorTick(): void {
        this._unitView.updateOnStateIndicatorTick();
    }

    private _onTouchedBtnSwitch(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonTileChartPanel, {
            gameConfig: this.getOpenData()?.gameConfig,
        });
        this.closePanel();
    }

    private _onTouchedGroupDamageTitle(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        this._isShowDamage = false;
        this._updateGroupDamage();
        this._updateGroupMoveCost();
    }

    private _onTouchedGroupMoveCostTitle(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        this._isShowDamage = true;
        this._updateGroupDamage();
        this._updateGroupMoveCost();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.Units);
        this._labelOffense.setLangText(LangConstants.TextType.B0694);
        this._labelDefense.setLangText(LangConstants.TextType.B0695);
        this._labelMain1.setLangText(LangConstants.TextType.B0692);
        this._labelSub1.setLangText(LangConstants.TextType.B0693);
        this._labelMain2.setLangText(LangConstants.TextType.B0692);
        this._labelSub2.setLangText(LangConstants.TextType.B0693);
        this._labelMoveCostTitle1.setLangText(LangConstants.TextType.B0351);
        this._labelMoveCostTitle2.setLangText(LangConstants.TextType.B0351);
        this._labelMoveCost1.setLangText(LangConstants.TextType.B1282);
        this._labelMoveCost2.setLangText(LangConstants.TextType.B1282);

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
        const playerIndex   = PlayersConstants.PlayerIndex.First;
        this._labelName.setText(LangUtils.getUnitName(unitType, gameConfig) ?? LangConstants.UndefinedError);
        this._labelName1.setText(LangUtils.getUnitName(unitType, gameConfig, LangUtils.getSecondaryLanguageType()) ?? LangConstants.UndefinedError);
        this._unitView.update(new UiTypesUiUnitViewData.UiUnitViewData({
            gameConfig          : gameConfig,
            skinId              : ForceSkinsUtils.getDefaultSkinId(playerIndex),
            overridingSkinId    : undefined,
            unitData            : UnitsUtilsSerialization.createDefault({
                gridIndex   : { x: 0, y: 0 },
                playerIndex : playerIndex,
                unitTypeId  : unitType,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }), CommonModelCommonModel.getUnitAnimationTickCount());
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
            const unitTemplateCfg   = HelpersMisc.getExisted(gameConfig.getUnitTemplateCfg(unitType));
            const dataArray         : DataForInfoRenderer[] = HelpersCollection.getNonNullElements([
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
    private _createInfoHp(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer {
        return {
            index           : 0,
            infoType        : UnitInfoType.Hp,
            unitTemplateCfg,
            gameConfig,
        };
    }
    private _createInfoProductionCost(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.ProductionCost,
            unitTemplateCfg,
            gameConfig,
        };
    }
    private _createInfoEnergyPerNormalizedHp(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
        const gameVersion = window.GAME_VERSION;
        if ((gameVersion !== GameVersionsConstants.TypeName.Test) &&
            (gameVersion !== GameVersionsConstants.TypeName.Trilogy)
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
    private _createInfoMovement(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.Movement,
            unitTemplateCfg,
            gameConfig,
        };
    }
    private _createInfoFuel(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.Fuel,
            unitTemplateCfg,
            gameConfig,
        };
    }
    private _createInfoAttackRange(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
        return unitTemplateCfg.getMinAttackRange() == null
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.AttackRange,
                unitTemplateCfg,
                gameConfig,
            };
    }
    private _createInfoVision(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : UnitInfoType.Vision,
            unitTemplateCfg,
            gameConfig,
        };
    }
    private _createInfoPrimaryWeaponAmmo(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
        return unitTemplateCfg.getPrimaryWeaponMaxAmmo() == null
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.PrimaryWeaponAmmo,
                unitTemplateCfg,
                gameConfig,
            };
    }
    private _createInfoBuildMaterial(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
        return unitTemplateCfg.getMaxBuildMaterial() == null
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.BuildMaterial,
                unitTemplateCfg,
                gameConfig,
            };
    }
    private _createInfoProduceMaterial(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
        return unitTemplateCfg.getMaxProduceMaterial() == null
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.ProduceMaterial,
                unitTemplateCfg,
                gameConfig,
            };
    }
    private _createInfoFlareAmmo(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
        return unitTemplateCfg.getFlareMaxAmmo() == null
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.FlareAmmo,
                unitTemplateCfg,
                gameConfig,
            };
    }
    private _createInfoIsDiver(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
        return unitTemplateCfg.getDiveCfg() == null
            ? null
            : {
                index       : 0,
                infoType    : UnitInfoType.IsDiver,
                unitTemplateCfg,
                gameConfig,
            };
    }
    private _createInfoLoadUnit(unitTemplateCfg: UnitTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
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
            const playerIndex       = PlayersConstants.PlayerIndex.First;
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

interface DataForUnitRenderer extends UiTypesUiListItemData.UiListItemData {
    gameConfig      : GameConfigGcData.GcData;
    unitType        : number;
    index           : number;
    panel           : Panel;
}
class UnitRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
    private readonly _conUnitView!  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutName!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelId!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _unitView      = new (UiUtilsUiFactory.getUiUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.UnitAnimationTick,       callback: this._onNotifyUnitAnimationTick },
            { type: NotificationsTypeId.TypeId.StateIndicatorTick,      callback: this._onNotifyUnitStateIndicatorTick },
        ]);
        this._applySettingsForWholeTouch();

        this._conUnitView.addUiChild(this._unitView);
    }

    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(CommonModelCommonModel.getUnitAnimationTickCount());
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
        const playerIndex   = PlayersConstants.PlayerIndex.First;
        this._labelId.setText(`#${unitType}`);
        this._labelName.setText(LangUtils.getUnitName(unitType, gameConfig) ?? LangConstants.UndefinedError);
        this._layoutName.arrangeItems();
        this._unitView.update(new UiTypesUiUnitViewData.UiUnitViewData({
            gameConfig          : gameConfig,
            skinId              : ForceSkinsUtils.getDefaultSkinId(playerIndex),
            overridingSkinId    : undefined,
            unitData            : UnitsUtilsSerialization.createDefault({
                gridIndex   : { x: 0, y: 0 },
                unitTypeId  : unitType,
                playerIndex : playerIndex,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }), CommonModelCommonModel.getUnitAnimationTickCount());
    }

    public onItemTapEvent(): void {
        this.getOpenData()?.panel.updateOnSelectedUnit();
    }
}

interface DataForInfoRenderer extends UiTypesUiListItemData.UiListItemData {
    index           : number;
    infoType        : UnitInfoType;
    unitTemplateCfg : UnitTemplateCfg;
    gameConfig      : GameConfigGcData.GcData;
}
class InfoRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
    private readonly _imgBg!            : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelValue!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupExtra!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelExtraInfo!   : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
            throw HelpersMisc.newError(`Invalid infoType: ${infoType}`);
        }
    }
    private _updateViewAsAttackRange(): void {
        const unit = this.getOpenData()?.unitTemplateCfg;
        if (unit == null) {
            return;
        }

        const minRange  = unit.getMinAttackRange();
        const maxRange  = unit.getMaxAttackRange();
        this._labelTitle.setLangText(LangConstants.TextType.B0696);
        this._labelValue.setText(minRange == null ? `--` : `${minRange} - ${maxRange}`);

        const groupExtra = this._groupExtra;
        if (!unit.getCanAttackAfterMove()) {
            groupExtra.setIsVisible(false);
        } else {
            groupExtra.setIsVisible(true);
            this._labelExtraInfo.setLangText(LangConstants.TextType.B0697);
        }
    }
    private _updateViewAsBuildMaterial(): void {
        const unit = this.getOpenData()?.unitTemplateCfg;
        if (unit == null) {
            return;
        }

        const currentValue          = unit.getMaxBuildMaterial();
        const maxValue              = unit.getMaxBuildMaterial();
        this._labelTitle.setLangText(LangConstants.TextType.BuildMaterial);
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
        this._labelTitle.setLangText(LangConstants.TextType.FlareAmmo);
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
        this._labelTitle.setLangText(LangConstants.TextType.Fuel);
        this._labelValue.setText(`${currentValue} / ${maxValue}`);

        const fuelConsumption   = HelpersMisc.getExisted(unit.getFuelConsumptionPerTurn());
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
        this._labelTitle.setLangText(LangConstants.TextType.Hp);
        this._labelValue.setText(`${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsIsDiver(): void {
        const unit = this.getOpenData()?.unitTemplateCfg;
        this._labelTitle.setLangText(LangConstants.TextType.B0371);
        this._labelValue.setText(unit?.getDiveCfg() != null ? LangUtils.getText(LangConstants.TextType.Yes) : LangUtils.getText(LangConstants.TextType.No));
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsMovement(): void {
        const data = this.getOpenData();
        if (data == null) {
            return;
        }

        const unit                  = data.unitTemplateCfg;
        const currentValue          = unit.getMoveRange();
        this._labelTitle.setLangText(LangConstants.TextType.B0340);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(true);
        this._labelExtraInfo.setText(LangUtils.getMoveTypeName(HelpersMisc.getExisted(unit.getMoveTypeId()), data.gameConfig) ?? LangConstants.UndefinedError);
    }
    private _updateViewAsPrimaryWeaponAmmo(): void {
        const unit = this.getOpenData()?.unitTemplateCfg;
        if (unit == null) {
            return;
        }

        const currentValue  = unit.getPrimaryWeaponMaxAmmo();
        const maxValue      = unit.getPrimaryWeaponMaxAmmo();
        this._labelTitle.setLangText(LangConstants.TextType.PrimaryWeaponAmmo);
        this._labelValue.setText(currentValue == null ? `--` : `${currentValue} / ${maxValue}`);
        this._groupExtra.setIsVisible(false);
        this._labelExtraInfo.setLangText(LangConstants.TextType.B1070);
    }
    private _updateViewAsProduceMaterial(): void {
        const data = this.getOpenData();
        if (data == null) {
            return;
        }

        const unit                  = data.unitTemplateCfg;
        const currentValue          = unit.getMaxProduceMaterial();
        const maxValue              = unit.getMaxProduceMaterial();
        this._labelTitle.setLangText(LangConstants.TextType.ProductionMaterial);
        this._labelValue.setText(currentValue == null ? `--` : `${currentValue} / ${maxValue}`);

        const groupExtra = this._groupExtra;
        if (currentValue == null) {
            groupExtra.setIsVisible(false);
        } else {
            groupExtra.setIsVisible(true);
            this._labelExtraInfo.setText(LangUtils.getUnitName(
                HelpersMisc.getExisted(unit.getProduceUnitTypeId()),
                data.gameConfig
            ) ?? LangConstants.UndefinedError);
        }
    }
    private _updateViewAsProductionCost(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B0341);
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
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B1474)}`);
        this._labelValue.setText(`${energy * gcData.getTrilogyEnergyGainRateForAttacker() / 100} / ${energy * gcData.getTrilogyEnergyGainRateForDefender() / 100}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsVision(): void {
        const unit          = this.getOpenData()?.unitTemplateCfg;
        const currentValue  = unit?.getVisionRange();
        this._labelTitle.setLangText(LangConstants.TextType.VisionRange);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLoadUnit(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B0698);

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
            this._labelExtraInfo.setText(LangUtils.getUnitCategoryName(
                HelpersMisc.getExisted(unit.getLoadUnitCategoryId()),
                data.gameConfig
            ) ?? LangConstants.UndefinedError);
        }
    }
}

interface DataForDamageRenderer extends UiTypesUiListItemData.UiListItemData {
    gameConfig      : GameConfigGcData.GcData;
    index           : number;
    attackUnitType  : number;
    playerIndex     : number;
    targetUnitType? : number;
    targetTileType? : number;
}
class DamageRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForDamageRenderer> {
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBg!                : UiInterfacesIUiImage.IUiImage;
    private readonly _conView!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _tileView!             : UiInterfacesIUiImage.IUiImage;
    private readonly _labelPrimaryAttack!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSecondaryAttack! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPrimaryDefend!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSecondaryDefend! : UiInterfacesIUiLabel.IUiLabel;

    private readonly _unitView              = new (UiUtilsUiFactory.getUiUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.UnitAnimationTick,       callback: this._onNotifyUnitAnimationTick },
            { type: NotificationsTypeId.TypeId.StateIndicatorTick,  callback: this._onNotifyUnitStateIndicatorTick },
        ]);
        this.setIsTouchChildrenEnabled(false);

        this._conView.addUiChild(this._unitView);
    }

    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(CommonModelCommonModel.getUnitAnimationTickCount());
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
            this._unitView.update(new UiTypesUiUnitViewData.UiUnitViewData({
                gameConfig          : gameConfig,
                skinId              : ForceSkinsUtils.getDefaultSkinId(playerIndex),
                overridingSkinId    : undefined,
                unitData            : UnitsUtilsSerialization.createDefault({
                    gridIndex   : { x: 0, y: 0 },
                    unitTypeId  : targetUnitType,
                    playerIndex : playerIndex,
                    unitId      : -1,
                    gcData      : gameConfig,
                }),
            }), CommonModelCommonModel.getUnitAnimationTickCount());

            const attackCfg                 = HelpersMisc.getExisted(gameConfig.getDamageChartCfgs(attackUnitType));
            const targetArmorType           = HelpersMisc.getExisted(gameConfig.getUnitTemplateCfg(targetUnitType)?.getArmorTypeId());
            const primaryAttackDamage       = attackCfg[targetArmorType][UnitsConstants.WeaponTypeId.Primary].getDamage();
            const secondaryAttackDamage     = attackCfg[targetArmorType][UnitsConstants.WeaponTypeId.Secondary].getDamage();
            this._labelPrimaryAttack.setText(primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`);
            this._labelSecondaryAttack.setText(secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`);

            const defendCfg                 = HelpersMisc.getExisted(gameConfig.getDamageChartCfgs(targetUnitType));
            const attackerArmorType         = HelpersMisc.getExisted(gameConfig.getUnitTemplateCfg(attackUnitType)?.getArmorTypeId());
            const primaryDefendDamage       = defendCfg[attackerArmorType][UnitsConstants.WeaponTypeId.Primary].getDamage();
            const secondaryDefendDamage     = defendCfg[attackerArmorType][UnitsConstants.WeaponTypeId.Secondary].getDamage();
            this._labelPrimaryDefend.setText(primaryDefendDamage == null ? `--` : `${primaryDefendDamage}`);
            this._labelSecondaryDefend.setText(secondaryDefendDamage == null ? `--` : `${secondaryDefendDamage}`);

        } else {
            this._unitView.setIsVisible(false);
            this._tileView.setIsVisible(true);

            const targetTileType            = HelpersMisc.getExisted(openData.targetTileType);
            const attackCfg                 = HelpersMisc.getExisted(gameConfig.getDamageChartCfgs(attackUnitType));
            const targetCfg                 = HelpersMisc.getExisted(gameConfig.getTileTemplateCfg(targetTileType));
            const targetArmorType           = HelpersMisc.getExisted(targetCfg.getArmorTypeId());
            const primaryAttackDamage       = attackCfg[targetArmorType][UnitsConstants.WeaponTypeId.Primary].getDamage();
            const secondaryAttackDamage     = attackCfg[targetArmorType][UnitsConstants.WeaponTypeId.Secondary].getDamage();
            this._tileView.loadSource(CommonModelCommonModel.getCachedTileObjectImageSource({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                themeType   : TilesConstantsCommon.ThemeTypeId.Normal,
                skinId      : ForceSkinsConstants.SkinId.Neutral,
                objectType  : HelpersMisc.getExisted(gameConfig.getTileObjectTypeByTileType(targetTileType)),
                isDark      : false,
                shapeId     : 0,
                tickCount   : CommonModelCommonModel.getTileAnimationTickCount(),
            }));
            this._labelPrimaryAttack.setText(primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`);
            this._labelSecondaryAttack.setText(secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`);
            this._labelPrimaryDefend.setText(`--`);
            this._labelSecondaryDefend.setText(`--`);
        }
    }
}

interface DataForMoveCostRenderer extends UiTypesUiListItemData.UiListItemData {
    index           : number;
    gameConfig      : GameConfigGcData.GcData;
    tileType        : number;
    unitType        : number;
}
class MoveCostRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForMoveCostRenderer> {
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBg!            : UiInterfacesIUiImage.IUiImage;
    private readonly _conView!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelMoveCost!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _tileView          = new (UiUtilsUiFactory.getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.TileAnimationTick,   callback: this._onNotifyTileAnimationTick },
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
        const moveCostCfg   = HelpersMisc.getExisted(gameConfig.getMoveCostCfg(tileType));
        const moveCost      = moveCostCfg[HelpersMisc.getExisted(gameConfig.getUnitTemplateCfg(openData.unitType)?.getMoveTypeId())].getCost();
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
            skinId                  : PlayersConstants.PlayerIndex.Neutral,
            overridingSkinId        : undefined,
            gameConfig              : gameConfig,
        });
        tileView.updateView();
    }
}
