import {
    NormalMap_Model_NormalMapModel,
    Tween_Executor,
    GamePanels_Dict,
    Lang_Utils,
    GameConfigs_Provider,
    Numbers_Utils,
    Helpers_PointerInput,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    FloatText,
    Maps_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Interfaces_IUiZoomableMap,
    type AuxiliaryTypes_MapFilter,
    type AuxiliaryTypes_AuxiliaryTypes,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

const MapsPerPage   = 50;

export interface OpenData {
    availableNormalMapIdArray   : number[];
    getTitleText                : () => string;
    isAutoClose?                : boolean;                          // 留空=true
    callback                    : (normalMapId: number) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSearch!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSort!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnPrevPage!      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnNextPage!      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutPage!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelPageTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPage!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _listMap!          : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForMapRenderer>;
    private readonly _labelTips!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupDetail!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelNoData!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _zoomMap!          : Ui_Interfaces_IUiZoomableMap.IUiZoomableMap;

    private _cachedListDataArray        : DataForMapRenderer[] = [];
    private _pageIndex                  = 0;
    private _selectedNormalMapId        : number | null = null;
    private _mapFilter                  : AuxiliaryTypes_MapFilter.MapFilter | null = null;
    private _mapSorter                  : AuxiliaryTypes_AuxiliaryTypes.MapSorter = {
        sortType    : Maps_Constants.SortType.MapName,
        isAscending : true,
    };

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,           callback : this.closePanel },
            { ui : this._btnSearch,          callback : this._onTouchedBtnSearch },
            { ui : this._btnSort,            callback : this._onTouchedBtnSort },
            { ui : this._btnPrevPage,        callback : this._onTouchedBtnPrevPage },
            { ui : this._btnNextPage,        callback : this._onTouchedBtnNextPage },
            { ui : this._groupDetail,        callback : this._onTouchedGroupDetail },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listMap.setItemRendererClass(MapRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._selectedNormalMapId   = -1;
        this._pageIndex             = 0;

        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listMap.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnSearch(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonMapFilterPanel, {
            mapFilter         : this._mapFilter,
            callbackOnConfirm : async mapFilter => {
                this._mapFilter             = mapFilter;
                this._selectedNormalMapId   = -1;
                this._pageIndex             = 0;
                this._updateLabelPageTitle();
                await this._refreshCachedListDataArray();
                await this._updateComponentsForPage();
            },
        });
    }

    private _onTouchedBtnSort(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMapSorterPanel, {
            currentSorter     : this._mapSorter,
            callbackOnConfirm : async mapSorter => {
                this._mapSorter             = mapSorter;
                this._selectedNormalMapId   = -1;
                this._pageIndex             = 0;
                await this._refreshCachedListDataArray();
                await this._updateComponentsForPage();
            },
        });
    }

    private async _onTouchedBtnPrevPage(): Promise<void> {
        const newPageIndex = Numbers_Utils.getValueInRange({
            minValue : 0,
            maxValue : Math.max(0, Math.ceil(this._cachedListDataArray.length / MapsPerPage) - 1),
            rawValue : this._pageIndex - 1,
        });
        if (newPageIndex !== this._pageIndex) {
            this._pageIndex = newPageIndex;
            await this._updateComponentsForPage();
        }
    }
    private async _onTouchedBtnNextPage(): Promise<void> {
        const newPageIndex = Numbers_Utils.getValueInRange({
            minValue : 0,
            maxValue : Math.max(0, Math.ceil(this._cachedListDataArray.length / MapsPerPage) - 1),
            rawValue : this._pageIndex + 1,
        });
        if (newPageIndex !== this._pageIndex) {
            this._pageIndex = newPageIndex;
            await this._updateComponentsForPage();
        }
    }

    private async _onTouchedGroupDetail(): Promise<void> {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const normalMapId   = this._selectedNormalMapId;
        const mapRawData    = normalMapId == null ? null : await NormalMap_Model_NormalMapModel.getRawData(normalMapId);
        if (mapRawData == null) {
            FloatText.showLang(Lang_Constants.TextType.B0278);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowMapPanel, {
                mapInfo : {
                    mapRawData        : mapRawData,
                    gameConfig        : await GameConfigs_Provider.getLatestGameConfig(),
                    overridingPlayers : null,
                },
            });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        await this._refreshCachedListDataArray();
        await this._updateComponentsForPage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(this.getOpenData()?.getTitleText() ?? Lang_Constants.UndefinedError);
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
        this._labelTips.setLangText(Lang_Constants.TextType.B1249);
        this._btnPrevPage.setLangText(Lang_Constants.TextType.B1384);
        this._btnNextPage.setLangText(Lang_Constants.TextType.B1385);
        this._updateLabelPageTitle();

        this._layoutPage.arrangeItems();
    }
    private _updateLabelPageTitle(): void {
        const label = this._labelPageTitle;
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
        const openData = this.getOpenData();
        if (openData == null) {
            this._cachedListDataArray = [];
            return;
        }

        const callback      = (normalMapId: number) => {
            openData.callback(normalMapId);

            if (openData.isAutoClose !== false) {
                this.closePanel();
            }
        };
        const mapFilter     = this._mapFilter;
        const dataArray     : DataForMapRenderer[] = [];
        const promiseArray  : Promise<void>[] = [];
        for (const normalMapId of openData.availableNormalMapIdArray) {
            promiseArray.push((async () => {
                if (await NormalMap_Model_NormalMapModel.checkIsMeetFilter(normalMapId, mapFilter)) {
                    dataArray.push({
                        normalMapId : normalMapId,
                        panel       : this,
                        callback    : callback,
                    });
                }
            })());
        }

        await Promise.all(promiseArray);
        this._cachedListDataArray = (await NormalMap_Model_NormalMapModel.sortMapArray(
            dataArray.map(v => ({ normalMapId : v.normalMapId, extraData : v })),
            this._mapSorter,
        )).map(v => v.extraData);
    }
    private getListDataArray(): DataForMapRenderer[] {
        const pageIndex = this._pageIndex;
        return this._cachedListDataArray.slice(pageIndex * MapsPerPage, (pageIndex + 1) * MapsPerPage);
    }

    private async _updateComponentsForPage(): Promise<void> {
        const dataArray = this.getListDataArray();
        this._labelPage.setText(`${this._pageIndex + 1} / ${Math.max(1, Math.ceil(this._cachedListDataArray.length / MapsPerPage))}`);
        this._layoutPage.arrangeItems();

        const listMap                   = this._listMap;
        const oldSelectedNormalMapId    = listMap.getFirstSelectedData()?.normalMapId;
        this._labelNoData.setIsVisible(dataArray.length <= 0);
        await listMap.bindData(dataArray);

        const newIndex = Math.max(0, dataArray.findIndex(v => v.normalMapId === oldSelectedNormalMapId));
        listMap.setSelectedItemIndex(newIndex);
        listMap.scrollToItem(newIndex);
        await this.showMap(dataArray[newIndex]?.normalMapId ?? null);
    }

    public async showMap(normalMapId: number | null): Promise<void> {
        if (normalMapId === this._selectedNormalMapId) {
            return;
        }
        this._selectedNormalMapId = normalMapId;

        const zoomMap       = this._zoomMap;
        const labelNoData   = this._labelNoData;
        const mapRawData    = normalMapId == null ? null : (await NormalMap_Model_NormalMapModel.getRawData(normalMapId));
        const gameConfig    = await GameConfigs_Provider.getLatestGameConfig();
        if (this._selectedNormalMapId !== normalMapId) {
            return;
        }

        if (mapRawData == null) {
            labelNoData.setIsVisible(true);
            zoomMap.setIsVisible(false);
            zoomMap.clearMap();
        } else {
            labelNoData.setIsVisible(false);
            zoomMap.setIsVisible(true);
            zoomMap.showMapByMapData({
                mapRawData        : mapRawData,
                gameConfig        : gameConfig,
                overridingPlayers : null,
            });
        }
    }
}

interface DataForMapRenderer extends Ui_Types_UiListItemData.UiListItemData {
    normalMapId     : number;
    panel           : Panel;
    callback        : (normalMapId: number) => void;
}
class MapRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForMapRenderer> {
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgSelected!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _btnDesigner!      : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutName!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMapId!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDesigner!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapName!     : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._imgSelected,  callback : this._onTouchedImgSelected },
            { ui : this._btnDesigner,  callback : this._onTouchedBtnDesigner },
        ]);
        this._applySettingsForWholeTouch(true, true, Helpers_PointerInput.MouseStyleType.Pointer);

        this._imgSelected.setIsTouchEnabled(true);
    }
    protected async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Tween_Executor.Executor.removeTweens(imgSelected);
        Tween_Executor.Executor.get(imgSelected, { loop : true })
            .to({ customAlpha : 0.6 }, 500)
            .to({ customAlpha : 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Tween_Executor.Executor.removeTweens(this._imgSelected);
        await super._onClosed();
    }
    protected override _doApplyOpenData(): void {
        this._labelMapId.setText(`#${this.getOpenData()?.normalMapId}`);
        this._updateLabelDesignerAndMapName();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.showMap(openData.normalMapId);
    }

    private _onTouchedImgSelected(e: Egret_Egret.Event): void {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        openData.callback(openData.normalMapId);
    }
    private async _onTouchedBtnDesigner(e: Egret_Egret.Event): Promise<void> {
        e.stopPropagation();

        const normalMapId   = this.getOpenData()?.normalMapId;
        const userId        = normalMapId == null ? null : (await NormalMap_Model_NormalMapModel.getRawData(normalMapId))?.getDesignerUserId();
        if (userId != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, { userId : userId });
        }
    }

    private async _updateLabelDesignerAndMapName(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const mapBriefData  = await NormalMap_Model_NormalMapModel.getBriefData(normalMapId);
        if ((mapBriefData) && (normalMapId === this.getOpenData()?.normalMapId)) {
            this._labelDesigner.setText(mapBriefData.getDesignerName() ?? Lang_Constants.UndefinedError);
            this._labelMapName.setText(Lang_Utils.getLanguageText({ textArray : mapBriefData.getMapNameArray() }) ?? Lang_Constants.UndefinedError);
        }
        this._layoutName.arrangeItems();
    }
}
