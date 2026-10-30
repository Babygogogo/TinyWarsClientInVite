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
import { NumArray } from "../results/NumArray.ts";
import { Player } from "../results/Player.ts";
import { PlayerArray } from "../results/PlayerArray.ts";
import { Position } from "../results/Position.ts";
import { PositionArray } from "../results/PositionArray.ts";
import { Tile } from "../results/Tile.ts";
import { TileArray } from "../results/TileArray.ts";
import { TileBuff } from "../results/TileBuff.ts";
import { TileBuffArray } from "../results/TileBuffArray.ts";
import { UnitStatistic } from "../results/UnitStatistic.ts";
import { UnitStatisticArray as ResultsUnitStatisticArray } from "../results/UnitStatisticArray.ts";
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
import type { IPlayer } from "../../players/IPlayer.ts";
import type { ITile } from "../../tiles/ITile.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class UnitStatisticArray extends Base {
    // 因为部队统计数据没有自动填充0，所以暂时不提供length和get，如果要提供get，一定要做好排序。
    private static readonly FnMerge     = "merge";
    private static readonly FnWhere     = "where";
    private static readonly FnSelect    = "select";
    private static readonly FnAll       = "all";
    private static readonly FnAny       = "any";

    public static readonly Variables    = UnitStatisticArray.generateVariables();
    public static readonly Functions    = UnitStatisticArray.generateFunctions();
    private static generateVariables(): EpVariableInfoDict {
        const variables = extendVariableInfoDict(War.Variables);
        return variables;
    }
    private static generateFunctions(): EpFunctionInfoDict {
        const functions = extendFunctionInfoDict(War.Functions);
        functions.set(
            UnitStatisticArray.FnMerge,
            new FunctionInfo(
                TextType.A0521,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 0) {
                        throw newError(
                            getErrorTextForParameterCount(UnitStatisticArray.FnMerge, 0, argArray.length),
                            ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_00
                        );
                    }

                    return ResultType.UnitStatistic;
                },
            )
        );
        functions.set(
            UnitStatisticArray.FnWhere,
            new FunctionInfo(
                TextType.A0558,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(UnitStatisticArray.FnWhere, 1, argArray.length),
                            ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_01
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof NodesLambda)) {
                        throw newError(
                            getErrorTextForParameterType(UnitStatisticArray.FnWhere, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_02
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
                            getErrorTextForLambdaResultType(UnitStatisticArray.FnWhere, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_03
                        );
                    }

                    return ResultType.UnitStatisticArray;
                },
            )
        );
        functions.set(
            UnitStatisticArray.FnSelect,
            new FunctionInfo(
                TextType.A0557,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(UnitStatisticArray.FnSelect, 1, argArray.length),
                            ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_04
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof NodesLambda)) {
                        throw newError(
                            getErrorTextForParameterType(UnitStatisticArray.FnSelect, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_05
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ResultType.UnitStatistic],
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
                                UnitStatisticArray.FnSelect,
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
                            ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_06
                        );
                    }
                },
            )
        );
        functions.set(
            UnitStatisticArray.FnAll,
            new FunctionInfo(
                TextType.A0559,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(UnitStatisticArray.FnAll, 1, argArray.length),
                            ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_07
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof NodesLambda)) {
                        throw newError(
                            getErrorTextForParameterType(UnitStatisticArray.FnAll, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_08
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
                            getErrorTextForLambdaResultType(UnitStatisticArray.FnAll, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_09
                        );
                    }

                    return ResultType.Number;
                },
            )
        );
        functions.set(
            UnitStatisticArray.FnAny,
            new FunctionInfo(
                TextType.A0560,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(UnitStatisticArray.FnAny, 1, argArray.length),
                            ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_10
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof NodesLambda)) {
                        throw newError(
                            getErrorTextForParameterType(UnitStatisticArray.FnAny, 1, ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_11
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
                            getErrorTextForLambdaResultType(UnitStatisticArray.FnAny, 1, [ResultType.Number], lambdaResultType),
                            ClientErrorCode.EpContextUnitStatisticArray_GenerateFunctions_12
                        );
                    }

                    return ResultType.Number;
                },
            )
        );

        return functions;
    }

    private _dataArray  : UnitStatistic[];
    private _contextWar : War | null = null;

    public constructor(data: ResultsUnitStatisticArray) {
        super(data.war);

        this._dataArray = data.dataArray;
    }

    public getContextType(): ContextType {
        return ContextType.UnitStatisticArray;
    }

    public override resolveVariable(identifierName: string): ResultsBase {
        switch (identifierName) {
            default     : return (this._contextWar ??= new War(this.getWar())).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ResultsBase[], rootCtx: Base, localVariableDict: Map<string, ResultsBase> | null, isRestricted: boolean): ResultsBase {
        switch (identifierName) {
            case UnitStatisticArray.FnMerge    : return this.callMerge();
            case UnitStatisticArray.FnWhere    : return this.callWhere(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case UnitStatisticArray.FnSelect   : return this.callSelect(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case UnitStatisticArray.FnAll      : return this.callAll(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case UnitStatisticArray.FnAny      : return this.callAny(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            default                                     : return (this._contextWar ??= new War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }

    public callMerge(): UnitStatistic {
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

        return new UnitStatistic(war, {
            unitTypeArray                   : [...new Set(unitTypeArray)].sort((v1, v2) => v1 - v2),
            playerIndexArray                : [...new Set(playerIndexArray)].sort((v1, v2) => v1 - v2),
            groupedObserverTeamIndexesArray : [...new Set(groupedObserverTeamIndexesArray)].sort((v1, v2) => v1 - v2),
            unitGain                        : unitGain,
            unitLoss                        : unitLoss,
            normalizedHpGain                : normalizedHpGain,
            normalizedHpLoss                : normalizedHpLoss,
        });
    }

    public callWhere(arg: ResultsBase, rootCtx: Base, localVariableDict: Map<string, ResultsBase> | null, isRestricted: boolean): ResultsUnitStatisticArray {
        if (!(arg instanceof ResultsLambda)) {
            throw newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof NodesLambda)) {
            throw newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : UnitStatistic[] = [];
        for (const data of this._dataArray) {
            const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
            if (!(result instanceof Num)) {
                throw newError(`Invalid lambda result.`);
            }

            if (result.num !== 0) {
                resultArray.push(data);
            }
        }

        return new ResultsUnitStatisticArray(war, resultArray);
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
        const dataArray     = this._dataArray;
        const resultType    = node.getLambdaResultType2({
            contextType                     : rootCtx.getContextType(),
            directLambdaArgumentInfoArray   : [ResultType.UnitStatistic],
            indirectLambdaArgumentInfoDict  : null,
            localVariableDict               : localVariableDict,
            customCounterNameSet            : new Set(war.getInstanceWarRule().getWarEventFullData()?.getCustomCounterNameArray().map(v => v.getName() ?? ``)),
        });
        if (resultType === ResultType.Unit) {
            const resultArray: NullableUnit[] = [];
            for (const data of dataArray) {
                const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
                if (!(result instanceof NullableUnit)) {
                    throw newError(`Invalid lambda result for unit.`);
                }

                resultArray.push(result);
            }

            return new NullableUnitArray(war, resultArray);

        } else if (resultType === ResultType.Tile) {
            const resultArray: ITile[] = [];
            for (const data of dataArray) {
                const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
                if (!(result instanceof Tile)) {
                    throw newError(`Invalid lambda result for tile.`);
                }

                resultArray.push(result.tile);
            }

            return new TileArray(war, resultArray);

        } else if (resultType === ResultType.TileBuff) {
            const resultArray: TileBuff[] = [];
            for (const data of dataArray) {
                const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
                if (!(result instanceof TileBuff)) {
                    throw newError(`Invalid lambda result for tile.`);
                }

                resultArray.push(result);
            }

            return new TileBuffArray(war, resultArray);

        } else if (resultType === ResultType.Player) {
            const resultArray: IPlayer[] = [];
            for (const data of dataArray) {
                const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
                if (!(result instanceof Player)) {
                    throw newError(`Invalid lambda result for player.`);
                }

                resultArray.push(result.player);
            }

            return new PlayerArray(war, resultArray);

        } else if (resultType === ResultType.Number) {
            const resultArray: number[] = [];
            for (const data of dataArray) {
                const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
                if (!(result instanceof Num)) {
                    throw newError(`Invalid lambda result for number.`);
                }

                resultArray.push(result.num);
            }

            return new NumArray(war, resultArray);

        } else if (resultType === ResultType.Position) {
            const resultArray: Position[] = [];
            for (const data of dataArray) {
                const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
                if (!(result instanceof Position)) {
                    throw newError(`Invalid lambda result for position.`);
                }

                resultArray.push(result);
            }

            return new PositionArray(war, resultArray);

        } else if (resultType === ResultType.UnitStatistic) {
            const resultArray: UnitStatistic[] = [];
            for (const data of dataArray) {
                const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
                if (!(result instanceof UnitStatistic)) {
                    throw newError(`Invalid lambda result for position.`);
                }

                resultArray.push(result);
            }

            return new ResultsUnitStatisticArray(war, resultArray);

        } else {
            throw newError(`Unexpected resultType: ${resultType}`);
        }
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
        for (const data of this._dataArray) {
            const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
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
        for (const data of this._dataArray) {
            const result = node.evalLambda(rootCtx, [data], null, localVariableDict, isRestricted);
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
