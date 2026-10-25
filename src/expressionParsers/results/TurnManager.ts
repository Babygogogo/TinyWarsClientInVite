import { ResultType } from "../Enums.ts";
import { Base } from "./Base.ts";
import type { ITurnManager } from "../../turns/ITurnManager.ts";

export class TurnManager extends Base {
    public readonly turnManager: ITurnManager;

    public constructor(turnManager: ITurnManager) {
        super(turnManager.getWar());

        this.turnManager = turnManager;
    }

    public override getResultType(): ResultType {
        return ResultType.Turn;
    }
    public checkIsEqual(rhs: Base): boolean {
        return (rhs instanceof TurnManager)
            && (this.turnManager === rhs.turnManager);
    }
}
