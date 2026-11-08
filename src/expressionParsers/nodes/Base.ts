import {
    type ExpressionParsers_Contexts_Base,
    type ExpressionParsers_Enums,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";

export abstract class Base {
    public abstract eval(ctx: ExpressionParsers_Contexts_Base.Base, rootCtx: ExpressionParsers_Contexts_Base.Base, lambdaArgumentDict: Map<string, ExpressionParsers_Results_Base.Base> | null, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base;
    public abstract getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ExpressionParsers_Enums.ContextType;
        lambdaArgumentInfoDict  : Map<string, ExpressionParsers_Enums.ResultType> | null;
        localVariableDict       : Map<string, ExpressionParsers_Enums.ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ExpressionParsers_Enums.ResultType;

    public abstract getTokensCount(): number;

    // public abstract getPriority(): Priority;
    // public abstract toString(): string;
    // public abstract toProto(): CommonProto.Structure.Expression.INode;
}
