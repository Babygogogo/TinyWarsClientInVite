import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import type { ContextType } from "../Enums.ts";
import type { Base as ResultsBase } from "../results/Base.ts";

export abstract class Base {
    private readonly _war: IBwWar;

    public abstract resolveVariable(identifierName: string, isRestricted: boolean): ResultsBase;
    public abstract callFunction(identifierName: string, argumentArray: ResultsBase[], rootCtx: Base, localVariableDict: Map<string, ResultsBase> | null, isRestricted: boolean): ResultsBase;
    public abstract getContextType(): ContextType;

    protected constructor(war: IBwWar) {
        this._war = war;
    }

    public getWar(): IBwWar {
        return this._war;
    }
}
