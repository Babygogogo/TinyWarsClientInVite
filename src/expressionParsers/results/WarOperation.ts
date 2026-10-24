import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersResultsBase from "./Base.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export class WarOperation extends ExpressionParsersResultsBase.Base {
    public readonly woContainer: ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer | null;

    public constructor(woContainer: ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer | null, war: BaseWarInterfaceIBwWar.IBwWar) {
        super(war);

        this.woContainer = woContainer;
    }

    public override getResultType(): ExpressionParsersEnums.ResultType {
        return ExpressionParsersEnums.ResultType.WarOperation;
    }
    public override checkIsEqual(rhs: ExpressionParsersResultsBase.Base): boolean {
        return (rhs instanceof WarOperation)
            && (rhs.woContainer != null)
            && (rhs.woContainer === this.woContainer);
    }
}
