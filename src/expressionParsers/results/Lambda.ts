import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import type * as ExpressionParsersNodesBase from "../nodes/Base.ts";
import * as ExpressionParsersResultsBase from "./Base.ts";

export class Lambda extends ExpressionParsersResultsBase.Base {
    public readonly node: ExpressionParsersNodesBase.Base;

    public constructor(war: BaseWarInterfaceIBwWar.IBwWar, node: ExpressionParsersNodesBase.Base) {
        super(war);

        this.node = node;
    }

    public override getResultType(): ExpressionParsersEnums.ResultType {
        return ExpressionParsersEnums.ResultType.Lambda;
    }
    public override checkIsEqual(): boolean {
        return false;
    }
}
