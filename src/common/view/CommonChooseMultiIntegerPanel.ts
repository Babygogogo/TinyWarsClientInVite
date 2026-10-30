import {
    createRange,
    getNonNullElements,
} from "../../helpers/Collection.ts";
import {
    UndefinedError,
    TextType,
} from "../../lang/Constants.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { Dimension } from "../../stages/Constants.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    currentIntegerArray     : number[];
    availableIntegerArray   : number[];
    getTitleText            : () => string;
    callbackOnConfirm       : (integerArray: number[]) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;

    private readonly _groupSelectAll!       : IUiContainer;
    private readonly _labelSelectAll!       : IUiLabel;
    private readonly _imgSelectAll!         : IUiImage;

    private readonly _layoutSelected!       : IUiLayout;
    private readonly _labelSelectedTitle!   : IUiLabel;
    private readonly _labelSelected!        : IUiLabel;

    private readonly _list!                 : IUiScrollList<DataForIntegerRenderer>;
    private readonly _labelNoData!          : IUiLabel;

    private readonly _btnConfirm!           : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupSelectAll,         callback: this._onTouchedGroupSelectAll },
            { ui: this._btnConfirm,             callback: this._onTouchedBtnConfirm },
            { ui: this._btnClose,               callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._list.setItemRendererClass(IntegerRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateOnOpenDataChanged();
    }
    protected override async _onClosed(): Promise<void> {
        await this._list.removeAllItems();

        await super._onClosed();
    }

    public updateOnSelectInteger(): void {
        this._updateGroupSelectAll();
        this._updateLabelSelected();
    }

    private _onTouchedGroupSelectAll(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const list = this._list;
        list.setSelectedItemIndexes(this._imgSelectAll.getIsVisible()
            ? []
            : createRange(0, list.getBoundDataArray()?.length ?? 0, 1)
        );
        this._updateGroupSelectAll();
        this._updateLabelSelected();
    }
    private _onTouchedBtnConfirm(): void {
        const callback  = this.getOpenData()?.callbackOnConfirm;
        const arr       = getNonNullElements(this._list.getSelectedDataArray()?.map(v => v?.integer) ?? []).sort((v1, v2) => v1 - v2);
        this.closePanel();
        callback?.(arr);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private async _updateOnOpenDataChanged(): Promise<void> {
        this._updateComponentsForLanguage();

        await this._resetList();
        this._updateGroupSelectAll();
        this._updateLabelSelected();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(this.getOpenData()?.getTitleText() ?? UndefinedError);
        this._labelSelectAll.setLangText(TextType.B0761);
        this._labelNoData.setLangText(TextType.B0278);
        this._btnConfirm.setLangText(TextType.B0026);
        this._labelSelectedTitle.setLangText(TextType.B1274);

        this._layoutSelected.arrangeItems();
    }

    private async _resetList(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const dataArray: DataForIntegerRenderer[] = [];
        for (const integer of openData.availableIntegerArray) {
            dataArray.push({
                integer : integer,
                panel   : this,
            });
        }

        const currIntegerArray      = openData.currentIntegerArray;
        const dataCount             = dataArray.length;
        const list                  = this._list;
        const rowsCount             = Math.ceil(dataCount / 6);
        const listHeight            = getValueInRange({
            rawValue    : rowsCount * 30 + (rowsCount - 1) * 6,
            minValue    : 80,
            maxValue    : Dimension.DesignMinHeight - 130,
        });
        list.setUnscaledManualHeight(listHeight);
        this._labelNoData.setIsVisible(!dataCount);
        this._group.setUnscaledManualHeight(listHeight + 130);

        await list.bindData(dataArray);
        list.setSelectedItemIndexes(getNonNullElements(dataArray.map((v, i) => currIntegerArray.indexOf(v.integer) >= 0 ? i : null)));
    }
    private _updateGroupSelectAll(): void {
        const list          = this._list;
        const dataArray     = list.getBoundDataArray() ?? [];
        const group         = this._groupSelectAll;
        if (!dataArray.length) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);
            this._imgSelectAll.setIsVisible(dataArray.length <= (list.getSelectedItemIndexes()?.length ?? 0));
        }
    }
    private _updateLabelSelected(): void {
        this._labelSelected.setText(`${this._list.getSelectedItemIndexes()?.length ?? 0} / ${this.getOpenData()?.availableIntegerArray.length}`);
        this._layoutSelected.arrangeItems();
    }
}

interface DataForIntegerRenderer extends UiListItemData {
    integer     : number;
    panel       : Panel;
}
class IntegerRenderer extends UiListItemRenderer<DataForIntegerRenderer> {
    private readonly _groupSelect!  : IUiContainer;
    private readonly _labelName!    : IUiLabel;
    private readonly _imgSelected!  : IUiImage;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._applySettingsForWholeTouch();
    }

    public onItemTapEvent(): void {
        this.getOpenData()?.panel.updateOnSelectInteger();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateView();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _updateView(): void {
        this._labelName.setText(`${this.getOpenData()?.integer}`);
    }
}
