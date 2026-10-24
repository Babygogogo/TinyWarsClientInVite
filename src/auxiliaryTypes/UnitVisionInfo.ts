export class UnitVisionInfo {
    public readonly baseRange       : number;
    public readonly isFixed         : boolean;
    public readonly isPenetrating    : boolean;

    public constructor({ baseRange, isFixed, isPenetrating }: {
        baseRange       : number;
        isFixed         : boolean;
        isPenetrating    : boolean;
    }) {
        this.baseRange      = baseRange;
        this.isFixed        = isFixed;
        this.isPenetrating  = isPenetrating;
    }
}
