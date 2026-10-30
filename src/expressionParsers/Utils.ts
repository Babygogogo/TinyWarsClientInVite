import {
    Utils_ClientErrorCode,
    ExpressionParsers_Enums,
    ExpressionParsers_Contexts_CustomCounter,
    ExpressionParsers_Contexts_Fog,
    ExpressionParsers_FunctionInfo,
    Lang_Utils,
    Helpers_Misc,
    ExpressionParsers_Contexts_Num,
    ExpressionParsers_Contexts_NumArray,
    ExpressionParsers_Contexts_Player,
    ExpressionParsers_Contexts_PlayerArray,
    ExpressionParsers_Contexts_Position,
    ExpressionParsers_Contexts_PositionArray,
    ExpressionParsers_Contexts_TaskObjective,
    Lang_Constants,
    ExpressionParsers_Contexts_Tile,
    ExpressionParsers_Contexts_TileArray,
    ExpressionParsers_Contexts_TileBuff,
    ExpressionParsers_Contexts_TileBuffArray,
    ExpressionParsers_Contexts_Turn,
    ExpressionParsers_Contexts_Unit,
    ExpressionParsers_Contexts_UnitArray,
    ExpressionParsers_Contexts_UnitStatistic,
    ExpressionParsers_Contexts_UnitStatisticArray,
    ExpressionParsers_Contexts_War,
    ExpressionParsers_Contexts_WarOperation,
    ExpressionParsers_Contexts_Weather,
    type ExpressionParsers_Types,
} from "../internal.ts";

export function getFunctionInfoDict(contextType: ExpressionParsers_Enums.ContextType): ExpressionParsers_Types.EpFunctionInfoDict {
    switch (contextType) {
        case ExpressionParsers_Enums.ContextType.War                  : return ExpressionParsers_Contexts_War.War.Functions;
        case ExpressionParsers_Enums.ContextType.CustomCounter        : return ExpressionParsers_Contexts_CustomCounter.CustomCounter.Functions;
        case ExpressionParsers_Enums.ContextType.Number               : return ExpressionParsers_Contexts_Num.Num.Functions;
        case ExpressionParsers_Enums.ContextType.NumberArray          : return ExpressionParsers_Contexts_NumArray.NumArray.Functions;
        case ExpressionParsers_Enums.ContextType.Tile                 : return ExpressionParsers_Contexts_Tile.Tile.Functions;
        case ExpressionParsers_Enums.ContextType.TileArray            : return ExpressionParsers_Contexts_TileArray.TileArray.Functions;
        case ExpressionParsers_Enums.ContextType.Unit                 : return ExpressionParsers_Contexts_Unit.Unit.Functions;
        case ExpressionParsers_Enums.ContextType.UnitArray            : return ExpressionParsers_Contexts_UnitArray.UnitArray.Functions;
        case ExpressionParsers_Enums.ContextType.Position             : return ExpressionParsers_Contexts_Position.Position.Functions;
        case ExpressionParsers_Enums.ContextType.PositionArray        : return ExpressionParsers_Contexts_PositionArray.PositionArray.Functions;
        case ExpressionParsers_Enums.ContextType.Player               : return ExpressionParsers_Contexts_Player.Player.Functions;
        case ExpressionParsers_Enums.ContextType.PlayerArray          : return ExpressionParsers_Contexts_PlayerArray.PlayerArray.Functions;
        case ExpressionParsers_Enums.ContextType.Turn                 : return ExpressionParsers_Contexts_Turn.Turn.Functions;
        case ExpressionParsers_Enums.ContextType.Weather              : return ExpressionParsers_Contexts_Weather.Weather.Functions;
        case ExpressionParsers_Enums.ContextType.TaskObjective        : return ExpressionParsers_Contexts_TaskObjective.TaskObjective.Functions;
        case ExpressionParsers_Enums.ContextType.TileBuff             : return ExpressionParsers_Contexts_TileBuff.TileBuff.Functions;
        case ExpressionParsers_Enums.ContextType.TileBuffArray        : return ExpressionParsers_Contexts_TileBuffArray.TileBuffArray.Functions;
        case ExpressionParsers_Enums.ContextType.WarOperation         : return ExpressionParsers_Contexts_WarOperation.WarOperation.Functions;
        case ExpressionParsers_Enums.ContextType.Fog                  : return ExpressionParsers_Contexts_Fog.Fog.Functions;
        case ExpressionParsers_Enums.ContextType.UnitStatistic        : return ExpressionParsers_Contexts_UnitStatistic.UnitStatistic.Functions;
        case ExpressionParsers_Enums.ContextType.UnitStatisticArray   : return ExpressionParsers_Contexts_UnitStatisticArray.UnitStatisticArray.Functions;
        case ExpressionParsers_Enums.ContextType.Unknown              : throw Helpers_Misc.newError(`Unknown contextType: ${contextType}`, Utils_ClientErrorCode.ClientErrorCode.ExpressionParser_ContextType_GetFunctionInfoDict_00);
        default                                 : throw Helpers_Misc.newError(`Invalid contextType: ${contextType}`, Utils_ClientErrorCode.ClientErrorCode.ExpressionParser_ContextType_GetFunctionInfoDict_01);
    }
}

export function getVariableInfoDict(contextType: ExpressionParsers_Enums.ContextType): ExpressionParsers_Types.EpVariableInfoDict {
    switch (contextType) {
        case ExpressionParsers_Enums.ContextType.War                  : return ExpressionParsers_Contexts_War.War.Variables;
        case ExpressionParsers_Enums.ContextType.CustomCounter        : return ExpressionParsers_Contexts_CustomCounter.CustomCounter.Variables;
        case ExpressionParsers_Enums.ContextType.Number               : return ExpressionParsers_Contexts_Num.Num.Variables;
        case ExpressionParsers_Enums.ContextType.NumberArray          : return ExpressionParsers_Contexts_NumArray.NumArray.Variables;
        case ExpressionParsers_Enums.ContextType.Tile                 : return ExpressionParsers_Contexts_Tile.Tile.Variables;
        case ExpressionParsers_Enums.ContextType.TileArray            : return ExpressionParsers_Contexts_TileArray.TileArray.Variables;
        case ExpressionParsers_Enums.ContextType.Unit                 : return ExpressionParsers_Contexts_Unit.Unit.Variables;
        case ExpressionParsers_Enums.ContextType.UnitArray            : return ExpressionParsers_Contexts_UnitArray.UnitArray.Variables;
        case ExpressionParsers_Enums.ContextType.Position             : return ExpressionParsers_Contexts_Position.Position.Variables;
        case ExpressionParsers_Enums.ContextType.PositionArray        : return ExpressionParsers_Contexts_PositionArray.PositionArray.Variables;
        case ExpressionParsers_Enums.ContextType.Player               : return ExpressionParsers_Contexts_Player.Player.Variables;
        case ExpressionParsers_Enums.ContextType.PlayerArray          : return ExpressionParsers_Contexts_PlayerArray.PlayerArray.Variables;
        case ExpressionParsers_Enums.ContextType.Turn                 : return ExpressionParsers_Contexts_Turn.Turn.Variables;
        case ExpressionParsers_Enums.ContextType.Weather              : return ExpressionParsers_Contexts_Weather.Weather.Variables;
        case ExpressionParsers_Enums.ContextType.TaskObjective        : return ExpressionParsers_Contexts_TaskObjective.TaskObjective.Variables;
        case ExpressionParsers_Enums.ContextType.TileBuff             : return ExpressionParsers_Contexts_TileBuff.TileBuff.Variables;
        case ExpressionParsers_Enums.ContextType.TileBuffArray        : return ExpressionParsers_Contexts_TileBuffArray.TileBuffArray.Variables;
        case ExpressionParsers_Enums.ContextType.WarOperation         : return ExpressionParsers_Contexts_WarOperation.WarOperation.Variables;
        case ExpressionParsers_Enums.ContextType.Fog                  : return ExpressionParsers_Contexts_Fog.Fog.Variables;
        case ExpressionParsers_Enums.ContextType.UnitStatistic        : return ExpressionParsers_Contexts_UnitStatistic.UnitStatistic.Variables;
        case ExpressionParsers_Enums.ContextType.UnitStatisticArray   : return ExpressionParsers_Contexts_UnitStatisticArray.UnitStatisticArray.Variables;
        case ExpressionParsers_Enums.ContextType.Unknown              : throw Helpers_Misc.newError(`Unknown contextType: ${contextType}`, Utils_ClientErrorCode.ClientErrorCode.ExpressionParser_ContextType_GetVariableInfoDict_00);
        default                                 : throw Helpers_Misc.newError(`Invalid contextType: ${contextType}`, Utils_ClientErrorCode.ClientErrorCode.ExpressionParser_ContextType_GetVariableInfoDict_01);
    }
}

export function getContextType(resultType: ExpressionParsers_Enums.ResultType): ExpressionParsers_Enums.ContextType | null {
    switch (resultType) {
        case ExpressionParsers_Enums.ResultType.Number                : return ExpressionParsers_Enums.ContextType.Number;
        case ExpressionParsers_Enums.ResultType.NumberArray           : return ExpressionParsers_Enums.ContextType.NumberArray;
        case ExpressionParsers_Enums.ResultType.Tile                  : return ExpressionParsers_Enums.ContextType.Tile;
        case ExpressionParsers_Enums.ResultType.TileArray             : return ExpressionParsers_Enums.ContextType.TileArray;
        case ExpressionParsers_Enums.ResultType.Unit                  : return ExpressionParsers_Enums.ContextType.Unit;
        case ExpressionParsers_Enums.ResultType.UnitArray             : return ExpressionParsers_Enums.ContextType.UnitArray;
        case ExpressionParsers_Enums.ResultType.Position              : return ExpressionParsers_Enums.ContextType.Position;
        case ExpressionParsers_Enums.ResultType.PositionArray         : return ExpressionParsers_Enums.ContextType.PositionArray;
        case ExpressionParsers_Enums.ResultType.War                   : return ExpressionParsers_Enums.ContextType.War;
        case ExpressionParsers_Enums.ResultType.Player                : return ExpressionParsers_Enums.ContextType.Player;
        case ExpressionParsers_Enums.ResultType.PlayerArray           : return ExpressionParsers_Enums.ContextType.PlayerArray;
        case ExpressionParsers_Enums.ResultType.Turn                  : return ExpressionParsers_Enums.ContextType.Turn;
        case ExpressionParsers_Enums.ResultType.Weather               : return ExpressionParsers_Enums.ContextType.Weather;
        case ExpressionParsers_Enums.ResultType.TaskObjective         : return ExpressionParsers_Enums.ContextType.TaskObjective;
        case ExpressionParsers_Enums.ResultType.TileBuff              : return ExpressionParsers_Enums.ContextType.TileBuff;
        case ExpressionParsers_Enums.ResultType.TileBuffArray         : return ExpressionParsers_Enums.ContextType.TileBuffArray;
        case ExpressionParsers_Enums.ResultType.WarOperation          : return ExpressionParsers_Enums.ContextType.WarOperation;
        case ExpressionParsers_Enums.ResultType.Fog                   : return ExpressionParsers_Enums.ContextType.Fog;
        case ExpressionParsers_Enums.ResultType.UnitStatistic         : return ExpressionParsers_Enums.ContextType.UnitStatistic;
        case ExpressionParsers_Enums.ResultType.UnitStatisticArray    : return ExpressionParsers_Enums.ContextType.UnitStatisticArray;
        case ExpressionParsers_Enums.ResultType.Lambda                : return null;
        case ExpressionParsers_Enums.ResultType.Unknown               : return null;
        default                                 : return null;
    }
}

export function extendFunctionInfoDict(src: ExpressionParsers_Types.EpFunctionInfoDict): ExpressionParsers_Types.EpFunctionInfoDict {
    const dict = new Map<string, ExpressionParsers_FunctionInfo.FunctionInfo>();
    for (const [identifierName, info] of src) {
        dict.set(identifierName, new ExpressionParsers_FunctionInfo.FunctionInfo(
            info.desc,
            info.getResultType,
            true,
        ));
    }

    return dict;
}

export function extendVariableInfoDict(src: ExpressionParsers_Types.EpVariableInfoDict): ExpressionParsers_Types.EpVariableInfoDict {
    const dict = new Map<string, ExpressionParsers_Types.EpVariableInfo>();
    for (const [identifierName, info] of src) {
        dict.set(identifierName, {
            desc        : info.desc,
            resultType  : info.resultType,
            isExtension : true,
            isHidden    : info.isHidden,
        });
    }

    return dict;
}

export function getErrorTextForParameterCount(functionName: string, expectedCount: string | number, actualCount: number): string {
    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0013, functionName, expectedCount, actualCount);
}
export function getErrorTextForParameterType(functionName: string, index: number, expectedType: ExpressionParsers_Enums.ResultType | ExpressionParsers_Enums.ResultType[], actualType: ExpressionParsers_Enums.ResultType): string {
    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0014,
        functionName,
        index,
        typeof expectedType == "number"
            ? Lang_Utils.getExpressionParserResultTypeName(expectedType)
            : expectedType.map(v => Lang_Utils.getExpressionParserResultTypeName(v)).join(" / "),
        Lang_Utils.getExpressionParserResultTypeName(actualType)
    );
}
export function getErrorTextForLambdaResultType(functionName: string, index: number, expectedTypes: ExpressionParsers_Enums.ResultType[], actualType: ExpressionParsers_Enums.ResultType): string {
    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0015,
        functionName,
        index,
        expectedTypes.map(v => Lang_Utils.getExpressionParserResultTypeName(v)).join(" / "),
        Lang_Utils.getExpressionParserResultTypeName(actualType)
    );
}
export function getErrorTextForOperandType(operatorName: string, index: number, expectedType: ExpressionParsers_Enums.ResultType | ExpressionParsers_Enums.ResultType[], actualType: ExpressionParsers_Enums.ResultType): string {
    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0025,
        operatorName,
        index,
        typeof expectedType == "number"
            ? Lang_Utils.getExpressionParserResultTypeName(expectedType)
            : expectedType.map(v => Lang_Utils.getExpressionParserResultTypeName(v)).join(" / "),
        Lang_Utils.getExpressionParserResultTypeName(actualType)
    );
}

// export type ParamValidator = (argArray: Node[], contextType: ContextType, lambdaArgumentInfoArray: ResultType[] | null, lambdaArgumentInfoDict: Map<string, ResultType> | null) => boolean;
// export function createCommonParamValidator(resultType: ResultType | null, minArgCount: number | null, maxArgCount: number | null): ParamValidator {
//     return (argArray, contextType, lambdaArgumentInfoArray, lambdaArgumentInfoDict): boolean => {
//         const argCount = argArray.length;
//         if ((minArgCount != null) && (argCount < minArgCount)) {
//             return false;
//         }
//         if ((maxArgCount != null) && (argCount > maxArgCount)) {
//             return false;
//         }
//         if ((resultType != null) && (argArray.some(v => v.getResultType(contextType, null, lambdaArgumentInfoDict) !== resultType))) {
//             return false;
//         }

//         return true;
//     };
// }
