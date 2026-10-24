import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersResultsBase from "./Base.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";

export class Num extends ExpressionParsersResultsBase.Base {
    public readonly num: number;

    public constructor(war: BaseWarInterfaceIBwWar.IBwWar, num: number) {
        super(war);

        if (!isFinite(num)) {
            throw HelpersMisc.newError(`Invalid num: ${num}`);
        }
        this.num = num;
    }

    public override getResultType(): ExpressionParsersEnums.ResultType {
        return ExpressionParsersEnums.ResultType.Number;
    }
    public checkIsEqual(rhs: ExpressionParsersResultsBase.Base): boolean {
        return (rhs instanceof Num)
            && (this.num === rhs.num);
    }
}
