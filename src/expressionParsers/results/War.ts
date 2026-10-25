import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { ResultType } from "../Enums.ts";
import { Base } from "./Base.ts";

export class War extends Base {
    public constructor(war: IBwWar) {
        super(war);
    }

    public override getResultType(): ResultType {
        return ResultType.War;
    }
    public checkIsEqual(rhs: Base): boolean {
        return (rhs instanceof War)
            && (this.war === rhs.war);
    }
}
