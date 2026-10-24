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

export class NumArray extends ExpressionParsersContextsBase.Base {
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
    private static generateVariables(): ExpressionParsersTypes.EpVariableInfoDict {
        const variables = ExpressionParsersUtils.extendVariableInfoDict(ExpressionParsersContextsWar.War.Variables);
        variables.set(NumArray.VnLength,    { desc: LangConstants.TextType.A0480, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false } );

        return variables;
    }
    private static generateFunctions(): ExpressionParsersTypes.EpFunctionInfoDict {
        const functions = ExpressionParsersUtils.extendFunctionInfoDict(ExpressionParsersContextsWar.War.Functions);
        functions.set(
            NumArray.FnGet,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0490,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(NumArray.FnGet, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_00
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(NumArray.FnGet, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_01
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            NumArray.FnWhere,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0491,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(NumArray.FnWhere, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_02
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(NumArray.FnWhere, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_03
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ExpressionParsersEnums.ResultType.Number],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForLambdaResultType(NumArray.FnWhere, 1, [ExpressionParsersEnums.ResultType.Number], lambdaResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_04
                        );
                    }

                    return ExpressionParsersEnums.ResultType.NumberArray;
                },
            )
        );
        functions.set(
            NumArray.FnSelect,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0492,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(NumArray.FnSelect, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_05
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(NumArray.FnSelect, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_06
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ExpressionParsersEnums.ResultType.Number],
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
                                NumArray.FnSelect,
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
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_07
                        );
                    }
                },
            )
        );
        functions.set(
            NumArray.FnMax,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0499,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length > 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(NumArray.FnMax, `<=1`, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_08
                        );
                    }
                    if (argArray.length === 0) {
                        return ExpressionParsersEnums.ResultType.Number;
                    }

                    const argResultType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argResultType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(NumArray.FnMax, 1, ExpressionParsersEnums.ResultType.Number, argResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_09
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            NumArray.FnMin,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0500,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length > 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(NumArray.FnMin, `<=1`, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_10
                        );
                    }
                    if (argArray.length === 0) {
                        return ExpressionParsersEnums.ResultType.Number;
                    }

                    const argResultType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argResultType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(NumArray.FnMin, 1, ExpressionParsersEnums.ResultType.Number, argResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_11
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            NumArray.FnMean,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0501,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length > 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(NumArray.FnMean, `<=1`, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_12
                        );
                    }
                    if (argArray.length === 0) {
                        return ExpressionParsersEnums.ResultType.Number;
                    }

                    const argResultType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argResultType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(NumArray.FnMean, 1, ExpressionParsersEnums.ResultType.Number, argResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_13
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            NumArray.FnSum,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0502,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length > 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(NumArray.FnSum, `<=1`, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_14
                        );
                    }
                    if (argArray.length === 0) {
                        return ExpressionParsersEnums.ResultType.Number;
                    }

                    const argResultType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argResultType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(NumArray.FnSum, 1, ExpressionParsersEnums.ResultType.Number, argResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_15
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            NumArray.FnAll,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0503,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(NumArray.FnAll, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_16
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(NumArray.FnAll, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_17
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ExpressionParsersEnums.ResultType.Number],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForLambdaResultType(NumArray.FnAll, 1, [ExpressionParsersEnums.ResultType.Number], lambdaResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_18
                        );
                    }

                    return ExpressionParsersEnums.ResultType.NumberArray;
                },
            )
        );
        functions.set(
            NumArray.FnAny,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0504,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(NumArray.FnAny, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_19
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsersNodesLambda.Lambda)) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(NumArray.FnAny, 1, ExpressionParsersEnums.ResultType.Lambda, lambda.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet })),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_20
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                     : contextType,
                        directLambdaArgumentInfoArray   : [ExpressionParsersEnums.ResultType.Number],
                        indirectLambdaArgumentInfoDict  : lambdaArgumentInfoDict,
                        localVariableDict               : localVariableDict,
                        customCounterNameSet            : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForLambdaResultType(NumArray.FnAny, 1, [ExpressionParsersEnums.ResultType.Number], lambdaResultType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_21
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            NumArray.FnAdd,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0669,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length <= 0) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(NumArray.FnAdd, "> 0", argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_22
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ExpressionParsersEnums.ResultType.Number) {
                            throw HelpersMisc.newError(
                                ExpressionParsersUtils.getErrorTextForParameterType(NumArray.FnAdd, i + 1, ExpressionParsersEnums.ResultType.Number, argType),
                                UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_23
                            );
                        }
                    }

                    return ExpressionParsersEnums.ResultType.NumberArray;
                },
            )
        );
        functions.set(
            NumArray.FnHas,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0746,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(NumArray.FnHas, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_24
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(NumArray.FnHas, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_25
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            )
        );
        functions.set(
            NumArray.FnSet,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0878,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(NumArray.FnSet, 2, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_26
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                        if (argType !== ExpressionParsersEnums.ResultType.Number) {
                            throw HelpersMisc.newError(
                                ExpressionParsersUtils.getErrorTextForParameterType(NumArray.FnSet, i + 1, ExpressionParsersEnums.ResultType.Number, argType),
                                UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_27
                            );
                        }
                    }

                    return ExpressionParsersEnums.ResultType.NumberArray;
                },
            )
        );

        return functions;
    }

    private _numberArray    : number[];
    private _contextWar     : ExpressionParsersContextsWar.War | null = null;

    public constructor(data: ExpressionParsersResultsNumArray.NumArray) {
        super(data.war);

        this._numberArray   = data.numberArray;
    }

    public getContextType(): ExpressionParsersEnums.ContextType {
        return ExpressionParsersEnums.ContextType.NumberArray;
    }

    public override resolveVariable(identifierName: string): ExpressionParsersResultsBase.Base {
        switch (identifierName) {
            case NumArray.VnLength  : return new ExpressionParsersResultsNum.Num(this.getWar(), this._numberArray.length);
            default                             : return (this._contextWar ??= new ExpressionParsersContextsWar.War(this.getWar())).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase.Base[], rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
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
            default                             : return (this._contextWar ??= new ExpressionParsersContextsWar.War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }

    private callGet(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`, UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_CallGet_00);
        }

        const array     = this._numberArray;
        const length    = array.length;
        if (!length) {
            throw HelpersMisc.newError(`Empty array.`, UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_CallGet_01);
        }

        const rawIndex  = NumbersUtils.getValueInInt32(arg.num);
        const index     = rawIndex >= 0 ? rawIndex : rawIndex + length;
        const result    = array[index];
        if (result == null) {
            throw HelpersMisc.newError(`Invalid index: ${index}`, UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_CallGet_02);
        }

        return new ExpressionParsersResultsNum.Num(this.getWar(), result);
    }

    public callWhere(arg: ExpressionParsersResultsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsNumArray.NumArray {
        if (!(arg instanceof ExpressionParsersResultsLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsersNodesLambda.Lambda)) {
            throw HelpersMisc.newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : number[] = [];
        for (const num of this._numberArray) {
            const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsNum.Num(war, num)], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsersResultsNum.Num)) {
                throw HelpersMisc.newError(`Invalid lambda result.`, UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_CallWhere_00);
            }

            if (result.num !== 0) {
                resultArray.push(num);
            }
        }

        return new ExpressionParsersResultsNumArray.NumArray(war, resultArray);
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
        const numbers       = this._numberArray;
        const resultType    = node.getLambdaResultType2({
            contextType                     : rootCtx.getContextType(),
            directLambdaArgumentInfoArray   : [ExpressionParsersEnums.ResultType.Number],
            indirectLambdaArgumentInfoDict  : null,
            localVariableDict               : localVariableDict,
            customCounterNameSet            : new Set(war.getInstanceWarRule().getWarEventFullData()?.getCustomCounterNameArray().map(v => v.getName() ?? ``)),
        });
        if (resultType === ExpressionParsersEnums.ResultType.Unit) {
            const resultArray: ExpressionParsersResultsNullableUnit.NullableUnit[] = [];
            for (const num of numbers) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsNum.Num(war, num)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsNullableUnit.NullableUnit)) {
                    throw HelpersMisc.newError(`Invalid lambda result for unit.`, UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_CallSelectNumber_00);
                }

                resultArray.push(result);
            }

            return new ExpressionParsersResultsNullableUnitArray.NullableUnitArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.Tile) {
            const resultArray: TilesITile.ITile[] = [];
            for (const num of numbers) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsNum.Num(war, num)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsTile.Tile)) {
                    throw HelpersMisc.newError(`Invalid lambda result for tile.`, UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_CallSelectNumber_01);
                }

                resultArray.push(result.tile);
            }

            return new ExpressionParsersResultsTileArray.TileArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.TileBuff) {
            const resultArray: ExpressionParsersResultsTileBuff.TileBuff[] = [];
            for (const num of numbers) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsNum.Num(war, num)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsTileBuff.TileBuff)) {
                    throw HelpersMisc.newError(`Invalid lambda result for tile.`);
                }

                resultArray.push(result);
            }

            return new ExpressionParsersResultsTileBuffArray.TileBuffArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.Player) {
            const resultArray: PlayersIPlayer.IPlayer[] = [];
            for (const num of numbers) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsNum.Num(war, num)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsPlayer.Player)) {
                    throw HelpersMisc.newError(`Invalid lambda result for player.`, UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_CallSelectNumber_02);
                }

                resultArray.push(result.player);
            }

            return new ExpressionParsersResultsPlayerArray.PlayerArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.Number) {
            const resultArray: number[] = [];
            for (const num of numbers) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsNum.Num(war, num)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsNum.Num)) {
                    throw HelpersMisc.newError(`Invalid lambda result for number.`, UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_CallSelectNumber_03);
                }

                resultArray.push(result.num);
            }

            return new ExpressionParsersResultsNumArray.NumArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.Position) {
            const resultArray: ExpressionParsersResultsPosition.Position[] = [];
            for (const num of numbers) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsNum.Num(war, num)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsPosition.Position)) {
                    throw HelpersMisc.newError(`Invalid lambda result for position.`, UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_CallSelectNumber_04);
                }

                resultArray.push(result);
            }

            return new ExpressionParsersResultsPositionArray.PositionArray(war, resultArray);

        } else if (resultType === ExpressionParsersEnums.ResultType.UnitStatistic) {
            const resultArray: ExpressionParsersResultsUnitStatistic.UnitStatistic[] = [];
            for (const num of numbers) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsNum.Num(war, num)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsersResultsUnitStatistic.UnitStatistic)) {
                    throw HelpersMisc.newError(`Invalid lambda result for position.`, UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_CallSelectNumber_05);
                }

                resultArray.push(result);
            }

            return new ExpressionParsersResultsUnitStatisticArray.UnitStatisticArray(war, resultArray);

        } else {
            throw HelpersMisc.newError(`Unexpected resultType: ${resultType}`, UtilsClientErrorCode.ClientErrorCode.EpContextNumberArray_CallSelectNumber_06);
        }
    }

    public callMax(arg: ExpressionParsersResultsBase.Base | null): ExpressionParsersResultsNum.Num {
        const numberArray   = this._numberArray;
        const war           = this.getWar();
        if (!numberArray.length) {
            if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
                throw HelpersMisc.newError(`Unexpected arg.`);
            }
            return new ExpressionParsersResultsNum.Num(war, arg.num);
        }

        return new ExpressionParsersResultsNum.Num(war, Math.max(...numberArray));
    }

    public callMin(arg: ExpressionParsersResultsBase.Base | null): ExpressionParsersResultsNum.Num {
        const numberArray   = this._numberArray;
        const war           = this.getWar();
        if (!numberArray.length) {
            if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
                throw HelpersMisc.newError(`Unexpected arg.`);
            }
            return new ExpressionParsersResultsNum.Num(war, arg.num);
        }

        return new ExpressionParsersResultsNum.Num(war, Math.min(...numberArray));
    }

    public callMean(arg: ExpressionParsersResultsBase.Base | null): ExpressionParsersResultsNum.Num {
        const numberArray   = this._numberArray;
        const war           = this.getWar();
        if (!numberArray.length) {
            if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
                throw HelpersMisc.newError(`Unexpected arg.`);
            }
            return new ExpressionParsersResultsNum.Num(war, arg.num);
        }

        let result = 0;
        for (const num of numberArray) {
            result += num;
        }
        result /= numberArray.length;

        return new ExpressionParsersResultsNum.Num(war, result);
    }

    public callSum(arg: ExpressionParsersResultsBase.Base | null): ExpressionParsersResultsNum.Num {
        const numberArray   = this._numberArray;
        const war           = this.getWar();
        if (!numberArray.length) {
            if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
                throw HelpersMisc.newError(`Unexpected arg.`);
            }
            return new ExpressionParsersResultsNum.Num(war, arg.num);
        }

        let result = 0;
        for (const num of numberArray) {
            result += num;
        }

        return new ExpressionParsersResultsNum.Num(war, result);
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
        for (const num of this._numberArray) {
            const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsNum.Num(war, num)], null, localVariableDict, isRestricted);
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
        for (const num of this._numberArray) {
            const result = node.evalLambda(rootCtx, [new ExpressionParsersResultsNum.Num(war, num)], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsersResultsNum.Num)) {
                throw HelpersMisc.newError(`Invalid lambda result.`);
            }

            if (result.num !== 0) {
                return new ExpressionParsersResultsNum.Num(war, 1);
            }
        }

        return new ExpressionParsersResultsNum.Num(war, 0);
    }

    private callAdd(argArray: ExpressionParsersResultsBase.Base[]): ExpressionParsersResultsNumArray.NumArray {
        const numberList = this._numberArray.concat();
        for (const arg of argArray) {
            if (arg instanceof ExpressionParsersResultsNum.Num) {
                numberList.push(arg.num);
            } else {
                throw HelpersMisc.newError(`Invalid arg.`);
            }
        }

        return new ExpressionParsersResultsNumArray.NumArray(this.getWar(), numberList);
    }

    private callHas(arg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        if (!(arg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        return new ExpressionParsersResultsNum.Num(this.getWar(), this._numberArray.indexOf(arg.num) >= 0 ? 1 : 0);
    }

    private callSet(argArray: ExpressionParsersResultsBase.Base[]): ExpressionParsersResultsNumArray.NumArray {
        const array     = this._numberArray;
        const length    = array.length;
        if (!length) {
            throw HelpersMisc.newError(`Empty array.`);
        }

        const argIndex = argArray[0];
        if (!(argIndex instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Invalid argIndex.`);
        }

        const argValue = argArray[1];
        if (!(argValue instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Invalid argValue.`);
        }

        const rawIndex  = NumbersUtils.getValueInInt32(argIndex.num);
        const index     = rawIndex >= 0 ? rawIndex : rawIndex + length;
        if ((index < 0) || (index >= length)) {
            throw HelpersMisc.newError(`Invalid index.`);
        }

        const numberList    = array.concat();
        numberList[index]   = argValue.num;
        return new ExpressionParsersResultsNumArray.NumArray(this.getWar(), numberList);
    }
}
