import {
    ForceSkins_Utils,
    Common_Model_CommonModel,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWar,
    ReplayWar_Model_RwWarBase,
    FloatText,
    Tiles_TileView,
    Units_UnitView,
    type BaseWar_Model_BwTypes,
    type BaseWar_Interface_IBwCursor,
    type BaseWar_Interface_IBwWar,
    Units_Constants,
    Tween_Executor,
    Visibilities_Utils,
    GamePanels_Dict,
    Users_Model,
    Lang_Utils,
    MultiPlayerWar_Model_MpwModel,
    GamePanels_Manager,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Units_IUnit,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export interface OpenData {
    war                     : BaseWar_Interface_IBwWar.IBwWar;
    callbackForMoveCursor   : (unit: Units_IUnit.IUnit) => void;
    callbackForSelectUnit   : (unit: Units_IUnit.IUnit) => void;
}

let Alpha = 0.8;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnAddAlpha!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSubAlpha!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupPlayer!          : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelPlayerName!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPlayer!          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupCount!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelCountName!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCount!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupValue!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelValueName!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelValue!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _listUnit!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForUnitRenderer>;
    private readonly _labelNoUnit!          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupButtons!         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnNext!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnPrevious!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnUnitStatistics!    : Ui_Interfaces_IUiButton.IUiButton;

    private _playerIndex    : number | null = null;
    private _selectedIndex  = -1;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,             callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.ActionPlannerStateChanged, callback : this._onNotifyBwPlannerStateChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,           callback : this.closePanel },
            { ui : this._btnAddAlpha,        callback : this._onTouchedBtnAddAlpha },
            { ui : this._btnSubAlpha,        callback : this._onTouchedBtnSubAlpha },
            { ui : this._btnNext,            callback : this._onTouchedBtnNext },
            { ui : this._btnPrevious,        callback : this._onTouchedBtnPrevious },
            { ui : this._btnUnitStatistics,  callback : this._onTouchedBtnUnitStatistics },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listUnit.setItemRendererClass(UnitRenderer);
        this.setAlpha(Alpha);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        this._playerIndex   = war.getPlayerIndexInTurn();
        this._selectedIndex = -1;
        this._resetGroupButtons();
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listUnit.removeAllItems();

        await super._onClosed();
    }

    public updateOnSelectedUnit(unit: Units_IUnit.IUnit): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const newSelectedIndex = this._listUnit.getFirstSelectedItemIndex();
        if ((newSelectedIndex == null) || (newSelectedIndex < 0)) {
            return;
        }

        if (newSelectedIndex === this._selectedIndex) {
            openData.callbackForSelectUnit(unit);
        } else {
            this._selectedIndex = newSelectedIndex;
            openData.callbackForMoveCursor(unit);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyBwPlannerStateChanged(): void {
        this._updateComponentsForUnits();
    }

    private _onTouchedBtnAddAlpha(): void {
        this.setAlpha(Alpha = Math.min(1, Alpha + 0.1));
    }
    private _onTouchedBtnSubAlpha(): void {
        this.setAlpha(Alpha = Math.max(0.4, Alpha - 0.1));
    }
    private _onTouchedBtnNext(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const playerIndex = this._playerIndex;
        if (playerIndex != null) {
            this._playerIndex = war.getTurnManager().getNextAlivePlayerIndex(playerIndex);
            this._updateComponentsForUnits();
        }
    }
    private _onTouchedBtnPrevious(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const playerIndex = this._playerIndex;
        if (playerIndex != null) {
            this._playerIndex = war.getTurnManager().getPreviousAlivePlayerIndex(playerIndex);
            this._updateComponentsForUnits();
        }
    }
    private async _onTouchedBtnUnitStatistics(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        if (war instanceof ReplayWar_Model_RwWar.RwWar) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwUnitStatisticsPanel, {
                war       : war,
                infoArray : war.getWarStatisticsManager().getUnitStatisticsInfoArrayForFullReplay(),
            });
            return;
        }

        const warId = war.getWarId();
        if (warId != null) {
            const info = await MultiPlayerWar_Model_MpwModel.getUnitStatistics(warId);
            if (info == null) {
                FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            } else {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().BwUnitStatisticsPanel, {
                    war       : war,
                    infoArray : info.getInfoArray(),
                });
            }
            return;
        }

        FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelPlayerName.setLangText(Lang_Constants.TextType.B0031);
        this._labelCountName.setLangText(Lang_Constants.TextType.B0160);
        this._labelValueName.setLangText(Lang_Constants.TextType.B0161);
        this._labelTitle.setLangText(Lang_Constants.TextType.B0152);
        this._btnUnitStatistics.setLangText(Lang_Constants.TextType.B0876);
        this._labelNoUnit.setLangText(Lang_Constants.TextType.B1289);

        this._groupPlayer.arrangeItems();
        this._groupCount.arrangeItems();
        this._groupValue.arrangeItems();
    }

    private _resetGroupButtons(): void {
        const group = this._groupButtons;
        group.removeAllItems(false);
        group.addItem(this._btnPrevious, false);
        group.addItem(this._btnNext, false);

        const war = this.getOpenData()?.war;
        if ((war instanceof ReplayWar_Model_RwWarBase.RwWarBase)    ||
            (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar)
        ) {
            group.addItem(this._btnUnitStatistics, false);
        }

        group.arrangeItems();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateComponentsForUnits();
    }

    private async _updateComponentsForUnits(): Promise<void> {
        const dataArray             = this._createDataForList();
        const length                = dataArray.length;
        this._labelCount.setText(`${length}`);
        this._labelNoUnit.setIsVisible(!length);
        this._labelPlayer.setText(`P${this._playerIndex}`);

        const list = this._listUnit;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(-1);

        let value = 0;
        for (const data of dataArray) {
            const unit = data.unit;
            value += unit.getProductionFinalCost() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp();
        }
        this._labelValue.setText(`${value}`);

        this._groupPlayer.arrangeItems();
        this._groupCount.arrangeItems();
        this._groupValue.arrangeItems();
    }

    private _createDataForList(): DataForUnitRenderer[] {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return [];
        }

        const cursor                = war.getCursor();
        const unitMap               = war.getUnitMap();
        const tileMap               = war.getTileMap();
        const gameConfig            = war.getGcData();
        const teamIndexes           = war.getPlayerManager().getWatcherTeamIndexesForSelf();
        const dataList              : DataForUnitRenderer[]= [];
        const playerIndex           = this._playerIndex;
        for (const unit of Visibilities_Utils.getAllUnitsOnMapVisibleToTeams(war, teamIndexes)) {
            if (unit.getPlayerIndex() === playerIndex) {
                const tile              = tileMap.getTile(unit.getGridIndex());
                const dataForTileView   : BaseWar_Model_BwTypes.DataForTileView = {
                    gameConfig       : gameConfig,
                    hasFog           : tile.getHasFog(),
                    skinId           : tile.getSkinId(),
                    overridingSkinId : ForceSkins_Utils.getRawOverridingSkinId(war, tile.getPlayerIndex()),
                    themeType        : tile.getTileThemeType(),
                    tileData         : tile.serializeForTeamIndexes(teamIndexes),
                    isFullReplay     : war instanceof ReplayWar_Model_RwWar.RwWar,
                };
                dataList.push({
                    cursor          : cursor,
                    unit            : unit,
                    dataForTileView : dataForTileView,
                    panel           : this,
                });
                for (const loadedUnit of unitMap.getUnitsLoadedByLoader(unit, true)) {
                    dataList.push({
                        cursor          : cursor,
                        unit            : loadedUnit,
                        dataForTileView : dataForTileView,
                        panel           : this,
                    });
                }
            }
        }
        return dataList.sort(sorterForDataForList);
    }
}

function sorterForDataForList(a: DataForUnitRenderer, b: DataForUnitRenderer): number {
    const unitA     = a.unit;
    const unitB     = b.unit;
    const stateA    = unitA.getActionState();
    const stateB    = unitB.getActionState();
    if ((stateA === Units_Constants.ActionStateId.Idle) && (stateB !== Units_Constants.ActionStateId.Idle)) {
        return -1;
    } else if ((stateA !== Units_Constants.ActionStateId.Idle) && (stateB === Units_Constants.ActionStateId.Idle)) {
        return 1;
    } else {
        return unitA.getUnitType() - unitB.getUnitType();
    }
}

const _IMAGE_SOURCE_HP          = `c03_t99_s02_f03`;
const _IMAGE_SOURCE_FUEL        = `c03_t99_s02_f01`;
const _IMAGE_SOURCE_AMMO        = `c03_t99_s02_f02`;
const _IMAGE_SOURCE_MATERIAL    = `c03_t99_s02_f04`;
const _IMAGE_SOURCE_FLARE       = `c03_t99_s02_f02`;

interface DataForUnitRenderer extends Ui_Types_UiListItemData.UiListItemData {
    unit                    : Units_IUnit.IUnit;
    dataForTileView         : BaseWar_Model_BwTypes.DataForTileView;
    cursor                  : BaseWar_Interface_IBwCursor.IBwCursor;
    panel                   : Panel;
}
class UnitRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgSelected!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _conUnitView!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _conTileView!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelName!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelGridIndex!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelHp!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelFuel!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelState!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgHp!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgFuel!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgState!         : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _unitView          = new Units_UnitView.UnitView();
    private readonly _tileView          = new Tiles_TileView.TileView();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.TileAnimationTick,       callback : this._onNotifyTileAnimationTick },
            { type : Notifications_TypeId.TypeId.StateIndicatorTick,      callback : this._onNotifyStateIndicatorTick },
        ]);
        this._applySettingsForWholeTouch(undefined, undefined, undefined, Sounds_Constants.ShortSfxCode.None);

        this._imgHp.loadSource(Common_Model_CommonModel.getUnitAndTileTexturePrefix(Users_Model.getSelfSettingsTextureVersion()) + _IMAGE_SOURCE_HP);
        this._imgFuel.loadSource(Common_Model_CommonModel.getUnitAndTileTexturePrefix(Users_Model.getSelfSettingsTextureVersion()) + _IMAGE_SOURCE_FUEL);
        this._conUnitView.addUiChild(this._unitView);

        const tileView      = this._tileView;
        const conTileView   = this._conTileView;
        conTileView.addUiChild(tileView.getImgBase());
        conTileView.addUiChild(tileView.getImgDecoration());
        conTileView.addUiChild(tileView.getImgBuff());
        conTileView.addUiChild(tileView.getImgObject());
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Tween_Executor.Executor.removeTweens(imgSelected);
        Tween_Executor.Executor.get(imgSelected, { loop : true })
            .to({ customAlpha : 0.6 }, 500)
            .to({ customAlpha : 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        this._unitView.stopRunningView();
        Tween_Executor.Executor.removeTweens(this._imgSelected);

        await super._onClosed();
    }

    private _onNotifyTileAnimationTick(): void {
        this._tileView.updateTileAnimation();
    }
    private _onNotifyStateIndicatorTick(): void {
        this._tileView.updateImgBuff();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.updateOnSelectedUnit(openData.unit);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unit = openData.unit;
        this._unitView.init(unit).startRunningView();
        this._labelHp.setText(`${unit.getCurrentHp()}`);
        this._labelFuel.setText(`${unit.getCurrentFuel()}`);
        this._labelName.setText(Lang_Utils.getUnitName(unit.getUnitType(), unit.getGcData()) ?? Lang_Constants.UndefinedError);
        this._labelGridIndex.setText(`x${unit.getGridX()} y${unit.getGridY()}`);

        if (unit.getCurrentBuildMaterial() != null) {
            this._imgState.setIsVisible(true);
            this._imgState.loadSource(Common_Model_CommonModel.getUnitAndTileTexturePrefix(Users_Model.getSelfSettingsTextureVersion()) + _IMAGE_SOURCE_MATERIAL);
            this._labelState.setIsVisible(true);
            this._labelState.setText(`${unit.getCurrentBuildMaterial()}`);
        } else if (unit.getCurrentProduceMaterial() != null) {
            this._imgState.setIsVisible(true);
            this._imgState.loadSource(Common_Model_CommonModel.getUnitAndTileTexturePrefix(Users_Model.getSelfSettingsTextureVersion()) + _IMAGE_SOURCE_MATERIAL);
            this._labelState.setIsVisible(true);
            this._labelState.setText(`${unit.getCurrentProduceMaterial()}`);
        } else if (unit.getFlareCurrentAmmo() != null) {
            this._imgState.setIsVisible(true);
            this._imgState.loadSource(Common_Model_CommonModel.getUnitAndTileTexturePrefix(Users_Model.getSelfSettingsTextureVersion()) + _IMAGE_SOURCE_FLARE);
            this._labelState.setIsVisible(true);
            this._labelState.setText(`${unit.getFlareCurrentAmmo()}`);
        } else if (unit.getPrimaryWeaponCurrentAmmo() != null) {
            this._imgState.setIsVisible(true);
            this._imgState.loadSource(Common_Model_CommonModel.getUnitAndTileTexturePrefix(Users_Model.getSelfSettingsTextureVersion()) + _IMAGE_SOURCE_AMMO);
            this._labelState.setIsVisible(true);
            this._labelState.setText(`${unit.getPrimaryWeaponCurrentAmmo()}`);
        } else {
            this._imgState.setIsVisible(false);
            this._labelState.setIsVisible(false);
        }

        const tileView = this._tileView;
        tileView.setData(openData.dataForTileView);
        tileView.updateView();
    }
}
