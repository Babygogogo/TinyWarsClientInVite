import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersContextsBase from "./Base.ts";
import * as ExpressionParsersContextsWar from "./War.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as ExpressionParsersResultsNum from "../results/Num.ts";
import * as ExpressionParsersResultsWar from "../results/War.ts";
import type * as ExpressionParsersTypes from "../Types.ts";
import * as ExpressionParsersUtils from "../Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import type * as ProtoSchemaCommonProtoTaskObjectivesTaskObjective from "../../proto/schema/CommonProto/TaskObjectives/TaskObjective.ts";
import type * as ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState from "../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveState.ts";

type TaskObjectiveProto = ProtoSchemaCommonProtoTaskObjectivesTaskObjective.TaskObjective;
type TaskObjectiveState = ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveState.TaskObjectiveState;

export class TaskObjective extends ExpressionParsersContextsBase.Base {
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
    private static generateVariables(): ExpressionParsersTypes.EpVariableInfoDict {
        const variables = ExpressionParsersUtils.extendVariableInfoDict(ExpressionParsersContextsWar.War.Variables);
        variables.set(TaskObjective.VnId,                      { desc: LangConstants.TextType.A0719, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(TaskObjective.VnMain,                    { desc: LangConstants.TextType.A0720, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(TaskObjective.VnMaxProgress,             { desc: LangConstants.TextType.A0721, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(TaskObjective.VnCompletionScore,         { desc: LangConstants.TextType.A0722, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(TaskObjective.VnProgressScore,           { desc: LangConstants.TextType.A0723, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(TaskObjective.VnHidden,                  { desc: LangConstants.TextType.A0724, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(TaskObjective.VnProgress,                { desc: LangConstants.TextType.A0725, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(TaskObjective.VnProgressUpdaterDisabled, { desc: LangConstants.TextType.A0731, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(TaskObjective.VnWar,                     { desc: LangConstants.TextType.A0384, resultType: ExpressionParsersEnums.ResultType.War,    isExtension: false });

        return variables;
    }
    private static generateFunctions(): ExpressionParsersTypes.EpFunctionInfoDict {
        const functions = ExpressionParsersUtils.extendFunctionInfoDict(ExpressionParsersContextsWar.War.Functions);
        return functions;
    }

    private readonly _taskObjective : TaskObjectiveProto | null;
    private readonly _state         : TaskObjectiveState | null;
    private _contextWar             : ExpressionParsersContextsWar.War | null = null;

    public constructor(war: BaseWarInterfaceIBwWar.IBwWar, objectiveId: number) {
        super(war);

        this._taskObjective = war.getInstanceWarRule()?.getTaskObjectiveFullData()?.getTaskObjectiveArray().find(v => (v.getObjectiveId() ?? 0) === objectiveId) ?? null;
        this._state         = war.getTaskObjectiveManager().getStateArray().find(v => (v.getObjectiveId() ?? 0) === objectiveId) ?? null;
    }

    public getContextType(): ExpressionParsersEnums.ContextType {
        return ExpressionParsersEnums.ContextType.TaskObjective;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase.Base {
        const war           = this.getWar();
        const taskObjective = this._taskObjective;
        if (identifierName == TaskObjective.VnId) {
            return new ExpressionParsersResultsNum.Num(
                war,
                taskObjective == null
                    ? -2
                    : (taskObjective.getObjectiveId() ?? 0)
            );
        } else if (identifierName == TaskObjective.VnMain) {
            return new ExpressionParsersResultsNum.Num(
                war,
                taskObjective == null
                    ? -2
                    : (taskObjective.getIsMain() ? 1 : 0)
            );
        } else if (identifierName == TaskObjective.VnMaxProgress) {
            return new ExpressionParsersResultsNum.Num(
                war,
                taskObjective == null
                    ? -2
                    : (taskObjective.getMaxProgress() ?? -1)
            );
        } else if (identifierName == TaskObjective.VnCompletionScore) {
            if (taskObjective == null) {
                throw HelpersMisc.newError(`Invalid objectiveId.`);
            }
            return new ExpressionParsersResultsNum.Num(war, taskObjective.getScoreForCompletion() ?? 0);
        } else if (identifierName == TaskObjective.VnProgressScore) {
            if (taskObjective == null) {
                throw HelpersMisc.newError(`Invalid objectiveId.`);
            }
            return new ExpressionParsersResultsNum.Num(war, taskObjective.getScoreForProgress() ?? 0);
        } else if (identifierName == TaskObjective.VnHidden) {
            return new ExpressionParsersResultsNum.Num(
                war,
                taskObjective == null
                    ? -2
                    : (this._state?.getIsHidden() ? 1 : 0)
            );
        } else if (identifierName == TaskObjective.VnProgress) {
            if (taskObjective == null) {
                throw HelpersMisc.newError(`Invalid objectiveId.`);
            }
            return new ExpressionParsersResultsNum.Num(war, this._state?.getCurrentProgress() ?? 0);
        } else if (identifierName == TaskObjective.VnProgressUpdaterDisabled) {
            return new ExpressionParsersResultsNum.Num(
                war,
                taskObjective == null
                    ? -2
                    : (this._state?.getIsProgressUpdaterDisabled() ? 1 : 0)
            );
        } else if (identifierName == TaskObjective.VnWar) {
            return new ExpressionParsersResultsWar.War(war);
        }

        return (this._contextWar ??= new ExpressionParsersContextsWar.War(war)).resolveVariable(identifierName);
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase.Base[], rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        return (this._contextWar ??= new ExpressionParsersContextsWar.War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
    }
}
