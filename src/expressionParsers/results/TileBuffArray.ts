import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersResultsBase from "./Base.ts";
import type * as ExpressionParsersResultsTileBuff from "./TileBuff.ts";

export class TileBuffArray extends ExpressionParsersResultsBase.Base {
    public readonly buffArray: ExpressionParsersResultsTileBuff.TileBuff[];

    public constructor(war: BaseWarInterfaceIBwWar.IBwWar, buffArray: ExpressionParsersResultsTileBuff.TileBuff[]) {
        super(war);

        this.buffArray = buffArray;
    }

    public override getResultType(): ExpressionParsersEnums.ResultType {
        return ExpressionParsersEnums.ResultType.TileBuffArray;
    }
    public override checkIsEqual(rhs: ExpressionParsersResultsBase.Base): boolean {
        if (!(rhs instanceof TileBuffArray)) {
            return false;
        }

        const array1 = this.buffArray;
        const array2 = rhs.buffArray;
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
