import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersResultsBase from "./Base.ts";
import type * as ExpressionParsersResultsUnitStatistic from "./UnitStatistic.ts";

export class UnitStatisticArray extends ExpressionParsersResultsBase.Base {
    public readonly dataArray: ExpressionParsersResultsUnitStatistic.UnitStatistic[];

    public constructor(war: BaseWarInterfaceIBwWar.IBwWar, dataArray: ExpressionParsersResultsUnitStatistic.UnitStatistic[]) {
        super(war);

        this.dataArray = dataArray;
    }

    public override getResultType(): ExpressionParsersEnums.ResultType {
        return ExpressionParsersEnums.ResultType.UnitStatisticArray;
    }
    public checkIsEqual(rhs: ExpressionParsersResultsBase.Base): boolean {
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
