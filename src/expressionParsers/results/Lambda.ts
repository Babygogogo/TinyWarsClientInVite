import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { ResultType } from "../Enums.ts";
import type { Base } from "../nodes/Base.ts";
import { Base as ExpressionParsersResultsBase } from "./Base.ts";

export class Lambda extends ExpressionParsersResultsBase {
    public readonly node: Base;

    public constructor(war: IBwWar, node: Base) {
        super(war);

        this.node = node;
    }

    public override getResultType(): ResultType {
        return ResultType.Lambda;
    }
    public override checkIsEqual(): boolean {
        return false;
    }
}
