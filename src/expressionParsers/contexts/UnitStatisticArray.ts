import * as ExpressionParsersContextsBase from "./Base.ts";
import * as ExpressionParsersContextsWar from "./War.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersFunctionInfo from "../FunctionInfo.ts";
import * as ExpressionParsersNodesLambda from "../nodes/Lambda.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as ExpressionParsersResultsLambda from "../results/Lambda.ts";
import * as ExpressionParsersResultsNullableUnit from "../results/NullableUnit.ts";
import * as ExpressionParsersResultsNullableUnitArray from "../results/NullableUnitArray.ts";
import * as ExpressionParsersResultsNum from "../results/Num.ts";
import * as ExpressionParsersResultsNumArray from "../results/NumArray.ts";
import * as ExpressionParsersResultsPlayer from "../results/Player.ts";
import * as ExpressionParsersResultsPlayerArray from "../results/PlayerArray.ts";
import * as ExpressionParsersResultsPosition from "../results/Position.ts";
import * as ExpressionParsersResultsPositionArray from "../results/PositionArray.ts";
import * as ExpressionParsersResultsTile from "../results/Tile.ts";
import * as ExpressionParsersResultsTileArray from "../results/TileArray.ts";
import * as ExpressionParsersResultsTileBuff from "../results/TileBuff.ts";
import * as ExpressionParsersResultsTileBuffArray from "../results/TileBuffArray.ts";
import * as ExpressionParsersResultsUnitStatistic from "../results/UnitStatistic.ts";
import * as ExpressionParsersResultsUnitStatisticArray from "../results/UnitStatisticArray.ts";
import type * as ExpressionParsersTypes from "../Types.ts";
import * as ExpressionParsersUtils from "../Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import type * as PlayersIPlayer from "../../players/IPlayer.ts";
import type * as TilesITile from "../../tiles/ITile.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

export class UnitStatisticArray extends ExpressionParsersContextsBase.Base {
    // 因为部队统计数据没有自动填充0，所以暂时不提供length和get，如果要提供get，一定要做好排序。
    private static readonly FnMerge     = "merge";
    private static readonly FnWhere     = "where";
    private static readonly FnSelect    = "select";
    private static readonly FnAll       = "all";
    private static readonly FnAny       = "any";

    public static readonly Variables    = UnitStatisticArray.generateVariables();
    public static readonly Functions    = UnitStatisticArray.generateFunctions();
    private static generateVariables(): ExpressionParsersTypes.EpVariableInfoDict {
        const variables = ExpressionParsersUtils.extendVariableInfoDict(ExpressionParsersContextsWar.War.Variables);
        return variables;
    }
    private static generateFunctions(): ExpressionParsersTypes.EpFunctionInfoDict {
        const functions = ExpressionParsersUtils.extendFunctionInfoDict(ExpressionParsersContextsWar.War.Functions);
        functions.set(
            UnitStatisticArray.FnMerge,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0521,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 0) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(UnitStatisticArray.FnMerge, 0, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_00
                        );
                    }

                    return ExpressionParsersEnums.ResultType.UnitStatistic;
                },
            )
        );
        functions.set(
            UnitStatisticArray.FnWhere,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0558,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(UnitStatisticArray.FnWhere, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_01
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(UnitStatisticArray.FnWhere, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_02
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
                            ExpressionParsersUtils.getErrorTextForLambdaResultType(UnitStatisticArray.FnWhere, 1, [ExpressionParsersEnums.ResultType.Number], lambdaResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_03
                        );
                    }

                    return ExpressionParsersEnums.ResultType.UnitStatisticArray;
                },
            )
        );
        functions.set(
            UnitStatisticArray.FnSelect,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0557,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(UnitStatisticArray.FnSelect, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_04
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(UnitStatisticArray.FnSelect, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_05
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ExpressionParsersEnums.ResultType.UnitStatistic],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    switch (lambdaResultType) {
                        case ExpressionParsersEnums.ResultType.Number        : return ExpressionParsersEnums.ResultType.NumberArray;
                        case ExpressionParsersEnums.ResultType.Tile          : return ExpressionParsersEnums.ResultType.TileArray;
                        case ExpressionParsersEnums.ResultType.TileBuff      : return ExpressionParsersEnums.ResultType.TileBuffArray;
                        case ExpressionParsersEnums.ResultType.Unit          : return ExpressionParsersEnums.ResultType.UnitArray;
                        case ExpressionParsersEnums.ResultType.UnitStatistic : return ExpressionParsersEnums.ResultType.UnitStatisticArray;
                        case ExpressionParsersEnums.ResultType.Player        : return ExpressionParsersEnums.ResultType.PlayerArray;
                        case ExpressionParsersEnums.ResultType.Position      : return ExpressionParsersEnums.ResultType.PositionArray;
                        default                         : throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForLambdaResultType(
                                UnitStatisticArray.FnSelect,
                                1,
                                [
                                    ExpressionParsersEnums.ResultType.Number,
                                    ExpressionParsersEnums.ResultType.Tile,
                                    ExpressionParsersEnums.ResultType.TileBuff,
                                    ExpressionParsersEnums.ResultType.Unit,
                                    ExpressionParsersEnums.ResultType.UnitStatistic,
                                    ExpressionParsersEnums.ResultType.Player,
                                    ExpressionParsersEnums.ResultType.Position,
                                ],
                                lambdaResultType
                            ),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_06
                        );
                    }
                },
            )
        );
        functions.set(
            UnitStatisticArray.FnAll,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0559,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(UnitStatisticArray.FnAll, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_07
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(UnitStatisticArray.FnAll, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_08
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
                            ExpressionParsersUtils.getErrorTextForLambdaResultType(UnitStatisticArray.FnAll, 1, [ExpressionParsersEnums.ResultType.Number], lambdaResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_09
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            UnitStatisticArray.FnAny,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0560,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(UnitStatisticArray.FnAny, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_10
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(UnitStatisticArray.FnAny, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_11
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
                            ExpressionParsersUtils.getErrorTextForLambdaResultType(UnitStatisticArray.FnAny, 1, [ExpressionParsersEnums.ResultType.Number], lambdaResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_12
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );

        return functions;
    }

    private _dataArray  : ExpressionParsersResultsUnitStatistic.UnitStatistic[];
    private _contextWar : ExpressionParsersContextsWar.War | null = null;

    public constructor(data: ExpressionParsersResultsUnitStatisticArray.UnitStatisticArray) {
        super(data.war);

        this._dataArray = data.dataArray;
    }

    public getContextType(): ExpressionParsersEnums.ContextType {
        return ExpressionParsersEnums.ContextType.UnitStatisticArray;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase.Base {
        switch (identifierName) {
            default     : return (this._contextWar ??= new ExpressionParsersContextsWar.War(this.getWar())).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase.Base[], rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        switch (identifierName) {
            case UnitStatisticArray.FnMerge    : return this.callMerge();
            case UnitStatisticArray.FnWhere    : return this.callWhere(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case UnitStatisticArray.FnSelect   : return this.callSelect(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case UnitStatisticArray.FnAll      : return this.callAll(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case UnitStatisticArray.FnAny      : return this.callAny(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            default                                     : return (this._contextWar ??= new ExpressionParsersContextsWar.War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }

    public callMerge(): ExpressionParsersResultsUnitStatistic.UnitStatistic {
        const dataArray                         = this._dataArray;
        const war                               = this.getWar();
        const unitTypeArray                     : number[] = [];
        const playerIndexArray                  : number[] = [];
        const groupedObserverTeamIndexesArray   : number[] = [];
        let normalizedHpGain                    = 0;
        let normalizedHpLoss                    = 0;
        let unitGain                            = 0;
        let unitLoss                            = 0;
        for (const data of dataArray) {
            unitTypeArray.push(...data.unitTypeArray);
            playerIndexArray.push(...data.playerIndexArray);
            groupedObserverTeamIndexesArray.push(...data.groupedObserverTeamIndexesArray);
            normalizedHpGain += data.normalizedHpGain;
            normalizedHpLoss += data.normalizedHpLoss;
            unitGain         += data.unitGain;
            unitLoss         += data.unitLoss;
        }

        return new ExpressionParsersResultsUnitStatistic.UnitStatistic(war, {
            unitTypeArray                   : [...new Set(unitTypeArray)].sort((v1, v2) => v1 - v2),
            playerIndexArray                : [...new Set(playerIndexArray)].sort((v1, v2) => v1 - v2),
            groupedObserverTeamIndexesArray : [...new Set(groupedObserverTeamIndexesArray)].sort((v1, v2) => v1 - v2),
            unitGain                        : unitGain,
            unitLoss                        : unitLoss,
            normalizedHpGain                : normalizedHpGain,
            normalizedHpLoss                : normalizedHpLoss,
        });
    }

    public callWhere(arg: ExpressionParsersResultsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsUnitStatisticArray.UnitStatisticArray {
        if (!(arg instanceof ExpressionParsersResultsLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsersNodesLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : ExpressionParsersResultsUnitStatistic.UnitStatistic[] = [];
        for (const data of this._dataArray) {
            const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsersResultsNum.Num)) {
                throw HelpersMisc.newError(`Invalid lambda result.`);
            }

            if (result.num !== 0) {
                resultArray.push(data);
            }
        }

        return new ExpressionParsersResultsUnitStatisticArray.UnitStatisticArray(war, resultArray);
    }

    public callSelect(arg: ExpressionParsersResultsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        if (!(arg instanceof ExpressionParsersResultsLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsersNodesLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const dataArray     = this._dataArray;
        const resultType    = node.getLambdaResultType2({
            contextType                     : rootCtx.getContextType(),
            directLambdaArgumentInfoArray   : [ExpressionParsersEnums.ResultType.UnitStatistic],
            indirectLambdaArgumentInfoDict  : null,
            localVariableDict               : localVariableDict,
            customCounterNameSet            : new Set(war.getInstanceWarRule().getWarEventFullData()?.getCustomCounterNameArray().map(v => v.getName() ?? ``)),
        });
        if (resultType === ExpressionParsersEnums.ResultType.Unit) {
            const resultArray: ExpressionParsersResultsNullableUnit.NullableUnit[] = [];
            for (const data of dataArray) {
                const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsNullableUnit.NullableUnit)) {
                    throw HelpersMisc.newError(`Invalid lambda result for unit.`);
                }

                resultArray.push(result);
            }

            return new ExpressionParsersResultsNullableUnitArray.NullableUnitArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.Tile) {
            const resultArray: TilesITile.ITile[] = [];
            for (const data of dataArray) {
                const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsTile.Tile)) {
                    throw HelpersMisc.newError(`Invalid lambda result for tile.`);
                }

                resultArray.push(result.tile);
            }

            return new ExpressionParsersResultsTileArray.TileArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.TileBuff) {
            const resultArray: ExpressionParsersResultsTileBuff.TileBuff[] = [];
            for (const data of dataArray) {
                const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsTileBuff.TileBuff)) {
                    throw HelpersMisc.newError(`Invalid lambda result for tile.`);
                }

                resultArray.push(result);
            }

            return new ExpressionParsersResultsTileBuffArray.TileBuffArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.Player) {
            const resultArray: PlayersIPlayer.IPlayer[] = [];
            for (const data of dataArray) {
                const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsPlayer.Player)) {
                    throw HelpersMisc.newError(`Invalid lambda result for player.`);
                }

                resultArray.push(result.player);
            }

            return new ExpressionParsersResultsPlayerArray.PlayerArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.Number) {
            const resultArray: number[] = [];
            for (const data of dataArray) {
                const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsNum.Num)) {
                    throw HelpersMisc.newError(`Invalid lambda result for number.`);
                }

                resultArray.push(result.num);
            }

            return new ExpressionParsersResultsNumArray.NumArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.Position) {
            const resultArray: ExpressionParsersResultsPosition.Position[] = [];
            for (const data of dataArray) {
                const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsPosition.Position)) {
                    throw HelpersMisc.newError(`Invalid lambda result for position.`);
                }

                resultArray.push(result);
            }

            return new ExpressionParsersResultsPositionArray.PositionArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.UnitStatistic) {
            const resultArray: ExpressionParsersResultsUnitStatistic.UnitStatistic[] = [];
            for (const data of dataArray) {
                const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsUnitStatistic.UnitStatistic)) {
                    throw HelpersMisc.newError(`Invalid lambda result for position.`);
                }

                resultArray.push(result);
            }

            return new ExpressionParsersResultsUnitStatisticArray.UnitStatisticArray(war, resultArray);

        } else {
            throw HelpersMisc.newError(`Unexpected resultType: ${resultType}`);
        }
    }

    public callAll(arg: ExpressionParsersResultsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsNum.Num {
        if (!(arg instanceof ExpressionParsersResultsLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsersNodesLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected node.`);
        }

        const war = this.getWar();
        for (const data of this._dataArray) {
            const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsersResultsNum.Num)) {
                throw HelpersMisc.newError(`Invalid lambda result.`);
            }

            if (result.num === 0) {
                return new ExpressionParsersResultsNum.Num(war, 0);
            }
        }

        return new ExpressionParsersResultsNum.Num(war, 1);
    }

    public callAny(arg: ExpressionParsersResultsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsNum.Num {
        if (!(arg instanceof ExpressionParsersResultsLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsersNodesLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected node.`);
        }

        const war = this.getWar();
        for (const data of this._dataArray) {
            const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsersResultsNum.Num)) {
                throw HelpersMisc.newError(`Invalid lambda result.`);
            }

            if (result.num !== 0) {
                return new ExpressionParsersResultsNum.Num(war, 1);
            }
        }

        return new ExpressionParsersResultsNum.Num(war, 0);
    }
}
