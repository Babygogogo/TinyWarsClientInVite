import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { ResultType } from "../Enums.ts";
import type { Base as NodesBase } from "../nodes/Base.ts";
import { Base } from "./Base.ts";

export class Lambda extends Base {
    public readonly node: NodesBase;

    public constructor(war: IBwWar, node: NodesBase) {
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
