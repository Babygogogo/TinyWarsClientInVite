import {
    type BaseWar_Interface_IBwWar,
    type ExpressionParsers_Enums,
} from "../../internal.ts";

export abstract class Base {
    public readonly war: BaseWar_Interface_IBwWar.IBwWar;

    protected constructor(war: BaseWar_Interface_IBwWar.IBwWar) {
        this.war = war;
    }

    public abstract getResultType(): ExpressionParsers_Enums.ResultType;
    public abstract checkIsEqual(rhs: Base): boolean;
}
