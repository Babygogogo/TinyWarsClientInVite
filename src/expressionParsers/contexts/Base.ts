import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import type * as ExpressionParsersEnums from "../Enums.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";

export abstract class Base {
    private readonly _war: BaseWarInterfaceIBwWar.IBwWar;

    public abstract resolveVariable(identifierName: string, isRestricted: boolean): ExpressionParsersResultsBase.Base;
    public abstract callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase.Base[], rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base;
    public abstract getContextType(): ExpressionParsersEnums.ContextType;

    protected constructor(war: BaseWarInterfaceIBwWar.IBwWar) {
        this._war = war;
    }

    public getWar(): BaseWarInterfaceIBwWar.IBwWar {
        return this._war;
    }
}
