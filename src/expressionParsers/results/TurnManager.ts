import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersResultsBase from "./Base.ts";
import type * as TurnsITurnManager from "../../turns/ITurnManager.ts";

type ITurnManager = TurnsITurnManager.ITurnManager;

export class TurnManager extends ExpressionParsersResultsBase.Base {
    public readonly turnManager: ITurnManager;

    public constructor(turnManager: ITurnManager) {
        super(turnManager.getWar());

        this.turnManager = turnManager;
    }

    public override getResultType(): ExpressionParsersEnums.ResultType {
        return ExpressionParsersEnums.ResultType.Turn;
    }
    public checkIsEqual(rhs: ExpressionParsersResultsBase.Base): boolean {
        return (rhs instanceof TurnManager)
            && (this.turnManager === rhs.turnManager);
    }
}
