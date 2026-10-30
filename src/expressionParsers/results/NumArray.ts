import {
    ExpressionParsers_Results_Base,
    ExpressionParsers_Enums,
    type BaseWar_Interface_IBwWar,
} from "../../internal.ts";

export class NumArray extends ExpressionParsers_Results_Base.Base {
    public readonly numberArray: number[];

    public constructor(war: BaseWar_Interface_IBwWar.IBwWar, array: number[]) {
        super(war);

        this.numberArray = array;
    }

    public override getResultType(): ExpressionParsers_Enums.ResultType {
        return ExpressionParsers_Enums.ResultType.NumberArray;
    }
    public checkIsEqual(rhs: ExpressionParsers_Results_Base.Base): boolean {
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
