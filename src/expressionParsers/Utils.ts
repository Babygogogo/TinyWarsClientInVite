import * as ExpressionParsersContextsCustomCounter from "./contexts/CustomCounter.ts";
import * as ExpressionParsersContextsFog from "./contexts/Fog.ts";
import * as ExpressionParsersContextsNum from "./contexts/Num.ts";
import * as ExpressionParsersContextsNumArray from "./contexts/NumArray.ts";
import * as ExpressionParsersContextsPlayer from "./contexts/Player.ts";
import * as ExpressionParsersContextsPlayerArray from "./contexts/PlayerArray.ts";
import * as ExpressionParsersContextsPosition from "./contexts/Position.ts";
import * as ExpressionParsersContextsPositionArray from "./contexts/PositionArray.ts";
import * as ExpressionParsersContextsTaskObjective from "./contexts/TaskObjective.ts";
import * as ExpressionParsersContextsTile from "./contexts/Tile.ts";
import * as ExpressionParsersContextsTileArray from "./contexts/TileArray.ts";
import * as ExpressionParsersContextsTileBuff from "./contexts/TileBuff.ts";
import * as ExpressionParsersContextsTileBuffArray from "./contexts/TileBuffArray.ts";
import * as ExpressionParsersContextsTurn from "./contexts/Turn.ts";
import * as ExpressionParsersContextsUnit from "./contexts/Unit.ts";
import * as ExpressionParsersContextsUnitArray from "./contexts/UnitArray.ts";
import * as ExpressionParsersContextsUnitStatistic from "./contexts/UnitStatistic.ts";
import * as ExpressionParsersContextsUnitStatisticArray from "./contexts/UnitStatisticArray.ts";
import * as ExpressionParsersContextsWar from "./contexts/War.ts";
import * as ExpressionParsersContextsWarOperation from "./contexts/WarOperation.ts";
import * as ExpressionParsersContextsWeather from "./contexts/Weather.ts";
import * as ExpressionParsersEnums from "./Enums.ts";
import * as ExpressionParsersFunctionInfo from "./FunctionInfo.ts";
import type * as ExpressionParsersTypes from "./Types.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as LangConstants from "../lang/Constants.ts";
import * as LangUtils from "../lang/Utils.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";

export function getFunctionInfoDict(contextType: ExpressionParsersEnums.ContextType): ExpressionParsersTypes.EpFunctionInfoDict {
    switch (contextType) {
        case ExpressionParsersEnums.ContextType.War                  : return ExpressionParsersContextsWar.War.Functions;
        case ExpressionParsersEnums.ContextType.CustomCounter        : return ExpressionParsersContextsCustomCounter.CustomCounter.Functions;
        case ExpressionParsersEnums.ContextType.Number               : return ExpressionParsersContextsNum.Num.Functions;
        case ExpressionParsersEnums.ContextType.NumberArray          : return ExpressionParsersContextsNumArray.NumArray.Functions;
        case ExpressionParsersEnums.ContextType.Tile                 : return ExpressionParsersContextsTile.Tile.Functions;
        case ExpressionParsersEnums.ContextType.TileArray            : return ExpressionParsersContextsTileArray.TileArray.Functions;
        case ExpressionParsersEnums.ContextType.Unit                 : return ExpressionParsersContextsUnit.Unit.Functions;
        case ExpressionParsersEnums.ContextType.UnitArray            : return ExpressionParsersContextsUnitArray.UnitArray.Functions;
        case ExpressionParsersEnums.ContextType.Position             : return ExpressionParsersContextsPosition.Position.Functions;
        case ExpressionParsersEnums.ContextType.PositionArray        : return ExpressionParsersContextsPositionArray.PositionArray.Functions;
        case ExpressionParsersEnums.ContextType.Player               : return ExpressionParsersContextsPlayer.Player.Functions;
        case ExpressionParsersEnums.ContextType.PlayerArray          : return ExpressionParsersContextsPlayerArray.PlayerArray.Functions;
        case ExpressionParsersEnums.ContextType.Turn                 : return ExpressionParsersContextsTurn.Turn.Functions;
        case ExpressionParsersEnums.ContextType.Weather              : return ExpressionParsersContextsWeather.Weather.Functions;
        case ExpressionParsersEnums.ContextType.TaskObjective        : return ExpressionParsersContextsTaskObjective.TaskObjective.Functions;
        case ExpressionParsersEnums.ContextType.TileBuff             : return ExpressionParsersContextsTileBuff.TileBuff.Functions;
        case ExpressionParsersEnums.ContextType.TileBuffArray        : return ExpressionParsersContextsTileBuffArray.TileBuffArray.Functions;
        case ExpressionParsersEnums.ContextType.WarOperation         : return ExpressionParsersContextsWarOperation.WarOperation.Functions;
        case ExpressionParsersEnums.ContextType.Fog                  : return ExpressionParsersContextsFog.Fog.Functions;
        case ExpressionParsersEnums.ContextType.UnitStatistic        : return ExpressionParsersContextsUnitStatistic.UnitStatistic.Functions;
        case ExpressionParsersEnums.ContextType.UnitStatisticArray   : return ExpressionParsersContextsUnitStatisticArray.UnitStatisticArray.Functions;
        case ExpressionParsersEnums.ContextType.Unknown              : throw HelpersMisc.newError(`Unknown contextType: ${contextType}`, UtilsClientErrorCode.ClientErrorCode.ExpressionParser_ContextType_GetFunctionInfoDict_00);
        default                                 : throw HelpersMisc.newError(`Invalid contextType: ${contextType}`, UtilsClientErrorCode.ClientErrorCode.ExpressionParser_ContextType_GetFunctionInfoDict_01);
    }
}

export function getVariableInfoDict(contextType: ExpressionParsersEnums.ContextType): ExpressionParsersTypes.EpVariableInfoDict {
    switch (contextType) {
        case ExpressionParsersEnums.ContextType.War                  : return ExpressionParsersContextsWar.War.Variables;
        case ExpressionParsersEnums.ContextType.CustomCounter        : return ExpressionParsersContextsCustomCounter.CustomCounter.Variables;
        case ExpressionParsersEnums.ContextType.Number               : return ExpressionParsersContextsNum.Num.Variables;
        case ExpressionParsersEnums.ContextType.NumberArray          : return ExpressionParsersContextsNumArray.NumArray.Variables;
        case ExpressionParsersEnums.ContextType.Tile                 : return ExpressionParsersContextsTile.Tile.Variables;
        case ExpressionParsersEnums.ContextType.TileArray            : return ExpressionParsersContextsTileArray.TileArray.Variables;
        case ExpressionParsersEnums.ContextType.Unit                 : return ExpressionParsersContextsUnit.Unit.Variables;
        case ExpressionParsersEnums.ContextType.UnitArray            : return ExpressionParsersContextsUnitArray.UnitArray.Variables;
        case ExpressionParsersEnums.ContextType.Position             : return ExpressionParsersContextsPosition.Position.Variables;
        case ExpressionParsersEnums.ContextType.PositionArray        : return ExpressionParsersContextsPositionArray.PositionArray.Variables;
        case ExpressionParsersEnums.ContextType.Player               : return ExpressionParsersContextsPlayer.Player.Variables;
        case ExpressionParsersEnums.ContextType.PlayerArray          : return ExpressionParsersContextsPlayerArray.PlayerArray.Variables;
        case ExpressionParsersEnums.ContextType.Turn                 : return ExpressionParsersContextsTurn.Turn.Variables;
        case ExpressionParsersEnums.ContextType.Weather              : return ExpressionParsersContextsWeather.Weather.Variables;
        case ExpressionParsersEnums.ContextType.TaskObjective        : return ExpressionParsersContextsTaskObjective.TaskObjective.Variables;
        case ExpressionParsersEnums.ContextType.TileBuff             : return ExpressionParsersContextsTileBuff.TileBuff.Variables;
        case ExpressionParsersEnums.ContextType.TileBuffArray        : return ExpressionParsersContextsTileBuffArray.TileBuffArray.Variables;
        case ExpressionParsersEnums.ContextType.WarOperation         : return ExpressionParsersContextsWarOperation.WarOperation.Variables;
        case ExpressionParsersEnums.ContextType.Fog                  : return ExpressionParsersContextsFog.Fog.Variables;
        case ExpressionParsersEnums.ContextType.UnitStatistic        : return ExpressionParsersContextsUnitStatistic.UnitStatistic.Variables;
        case ExpressionParsersEnums.ContextType.UnitStatisticArray   : return ExpressionParsersContextsUnitStatisticArray.UnitStatisticArray.Variables;
        case ExpressionParsersEnums.ContextType.Unknown              : throw HelpersMisc.newError(`Unknown contextType: ${contextType}`, UtilsClientErrorCode.ClientErrorCode.ExpressionParser_ContextType_GetVariableInfoDict_00);
        default                                 : throw HelpersMisc.newError(`Invalid contextType: ${contextType}`, UtilsClientErrorCode.ClientErrorCode.ExpressionParser_ContextType_GetVariableInfoDict_01);
    }
}

export function getContextType(resultType: ExpressionParsersEnums.ResultType): ExpressionParsersEnums.ContextType | null {
    switch (resultType) {
        case ExpressionParsersEnums.ResultType.Number                : return ExpressionParsersEnums.ContextType.Number;
        case ExpressionParsersEnums.ResultType.NumberArray           : return ExpressionParsersEnums.ContextType.NumberArray;
        case ExpressionParsersEnums.ResultType.Tile                  : return ExpressionParsersEnums.ContextType.Tile;
        case ExpressionParsersEnums.ResultType.TileArray             : return ExpressionParsersEnums.ContextType.TileArray;
        case ExpressionParsersEnums.ResultType.Unit                  : return ExpressionParsersEnums.ContextType.Unit;
        case ExpressionParsersEnums.ResultType.UnitArray             : return ExpressionParsersEnums.ContextType.UnitArray;
        case ExpressionParsersEnums.ResultType.Position              : return ExpressionParsersEnums.ContextType.Position;
        case ExpressionParsersEnums.ResultType.PositionArray         : return ExpressionParsersEnums.ContextType.PositionArray;
        case ExpressionParsersEnums.ResultType.War                   : return ExpressionParsersEnums.ContextType.War;
        case ExpressionParsersEnums.ResultType.Player                : return ExpressionParsersEnums.ContextType.Player;
        case ExpressionParsersEnums.ResultType.PlayerArray           : return ExpressionParsersEnums.ContextType.PlayerArray;
        case ExpressionParsersEnums.ResultType.Turn                  : return ExpressionParsersEnums.ContextType.Turn;
        case ExpressionParsersEnums.ResultType.Weather               : return ExpressionParsersEnums.ContextType.Weather;
        case ExpressionParsersEnums.ResultType.TaskObjective         : return ExpressionParsersEnums.ContextType.TaskObjective;
        case ExpressionParsersEnums.ResultType.TileBuff              : return ExpressionParsersEnums.ContextType.TileBuff;
        case ExpressionParsersEnums.ResultType.TileBuffArray         : return ExpressionParsersEnums.ContextType.TileBuffArray;
        case ExpressionParsersEnums.ResultType.WarOperation          : return ExpressionParsersEnums.ContextType.WarOperation;
        case ExpressionParsersEnums.ResultType.Fog                   : return ExpressionParsersEnums.ContextType.Fog;
        case ExpressionParsersEnums.ResultType.UnitStatistic         : return ExpressionParsersEnums.ContextType.UnitStatistic;
        case ExpressionParsersEnums.ResultType.UnitStatisticArray    : return ExpressionParsersEnums.ContextType.UnitStatisticArray;
        case ExpressionParsersEnums.ResultType.Lambda                : return null;
        case ExpressionParsersEnums.ResultType.Unknown               : return null;
        default                                 : return null;
    }
}

export function extendFunctionInfoDict(src: ExpressionParsersTypes.EpFunctionInfoDict): ExpressionParsersTypes.EpFunctionInfoDict {
    const dict = new Map<string, ExpressionParsersFunctionInfo.FunctionInfo>();
    for (const [identifierName, info] of src) {
        dict.set(identifierName, new ExpressionParsersFunctionInfo.FunctionInfo(
            info.desc,
            info.getResultType,
            true,
        ));
    }

    return dict;
}

export function extendVariableInfoDict(src: ExpressionParsersTypes.EpVariableInfoDict): ExpressionParsersTypes.EpVariableInfoDict {
    const dict = new Map<string, ExpressionParsersTypes.EpVariableInfo>();
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
    return LangUtils.getFormattedText(LangConstants.TextType.F0013, functionName, expectedCount, actualCount);
}
export function getErrorTextForParameterType(functionName: string, index: number, expectedType: ExpressionParsersEnums.ResultType | ExpressionParsersEnums.ResultType[], actualType: ExpressionParsersEnums.ResultType): string {
    return LangUtils.getFormattedText(
        LangConstants.TextType.F0014,
        functionName,
        index,
        typeof expectedType == "number"
            ? LangUtils.getExpressionParserResultTypeName(expectedType)
            : expectedType.map(v => LangUtils.getExpressionParserResultTypeName(v)).join(" / "),
        LangUtils.getExpressionParserResultTypeName(actualType)
    );
}
export function getErrorTextForLambdaResultType(functionName: string, index: number, expectedTypes: ExpressionParsersEnums.ResultType[], actualType: ExpressionParsersEnums.ResultType): string {
    return LangUtils.getFormattedText(
        LangConstants.TextType.F0015,
        functionName,
        index,
        expectedTypes.map(v => LangUtils.getExpressionParserResultTypeName(v)).join(" / "),
        LangUtils.getExpressionParserResultTypeName(actualType)
    );
}
export function getErrorTextForOperandType(operatorName: string, index: number, expectedType: ExpressionParsersEnums.ResultType | ExpressionParsersEnums.ResultType[], actualType: ExpressionParsersEnums.ResultType): string {
    return LangUtils.getFormattedText(
        LangConstants.TextType.F0025,
        operatorName,
        index,
        typeof expectedType == "number"
            ? LangUtils.getExpressionParserResultTypeName(expectedType)
            : expectedType.map(v => LangUtils.getExpressionParserResultTypeName(v)).join(" / "),
        LangUtils.getExpressionParserResultTypeName(actualType)
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
