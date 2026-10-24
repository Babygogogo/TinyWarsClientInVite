import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import type * as ExpressionParsersEnums from "../Enums.ts";

export abstract class Base {
    public readonly war: BaseWarInterfaceIBwWar.IBwWar;

    protected constructor(war: BaseWarInterfaceIBwWar.IBwWar) {
        this.war = war;
    }

    public abstract getResultType(): ExpressionParsersEnums.ResultType;
    public abstract checkIsEqual(rhs: Base): boolean;
}
