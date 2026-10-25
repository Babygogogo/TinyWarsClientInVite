import type { Base as ExpressionParsersContextsBase } from "../contexts/Base.ts";
import type { ContextType, ResultType } from "../Enums.ts";
import type { Base as ExpressionParsersResultsBase } from "../results/Base.ts";

export abstract class Base {
    public abstract eval(ctx: ExpressionParsersContextsBase, rootCtx: ExpressionParsersContextsBase, lambdaArgumentDict: Map<string, ExpressionParsersResultsBase> | null, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsBase;
    public abstract getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ContextType;
        lambdaArgumentInfoDict  : Map<string, ResultType> | null;
        localVariableDict       : Map<string, ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ResultType;

    public abstract getTokensCount(): number;

    // public abstract getPriority(): Priority;
    // public abstract toString(): string;
    // public abstract toProto(): CommonProto.Structure.Expression.INode;
}
