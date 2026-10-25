import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { Base } from "./Base.ts";
import { War } from "./War.ts";
import { ResultType, ContextType } from "../Enums.ts";
import type { Base as ExpressionParsersResultsBase } from "../results/Base.ts";
import { Num } from "../results/Num.ts";
import { War as ExpressionParsersResultsWar } from "../results/War.ts";
import type { EpVariableInfoDict, EpFunctionInfoDict } from "../Types.ts";
import { extendVariableInfoDict, extendFunctionInfoDict } from "../Utils.ts";
import { TextType } from "../../lang/Constants.ts";

export class CustomCounter extends Base {
    private static readonly VnSelfId    = "selfId";
    private static readonly VnId        = "id";
    private static readonly VnSelfValue = "selfValue";
    private static readonly VnValue     = "value";
    private static readonly VnWar       = "war";

    public static readonly Functions    = CustomCounter.generateFunctions();
    public static readonly Variables    = CustomCounter.generateVariables();
    private static generateVariables(): EpVariableInfoDict {
        const variables = extendVariableInfoDict(War.Variables);
        variables.set(CustomCounter.VnSelfId,    { desc: TextType.A0123, resultType: ResultType.Number, isExtension: false, isHidden: true } );
        variables.set(CustomCounter.VnId,        { desc: TextType.A0123, resultType: ResultType.Number, isExtension: false } );
        variables.set(CustomCounter.VnSelfValue, { desc: TextType.A0124, resultType: ResultType.Number, isExtension: false, isHidden: true } );
        variables.set(CustomCounter.VnValue,     { desc: TextType.A0124, resultType: ResultType.Number, isExtension: false } );
        variables.set(CustomCounter.VnWar,       { desc: TextType.A0384, resultType: ResultType.War,    isExtension: false } );

        return variables;
    }
    private static generateFunctions(): EpFunctionInfoDict {
        return extendFunctionInfoDict(War.Functions);
    }

    private _customCounterId    : number;
    private _contextWar         : War | null = null;

    public constructor(customCounterId: number, war: IBwWar) {
        super(war);

        this._customCounterId = customCounterId;
    }

    public getContextType(): ContextType {
        return ContextType.CustomCounter;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase {
        const war = this.getWar();
        switch (identifierName) {
            case CustomCounter.VnSelfId    : return new Num(war, this._customCounterId);
            case CustomCounter.VnId        : return new Num(war, this._customCounterId);
            case CustomCounter.VnSelfValue : return new Num(war, war.getWarEventManager().getCustomCounter(this._customCounterId));
            case CustomCounter.VnValue     : return new Num(war, war.getWarEventManager().getCustomCounter(this._customCounterId));
            case CustomCounter.VnWar       : return new ExpressionParsersResultsWar(war);
            default                                 : return (this._contextWar ??= new War(war)).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase[], rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsBase {
        return (this._contextWar ??= new War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
    }
}
