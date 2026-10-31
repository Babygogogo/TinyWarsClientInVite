import {
    type Helpers_PointerInput,
    GamePanels_Manager,
    Tween_Executor,
    GamePanels_Dict,
    WarTypes_Utils,
    SinglePlayerMode_Model_SpmModel,
    Lang_Utils,
    Helpers_ProtoSchema_WarSerialization_SerialWar,
    Sounds_SoundPlayer,
    Sounds_Constants,
    SinglePlayerWars_Constants,
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

export interface OpenData {
    currentSlotIndex        : number;
    needComment             : boolean;
    needConfirmOverwrite    : boolean;
    needNonEmptyData?       : boolean;
    getHelpText?            : () => string;
    callback                : (slotIndex: number, comment: string | null) => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelp!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTips!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _srlSaveSlot!      : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForSlotRenderer>;
    private readonly _labelNoData!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupZoomMap!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _zoomMap!          : Ui_Interfaces_IUiZoomableMap.IUiZoomableMap;

    private _selectedSlotIndex        = -1;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnClose,               callback : this.closePanel },
            { ui : this._btnHelp,                callback : this._onTouchedBtnHelp },
            { ui : this._groupZoomMap,           callback : this._onTouchedGroupZoomMap },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged", callback : this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._srlSaveSlot.setItemRendererClass(SlotRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateOnOpenDataChanged();
    }
    protected override async _onClosed(): Promise<void> {
        await this._srlSaveSlot.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnHelp(): void {
        const func  = this.getOpenData()?.getHelpText;
        const text  = func ? func() : null;
        if (text) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getContent : () => text,
            });
        }
    }

    private async _onTouchedGroupZoomMap(): Promise<void> {
        const warData = (await SinglePlayerMode_Model_SpmModel.getSlotFullData(this._selectedSlotIndex))?.warData;
        if (warData) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonShowMapPanel, {
                warInfo : {
                    warData            : warData,
                    showInitialWarData : true,
                    overridingPlayers  : warData.getPlayerManager()?.getPlayers(),
                },
            });
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateOnOpenDataChanged(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._selectedSlotIndex = -1;
        this._btnHelp.setIsVisible(!!openData.getHelpText);

        const slotIndex = openData.currentSlotIndex;
        const list      = this._srlSaveSlot;
        await list.bindData(this._createDataForList());
        list.setSelectedItemIndex(slotIndex);
        list.scrollToItem(slotIndex >= SinglePlayerWars_Constants.Common.MaxSaveSlotCount / 2 ? 100 : 0);

        await this.showMap(slotIndex);
    }

    public async showMap(slotIndex: number): Promise<void> {
        if (slotIndex === this._selectedSlotIndex) {
            return;
        }
        this._selectedSlotIndex = slotIndex;

        const zoomMap       = this._zoomMap;
        const labelNoData   = this._labelNoData;
        if (slotIndex == null) {
            labelNoData.setIsVisible(true);
            zoomMap.setIsVisible(false);
            zoomMap.clearMap();
            return;
        }
        labelNoData.setIsVisible(false);

        const warData = (await SinglePlayerMode_Model_SpmModel.getSlotFullData(slotIndex))?.warData;
        if (slotIndex !== this._selectedSlotIndex) {
            return;
        }

        if (warData == null) {
            labelNoData.setIsVisible(true);
            zoomMap.setIsVisible(false);
            zoomMap.clearMap();
        } else {
            labelNoData.setIsVisible(false);
            zoomMap.setIsVisible(true);
            await zoomMap.showMapByWarData({
                warData            : warData,
                showInitialWarData : true,
                overridingPlayers  : warData.getPlayerManager()?.getPlayers(),
            });
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B0259);
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
        this._labelTips.setLangText(Lang_Constants.TextType.B1249);
    }

    private _createDataForList(): DataForSlotRenderer[] {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const callback              = openData.callback;
        const needComment           = openData.needComment;
        const needConfirmOverwrite  = openData.needConfirmOverwrite;
        const needNonEmptyData      = openData.needNonEmptyData ?? false;
        const dataArray             : DataForSlotRenderer[] = [];
        for (let slotIndex = 0; slotIndex < SinglePlayerWars_Constants.Common.MaxSaveSlotCount; ++slotIndex) {
            dataArray.push({
                slotIndex            : slotIndex,
                needComment          : needComment,
                needConfirmOverwrite : needConfirmOverwrite,
                needNonEmptyData     : needNonEmptyData,
                panel                : this,
                callback             : callback,
            });
        }

        return dataArray;
    }
}

interface DataForSlotRenderer extends Ui_Types_UiListItemData.UiListItemData {
    slotIndex               : number;
    needComment             : boolean;
    needConfirmOverwrite    : boolean;
    needNonEmptyData        : boolean;
    panel                   : Panel;
    callback                : (slotIndex: number, comment: string | null) => void;
}
class SlotRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForSlotRenderer> {
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBg!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgSelected!      : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _layoutName!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelSlotIndex!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTimestamp!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapName!     : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._imgSelected,  callback : this._onTouchedImgSelected },
        ]);
        this._applySettingsForWholeTouch(undefined, true);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setIsTouchEnabled(true);
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
        this._updateView();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.showMap(openData.slotIndex);
    }

    private async _onTouchedImgSelected(e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>): Promise<void> {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const slotData  = await SinglePlayerMode_Model_SpmModel.getSlotFullData(openData.slotIndex);
        if ((slotData == null) && (openData.needNonEmptyData)) {
            return;
        }

        const callback  = () => {
            if (!openData.needComment) {
                openData.callback(openData.slotIndex, null);
                GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonChooseSingleSpmSaveSlotPanel);
            } else {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
                    title        : Lang_Utils.getText(Lang_Constants.TextType.B0088),
                    maxChars     : SinglePlayerWars_Constants.Common.MaxSaveSlotCommentLength,
                    currentValue : ``,
                    tips         : Lang_Utils.getText(Lang_Constants.TextType.A0144),
                    canBeEmpty   : true,
                    charRestrict : null,
                    callback     : panel => {
                        openData.callback(openData.slotIndex, panel.getInputText());
                        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonChooseSingleSpmSaveSlotPanel);
                    },
                });
            }
        };
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonConfirm01);
        if ((!openData.needConfirmOverwrite) || (slotData == null)) {
            callback();
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0070),
                callback   : callback,
            });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        const slotIndex = this.getOpenData()?.slotIndex;
        if (slotIndex == null) {
            return;
        }

        const slotInfo = await SinglePlayerMode_Model_SpmModel.getSlotFullData(slotIndex);
        if (slotIndex !== this.getOpenData()?.slotIndex) {
            return;
        }

        const labelSlotIndex    = this._labelSlotIndex;
        const labelTimestamp    = this._labelTimestamp;
        const labelMapName      = this._labelMapName;
        const imgBg             = this._imgBg;
        if (slotInfo == null) {
            labelSlotIndex.setText(`#${slotIndex}`);
            labelTimestamp.setText(``);
            labelMapName.setText(`----`);
            imgBg.loadSource(`uncompressedRectangle0016`);
        } else {
            const warData       = slotInfo.warData;
            const warType       = Helpers_ProtoSchema_WarSerialization_SerialWar.getWarTypeId(warData);
            labelSlotIndex.setText(`#${slotIndex} ${Lang_Utils.getWarTypeName(warType)}`);
            imgBg.loadSource(WarTypes_Utils.getItemRendererBackground(warType));

            const slotExtraData = slotInfo.extraData;
            const timestamp     = slotExtraData.getTimestamp();
            labelTimestamp.setText(timestamp == null ? `` : Lang_Utils.getTimestampShortText(timestamp));

            const slotName = await SinglePlayerMode_Model_SpmModel.getSlotName(slotIndex);
            if (slotIndex === this.getOpenData()?.slotIndex) {
                labelMapName.setText(slotName);
            }
        }
        this._layoutName.arrangeItems();
    }
}
