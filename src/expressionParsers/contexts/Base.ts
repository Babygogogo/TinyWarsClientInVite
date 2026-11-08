import {
    type BaseWar_Model_War,
    type ExpressionParsers_Enums,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";

export abstract class Base {
    private readonly _war: BaseWar_Model_War.War;

    public abstract resolveVariable(identifierName: string, isRestricted: boolean): ExpressionParsers_Results_Base.Base;
    public abstract callFunction(identifierName: string, argumentArray: ExpressionParsers_Results_Base.Base[], rootCtx: Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base;
    public abstract getContextType(): ExpressionParsers_Enums.ContextType;

    protected constructor(war: BaseWar_Model_War.War) {
        this._war = war;
    }

    public getWar(): BaseWar_Model_War.War {
        return this._war;
    }
}
