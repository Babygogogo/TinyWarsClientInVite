import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersResultsBase from "./Base.ts";

export class NumArray extends ExpressionParsersResultsBase.Base {
    public readonly numberArray: number[];

    public constructor(war: BaseWarInterfaceIBwWar.IBwWar, array: number[]) {
        super(war);

        this.numberArray = array;
    }

    public override getResultType(): ExpressionParsersEnums.ResultType {
        return ExpressionParsersEnums.ResultType.NumberArray;
    }
    public checkIsEqual(rhs: ExpressionParsersResultsBase.Base): boolean {
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
