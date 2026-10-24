import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersProtoSchemaWarSerializationSerialWar from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SinglePlayerModeModelSpmModel from "../../singlePlayerMode/model/SpmModel.ts";
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
import * as WarTypesUtils from "../../warTypes/Utils.ts";

export interface OpenData {
    currentSlotIndex        : number;
    needComment             : boolean;
    needConfirmOverwrite    : boolean;
    needNonEmptyData?       : boolean;
    getHelpText?            : () => string;
    callback                : (slotIndex: number, comment: string | null) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelp!          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTips!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _srlSaveSlot!      : UiInterfacesIUiScrollList.IUiScrollList<DataForSlotRenderer>;
    private readonly _labelNoData!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupZoomMap!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _zoomMap!          : UiInterfacesIUiZoomableMap.IUiZoomableMap;

    private _selectedSlotIndex        = -1;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnHelp,                callback: this._onTouchedBtnHelp },
            { ui: this._groupZoomMap,           callback: this._onTouchedGroupZoomMap },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getContent : () => text,
            });
        }
    }

    private async _onTouchedGroupZoomMap(): Promise<void> {
        const warData = (await SinglePlayerModeModelSpmModel.getSlotFullData(this._selectedSlotIndex))?.warData;
        if (warData) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowMapPanel, {
                warInfo : {
                    warData             : warData,
                    showInitialWarData  : true,
                    overridingPlayers   : warData.getPlayerManager()?.getPlayers(),
                },
            });
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
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
        list.scrollToItem(slotIndex >= GameConfigGcWar.SinglePlayerWar.MaxSaveSlotCount / 2 ? 100 : 0);

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

        const warData = (await SinglePlayerModeModelSpmModel.getSlotFullData(slotIndex))?.warData;
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
                warData             : warData,
                showInitialWarData  : true,
                overridingPlayers   : warData.getPlayerManager()?.getPlayers(),
            });
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0259));
        this._labelNoData.setText(LangUtils.getText(LangConstants.TextType.B0278));
        this._labelTips.setText(LangUtils.getText(LangConstants.TextType.B1249));
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
        for (let slotIndex = 0; slotIndex < GameConfigGcWar.SinglePlayerWar.MaxSaveSlotCount; ++slotIndex) {
            dataArray.push({
                slotIndex               : slotIndex,
                needComment             : needComment,
                needConfirmOverwrite    : needConfirmOverwrite,
                needNonEmptyData        : needNonEmptyData,
                panel                   : this,
                callback                : callback,
            });
        }

        return dataArray;
    }
}

interface DataForSlotRenderer extends UiTypesUiListItemData.UiListItemData {
    slotIndex               : number;
    needComment             : boolean;
    needConfirmOverwrite    : boolean;
    needNonEmptyData        : boolean;
    panel                   : Panel;
    callback                : (slotIndex: number, comment: string | null) => void;
}
class SlotRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForSlotRenderer> {
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBg!            : UiInterfacesIUiImage.IUiImage;
    private readonly _imgSelected!      : UiInterfacesIUiImage.IUiImage;

    private readonly _layoutName!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelSlotIndex!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTimestamp!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMapName!     : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._imgSelected,  callback: this._onTouchedImgSelected },
        ]);
        this._applySettingsForWholeTouch(undefined, true);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setIsTouchEnabled(true);
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

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.showMap(openData.slotIndex);
    }

    private async _onTouchedImgSelected(e: VendorEgretEgret.Event): Promise<void> {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const slotData  = await SinglePlayerModeModelSpmModel.getSlotFullData(openData.slotIndex);
        if ((slotData == null) && (openData.needNonEmptyData)) {
            return;
        }

        const callback  = () => {
            if (!openData.needComment) {
                openData.callback(openData.slotIndex, null);
                GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonChooseSingleSpmSaveSlotPanel);
            } else {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
                    title           : LangUtils.getText(LangConstants.TextType.B0088),
                    maxChars        : GameConfigGcWar.SinglePlayerWar.MaxSaveSlotCommentLength,
                    currentValue    : ``,
                    tips            : LangUtils.getText(LangConstants.TextType.A0144),
                    canBeEmpty      : true,
                    charRestrict    : null,
                    callback        : panel => {
                        openData.callback(openData.slotIndex, panel.getInputText());
                        GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonChooseSingleSpmSaveSlotPanel);
                    }
                });
            }
        };
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonConfirm01);
        if ((!openData.needConfirmOverwrite) || (slotData == null)) {
            callback();
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent  : () => LangUtils.getText(LangConstants.TextType.A0070),
                callback    : callback,
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

        const slotInfo = await SinglePlayerModeModelSpmModel.getSlotFullData(slotIndex);
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
            const warType       = HelpersProtoSchemaWarSerializationSerialWar.getWarTypeId(warData);
            labelSlotIndex.setText(`#${slotIndex} ${LangUtils.getWarTypeName(warType)}`);
            imgBg.loadSource(WarTypesUtils.getItemRendererBackground(warType));

            const slotExtraData = slotInfo.extraData;
            const timestamp     = slotExtraData.getTimestamp();
            labelTimestamp.setText(timestamp == null ? `` : LangUtils.getTimestampShortText(timestamp));

            const slotName = await SinglePlayerModeModelSpmModel.getSlotName(slotIndex);
            if (slotIndex === this.getOpenData()?.slotIndex) {
                labelMapName.setText(slotName);
            }
        }
        this._layoutName.arrangeItems();
    }
}
