import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcMap from "../../gameConfig/GcMap.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MapEditorModelMeModel from "../../mapEditor/model/MeModel.ts";
import * as MapsUtilsMapRawData from "../../maps/utils/MapRawData.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
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

export interface OpenData {
    currentSlotIndex        : number;
    needConfirmOverwrite    : boolean;
    needNonEmptySlot        : boolean;
    allowPlay?              : boolean;
    getTitleText?           : (() => string) | null;
    getHelpText             : (() => string) | null;
    callback                : (slotIndex: number) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelp!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTips!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _listSlot!         : UiInterfacesIUiScrollList.IUiScrollList<DataForSlotRenderer>;
    private readonly _labelNoData!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupZoomMap!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _zoomMap!          : UiInterfacesIUiZoomableMap.IUiZoomableMap;

    private _slotIndexForShowMap        = -1;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnHelp,                callback: this._onTouchedBtnHelp },
            { ui: this._zoomMap,                callback: this._onTouchedGroupZoomMap },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listSlot.setItemRendererClass(SlotRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._slotIndexForShowMap = -1;
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listSlot.removeAllItems();

        await super._onClosed();
    }

    public async showMap(slotIndex: number): Promise<void> {
        if (slotIndex === this._slotIndexForShowMap) {
            return;
        }
        this._slotIndexForShowMap = slotIndex;

        const zoomMap       = this._zoomMap;
        const labelNoData   = this._labelNoData;
        const mapData       = slotIndex == null ? null : (await MapEditorModelMeModel.getMapEditorData(slotIndex))?.mapRawData;
        if (!mapData) {
            labelNoData.setIsVisible(true);
            zoomMap.setIsVisible(false);
            zoomMap.clearMap();

        } else {
            labelNoData.setIsVisible(false);
            zoomMap.setIsVisible(true);
            zoomMap.showMapByMapData({
                mapRawData          : mapData,
                gameConfig          : await GameConfigGcModel.getLatestGameConfig(),
                overridingPlayers   : null,
            });
        }
    }

    public async updateOnSelectedData(slotIndex: number): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const isEmptySlot = (await MapEditorModelMeModel.getMapEditorData(slotIndex))?.mapRawData == null;
        if ((openData.needNonEmptySlot) && (isEmptySlot)) {
            FloatText2.showLang(LangConstants.TextType.A0442);
            return;
        }

        const callback  = () => {
            openData.callback(slotIndex);
            GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonChooseSingleMapEditorSlotPanel);
        };
        if ((!openData.needConfirmOverwrite) || (isEmptySlot)) {
            callback();
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent     : () => LangUtils.getText(LangConstants.TextType.A0070),
                callback    : callback,
            });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnHelp(): void {
        const callback = this.getOpenData()?.getHelpText;
        if (callback) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getContent : () => callback(),
            });
        }
    }

    private async _onTouchedGroupZoomMap(): Promise<void> {
        const mapRawData = (await MapEditorModelMeModel.getMapEditorData(this._slotIndexForShowMap))?.mapRawData;
        if (mapRawData) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowMapPanel, {
                mapInfo : {
                    mapRawData          : mapRawData,
                    gameConfig          : await GameConfigGcModel.getLatestGameConfig(),
                    overridingPlayers   : null,
                },
            });
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._btnHelp.setIsVisible(!!openData.getHelpText);

        const list      = this._listSlot;
        const slotIndex = openData.currentSlotIndex;
        await list.bindData(await this._createDataForList());
        list.setSelectedItemIndex(slotIndex);
        list.scrollToItem(slotIndex);

        this.showMap(slotIndex);
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(this.getOpenData()?.getTitleText?.() ?? LangUtils.getText(LangConstants.TextType.B1256));
        this._labelNoData.setLangText(LangConstants.TextType.B0278);
        this._labelTips.setLangText(LangConstants.TextType.B1249);
    }

    private async _createDataForList(): Promise<DataForSlotRenderer[]> {
        const maxSlotsCount = MapEditorModelMeModel.getMaxSlotsCount();
        const allowPlay     = !!this.getOpenData()?.allowPlay;
        const dataArray     : DataForSlotRenderer[] = [];
        for (let slotIndex = 0; slotIndex < maxSlotsCount; ++slotIndex) {
            dataArray.push({
                slotIndex   : slotIndex,
                allowPlay   : allowPlay,
                panel       : this,
            });
        }

        return dataArray;
    }
}

interface DataForSlotRenderer extends UiTypesUiListItemData.UiListItemData {
    slotIndex   : number;
    allowPlay   : boolean;
    panel       : Panel;
}
class SlotRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForSlotRenderer> {
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgSelected!      : UiInterfacesIUiImage.IUiImage;
    private readonly _btnPlay!          : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutName!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelSlotIndex!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMapName!     : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._imgSelected,    callback: this._onTouchedImgSelected },
            { ui: this._btnPlay,        callback: this._onTouchedBtnPlay },
        ]);
        this._setShortSfxCode(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        this.setIsTouchEnabled(true);
        this.setMouseStyle(HelpersPointerInput.MouseStyleType.Pointer);
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
        TweenExecutor.Executor.removeTweens(this._imgSelected);
        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedImgSelected(): void {
        const openData = this.getOpenData();
        openData?.panel.updateOnSelectedData(openData.slotIndex);
    }
    private async _onTouchedBtnPlay(e: VendorEgretEgret.Event): Promise<void> {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const mapEditorData = await MapEditorModelMeModel.getMapEditorData(openData.slotIndex);
        const mapRawData    = mapEditorData?.mapRawData;
        if (mapRawData == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            availableNumberArray    : [1, 2],
            currentNumber           : 1,
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B0401),
            getNumberMainText       : num => {
                switch (num) {
                    case 1  : return LangUtils.getText(LangConstants.TextType.B0325);
                    case 2  : return LangUtils.getText(LangConstants.TextType.B0557);
                    default : throw HelpersMisc.newError(`Invalid num: ${num}`);
                }
            },
            callbackOnConfirm       : num => {
                switch (num) {
                    case 1  : return HelpersGameFlow.checkAndCreateSimulation(mapRawData, mapEditorData?.gridMarkData);
                    case 2  : return HelpersGameFlow.checkAndCreateMultiFreeWar(mapRawData);
                    default : throw HelpersMisc.newError(`Invalid num: ${num}`);
                }
            },
        });
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.showMap(openData.slotIndex);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        const btnPlay = this._btnPlay;
        btnPlay.setIsVisible(false);

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const slotIndex     = openData.slotIndex;
        const mapEditorData = await MapEditorModelMeModel.getMapEditorData(slotIndex);
        if (slotIndex !== this.getOpenData()?.slotIndex) {
            return;
        }

        const mapRawData = mapEditorData?.mapRawData;
        if ((mapRawData) && (openData.allowPlay)) {
            const errorCode = await MapsUtilsMapRawData.getErrorCode({
                mapRawData                          : mapRawData,
                allowRedundantWarEvents             : false,
                allowRedundantMapSimpleDialogues    : false,
            });
            if (slotIndex !== this.getOpenData()?.slotIndex) {
                return;
            }

            btnPlay.setIsVisible(!errorCode);
        }

        const status            = mapEditorData?.reviewStatus ?? 0;
        const labelSlotIndex    = this._labelSlotIndex;
        labelSlotIndex.setTextColor(getReviewStatusTextColor(status));
        this._labelMapName.setText(LangUtils.getLanguageText({ textArray: mapRawData ? mapRawData.getMapNameArray() : [] }) || `(${LangUtils.getText(LangConstants.TextType.B0277)})`);

        const srcNormalMapIdForAddEvent = mapEditorData?.srcNormalMapIdForAddEvent;
        if (srcNormalMapIdForAddEvent != null) {
            labelSlotIndex.setText(`#${slotIndex} ${LangUtils.getText(LangConstants.TextType.B1006)} #${srcNormalMapIdForAddEvent}`);
        } else {
            const campaignMapData = mapRawData?.getCampaignMapData();
            if (campaignMapData == null) {
                labelSlotIndex.setText(`#${slotIndex} ${LangUtils.getMapReviewStatusText(status) ?? LangConstants.UndefinedError}`);
            } else {
                labelSlotIndex.setText(`#${slotIndex} ${LangUtils.getText(LangConstants.TextType.B1135)} ${campaignMapData.getCampaignId() ?? 0}-${campaignMapData.getCampaignMapId() ?? 0}`);
            }
        }
        this._layoutName.arrangeItems();
    }
}

function getReviewStatusTextColor(status: GameConfigGcMap.ReviewStatus): number {
    switch (status) {
        case GameConfigGcMap.ReviewStatus.None       : return 0xc9d3df;
        case GameConfigGcMap.ReviewStatus.Reviewing  : return 0xffff00;
        case GameConfigGcMap.ReviewStatus.Rejected   : return 0xff0000;
        case GameConfigGcMap.ReviewStatus.Accepted   : return 0x00ff00;
        default                         : return 0xffffff;
    }
}
