import * as CommonModelCommonModel from "../model/CommonModel.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersText from "../../helpers/Text.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoConfigTileTemplateCfg from "../../proto/schema/CommonProto/Config/TileTemplateCfg.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TilesConstantsCommon from "../../tiles/constants/Common.ts";
import * as TilesConstantsDefaultCustomTileData from "../../tiles/constants/DefaultCustomTileData.ts";
import * as TilesConstantsMapWeapon from "../../tiles/constants/MapWeapon.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiItemTapEventData from "../../ui/types/UiItemTapEventData.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UiTypesUiUnitViewData from "../../ui/types/UiUnitViewData.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import * as UnitsUtilsSerialization from "../../units/utils/Serialization.ts";

type TileTemplateCfg            = ProtoSchemaCommonProtoConfigTileTemplateCfg.TileTemplateCfg;

export interface OpenData {
    gameConfig   : GameConfigGcData.GcData;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSwitch!            : UiInterfacesIUiButton.IUiButton;

    private readonly _listTile!             : UiInterfacesIUiScrollList.IUiScrollList<DataForTileRenderer>;

    private readonly _groupInfo!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutName!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelName!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName1!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _conTileView!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listInfo!             : UiInterfacesIUiScrollList.IUiScrollList<DataForInfoRenderer>;

    private readonly _groupMoveCost!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutMoveCost1!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMoveCostTitle1!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMoveCostTitle2!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _layoutMoveCost2!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMoveCost1!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMoveCost2!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listMoveCost!         : UiInterfacesIUiScrollList.IUiScrollList<DataForMoveCostRenderer>;

    private readonly _groupDamageChart!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutDefense1!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDefense1!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMain1!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSub1!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _layoutDefense2!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDefense2!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMain2!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSub2!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listDamageChart!      : UiInterfacesIUiScrollList.IUiScrollList<DataForDamageRenderer>;

    private readonly _tileView              = new (UiUtilsUiFactory.getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.TileAnimationTick,           callback: this._onNotifyTileAnimationTick },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,   callback: this.closePanel },
            { ui: this._btnSwitch,  callback: this._onTouchedBtnSwitch },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listTile.setItemRendererClass(TileRenderer);
        this._listMoveCost.setItemRendererClass(MoveCostRenderer);
        this._listInfo.setItemRendererClass(InfoRenderer);
        this._listDamageChart.setItemRendererClass(DamageRenderer);

        const tileView      = this._tileView;
        const conTileView   = this._conTileView;
        conTileView.addUiChild(tileView.getImgBase());
        conTileView.addUiChild(tileView.getImgDecoration());
        conTileView.addUiChild(tileView.getImgObject());
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        await this._listTile.bindData(this._createDataForListTile());
        this.setSelectedIndexAndUpdateView(0, true);
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listDamageChart.removeAllItems(),
            this._listInfo.removeAllItems(),
            this._listMoveCost.removeAllItems(),
            this._listTile.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public async setSelectedIndexAndUpdateView(newIndex: number, needScroll: boolean): Promise<void> {
        const listTile = this._listTile;
        listTile.setSelectedItemIndex(newIndex);
        this._updateTileView();
        this._updateLabelName();
        await this._updateListInfo();
        await this._updateGroupMoveCost();
        await this._updateGroupDamageChart();

        if (needScroll) {
            listTile.scrollToItem(newIndex);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyTileAnimationTick(): void {
        this._tileView.updateOnAnimationTick();
    }

    private _onTouchedBtnSwitch(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonDamageChartPanel, {
            gameConfig  : this.getOpenData()?.gameConfig,
        });
        this.closePanel();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B0899);
        this._labelMoveCostTitle1.setLangText(LangConstants.TextType.B0351);
        this._labelMoveCostTitle2.setLangText(LangConstants.TextType.B0351);
        this._labelMoveCost1.setLangText(LangConstants.TextType.B1282);
        this._labelMoveCost2.setLangText(LangConstants.TextType.B1282);
        this._labelDefense1.setLangText(LangConstants.TextType.B0695);
        this._labelMain1.setLangText(LangConstants.TextType.B0692);
        this._labelSub1.setLangText(LangConstants.TextType.B0693);
        this._labelDefense2.setLangText(LangConstants.TextType.B0695);
        this._labelMain2.setLangText(LangConstants.TextType.B0692);
        this._labelSub2.setLangText(LangConstants.TextType.B0693);
        this._updateLabelName();

        this._layoutMoveCost1.arrangeItems();
        this._layoutMoveCost2.arrangeItems();
        this._layoutDefense1.arrangeItems();
        this._layoutDefense2.arrangeItems();
    }

    private _updateLabelName(): void {
        const tileType      = this._listTile.getFirstSelectedData()?.tileType;
        const labelName     = this._labelName;
        const labelName1    = this._labelName1;
        const gameConfig    = this.getOpenData()?.gameConfig;
        if ((tileType== null) || (gameConfig == null)) {
            labelName.setText(``);
            labelName1.setText(``);
        } else {
            labelName.setText(LangUtils.getTileName(tileType, gameConfig) ?? LangConstants.UndefinedError);
            labelName1.setText(LangUtils.getTileName(tileType, gameConfig, LangUtils.getSecondaryLanguageType()) ?? LangConstants.UndefinedError);
        }

        this._layoutName.arrangeItems();
    }

    private _updateTileView(): void {
        const tileType = this._listTile.getFirstSelectedData()?.tileType;
        if (tileType == null) {
            return;
        }

        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return;
        }

        const tileView = this._tileView;
        tileView.init({
            tileBaseType            : gameConfig.getTileTemplateCfg(tileType)?.getToTileBaseTypeId() ?? null,
            tileBaseShapeId         : 0,
            tileDecorationType      : null,
            tileDecorationShapeId   : null,
            tileObjectType          : gameConfig.getTileTemplateCfg(tileType)?.getToTileObjectTypeId() ?? null,
            tileObjectShapeId       : 0,
            skinId                  : PlayersConstants.PlayerIndex.Neutral,
            overridingSkinId        : undefined,
            gameConfig              : gameConfig,
        });
        tileView.updateView();
    }

    private async _updateListInfo(): Promise<void> {
        const tileType  = this._listTile.getFirstSelectedData()?.tileType;
        const listInfo  = this._listInfo;
        if (tileType == null) {
            await listInfo.removeAllItems();
            return;
        }

        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            await listInfo.removeAllItems();
            return;
        }

        const tileTemplateCfg = gameConfig.getTileTemplateCfg(tileType);
        if (tileTemplateCfg == null) {
            await listInfo.removeAllItems();
            return;
        }

        const dataArray: DataForInfoRenderer[] = HelpersCollection.getNonNullElements([
            createInfoDefenseBonus(tileTemplateCfg, gameConfig),
            createInfoIncome(tileTemplateCfg, gameConfig),
            createInfoVision(tileTemplateCfg, gameConfig),
            createInfoHideUnitCategory(tileTemplateCfg, gameConfig),
            createInfoIsDefeatOnCapture(tileTemplateCfg, gameConfig),
            createInfoProduceUnitCategory(tileTemplateCfg, gameConfig),
            createInfoGlobalBonus(tileTemplateCfg, gameConfig),
            createInfoRepairUnitCategory(tileTemplateCfg, gameConfig),
            createInfoBlockEnemyUnit(tileTemplateCfg, gameConfig),
            createInfoCoBoardUnit(tileTemplateCfg, gameConfig),
            createInfoHp(tileTemplateCfg, gameConfig),
            createInfoCapturePoint(tileTemplateCfg, gameConfig),
            createInfoBuildPoint(tileTemplateCfg, gameConfig),
            createInfoIsHighlighted(tileTemplateCfg, gameConfig),
            createInfoBuff(tileTemplateCfg, gameConfig),
            createInfoCrystalRadius(tileTemplateCfg, gameConfig),
            createInfoCrystalPriority(tileTemplateCfg, gameConfig),
            createInfoCrystalCanAffectSelf(tileTemplateCfg, gameConfig),
            createInfoCrystalCanAffectAlly(tileTemplateCfg, gameConfig),
            createInfoCrystalCanAffectEnemy(tileTemplateCfg, gameConfig),
            createInfoCrystalDeltaFund(tileTemplateCfg, gameConfig),
            createInfoCrystalDeltaEnergyPercentage(tileTemplateCfg, gameConfig),
            createInfoCrystalDeltaHp(tileTemplateCfg, gameConfig),
            createInfoCrystalDeltaFuelPercentage(tileTemplateCfg, gameConfig),
            createInfoCrystalDeltaPrimaryAmmoPercentage(tileTemplateCfg, gameConfig),
            createInfoCannonRangeForUp(tileTemplateCfg, gameConfig),
            createInfoCannonRangeForRight(tileTemplateCfg, gameConfig),
            createInfoCannonRangeForDown(tileTemplateCfg, gameConfig),
            createInfoCannonRangeForLeft(tileTemplateCfg, gameConfig),
            createInfoCannonPriority(tileTemplateCfg, gameConfig),
            createInfoCannonMaxTargetCount(tileTemplateCfg, gameConfig),
            createInfoCannonCanAffectSelf(tileTemplateCfg, gameConfig),
            createInfoCannonCanAffectAlly(tileTemplateCfg, gameConfig),
            createInfoCannonCanAffectEnemy(tileTemplateCfg, gameConfig),
            createInfoCannonDeltaHp(tileTemplateCfg, gameConfig),
            createInfoCannonDeltaFuelPercentage(tileTemplateCfg, gameConfig),
            createInfoCannonDeltaPrimaryAmmoPercentage(tileTemplateCfg, gameConfig),
            createInfoLaserTurretRangeForUp(tileTemplateCfg, gameConfig),
            createInfoLaserTurretRangeForRight(tileTemplateCfg, gameConfig),
            createInfoLaserTurretRangeForDown(tileTemplateCfg, gameConfig),
            createInfoLaserTurretRangeForLeft(tileTemplateCfg, gameConfig),
            createInfoLaserTurretPriority(tileTemplateCfg, gameConfig),
            createInfoLaserTurretCanAffectSelf(tileTemplateCfg, gameConfig),
            createInfoLaserTurretCanAffectAlly(tileTemplateCfg, gameConfig),
            createInfoLaserTurretCanAffectEnemy(tileTemplateCfg, gameConfig),
            createInfoLaserTurretDeltaHp(tileTemplateCfg, gameConfig),
            createInfoLaserTurretDeltaFuelPercentage(tileTemplateCfg, gameConfig),
            createInfoLaserTurretDeltaPrimaryAmmoPercentage(tileTemplateCfg, gameConfig),
        ]);

        let index = 0;
        for (const data of dataArray) {
            data.index = index++;
        }
        await listInfo.bindData(dataArray);
    }

    private async _updateGroupMoveCost(): Promise<void> {
        const group             = this._groupMoveCost;
        const tileType          = this._listTile.getFirstSelectedData()?.tileType;
        const tileTemplateCfg   = tileType == null ? null : this.getOpenData()?.gameConfig.getTileTemplateCfg(tileType);
        if ((tileTemplateCfg == null) || (tileTemplateCfg.getMaxHp())) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);
            await this._listMoveCost.bindData(this._createDataForListMoveCost());
        }
    }

    private async _updateGroupDamageChart(): Promise<void> {
        const group             = this._groupDamageChart;
        const tileType          = this._listTile.getFirstSelectedData()?.tileType;
        const tileTemplateCfg   = tileType == null ? null : this.getOpenData()?.gameConfig.getTileTemplateCfg(tileType);
        if ((tileTemplateCfg == null) || (!tileTemplateCfg.getMaxHp())) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);
            await this._listDamageChart.bindData(this._createDataForListDamageChart());
        }
    }

    private _createDataForListMoveCost(): DataForMoveCostRenderer[] {
        const tileType = this._listTile.getFirstSelectedData()?.tileType;
        if (tileType == null) {
            return [];
        }

        const gameConfig    = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return [];
        }

        const tileCfg       = HelpersMisc.getExisted(gameConfig.getTileTemplateCfg(tileType));
        const dataArray     : DataForMoveCostRenderer[] = [];
        let index           = 0;
        for (const unitType of gameConfig.getAllUnitTypeArray()) {
            dataArray.push({
                index       : index,
                gameConfig  : gameConfig,
                unitType    : unitType,
                tileCfg     : tileCfg,
            });
            ++index;
        }
        return dataArray.sort((v1, v2) => v1.unitType - v2.unitType);
    }

    private _createDataForListDamageChart(): DataForDamageRenderer[] {
        const targetTileType = this._listTile.getFirstSelectedData()?.tileType;
        if (targetTileType == null) {
            return [];
        }

        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return [];
        }

        const playerIndex   = PlayersConstants.PlayerIndex.First;
        const dataArray     : DataForDamageRenderer[] = [];
        let index           = 0;
        for (const attackerUnitType of gameConfig.getAllUnitTypeArray()) {
            dataArray.push({
                gameConfig          : gameConfig,
                index               : index,
                targetTileType      : targetTileType,
                attackerUnitType    : attackerUnitType,
                playerIndex         : playerIndex,
            });
            ++index;
        }

        return dataArray;
    }

    private _createDataForListTile(): DataForTileRenderer[] {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return [];
        }

        const dataArray: DataForTileRenderer[] = [];
        for (const tileType of gameConfig.getTileTypeArrayForTileChart()) {
            dataArray.push({
                tileType    : tileType,
                panel       : this,
                gameConfig  : gameConfig,
            });
        }
        return dataArray;
    }
}

interface DataForTileRenderer extends UiTypesUiListItemData.UiListItemData {
    tileType        : number;
    panel           : Panel;
    gameConfig      : GameConfigGcData.GcData;
}
class TileRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForTileRenderer> {
    private readonly _conTileView!  : UiInterfacesIUiContainer.IUiContainer;

    private readonly _layoutName!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelId!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _tileView      = new (UiUtilsUiFactory.getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.TileAnimationTick,   callback: this._onNotifyTileAnimationTick },
        ]);
        this._applySettingsForWholeTouch();

        const conTileView   = this._conTileView;
        const tileView      = this._tileView;
        conTileView.addUiChild(tileView.getImgBase());
        conTileView.addUiChild(tileView.getImgDecoration());
        conTileView.addUiChild(tileView.getImgObject());
    }
    private _onNotifyTileAnimationTick(): void {
        this._tileView.updateOnAnimationTick();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gameConfig    = openData.gameConfig;
        const tileType      = openData.tileType;
        this._labelId.setText(`#${tileType}`);
        this._labelName.setText(LangUtils.getTileName(tileType, gameConfig) ?? LangConstants.UndefinedError);
        this._layoutName.arrangeItems();

        const tileView = this._tileView;
        tileView.init({
            tileBaseType            : gameConfig.getTileTemplateCfg(tileType)?.getToTileBaseTypeId() ?? null,
            tileBaseShapeId         : 0,
            tileDecorationType      : null,
            tileDecorationShapeId   : null,
            tileObjectType          : gameConfig.getTileTemplateCfg(tileType)?.getToTileObjectTypeId() ?? null,
            tileObjectShapeId       : 0,
            skinId                  : PlayersConstants.PlayerIndex.Neutral,
            overridingSkinId        : undefined,
            gameConfig              : gameConfig,
        });
        tileView.updateView();
    }

    public onItemTapEvent(e: UiTypesUiItemTapEventData.UiItemTapEventData): void {
        this.getOpenData()?.panel.setSelectedIndexAndUpdateView(e.itemIndex, false);
    }
}

interface DataForInfoRenderer extends UiTypesUiListItemData.UiListItemData {
    gameConfig      : GameConfigGcData.GcData;
    index           : number;
    infoType        : TilesConstantsCommon.InfoTypeId;
    tileTemplateCfg : TileTemplateCfg;
}
class InfoRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
    private readonly _imgBg!            : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelValue!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupExtra!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelExtraInfo!   : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        const infoType = this.getOpenData()?.infoType;
        if (infoType == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        if      (infoType === TilesConstantsCommon.InfoTypeId.DefenseBonus)                            { this._showHelpAsDefenseBonus(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Income)                                  { this._showHelpAsIncome(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Vision)                                  { this._showHelpAsVision(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.HideUnitCategory)                        { this._showHelpAsHideUnitCategory(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.IsDefeatedOnCapture)                     { this._showHelpAsIsDefeatedOnCapture(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.ProduceUnitCategory)                     { this._showHelpAsProduceUnitCategory(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.GlobalBonus)                             { this._showHelpAsGlobalBonus(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.RepairUnitCategory)                      { this._showHelpAsRepairUnitCategory(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.BlockEnemyUnit)                          { this._showHelpAsBlockEnemyUnit(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CoBoardUnit)                             { this._showHelpAsCoBoardUnit(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Hp)                                      { this._showHelpAsHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CapturePoint)                            { this._showHelpAsCapturePoint(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.BuildPoint)                              { this._showHelpAsBuildPoint(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.IsHighlighted)                           { this._showHelpAsIsHighlighted(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Buff)                                    { this._showHelpAsBuff(); }

        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalRadius)                           { this._showHelpAsCrystalRadius(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalPriority)                         { this._showHelpAsCrystalPriority(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalCanAffectSelf)                    { this._showHelpAsCrystalCanAffectSelf(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalCanAffectAlly)                    { this._showHelpAsCrystalCanAffectAlly(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalCanAffectEnemy)                   { this._showHelpAsCrystalCanAffectEnemy(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaFund)                        { this._showHelpAsCrystalDeltaFund(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaEnergyPercentage)            { this._showHelpAsCrystalDeltaEnergyPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaHp)                          { this._showHelpAsCrystalDeltaHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaFuelPercentage)              { this._showHelpAsCrystalDeltaFuelPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaPrimaryAmmoPercentage)       { this._showHelpAsCrystalDeltaPrimaryAmmoPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForUp)                        { this._showHelpAsCannonRangeForUp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForRight)                     { this._showHelpAsCannonRangeForRight(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForLeft)                      { this._showHelpAsCannonRangeForLeft(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForDown)                      { this._showHelpAsCannonRangeForDown(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonPriority)                          { this._showHelpAsCannonPriority(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonMaxTargetCount)                    { this._showHelpAsCannonMaxTargetCount(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonCanAffectSelf)                     { this._showHelpAsCannonCanAffectSelf(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonCanAffectAlly)                     { this._showHelpAsCannonCanAffectAlly(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonCanAffectEnemy)                    { this._showHelpAsCannonCanAffectEnemy(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonDeltaHp)                           { this._showHelpAsCannonDeltaHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonDeltaFuelPercentage)               { this._showHelpAsCannonDeltaFuelPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonDeltaPrimaryAmmoPercentage)        { this._showHelpAsCannonDeltaPrimaryAmmoPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForUp)                   { this._showHelpAsLaserTurretRangeForUp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForRight)                { this._showHelpAsLaserTurretRangeForRight(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForLeft)                 { this._showHelpAsLaserTurretRangeForLeft(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForDown)                 { this._showHelpAsLaserTurretRangeForDown(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretPriority)                     { this._showHelpAsLaserTurretPriority(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectSelf)                { this._showHelpAsLaserTurretCanAffectSelf(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectAlly)                { this._showHelpAsLaserTurretCanAffectAlly(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectEnemy)               { this._showHelpAsLaserTurretCanAffectEnemy(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretDeltaHp)                      { this._showHelpAsLaserTurretDeltaHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretDeltaFuelPercentage)          { this._showHelpAsLaserTurretDeltaFuelPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage)   { this._showHelpAsLaserTurretDeltaPrimaryAmmoPercentage(); }
        else {
            throw HelpersMisc.newError(`Invalid infoType: ${infoType}`);
        }
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgBg.setIsVisible(openData.index % 2 === 0);

        const infoType = openData.infoType;
        if      (infoType === TilesConstantsCommon.InfoTypeId.DefenseBonus)                            { this._updateViewAsDefenseBonus(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Income)                                  { this._updateViewAsIncome(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Vision)                                  { this._updateViewAsVision(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.HideUnitCategory)                        { this._updateViewAsHideUnitCategory(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.IsDefeatedOnCapture)                     { this._updateViewAsIsDefeatedOnCapture(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.ProduceUnitCategory)                     { this._updateViewAsProduceUnitCategory(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.GlobalBonus)                             { this._updateViewAsGlobalBonus(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.RepairUnitCategory)                      { this._updateViewAsRepairUnitCategory(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.BlockEnemyUnit)                          { this._updateViewAsBlockEnemyUnit(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CoBoardUnit)                             { this._updateViewAsCoBoardUnit(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Hp)                                      { this._updateViewAsHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CapturePoint)                            { this._updateViewAsCapturePoint(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.BuildPoint)                              { this._updateViewAsBuildPoint(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.IsHighlighted)                           { this._updateViewAsIsHighlighted(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.Buff)                                    { this._updateViewAsBuff(); }

        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalRadius)                           { this._updateViewAsCrystalRadius(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalPriority)                         { this._updateViewAsCrystalPriority(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalCanAffectSelf)                    { this._updateViewAsCrystalCanAffectSelf(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalCanAffectAlly)                    { this._updateViewAsCrystalCanAffectAlly(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalCanAffectEnemy)                   { this._updateViewAsCrystalCanAffectEnemy(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaFund)                        { this._updateViewAsCrystalDeltaFund(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaEnergyPercentage)            { this._updateViewAsCrystalDeltaEnergyPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaHp)                          { this._updateViewAsCrystalDeltaHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaFuelPercentage)              { this._updateViewAsCrystalDeltaFuelPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CrystalDeltaPrimaryAmmoPercentage)       { this._updateViewAsCrystalDeltaPrimaryAmmoPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForUp)                        { this._updateViewAsCannonRangeForUp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForRight)                     { this._updateViewAsCannonRangeForRight(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForLeft)                      { this._updateViewAsCannonRangeForLeft(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonRangeForDown)                      { this._updateViewAsCannonRangeForDown(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonPriority)                          { this._updateViewAsCannonPriority(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonMaxTargetCount)                    { this._updateViewAsCannonMaxTargetCount(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonCanAffectSelf)                     { this._updateViewAsCannonCanAffectSelf(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonCanAffectAlly)                     { this._updateViewAsCannonCanAffectAlly(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonCanAffectEnemy)                    { this._updateViewAsCannonCanAffectEnemy(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonDeltaHp)                           { this._updateViewAsCannonDeltaHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonDeltaFuelPercentage)               { this._updateViewAsCannonDeltaFuelPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.CannonDeltaPrimaryAmmoPercentage)        { this._updateViewAsCannonDeltaPrimaryAmmoPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForUp)                   { this._updateViewAsLaserTurretRangeForUp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForRight)                { this._updateViewAsLaserTurretRangeForRight(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForLeft)                 { this._updateViewAsLaserTurretRangeForLeft(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretRangeForDown)                 { this._updateViewAsLaserTurretRangeForDown(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretPriority)                     { this._updateViewAsLaserTurretPriority(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectSelf)                { this._updateViewAsLaserTurretCanAffectSelf(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectAlly)                { this._updateViewAsLaserTurretCanAffectAlly(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectEnemy)               { this._updateViewAsLaserTurretCanAffectEnemy(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretDeltaHp)                      { this._updateViewAsLaserTurretOffsetHp(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretDeltaFuelPercentage)          { this._updateViewAsLaserTurretDeltaFuelPercentage(); }
        else if (infoType === TilesConstantsCommon.InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage)   { this._updateViewAsLaserTurretDeltaPrimaryAmmoPercentage(); }
        else {
            throw HelpersMisc.newError(`Invalid infoType: ${infoType}`);
        }
    }
    private _updateViewAsDefenseBonus(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tileTemplateCfg = openData.tileTemplateCfg;
        this._labelTitle.setLangText(LangConstants.TextType.B0352);
        this._labelValue.setText(LangUtils.getUnitCategoryName(
            tileTemplateCfg.getDefenseUnitCategoryId(),
            openData.gameConfig
        ) ?? LangConstants.UndefinedError);
        this._groupExtra.setIsVisible(true);
        this._labelExtraInfo.setText(`${HelpersText.getSignedNumText(tileTemplateCfg.getDefenseAmount())}`);
    }
    private _updateViewAsIncome(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tileTemplateCfg = openData.tileTemplateCfg;
        this._labelTitle.setLangText(LangConstants.TextType.Income);
        this._labelValue.setText(`${tileTemplateCfg.getIncomePerTurn()}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsVision(): void {
        const tileTemplateCfg = this.getOpenData()?.tileTemplateCfg;
        if (tileTemplateCfg == null) {
            return;
        }

        this._labelTitle.setLangText(LangConstants.TextType.VisionRange);
        this._labelValue.setText(`${tileTemplateCfg.getVisionRange()}`);

        const groupExtra = this._groupExtra;
        if (!tileTemplateCfg.getIsVisionEnabledForAllPlayers()) {
            groupExtra.setIsVisible(false);
        } else {
            groupExtra.setIsVisible(true);
            this._labelExtraInfo.setLangText(LangConstants.TextType.B1130);
        }
    }
    private _updateViewAsHideUnitCategory(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitCategory = openData.tileTemplateCfg.getHideUnitCategoryId();
        this._labelTitle.setLangText(LangConstants.TextType.HidableUnits);
        this._labelValue.setText(unitCategory == null
            ? `--`
            : (LangUtils.getUnitCategoryName(unitCategory, openData.gameConfig) ?? LangConstants.UndefinedError)
        );
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsIsDefeatedOnCapture(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setLangText(LangConstants.TextType.DefeatIfCaptured);
        this._labelValue.setText(openData.tileTemplateCfg.getIsDefeatedOnCapture() ? LangUtils.getText(LangConstants.TextType.Yes) : LangUtils.getText(LangConstants.TextType.No));
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsProduceUnitCategory(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitCategory = openData.tileTemplateCfg.getProduceUnitCategoryId();
        this._labelTitle.setLangText(LangConstants.TextType.ProducibleUnits);
        this._labelValue.setText(unitCategory == null
            ? `--`
            : (LangUtils.getUnitCategoryName(unitCategory, openData.gameConfig) ?? LangConstants.UndefinedError)
        );
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsGlobalBonus(): void {
        const tileTemplateCfg = this.getOpenData()?.tileTemplateCfg;
        if (tileTemplateCfg == null) {
            return;
        }

        const offenseBonus  = tileTemplateCfg.getGlobalAttackBonus();
        const defenseBonus  = tileTemplateCfg.getGlobalDefenseBonus();
        this._labelTitle.setLangText(LangConstants.TextType.B0359);
        this._labelValue.setText(`${offenseBonus ?? `--`} / ${defenseBonus ?? `--`}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsRepairUnitCategory(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tileTemplateCfg       = openData.tileTemplateCfg;
        const unitCategory          = tileTemplateCfg.getRepairUnitCategoryId();
        const repairNormalizedHp    = tileTemplateCfg.getRepairAmount();
        this._labelTitle.setLangText(LangConstants.TextType.RepairableUnits);
        this._labelValue.setText(unitCategory == null
            ? `--`
            : (LangUtils.getUnitCategoryName(unitCategory, openData.gameConfig) ?? LangConstants.UndefinedError)
        );
        this._groupExtra.setIsVisible(true);
        this._labelExtraInfo.setText(repairNormalizedHp == null ? LangUtils.getText(LangConstants.TextType.B0044) : `${HelpersText.getSignedNumText(repairNormalizedHp * 10)}`);
    }
    private _updateViewAsHp(): void {
        const tileTemplateCfg = this.getOpenData()?.tileTemplateCfg;
        if (tileTemplateCfg == null) {
            return;
        }

        const maxHp = tileTemplateCfg.getMaxHp();
        this._labelTitle.setLangText(LangConstants.TextType.Hp);
        this._labelValue.setText(`${maxHp} / ${maxHp}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCapturePoint(): void {
        const tileTemplateCfg = this.getOpenData()?.tileTemplateCfg;
        if (tileTemplateCfg == null) {
            return;
        }

        const maxCapturePoint = tileTemplateCfg.getMaxCapturePoint();
        this._labelTitle.setLangText(LangConstants.TextType.CapturePoint);
        this._labelValue.setText(`${maxCapturePoint} / ${maxCapturePoint}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsBuildPoint(): void {
        const tileTemplateCfg = this.getOpenData()?.tileTemplateCfg;
        if (tileTemplateCfg == null) {
            return;
        }

        const maxBuildPoint = tileTemplateCfg.getMaxBuildPoint();
        this._labelTitle.setLangText(LangConstants.TextType.BuildPoint);
        this._labelValue.setText(`${maxBuildPoint} / ${maxBuildPoint}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsIsHighlighted(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B0847);
        this._labelValue.setLangText(LangConstants.TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsBuff(): void {
        this._labelTitle.setLangText(LangConstants.TextType.AbnormalStates);
        this._labelValue.setLangText(LangConstants.TextType.None);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsBlockEnemyUnit(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setLangText(LangConstants.TextType.BlockableEnemyUnits);
        this._labelValue.setText(LangUtils.getUnitCategoryName(
            openData.tileTemplateCfg.getBlockEnemyUnitCategoryId() ?? 0,
            openData.gameConfig
        ) ?? LangConstants.UndefinedError);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCoBoardUnit(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setLangText(LangConstants.TextType.CoBoardableUnit);
        this._labelValue.setText(LangUtils.getUnitCategoryName(
            openData.tileTemplateCfg.getCoBoardUnitCategoryId() ?? 0,
            openData.gameConfig
        ) ?? LangConstants.UndefinedError);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalRadius(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.Crystal.getRadius();
        this._labelTitle.setLangText(LangConstants.TextType.EffectiveRadius);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalPriority(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.Crystal.getPriority();
        this._labelTitle.setLangText(LangConstants.TextType.Priority);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalCanAffectSelf(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.Crystal.getCanAffectSelf();
        this._labelTitle.setLangText(LangConstants.TextType.AffectOwner);
        this._labelValue.setLangText(currentValue ? LangConstants.TextType.Yes : LangConstants.TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalCanAffectAlly(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.Crystal.getCanAffectAlly();
        this._labelTitle.setLangText(LangConstants.TextType.AffectAlly);
        this._labelValue.setLangText(currentValue ? LangConstants.TextType.Yes : LangConstants.TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalCanAffectEnemy(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.Crystal.getCanAffectEnemy();
        this._labelTitle.setLangText(LangConstants.TextType.AffectEnemy);
        this._labelValue.setLangText(currentValue ? LangConstants.TextType.Yes : LangConstants.TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalDeltaFund(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.Crystal.getOffsetFund();
        this._labelTitle.setLangText(LangConstants.TextType.FundOffset);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalDeltaEnergyPercentage(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.Crystal.getOffsetEnergyPercentage();
        this._labelTitle.setLangText(LangConstants.TextType.CoEnergyOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalDeltaHp(): void {
        const data          = TilesConstantsDefaultCustomTileData.Crystal;
        const offsetHp      = data.getOffsetHp();
        const canBeFatal    = data.getCanBeFatal();
        this._labelTitle.setLangText(LangConstants.TextType.UnitsHpOffset);
        this._labelValue.setText(`${offsetHp}`);
        this._groupExtra.setIsVisible(canBeFatal);
        this._labelExtraInfo.setLangText(LangConstants.TextType.CanBeFatal);
    }
    private _updateViewAsCrystalDeltaFuelPercentage(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.Crystal.getOffsetFuelPercentage();
        this._labelTitle.setLangText(LangConstants.TextType.UnitsFuelOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalDeltaPrimaryAmmoPercentage(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.Crystal.getOffsetPrimaryAmmoPercentage();
        this._labelTitle.setLangText(LangConstants.TextType.UnitsPriAmmoOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonRangeForUp(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.CannonUp.getRangeForUp();
        this._labelTitle.setLangText(LangConstants.TextType.RangeUp);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonRangeForRight(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.CannonRight.getRangeForRight();
        this._labelTitle.setLangText(LangConstants.TextType.RangeRight);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonRangeForDown(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.CannonDown.getRangeForDown();
        this._labelTitle.setLangText(LangConstants.TextType.RangeDown);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonRangeForLeft(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.CannonLeft.getRangeForLeft();
        this._labelTitle.setLangText(LangConstants.TextType.RangeLeft);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonPriority(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.CustomCannon.getPriority();
        this._labelTitle.setLangText(LangConstants.TextType.Priority);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonMaxTargetCount(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.CustomCannon.getMaxTargetCount();
        this._labelTitle.setLangText(LangConstants.TextType.MaxTargets);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonCanAffectSelf(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.CustomCannon.getCanAffectSelf();
        this._labelTitle.setLangText(LangConstants.TextType.AffectOwner);
        this._labelValue.setLangText(currentValue ? LangConstants.TextType.Yes : LangConstants.TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonCanAffectAlly(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.CustomCannon.getCanAffectAlly();
        this._labelTitle.setLangText(LangConstants.TextType.AffectAlly);
        this._labelValue.setLangText(currentValue ? LangConstants.TextType.Yes : LangConstants.TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonCanAffectEnemy(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.CustomCannon.getCanAffectEnemy();
        this._labelTitle.setLangText(LangConstants.TextType.AffectEnemy);
        this._labelValue.setLangText(currentValue ? LangConstants.TextType.Yes : LangConstants.TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonDeltaHp(): void {
        const data          = TilesConstantsDefaultCustomTileData.CustomCannon;
        const offsetHp      = data.getOffsetHp();
        const canBeFatal    = data.getCanBeFatal();
        this._labelTitle.setLangText(LangConstants.TextType.UnitsHpOffset);
        this._labelValue.setText(`${offsetHp}`);
        this._groupExtra.setIsVisible(canBeFatal);
        this._labelExtraInfo.setLangText(LangConstants.TextType.CanBeFatal);
    }
    private _updateViewAsCannonDeltaFuelPercentage(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.CustomCannon.getOffsetFuelPercentage();
        this._labelTitle.setLangText(LangConstants.TextType.UnitsFuelOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonDeltaPrimaryAmmoPercentage(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.CustomCannon.getOffsetPrimaryAmmoPercentage();
        this._labelTitle.setLangText(LangConstants.TextType.UnitsPriAmmoOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretRangeForUp(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.CustomLaserTurret.getRangeForUp();
        this._labelTitle.setLangText(LangConstants.TextType.RangeUp);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretRangeForRight(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.CustomLaserTurret.getRangeForRight();
        this._labelTitle.setLangText(LangConstants.TextType.RangeRight);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretRangeForDown(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.CustomLaserTurret.getRangeForDown();
        this._labelTitle.setLangText(LangConstants.TextType.RangeDown);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretRangeForLeft(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.CustomLaserTurret.getRangeForLeft();
        this._labelTitle.setLangText(LangConstants.TextType.RangeLeft);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretPriority(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.CustomLaserTurret.getPriority();
        this._labelTitle.setLangText(LangConstants.TextType.Priority);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretCanAffectSelf(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.CustomLaserTurret.getCanAffectSelf();
        this._labelTitle.setLangText(LangConstants.TextType.AffectOwner);
        this._labelValue.setLangText(currentValue ? LangConstants.TextType.Yes : LangConstants.TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretCanAffectAlly(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.CustomLaserTurret.getCanAffectAlly();
        this._labelTitle.setLangText(LangConstants.TextType.AffectAlly);
        this._labelValue.setLangText(currentValue ? LangConstants.TextType.Yes : LangConstants.TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretCanAffectEnemy(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.CustomLaserTurret.getCanAffectEnemy();
        this._labelTitle.setLangText(LangConstants.TextType.AffectEnemy);
        this._labelValue.setLangText(currentValue ? LangConstants.TextType.Yes : LangConstants.TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretOffsetHp(): void {
        const data          = TilesConstantsDefaultCustomTileData.CustomLaserTurret;
        const offsetHp      = data.getOffsetHp();
        const canBeFatal    = data.getCanBeFatal();
        this._labelTitle.setLangText(LangConstants.TextType.UnitsHpOffset);
        this._labelValue.setText(`${offsetHp}`);
        this._groupExtra.setIsVisible(canBeFatal);
        this._labelExtraInfo.setLangText(LangConstants.TextType.CanBeFatal);
    }
    private _updateViewAsLaserTurretDeltaFuelPercentage(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.CustomLaserTurret.getOffsetFuelPercentage();
        this._labelTitle.setLangText(LangConstants.TextType.UnitsFuelOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretDeltaPrimaryAmmoPercentage(): void {
        const currentValue          = TilesConstantsDefaultCustomTileData.CustomLaserTurret.getOffsetPrimaryAmmoPercentage();
        this._labelTitle.setLangText(LangConstants.TextType.UnitsPriAmmoOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }

    private _showHelpAsDefenseBonus(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.B0352),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0088),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsIncome(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.Income),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0086),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsVision(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.VisionRange),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0082),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsHideUnitCategory(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.HidableUnits),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0079),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsIsDefeatedOnCapture(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.DefeatIfCaptured),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0077),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsProduceUnitCategory(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.ProducibleUnits),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0074),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsGlobalBonus(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.B0359),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0068),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsRepairUnitCategory(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.RepairableUnits),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0065),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsBlockEnemyUnit(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.BlockableEnemyUnits),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0012),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsCoBoardUnit(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.CoBoardableUnit),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0011),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsHp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.Hp),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0059),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsCapturePoint(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.CapturePoint),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0052),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsBuildPoint(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.BuildPoint),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0051),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsIsHighlighted(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.B0847),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0050),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsBuff(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getTitle   : () => LangUtils.getText(LangConstants.TextType.AbnormalStates),
            getContent : () => LangUtils.getText(LangConstants.TextType.A0737),
        });
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsCrystalRadius(): void {
        // nothing to do
    }
    private _showHelpAsCrystalPriority(): void {
        // nothing to do
    }
    private _showHelpAsCrystalCanAffectSelf(): void {
        // nothing to do
    }
    private _showHelpAsCrystalCanAffectAlly(): void {
        // nothing to do
    }
    private _showHelpAsCrystalCanAffectEnemy(): void {
        // nothing to do
    }
    private _showHelpAsCrystalDeltaFund(): void {
        // nothing to do
    }
    private _showHelpAsCrystalDeltaEnergyPercentage(): void {
        // nothing to do
    }
    private _showHelpAsCrystalDeltaHp(): void {
        // nothing to do
    }
    private _showHelpAsCrystalDeltaFuelPercentage(): void {
        // nothing to do
    }
    private _showHelpAsCrystalDeltaPrimaryAmmoPercentage(): void {
        // nothing to do
    }
    private _showHelpAsCannonRangeForUp(): void {
        // nothing to do
    }
    private _showHelpAsCannonRangeForRight(): void {
        // nothing to do
    }
    private _showHelpAsCannonRangeForLeft(): void {
        // nothing to do
    }
    private _showHelpAsCannonRangeForDown(): void {
        // nothing to do
    }
    private _showHelpAsCannonPriority(): void {
        // nothing to do
    }
    private _showHelpAsCannonMaxTargetCount(): void {
        // nothing to do
    }
    private _showHelpAsCannonCanAffectSelf(): void {
        // nothing to do
    }
    private _showHelpAsCannonCanAffectAlly(): void {
        // nothing to do
    }
    private _showHelpAsCannonCanAffectEnemy(): void {
        // nothing to do
    }
    private _showHelpAsCannonDeltaHp(): void {
        // nothing to do
    }
    private _showHelpAsCannonDeltaFuelPercentage(): void {
        // nothing to do
    }
    private _showHelpAsCannonDeltaPrimaryAmmoPercentage(): void {
        // nothing to do
    }
    private _showHelpAsLaserTurretRangeForUp(): void {
        // nothing to do
    }
    private _showHelpAsLaserTurretRangeForRight(): void {
        // nothing to do
    }
    private _showHelpAsLaserTurretRangeForLeft(): void {
        // nothing to do
    }
    private _showHelpAsLaserTurretRangeForDown(): void {
        // nothing to do
    }
    private _showHelpAsLaserTurretPriority(): void {
        // nothing to do
    }
    private _showHelpAsLaserTurretCanAffectSelf(): void {
        // nothing to do
    }
    private _showHelpAsLaserTurretCanAffectAlly(): void {
        // nothing to do
    }
    private _showHelpAsLaserTurretCanAffectEnemy(): void {
        // nothing to do
    }
    private _showHelpAsLaserTurretDeltaHp(): void {
        // nothing to do
    }
    private _showHelpAsLaserTurretDeltaFuelPercentage(): void {
        // nothing to do
    }
    private _showHelpAsLaserTurretDeltaPrimaryAmmoPercentage(): void {
        // nothing to do
    }
}

interface DataForMoveCostRenderer extends UiTypesUiListItemData.UiListItemData {
    index           : number;
    gameConfig      : GameConfigGcData.GcData;
    unitType        : number;
    tileCfg         : TileTemplateCfg;
}
class MoveCostRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForMoveCostRenderer> {
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBg!            : UiInterfacesIUiImage.IUiImage;
    private readonly _conView!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelMoveCost!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _unitView          = new (UiUtilsUiFactory.getUiUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.UnitAnimationTick,   callback: this._onNotifyUnitAnimationTick },
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

        const gameConfig    = openData.gameConfig;
        const unitType      = openData.unitType;
        const moveCostCfg   = HelpersMisc.getExisted(gameConfig.getMoveCostCfg(HelpersMisc.getExisted(openData.tileCfg.getTileTypeId())));
        const moveCost      = moveCostCfg[HelpersMisc.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getMoveTypeId())].getCost();
        const playerIndex   = PlayersConstants.PlayerIndex.First;
        this._imgBg.setIsVisible(openData.index % 4 === 2);
        this._labelMoveCost.setText(moveCost != null ? `${moveCost}` : `--`);
        this._unitView.update(new UiTypesUiUnitViewData.UiUnitViewData({
            gameConfig          : gameConfig,
            skinId              : ForceSkinsUtils.getDefaultSkinId(playerIndex),
            overridingSkinId    : undefined,
            unitData            : UnitsUtilsSerialization.createDefault({
                gridIndex   : { x: 0, y: 0 },
                playerIndex : playerIndex,
                unitTypeId  : openData.unitType,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }), CommonModelCommonModel.getUnitAnimationTickCount());
    }
}

interface DataForDamageRenderer extends UiTypesUiListItemData.UiListItemData {
    gameConfig          : GameConfigGcData.GcData;
    index               : number;
    targetTileType      : number;
    playerIndex         : number;
    attackerUnitType    : number;
}
class DamageRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForDamageRenderer> {
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBg!                : UiInterfacesIUiImage.IUiImage;
    private readonly _conView!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelPrimaryAttack!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSecondaryAttack! : UiInterfacesIUiLabel.IUiLabel;

    private readonly _unitView              = new (UiUtilsUiFactory.getUiUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.UnitAnimationTick,   callback: this._onNotifyUnitAnimationTick },
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

        this._imgBg.setIsVisible(openData.index % 4 === 2);

        const gameConfig        = openData.gameConfig;
        const targetTileType    = openData.targetTileType;
        const attackerUnitType  = openData.attackerUnitType;
        const playerIndex       = openData.playerIndex;
        this._unitView.update(new UiTypesUiUnitViewData.UiUnitViewData({
            gameConfig          : gameConfig,
            skinId              : ForceSkinsUtils.getDefaultSkinId(playerIndex),
            overridingSkinId    : undefined,
            unitData            : UnitsUtilsSerialization.createDefault({
                gridIndex   : { x: 0, y: 0 },
                unitTypeId  : attackerUnitType,
                playerIndex : playerIndex,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }), CommonModelCommonModel.getUnitAnimationTickCount());

        const attackCfg             = HelpersMisc.getExisted(gameConfig.getDamageChartCfgs(attackerUnitType));
        const targetArmorType       = HelpersMisc.getExisted(gameConfig.getTileTemplateCfg(targetTileType)?.getArmorTypeId());
        const primaryAttackDamage   = attackCfg[targetArmorType][UnitsConstants.WeaponTypeId.Primary].getDamage();
        const secondaryAttackDamage = attackCfg[targetArmorType][UnitsConstants.WeaponTypeId.Secondary].getDamage();
        this._labelPrimaryAttack.setText(primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`);
        this._labelSecondaryAttack.setText(secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`);
    }
}

function createInfoDefenseBonus(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getDefenseUnitCategoryId() === UnitsConstants.CategoryId.None)
        ? null
        : {
            index           : 0,
            infoType        : TilesConstantsCommon.InfoTypeId.DefenseBonus,
            tileTemplateCfg : tileTemplateCfg,
            gameConfig      : gameConfig,
        };
}
function createInfoIncome(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    const income = tileTemplateCfg.getIncomePerTurn();
    return income == 0
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.Income,
            tileTemplateCfg,
            gameConfig
        };
}
function createInfoVision(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return ((!tileTemplateCfg.getVisionRange()) && (!tileTemplateCfg.getIsVisionEnabledForAllPlayers()) && (tileTemplateCfg.getMaxCapturePoint() == null))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.Vision,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoHideUnitCategory(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getHideUnitCategoryId() == null)
        ? null
        :  {
            index           : 0,
            infoType        : TilesConstantsCommon.InfoTypeId.HideUnitCategory,
            tileTemplateCfg : tileTemplateCfg,
            gameConfig      : gameConfig,
        };
}
function createInfoIsDefeatOnCapture(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return !tileTemplateCfg.getIsDefeatedOnCapture()
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.IsDefeatedOnCapture,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoProduceUnitCategory(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return !tileTemplateCfg.getProduceUnitCategoryId()
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.ProduceUnitCategory,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoGlobalBonus(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return ((!tileTemplateCfg.getGlobalAttackBonus()) && (!tileTemplateCfg.getGlobalDefenseBonus()))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.GlobalBonus,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoRepairUnitCategory(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getRepairUnitCategoryId() == UnitsConstants.CategoryId.None)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.RepairUnitCategory,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoBlockEnemyUnit(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getBlockEnemyUnitCategoryId() == null)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.BlockEnemyUnit,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCoBoardUnit(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getCoBoardUnitCategoryId() == null)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CoBoardUnit,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoHp(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMaxHp() == null)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.Hp,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCapturePoint(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMaxCapturePoint() == null)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CapturePoint,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoBuildPoint(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMaxBuildPoint() == null)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.BuildPoint,
            tileTemplateCfg,
            gameConfig,
        };
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createInfoIsHighlighted(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return null;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createInfoBuff(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return null;
}
function createInfoCrystalRadius(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeapon.TypeId.Crystal) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.CustomCrystal))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CrystalRadius,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalPriority(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CrystalPriority,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalCanAffectSelf(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CrystalCanAffectSelf,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalCanAffectAlly(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CrystalCanAffectAlly,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalCanAffectEnemy(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CrystalCanAffectEnemy,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalDeltaFund(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CrystalDeltaFund,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalDeltaEnergyPercentage(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CrystalDeltaEnergyPercentage,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalDeltaHp(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeapon.TypeId.Crystal) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.CustomCrystal))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CrystalDeltaHp,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalDeltaFuelPercentage(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CrystalDeltaFuelPercentage,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalDeltaPrimaryAmmoPercentage(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CrystalDeltaPrimaryAmmoPercentage,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonRangeForUp(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeapon.TypeId.CannonUp) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.CustomCannon))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonRangeForUp,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonRangeForDown(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeapon.TypeId.CannonDown) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.CustomCannon))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonRangeForDown,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonRangeForLeft(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeapon.TypeId.CannonLeft) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.CustomCannon))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonRangeForLeft,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonRangeForRight(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeapon.TypeId.CannonRight) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.CustomCannon))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonRangeForRight,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonPriority(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonPriority,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonMaxTargetCount(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonMaxTargetCount,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonCanAffectSelf(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonCanAffectSelf,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonCanAffectAlly(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonCanAffectAlly,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonCanAffectEnemy(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonCanAffectEnemy,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonDeltaHp(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeapon.TypeId.CannonRight) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.CannonLeft) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.CannonDown) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.CannonUp) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.CustomCannon))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonDeltaHp,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonDeltaFuelPercentage(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonDeltaFuelPercentage,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonDeltaPrimaryAmmoPercentage(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.CannonDeltaPrimaryAmmoPercentage,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretRangeForUp(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.LaserTurret))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.LaserTurretRangeForUp,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretRangeForDown(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.LaserTurret))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.LaserTurretRangeForDown,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretRangeForLeft(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.LaserTurret))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.LaserTurretRangeForLeft,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretRangeForRight(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.LaserTurret))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.LaserTurretRangeForRight,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretPriority(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.LaserTurretPriority,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretCanAffectSelf(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectSelf,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretCanAffectAlly(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectAlly,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretCanAffectEnemy(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.LaserTurretCanAffectEnemy,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretDeltaHp(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret) && (mapWeaponType !== TilesConstantsMapWeapon.TypeId.LaserTurret))
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.LaserTurretDeltaHp,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretDeltaFuelPercentage(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.LaserTurretDeltaFuelPercentage,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretDeltaPrimaryAmmoPercentage(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigGcData.GcData): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== TilesConstantsMapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : TilesConstantsCommon.InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage,
            tileTemplateCfg,
            gameConfig,
        };
}
