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
import type * as WeathersIManager from "../../weathers/IManager.ts";

export class Weather extends ExpressionParsersContextsBase.Base {
    private static readonly VnExpiringPlayerIndex   = "expiringPlayerIndex";
    private static readonly VnExpiringTurnIndex     = "expiringTurnIndex";
    private static readonly VnWar                   = "war";

    private static readonly FnType                  = "type";

    public static readonly Variables    = Weather.generateVariables();
    public static readonly Functions    = Weather.generateFunctions();
    private static generateVariables(): ExpressionParsersTypes.EpVariableInfoDict {
        const variables = ExpressionParsersUtils.extendVariableInfoDict(ExpressionParsersContextsWar.War.Variables);
        variables.set(Weather.VnExpiringPlayerIndex, { desc: LangConstants.TextType.A0459, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(Weather.VnExpiringTurnIndex,   { desc: LangConstants.TextType.A0460, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(Weather.VnWar,                 { desc: LangConstants.TextType.A0384, resultType: ExpressionParsersEnums.ResultType.War,    isExtension: false });

        return variables;
    }
    private static generateFunctions(): ExpressionParsersTypes.EpFunctionInfoDict {
        const functions = ExpressionParsersUtils.extendFunctionInfoDict(ExpressionParsersContextsWar.War.Functions);
        functions.set(
            Weather.FnType,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0456,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Weather.FnType, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWeather_GenerateFunctions_00
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Weather.FnType, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWeather_GenerateFunctions_01
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );

        return functions;
    }

    private _weatherManager : WeathersIManager.IManager;
    private _contextWar     : ExpressionParsersContextsWar.War | null = null;

    public constructor(weatherManager: WeathersIManager.IManager) {
        super(weatherManager.getWar());

        this._weatherManager = weatherManager;
    }

    public getContextType(): ExpressionParsersEnums.ContextType {
        return ExpressionParsersEnums.ContextType.Weather;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase.Base {
        const weatherManager = this._weatherManager;
        switch (identifierName) {
            case Weather.VnExpiringPlayerIndex : return new ExpressionParsersResultsNum.Num(weatherManager.getWar(), weatherManager.getExpirePlayerIndex() ?? -1);
            case Weather.VnExpiringTurnIndex   : return new ExpressionParsersResultsNum.Num(weatherManager.getWar(), weatherManager.getExpireTurnIndex() ?? -1);
            case Weather.VnWar                 : return new ExpressionParsersResultsWar.War(weatherManager.getWar());
            default                                     : return (this._contextWar ??= new ExpressionParsersContextsWar.War(weatherManager.getWar())).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase.Base[], rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        switch (identifierName) {
            case Weather.FnType    : return this.callType(argumentArray[0]);
            default                         : return (this._contextWar ??= new ExpressionParsersContextsWar.War(this._weatherManager.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
    public callType(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsBase.Base {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const weatherManager    = this._weatherManager;
        const num               = arg.num;
        const war               = weatherManager.getWar();
        if (num === 1) {
            return new ExpressionParsersResultsNum.Num(war, weatherManager.getDefaultWeatherType());
        } else if (num === 2) {
            return new ExpressionParsersResultsNum.Num(war, this._weatherManager.getForceWeatherType() ?? -1);
        } else {
            return new ExpressionParsersResultsNum.Num(war, this._weatherManager.getCurrentWeatherType());
        }
    }
}
