import {
    ExpressionParsers_Results_Base,
    Helpers_Misc,
    ExpressionParsers_Enums,
    type BaseWar_Interface_IBwWar,
} from "../../internal.ts";

export class Num extends ExpressionParsers_Results_Base.Base {
    public readonly num: number;

    public constructor(war: BaseWar_Interface_IBwWar.IBwWar, num: number) {
        super(war);

        if (!isFinite(num)) {
            throw Helpers_Misc.newError(`Invalid num: ${num}`);
        }
        this.num = num;
    }

    public override getResultType(): ExpressionParsers_Enums.ResultType {
        return ExpressionParsers_Enums.ResultType.Number;
    }
    public checkIsEqual(rhs: ExpressionParsers_Results_Base.Base): boolean {
        return (rhs instanceof Num)
            && (this.num === rhs.num);
    }
}
