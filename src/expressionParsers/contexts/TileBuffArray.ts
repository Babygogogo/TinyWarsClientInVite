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
import { TileArray } from "../results/TileArray.ts";
import { TileBuff } from "../results/TileBuff.ts";
import { TileBuffArray as ExpressionParsersResultsTileBuffArray } from "../results/TileBuffArray.ts";
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

export class TileBuffArray extends Base {
    private static readonly VnLength            = "length";

    private static readonly FnGet               = "get";
    private static readonly FnWhere             = "where";
    private static readonly FnSelect            = "select";
    private static readonly FnAll               = "all";
    private static readonly FnAny               = "any";

    public static readonly Variables    = TileBuffArray.generateVariables();
    public static readonly Functions    = TileBuffArray.generateFunctions();
    private static generateVariables(): EpVariableInfoDict {
        const variables = extendVariableInfoDict(War.Variables);
        variables.set(TileBuffArray.VnLength,    { desc: TextType.A0480, resultType: ResultType.Number, isExtension: false } );

        return variables;
    }
    private static generateFunctions(): EpFunctionInfoDict {
        const functions = extendFunctionInfoDict(War.Functions);
        functions.set(
            TileBuffArray.FnGet,
            new FunctionInfo(
                TextType.A0753,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(TileBuffArray.FnGet, 1, argArray.length),
                            ClientErrorCode.EpContextTileBuffArray_GenerateFunctions_00
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(TileBuffArray.FnGet, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextTileBuffArray_GenerateFunctions_01
                        );
                    }

                    return ResultType.TileBuff;
                },
            )
        );
        functions.set(
            TileBuffArray.FnWhere,
            new FunctionInfo(
                TextType.A0754,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(TileBuffArray.FnWhere, 1, argArray.length),
                            ClientErrorCode.EpContextTileBuffArray_GenerateFunctions_02
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof Lambda)) {
                        throw newError(
                            getErrorTextForParameterType(TileBuffArray.FnWhere, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextTileBuffArray_GenerateFunctions_03
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ResultType.TileBuff],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForLambdaResultType(TileBuffArray.FnWhere, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextTileBuffArray_GenerateFunctions_04
                        );
                    }

                    return ResultType.TileBuffArray;
                },
            )
        );
        functions.set(
            TileBuffArray.FnSelect,
            new FunctionInfo(
                TextType.A0755,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(TileBuffArray.FnSelect, 1, argArray.length),
                            ClientErrorCode.EpContextTileBuffArray_GenerateFunctions_05
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof Lambda)) {
                        throw newError(
                            getErrorTextForParameterType(TileBuffArray.FnSelect, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextTileBuffArray_GenerateFunctions_06
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ResultType.TileBuff],
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
                                TileBuffArray.FnSelect,
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
                            ClientErrorCode.EpContextTileBuffArray_GenerateFunctions_07
                        );
                    }
                },
            )
        );
        functions.set(
            TileBuffArray.FnAll,
            new FunctionInfo(
                TextType.A0756,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(TileBuffArray.FnAll, 1, argArray.length),
                            ClientErrorCode.EpContextTileBuffArray_GenerateFunctions_08
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof Lambda)) {
                        throw newError(
                            getErrorTextForParameterType(TileBuffArray.FnAll, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextTileBuffArray_GenerateFunctions_09
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ResultType.TileBuff],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForLambdaResultType(TileBuffArray.FnAll, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextTileBuffArray_GenerateFunctions_10
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            TileBuffArray.FnAny,
            new FunctionInfo(
                TextType.A0757,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(TileBuffArray.FnAny, 1, argArray.length),
                            ClientErrorCode.EpContextTileBuffArray_GenerateFunctions_11
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof Lambda)) {
                        throw newError(
                            getErrorTextForParameterType(TileBuffArray.FnAny, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextTileBuffArray_GenerateFunctions_12
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ResultType.TileBuff],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForLambdaResultType(TileBuffArray.FnAny, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextTileBuffArray_GenerateFunctions_13
                        );
                    }

                    return ResultType.Number;
                },
            )
        );

        return functions;
    }

    private _buffArray  : ExpressionParsersResultsTileBuffArray;
    private _contextWar : War | null = null;

    public constructor(data: ExpressionParsersResultsTileBuffArray) {
        super(data.war);

        this._buffArray = data;
    }

    public getContextType(): ContextType {
        return ContextType.TileBuffArray;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase {
        switch (identifierName) {
            case TileBuffArray.VnLength    : return new Num(this.getWar(), this._buffArray.buffArray.length);
            default                                 : return (this._contextWar ??= new War(this.getWar())).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase[], rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsBase {
        switch (identifierName) {
            case TileBuffArray.FnGet       : return this.callGet(argumentArray[0]);
            case TileBuffArray.FnWhere     : return this.callWhere(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case TileBuffArray.FnSelect    : return this.callSelect(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case TileBuffArray.FnAll       : return this.callAll(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case TileBuffArray.FnAny       : return this.callAny(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            default                                 : return (this._contextWar ??= new War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }

    public callGet(arg: ExpressionParsersResultsBase): TileBuff {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const array     = this._buffArray.buffArray;
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

        return result;
    }

    public callWhere(arg: ExpressionParsersResultsBase, rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsTileBuffArray {
        if (!(arg instanceof ExpressionParsersResultsLambda)) {
            throw newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof Lambda)) {
            throw newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : TileBuff[] = [];
        for (const buff of this._buffArray.buffArray) {
            const result = node.evalLambda(rootCtx, [buff], null, localVariableDict, isRestricted);
            if (!(result instanceof Num)) {
                throw newError(`Invalid lambda result.`);
            }

            if (result.num !== 0) {
                resultArray.push(buff);
            }
        }

        return new ExpressionParsersResultsTileBuffArray(war, resultArray);
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
        const buffArray     = this._buffArray.buffArray;
        const resultType    = node.getLambdaResultType2({
            contextType                     : rootCtx.getContextType(),
            directLambdaArgumentInfoArray   : [ResultType.TileBuff],
            indirectLambdaArgumentInfoDict  : null,
            localVariableDict               : localVariableDict,
            customCounterNameSet            : new Set(war.getInstanceWarRule().getWarEventFullData()?.getCustomCounterNameArray().map(v => v.getName() ?? ``)),
        });
        if (resultType === ResultType.Unit) {
            const resultArray: NullableUnit[] = [];
            for (const buff of buffArray) {
                const result = node.evalLambda(rootCtx, [buff], null, localVariableDict, isRestricted);
                if (!(result instanceof NullableUnit)) {
                    throw newError(`Invalid lambda result for unit.`);
                }

                resultArray.push(result);
            }

            return new NullableUnitArray(war, resultArray);

        } else if (resultType === ResultType.Tile) {
            const resultArray: ITile[] = [];
            for (const buff of buffArray) {
                const result = node.evalLambda(rootCtx, [buff], null, localVariableDict, isRestricted);
                if (!(result instanceof Tile)) {
                    throw newError(`Invalid lambda result for tile.`);
                }

                resultArray.push(result.tile);
            }

            return new TileArray(war, resultArray);

        } else if (resultType === ResultType.TileBuff) {
            const resultArray: TileBuff[] = [];
            for (const buff of buffArray) {
                const result = node.evalLambda(rootCtx, [buff], null, localVariableDict, isRestricted);
                if (!(result instanceof TileBuff)) {
                    throw newError(`Invalid lambda result for tile.`);
                }

                resultArray.push(result);
            }

            return new ExpressionParsersResultsTileBuffArray(war, resultArray);

        } else if (resultType === ResultType.Player) {
            const resultArray: IPlayer[] = [];
            for (const buff of buffArray) {
                const result = node.evalLambda(rootCtx, [buff], null, localVariableDict, isRestricted);
                if (!(result instanceof Player)) {
                    throw newError(`Invalid lambda result for player.`);
                }

                resultArray.push(result.player);
            }

            return new PlayerArray(war, resultArray);

        } else if (resultType === ResultType.Number) {
            const resultArray: number[] = [];
            for (const buff of buffArray) {
                const result = node.evalLambda(rootCtx, [buff], null, localVariableDict, isRestricted);
                if (!(result instanceof Num)) {
                    throw newError(`Invalid lambda result for number.`);
                }

                resultArray.push(result.num);
            }

            return new NumArray(war, resultArray);

        } else if (resultType === ResultType.Position) {
            const resultArray: Position[] = [];
            for (const buff of buffArray) {
                const result = node.evalLambda(rootCtx, [buff], null, localVariableDict, isRestricted);
                if (!(result instanceof Position)) {
                    throw newError(`Invalid lambda result for position.`);
                }

                resultArray.push(result);
            }

            return new PositionArray(war, resultArray);

        } else if (resultType === ResultType.UnitStatistic) {
            const resultArray: UnitStatistic[] = [];
            for (const buff of buffArray) {
                const result = node.evalLambda(rootCtx, [buff], null, localVariableDict, isRestricted);
                if (!(result instanceof UnitStatistic)) {
                    throw newError(`Invalid lambda result for unit statistic.`);
                }

                resultArray.push(result);
            }

            return new UnitStatisticArray(war, resultArray);

        } else {
            throw newError(`Unexpected resultType: ${resultType}`);
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
        for (const buff of this._buffArray.buffArray) {
            const result = node.evalLambda(rootCtx, [buff], null, localVariableDict, isRestricted);
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
        for (const buff of this._buffArray.buffArray) {
            const result = node.evalLambda(rootCtx, [buff], null, localVariableDict, isRestricted);
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
