import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { ResultType } from "../Enums.ts";
import { Base } from "./Base.ts";
import type { NullableUnit } from "./NullableUnit.ts";

export class NullableUnitArray extends Base {
    public readonly array: NullableUnit[];

    public constructor(war: IBwWar, array: NullableUnit[]) {
        super(war);

        this.array = array;
    }

    public override getResultType(): ResultType {
        return ResultType.UnitArray;
    }
    public checkIsEqual(rhs: Base): boolean {
        if (!(rhs instanceof NullableUnitArray)) {
            return false;
        }

        const array1 = this.array;
        const array2 = rhs.array;
        if (array1.length !== array2.length) {
            return false;
        }

        for (let i = 0; i < array1.length; ++i) {
            if (!array1[i].checkIsEqual(array2[i])) {
                return false;
            }
        }

        return true;
    }
}
