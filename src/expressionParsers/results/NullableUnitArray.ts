import {
    ExpressionParsers_Results_Base,
    ExpressionParsers_Enums,
    type BaseWar_Interface_IBwWar,
    type ExpressionParsers_Results_NullableUnit,
} from "../../internal.ts";

export class NullableUnitArray extends ExpressionParsers_Results_Base.Base {
    public readonly array: ExpressionParsers_Results_NullableUnit.NullableUnit[];

    public constructor(war: BaseWar_Interface_IBwWar.IBwWar, array: ExpressionParsers_Results_NullableUnit.NullableUnit[]) {
        super(war);

        this.array = array;
    }

    public override getResultType(): ExpressionParsers_Enums.ResultType {
        return ExpressionParsers_Enums.ResultType.UnitArray;
    }
    public checkIsEqual(rhs: ExpressionParsers_Results_Base.Base): boolean {
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
