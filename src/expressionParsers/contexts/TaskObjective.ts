import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { Base } from "./Base.ts";
import { War } from "./War.ts";
import { ResultType, ContextType } from "../Enums.ts";
import type { Base as ExpressionParsersResultsBase } from "../results/Base.ts";
import { Num } from "../results/Num.ts";
import { War as ExpressionParsersResultsWar } from "../results/War.ts";
import type { EpVariableInfoDict, EpFunctionInfoDict } from "../Types.ts";
import { extendVariableInfoDict, extendFunctionInfoDict } from "../Utils.ts";
import { newError } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import type {
    TaskObjective as ProtoSchemaCommonProtoTaskObjectivesTaskObjective,
} from "../../proto/schema/CommonProto/TaskObjectives/TaskObjective.ts";
import type { TaskObjectiveState } from "../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveState.ts";

type TaskObjectiveProto = ProtoSchemaCommonProtoTaskObjectivesTaskObjective;
export class TaskObjective extends Base {
    private static readonly VnId                        = "id";
    private static readonly VnMain                      = "main";
    private static readonly VnMaxProgress               = "maxProgress";
    private static readonly VnCompletionScore           = "completionScore";
    private static readonly VnProgressScore             = "progressScore";
    private static readonly VnHidden                    = "hidden";
    private static readonly VnProgress                  = "progress";
    private static readonly VnProgressUpdaterDisabled   = "progressUpdaterDisabled";
    private static readonly VnWar                       = "war";

    public static readonly Variables    = TaskObjective.generateVariables();
    public static readonly Functions    = TaskObjective.generateFunctions();
    private static generateVariables(): EpVariableInfoDict {
        const variables = extendVariableInfoDict(War.Variables);
        variables.set(TaskObjective.VnId,                      { desc: TextType.A0719, resultType: ResultType.Number, isExtension: false });
        variables.set(TaskObjective.VnMain,                    { desc: TextType.A0720, resultType: ResultType.Number, isExtension: false });
        variables.set(TaskObjective.VnMaxProgress,             { desc: TextType.A0721, resultType: ResultType.Number, isExtension: false });
        variables.set(TaskObjective.VnCompletionScore,         { desc: TextType.A0722, resultType: ResultType.Number, isExtension: false });
        variables.set(TaskObjective.VnProgressScore,           { desc: TextType.A0723, resultType: ResultType.Number, isExtension: false });
        variables.set(TaskObjective.VnHidden,                  { desc: TextType.A0724, resultType: ResultType.Number, isExtension: false });
        variables.set(TaskObjective.VnProgress,                { desc: TextType.A0725, resultType: ResultType.Number, isExtension: false });
        variables.set(TaskObjective.VnProgressUpdaterDisabled, { desc: TextType.A0731, resultType: ResultType.Number, isExtension: false });
        variables.set(TaskObjective.VnWar,                     { desc: TextType.A0384, resultType: ResultType.War,    isExtension: false });

        return variables;
    }
    private static generateFunctions(): EpFunctionInfoDict {
        const functions = extendFunctionInfoDict(War.Functions);
        return functions;
    }

    private readonly _taskObjective : TaskObjectiveProto | null;
    private readonly _state         : TaskObjectiveState | null;
    private _contextWar             : War | null = null;

    public constructor(war: IBwWar, objectiveId: number) {
        super(war);

        this._taskObjective = war.getInstanceWarRule()?.getTaskObjectiveFullData()?.getTaskObjectiveArray().find(v => (v.getObjectiveId() ?? 0) === objectiveId) ?? null;
        this._state         = war.getTaskObjectiveManager().getStateArray().find(v => (v.getObjectiveId() ?? 0) === objectiveId) ?? null;
    }

    public getContextType(): ContextType {
        return ContextType.TaskObjective;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase {
        const war           = this.getWar();
        const taskObjective = this._taskObjective;
        if (identifierName == TaskObjective.VnId) {
            return new Num(
                war,
                taskObjective == null
                    ? -2
                    : (taskObjective.getObjectiveId() ?? 0)
            );
        } else if (identifierName == TaskObjective.VnMain) {
            return new Num(
                war,
                taskObjective == null
                    ? -2
                    : (taskObjective.getIsMain() ? 1 : 0)
            );
        } else if (identifierName == TaskObjective.VnMaxProgress) {
            return new Num(
                war,
                taskObjective == null
                    ? -2
                    : (taskObjective.getMaxProgress() ?? -1)
            );
        } else if (identifierName == TaskObjective.VnCompletionScore) {
            if (taskObjective == null) {
                throw newError(`Invalid objectiveId.`);
            }
            return new Num(war, taskObjective.getScoreForCompletion() ?? 0);
        } else if (identifierName == TaskObjective.VnProgressScore) {
            if (taskObjective == null) {
                throw newError(`Invalid objectiveId.`);
            }
            return new Num(war, taskObjective.getScoreForProgress() ?? 0);
        } else if (identifierName == TaskObjective.VnHidden) {
            return new Num(
                war,
                taskObjective == null
                    ? -2
                    : (this._state?.getIsHidden() ? 1 : 0)
            );
        } else if (identifierName == TaskObjective.VnProgress) {
            if (taskObjective == null) {
                throw newError(`Invalid objectiveId.`);
            }
            return new Num(war, this._state?.getCurrentProgress() ?? 0);
        } else if (identifierName == TaskObjective.VnProgressUpdaterDisabled) {
            return new Num(
                war,
                taskObjective == null
                    ? -2
                    : (this._state?.getIsProgressUpdaterDisabled() ? 1 : 0)
            );
        } else if (identifierName == TaskObjective.VnWar) {
            return new ExpressionParsersResultsWar(war);
        }

        return (this._contextWar ??= new War(war)).resolveVariable(identifierName);
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase[], rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsBase {
        return (this._contextWar ??= new War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
    }
}
