import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { ResultType } from "../Enums.ts";
import { Base } from "./Base.ts";
import type { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export class WarOperation extends Base {
    public readonly woContainer: WoContainer | null;

    public constructor(woContainer: WoContainer | null, war: IBwWar) {
        super(war);

        this.woContainer = woContainer;
    }

    public override getResultType(): ResultType {
        return ResultType.WarOperation;
    }
    public override checkIsEqual(rhs: Base): boolean {
        return (rhs instanceof WarOperation)
            && (rhs.woContainer != null)
            && (rhs.woContainer === this.woContainer);
    }
}
