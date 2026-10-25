import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { show } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getFormattedText } from "../../lang/Utils.ts";
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
    currentNumberArray      : Undefinable<number[]>;
    availableNumberArray    : number[];
    showNumber?             : boolean;
    minChooseCount?         : number;
    maxChooseCount?         : number;
    columnsCount?           : number;
    getTitleText            : () => string;
    getHelpText?            : () => string;
    getNumberMainText       : (num: number) => string | Promise<string>;
    getNumberMainTextColor? : (num: number) => number;
    callbackOnHelp?         : (num: number) => void;
    callbackOnConfirm       : (numberArray: number[]) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnHelp!              : IUiButton;
    private readonly _btnClose!             : IUiButton;

    private readonly _groupSelectAll!       : IUiLayout;
    private readonly _labelSelectAll!       : IUiLabel;
    private readonly _imgSelectAll!         : IUiImage;

    private readonly _groupSelected!        : IUiLayout;
    private readonly _labelSelectedTitle!   : IUiLabel;
    private readonly _labelSelected!        : IUiLabel;

    private readonly _list!                 : IUiScrollList<DataForItemRenderer>;
    private readonly _labelNoData!          : IUiLabel;

    private readonly _btnConfirm!           : IUiButton;

    private readonly _selectedNumberSet     = new Set<number>();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnHelp,            callback: this._onTouchedBtnHelp },
            { ui: this._btnClose,           callback: this.closePanel },

            { ui: this._groupSelectAll,     callback: this._onTouchedGroupSelectAll },
            { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
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

    public checkHasSelectedNumber(num: number): boolean {
        return this._selectedNumberSet.has(num);
    }
    public updateOnSelectNumber(num: number): void {
        const selectedNumberSet = this._selectedNumberSet;
        if (selectedNumberSet.has(num)) {
            selectedNumberSet.delete(num);
        } else {
            selectedNumberSet.add(num);
        }

        const list      = this._list;
        const dataArray = list.getBoundDataArray() ?? [];
        const index     = dataArray.findIndex(v => v?.num === num);
        list.updateSingleData(index, dataArray[index]);
        this._updateGroupSelectAll();
        this._updateLabelSelected();
    }

    private _onTouchedBtnHelp(): void {
        const func = this.getOpenData()?.getHelpText;
        if (func) {
            openPanel(getDict().CommonHelpPanel, {
                getContent : () => func(),
            });
        }
    }
    private _onTouchedGroupSelectAll(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const selectedNumberSet = this._selectedNumberSet;
        selectedNumberSet.clear();

        const list      = this._list;
        const dataArray = list.getBoundDataArray() ?? [];
        if (!this._imgSelectAll.getIsVisible()) {
            for (const data of dataArray) {
                selectedNumberSet.add(getExisted(data?.num));
            }
        }
        for (let i = 0; i < dataArray.length; ++i) {
            list.updateSingleData(i, dataArray[i]);
        }

        this._updateGroupSelectAll();
        this._updateLabelSelected();
    }
    private _onTouchedBtnConfirm(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const arr               = [...this._selectedNumberSet].sort((v1, v2) => v1 - v2) ?? [];
        const maxChooseCount    = openData.maxChooseCount;
        if ((maxChooseCount != null) && (arr.length > maxChooseCount)) {
            show(getFormattedText(TextType.A0148, maxChooseCount));
            return;
        }

        const minChooseCount = openData.minChooseCount;
        if ((minChooseCount != null) && (arr.length < minChooseCount)) {
            show(getFormattedText(TextType.A0150, minChooseCount));
            return;
        }

        openData.callbackOnConfirm(arr);
        this.closePanel();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private async _updateView(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const numberArray       = openData.currentNumberArray;
        const selectedNumberSet = this._selectedNumberSet;
        selectedNumberSet.clear();
        for (const num of numberArray ?? []) {
            selectedNumberSet.add(num);
        }

        this._updateComponentsForLanguage();

        this._btnHelp.setIsVisible(!!openData.getHelpText);
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

        this._groupSelectAll.arrangeItems();
        this._groupSelected.arrangeItems();
    }

    private async _resetList(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const showNumber                = !!openData.showNumber;
        const getNumberMainText         = openData.getNumberMainText;
        const getNumberMainTextColor    = openData.getNumberMainTextColor ?? null;
        const callbackOnHelp            = openData.callbackOnHelp ?? null;
        const dataArray                 : DataForItemRenderer[] = [];
        for (const num of openData.availableNumberArray.concat().sort((v1, v2) => v1 - v2)) {
            dataArray.push({
                num                     : num,
                showNumber              : showNumber,
                getNumberMainText       : getNumberMainText,
                getNumberMainTextColor  : getNumberMainTextColor,
                callbackOnHelp          : callbackOnHelp,
                panel                   : this,
            });
        }

        const dataCount                 = dataArray.length;
        this._labelNoData.setIsVisible(!dataCount);
        await this._list.bindData(dataArray);

        const columnsCount  = getValueInRange({
            rawValue    : openData.columnsCount ?? 2,
            minValue    : 2,
            maxValue    : 4,
        });
        const rowsCount     = Math.ceil(dataCount / columnsCount);
        const group         = this._group;
        group.setUnscaledManualWidth(columnsCount * 200 + (columnsCount - 1) * 20 + 40);
        group.setUnscaledManualHeight(getValueInRange({
            rawValue    : rowsCount * 30 + (rowsCount - 1) * 10 + 130,
            minValue    : 210,
            maxValue    : Dimension.DesignMinHeight,
        }));
    }
    private _updateGroupSelectAll(): void {
        const numberArray   = this._list.getBoundDataArray()?.map(v => getExisted(v?.num)) ?? [];
        const group         = this._groupSelectAll;
        if (!numberArray.length) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);
            this._imgSelectAll.setIsVisible((!!numberArray.length) && (numberArray.every(v => this._selectedNumberSet.has(v))));
        }
    }
    private _updateLabelSelected(): void {
        this._labelSelected.setText(`${this._selectedNumberSet.size} / ${this.getOpenData()?.availableNumberArray.length}`);
        this._groupSelected.arrangeItems();
    }
}

interface DataForItemRenderer extends UiListItemData {
    num                     : number;
    showNumber              : boolean;
    getNumberMainText       : (num: number) => string | Promise<string>;
    getNumberMainTextColor  : ((num: number) => number) | null;
    callbackOnHelp          : ((num: number) => void) | null;
    panel                   : Panel;
}
class ItemRenderer extends UiListItemRenderer<DataForItemRenderer> {
    private readonly _groupSelect!      : IUiContainer;
    private readonly _imgSelected!      : IUiImage;

    private readonly _groupHelp!        : IUiContainer;

    private readonly _groupText!        : IUiLayout;
    private readonly _labelNumber!      : IUiLabel;
    private readonly _labelNumberText!  : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupSelect,    callback: this._onTouchedGroupSelect },
            { ui: this._groupHelp,      callback: this._onTouchedGroupHelp },
        ]);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateView();
    }
    private _onTouchedGroupSelect(): void {
        const data = this.getOpenData();
        data?.panel.updateOnSelectNumber(data.num);

        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupHelp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const func = openData.callbackOnHelp;
        if (func) {
            func(openData.num);
            playShortSfx(ShortSfxCode.ButtonNeutral01);
        }
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private async _updateView(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const num = openData.num;
        this._imgSelected.setIsVisible(openData.panel.checkHasSelectedNumber(num));
        this._groupHelp.setIsVisible((openData.callbackOnHelp != null));

        const labelNumberText   = this._labelNumberText;
        const groupText         = this._groupText;
        groupText.removeAllItems(false);
        if (openData.showNumber) {
            const labelNum  = this._labelNumber;
            labelNum.setText(`#${num}`);
            groupText.addItem(labelNum, false);
        }
        groupText.addItem(labelNumberText, false);
        groupText.arrangeItems();

        labelNumberText.setText(``);
        const numberText = await openData.getNumberMainText(num);
        if (openData === this.getOpenData()) {
            labelNumberText.setText(numberText);
        }
        groupText.arrangeItems();

        const getNumberMainTextColor = openData.getNumberMainTextColor;
        labelNumberText.setTextColor(getNumberMainTextColor ? getNumberMainTextColor(num) : 0xFFFFFF);
    }
}
