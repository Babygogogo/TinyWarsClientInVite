import {
    ExpressionParsers_Results_Base,
    ExpressionParsers_Enums,
    type BaseWar_Interface_IBwWar,
} from "../../internal.ts";

export class TaskObjective extends ExpressionParsers_Results_Base.Base {
    public readonly objectiveId: number;

    public constructor(war: BaseWar_Interface_IBwWar.IBwWar, objectiveId: number) {
        super(war);

        this.objectiveId = objectiveId;
    }

    public override getResultType(): ExpressionParsers_Enums.ResultType {
        return ExpressionParsers_Enums.ResultType.TaskObjective;
    }
    public checkIsEqual(rhs: ExpressionParsers_Results_Base.Base): boolean {
        return (this.war === rhs.war)
            && (this.objectiveId >= 0)
            && (rhs instanceof TaskObjective)
            && (this.objectiveId === rhs.objectiveId);
    }
}
