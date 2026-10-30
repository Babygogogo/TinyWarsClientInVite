import {
    ExpressionParsers_Contexts_Base,
    Utils_ClientErrorCode,
    ExpressionParsers_Enums,
    ExpressionParsers_Utils,
    ExpressionParsers_FunctionInfo,
    Helpers_Misc,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Results_War,
    Lang_Constants,
    ExpressionParsers_Contexts_War,
    type ExpressionParsers_Types,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";

export class Num extends ExpressionParsers_Contexts_Base.Base {
    private static readonly VnSelf      = "self";
    private static readonly VnWar       = "war";

    private static readonly FnAbs       = "abs";
    private static readonly FnFloor     = "floor";
    private static readonly FnCeil      = "ceil";

    public static readonly Variables    = Num.generateVariables();
    public static readonly Functions    = Num.generateFunctions();
    private static generateVariables(): ExpressionParsers_Types.EpVariableInfoDict {
        const variables = ExpressionParsers_Utils.extendVariableInfoDict(ExpressionParsers_Contexts_War.War.Variables);
        variables.set(Num.VnSelf,   { desc: Lang_Constants.TextType.A0965, resultType: ExpressionParsers_Enums.ResultType.Number,    isExtension: false } );
        variables.set(Num.VnWar,    { desc: Lang_Constants.TextType.A0384, resultType: ExpressionParsers_Enums.ResultType.War,       isExtension: false } );

        return variables;
    }
    private static generateFunctions(): ExpressionParsers_Types.EpFunctionInfoDict {
        const functions = ExpressionParsers_Utils.extendFunctionInfoDict(ExpressionParsers_Contexts_War.War.Functions);
        functions.set(
            Num.FnAbs,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0522,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict) => {
                    if (argArray.length !== 0) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Num.FnAbs, 0, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumber_GenerateFunctions_00
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            )
        );
        functions.set(
            Num.FnFloor,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0523,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict) => {
                    if (argArray.length !== 0) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Num.FnFloor, 0, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumber_GenerateFunctions_01
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            )
        );
        functions.set(
            Num.FnCeil,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0524,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict) => {
                    if (argArray.length !== 0) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Num.FnCeil, 0, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumber_GenerateFunctions_02
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );

        return functions;
    }

    private readonly _num   : number;
    private _contextWar     : ExpressionParsers_Contexts_War.War | null = null;

    public constructor(data: ExpressionParsers_Results_Num.Num) {
        super(data.war);

        this._num = data.num;
    }

    public getContextType(): ExpressionParsers_Enums.ContextType {
        return ExpressionParsers_Enums.ContextType.Number;
    }

    public override resolveVariable(identifierName: string): ExpressionParsers_Results_Base.Base {
        const war = this.getWar();
        switch (identifierName) {
            case Num.VnSelf     : return new ExpressionParsers_Results_Num.Num(war, this._num);
            case Num.VnWar      : return new ExpressionParsers_Results_War.War(war);
            default                         : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(war)).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsers_Results_Base.Base[], rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        switch (identifierName) {
            case Num.FnAbs      : return this.callAbs();
            case Num.FnFloor    : return this.callFloor();
            case Num.FnCeil     : return this.callCeil();
            default                         : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }

    private callAbs(): ExpressionParsers_Results_Num.Num {
        return new ExpressionParsers_Results_Num.Num(this.getWar(), Math.abs(this._num));
    }

    private callFloor(): ExpressionParsers_Results_Num.Num {
        return new ExpressionParsers_Results_Num.Num(this.getWar(), Math.floor(this._num));
    }

    private callCeil(): ExpressionParsers_Results_Num.Num {
        return new ExpressionParsers_Results_Num.Num(this.getWar(), Math.ceil(this._num));
    }
}
