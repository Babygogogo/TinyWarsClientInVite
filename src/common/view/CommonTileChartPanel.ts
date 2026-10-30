import { getUnitAnimationTickCount } from "../model/CommonModel.ts";
import { getDefaultSkinId } from "../../forceSkins/Utils.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import {
    getExisted,
    newError,
} from "../../helpers/Misc.ts";
import { getSignedNumText } from "../../helpers/Text.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getTileName,
    getSecondaryLanguageType,
    getUnitCategoryName,
    getText,
} from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type { TileTemplateCfg } from "../../proto/schema/CommonProto/Config/TileTemplateCfg.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { InfoTypeId } from "../../tiles/constants/Common.ts";
import {
    Crystal,
    CannonUp,
    CannonRight,
    CannonDown,
    CannonLeft,
    CustomCannon,
    CustomLaserTurret,
} from "../../tiles/constants/DefaultCustomTileData.ts";
import { TypeId as MapWeaponTypeId } from "../../tiles/constants/MapWeapon.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiItemTapEventData } from "../../ui/types/UiItemTapEventData.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { UiUnitViewData } from "../../ui/types/UiUnitViewData.ts";
import {
    getUiTileViewClass,
    getUiUnitViewClass,
} from "../../ui/utils/UiFactory.ts";
import {
    WeaponTypeId,
    CategoryId,
} from "../../units/Constants.ts";
import { createDefault } from "../../units/utils/Serialization.ts";

export interface OpenData {
    gameConfig   : GameConfig;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnSwitch!            : IUiButton;

    private readonly _listTile!             : IUiScrollList<DataForTileRenderer>;

    private readonly _groupInfo!            : IUiContainer;
    private readonly _layoutName!           : IUiLayout;
    private readonly _labelName!            : IUiLabel;
    private readonly _labelName1!           : IUiLabel;
    private readonly _conTileView!          : IUiContainer;
    private readonly _listInfo!             : IUiScrollList<DataForInfoRenderer>;

    private readonly _groupMoveCost!        : IUiContainer;
    private readonly _layoutMoveCost1!      : IUiLayout;
    private readonly _labelMoveCostTitle1!  : IUiLabel;
    private readonly _labelMoveCostTitle2!  : IUiLabel;
    private readonly _layoutMoveCost2!      : IUiLayout;
    private readonly _labelMoveCost1!       : IUiLabel;
    private readonly _labelMoveCost2!       : IUiLabel;
    private readonly _listMoveCost!         : IUiScrollList<DataForMoveCostRenderer>;

    private readonly _groupDamageChart!     : IUiContainer;
    private readonly _layoutDefense1!       : IUiLayout;
    private readonly _labelDefense1!        : IUiLabel;
    private readonly _labelMain1!           : IUiLabel;
    private readonly _labelSub1!            : IUiLabel;
    private readonly _layoutDefense2!       : IUiLayout;
    private readonly _labelDefense2!        : IUiLabel;
    private readonly _labelMain2!           : IUiLabel;
    private readonly _labelSub2!            : IUiLabel;
    private readonly _listDamageChart!      : IUiScrollList<DataForDamageRenderer>;

    private readonly _tileView              = new (getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.TileAnimationTick,           callback: this._onNotifyTileAnimationTick },
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
        openPanel(getDict().CommonDamageChartPanel, {
            gameConfig  : this.getOpenData()?.gameConfig,
        });
        this.closePanel();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0899);
        this._labelMoveCostTitle1.setLangText(TextType.B0351);
        this._labelMoveCostTitle2.setLangText(TextType.B0351);
        this._labelMoveCost1.setLangText(TextType.B1282);
        this._labelMoveCost2.setLangText(TextType.B1282);
        this._labelDefense1.setLangText(TextType.B0695);
        this._labelMain1.setLangText(TextType.B0692);
        this._labelSub1.setLangText(TextType.B0693);
        this._labelDefense2.setLangText(TextType.B0695);
        this._labelMain2.setLangText(TextType.B0692);
        this._labelSub2.setLangText(TextType.B0693);
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
            labelName.setText(getTileName(tileType, gameConfig) ?? UndefinedError);
            labelName1.setText(getTileName(tileType, gameConfig, getSecondaryLanguageType()) ?? UndefinedError);
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
            skinId                  : PlayerIndex.Neutral,
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

        const dataArray: DataForInfoRenderer[] = getNonNullElements([
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

        const tileCfg       = getExisted(gameConfig.getTileTemplateCfg(tileType));
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

        const playerIndex   = PlayerIndex.First;
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

interface DataForTileRenderer extends UiListItemData {
    tileType        : number;
    panel           : Panel;
    gameConfig      : GameConfig;
}
class TileRenderer extends UiListItemRenderer<DataForTileRenderer> {
    private readonly _conTileView!  : IUiContainer;

    private readonly _layoutName!   : IUiLayout;
    private readonly _labelId!      : IUiLabel;
    private readonly _labelName!    : IUiLabel;

    private readonly _tileView      = new (getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.TileAnimationTick,   callback: this._onNotifyTileAnimationTick },
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
        this._labelName.setText(getTileName(tileType, gameConfig) ?? UndefinedError);
        this._layoutName.arrangeItems();

        const tileView = this._tileView;
        tileView.init({
            tileBaseType            : gameConfig.getTileTemplateCfg(tileType)?.getToTileBaseTypeId() ?? null,
            tileBaseShapeId         : 0,
            tileDecorationType      : null,
            tileDecorationShapeId   : null,
            tileObjectType          : gameConfig.getTileTemplateCfg(tileType)?.getToTileObjectTypeId() ?? null,
            tileObjectShapeId       : 0,
            skinId                  : PlayerIndex.Neutral,
            overridingSkinId        : undefined,
            gameConfig              : gameConfig,
        });
        tileView.updateView();
    }

    public onItemTapEvent(e: UiItemTapEventData): void {
        this.getOpenData()?.panel.setSelectedIndexAndUpdateView(e.itemIndex, false);
    }
}

interface DataForInfoRenderer extends UiListItemData {
    gameConfig      : GameConfig;
    index           : number;
    infoType        : InfoTypeId;
    tileTemplateCfg : TileTemplateCfg;
}
class InfoRenderer extends UiListItemRenderer<DataForInfoRenderer> {
    private readonly _imgBg!            : IUiImage;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _labelValue!       : IUiLabel;
    private readonly _groupExtra!       : IUiContainer;
    private readonly _labelExtraInfo!   : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
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

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        if      (infoType === InfoTypeId.DefenseBonus)                            { this._showHelpAsDefenseBonus(); }
        else if (infoType === InfoTypeId.Income)                                  { this._showHelpAsIncome(); }
        else if (infoType === InfoTypeId.Vision)                                  { this._showHelpAsVision(); }
        else if (infoType === InfoTypeId.HideUnitCategory)                        { this._showHelpAsHideUnitCategory(); }
        else if (infoType === InfoTypeId.IsDefeatedOnCapture)                     { this._showHelpAsIsDefeatedOnCapture(); }
        else if (infoType === InfoTypeId.ProduceUnitCategory)                     { this._showHelpAsProduceUnitCategory(); }
        else if (infoType === InfoTypeId.GlobalBonus)                             { this._showHelpAsGlobalBonus(); }
        else if (infoType === InfoTypeId.RepairUnitCategory)                      { this._showHelpAsRepairUnitCategory(); }
        else if (infoType === InfoTypeId.BlockEnemyUnit)                          { this._showHelpAsBlockEnemyUnit(); }
        else if (infoType === InfoTypeId.CoBoardUnit)                             { this._showHelpAsCoBoardUnit(); }
        else if (infoType === InfoTypeId.Hp)                                      { this._showHelpAsHp(); }
        else if (infoType === InfoTypeId.CapturePoint)                            { this._showHelpAsCapturePoint(); }
        else if (infoType === InfoTypeId.BuildPoint)                              { this._showHelpAsBuildPoint(); }
        else if (infoType === InfoTypeId.IsHighlighted)                           { this._showHelpAsIsHighlighted(); }
        else if (infoType === InfoTypeId.Buff)                                    { this._showHelpAsBuff(); }

        else if (infoType === InfoTypeId.CrystalRadius)                           { this._showHelpAsCrystalRadius(); }
        else if (infoType === InfoTypeId.CrystalPriority)                         { this._showHelpAsCrystalPriority(); }
        else if (infoType === InfoTypeId.CrystalCanAffectSelf)                    { this._showHelpAsCrystalCanAffectSelf(); }
        else if (infoType === InfoTypeId.CrystalCanAffectAlly)                    { this._showHelpAsCrystalCanAffectAlly(); }
        else if (infoType === InfoTypeId.CrystalCanAffectEnemy)                   { this._showHelpAsCrystalCanAffectEnemy(); }
        else if (infoType === InfoTypeId.CrystalDeltaFund)                        { this._showHelpAsCrystalDeltaFund(); }
        else if (infoType === InfoTypeId.CrystalDeltaEnergyPercentage)            { this._showHelpAsCrystalDeltaEnergyPercentage(); }
        else if (infoType === InfoTypeId.CrystalDeltaHp)                          { this._showHelpAsCrystalDeltaHp(); }
        else if (infoType === InfoTypeId.CrystalDeltaFuelPercentage)              { this._showHelpAsCrystalDeltaFuelPercentage(); }
        else if (infoType === InfoTypeId.CrystalDeltaPrimaryAmmoPercentage)       { this._showHelpAsCrystalDeltaPrimaryAmmoPercentage(); }
        else if (infoType === InfoTypeId.CannonRangeForUp)                        { this._showHelpAsCannonRangeForUp(); }
        else if (infoType === InfoTypeId.CannonRangeForRight)                     { this._showHelpAsCannonRangeForRight(); }
        else if (infoType === InfoTypeId.CannonRangeForLeft)                      { this._showHelpAsCannonRangeForLeft(); }
        else if (infoType === InfoTypeId.CannonRangeForDown)                      { this._showHelpAsCannonRangeForDown(); }
        else if (infoType === InfoTypeId.CannonPriority)                          { this._showHelpAsCannonPriority(); }
        else if (infoType === InfoTypeId.CannonMaxTargetCount)                    { this._showHelpAsCannonMaxTargetCount(); }
        else if (infoType === InfoTypeId.CannonCanAffectSelf)                     { this._showHelpAsCannonCanAffectSelf(); }
        else if (infoType === InfoTypeId.CannonCanAffectAlly)                     { this._showHelpAsCannonCanAffectAlly(); }
        else if (infoType === InfoTypeId.CannonCanAffectEnemy)                    { this._showHelpAsCannonCanAffectEnemy(); }
        else if (infoType === InfoTypeId.CannonDeltaHp)                           { this._showHelpAsCannonDeltaHp(); }
        else if (infoType === InfoTypeId.CannonDeltaFuelPercentage)               { this._showHelpAsCannonDeltaFuelPercentage(); }
        else if (infoType === InfoTypeId.CannonDeltaPrimaryAmmoPercentage)        { this._showHelpAsCannonDeltaPrimaryAmmoPercentage(); }
        else if (infoType === InfoTypeId.LaserTurretRangeForUp)                   { this._showHelpAsLaserTurretRangeForUp(); }
        else if (infoType === InfoTypeId.LaserTurretRangeForRight)                { this._showHelpAsLaserTurretRangeForRight(); }
        else if (infoType === InfoTypeId.LaserTurretRangeForLeft)                 { this._showHelpAsLaserTurretRangeForLeft(); }
        else if (infoType === InfoTypeId.LaserTurretRangeForDown)                 { this._showHelpAsLaserTurretRangeForDown(); }
        else if (infoType === InfoTypeId.LaserTurretPriority)                     { this._showHelpAsLaserTurretPriority(); }
        else if (infoType === InfoTypeId.LaserTurretCanAffectSelf)                { this._showHelpAsLaserTurretCanAffectSelf(); }
        else if (infoType === InfoTypeId.LaserTurretCanAffectAlly)                { this._showHelpAsLaserTurretCanAffectAlly(); }
        else if (infoType === InfoTypeId.LaserTurretCanAffectEnemy)               { this._showHelpAsLaserTurretCanAffectEnemy(); }
        else if (infoType === InfoTypeId.LaserTurretDeltaHp)                      { this._showHelpAsLaserTurretDeltaHp(); }
        else if (infoType === InfoTypeId.LaserTurretDeltaFuelPercentage)          { this._showHelpAsLaserTurretDeltaFuelPercentage(); }
        else if (infoType === InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage)   { this._showHelpAsLaserTurretDeltaPrimaryAmmoPercentage(); }
        else {
            throw newError(`Invalid infoType: ${infoType}`);
        }
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgBg.setIsVisible(openData.index % 2 === 0);

        const infoType = openData.infoType;
        if      (infoType === InfoTypeId.DefenseBonus)                            { this._updateViewAsDefenseBonus(); }
        else if (infoType === InfoTypeId.Income)                                  { this._updateViewAsIncome(); }
        else if (infoType === InfoTypeId.Vision)                                  { this._updateViewAsVision(); }
        else if (infoType === InfoTypeId.HideUnitCategory)                        { this._updateViewAsHideUnitCategory(); }
        else if (infoType === InfoTypeId.IsDefeatedOnCapture)                     { this._updateViewAsIsDefeatedOnCapture(); }
        else if (infoType === InfoTypeId.ProduceUnitCategory)                     { this._updateViewAsProduceUnitCategory(); }
        else if (infoType === InfoTypeId.GlobalBonus)                             { this._updateViewAsGlobalBonus(); }
        else if (infoType === InfoTypeId.RepairUnitCategory)                      { this._updateViewAsRepairUnitCategory(); }
        else if (infoType === InfoTypeId.BlockEnemyUnit)                          { this._updateViewAsBlockEnemyUnit(); }
        else if (infoType === InfoTypeId.CoBoardUnit)                             { this._updateViewAsCoBoardUnit(); }
        else if (infoType === InfoTypeId.Hp)                                      { this._updateViewAsHp(); }
        else if (infoType === InfoTypeId.CapturePoint)                            { this._updateViewAsCapturePoint(); }
        else if (infoType === InfoTypeId.BuildPoint)                              { this._updateViewAsBuildPoint(); }
        else if (infoType === InfoTypeId.IsHighlighted)                           { this._updateViewAsIsHighlighted(); }
        else if (infoType === InfoTypeId.Buff)                                    { this._updateViewAsBuff(); }

        else if (infoType === InfoTypeId.CrystalRadius)                           { this._updateViewAsCrystalRadius(); }
        else if (infoType === InfoTypeId.CrystalPriority)                         { this._updateViewAsCrystalPriority(); }
        else if (infoType === InfoTypeId.CrystalCanAffectSelf)                    { this._updateViewAsCrystalCanAffectSelf(); }
        else if (infoType === InfoTypeId.CrystalCanAffectAlly)                    { this._updateViewAsCrystalCanAffectAlly(); }
        else if (infoType === InfoTypeId.CrystalCanAffectEnemy)                   { this._updateViewAsCrystalCanAffectEnemy(); }
        else if (infoType === InfoTypeId.CrystalDeltaFund)                        { this._updateViewAsCrystalDeltaFund(); }
        else if (infoType === InfoTypeId.CrystalDeltaEnergyPercentage)            { this._updateViewAsCrystalDeltaEnergyPercentage(); }
        else if (infoType === InfoTypeId.CrystalDeltaHp)                          { this._updateViewAsCrystalDeltaHp(); }
        else if (infoType === InfoTypeId.CrystalDeltaFuelPercentage)              { this._updateViewAsCrystalDeltaFuelPercentage(); }
        else if (infoType === InfoTypeId.CrystalDeltaPrimaryAmmoPercentage)       { this._updateViewAsCrystalDeltaPrimaryAmmoPercentage(); }
        else if (infoType === InfoTypeId.CannonRangeForUp)                        { this._updateViewAsCannonRangeForUp(); }
        else if (infoType === InfoTypeId.CannonRangeForRight)                     { this._updateViewAsCannonRangeForRight(); }
        else if (infoType === InfoTypeId.CannonRangeForLeft)                      { this._updateViewAsCannonRangeForLeft(); }
        else if (infoType === InfoTypeId.CannonRangeForDown)                      { this._updateViewAsCannonRangeForDown(); }
        else if (infoType === InfoTypeId.CannonPriority)                          { this._updateViewAsCannonPriority(); }
        else if (infoType === InfoTypeId.CannonMaxTargetCount)                    { this._updateViewAsCannonMaxTargetCount(); }
        else if (infoType === InfoTypeId.CannonCanAffectSelf)                     { this._updateViewAsCannonCanAffectSelf(); }
        else if (infoType === InfoTypeId.CannonCanAffectAlly)                     { this._updateViewAsCannonCanAffectAlly(); }
        else if (infoType === InfoTypeId.CannonCanAffectEnemy)                    { this._updateViewAsCannonCanAffectEnemy(); }
        else if (infoType === InfoTypeId.CannonDeltaHp)                           { this._updateViewAsCannonDeltaHp(); }
        else if (infoType === InfoTypeId.CannonDeltaFuelPercentage)               { this._updateViewAsCannonDeltaFuelPercentage(); }
        else if (infoType === InfoTypeId.CannonDeltaPrimaryAmmoPercentage)        { this._updateViewAsCannonDeltaPrimaryAmmoPercentage(); }
        else if (infoType === InfoTypeId.LaserTurretRangeForUp)                   { this._updateViewAsLaserTurretRangeForUp(); }
        else if (infoType === InfoTypeId.LaserTurretRangeForRight)                { this._updateViewAsLaserTurretRangeForRight(); }
        else if (infoType === InfoTypeId.LaserTurretRangeForLeft)                 { this._updateViewAsLaserTurretRangeForLeft(); }
        else if (infoType === InfoTypeId.LaserTurretRangeForDown)                 { this._updateViewAsLaserTurretRangeForDown(); }
        else if (infoType === InfoTypeId.LaserTurretPriority)                     { this._updateViewAsLaserTurretPriority(); }
        else if (infoType === InfoTypeId.LaserTurretCanAffectSelf)                { this._updateViewAsLaserTurretCanAffectSelf(); }
        else if (infoType === InfoTypeId.LaserTurretCanAffectAlly)                { this._updateViewAsLaserTurretCanAffectAlly(); }
        else if (infoType === InfoTypeId.LaserTurretCanAffectEnemy)               { this._updateViewAsLaserTurretCanAffectEnemy(); }
        else if (infoType === InfoTypeId.LaserTurretDeltaHp)                      { this._updateViewAsLaserTurretOffsetHp(); }
        else if (infoType === InfoTypeId.LaserTurretDeltaFuelPercentage)          { this._updateViewAsLaserTurretDeltaFuelPercentage(); }
        else if (infoType === InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage)   { this._updateViewAsLaserTurretDeltaPrimaryAmmoPercentage(); }
        else {
            throw newError(`Invalid infoType: ${infoType}`);
        }
    }
    private _updateViewAsDefenseBonus(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tileTemplateCfg = openData.tileTemplateCfg;
        this._labelTitle.setLangText(TextType.B0352);
        this._labelValue.setText(getUnitCategoryName(
            tileTemplateCfg.getDefenseUnitCategoryId(),
            openData.gameConfig
        ) ?? UndefinedError);
        this._groupExtra.setIsVisible(true);
        this._labelExtraInfo.setText(`${getSignedNumText(tileTemplateCfg.getDefenseAmount())}`);
    }
    private _updateViewAsIncome(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tileTemplateCfg = openData.tileTemplateCfg;
        this._labelTitle.setLangText(TextType.Income);
        this._labelValue.setText(`${tileTemplateCfg.getIncomePerTurn()}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsVision(): void {
        const tileTemplateCfg = this.getOpenData()?.tileTemplateCfg;
        if (tileTemplateCfg == null) {
            return;
        }

        this._labelTitle.setLangText(TextType.VisionRange);
        this._labelValue.setText(`${tileTemplateCfg.getVisionRange()}`);

        const groupExtra = this._groupExtra;
        if (!tileTemplateCfg.getIsVisionEnabledForAllPlayers()) {
            groupExtra.setIsVisible(false);
        } else {
            groupExtra.setIsVisible(true);
            this._labelExtraInfo.setLangText(TextType.B1130);
        }
    }
    private _updateViewAsHideUnitCategory(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitCategory = openData.tileTemplateCfg.getHideUnitCategoryId();
        this._labelTitle.setLangText(TextType.HidableUnits);
        this._labelValue.setText(unitCategory == null
            ? `--`
            : (getUnitCategoryName(unitCategory, openData.gameConfig) ?? UndefinedError)
        );
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsIsDefeatedOnCapture(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setLangText(TextType.DefeatIfCaptured);
        this._labelValue.setLangText(openData.tileTemplateCfg.getIsDefeatedOnCapture() ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsProduceUnitCategory(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitCategory = openData.tileTemplateCfg.getProduceUnitCategoryId();
        this._labelTitle.setLangText(TextType.ProducibleUnits);
        this._labelValue.setText(unitCategory == null
            ? `--`
            : (getUnitCategoryName(unitCategory, openData.gameConfig) ?? UndefinedError)
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
        this._labelTitle.setLangText(TextType.B0359);
        this._labelValue.setText(`${offenseBonus} / ${defenseBonus}`);
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
        this._labelTitle.setLangText(TextType.RepairableUnits);
        this._labelValue.setText(unitCategory == null
            ? `--`
            : (getUnitCategoryName(unitCategory, openData.gameConfig) ?? UndefinedError)
        );
        this._groupExtra.setIsVisible(true);
        this._labelExtraInfo.setText(repairNormalizedHp == null ? getText(TextType.B0044) : `${getSignedNumText(repairNormalizedHp * 10)}`);
    }
    private _updateViewAsHp(): void {
        const tileTemplateCfg = this.getOpenData()?.tileTemplateCfg;
        if (tileTemplateCfg == null) {
            return;
        }

        const maxHp = tileTemplateCfg.getMaxHp();
        this._labelTitle.setLangText(TextType.Hp);
        this._labelValue.setText(`${maxHp} / ${maxHp}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCapturePoint(): void {
        const tileTemplateCfg = this.getOpenData()?.tileTemplateCfg;
        if (tileTemplateCfg == null) {
            return;
        }

        const maxCapturePoint = tileTemplateCfg.getMaxCapturePoint();
        this._labelTitle.setLangText(TextType.CapturePoint);
        this._labelValue.setText(`${maxCapturePoint} / ${maxCapturePoint}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsBuildPoint(): void {
        const tileTemplateCfg = this.getOpenData()?.tileTemplateCfg;
        if (tileTemplateCfg == null) {
            return;
        }

        const maxBuildPoint = tileTemplateCfg.getMaxBuildPoint();
        this._labelTitle.setLangText(TextType.BuildPoint);
        this._labelValue.setText(`${maxBuildPoint} / ${maxBuildPoint}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsIsHighlighted(): void {
        this._labelTitle.setLangText(TextType.B0847);
        this._labelValue.setLangText(TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsBuff(): void {
        this._labelTitle.setLangText(TextType.AbnormalStates);
        this._labelValue.setLangText(TextType.None);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsBlockEnemyUnit(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setLangText(TextType.BlockableEnemyUnits);
        this._labelValue.setText(getUnitCategoryName(
            openData.tileTemplateCfg.getBlockEnemyUnitCategoryId() ?? 0,
            openData.gameConfig
        ) ?? UndefinedError);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCoBoardUnit(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setLangText(TextType.CoBoardableUnit);
        this._labelValue.setText(getUnitCategoryName(
            openData.tileTemplateCfg.getCoBoardUnitCategoryId() ?? 0,
            openData.gameConfig
        ) ?? UndefinedError);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalRadius(): void {
        const currentValue          = Crystal.getRadius();
        this._labelTitle.setLangText(TextType.EffectiveRadius);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalPriority(): void {
        const currentValue          = Crystal.getPriority();
        this._labelTitle.setLangText(TextType.Priority);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalCanAffectSelf(): void {
        const currentValue          = Crystal.getCanAffectSelf();
        this._labelTitle.setLangText(TextType.AffectOwner);
        this._labelValue.setLangText(currentValue ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalCanAffectAlly(): void {
        const currentValue          = Crystal.getCanAffectAlly();
        this._labelTitle.setLangText(TextType.AffectAlly);
        this._labelValue.setLangText(currentValue ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalCanAffectEnemy(): void {
        const currentValue          = Crystal.getCanAffectEnemy();
        this._labelTitle.setLangText(TextType.AffectEnemy);
        this._labelValue.setLangText(currentValue ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalDeltaFund(): void {
        const currentValue          = Crystal.getOffsetFund();
        this._labelTitle.setLangText(TextType.FundOffset);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalDeltaEnergyPercentage(): void {
        const currentValue          = Crystal.getOffsetEnergyPercentage();
        this._labelTitle.setLangText(TextType.CoEnergyOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalDeltaHp(): void {
        const data          = Crystal;
        const offsetHp      = data.getOffsetHp();
        const canBeFatal    = data.getCanBeFatal();
        this._labelTitle.setLangText(TextType.UnitsHpOffset);
        this._labelValue.setText(`${offsetHp}`);
        this._groupExtra.setIsVisible(canBeFatal);
        this._labelExtraInfo.setLangText(TextType.CanBeFatal);
    }
    private _updateViewAsCrystalDeltaFuelPercentage(): void {
        const currentValue          = Crystal.getOffsetFuelPercentage();
        this._labelTitle.setLangText(TextType.UnitsFuelOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalDeltaPrimaryAmmoPercentage(): void {
        const currentValue          = Crystal.getOffsetPrimaryAmmoPercentage();
        this._labelTitle.setLangText(TextType.UnitsPriAmmoOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonRangeForUp(): void {
        const currentValue          = CannonUp.getRangeForUp();
        this._labelTitle.setLangText(TextType.RangeUp);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonRangeForRight(): void {
        const currentValue          = CannonRight.getRangeForRight();
        this._labelTitle.setLangText(TextType.RangeRight);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonRangeForDown(): void {
        const currentValue          = CannonDown.getRangeForDown();
        this._labelTitle.setLangText(TextType.RangeDown);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonRangeForLeft(): void {
        const currentValue          = CannonLeft.getRangeForLeft();
        this._labelTitle.setLangText(TextType.RangeLeft);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonPriority(): void {
        const currentValue          = CustomCannon.getPriority();
        this._labelTitle.setLangText(TextType.Priority);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonMaxTargetCount(): void {
        const currentValue          = CustomCannon.getMaxTargetCount();
        this._labelTitle.setLangText(TextType.MaxTargets);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonCanAffectSelf(): void {
        const currentValue          = CustomCannon.getCanAffectSelf();
        this._labelTitle.setLangText(TextType.AffectOwner);
        this._labelValue.setLangText(currentValue ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonCanAffectAlly(): void {
        const currentValue          = CustomCannon.getCanAffectAlly();
        this._labelTitle.setLangText(TextType.AffectAlly);
        this._labelValue.setLangText(currentValue ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonCanAffectEnemy(): void {
        const currentValue          = CustomCannon.getCanAffectEnemy();
        this._labelTitle.setLangText(TextType.AffectEnemy);
        this._labelValue.setLangText(currentValue ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonDeltaHp(): void {
        const data          = CustomCannon;
        const offsetHp      = data.getOffsetHp();
        const canBeFatal    = data.getCanBeFatal();
        this._labelTitle.setLangText(TextType.UnitsHpOffset);
        this._labelValue.setText(`${offsetHp}`);
        this._groupExtra.setIsVisible(canBeFatal);
        this._labelExtraInfo.setLangText(TextType.CanBeFatal);
    }
    private _updateViewAsCannonDeltaFuelPercentage(): void {
        const currentValue          = CustomCannon.getOffsetFuelPercentage();
        this._labelTitle.setLangText(TextType.UnitsFuelOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonDeltaPrimaryAmmoPercentage(): void {
        const currentValue          = CustomCannon.getOffsetPrimaryAmmoPercentage();
        this._labelTitle.setLangText(TextType.UnitsPriAmmoOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretRangeForUp(): void {
        const currentValue          = CustomLaserTurret.getRangeForUp();
        this._labelTitle.setLangText(TextType.RangeUp);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretRangeForRight(): void {
        const currentValue          = CustomLaserTurret.getRangeForRight();
        this._labelTitle.setLangText(TextType.RangeRight);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretRangeForDown(): void {
        const currentValue          = CustomLaserTurret.getRangeForDown();
        this._labelTitle.setLangText(TextType.RangeDown);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretRangeForLeft(): void {
        const currentValue          = CustomLaserTurret.getRangeForLeft();
        this._labelTitle.setLangText(TextType.RangeLeft);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretPriority(): void {
        const currentValue          = CustomLaserTurret.getPriority();
        this._labelTitle.setLangText(TextType.Priority);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretCanAffectSelf(): void {
        const currentValue          = CustomLaserTurret.getCanAffectSelf();
        this._labelTitle.setLangText(TextType.AffectOwner);
        this._labelValue.setLangText(currentValue ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretCanAffectAlly(): void {
        const currentValue          = CustomLaserTurret.getCanAffectAlly();
        this._labelTitle.setLangText(TextType.AffectAlly);
        this._labelValue.setLangText(currentValue ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretCanAffectEnemy(): void {
        const currentValue          = CustomLaserTurret.getCanAffectEnemy();
        this._labelTitle.setLangText(TextType.AffectEnemy);
        this._labelValue.setLangText(currentValue ? TextType.Yes : TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretOffsetHp(): void {
        const data          = CustomLaserTurret;
        const offsetHp      = data.getOffsetHp();
        const canBeFatal    = data.getCanBeFatal();
        this._labelTitle.setLangText(TextType.UnitsHpOffset);
        this._labelValue.setText(`${offsetHp}`);
        this._groupExtra.setIsVisible(canBeFatal);
        this._labelExtraInfo.setLangText(TextType.CanBeFatal);
    }
    private _updateViewAsLaserTurretDeltaFuelPercentage(): void {
        const currentValue          = CustomLaserTurret.getOffsetFuelPercentage();
        this._labelTitle.setLangText(TextType.UnitsFuelOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretDeltaPrimaryAmmoPercentage(): void {
        const currentValue          = CustomLaserTurret.getOffsetPrimaryAmmoPercentage();
        this._labelTitle.setLangText(TextType.UnitsPriAmmoOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }

    private _showHelpAsDefenseBonus(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.B0352),
            getContent : () => getText(TextType.A0088),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsIncome(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.Income),
            getContent : () => getText(TextType.A0086),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsVision(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.VisionRange),
            getContent : () => getText(TextType.A0082),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsHideUnitCategory(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.HidableUnits),
            getContent : () => getText(TextType.A0079),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsIsDefeatedOnCapture(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.DefeatIfCaptured),
            getContent : () => getText(TextType.A0077),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsProduceUnitCategory(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.ProducibleUnits),
            getContent : () => getText(TextType.A0074),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsGlobalBonus(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.B0359),
            getContent : () => getText(TextType.A0068),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsRepairUnitCategory(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.RepairableUnits),
            getContent : () => getText(TextType.A0065),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsBlockEnemyUnit(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.BlockableEnemyUnits),
            getContent : () => getText(TextType.A0012),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsCoBoardUnit(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.CoBoardableUnit),
            getContent : () => getText(TextType.A0011),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsHp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.Hp),
            getContent : () => getText(TextType.A0059),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsCapturePoint(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.CapturePoint),
            getContent : () => getText(TextType.A0052),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsBuildPoint(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.BuildPoint),
            getContent : () => getText(TextType.A0051),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsIsHighlighted(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.B0847),
            getContent : () => getText(TextType.A0050),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsBuff(): void {
        openPanel(getDict().CommonHelpPanel, {
            getTitle   : () => getText(TextType.AbnormalStates),
            getContent : () => getText(TextType.A0737),
        });
        playShortSfx(ShortSfxCode.ButtonNeutral01);
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

interface DataForMoveCostRenderer extends UiListItemData {
    index           : number;
    gameConfig      : GameConfig;
    unitType        : number;
    tileCfg         : TileTemplateCfg;
}
class MoveCostRenderer extends UiListItemRenderer<DataForMoveCostRenderer> {
    private readonly _group!            : IUiContainer;
    private readonly _imgBg!            : IUiImage;
    private readonly _conView!          : IUiContainer;
    private readonly _labelMoveCost!    : IUiLabel;

    private readonly _unitView          = new (getUiUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.UnitAnimationTick,   callback: this._onNotifyUnitAnimationTick },
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

        const gameConfig    = openData.gameConfig;
        const unitType      = openData.unitType;
        const moveCostCfg   = getExisted(gameConfig.getMoveCostCfg(openData.tileCfg.getTileTypeId()));
        const moveCost      = moveCostCfg[getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getMoveTypeId())].getCost();
        const playerIndex   = PlayerIndex.First;
        this._imgBg.setIsVisible(openData.index % 4 === 2);
        this._labelMoveCost.setText(moveCost != null ? `${moveCost}` : `--`);
        this._unitView.update(new UiUnitViewData({
            gameConfig          : gameConfig,
            skinId              : getDefaultSkinId(playerIndex),
            overridingSkinId    : undefined,
            unitData            : createDefault({
                gridIndex   : { x: 0, y: 0 },
                playerIndex : playerIndex,
                unitTypeId  : openData.unitType,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }), getUnitAnimationTickCount());
    }
}

interface DataForDamageRenderer extends UiListItemData {
    gameConfig          : GameConfig;
    index               : number;
    targetTileType      : number;
    playerIndex         : number;
    attackerUnitType    : number;
}
class DamageRenderer extends UiListItemRenderer<DataForDamageRenderer> {
    private readonly _group!                : IUiContainer;
    private readonly _imgBg!                : IUiImage;
    private readonly _conView!              : IUiContainer;
    private readonly _labelPrimaryAttack!   : IUiLabel;
    private readonly _labelSecondaryAttack! : IUiLabel;

    private readonly _unitView              = new (getUiUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.UnitAnimationTick,   callback: this._onNotifyUnitAnimationTick },
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

        this._imgBg.setIsVisible(openData.index % 4 === 2);

        const gameConfig        = openData.gameConfig;
        const targetTileType    = openData.targetTileType;
        const attackerUnitType  = openData.attackerUnitType;
        const playerIndex       = openData.playerIndex;
        this._unitView.update(new UiUnitViewData({
            gameConfig          : gameConfig,
            skinId              : getDefaultSkinId(playerIndex),
            overridingSkinId    : undefined,
            unitData            : createDefault({
                gridIndex   : { x: 0, y: 0 },
                unitTypeId  : attackerUnitType,
                playerIndex : playerIndex,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }), getUnitAnimationTickCount());

        const attackCfg             = getExisted(gameConfig.getDamageChartCfgs(attackerUnitType));
        const targetArmorType       = getExisted(gameConfig.getTileTemplateCfg(targetTileType)?.getArmorTypeId());
        const primaryAttackDamage   = attackCfg[targetArmorType][WeaponTypeId.Primary].getDamage();
        const secondaryAttackDamage = attackCfg[targetArmorType][WeaponTypeId.Secondary].getDamage();
        this._labelPrimaryAttack.setText(primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`);
        this._labelSecondaryAttack.setText(secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`);
    }
}

function createInfoDefenseBonus(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getDefenseUnitCategoryId() === CategoryId.None)
        ? null
        : {
            index           : 0,
            infoType        : InfoTypeId.DefenseBonus,
            tileTemplateCfg : tileTemplateCfg,
            gameConfig      : gameConfig,
        };
}
function createInfoIncome(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    const income = tileTemplateCfg.getIncomePerTurn();
    return income == 0
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.Income,
            tileTemplateCfg,
            gameConfig
        };
}
function createInfoVision(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return ((!tileTemplateCfg.getVisionRange()) && (!tileTemplateCfg.getIsVisionEnabledForAllPlayers()) && (tileTemplateCfg.getMaxCapturePoint() == null))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.Vision,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoHideUnitCategory(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getHideUnitCategoryId() == null)
        ? null
        :  {
            index           : 0,
            infoType        : InfoTypeId.HideUnitCategory,
            tileTemplateCfg : tileTemplateCfg,
            gameConfig      : gameConfig,
        };
}
function createInfoIsDefeatOnCapture(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return !tileTemplateCfg.getIsDefeatedOnCapture()
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.IsDefeatedOnCapture,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoProduceUnitCategory(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return !tileTemplateCfg.getProduceUnitCategoryId()
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.ProduceUnitCategory,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoGlobalBonus(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return ((!tileTemplateCfg.getGlobalAttackBonus()) && (!tileTemplateCfg.getGlobalDefenseBonus()))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.GlobalBonus,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoRepairUnitCategory(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getRepairUnitCategoryId() == CategoryId.None)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.RepairUnitCategory,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoBlockEnemyUnit(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getBlockEnemyUnitCategoryId() == null)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.BlockEnemyUnit,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCoBoardUnit(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getCoBoardUnitCategoryId() == null)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CoBoardUnit,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoHp(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMaxHp() == null)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.Hp,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCapturePoint(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMaxCapturePoint() == null)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CapturePoint,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoBuildPoint(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMaxBuildPoint() == null)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.BuildPoint,
            tileTemplateCfg,
            gameConfig,
        };
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createInfoIsHighlighted(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return null;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createInfoBuff(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return null;
}
function createInfoCrystalRadius(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== MapWeaponTypeId.Crystal) && (mapWeaponType !== MapWeaponTypeId.CustomCrystal))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CrystalRadius,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalPriority(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== MapWeaponTypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CrystalPriority,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalCanAffectSelf(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== MapWeaponTypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CrystalCanAffectSelf,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalCanAffectAlly(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== MapWeaponTypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CrystalCanAffectAlly,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalCanAffectEnemy(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== MapWeaponTypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CrystalCanAffectEnemy,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalDeltaFund(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== MapWeaponTypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CrystalDeltaFund,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalDeltaEnergyPercentage(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== MapWeaponTypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CrystalDeltaEnergyPercentage,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalDeltaHp(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== MapWeaponTypeId.Crystal) && (mapWeaponType !== MapWeaponTypeId.CustomCrystal))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CrystalDeltaHp,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalDeltaFuelPercentage(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== MapWeaponTypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CrystalDeltaFuelPercentage,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalDeltaPrimaryAmmoPercentage(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== MapWeaponTypeId.CustomCrystal)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CrystalDeltaPrimaryAmmoPercentage,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonRangeForUp(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== MapWeaponTypeId.CannonUp) && (mapWeaponType !== MapWeaponTypeId.CustomCannon))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonRangeForUp,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonRangeForDown(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== MapWeaponTypeId.CannonDown) && (mapWeaponType !== MapWeaponTypeId.CustomCannon))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonRangeForDown,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonRangeForLeft(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== MapWeaponTypeId.CannonLeft) && (mapWeaponType !== MapWeaponTypeId.CustomCannon))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonRangeForLeft,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonRangeForRight(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== MapWeaponTypeId.CannonRight) && (mapWeaponType !== MapWeaponTypeId.CustomCannon))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonRangeForRight,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonPriority(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== MapWeaponTypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonPriority,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonMaxTargetCount(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== MapWeaponTypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonMaxTargetCount,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonCanAffectSelf(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== MapWeaponTypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonCanAffectSelf,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonCanAffectAlly(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== MapWeaponTypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonCanAffectAlly,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonCanAffectEnemy(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== MapWeaponTypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonCanAffectEnemy,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonDeltaHp(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== MapWeaponTypeId.CannonRight) && (mapWeaponType !== MapWeaponTypeId.CannonLeft) && (mapWeaponType !== MapWeaponTypeId.CannonDown) && (mapWeaponType !== MapWeaponTypeId.CannonUp) && (mapWeaponType !== MapWeaponTypeId.CustomCannon))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonDeltaHp,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonDeltaFuelPercentage(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== MapWeaponTypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonDeltaFuelPercentage,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonDeltaPrimaryAmmoPercentage(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== MapWeaponTypeId.CustomCannon)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.CannonDeltaPrimaryAmmoPercentage,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretRangeForUp(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== MapWeaponTypeId.CustomLaserTurret) && (mapWeaponType !== MapWeaponTypeId.LaserTurret))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.LaserTurretRangeForUp,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretRangeForDown(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== MapWeaponTypeId.CustomLaserTurret) && (mapWeaponType !== MapWeaponTypeId.LaserTurret))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.LaserTurretRangeForDown,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretRangeForLeft(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== MapWeaponTypeId.CustomLaserTurret) && (mapWeaponType !== MapWeaponTypeId.LaserTurret))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.LaserTurretRangeForLeft,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretRangeForRight(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== MapWeaponTypeId.CustomLaserTurret) && (mapWeaponType !== MapWeaponTypeId.LaserTurret))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.LaserTurretRangeForRight,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretPriority(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== MapWeaponTypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.LaserTurretPriority,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretCanAffectSelf(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== MapWeaponTypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.LaserTurretCanAffectSelf,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretCanAffectAlly(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== MapWeaponTypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.LaserTurretCanAffectAlly,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretCanAffectEnemy(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== MapWeaponTypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.LaserTurretCanAffectEnemy,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretDeltaHp(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== MapWeaponTypeId.CustomLaserTurret) && (mapWeaponType !== MapWeaponTypeId.LaserTurret))
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.LaserTurretDeltaHp,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretDeltaFuelPercentage(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== MapWeaponTypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.LaserTurretDeltaFuelPercentage,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretDeltaPrimaryAmmoPercentage(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== MapWeaponTypeId.CustomLaserTurret)
        ? null
        : {
            index       : 0,
            infoType    : InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage,
            tileTemplateCfg,
            gameConfig,
        };
}
