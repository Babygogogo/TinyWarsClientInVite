import { getDict } from "../../gamePanels/Dict.ts";
import {
    closePanel,
    openPanel,
} from "../../gamePanels/Manager.ts";
import { getWarTypeId } from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getText,
    getTimestampShortText,
    getWarTypeName,
} from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import {
    getSlotFullData,
    getSlotName,
} from "../../singlePlayerMode/model/SpmModel.ts";
import { Common as SinglePlayerWarsCommon } from "../../singlePlayerWars/Constants.ts";
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
import type { Event } from "../../egret/Egret.ts";
import { getItemRendererBackground } from "../../warTypes/Utils.ts";

export interface OpenData {
    currentSlotIndex        : number;
    needComment             : boolean;
    needConfirmOverwrite    : boolean;
    needNonEmptyData?       : boolean;
    getHelpText?            : () => string;
    callback                : (slotIndex: number, comment: string | null) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnClose!         : IUiButton;
    private readonly _btnHelp!          : IUiButton;
    private readonly _labelTips!        : IUiLabel;

    private readonly _srlSaveSlot!      : IUiScrollList<DataForSlotRenderer>;
    private readonly _labelNoData!      : IUiLabel;

    private readonly _groupZoomMap!     : IUiContainer;
    private readonly _zoomMap!          : IUiZoomableMap;

    private _selectedSlotIndex        = -1;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnClose,               callback : this.closePanel },
            { ui : this._btnHelp,                callback : this._onTouchedBtnHelp },
            { ui : this._groupZoomMap,           callback : this._onTouchedGroupZoomMap },
        ]);
        this._setNotifyListenerArray([
            { type : TypeId.LanguageChanged, callback : this._onNotifyLanguageChanged },
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
            openPanel(getDict().CommonHelpPanel, {
                getContent : () => text,
            });
        }
    }

    private async _onTouchedGroupZoomMap(): Promise<void> {
        const warData = (await getSlotFullData(this._selectedSlotIndex))?.warData;
        if (warData) {
            openPanel(getDict().CommonShowMapPanel, {
                warInfo : {
                    warData            : warData,
                    showInitialWarData : true,
                    overridingPlayers  : warData.getPlayerManager()?.getPlayers(),
                },
            });
            playShortSfx(ShortSfxCode.ButtonNeutral01);
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
        list.scrollToItem(slotIndex >= SinglePlayerWarsCommon.MaxSaveSlotCount / 2 ? 100 : 0);

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

        const warData = (await getSlotFullData(slotIndex))?.warData;
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
        this._labelTitle.setLangText(TextType.B0259);
        this._labelNoData.setLangText(TextType.B0278);
        this._labelTips.setLangText(TextType.B1249);
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
        for (let slotIndex = 0; slotIndex < SinglePlayerWarsCommon.MaxSaveSlotCount; ++slotIndex) {
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

interface DataForSlotRenderer extends UiListItemData {
    slotIndex               : number;
    needComment             : boolean;
    needConfirmOverwrite    : boolean;
    needNonEmptyData        : boolean;
    panel                   : Panel;
    callback                : (slotIndex: number, comment: string | null) => void;
}
class SlotRenderer extends UiListItemRenderer<DataForSlotRenderer> {
    private readonly _group!            : IUiContainer;
    private readonly _imgBg!            : IUiImage;
    private readonly _imgSelected!      : IUiImage;

    private readonly _layoutName!       : IUiLayout;
    private readonly _labelSlotIndex!   : IUiLabel;
    private readonly _labelTimestamp!   : IUiLabel;
    private readonly _labelMapName!     : IUiLabel;

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
        Executor.removeTweens(imgSelected);
        Executor.get(imgSelected, { loop : true })
            .to({ customAlpha : 0.6 }, 500)
            .to({ customAlpha : 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Executor.removeTweens(this._imgSelected);
        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.showMap(openData.slotIndex);
    }

    private async _onTouchedImgSelected(e: Event): Promise<void> {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const slotData  = await getSlotFullData(openData.slotIndex);
        if ((slotData == null) && (openData.needNonEmptyData)) {
            return;
        }

        const callback  = () => {
            if (!openData.needComment) {
                openData.callback(openData.slotIndex, null);
                closePanel(getDict().CommonChooseSingleSpmSaveSlotPanel);
            } else {
                openPanel(getDict().CommonInputPanel, {
                    title        : getText(TextType.B0088),
                    maxChars     : SinglePlayerWarsCommon.MaxSaveSlotCommentLength,
                    currentValue : ``,
                    tips         : getText(TextType.A0144),
                    canBeEmpty   : true,
                    charRestrict : null,
                    callback     : panel => {
                        openData.callback(openData.slotIndex, panel.getInputText());
                        closePanel(getDict().CommonChooseSingleSpmSaveSlotPanel);
                    }
                });
            }
        };
        playShortSfx(ShortSfxCode.ButtonConfirm01);
        if ((!openData.needConfirmOverwrite) || (slotData == null)) {
            callback();
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getText(TextType.A0070),
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

        const slotInfo = await getSlotFullData(slotIndex);
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
            const warType       = getWarTypeId(warData);
            labelSlotIndex.setText(`#${slotIndex} ${getWarTypeName(warType)}`);
            imgBg.loadSource(getItemRendererBackground(warType));

            const slotExtraData = slotInfo.extraData;
            const timestamp     = slotExtraData.getTimestamp();
            labelTimestamp.setText(timestamp == null ? `` : getTimestampShortText(timestamp));

            const slotName = await getSlotName(slotIndex);
            if (slotIndex === this.getOpenData()?.slotIndex) {
                labelMapName.setText(slotName);
            }
        }
        this._layoutName.arrangeItems();
    }
}
