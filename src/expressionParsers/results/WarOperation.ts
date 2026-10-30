import {
    ExpressionParsers_Results_Base,
    ExpressionParsers_Enums,
    type BaseWar_Interface_IBwWar,
} from "../../internal.ts";
import type { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export class WarOperation extends ExpressionParsers_Results_Base.Base {
    public readonly woContainer: WoContainer | null;

    public constructor(woContainer: WoContainer | null, war: BaseWar_Interface_IBwWar.IBwWar) {
        super(war);

        this.woContainer = woContainer;
    }

    public override getResultType(): ExpressionParsers_Enums.ResultType {
        return ExpressionParsers_Enums.ResultType.WarOperation;
    }
    public override checkIsEqual(rhs: ExpressionParsers_Results_Base.Base): boolean {
        return (rhs instanceof WarOperation)
            && (rhs.woContainer != null)
            && (rhs.woContainer === this.woContainer);
    }
}
