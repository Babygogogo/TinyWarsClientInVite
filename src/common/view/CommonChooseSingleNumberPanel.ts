import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import {
    UndefinedError,
    TextType,
} from "../../lang/Constants.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { Dimension } from "../../stages/Constants.ts";
import { Executor } from "../../tween/Executor.ts";
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
    currentNumber           : Undefinable<number>;
    availableNumberArray    : number[];
    showNumber?             : boolean;
    keepOrder?              : boolean;
    columnsCount?           : number;
    getTitleText            : () => string;
    getNumberMainText       : (num: number) => string | Promise<string>;
    getNumberHelpText?      : (num: number) => string | null;
    checkIsNumberRed?       : (num: number) => boolean | Promise<boolean>;
    callbackForSettings?    : () => void;
    callbackOnConfirm       : (num: number) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnSettings!          : IUiButton;
    private readonly _labelTips!            : IUiLabel;

    private readonly _list!                 : IUiScrollList<DataForItemRenderer>;
    private readonly _labelNoData!          : IUiLabel;

    private _selectedNumber                 : Undefinable<number>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnSettings,            callback: this._onTouchedBtnSettings },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._list.setItemRendererClass(ItemRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._selectedNumber = openData.currentNumber;
        this._btnSettings.setIsVisible(!!openData.callbackForSettings);
        this._updateComponentsForLanguage();

        this._resetList();
    }
    protected override async _onClosed(): Promise<void> {
        await this._list.removeAllItems();

        await super._onClosed();
    }

    public checkHasSelectedNumber(num: number): boolean {
        return this._selectedNumber === num;
    }
    public updateOnSelectNumber(num: number): void {
        const oldSelectedNumber = this._selectedNumber;
        if (oldSelectedNumber === num) {
            this.getOpenData()?.callbackOnConfirm(num);
            this.closePanel();

        } else {
            this._selectedNumber = num;

            const list      = this._list;
            const dataArray = list.getBoundDataArray() ?? [];
            const oldIndex  = dataArray.findIndex(v => v?.num === oldSelectedNumber);
            const newIndex  = dataArray.findIndex(v => v?.num === num);
            if (oldIndex >= 0) {
                list.updateSingleData(oldIndex, dataArray[oldIndex]);
            }
            if (newIndex >= 0) {
                list.updateSingleData(newIndex, dataArray[newIndex]);
            }
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onTouchedBtnSettings(): void {
        this.getOpenData()?.callbackForSettings?.();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(this.getOpenData()?.getTitleText() ?? UndefinedError);
        this._labelNoData.setLangText(TextType.B0278);
        this._labelTips.setLangText(TextType.B1249);
    }

    private async _resetList(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const showNumber        = !!openData.showNumber;
        const getNumberMainText = openData.getNumberMainText;
        const getNumberHelpText = openData.getNumberHelpText ?? null;
        const checkIsNumberRed  = openData.checkIsNumberRed ?? null;
        const numArray          = openData.availableNumberArray.concat();
        if (!openData.keepOrder) {
            numArray.sort((v1, v2) => v1 - v2);
        }

        const dataArray : DataForItemRenderer[] = [];
        for (const num of numArray) {
            dataArray.push({
                num                 : num,
                showNumber          : showNumber,
                getNumberMainText   : getNumberMainText,
                getNumberHelpText   : getNumberHelpText,
                checkIsNumberRed    : checkIsNumberRed,
                panel               : this,
            });
        }

        const dataCount     = dataArray.length;
        const columnsCount  = getValueInRange({
            rawValue    : openData.columnsCount ?? 2,
            minValue    : 2,
            maxValue    : 4,
        });
        const rowsCount     = Math.ceil(dataCount / columnsCount);
        const listWidth     = columnsCount * 200 + (columnsCount - 1) * 10;
        const groupHeight   = getValueInRange({
            rawValue    : rowsCount * 36 + (rowsCount - 1) * 10 + 80,
            minValue    : 180,
            maxValue    : Dimension.DesignMinHeight,
        });
        const group     = this._group;
        const list      = this._list;
        this._labelNoData.setIsVisible(!dataCount);
        group.setUnscaledManualWidth(listWidth + 40);
        group.setUnscaledManualHeight(groupHeight);
        list.setUnscaledManualWidth(listWidth);
        list.setUnscaledManualHeight(groupHeight - 80);
        await list.bindData(dataArray);
    }
}

interface DataForItemRenderer extends UiListItemData {
    num                 : number;
    showNumber          : boolean;
    getNumberMainText   : (num: number) => string | Promise<string>;
    getNumberHelpText   : ((num: number) => string | null) | null;
    checkIsNumberRed    : ((num: number) => boolean | Promise<boolean>) | null;
    panel               : Panel;
}
class ItemRenderer extends UiListItemRenderer<DataForItemRenderer> {
    private readonly _groupSelect!      : IUiContainer;
    private readonly _imgSelected!      : IUiImage;
    private readonly _imgRed!           : IUiImage;

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
    protected async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Executor.removeTweens(imgSelected);
        Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected async _onClosed(): Promise<void> {
        Executor.removeTweens(this._imgSelected);

        await super._onClosed();
    }
    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateView();
    }
    private _onTouchedGroupSelect(): void {
        const openData = this.getOpenData();
        openData?.panel.updateOnSelectNumber(openData.num);

        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupHelp(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const func = openData.getNumberHelpText;
        const text = func ? func(openData.num) : null;
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => text ?? UndefinedError,
        });

        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private async _updateView(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const num                   = openData.num;
        const getNumberHelpText     = openData.getNumberHelpText;
        this._imgSelected.setIsVisible(openData.panel.checkHasSelectedNumber(num));
        this._groupHelp.setIsVisible((getNumberHelpText != null) && (!!getNumberHelpText(num)));

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

        const imgRed            = this._imgRed;
        labelNumberText.setText(``);
        imgRed.setIsVisible(false);

        const checkIsRed        = openData.checkIsNumberRed;
        const isRed             = checkIsRed ? await checkIsRed(num) : false;
        const numberText        = await openData.getNumberMainText(num);
        if (openData === this.getOpenData()) {
            imgRed.setIsVisible(isRed);
            labelNumberText.setText(numberText);
        }
        groupText.arrangeItems();
    }
}
