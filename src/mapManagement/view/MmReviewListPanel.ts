import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NormalMapModelNormalMapProxy from "../../normalMap/model/NormalMapProxy.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoMapMapEditorData from "../../proto/schema/CommonProto/Map/MapEditorData.ts";
import * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
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

type MapEditorData      = ProtoSchemaCommonProtoMapMapEditorData.MapEditorData;
type MapRawData         = ProtoSchemaCommonProtoMapMapRawData.MapRawData;

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnIgnore!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;

    private readonly _labelNoData!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelLoading!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTips!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listMap!          : UiInterfacesIUiScrollList.IUiScrollList<DataForMapRenderer>;

    private readonly _groupDetail!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _zoomMap!          : UiInterfacesIUiZoomableMap.IUiZoomableMap;

    private _dataForListMap     : DataForMapRenderer[] = [];
    private _selectedIndex      : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,        callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgMmGetReviewingMaps,  callback: this._onMsgMmGetReviewingMaps },
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
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const designerUserId = data.mapRawData.getDesignerUserId();
        if (designerUserId == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const mapEditorData = data.mapEditorData;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent  : () => LangUtils.getText(LangConstants.TextType.A0980),
            callback    : () => NormalMapModelNormalMapProxy.reqMmAddIgnoredReviewingMap(
                designerUserId,
                mapEditorData.getSlotIndex(),
                mapEditorData.getDataTimestamp()
            )
        });
    }

    private async _onTouchedGroupDetail(): Promise<void> {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const mapRawData = this._listMap.getFirstSelectedData()?.mapRawData;
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
    private _updateComponentsForLanguage(): void {
        this._labelNoData.setLangText(LangConstants.TextType.B0278);
        this._labelTitle.setLangText(LangConstants.TextType.B0892);
        this._labelLoading.setLangText(LangConstants.TextType.A0078);
        this._labelTips.setLangText(LangConstants.TextType.B1249);
        this._btnIgnore.setLangText(LangConstants.TextType.B1472);
    }

    private async _updateComponentsForMaps(): Promise<void> {
        const newData           = this._createDataForListMap(await NormalMapModelNormalMapModel.getMmReviewingMaps());
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
                mapRawData      : ProtoSchemaCommonProtoMapMapRawData.MapRawData.decode(HelpersMisc.getExisted(data.getEncodedMapRawData())),
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
                gameConfig          : await GameConfigGcModel.getLatestGameConfig(),
                overridingPlayers   : null,
            });
        }
    }
}

interface DataForMapRenderer extends UiTypesUiListItemData.UiListItemData {
    index           : number;
    mapEditorData   : MapEditorData;
    panel           : Panel;
    mapRawData      : MapRawData;
}
class MapRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForMapRenderer> {
    private readonly _imgSelected!      : UiInterfacesIUiImage.IUiImage;
    private readonly _btnDesigner!      : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutName!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMapName!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMapId!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDesigner!    : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._imgSelected,    callback: this._onTouchedImgSelected },
            { ui: this._btnDesigner,    callback: this._onTouchedBtnDesigner },
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
    protected async _onClosed(): Promise<void> {
        TweenExecutor.Executor.removeTweens(this._imgSelected);
        await super._onClosed();
    }
    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const mapRawData = openData.mapRawData;
        this._labelMapId.setText(`#${openData.index}`);
        this._labelMapName.setText(LangUtils.getLanguageText({ textArray: mapRawData.getMapNameArray() }) || `(${LangUtils.getText(LangConstants.TextType.B0277)})`);
        this._labelDesigner.setText(mapRawData.getDesignerName() ?? LangConstants.UndefinedError);

        this._layoutName.arrangeItems();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setSelectedIndex(openData.index);
    }

    private _onTouchedImgSelected(e: VendorEgretEgret.Event): void {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        const mapEditorData = openData.mapEditorData;
        HelpersGameFlow.gotoMapEditorWar({
            mapRawData                  : openData.mapRawData,
            slotIndex                   : mapEditorData.getSlotIndex() ?? 0,
            isReview                    : true,
            srcNormalMapIdForAddEvent   : mapEditorData.getSrcNormalMapIdForAddEvent() ?? null,
            gridMarkData                : null,
        });
    }
    private _onTouchedBtnDesigner(e: VendorEgretEgret.Event): void {
        e.stopPropagation();

        const userId = this.getOpenData()?.mapRawData.getDesignerUserId();
        if (userId != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId: userId });
        }
    }
}
