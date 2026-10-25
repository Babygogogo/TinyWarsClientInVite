import { Base } from "./Base.ts";
import { War } from "./War.ts";
import { ResultType, ContextType } from "../Enums.ts";
import { FunctionInfo } from "../FunctionInfo.ts";
import type { Base as ExpressionParsersResultsBase } from "../results/Base.ts";
import { Num } from "../results/Num.ts";
import { War as ExpressionParsersResultsWar } from "../results/War.ts";
import type { EpVariableInfoDict, EpFunctionInfoDict } from "../Types.ts";
import { extendVariableInfoDict, extendFunctionInfoDict, getErrorTextForParameterCount, getErrorTextForParameterType } from "../Utils.ts";
import { newError } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import type { IManager } from "../../weathers/IManager.ts";

export class Weather extends Base {
    private static readonly VnExpiringPlayerIndex   = "expiringPlayerIndex";
    private static readonly VnExpiringTurnIndex     = "expiringTurnIndex";
    private static readonly VnWar                   = "war";

    private static readonly FnType                  = "type";

    public static readonly Variables    = Weather.generateVariables();
    public static readonly Functions    = Weather.generateFunctions();
    private static generateVariables(): EpVariableInfoDict {
        const variables = extendVariableInfoDict(War.Variables);
        variables.set(Weather.VnExpiringPlayerIndex, { desc: TextType.A0459, resultType: ResultType.Number, isExtension: false });
        variables.set(Weather.VnExpiringTurnIndex,   { desc: TextType.A0460, resultType: ResultType.Number, isExtension: false });
        variables.set(Weather.VnWar,                 { desc: TextType.A0384, resultType: ResultType.War,    isExtension: false });

        return variables;
    }
    private static generateFunctions(): EpFunctionInfoDict {
        const functions = extendFunctionInfoDict(War.Functions);
        functions.set(
            Weather.FnType,
            new FunctionInfo(
                TextType.A0456,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Weather.FnType, 1, argArray.length),
                            ClientErrorCode.EpContextWeather_GenerateFunctions_00
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Weather.FnType, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextWeather_GenerateFunctions_01
                        );
                    }

                    return ResultType.Number;
                },
            )
        );

        return functions;
    }

    private _weatherManager : IManager;
    private _contextWar     : War | null = null;

    public constructor(weatherManager: IManager) {
        super(weatherManager.getWar());

        this._weatherManager = weatherManager;
    }

    public getContextType(): ContextType {
        return ContextType.Weather;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase {
        const weatherManager = this._weatherManager;
        switch (identifierName) {
            case Weather.VnExpiringPlayerIndex : return new Num(weatherManager.getWar(), weatherManager.getExpirePlayerIndex() ?? -1);
            case Weather.VnExpiringTurnIndex   : return new Num(weatherManager.getWar(), weatherManager.getExpireTurnIndex() ?? -1);
            case Weather.VnWar                 : return new ExpressionParsersResultsWar(weatherManager.getWar());
            default                                     : return (this._contextWar ??= new War(weatherManager.getWar())).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase[], rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsBase {
        switch (identifierName) {
            case Weather.FnType    : return this.callType(argumentArray[0]);
            default                         : return (this._contextWar ??= new War(this._weatherManager.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
    public callType(arg: ExpressionParsersResultsBase): ExpressionParsersResultsBase {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const weatherManager    = this._weatherManager;
        const num               = arg.num;
        const war               = weatherManager.getWar();
        if (num === 1) {
            return new Num(war, weatherManager.getDefaultWeatherType());
        } else if (num === 2) {
            return new Num(war, this._weatherManager.getForceWeatherType() ?? -1);
        } else {
            return new Num(war, this._weatherManager.getCurrentWeatherType());
        }
    }
}
