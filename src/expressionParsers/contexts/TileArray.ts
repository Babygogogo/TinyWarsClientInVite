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
import * as NumbersUtils from "../../numbers/Utils.ts";
import type * as PlayersIPlayer from "../../players/IPlayer.ts";
import type * as TilesITile from "../../tiles/ITile.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type ITile          = TilesITile.ITile;

export class TileArray extends ExpressionParsersContextsBase.Base {
    private static readonly VnLength            = "length";

    private static readonly FnGet               = "get";
    private static readonly FnWhere             = "where";
    private static readonly FnSelect            = "select";
    private static readonly FnAll               = "all";
    private static readonly FnAny               = "any";

    public static readonly Variables    = TileArray.generateVariables();
    public static readonly Functions    = TileArray.generateFunctions();
    private static generateVariables(): ExpressionParsersTypes.EpVariableInfoDict {
        const variables = ExpressionParsersUtils.extendVariableInfoDict(ExpressionParsersContextsWar.War.Variables);
        variables.set(TileArray.VnLength,    { desc: LangConstants.TextType.A0480, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false } );

        return variables;
    }
    private static generateFunctions(): ExpressionParsersTypes.EpFunctionInfoDict {
        const functions = ExpressionParsersUtils.extendFunctionInfoDict(ExpressionParsersContextsWar.War.Functions);
        functions.set(
            TileArray.FnGet,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0484,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(TileArray.FnGet, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_00
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(TileArray.FnGet, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_01
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Tile;
                },
            )
        );
        functions.set(
            TileArray.FnWhere,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0485,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(TileArray.FnWhere, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_02
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(TileArray.FnWhere, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_03
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
                            ExpressionParsersUtils.getErrorTextForLambdaResultType(TileArray.FnWhere, 1, [ExpressionParsersEnums.ResultType.Number], lambdaResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_04
                        );
                    }

                    return ExpressionParsersEnums.ResultType.TileArray;
                },
            )
        );
        functions.set(
            TileArray.FnSelect,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0486,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(TileArray.FnSelect, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_05
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(TileArray.FnSelect, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_06
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ExpressionParsersEnums.ResultType.Tile],
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
                                TileArray.FnSelect,
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
                            UtilsClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_07
                        );
                    }
                },
            )
        );
        functions.set(
            TileArray.FnAll,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0507,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(TileArray.FnAll, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_08
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(TileArray.FnAll, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_09
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
                            ExpressionParsersUtils.getErrorTextForLambdaResultType(TileArray.FnAll, 1, [ExpressionParsersEnums.ResultType.Number], lambdaResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_10
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            TileArray.FnAny,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0508,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(TileArray.FnAny, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_11
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(TileArray.FnAny, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_12
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
                            ExpressionParsersUtils.getErrorTextForLambdaResultType(TileArray.FnAny, 1, [ExpressionParsersEnums.ResultType.Number], lambdaResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextTileArray_GenerateFunctions_13
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );

        return functions;
    }

    private _tileArray  : ITile[];
    private _contextWar : ExpressionParsersContextsWar.War | null = null;

    public constructor(data: ExpressionParsersResultsTileArray.TileArray) {
        super(data.war);

        this._tileArray = data.array;
    }

    public getContextType(): ExpressionParsersEnums.ContextType {
        return ExpressionParsersEnums.ContextType.TileArray;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase.Base {
        switch (identifierName) {
            case TileArray.VnLength    : return new ExpressionParsersResultsNum.Num(this.getWar(), this._tileArray.length);
            default                             : return (this._contextWar ??= new ExpressionParsersContextsWar.War(this.getWar())).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase.Base[], rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        switch (identifierName) {
            case TileArray.FnGet       : return this.callGet(argumentArray[0]);
            case TileArray.FnWhere     : return this.callWhere(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case TileArray.FnSelect    : return this.callSelect(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case TileArray.FnAll       : return this.callAll(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case TileArray.FnAny       : return this.callAny(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            default                             : return (this._contextWar ??= new ExpressionParsersContextsWar.War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }

    public callGet(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsTile.Tile {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const array     = this._tileArray;
        const length    = array.length;
        if (!length) {
            throw HelpersMisc.newError(`Empty array.`);
        }

        const rawIndex  = NumbersUtils.getValueInInt32(arg.num);
        const index     = rawIndex >= 0 ? rawIndex : rawIndex + length;
        const result    = array[index];
        if (result == null) {
            throw HelpersMisc.newError(`Invalid index: ${index}`);
        }

        return new ExpressionParsersResultsTile.Tile(result);
    }

    public callWhere(arg: ExpressionParsersResultsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsTileArray.TileArray {
        if (!(arg instanceof ExpressionParsersResultsLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsersNodesLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : ITile[] = [];
        for (const tile of this._tileArray) {
            const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsTile.Tile(tile)], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsersResultsNum.Num)) {
                throw HelpersMisc.newError(`Invalid lambda result.`, UtilsClientErrorCode.ClientErrorCode.EpContextTileArray_CallWhere_00);
            }

            if (result.num !== 0) {
                resultArray.push(tile);
            }
        }

        return new ExpressionParsersResultsTileArray.TileArray(war, resultArray);
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
        const tiles         = this._tileArray;
        const resultType    = node.getLambdaResultType2({
            contextType                     : rootCtx.getContextType(),
            directLambdaArgumentInfoArray   : [ExpressionParsersEnums.ResultType.Tile],
            indirectLambdaArgumentInfoDict  : null,
            localVariableDict               : localVariableDict,
            customCounterNameSet            : new Set(war.getInstanceWarRule().getWarEventFullData()?.getCustomCounterNameArray().map(v => v.getName() ?? ``)),
        });
        if (resultType === ExpressionParsersEnums.ResultType.Unit) {
            const resultArray: ExpressionParsersResultsNullableUnit.NullableUnit[] = [];
            for (const tile of tiles) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsTile.Tile(tile)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsNullableUnit.NullableUnit)) {
                    throw HelpersMisc.newError(`Invalid lambda result for unit.`, UtilsClientErrorCode.ClientErrorCode.EpContextTileArray_CallSelectNumber_00);
                }

                resultArray.push(result);
            }

            return new ExpressionParsersResultsNullableUnitArray.NullableUnitArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.Tile) {
            const resultArray: ITile[] = [];
            for (const tile of tiles) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsTile.Tile(tile)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsTile.Tile)) {
                    throw HelpersMisc.newError(`Invalid lambda result for tile.`, UtilsClientErrorCode.ClientErrorCode.EpContextTileArray_CallSelectNumber_01);
                }

                resultArray.push(result.tile);
            }

            return new ExpressionParsersResultsTileArray.TileArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.TileBuff) {
            const resultArray: ExpressionParsersResultsTileBuff.TileBuff[] = [];
            for (const tile of tiles) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsTile.Tile(tile)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsTileBuff.TileBuff)) {
                    throw HelpersMisc.newError(`Invalid lambda result for tile.`);
                }

                resultArray.push(result);
            }

            return new ExpressionParsersResultsTileBuffArray.TileBuffArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.Player) {
            const resultArray: PlayersIPlayer.IPlayer[] = [];
            for (const tile of tiles) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsTile.Tile(tile)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsPlayer.Player)) {
                    throw HelpersMisc.newError(`Invalid lambda result for player.`, UtilsClientErrorCode.ClientErrorCode.EpContextTileArray_CallSelectNumber_02);
                }

                resultArray.push(result.player);
            }

            return new ExpressionParsersResultsPlayerArray.PlayerArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.Number) {
            const resultArray: number[] = [];
            for (const tile of tiles) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsTile.Tile(tile)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsNum.Num)) {
                    throw HelpersMisc.newError(`Invalid lambda result for number.`, UtilsClientErrorCode.ClientErrorCode.EpContextTileArray_CallSelectNumber_03);
                }

                resultArray.push(result.num);
            }

            return new ExpressionParsersResultsNumArray.NumArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.Position) {
            const resultArray: ExpressionParsersResultsPosition.Position[] = [];
            for (const tile of tiles) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsTile.Tile(tile)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsPosition.Position)) {
                    throw HelpersMisc.newError(`Invalid lambda result for position.`, UtilsClientErrorCode.ClientErrorCode.EpContextTileArray_CallSelectNumber_04);
                }

                resultArray.push(result);
            }

            return new ExpressionParsersResultsPositionArray.PositionArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.UnitStatistic) {
            const resultArray: ExpressionParsersResultsUnitStatistic.UnitStatistic[] = [];
            for (const tile of tiles) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsTile.Tile(tile)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsUnitStatistic.UnitStatistic)) {
                    throw HelpersMisc.newError(`Invalid lambda result for position.`, UtilsClientErrorCode.ClientErrorCode.EpContextTileArray_CallSelectNumber_05);
                }

                resultArray.push(result);
            }

            return new ExpressionParsersResultsUnitStatisticArray.UnitStatisticArray(war, resultArray);

        } else {
            throw HelpersMisc.newError(`Unexpected resultType: ${resultType}`, UtilsClientErrorCode.ClientErrorCode.EpContextTileArray_CallSelectNumber_06);
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
        for (const tile of this._tileArray) {
            const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsTile.Tile(tile)], null, localVariableDict, isRestricted);
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
        for (const tile of this._tileArray) {
            const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsTile.Tile(tile)], null, localVariableDict, isRestricted);
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
