import {
    ExpressionParsers_Contexts_Base,
    Utils_ClientErrorCode,
    ExpressionParsers_Enums,
    ExpressionParsers_Utils,
    ExpressionParsers_FunctionInfo,
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
    ExpressionParsers_Results_UnitStatisticArray,
    Lang_Constants,
    ExpressionParsers_Results_Tile,
    ExpressionParsers_Results_TileArray,
    ExpressionParsers_Results_TileBuff,
    ExpressionParsers_Results_TileBuffArray,
    ExpressionParsers_Results_UnitStatistic,
    ExpressionParsers_Contexts_War,
    type ExpressionParsers_Types,
    type Players_IPlayer,
    type Tiles_ITile,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";

export class UnitStatisticArray extends ExpressionParsers_Contexts_Base.Base {
    // 因为部队统计数据没有自动填充0，所以暂时不提供length和get，如果要提供get，一定要做好排序。
    private static readonly FnMerge     = "merge";
    private static readonly FnWhere     = "where";
    private static readonly FnSelect    = "select";
    private static readonly FnAll       = "all";
    private static readonly FnAny       = "any";

    public static readonly Variables    = UnitStatisticArray.generateVariables();
    public static readonly Functions    = UnitStatisticArray.generateFunctions();
    private static generateVariables(): ExpressionParsers_Types.EpVariableInfoDict {
        const variables = ExpressionParsers_Utils.extendVariableInfoDict(ExpressionParsers_Contexts_War.War.Variables);
        return variables;
    }
    private static generateFunctions(): ExpressionParsers_Types.EpFunctionInfoDict {
        const functions = ExpressionParsers_Utils.extendFunctionInfoDict(ExpressionParsers_Contexts_War.War.Functions);
        functions.set(
            UnitStatisticArray.FnMerge,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0521,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 0) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(UnitStatisticArray.FnMerge, 0, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_00
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.UnitStatistic;
                },
            )
        );
        functions.set(
            UnitStatisticArray.FnWhere,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0558,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(UnitStatisticArray.FnWhere, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_01
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(UnitStatisticArray.FnWhere, 1, ExpressionParsers_Enums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_02
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ExpressionParsers_Enums.ResultType.UnitStatistic],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForLambdaResultType(UnitStatisticArray.FnWhere, 1, [ExpressionParsers_Enums.ResultType.Number], lambdaResultType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_03
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.UnitStatisticArray;
                },
            )
        );
        functions.set(
            UnitStatisticArray.FnSelect,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0557,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(UnitStatisticArray.FnSelect, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_04
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(UnitStatisticArray.FnSelect, 1, ExpressionParsers_Enums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_05
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ExpressionParsers_Enums.ResultType.UnitStatistic],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    switch (lambdaResultType) {
                        case ExpressionParsers_Enums.ResultType.Number        : return ExpressionParsers_Enums.ResultType.NumberArray;
                        case ExpressionParsers_Enums.ResultType.Tile          : return ExpressionParsers_Enums.ResultType.TileArray;
                        case ExpressionParsers_Enums.ResultType.TileBuff      : return ExpressionParsers_Enums.ResultType.TileBuffArray;
                        case ExpressionParsers_Enums.ResultType.Unit          : return ExpressionParsers_Enums.ResultType.UnitArray;
                        case ExpressionParsers_Enums.ResultType.UnitStatistic : return ExpressionParsers_Enums.ResultType.UnitStatisticArray;
                        case ExpressionParsers_Enums.ResultType.Player        : return ExpressionParsers_Enums.ResultType.PlayerArray;
                        case ExpressionParsers_Enums.ResultType.Position      : return ExpressionParsers_Enums.ResultType.PositionArray;
                        default                         : throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForLambdaResultType(
                                UnitStatisticArray.FnSelect,
                                1,
                                [
                                    ExpressionParsers_Enums.ResultType.Number,
                                    ExpressionParsers_Enums.ResultType.Tile,
                                    ExpressionParsers_Enums.ResultType.TileBuff,
                                    ExpressionParsers_Enums.ResultType.Unit,
                                    ExpressionParsers_Enums.ResultType.UnitStatistic,
                                    ExpressionParsers_Enums.ResultType.Player,
                                    ExpressionParsers_Enums.ResultType.Position,
                                ],
                                lambdaResultType
                            ),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_06
                        );
                    }
                },
            )
        );
        functions.set(
            UnitStatisticArray.FnAll,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0559,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(UnitStatisticArray.FnAll, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_07
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(UnitStatisticArray.FnAll, 1, ExpressionParsers_Enums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_08
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ExpressionParsers_Enums.ResultType.UnitStatistic],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForLambdaResultType(UnitStatisticArray.FnAll, 1, [ExpressionParsers_Enums.ResultType.Number], lambdaResultType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_09
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            )
        );
        functions.set(
            UnitStatisticArray.FnAny,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0560,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(UnitStatisticArray.FnAny, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_10
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(UnitStatisticArray.FnAny, 1, ExpressionParsers_Enums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_11
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ExpressionParsers_Enums.ResultType.UnitStatistic],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForLambdaResultType(UnitStatisticArray.FnAny, 1, [ExpressionParsers_Enums.ResultType.Number], lambdaResultType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_12
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            )
        );

        return functions;
    }

    private _dataArray  : ExpressionParsers_Results_UnitStatistic.UnitStatistic[];
    private _contextWar : ExpressionParsers_Contexts_War.War | null = null;

    public constructor(data: ExpressionParsers_Results_UnitStatisticArray.UnitStatisticArray) {
        super(data.war);

        this._dataArray = data.dataArray;
    }

    public getContextType(): ExpressionParsers_Enums.ContextType {
        return ExpressionParsers_Enums.ContextType.UnitStatisticArray;
    }

    public override resolveVariable(identifierName: string): ExpressionParsers_Results_Base.Base {
        switch (identifierName) {
            default     : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(this.getWar())).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsers_Results_Base.Base[], rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        switch (identifierName) {
            case UnitStatisticArray.FnMerge    : return this.callMerge();
            case UnitStatisticArray.FnWhere    : return this.callWhere(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case UnitStatisticArray.FnSelect   : return this.callSelect(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case UnitStatisticArray.FnAll      : return this.callAll(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case UnitStatisticArray.FnAny      : return this.callAny(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            default                                     : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }

    public callMerge(): ExpressionParsers_Results_UnitStatistic.UnitStatistic {
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

        return new ExpressionParsers_Results_UnitStatistic.UnitStatistic(war, {
            unitTypeArray                   : [...new Set(unitTypeArray)].sort((v1, v2) => v1 - v2),
            playerIndexArray                : [...new Set(playerIndexArray)].sort((v1, v2) => v1 - v2),
            groupedObserverTeamIndexesArray : [...new Set(groupedObserverTeamIndexesArray)].sort((v1, v2) => v1 - v2),
            unitGain                        : unitGain,
            unitLoss                        : unitLoss,
            normalizedHpGain                : normalizedHpGain,
            normalizedHpLoss                : normalizedHpLoss,
        });
    }

    public callWhere(arg: ExpressionParsers_Results_Base.Base, rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_UnitStatisticArray.UnitStatisticArray {
        if (!(arg instanceof ExpressionParsers_Results_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : ExpressionParsers_Results_UnitStatistic.UnitStatistic[] = [];
        for (const data of this._dataArray) {
            const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsers_Results_Num.Num)) {
                throw Helpers_Misc.newError(`Invalid lambda result.`);
            }

            if (result.num !== 0) {
                resultArray.push(data);
            }
        }

        return new ExpressionParsers_Results_UnitStatisticArray.UnitStatisticArray(war, resultArray);
    }

    public callSelect(arg: ExpressionParsers_Results_Base.Base, rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        if (!(arg instanceof ExpressionParsers_Results_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const dataArray     = this._dataArray;
        const resultType    = node.getLambdaResultType2({
            contextType                     : rootCtx.getContextType(),
            directLambdaArgumentInfoArray   : [ExpressionParsers_Enums.ResultType.UnitStatistic],
            indirectLambdaArgumentInfoDict  : null,
            localVariableDict               : localVariableDict,
            customCounterNameSet            : new Set(war.getInstanceWarRule().getWarEventFullData()?.getCustomCounterNameArray().map(v => v.getName() ?? ``)),
        });
        if (resultType === ExpressionParsers_Enums.ResultType.Unit) {
            const resultArray: ExpressionParsers_Results_NullableUnit.NullableUnit[] = [];
            for (const data of dataArray) {
                const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsers_Results_NullableUnit.NullableUnit)) {
                    throw Helpers_Misc.newError(`Invalid lambda result for unit.`);
                }

                resultArray.push(result);
            }

            return new ExpressionParsers_Results_NullableUnitArray.NullableUnitArray(war, resultArray);

        } else if (resultType === ExpressionParsers_Enums.ResultType.Tile) {
            const resultArray: Tiles_ITile.ITile[] = [];
            for (const data of dataArray) {
                const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsers_Results_Tile.Tile)) {
                    throw Helpers_Misc.newError(`Invalid lambda result for tile.`);
                }

                resultArray.push(result.tile);
            }

            return new ExpressionParsers_Results_TileArray.TileArray(war, resultArray);

        } else if (resultType === ExpressionParsers_Enums.ResultType.TileBuff) {
            const resultArray: ExpressionParsers_Results_TileBuff.TileBuff[] = [];
            for (const data of dataArray) {
                const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsers_Results_TileBuff.TileBuff)) {
                    throw Helpers_Misc.newError(`Invalid lambda result for tile.`);
                }

                resultArray.push(result);
            }

            return new ExpressionParsers_Results_TileBuffArray.TileBuffArray(war, resultArray);

        } else if (resultType === ExpressionParsers_Enums.ResultType.Player) {
            const resultArray: Players_IPlayer.IPlayer[] = [];
            for (const data of dataArray) {
                const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsers_Results_Player.Player)) {
                    throw Helpers_Misc.newError(`Invalid lambda result for player.`);
                }

                resultArray.push(result.player);
            }

            return new ExpressionParsers_Results_PlayerArray.PlayerArray(war, resultArray);

        } else if (resultType === ExpressionParsers_Enums.ResultType.Number) {
            const resultArray: number[] = [];
            for (const data of dataArray) {
                const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsers_Results_Num.Num)) {
                    throw Helpers_Misc.newError(`Invalid lambda result for number.`);
                }

                resultArray.push(result.num);
            }

            return new ExpressionParsers_Results_NumArray.NumArray(war, resultArray);

        } else if (resultType === ExpressionParsers_Enums.ResultType.Position) {
            const resultArray: ExpressionParsers_Results_Position.Position[] = [];
            for (const data of dataArray) {
                const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsers_Results_Position.Position)) {
                    throw Helpers_Misc.newError(`Invalid lambda result for position.`);
                }

                resultArray.push(result);
            }

            return new ExpressionParsers_Results_PositionArray.PositionArray(war, resultArray);

        } else if (resultType === ExpressionParsers_Enums.ResultType.UnitStatistic) {
            const resultArray: ExpressionParsers_Results_UnitStatistic.UnitStatistic[] = [];
            for (const data of dataArray) {
                const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsers_Results_UnitStatistic.UnitStatistic)) {
                    throw Helpers_Misc.newError(`Invalid lambda result for position.`);
                }

                resultArray.push(result);
            }

            return new ExpressionParsers_Results_UnitStatisticArray.UnitStatisticArray(war, resultArray);

        } else {
            throw Helpers_Misc.newError(`Unexpected resultType: ${resultType}`);
        }
    }

    public callAll(arg: ExpressionParsers_Results_Base.Base, rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Num.Num {
        if (!(arg instanceof ExpressionParsers_Results_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected node.`);
        }

        const war = this.getWar();
        for (const data of this._dataArray) {
            const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsers_Results_Num.Num)) {
                throw Helpers_Misc.newError(`Invalid lambda result.`);
            }

            if (result.num === 0) {
                return new ExpressionParsers_Results_Num.Num(war, 0);
            }
        }

        return new ExpressionParsers_Results_Num.Num(war, 1);
    }

    public callAny(arg: ExpressionParsers_Results_Base.Base, rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Num.Num {
        if (!(arg instanceof ExpressionParsers_Results_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected node.`);
        }

        const war = this.getWar();
        for (const data of this._dataArray) {
            const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsers_Results_Num.Num)) {
                throw Helpers_Misc.newError(`Invalid lambda result.`);
            }

            if (result.num !== 0) {
                return new ExpressionParsers_Results_Num.Num(war, 1);
            }
        }

        return new ExpressionParsers_Results_Num.Num(war, 0);
    }
}
