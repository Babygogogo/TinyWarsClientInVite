import { Base } from "./Base.ts";
import { War } from "./War.ts";
import { ResultType, ContextType } from "../Enums.ts";
import { FunctionInfo } from "../FunctionInfo.ts";
import { Lambda } from "../nodes/Lambda.ts";
import type { Base as ExpressionParsersResultsBase } from "../results/Base.ts";
import { Lambda as ExpressionParsersResultsLambda } from "../results/Lambda.ts";
import { NullableUnit } from "../results/NullableUnit.ts";
import { NullableUnitArray } from "../results/NullableUnitArray.ts";
import { Num } from "../results/Num.ts";
import { NumArray } from "../results/NumArray.ts";
import { Player } from "../results/Player.ts";
import { PlayerArray } from "../results/PlayerArray.ts";
import { Position } from "../results/Position.ts";
import { PositionArray } from "../results/PositionArray.ts";
import { Tile } from "../results/Tile.ts";
import { TileArray as ExpressionParsersResultsTileArray } from "../results/TileArray.ts";
import { TileBuff } from "../results/TileBuff.ts";
import { TileBuffArray } from "../results/TileBuffArray.ts";
import { UnitStatistic } from "../results/UnitStatistic.ts";
import { UnitStatisticArray } from "../results/UnitStatisticArray.ts";
import type { EpVariableInfoDict, EpFunctionInfoDict } from "../Types.ts";
import {
    extendVariableInfoDict,
    extendFunctionInfoDict,
    getErrorTextForParameterCount,
    getErrorTextForParameterType,
    getErrorTextForLambdaResultType,
} from "../Utils.ts";
import { newError } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getValueInInt32 } from "../../numbers/Utils.ts";
import type { IPlayer } from "../../players/IPlayer.ts";
import type { ITile } from "../../tiles/ITile.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class TileArray extends Base {
    private static readonly VnLength            = "length";

    private static readonly FnGet               = "get";
    private static readonly FnWhere             = "where";
    private static readonly FnSelect            = "select";
    private static readonly FnAll               = "all";
    private static readonly FnAny               = "any";

    public static readonly Variables    = TileArray.generateVariables();
    public static readonly Functions    = TileArray.generateFunctions();
    private static generateVariables(): EpVariableInfoDict {
        const variables = extendVariableInfoDict(War.Variables);
        variables.set(TileArray.VnLength,    { desc: TextType.A0480, resultType: ResultType.Number, isExtension: false } );

        return variables;
    }
    private static generateFunctions(): EpFunctionInfoDict {
        const functions = extendFunctionInfoDict(War.Functions);
        functions.set(
            TileArray.FnGet,
            new FunctionInfo(
                TextType.A0484,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(TileArray.FnGet, 1, argArray.length),
                            ClientErrorCode.EpContextTileArray_GenerateFunctions_00
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(TileArray.FnGet, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextTileArray_GenerateFunctions_01
                        );
                    }

                    return ResultType.Tile;
                },
            )
        );
        functions.set(
            TileArray.FnWhere,
            new FunctionInfo(
                TextType.A0485,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(TileArray.FnWhere, 1, argArray.length),
                            ClientErrorCode.EpContextTileArray_GenerateFunctions_02
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof Lambda)) {
                        throw newError(
                            getErrorTextForParameterType(TileArray.FnWhere, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextTileArray_GenerateFunctions_03
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
                            getErrorTextForLambdaResultType(TileArray.FnWhere, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextTileArray_GenerateFunctions_04
                        );
                    }

                    return ResultType.TileArray;
                },
            )
        );
        functions.set(
            TileArray.FnSelect,
            new FunctionInfo(
                TextType.A0486,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(TileArray.FnSelect, 1, argArray.length),
                            ClientErrorCode.EpContextTileArray_GenerateFunctions_05
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof Lambda)) {
                        throw newError(
                            getErrorTextForParameterType(TileArray.FnSelect, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextTileArray_GenerateFunctions_06
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ResultType.Tile],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    switch (lambdaResultType) {
                        case ResultType.Number        : return ResultType.NumberArray;
                        case ResultType.Tile          : return ResultType.TileArray;
                        case ResultType.TileBuff      : return ResultType.TileBuffArray;
                        case ResultType.Unit          : return ResultType.UnitArray;
                        case ResultType.UnitStatistic : return ResultType.UnitStatisticArray;
                        case ResultType.Player        : return ResultType.PlayerArray;
                        case ResultType.Position      : return ResultType.PositionArray;
                        default                         : throw newError(
                            getErrorTextForLambdaResultType(
                                TileArray.FnSelect,
                                1,
                                [
                                    ResultType.Number,
                                    ResultType.Tile,
                                    ResultType.TileBuff,
                                    ResultType.Unit,
                                    ResultType.UnitStatistic,
                                    ResultType.Player,
                                    ResultType.Position,
                                ],
                                lambdaResultType
                            ),
                            ClientErrorCode.EpContextTileArray_GenerateFunctions_07
                        );
                    }
                },
            )
        );
        functions.set(
            TileArray.FnAll,
            new FunctionInfo(
                TextType.A0507,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(TileArray.FnAll, 1, argArray.length),
                            ClientErrorCode.EpContextTileArray_GenerateFunctions_08
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof Lambda)) {
                        throw newError(
                            getErrorTextForParameterType(TileArray.FnAll, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextTileArray_GenerateFunctions_09
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
                            getErrorTextForLambdaResultType(TileArray.FnAll, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextTileArray_GenerateFunctions_10
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            TileArray.FnAny,
            new FunctionInfo(
                TextType.A0508,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(TileArray.FnAny, 1, argArray.length),
                            ClientErrorCode.EpContextTileArray_GenerateFunctions_11
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof Lambda)) {
                        throw newError(
                            getErrorTextForParameterType(TileArray.FnAny, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextTileArray_GenerateFunctions_12
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
                            getErrorTextForLambdaResultType(TileArray.FnAny, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextTileArray_GenerateFunctions_13
                        );
                    }

                    return ResultType.Number;
                },
            )
        );

        return functions;
    }

    private _tileArray  : ITile[];
    private _contextWar : War | null = null;

    public constructor(data: ExpressionParsersResultsTileArray) {
        super(data.war);

        this._tileArray = data.array;
    }

    public getContextType(): ContextType {
        return ContextType.TileArray;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase {
        switch (identifierName) {
            case TileArray.VnLength    : return new Num(this.getWar(), this._tileArray.length);
            default                             : return (this._contextWar ??= new War(this.getWar())).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase[], rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsBase {
        switch (identifierName) {
            case TileArray.FnGet       : return this.callGet(argumentArray[0]);
            case TileArray.FnWhere     : return this.callWhere(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case TileArray.FnSelect    : return this.callSelect(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case TileArray.FnAll       : return this.callAll(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case TileArray.FnAny       : return this.callAny(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            default                             : return (this._contextWar ??= new War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }

    public callGet(arg: ExpressionParsersResultsBase): Tile {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const array     = this._tileArray;
        const length    = array.length;
        if (!length) {
            throw newError(`Empty array.`);
        }

        const rawIndex  = getValueInInt32(arg.num);
        const index     = rawIndex >= 0 ? rawIndex : rawIndex + length;
        const result    = array[index];
        if (result == null) {
            throw newError(`Invalid index: ${index}`);
        }

        return new Tile(result);
    }

    public callWhere(arg: ExpressionParsersResultsBase, rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsTileArray {
        if (!(arg instanceof ExpressionParsersResultsLambda)) {
            throw newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof Lambda)) {
            throw newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : ITile[] = [];
        for (const tile of this._tileArray) {
            const result = node.evalLambda(rootCtx, [new Tile(tile)], null, localVariableDict, isRestricted);
            if (!(result instanceof Num)) {
                throw newError(`Invalid lambda result.`, ClientErrorCode.EpContextTileArray_CallWhere_00);
            }

            if (result.num !== 0) {
                resultArray.push(tile);
            }
        }

        return new ExpressionParsersResultsTileArray(war, resultArray);
    }

    public callSelect(arg: ExpressionParsersResultsBase, rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsBase {
        if (!(arg instanceof ExpressionParsersResultsLambda)) {
            throw newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof Lambda)) {
            throw newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const tiles         = this._tileArray;
        const resultType    = node.getLambdaResultType2({
            contextType                     : rootCtx.getContextType(),
            directLambdaArgumentInfoArray   : [ResultType.Tile],
            indirectLambdaArgumentInfoDict  : null,
            localVariableDict               : localVariableDict,
            customCounterNameSet            : new Set(war.getInstanceWarRule().getWarEventFullData()?.getCustomCounterNameArray().map(v => v.getName() ?? ``)),
        });
        if (resultType === ResultType.Unit) {
            const resultArray: NullableUnit[] = [];
            for (const tile of tiles) {
                const result = node.evalLambda(rootCtx, [new Tile(tile)], null, localVariableDict, isRestricted);
                if (!(result instanceof NullableUnit)) {
                    throw newError(`Invalid lambda result for unit.`, ClientErrorCode.EpContextTileArray_CallSelectNumber_00);
                }

                resultArray.push(result);
            }

            return new NullableUnitArray(war, resultArray);

        } else if (resultType === ResultType.Tile) {
            const resultArray: ITile[] = [];
            for (const tile of tiles) {
                const result = node.evalLambda(rootCtx, [new Tile(tile)], null, localVariableDict, isRestricted);
                if (!(result instanceof Tile)) {
                    throw newError(`Invalid lambda result for tile.`, ClientErrorCode.EpContextTileArray_CallSelectNumber_01);
                }

                resultArray.push(result.tile);
            }

            return new ExpressionParsersResultsTileArray(war, resultArray);

        } else if (resultType === ResultType.TileBuff) {
            const resultArray: TileBuff[] = [];
            for (const tile of tiles) {
                const result = node.evalLambda(rootCtx, [new Tile(tile)], null, localVariableDict, isRestricted);
                if (!(result instanceof TileBuff)) {
                    throw newError(`Invalid lambda result for tile.`);
                }

                resultArray.push(result);
            }

            return new TileBuffArray(war, resultArray);

        } else if (resultType === ResultType.Player) {
            const resultArray: IPlayer[] = [];
            for (const tile of tiles) {
                const result = node.evalLambda(rootCtx, [new Tile(tile)], null, localVariableDict, isRestricted);
                if (!(result instanceof Player)) {
                    throw newError(`Invalid lambda result for player.`, ClientErrorCode.EpContextTileArray_CallSelectNumber_02);
                }

                resultArray.push(result.player);
            }

            return new PlayerArray(war, resultArray);

        } else if (resultType === ResultType.Number) {
            const resultArray: number[] = [];
            for (const tile of tiles) {
                const result = node.evalLambda(rootCtx, [new Tile(tile)], null, localVariableDict, isRestricted);
                if (!(result instanceof Num)) {
                    throw newError(`Invalid lambda result for number.`, ClientErrorCode.EpContextTileArray_CallSelectNumber_03);
                }

                resultArray.push(result.num);
            }

            return new NumArray(war, resultArray);

        } else if (resultType === ResultType.Position) {
            const resultArray: Position[] = [];
            for (const tile of tiles) {
                const result = node.evalLambda(rootCtx, [new Tile(tile)], null, localVariableDict, isRestricted);
                if (!(result instanceof Position)) {
                    throw newError(`Invalid lambda result for position.`, ClientErrorCode.EpContextTileArray_CallSelectNumber_04);
                }

                resultArray.push(result);
            }

            return new PositionArray(war, resultArray);

        } else if (resultType === ResultType.UnitStatistic) {
            const resultArray: UnitStatistic[] = [];
            for (const tile of tiles) {
                const result = node.evalLambda(rootCtx, [new Tile(tile)], null, localVariableDict, isRestricted);
                if (!(result instanceof UnitStatistic)) {
                    throw newError(`Invalid lambda result for position.`, ClientErrorCode.EpContextTileArray_CallSelectNumber_05);
                }

                resultArray.push(result);
            }

            return new UnitStatisticArray(war, resultArray);

        } else {
            throw newError(`Unexpected resultType: ${resultType}`, ClientErrorCode.EpContextTileArray_CallSelectNumber_06);
        }
    }

    public callAll(arg: ExpressionParsersResultsBase, rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): Num {
        if (!(arg instanceof ExpressionParsersResultsLambda)) {
            throw newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof Lambda)) {
            throw newError(`Unexpected node.`);
        }

        const war = this.getWar();
        for (const tile of this._tileArray) {
            const result = node.evalLambda(rootCtx, [new Tile(tile)], null, localVariableDict, isRestricted);
            if (!(result instanceof Num)) {
                throw newError(`Invalid lambda result.`);
            }

            if (result.num === 0) {
                return new Num(war, 0);
            }
        }

        return new Num(war, 1);
    }

    public callAny(arg: ExpressionParsersResultsBase, rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): Num {
        if (!(arg instanceof ExpressionParsersResultsLambda)) {
            throw newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof Lambda)) {
            throw newError(`Unexpected node.`);
        }

        const war = this.getWar();
        for (const tile of this._tileArray) {
            const result = node.evalLambda(rootCtx, [new Tile(tile)], null, localVariableDict, isRestricted);
            if (!(result instanceof Num)) {
                throw newError(`Invalid lambda result.`);
            }

            if (result.num !== 0) {
                return new Num(war, 1);
            }
        }

        return new Num(war, 0);
    }
}
