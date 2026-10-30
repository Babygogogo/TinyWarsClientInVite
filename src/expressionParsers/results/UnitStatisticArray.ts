import {
    ExpressionParsers_Results_Base,
    ExpressionParsers_Enums,
    type BaseWar_Interface_IBwWar,
    type ExpressionParsers_Results_UnitStatistic,
} from "../../internal.ts";

export class UnitStatisticArray extends ExpressionParsers_Results_Base.Base {
    public readonly dataArray: ExpressionParsers_Results_UnitStatistic.UnitStatistic[];

    public constructor(war: BaseWar_Interface_IBwWar.IBwWar, dataArray: ExpressionParsers_Results_UnitStatistic.UnitStatistic[]) {
        super(war);

        this.dataArray = dataArray;
    }

    public override getResultType(): ExpressionParsers_Enums.ResultType {
        return ExpressionParsers_Enums.ResultType.UnitStatisticArray;
    }
    public checkIsEqual(rhs: ExpressionParsers_Results_Base.Base): boolean {
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
