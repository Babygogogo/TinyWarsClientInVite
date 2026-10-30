import { getDict } from "../../gamePanels/Dict.ts";
import {
    openPanel,
    closePanel,
} from "../../gamePanels/Manager.ts";
import { getSkinCircle } from "../../helpers/ImageSource.ts";
import { TextType } from "../../lang/Constants.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

export interface OpenData {
    currentSkinId           : number | null;
    availableSkinIdArray    : number[];
    getHelpText?            : () => string;
    callback                : (skinId: number) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnHelp!          : IUiButton;
    private readonly _btnClose!         : IUiButton;
    private readonly _labelTips!        : IUiLabel;

    private readonly _list!             : IUiScrollList<DataForItemRenderer>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,   callback: this.closePanel },
            { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._list.setItemRendererClass(ItemRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._list.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnHelp(): void {
        const func = this.getOpenData()?.getHelpText;
        const text  = func ? func() : null;
        if (text) {
            openPanel(getDict().CommonHelpPanel, {
                getContent : () => text,
            });
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
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

        const dataArray     = this._createDataForList();
        const list          = this._list;
        const skinId        = openData.currentSkinId;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(dataArray.findIndex(v => v.skinId === skinId));
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0573);
        this._labelTips.setLangText(TextType.B1249);
    }

    private _createDataForList(): DataForItemRenderer[] {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const callback  = openData.callback;
        const dataArray : DataForItemRenderer[] = [];
        for (const skinId of openData.availableSkinIdArray) {
            dataArray.push({
                skinId      : skinId,
                callback    : callback,
            });
        }

        return dataArray;
    }
}

interface DataForItemRenderer extends UiListItemData {
    skinId      : number;
    callback    : (skinId: number) => void;
}
class ItemRenderer extends UiListItemRenderer<DataForItemRenderer> {
    private readonly _group!        : IUiContainer;
    private readonly _imgBg!        : IUiImage;
    private readonly _imgSelected!  : IUiImage;
    private readonly _imgConfirm!   : IUiImage;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._imgConfirm,  callback: this._onTouchedImgConfirm },
        ]);
        this._applySettingsForWholeTouch(true, true);

        this._imgConfirm.setIsTouchEnabled(true);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedImgConfirm(e: Event): void {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonConfirm01);
        openData.callback(openData.skinId);
        closePanel(getDict().CommonChooseSingleSkinIdPanel);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const skinId = this.getOpenData()?.skinId;
        if (skinId == null) {
            return;
        }

        this._imgBg.loadSource(getSkinCircle(skinId, false));
        this._imgSelected.loadSource(getSkinCircle(skinId, true));
    }
}
