import { showLang } from "../../FloatText.ts";
import { getLatestGameConfig } from "../../gameConfigs/Provider.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { gotoMapEditorWar } from "../../helpers/GameFlow.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { MouseStyleType } from "../../helpers/PointerInput.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getLanguageText } from "../../lang/Utils.ts";
import { getMmReviewingMaps } from "../../normalMap/model/NormalMapModel.ts";
import { reqMmAddIgnoredReviewingMap } from "../../normalMap/model/NormalMapProxy.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { MapEditorData } from "../../proto/schema/CommonProto/Map/MapEditorData.ts";
import { MapRawData as ProtoSchemaCommonProtoMapMapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
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

type MapRawData         = ProtoSchemaCommonProtoMapMapRawData;

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnIgnore!        : IUiButton;
    private readonly _btnClose!         : IUiButton;

    private readonly _labelNoData!      : IUiLabel;
    private readonly _labelLoading!     : IUiLabel;
    private readonly _labelTips!        : IUiLabel;
    private readonly _listMap!          : IUiScrollList<DataForMapRenderer>;

    private readonly _groupDetail!      : IUiContainer;
    private readonly _zoomMap!          : IUiZoomableMap;

    private _dataForListMap     : DataForMapRenderer[] = [];
    private _selectedIndex      : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,        callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgMmGetReviewingMaps,  callback: this._onMsgMmGetReviewingMaps },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnIgnore,          callback: this._onTouchedBtnIgnore },
            { ui: this._groupDetail,        callback: this._onTouchedGroupDetail },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listMap.setItemRendererClass(MapRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateComponentsForMaps();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listMap.removeAllItems();

        await super._onClosed();
    }

    public async setSelectedIndex(newIndex: number): Promise<void> {
        const oldIndex      = this.getSelectedIndex();
        const dataList      = this._dataForListMap;
        this._selectedIndex = dataList[newIndex] ? newIndex : null;

        if ((oldIndex != null) && (dataList[oldIndex])) {
            this._listMap.updateSingleData(oldIndex, dataList[oldIndex]);
        }

        if (dataList[newIndex]) {
            this._listMap.updateSingleData(newIndex, dataList[newIndex]);
        }
        await this._showMap(newIndex);
    }
    public getSelectedIndex(): number | null {
        return this._selectedIndex;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onMsgMmGetReviewingMaps(): void {
        this._updateComponentsForMaps();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnIgnore(): void {
        const data = this._listMap.getFirstSelectedData();
        if (data == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const designerUserId = data.mapRawData.getDesignerUserId();
        if (designerUserId == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const mapEditorData = data.mapEditorData;
        openPanel(getDict().CommonConfirmPanel, {
            getContent  : () => getText(TextType.A0980),
            callback    : () => reqMmAddIgnoredReviewingMap(
                designerUserId,
                mapEditorData.getSlotIndex(),
                mapEditorData.getDataTimestamp()
            )
        });
    }

    private async _onTouchedGroupDetail(): Promise<void> {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const mapRawData = this._listMap.getFirstSelectedData()?.mapRawData;
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
    private _updateComponentsForLanguage(): void {
        this._labelNoData.setLangText(TextType.B0278);
        this._labelTitle.setLangText(TextType.B0892);
        this._labelLoading.setLangText(TextType.A0078);
        this._labelTips.setLangText(TextType.B1249);
        this._btnIgnore.setLangText(TextType.B1472);
    }

    private async _updateComponentsForMaps(): Promise<void> {
        const newData           = this._createDataForListMap(await getMmReviewingMaps());
        this._dataForListMap    = newData;
        this._labelLoading.setIsVisible(false);

        if (newData.length > 0) {
            this._labelNoData.setIsVisible(false);
            await this._listMap.bindData(newData);
        } else {
            this._labelNoData.setIsVisible(true);
            await this._listMap.removeAllItems();
        }
        this.setSelectedIndex(0);
    }

    private _createDataForListMap(rawDataList: MapEditorData[] | null): DataForMapRenderer[] {
        const dataList: DataForMapRenderer[] = [];

        let index = 0;
        for (const data of rawDataList ?? []) {
            dataList.push({
                index           : index,
                panel           : this,
                mapEditorData   : data,
                mapRawData      : ProtoSchemaCommonProtoMapMapRawData.decode(getExisted(data.getEncodedMapRawData())),
            });
            ++index;
        }

        return dataList;
    }

    private async _showMap(index: number | null): Promise<void> {
        const mapData   = index == null ? null : this._dataForListMap[index]?.mapRawData;
        const zoomMap   = this._zoomMap;
        if (!mapData) {
            zoomMap.setIsVisible(false);
            zoomMap.clearMap();
        } else {
            zoomMap.setIsVisible(true);
            zoomMap.showMapByMapData({
                mapRawData          : mapData,
                gameConfig          : await getLatestGameConfig(),
                overridingPlayers   : null,
            });
        }
    }
}

interface DataForMapRenderer extends UiListItemData {
    index           : number;
    mapEditorData   : MapEditorData;
    panel           : Panel;
    mapRawData      : MapRawData;
}
class MapRenderer extends UiListItemRenderer<DataForMapRenderer> {
    private readonly _imgSelected!      : IUiImage;
    private readonly _btnDesigner!      : IUiButton;

    private readonly _layoutName!       : IUiLayout;
    private readonly _labelMapName!     : IUiLabel;
    private readonly _labelMapId!       : IUiLabel;
    private readonly _labelDesigner!    : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._imgSelected,    callback: this._onTouchedImgSelected },
            { ui: this._btnDesigner,    callback: this._onTouchedBtnDesigner },
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
    protected async _onClosed(): Promise<void> {
        Executor.removeTweens(this._imgSelected);
        await super._onClosed();
    }
    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const mapRawData = openData.mapRawData;
        this._labelMapId.setText(`#${openData.index}`);
        this._labelMapName.setText(getLanguageText({ textArray: mapRawData.getMapNameArray() }) || `(${getText(TextType.B0277)})`);
        this._labelDesigner.setText(mapRawData.getDesignerName() ?? UndefinedError);

        this._layoutName.arrangeItems();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setSelectedIndex(openData.index);
    }

    private _onTouchedImgSelected(e: Event): void {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);
        const mapEditorData = openData.mapEditorData;
        gotoMapEditorWar({
            mapRawData                  : openData.mapRawData,
            slotIndex                   : mapEditorData.getSlotIndex(),
            isReview                    : true,
            srcNormalMapIdForAddEvent   : mapEditorData.getSrcNormalMapIdForAddEvent() ?? null,
            gridMarkData                : null,
        });
    }
    private _onTouchedBtnDesigner(e: Event): void {
        e.stopPropagation();

        const userId = this.getOpenData()?.mapRawData.getDesignerUserId();
        if (userId != null) {
            openPanel(getDict().UserPanel, { userId: userId });
        }
    }
}
