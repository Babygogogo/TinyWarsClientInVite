import * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as CustomCountersConstants from "../../customCounters/Constants.ts";
import * as ExpressionParsersContextsBase from "./Base.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersFunctionInfo from "../FunctionInfo.ts";
import * as ExpressionParsersNodesLambda from "../nodes/Lambda.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as ExpressionParsersResultsFogMap from "../results/FogMap.ts";
import * as ExpressionParsersResultsLambda from "../results/Lambda.ts";
import * as ExpressionParsersResultsNullableUnit from "../results/NullableUnit.ts";
import * as ExpressionParsersResultsNullableUnitArray from "../results/NullableUnitArray.ts";
import * as ExpressionParsersResultsNum from "../results/Num.ts";
import * as ExpressionParsersResultsNumArray from "../results/NumArray.ts";
import * as ExpressionParsersResultsPlayer from "../results/Player.ts";
import * as ExpressionParsersResultsPlayerArray from "../results/PlayerArray.ts";
import * as ExpressionParsersResultsPosition from "../results/Position.ts";
import * as ExpressionParsersResultsPositionArray from "../results/PositionArray.ts";
import * as ExpressionParsersResultsTaskObjective from "../results/TaskObjective.ts";
import * as ExpressionParsersResultsTile from "../results/Tile.ts";
import * as ExpressionParsersResultsTileArray from "../results/TileArray.ts";
import * as ExpressionParsersResultsTileBuff from "../results/TileBuff.ts";
import * as ExpressionParsersResultsTileBuffArray from "../results/TileBuffArray.ts";
import * as ExpressionParsersResultsTurnManager from "../results/TurnManager.ts";
import * as ExpressionParsersResultsUnitStatistic from "../results/UnitStatistic.ts";
import * as ExpressionParsersResultsUnitStatisticArray from "../results/UnitStatisticArray.ts";
import * as ExpressionParsersResultsWarOperation from "../results/WarOperation.ts";
import * as ExpressionParsersResultsWeatherManager from "../results/WeatherManager.ts";
import type * as ExpressionParsersTypes from "../Types.ts";
import * as ExpressionParsersUtils from "../Utils.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NumbersConstants from "../../numbers/Constants.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import type * as PlayersIPlayer from "../../players/IPlayer.ts";
import type * as TilesITile from "../../tiles/ITile.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type IPlayer                    = PlayersIPlayer.IPlayer;
type ITile                      = TilesITile.ITile;

export class War extends ExpressionParsersContextsBase.Base {
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
        ExpressionParsersEnums.ResultType.Player,
        ExpressionParsersEnums.ResultType.PlayerArray,
        ExpressionParsersEnums.ResultType.Unit,
        ExpressionParsersEnums.ResultType.UnitArray,
        ExpressionParsersEnums.ResultType.Tile,
        ExpressionParsersEnums.ResultType.TileArray,
        ExpressionParsersEnums.ResultType.TileBuff,
        ExpressionParsersEnums.ResultType.TileBuffArray,
        ExpressionParsersEnums.ResultType.UnitStatistic,
        ExpressionParsersEnums.ResultType.UnitStatisticArray,
        ExpressionParsersEnums.ResultType.Number,
        ExpressionParsersEnums.ResultType.NumberArray,
        ExpressionParsersEnums.ResultType.Position,
        ExpressionParsersEnums.ResultType.PositionArray,
    ];

    public static readonly Variables    = War.generateVariables();
    public static readonly Functions    = War.generateFunctions();
    private static generateVariables(): ExpressionParsersTypes.EpVariableInfoDict {
        const variables = new Map<string, ExpressionParsersTypes.EpVariableInfo>();
        variables.set(War.VnTurn,        { desc: LangConstants.TextType.A0447, resultType: ExpressionParsersEnums.ResultType.Turn,    isExtension: false } );
        variables.set(War.VnWeather,     { desc: LangConstants.TextType.A0461, resultType: ExpressionParsersEnums.ResultType.Weather, isExtension: false } );
        variables.set(War.VnFog,         { desc: LangConstants.TextType.A0458, resultType: ExpressionParsersEnums.ResultType.Fog,     isExtension: false } );

        return variables;
    }
    private static generateFunctions(): ExpressionParsersTypes.EpFunctionInfoDict {
        const functions = new Map<string, ExpressionParsersFunctionInfo.FunctionInfo>();
        functions.set(
            War.FnAbs,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0455,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnAbs, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_00
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(War.FnAbs, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_01
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnFloor,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0119,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnFloor, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_02
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(War.FnFloor, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_03
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnCeil,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0474,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnCeil, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_04
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(War.FnCeil, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_05
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            ),
        );
        functions.set(
            War.FnMin,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0468,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length < 2) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnMin, `>=2`, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_06
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ExpressionParsersEnums.ResultType.Number) {
                            throw HelpersMisc.newError(
                                ExpressionParsersUtils.getErrorTextForParameterType(War.FnMin, i + 1, ExpressionParsersEnums.ResultType.Number, argType),
                                UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_07
                            );
                        }
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnMax,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0469,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length < 2) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnMax, `>=2`, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_08
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ExpressionParsersEnums.ResultType.Number) {
                            throw HelpersMisc.newError(
                                ExpressionParsersUtils.getErrorTextForParameterType(War.FnMax, i + 1, ExpressionParsersEnums.ResultType.Number, argType),
                                UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_09
                            );
                        }
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnIsAmong,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0130,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length < 2) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnIsAmong, `>=2`, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_10
                        );
                    }

                    const argType0 = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (War.ParameterTypesForIsAmong.indexOf(argType0) < 0) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(War.FnIsAmong, 1, War.ParameterTypesForIsAmong, argType0),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_11
                        );
                    }

                    for (let i = 1; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== argType0) {
                            throw HelpersMisc.newError(
                                ExpressionParsersUtils.getErrorTextForParameterType(War.FnIsAmong, i + 1, argType0, argType),
                                UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_12
                            );
                        }
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnRandom,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0120,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict) => {
                    if (argArray.length !== 0) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnRandom, 0, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_13
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnRandomInt,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0525,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnRandomInt, 2, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_14
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ExpressionParsersEnums.ResultType.Number) {
                            throw HelpersMisc.newError(
                                ExpressionParsersUtils.getErrorTextForParameterType(War.FnRandomInt, i + 1, ExpressionParsersEnums.ResultType.Number, argType),
                                UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_15
                            );
                        }
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnRandomPick,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0661,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 3) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnRandomPick, 3, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_16
                        );
                    }

                    const arg0                  = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    const supportedArg0Array    = [
                        ExpressionParsersEnums.ResultType.NumberArray,
                        ExpressionParsersEnums.ResultType.PlayerArray,
                        ExpressionParsersEnums.ResultType.PositionArray,
                        ExpressionParsersEnums.ResultType.TileArray,
                        ExpressionParsersEnums.ResultType.UnitArray,
                        ExpressionParsersEnums.ResultType.UnitStatisticArray,
                        ExpressionParsersEnums.ResultType.TileBuffArray,
                    ];
                    if (supportedArg0Array.indexOf(arg0) < 0) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(War.FnRandomPick, 1, supportedArg0Array, arg0),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_17
                        );
                    }

                    for (let i = 1; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ExpressionParsersEnums.ResultType.Number) {
                            throw HelpersMisc.newError(
                                ExpressionParsersUtils.getErrorTextForParameterType(War.FnRandomPick, i + 1, ExpressionParsersEnums.ResultType.Number, argType),
                                UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_18
                            );
                        }
                    }

                    return arg0;
                },
            )
        );
        functions.set(
            War.FnCustomCounter,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0121,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnCustomCounter, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_19
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(War.FnCustomCounter, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_20
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnPlayer,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0385,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnPlayer, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_21
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(War.FnPlayer, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_22
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Player;
                },
            )
        );
        functions.set(
            War.FnHasUnit,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0122,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnHasUnit, 2, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_23
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ExpressionParsersEnums.ResultType.Number) {
                            throw HelpersMisc.newError(
                                ExpressionParsersUtils.getErrorTextForParameterType(War.FnHasUnit, i + 1, ExpressionParsersEnums.ResultType.Number, argType),
                                UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_24
                            );
                        }
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnUnit,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0467,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnUnit, 2, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_25
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ExpressionParsersEnums.ResultType.Number) {
                            throw HelpersMisc.newError(
                                ExpressionParsersUtils.getErrorTextForParameterType(War.FnUnit, i + 1, ExpressionParsersEnums.ResultType.Number, argType),
                                UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_26
                            );
                        }
                    }

                    return ExpressionParsersEnums.ResultType.Unit;
                },
            )
        );
        functions.set(
            War.FnTeamIndex,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0142,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnTeamIndex, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_27
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(War.FnTeamIndex, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_28
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnTile,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0413,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnTile, 2, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_29
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ExpressionParsersEnums.ResultType.Number) {
                            throw HelpersMisc.newError(
                                ExpressionParsersUtils.getErrorTextForParameterType(War.FnTile, i + 1, ExpressionParsersEnums.ResultType.Number, argType),
                                UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_30
                            );
                        }
                    }

                    return ExpressionParsersEnums.ResultType.Tile;
                },
            )
        );
        functions.set(
            War.FnWarEventTriggeredTimes,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0702,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnWarEventTriggeredTimes, 2, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_31
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ExpressionParsersEnums.ResultType.Number) {
                            throw HelpersMisc.newError(
                                ExpressionParsersUtils.getErrorTextForParameterType(War.FnWarEventTriggeredTimes, i + 1, ExpressionParsersEnums.ResultType.Number, argType),
                                UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_32
                            );
                        }
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnWarOperation,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0706,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnWarOperation, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_33
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ExpressionParsersEnums.ResultType.Number) {
                            throw HelpersMisc.newError(
                                ExpressionParsersUtils.getErrorTextForParameterType(War.FnWarOperation, i + 1, ExpressionParsersEnums.ResultType.Number, argType),
                                UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_34
                            );
                        }
                    }

                    return ExpressionParsersEnums.ResultType.WarOperation;
                },
            )
        );
        functions.set(
            War.FnTaskObjective,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0726,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnTaskObjective, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_35
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ExpressionParsersEnums.ResultType.Number) {
                            throw HelpersMisc.newError(
                                ExpressionParsersUtils.getErrorTextForParameterType(War.FnTaskObjective, i + 1, ExpressionParsersEnums.ResultType.Number, argType),
                                UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_36
                            );
                        }
                    }

                    return ExpressionParsersEnums.ResultType.TaskObjective;
                },
            )
        );
        functions.set(
            War.FnAllUnits,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0479,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnAllUnits, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_37
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(War.FnAllUnits, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_38
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ExpressionParsersEnums.ResultType.Unit],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForLambdaResultType(War.FnAllUnits, 1, [ExpressionParsersEnums.ResultType.Number], lambdaResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_39
                        );
                    }

                    return ExpressionParsersEnums.ResultType.UnitArray;
                },
            )
        );
        functions.set(
            War.FnAllTiles,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0493,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnAllTiles, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_40
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(War.FnAllTiles, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_41
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ExpressionParsersEnums.ResultType.Tile],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForLambdaResultType(War.FnAllTiles, 1, [ExpressionParsersEnums.ResultType.Number], lambdaResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_42
                        );
                    }

                    return ExpressionParsersEnums.ResultType.TileArray;
                },
            )
        );
        functions.set(
            War.FnAllPlayers,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0494,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnAllPlayers, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_43
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(War.FnAllPlayers, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_44
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ExpressionParsersEnums.ResultType.Player],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForLambdaResultType(War.FnAllPlayers, 1, [ExpressionParsersEnums.ResultType.Number], lambdaResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_45
                        );
                    }

                    return ExpressionParsersEnums.ResultType.PlayerArray;
                },
            )
        );
        functions.set(
            War.FnAllUnitStatistics,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0512,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnAllUnitStatistics, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_46
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(War.FnAllUnitStatistics, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_47
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ExpressionParsersEnums.ResultType.UnitStatistic],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForLambdaResultType(War.FnAllUnitStatistics, 1, [ExpressionParsersEnums.ResultType.Number], lambdaResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_48
                        );
                    }

                    return ExpressionParsersEnums.ResultType.UnitStatisticArray;
                },
            )
        );
        functions.set(
            War.FnAllCustomCounterIds,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0529,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnAllCustomCounterIds, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_49
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(War.FnAllCustomCounterIds, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_50
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ExpressionParsersEnums.ResultType.Number],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForLambdaResultType(War.FnAllCustomCounterIds, 1, [ExpressionParsersEnums.ResultType.Number], lambdaResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_51
                        );
                    }

                    return ExpressionParsersEnums.ResultType.NumberArray;
                },
            )
        );
        functions.set(
            War.FnAllUnitTypes,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0700,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnAllUnitTypes, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_52
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(War.FnAllUnitTypes, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_53
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ExpressionParsersEnums.ResultType.Number],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForLambdaResultType(War.FnAllUnitTypes, 1, [ExpressionParsersEnums.ResultType.Number], lambdaResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_54
                        );
                    }

                    return ExpressionParsersEnums.ResultType.NumberArray;
                },
            )
        );
        functions.set(
            War.FnAllTileTypes,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0701,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnAllTileTypes, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_55
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(War.FnAllTileTypes, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_56
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ExpressionParsersEnums.ResultType.Number],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForLambdaResultType(War.FnAllTileTypes, 1, [ExpressionParsersEnums.ResultType.Number], lambdaResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_57
                        );
                    }

                    return ExpressionParsersEnums.ResultType.NumberArray;
                },
            )
        );
        functions.set(
            War.FnAllPositions,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0578,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnAllPositions, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_58
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(War.FnAllPositions, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_59
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ExpressionParsersEnums.ResultType.Position],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForLambdaResultType(War.FnAllPositions, 1, [ExpressionParsersEnums.ResultType.Number], lambdaResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_60
                        );
                    }

                    return ExpressionParsersEnums.ResultType.PositionArray;
                },
            )
        );
        functions.set(
            War.FnAllPersistentActionIds,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0703,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnAllPersistentActionIds, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_61
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(War.FnAllPersistentActionIds, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_62
                        );
                    }

                    return ExpressionParsersEnums.ResultType.NumberArray;
                },
            )
        );
        functions.set(
            War.FnArray,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0498,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length < 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnArray, `>=1`, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_63
                        );
                    }

                    const argType0 = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if ((argType0 !== ExpressionParsersEnums.ResultType.Number)          &&
                        (argType0 !== ExpressionParsersEnums.ResultType.Player)          &&
                        (argType0 !== ExpressionParsersEnums.ResultType.Tile)            &&
                        (argType0 !== ExpressionParsersEnums.ResultType.TileBuff)        &&
                        (argType0 !== ExpressionParsersEnums.ResultType.Unit)            &&
                        (argType0 !== ExpressionParsersEnums.ResultType.UnitStatistic)   &&
                        (argType0 !== ExpressionParsersEnums.ResultType.Position)
                    ) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(
                                War.FnArray,
                                1,
                                [
                                    ExpressionParsersEnums.ResultType.Number,
                                    ExpressionParsersEnums.ResultType.Player,
                                    ExpressionParsersEnums.ResultType.Tile,
                                    ExpressionParsersEnums.ResultType.TileBuff,
                                    ExpressionParsersEnums.ResultType.Unit,
                                    ExpressionParsersEnums.ResultType.UnitStatistic,
                                    ExpressionParsersEnums.ResultType.Position
                                ],
                                argType0
                            ),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_64
                        );
                    }

                    for (let i = 1; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== argType0) {
                            throw HelpersMisc.newError(
                                ExpressionParsersUtils.getErrorTextForParameterType(War.FnArray, i + 1, argType0, argType),
                                UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_65
                            );
                        }
                    }

                    switch (argType0) {
                        case ExpressionParsersEnums.ResultType.Number        : return ExpressionParsersEnums.ResultType.NumberArray;
                        case ExpressionParsersEnums.ResultType.Player        : return ExpressionParsersEnums.ResultType.PlayerArray;
                        case ExpressionParsersEnums.ResultType.Tile          : return ExpressionParsersEnums.ResultType.TileArray;
                        case ExpressionParsersEnums.ResultType.TileBuff      : return ExpressionParsersEnums.ResultType.TileBuffArray;
                        case ExpressionParsersEnums.ResultType.Unit          : return ExpressionParsersEnums.ResultType.UnitArray;
                        case ExpressionParsersEnums.ResultType.UnitStatistic : return ExpressionParsersEnums.ResultType.UnitStatisticArray;
                        case ExpressionParsersEnums.ResultType.Position      : return ExpressionParsersEnums.ResultType.PositionArray;
                        default                         : throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(
                                War.FnArray,
                                1,
                                [
                                    ExpressionParsersEnums.ResultType.Number,
                                    ExpressionParsersEnums.ResultType.Player,
                                    ExpressionParsersEnums.ResultType.Tile,
                                    ExpressionParsersEnums.ResultType.TileBuff,
                                    ExpressionParsersEnums.ResultType.Unit,
                                    ExpressionParsersEnums.ResultType.UnitStatistic,
                                    ExpressionParsersEnums.ResultType.Position
                                ],
                                argType0
                            ),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_66
                        );
                    }
                },
            ),
        );
        functions.set(
            War.FnMakePos,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0579,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnMakePos, 2, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_67
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ExpressionParsersEnums.ResultType.Number) {
                            throw HelpersMisc.newError(
                                ExpressionParsersUtils.getErrorTextForParameterType(War.FnMakePos, i + 1, ExpressionParsersEnums.ResultType.Number, argType),
                                UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_68
                            );
                        }
                    }

                    return ExpressionParsersEnums.ResultType.Position;
                },
            )
        );
        functions.set(
            War.FnPow,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0855,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnPow, 2, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_69
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ExpressionParsersEnums.ResultType.Number) {
                            throw HelpersMisc.newError(
                                ExpressionParsersUtils.getErrorTextForParameterType(War.FnPow, i + 1, ExpressionParsersEnums.ResultType.Number, argType),
                                UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_70
                            );
                        }
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnMoveCost,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0928,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(War.FnMoveCost, 2, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_71
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ExpressionParsersEnums.ResultType.Number) {
                            throw HelpersMisc.newError(
                                ExpressionParsersUtils.getErrorTextForParameterType(War.FnMoveCost, i + 1, ExpressionParsersEnums.ResultType.Number, argType),
                                UtilsClientErrorCode.ClientErrorCode.EpContextWar_GenerateFunctions_72
                            );
                        }
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );

        return functions;
    }

    public constructor(war: BaseWarInterfaceIBwWar.IBwWar) {
        super(war);
    }

    public getContextType(): ExpressionParsersEnums.ContextType {
        return ExpressionParsersEnums.ContextType.War;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase.Base {
        const war = this.getWar();
        switch (identifierName) {
            case War.VnTurn        : return new ExpressionParsersResultsTurnManager.TurnManager(war.getTurnManager());
            case War.VnWeather     : return new ExpressionParsersResultsWeatherManager.WeatherManager(war.getWeatherManager());
            case War.VnFog         : return new ExpressionParsersResultsFogMap.FogMap(war.getFogMap());
            default                         : throw HelpersMisc.newError(
                LangUtils.getFormattedText(LangConstants.TextType.F0021, identifierName),
                UtilsClientErrorCode.ClientErrorCode.EpContextWar_ResolveVariable_00,
            );
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase.Base[], rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
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
            default                                     : throw HelpersMisc.newError(
                LangUtils.getFormattedText(LangConstants.TextType.F0024, identifierName),
                UtilsClientErrorCode.ClientErrorCode.EpContextWar_CallFunction_00,
            );
        }
    }

    private callAbs(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        return new ExpressionParsersResultsNum.Num(arg.war, Math.abs(arg.num));
    }

    private callFloor(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        return new ExpressionParsersResultsNum.Num(arg.war, Math.floor(arg.num));
    }

    private callCeil(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        return new ExpressionParsersResultsNum.Num(arg.war, Math.ceil(arg.num));
    }

    private callMin(argArray: ExpressionParsersResultsBase.Base[]): ExpressionParsersResultsNum.Num {
        if (!argArray.length) {
            throw HelpersMisc.newError(`Empty argArray.`);
        }
        const numArray = argArray.map(v => {
            if (v instanceof ExpressionParsersResultsNum.Num) {
                return v.num;
            } else {
                throw HelpersMisc.newError(`Unexpected argArray.`);
            }
        });

        return new ExpressionParsersResultsNum.Num(this.getWar(), Math.min(...numArray));
    }

    private callMax(argArray: ExpressionParsersResultsBase.Base[]): ExpressionParsersResultsNum.Num {
        if (!argArray.length) {
            throw HelpersMisc.newError(`Empty argArray.`);
        }
        const numArray = argArray.map(v => {
            if (v instanceof ExpressionParsersResultsNum.Num) {
                return v.num;
            } else {
                throw HelpersMisc.newError(`Unexpected argArray.`);
            }
        });

        return new ExpressionParsersResultsNum.Num(this.getWar(), Math.max(...numArray));
    }

    public callIsAmong(argumentArray: ExpressionParsersResultsBase.Base[]): ExpressionParsersResultsNum.Num {
        const v = argumentArray[0];
        for (let i = 1; i < argumentArray.length; ++i) {
            if (v.checkIsEqual(argumentArray[i])) {
                return new ExpressionParsersResultsNum.Num(this.getWar(), 1);
            }
        }

        return new ExpressionParsersResultsNum.Num(this.getWar(), 0);
    }

    public callRandom(isRestricted: boolean): ExpressionParsersResultsNum.Num {
        if (isRestricted) {
            throw HelpersMisc.newError(`Restricted.`);
        }

        const war = this.getWar();
        return new ExpressionParsersResultsNum.Num(war, war.getRandomNumberManager().getAndTickNextNumber());
    }

    public callRandomInt(argArray: ExpressionParsersResultsBase.Base[], isRestricted: boolean): ExpressionParsersResultsNum.Num {
        if (isRestricted) {
            throw HelpersMisc.newError(`Restricted.`);
        }

        const arg0 = argArray[0];
        if (!(arg0 instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg0.`);
        }

        const arg1 = argArray[1];
        if (!(arg1 instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg1.`);
        }

        const lowerLimit    = Math.ceil(arg0.num);
        const upperLimit    = Math.floor(arg1.num);
        if ((!isFinite(lowerLimit)) || (!isFinite(upperLimit)) || (lowerLimit >= upperLimit)) {
            throw HelpersMisc.newError(`Invalid limits: ${lowerLimit}, ${upperLimit}`);
        }

        const war = this.getWar();
        return new ExpressionParsersResultsNum.Num(war, Math.floor(war.getRandomNumberManager().getAndTickNextNumber() * (upperLimit - lowerLimit) + lowerLimit));
    }

    private callRandomPick(argArray: ExpressionParsersResultsBase.Base[], isRestricted: boolean): ExpressionParsersResultsBase.Base {
        if (isRestricted) {
            throw HelpersMisc.newError(`Restricted.`);
        }

        const count = argArray[1];
        if (!(count instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Invalid argArray[1].`);
        }

        const rawNeedSort = argArray[2];
        if (!(rawNeedSort instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Invalid argArray[2].`);
        }

        const needSort  = rawNeedSort.num !== 0;
        const src       = argArray[0];
        if (src instanceof ExpressionParsersResultsNumArray.NumArray) {
            return this.callRandomPickNumberArray(src, count.num, needSort);
        } else if (src instanceof ExpressionParsersResultsPlayerArray.PlayerArray) {
            return this.callRandomPickPlayerArray(src, count.num, needSort);
        } else if (src instanceof ExpressionParsersResultsPositionArray.PositionArray) {
            return this.callRandomPickPositionArray(src, count.num, needSort);
        } else if (src instanceof ExpressionParsersResultsTileArray.TileArray) {
            return this.callRandomPickTileArray(src, count.num, needSort);
        } else if (src instanceof ExpressionParsersResultsTileBuffArray.TileBuffArray) {
            return this.callRandomPickTileBuffArray(src, count.num, needSort);
        } else if (src instanceof ExpressionParsersResultsNullableUnitArray.NullableUnitArray) {
            return this.callRandomPickUnitArray(src, count.num, needSort);
        } else if (src instanceof ExpressionParsersResultsUnitStatisticArray.UnitStatisticArray) {
            return this.callRandomPickUnitStatisticsArray(src, count.num, needSort);
        } else {
            throw HelpersMisc.newError(`Invalid argArray[0].`);
        }
    }
    private callRandomPickNumberArray(src: ExpressionParsersResultsNumArray.NumArray, rawCount: number, needSort: boolean): ExpressionParsersResultsNumArray.NumArray {
        const war         = this.getWar();
        const srcArray    = src.numberArray;
        const srcCount    = srcArray.length;
        const dstCount    = NumbersUtils.getValueInRange({
            minValue    : 0,
            maxValue    : srcCount,
            rawValue    : Math.floor(rawCount),
        });
        if (dstCount <= 0) {
            return new ExpressionParsersResultsNumArray.NumArray(war, []);
        }
        if ((dstCount === srcCount) && (needSort)) {
            return src;
        }

        const indexList   = this.getRandomIndexList(srcCount, dstCount, needSort);
        const dstArray    : number[] = [];
        for (let i = 0; i < dstCount; ++i) {
            dstArray[i] = srcArray[indexList[i]];
        }
        return new ExpressionParsersResultsNumArray.NumArray(war, dstArray);
    }
    private callRandomPickPlayerArray(src: ExpressionParsersResultsPlayerArray.PlayerArray, rawCount: number, needSort: boolean): ExpressionParsersResultsPlayerArray.PlayerArray {
        const war         = this.getWar();
        const srcArray    = src.array;
        const srcCount    = srcArray.length;
        const dstCount    = NumbersUtils.getValueInRange({
            minValue    : 0,
            maxValue    : srcCount,
            rawValue    : Math.floor(rawCount),
        });
        if (dstCount <= 0) {
            return new ExpressionParsersResultsPlayerArray.PlayerArray(war, []);
        }
        if ((dstCount === srcCount) && (needSort)) {
            return src;
        }

        const indexList   = this.getRandomIndexList(srcCount, dstCount, needSort);
        const dstArray    : IPlayer[] = [];
        for (let i = 0; i < dstCount; ++i) {
            dstArray[i] = srcArray[indexList[i]];
        }
        return new ExpressionParsersResultsPlayerArray.PlayerArray(war, dstArray);
    }
    private callRandomPickPositionArray(src: ExpressionParsersResultsPositionArray.PositionArray, rawCount: number, needSort: boolean): ExpressionParsersResultsPositionArray.PositionArray {
        const war         = this.getWar();
        const srcArray    = src.positionArray;
        const srcCount    = srcArray.length;
        const dstCount    = NumbersUtils.getValueInRange({
            minValue    : 0,
            maxValue    : srcCount,
            rawValue    : Math.floor(rawCount),
        });
        if (dstCount <= 0) {
            return new ExpressionParsersResultsPositionArray.PositionArray(war, []);
        }
        if ((dstCount === srcCount) && (needSort)) {
            return src;
        }

        const indexList   = this.getRandomIndexList(srcCount, dstCount, needSort);
        const dstArray    : ExpressionParsersResultsPosition.Position[] = [];
        for (let i = 0; i < dstCount; ++i) {
            dstArray[i] = srcArray[indexList[i]];
        }
        return new ExpressionParsersResultsPositionArray.PositionArray(war, dstArray);
    }
    private callRandomPickTileArray(src: ExpressionParsersResultsTileArray.TileArray, rawCount: number, needSort: boolean): ExpressionParsersResultsTileArray.TileArray {
        const war         = this.getWar();
        const srcArray    = src.array;
        const srcCount    = srcArray.length;
        const dstCount    = NumbersUtils.getValueInRange({
            minValue    : 0,
            maxValue    : srcCount,
            rawValue    : Math.floor(rawCount),
        });
        if (dstCount <= 0) {
            return new ExpressionParsersResultsTileArray.TileArray(war, []);
        }
        if ((dstCount === srcCount) && (needSort)) {
            return src;
        }

        const indexList   = this.getRandomIndexList(srcCount, dstCount, needSort);
        const dstArray    : ITile[] = [];
        for (let i = 0; i < dstCount; ++i) {
            dstArray[i] = srcArray[indexList[i]];
        }
        return new ExpressionParsersResultsTileArray.TileArray(war, dstArray);
    }
    private callRandomPickTileBuffArray(src: ExpressionParsersResultsTileBuffArray.TileBuffArray, rawCount: number, needSort: boolean): ExpressionParsersResultsTileBuffArray.TileBuffArray {
        const war         = this.getWar();
        const srcArray    = src.buffArray;
        const srcCount    = srcArray.length;
        const dstCount    = NumbersUtils.getValueInRange({
            minValue    : 0,
            maxValue    : srcCount,
            rawValue    : Math.floor(rawCount),
        });
        if (dstCount <= 0) {
            return new ExpressionParsersResultsTileBuffArray.TileBuffArray(war, []);
        }
        if ((dstCount === srcCount) && (needSort)) {
            return src;
        }

        const indexList   = this.getRandomIndexList(srcCount, dstCount, needSort);
        const dstArray    : ExpressionParsersResultsTileBuff.TileBuff[] = [];
        for (let i = 0; i < dstCount; ++i) {
            dstArray[i] = srcArray[indexList[i]];
        }
        return new ExpressionParsersResultsTileBuffArray.TileBuffArray(war, dstArray);
    }
    private callRandomPickUnitArray(src: ExpressionParsersResultsNullableUnitArray.NullableUnitArray, rawCount: number, needSort: boolean): ExpressionParsersResultsNullableUnitArray.NullableUnitArray {
        const war         = this.getWar();
        const srcArray    = src.array;
        const srcCount    = srcArray.length;
        const dstCount    = NumbersUtils.getValueInRange({
            minValue    : 0,
            maxValue    : srcCount,
            rawValue    : Math.floor(rawCount),
        });
        if (dstCount <= 0) {
            return new ExpressionParsersResultsNullableUnitArray.NullableUnitArray(war, []);
        }
        if ((dstCount === srcCount) && (needSort)) {
            return src;
        }

        const indexList   = this.getRandomIndexList(srcCount, dstCount, needSort);
        const dstArray    : ExpressionParsersResultsNullableUnit.NullableUnit[] = [];
        for (let i = 0; i < dstCount; ++i) {
            dstArray[i] = srcArray[indexList[i]];
        }
        return new ExpressionParsersResultsNullableUnitArray.NullableUnitArray(war, dstArray);
    }
    private callRandomPickUnitStatisticsArray(src: ExpressionParsersResultsUnitStatisticArray.UnitStatisticArray, rawCount: number, needSort: boolean): ExpressionParsersResultsUnitStatisticArray.UnitStatisticArray {
        const war         = this.getWar();
        const srcArray    = src.dataArray;
        const srcCount    = srcArray.length;
        const dstCount    = NumbersUtils.getValueInRange({
            minValue    : 0,
            maxValue    : srcCount,
            rawValue    : Math.floor(rawCount),
        });
        if (dstCount <= 0) {
            return new ExpressionParsersResultsUnitStatisticArray.UnitStatisticArray(war, []);
        }
        if ((dstCount === srcCount) && (needSort)) {
            return src;
        }

        const indexList   = this.getRandomIndexList(srcCount, dstCount, needSort);
        const dstArray    : ExpressionParsersResultsUnitStatistic.UnitStatistic[] = [];
        for (let i = 0; i < dstCount; ++i) {
            dstArray[i] = srcArray[indexList[i]];
        }
        return new ExpressionParsersResultsUnitStatisticArray.UnitStatisticArray(war, dstArray);
    }
    private getRandomIndexList(srcCount: number, dstCount: number, needSort: boolean): number[] {
        const srcArray            = HelpersCollection.createRange(0, srcCount, 1);
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

    public callCustomCounter(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const customCounterId = arg.num;
        if (customCounterId !== Math.floor(customCounterId)) {
            throw HelpersMisc.newError(`Invalid customCounterId: ${customCounterId}`);
        }

        const war = this.getWar();
        if ((customCounterId > CustomCountersConstants.Constants.MaxId) ||
            (customCounterId < CustomCountersConstants.Constants.MinId)
        ) {
            return new ExpressionParsersResultsNum.Num(war, 0);
        }

        return new ExpressionParsersResultsNum.Num(war, war.getWarEventManager().getCustomCounter(customCounterId));
    }

    public callPlayer(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsPlayer.Player {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const playerIndex = arg.num;
        if (playerIndex !== Math.floor(playerIndex)) {
            throw HelpersMisc.newError(`Invalid playerIndex: ${playerIndex}`);
        }
        return new ExpressionParsersResultsPlayer.Player(this.getWar().getPlayer(playerIndex));
    }

    public callHasUnit(argX: ExpressionParsersResultsBase.Base, argY: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        if (!(argX instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected argX.`);
        }
        if (!(argY instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected argY.`);
        }

        const x = argX.num;
        const y = argY.num;
        if ((x !== Math.floor(x)) || (y !== Math.floor(y))) {
            throw HelpersMisc.newError(`Invalid xy: ${x}, ${y}`);
        }

        const gridIndex = new AuxiliaryTypesGridIndex.GridIndex(x, y);
        const war       = this.getWar();
        const unitMap   = war.getUnitMap();
        if (!gridIndex.checkIsInsideMap(unitMap.getMapSize())) {
            throw HelpersMisc.newError(`Out of map, xy: ${x}, ${y}`);
        }

        return new ExpressionParsersResultsNum.Num(war, unitMap.getUnitOnMap(gridIndex) ? 1 : 0);
    }

    public callUnit(argX: ExpressionParsersResultsBase.Base, argY: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNullableUnit.NullableUnit {
        if (!(argX instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected argX.`);
        }
        if (!(argY instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected argY.`);
        }

        const x = argX.num;
        const y = argY.num;
        if ((x !== Math.floor(x)) || (y !== Math.floor(y))) {
            throw HelpersMisc.newError(`Invalid xy: ${x}, ${y}`);
        }

        const gridIndex = new AuxiliaryTypesGridIndex.GridIndex(x, y);
        const war       = this.getWar();
        const unitMap   = war.getUnitMap();
        if (!gridIndex.checkIsInsideMap(unitMap.getMapSize())) {
            throw HelpersMisc.newError(`Out of map, xy: ${x}, ${y}`);
        }

        return new ExpressionParsersResultsNullableUnit.NullableUnit(war, unitMap.getUnitOnMap(gridIndex));
    }

    public callTeamIndex(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const playerIndex = arg.num;
        if (playerIndex !== Math.floor(playerIndex)) {
            throw HelpersMisc.newError(`Invalid playerIndex: ${playerIndex}`);
        }

        const war = this.getWar();
        return new ExpressionParsersResultsNum.Num(war, war.getPlayer(playerIndex).getTeamIndex());
    }

    public callTile(argX: ExpressionParsersResultsBase.Base, argY: ExpressionParsersResultsBase.Base): ExpressionParsersResultsTile.Tile {
        if (!(argX instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected argX.`);
        }
        if (!(argY instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected argY.`);
        }

        const x = argX.num;
        const y = argY.num;
        if ((x !== Math.floor(x)) || (y !== Math.floor(y))) {
            throw HelpersMisc.newError(`Invalid x y: ${x}, ${y}`);
        }

        return new ExpressionParsersResultsTile.Tile(this.getWar().getTileMap().getTile(new AuxiliaryTypesGridIndex.GridIndex(x, y)));
    }

    private callWarEventTriggeredTimes(rawWarEventId: ExpressionParsersResultsBase.Base, rawArg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        if (!(rawWarEventId instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected rawWarEventId.`);
        }
        if (!(rawArg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected rawArg.`);
        }

        const warEventId = NumbersUtils.getValueInRange({
            minValue    : 0,
            maxValue    : NumbersConstants.MaxInt32,
            rawValue    : Math.floor(rawWarEventId.num),
        });
        const arg = NumbersUtils.getValueInRange({
            minValue    : 0,
            maxValue    : NumbersConstants.MaxInt32,
            rawValue    : Math.floor(rawArg.num),
        });
        const war               = this.getWar();
        const warEventManager   = war.getWarEventManager();
        return new ExpressionParsersResultsNum.Num(war, arg === 1
            ? warEventManager.getWarEventCalledCountInPlayerTurn(warEventId)
            : warEventManager.getWarEventCalledCountTotal(warEventId)
        );
    }

    private callWarOperation(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsWarOperation.WarOperation {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const war               = this.getWar();
        const operationArray    = war.getExecutedOperationManager().getAllExecutedOperationArray();
        const rawIndex          = NumbersUtils.getValueInInt32(arg.num);
        const index             = rawIndex >= 0 ? rawIndex : operationArray.length + rawIndex;
        return new ExpressionParsersResultsWarOperation.WarOperation(operationArray[index] ?? null, war);
    }

    private callTaskObjective(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsTaskObjective.TaskObjective {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        return new ExpressionParsersResultsTaskObjective.TaskObjective(this.getWar(), NumbersUtils.getValueInInt32(arg.num));
    }

    public callAllUnits(arg: ExpressionParsersResultsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsNullableUnitArray.NullableUnitArray {
        if (!(arg instanceof ExpressionParsersResultsLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsersNodesLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected node.`);
        }

        const war       = this.getWar();
        const units     = war.getUnitMap().getAllUnits().sort((v1, v2) => v1.getUnitId() - v2.getUnitId()).map(v => new ExpressionParsersResultsNullableUnit.NullableUnit(war, v));
        const unitArray : ExpressionParsersResultsNullableUnit.NullableUnit[] = [];
        for (const unit of units) {
            const result = node.evalLambda(rootCtx, [unit], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsersResultsNum.Num)) {
                throw HelpersMisc.newError(`Invalid lambda result.`, UtilsClientErrorCode.ClientErrorCode.EpContextWar_CallAllUnits_00);
            }

            if (result.num !== 0) {
                unitArray.push(unit);
            }
        }

        return new ExpressionParsersResultsNullableUnitArray.NullableUnitArray(war, unitArray);
    }

    public callAllTiles(arg: ExpressionParsersResultsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsTileArray.TileArray {
        if (!(arg instanceof ExpressionParsersResultsLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsersNodesLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const tiles         = war.getTileMap().getAllTiles();
        const resultArray   : ITile[] = [];
        for (const tile of tiles) {
            const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsTile.Tile(tile)], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsersResultsNum.Num)) {
                throw HelpersMisc.newError(`Invalid lambda result.`, UtilsClientErrorCode.ClientErrorCode.EpContextWar_CallAllTiles_00);
            }

            if (result.num !== 0) {
                resultArray.push(tile);
            }
        }

        return new ExpressionParsersResultsTileArray.TileArray(war, resultArray);
    }

    public callAllPlayers(arg: ExpressionParsersResultsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsPlayerArray.PlayerArray {
        if (!(arg instanceof ExpressionParsersResultsLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsersNodesLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const players       = war.getPlayerManager().getAllPlayers();
        const resultArray   : IPlayer[] = [];
        for (const player of players) {
            const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsPlayer.Player(player)], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsersResultsNum.Num)) {
                throw HelpersMisc.newError(`Invalid lambda result.`, UtilsClientErrorCode.ClientErrorCode.EpContextWar_CallAllPlayers_00);
            }

            if (result.num !== 0) {
                resultArray.push(player);
            }
        }

        return new ExpressionParsersResultsPlayerArray.PlayerArray(war, resultArray);
    }

    public callAllUnitStatistics(arg: ExpressionParsersResultsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsUnitStatisticArray.UnitStatisticArray {
        if (!(arg instanceof ExpressionParsersResultsLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsersNodesLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : ExpressionParsersResultsUnitStatistic.UnitStatistic[] = [];
        for (const rawData of war.getWarStatisticsManager().getUnitStatisticsArray()) {
            const data      = new ExpressionParsersResultsUnitStatistic.UnitStatistic(war, {
                playerIndexArray                : [rawData.getDstPlayerIndex() ?? 0],
                unitTypeArray                   : [rawData.getUnitType() ?? 0],
                groupedObserverTeamIndexesArray : [rawData.getGroupedObserverTeamIndexes() ?? 0],
                unitGain                        : rawData.getUnitGain() ?? 0,
                unitLoss                        : rawData.getUnitLoss() ?? 0,
                normalizedHpGain                : rawData.getNormalizedHpGain() ?? 0,
                normalizedHpLoss                : rawData.getNormalizedHpLoss() ?? 0,
            });
            const result    = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsersResultsNum.Num)) {
                throw HelpersMisc.newError(`Invalid lambda result.`, UtilsClientErrorCode.ClientErrorCode.EpContextWar_CallAllUnitStatistics_00);
            }

            if (result.num !== 0) {
                resultArray.push(data);
            }
        }

        return new ExpressionParsersResultsUnitStatisticArray.UnitStatisticArray(war, resultArray);
    }

    private callAllCustomCounterIds(arg: ExpressionParsersResultsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsNumArray.NumArray {
        if (!(arg instanceof ExpressionParsersResultsLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsersNodesLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : number[] = [];
        for (let customCounterId = CustomCountersConstants.Constants.MinId; customCounterId <= CustomCountersConstants.Constants.MaxId; ++customCounterId) {
            const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsNum.Num(war, customCounterId)], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsersResultsNum.Num)) {
                throw HelpersMisc.newError(`Invalid lambda result.`, UtilsClientErrorCode.ClientErrorCode.EpContextWar_CallAllUnitStatistics_00);
            }

            if (result.num !== 0) {
                resultArray.push(customCounterId);
            }
        }

        return new ExpressionParsersResultsNumArray.NumArray(war, resultArray);
    }

    private callAllUnitTypes(arg: ExpressionParsersResultsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsNumArray.NumArray {
        if (!(arg instanceof ExpressionParsersResultsLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsersNodesLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : number[] = [];
        for (const unitType of war.getGcData().getAllUnitTypeArray()) {
            const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsNum.Num(war, unitType)], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsersResultsNum.Num)) {
                throw HelpersMisc.newError(`Invalid lambda result.`);
            }

            if (result.num !== 0) {
                resultArray.push(unitType);
            }
        }

        return new ExpressionParsersResultsNumArray.NumArray(war, resultArray);
    }

    private callAllTileTypes(arg: ExpressionParsersResultsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsNumArray.NumArray {
        if (!(arg instanceof ExpressionParsersResultsLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsersNodesLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : number[] = [];
        for (const tileType of war.getGcData().getAllTileTypeArray()) {
            const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsNum.Num(war, tileType)], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsersResultsNum.Num)) {
                throw HelpersMisc.newError(`Invalid lambda result.`);
            }

            if (result.num !== 0) {
                resultArray.push(tileType);
            }
        }

        return new ExpressionParsersResultsNumArray.NumArray(war, resultArray);
    }

    public callAllPositions(arg: ExpressionParsersResultsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsPositionArray.PositionArray {
        if (!(arg instanceof ExpressionParsersResultsLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsersNodesLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected node.`);
        }

        const war               = this.getWar();
        const { width, height } = war.getTileMap().getMapSize().getWH();
        const resultArray       : ExpressionParsersResultsPosition.Position[] = [];
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const position  = new ExpressionParsersResultsPosition.Position(war, x, y);
                const result    = node.evalLambda(rootCtx, [position], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsNum.Num)) {
                    throw HelpersMisc.newError(`Invalid lambda result.`);
                }

                if (result.num !== 0) {
                    resultArray.push(position);
                }
            }
        }

        return new ExpressionParsersResultsPositionArray.PositionArray(war, resultArray);
    }

    private callAllPersistentActionIds(rawArg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNumArray.NumArray {
        if (!(rawArg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Invalid rawArg.`);
        }

        const arg = NumbersUtils.getValueInRange({
            minValue    : 0,
            maxValue    : NumbersConstants.MaxInt32,
            rawValue    : Math.floor(rawArg.num),
        });
        const war             = this.getWar();
        const warEventManager = war.getWarEventManager();
        if (arg === 1) {
            return new ExpressionParsersResultsNumArray.NumArray(war, warEventManager.getOpaIdArray());
        } else if (arg === 2) {
            const opaIdSet      = new Set(warEventManager.getOpaIdArray());
            const resultIdArray : number[] = [];
            for (const id of warEventManager.getAllPersistentActionIdArray()) {
                if (!opaIdSet.has(id)) {
                    resultIdArray.push(id);
                }
            }
            return new ExpressionParsersResultsNumArray.NumArray(war, resultIdArray);
        } else {
            return new ExpressionParsersResultsNumArray.NumArray(war, warEventManager.getAllPersistentActionIdArray());
        }
    }

    public callArray(argumentArray: ExpressionParsersResultsBase.Base[]): ExpressionParsersResultsBase.Base {
        const value0 = argumentArray[0];
        if (value0 instanceof ExpressionParsersResultsNum.Num) {
            const numberArray: number[] = [value0.num];
            for (let i = 1; i < argumentArray.length; ++i) {
                const v = argumentArray[i];
                if (!(v instanceof ExpressionParsersResultsNum.Num)) {
                    throw HelpersMisc.newError(`Invalid value: ${v}`);
                }
                numberArray.push(v.num);
            }
            return new ExpressionParsersResultsNumArray.NumArray(this.getWar(), numberArray);

        } else if (value0 instanceof ExpressionParsersResultsNullableUnit.NullableUnit) {
            const unitArray: ExpressionParsersResultsNullableUnit.NullableUnit[] = [value0];
            for (let i = 1; i < argumentArray.length; ++i) {
                const v = argumentArray[i];
                if (!(v instanceof ExpressionParsersResultsNullableUnit.NullableUnit)) {
                    throw HelpersMisc.newError(`Inconsistent argument type.`);
                }
                unitArray.push(v);
            }
            return new ExpressionParsersResultsNullableUnitArray.NullableUnitArray(this.getWar(), unitArray);

        } else if (value0 instanceof ExpressionParsersResultsUnitStatistic.UnitStatistic) {
            const dataArray: ExpressionParsersResultsUnitStatistic.UnitStatistic[] = [value0];
            for (let i = 1; i < argumentArray.length; ++i) {
                const v = argumentArray[i];
                if (!(v instanceof ExpressionParsersResultsUnitStatistic.UnitStatistic)) {
                    throw HelpersMisc.newError(`Inconsistent argument type.`);
                }
                dataArray.push(v);
            }
            return new ExpressionParsersResultsUnitStatisticArray.UnitStatisticArray(this.getWar(), dataArray);

        } else if (value0 instanceof ExpressionParsersResultsTile.Tile) {
            const tileArray: ITile[] = [value0.tile];
            for (let i = 1; i < argumentArray.length; ++i) {
                const v = argumentArray[i];
                if (!(v instanceof ExpressionParsersResultsTile.Tile)) {
                    throw HelpersMisc.newError(`Inconsistent argument type.`);
                }
                tileArray.push(v.tile);
            }
            return new ExpressionParsersResultsTileArray.TileArray(this.getWar(), tileArray);

        } else if (value0 instanceof ExpressionParsersResultsTileBuff.TileBuff) {
            const dataArray = [value0];
            for (let i = 1; i < argumentArray.length; ++i) {
                const v = argumentArray[i];
                if (!(v instanceof ExpressionParsersResultsTileBuff.TileBuff)) {
                    throw HelpersMisc.newError(`Inconsistent argument type.`);
                }
                dataArray.push(v);
            }
            return new ExpressionParsersResultsTileBuffArray.TileBuffArray(this.getWar(), dataArray);

        } else if (value0 instanceof ExpressionParsersResultsPlayer.Player) {
            const playerArray: IPlayer[] = [value0.player];
            for (let i = 1; i < argumentArray.length; ++i) {
                const v = argumentArray[i];
                if (!(v instanceof ExpressionParsersResultsPlayer.Player)) {
                    throw HelpersMisc.newError(`Inconsistent argument type.`);
                }
                playerArray.push(v.player);
            }
            return new ExpressionParsersResultsPlayerArray.PlayerArray(this.getWar(), playerArray);

        } else if (value0 instanceof ExpressionParsersResultsPosition.Position) {
            const positionArray = [value0];
            for (let i = 1; i < argumentArray.length; ++i) {
                const v = argumentArray[i];
                if (!(v instanceof ExpressionParsersResultsPosition.Position)) {
                    throw HelpersMisc.newError(`Inconsistent argument type.`);
                }
                positionArray.push(v);
            }
            return new ExpressionParsersResultsPositionArray.PositionArray(this.getWar(), positionArray);

        } else {
            throw HelpersMisc.newError(`Unexpected value0.`);
        }
    }

    private callMakePos(argumentArray: ExpressionParsersResultsBase.Base[]): ExpressionParsersResultsPosition.Position {
        if (argumentArray.length !== 2) {
            throw HelpersMisc.newError(`Invalid argumentArray.`);
        }

        const x = argumentArray[0];
        if (!(x instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Invalid x.`);
        }

        const y = argumentArray[1];
        if (!(y instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Invalid y.`);
        }

        return new ExpressionParsersResultsPosition.Position(this.getWar(), x.num, y.num);
    }

    private callPow(argumentArray: ExpressionParsersResultsBase.Base[]): ExpressionParsersResultsNum.Num {
        if (argumentArray.length !== 2) {
            throw HelpersMisc.newError(`Invalid argumentArray.`);
        }

        const x = argumentArray[0];
        if (!(x instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Invalid x.`);
        }

        const y = argumentArray[1];
        if (!(y instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Invalid y.`);
        }

        return new ExpressionParsersResultsNum.Num(this.getWar(), Math.pow(x.num, y.num));
    }

    private callMoveCost(argumentArray: ExpressionParsersResultsBase.Base[]): ExpressionParsersResultsNum.Num {
        if (argumentArray.length !== 2) {
            throw HelpersMisc.newError(`Invalid argumentArray.`);
        }

        const rawMoveTypeId = argumentArray[0];
        if (!(rawMoveTypeId instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Invalid x.`);
        }

        const rawTileTypeId = argumentArray[1];
        if (!(rawTileTypeId instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Invalid y.`);
        }

        const tileTypeId    = NumbersUtils.getValueInInt32(rawTileTypeId.num);
        const war           = this.getWar();
        const cfg1          = war.getGcData().getMoveCostCfg(tileTypeId);
        if (cfg1 == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        const moveTypeId    = NumbersUtils.getValueInInt32(rawMoveTypeId.num);
        const cfg2          = cfg1[moveTypeId];
        if (cfg2 == null) {
            return new ExpressionParsersResultsNum.Num(war, -2);
        }

        return new ExpressionParsersResultsNum.Num(war, cfg2.getCost() ?? -1);
    }
}
