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
    ExpressionParsers_Results_Player,
    ExpressionParsers_Results_PlayerArray,
    ExpressionParsers_Results_Position,
    ExpressionParsers_Results_PositionArray,
    ExpressionParsers_Results_Lambda,
    ExpressionParsers_Results_NumArray,
    Lang_Constants,
    ExpressionParsers_Results_Tile,
    ExpressionParsers_Results_TileArray,
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

export class NumArray extends ExpressionParsers_Contexts_Base.Base {
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
    private static generateVariables(): ExpressionParsers_Types.EpVariableInfoDict {
        const variables = ExpressionParsers_Utils.extendVariableInfoDict(ExpressionParsers_Contexts_War.War.Variables);
        variables.set(NumArray.VnLength,    { desc : Lang_Constants.TextType.A0480, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false } );

        return variables;
    }
    private static generateFunctions(): ExpressionParsers_Types.EpFunctionInfoDict {
        const functions = ExpressionParsers_Utils.extendFunctionInfoDict(ExpressionParsers_Contexts_War.War.Functions);
        functions.set(
            NumArray.FnGet,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0490,
                 
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(NumArray.FnGet, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_00,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(NumArray.FnGet, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_01,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            NumArray.FnWhere,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0491,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(NumArray.FnWhere, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_02,
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(NumArray.FnWhere, 1, ExpressionParsers_Enums.ResultType.Lambda, lambda.getResultType({
                                contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                            })),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_03,
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                    : contextType,
                        directLambdaArgumentInfoArray  : [ExpressionParsers_Enums.ResultType.Number],
                        indirectLambdaArgumentInfoDict : lambdaArgumentInfoDict,
                        localVariableDict              : localVariableDict,
                        customCounterNameSet           : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForLambdaResultType(NumArray.FnWhere, 1, [ExpressionParsers_Enums.ResultType.Number], lambdaResultType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_04,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.NumberArray;
                },
            ),
        );
        functions.set(
            NumArray.FnSelect,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0492,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(NumArray.FnSelect, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_05,
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(NumArray.FnSelect, 1, ExpressionParsers_Enums.ResultType.Lambda, lambda.getResultType({
                                contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                            })),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_06,
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                    : contextType,
                        directLambdaArgumentInfoArray  : [ExpressionParsers_Enums.ResultType.Number],
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
                                NumArray.FnSelect,
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
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_07,
                        );
                    }
                },
            ),
        );
        functions.set(
            NumArray.FnMax,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0499,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length > 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(NumArray.FnMax, `<=1`, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_08,
                        );
                    }
                    if (argArray.length === 0) {
                        return ExpressionParsers_Enums.ResultType.Number;
                    }

                    const argResultType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argResultType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(NumArray.FnMax, 1, ExpressionParsers_Enums.ResultType.Number, argResultType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_09,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            NumArray.FnMin,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0500,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length > 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(NumArray.FnMin, `<=1`, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_10,
                        );
                    }
                    if (argArray.length === 0) {
                        return ExpressionParsers_Enums.ResultType.Number;
                    }

                    const argResultType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argResultType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(NumArray.FnMin, 1, ExpressionParsers_Enums.ResultType.Number, argResultType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_11,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            NumArray.FnMean,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0501,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length > 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(NumArray.FnMean, `<=1`, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_12,
                        );
                    }
                    if (argArray.length === 0) {
                        return ExpressionParsers_Enums.ResultType.Number;
                    }

                    const argResultType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argResultType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(NumArray.FnMean, 1, ExpressionParsers_Enums.ResultType.Number, argResultType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_13,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            NumArray.FnSum,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0502,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length > 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(NumArray.FnSum, `<=1`, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_14,
                        );
                    }
                    if (argArray.length === 0) {
                        return ExpressionParsers_Enums.ResultType.Number;
                    }

                    const argResultType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argResultType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(NumArray.FnSum, 1, ExpressionParsers_Enums.ResultType.Number, argResultType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_15,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            NumArray.FnAll,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0503,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(NumArray.FnAll, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_16,
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(NumArray.FnAll, 1, ExpressionParsers_Enums.ResultType.Lambda, lambda.getResultType({
                                contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                            })),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_17,
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                    : contextType,
                        directLambdaArgumentInfoArray  : [ExpressionParsers_Enums.ResultType.Number],
                        indirectLambdaArgumentInfoDict : lambdaArgumentInfoDict,
                        localVariableDict              : localVariableDict,
                        customCounterNameSet           : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForLambdaResultType(NumArray.FnAll, 1, [ExpressionParsers_Enums.ResultType.Number], lambdaResultType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_18,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.NumberArray;
                },
            ),
        );
        functions.set(
            NumArray.FnAny,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0504,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(NumArray.FnAny, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_19,
                        );
                    }

                    const lambda = argArray[0];
                    if (!(lambda instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(NumArray.FnAny, 1, ExpressionParsers_Enums.ResultType.Lambda, lambda.getResultType({
                                contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                            })),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_20,
                        );
                    }

                    const lambdaResultType = lambda.getLambdaResultType({
                        contextType                    : contextType,
                        directLambdaArgumentInfoArray  : [ExpressionParsers_Enums.ResultType.Number],
                        indirectLambdaArgumentInfoDict : lambdaArgumentInfoDict,
                        localVariableDict              : localVariableDict,
                        customCounterNameSet           : customCounterNameSet,
                    });
                    if (lambdaResultType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForLambdaResultType(NumArray.FnAny, 1, [ExpressionParsers_Enums.ResultType.Number], lambdaResultType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_21,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            NumArray.FnAdd,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0669,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length <= 0) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(NumArray.FnAdd, "> 0", argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_22,
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({
                            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                        });
                        if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                            throw Helpers_Misc.newError(
                                ExpressionParsers_Utils.getErrorTextForParameterType(NumArray.FnAdd, i + 1, ExpressionParsers_Enums.ResultType.Number, argType),
                                Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_23,
                            );
                        }
                    }

                    return ExpressionParsers_Enums.ResultType.NumberArray;
                },
            ),
        );
        functions.set(
            NumArray.FnHas,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0746,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(NumArray.FnHas, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_24,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(NumArray.FnHas, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_25,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );
        functions.set(
            NumArray.FnSet,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0878,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 2) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(NumArray.FnSet, 2, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_26,
                        );
                    }

                    for (let i = 0; i < argArray.length; ++i) {
                        const argType = argArray[i].getResultType({
                            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                        });
                        if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                            throw Helpers_Misc.newError(
                                ExpressionParsers_Utils.getErrorTextForParameterType(NumArray.FnSet, i + 1, ExpressionParsers_Enums.ResultType.Number, argType),
                                Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_GenerateFunctions_27,
                            );
                        }
                    }

                    return ExpressionParsers_Enums.ResultType.NumberArray;
                },
            ),
        );

        return functions;
    }

    private readonly _numberArray    : number[];
    private _contextWar     : ExpressionParsers_Contexts_War.War | null = null;

    public constructor(data: ExpressionParsers_Results_NumArray.NumArray) {
        super(data.war);

        this._numberArray   = data.numberArray;
    }

    public getContextType(): ExpressionParsers_Enums.ContextType {
        return ExpressionParsers_Enums.ContextType.NumberArray;
    }

    public override resolveVariable(identifierName: string): ExpressionParsers_Results_Base.Base {
        switch (identifierName) {
            case NumArray.VnLength  : return new ExpressionParsers_Results_Num.Num(this.getWar(), this._numberArray.length);
            default                             : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(this.getWar())).resolveVariable(identifierName);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsers_Results_Base.Base[], rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
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
            default                             : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }

    private callGet(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`, Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_CallGet_00);
        }

        const array     = this._numberArray;
        const length    = array.length;
        if (!length) {
            throw Helpers_Misc.newError(`Empty array.`, Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_CallGet_01);
        }

        const rawIndex  = Numbers_Utils.getValueInInt32(arg.num);
        const index     = rawIndex >= 0 ? rawIndex : rawIndex + length;
        const result    = array[index];
        if (result == null) {
            throw Helpers_Misc.newError(`Invalid index: ${index}`, Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_CallGet_02);
        }

        return new ExpressionParsers_Results_Num.Num(this.getWar(), result);
    }

    public callWhere(arg: ExpressionParsers_Results_Base.Base, rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_NumArray.NumArray {
        if (!(arg instanceof ExpressionParsers_Results_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const node = arg.node;
        if (!(node instanceof ExpressionParsers_Nodes_Lambda.Lambda)) {
            throw Helpers_Misc.newError(`Unexpected node.`);
        }

        const war           = this.getWar();
        const resultArray   : number[] = [];
        for (const num of this._numberArray) {
            const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Num.Num(war, num)], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsers_Results_Num.Num)) {
                throw Helpers_Misc.newError(`Invalid lambda result.`, Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_CallWhere_00);
            }

            if (result.num !== 0) {
                resultArray.push(num);
            }
        }

        return new ExpressionParsers_Results_NumArray.NumArray(war, resultArray);
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
        const numbers       = this._numberArray;
        const resultType    = node.getLambdaResultType2({
            contextType                    : rootCtx.getContextType(),
            directLambdaArgumentInfoArray  : [ExpressionParsers_Enums.ResultType.Number],
            indirectLambdaArgumentInfoDict : null,
            localVariableDict              : localVariableDict,
            customCounterNameSet           : new Set(war.getInstanceWarRule().getWarEventFullData()?.getCustomCounterNameArray().map(v => v.getName() ?? ``)),
        });
        if (resultType === ExpressionParsers_Enums.ResultType.Unit) {
            const resultArray: ExpressionParsers_Results_NullableUnit.NullableUnit[] = [];
            for (const num of numbers) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Num.Num(war, num)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsers_Results_NullableUnit.NullableUnit)) {
                    throw Helpers_Misc.newError(`Invalid lambda result for unit.`, Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_CallSelectNumber_00);
                }

                resultArray.push(result);
            }

            return new ExpressionParsers_Results_NullableUnitArray.NullableUnitArray(war, resultArray);

        } else if (resultType === ExpressionParsers_Enums.ResultType.Tile) {
            const resultArray: Tiles_Tile.Tile[] = [];
            for (const num of numbers) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Num.Num(war, num)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsers_Results_Tile.Tile)) {
                    throw Helpers_Misc.newError(`Invalid lambda result for tile.`, Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_CallSelectNumber_01);
                }

                resultArray.push(result.tile);
            }

            return new ExpressionParsers_Results_TileArray.TileArray(war, resultArray);

        } else if (resultType === ExpressionParsers_Enums.ResultType.TileBuff) {
            const resultArray: ExpressionParsers_Results_TileBuff.TileBuff[] = [];
            for (const num of numbers) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Num.Num(war, num)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsers_Results_TileBuff.TileBuff)) {
                    throw Helpers_Misc.newError(`Invalid lambda result for tile.`);
                }

                resultArray.push(result);
            }

            return new ExpressionParsers_Results_TileBuffArray.TileBuffArray(war, resultArray);

        } else if (resultType === ExpressionParsers_Enums.ResultType.Player) {
            const resultArray: Players_IPlayer.IPlayer[] = [];
            for (const num of numbers) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Num.Num(war, num)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsers_Results_Player.Player)) {
                    throw Helpers_Misc.newError(`Invalid lambda result for player.`, Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_CallSelectNumber_02);
                }

                resultArray.push(result.player);
            }

            return new ExpressionParsers_Results_PlayerArray.PlayerArray(war, resultArray);

        } else if (resultType === ExpressionParsers_Enums.ResultType.Number) {
            const resultArray: number[] = [];
            for (const num of numbers) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Num.Num(war, num)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsers_Results_Num.Num)) {
                    throw Helpers_Misc.newError(`Invalid lambda result for number.`, Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_CallSelectNumber_03);
                }

                resultArray.push(result.num);
            }

            return new ExpressionParsers_Results_NumArray.NumArray(war, resultArray);

        } else if (resultType === ExpressionParsers_Enums.ResultType.Position) {
            const resultArray: ExpressionParsers_Results_Position.Position[] = [];
            for (const num of numbers) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Num.Num(war, num)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsers_Results_Position.Position)) {
                    throw Helpers_Misc.newError(`Invalid lambda result for position.`, Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_CallSelectNumber_04);
                }

                resultArray.push(result);
            }

            return new ExpressionParsers_Results_PositionArray.PositionArray(war, resultArray);

        } else if (resultType === ExpressionParsers_Enums.ResultType.UnitStatistic) {
            const resultArray: ExpressionParsers_Results_UnitStatistic.UnitStatistic[] = [];
            for (const num of numbers) {
                const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Num.Num(war, num)], null, localVariableDict, isRestricted);
                if (!(result instanceof ExpressionParsers_Results_UnitStatistic.UnitStatistic)) {
                    throw Helpers_Misc.newError(`Invalid lambda result for position.`, Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_CallSelectNumber_05);
                }

                resultArray.push(result);
            }

            return new ExpressionParsers_Results_UnitStatisticArray.UnitStatisticArray(war, resultArray);

        } else {
            throw Helpers_Misc.newError(`Unexpected resultType: ${resultType}`, Utils_ClientErrorCode.ClientErrorCode.EpContextNumberArray_CallSelectNumber_06);
        }
    }

    public callMax(arg: ExpressionParsers_Results_Base.Base | null): ExpressionParsers_Results_Num.Num {
        const numberArray   = this._numberArray;
        const war           = this.getWar();
        if (!numberArray.length) {
            if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
                throw Helpers_Misc.newError(`Unexpected arg.`);
            }
            return new ExpressionParsers_Results_Num.Num(war, arg.num);
        }

        return new ExpressionParsers_Results_Num.Num(war, Math.max(...numberArray));
    }

    public callMin(arg: ExpressionParsers_Results_Base.Base | null): ExpressionParsers_Results_Num.Num {
        const numberArray   = this._numberArray;
        const war           = this.getWar();
        if (!numberArray.length) {
            if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
                throw Helpers_Misc.newError(`Unexpected arg.`);
            }
            return new ExpressionParsers_Results_Num.Num(war, arg.num);
        }

        return new ExpressionParsers_Results_Num.Num(war, Math.min(...numberArray));
    }

    public callMean(arg: ExpressionParsers_Results_Base.Base | null): ExpressionParsers_Results_Num.Num {
        const numberArray   = this._numberArray;
        const war           = this.getWar();
        if (!numberArray.length) {
            if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
                throw Helpers_Misc.newError(`Unexpected arg.`);
            }
            return new ExpressionParsers_Results_Num.Num(war, arg.num);
        }

        let result = 0;
        for (const num of numberArray) {
            result += num;
        }
        result /= numberArray.length;

        return new ExpressionParsers_Results_Num.Num(war, result);
    }

    public callSum(arg: ExpressionParsers_Results_Base.Base | null): ExpressionParsers_Results_Num.Num {
        const numberArray   = this._numberArray;
        const war           = this.getWar();
        if (!numberArray.length) {
            if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
                throw Helpers_Misc.newError(`Unexpected arg.`);
            }
            return new ExpressionParsers_Results_Num.Num(war, arg.num);
        }

        let result = 0;
        for (const num of numberArray) {
            result += num;
        }

        return new ExpressionParsers_Results_Num.Num(war, result);
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
        for (const num of this._numberArray) {
            const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Num.Num(war, num)], null, localVariableDict, isRestricted);
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
        for (const num of this._numberArray) {
            const result = node.evalLambda(rootCtx, [new ExpressionParsers_Results_Num.Num(war, num)], null, localVariableDict, isRestricted);
            if (!(result instanceof ExpressionParsers_Results_Num.Num)) {
                throw Helpers_Misc.newError(`Invalid lambda result.`);
            }

            if (result.num !== 0) {
                return new ExpressionParsers_Results_Num.Num(war, 1);
            }
        }

        return new ExpressionParsers_Results_Num.Num(war, 0);
    }

    private callAdd(argArray: ExpressionParsers_Results_Base.Base[]): ExpressionParsers_Results_NumArray.NumArray {
        const numberList = this._numberArray.concat();
        for (const arg of argArray) {
            if (arg instanceof ExpressionParsers_Results_Num.Num) {
                numberList.push(arg.num);
            } else {
                throw Helpers_Misc.newError(`Invalid arg.`);
            }
        }

        return new ExpressionParsers_Results_NumArray.NumArray(this.getWar(), numberList);
    }

    private callHas(arg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        if (!(arg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        return new ExpressionParsers_Results_Num.Num(this.getWar(), this._numberArray.indexOf(arg.num) >= 0 ? 1 : 0);
    }

    private callSet(argArray: ExpressionParsers_Results_Base.Base[]): ExpressionParsers_Results_NumArray.NumArray {
        const array     = this._numberArray;
        const length    = array.length;
        if (!length) {
            throw Helpers_Misc.newError(`Empty array.`);
        }

        const argIndex = argArray[0];
        if (!(argIndex instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Invalid argIndex.`);
        }

        const argValue = argArray[1];
        if (!(argValue instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Invalid argValue.`);
        }

        const rawIndex  = Numbers_Utils.getValueInInt32(argIndex.num);
        const index     = rawIndex >= 0 ? rawIndex : rawIndex + length;
        if ((index < 0) || (index >= length)) {
            throw Helpers_Misc.newError(`Invalid index.`);
        }

        const numberList    = array.concat();
        numberList[index]   = argValue.num;
        return new ExpressionParsers_Results_NumArray.NumArray(this.getWar(), numberList);
    }
}
