import { getValueInRange } from "../../numbers/Utils.ts";
import {
    type ConstrainEase,
    UiSlidingNumber,
} from "./UiSlidingNumber.ts";
import { Point } from "../../vendor/egret/Egret.ts";

interface TrackPadOptions {
    /** override the easing function when constraining */
    xEase?: ConstrainEase;
    yEase?: ConstrainEase;

    maxSpeed?: number;
    constrain?: boolean;

    disableEasing?: boolean;
}

/** Easing controller for the {@link ScrollBox}. */
export class UiTrackPad {
    private _xAxis              : UiSlidingNumber;
    private _yAxis              : UiSlidingNumber;

    private _isDown             = false;
    private _globalPosition     = new Point();
    private _dirty              = false;
    private _isEasingDisabled   = false;    // 原名disableEasing

    public constructor(options: TrackPadOptions) {
        this._xAxis = new UiSlidingNumber({
            ease: options.xEase,
            maxSpeed: options.maxSpeed,
            constrain: options.constrain
        });

        this._yAxis = new UiSlidingNumber({
            ease: options.yEase,
            maxSpeed: options.maxSpeed,
            constrain: options.constrain
        });

        this.setIsEasingDisabled(options.disableEasing ?? false);
    }

    public pointerDown(pos: Point): void {
        this._globalPosition = pos;
        this._xAxis.grab(pos.x);
        this._yAxis.grab(pos.y);
        this._isDown = true;
    }

    public pointerUp(): void {
        this._isDown = false;
    }

    public pointerMove(pos: Point): void {
        this._globalPosition = pos;
    }

    public update(): void {
        const xAxis = this._xAxis;
        const yAxis = this._yAxis;
        if (this._dirty) {
            this._dirty = false;

            // TODO ???
            // xAxis.setMin(this._bounds.left);
            // xAxis.setMin(this._bounds.right - this._frame.width);
            // xAxis.setMin(this._bounds.top);
            // xAxis.setMin(this._bounds.bottom - this._frame.height);
        }

        if (this._isDown) {
            xAxis.hold(this._globalPosition.x);
            yAxis.hold(this._globalPosition.y);
        } else {
            const isEasingDisabled = this.getIsEasingDisabled();
            xAxis.slide(isEasingDisabled);
            yAxis.slide(isEasingDisabled);
        }
    }

    public getIsEasingDisabled(): boolean {
        return this._isEasingDisabled;
    }
    public setIsEasingDisabled(value: boolean): void {
        this._isEasingDisabled = value;
    }

    public getXAxis(): UiSlidingNumber {
        return this._xAxis;
    }
    public getYAxis(): UiSlidingNumber {
        return this._yAxis;
    }

    public getX(): number {
        return this._xAxis.getPosition();
    }
    public setX(x: number, needRevise = true): void {
        const axis = this.getXAxis();
        if (!needRevise) {
            axis.setPositionAndClearSpeed(x);
        } else {
            axis.setPositionAndClearSpeed(getValueInRange({
                minValue    : axis.getMax(),
                maxValue    : axis.getMin(),
                rawValue    : x,
            }));
        }
    }

    public getY(): number {
        return this._yAxis.getPosition();
    }
    public setY(y: number, needRevise = true): void {
        const axis = this.getYAxis();
        if (!needRevise) {
            axis.setPositionAndClearSpeed(y);
        } else {
            axis.setPositionAndClearSpeed(getValueInRange({
                minValue    : axis.getMax(),
                maxValue    : axis.getMin(),
                rawValue    : y,
            }));
        }
    }
}
