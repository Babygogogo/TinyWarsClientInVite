import * as UiUtilsUiScrollSpring from "./UiScrollSpring.ts";

export interface SlidingNumberOptions {
    constrain?: boolean;
    maxSpeed?: number;
    ease?: ConstrainEase;
}

export interface ConstrainEase {
    done: boolean;
    to: number;
    start(speed: number, pos: number, to: number): void;
    update(): number;
}

export class UiSlidingNumber {
    private _position       = 0;
    private _constrain      = true;
    private _min            = 0; // the window width of the drag
    private _max            = 0; // the window width of the drag
    private _maxSpeed       = 400;

    private _ease           : ConstrainEase;

    private _offset         = 0;
    private _prev           = 0;
    private _speed          = 0;
    private _hasStopped     = false;

    private _targetSpeed    = 0;
    private _speedChecker   = 0;
    private _grab           = 0;
    private _activeEase     : ConstrainEase | null = null;

    public constructor(options: SlidingNumberOptions = {}) {
        this._constrain = options.constrain ?? true;
        this._maxSpeed = options.maxSpeed ?? 400;
        this._ease = options.ease ?? new UiUtilsUiScrollSpring.UiScrollSpring();
    }

    public setPositionAndClearSpeed(n: number): void {
        this._speed = 0;
        this.setPosition(n);
    }
    public setPosition(position: number): void {
        this._position = position;
    }
    public getPosition(): number {
        return this._position;
    }
    public setValueToMin(): void {
        this.setPositionAndClearSpeed(this.getMin());
    }
    public setValueToMax(): void {
        this.setPositionAndClearSpeed(this.getMax());
    }

    public getMax(): number {
        return this._max;
    }
    public setMax(max: number): void {
        this._max = max;
    }

    public getMin(): number {
        return this._min;
    }
    public setMin(min: number): void {
        this._min = min;
    }

    public grab(offset: number): void {
        this._grab          = offset;
        this._offset        = this.getPosition() - offset;
        this._speedChecker  = 0;
        this._targetSpeed   = this._speed = 0;
        this._hasStopped    = false;
    }

    public hold(newPosition: number): void {
        this._speedChecker++;

        const tempPosition = newPosition + this._offset;
        this.setPosition(tempPosition);

        if (this._speedChecker > 1) {
            this._targetSpeed = tempPosition - this._prev;
        }

        this._speed += (this._targetSpeed - this._speed) / 2;

        if (this._speed > this._maxSpeed) {
            this._speed = this._maxSpeed;
        } else if (this._speed < -this._maxSpeed) {
            this._speed = -this._maxSpeed;
        }

        this._prev = tempPosition;

        if (this._constrain) {
            this._activeEase = null;

            if (tempPosition > this._min) {
                this.setPosition(tempPosition - (tempPosition - this._min) / 1.5);
            }
            else if (tempPosition < this._max) {
                this.setPosition(tempPosition + (this._max - tempPosition) / 1.5);
            }
        }
    }

    public slide(instant = false): void {
        if (this._hasStopped) {
            return;
        }

        if (this._constrain) {
            this._updateConstrain(instant);
        } else {
            this._updateDefault();
        }
    }

    public getMoveAmount(): number {
        return -(this.getPosition() - this._offset - this._grab);
    }

    private _updateDefault(): void {
        this._speed *= 0.9;
        this.setPosition(this.getPosition() + this._speed);

        if ((this._speed < 0 ? this._speed * -1 : this._speed) < 0.01) {
            this._hasStopped = true;
        }
    }

    private _updateConstrain(instant = false): void {
        const max: number = this._max;

        if (instant) {
            // TODO ???
            if (this.getPosition() > 0) {
                this.setPositionAndClearSpeed(0);
            }
            if (this.getPosition() > 0) {
                this.setPositionAndClearSpeed(0);
            }
            if (this.getPosition() < this._max) {
                this.setPositionAndClearSpeed(this._max);
            }
            if (this.getPosition() < this._max) {
                this.setPositionAndClearSpeed(this._max);
            }

        } else {
            const position = this.getPosition();
            if ((position > this._min) || (position < max) || (this._activeEase)) {
                if (!this._activeEase) {
                    this._activeEase = this._ease;

                    if (position > this._min) {
                        this._activeEase.start(this._speed, position, this._min);
                    } else {
                        this._activeEase.start(this._speed, position, max);
                    }
                }

                this.setPosition(this._activeEase.update());

                if (this._activeEase.done) {
                    this.setPositionAndClearSpeed(this._activeEase.to);
                    this._activeEase = null;
                }

            } else {
                this._updateDefault();
            }
        }
    }
}
