import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import type { ResultType } from "../Enums.ts";

export abstract class Base {
    public readonly war: IBwWar;

    protected constructor(war: IBwWar) {
        this.war = war;
    }

    public abstract getResultType(): ResultType;
    public abstract checkIsEqual(rhs: Base): boolean;
}
