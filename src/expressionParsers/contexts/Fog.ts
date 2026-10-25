import { Base } from "./Base.ts";
import { War } from "./War.ts";
import { ResultType, ContextType } from "../Enums.ts";
import { FunctionInfo } from "../FunctionInfo.ts";
import type { Base as ExpressionParsersResultsBase } from "../results/Base.ts";
import { Num } from "../results/Num.ts";
import { War as ExpressionParsersResultsWar } from "../results/War.ts";
import type { EpVariableInfoDict, EpFunctionInfoDict } from "../Types.ts";
import { extendVariableInfoDict, extendFunctionInfoDict, getErrorTextForParameterCount, getErrorTextForParameterType } from "../Utils.ts";
import type { IFogMap } from "../../fogMaps/IFogMap.ts";
import { newError } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getValueInInt32 } from "../../numbers/Utils.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class Fog extends Base {
    private static readonly VnWar           = "war";

    private static readonly FnEnabled       = "enabled";

    public static readonly Functions    = Fog.generateFunctions();
    public static readonly Variables    = Fog.generateVariables();
    private static generateVariables(): EpVariableInfoDict {
        const variables = extendVariableInfoDict(War.Variables);
        variables.set(Fog.VnWar,         { desc: TextType.A0384, resultType: ResultType.War, isExtension: false });

        return variables;
    }
    private static generateFunctions(): EpFunctionInfoDict {
        const functions = extendFunctionInfoDict(War.Functions);
        functions.set(
            Fog.FnEnabled,
            new FunctionInfo(
                TextType.A0457,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Fog.FnEnabled, `1`, argArray.length),
                            ClientErrorCode.EpContextFog_GenerateFunctions_00
                        );
                    }

                    const argResultType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argResultType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Fog.FnEnabled, 1, ResultType.Number, argResultType),
                            ClientErrorCode.EpContextFog_GenerateFunctions_01
                        );
                    }

                    return ResultType.Number;
                },
            )
        );

        return functions;
    }

    private _fogMap     : IFogMap;
    private _contextWar : War | null = null;

    public constructor(fogMap: IFogMap) {
        super(fogMap.getWar());

        this._fogMap = fogMap;
    }

    public getContextType(): ContextType {
        return ContextType.Fog;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase {
        switch (identifierName) {
            case Fog.VnWar     : return new ExpressionParsersResultsWar(this._fogMap.getWar());
            default                     : return (this._contextWar ??= new War(this._fogMap.getWar())).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase[], rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsBase {
        switch (identifierName) {
            case Fog.FnEnabled : return this.callEnabled(argumentArray[0]);
            default                     : return (this._contextWar ??= new War(this._fogMap.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
    private callEnabled(arg: ExpressionParsersResultsBase): Num {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const war = this.getWar();
        switch (getValueInInt32(arg.num)) {
            case 1  : return new Num(war, this._fogMap.checkHasFogByDefault() ? 1 : 0);
            default : return new Num(war, this._fogMap.checkHasFogCurrently() ? 1 : 0);
        }
    }
}
