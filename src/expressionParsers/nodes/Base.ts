import type * as ExpressionParsersContextsBase from "../contexts/Base.ts";
import type * as ExpressionParsersEnums from "../Enums.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";

export abstract class Base {
    public abstract eval(ctx: ExpressionParsersContextsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, lambdaArgumentDict: Map<string, ExpressionParsersResultsBase.Base> | null, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base;
    public abstract getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ExpressionParsersEnums.ContextType;
        lambdaArgumentInfoDict  : Map<string, ExpressionParsersEnums.ResultType> | null;
        localVariableDict       : Map<string, ExpressionParsersEnums.ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ExpressionParsersEnums.ResultType;

    public abstract getTokensCount(): number;

    // public abstract getPriority(): Priority;
    // public abstract toString(): string;
    // public abstract toProto(): CommonProto.Structure.Expression.INode;
}
