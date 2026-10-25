import type { ConstrainEase } from "./UiSlidingNumber.ts";
import { UiSpring } from "./UiSpring.ts";

export class UiScrollSpring implements ConstrainEase {
    public done = false;
    public to   = 0;

    private readonly _spring    = new UiSpring();
    private _pos                = 0;
    private _speed              = 0;
    private _correctSpeed       = false;

    public start(speed: number, pos: number, to: number): void {
        this._speed = speed;
        this._pos   = pos;
        this.to     = to;
        this.done   = false;

        const spring = this._spring;
        spring.setX(this._pos);
        spring.setTx(this.to);

        const diff          = this.to - this._pos;
        this._correctSpeed  = (Math.abs(diff) / diff) !== (Math.abs(this._speed) / this._speed);
    }

    public update(): number {
        const spring = this._spring;
        if (this._correctSpeed) {
            this._speed *= 0.6;

            if (Math.abs(this._speed) < 2) {
                this._correctSpeed = false;
            }

            this._pos   += this._speed;
            spring.setX(this._pos);
        } else {
            const diff = this.to - this._pos;

            if (Math.abs(diff) < 0.05) {
                this._pos = this.to;
                this.done = true;
            } else {
                spring.setTx(this.to);
                spring.update();
                this._pos = spring.getX();
            }
        }

        return this._pos;
    }

    public cancel(): void {
        // matches jux interface
    }
}
