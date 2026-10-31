import {
    Tween_Executor,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    GameConfigs_Provider,
    NormalMap_Model_NormalMapModel,
    Helpers_GameFlow,
    Helpers_PointerInput,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    NormalMap_Model_NormalMapProxy,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
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
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import type { MapEditorData } from "../../proto/schema/CommonProto/Map/MapEditorData.ts";
import { MapRawData as ProtoMapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnIgnore!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelNoData!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLoading!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTips!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listMap!          : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForMapRenderer>;

    private readonly _groupDetail!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _zoomMap!          : Ui_Interfaces_IUiZoomableMap.IUiZoomableMap;

    private _dataForListMap     : DataForMapRenderer[] = [];
    private _selectedIndex      : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",        callback : this._onNotifyLanguageChanged },
            { type : "MsgMmGetReviewingMaps",  callback : this._onMsgMmGetReviewingMaps },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,           callback : this.closePanel },
            { ui : this._btnIgnore,          callback : this._onTouchedBtnIgnore },
            { ui : this._groupDetail,        callback : this._onTouchedGroupDetail },
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
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const designerUserId = data.mapRawData.getDesignerUserId();
        if (designerUserId == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const mapEditorData = data.mapEditorData;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0980),
            callback   : () => NormalMap_Model_NormalMapProxy.reqMmAddIgnoredReviewingMap(
                designerUserId,
                mapEditorData.getSlotIndex(),
                mapEditorData.getDataTimestamp(),
            ),
        });
    }

    private async _onTouchedGroupDetail(): Promise<void> {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const mapRawData = this._listMap.getFirstSelectedData()?.mapRawData;
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
    private _updateComponentsForLanguage(): void {
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
        this._labelTitle.setLangText(Lang_Constants.TextType.B0892);
        this._labelLoading.setLangText(Lang_Constants.TextType.A0078);
        this._labelTips.setLangText(Lang_Constants.TextType.B1249);
        this._btnIgnore.setLangText(Lang_Constants.TextType.B1472);
    }

    private async _updateComponentsForMaps(): Promise<void> {
        const newData           = this._createDataForListMap(await NormalMap_Model_NormalMapModel.getMmReviewingMaps());
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
                index         : index,
                panel         : this,
                mapEditorData : data,
                mapRawData    : ProtoMapRawData.decode(Helpers_Misc.getExisted(data.getEncodedMapRawData())),
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
                mapRawData        : mapData,
                gameConfig        : await GameConfigs_Provider.getLatestGameConfig(),
                overridingPlayers : null,
            });
        }
    }
}

interface DataForMapRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index           : number;
    mapEditorData   : MapEditorData;
    panel           : Panel;
    mapRawData      : ProtoMapRawData;
}
class MapRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForMapRenderer> {
    private readonly _imgSelected!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _btnDesigner!      : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutName!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMapName!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapId!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDesigner!    : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._imgSelected,    callback : this._onTouchedImgSelected },
            { ui : this._btnDesigner,    callback : this._onTouchedBtnDesigner },
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
    protected async _onClosed(): Promise<void> {
        Tween_Executor.Executor.removeTweens(this._imgSelected);
        await super._onClosed();
    }
    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const mapRawData = openData.mapRawData;
        this._labelMapId.setText(`#${openData.index}`);
        this._labelMapName.setText(Lang_Utils.getLanguageText({ textArray : mapRawData.getMapNameArray() }) || `(${Lang_Utils.getText(Lang_Constants.TextType.B0277)})`);
        this._labelDesigner.setText(mapRawData.getDesignerName() ?? Lang_Constants.UndefinedError);

        this._layoutName.arrangeItems();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setSelectedIndex(openData.index);
    }

    private _onTouchedImgSelected(e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>): void {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        const mapEditorData = openData.mapEditorData;
        Helpers_GameFlow.gotoMapEditorWar({
            mapRawData                : openData.mapRawData,
            slotIndex                 : mapEditorData.getSlotIndex(),
            isReview                  : true,
            srcNormalMapIdForAddEvent : mapEditorData.getSrcNormalMapIdForAddEvent() ?? null,
            gridMarkData              : null,
        });
    }
    private _onTouchedBtnDesigner(e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>): void {
        e.stopPropagation();

        const userId = this.getOpenData()?.mapRawData.getDesignerUserId();
        if (userId != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, { userId : userId });
        }
    }
}
