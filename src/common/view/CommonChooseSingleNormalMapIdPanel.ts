import type { MapSorter } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapFilter } from "../../auxiliaryTypes/MapFilter.ts";
import { showLang } from "../../FloatText.ts";
import { SortType } from "../../maps/Constants.ts";
import { getLatestGameConfig } from "../../gameConfig/GcModel.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { MouseStyleType } from "../../helpers/PointerInput.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getLanguageText } from "../../lang/Utils.ts";
import { getRawData, checkIsMeetFilter, sortMapArray, getBriefData } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { IUiZoomableMap } from "../../ui/interfaces/IUiZoomableMap.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

const MapsPerPage   = 50;

export interface OpenData {
    availableNormalMapIdArray   : number[];
    getTitleText                : () => string;
    isAutoClose?                : boolean;                          // 留空=true
    callback                    : (normalMapId: number) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnClose!         : IUiButton;
    private readonly _btnSearch!        : IUiButton;
    private readonly _btnSort!          : IUiButton;

    private readonly _btnPrevPage!      : IUiButton;
    private readonly _btnNextPage!      : IUiButton;
    private readonly _layoutPage!       : IUiLayout;
    private readonly _labelPageTitle!   : IUiLabel;
    private readonly _labelPage!        : IUiLabel;

    private readonly _listMap!          : IUiScrollList<DataForMapRenderer>;
    private readonly _labelTips!        : IUiLabel;

    private readonly _groupDetail!      : IUiContainer;
    private readonly _labelNoData!      : IUiLabel;
    private readonly _zoomMap!          : IUiZoomableMap;

    private _cachedListDataArray        : DataForMapRenderer[] = [];
    private _pageIndex                  = 0;
    private _selectedNormalMapId        : number | null = null;
    private _mapFilter                  : MapFilter | null = null;
    private _mapSorter                  : MapSorter = {
        sortType    : SortType.MapName,
        isAscending : true,
    };

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        openPanel(getDict().CommonMapFilterPanel, {
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
        openPanel(getDict().CommonChooseMapSorterPanel, {
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
        const newPageIndex = getValueInRange({
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
        const newPageIndex = getValueInRange({
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
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const normalMapId   = this._selectedNormalMapId;
        const mapRawData    = normalMapId == null ? null : await getRawData(normalMapId);
        if (mapRawData == null) {
            showLang(TextType.B0278);
        } else {
            openPanel(getDict().CommonShowMapPanel, {
                mapInfo : {
                    mapRawData          : mapRawData,
                    gameConfig          : await getLatestGameConfig(),
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
        this._labelTitle.setText(this.getOpenData()?.getTitleText() ?? UndefinedError);
        this._labelNoData.setText(getText(TextType.B0278));
        this._labelTips.setText(getText(TextType.B1249));
        this._btnPrevPage.setText(getText(TextType.B1384));
        this._btnNextPage.setText(getText(TextType.B1385));
        this._updateLabelPageTitle();

        this._layoutPage.arrangeItems();
    }
    private _updateLabelPageTitle(): void {
        const label = this._labelPageTitle;
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
                if (await checkIsMeetFilter(normalMapId, mapFilter)) {
                    dataArray.push({
                        normalMapId : normalMapId,
                        panel       : this,
                        callback    : callback,
                    });
                }
            })());
        }

        await Promise.all(promiseArray);
        this._cachedListDataArray = (await sortMapArray(
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
        const mapRawData    = normalMapId == null ? null : (await getRawData(normalMapId));
        const gameConfig    = await getLatestGameConfig();
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

interface DataForMapRenderer extends UiListItemData {
    normalMapId     : number;
    panel           : Panel;
    callback        : (normalMapId: number) => void;
}
class MapRenderer extends UiListItemRenderer<DataForMapRenderer> {
    private readonly _group!            : IUiContainer;
    private readonly _imgSelected!      : IUiImage;
    private readonly _btnDesigner!      : IUiButton;

    private readonly _layoutName!       : IUiLayout;
    private readonly _labelMapId!       : IUiLabel;
    private readonly _labelDesigner!    : IUiLabel;
    private readonly _labelMapName!     : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._imgSelected,  callback: this._onTouchedImgSelected },
            { ui: this._btnDesigner,  callback: this._onTouchedBtnDesigner },
        ]);
        this._applySettingsForWholeTouch(true, true, MouseStyleType.Pointer);

        this._imgSelected.setIsTouchEnabled(true);
    }
    protected async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Executor.removeTweens(imgSelected);
        Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Executor.removeTweens(this._imgSelected);
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

    private _onTouchedImgSelected(e: Event): void {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);
        openData.callback(openData.normalMapId);
    }
    private async _onTouchedBtnDesigner(e: Event): Promise<void> {
        e.stopPropagation();

        const normalMapId   = this.getOpenData()?.normalMapId;
        const userId        = normalMapId == null ? null : (await getRawData(normalMapId))?.getDesignerUserId();
        if (userId != null) {
            openPanel(getDict().UserPanel, { userId: userId });
        }
    }

    private async _updateLabelDesignerAndMapName(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const mapBriefData  = await getBriefData(normalMapId);
        if ((mapBriefData) && (normalMapId === this.getOpenData()?.normalMapId)) {
            this._labelDesigner.setText(mapBriefData.getDesignerName() ?? UndefinedError);
            this._labelMapName.setText(getLanguageText({ textArray: mapBriefData.getMapNameArray() }) ?? UndefinedError);
        }
        this._layoutName.arrangeItems();
    }
}
