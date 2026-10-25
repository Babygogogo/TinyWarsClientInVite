import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { ResultType } from "../Enums.ts";
import { Base } from "./Base.ts";

export class TaskObjective extends Base {
    public readonly objectiveId: number;

    public constructor(war: IBwWar, objectiveId: number) {
        super(war);

        this.objectiveId = objectiveId;
    }

    public override getResultType(): ResultType {
        return ResultType.TaskObjective;
    }
    public checkIsEqual(rhs: Base): boolean {
        return (this.war === rhs.war)
            && (this.objectiveId >= 0)
            && (rhs instanceof TaskObjective)
            && (this.objectiveId === rhs.objectiveId);
    }
}
