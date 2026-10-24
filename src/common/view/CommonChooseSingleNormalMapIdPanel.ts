import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesMapFilter from "../../auxiliaryTypes/MapFilter.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcMap from "../../gameConfig/GcMap.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiInterfacesIUiZoomableMap from "../../ui/interfaces/IUiZoomableMap.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

const MapsPerPage   = 50;

export interface OpenData {
    availableNormalMapIdArray   : number[];
    getTitleText                : () => string;
    isAutoClose?                : boolean;                          // 留空=true
    callback                    : (normalMapId: number) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSearch!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSort!          : UiInterfacesIUiButton.IUiButton;

    private readonly _btnPrevPage!      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnNextPage!      : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutPage!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelPageTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPage!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _listMap!          : UiInterfacesIUiScrollList.IUiScrollList<DataForMapRenderer>;
    private readonly _labelTips!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupDetail!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelNoData!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _zoomMap!          : UiInterfacesIUiZoomableMap.IUiZoomableMap;

    private _cachedListDataArray        : DataForMapRenderer[] = [];
    private _pageIndex                  = 0;
    private _selectedNormalMapId        : number | null = null;
    private _mapFilter                  : AuxiliaryTypesMapFilter.MapFilter | null = null;
    private _mapSorter                  : AuxiliaryTypesAuxiliaryTypes.MapSorter = {
        sortType    : GameConfigGcMap.SortType.MapName,
        isAscending : true,
    };

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnSearch,          callback: this._onTouchedBtnSearch },
            { ui: this._btnSort,            callback: this._onTouchedBtnSort },
            { ui: this._btnPrevPage,        callback: this._onTouchedBtnPrevPage },
            { ui: this._btnNextPage,        callback: this._onTouchedBtnNextPage },
            { ui: this._groupDetail,        callback: this._onTouchedGroupDetail },
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonMapFilterPanel, {
            mapFilter           : this._mapFilter,
            callbackOnConfirm   : async mapFilter => {
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMapSorterPanel, {
            currentSorter       : this._mapSorter,
            callbackOnConfirm   : async mapSorter => {
                this._mapSorter             = mapSorter;
                this._selectedNormalMapId   = -1;
                this._pageIndex             = 0;
                await this._refreshCachedListDataArray();
                await this._updateComponentsForPage();
            },
        });
    }

    private async _onTouchedBtnPrevPage(): Promise<void> {
        const newPageIndex = NumbersUtils.getValueInRange({
            minValue    : 0,
            maxValue    : Math.max(0, Math.ceil(this._cachedListDataArray.length / MapsPerPage) - 1),
            rawValue    : this._pageIndex - 1,
        });
        if (newPageIndex !== this._pageIndex) {
            this._pageIndex = newPageIndex;
            await this._updateComponentsForPage();
        }
    }
    private async _onTouchedBtnNextPage(): Promise<void> {
        const newPageIndex = NumbersUtils.getValueInRange({
            minValue    : 0,
            maxValue    : Math.max(0, Math.ceil(this._cachedListDataArray.length / MapsPerPage) - 1),
            rawValue    : this._pageIndex + 1,
        });
        if (newPageIndex !== this._pageIndex) {
            this._pageIndex = newPageIndex;
            await this._updateComponentsForPage();
        }
    }

    private async _onTouchedGroupDetail(): Promise<void> {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const normalMapId   = this._selectedNormalMapId;
        const mapRawData    = normalMapId == null ? null : await NormalMapModelNormalMapModel.getRawData(normalMapId);
        if (mapRawData == null) {
            FloatText2.showLang(LangConstants.TextType.B0278);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowMapPanel, {
                mapInfo : {
                    mapRawData          : mapRawData,
                    gameConfig          : await GameConfigGcModel.getLatestGameConfig(),
                    overridingPlayers   : null,
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
        this._labelTitle.setText(this.getOpenData()?.getTitleText() ?? LangConstants.UndefinedError);
        this._labelNoData.setText(LangUtils.getText(LangConstants.TextType.B0278));
        this._labelTips.setText(LangUtils.getText(LangConstants.TextType.B1249));
        this._btnPrevPage.setText(LangUtils.getText(LangConstants.TextType.B1384));
        this._btnNextPage.setText(LangUtils.getText(LangConstants.TextType.B1385));
        this._updateLabelPageTitle();

        this._layoutPage.arrangeItems();
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
                if (await NormalMapModelNormalMapModel.checkIsMeetFilter(normalMapId, mapFilter)) {
                    dataArray.push({
                        normalMapId : normalMapId,
                        panel       : this,
                        callback    : callback,
                    });
                }
            })());
        }

        await Promise.all(promiseArray);
        this._cachedListDataArray = (await NormalMapModelNormalMapModel.sortMapArray(
            dataArray.map(v => ({ normalMapId: v.normalMapId, extraData: v })),
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
        const mapRawData    = normalMapId == null ? null : (await NormalMapModelNormalMapModel.getRawData(normalMapId));
        const gameConfig    = await GameConfigGcModel.getLatestGameConfig();
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
                mapRawData          : mapRawData,
                gameConfig          : gameConfig,
                overridingPlayers   : null,
            });
        }
    }
}

interface DataForMapRenderer extends UiTypesUiListItemData.UiListItemData {
    normalMapId     : number;
    panel           : Panel;
    callback        : (normalMapId: number) => void;
}
class MapRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForMapRenderer> {
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgSelected!      : UiInterfacesIUiImage.IUiImage;
    private readonly _btnDesigner!      : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutName!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMapId!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDesigner!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMapName!     : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._imgSelected,  callback: this._onTouchedImgSelected },
            { ui: this._btnDesigner,  callback: this._onTouchedBtnDesigner },
        ]);
        this._applySettingsForWholeTouch(true, true, HelpersPointerInput.MouseStyleType.Pointer);

        this._imgSelected.setIsTouchEnabled(true);
    }
    protected async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        TweenExecutor.Executor.removeTweens(imgSelected);
        TweenExecutor.Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        TweenExecutor.Executor.removeTweens(this._imgSelected);
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

    private _onTouchedImgSelected(e: VendorEgretEgret.Event): void {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        openData.callback(openData.normalMapId);
    }
    private async _onTouchedBtnDesigner(e: VendorEgretEgret.Event): Promise<void> {
        e.stopPropagation();

        const normalMapId   = this.getOpenData()?.normalMapId;
        const userId        = normalMapId == null ? null : (await NormalMapModelNormalMapModel.getRawData(normalMapId))?.getDesignerUserId();
        if (userId != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId: userId });
        }
    }

    private async _updateLabelDesignerAndMapName(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const mapBriefData  = await NormalMapModelNormalMapModel.getBriefData(normalMapId);
        if ((mapBriefData) && (normalMapId === this.getOpenData()?.normalMapId)) {
            this._labelDesigner.setText(mapBriefData.getDesignerName() ?? LangConstants.UndefinedError);
            this._labelMapName.setText(LangUtils.getLanguageText({ textArray: mapBriefData.getMapNameArray() }) ?? LangConstants.UndefinedError);
        }
        this._layoutName.arrangeItems();
    }
}
