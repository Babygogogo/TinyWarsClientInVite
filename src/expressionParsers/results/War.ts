import {
    ExpressionParsers_Results_Base,
    ExpressionParsers_Enums,
    type BaseWar_Model_War,
} from "../../internal.ts";

export class War extends ExpressionParsers_Results_Base.Base {
    public constructor(war: BaseWar_Model_War.War) {
        super(war);
    }

    public override getResultType(): ExpressionParsers_Enums.ResultType {
        return ExpressionParsers_Enums.ResultType.War;
    }
    public checkIsEqual(rhs: ExpressionParsers_Results_Base.Base): boolean {
        return (rhs instanceof War)
            && (this.war === rhs.war);
    }
}
