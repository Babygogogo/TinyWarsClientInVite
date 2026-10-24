import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesMapFilter from "../../auxiliaryTypes/MapFilter.ts";
import * as CoopCustomRoomModelCcrRoomCreator from "../model/CcrRoomCreator.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcMap from "../../gameConfig/GcMap.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiMapInfo from "../../ui/interfaces/IUiMapInfo.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiInterfacesIUiZoomableMap from "../../ui/interfaces/IUiZoomableMap.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

const MapsPerPage           = 50;
let _pageIndex              = 0;
let _selectedNormalMapId    : number | undefined;
let _previousFilter         : AuxiliaryTypesMapFilter.MapFilter | null = null;
let _mapSorter              : AuxiliaryTypesAuxiliaryTypes.MapSorter = {
    sortType    : GameConfigGcMap.SortType.MapName,
    isAscending : true,
};

export interface OpenData {
    mapFilter               : AuxiliaryTypesMapFilter.MapFilter | null;
    mapSorter               : AuxiliaryTypesAuxiliaryTypes.MapSorter | null;
    usePreviousFilter       : boolean;
    usePreviousPageIndex    : boolean;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _groupMapView!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _zoomMap!                  : UiInterfacesIUiZoomableMap.IUiZoomableMap;
    private readonly _labelLoading!             : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupNavigator!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _layoutNavName!            : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMultiPlayer!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCreateRoom!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelChooseMap!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnBack!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnNextStep!              : UiInterfacesIUiButton.IUiButton;

    private readonly _groupTopRightButtons!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnSwitch!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSearch!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSort!                  : UiInterfacesIUiButton.IUiButton;

    private readonly _groupSearch!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnPrevPage!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnNextPage!              : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutPage!               : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelPageTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPage!                : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupMapList!             : UiInterfacesIUiContainer.IUiContainer;
    private readonly _listMap!                  : UiInterfacesIUiScrollList.IUiScrollList<DataForMapNameRenderer>;
    private readonly _labelNoMap!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _uiMapInfo!                : UiInterfacesIUiMapInfo.IUiMapInfo;
    private _mapFilter                          : AuxiliaryTypesMapFilter.MapFilter | null = null;
    private _cachedListDataArray                : DataForMapNameRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnSearch,      callback: this._onTouchTapBtnSearch },
            { ui: this._btnSort,        callback: this._onTouchedBtnSort },
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            { ui: this._groupMapView,   callback: this._onTouchedGroupMapView },
            { ui: this._btnSwitch,      callback: this._onTouchedBtnSwitch },
            { ui: this._btnPrevPage,    callback: this._onTouchedBtnPrevPage },
            { ui: this._btnNextPage,    callback: this._onTouchedBtnNextPage },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnBack();
        });

        this._listMap.setItemRendererClass(MapNameRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        await this._uiMapInfo.open();
        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateOnOpenDataChanged();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._uiMapInfo.close(),
            this._listMap.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public async setAndReviseSelectedNormalMapId(newNormalMapId: number, needScroll: boolean): Promise<void> {
        _selectedNormalMapId = newNormalMapId;

        const listMap   = this._listMap;
        const index     = HelpersMisc.getExisted(listMap.getRevisedFirstIndex(v => v?.normalMapId === newNormalMapId));
        listMap.setSelectedItemIndex(index);
        if (needScroll) {
            VendorEgretEgret.callLater(() => listMap.scrollToItem(Math.max(0, index - 1)), undefined); // callLater是为了防止sizer延迟导致的scroll失效；index-1是为了让玩家看到上面还有选项
        }

        this._showMap(listMap.getFirstSelectedData()?.normalMapId ?? null);
    }
    private _getSelectedNormalMapId(): number | null {
        return this._listMap.getFirstSelectedData()?.normalMapId ?? null;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchTapBtnSearch(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonMapFilterPanel, {
            mapFilter           : this._mapFilter,
            callbackOnConfirm   : mapFilter => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CcrCreateMapListPanel, {
                    mapFilter               : mapFilter,
                    mapSorter               : _mapSorter,
                    usePreviousFilter       : false,
                    usePreviousPageIndex    : false,
                });
            },
        });
    }

    private _onTouchedBtnSort(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMapSorterPanel, {
            currentSorter       : _mapSorter,
            callbackOnConfirm   : (mapSorter: AuxiliaryTypesAuxiliaryTypes.MapSorter) => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CcrCreateMapListPanel, {
                    mapFilter               : null,
                    mapSorter               : mapSorter,
                    usePreviousFilter       : true,
                    usePreviousPageIndex    : false
                });
            },
        });
    }

    private _onTouchedBtnBack(): void {
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CcrMainMenuPanel, void 0);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyTopPanel, void 0);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().LobbyBottomPanel, void 0);
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const selectedNormalMapId = this._getSelectedNormalMapId();
        if (selectedNormalMapId != null) {
            this.closePanel();

            GamePanelsManager.openPanel(GamePanelsDict.getDict().CcrCreateSettingsPanel, {
                roomCreator : new CoopCustomRoomModelCcrRoomCreator.CcrRoomCreator(
                    await GameConfigGcModel.getLatestGameConfig(),
                    HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(selectedNormalMapId))
                ),
            });
        }
    }

    private async _onTouchedGroupMapView(): Promise<void> {
        const normalMapId = this._getSelectedNormalMapId();
        if (normalMapId != null) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowMapPanel, {
                mapInfo : {
                    gameConfig          : await GameConfigGcModel.getLatestGameConfig(),
                    mapRawData          : HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(normalMapId)),
                    overridingPlayers   : null,
                },
            });
        }
    }

    private async _onTouchedBtnSwitch(): Promise<void> {
        FloatText2.showLang(LangConstants.TextType.A0937);

        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().McrCreateMapListPanel, {
            mapFilter               : null,
            mapSorter               : null,
            usePreviousFilter       : true,
            usePreviousPageIndex    : true,
        });
    }

    private async _onTouchedBtnPrevPage(): Promise<void> {
        const newPageIndex = NumbersUtils.getValueInRange({
            minValue    : 0,
            maxValue    : Math.max(0, Math.ceil(this._cachedListDataArray.length / MapsPerPage) - 1),
            rawValue    : _pageIndex - 1,
        });
        if (newPageIndex !== _pageIndex) {
            _pageIndex = newPageIndex;
            await this._updateComponentsForPage();
        }
    }
    private async _onTouchedBtnNextPage(): Promise<void> {
        const newPageIndex = NumbersUtils.getValueInRange({
            minValue    : 0,
            maxValue    : Math.max(0, Math.ceil(this._cachedListDataArray.length / MapsPerPage) - 1),
            rawValue    : _pageIndex + 1,
        });
        if (newPageIndex !== _pageIndex) {
            _pageIndex = newPageIndex;
            await this._updateComponentsForPage();
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _updateOnOpenDataChanged(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (openData.mapSorter != null) {
            _mapSorter = openData.mapSorter;
        }
        if (openData.usePreviousFilter) {
            this._mapFilter = _previousFilter;
        } else {
            this._mapFilter = openData.mapFilter;
        }
        if (!openData.usePreviousPageIndex) {
            _pageIndex = 0;
        }
        _previousFilter = this._mapFilter;

        this._updateLabelPageTitle();
        await this._refreshCachedListDataArray();
        await this._updateComponentsForPage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelCreateRoom.setText(LangUtils.getText(LangConstants.TextType.B0000));
        this._labelMultiPlayer.setText(LangUtils.getText(LangConstants.TextType.B0646));
        this._labelChooseMap.setText(LangUtils.getText(LangConstants.TextType.B0227));
        this._labelLoading.setText(LangUtils.getText(LangConstants.TextType.A0150));
        this._labelNoMap.setText(LangUtils.getText(LangConstants.TextType.A0010));
        this._btnBack.setText(LangUtils.getText(LangConstants.TextType.B0146));
        this._btnSearch.setText(LangUtils.getText(LangConstants.TextType.B0228));
        this._btnSort.setText(LangUtils.getText(LangConstants.TextType.B1049));
        this._btnNextStep.setText(LangUtils.getText(LangConstants.TextType.B1383));
        this._btnPrevPage.setText(LangUtils.getText(LangConstants.TextType.B1384));
        this._btnNextPage.setText(LangUtils.getText(LangConstants.TextType.B1385));
        this._updateLabelPageTitle();

        this._layoutPage.arrangeItems();
        this._layoutNavName.arrangeItems();
        this._groupNavigator.arrangeItems();
    }

    private async _updateComponentsForPage(): Promise<void> {
        const dataArray = this.getListDataArray();
        this._labelPage.setText(`${_pageIndex + 1} / ${Math.max(1, Math.ceil(this._cachedListDataArray.length / MapsPerPage))}`);
        this._layoutPage.arrangeItems();

        const oldSelectedNormalMapId = _selectedNormalMapId ?? this._getSelectedNormalMapId();
        this._labelNoMap.setIsVisible(dataArray.length <= 0);
        await this._listMap.bindData(dataArray);
        await this.setAndReviseSelectedNormalMapId(oldSelectedNormalMapId ?? -1, true);
    }

    private _updateLabelPageTitle(): void {
        const label = this._labelPageTitle;
        const mapFilter = this._mapFilter;
        if ((mapFilter == null) || (mapFilter.checkIsEmpty())) {
            label.setTextColor(0xCCCCCC);
            label.setText(LangUtils.getText(LangConstants.TextType.B1386));
        } else {
            label.setTextColor(0xFFFF00);
            label.setText(`${LangUtils.getText(LangConstants.TextType.B1386)}(${LangUtils.getText(LangConstants.TextType.B1387)})`);
        }
        this._layoutPage.arrangeItems();
    }

    private async _refreshCachedListDataArray(): Promise<void> {
        const mapFilter     = this._mapFilter;
        const dataArray     : DataForMapNameRenderer[] = [];
        const promiseArray  : Promise<void>[] = [];
        for (const normalMapId of await NormalMapModelNormalMapModel.getEnabledNormalMapIdSet()) {
            promiseArray.push((async () => {
                const mapBriefData = await NormalMapModelNormalMapModel.getBriefData(normalMapId);
                if ((mapBriefData == null)                                                      ||
                    (!mapBriefData.getRuleAvailability()?.getCanCcw())                          ||
                    (!await NormalMapModelNormalMapModel.checkIsMeetFilter(normalMapId, mapFilter))
                ) {
                    return;
                }

                dataArray.push({
                    normalMapId,
                    panel   : this,
                });
            })());
        }
        await Promise.all(promiseArray);

        this._cachedListDataArray = (await NormalMapModelNormalMapModel.sortMapArray(
            dataArray.map(v => ({ normalMapId: v.normalMapId, extraData: v })),
            _mapSorter,
        )).map(v => v.extraData);
    }
    private getListDataArray(): DataForMapNameRenderer[] {
        return this._cachedListDataArray.slice(_pageIndex * MapsPerPage, (_pageIndex + 1) * MapsPerPage);
    }

    private async _showMap(normalMapId: number | null): Promise<void> {
        const zoomMap       = this._zoomMap;
        const uiMapInfo     = this._uiMapInfo;
        const labelLoading  = this._labelLoading;

        if (normalMapId == null) {
            zoomMap.setIsVisible(false);
            uiMapInfo.setIsVisible(false);
            labelLoading.setIsVisible(false);

        } else {
            zoomMap.setIsVisible(true);
            uiMapInfo.setIsVisible(true);
            labelLoading.setIsVisible(true);

            const mapRawData        = HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(normalMapId));
            const gameConfig        = await GameConfigGcModel.getLatestGameConfig();
            labelLoading.setIsVisible(false);
            zoomMap.showMapByMapData({
                mapRawData          : mapRawData,
                gameConfig          : gameConfig,
                overridingPlayers   : null,
            });
            uiMapInfo.setOpenData({
                mapInfo : {
                    hasFog      : null,
                    gameConfig  : gameConfig,
                    mapRawData  : mapRawData,
                },
            });
            await uiMapInfo.applyOpenData();
        }
    }

    protected async _showOpenAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._groupMapView,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupTopRightButtons,
            beginProps  : { customAlpha: 0, customY: 16 - 40 },
            endProps    : { customAlpha: 1, customY: 16 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupSearch,
            beginProps  : { customAlpha: 0, customY: 30 },
            endProps    : { customAlpha: 1, customY: 70 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._btnNextStep,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupMapList,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._uiMapInfo,
            beginProps  : { customAlpha: 0, customX: 40 },
            endProps    : { customAlpha: 1, customX: 0 },
        });

        await TimerTimerModel.wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._groupMapView,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupTopRightButtons,
            beginProps  : { customAlpha: 1, customY: 16 },
            endProps    : { customAlpha: 0, customY: 16 - 40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupSearch,
            beginProps  : { customAlpha: 1, customY: 70 },
            endProps    : { customAlpha: 0, customY: 30 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._btnNextStep,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupMapList,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._uiMapInfo,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: 40 },
        });

        await TimerTimerModel.wait();
    }
}

interface DataForMapNameRenderer extends UiTypesUiListItemData.UiListItemData {
    normalMapId : number;
    panel       : Panel;
}
class MapNameRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForMapNameRenderer> {
    private readonly _btnHelp!      : UiInterfacesIUiButton.IUiButton;

    private readonly _groupName!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutName!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelName!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelId!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDesigner!    : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
            { ui: this._groupName,  callback: this._onTouchedGroupName },
        ]);
    }

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateLabelName();

        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const hasDescription = !!(await NormalMapModelNormalMapModel.getBriefData(normalMapId))?.getHasDescription();
        if (normalMapId === this.getOpenData()?.normalMapId) {
            this._btnHelp.setIsVisible(hasDescription);
        }
    }

    private async _onTouchedBtnHelp(e: VendorEgretEgret.Event): Promise<void> {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const normalMapId = openData.normalMapId;
        openData.panel.setAndReviseSelectedNormalMapId(normalMapId, false);

        const mapRawData = await NormalMapModelNormalMapModel.getRawData(normalMapId);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getLanguageText({ textArray: mapRawData?.getMapExtraText()?.getMapDescription() }) ?? LangConstants.UndefinedError,
        });
    }

    private _onTouchedGroupName(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedNormalMapId(openData.normalMapId, false);
    }

    private async _updateLabelName(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const labelName = this._labelName;
        this._labelId.setText(`#${normalMapId}`);
        labelName.setText(``);

        const mapBriefData = await NormalMapModelNormalMapModel.getBriefData(normalMapId);
        if ((normalMapId !== this.getOpenData()?.normalMapId) || (mapBriefData == null)) {
            return;
        }

        labelName.setText(LangUtils.getLanguageText({ textArray: mapBriefData.getMapNameArray() }) ?? LangConstants.UndefinedError);
        this._labelDesigner.setText(mapBriefData.getDesignerName() ?? LangConstants.UndefinedError);
        this._layoutName.arrangeItems();
    }
}
