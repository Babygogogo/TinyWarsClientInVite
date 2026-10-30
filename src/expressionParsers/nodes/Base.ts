import type { Base as ContextsBase } from "../contexts/Base.ts";
import type {
    ContextType,
    ResultType,
} from "../Enums.ts";
import type { Base as ResultsBase } from "../results/Base.ts";

export abstract class Base {
    public abstract eval(ctx: ContextsBase, rootCtx: ContextsBase, lambdaArgumentDict: Map<string, ResultsBase> | null, localVariableDict: Map<string, ResultsBase> | null, isRestricted: boolean): ResultsBase;
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
