import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersResultsBase from "./Base.ts";

export class TaskObjective extends ExpressionParsersResultsBase.Base {
    public readonly objectiveId: number;

    public constructor(war: BaseWarInterfaceIBwWar.IBwWar, objectiveId: number) {
        super(war);

        this.objectiveId = objectiveId;
    }

    public override getResultType(): ExpressionParsersEnums.ResultType {
        return ExpressionParsersEnums.ResultType.TaskObjective;
    }
    public checkIsEqual(rhs: ExpressionParsersResultsBase.Base): boolean {
        return (this.war === rhs.war)
            && (this.objectiveId >= 0)
            && (rhs instanceof TaskObjective)
            && (this.objectiveId === rhs.objectiveId);
    }
}
