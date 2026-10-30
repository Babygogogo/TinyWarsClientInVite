import {
    Helpers_GameFlow,
    GamePanels_Manager,
    Tween_Executor,
    GamePanels_Dict,
    Maps_Utils_MapRawData,
    Lang_Utils,
    GameConfigs_Provider,
    MapEditor_Model_MeModel,
    Helpers_PointerInput,
    Helpers_Misc,
    Sounds_SoundPlayer,
    Maps_Constants,
    Sounds_Constants,
    FloatText,
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
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export interface OpenData {
    currentSlotIndex        : number;
    needConfirmOverwrite    : boolean;
    needNonEmptySlot        : boolean;
    allowPlay?              : boolean;
    getTitleText?           : (() => string) | null;
    getHelpText             : (() => string) | null;
    callback                : (slotIndex: number) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTips!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _listSlot!         : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForSlotRenderer>;
    private readonly _labelNoData!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupZoomMap!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _zoomMap!          : Ui_Interfaces_IUiZoomableMap.IUiZoomableMap;

    private _slotIndexForShowMap        = -1;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
        const mapData       = slotIndex == null ? null : (await MapEditor_Model_MeModel.getMapEditorData(slotIndex))?.mapRawData;
        if (!mapData) {
            labelNoData.setIsVisible(true);
            zoomMap.setIsVisible(false);
            zoomMap.clearMap();

        } else {
            labelNoData.setIsVisible(false);
            zoomMap.setIsVisible(true);
            zoomMap.showMapByMapData({
                mapRawData          : mapData,
                gameConfig          : await GameConfigs_Provider.getLatestGameConfig(),
                overridingPlayers   : null,
            });
        }
    }

    public async updateOnSelectedData(slotIndex: number): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const isEmptySlot = (await MapEditor_Model_MeModel.getMapEditorData(slotIndex))?.mapRawData == null;
        if ((openData.needNonEmptySlot) && (isEmptySlot)) {
            FloatText.showLang(Lang_Constants.TextType.A0442);
            return;
        }

        const callback  = () => {
            openData.callback(slotIndex);
            GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonChooseSingleMapEditorSlotPanel);
        };
        if ((!openData.needConfirmOverwrite) || (isEmptySlot)) {
            callback();
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent     : () => Lang_Utils.getText(Lang_Constants.TextType.A0070),
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
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getContent : () => callback(),
            });
        }
    }

    private async _onTouchedGroupZoomMap(): Promise<void> {
        const mapRawData = (await MapEditor_Model_MeModel.getMapEditorData(this._slotIndexForShowMap))?.mapRawData;
        if (mapRawData) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowMapPanel, {
                mapInfo : {
                    mapRawData          : mapRawData,
                    gameConfig          : await GameConfigs_Provider.getLatestGameConfig(),
                    overridingPlayers   : null,
                },
            });
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
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
        this._labelTitle.setText(this.getOpenData()?.getTitleText?.() ?? Lang_Utils.getText(Lang_Constants.TextType.B1256));
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
        this._labelTips.setLangText(Lang_Constants.TextType.B1249);
    }

    private async _createDataForList(): Promise<DataForSlotRenderer[]> {
        const maxSlotsCount = MapEditor_Model_MeModel.getMaxSlotsCount();
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

interface DataForSlotRenderer extends Ui_Types_UiListItemData.UiListItemData {
    slotIndex   : number;
    allowPlay   : boolean;
    panel       : Panel;
}
class SlotRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForSlotRenderer> {
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgSelected!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _btnPlay!          : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutName!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelSlotIndex!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapName!     : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._imgSelected,    callback: this._onTouchedImgSelected },
            { ui: this._btnPlay,        callback: this._onTouchedBtnPlay },
        ]);
        this._setShortSfxCode(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        this.setIsTouchEnabled(true);
        this.setMouseStyle(Helpers_PointerInput.MouseStyleType.Pointer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Tween_Executor.Executor.removeTweens(imgSelected);
        Tween_Executor.Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Tween_Executor.Executor.removeTweens(this._imgSelected);
        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedImgSelected(): void {
        const openData = this.getOpenData();
        openData?.panel.updateOnSelectedData(openData.slotIndex);
    }
    private async _onTouchedBtnPlay(e: Egret_Egret.Event): Promise<void> {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const mapEditorData = await MapEditor_Model_MeModel.getMapEditorData(openData.slotIndex);
        const mapRawData    = mapEditorData?.mapRawData;
        if (mapRawData == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            availableNumberArray    : [1, 2],
            currentNumber           : 1,
            getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.B0401),
            getNumberMainText       : num => {
                switch (num) {
                    case 1  : return Lang_Utils.getText(Lang_Constants.TextType.B0325);
                    case 2  : return Lang_Utils.getText(Lang_Constants.TextType.B0557);
                    default : throw Helpers_Misc.newError(`Invalid num: ${num}`);
                }
            },
            callbackOnConfirm       : num => {
                switch (num) {
                    case 1  : return Helpers_GameFlow.checkAndCreateSimulation(mapRawData, mapEditorData?.gridMarkData);
                    case 2  : return Helpers_GameFlow.checkAndCreateMultiFreeWar(mapRawData);
                    default : throw Helpers_Misc.newError(`Invalid num: ${num}`);
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
        const mapEditorData = await MapEditor_Model_MeModel.getMapEditorData(slotIndex);
        if (slotIndex !== this.getOpenData()?.slotIndex) {
            return;
        }

        const mapRawData = mapEditorData?.mapRawData;
        if ((mapRawData) && (openData.allowPlay)) {
            const errorCode = await Maps_Utils_MapRawData.getErrorCode({
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
        this._labelMapName.setText(Lang_Utils.getLanguageText({ textArray: mapRawData ? mapRawData.getMapNameArray() : [] }) || `(${Lang_Utils.getText(Lang_Constants.TextType.B0277)})`);

        const srcNormalMapIdForAddEvent = mapEditorData?.srcNormalMapIdForAddEvent;
        if (srcNormalMapIdForAddEvent != null) {
            labelSlotIndex.setText(`#${slotIndex} ${Lang_Utils.getText(Lang_Constants.TextType.B1006)} #${srcNormalMapIdForAddEvent}`);
        } else {
            const campaignMapData = mapRawData?.getCampaignMapData();
            if (campaignMapData == null) {
                labelSlotIndex.setText(`#${slotIndex} ${Lang_Utils.getMapReviewStatusText(status) ?? Lang_Constants.UndefinedError}`);
            } else {
                labelSlotIndex.setText(`#${slotIndex} ${Lang_Utils.getText(Lang_Constants.TextType.B1135)} ${campaignMapData.getCampaignId()}-${campaignMapData.getCampaignMapId()}`);
            }
        }
        this._layoutName.arrangeItems();
    }
}

function getReviewStatusTextColor(status: Maps_Constants.ReviewStatus): number {
    switch (status) {
        case Maps_Constants.ReviewStatus.None       : return 0xc9d3df;
        case Maps_Constants.ReviewStatus.Reviewing  : return 0xffff00;
        case Maps_Constants.ReviewStatus.Rejected   : return 0xff0000;
        case Maps_Constants.ReviewStatus.Accepted   : return 0x00ff00;
        default                         : return 0xffffff;
    }
}
