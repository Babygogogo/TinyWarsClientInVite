import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersContextsBase from "./Base.ts";
import * as ExpressionParsersContextsWar from "./War.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as ExpressionParsersResultsNum from "../results/Num.ts";
import * as ExpressionParsersResultsWar from "../results/War.ts";
import type * as ExpressionParsersTypes from "../Types.ts";
import * as ExpressionParsersUtils from "../Utils.ts";
import * as LangConstants from "../../lang/Constants.ts";

export class CustomCounter extends ExpressionParsersContextsBase.Base {
    private static readonly VnSelfId    = "selfId";
    private static readonly VnId        = "id";
    private static readonly VnSelfValue = "selfValue";
    private static readonly VnValue     = "value";
    private static readonly VnWar       = "war";

    public static readonly Functions    = CustomCounter.generateFunctions();
    public static readonly Variables    = CustomCounter.generateVariables();
    private static generateVariables(): ExpressionParsersTypes.EpVariableInfoDict {
        const variables = ExpressionParsersUtils.extendVariableInfoDict(ExpressionParsersContextsWar.War.Variables);
        variables.set(CustomCounter.VnSelfId,    { desc: LangConstants.TextType.A0123, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false, isHidden: true } );
        variables.set(CustomCounter.VnId,        { desc: LangConstants.TextType.A0123, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false } );
        variables.set(CustomCounter.VnSelfValue, { desc: LangConstants.TextType.A0124, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false, isHidden: true } );
        variables.set(CustomCounter.VnValue,     { desc: LangConstants.TextType.A0124, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false } );
        variables.set(CustomCounter.VnWar,       { desc: LangConstants.TextType.A0384, resultType: ExpressionParsersEnums.ResultType.War,    isExtension: false } );

        return variables;
    }
    private static generateFunctions(): ExpressionParsersTypes.EpFunctionInfoDict {
        return ExpressionParsersUtils.extendFunctionInfoDict(ExpressionParsersContextsWar.War.Functions);
    }

    private _customCounterId    : number;
    private _contextWar         : ExpressionParsersContextsWar.War | null = null;

    public constructor(customCounterId: number, war: BaseWarInterfaceIBwWar.IBwWar) {
        super(war);

        this._customCounterId = customCounterId;
    }

    public getContextType(): ExpressionParsersEnums.ContextType {
        return ExpressionParsersEnums.ContextType.CustomCounter;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase.Base {
        const war = this.getWar();
        switch (identifierName) {
            case CustomCounter.VnSelfId    : return new ExpressionParsersResultsNum.Num(war, this._customCounterId);
            case CustomCounter.VnId        : return new ExpressionParsersResultsNum.Num(war, this._customCounterId);
            case CustomCounter.VnSelfValue : return new ExpressionParsersResultsNum.Num(war, war.getWarEventManager().getCustomCounter(this._customCounterId));
            case CustomCounter.VnValue     : return new ExpressionParsersResultsNum.Num(war, war.getWarEventManager().getCustomCounter(this._customCounterId));
            case CustomCounter.VnWar       : return new ExpressionParsersResultsWar.War(war);
            default                                 : return (this._contextWar ??= new ExpressionParsersContextsWar.War(war)).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase.Base[], rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        return (this._contextWar ??= new ExpressionParsersContextsWar.War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
    }
}
