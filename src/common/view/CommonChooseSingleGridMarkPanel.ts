import { getDict } from "../../gamePanels/Dict.ts";
import {
    openPanel,
    closePanel,
} from "../../gamePanels/Manager.ts";
import { AllGridMarkTypeId } from "../../gridMarks/Constants.ts";
import { getGridMark } from "../../helpers/ImageSource.ts";
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
import type { Event } from "../../egret/Egret.ts";

export interface OpenData {
    currentMarkTypeId       : number | null;
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
        const skinId        = openData.currentMarkTypeId;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(dataArray.findIndex(v => v.markTypeId === skinId));
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0914);
        this._labelTips.setLangText(TextType.B1249);
    }

    private _createDataForList(): DataForItemRenderer[] {
        const openData = this.getOpenData();
        if (openData == null) {
            return [];
        }

        const callback  = openData.callback;
        const dataArray : DataForItemRenderer[] = [];
        for (const markTypeId of AllGridMarkTypeId) {
            dataArray.push({
                markTypeId  : markTypeId,
                callback    : callback,
            });
        }

        return dataArray;
    }
}

interface DataForItemRenderer extends UiListItemData {
    markTypeId  : number;
    callback    : (skinId: number) => void;
}
class ItemRenderer extends UiListItemRenderer<DataForItemRenderer> {
    private readonly _group!        : IUiContainer;
    private readonly _imgBg!        : IUiImage;
    private readonly _imgSelected!  : IUiImage;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._imgSelected,  callback: this._onTouchedImgSelected },
        ]);
        this._applySettingsForWholeTouch(true, true);

        this._imgSelected.setIsTouchEnabled(true);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedImgSelected(e: Event): void {
        e.stopPropagation();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonConfirm01);
        openData.callback(openData.markTypeId);
        closePanel(getDict().CommonChooseSingleSkinIdPanel);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const markTypeId = this.getOpenData()?.markTypeId;
        if (markTypeId == null) {
            return;
        }

        this._imgBg.loadSource(getGridMark(markTypeId));
    }
}
