import {
    Tiles_Constants_DefaultCustomTileData,
    ForceSkins_Utils,
    GamePanels_Dict,
    Helpers_Misc,
    Helpers_Collection,
    Lang_Utils,
    Helpers_Text,
    Common_Model_CommonModel,
    Tiles_Constants_Common,
    Tiles_Constants_MapWeapon,
    GamePanels_Manager,
    Players_Constants,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
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
    type Ui_Types_UiItemTapEventData,
    type Ui_Types_UiListItemData,
    Units_Constants,
    Units_Utils_Serialization,
} from "../../internal.ts";
import type { TileTemplateCfg } from "../../proto/schema/CommonProto/Config/TileTemplateCfg.ts";

export interface OpenData {
    gameConfig   : GameConfigs_GameConfig.GameConfig;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSwitch!            : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _listTile!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForTileRenderer>;

    private readonly _groupInfo!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutName!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelName!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName1!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _conTileView!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listInfo!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForInfoRenderer>;

    private readonly _groupMoveCost!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutMoveCost1!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMoveCostTitle1!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMoveCostTitle2!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _layoutMoveCost2!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMoveCost1!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMoveCost2!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listMoveCost!         : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForMoveCostRenderer>;

    private readonly _groupDamageChart!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutDefense1!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDefense1!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMain1!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSub1!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _layoutDefense2!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDefense2!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMain2!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSub2!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listDamageChart!      : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForDamageRenderer>;

    private readonly _tileView              = new Ui_Components_UiTileView.UiTileView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",             callback : this._onNotifyLanguageChanged },
            { type : "TileAnimationTick",           callback : this._onNotifyTileAnimationTick },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,   callback : this.closePanel },
            { ui : this._btnSwitch,  callback : this._onTouchedBtnSwitch },
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonDamageChartPanel, {
            gameConfig : this.getOpenData()?.gameConfig,
        });
        this.closePanel();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0899);
        this._labelMoveCostTitle1.setLangText(Lang_Constants.TextType.B0351);
        this._labelMoveCostTitle2.setLangText(Lang_Constants.TextType.B0351);
        this._labelMoveCost1.setLangText(Lang_Constants.TextType.B1282);
        this._labelMoveCost2.setLangText(Lang_Constants.TextType.B1282);
        this._labelDefense1.setLangText(Lang_Constants.TextType.B0695);
        this._labelMain1.setLangText(Lang_Constants.TextType.B0692);
        this._labelSub1.setLangText(Lang_Constants.TextType.B0693);
        this._labelDefense2.setLangText(Lang_Constants.TextType.B0695);
        this._labelMain2.setLangText(Lang_Constants.TextType.B0692);
        this._labelSub2.setLangText(Lang_Constants.TextType.B0693);
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
            labelName.setText(Lang_Utils.getTileName(tileType, gameConfig) ?? Lang_Constants.UndefinedError);
            labelName1.setText(Lang_Utils.getTileName(tileType, gameConfig, Lang_Utils.getSecondaryLanguageType()) ?? Lang_Constants.UndefinedError);
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
            tileBaseType          : gameConfig.getTileTemplateCfg(tileType)?.getToTileBaseTypeId() ?? null,
            tileBaseShapeId       : 0,
            tileDecorationType    : null,
            tileDecorationShapeId : null,
            tileObjectType        : gameConfig.getTileTemplateCfg(tileType)?.getToTileObjectTypeId() ?? null,
            tileObjectShapeId     : 0,
            skinId                : Players_Constants.PlayerIndex.Neutral,
            overridingSkinId      : undefined,
            gameConfig            : gameConfig,
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

        const dataArray: DataForInfoRenderer[] = Helpers_Collection.getNonNullElements([
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

        const tileCfg       = Helpers_Misc.getExisted(gameConfig.getTileTemplateCfg(tileType));
        const dataArray     : DataForMoveCostRenderer[] = [];
        let index           = 0;
        for (const unitType of gameConfig.getAllUnitTypeArray()) {
            dataArray.push({
                index      : index,
                gameConfig : gameConfig,
                unitType   : unitType,
                tileCfg    : tileCfg,
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

        const playerIndex   = Players_Constants.PlayerIndex.First;
        const dataArray     : DataForDamageRenderer[] = [];
        let index           = 0;
        for (const attackerUnitType of gameConfig.getAllUnitTypeArray()) {
            dataArray.push({
                gameConfig       : gameConfig,
                index            : index,
                targetTileType   : targetTileType,
                attackerUnitType : attackerUnitType,
                playerIndex      : playerIndex,
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
                tileType   : tileType,
                panel      : this,
                gameConfig : gameConfig,
            });
        }
        return dataArray;
    }
}

interface DataForTileRenderer extends Ui_Types_UiListItemData.UiListItemData {
    tileType        : number;
    panel           : Panel;
    gameConfig      : GameConfigs_GameConfig.GameConfig;
}
class TileRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForTileRenderer> {
    private readonly _conTileView!  : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _layoutName!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelId!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _tileView      = new Ui_Components_UiTileView.UiTileView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "TileAnimationTick",   callback : this._onNotifyTileAnimationTick },
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
        this._labelName.setText(Lang_Utils.getTileName(tileType, gameConfig) ?? Lang_Constants.UndefinedError);
        this._layoutName.arrangeItems();

        const tileView = this._tileView;
        tileView.init({
            tileBaseType          : gameConfig.getTileTemplateCfg(tileType)?.getToTileBaseTypeId() ?? null,
            tileBaseShapeId       : 0,
            tileDecorationType    : null,
            tileDecorationShapeId : null,
            tileObjectType        : gameConfig.getTileTemplateCfg(tileType)?.getToTileObjectTypeId() ?? null,
            tileObjectShapeId     : 0,
            skinId                : Players_Constants.PlayerIndex.Neutral,
            overridingSkinId      : undefined,
            gameConfig            : gameConfig,
        });
        tileView.updateView();
    }

    public onItemTapEvent(e: Ui_Types_UiItemTapEventData.UiItemTapEventData): void {
        this.getOpenData()?.panel.setSelectedIndexAndUpdateView(e.itemIndex, false);
    }
}

interface DataForInfoRenderer extends Ui_Types_UiListItemData.UiListItemData {
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    index           : number;
    infoType        : Tiles_Constants_Common.InfoTypeId;
    tileTemplateCfg : TileTemplateCfg;
}
class InfoRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
    private readonly _imgBg!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelValue!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupExtra!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelExtraInfo!   : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",     callback : this._onNotifyLanguageChanged },
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

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        if      (infoType === Tiles_Constants_Common.InfoTypeId.DefenseBonus)                            {
            this._showHelpAsDefenseBonus(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.Income)                                  {
            this._showHelpAsIncome(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.Vision)                                  {
            this._showHelpAsVision(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.HideUnitCategory)                        {
            this._showHelpAsHideUnitCategory(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.IsDefeatedOnCapture)                     {
            this._showHelpAsIsDefeatedOnCapture(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.ProduceUnitCategory)                     {
            this._showHelpAsProduceUnitCategory(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.GlobalBonus)                             {
            this._showHelpAsGlobalBonus(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.RepairUnitCategory)                      {
            this._showHelpAsRepairUnitCategory(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.BlockEnemyUnit)                          {
            this._showHelpAsBlockEnemyUnit(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CoBoardUnit)                             {
            this._showHelpAsCoBoardUnit(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.Hp)                                      {
            this._showHelpAsHp(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CapturePoint)                            {
            this._showHelpAsCapturePoint(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.BuildPoint)                              {
            this._showHelpAsBuildPoint(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.IsHighlighted)                           {
            this._showHelpAsIsHighlighted(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.Buff)                                    {
            this._showHelpAsBuff(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalRadius)                           {
            this._showHelpAsCrystalRadius(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalPriority)                         {
            this._showHelpAsCrystalPriority(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalCanAffectSelf)                    {
            this._showHelpAsCrystalCanAffectSelf(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalCanAffectAlly)                    {
            this._showHelpAsCrystalCanAffectAlly(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalCanAffectEnemy)                   {
            this._showHelpAsCrystalCanAffectEnemy(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaFund)                        {
            this._showHelpAsCrystalDeltaFund(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaEnergyPercentage)            {
            this._showHelpAsCrystalDeltaEnergyPercentage(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaHp)                          {
            this._showHelpAsCrystalDeltaHp(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaFuelPercentage)              {
            this._showHelpAsCrystalDeltaFuelPercentage(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaPrimaryAmmoPercentage)       {
            this._showHelpAsCrystalDeltaPrimaryAmmoPercentage(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForUp)                        {
            this._showHelpAsCannonRangeForUp(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForRight)                     {
            this._showHelpAsCannonRangeForRight(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForLeft)                      {
            this._showHelpAsCannonRangeForLeft(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForDown)                      {
            this._showHelpAsCannonRangeForDown(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonPriority)                          {
            this._showHelpAsCannonPriority(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonMaxTargetCount)                    {
            this._showHelpAsCannonMaxTargetCount(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonCanAffectSelf)                     {
            this._showHelpAsCannonCanAffectSelf(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonCanAffectAlly)                     {
            this._showHelpAsCannonCanAffectAlly(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonCanAffectEnemy)                    {
            this._showHelpAsCannonCanAffectEnemy(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonDeltaHp)                           {
            this._showHelpAsCannonDeltaHp(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonDeltaFuelPercentage)               {
            this._showHelpAsCannonDeltaFuelPercentage(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonDeltaPrimaryAmmoPercentage)        {
            this._showHelpAsCannonDeltaPrimaryAmmoPercentage(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForUp)                   {
            this._showHelpAsLaserTurretRangeForUp(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForRight)                {
            this._showHelpAsLaserTurretRangeForRight(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForLeft)                 {
            this._showHelpAsLaserTurretRangeForLeft(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForDown)                 {
            this._showHelpAsLaserTurretRangeForDown(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretPriority)                     {
            this._showHelpAsLaserTurretPriority(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectSelf)                {
            this._showHelpAsLaserTurretCanAffectSelf(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectAlly)                {
            this._showHelpAsLaserTurretCanAffectAlly(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectEnemy)               {
            this._showHelpAsLaserTurretCanAffectEnemy(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaHp)                      {
            this._showHelpAsLaserTurretDeltaHp(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaFuelPercentage)          {
            this._showHelpAsLaserTurretDeltaFuelPercentage(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage)   {
            this._showHelpAsLaserTurretDeltaPrimaryAmmoPercentage(); 
        } else {
            throw Helpers_Misc.newError(`Invalid infoType: ${infoType}`);
        }
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgBg.setIsVisible(openData.index % 2 === 0);

        const infoType = openData.infoType;
        if      (infoType === Tiles_Constants_Common.InfoTypeId.DefenseBonus)                            {
            this._updateViewAsDefenseBonus(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.Income)                                  {
            this._updateViewAsIncome(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.Vision)                                  {
            this._updateViewAsVision(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.HideUnitCategory)                        {
            this._updateViewAsHideUnitCategory(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.IsDefeatedOnCapture)                     {
            this._updateViewAsIsDefeatedOnCapture(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.ProduceUnitCategory)                     {
            this._updateViewAsProduceUnitCategory(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.GlobalBonus)                             {
            this._updateViewAsGlobalBonus(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.RepairUnitCategory)                      {
            this._updateViewAsRepairUnitCategory(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.BlockEnemyUnit)                          {
            this._updateViewAsBlockEnemyUnit(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CoBoardUnit)                             {
            this._updateViewAsCoBoardUnit(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.Hp)                                      {
            this._updateViewAsHp(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CapturePoint)                            {
            this._updateViewAsCapturePoint(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.BuildPoint)                              {
            this._updateViewAsBuildPoint(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.IsHighlighted)                           {
            this._updateViewAsIsHighlighted(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.Buff)                                    {
            this._updateViewAsBuff(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalRadius)                           {
            this._updateViewAsCrystalRadius(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalPriority)                         {
            this._updateViewAsCrystalPriority(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalCanAffectSelf)                    {
            this._updateViewAsCrystalCanAffectSelf(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalCanAffectAlly)                    {
            this._updateViewAsCrystalCanAffectAlly(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalCanAffectEnemy)                   {
            this._updateViewAsCrystalCanAffectEnemy(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaFund)                        {
            this._updateViewAsCrystalDeltaFund(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaEnergyPercentage)            {
            this._updateViewAsCrystalDeltaEnergyPercentage(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaHp)                          {
            this._updateViewAsCrystalDeltaHp(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaFuelPercentage)              {
            this._updateViewAsCrystalDeltaFuelPercentage(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CrystalDeltaPrimaryAmmoPercentage)       {
            this._updateViewAsCrystalDeltaPrimaryAmmoPercentage(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForUp)                        {
            this._updateViewAsCannonRangeForUp(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForRight)                     {
            this._updateViewAsCannonRangeForRight(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForLeft)                      {
            this._updateViewAsCannonRangeForLeft(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonRangeForDown)                      {
            this._updateViewAsCannonRangeForDown(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonPriority)                          {
            this._updateViewAsCannonPriority(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonMaxTargetCount)                    {
            this._updateViewAsCannonMaxTargetCount(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonCanAffectSelf)                     {
            this._updateViewAsCannonCanAffectSelf(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonCanAffectAlly)                     {
            this._updateViewAsCannonCanAffectAlly(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonCanAffectEnemy)                    {
            this._updateViewAsCannonCanAffectEnemy(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonDeltaHp)                           {
            this._updateViewAsCannonDeltaHp(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonDeltaFuelPercentage)               {
            this._updateViewAsCannonDeltaFuelPercentage(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.CannonDeltaPrimaryAmmoPercentage)        {
            this._updateViewAsCannonDeltaPrimaryAmmoPercentage(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForUp)                   {
            this._updateViewAsLaserTurretRangeForUp(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForRight)                {
            this._updateViewAsLaserTurretRangeForRight(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForLeft)                 {
            this._updateViewAsLaserTurretRangeForLeft(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForDown)                 {
            this._updateViewAsLaserTurretRangeForDown(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretPriority)                     {
            this._updateViewAsLaserTurretPriority(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectSelf)                {
            this._updateViewAsLaserTurretCanAffectSelf(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectAlly)                {
            this._updateViewAsLaserTurretCanAffectAlly(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectEnemy)               {
            this._updateViewAsLaserTurretCanAffectEnemy(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaHp)                      {
            this._updateViewAsLaserTurretOffsetHp(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaFuelPercentage)          {
            this._updateViewAsLaserTurretDeltaFuelPercentage(); 
        } else if (infoType === Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage)   {
            this._updateViewAsLaserTurretDeltaPrimaryAmmoPercentage(); 
        } else {
            throw Helpers_Misc.newError(`Invalid infoType: ${infoType}`);
        }
    }
    private _updateViewAsDefenseBonus(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tileTemplateCfg = openData.tileTemplateCfg;
        this._labelTitle.setLangText(Lang_Constants.TextType.B0352);
        this._labelValue.setText(Lang_Utils.getUnitCategoryName(
            tileTemplateCfg.getDefenseUnitCategoryId(),
            openData.gameConfig,
        ) ?? Lang_Constants.UndefinedError);
        this._groupExtra.setIsVisible(true);
        this._labelExtraInfo.setText(`${Helpers_Text.getSignedNumText(tileTemplateCfg.getDefenseAmount())}`);
    }
    private _updateViewAsIncome(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tileTemplateCfg = openData.tileTemplateCfg;
        this._labelTitle.setLangText(Lang_Constants.TextType.Income);
        this._labelValue.setText(`${tileTemplateCfg.getIncomePerTurn()}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsVision(): void {
        const tileTemplateCfg = this.getOpenData()?.tileTemplateCfg;
        if (tileTemplateCfg == null) {
            return;
        }

        this._labelTitle.setLangText(Lang_Constants.TextType.VisionRange);
        this._labelValue.setText(`${tileTemplateCfg.getVisionRange()}`);

        const groupExtra = this._groupExtra;
        if (!tileTemplateCfg.getIsVisionEnabledForAllPlayers()) {
            groupExtra.setIsVisible(false);
        } else {
            groupExtra.setIsVisible(true);
            this._labelExtraInfo.setLangText(Lang_Constants.TextType.B1130);
        }
    }
    private _updateViewAsHideUnitCategory(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitCategory = openData.tileTemplateCfg.getHideUnitCategoryId();
        this._labelTitle.setLangText(Lang_Constants.TextType.HidableUnits);
        this._labelValue.setText(unitCategory == null
            ? `--`
            : (Lang_Utils.getUnitCategoryName(unitCategory, openData.gameConfig) ?? Lang_Constants.UndefinedError),
        );
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsIsDefeatedOnCapture(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setLangText(Lang_Constants.TextType.DefeatIfCaptured);
        this._labelValue.setLangText(openData.tileTemplateCfg.getIsDefeatedOnCapture() ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsProduceUnitCategory(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitCategory = openData.tileTemplateCfg.getProduceUnitCategoryId();
        this._labelTitle.setLangText(Lang_Constants.TextType.ProducibleUnits);
        this._labelValue.setText(unitCategory == null
            ? `--`
            : (Lang_Utils.getUnitCategoryName(unitCategory, openData.gameConfig) ?? Lang_Constants.UndefinedError),
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B0359);
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
        this._labelTitle.setLangText(Lang_Constants.TextType.RepairableUnits);
        this._labelValue.setText(unitCategory == null
            ? `--`
            : (Lang_Utils.getUnitCategoryName(unitCategory, openData.gameConfig) ?? Lang_Constants.UndefinedError),
        );
        this._groupExtra.setIsVisible(true);
        this._labelExtraInfo.setText(repairNormalizedHp == null ? Lang_Utils.getText(Lang_Constants.TextType.B0044) : `${Helpers_Text.getSignedNumText(repairNormalizedHp * 10)}`);
    }
    private _updateViewAsHp(): void {
        const tileTemplateCfg = this.getOpenData()?.tileTemplateCfg;
        if (tileTemplateCfg == null) {
            return;
        }

        const maxHp = tileTemplateCfg.getMaxHp();
        this._labelTitle.setLangText(Lang_Constants.TextType.Hp);
        this._labelValue.setText(`${maxHp} / ${maxHp}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCapturePoint(): void {
        const tileTemplateCfg = this.getOpenData()?.tileTemplateCfg;
        if (tileTemplateCfg == null) {
            return;
        }

        const maxCapturePoint = tileTemplateCfg.getMaxCapturePoint();
        this._labelTitle.setLangText(Lang_Constants.TextType.CapturePoint);
        this._labelValue.setText(`${maxCapturePoint} / ${maxCapturePoint}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsBuildPoint(): void {
        const tileTemplateCfg = this.getOpenData()?.tileTemplateCfg;
        if (tileTemplateCfg == null) {
            return;
        }

        const maxBuildPoint = tileTemplateCfg.getMaxBuildPoint();
        this._labelTitle.setLangText(Lang_Constants.TextType.BuildPoint);
        this._labelValue.setText(`${maxBuildPoint} / ${maxBuildPoint}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsIsHighlighted(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0847);
        this._labelValue.setLangText(Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsBuff(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.AbnormalStates);
        this._labelValue.setLangText(Lang_Constants.TextType.None);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsBlockEnemyUnit(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setLangText(Lang_Constants.TextType.BlockableEnemyUnits);
        this._labelValue.setText(Lang_Utils.getUnitCategoryName(
            openData.tileTemplateCfg.getBlockEnemyUnitCategoryId() ?? 0,
            openData.gameConfig,
        ) ?? Lang_Constants.UndefinedError);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCoBoardUnit(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setLangText(Lang_Constants.TextType.CoBoardableUnit);
        this._labelValue.setText(Lang_Utils.getUnitCategoryName(
            openData.tileTemplateCfg.getCoBoardUnitCategoryId() ?? 0,
            openData.gameConfig,
        ) ?? Lang_Constants.UndefinedError);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalRadius(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.Crystal.getRadius();
        this._labelTitle.setLangText(Lang_Constants.TextType.EffectiveRadius);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalPriority(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.Crystal.getPriority();
        this._labelTitle.setLangText(Lang_Constants.TextType.Priority);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalCanAffectSelf(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.Crystal.getCanAffectSelf();
        this._labelTitle.setLangText(Lang_Constants.TextType.AffectOwner);
        this._labelValue.setLangText(currentValue ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalCanAffectAlly(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.Crystal.getCanAffectAlly();
        this._labelTitle.setLangText(Lang_Constants.TextType.AffectAlly);
        this._labelValue.setLangText(currentValue ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalCanAffectEnemy(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.Crystal.getCanAffectEnemy();
        this._labelTitle.setLangText(Lang_Constants.TextType.AffectEnemy);
        this._labelValue.setLangText(currentValue ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalDeltaFund(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.Crystal.getOffsetFund();
        this._labelTitle.setLangText(Lang_Constants.TextType.FundOffset);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalDeltaEnergyPercentage(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.Crystal.getOffsetEnergyPercentage();
        this._labelTitle.setLangText(Lang_Constants.TextType.CoEnergyOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalDeltaHp(): void {
        const data          = Tiles_Constants_DefaultCustomTileData.Crystal;
        const offsetHp      = data.getOffsetHp();
        const canBeFatal    = data.getCanBeFatal();
        this._labelTitle.setLangText(Lang_Constants.TextType.UnitsHpOffset);
        this._labelValue.setText(`${offsetHp}`);
        this._groupExtra.setIsVisible(canBeFatal);
        this._labelExtraInfo.setLangText(Lang_Constants.TextType.CanBeFatal);
    }
    private _updateViewAsCrystalDeltaFuelPercentage(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.Crystal.getOffsetFuelPercentage();
        this._labelTitle.setLangText(Lang_Constants.TextType.UnitsFuelOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCrystalDeltaPrimaryAmmoPercentage(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.Crystal.getOffsetPrimaryAmmoPercentage();
        this._labelTitle.setLangText(Lang_Constants.TextType.UnitsPriAmmoOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonRangeForUp(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.CannonUp.getRangeForUp();
        this._labelTitle.setLangText(Lang_Constants.TextType.RangeUp);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonRangeForRight(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.CannonRight.getRangeForRight();
        this._labelTitle.setLangText(Lang_Constants.TextType.RangeRight);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonRangeForDown(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.CannonDown.getRangeForDown();
        this._labelTitle.setLangText(Lang_Constants.TextType.RangeDown);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonRangeForLeft(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.CannonLeft.getRangeForLeft();
        this._labelTitle.setLangText(Lang_Constants.TextType.RangeLeft);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonPriority(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.CustomCannon.getPriority();
        this._labelTitle.setLangText(Lang_Constants.TextType.Priority);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonMaxTargetCount(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.CustomCannon.getMaxTargetCount();
        this._labelTitle.setLangText(Lang_Constants.TextType.MaxTargets);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonCanAffectSelf(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.CustomCannon.getCanAffectSelf();
        this._labelTitle.setLangText(Lang_Constants.TextType.AffectOwner);
        this._labelValue.setLangText(currentValue ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonCanAffectAlly(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.CustomCannon.getCanAffectAlly();
        this._labelTitle.setLangText(Lang_Constants.TextType.AffectAlly);
        this._labelValue.setLangText(currentValue ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonCanAffectEnemy(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.CustomCannon.getCanAffectEnemy();
        this._labelTitle.setLangText(Lang_Constants.TextType.AffectEnemy);
        this._labelValue.setLangText(currentValue ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonDeltaHp(): void {
        const data          = Tiles_Constants_DefaultCustomTileData.CustomCannon;
        const offsetHp      = data.getOffsetHp();
        const canBeFatal    = data.getCanBeFatal();
        this._labelTitle.setLangText(Lang_Constants.TextType.UnitsHpOffset);
        this._labelValue.setText(`${offsetHp}`);
        this._groupExtra.setIsVisible(canBeFatal);
        this._labelExtraInfo.setLangText(Lang_Constants.TextType.CanBeFatal);
    }
    private _updateViewAsCannonDeltaFuelPercentage(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.CustomCannon.getOffsetFuelPercentage();
        this._labelTitle.setLangText(Lang_Constants.TextType.UnitsFuelOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsCannonDeltaPrimaryAmmoPercentage(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.CustomCannon.getOffsetPrimaryAmmoPercentage();
        this._labelTitle.setLangText(Lang_Constants.TextType.UnitsPriAmmoOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretRangeForUp(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.CustomLaserTurret.getRangeForUp();
        this._labelTitle.setLangText(Lang_Constants.TextType.RangeUp);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretRangeForRight(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.CustomLaserTurret.getRangeForRight();
        this._labelTitle.setLangText(Lang_Constants.TextType.RangeRight);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretRangeForDown(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.CustomLaserTurret.getRangeForDown();
        this._labelTitle.setLangText(Lang_Constants.TextType.RangeDown);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretRangeForLeft(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.CustomLaserTurret.getRangeForLeft();
        this._labelTitle.setLangText(Lang_Constants.TextType.RangeLeft);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretPriority(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.CustomLaserTurret.getPriority();
        this._labelTitle.setLangText(Lang_Constants.TextType.Priority);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretCanAffectSelf(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.CustomLaserTurret.getCanAffectSelf();
        this._labelTitle.setLangText(Lang_Constants.TextType.AffectOwner);
        this._labelValue.setLangText(currentValue ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretCanAffectAlly(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.CustomLaserTurret.getCanAffectAlly();
        this._labelTitle.setLangText(Lang_Constants.TextType.AffectAlly);
        this._labelValue.setLangText(currentValue ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretCanAffectEnemy(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.CustomLaserTurret.getCanAffectEnemy();
        this._labelTitle.setLangText(Lang_Constants.TextType.AffectEnemy);
        this._labelValue.setLangText(currentValue ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretOffsetHp(): void {
        const data          = Tiles_Constants_DefaultCustomTileData.CustomLaserTurret;
        const offsetHp      = data.getOffsetHp();
        const canBeFatal    = data.getCanBeFatal();
        this._labelTitle.setLangText(Lang_Constants.TextType.UnitsHpOffset);
        this._labelValue.setText(`${offsetHp}`);
        this._groupExtra.setIsVisible(canBeFatal);
        this._labelExtraInfo.setLangText(Lang_Constants.TextType.CanBeFatal);
    }
    private _updateViewAsLaserTurretDeltaFuelPercentage(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.CustomLaserTurret.getOffsetFuelPercentage();
        this._labelTitle.setLangText(Lang_Constants.TextType.UnitsFuelOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }
    private _updateViewAsLaserTurretDeltaPrimaryAmmoPercentage(): void {
        const currentValue          = Tiles_Constants_DefaultCustomTileData.CustomLaserTurret.getOffsetPrimaryAmmoPercentage();
        this._labelTitle.setLangText(Lang_Constants.TextType.UnitsPriAmmoOffset$);
        this._labelValue.setText(`${currentValue}`);
        this._groupExtra.setIsVisible(false);
    }

    private _showHelpAsDefenseBonus(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0352),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0088),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsIncome(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.Income),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0086),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsVision(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.VisionRange),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0082),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsHideUnitCategory(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.HidableUnits),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0079),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsIsDefeatedOnCapture(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.DefeatIfCaptured),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0077),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsProduceUnitCategory(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.ProducibleUnits),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0074),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsGlobalBonus(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0359),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0068),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsRepairUnitCategory(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.RepairableUnits),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0065),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsBlockEnemyUnit(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.BlockableEnemyUnits),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0012),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsCoBoardUnit(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.CoBoardableUnit),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0011),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsHp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.Hp),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0059),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsCapturePoint(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.CapturePoint),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0052),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsBuildPoint(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.BuildPoint),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0051),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsIsHighlighted(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0847),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0050),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }
    private _showHelpAsBuff(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.AbnormalStates),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0737),
        });
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
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

interface DataForMoveCostRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index           : number;
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    unitType        : number;
    tileCfg         : TileTemplateCfg;
}
class MoveCostRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForMoveCostRenderer> {
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBg!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _conView!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelMoveCost!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _unitView          = new Ui_Components_UiUnitView.UiUnitView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "UnitAnimationTick",   callback : this._onNotifyUnitAnimationTick },
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

        const gameConfig    = openData.gameConfig;
        const unitType      = openData.unitType;
        const moveCostCfg   = Helpers_Misc.getExisted(gameConfig.getMoveCostCfg(openData.tileCfg.getTileTypeId()));
        const moveCost      = moveCostCfg[Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getMoveTypeId())].getCost();
        const playerIndex   = Players_Constants.PlayerIndex.First;
        this._imgBg.setIsVisible(openData.index % 4 === 2);
        this._labelMoveCost.setText(moveCost != null ? `${moveCost}` : `--`);
        this._unitView.update(new Ui_Types_UiUnitViewData.UiUnitViewData({
            gameConfig       : gameConfig,
            skinId           : ForceSkins_Utils.getDefaultSkinId(playerIndex),
            overridingSkinId : undefined,
            unitData         : Units_Utils_Serialization.createDefault({
                gridIndex   : { x : 0, y : 0 },
                playerIndex : playerIndex,
                unitTypeId  : openData.unitType,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }), Common_Model_CommonModel.getUnitAnimationTickCount());
    }
}

interface DataForDamageRenderer extends Ui_Types_UiListItemData.UiListItemData {
    gameConfig          : GameConfigs_GameConfig.GameConfig;
    index               : number;
    targetTileType      : number;
    playerIndex         : number;
    attackerUnitType    : number;
}
class DamageRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForDamageRenderer> {
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBg!                : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _conView!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelPrimaryAttack!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSecondaryAttack! : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _unitView              = new Ui_Components_UiUnitView.UiUnitView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "UnitAnimationTick",   callback : this._onNotifyUnitAnimationTick },
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

        this._imgBg.setIsVisible(openData.index % 4 === 2);

        const gameConfig        = openData.gameConfig;
        const targetTileType    = openData.targetTileType;
        const attackerUnitType  = openData.attackerUnitType;
        const playerIndex       = openData.playerIndex;
        this._unitView.update(new Ui_Types_UiUnitViewData.UiUnitViewData({
            gameConfig       : gameConfig,
            skinId           : ForceSkins_Utils.getDefaultSkinId(playerIndex),
            overridingSkinId : undefined,
            unitData         : Units_Utils_Serialization.createDefault({
                gridIndex   : { x : 0, y : 0 },
                unitTypeId  : attackerUnitType,
                playerIndex : playerIndex,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }), Common_Model_CommonModel.getUnitAnimationTickCount());

        const attackCfg             = Helpers_Misc.getExisted(gameConfig.getDamageChartCfgs(attackerUnitType));
        const targetArmorType       = Helpers_Misc.getExisted(gameConfig.getTileTemplateCfg(targetTileType)?.getArmorTypeId());
        const primaryAttackDamage   = attackCfg[targetArmorType][Units_Constants.WeaponTypeId.Primary].getDamage();
        const secondaryAttackDamage = attackCfg[targetArmorType][Units_Constants.WeaponTypeId.Secondary].getDamage();
        this._labelPrimaryAttack.setText(primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`);
        this._labelSecondaryAttack.setText(secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`);
    }
}

function createInfoDefenseBonus(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getDefenseUnitCategoryId() === Units_Constants.CategoryId.None)
        ? null
        : {
            index           : 0,
            infoType        : Tiles_Constants_Common.InfoTypeId.DefenseBonus,
            tileTemplateCfg : tileTemplateCfg,
            gameConfig      : gameConfig,
        };
}
function createInfoIncome(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    const income = tileTemplateCfg.getIncomePerTurn();
    return income == 0
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.Income,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoVision(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return ((!tileTemplateCfg.getVisionRange()) && (!tileTemplateCfg.getIsVisionEnabledForAllPlayers()) && (tileTemplateCfg.getMaxCapturePoint() == null))
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.Vision,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoHideUnitCategory(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getHideUnitCategoryId() == null)
        ? null
        :  {
            index           : 0,
            infoType        : Tiles_Constants_Common.InfoTypeId.HideUnitCategory,
            tileTemplateCfg : tileTemplateCfg,
            gameConfig      : gameConfig,
        };
}
function createInfoIsDefeatOnCapture(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return !tileTemplateCfg.getIsDefeatedOnCapture()
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.IsDefeatedOnCapture,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoProduceUnitCategory(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return !tileTemplateCfg.getProduceUnitCategoryId()
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.ProduceUnitCategory,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoGlobalBonus(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return ((!tileTemplateCfg.getGlobalAttackBonus()) && (!tileTemplateCfg.getGlobalDefenseBonus()))
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.GlobalBonus,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoRepairUnitCategory(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getRepairUnitCategoryId() == Units_Constants.CategoryId.None)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.RepairUnitCategory,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoBlockEnemyUnit(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getBlockEnemyUnitCategoryId() == null)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.BlockEnemyUnit,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCoBoardUnit(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getCoBoardUnitCategoryId() == null)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CoBoardUnit,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoHp(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMaxHp() == null)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.Hp,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCapturePoint(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMaxCapturePoint() == null)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CapturePoint,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoBuildPoint(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMaxBuildPoint() == null)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.BuildPoint,
            tileTemplateCfg,
            gameConfig,
        };
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createInfoIsHighlighted(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return null;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createInfoBuff(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return null;
}
function createInfoCrystalRadius(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.Crystal) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal))
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CrystalRadius,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalPriority(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CrystalPriority,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalCanAffectSelf(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CrystalCanAffectSelf,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalCanAffectAlly(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CrystalCanAffectAlly,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalCanAffectEnemy(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CrystalCanAffectEnemy,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalDeltaFund(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CrystalDeltaFund,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalDeltaEnergyPercentage(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CrystalDeltaEnergyPercentage,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalDeltaHp(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.Crystal) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal))
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CrystalDeltaHp,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalDeltaFuelPercentage(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CrystalDeltaFuelPercentage,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCrystalDeltaPrimaryAmmoPercentage(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CrystalDeltaPrimaryAmmoPercentage,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonRangeForUp(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CannonUp) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomCannon))
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CannonRangeForUp,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonRangeForDown(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CannonDown) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomCannon))
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CannonRangeForDown,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonRangeForLeft(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CannonLeft) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomCannon))
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CannonRangeForLeft,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonRangeForRight(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CannonRight) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomCannon))
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CannonRangeForRight,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonPriority(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CannonPriority,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonMaxTargetCount(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CannonMaxTargetCount,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonCanAffectSelf(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CannonCanAffectSelf,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonCanAffectAlly(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CannonCanAffectAlly,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonCanAffectEnemy(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CannonCanAffectEnemy,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonDeltaHp(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CannonRight) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CannonLeft) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CannonDown) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CannonUp) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomCannon))
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CannonDeltaHp,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonDeltaFuelPercentage(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CannonDeltaFuelPercentage,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoCannonDeltaPrimaryAmmoPercentage(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomCannon)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.CannonDeltaPrimaryAmmoPercentage,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretRangeForUp(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.LaserTurret))
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForUp,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretRangeForDown(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.LaserTurret))
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForDown,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretRangeForLeft(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.LaserTurret))
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForLeft,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretRangeForRight(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.LaserTurret))
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.LaserTurretRangeForRight,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretPriority(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.LaserTurretPriority,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretCanAffectSelf(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectSelf,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretCanAffectAlly(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectAlly,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretCanAffectEnemy(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.LaserTurretCanAffectEnemy,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretDeltaHp(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    const mapWeaponType = tileTemplateCfg.getMapWeaponTypeId();
    return ((mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret) && (mapWeaponType !== Tiles_Constants_MapWeapon.TypeId.LaserTurret))
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaHp,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretDeltaFuelPercentage(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaFuelPercentage,
            tileTemplateCfg,
            gameConfig,
        };
}
function createInfoLaserTurretDeltaPrimaryAmmoPercentage(tileTemplateCfg: TileTemplateCfg, gameConfig: GameConfigs_GameConfig.GameConfig): DataForInfoRenderer | null {
    return (tileTemplateCfg.getMapWeaponTypeId() !== Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)
        ? null
        : {
            index    : 0,
            infoType : Tiles_Constants_Common.InfoTypeId.LaserTurretDeltaPrimaryAmmoPercentage,
            tileTemplateCfg,
            gameConfig,
        };
}
