import type * as BaseWarInterfaceIBwCursor from "../interface/IBwCursor.ts";
import type * as BaseWarInterfaceIBwWar from "../interface/IBwWar.ts";
import type * as BaseWarModelBwTypes from "../model/BwTypes.ts";
import * as CommonModelCommonModel from "../../common/model/CommonModel.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MultiPlayerWarModelMpwModel from "../../multiPlayerWar/model/MpwModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";
import * as UsersModel from "../../users/Model.ts";
import * as VisibilitiesUtils from "../../visibilities/Utils.ts";

type IUnit                  = UnitsIUnit.IUnit;

export interface OpenData {
    war                     : BaseWarInterfaceIBwWar.IBwWar;
    callbackForMoveCursor   : (unit: IUnit) => void;
    callbackForSelectUnit   : (unit: IUnit) => void;
}

let Alpha = 0.8;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnAddAlpha!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSubAlpha!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;

    private readonly _groupPlayer!          : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelPlayerName!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPlayer!          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupCount!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelCountName!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCount!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupValue!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelValueName!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelValue!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _listUnit!             : UiInterfacesIUiScrollList.IUiScrollList<DataForUnitRenderer>;
    private readonly _labelNoUnit!          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupButtons!         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnNext!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnPrevious!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnUnitStatistics!    : UiInterfacesIUiButton.IUiButton;

    private _playerIndex    : number | null = null;
    private _selectedIndex  = -1;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.ActionPlannerStateChanged, callback: this._onNotifyBwPlannerStateChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnAddAlpha,        callback: this._onTouchedBtnAddAlpha },
            { ui: this._btnSubAlpha,        callback: this._onTouchedBtnSubAlpha },
            { ui: this._btnNext,            callback: this._onTouchedBtnNext },
            { ui: this._btnPrevious,        callback: this._onTouchedBtnPrevious },
            { ui: this._btnUnitStatistics,  callback: this._onTouchedBtnUnitStatistics },
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

    public updateOnSelectedUnit(unit: IUnit): void {
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

        if (war instanceof GameHelpersGhFactory.getRwWarClass()) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().BwUnitStatisticsPanel, {
                war         : war,
                infoArray   : war.getWarStatisticsManager().getUnitStatisticsInfoArrayForFullReplay(),
            });
            return;
        }

        const warId = war.getWarId();
        if (warId != null) {
            const info = await MultiPlayerWarModelMpwModel.getUnitStatistics(warId);
            if (info == null) {
                FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            } else {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().BwUnitStatisticsPanel, {
                    war         : war,
                    infoArray   : info.getInfoArray(),
                });
            }
            return;
        }

        FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelPlayerName.setLangText(LangConstants.TextType.B0031);
        this._labelCountName.setLangText(LangConstants.TextType.B0160);
        this._labelValueName.setLangText(LangConstants.TextType.B0161);
        this._labelTitle.setLangText(LangConstants.TextType.B0152);
        this._btnUnitStatistics.setLangText(LangConstants.TextType.B0876);
        this._labelNoUnit.setLangText(LangConstants.TextType.B1289);

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
        if ((war instanceof GameHelpersGhFactory.getRwWarBaseClass())    ||
            (war instanceof GameHelpersGhFactory.getMpwWarClass())
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
        for (const unit of VisibilitiesUtils.getAllUnitsOnMapVisibleToTeams(war, teamIndexes)) {
            if (unit.getPlayerIndex() === playerIndex) {
                const tile              = tileMap.getTile(unit.getGridIndex());
                const dataForTileView   : BaseWarModelBwTypes.DataForTileView = {
                    gameConfig          : gameConfig,
                    hasFog              : tile.getHasFog(),
                    skinId              : tile.getSkinId(),
                    overridingSkinId    : ForceSkinsUtils.getRawOverridingSkinId(war, tile.getPlayerIndex()),
                    themeType           : tile.getTileThemeType(),
                    tileData            : tile.serializeForTeamIndexes(teamIndexes),
                    isFullReplay        : war instanceof GameHelpersGhFactory.getRwWarClass(),
                };
                dataList.push({
                    cursor                  : cursor,
                    unit                    : unit,
                    dataForTileView         : dataForTileView,
                    panel                   : this,
                });
                for (const loadedUnit of unitMap.getUnitsLoadedByLoader(unit, true)) {
                    dataList.push({
                        cursor                  : cursor,
                        unit                    : loadedUnit,
                        dataForTileView         : dataForTileView,
                        panel                   : this,
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
    if ((stateA === UnitsConstants.ActionStateId.Idle) && (stateB !== UnitsConstants.ActionStateId.Idle)) {
        return -1;
    } else if ((stateA !== UnitsConstants.ActionStateId.Idle) && (stateB === UnitsConstants.ActionStateId.Idle)) {
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

interface DataForUnitRenderer extends UiTypesUiListItemData.UiListItemData {
    unit                    : IUnit;
    dataForTileView         : BaseWarModelBwTypes.DataForTileView;
    cursor                  : BaseWarInterfaceIBwCursor.IBwCursor;
    panel                   : Panel;
}
class UnitRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgSelected!      : UiInterfacesIUiImage.IUiImage;
    private readonly _conUnitView!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _conTileView!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelName!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelGridIndex!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelHp!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelFuel!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelState!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgHp!            : UiInterfacesIUiImage.IUiImage;
    private readonly _imgFuel!          : UiInterfacesIUiImage.IUiImage;
    private readonly _imgState!         : UiInterfacesIUiImage.IUiImage;

    private readonly _unitView          = new (GameHelpersGhFactory.getUnitViewClass())();
    private readonly _tileView          = new (GameHelpersGhFactory.getTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.TileAnimationTick,       callback: this._onNotifyTileAnimationTick },
            { type: NotificationsTypeId.TypeId.StateIndicatorTick,      callback: this._onNotifyStateIndicatorTick },
        ]);
        this._applySettingsForWholeTouch(undefined, undefined, undefined, SoundsConstants.ShortSfxCode.None);

        this._imgHp.loadSource(CommonModelCommonModel.getUnitAndTileTexturePrefix(UsersModel.getSelfSettingsTextureVersion()) + _IMAGE_SOURCE_HP);
        this._imgFuel.loadSource(CommonModelCommonModel.getUnitAndTileTexturePrefix(UsersModel.getSelfSettingsTextureVersion()) + _IMAGE_SOURCE_FUEL);
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
        TweenExecutor.Executor.removeTweens(imgSelected);
        TweenExecutor.Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        this._unitView.stopRunningView();
        TweenExecutor.Executor.removeTweens(this._imgSelected);

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
        this._labelName.setText(LangUtils.getUnitName(unit.getUnitType(), unit.getGcData()) ?? LangConstants.UndefinedError);
        this._labelGridIndex.setText(`x${unit.getGridX()} y${unit.getGridY()}`);

        if (unit.getCurrentBuildMaterial() != null) {
            this._imgState.setIsVisible(true);
            this._imgState.loadSource(CommonModelCommonModel.getUnitAndTileTexturePrefix(UsersModel.getSelfSettingsTextureVersion()) + _IMAGE_SOURCE_MATERIAL);
            this._labelState.setIsVisible(true);
            this._labelState.setText(`${unit.getCurrentBuildMaterial()}`);
        } else if (unit.getCurrentProduceMaterial() != null) {
            this._imgState.setIsVisible(true);
            this._imgState.loadSource(CommonModelCommonModel.getUnitAndTileTexturePrefix(UsersModel.getSelfSettingsTextureVersion()) + _IMAGE_SOURCE_MATERIAL);
            this._labelState.setIsVisible(true);
            this._labelState.setText(`${unit.getCurrentProduceMaterial()}`);
        } else if (unit.getFlareCurrentAmmo() != null) {
            this._imgState.setIsVisible(true);
            this._imgState.loadSource(CommonModelCommonModel.getUnitAndTileTexturePrefix(UsersModel.getSelfSettingsTextureVersion()) + _IMAGE_SOURCE_FLARE);
            this._labelState.setIsVisible(true);
            this._labelState.setText(`${unit.getFlareCurrentAmmo()}`);
        } else if (unit.getPrimaryWeaponCurrentAmmo() != null) {
            this._imgState.setIsVisible(true);
            this._imgState.loadSource(CommonModelCommonModel.getUnitAndTileTexturePrefix(UsersModel.getSelfSettingsTextureVersion()) + _IMAGE_SOURCE_AMMO);
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
