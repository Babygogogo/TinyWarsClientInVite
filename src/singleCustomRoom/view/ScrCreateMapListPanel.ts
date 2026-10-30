import {
    Egret_Egret,
    NormalMap_Model_NormalMapModel,
    Tween_Executor,
    SinglePlayerMode_Model_SpmModel,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    GameConfigs_Provider,
    Numbers_Utils,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    SingleCustomRoom_Model_ScrWarCreator,
    Sounds_Constants,
    FloatText,
    Maps_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Timer_TimerModel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiMapInfo,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Interfaces_IUiZoomableMap,
    type AuxiliaryTypes_MapFilter,
    type AuxiliaryTypes_AuxiliaryTypes,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

const MapsPerPage           = 50;
let _pageIndex              = 0;
let _selectedNormalMapId    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
let _previousFilter         : AuxiliaryTypes_MapFilter.MapFilter | null = null;
let _mapSorter              : AuxiliaryTypes_AuxiliaryTypes.MapSorter = {
    sortType    : Maps_Constants.SortType.MapName,
    isAscending : true,
};

export interface OpenData {
    mapFilter               : AuxiliaryTypes_MapFilter.MapFilter | null;
    mapSorter               : AuxiliaryTypes_AuxiliaryTypes.MapSorter | null;
    usePreviousFilter       : boolean;
    usePreviousPageIndex    : boolean;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupMapView!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _zoomMap!                  : Ui_Interfaces_IUiZoomableMap.IUiZoomableMap;
    private readonly _labelLoading!             : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupNavigator!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _layoutNavName!            : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelSinglePlayer!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCustomMode!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelChooseMap!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnBack!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnNextStep!              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupTopRightButtons!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnSwitch!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSearch!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSort!                  : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupSearch!              : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnPrevPage!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnNextPage!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutPage!               : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelPageTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPage!                : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupMapList!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listMap!                  : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForMapNameRenderer>;
    private readonly _labelNoMap!               : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _uiMapInfo!                : Ui_Interfaces_IUiMapInfo.IUiMapInfo;
    private _mapFilter                          : AuxiliaryTypes_MapFilter.MapFilter | null = null;
    private _cachedListDataArray                : DataForMapNameRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnSearch,      callback : this._onTouchTapBtnSearch },
            { ui : this._btnSort,        callback : this._onTouchedBtnSort },
            { ui : this._btnBack,        callback : this._onTouchedBtnBack },
            { ui : this._btnNextStep,    callback : this._onTouchedBtnNextStep },
            { ui : this._groupMapView,   callback : this._onTouchedGroupMapView },
            { ui : this._btnSwitch,      callback : this._onTouchedBtnSwitch },
            { ui : this._btnPrevPage,    callback : this._onTouchedBtnPrevPage },
            { ui : this._btnNextPage,    callback : this._onTouchedBtnNextPage },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
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
        const index     = listMap.getRevisedFirstIndex(data => data?.normalMapId === newNormalMapId);
        listMap.setSelectedItemIndex(index);
        if (needScroll) {
            Egret_Egret.callLater(() => listMap.scrollToItem(Math.max(0, index - 1)), undefined); // callLater是为了防止sizer延迟导致的scroll失效；index-1是为了让玩家看到上面还有选项
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonMapFilterPanel, {
            mapFilter         : this._mapFilter,
            callbackOnConfirm : mapFilter => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ScrCreateMapListPanel, {
                    mapFilter            : mapFilter,
                    mapSorter            : _mapSorter,
                    usePreviousFilter    : false,
                    usePreviousPageIndex : false,
                });
            },
        });
    }

    private _onTouchedBtnSort(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMapSorterPanel, {
            currentSorter     : _mapSorter,
            callbackOnConfirm : (mapSorter: AuxiliaryTypes_AuxiliaryTypes.MapSorter) => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ScrCreateMapListPanel, {
                    mapFilter            : null,
                    mapSorter            : mapSorter,
                    usePreviousFilter    : true,
                    usePreviousPageIndex : false,
                });
            },
        });
    }

    private _onTouchedBtnBack(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SpmMainMenuPanel, void 0);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyTopPanel, void 0);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyBottomPanel, void 0);
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const selectedNormalMapId = this._listMap.getFirstSelectedData()?.normalMapId;
        if (selectedNormalMapId != null) {
            this.closePanel();

            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ScrCreateSettingsPanel, {
                warCreator : new SingleCustomRoom_Model_ScrWarCreator.ScrWarCreator(
                    await GameConfigs_Provider.getLatestGameConfig(),
                    Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(selectedNormalMapId)),
                    await SinglePlayerMode_Model_SpmModel.getAvailableSlotIndex(),
                ),
            });
        }
    }

    private async _onTouchedGroupMapView(): Promise<void> {
        const normalMapId = this._listMap.getFirstSelectedData()?.normalMapId;
        if (normalMapId != null) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowMapPanel, {
                mapInfo : {
                    gameConfig        : await GameConfigs_Provider.getLatestGameConfig(),
                    mapRawData        : Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(normalMapId)),
                    overridingPlayers : null,
                },
            });
        }
    }

    private async _onTouchedBtnSwitch(): Promise<void> {
        FloatText.showLang(Lang_Constants.TextType.A0938);

        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SrrCreateMapListPanel, {
            mapFilter            : null,
            mapSorter            : null,
            usePreviousFilter    : true,
            usePreviousPageIndex : true,
        });
    }

    private async _onTouchedBtnPrevPage(): Promise<void> {
        const newPageIndex = Numbers_Utils.getValueInRange({
            minValue : 0,
            maxValue : Math.max(0, Math.ceil(this._cachedListDataArray.length / MapsPerPage) - 1),
            rawValue : _pageIndex - 1,
        });
        if (newPageIndex !== _pageIndex) {
            _pageIndex = newPageIndex;
            await this._updateComponentsForPage();
        }
    }
    private async _onTouchedBtnNextPage(): Promise<void> {
        const newPageIndex = Numbers_Utils.getValueInRange({
            minValue : 0,
            maxValue : Math.max(0, Math.ceil(this._cachedListDataArray.length / MapsPerPage) - 1),
            rawValue : _pageIndex + 1,
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
        this._labelSinglePlayer.setLangText(Lang_Constants.TextType.B0603);
        this._labelCustomMode.setLangText(Lang_Constants.TextType.B1372);
        this._labelChooseMap.setLangText(Lang_Constants.TextType.B0227);
        this._labelLoading.setLangText(Lang_Constants.TextType.A0150);
        this._btnBack.setLangText(Lang_Constants.TextType.B0146);
        this._btnSearch.setLangText(Lang_Constants.TextType.B0228);
        this._btnSort.setLangText(Lang_Constants.TextType.B1049);
        this._btnNextStep.setLangText(Lang_Constants.TextType.B1383);
        this._btnPrevPage.setLangText(Lang_Constants.TextType.B1384);
        this._btnNextPage.setLangText(Lang_Constants.TextType.B1385);
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
            label.setLangText(Lang_Constants.TextType.B1386);
        } else {
            label.setTextColor(0xFFFF00);
            label.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1386)}(${Lang_Utils.getText(Lang_Constants.TextType.B1387)})`);
        }
        this._layoutPage.arrangeItems();
    }

    private async _refreshCachedListDataArray(): Promise<void> {
        const mapFilter     = this._mapFilter;
        const dataArray     : DataForMapNameRenderer[] = [];
        const promiseArray  : Promise<void>[] = [];
        for (const normalMapId of await NormalMap_Model_NormalMapModel.getEnabledNormalMapIdSet()) {
            promiseArray.push((async () => {
                const mapBriefData = await NormalMap_Model_NormalMapModel.getBriefData(normalMapId);
                if ((mapBriefData == null)                                                      ||
                    (!await NormalMap_Model_NormalMapModel.checkIsMeetFilter(normalMapId, mapFilter))
                ) {
                    return;
                }

                dataArray.push({
                    normalMapId,
                    panel : this,
                });
            })());
        }
        await Promise.all(promiseArray);

        this._cachedListDataArray = (await NormalMap_Model_NormalMapModel.sortMapArray(
            dataArray.map(v => ({ normalMapId : v.normalMapId, extraData : v })),
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

            const mapRawData    = Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(normalMapId));
            const gameConfig    = await GameConfigs_Provider.getLatestGameConfig();
            zoomMap.showMapByMapData({
                mapRawData        : mapRawData,
                gameConfig        : gameConfig,
                overridingPlayers : null,
            });
            uiMapInfo.setOpenData({
                mapInfo : {
                    hasFog     : null,
                    mapRawData : mapRawData,
                    gameConfig : gameConfig,
                },
            });
            await uiMapInfo.applyOpenData();
        }
    }
    private _updateBtnNextStep(): void {
        this._btnNextStep.setIsVisible(this._getSelectedNormalMapId() != null);
    }

    protected async _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._groupMapView,
            beginProps : { customAlpha : 0 },
            endProps   : { customAlpha : 1 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupNavigator,
            beginProps : { customAlpha : 0, customY : -20 },
            endProps   : { customAlpha : 1, customY : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupTopRightButtons,
            beginProps : { customAlpha : 0, customY : 16 - 40 },
            endProps   : { customAlpha : 1, customY : 16 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnBack,
            beginProps : { customAlpha : 0, customY : -20 },
            endProps   : { customAlpha : 1, customY : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupSearch,
            beginProps : { customAlpha : 0, customY : 30 },
            endProps   : { customAlpha : 1, customY : 70 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnNextStep,
            beginProps : { customAlpha : 0, customX : -20 },
            endProps   : { customAlpha : 1, customX : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupMapList,
            beginProps : { customAlpha : 0, customX : -20 },
            endProps   : { customAlpha : 1, customX : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._uiMapInfo,
            beginProps : { customAlpha : 0, customX : 40 },
            endProps   : { customAlpha : 1, customX : 0 },
        });

        await Timer_TimerModel.wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._groupMapView,
            beginProps : { customAlpha : 1 },
            endProps   : { customAlpha : 0 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupNavigator,
            beginProps : { customAlpha : 1, customY : 20 },
            endProps   : { customAlpha : 0, customY : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupTopRightButtons,
            beginProps : { customAlpha : 1, customY : 16 },
            endProps   : { customAlpha : 0, customY : 16 - 40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnBack,
            beginProps : { customAlpha : 1, customY : 20 },
            endProps   : { customAlpha : 0, customY : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupSearch,
            beginProps : { customAlpha : 1, customY : 70 },
            endProps   : { customAlpha : 0, customY : 30 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnNextStep,
            beginProps : { customAlpha : 1, customX : 20 },
            endProps   : { customAlpha : 0, customX : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupMapList,
            beginProps : { customAlpha : 1, customX : 20 },
            endProps   : { customAlpha : 0, customX : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._uiMapInfo,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : 40 },
        });

        await Timer_TimerModel.wait();
    }
}

interface DataForMapNameRenderer extends Ui_Types_UiListItemData.UiListItemData {
    normalMapId : number;
    panel       : Panel;
}
class MapNameRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForMapNameRenderer> {
    private readonly _btnHelp!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupName!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _layoutName!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelName!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelId!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDesigner!    : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnHelp,    callback : this._onTouchedBtnHelp },
            { ui : this._groupName,  callback : this._onTouchedGroupName },
        ]);
    }

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateLabelName();

        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const hasDescription = !!(await NormalMap_Model_NormalMapModel.getBriefData(normalMapId))?.getHasDescription();
        if (normalMapId === this.getOpenData()?.normalMapId) {
            this._btnHelp.setIsVisible(hasDescription);
        }
    }

    private async _onTouchedBtnHelp(e: Egret_Egret.Event): Promise<void> {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const normalMapId = openData.normalMapId;
        openData.panel.setAndReviseSelectedNormalMapId(normalMapId, false);

        const mapRawData = await NormalMap_Model_NormalMapModel.getRawData(normalMapId);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getLanguageText({ textArray : mapRawData?.getMapExtraText()?.getMapDescription() }) ?? Lang_Constants.UndefinedError,
        });
    }

    private _onTouchedGroupName(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

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

        const mapBriefData = await NormalMap_Model_NormalMapModel.getBriefData(normalMapId);
        if ((normalMapId !== this.getOpenData()?.normalMapId) || (mapBriefData == null)) {
            return;
        }

        labelName.setText(Lang_Utils.getLanguageText({ textArray : mapBriefData.getMapNameArray() }) ?? Lang_Constants.UndefinedError);
        this._labelDesigner.setText(mapBriefData.getDesignerName() ?? Lang_Constants.UndefinedError);
        this._layoutName.arrangeItems();
    }
}
