import {
    ExpressionParsers_Contexts_Base,
    Utils_ClientErrorCode,
    CustomCounters_Constants,
    ExpressionParsers_Enums,
    Helpers_Collection,
    ExpressionParsers_Results_FogMap,
    ExpressionParsers_FunctionInfo,
    ExpressionParsers_Utils,
    Lang_Utils,
    Numbers_Utils,
    AuxiliaryTypes_GridIndex,
    Numbers_Constants,
    Helpers_Misc,
    ExpressionParsers_Nodes_Lambda,
    ExpressionParsers_Results_NullableUnit,
    ExpressionParsers_Results_NullableUnitArray,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Results_NumArray,
    ExpressionParsers_Results_Player,
    ExpressionParsers_Results_PlayerArray,
    ExpressionParsers_Results_Position,
    ExpressionParsers_Results_PositionArray,
    ExpressionParsers_Results_Lambda,
    ExpressionParsers_Results_TaskObjective,
    Lang_Constants,
    ExpressionParsers_Results_Tile,
    ExpressionParsers_Results_TileArray,
    ExpressionParsers_Results_TileBuff,
    ExpressionParsers_Results_TileBuffArray,
    ExpressionParsers_Results_TurnManager,
    ExpressionParsers_Results_UnitStatistic,
    ExpressionParsers_Results_UnitStatisticArray,
    ExpressionParsers_Results_WarOperation,
    ExpressionParsers_Results_WeatherManager,
    type ExpressionParsers_Types,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
    type Tiles_Tile,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";

export class War extends ExpressionParsers_Contexts_Base.Base {
    private static readonly VnTurn                      = "turn";
    private static readonly VnWeather                   = "weather";
    private static readonly VnFog                       = "fog";

    private static readonly FnAbs                       = "abs";
    private static readonly FnFloor                     = "floor";
    private static readonly FnCeil                      = "ceil";
    private static readonly FnMin                       = "min";
    private static readonly FnMax                       = "max";
    private static readonly FnIsAmong                   = "isAmong";
    private static readonly FnRandom                    = "random";
    private static readonly FnRandomInt                 = "randomInt";
    private static readonly FnRandomPick                = "randomPick";
    private static readonly FnCustomCounter             = "customCounter";
    private static readonly FnPlayer                    = "player";
    private static readonly FnHasUnit                   = "hasUnit";
    private static readonly FnUnit                      = "unit";
    private static readonly FnTeamIndex                 = "teamIndex";
    private static readonly FnTile                      = "tile";
    private static readonly FnWarEventTriggeredTimes    = "warEventTriggeredTimes";
    private static readonly FnWarOperation              = "warOperation";
    private static readonly FnTaskObjective             = "taskObjective";
    private static readonly FnAllUnits                  = "allUnits";
    private static readonly FnAllTiles                  = "allTiles";
    private static readonly FnAllPlayers                = "allPlayers";
    private static readonly FnAllUnitStatistics         = "allUnitStatistics";
    private static readonly FnAllCustomCounterIds       = "allCustomCounterIds";
    private static readonly FnAllUnitTypes              = "allUnitTypes";
    private static readonly FnAllTileTypes              = "allTileTypes";
    private static readonly FnAllPositions              = "allPositions";
    private static readonly FnAllPersistentActionIds    = "allPersistentActionIds";
    private static readonly FnArray                     = "array";
    private static readonly FnMakePos                   = "makePos";
    private static readonly FnPow                       = "pow";
    private static readonly FnMoveCost                  = "moveCost";

    private static readonly ParameterTypesForIsAmong    = [
        ExpressionParsers_Enums.ResultType.Player,
        ExpressionParsers_Enums.ResultType.PlayerArray,
        ExpressionParsers_Enums.ResultType.Unit,
        ExpressionParsers_Enums.ResultType.UnitArray,
        ExpressionParsers_Enums.ResultType.Tile,
        ExpressionParsers_Enums.ResultType.TileArray,
        ExpressionParsers_Enums.ResultType.TileBuff,
        ExpressionParsers_Enums.ResultType.TileBuffArray,
        ExpressionParsers_Enums.ResultType.UnitStatistic,
        ExpressionParsers_Enums.ResultType.UnitStatisticArray,
        ExpressionParsers_Enums.ResultType.Number,
        ExpressionParsers_Enums.ResultType.NumberArray,
        ExpressionParsers_Enums.ResultType.Position,
        ExpressionParsers_Enums.ResultType.PositionArray,
    ];

    public static readonly Variables    = War.generateVariables();
    public static readonly Functions    = War.generateFunctions();
    private static generateVariables(): ExpressionParsers_Types.EpVariableInfoDict {
        const variables = new Map<string, ExpressionParsers_Types.EpVariableInfo>();
        variables.set(War.VnTurn,        { desc : Lang_Constants.TextType.A0447, resultType : ExpressionParsers_Enums.ResultType.Turn,    isExtension : false } );
        variables.set(War.VnWeather,     { desc : Lang_Constants.TextType.A0461, resultType : ExpressionParsers_Enums.ResultType.Weather, isExtension : false } );
        variables.set(War.VnFog,         { desc : Lang_Constants.TextType.A0458, resultType : ExpressionParsers_Enums.ResultType.Fog,     isExtension : false } );

        return variables;
    }
    private static generateFunctions(): ExpressionParsers_Types.EpFunctionInfoDict {
        const functions = new Map<string, ExpressionParsers_FunctionInfo.FunctionInfo>();
        functions.set(
            War.FnAbs,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0455,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnAbs, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_00,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(War.FnAbs, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_01,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            War.FnFloor,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0119,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnFloor, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_02,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(War.FnFloor, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_03,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            War.FnCeil,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0474,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnCeil, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_04,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(War.FnCeil, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_05,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            War.FnMin,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0468,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length < 2) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnMin, `>=2`, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_06,
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({
                            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                        });
                        if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                            throw Helpers_Misc.newError(
                                ExpressionParsers_Utils.getErrorTextForParameterType(War.FnMin, i + 1, ExpressionParsers_Enums.ResultType.Number, argType),
                                Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_07,
                            );
                        }
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            War.FnMax,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0469,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length < 2) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnMax, `>=2`, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_08,
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({
                            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                        });
                        if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                            throw Helpers_Misc.newError(
                                ExpressionParsers_Utils.getErrorTextForParameterType(War.FnMax, i + 1, ExpressionParsers_Enums.ResultType.Number, argType),
                                Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_09,
                            );
                        }
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            War.FnIsAmong,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0130,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length < 2) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnIsAmong, `>=2`, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_10,
                        );
                    }

                    const argType0 = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (War.ParameterTypesForIsAmong.indexOf(argType0) < 0) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(War.FnIsAmong, 1, War.ParameterTypesForIsAmong, argType0),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_11,
                        );
                    }

                    for (let i = 1; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({
                            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                        });
                        if (argType !== argType0) {
                            throw Helpers_Misc.newError(
                                ExpressionParsers_Utils.getErrorTextForParameterType(War.FnIsAmong, i + 1, argType0, argType),
                                Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_12,
                            );
                        }
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            War.FnRandom,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0120,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict) => {
                    if (argArray.length !== 0) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnRandom, 0, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_13,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            War.FnRandomInt,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0525,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnRandomInt, 2, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_14,
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({
                            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                        });
                        if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                            throw Helpers_Misc.newError(
                                ExpressionParsers_Utils.getErrorTextForParameterType(War.FnRandomInt, i + 1, ExpressionParsers_Enums.ResultType.Number, argType),
                                Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_15,
                            );
                        }
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            War.FnRandomPick,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0661,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 3) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnRandomPick, 3, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_16,
                        );
                    }

                    const arg0                  = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    const supportedArg0Array    = [
                        ExpressionParsers_Enums.ResultType.NumberArray,
                        ExpressionParsers_Enums.ResultType.PlayerArray,
                        ExpressionParsers_Enums.ResultType.PositionArray,
                        ExpressionParsers_Enums.ResultType.TileArray,
                        ExpressionParsers_Enums.ResultType.UnitArray,
                        ExpressionParsers_Enums.ResultType.UnitStatisticArray,
                        ExpressionParsers_Enums.ResultType.TileBuffArray,
                    ];
                    if (supportedArg0Array.indexOf(arg0) < 0) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(War.FnRandomPick, 1, supportedArg0Array, arg0),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_17,
                        );
                    }

                    for (let i = 1; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({
                            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                        });
                        if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                            throw Helpers_Misc.newError(
                                ExpressionParsers_Utils.getErrorTextForParameterType(War.FnRandomPick, i + 1, ExpressionParsers_Enums.ResultType.Number, argType),
                                Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_18,
                            );
                        }
                    }

                    return arg0;
                },
            ),
        );
        functions.set(
            War.FnCustomCounter,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0121,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnCustomCounter, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_19,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(War.FnCustomCounter, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_20,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            War.FnPlayer,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0385,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnPlayer, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_21,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(War.FnPlayer, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_22,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Player;
                },
            ),
        );
        functions.set(
            War.FnHasUnit,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0122,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnHasUnit, 2, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_23,
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({
                            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                        });
                        if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                            throw Helpers_Misc.newError(
                                ExpressionParsers_Utils.getErrorTextForParameterType(War.FnHasUnit, i + 1, ExpressionParsers_Enums.ResultType.Number, argType),
                                Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_24,
                            );
                        }
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            War.FnUnit,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0467,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnUnit, 2, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_25,
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({
                            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                        });
                        if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                            throw Helpers_Misc.newError(
                                ExpressionParsers_Utils.getErrorTextForParameterType(War.FnUnit, i + 1, ExpressionParsers_Enums.ResultType.Number, argType),
                                Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_26,
                            );
                        }
                    }

                    return ExpressionParsers_Enums.ResultType.Unit;
                },
            ),
        );
        functions.set(
            War.FnTeamIndex,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0142,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnTeamIndex, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_27,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(War.FnTeamIndex, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_28,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            War.FnTile,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0413,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnTile, 2, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_29,
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({
                            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                        });
                        if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                            throw Helpers_Misc.newError(
                                ExpressionParsers_Utils.getErrorTextForParameterType(War.FnTile, i + 1, ExpressionParsers_Enums.ResultType.Number, argType),
                                Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_30,
                            );
                        }
                    }

                    return ExpressionParsers_Enums.ResultType.Tile;
                },
            ),
        );
        functions.set(
            War.FnWarEventTriggeredTimes,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0702,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnWarEventTriggeredTimes, 2, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_31,
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({
                            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                        });
                        if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                            throw Helpers_Misc.newError(
                                ExpressionParsers_Utils.getErrorTextForParameterType(War.FnWarEventTriggeredTimes, i + 1, ExpressionParsers_Enums.ResultType.Number, argType),
                                Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_32,
                            );
                        }
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            War.FnWarOperation,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0706,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnWarOperation, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_33,
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({
                            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                        });
                        if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                            throw Helpers_Misc.newError(
                                ExpressionParsers_Utils.getErrorTextForParameterType(War.FnWarOperation, i + 1, ExpressionParsers_Enums.ResultType.Number, argType),
                                Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_34,
                            );
                        }
                    }

                    return ExpressionParsers_Enums.ResultType.WarOperation;
                },
            ),
        );
        functions.set(
            War.FnTaskObjective,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0726,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnTaskObjective, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_35,
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({
                            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                        });
                        if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                            throw Helpers_Misc.newError(
                                ExpressionParsers_Utils.getErrorTextForParameterType(War.FnTaskObjective, i + 1, ExpressionParsers_Enums.ResultType.Number, argType),
                                Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_36,
                            );
                        }
                    }

                    return ExpressionParsers_Enums.ResultType.TaskObjective;
                },
            ),
        );
        functions.set(
            War.FnAllUnits,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0479,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnAllUnits, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_37,
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(War.FnAllUnits, 1, ExpressionParsers_Enums.ResultType.Lambda, lambda.getResultType({
                                contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                            })),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_38,
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                    : contextType,
                        directLambdaArgumentInfoArray  : [ExpressionParsers_Enums.ResultType.Unit],
                        indirectLambdaArgumentInfoDict : lambdaArgumentInfoDict,
                        localVariableDict              : localVariableDict,
                        customCounterNameSet           : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForLambdaResultType(War.FnAllUnits, 1, [ExpressionParsers_Enums.ResultType.Number], lambdaResultType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_39,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.UnitArray;
                },
            ),
        );
        functions.set(
            War.FnAllTiles,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0493,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnAllTiles, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_40,
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(War.FnAllTiles, 1, ExpressionParsers_Enums.ResultType.Lambda, lambda.getResultType({
                                contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                            })),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_41,
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                    : contextType,
                        directLambdaArgumentInfoArray  : [ExpressionParsers_Enums.ResultType.Tile],
                        indirectLambdaArgumentInfoDict : lambdaArgumentInfoDict,
                        localVariableDict              : localVariableDict,
                        customCounterNameSet           : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForLambdaResultType(War.FnAllTiles, 1, [ExpressionParsers_Enums.ResultType.Number], lambdaResultType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_42,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.TileArray;
                },
            ),
        );
        functions.set(
            War.FnAllPlayers,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0494,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnAllPlayers, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_43,
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(War.FnAllPlayers, 1, ExpressionParsers_Enums.ResultType.Lambda, lambda.getResultType({
                                contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                            })),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_44,
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                    : contextType,
                        directLambdaArgumentInfoArray  : [ExpressionParsers_Enums.ResultType.Player],
                        indirectLambdaArgumentInfoDict : lambdaArgumentInfoDict,
                        localVariableDict              : localVariableDict,
                        customCounterNameSet           : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForLambdaResultType(War.FnAllPlayers, 1, [ExpressionParsers_Enums.ResultType.Number], lambdaResultType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_45,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.PlayerArray;
                },
            ),
        );
        functions.set(
            War.FnAllUnitStatistics,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0512,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnAllUnitStatistics, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_46,
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(War.FnAllUnitStatistics, 1, ExpressionParsers_Enums.ResultType.Lambda, lambda.getResultType({
                                contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                            })),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_47,
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                    : contextType,
                        directLambdaArgumentInfoArray  : [ExpressionParsers_Enums.ResultType.UnitStatistic],
                        indirectLambdaArgumentInfoDict : lambdaArgumentInfoDict,
                        localVariableDict              : localVariableDict,
                        customCounterNameSet           : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForLambdaResultType(War.FnAllUnitStatistics, 1, [ExpressionParsers_Enums.ResultType.Number], lambdaResultType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_48,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.UnitStatisticArray;
                },
            ),
        );
        functions.set(
            War.FnAllCustomCounterIds,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0529,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnAllCustomCounterIds, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_49,
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(War.FnAllCustomCounterIds, 1, ExpressionParsers_Enums.ResultType.Lambda, lambda.getResultType({
                                contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                            })),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_50,
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                    : contextType,
                        directLambdaArgumentInfoArray  : [ExpressionParsers_Enums.ResultType.Number],
                        indirectLambdaArgumentInfoDict : lambdaArgumentInfoDict,
                        localVariableDict              : localVariableDict,
                        customCounterNameSet           : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForLambdaResultType(War.FnAllCustomCounterIds, 1, [ExpressionParsers_Enums.ResultType.Number], lambdaResultType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_51,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.NumberArray;
                },
            ),
        );
        functions.set(
            War.FnAllUnitTypes,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0700,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnAllUnitTypes, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_52,
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(War.FnAllUnitTypes, 1, ExpressionParsers_Enums.ResultType.Lambda, lambda.getResultType({
                                contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                            })),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_53,
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                    : contextType,
                        directLambdaArgumentInfoArray  : [ExpressionParsers_Enums.ResultType.Number],
                        indirectLambdaArgumentInfoDict : lambdaArgumentInfoDict,
                        localVariableDict              : localVariableDict,
                        customCounterNameSet           : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForLambdaResultType(War.FnAllUnitTypes, 1, [ExpressionParsers_Enums.ResultType.Number], lambdaResultType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_54,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.NumberArray;
                },
            ),
        );
        functions.set(
            War.FnAllTileTypes,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0701,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnAllTileTypes, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_55,
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(War.FnAllTileTypes, 1, ExpressionParsers_Enums.ResultType.Lambda, lambda.getResultType({
                                contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                            })),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_56,
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                    : contextType,
                        directLambdaArgumentInfoArray  : [ExpressionParsers_Enums.ResultType.Number],
                        indirectLambdaArgumentInfoDict : lambdaArgumentInfoDict,
                        localVariableDict              : localVariableDict,
                        customCounterNameSet           : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForLambdaResultType(War.FnAllTileTypes, 1, [ExpressionParsers_Enums.ResultType.Number], lambdaResultType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_57,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.NumberArray;
                },
            ),
        );
        functions.set(
            War.FnAllPositions,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0578,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnAllPositions, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_58,
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(War.FnAllPositions, 1, ExpressionParsers_Enums.ResultType.Lambda, lambda.getResultType({
                                contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                            })),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_59,
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                    : contextType,
                        directLambdaArgumentInfoArray  : [ExpressionParsers_Enums.ResultType.Position],
                        indirectLambdaArgumentInfoDict : lambdaArgumentInfoDict,
                        localVariableDict              : localVariableDict,
                        customCounterNameSet           : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForLambdaResultType(War.FnAllPositions, 1, [ExpressionParsers_Enums.ResultType.Number], lambdaResultType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_60,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.PositionArray;
                },
            ),
        );
        functions.set(
            War.FnAllPersistentActionIds,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0703,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnAllPersistentActionIds, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_61,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(War.FnAllPersistentActionIds, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_62,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.NumberArray;
                },
            ),
        );
        functions.set(
            War.FnArray,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0498,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length < 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnArray, `>=1`, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_63,
                        );
                    }

                    const argType0 = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if ((argType0 !== ExpressionParsers_Enums.ResultType.Number)          &&
                        (argType0 !== ExpressionParsers_Enums.ResultType.Player)          &&
                        (argType0 !== ExpressionParsers_Enums.ResultType.Tile)            &&
                        (argType0 !== ExpressionParsers_Enums.ResultType.TileBuff)        &&
                        (argType0 !== ExpressionParsers_Enums.ResultType.Unit)            &&
                        (argType0 !== ExpressionParsers_Enums.ResultType.UnitStatistic)   &&
                        (argType0 !== ExpressionParsers_Enums.ResultType.Position)
                    ) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(
                                War.FnArray,
                                1,
                                [
                                    ExpressionParsers_Enums.ResultType.Number,
                                    ExpressionParsers_Enums.ResultType.Player,
                                    ExpressionParsers_Enums.ResultType.Tile,
                                    ExpressionParsers_Enums.ResultType.TileBuff,
                                    ExpressionParsers_Enums.ResultType.Unit,
                                    ExpressionParsers_Enums.ResultType.UnitStatistic,
                                    ExpressionParsers_Enums.ResultType.Position,
                                ],
                                argType0,
                            ),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_64,
                        );
                    }

                    for (let i = 1; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({
                            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                        });
                        if (argType !== argType0) {
                            throw Helpers_Misc.newError(
                                ExpressionParsers_Utils.getErrorTextForParameterType(War.FnArray, i + 1, argType0, argType),
                                Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_65,
                            );
                        }
                    }

                    switch (argType0) {
                        case ExpressionParsers_Enums.ResultType.Number        : return ExpressionParsers_Enums.ResultType.NumberArray;
                        case ExpressionParsers_Enums.ResultType.Player        : return ExpressionParsers_Enums.ResultType.PlayerArray;
                        case ExpressionParsers_Enums.ResultType.Tile          : return ExpressionParsers_Enums.ResultType.TileArray;
                        case ExpressionParsers_Enums.ResultType.TileBuff      : return ExpressionParsers_Enums.ResultType.TileBuffArray;
                        case ExpressionParsers_Enums.ResultType.Unit          : return ExpressionParsers_Enums.ResultType.UnitArray;
                        case ExpressionParsers_Enums.ResultType.UnitStatistic : return ExpressionParsers_Enums.ResultType.UnitStatisticArray;
                        case ExpressionParsers_Enums.ResultType.Position      : return ExpressionParsers_Enums.ResultType.PositionArray;
                        default                         : throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(
                                War.FnArray,
                                1,
                                [
                                    ExpressionParsers_Enums.ResultType.Number,
                                    ExpressionParsers_Enums.ResultType.Player,
                                    ExpressionParsers_Enums.ResultType.Tile,
                                    ExpressionParsers_Enums.ResultType.TileBuff,
                                    ExpressionParsers_Enums.ResultType.Unit,
                                    ExpressionParsers_Enums.ResultType.UnitStatistic,
                                    ExpressionParsers_Enums.ResultType.Position,
                                ],
                                argType0,
                            ),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_66,
                        );
                    }
                },
            ),
        );
        functions.set(
            War.FnMakePos,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0579,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnMakePos, 2, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_67,
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({
                            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                        });
                        if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                            throw Helpers_Misc.newError(
                                ExpressionParsers_Utils.getErrorTextForParameterType(War.FnMakePos, i + 1, ExpressionParsers_Enums.ResultType.Number, argType),
                                Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_68,
                            );
                        }
                    }

                    return ExpressionParsers_Enums.ResultType.Position;
                },
            ),
        );
        functions.set(
            War.FnPow,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0855,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnPow, 2, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_69,
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({
                            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                        });
                        if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                            throw Helpers_Misc.newError(
                                ExpressionParsers_Utils.getErrorTextForParameterType(War.FnPow, i + 1, ExpressionParsers_Enums.ResultType.Number, argType),
                                Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_70,
                            );
                        }
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            War.FnMoveCost,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0928,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(War.FnMoveCost, 2, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_71,
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({
                            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                        });
                        if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                            throw Helpers_Misc.newError(
                                ExpressionParsers_Utils.getErrorTextForParameterType(War.FnMoveCost, i + 1, ExpressionParsers_Enums.ResultType.Number, argType),
                                Utils_ClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_72,
                            );
                        }
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );

        return functions;
    }

    public constructor(war: BaseWar_Interface_IBwWar.IBwWar) {
        super(war);
    }

    public getContextType(): ExpressionParsers_Enums.ContextType {
        return ExpressionParsers_Enums.ContextType.War;
    }

    public override resolveVariable(identifierName: string): ExpressionParsers_Results_Base.Base {
        const war = this.getWar();
        switch (identifierName) {
            case War.VnTurn        : return new ExpressionParsers_Results_TurnManager.TurnManager(war.getTurnManager());
            case War.VnWeather     : return new ExpressionParsers_Results_WeatherManager.WeatherManager(war.getWeatherManager());
            case War.VnFog         : return new ExpressionParsers_Results_FogMap.FogMap(war.getFogMap());
            default                         : throw Helpers_Misc.newError(
                Lang_Utils.getFormattedText(Lang_Constants.TextType.F0021, identifierName),
                Utils_ClientErrorCode.ClientErrorCode.EpContextWar_ResolveVariable_00,
            );
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsers_Results_Base.Base[], rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        switch (identifierName) {
            case War.FnAbs                     : return this.callAbs(argumentArray[0]);
            case War.FnFloor                   : return this.callFloor(argumentArray[0]);
            case War.FnCeil                    : return this.callCeil(argumentArray[0]);
            case War.FnMin                     : return this.callMin(argumentArray);
            case War.FnMax                     : return this.callMax(argumentArray);
            case War.FnIsAmong                 : return this.callIsAmong(argumentArray);
            case War.FnRandom                  : return this.callRandom(isRestricted);
            case War.FnRandomInt               : return this.callRandomInt(argumentArray, isRestricted);
            case War.FnRandomPick              : return this.callRandomPick(argumentArray, isRestricted);
            case War.FnCustomCounter           : return this.callCustomCounter(argumentArray[0]);
            case War.FnPlayer                  : return this.callPlayer(argumentArray[0]);
            case War.FnHasUnit                 : return this.callHasUnit(argumentArray[0], argumentArray[1]);
            case War.FnUnit                    : return this.callUnit(argumentArray[0], argumentArray[1]);
            case War.FnTeamIndex               : return this.callTeamIndex(argumentArray[0]);
            case War.FnTile                    : return this.callTile(argumentArray[0], argumentArray[1]);
            case War.FnWarEventTriggeredTimes  : return this.callWarEventTriggeredTimes(argumentArray[0], argumentArray[1]);
            case War.FnWarOperation            : return this.callWarOperation(argumentArray[0]);
            case War.FnTaskObjective           : return this.callTaskObjective(argumentArray[0]);
            case War.FnAllUnits                : return this.callAllUnits(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case War.FnAllTiles                : return this.callAllTiles(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case War.FnAllPlayers              : return this.callAllPlayers(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case War.FnAllUnitStatistics       : return this.callAllUnitStatistics(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case War.FnAllCustomCounterIds     : return this.callAllCustomCounterIds(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case War.FnAllUnitTypes            : return this.callAllUnitTypes(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case War.FnAllTileTypes            : return this.callAllTileTypes(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case War.FnAllPositions            : return this.callAllPositions(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case War.FnAllPersistentActionIds  : return this.callAllPersistentActionIds(argumentArray[0]);
            case War.FnArray                   : return this.callArray(argumentArray);
            case War.FnMakePos                 : return this.callMakePos(argumentArray);
            case War.FnPow                     : return this.callPow(argumentArray);
            case War.FnMoveCost                : return this.callMoveCost(argumentArray);
            default                                     : throw Helpers_Misc.newError(
                Lang_Utils.getFormattedText(Lang_Constants.TextType.F0024, identifierName),
                Utils_ClientErrorCode.ClientErrorCode.EpContextWar_CallFunction_00,
            );
        }
    }

    private callAbs(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        return new ExpressionParsers_Results_Num.Num(arg.war, Math.abs(arg.num));
    }

    private callFloor(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        return new ExpressionParsers_Results_Num.Num(arg.war, Math.floor(arg.num));
    }

    private callCeil(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        return new ExpressionParsers_Results_Num.Num(arg.war, Math.ceil(arg.num));
    }

    private callMin(argArray: ExpressionParsers_Results_Base.Base[]): ExpressionParsers_Results_Num.Num {
        if (!argArray.length) {
            throw Helpers_Misc.newError(`Empty argArray.`);
        }
        const numArray = argArray.map(v => {
            if (v instanceof ExpressionParsers_Results_Num.Num) {
                return v.num;
            } else {
                throw Helpers_Misc.newError(`Unexpected argArray.`);
            }
        });

        return new ExpressionParsers_Results_Num.Num(this.getWar(), Math.min(...numArray));
    }

    private callMax(argArray: ExpressionParsers_Results_Base.Base[]): ExpressionParsers_Results_Num.Num {
        if (!argArray.length) {
            throw Helpers_Misc.newError(`Empty argArray.`);
        }
        const numArray = argArray.map(v => {
            if (v instanceof ExpressionParsers_Results_Num.Num) {
                return v.num;
            } else {
                throw Helpers_Misc.newError(`Unexpected argArray.`);
            }
        });

        return new ExpressionParsers_Results_Num.Num(this.getWar(), Math.max(...numArray));
    }

    public callIsAmong(argumentArray: ExpressionParsers_Results_Base.Base[]): ExpressionParsers_Results_Num.Num {
        const v = argumentArray[0];
        for (let i = 1; i < argumentArray.length; ++i) {
            if (v.checkIsEqual(argumentArray[i])) {
                return new ExpressionParsers_Results_Num.Num(this.getWar(), 1);
            }
        }

        return new ExpressionParsers_Results_Num.Num(this.getWar(), 0);
    }

    public callRandom(isRestricted: boolean): ExpressionParsers_Results_Num.Num {
        if (isRestricted) {
            throw Helpers_Misc.newError(`Restricted.`);
        }

        const war = this.getWar();
        return new ExpressionParsers_Results_Num.Num(war, war.getRandomNumberManager().getAndTickNextNumber());
    }

    public callRandomInt(argArray: ExpressionParsers_Results_Base.Base[], isRestricted: boolean): ExpressionParsers_Results_Num.Num {
        if (isRestricted) {
            throw Helpers_Misc.newError(`Restricted.`);
        }

        const arg0 = argArray[0];
        if (!(arg0 instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg0.`);
        }

        const arg1 = argArray[1];
        if (!(arg1 instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg1.`);
        }

        const lowerLimit    = Math.ceil(arg0.num);
        const upperLimit    = Math.floor(arg1.num);
        if ((!isFinite(lowerLimit)) || (!isFinite(upperLimit)) || (lowerLimit >= upperLimit)) {
            throw Helpers_Misc.newError(`Invalid limits: ${lowerLimit}, ${upperLimit}`);
        }

        const war = this.getWar();
        return new ExpressionParsers_Results_Num.Num(war, Math.floor(war.getRandomNumberManager().getAndTickNextNumber() * (upperLimit - lowerLimit) + lowerLimit));
    }

    private callRandomPick(argArray: ExpressionParsers_Results_Base.Base[], isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        if (isRestricted) {
            throw Helpers_Misc.newError(`Restricted.`);
        }

        const count = argArray[1];
        if (!(count instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Invalid argArray[1].`);
        }

        const rawNeedSort = argArray[2];
        if (!(rawNeedSort instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Invalid argArray[2].`);
        }

        const needSort  = rawNeedSort.num !== 0;
        const src       = argArray[0];
        if (src instanceof ExpressionParsers_Results_NumArray.NumArray) {
            return this.callRandomPickNumberArray(src, count.num, needSort);
        } else if (src instanceof ExpressionParsers_Results_PlayerArray.PlayerArray) {
            return this.callRandomPickPlayerArray(src, count.num, needSort);
        } else if (src instanceof ExpressionParsers_Results_PositionArray.PositionArray) {
            return this.callRandomPickPositionArray(src, count.num, needSort);
        } else if (src instanceof ExpressionParsers_Results_TileArray.TileArray) {
            return this.callRandomPickTileArray(src, count.num, needSort);
        } else if (src instanceof ExpressionParsers_Results_TileBuffArray.TileBuffArray) {
            return this.callRandomPickTileBuffArray(src, count.num, needSort);
        } else if (src instanceof ExpressionParsers_Results_NullableUnitArray.NullableUnitArray) {
            return this.callRandomPickUnitArray(src, count.num, needSort);
        } else if (src instanceof ExpressionParsers_Results_UnitStatisticArray.UnitStatisticArray) {
            return this.callRandomPickUnitStatisticsArray(src, count.num, needSort);
        } else {
            throw Helpers_Misc.newError(`Invalid argArray[0].`);
        }
    }
    private callRandomPickNumberArray(src: ExpressionParsers_Results_NumArray.NumArray, rawCount: number, needSort: boolean): ExpressionParsers_Results_NumArray.NumArray {
        const war         = this.getWar();
        const srcArray    = src.numberArray;
        const srcCount    = srcArray.length;
        const dstCount    = Numbers_Utils.getValueInRange({
            minValue : 0,
            maxValue : srcCount,
            rawValue : Math.floor(rawCount),
        });
        if (dstCount <= 0) {
            return new ExpressionParsers_Results_NumArray.NumArray(war, []);
        }
        if ((dstCount === srcCount) && (needSort)) {
            return src;
        }

        const indexList   = this.getRandomIndexList(srcCount, dstCount, needSort);
        const dstArray    : number[] = [];
        for (let i = 0; i < dstCount; ++i) {
            dstArray[i] = srcArray[indexList[i]];
        }
        return new ExpressionParsers_Results_NumArray.NumArray(war, dstArray);
    }
    private callRandomPickPlayerArray(src: ExpressionParsers_Results_PlayerArray.PlayerArray, rawCount: number, needSort: boolean): ExpressionParsers_Results_PlayerArray.PlayerArray {
        const war         = this.getWar();
        const srcArray    = src.array;
        const srcCount    = srcArray.length;
        const dstCount    = Numbers_Utils.getValueInRange({
            minValue : 0,
            maxValue : srcCount,
            rawValue : Math.floor(rawCount),
        });
        if (dstCount <= 0) {
            return new ExpressionParsers_Results_PlayerArray.PlayerArray(war, []);
        }
        if ((dstCount === srcCount) && (needSort)) {
            return src;
        }

        const indexList   = this.getRandomIndexList(srcCount, dstCount, needSort);
        const dstArray    : Players_IPlayer.IPlayer[] = [];
        for (let i = 0; i < dstCount; ++i) {
            dstArray[i] = srcArray[indexList[i]];
        }
        return new ExpressionParsers_Results_PlayerArray.PlayerArray(war, dstArray);
    }
    private callRandomPickPositionArray(src: ExpressionParsers_Results_PositionArray.PositionArray, rawCount: number, needSort: boolean): ExpressionParsers_Results_PositionArray.PositionArray {
        const war         = this.getWar();
        const srcArray    = src.positionArray;
        const srcCount    = srcArray.length;
        const dstCount    = Numbers_Utils.getValueInRange({
            minValue : 0,
            maxValue : srcCount,
            rawValue : Math.floor(rawCount),
        });
        if (dstCount <= 0) {
            return new ExpressionParsers_Results_PositionArray.PositionArray(war, []);
        }
        if ((dstCount === srcCount) && (needSort)) {
            return src;
        }

        const indexList   = this.getRandomIndexList(srcCount, dstCount, needSort);
        const dstArray    : ExpressionParsers_Results_Position.Position[] = [];
        for (let i = 0; i < dstCount; ++i) {
            dstArray[i] = srcArray[indexList[i]];
        }
        return new ExpressionParsers_Results_PositionArray.PositionArray(war, dstArray);
    }
    private callRandomPickTileArray(src: ExpressionParsers_Results_TileArray.TileArray, rawCount: number, needSort: boolean): ExpressionParsers_Results_TileArray.TileArray {
        const war         = this.getWar();
        const srcArray    = src.array;
        const srcCount    = srcArray.length;
        const dstCount    = Numbers_Utils.getValueInRange({
            minValue : 0,
            maxValue : srcCount,
            rawValue : Math.floor(rawCount),
        });
        if (dstCount <= 0) {
            return new ExpressionParsers_Results_TileArray.TileArray(war, []);
        }
        if ((dstCount === srcCount) && (needSort)) {
            return src;
        }

        const indexList   = this.getRandomIndexList(srcCount, dstCount, needSort);
        const dstArray    : Tiles_Tile.Tile[] = [];
        for (let i = 0; i < dstCount; ++i) {
            dstArray[i] = srcArray[indexList[i]];
        }
        return new ExpressionParsers_Results_TileArray.TileArray(war, dstArray);
    }
    private callRandomPickTileBuffArray(src: ExpressionParsers_Results_TileBuffArray.TileBuffArray, rawCount: number, needSort: boolean): ExpressionParsers_Results_TileBuffArray.TileBuffArray {
        const war         = this.getWar();
        const srcArray    = src.buffArray;
        const srcCount    = srcArray.length;
        const dstCount    = Numbers_Utils.getValueInRange({
            minValue : 0,
            maxValue : srcCount,
            rawValue : Math.floor(rawCount),
        });
        if (dstCount <= 0) {
            return new ExpressionParsers_Results_TileBuffArray.TileBuffArray(war, []);
        }
        if ((dstCount === srcCount) && (needSort)) {
            return src;
        }

        const indexList   = this.getRandomIndexList(srcCount, dstCount, needSort);
        const dstArray    : ExpressionParsers_Results_TileBuff.TileBuff[] = [];
        for (let i = 0; i < dstCount; ++i) {
            dstArray[i] = srcArray[indexList[i]];
        }
        return new ExpressionParsers_Results_TileBuffArray.TileBuffArray(war, dstArray);
    }
    private callRandomPickUnitArray(src: ExpressionParsers_Results_NullableUnitArray.NullableUnitArray, rawCount: number, needSort: boolean): ExpressionParsers_Results_NullableUnitArray.NullableUnitArray {
        const war         = this.getWar();
        const srcArray    = src.array;
        const srcCount    = srcArray.length;
        const dstCount    = Numbers_Utils.getValueInRange({
            minValue : 0,
            maxValue : srcCount,
            rawValue : Math.floor(rawCount),
        });
        if (dstCount <= 0) {
            return new ExpressionParsers_Results_NullableUnitArray.NullableUnitArray(war, []);
        }
        if ((dstCount === srcCount) && (needSort)) {
            return src;
        }

        const indexList   = this.getRandomIndexList(srcCount, dstCount, needSort);
        const dstArray    : ExpressionParsers_Results_NullableUnit.NullableUnit[] = [];
        for (let i = 0; i < dstCount; ++i) {
            dstArray[i] = srcArray[indexList[i]];
        }
        return new ExpressionParsers_Results_NullableUnitArray.NullableUnitArray(war, dstArray);
    }
    private callRandomPickUnitStatisticsArray(src: ExpressionParsers_Results_UnitStatisticArray.UnitStatisticArray, rawCount: number, needSort: boolean): ExpressionParsers_Results_UnitStatisticArray.UnitStatisticArray {
        const war         = this.getWar();
        const srcArray    = src.dataArray;
        const srcCount    = srcArray.length;
        const dstCount    = Numbers_Utils.getValueInRange({
            minValue : 0,
            maxValue : srcCount,
            rawValue : Math.floor(rawCount),
        });
        if (dstCount <= 0) {
            return new ExpressionParsers_Results_UnitStatisticArray.UnitStatisticArray(war, []);
        }
        if ((dstCount === srcCount) && (needSort)) {
            return src;
        }

        const indexList   = this.getRandomIndexList(srcCount, dstCount, needSort);
        const dstArray    : ExpressionParsers_Results_UnitStatistic.UnitStatistic[] = [];
        for (let i = 0; i < dstCount; ++i) {
            dstArray[i] = srcArray[indexList[i]];
        }
        return new ExpressionParsers_Results_UnitStatisticArray.UnitStatisticArray(war, dstArray);
    }
    private getRandomIndexList(srcCount: number, dstCount: number, needSort: boolean): number[] {
        const srcArray            = Helpers_Collection.createRange(0, srcCount, 1);
        const dstList             : number[] = [];
        const randomNumberManager = this.getWar().getRandomNumberManager();
        for (let i = 0; i < dstCount; ++i) {
            const index = Math.floor(randomNumberManager.getAndTickNextNumber() * (srcCount - i));
            dstList.push(srcArray[index]);
            srcArray[index] = srcArray[srcCount - i - 1];
        }
        if (needSort) {
            dstList.sort((v1, v2) => v1 - v2);
        }
        return dstList;
    }

    public callCustomCounter(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const customCounterId = arg.num;
        if (customCounterId !== Math.floor(customCounterId)) {
            throw Helpers_Misc.newError(`Invalid customCounterId: ${customCounterId}`);
        }

        const war = this.getWar();
        if ((customCounterId > CustomCounters_Constants.Constants.MaxId) ||
            (customCounterId < CustomCounters_Constants.Constants.MinId)
        ) {
            return new ExpressionParsers_Results_Num.Num(war, 0);
        }

        return new ExpressionParsers_Results_Num.Num(war, war.getWarEventManager().getCustomCounter(customCounterId));
    }

    public callPlayer(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Player.Player {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const playerIndex = arg.num;
        if (playerIndex !== Math.floor(playerIndex)) {
            throw Helpers_Misc.newError(`Invalid playerIndex: ${playerIndex}`);
        }
        return new ExpressionParsers_Results_Player.Player(this.getWar().getPlayer(playerIndex));
    }

    public callHasUnit(argX: ExpressionParsers_Results_Base.Base, argY: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        if (!(argX instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected argX.`);
        }
        if (!(argY instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected argY.`);
        }

        const x = argX.num;
        const y = argY.num;
        if ((x !== Math.floor(x)) || (y !== Math.floor(y))) {
            throw Helpers_Misc.newError(`Invalid xy: ${x}, ${y}`);
        }

        const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(x, y);
        const war       = this.getWar();
        const unitMap   = war.getUnitMap();
        if (!gridIndex.checkIsInsideMap(unitMap.getMapSize())) {
            throw Helpers_Misc.newError(`Out of map, xy: ${x}, ${y}`);
        }

        return new ExpressionParsers_Results_Num.Num(war, unitMap.getUnitOnMap(gridIndex) ? 1 : 0);
    }

    public callUnit(argX: ExpressionParsers_Results_Base.Base, argY: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_NullableUnit.NullableUnit {
        if (!(argX instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected argX.`);
        }
        if (!(argY instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected argY.`);
        }

        const x = argX.num;
        const y = argY.num;
        if ((x !== Math.floor(x)) || (y !== Math.floor(y))) {
            throw Helpers_Misc.newError(`Invalid xy: ${x}, ${y}`);
        }

        const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(x, y);
        const war       = this.getWar();
        const unitMap   = war.getUnitMap();
        if (!gridIndex.checkIsInsideMap(unitMap.getMapSize())) {
            throw Helpers_Misc.newError(`Out of map, xy: ${x}, ${y}`);
        }

        return new ExpressionParsers_Results_NullableUnit.NullableUnit(war, unitMap.getUnitOnMap(gridIndex));
    }

    public callTeamIndex(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const playerIndex = arg.num;
        if (playerIndex !== Math.floor(playerIndex)) {
            throw Helpers_Misc.newError(`Invalid playerIndex: ${playerIndex}`);
        }

        const war = this.getWar();
        return new ExpressionParsers_Results_Num.Num(war, war.getPlayer(playerIndex).getTeamIndex());
    }

    public callTile(argX: ExpressionParsers_Results_Base.Base, argY: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Tile.Tile {
        if (!(argX instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected argX.`);
        }
        if (!(argY instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected argY.`);
        }

        const x = argX.num;
        const y = argY.num;
        if ((x !== Math.floor(x)) || (y !== Math.floor(y))) {
            throw Helpers_Misc.newError(`Invalid x y: ${x}, ${y}`);
        }

        return new ExpressionParsers_Results_Tile.Tile(this.getWar().getTileMap().getTile(new AuxiliaryTypes_GridIndex.GridIndex(x, y)));
    }

    private callWarEventTriggeredTimes(rawWarEventId: ExpressionParsers_Results_Base.Base, rawArg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        if (!(rawWarEventId instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected rawWarEventId.`);
        }
        if (!(rawArg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected rawArg.`);
        }

        const warEventId = Numbers_Utils.getValueInRange({
            minValue : 0,
            maxValue : Numbers_Constants.MaxInt32,
            rawValue : Math.floor(rawWarEventId.num),
        });
        const arg = Numbers_Utils.getValueInRange({
            minValue : 0,
            maxValue : Numbers_Constants.MaxInt32,
            rawValue : Math.floor(rawArg.num),
        });
        const war               = this.getWar();
        const warEventManager   = war.getWarEventManager();
        return new ExpressionParsers_Results_Num.Num(war, arg === 1
            ? warEventManager.getWarEventCalledCountInPlayerTurn(warEventId)
            : warEventManager.getWarEventCalledCountTotal(warEventId),
        );
    }

    private callWarOperation(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_WarOperation.WarOperation {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const war               = this.getWar();
        const operationArray    = war.getExecutedOperationManager().getAllExecutedOperationArray();
        const rawIndex          = Numbers_Utils.getValueInInt32(arg.num);
        const index             = rawIndex >= 0 ? rawIndex : operationArray.length + rawIndex;
        return new ExpressionParsers_Results_WarOperation.WarOperation(operationArray[index] ?? null, war);
    }

    private callTaskObjective(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_TaskObjective.TaskObjective {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        return new ExpressionParsers_Results_TaskObjective.TaskObjective(this.getWar(), Numbers_Utils.getValueInInt32(arg.num));
    }

    public callAllUnits(arg: ExpressionParsers_Results_Base.Base, rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_NullableUnitArray.NullableUnitArray {
        if (!(arg instanceof ExpressionParsers_Results_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected node.`);
        }

        const war       = this.getWar();
        const units     = war.getUnitMap().getAllUnits().sort((v1, v2) => v1.getUnitId() - v2.getUnitId()).map(v => new ExpressionParsers_Results_NullableUnit.NullableUnit(war, v));
        const unitArray : ExpressionParsers_Results_NullableUnit.NullableUnit[] = [];
        for (const unit of units) {
            const result = node.evalLambda(rootCtx, [unit], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsers_Results_Num.Num)) {
                throw Helpers_Misc.newError(`Invalid lambda result.`, Utils_ClientErrorCode.ClientErrorCode.EpContextWar_CallAllUnits_00);
            }

            if (result.num !== 0) {
                unitArray.push(unit);
            }
        }

        return new ExpressionParsers_Results_NullableUnitArray.NullableUnitArray(war, unitArray);
    }

    public callAllTiles(arg: ExpressionParsers_Results_Base.Base, rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_TileArray.TileArray {
        if (!(arg instanceof ExpressionParsers_Results_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const tiles         = war.getTileMap().getAllTiles();
        const resultArray   : Tiles_Tile.Tile[] = [];
        for (const tile of tiles) {
            const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Tile.Tile(tile)], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsers_Results_Num.Num)) {
                throw Helpers_Misc.newError(`Invalid lambda result.`, Utils_ClientErrorCode.ClientErrorCode.EpContextWar_CallAllTiles_00);
            }

            if (result.num !== 0) {
                resultArray.push(tile);
            }
        }

        return new ExpressionParsers_Results_TileArray.TileArray(war, resultArray);
    }

    public callAllPlayers(arg: ExpressionParsers_Results_Base.Base, rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_PlayerArray.PlayerArray {
        if (!(arg instanceof ExpressionParsers_Results_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const players       = war.getPlayerManager().getAllPlayers();
        const resultArray   : Players_IPlayer.IPlayer[] = [];
        for (const player of players) {
            const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Player.Player(player)], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsers_Results_Num.Num)) {
                throw Helpers_Misc.newError(`Invalid lambda result.`, Utils_ClientErrorCode.ClientErrorCode.EpContextWar_CallAllPlayers_00);
            }

            if (result.num !== 0) {
                resultArray.push(player);
            }
        }

        return new ExpressionParsers_Results_PlayerArray.PlayerArray(war, resultArray);
    }

    public callAllUnitStatistics(arg: ExpressionParsers_Results_Base.Base, rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_UnitStatisticArray.UnitStatisticArray {
        if (!(arg instanceof ExpressionParsers_Results_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : ExpressionParsers_Results_UnitStatistic.UnitStatistic[] = [];
        for (const rawData of war.getWarStatisticsManager().getUnitStatisticsArray()) {
            const data      = new ExpressionParsers_Results_UnitStatistic.UnitStatistic(war, {
                playerIndexArray                : [rawData.getDstPlayerIndex()],
                unitTypeArray                   : [rawData.getUnitType()],
                groupedObserverTeamIndexesArray : [rawData.getGroupedObserverTeamIndexes()],
                unitGain                        : rawData.getUnitGain(),
                unitLoss                        : rawData.getUnitLoss(),
                normalizedHpGain                : rawData.getNormalizedHpGain(),
                normalizedHpLoss                : rawData.getNormalizedHpLoss(),
            });
            const result    = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsers_Results_Num.Num)) {
                throw Helpers_Misc.newError(`Invalid lambda result.`, Utils_ClientErrorCode.ClientErrorCode.EpContextWar_CallAllUnitStatistics_00);
            }

            if (result.num !== 0) {
                resultArray.push(data);
            }
        }

        return new ExpressionParsers_Results_UnitStatisticArray.UnitStatisticArray(war, resultArray);
    }

    private callAllCustomCounterIds(arg: ExpressionParsers_Results_Base.Base, rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_NumArray.NumArray {
        if (!(arg instanceof ExpressionParsers_Results_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : number[] = [];
        for (let customCounterId = CustomCounters_Constants.Constants.MinId; customCounterId <= CustomCounters_Constants.Constants.MaxId; ++customCounterId) {
            const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Num.Num(war, customCounterId)], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsers_Results_Num.Num)) {
                throw Helpers_Misc.newError(`Invalid lambda result.`, Utils_ClientErrorCode.ClientErrorCode.EpContextWar_CallAllUnitStatistics_00);
            }

            if (result.num !== 0) {
                resultArray.push(customCounterId);
            }
        }

        return new ExpressionParsers_Results_NumArray.NumArray(war, resultArray);
    }

    private callAllUnitTypes(arg: ExpressionParsers_Results_Base.Base, rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_NumArray.NumArray {
        if (!(arg instanceof ExpressionParsers_Results_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : number[] = [];
        for (const unitType of war.getGcData().getAllUnitTypeArray()) {
            const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Num.Num(war, unitType)], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsers_Results_Num.Num)) {
                throw Helpers_Misc.newError(`Invalid lambda result.`);
            }

            if (result.num !== 0) {
                resultArray.push(unitType);
            }
        }

        return new ExpressionParsers_Results_NumArray.NumArray(war, resultArray);
    }

    private callAllTileTypes(arg: ExpressionParsers_Results_Base.Base, rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_NumArray.NumArray {
        if (!(arg instanceof ExpressionParsers_Results_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : number[] = [];
        for (const tileType of war.getGcData().getAllTileTypeArray()) {
            const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Num.Num(war, tileType)], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsers_Results_Num.Num)) {
                throw Helpers_Misc.newError(`Invalid lambda result.`);
            }

            if (result.num !== 0) {
                resultArray.push(tileType);
            }
        }

        return new ExpressionParsers_Results_NumArray.NumArray(war, resultArray);
    }

    public callAllPositions(arg: ExpressionParsers_Results_Base.Base, rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_PositionArray.PositionArray {
        if (!(arg instanceof ExpressionParsers_Results_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected node.`);
        }

        const war               = this.getWar();
        const { width, height } = war.getTileMap().getMapSize().getWH();
        const resultArray       : ExpressionParsers_Results_Position.Position[] = [];
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const position  = new ExpressionParsers_Results_Position.Position(war, x, y);
                const result    = node.evalLambda(rootCtx, [position], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsers_Results_Num.Num)) {
                    throw Helpers_Misc.newError(`Invalid lambda result.`);
                }

                if (result.num !== 0) {
                    resultArray.push(position);
                }
            }
        }

        return new ExpressionParsers_Results_PositionArray.PositionArray(war, resultArray);
    }

    private callAllPersistentActionIds(rawArg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_NumArray.NumArray {
        if (!(rawArg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Invalid rawArg.`);
        }

        const arg = Numbers_Utils.getValueInRange({
            minValue : 0,
            maxValue : Numbers_Constants.MaxInt32,
            rawValue : Math.floor(rawArg.num),
        });
        const war             = this.getWar();
        const warEventManager = war.getWarEventManager();
        if (arg === 1) {
            return new ExpressionParsers_Results_NumArray.NumArray(war, warEventManager.getOpaIdArray());
        } else if (arg === 2) {
            const opaIdSet      = new Set(warEventManager.getOpaIdArray());
            const resultIdArray : number[] = [];
            for (const id of warEventManager.getAllPersistentActionIdArray()) {
                if (!opaIdSet.has(id)) {
                    resultIdArray.push(id);
                }
            }
            return new ExpressionParsers_Results_NumArray.NumArray(war, resultIdArray);
        } else {
            return new ExpressionParsers_Results_NumArray.NumArray(war, warEventManager.getAllPersistentActionIdArray());
        }
    }

    public callArray(argumentArray: ExpressionParsers_Results_Base.Base[]): ExpressionParsers_Results_Base.Base {
        const value0 = argumentArray[0];
        if (value0 instanceof ExpressionParsers_Results_Num.Num) {
            const numberArray: number[] = [value0.num];
            for (let i = 1; i < argumentArray.length; ++i) {
                const v = argumentArray[i];
                if (!(v instanceof ExpressionParsers_Results_Num.Num)) {
                    throw Helpers_Misc.newError(`Invalid value: ${v}`);
                }
                numberArray.push(v.num);
            }
            return new ExpressionParsers_Results_NumArray.NumArray(this.getWar(), numberArray);

        } else if (value0 instanceof ExpressionParsers_Results_NullableUnit.NullableUnit) {
            const unitArray: ExpressionParsers_Results_NullableUnit.NullableUnit[] = [value0];
            for (let i = 1; i < argumentArray.length; ++i) {
                const v = argumentArray[i];
                if (!(v instanceof ExpressionParsers_Results_NullableUnit.NullableUnit)) {
                    throw Helpers_Misc.newError(`Inconsistent argument type.`);
                }
                unitArray.push(v);
            }
            return new ExpressionParsers_Results_NullableUnitArray.NullableUnitArray(this.getWar(), unitArray);

        } else if (value0 instanceof ExpressionParsers_Results_UnitStatistic.UnitStatistic) {
            const dataArray: ExpressionParsers_Results_UnitStatistic.UnitStatistic[] = [value0];
            for (let i = 1; i < argumentArray.length; ++i) {
                const v = argumentArray[i];
                if (!(v instanceof ExpressionParsers_Results_UnitStatistic.UnitStatistic)) {
                    throw Helpers_Misc.newError(`Inconsistent argument type.`);
                }
                dataArray.push(v);
            }
            return new ExpressionParsers_Results_UnitStatisticArray.UnitStatisticArray(this.getWar(), dataArray);

        } else if (value0 instanceof ExpressionParsers_Results_Tile.Tile) {
            const tileArray: Tiles_Tile.Tile[] = [value0.tile];
            for (let i = 1; i < argumentArray.length; ++i) {
                const v = argumentArray[i];
                if (!(v instanceof ExpressionParsers_Results_Tile.Tile)) {
                    throw Helpers_Misc.newError(`Inconsistent argument type.`);
                }
                tileArray.push(v.tile);
            }
            return new ExpressionParsers_Results_TileArray.TileArray(this.getWar(), tileArray);

        } else if (value0 instanceof ExpressionParsers_Results_TileBuff.TileBuff) {
            const dataArray = [value0];
            for (let i = 1; i < argumentArray.length; ++i) {
                const v = argumentArray[i];
                if (!(v instanceof ExpressionParsers_Results_TileBuff.TileBuff)) {
                    throw Helpers_Misc.newError(`Inconsistent argument type.`);
                }
                dataArray.push(v);
            }
            return new ExpressionParsers_Results_TileBuffArray.TileBuffArray(this.getWar(), dataArray);

        } else if (value0 instanceof ExpressionParsers_Results_Player.Player) {
            const playerArray: Players_IPlayer.IPlayer[] = [value0.player];
            for (let i = 1; i < argumentArray.length; ++i) {
                const v = argumentArray[i];
                if (!(v instanceof ExpressionParsers_Results_Player.Player)) {
                    throw Helpers_Misc.newError(`Inconsistent argument type.`);
                }
                playerArray.push(v.player);
            }
            return new ExpressionParsers_Results_PlayerArray.PlayerArray(this.getWar(), playerArray);

        } else if (value0 instanceof ExpressionParsers_Results_Position.Position) {
            const positionArray = [value0];
            for (let i = 1; i < argumentArray.length; ++i) {
                const v = argumentArray[i];
                if (!(v instanceof ExpressionParsers_Results_Position.Position)) {
                    throw Helpers_Misc.newError(`Inconsistent argument type.`);
                }
                positionArray.push(v);
            }
            return new ExpressionParsers_Results_PositionArray.PositionArray(this.getWar(), positionArray);

        } else {
            throw Helpers_Misc.newError(`Unexpected value0.`);
        }
    }

    private callMakePos(argumentArray: ExpressionParsers_Results_Base.Base[]): ExpressionParsers_Results_Position.Position {
        if (argumentArray.length !== 2) {
            throw Helpers_Misc.newError(`Invalid argumentArray.`);
        }

        const x = argumentArray[0];
        if (!(x instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Invalid x.`);
        }

        const y = argumentArray[1];
        if (!(y instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Invalid y.`);
        }

        return new ExpressionParsers_Results_Position.Position(this.getWar(), x.num, y.num);
    }

    private callPow(argumentArray: ExpressionParsers_Results_Base.Base[]): ExpressionParsers_Results_Num.Num {
        if (argumentArray.length !== 2) {
            throw Helpers_Misc.newError(`Invalid argumentArray.`);
        }

        const x = argumentArray[0];
        if (!(x instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Invalid x.`);
        }

        const y = argumentArray[1];
        if (!(y instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Invalid y.`);
        }

        return new ExpressionParsers_Results_Num.Num(this.getWar(), Math.pow(x.num, y.num));
    }

    private callMoveCost(argumentArray: ExpressionParsers_Results_Base.Base[]): ExpressionParsers_Results_Num.Num {
        if (argumentArray.length !== 2) {
            throw Helpers_Misc.newError(`Invalid argumentArray.`);
        }

        const rawMoveTypeId = argumentArray[0];
        if (!(rawMoveTypeId instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Invalid x.`);
        }

        const rawTileTypeId = argumentArray[1];
        if (!(rawTileTypeId instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Invalid y.`);
        }

        const tileTypeId    = Numbers_Utils.getValueInInt32(rawTileTypeId.num);
        const war           = this.getWar();
        const cfg1          = war.getGcData().getMoveCostCfg(tileTypeId);
        if (cfg1 == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        const moveTypeId    = Numbers_Utils.getValueInInt32(rawMoveTypeId.num);
        const cfg2          = cfg1[moveTypeId];
        if (cfg2 == null) {
            return new ExpressionParsers_Results_Num.Num(war, -2);
        }

        return new ExpressionParsers_Results_Num.Num(war, cfg2.getCost() ?? -1);
    }
}
