import {
    ExpressionParsers_Contexts_Base,
    ExpressionParsers_Enums,
    ExpressionParsers_Utils,
    Helpers_Misc,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Results_War,
    Lang_Constants,
    ExpressionParsers_Contexts_War,
    type ExpressionParsers_Types,
    type BaseWar_Interface_IBwWar,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";
import type { TaskObjective as ProtoTaskObjective } from "../../proto/schema/CommonProto/TaskObjectives/TaskObjective.ts";
import type { TaskObjectiveState } from "../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveState.ts";

export class TaskObjective extends ExpressionParsers_Contexts_Base.Base {
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
    private static generateVariables(): ExpressionParsers_Types.EpVariableInfoDict {
        const variables = ExpressionParsers_Utils.extendVariableInfoDict(ExpressionParsers_Contexts_War.War.Variables);
        variables.set(TaskObjective.VnId,                      { desc : Lang_Constants.TextType.A0719, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(TaskObjective.VnMain,                    { desc : Lang_Constants.TextType.A0720, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(TaskObjective.VnMaxProgress,             { desc : Lang_Constants.TextType.A0721, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(TaskObjective.VnCompletionScore,         { desc : Lang_Constants.TextType.A0722, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(TaskObjective.VnProgressScore,           { desc : Lang_Constants.TextType.A0723, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(TaskObjective.VnHidden,                  { desc : Lang_Constants.TextType.A0724, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(TaskObjective.VnProgress,                { desc : Lang_Constants.TextType.A0725, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(TaskObjective.VnProgressUpdaterDisabled, { desc : Lang_Constants.TextType.A0731, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(TaskObjective.VnWar,                     { desc : Lang_Constants.TextType.A0384, resultType : ExpressionParsers_Enums.ResultType.War,    isExtension : false });

        return variables;
    }
    private static generateFunctions(): ExpressionParsers_Types.EpFunctionInfoDict {
        const functions = ExpressionParsers_Utils.extendFunctionInfoDict(ExpressionParsers_Contexts_War.War.Functions);
        return functions;
    }

    private readonly _taskObjective : ProtoTaskObjective | null;
    private readonly _state         : TaskObjectiveState | null;
    private _contextWar             : ExpressionParsers_Contexts_War.War | null = null;

    public constructor(war: BaseWar_Interface_IBwWar.IBwWar, objectiveId: number) {
        super(war);

        this._taskObjective = war.getInstanceWarRule()?.getTaskObjectiveFullData()?.getTaskObjectiveArray().find(v => (v.getObjectiveId()) === objectiveId) ?? null;
        this._state         = war.getTaskObjectiveManager().getStateArray().find(v => (v.getObjectiveId()) === objectiveId) ?? null;
    }

    public getContextType(): ExpressionParsers_Enums.ContextType {
        return ExpressionParsers_Enums.ContextType.TaskObjective;
    }

    public override resolveVariable(identifierName: string): ExpressionParsers_Results_Base.Base {
        const war           = this.getWar();
        const taskObjective = this._taskObjective;
        if (identifierName == TaskObjective.VnId) {
            return new ExpressionParsers_Results_Num.Num(
                war,
                taskObjective == null
                    ? -2
                    : (taskObjective.getObjectiveId()),
            );
        } else if (identifierName == TaskObjective.VnMain) {
            return new ExpressionParsers_Results_Num.Num(
                war,
                taskObjective == null
                    ? -2
                    : (taskObjective.getIsMain() ? 1 : 0),
            );
        } else if (identifierName == TaskObjective.VnMaxProgress) {
            return new ExpressionParsers_Results_Num.Num(
                war,
                taskObjective == null
                    ? -2
                    : (taskObjective.getMaxProgress() ?? -1),
            );
        } else if (identifierName == TaskObjective.VnCompletionScore) {
            if (taskObjective == null) {
                throw Helpers_Misc.newError(`Invalid objectiveId.`);
            }
            return new ExpressionParsers_Results_Num.Num(war, taskObjective.getScoreForCompletion());
        } else if (identifierName == TaskObjective.VnProgressScore) {
            if (taskObjective == null) {
                throw Helpers_Misc.newError(`Invalid objectiveId.`);
            }
            return new ExpressionParsers_Results_Num.Num(war, taskObjective.getScoreForProgress());
        } else if (identifierName == TaskObjective.VnHidden) {
            return new ExpressionParsers_Results_Num.Num(
                war,
                taskObjective == null
                    ? -2
                    : (this._state?.getIsHidden() ? 1 : 0),
            );
        } else if (identifierName == TaskObjective.VnProgress) {
            if (taskObjective == null) {
                throw Helpers_Misc.newError(`Invalid objectiveId.`);
            }
            return new ExpressionParsers_Results_Num.Num(war, this._state?.getCurrentProgress() ?? 0);
        } else if (identifierName == TaskObjective.VnProgressUpdaterDisabled) {
            return new ExpressionParsers_Results_Num.Num(
                war,
                taskObjective == null
                    ? -2
                    : (this._state?.getIsProgressUpdaterDisabled() ? 1 : 0),
            );
        } else if (identifierName == TaskObjective.VnWar) {
            return new ExpressionParsers_Results_War.War(war);
        }

        return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(war)).resolveVariable(identifierName);
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsers_Results_Base.Base[], rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
    }
}
