import * as ExpressionParsersContextsBase from "./Base.ts";
import * as ExpressionParsersContextsWar from "./War.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersFunctionInfo from "../FunctionInfo.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as ExpressionParsersResultsNum from "../results/Num.ts";
import * as ExpressionParsersResultsWar from "../results/War.ts";
import type * as ExpressionParsersTypes from "../Types.ts";
import * as ExpressionParsersUtils from "../Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

export class Num extends ExpressionParsersContextsBase.Base {
    private static readonly VnSelf      = "self";
    private static readonly VnWar       = "war";

    private static readonly FnAbs       = "abs";
    private static readonly FnFloor     = "floor";
    private static readonly FnCeil      = "ceil";

    public static readonly Variables    = Num.generateVariables();
    public static readonly Functions    = Num.generateFunctions();
    private static generateVariables(): ExpressionParsersTypes.EpVariableInfoDict {
        const variables = ExpressionParsersUtils.extendVariableInfoDict(ExpressionParsersContextsWar.War.Variables);
        variables.set(Num.VnSelf,   { desc: LangConstants.TextType.A0965, resultType: ExpressionParsersEnums.ResultType.Number,    isExtension: false } );
        variables.set(Num.VnWar,    { desc: LangConstants.TextType.A0384, resultType: ExpressionParsersEnums.ResultType.War,       isExtension: false } );

        return variables;
    }
    private static generateFunctions(): ExpressionParsersTypes.EpFunctionInfoDict {
        const functions = ExpressionParsersUtils.extendFunctionInfoDict(ExpressionParsersContextsWar.War.Functions);
        functions.set(
            Num.FnAbs,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0522,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict) => {
                    if (argArray.length !== 0) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Num.FnAbs, 0, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumber_GenerateFunctions_00
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Num.FnFloor,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0523,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict) => {
                    if (argArray.length !== 0) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Num.FnFloor, 0, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumber_GenerateFunctions_01
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            Num.FnCeil,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0524,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict) => {
                    if (argArray.length !== 0) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Num.FnCeil, 0, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumber_GenerateFunctions_02
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            ),
        );

        return functions;
    }

    private readonly _num   : number;
    private _contextWar     : ExpressionParsersContextsWar.War | null = null;

    public constructor(data: ExpressionParsersResultsNum.Num) {
        super(data.war);

        this._num = data.num;
    }

    public getContextType(): ExpressionParsersEnums.ContextType {
        return ExpressionParsersEnums.ContextType.Number;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase.Base {
        const war = this.getWar();
        switch (identifierName) {
            case Num.VnSelf     : return new ExpressionParsersResultsNum.Num(war, this._num);
            case Num.VnWar      : return new ExpressionParsersResultsWar.War(war);
            default                         : return (this._contextWar ??= new ExpressionParsersContextsWar.War(war)).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase.Base[], rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        switch (identifierName) {
            case Num.FnAbs      : return this.callAbs();
            case Num.FnFloor    : return this.callFloor();
            case Num.FnCeil     : return this.callCeil();
            default                         : return (this._contextWar ??= new ExpressionParsersContextsWar.War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }

    private callAbs(): ExpressionParsersResultsNum.Num {
        return new ExpressionParsersResultsNum.Num(this.getWar(), Math.abs(this._num));
    }

    private callFloor(): ExpressionParsersResultsNum.Num {
        return new ExpressionParsersResultsNum.Num(this.getWar(), Math.floor(this._num));
    }

    private callCeil(): ExpressionParsersResultsNum.Num {
        return new ExpressionParsersResultsNum.Num(this.getWar(), Math.ceil(this._num));
    }
}
