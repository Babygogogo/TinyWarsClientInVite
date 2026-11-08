import {
    type BaseWar_Model_War,
    type ExpressionParsers_Enums,
} from "../../internal.ts";

export abstract class Base {
    public readonly war: BaseWar_Model_War.War;

    protected constructor(war: BaseWar_Model_War.War) {
        this.war = war;
    }

    public abstract getResultType(): ExpressionParsers_Enums.ResultType;
    public abstract checkIsEqual(rhs: Base): boolean;
}
