import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersResultsBase from "./Base.ts";
import type * as ExpressionParsersResultsPosition from "./Position.ts";

export class PositionArray extends ExpressionParsersResultsBase.Base {
    public readonly positionArray: ExpressionParsersResultsPosition.Position[];

    public constructor(war: BaseWarInterfaceIBwWar.IBwWar, positionArray: ExpressionParsersResultsPosition.Position[]) {
        super(war);

        this.positionArray = positionArray;
    }

    public override getResultType(): ExpressionParsersEnums.ResultType {
        return ExpressionParsersEnums.ResultType.PositionArray;
    }
    public override checkIsEqual(rhs: ExpressionParsersResultsBase.Base): boolean {
        if (!(rhs instanceof PositionArray)) {
            return false;
        }

        const array1 = this.positionArray;
        const array2 = rhs.positionArray;
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
