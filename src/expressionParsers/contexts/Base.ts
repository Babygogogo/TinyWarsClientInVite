import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import type { ContextType } from "../Enums.ts";
import type { Base as ExpressionParsersResultsBase } from "../results/Base.ts";

export abstract class Base {
    private readonly _war: IBwWar;

    public abstract resolveVariable(identifierName: string, isRestricted: boolean): ExpressionParsersResultsBase;
    public abstract callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase[], rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsBase;
    public abstract getContextType(): ContextType;

    protected constructor(war: IBwWar) {
        this._war = war;
    }

    public getWar(): IBwWar {
        return this._war;
    }
}
