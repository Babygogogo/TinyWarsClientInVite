import {
    ExpressionParsers_Results_Base,
    ExpressionParsers_Enums,
    type Turns_Manager,
} from "../../internal.ts";

export class TurnManager extends ExpressionParsers_Results_Base.Base {
    public readonly turnManager: Turns_Manager.Manager;

    public constructor(turnManager: Turns_Manager.Manager) {
        super(turnManager.getWar());

        this.turnManager = turnManager;
    }

    public override getResultType(): ExpressionParsers_Enums.ResultType {
        return ExpressionParsers_Enums.ResultType.Turn;
    }
    public checkIsEqual(rhs: ExpressionParsers_Results_Base.Base): boolean {
        return (rhs instanceof TurnManager)
            && (this.turnManager === rhs.turnManager);
    }
}
