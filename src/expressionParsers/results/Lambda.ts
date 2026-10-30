import {
    ExpressionParsers_Results_Base,
    ExpressionParsers_Enums,
    type BaseWar_Interface_IBwWar,
    type ExpressionParsers_Nodes_Base,
} from "../../internal.ts";

export class Lambda extends ExpressionParsers_Results_Base.Base {
    public readonly node: ExpressionParsers_Nodes_Base.Base;

    public constructor(war: BaseWar_Interface_IBwWar.IBwWar, node: ExpressionParsers_Nodes_Base.Base) {
        super(war);

        this.node = node;
    }

    public override getResultType(): ExpressionParsers_Enums.ResultType {
        return ExpressionParsers_Enums.ResultType.Lambda;
    }
    public override checkIsEqual(): boolean {
        return false;
    }
}
