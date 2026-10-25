import { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { Constants } from "../../customCounters/Constants.ts";
import { Base } from "./Base.ts";
import { ResultType, ContextType } from "../Enums.ts";
import { FunctionInfo } from "../FunctionInfo.ts";
import { Lambda } from "../nodes/Lambda.ts";
import type { Base as ExpressionParsersResultsBase } from "../results/Base.ts";
import { FogMap } from "../results/FogMap.ts";
import { Lambda as ExpressionParsersResultsLambda } from "../results/Lambda.ts";
import { NullableUnit } from "../results/NullableUnit.ts";
import { NullableUnitArray } from "../results/NullableUnitArray.ts";
import { Num } from "../results/Num.ts";
import { NumArray } from "../results/NumArray.ts";
import { Player } from "../results/Player.ts";
import { PlayerArray } from "../results/PlayerArray.ts";
import { Position } from "../results/Position.ts";
import { PositionArray } from "../results/PositionArray.ts";
import { TaskObjective } from "../results/TaskObjective.ts";
import { Tile } from "../results/Tile.ts";
import { TileArray } from "../results/TileArray.ts";
import { TileBuff } from "../results/TileBuff.ts";
import { TileBuffArray } from "../results/TileBuffArray.ts";
import { TurnManager } from "../results/TurnManager.ts";
import { UnitStatistic } from "../results/UnitStatistic.ts";
import { UnitStatisticArray } from "../results/UnitStatisticArray.ts";
import { WarOperation } from "../results/WarOperation.ts";
import { WeatherManager } from "../results/WeatherManager.ts";
import type { EpVariableInfoDict, EpVariableInfo, EpFunctionInfoDict } from "../Types.ts";
import { getErrorTextForParameterCount, getErrorTextForParameterType, getErrorTextForLambdaResultType } from "../Utils.ts";
import { createRange } from "../../helpers/Collection.ts";
import { newError } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getFormattedText } from "../../lang/Utils.ts";
import { MaxInt32 } from "../../numbers/Constants.ts";
import { getValueInRange, getValueInInt32 } from "../../numbers/Utils.ts";
import type { IPlayer } from "../../players/IPlayer.ts";
import type { ITile } from "../../tiles/ITile.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class War extends Base {
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
        ResultType.Player,
        ResultType.PlayerArray,
        ResultType.Unit,
        ResultType.UnitArray,
        ResultType.Tile,
        ResultType.TileArray,
        ResultType.TileBuff,
        ResultType.TileBuffArray,
        ResultType.UnitStatistic,
        ResultType.UnitStatisticArray,
        ResultType.Number,
        ResultType.NumberArray,
        ResultType.Position,
        ResultType.PositionArray,
    ];

    public static readonly Variables    = War.generateVariables();
    public static readonly Functions    = War.generateFunctions();
    private static generateVariables(): EpVariableInfoDict {
        const variables = new Map<string, EpVariableInfo>();
        variables.set(War.VnTurn,        { desc: TextType.A0447, resultType: ResultType.Turn,    isExtension: false } );
        variables.set(War.VnWeather,     { desc: TextType.A0461, resultType: ResultType.Weather, isExtension: false } );
        variables.set(War.VnFog,         { desc: TextType.A0458, resultType: ResultType.Fog,     isExtension: false } );

        return variables;
    }
    private static generateFunctions(): EpFunctionInfoDict {
        const functions = new Map<string, FunctionInfo>();
        functions.set(
            War.FnAbs,
            new FunctionInfo(
                TextType.A0455,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnAbs, 1, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_00
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(War.FnAbs, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextWar_GenerateFunctions_01
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnFloor,
            new FunctionInfo(
                TextType.A0119,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnFloor, 1, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_02
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(War.FnFloor, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextWar_GenerateFunctions_03
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnCeil,
            new FunctionInfo(
                TextType.A0474,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnCeil, 1, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_04
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(War.FnCeil, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextWar_GenerateFunctions_05
                        );
                    }

                    return ResultType.Number;
                },
            ),
        );
        functions.set(
            War.FnMin,
            new FunctionInfo(
                TextType.A0468,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length < 2) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnMin, `>=2`, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_06
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ResultType.Number) {
                            throw newError(
                                getErrorTextForParameterType(War.FnMin, i + 1, ResultType.Number, argType),
                                ClientErrorCode.EpContextWar_GenerateFunctions_07
                            );
                        }
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnMax,
            new FunctionInfo(
                TextType.A0469,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length < 2) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnMax, `>=2`, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_08
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ResultType.Number) {
                            throw newError(
                                getErrorTextForParameterType(War.FnMax, i + 1, ResultType.Number, argType),
                                ClientErrorCode.EpContextWar_GenerateFunctions_09
                            );
                        }
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnIsAmong,
            new FunctionInfo(
                TextType.A0130,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length < 2) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnIsAmong, `>=2`, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_10
                        );
                    }

                    const argType0 = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (War.ParameterTypesForIsAmong.indexOf(argType0) < 0) {
                        throw newError(
                            getErrorTextForParameterType(War.FnIsAmong, 1, War.ParameterTypesForIsAmong, argType0),
                            ClientErrorCode.EpContextWar_GenerateFunctions_11
                        );
                    }

                    for (let i = 1; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== argType0) {
                            throw newError(
                                getErrorTextForParameterType(War.FnIsAmong, i + 1, argType0, argType),
                                ClientErrorCode.EpContextWar_GenerateFunctions_12
                            );
                        }
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnRandom,
            new FunctionInfo(
                TextType.A0120,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict) => {
                    if (argArray.length !== 0) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnRandom, 0, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_13
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnRandomInt,
            new FunctionInfo(
                TextType.A0525,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnRandomInt, 2, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_14
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ResultType.Number) {
                            throw newError(
                                getErrorTextForParameterType(War.FnRandomInt, i + 1, ResultType.Number, argType),
                                ClientErrorCode.EpContextWar_GenerateFunctions_15
                            );
                        }
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnRandomPick,
            new FunctionInfo(
                TextType.A0661,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 3) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnRandomPick, 3, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_16
                        );
                    }

                    const arg0                  = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    const supportedArg0Array    = [
                        ResultType.NumberArray,
                        ResultType.PlayerArray,
                        ResultType.PositionArray,
                        ResultType.TileArray,
                        ResultType.UnitArray,
                        ResultType.UnitStatisticArray,
                        ResultType.TileBuffArray,
                    ];
                    if (supportedArg0Array.indexOf(arg0) < 0) {
                        throw newError(
                            getErrorTextForParameterType(War.FnRandomPick, 1, supportedArg0Array, arg0),
                            ClientErrorCode.EpContextWar_GenerateFunctions_17
                        );
                    }

                    for (let i = 1; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ResultType.Number) {
                            throw newError(
                                getErrorTextForParameterType(War.FnRandomPick, i + 1, ResultType.Number, argType),
                                ClientErrorCode.EpContextWar_GenerateFunctions_18
                            );
                        }
                    }

                    return arg0;
                },
            )
        );
        functions.set(
            War.FnCustomCounter,
            new FunctionInfo(
                TextType.A0121,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnCustomCounter, 1, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_19
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(War.FnCustomCounter, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextWar_GenerateFunctions_20
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnPlayer,
            new FunctionInfo(
                TextType.A0385,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnPlayer, 1, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_21
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(War.FnPlayer, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextWar_GenerateFunctions_22
                        );
                    }

                    return ResultType.Player;
                },
            )
        );
        functions.set(
            War.FnHasUnit,
            new FunctionInfo(
                TextType.A0122,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnHasUnit, 2, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_23
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ResultType.Number) {
                            throw newError(
                                getErrorTextForParameterType(War.FnHasUnit, i + 1, ResultType.Number, argType),
                                ClientErrorCode.EpContextWar_GenerateFunctions_24
                            );
                        }
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnUnit,
            new FunctionInfo(
                TextType.A0467,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnUnit, 2, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_25
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ResultType.Number) {
                            throw newError(
                                getErrorTextForParameterType(War.FnUnit, i + 1, ResultType.Number, argType),
                                ClientErrorCode.EpContextWar_GenerateFunctions_26
                            );
                        }
                    }

                    return ResultType.Unit;
                },
            )
        );
        functions.set(
            War.FnTeamIndex,
            new FunctionInfo(
                TextType.A0142,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnTeamIndex, 1, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_27
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(War.FnTeamIndex, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextWar_GenerateFunctions_28
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnTile,
            new FunctionInfo(
                TextType.A0413,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnTile, 2, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_29
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ResultType.Number) {
                            throw newError(
                                getErrorTextForParameterType(War.FnTile, i + 1, ResultType.Number, argType),
                                ClientErrorCode.EpContextWar_GenerateFunctions_30
                            );
                        }
                    }

                    return ResultType.Tile;
                },
            )
        );
        functions.set(
            War.FnWarEventTriggeredTimes,
            new FunctionInfo(
                TextType.A0702,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnWarEventTriggeredTimes, 2, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_31
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ResultType.Number) {
                            throw newError(
                                getErrorTextForParameterType(War.FnWarEventTriggeredTimes, i + 1, ResultType.Number, argType),
                                ClientErrorCode.EpContextWar_GenerateFunctions_32
                            );
                        }
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnWarOperation,
            new FunctionInfo(
                TextType.A0706,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnWarOperation, 1, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_33
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ResultType.Number) {
                            throw newError(
                                getErrorTextForParameterType(War.FnWarOperation, i + 1, ResultType.Number, argType),
                                ClientErrorCode.EpContextWar_GenerateFunctions_34
                            );
                        }
                    }

                    return ResultType.WarOperation;
                },
            )
        );
        functions.set(
            War.FnTaskObjective,
            new FunctionInfo(
                TextType.A0726,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnTaskObjective, 1, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_35
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ResultType.Number) {
                            throw newError(
                                getErrorTextForParameterType(War.FnTaskObjective, i + 1, ResultType.Number, argType),
                                ClientErrorCode.EpContextWar_GenerateFunctions_36
                            );
                        }
                    }

                    return ResultType.TaskObjective;
                },
            )
        );
        functions.set(
            War.FnAllUnits,
            new FunctionInfo(
                TextType.A0479,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnAllUnits, 1, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_37
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof Lambda)) {
                        throw newError(
                            getErrorTextForParameterType(War.FnAllUnits, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextWar_GenerateFunctions_38
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ResultType.Unit],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForLambdaResultType(War.FnAllUnits, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextWar_GenerateFunctions_39
                        );
                    }

                    return ResultType.UnitArray;
                },
            )
        );
        functions.set(
            War.FnAllTiles,
            new FunctionInfo(
                TextType.A0493,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnAllTiles, 1, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_40
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof Lambda)) {
                        throw newError(
                            getErrorTextForParameterType(War.FnAllTiles, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextWar_GenerateFunctions_41
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ResultType.Tile],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForLambdaResultType(War.FnAllTiles, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextWar_GenerateFunctions_42
                        );
                    }

                    return ResultType.TileArray;
                },
            )
        );
        functions.set(
            War.FnAllPlayers,
            new FunctionInfo(
                TextType.A0494,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnAllPlayers, 1, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_43
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof Lambda)) {
                        throw newError(
                            getErrorTextForParameterType(War.FnAllPlayers, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextWar_GenerateFunctions_44
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ResultType.Player],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForLambdaResultType(War.FnAllPlayers, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextWar_GenerateFunctions_45
                        );
                    }

                    return ResultType.PlayerArray;
                },
            )
        );
        functions.set(
            War.FnAllUnitStatistics,
            new FunctionInfo(
                TextType.A0512,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnAllUnitStatistics, 1, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_46
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof Lambda)) {
                        throw newError(
                            getErrorTextForParameterType(War.FnAllUnitStatistics, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextWar_GenerateFunctions_47
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ResultType.UnitStatistic],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForLambdaResultType(War.FnAllUnitStatistics, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextWar_GenerateFunctions_48
                        );
                    }

                    return ResultType.UnitStatisticArray;
                },
            )
        );
        functions.set(
            War.FnAllCustomCounterIds,
            new FunctionInfo(
                TextType.A0529,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnAllCustomCounterIds, 1, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_49
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof Lambda)) {
                        throw newError(
                            getErrorTextForParameterType(War.FnAllCustomCounterIds, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextWar_GenerateFunctions_50
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ResultType.Number],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForLambdaResultType(War.FnAllCustomCounterIds, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextWar_GenerateFunctions_51
                        );
                    }

                    return ResultType.NumberArray;
                },
            )
        );
        functions.set(
            War.FnAllUnitTypes,
            new FunctionInfo(
                TextType.A0700,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnAllUnitTypes, 1, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_52
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof Lambda)) {
                        throw newError(
                            getErrorTextForParameterType(War.FnAllUnitTypes, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextWar_GenerateFunctions_53
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ResultType.Number],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForLambdaResultType(War.FnAllUnitTypes, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextWar_GenerateFunctions_54
                        );
                    }

                    return ResultType.NumberArray;
                },
            )
        );
        functions.set(
            War.FnAllTileTypes,
            new FunctionInfo(
                TextType.A0701,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnAllTileTypes, 1, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_55
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof Lambda)) {
                        throw newError(
                            getErrorTextForParameterType(War.FnAllTileTypes, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextWar_GenerateFunctions_56
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ResultType.Number],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForLambdaResultType(War.FnAllTileTypes, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextWar_GenerateFunctions_57
                        );
                    }

                    return ResultType.NumberArray;
                },
            )
        );
        functions.set(
            War.FnAllPositions,
            new FunctionInfo(
                TextType.A0578,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnAllPositions, 1, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_58
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof Lambda)) {
                        throw newError(
                            getErrorTextForParameterType(War.FnAllPositions, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextWar_GenerateFunctions_59
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ResultType.Position],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForLambdaResultType(War.FnAllPositions, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextWar_GenerateFunctions_60
                        );
                    }

                    return ResultType.PositionArray;
                },
            )
        );
        functions.set(
            War.FnAllPersistentActionIds,
            new FunctionInfo(
                TextType.A0703,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnAllPersistentActionIds, 1, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_61
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(War.FnAllPersistentActionIds, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextWar_GenerateFunctions_62
                        );
                    }

                    return ResultType.NumberArray;
                },
            )
        );
        functions.set(
            War.FnArray,
            new FunctionInfo(
                TextType.A0498,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length < 1) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnArray, `>=1`, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_63
                        );
                    }

                    const argType0 = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if ((argType0 !== ResultType.Number)          &&
                        (argType0 !== ResultType.Player)          &&
                        (argType0 !== ResultType.Tile)            &&
                        (argType0 !== ResultType.TileBuff)        &&
                        (argType0 !== ResultType.Unit)            &&
                        (argType0 !== ResultType.UnitStatistic)   &&
                        (argType0 !== ResultType.Position)
                    ) {
                        throw newError(
                            getErrorTextForParameterType(
                                War.FnArray,
                                1,
                                [
                                    ResultType.Number,
                                    ResultType.Player,
                                    ResultType.Tile,
                                    ResultType.TileBuff,
                                    ResultType.Unit,
                                    ResultType.UnitStatistic,
                                    ResultType.Position
                                ],
                                argType0
                            ),
                            ClientErrorCode.EpContextWar_GenerateFunctions_64
                        );
                    }

                    for (let i = 1; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== argType0) {
                            throw newError(
                                getErrorTextForParameterType(War.FnArray, i + 1, argType0, argType),
                                ClientErrorCode.EpContextWar_GenerateFunctions_65
                            );
                        }
                    }

                    switch (argType0) {
                        case ResultType.Number        : return ResultType.NumberArray;
                        case ResultType.Player        : return ResultType.PlayerArray;
                        case ResultType.Tile          : return ResultType.TileArray;
                        case ResultType.TileBuff      : return ResultType.TileBuffArray;
                        case ResultType.Unit          : return ResultType.UnitArray;
                        case ResultType.UnitStatistic : return ResultType.UnitStatisticArray;
                        case ResultType.Position      : return ResultType.PositionArray;
                        default                         : throw newError(
                            getErrorTextForParameterType(
                                War.FnArray,
                                1,
                                [
                                    ResultType.Number,
                                    ResultType.Player,
                                    ResultType.Tile,
                                    ResultType.TileBuff,
                                    ResultType.Unit,
                                    ResultType.UnitStatistic,
                                    ResultType.Position
                                ],
                                argType0
                            ),
                            ClientErrorCode.EpContextWar_GenerateFunctions_66
                        );
                    }
                },
            ),
        );
        functions.set(
            War.FnMakePos,
            new FunctionInfo(
                TextType.A0579,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnMakePos, 2, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_67
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ResultType.Number) {
                            throw newError(
                                getErrorTextForParameterType(War.FnMakePos, i + 1, ResultType.Number, argType),
                                ClientErrorCode.EpContextWar_GenerateFunctions_68
                            );
                        }
                    }

                    return ResultType.Position;
                },
            )
        );
        functions.set(
            War.FnPow,
            new FunctionInfo(
                TextType.A0855,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnPow, 2, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_69
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ResultType.Number) {
                            throw newError(
                                getErrorTextForParameterType(War.FnPow, i + 1, ResultType.Number, argType),
                                ClientErrorCode.EpContextWar_GenerateFunctions_70
                            );
                        }
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            War.FnMoveCost,
            new FunctionInfo(
                TextType.A0928,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw newError(
                            getErrorTextForParameterCount(War.FnMoveCost, 2, argArray.length),
                            ClientErrorCode.EpContextWar_GenerateFunctions_71
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ResultType.Number) {
                            throw newError(
                                getErrorTextForParameterType(War.FnMoveCost, i + 1, ResultType.Number, argType),
                                ClientErrorCode.EpContextWar_GenerateFunctions_72
                            );
                        }
                    }

                    return ResultType.Number;
                },
            )
        );

        return functions;
    }

    public constructor(war: IBwWar) {
        super(war);
    }

    public getContextType(): ContextType {
        return ContextType.War;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase {
        const war = this.getWar();
        switch (identifierName) {
            case War.VnTurn        : return new TurnManager(war.getTurnManager());
            case War.VnWeather     : return new WeatherManager(war.getWeatherManager());
            case War.VnFog         : return new FogMap(war.getFogMap());
            default                         : throw newError(
                getFormattedText(TextType.F0021, identifierName),
                ClientErrorCode.EpContextWar_ResolveVariable_00,
            );
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase[], rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsBase {
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
            default                                     : throw newError(
                getFormattedText(TextType.F0024, identifierName),
                ClientErrorCode.EpContextWar_CallFunction_00,
            );
        }
    }

    private callAbs(arg: ExpressionParsersResultsBase): Num {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        return new Num(arg.war, Math.abs(arg.num));
    }

    private callFloor(arg: ExpressionParsersResultsBase): Num {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        return new Num(arg.war, Math.floor(arg.num));
    }

    private callCeil(arg: ExpressionParsersResultsBase): Num {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        return new Num(arg.war, Math.ceil(arg.num));
    }

    private callMin(argArray: ExpressionParsersResultsBase[]): Num {
        if (!argArray.length) {
            throw newError(`Empty argArray.`);
        }
        const numArray = argArray.map(v => {
            if (v instanceof Num) {
                return v.num;
            } else {
                throw newError(`Unexpected argArray.`);
            }
        });

        return new Num(this.getWar(), Math.min(...numArray));
    }

    private callMax(argArray: ExpressionParsersResultsBase[]): Num {
        if (!argArray.length) {
            throw newError(`Empty argArray.`);
        }
        const numArray = argArray.map(v => {
            if (v instanceof Num) {
                return v.num;
            } else {
                throw newError(`Unexpected argArray.`);
            }
        });

        return new Num(this.getWar(), Math.max(...numArray));
    }

    public callIsAmong(argumentArray: ExpressionParsersResultsBase[]): Num {
        const v = argumentArray[0];
        for (let i = 1; i < argumentArray.length; ++i) {
            if (v.checkIsEqual(argumentArray[i])) {
                return new Num(this.getWar(), 1);
            }
        }

        return new Num(this.getWar(), 0);
    }

    public callRandom(isRestricted: boolean): Num {
        if (isRestricted) {
            throw newError(`Restricted.`);
        }

        const war = this.getWar();
        return new Num(war, war.getRandomNumberManager().getAndTickNextNumber());
    }

    public callRandomInt(argArray: ExpressionParsersResultsBase[], isRestricted: boolean): Num {
        if (isRestricted) {
            throw newError(`Restricted.`);
        }

        const arg0 = argArray[0];
        if (!(arg0 instanceof Num)) {
            throw newError(`Unexpected arg0.`);
        }

        const arg1 = argArray[1];
        if (!(arg1 instanceof Num)) {
            throw newError(`Unexpected arg1.`);
        }

        const lowerLimit    = Math.ceil(arg0.num);
        const upperLimit    = Math.floor(arg1.num);
        if ((!isFinite(lowerLimit)) || (!isFinite(upperLimit)) || (lowerLimit >= upperLimit)) {
            throw newError(`Invalid limits: ${lowerLimit}, ${upperLimit}`);
        }

        const war = this.getWar();
        return new Num(war, Math.floor(war.getRandomNumberManager().getAndTickNextNumber() * (upperLimit - lowerLimit) + lowerLimit));
    }

    private callRandomPick(argArray: ExpressionParsersResultsBase[], isRestricted: boolean): ExpressionParsersResultsBase {
        if (isRestricted) {
            throw newError(`Restricted.`);
        }

        const count = argArray[1];
        if (!(count instanceof Num)) {
            throw newError(`Invalid argArray[1].`);
        }

        const rawNeedSort = argArray[2];
        if (!(rawNeedSort instanceof Num)) {
            throw newError(`Invalid argArray[2].`);
        }

        const needSort  = rawNeedSort.num !== 0;
        const src       = argArray[0];
        if (src instanceof NumArray) {
            return this.callRandomPickNumberArray(src, count.num, needSort);
        } else if (src instanceof PlayerArray) {
            return this.callRandomPickPlayerArray(src, count.num, needSort);
        } else if (src instanceof PositionArray) {
            return this.callRandomPickPositionArray(src, count.num, needSort);
        } else if (src instanceof TileArray) {
            return this.callRandomPickTileArray(src, count.num, needSort);
        } else if (src instanceof TileBuffArray) {
            return this.callRandomPickTileBuffArray(src, count.num, needSort);
        } else if (src instanceof NullableUnitArray) {
            return this.callRandomPickUnitArray(src, count.num, needSort);
        } else if (src instanceof UnitStatisticArray) {
            return this.callRandomPickUnitStatisticsArray(src, count.num, needSort);
        } else {
            throw newError(`Invalid argArray[0].`);
        }
    }
    private callRandomPickNumberArray(src: NumArray, rawCount: number, needSort: boolean): NumArray {
        const war         = this.getWar();
        const srcArray    = src.numberArray;
        const srcCount    = srcArray.length;
        const dstCount    = getValueInRange({
            minValue    : 0,
            maxValue    : srcCount,
            rawValue    : Math.floor(rawCount),
        });
        if (dstCount <= 0) {
            return new NumArray(war, []);
        }
        if ((dstCount === srcCount) && (needSort)) {
            return src;
        }

        const indexList   = this.getRandomIndexList(srcCount, dstCount, needSort);
        const dstArray    : number[] = [];
        for (let i = 0; i < dstCount; ++i) {
            dstArray[i] = srcArray[indexList[i]];
        }
        return new NumArray(war, dstArray);
    }
    private callRandomPickPlayerArray(src: PlayerArray, rawCount: number, needSort: boolean): PlayerArray {
        const war         = this.getWar();
        const srcArray    = src.array;
        const srcCount    = srcArray.length;
        const dstCount    = getValueInRange({
            minValue    : 0,
            maxValue    : srcCount,
            rawValue    : Math.floor(rawCount),
        });
        if (dstCount <= 0) {
            return new PlayerArray(war, []);
        }
        if ((dstCount === srcCount) && (needSort)) {
            return src;
        }

        const indexList   = this.getRandomIndexList(srcCount, dstCount, needSort);
        const dstArray    : IPlayer[] = [];
        for (let i = 0; i < dstCount; ++i) {
            dstArray[i] = srcArray[indexList[i]];
        }
        return new PlayerArray(war, dstArray);
    }
    private callRandomPickPositionArray(src: PositionArray, rawCount: number, needSort: boolean): PositionArray {
        const war         = this.getWar();
        const srcArray    = src.positionArray;
        const srcCount    = srcArray.length;
        const dstCount    = getValueInRange({
            minValue    : 0,
            maxValue    : srcCount,
            rawValue    : Math.floor(rawCount),
        });
        if (dstCount <= 0) {
            return new PositionArray(war, []);
        }
        if ((dstCount === srcCount) && (needSort)) {
            return src;
        }

        const indexList   = this.getRandomIndexList(srcCount, dstCount, needSort);
        const dstArray    : Position[] = [];
        for (let i = 0; i < dstCount; ++i) {
            dstArray[i] = srcArray[indexList[i]];
        }
        return new PositionArray(war, dstArray);
    }
    private callRandomPickTileArray(src: TileArray, rawCount: number, needSort: boolean): TileArray {
        const war         = this.getWar();
        const srcArray    = src.array;
        const srcCount    = srcArray.length;
        const dstCount    = getValueInRange({
            minValue    : 0,
            maxValue    : srcCount,
            rawValue    : Math.floor(rawCount),
        });
        if (dstCount <= 0) {
            return new TileArray(war, []);
        }
        if ((dstCount === srcCount) && (needSort)) {
            return src;
        }

        const indexList   = this.getRandomIndexList(srcCount, dstCount, needSort);
        const dstArray    : ITile[] = [];
        for (let i = 0; i < dstCount; ++i) {
            dstArray[i] = srcArray[indexList[i]];
        }
        return new TileArray(war, dstArray);
    }
    private callRandomPickTileBuffArray(src: TileBuffArray, rawCount: number, needSort: boolean): TileBuffArray {
        const war         = this.getWar();
        const srcArray    = src.buffArray;
        const srcCount    = srcArray.length;
        const dstCount    = getValueInRange({
            minValue    : 0,
            maxValue    : srcCount,
            rawValue    : Math.floor(rawCount),
        });
        if (dstCount <= 0) {
            return new TileBuffArray(war, []);
        }
        if ((dstCount === srcCount) && (needSort)) {
            return src;
        }

        const indexList   = this.getRandomIndexList(srcCount, dstCount, needSort);
        const dstArray    : TileBuff[] = [];
        for (let i = 0; i < dstCount; ++i) {
            dstArray[i] = srcArray[indexList[i]];
        }
        return new TileBuffArray(war, dstArray);
    }
    private callRandomPickUnitArray(src: NullableUnitArray, rawCount: number, needSort: boolean): NullableUnitArray {
        const war         = this.getWar();
        const srcArray    = src.array;
        const srcCount    = srcArray.length;
        const dstCount    = getValueInRange({
            minValue    : 0,
            maxValue    : srcCount,
            rawValue    : Math.floor(rawCount),
        });
        if (dstCount <= 0) {
            return new NullableUnitArray(war, []);
        }
        if ((dstCount === srcCount) && (needSort)) {
            return src;
        }

        const indexList   = this.getRandomIndexList(srcCount, dstCount, needSort);
        const dstArray    : NullableUnit[] = [];
        for (let i = 0; i < dstCount; ++i) {
            dstArray[i] = srcArray[indexList[i]];
        }
        return new NullableUnitArray(war, dstArray);
    }
    private callRandomPickUnitStatisticsArray(src: UnitStatisticArray, rawCount: number, needSort: boolean): UnitStatisticArray {
        const war         = this.getWar();
        const srcArray    = src.dataArray;
        const srcCount    = srcArray.length;
        const dstCount    = getValueInRange({
            minValue    : 0,
            maxValue    : srcCount,
            rawValue    : Math.floor(rawCount),
        });
        if (dstCount <= 0) {
            return new UnitStatisticArray(war, []);
        }
        if ((dstCount === srcCount) && (needSort)) {
            return src;
        }

        const indexList   = this.getRandomIndexList(srcCount, dstCount, needSort);
        const dstArray    : UnitStatistic[] = [];
        for (let i = 0; i < dstCount; ++i) {
            dstArray[i] = srcArray[indexList[i]];
        }
        return new UnitStatisticArray(war, dstArray);
    }
    private getRandomIndexList(srcCount: number, dstCount: number, needSort: boolean): number[] {
        const srcArray            = createRange(0, srcCount, 1);
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

    public callCustomCounter(arg: ExpressionParsersResultsBase): Num {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const customCounterId = arg.num;
        if (customCounterId !== Math.floor(customCounterId)) {
            throw newError(`Invalid customCounterId: ${customCounterId}`);
        }

        const war = this.getWar();
        if ((customCounterId > Constants.MaxId) ||
            (customCounterId < Constants.MinId)
        ) {
            return new Num(war, 0);
        }

        return new Num(war, war.getWarEventManager().getCustomCounter(customCounterId));
    }

    public callPlayer(arg: ExpressionParsersResultsBase): Player {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const playerIndex = arg.num;
        if (playerIndex !== Math.floor(playerIndex)) {
            throw newError(`Invalid playerIndex: ${playerIndex}`);
        }
        return new Player(this.getWar().getPlayer(playerIndex));
    }

    public callHasUnit(argX: ExpressionParsersResultsBase, argY: ExpressionParsersResultsBase): Num {
        if (!(argX instanceof Num)) {
            throw newError(`Unexpected argX.`);
        }
        if (!(argY instanceof Num)) {
            throw newError(`Unexpected argY.`);
        }

        const x = argX.num;
        const y = argY.num;
        if ((x !== Math.floor(x)) || (y !== Math.floor(y))) {
            throw newError(`Invalid xy: ${x}, ${y}`);
        }

        const gridIndex = new GridIndex(x, y);
        const war       = this.getWar();
        const unitMap   = war.getUnitMap();
        if (!gridIndex.checkIsInsideMap(unitMap.getMapSize())) {
            throw newError(`Out of map, xy: ${x}, ${y}`);
        }

        return new Num(war, unitMap.getUnitOnMap(gridIndex) ? 1 : 0);
    }

    public callUnit(argX: ExpressionParsersResultsBase, argY: ExpressionParsersResultsBase): NullableUnit {
        if (!(argX instanceof Num)) {
            throw newError(`Unexpected argX.`);
        }
        if (!(argY instanceof Num)) {
            throw newError(`Unexpected argY.`);
        }

        const x = argX.num;
        const y = argY.num;
        if ((x !== Math.floor(x)) || (y !== Math.floor(y))) {
            throw newError(`Invalid xy: ${x}, ${y}`);
        }

        const gridIndex = new GridIndex(x, y);
        const war       = this.getWar();
        const unitMap   = war.getUnitMap();
        if (!gridIndex.checkIsInsideMap(unitMap.getMapSize())) {
            throw newError(`Out of map, xy: ${x}, ${y}`);
        }

        return new NullableUnit(war, unitMap.getUnitOnMap(gridIndex));
    }

    public callTeamIndex(arg: ExpressionParsersResultsBase): Num {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const playerIndex = arg.num;
        if (playerIndex !== Math.floor(playerIndex)) {
            throw newError(`Invalid playerIndex: ${playerIndex}`);
        }

        const war = this.getWar();
        return new Num(war, war.getPlayer(playerIndex).getTeamIndex());
    }

    public callTile(argX: ExpressionParsersResultsBase, argY: ExpressionParsersResultsBase): Tile {
        if (!(argX instanceof Num)) {
            throw newError(`Unexpected argX.`);
        }
        if (!(argY instanceof Num)) {
            throw newError(`Unexpected argY.`);
        }

        const x = argX.num;
        const y = argY.num;
        if ((x !== Math.floor(x)) || (y !== Math.floor(y))) {
            throw newError(`Invalid x y: ${x}, ${y}`);
        }

        return new Tile(this.getWar().getTileMap().getTile(new GridIndex(x, y)));
    }

    private callWarEventTriggeredTimes(rawWarEventId: ExpressionParsersResultsBase, rawArg: ExpressionParsersResultsBase): Num {
        if (!(rawWarEventId instanceof Num)) {
            throw newError(`Unexpected rawWarEventId.`);
        }
        if (!(rawArg instanceof Num)) {
            throw newError(`Unexpected rawArg.`);
        }

        const warEventId = getValueInRange({
            minValue    : 0,
            maxValue    : MaxInt32,
            rawValue    : Math.floor(rawWarEventId.num),
        });
        const arg = getValueInRange({
            minValue    : 0,
            maxValue    : MaxInt32,
            rawValue    : Math.floor(rawArg.num),
        });
        const war               = this.getWar();
        const warEventManager   = war.getWarEventManager();
        return new Num(war, arg === 1
            ? warEventManager.getWarEventCalledCountInPlayerTurn(warEventId)
            : warEventManager.getWarEventCalledCountTotal(warEventId)
        );
    }

    private callWarOperation(arg: ExpressionParsersResultsBase): WarOperation {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const war               = this.getWar();
        const operationArray    = war.getExecutedOperationManager().getAllExecutedOperationArray();
        const rawIndex          = getValueInInt32(arg.num);
        const index             = rawIndex >= 0 ? rawIndex : operationArray.length + rawIndex;
        return new WarOperation(operationArray[index] ?? null, war);
    }

    private callTaskObjective(arg: ExpressionParsersResultsBase): TaskObjective {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        return new TaskObjective(this.getWar(), getValueInInt32(arg.num));
    }

    public callAllUnits(arg: ExpressionParsersResultsBase, rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): NullableUnitArray {
        if (!(arg instanceof ExpressionParsersResultsLambda)) {
            throw newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof Lambda)) {
            throw newError(`Unexpected node.`);
        }

        const war       = this.getWar();
        const units     = war.getUnitMap().getAllUnits().sort((v1, v2) => v1.getUnitId() - v2.getUnitId()).map(v => new NullableUnit(war, v));
        const unitArray : NullableUnit[] = [];
        for (const unit of units) {
            const result = node.evalLambda(rootCtx, [unit], null, localVariableDict, isRestricted);
            if (!(result instanceof Num)) {
                throw newError(`Invalid lambda result.`, ClientErrorCode.EpContextWar_CallAllUnits_00);
            }

            if (result.num !== 0) {
                unitArray.push(unit);
            }
        }

        return new NullableUnitArray(war, unitArray);
    }

    public callAllTiles(arg: ExpressionParsersResultsBase, rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): TileArray {
        if (!(arg instanceof ExpressionParsersResultsLambda)) {
            throw newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof Lambda)) {
            throw newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const tiles         = war.getTileMap().getAllTiles();
        const resultArray   : ITile[] = [];
        for (const tile of tiles) {
            const result = node.evalLambda(rootCtx, [new Tile(tile)], null, localVariableDict, isRestricted);
            if (!(result instanceof Num)) {
                throw newError(`Invalid lambda result.`, ClientErrorCode.EpContextWar_CallAllTiles_00);
            }

            if (result.num !== 0) {
                resultArray.push(tile);
            }
        }

        return new TileArray(war, resultArray);
    }

    public callAllPlayers(arg: ExpressionParsersResultsBase, rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): PlayerArray {
        if (!(arg instanceof ExpressionParsersResultsLambda)) {
            throw newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof Lambda)) {
            throw newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const players       = war.getPlayerManager().getAllPlayers();
        const resultArray   : IPlayer[] = [];
        for (const player of players) {
            const result = node.evalLambda(rootCtx, [new Player(player)], null, localVariableDict, isRestricted);
            if (!(result instanceof Num)) {
                throw newError(`Invalid lambda result.`, ClientErrorCode.EpContextWar_CallAllPlayers_00);
            }

            if (result.num !== 0) {
                resultArray.push(player);
            }
        }

        return new PlayerArray(war, resultArray);
    }

    public callAllUnitStatistics(arg: ExpressionParsersResultsBase, rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): UnitStatisticArray {
        if (!(arg instanceof ExpressionParsersResultsLambda)) {
            throw newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof Lambda)) {
            throw newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : UnitStatistic[] = [];
        for (const rawData of war.getWarStatisticsManager().getUnitStatisticsArray()) {
            const data      = new UnitStatistic(war, {
                playerIndexArray                : [rawData.getDstPlayerIndex() ?? 0],
                unitTypeArray                   : [rawData.getUnitType() ?? 0],
                groupedObserverTeamIndexesArray : [rawData.getGroupedObserverTeamIndexes() ?? 0],
                unitGain                        : rawData.getUnitGain() ?? 0,
                unitLoss                        : rawData.getUnitLoss() ?? 0,
                normalizedHpGain                : rawData.getNormalizedHpGain() ?? 0,
                normalizedHpLoss                : rawData.getNormalizedHpLoss() ?? 0,
            });
            const result    = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
            if (!(result instanceof Num)) {
                throw newError(`Invalid lambda result.`, ClientErrorCode.EpContextWar_CallAllUnitStatistics_00);
            }

            if (result.num !== 0) {
                resultArray.push(data);
            }
        }

        return new UnitStatisticArray(war, resultArray);
    }

    private callAllCustomCounterIds(arg: ExpressionParsersResultsBase, rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): NumArray {
        if (!(arg instanceof ExpressionParsersResultsLambda)) {
            throw newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof Lambda)) {
            throw newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : number[] = [];
        for (let customCounterId = Constants.MinId; customCounterId <= Constants.MaxId; ++customCounterId) {
            const result = node.evalLambda(rootCtx, [new Num(war, customCounterId)], null, localVariableDict, isRestricted);
            if (!(result instanceof Num)) {
                throw newError(`Invalid lambda result.`, ClientErrorCode.EpContextWar_CallAllUnitStatistics_00);
            }

            if (result.num !== 0) {
                resultArray.push(customCounterId);
            }
        }

        return new NumArray(war, resultArray);
    }

    private callAllUnitTypes(arg: ExpressionParsersResultsBase, rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): NumArray {
        if (!(arg instanceof ExpressionParsersResultsLambda)) {
            throw newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof Lambda)) {
            throw newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : number[] = [];
        for (const unitType of war.getGcData().getAllUnitTypeArray()) {
            const result = node.evalLambda(rootCtx, [new Num(war, unitType)], null, localVariableDict, isRestricted);
            if (!(result instanceof Num)) {
                throw newError(`Invalid lambda result.`);
            }

            if (result.num !== 0) {
                resultArray.push(unitType);
            }
        }

        return new NumArray(war, resultArray);
    }

    private callAllTileTypes(arg: ExpressionParsersResultsBase, rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): NumArray {
        if (!(arg instanceof ExpressionParsersResultsLambda)) {
            throw newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof Lambda)) {
            throw newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : number[] = [];
        for (const tileType of war.getGcData().getAllTileTypeArray()) {
            const result = node.evalLambda(rootCtx, [new Num(war, tileType)], null, localVariableDict, isRestricted);
            if (!(result instanceof Num)) {
                throw newError(`Invalid lambda result.`);
            }

            if (result.num !== 0) {
                resultArray.push(tileType);
            }
        }

        return new NumArray(war, resultArray);
    }

    public callAllPositions(arg: ExpressionParsersResultsBase, rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): PositionArray {
        if (!(arg instanceof ExpressionParsersResultsLambda)) {
            throw newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof Lambda)) {
            throw newError(`Unexpected node.`);
        }

        const war               = this.getWar();
        const { width, height } = war.getTileMap().getMapSize().getWH();
        const resultArray       : Position[] = [];
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                const position  = new Position(war, x, y);
                const result    = node.evalLambda(rootCtx, [position], null, localVariableDict, isRestricted);
                if (!(result instanceof Num)) {
                    throw newError(`Invalid lambda result.`);
                }

                if (result.num !== 0) {
                    resultArray.push(position);
                }
            }
        }

        return new PositionArray(war, resultArray);
    }

    private callAllPersistentActionIds(rawArg: ExpressionParsersResultsBase): NumArray {
        if (!(rawArg instanceof Num)) {
            throw newError(`Invalid rawArg.`);
        }

        const arg = getValueInRange({
            minValue    : 0,
            maxValue    : MaxInt32,
            rawValue    : Math.floor(rawArg.num),
        });
        const war             = this.getWar();
        const warEventManager = war.getWarEventManager();
        if (arg === 1) {
            return new NumArray(war, warEventManager.getOpaIdArray());
        } else if (arg === 2) {
            const opaIdSet      = new Set(warEventManager.getOpaIdArray());
            const resultIdArray : number[] = [];
            for (const id of warEventManager.getAllPersistentActionIdArray()) {
                if (!opaIdSet.has(id)) {
                    resultIdArray.push(id);
                }
            }
            return new NumArray(war, resultIdArray);
        } else {
            return new NumArray(war, warEventManager.getAllPersistentActionIdArray());
        }
    }

    public callArray(argumentArray: ExpressionParsersResultsBase[]): ExpressionParsersResultsBase {
        const value0 = argumentArray[0];
        if (value0 instanceof Num) {
            const numberArray: number[] = [value0.num];
            for (let i = 1; i < argumentArray.length; ++i) {
                const v = argumentArray[i];
                if (!(v instanceof Num)) {
                    throw newError(`Invalid value: ${v}`);
                }
                numberArray.push(v.num);
            }
            return new NumArray(this.getWar(), numberArray);

        } else if (value0 instanceof NullableUnit) {
            const unitArray: NullableUnit[] = [value0];
            for (let i = 1; i < argumentArray.length; ++i) {
                const v = argumentArray[i];
                if (!(v instanceof NullableUnit)) {
                    throw newError(`Inconsistent argument type.`);
                }
                unitArray.push(v);
            }
            return new NullableUnitArray(this.getWar(), unitArray);

        } else if (value0 instanceof UnitStatistic) {
            const dataArray: UnitStatistic[] = [value0];
            for (let i = 1; i < argumentArray.length; ++i) {
                const v = argumentArray[i];
                if (!(v instanceof UnitStatistic)) {
                    throw newError(`Inconsistent argument type.`);
                }
                dataArray.push(v);
            }
            return new UnitStatisticArray(this.getWar(), dataArray);

        } else if (value0 instanceof Tile) {
            const tileArray: ITile[] = [value0.tile];
            for (let i = 1; i < argumentArray.length; ++i) {
                const v = argumentArray[i];
                if (!(v instanceof Tile)) {
                    throw newError(`Inconsistent argument type.`);
                }
                tileArray.push(v.tile);
            }
            return new TileArray(this.getWar(), tileArray);

        } else if (value0 instanceof TileBuff) {
            const dataArray = [value0];
            for (let i = 1; i < argumentArray.length; ++i) {
                const v = argumentArray[i];
                if (!(v instanceof TileBuff)) {
                    throw newError(`Inconsistent argument type.`);
                }
                dataArray.push(v);
            }
            return new TileBuffArray(this.getWar(), dataArray);

        } else if (value0 instanceof Player) {
            const playerArray: IPlayer[] = [value0.player];
            for (let i = 1; i < argumentArray.length; ++i) {
                const v = argumentArray[i];
                if (!(v instanceof Player)) {
                    throw newError(`Inconsistent argument type.`);
                }
                playerArray.push(v.player);
            }
            return new PlayerArray(this.getWar(), playerArray);

        } else if (value0 instanceof Position) {
            const positionArray = [value0];
            for (let i = 1; i < argumentArray.length; ++i) {
                const v = argumentArray[i];
                if (!(v instanceof Position)) {
                    throw newError(`Inconsistent argument type.`);
                }
                positionArray.push(v);
            }
            return new PositionArray(this.getWar(), positionArray);

        } else {
            throw newError(`Unexpected value0.`);
        }
    }

    private callMakePos(argumentArray: ExpressionParsersResultsBase[]): Position {
        if (argumentArray.length !== 2) {
            throw newError(`Invalid argumentArray.`);
        }

        const x = argumentArray[0];
        if (!(x instanceof Num)) {
            throw newError(`Invalid x.`);
        }

        const y = argumentArray[1];
        if (!(y instanceof Num)) {
            throw newError(`Invalid y.`);
        }

        return new Position(this.getWar(), x.num, y.num);
    }

    private callPow(argumentArray: ExpressionParsersResultsBase[]): Num {
        if (argumentArray.length !== 2) {
            throw newError(`Invalid argumentArray.`);
        }

        const x = argumentArray[0];
        if (!(x instanceof Num)) {
            throw newError(`Invalid x.`);
        }

        const y = argumentArray[1];
        if (!(y instanceof Num)) {
            throw newError(`Invalid y.`);
        }

        return new Num(this.getWar(), Math.pow(x.num, y.num));
    }

    private callMoveCost(argumentArray: ExpressionParsersResultsBase[]): Num {
        if (argumentArray.length !== 2) {
            throw newError(`Invalid argumentArray.`);
        }

        const rawMoveTypeId = argumentArray[0];
        if (!(rawMoveTypeId instanceof Num)) {
            throw newError(`Invalid x.`);
        }

        const rawTileTypeId = argumentArray[1];
        if (!(rawTileTypeId instanceof Num)) {
            throw newError(`Invalid y.`);
        }

        const tileTypeId    = getValueInInt32(rawTileTypeId.num);
        const war           = this.getWar();
        const cfg1          = war.getGcData().getMoveCostCfg(tileTypeId);
        if (cfg1 == null) {
            return new Num(war, -2);
        }

        const moveTypeId    = getValueInInt32(rawMoveTypeId.num);
        const cfg2          = cfg1[moveTypeId];
        if (cfg2 == null) {
            return new Num(war, -2);
        }

        return new Num(war, cfg2.getCost() ?? -1);
    }
}
