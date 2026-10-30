import { Base } from "./Base.ts";
import { War } from "./War.ts";
import {
    ResultType,
    ContextType,
} from "../Enums.ts";
import { FunctionInfo } from "../FunctionInfo.ts";
import { Lambda as NodesLambda } from "../nodes/Lambda.ts";
import type { Base as ResultsBase } from "../results/Base.ts";
import { Lambda as ResultsLambda } from "../results/Lambda.ts";
import { NullableUnit } from "../results/NullableUnit.ts";
import { NullableUnitArray } from "../results/NullableUnitArray.ts";
import { Num } from "../results/Num.ts";
import { NumArray as ResultsNumArray } from "../results/NumArray.ts";
import { Player } from "../results/Player.ts";
import { PlayerArray } from "../results/PlayerArray.ts";
import { Position } from "../results/Position.ts";
import { PositionArray } from "../results/PositionArray.ts";
import { Tile } from "../results/Tile.ts";
import { TileArray } from "../results/TileArray.ts";
import { TileBuff } from "../results/TileBuff.ts";
import { TileBuffArray } from "../results/TileBuffArray.ts";
import { UnitStatistic } from "../results/UnitStatistic.ts";
import { UnitStatisticArray } from "../results/UnitStatisticArray.ts";
import type {
    EpVariableInfoDict,
    EpFunctionInfoDict,
} from "../Types.ts";
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

export class NumArray extends Base {
    private static readonly VnLength            = "length";

    private static readonly FnGet               = "get";
    private static readonly FnWhere             = "where";
    private static readonly FnSelect            = "select";
    private static readonly FnMax               = "max";
    private static readonly FnMin               = "min";
    private static readonly FnMean              = "mean";
    private static readonly FnSum               = "sum";
    private static readonly FnAll               = "all";
    private static readonly FnAny               = "any";
    private static readonly FnAdd               = "add";
    private static readonly FnHas               = "has";
    private static readonly FnSet               = "set";

    public static readonly Variables    = NumArray.generateVariables();
    public static readonly Functions    = NumArray.generateFunctions();
    private static generateVariables(): EpVariableInfoDict {
        const variables = extendVariableInfoDict(War.Variables);
        variables.set(NumArray.VnLength,    { desc: TextType.A0480, resultType: ResultType.Number, isExtension: false } );

        return variables;
    }
    private static generateFunctions(): EpFunctionInfoDict {
        const functions = extendFunctionInfoDict(War.Functions);
        functions.set(
            NumArray.FnGet,
            new FunctionInfo(
                TextType.A0490,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(NumArray.FnGet, 1, argArray.length),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_00
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(NumArray.FnGet, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_01
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            NumArray.FnWhere,
            new FunctionInfo(
                TextType.A0491,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(NumArray.FnWhere, 1, argArray.length),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_02
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof NodesLambda)) {
                        throw newError(
                            getErrorTextForParameterType(NumArray.FnWhere, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_03
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
                            getErrorTextForLambdaResultType(NumArray.FnWhere, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_04
                        );
                    }

                    return ResultType.NumberArray;
                },
            )
        );
        functions.set(
            NumArray.FnSelect,
            new FunctionInfo(
                TextType.A0492,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(NumArray.FnSelect, 1, argArray.length),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_05
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof NodesLambda)) {
                        throw newError(
                            getErrorTextForParameterType(NumArray.FnSelect, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_06
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ResultType.Number],
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
                                NumArray.FnSelect,
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
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_07
                        );
                    }
                },
            )
        );
        functions.set(
            NumArray.FnMax,
            new FunctionInfo(
                TextType.A0499,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length > 1) {
                        throw newError(
                            getErrorTextForParameterCount(NumArray.FnMax, `<=1`, argArray.length),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_08
                        );
                    }
                    if (argArray.length === 0) {
                        return ResultType.Number;
                    }

                    const argResultType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argResultType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(NumArray.FnMax, 1, ResultType.Number, argResultType),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_09
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            NumArray.FnMin,
            new FunctionInfo(
                TextType.A0500,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length > 1) {
                        throw newError(
                            getErrorTextForParameterCount(NumArray.FnMin, `<=1`, argArray.length),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_10
                        );
                    }
                    if (argArray.length === 0) {
                        return ResultType.Number;
                    }

                    const argResultType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argResultType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(NumArray.FnMin, 1, ResultType.Number, argResultType),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_11
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            NumArray.FnMean,
            new FunctionInfo(
                TextType.A0501,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length > 1) {
                        throw newError(
                            getErrorTextForParameterCount(NumArray.FnMean, `<=1`, argArray.length),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_12
                        );
                    }
                    if (argArray.length === 0) {
                        return ResultType.Number;
                    }

                    const argResultType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argResultType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(NumArray.FnMean, 1, ResultType.Number, argResultType),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_13
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            NumArray.FnSum,
            new FunctionInfo(
                TextType.A0502,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length > 1) {
                        throw newError(
                            getErrorTextForParameterCount(NumArray.FnSum, `<=1`, argArray.length),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_14
                        );
                    }
                    if (argArray.length === 0) {
                        return ResultType.Number;
                    }

                    const argResultType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argResultType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(NumArray.FnSum, 1, ResultType.Number, argResultType),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_15
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            NumArray.FnAll,
            new FunctionInfo(
                TextType.A0503,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(NumArray.FnAll, 1, argArray.length),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_16
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof NodesLambda)) {
                        throw newError(
                            getErrorTextForParameterType(NumArray.FnAll, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_17
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
                            getErrorTextForLambdaResultType(NumArray.FnAll, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_18
                        );
                    }

                    return ResultType.NumberArray;
                },
            )
        );
        functions.set(
            NumArray.FnAny,
            new FunctionInfo(
                TextType.A0504,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(NumArray.FnAny, 1, argArray.length),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_19
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof NodesLambda)) {
                        throw newError(
                            getErrorTextForParameterType(NumArray.FnAny, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_20
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
                            getErrorTextForLambdaResultType(NumArray.FnAny, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_21
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            NumArray.FnAdd,
            new FunctionInfo(
                TextType.A0669,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length <= 0) {
                        throw newError(
                            getErrorTextForParameterCount(NumArray.FnAdd, "> 0", argArray.length),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_22
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ResultType.Number) {
                            throw newError(
                                getErrorTextForParameterType(NumArray.FnAdd, i + 1, ResultType.Number, argType),
                                ClientErrorCode.EpContextNumberArray_GenerateFunctions_23
                            );
                        }
                    }

                    return ResultType.NumberArray;
                },
            )
        );
        functions.set(
            NumArray.FnHas,
            new FunctionInfo(
                TextType.A0746,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(NumArray.FnHas, 1, argArray.length),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_24
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(NumArray.FnHas, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_25
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            NumArray.FnSet,
            new FunctionInfo(
                TextType.A0878,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw newError(
                            getErrorTextForParameterCount(NumArray.FnSet, 2, argArray.length),
                            ClientErrorCode.EpContextNumberArray_GenerateFunctions_26
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ResultType.Number) {
                            throw newError(
                                getErrorTextForParameterType(NumArray.FnSet, i + 1, ResultType.Number, argType),
                                ClientErrorCode.EpContextNumberArray_GenerateFunctions_27
                            );
                        }
                    }

                    return ResultType.NumberArray;
                },
            )
        );

        return functions;
    }

    private _numberArray    : number[];
    private _contextWar     : War | null = null;

    public constructor(data: ResultsNumArray) {
        super(data.war);

        this._numberArray   = data.numberArray;
    }

    public getContextType(): ContextType {
        return ContextType.NumberArray;
    }

    public override resolveVariable(identifierName: string): ResultsBase {
        switch (identifierName) {
            case NumArray.VnLength  : return new Num(this.getWar(), this._numberArray.length);
            default                             : return (this._contextWar ??= new War(this.getWar())).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ResultsBase[], rootCtx: Base, localVariableDict: Map<string, ResultsBase> | null, isRestricted: boolean): ResultsBase {
        switch (identifierName) {
            case NumArray.FnGet     : return this.callGet(argumentArray[0]);
            case NumArray.FnWhere   : return this.callWhere(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case NumArray.FnSelect  : return this.callSelect(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case NumArray.FnMax     : return this.callMax(argumentArray[0]);
            case NumArray.FnMin     : return this.callMin(argumentArray[0]);
            case NumArray.FnMean    : return this.callMean(argumentArray[0]);
            case NumArray.FnSum     : return this.callSum(argumentArray[0]);
            case NumArray.FnAll     : return this.callAll(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case NumArray.FnAny     : return this.callAny(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case NumArray.FnAdd     : return this.callAdd(argumentArray);
            case NumArray.FnHas     : return this.callHas(argumentArray[0]);
            case NumArray.FnSet     : return this.callSet(argumentArray);
            default                             : return (this._contextWar ??= new War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }

    private callGet(arg: ResultsBase): Num {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`, ClientErrorCode.EpContextNumberArray_CallGet_00);
        }

        const array     = this._numberArray;
        const length    = array.length;
        if (!length) {
            throw newError(`Empty array.`, ClientErrorCode.EpContextNumberArray_CallGet_01);
        }

        const rawIndex  = getValueInInt32(arg.num);
        const index     = rawIndex >= 0 ? rawIndex : rawIndex + length;
        const result    = array[index];
        if (result == null) {
            throw newError(`Invalid index: ${index}`, ClientErrorCode.EpContextNumberArray_CallGet_02);
        }

        return new Num(this.getWar(), result);
    }

    public callWhere(arg: ResultsBase, rootCtx: Base, localVariableDict: Map<string, ResultsBase> | null, isRestricted: boolean): ResultsNumArray {
        if (!(arg instanceof ResultsLambda)) {
            throw newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof NodesLambda)) {
            throw newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : number[] = [];
        for (const num of this._numberArray) {
            const result = node.evalLambda(rootCtx, [new Num(war, num)], null, localVariableDict, isRestricted);
            if (!(result instanceof Num)) {
                throw newError(`Invalid lambda result.`, ClientErrorCode.EpContextNumberArray_CallWhere_00);
            }

            if (result.num !== 0) {
                resultArray.push(num);
            }
        }

        return new ResultsNumArray(war, resultArray);
    }

    public callSelect(arg: ResultsBase, rootCtx: Base, localVariableDict: Map<string, ResultsBase> | null, isRestricted: boolean): ResultsBase {
        if (!(arg instanceof ResultsLambda)) {
            throw newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof NodesLambda)) {
            throw newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const numbers       = this._numberArray;
        const resultType    = node.getLambdaResultType2({
            contextType                     : rootCtx.getContextType(),
            directLambdaArgumentInfoArray   : [ResultType.Number],
            indirectLambdaArgumentInfoDict  : null,
            localVariableDict               : localVariableDict,
            customCounterNameSet            : new Set(war.getInstanceWarRule().getWarEventFullData()?.getCustomCounterNameArray().map(v => v.getName() ?? ``)),
        });
        if (resultType === ResultType.Unit) {
            const resultArray: NullableUnit[] = [];
            for (const num of numbers) {
                const result = node.evalLambda(rootCtx, [new Num(war, num)], null, localVariableDict, isRestricted);
                if (!(result instanceof NullableUnit)) {
                    throw newError(`Invalid lambda result for unit.`, ClientErrorCode.EpContextNumberArray_CallSelectNumber_00);
                }

                resultArray.push(result);
            }

            return new NullableUnitArray(war, resultArray);

        } else if (resultType === ResultType.Tile) {
            const resultArray: ITile[] = [];
            for (const num of numbers) {
                const result = node.evalLambda(rootCtx, [new Num(war, num)], null, localVariableDict, isRestricted);
                if (!(result instanceof Tile)) {
                    throw newError(`Invalid lambda result for tile.`, ClientErrorCode.EpContextNumberArray_CallSelectNumber_01);
                }

                resultArray.push(result.tile);
            }

            return new TileArray(war, resultArray);

        } else if (resultType === ResultType.TileBuff) {
            const resultArray: TileBuff[] = [];
            for (const num of numbers) {
                const result = node.evalLambda(rootCtx, [new Num(war, num)], null, localVariableDict, isRestricted);
                if (!(result instanceof TileBuff)) {
                    throw newError(`Invalid lambda result for tile.`);
                }

                resultArray.push(result);
            }

            return new TileBuffArray(war, resultArray);

        } else if (resultType === ResultType.Player) {
            const resultArray: IPlayer[] = [];
            for (const num of numbers) {
                const result = node.evalLambda(rootCtx, [new Num(war, num)], null, localVariableDict, isRestricted);
                if (!(result instanceof Player)) {
                    throw newError(`Invalid lambda result for player.`, ClientErrorCode.EpContextNumberArray_CallSelectNumber_02);
                }

                resultArray.push(result.player);
            }

            return new PlayerArray(war, resultArray);

        } else if (resultType === ResultType.Number) {
            const resultArray: number[] = [];
            for (const num of numbers) {
                const result = node.evalLambda(rootCtx, [new Num(war, num)], null, localVariableDict, isRestricted);
                if (!(result instanceof Num)) {
                    throw newError(`Invalid lambda result for number.`, ClientErrorCode.EpContextNumberArray_CallSelectNumber_03);
                }

                resultArray.push(result.num);
            }

            return new ResultsNumArray(war, resultArray);

        } else if (resultType === ResultType.Position) {
            const resultArray: Position[] = [];
            for (const num of numbers) {
                const result = node.evalLambda(rootCtx, [new Num(war, num)], null, localVariableDict, isRestricted);
                if (!(result instanceof Position)) {
                    throw newError(`Invalid lambda result for position.`, ClientErrorCode.EpContextNumberArray_CallSelectNumber_04);
                }

                resultArray.push(result);
            }

            return new PositionArray(war, resultArray);

        } else if (resultType === ResultType.UnitStatistic) {
            const resultArray: UnitStatistic[] = [];
            for (const num of numbers) {
                const result = node.evalLambda(rootCtx, [new Num(war, num)], null, localVariableDict, isRestricted);
                if (!(result instanceof UnitStatistic)) {
                    throw newError(`Invalid lambda result for position.`, ClientErrorCode.EpContextNumberArray_CallSelectNumber_05);
                }

                resultArray.push(result);
            }

            return new UnitStatisticArray(war, resultArray);

        } else {
            throw newError(`Unexpected resultType: ${resultType}`, ClientErrorCode.EpContextNumberArray_CallSelectNumber_06);
        }
    }

    public callMax(arg: ResultsBase | null): Num {
        const numberArray   = this._numberArray;
        const war           = this.getWar();
        if (!numberArray.length) {
            if (!(arg instanceof Num)) {
                throw newError(`Unexpected arg.`);
            }
            return new Num(war, arg.num);
        }

        return new Num(war, Math.max(...numberArray));
    }

    public callMin(arg: ResultsBase | null): Num {
        const numberArray   = this._numberArray;
        const war           = this.getWar();
        if (!numberArray.length) {
            if (!(arg instanceof Num)) {
                throw newError(`Unexpected arg.`);
            }
            return new Num(war, arg.num);
        }

        return new Num(war, Math.min(...numberArray));
    }

    public callMean(arg: ResultsBase | null): Num {
        const numberArray   = this._numberArray;
        const war           = this.getWar();
        if (!numberArray.length) {
            if (!(arg instanceof Num)) {
                throw newError(`Unexpected arg.`);
            }
            return new Num(war, arg.num);
        }

        let result = 0;
        for (const num of numberArray) {
            result += num;
        }
        result /= numberArray.length;

        return new Num(war, result);
    }

    public callSum(arg: ResultsBase | null): Num {
        const numberArray   = this._numberArray;
        const war           = this.getWar();
        if (!numberArray.length) {
            if (!(arg instanceof Num)) {
                throw newError(`Unexpected arg.`);
            }
            return new Num(war, arg.num);
        }

        let result = 0;
        for (const num of numberArray) {
            result += num;
        }

        return new Num(war, result);
    }

    public callAll(arg: ResultsBase, rootCtx: Base, localVariableDict: Map<string, ResultsBase> | null, isRestricted: boolean): Num {
        if (!(arg instanceof ResultsLambda)) {
            throw newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof NodesLambda)) {
            throw newError(`Unexpected node.`);
        }

        const war = this.getWar();
        for (const num of this._numberArray) {
            const result = node.evalLambda(rootCtx, [new Num(war, num)], null, localVariableDict, isRestricted);
            if (!(result instanceof Num)) {
                throw newError(`Invalid lambda result.`);
            }

            if (result.num === 0) {
                return new Num(war, 0);
            }
        }

        return new Num(war, 1);
    }

    public callAny(arg: ResultsBase, rootCtx: Base, localVariableDict: Map<string, ResultsBase> | null, isRestricted: boolean): Num {
        if (!(arg instanceof ResultsLambda)) {
            throw newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof NodesLambda)) {
            throw newError(`Unexpected node.`);
        }

        const war = this.getWar();
        for (const num of this._numberArray) {
            const result = node.evalLambda(rootCtx, [new Num(war, num)], null, localVariableDict, isRestricted);
            if (!(result instanceof Num)) {
                throw newError(`Invalid lambda result.`);
            }

            if (result.num !== 0) {
                return new Num(war, 1);
            }
        }

        return new Num(war, 0);
    }

    private callAdd(argArray: ResultsBase[]): ResultsNumArray {
        const numberList = this._numberArray.concat();
        for (const arg of argArray) {
            if (arg instanceof Num) {
                numberList.push(arg.num);
            } else {
                throw newError(`Invalid arg.`);
            }
        }

        return new ResultsNumArray(this.getWar(), numberList);
    }

    private callHas(arg: ResultsBase): Num {
        if (!(arg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        return new Num(this.getWar(), this._numberArray.indexOf(arg.num) >= 0 ? 1 : 0);
    }

    private callSet(argArray: ResultsBase[]): ResultsNumArray {
        const array     = this._numberArray;
        const length    = array.length;
        if (!length) {
            throw newError(`Empty array.`);
        }

        const argIndex = argArray[0];
        if (!(argIndex instanceof Num)) {
            throw newError(`Invalid argIndex.`);
        }

        const argValue = argArray[1];
        if (!(argValue instanceof Num)) {
            throw newError(`Invalid argValue.`);
        }

        const rawIndex  = getValueInInt32(argIndex.num);
        const index     = rawIndex >= 0 ? rawIndex : rawIndex + length;
        if ((index < 0) || (index >= length)) {
            throw newError(`Invalid index.`);
        }

        const numberList    = array.concat();
        numberList[index]   = argValue.num;
        return new ResultsNumArray(this.getWar(), numberList);
    }
}
