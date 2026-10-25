import { showLang } from "../../FloatText.ts";
import { ReviewStatus } from "../../gameConfig/GcMap.ts";
import { getLatestGameConfig } from "../../gameConfig/GcModel.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { closePanel, openPanel } from "../../gamePanels/Manager.ts";
import { checkAndCreateSimulation, checkAndCreateMultiFreeWar } from "../../helpers/GameFlow.ts";
import { newError } from "../../helpers/Misc.ts";
import { MouseStyleType } from "../../helpers/PointerInput.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getLanguageText, getMapReviewStatusText } from "../../lang/Utils.ts";
import { getMapEditorData, getMaxSlotsCount } from "../../mapEditor/model/MeModel.ts";
import { getErrorCode } from "../../maps/utils/MapRawData.ts";
import { TypeId } from "../../notifications/TypeId.ts";
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

export interface OpenData {
    currentSlotIndex        : number;
    needConfirmOverwrite    : boolean;
    needNonEmptySlot        : boolean;
    allowPlay?              : boolean;
    getTitleText?           : (() => string) | null;
    getHelpText             : (() => string) | null;
    callback                : (slotIndex: number) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnHelp!          : IUiButton;
    private readonly _btnClose!         : IUiButton;
    private readonly _labelTips!        : IUiLabel;

    private readonly _listSlot!         : IUiScrollList<DataForSlotRenderer>;
    private readonly _labelNoData!      : IUiLabel;

    private readonly _groupZoomMap!     : IUiContainer;
    private readonly _zoomMap!          : IUiZoomableMap;

    private _slotIndexForShowMap        = -1;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
        const mapData       = slotIndex == null ? null : (await getMapEditorData(slotIndex))?.mapRawData;
        if (!mapData) {
            labelNoData.setIsVisible(true);
            zoomMap.setIsVisible(false);
            zoomMap.clearMap();

        } else {
            labelNoData.setIsVisible(false);
            zoomMap.setIsVisible(true);
            zoomMap.showMapByMapData({
                mapRawData          : mapData,
                gameConfig          : await getLatestGameConfig(),
                overridingPlayers   : null,
            });
        }
    }

    public async updateOnSelectedData(slotIndex: number): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const isEmptySlot = (await getMapEditorData(slotIndex))?.mapRawData == null;
        if ((openData.needNonEmptySlot) && (isEmptySlot)) {
            showLang(TextType.A0442);
            return;
        }

        const callback  = () => {
            openData.callback(slotIndex);
            closePanel(getDict().CommonChooseSingleMapEditorSlotPanel);
        };
        if ((!openData.needConfirmOverwrite) || (isEmptySlot)) {
            callback();
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent     : () => getText(TextType.A0070),
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
            openPanel(getDict().CommonHelpPanel, {
                getContent : () => callback(),
            });
        }
    }

    private async _onTouchedGroupZoomMap(): Promise<void> {
        const mapRawData = (await getMapEditorData(this._slotIndexForShowMap))?.mapRawData;
        if (mapRawData) {
            openPanel(getDict().CommonShowMapPanel, {
                mapInfo : {
                    mapRawData          : mapRawData,
                    gameConfig          : await getLatestGameConfig(),
                    overridingPlayers   : null,
                },
            });
            playShortSfx(ShortSfxCode.ButtonNeutral01);
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
        this._labelTitle.setText(this.getOpenData()?.getTitleText?.() ?? getText(TextType.B1256));
        this._labelNoData.setLangText(TextType.B0278);
        this._labelTips.setLangText(TextType.B1249);
    }

    private async _createDataForList(): Promise<DataForSlotRenderer[]> {
        const maxSlotsCount = getMaxSlotsCount();
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

interface DataForSlotRenderer extends UiListItemData {
    slotIndex   : number;
    allowPlay   : boolean;
    panel       : Panel;
}
class SlotRenderer extends UiListItemRenderer<DataForSlotRenderer> {
    private readonly _group!            : IUiContainer;
    private readonly _imgSelected!      : IUiImage;
    private readonly _btnPlay!          : IUiButton;

    private readonly _layoutName!       : IUiLayout;
    private readonly _labelSlotIndex!   : IUiLabel;
    private readonly _labelMapName!     : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._imgSelected,    callback: this._onTouchedImgSelected },
            { ui: this._btnPlay,        callback: this._onTouchedBtnPlay },
        ]);
        this._setShortSfxCode(ShortSfxCode.ButtonNeutral01);
        this.setIsTouchEnabled(true);
        this.setMouseStyle(MouseStyleType.Pointer);
    }
    protected override async _onOpened(): Promise<void> {
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
        this._updateView();
    }

    private _onTouchedImgSelected(): void {
        const openData = this.getOpenData();
        openData?.panel.updateOnSelectedData(openData.slotIndex);
    }
    private async _onTouchedBtnPlay(e: Event): Promise<void> {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const mapEditorData = await getMapEditorData(openData.slotIndex);
        const mapRawData    = mapEditorData?.mapRawData;
        if (mapRawData == null) {
            return;
        }

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            availableNumberArray    : [1, 2],
            currentNumber           : 1,
            getTitleText            : () => getText(TextType.B0401),
            getNumberMainText       : num => {
                switch (num) {
                    case 1  : return getText(TextType.B0325);
                    case 2  : return getText(TextType.B0557);
                    default : throw newError(`Invalid num: ${num}`);
                }
            },
            callbackOnConfirm       : num => {
                switch (num) {
                    case 1  : return checkAndCreateSimulation(mapRawData, mapEditorData?.gridMarkData);
                    case 2  : return checkAndCreateMultiFreeWar(mapRawData);
                    default : throw newError(`Invalid num: ${num}`);
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
        const mapEditorData = await getMapEditorData(slotIndex);
        if (slotIndex !== this.getOpenData()?.slotIndex) {
            return;
        }

        const mapRawData = mapEditorData?.mapRawData;
        if ((mapRawData) && (openData.allowPlay)) {
            const errorCode = await getErrorCode({
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
        this._labelMapName.setText(getLanguageText({ textArray: mapRawData ? mapRawData.getMapNameArray() : [] }) || `(${getText(TextType.B0277)})`);

        const srcNormalMapIdForAddEvent = mapEditorData?.srcNormalMapIdForAddEvent;
        if (srcNormalMapIdForAddEvent != null) {
            labelSlotIndex.setText(`#${slotIndex} ${getText(TextType.B1006)} #${srcNormalMapIdForAddEvent}`);
        } else {
            const campaignMapData = mapRawData?.getCampaignMapData();
            if (campaignMapData == null) {
                labelSlotIndex.setText(`#${slotIndex} ${getMapReviewStatusText(status) ?? UndefinedError}`);
            } else {
                labelSlotIndex.setText(`#${slotIndex} ${getText(TextType.B1135)} ${campaignMapData.getCampaignId() ?? 0}-${campaignMapData.getCampaignMapId() ?? 0}`);
            }
        }
        this._layoutName.arrangeItems();
    }
}

function getReviewStatusTextColor(status: ReviewStatus): number {
    switch (status) {
        case ReviewStatus.None       : return 0xc9d3df;
        case ReviewStatus.Reviewing  : return 0xffff00;
        case ReviewStatus.Rejected   : return 0xff0000;
        case ReviewStatus.Accepted   : return 0x00ff00;
        default                         : return 0xffffff;
    }
}
