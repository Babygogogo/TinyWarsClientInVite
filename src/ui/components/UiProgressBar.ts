import * as NumbersUtils from "../../numbers/Utils.ts";
import * as UiComponentsUiContainer from "./UiContainer.ts";
import type * as UiInterfacesIUiImage from "../interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiProgressBar from "../interfaces/IUiProgressBar.ts";
import * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export class UiProgressBar extends UiComponentsUiContainer.UiContainer implements UiInterfacesIUiProgressBar.IUiProgressBar {
    private readonly _labelDisplay? : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgThumb?     : UiInterfacesIUiImage.IUiImage;

    private readonly _graphicMask   = new VendorEgretEgret.Rectangle(-1, -1, 1, 1);    // xy设为-1用于补偿egret的遮罩bug
    private _startValue             = 0;
    private _endValue               = 100;
    private _currentValue           = 0;

    public updateOnLoadedSkin(): void {
        const img = this._imgThumb;
        if (img) {
            img.setMask(this._graphicMask);
            img.setCallbackOnAppliedSizeFromSizerInfo(() => this._updateView());
        }
    }

    public getStartValue(): number {
        return this._startValue;
    }
    public setStartValue(value: number): void {
        if (this.getStartValue() !== value) {
            this._startValue = value;
            this._updateView();
        }
    }

    public getEndValue(): number {
        return this._endValue;
    }
    public setEndValue(value: number): void {
        if (this.getEndValue() !== value) {
            this._endValue = value;
            this._updateView();
        }
    }

    public getCurrentValue(): number {
        return this._currentValue;
    }
    public setCurrentValue(value: number): void {
        if (this.getCurrentValue() !== value) {
            this._currentValue = value;
            this._updateView();
        }
    }
    public get currentValue(): number {
        return this.getCurrentValue();
    }
    public set currentValue(value: number) {
        this.setCurrentValue(value);
    }

    private _updateView(): void {
        this._updateImgMask();
        this._updateLabelDisplay();
    }
    private _updateImgMask(): void {
        const graphicMask = this._graphicMask;
        if (graphicMask == null) {
            return;
        }

        const imgThumb = this._imgThumb;
        if (imgThumb == null) {
            return;
        }

        const maxWidth      = imgThumb.getUnscaledWidth() + 1;  // 补偿egret的遮罩bug
        const startValue    = this.getStartValue();
        const endValue      = this.getEndValue();
        graphicMask.height  = imgThumb.getUnscaledHeight() + 1; // 补偿egret的遮罩bug
        // graphicMask.x       = imgThumb.getX();
        // graphicMask.y       = imgThumb.getY();

        if (startValue === endValue) {
            graphicMask.width = maxWidth;

        } else {
            const isNegative            = startValue > endValue;
            const revisedStartValue     = isNegative ? -startValue : startValue;
            const revisedEndValue       = isNegative ? -endValue : endValue;
            const revisedCurrentValue   = NumbersUtils.getValueInRange({
                minValue    : revisedStartValue,
                maxValue    : revisedEndValue,
                rawValue    : this.getCurrentValue() * (isNegative ? -1 : 1),
            });
            graphicMask.width = (revisedCurrentValue - revisedStartValue) / (revisedEndValue - revisedStartValue) * maxWidth;
        }

        imgThumb.setMask(graphicMask);
    }
    private _updateLabelDisplay(): void {
        const labelDisplay = this._labelDisplay;
        if (labelDisplay == null) {
            return;
        }

        labelDisplay.setText(`${Math.floor(this.getCurrentValue())} / ${Math.floor(this.getEndValue())}`);
    }
}
