import {
    ExpressionParsers_Contexts_Base,
    ExpressionParsers_Enums,
    ExpressionParsers_Utils,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Results_War,
    Lang_Constants,
    ExpressionParsers_Contexts_War,
    type ExpressionParsers_Types,
    type BaseWar_Interface_IBwWar,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";

export class CustomCounter extends ExpressionParsers_Contexts_Base.Base {
    private static readonly VnSelfId    = "selfId";
    private static readonly VnId        = "id";
    private static readonly VnSelfValue = "selfValue";
    private static readonly VnValue     = "value";
    private static readonly VnWar       = "war";

    public static readonly Functions    = CustomCounter.generateFunctions();
    public static readonly Variables    = CustomCounter.generateVariables();
    private static generateVariables(): ExpressionParsers_Types.EpVariableInfoDict {
        const variables = ExpressionParsers_Utils.extendVariableInfoDict(ExpressionParsers_Contexts_War.War.Variables);
        variables.set(CustomCounter.VnSelfId,    { desc: Lang_Constants.TextType.A0123, resultType: ExpressionParsers_Enums.ResultType.Number, isExtension: false, isHidden: true } );
        variables.set(CustomCounter.VnId,        { desc: Lang_Constants.TextType.A0123, resultType: ExpressionParsers_Enums.ResultType.Number, isExtension: false } );
        variables.set(CustomCounter.VnSelfValue, { desc: Lang_Constants.TextType.A0124, resultType: ExpressionParsers_Enums.ResultType.Number, isExtension: false, isHidden: true } );
        variables.set(CustomCounter.VnValue,     { desc: Lang_Constants.TextType.A0124, resultType: ExpressionParsers_Enums.ResultType.Number, isExtension: false } );
        variables.set(CustomCounter.VnWar,       { desc: Lang_Constants.TextType.A0384, resultType: ExpressionParsers_Enums.ResultType.War,    isExtension: false } );

        return variables;
    }
    private static generateFunctions(): ExpressionParsers_Types.EpFunctionInfoDict {
        return ExpressionParsers_Utils.extendFunctionInfoDict(ExpressionParsers_Contexts_War.War.Functions);
    }

    private _customCounterId    : number;
    private _contextWar         : ExpressionParsers_Contexts_War.War | null = null;

    public constructor(customCounterId: number, war: BaseWar_Interface_IBwWar.IBwWar) {
        super(war);

        this._customCounterId = customCounterId;
    }

    public getContextType(): ExpressionParsers_Enums.ContextType {
        return ExpressionParsers_Enums.ContextType.CustomCounter;
    }

    public override resolveVariable(identifierName: string): ExpressionParsers_Results_Base.Base {
        const war = this.getWar();
        switch (identifierName) {
            case CustomCounter.VnSelfId    : return new ExpressionParsers_Results_Num.Num(war, this._customCounterId);
            case CustomCounter.VnId        : return new ExpressionParsers_Results_Num.Num(war, this._customCounterId);
            case CustomCounter.VnSelfValue : return new ExpressionParsers_Results_Num.Num(war, war.getWarEventManager().getCustomCounter(this._customCounterId));
            case CustomCounter.VnValue     : return new ExpressionParsers_Results_Num.Num(war, war.getWarEventManager().getCustomCounter(this._customCounterId));
            case CustomCounter.VnWar       : return new ExpressionParsers_Results_War.War(war);
            default                                 : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(war)).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsers_Results_Base.Base[], rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
    }
}
