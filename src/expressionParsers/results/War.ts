import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersResultsBase from "./Base.ts";

export class War extends ExpressionParsersResultsBase.Base {
    public constructor(war: BaseWarInterfaceIBwWar.IBwWar) {
        super(war);
    }

    public override getResultType(): ExpressionParsersEnums.ResultType {
        return ExpressionParsersEnums.ResultType.War;
    }
    public checkIsEqual(rhs: ExpressionParsersResultsBase.Base): boolean {
        return (rhs instanceof War)
            && (this.war === rhs.war);
    }
}
