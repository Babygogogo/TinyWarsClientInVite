import type { Undefinable, MapSorter } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapFilter } from "../../auxiliaryTypes/MapFilter.ts";
import { showLang } from "../../FloatText.ts";
import { SortType } from "../../gameConfig/GcMap.ts";
import { getLatestGameConfig } from "../../gameConfig/GcModel.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getLanguageText } from "../../lang/Utils.ts";
import {
    getRawData,
    getEnabledNormalMapIdSet,
    getBriefData,
    checkIsMeetFilter,
    sortMapArray,
} from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { ScrWarCreator } from "../model/ScrWarCreator.ts";
import { getAvailableSlotIndex } from "../../singlePlayerMode/model/SpmModel.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { wait } from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiMapInfo } from "../../ui/interfaces/IUiMapInfo.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { IUiZoomableMap } from "../../ui/interfaces/IUiZoomableMap.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { callLater, Event } from "../../vendor/egret/Egret.ts";

const MapsPerPage           = 50;
let _pageIndex              = 0;
let _selectedNormalMapId    : Undefinable<number>;
let _previousFilter         : MapFilter | null = null;
let _mapSorter              : MapSorter = {
    sortType    : SortType.MapName,
    isAscending : true,
};

export interface OpenData {
    mapFilter               : MapFilter | null;
    mapSorter               : MapSorter | null;
    usePreviousFilter       : boolean;
    usePreviousPageIndex    : boolean;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _groupMapView!             : IUiContainer;
    private readonly _zoomMap!                  : IUiZoomableMap;
    private readonly _labelLoading!             : IUiLabel;

    private readonly _groupNavigator!           : IUiLayout;
    private readonly _layoutNavName!            : IUiLayout;
    private readonly _labelSinglePlayer!        : IUiLabel;
    private readonly _labelCustomMode!          : IUiLabel;
    private readonly _labelChooseMap!           : IUiLabel;

    private readonly _btnBack!                  : IUiButton;
    private readonly _btnNextStep!              : IUiButton;

    private readonly _groupTopRightButtons!     : IUiContainer;
    private readonly _btnSwitch!                : IUiButton;
    private readonly _btnSearch!                : IUiButton;
    private readonly _btnSort!                  : IUiButton;

    private readonly _groupSearch!              : IUiContainer;
    private readonly _btnPrevPage!              : IUiButton;
    private readonly _btnNextPage!              : IUiButton;
    private readonly _layoutPage!               : IUiLayout;
    private readonly _labelPageTitle!           : IUiLabel;
    private readonly _labelPage!                : IUiLabel;

    private readonly _groupMapList!             : IUiContainer;
    private readonly _listMap!                  : IUiScrollList<DataForMapNameRenderer>;
    private readonly _labelNoMap!               : IUiLabel;

    private readonly _uiMapInfo!                : IUiMapInfo;
    private _mapFilter                          : MapFilter | null = null;
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
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            playShortSfx(ShortSfxCode.ButtonCancel01);
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

    public async setAndReviseSelectedNormalMapId(newNormalMapId: number | null, needScroll: boolean): Promise<void> {
        _selectedNormalMapId = newNormalMapId;

        const listMap   = this._listMap;
        const index     = getExisted(listMap.getRevisedFirstIndex(data => data?.normalMapId === newNormalMapId));
        listMap.setSelectedItemIndex(index);
        if (needScroll) {
            callLater(() => listMap.scrollToItem(Math.max(0, index - 1)), undefined); // callLater是为了防止sizer延迟导致的scroll失效；index-1是为了让玩家看到上面还有选项
        }

        this._updateBtnNextStep();
        await this._updateComponentsForPreviewingMapInfo();
    }
    private _getSelectedNormalMapId(): number | null {
        return this._listMap.getFirstSelectedData()?.normalMapId ?? null;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchTapBtnSearch(): void {
        openPanel(getDict().CommonMapFilterPanel, {
            mapFilter           : this._mapFilter,
            callbackOnConfirm   : mapFilter => {
                openPanel(getDict().ScrCreateMapListPanel, {
                    mapFilter               : mapFilter,
                    mapSorter               : _mapSorter,
                    usePreviousFilter       : false,
                    usePreviousPageIndex    : false,
                });
            },
        });
    }

    private _onTouchedBtnSort(): void {
        openPanel(getDict().CommonChooseMapSorterPanel, {
            currentSorter       : _mapSorter,
            callbackOnConfirm   : (mapSorter: MapSorter) => {
                openPanel(getDict().ScrCreateMapListPanel, {
                    mapFilter               : null,
                    mapSorter               : mapSorter,
                    usePreviousFilter       : true,
                    usePreviousPageIndex    : false,
                });
            },
        });
    }

    private _onTouchedBtnBack(): void {
        this.closePanel();
        openPanel(getDict().SpmMainMenuPanel, void 0);
        openPanel(getDict().LobbyTopPanel, void 0);
        openPanel(getDict().LobbyBottomPanel, void 0);
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const selectedNormalMapId = this._listMap.getFirstSelectedData()?.normalMapId;
        if (selectedNormalMapId != null) {
            this.closePanel();

            openPanel(getDict().ScrCreateSettingsPanel, {
                warCreator: new ScrWarCreator(
                    await getLatestGameConfig(),
                    getExisted(await getRawData(selectedNormalMapId)),
                    await getAvailableSlotIndex()
                ),
            });
        }
    }

    private async _onTouchedGroupMapView(): Promise<void> {
        const normalMapId = this._listMap.getFirstSelectedData()?.normalMapId;
        if (normalMapId != null) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            openPanel(getDict().CommonShowMapPanel, {
                mapInfo : {
                    gameConfig          : await getLatestGameConfig(),
                    mapRawData          : getExisted(await getRawData(normalMapId)),
                    overridingPlayers   : null,
                },
            });
        }
    }

    private async _onTouchedBtnSwitch(): Promise<void> {
        showLang(TextType.A0938);

        this.closePanel();
        openPanel(getDict().SrrCreateMapListPanel, {
            mapFilter               : null,
            mapSorter               : null,
            usePreviousFilter       : true,
            usePreviousPageIndex    : true,
        });
    }

    private async _onTouchedBtnPrevPage(): Promise<void> {
        const newPageIndex = getValueInRange({
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
        const newPageIndex = getValueInRange({
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
        this._labelSinglePlayer.setText(getText(TextType.B0603));
        this._labelCustomMode.setText(getText(TextType.B1372));
        this._labelChooseMap.setText(getText(TextType.B0227));
        this._labelLoading.setText(getText(TextType.A0150));
        this._btnBack.setText(getText(TextType.B0146));
        this._btnSearch.setText(getText(TextType.B0228));
        this._btnSort.setText(getText(TextType.B1049));
        this._btnNextStep.setText(getText(TextType.B1383));
        this._btnPrevPage.setText(getText(TextType.B1384));
        this._btnNextPage.setText(getText(TextType.B1385));
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
        const label     = this._labelPageTitle;
        const mapFilter = this._mapFilter;
        if ((mapFilter == null) || (mapFilter.checkIsEmpty())) {
            label.setTextColor(0xCCCCCC);
            label.setText(getText(TextType.B1386));
        } else {
            label.setTextColor(0xFFFF00);
            label.setText(`${getText(TextType.B1386)}(${getText(TextType.B1387)})`);
        }
        this._layoutPage.arrangeItems();
    }

    private async _refreshCachedListDataArray(): Promise<void> {
        const mapFilter     = this._mapFilter;
        const dataArray     : DataForMapNameRenderer[] = [];
        const promiseArray  : Promise<void>[] = [];
        for (const normalMapId of await getEnabledNormalMapIdSet()) {
            promiseArray.push((async () => {
                const mapBriefData = await getBriefData(normalMapId);
                if ((mapBriefData == null)                                                      ||
                    (!await checkIsMeetFilter(normalMapId, mapFilter))
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

        this._cachedListDataArray = (await sortMapArray(
            dataArray.map(v => ({ normalMapId: v.normalMapId, extraData: v })),
            _mapSorter,
        )).map(v => v.extraData);
    }
    private getListDataArray(): DataForMapNameRenderer[] {
        return this._cachedListDataArray.slice(_pageIndex * MapsPerPage, (_pageIndex + 1) * MapsPerPage);
    }

    private async _updateComponentsForPreviewingMapInfo(): Promise<void> {
        const uiMapInfo     = this._uiMapInfo;
        const zoomMap       = this._zoomMap;
        const normalMapId   = this._getSelectedNormalMapId();
        if (normalMapId == null) {
            uiMapInfo.setIsVisible(false);
            zoomMap.clearMap();
        } else {
            uiMapInfo.setIsVisible(true);

            const mapRawData    = getExisted(await getRawData(normalMapId));
            const gameConfig    = await getLatestGameConfig();
            zoomMap.showMapByMapData({
                mapRawData          : mapRawData,
                gameConfig          : gameConfig,
                overridingPlayers   : null,
            });
            uiMapInfo.setOpenData({
                mapInfo : {
                    hasFog      : null,
                    mapRawData  : mapRawData,
                    gameConfig  : gameConfig,
                },
            });
            await uiMapInfo.applyOpenData();
        }
    }
    private _updateBtnNextStep(): void {
        this._btnNextStep.setIsVisible(this._getSelectedNormalMapId() != null);
    }

    protected async _showOpenAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._groupMapView,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
        });
        Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        Executor.reset({
            obj         : this._groupTopRightButtons,
            beginProps  : { customAlpha: 0, customY: 16 - 40 },
            endProps    : { customAlpha: 1, customY: 16 },
        });
        Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        Executor.reset({
            obj         : this._groupSearch,
            beginProps  : { customAlpha: 0, customY: 30 },
            endProps    : { customAlpha: 1, customY: 70 },
        });
        Executor.reset({
            obj         : this._btnNextStep,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        Executor.reset({
            obj         : this._groupMapList,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        Executor.reset({
            obj         : this._uiMapInfo,
            beginProps  : { customAlpha: 0, customX: 40 },
            endProps    : { customAlpha: 1, customX: 0 },
        });

        await wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._groupMapView,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });
        Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        Executor.reset({
            obj         : this._groupTopRightButtons,
            beginProps  : { customAlpha: 1, customY: 16 },
            endProps    : { customAlpha: 0, customY: 16 - 40 },
        });
        Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        Executor.reset({
            obj         : this._groupSearch,
            beginProps  : { customAlpha: 1, customY: 70 },
            endProps    : { customAlpha: 0, customY: 30 },
        });
        Executor.reset({
            obj         : this._btnNextStep,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        Executor.reset({
            obj         : this._groupMapList,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        Executor.reset({
            obj         : this._uiMapInfo,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: 40 },
        });

        await wait();
    }
}

interface DataForMapNameRenderer extends UiListItemData {
    normalMapId : number;
    panel       : Panel;
}
class MapNameRenderer extends UiListItemRenderer<DataForMapNameRenderer> {
    private readonly _btnHelp!          : IUiButton;

    private readonly _groupName!        : IUiContainer;
    private readonly _layoutName!       : IUiLayout;
    private readonly _labelName!        : IUiLabel;
    private readonly _labelId!          : IUiLabel;
    private readonly _labelDesigner!    : IUiLabel;

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

        const hasDescription = !!(await getBriefData(normalMapId))?.getHasDescription();
        if (normalMapId === this.getOpenData()?.normalMapId) {
            this._btnHelp.setIsVisible(hasDescription);
        }
    }

    private async _onTouchedBtnHelp(e: Event): Promise<void> {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const normalMapId = openData.normalMapId;
        openData.panel.setAndReviseSelectedNormalMapId(normalMapId, false);

        const mapRawData = await getRawData(normalMapId);
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getLanguageText({ textArray: mapRawData?.getMapExtraText()?.getMapDescription() }) ?? UndefinedError,
        });
    }

    private _onTouchedGroupName(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

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

        const mapBriefData = await getBriefData(normalMapId);
        if ((normalMapId !== this.getOpenData()?.normalMapId) || (mapBriefData == null)) {
            return;
        }

        labelName.setText(getLanguageText({ textArray: mapBriefData.getMapNameArray() }) ?? UndefinedError);
        this._labelDesigner.setText(mapBriefData.getDesignerName() ?? UndefinedError);
        this._layoutName.arrangeItems();
    }
}
