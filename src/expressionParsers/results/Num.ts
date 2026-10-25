import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { ResultType } from "../Enums.ts";
import { Base } from "./Base.ts";
import { newError } from "../../helpers/Misc.ts";

export class Num extends Base {
    public readonly num: number;

    public constructor(war: IBwWar, num: number) {
        super(war);

        if (!isFinite(num)) {
            throw newError(`Invalid num: ${num}`);
        }
        this.num = num;
    }

    public override getResultType(): ResultType {
        return ResultType.Number;
    }
    public checkIsEqual(rhs: Base): boolean {
        return (rhs instanceof Num)
            && (this.num === rhs.num);
    }
}
