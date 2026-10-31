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
    type Weathers_IManager,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";

export class Weather extends ExpressionParsers_Contexts_Base.Base {
    private static readonly VnExpiringPlayerIndex   = "expiringPlayerIndex";
    private static readonly VnExpiringTurnIndex     = "expiringTurnIndex";
    private static readonly VnWar                   = "war";

    private static readonly FnType                  = "type";

    public static readonly Variables    = Weather.generateVariables();
    public static readonly Functions    = Weather.generateFunctions();
    private static generateVariables(): ExpressionParsers_Types.EpVariableInfoDict {
        const variables = ExpressionParsers_Utils.extendVariableInfoDict(ExpressionParsers_Contexts_War.War.Variables);
        variables.set(Weather.VnExpiringPlayerIndex, { desc : Lang_Constants.TextType.A0459, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(Weather.VnExpiringTurnIndex,   { desc : Lang_Constants.TextType.A0460, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(Weather.VnWar,                 { desc : Lang_Constants.TextType.A0384, resultType : ExpressionParsers_Enums.ResultType.War,    isExtension : false });

        return variables;
    }
    private static generateFunctions(): ExpressionParsers_Types.EpFunctionInfoDict {
        const functions = ExpressionParsers_Utils.extendFunctionInfoDict(ExpressionParsers_Contexts_War.War.Functions);
        functions.set(
            Weather.FnType,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0456,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Weather.FnType, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWeather_GenerateFunctions_00,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Weather.FnType, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWeather_GenerateFunctions_01,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );

        return functions;
    }

    private readonly _weatherManager : Weathers_IManager.IManager;
    private _contextWar     : ExpressionParsers_Contexts_War.War | null = null;

    public constructor(weatherManager: Weathers_IManager.IManager) {
        super(weatherManager.getWar());

        this._weatherManager = weatherManager;
    }

    public getContextType(): ExpressionParsers_Enums.ContextType {
        return ExpressionParsers_Enums.ContextType.Weather;
    }

    public override resolveVariable(identifierName: string): ExpressionParsers_Results_Base.Base {
        const weatherManager = this._weatherManager;
        switch (identifierName) {
            case Weather.VnExpiringPlayerIndex : return new ExpressionParsers_Results_Num.Num(weatherManager.getWar(), weatherManager.getExpirePlayerIndex() ?? -1);
            case Weather.VnExpiringTurnIndex   : return new ExpressionParsers_Results_Num.Num(weatherManager.getWar(), weatherManager.getExpireTurnIndex() ?? -1);
            case Weather.VnWar                 : return new ExpressionParsers_Results_War.War(weatherManager.getWar());
            default                                     : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(weatherManager.getWar())).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsers_Results_Base.Base[], rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        switch (identifierName) {
            case Weather.FnType    : return this.callType(argumentArray[0]);
            default                         : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(this._weatherManager.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
    public callType(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Base.Base {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const weatherManager    = this._weatherManager;
        const num               = arg.num;
        const war               = weatherManager.getWar();
        if (num === 1) {
            return new ExpressionParsers_Results_Num.Num(war, weatherManager.getDefaultWeatherType());
        } else if (num === 2) {
            return new ExpressionParsers_Results_Num.Num(war, this._weatherManager.getForceWeatherType() ?? -1);
        } else {
            return new ExpressionParsers_Results_Num.Num(war, this._weatherManager.getCurrentWeatherType());
        }
    }
}
