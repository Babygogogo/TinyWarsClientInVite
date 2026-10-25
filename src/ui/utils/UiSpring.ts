export interface SpringOptions {
    max?: number;
    damp?: number;
    springiness?: number;
}

export class UiSpring {
    private _x              = 0;
    private _ax             = 0;
    private _dx             = 0;
    private _tx             = 0;

    private _max            = 0;
    private _damp           = 0;
    private _springiness    = 0;

    public constructor(options: SpringOptions = {}) {
        this._x = 0;
        this._ax = 0;
        this._dx = 0;
        this._tx = 0;

        // add opts to object for shared opts.
        this._max           = options.max || 160;
        this._damp          = options.damp || 0.8;
        this._springiness   = options.springiness || 0.1;
    }

    public update(): void {
        this._ax = (this._tx - this._x) * this._springiness;

        this._dx += this._ax;
        this._dx *= this._damp;

        if (this._dx < -this._max) {
            this._dx = -this._max;
        } else if (this._dx > this._max) {
            this._dx = this._max;
        }

        this._x += this._dx;
    }

    public reset(): void {
        this._x = 0;
        this._ax = 0;
        this._dx = 0;
        this._tx = 0;
    }

    public getMax(): number {
        return this._max;
    }
    public setMax(value: number): void {
        this._max = value;
    }

    public getDamp(): number {
        return this._damp;
    }
    public setDamp(value: number): void {
        this._damp = value;
    }

    public getSpringiness(): number {
        return this._springiness;
    }
    public setSpringiness(value: number): void {
        this._springiness = value;
    }

    public getX(): number {
        return this._x;
    }
    public setX(x: number): void {
        this._x = x;
    }

    public getTx(): number {
        return this._tx;
    }
    public setTx(tx: number): void {
        this._tx = tx;
    }
}
