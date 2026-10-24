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

export class PositionArray extends ExpressionParsersContextsBase.Base {
    private static readonly VnLength            = "length";

    private static readonly FnGet               = "get";
    private static readonly FnWhere             = "where";
    private static readonly FnSelect            = "select";
    private static readonly FnAll               = "all";
    private static readonly FnAny               = "any";

    public static readonly Variables    = PositionArray.generateVariables();
    public static readonly Functions    = PositionArray.generateFunctions();
    private static generateVariables(): ExpressionParsersTypes.EpVariableInfoDict {
        const variables = ExpressionParsersUtils.extendVariableInfoDict(ExpressionParsersContextsWar.War.Variables);
        variables.set(PositionArray.VnLength,    { desc: LangConstants.TextType.A0480, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false } );

        return variables;
    }
    private static generateFunctions(): ExpressionParsersTypes.EpFunctionInfoDict {
        const functions = ExpressionParsersUtils.extendFunctionInfoDict(ExpressionParsersContextsWar.War.Functions);
        functions.set(
            PositionArray.FnGet,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0571,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(PositionArray.FnGet, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPositionArray_GenerateFunctions_00
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(PositionArray.FnGet, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPositionArray_GenerateFunctions_01
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Position;
                },
            )
        );
        functions.set(
            PositionArray.FnWhere,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0572,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(PositionArray.FnWhere, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPositionArray_GenerateFunctions_02
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(PositionArray.FnWhere, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPositionArray_GenerateFunctions_03
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
                            ExpressionParsersUtils.getErrorTextForLambdaResultType(PositionArray.FnWhere, 1, [ExpressionParsersEnums.ResultType.Number], lambdaResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPositionArray_GenerateFunctions_04
                        );
                    }

                    return ExpressionParsersEnums.ResultType.PositionArray;
                },
            )
        );
        functions.set(
            PositionArray.FnSelect,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0573,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(PositionArray.FnSelect, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPositionArray_GenerateFunctions_05
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(PositionArray.FnSelect, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPositionArray_GenerateFunctions_06
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ExpressionParsersEnums.ResultType.Position],
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
                                PositionArray.FnSelect,
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
                            UtilsClientErrorCode.ClientErrorCode.EpContextPositionArray_GenerateFunctions_07
                        );
                    }
                },
            )
        );
        functions.set(
            PositionArray.FnAll,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0574,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(PositionArray.FnAll, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPositionArray_GenerateFunctions_08
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(PositionArray.FnAll, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPositionArray_GenerateFunctions_09
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
                            ExpressionParsersUtils.getErrorTextForLambdaResultType(PositionArray.FnAll, 1, [ExpressionParsersEnums.ResultType.Number], lambdaResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPositionArray_GenerateFunctions_10
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            PositionArray.FnAny,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0575,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(PositionArray.FnAny, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPositionArray_GenerateFunctions_11
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(PositionArray.FnAny, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPositionArray_GenerateFunctions_12
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
                            ExpressionParsersUtils.getErrorTextForLambdaResultType(PositionArray.FnAny, 1, [ExpressionParsersEnums.ResultType.Number], lambdaResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPositionArray_GenerateFunctions_13
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );

        return functions;
    }

    private readonly _positionArray : ExpressionParsersResultsPosition.Position[];
    private _contextWar             : ExpressionParsersContextsWar.War | null = null;

    public constructor(data: ExpressionParsersResultsPositionArray.PositionArray) {
        super(data.war);

        this._positionArray = data.positionArray;
    }

    public getContextType(): ExpressionParsersEnums.ContextType {
        return ExpressionParsersEnums.ContextType.PositionArray;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase.Base {
        switch (identifierName) {
            case PositionArray.VnLength    : return new ExpressionParsersResultsNum.Num(this.getWar(), this._positionArray.length);
            default                                 : return (this._contextWar ??= new ExpressionParsersContextsWar.War(this.getWar())).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase.Base[], rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        switch (identifierName) {
            case PositionArray.FnGet       : return this.callGet(argumentArray[0]);
            case PositionArray.FnWhere     : return this.callWhere(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case PositionArray.FnSelect    : return this.callSelect(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case PositionArray.FnAll       : return this.callAll(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            case PositionArray.FnAny       : return this.callAny(argumentArray[0], rootCtx, localVariableDict, isRestricted);
            default                                 : return (this._contextWar ??= new ExpressionParsersContextsWar.War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }

    public callGet(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsPosition.Position {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const array     = this._positionArray;
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

        const data = array[index];
        return new ExpressionParsersResultsPosition.Position(this.getWar(), data.x, data.y);
    }

    public callWhere(arg: ExpressionParsersResultsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsPositionArray.PositionArray {
        if (!(arg instanceof ExpressionParsersResultsLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsersNodesLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : ExpressionParsersResultsPosition.Position[] = [];
        for (const position of this._positionArray) {
            const result = node.evalLambda(rootCtx, [position], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsersResultsNum.Num)) {
                throw HelpersMisc.newError(`Invalid lambda result.`);
            }

            if (result.num !== 0) {
                resultArray.push(new ExpressionParsersResultsPosition.Position(war, position.x, position.y));
            }
        }

        return new ExpressionParsersResultsPositionArray.PositionArray(war, resultArray);
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
        const positionArray = this._positionArray;
        const resultType    = node.getLambdaResultType2({
            contextType                     : rootCtx.getContextType(),
            directLambdaArgumentInfoArray   : [ExpressionParsersEnums.ResultType.Position],
            indirectLambdaArgumentInfoDict  : null,
            localVariableDict               : localVariableDict,
            customCounterNameSet            : new Set(war.getInstanceWarRule().getWarEventFullData()?.getCustomCounterNameArray().map(v => v.getName() ?? ``)),
        });
        if (resultType === ExpressionParsersEnums.ResultType.Unit) {
            const resultArray: ExpressionParsersResultsNullableUnit.NullableUnit[] = [];
            for (const position of positionArray) {
                const result = node.evalLambda(rootCtx, [position], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsNullableUnit.NullableUnit)) {
                    throw HelpersMisc.newError(`Invalid lambda result for unit.`);
                }

                resultArray.push(result);
            }

            return new ExpressionParsersResultsNullableUnitArray.NullableUnitArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.Tile) {
            const resultArray: TilesITile.ITile[] = [];
            for (const position of positionArray) {
                const result = node.evalLambda(rootCtx, [position], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsTile.Tile)) {
                    throw HelpersMisc.newError(`Invalid lambda result for tile.`);
                }

                resultArray.push(result.tile);
            }

            return new ExpressionParsersResultsTileArray.TileArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.TileBuff) {
            const resultArray: ExpressionParsersResultsTileBuff.TileBuff[] = [];
            for (const position of positionArray) {
                const result = node.evalLambda(rootCtx, [position], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsTileBuff.TileBuff)) {
                    throw HelpersMisc.newError(`Invalid lambda result for tile.`);
                }

                resultArray.push(result);
            }

            return new ExpressionParsersResultsTileBuffArray.TileBuffArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.Player) {
            const resultArray: PlayersIPlayer.IPlayer[] = [];
            for (const position of positionArray) {
                const result = node.evalLambda(rootCtx, [position], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsPlayer.Player)) {
                    throw HelpersMisc.newError(`Invalid lambda result for player.`);
                }

                resultArray.push(result.player);
            }

            return new ExpressionParsersResultsPlayerArray.PlayerArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.Number) {
            const resultArray: number[] = [];
            for (const position of positionArray) {
                const result = node.evalLambda(rootCtx, [position], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsNum.Num)) {
                    throw HelpersMisc.newError(`Invalid lambda result for number.`);
                }

                resultArray.push(result.num);
            }

            return new ExpressionParsersResultsNumArray.NumArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.Position) {
            const resultArray: ExpressionParsersResultsPosition.Position[] = [];
            for (const position of positionArray) {
                const result = node.evalLambda(rootCtx, [position], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsPosition.Position)) {
                    throw HelpersMisc.newError(`Invalid lambda result for number.`);
                }

                resultArray.push(result);
            }

            return new ExpressionParsersResultsPositionArray.PositionArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.UnitStatistic) {
            const resultArray: ExpressionParsersResultsUnitStatistic.UnitStatistic[] = [];
            for (const position of positionArray) {
                const result = node.evalLambda(rootCtx, [position], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsUnitStatistic.UnitStatistic)) {
                    throw HelpersMisc.newError(`Invalid lambda result for number.`);
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
        for (const position of this._positionArray) {
            const result = node.evalLambda(rootCtx, [position], null, localVariableDict, isRestricted);
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
        for (const position of this._positionArray) {
            const result = node.evalLambda(rootCtx, [position], null, localVariableDict, isRestricted);
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
