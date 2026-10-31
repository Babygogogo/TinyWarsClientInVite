import {
    ExpressionParsers_Contexts_Base,
    Utils_ClientErrorCode,
    ExpressionParsers_Enums,
    ExpressionParsers_Utils,
    ExpressionParsers_FunctionInfo,
    Numbers_Utils,
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
    ExpressionParsers_Results_TileArray,
    Lang_Constants,
    ExpressionParsers_Results_Tile,
    ExpressionParsers_Results_TileBuff,
    ExpressionParsers_Results_TileBuffArray,
    ExpressionParsers_Results_UnitStatistic,
    ExpressionParsers_Results_UnitStatisticArray,
    ExpressionParsers_Contexts_War,
    type ExpressionParsers_Types,
    type Players_IPlayer,
    type Tiles_Tile,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";

export class TileArray extends ExpressionParsers_Contexts_Base.Base {
    private static readonly VnLength            = "length";

    private static readonly FnGet               = "get";
    private static readonly FnWhere             = "where";
    private static readonly FnSelect            = "select";
    private static readonly FnAll               = "all";
    private static readonly FnAny               = "any";

    public static readonly Variables    = TileArray.generateVariables();
    public static readonly Functions    = TileArray.generateFunctions();
    private static generateVariables(): ExpressionParsers_Types.EpVariableInfoDict {
        const variables = ExpressionParsers_Utils.extendVariableInfoDict(ExpressionParsers_Contexts_War.War.Variables);
        variables.set(TileArray.VnLength,    { desc : Lang_Constants.TextType.A0480, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false } );

        return variables;
    }
    private static generateFunctions(): ExpressionParsers_Types.EpFunctionInfoDict {
        const functions = ExpressionParsers_Utils.extendFunctionInfoDict(ExpressionParsers_Contexts_War.War.Functions);
        functions.set(
            TileArray.FnGet,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0484,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(TileArray.FnGet, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_00,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(TileArray.FnGet, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_01,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Tile;
                },
            ),
        );
        functions.set(
            TileArray.FnWhere,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0485,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(TileArray.FnWhere, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_02,
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(TileArray.FnWhere, 1, ExpressionParsers_Enums.ResultType.Lambda, lambda.getResultType({
                                contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                            })),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_03,
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
                            ExpressionParsers_Utils.getErrorTextForLambdaResultType(TileArray.FnWhere, 1, [ExpressionParsers_Enums.ResultType.Number], lambdaResultType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_04,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.TileArray;
                },
            ),
        );
        functions.set(
            TileArray.FnSelect,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0486,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(TileArray.FnSelect, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_05,
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(TileArray.FnSelect, 1, ExpressionParsers_Enums.ResultType.Lambda, lambda.getResultType({
                                contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                            })),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_06,
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                    : contextType,
                        directLambdaArgumentInfoArray  : [ExpressionParsers_Enums.ResultType.Tile],
                        indirectLambdaArgumentInfoDict : lambdaArgumentInfoDict,
                        localVariableDict              : localVariableDict,
                        customCounterNameSet           : customCounterNameSet,
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
                                TileArray.FnSelect,
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
                                lambdaResultType,
                            ),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_07,
                        );
                    }
                },
            ),
        );
        functions.set(
            TileArray.FnAll,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0507,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(TileArray.FnAll, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_08,
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(TileArray.FnAll, 1, ExpressionParsers_Enums.ResultType.Lambda, lambda.getResultType({
                                contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                            })),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_09,
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
                            ExpressionParsers_Utils.getErrorTextForLambdaResultType(TileArray.FnAll, 1, [ExpressionParsers_Enums.ResultType.Number], lambdaResultType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_10,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            TileArray.FnAny,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0508,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(TileArray.FnAny, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_11,
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(TileArray.FnAny, 1, ExpressionParsers_Enums.ResultType.Lambda, lambda.getResultType({
                                contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                            })),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_12,
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
                            ExpressionParsers_Utils.getErrorTextForLambdaResultType(TileArray.FnAny, 1, [ExpressionParsers_Enums.ResultType.Number], lambdaResultType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_13,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );

        return functions;
    }

    private _tileArray  : Tiles_Tile.Tile[];
    private _contextWar : ExpressionParsers_Contexts_War.War | null = null;

    public constructor(data: ExpressionParsers_Results_TileArray.TileArray) {
        super(data.war);

        this._tileArray = data.array;
    }

    public getContextType(): ExpressionParsers_Enums.ContextType {
        return ExpressionParsers_Enums.ContextType.TileArray;
    }

    public override resolveVariable(identifierName: string): ExpressionParsers_Results_Base.Base {
        switch (identifierName) {
            case TileArray.VnLength    : return new ExpressionParsers_Results_Num.Num(this.getWar(), this._tileArray.length);
            default                             : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(this.getWar())).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsers_Results_Base.Base[], rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        switch (identifierName) {
            case TileArray.FnGet       : return this.callGet(argumentArray[0]);
            case TileArray.FnWhere     : return this.callWhere(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case TileArray.FnSelect    : return this.callSelect(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case TileArray.FnAll       : return this.callAll(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case TileArray.FnAny       : return this.callAny(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            default                             : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }

    public callGet(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Tile.Tile {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const array     = this._tileArray;
        const length    = array.length;
        if (!length) {
            throw Helpers_Misc.newError(`Empty array.`);
        }

        const rawIndex  = Numbers_Utils.getValueInInt32(arg.num);
        const index     = rawIndex >= 0 ? rawIndex : rawIndex + length;
        const result    = array[index];
        if (result == null) {
            throw Helpers_Misc.newError(`Invalid index: ${index}`);
        }

        return new ExpressionParsers_Results_Tile.Tile(result);
    }

    public callWhere(arg: ExpressionParsers_Results_Base.Base, rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_TileArray.TileArray {
        if (!(arg instanceof ExpressionParsers_Results_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : Tiles_Tile.Tile[] = [];
        for (const tile of this._tileArray) {
            const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Tile.Tile(tile)], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsers_Results_Num.Num)) {
                throw Helpers_Misc.newError(`Invalid lambda result.`, Utils_ClientErrorCode.ClientErrorCode.EpContextTileArray_CallWhere_00);
            }

            if (result.num !== 0) {
                resultArray.push(tile);
            }
        }

        return new ExpressionParsers_Results_TileArray.TileArray(war, resultArray);
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
        const tiles         = this._tileArray;
        const resultType    = node.getLambdaResultType2({
            contextType                    : rootCtx.getContextType(),
            directLambdaArgumentInfoArray  : [ExpressionParsers_Enums.ResultType.Tile],
            indirectLambdaArgumentInfoDict : null,
            localVariableDict              : localVariableDict,
            customCounterNameSet           : new Set(war.getInstanceWarRule().getWarEventFullData()?.getCustomCounterNameArray().map(v => v.getName() ?? ``)),
        });
        if (resultType === ExpressionParsers_Enums.ResultType.Unit) {
            const resultArray: ExpressionParsers_Results_NullableUnit.NullableUnit[] = [];
            for (const tile of tiles) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Tile.Tile(tile)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsers_Results_NullableUnit.NullableUnit)) {
                    throw Helpers_Misc.newError(`Invalid lambda result for unit.`, Utils_ClientErrorCode.ClientErrorCode.EpContextTileArray_CallSelectNumber_00);
                }

                resultArray.push(result);
            }

            return new ExpressionParsers_Results_NullableUnitArray.NullableUnitArray(war, resultArray);

        } else if (resultType === ExpressionParsers_Enums.ResultType.Tile) {
            const resultArray: Tiles_Tile.Tile[] = [];
            for (const tile of tiles) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Tile.Tile(tile)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsers_Results_Tile.Tile)) {
                    throw Helpers_Misc.newError(`Invalid lambda result for tile.`, Utils_ClientErrorCode.ClientErrorCode.EpContextTileArray_CallSelectNumber_01);
                }

                resultArray.push(result.tile);
            }

            return new ExpressionParsers_Results_TileArray.TileArray(war, resultArray);

        } else if (resultType === ExpressionParsers_Enums.ResultType.TileBuff) {
            const resultArray: ExpressionParsers_Results_TileBuff.TileBuff[] = [];
            for (const tile of tiles) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Tile.Tile(tile)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsers_Results_TileBuff.TileBuff)) {
                    throw Helpers_Misc.newError(`Invalid lambda result for tile.`);
                }

                resultArray.push(result);
            }

            return new ExpressionParsers_Results_TileBuffArray.TileBuffArray(war, resultArray);

        } else if (resultType === ExpressionParsers_Enums.ResultType.Player) {
            const resultArray: Players_IPlayer.IPlayer[] = [];
            for (const tile of tiles) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Tile.Tile(tile)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsers_Results_Player.Player)) {
                    throw Helpers_Misc.newError(`Invalid lambda result for player.`, Utils_ClientErrorCode.ClientErrorCode.EpContextTileArray_CallSelectNumber_02);
                }

                resultArray.push(result.player);
            }

            return new ExpressionParsers_Results_PlayerArray.PlayerArray(war, resultArray);

        } else if (resultType === ExpressionParsers_Enums.ResultType.Number) {
            const resultArray: number[] = [];
            for (const tile of tiles) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Tile.Tile(tile)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsers_Results_Num.Num)) {
                    throw Helpers_Misc.newError(`Invalid lambda result for number.`, Utils_ClientErrorCode.ClientErrorCode.EpContextTileArray_CallSelectNumber_03);
                }

                resultArray.push(result.num);
            }

            return new ExpressionParsers_Results_NumArray.NumArray(war, resultArray);

        } else if (resultType === ExpressionParsers_Enums.ResultType.Position) {
            const resultArray: ExpressionParsers_Results_Position.Position[] = [];
            for (const tile of tiles) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Tile.Tile(tile)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsers_Results_Position.Position)) {
                    throw Helpers_Misc.newError(`Invalid lambda result for position.`, Utils_ClientErrorCode.ClientErrorCode.EpContextTileArray_CallSelectNumber_04);
                }

                resultArray.push(result);
            }

            return new ExpressionParsers_Results_PositionArray.PositionArray(war, resultArray);

        } else if (resultType === ExpressionParsers_Enums.ResultType.UnitStatistic) {
            const resultArray: ExpressionParsers_Results_UnitStatistic.UnitStatistic[] = [];
            for (const tile of tiles) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Tile.Tile(tile)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsers_Results_UnitStatistic.UnitStatistic)) {
                    throw Helpers_Misc.newError(`Invalid lambda result for position.`, Utils_ClientErrorCode.ClientErrorCode.EpContextTileArray_CallSelectNumber_05);
                }

                resultArray.push(result);
            }

            return new ExpressionParsers_Results_UnitStatisticArray.UnitStatisticArray(war, resultArray);

        } else {
            throw Helpers_Misc.newError(`Unexpected resultType: ${resultType}`, Utils_ClientErrorCode.ClientErrorCode.EpContextTileArray_CallSelectNumber_06);
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
        for (const tile of this._tileArray) {
            const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Tile.Tile(tile)], null, localVariableDict, isRestricted);
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
        for (const tile of this._tileArray) {
            const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Tile.Tile(tile)], null, localVariableDict, isRestricted);
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
