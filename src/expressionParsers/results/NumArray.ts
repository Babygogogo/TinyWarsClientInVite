import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { ResultType } from "../Enums.ts";
import { Base } from "./Base.ts";

export class NumArray extends Base {
    public readonly numberArray: number[];

    public constructor(war: IBwWar, array: number[]) {
        super(war);

        this.numberArray = array;
    }

    public override getResultType(): ResultType {
        return ResultType.NumberArray;
    }
    public checkIsEqual(rhs: Base): boolean {
        if (!(rhs instanceof NumArray)) {
            return false;
        }

        const array1 = this.numberArray;
        const array2 = rhs.numberArray;
        if (array1.length !== array2.length) {
            return false;
        }

        for (let i = 0; i < array1.length; ++i) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }

        return true;
    }
}
