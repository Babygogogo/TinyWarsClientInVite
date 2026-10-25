import { Base } from "./Base.ts";
import { War } from "./War.ts";
import { ResultType, ContextType } from "../Enums.ts";
import { FunctionInfo } from "../FunctionInfo.ts";
import type { Base as ExpressionParsersResultsBase } from "../results/Base.ts";
import { Num as ExpressionParsersResultsNum } from "../results/Num.ts";
import { War as ExpressionParsersResultsWar } from "../results/War.ts";
import type { EpVariableInfoDict, EpFunctionInfoDict } from "../Types.ts";
import { extendVariableInfoDict, extendFunctionInfoDict, getErrorTextForParameterCount } from "../Utils.ts";
import { newError } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class Num extends Base {
    private static readonly VnSelf      = "self";
    private static readonly VnWar       = "war";

    private static readonly FnAbs       = "abs";
    private static readonly FnFloor     = "floor";
    private static readonly FnCeil      = "ceil";

    public static readonly Variables    = Num.generateVariables();
    public static readonly Functions    = Num.generateFunctions();
    private static generateVariables(): EpVariableInfoDict {
        const variables = extendVariableInfoDict(War.Variables);
        variables.set(Num.VnSelf,   { desc: TextType.A0965, resultType: ResultType.Number,    isExtension: false } );
        variables.set(Num.VnWar,    { desc: TextType.A0384, resultType: ResultType.War,       isExtension: false } );

        return variables;
    }
    private static generateFunctions(): EpFunctionInfoDict {
        const functions = extendFunctionInfoDict(War.Functions);
        functions.set(
            Num.FnAbs,
            new FunctionInfo(
                TextType.A0522,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict) => {
                    if (argArray.length !== 0) {
                        throw newError(
                            getErrorTextForParameterCount(Num.FnAbs, 0, argArray.length),
                            ClientErrorCode.EpContextNumber_GenerateFunctions_00
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Num.FnFloor,
            new FunctionInfo(
                TextType.A0523,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict) => {
                    if (argArray.length !== 0) {
                        throw newError(
                            getErrorTextForParameterCount(Num.FnFloor, 0, argArray.length),
                            ClientErrorCode.EpContextNumber_GenerateFunctions_01
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            Num.FnCeil,
            new FunctionInfo(
                TextType.A0524,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict) => {
                    if (argArray.length !== 0) {
                        throw newError(
                            getErrorTextForParameterCount(Num.FnCeil, 0, argArray.length),
                            ClientErrorCode.EpContextNumber_GenerateFunctions_02
                        );
                    }

                    return ResultType.Number;
                },
            ),
        );

        return functions;
    }

    private readonly _num   : number;
    private _contextWar     : War | null = null;

    public constructor(data: ExpressionParsersResultsNum) {
        super(data.war);

        this._num = data.num;
    }

    public getContextType(): ContextType {
        return ContextType.Number;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase {
        const war = this.getWar();
        switch (identifierName) {
            case Num.VnSelf     : return new ExpressionParsersResultsNum(war, this._num);
            case Num.VnWar      : return new ExpressionParsersResultsWar(war);
            default                         : return (this._contextWar ??= new War(war)).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase[], rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsBase {
        switch (identifierName) {
            case Num.FnAbs      : return this.callAbs();
            case Num.FnFloor    : return this.callFloor();
            case Num.FnCeil     : return this.callCeil();
            default                         : return (this._contextWar ??= new War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }

    private callAbs(): ExpressionParsersResultsNum {
        return new ExpressionParsersResultsNum(this.getWar(), Math.abs(this._num));
    }

    private callFloor(): ExpressionParsersResultsNum {
        return new ExpressionParsersResultsNum(this.getWar(), Math.floor(this._num));
    }

    private callCeil(): ExpressionParsersResultsNum {
        return new ExpressionParsersResultsNum(this.getWar(), Math.ceil(this._num));
    }
}
