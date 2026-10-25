import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { ResultType } from "../Enums.ts";
import { Base } from "./Base.ts";
import type { UnitStatistic } from "./UnitStatistic.ts";

export class UnitStatisticArray extends Base {
    public readonly dataArray: UnitStatistic[];

    public constructor(war: IBwWar, dataArray: UnitStatistic[]) {
        super(war);

        this.dataArray = dataArray;
    }

    public override getResultType(): ResultType {
        return ResultType.UnitStatisticArray;
    }
    public checkIsEqual(rhs: Base): boolean {
        if (!(rhs instanceof UnitStatisticArray)) {
            return false;
        }
        if (this.war !== rhs.war) {
            return false;
        }

        const array1 = this.dataArray;
        const array2 = rhs.dataArray;
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
