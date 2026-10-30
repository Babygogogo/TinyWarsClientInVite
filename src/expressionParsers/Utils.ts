import { CustomCounter } from "./contexts/CustomCounter.ts";
import { Fog } from "./contexts/Fog.ts";
import { Num } from "./contexts/Num.ts";
import { NumArray } from "./contexts/NumArray.ts";
import { Player } from "./contexts/Player.ts";
import { PlayerArray } from "./contexts/PlayerArray.ts";
import { Position } from "./contexts/Position.ts";
import { PositionArray } from "./contexts/PositionArray.ts";
import { TaskObjective } from "./contexts/TaskObjective.ts";
import { Tile } from "./contexts/Tile.ts";
import { TileArray } from "./contexts/TileArray.ts";
import { TileBuff } from "./contexts/TileBuff.ts";
import { TileBuffArray } from "./contexts/TileBuffArray.ts";
import { Turn } from "./contexts/Turn.ts";
import { Unit } from "./contexts/Unit.ts";
import { UnitArray } from "./contexts/UnitArray.ts";
import { UnitStatistic } from "./contexts/UnitStatistic.ts";
import { UnitStatisticArray } from "./contexts/UnitStatisticArray.ts";
import { War } from "./contexts/War.ts";
import { WarOperation } from "./contexts/WarOperation.ts";
import { Weather } from "./contexts/Weather.ts";
import {
    ContextType,
    ResultType,
} from "./Enums.ts";
import { FunctionInfo } from "./FunctionInfo.ts";
import type {
    EpFunctionInfoDict,
    EpVariableInfoDict,
    EpVariableInfo,
} from "./Types.ts";
import { newError } from "../helpers/Misc.ts";
import { TextType } from "../lang/Constants.ts";
import {
    getFormattedText,
    getExpressionParserResultTypeName,
} from "../lang/Utils.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";

export function getFunctionInfoDict(contextType: ContextType): EpFunctionInfoDict {
    switch (contextType) {
        case ContextType.War                  : return War.Functions;
        case ContextType.CustomCounter        : return CustomCounter.Functions;
        case ContextType.Number               : return Num.Functions;
        case ContextType.NumberArray          : return NumArray.Functions;
        case ContextType.Tile                 : return Tile.Functions;
        case ContextType.TileArray            : return TileArray.Functions;
        case ContextType.Unit                 : return Unit.Functions;
        case ContextType.UnitArray            : return UnitArray.Functions;
        case ContextType.Position             : return Position.Functions;
        case ContextType.PositionArray        : return PositionArray.Functions;
        case ContextType.Player               : return Player.Functions;
        case ContextType.PlayerArray          : return PlayerArray.Functions;
        case ContextType.Turn                 : return Turn.Functions;
        case ContextType.Weather              : return Weather.Functions;
        case ContextType.TaskObjective        : return TaskObjective.Functions;
        case ContextType.TileBuff             : return TileBuff.Functions;
        case ContextType.TileBuffArray        : return TileBuffArray.Functions;
        case ContextType.WarOperation         : return WarOperation.Functions;
        case ContextType.Fog                  : return Fog.Functions;
        case ContextType.UnitStatistic        : return UnitStatistic.Functions;
        case ContextType.UnitStatisticArray   : return UnitStatisticArray.Functions;
        case ContextType.Unknown              : throw newError(`Unknown contextType: ${contextType}`, ClientErrorCode.ExpressionParser_ContextType_GetFunctionInfoDict_00);
        default                                 : throw newError(`Invalid contextType: ${contextType}`, ClientErrorCode.ExpressionParser_ContextType_GetFunctionInfoDict_01);
    }
}

export function getVariableInfoDict(contextType: ContextType): EpVariableInfoDict {
    switch (contextType) {
        case ContextType.War                  : return War.Variables;
        case ContextType.CustomCounter        : return CustomCounter.Variables;
        case ContextType.Number               : return Num.Variables;
        case ContextType.NumberArray          : return NumArray.Variables;
        case ContextType.Tile                 : return Tile.Variables;
        case ContextType.TileArray            : return TileArray.Variables;
        case ContextType.Unit                 : return Unit.Variables;
        case ContextType.UnitArray            : return UnitArray.Variables;
        case ContextType.Position             : return Position.Variables;
        case ContextType.PositionArray        : return PositionArray.Variables;
        case ContextType.Player               : return Player.Variables;
        case ContextType.PlayerArray          : return PlayerArray.Variables;
        case ContextType.Turn                 : return Turn.Variables;
        case ContextType.Weather              : return Weather.Variables;
        case ContextType.TaskObjective        : return TaskObjective.Variables;
        case ContextType.TileBuff             : return TileBuff.Variables;
        case ContextType.TileBuffArray        : return TileBuffArray.Variables;
        case ContextType.WarOperation         : return WarOperation.Variables;
        case ContextType.Fog                  : return Fog.Variables;
        case ContextType.UnitStatistic        : return UnitStatistic.Variables;
        case ContextType.UnitStatisticArray   : return UnitStatisticArray.Variables;
        case ContextType.Unknown              : throw newError(`Unknown contextType: ${contextType}`, ClientErrorCode.ExpressionParser_ContextType_GetVariableInfoDict_00);
        default                                 : throw newError(`Invalid contextType: ${contextType}`, ClientErrorCode.ExpressionParser_ContextType_GetVariableInfoDict_01);
    }
}

export function getContextType(resultType: ResultType): ContextType | null {
    switch (resultType) {
        case ResultType.Number                : return ContextType.Number;
        case ResultType.NumberArray           : return ContextType.NumberArray;
        case ResultType.Tile                  : return ContextType.Tile;
        case ResultType.TileArray             : return ContextType.TileArray;
        case ResultType.Unit                  : return ContextType.Unit;
        case ResultType.UnitArray             : return ContextType.UnitArray;
        case ResultType.Position              : return ContextType.Position;
        case ResultType.PositionArray         : return ContextType.PositionArray;
        case ResultType.War                   : return ContextType.War;
        case ResultType.Player                : return ContextType.Player;
        case ResultType.PlayerArray           : return ContextType.PlayerArray;
        case ResultType.Turn                  : return ContextType.Turn;
        case ResultType.Weather               : return ContextType.Weather;
        case ResultType.TaskObjective         : return ContextType.TaskObjective;
        case ResultType.TileBuff              : return ContextType.TileBuff;
        case ResultType.TileBuffArray         : return ContextType.TileBuffArray;
        case ResultType.WarOperation          : return ContextType.WarOperation;
        case ResultType.Fog                   : return ContextType.Fog;
        case ResultType.UnitStatistic         : return ContextType.UnitStatistic;
        case ResultType.UnitStatisticArray    : return ContextType.UnitStatisticArray;
        case ResultType.Lambda                : return null;
        case ResultType.Unknown               : return null;
        default                                 : return null;
    }
}

export function extendFunctionInfoDict(src: EpFunctionInfoDict): EpFunctionInfoDict {
    const dict = new Map<string, FunctionInfo>();
    for (const [identifierName, info] of src) {
        dict.set(identifierName, new FunctionInfo(
            info.desc,
            info.getResultType,
            true,
        ));
    }

    return dict;
}

export function extendVariableInfoDict(src: EpVariableInfoDict): EpVariableInfoDict {
    const dict = new Map<string, EpVariableInfo>();
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
    return getFormattedText(TextType.F0013, functionName, expectedCount, actualCount);
}
export function getErrorTextForParameterType(functionName: string, index: number, expectedType: ResultType | ResultType[], actualType: ResultType): string {
    return getFormattedText(
        TextType.F0014,
        functionName,
        index,
        typeof expectedType == "number"
            ? getExpressionParserResultTypeName(expectedType)
            : expectedType.map(v => getExpressionParserResultTypeName(v)).join(" / "),
        getExpressionParserResultTypeName(actualType)
    );
}
export function getErrorTextForLambdaResultType(functionName: string, index: number, expectedTypes: ResultType[], actualType: ResultType): string {
    return getFormattedText(
        TextType.F0015,
        functionName,
        index,
        expectedTypes.map(v => getExpressionParserResultTypeName(v)).join(" / "),
        getExpressionParserResultTypeName(actualType)
    );
}
export function getErrorTextForOperandType(operatorName: string, index: number, expectedType: ResultType | ResultType[], actualType: ResultType): string {
    return getFormattedText(
        TextType.F0025,
        operatorName,
        index,
        typeof expectedType == "number"
            ? getExpressionParserResultTypeName(expectedType)
            : expectedType.map(v => getExpressionParserResultTypeName(v)).join(" / "),
        getExpressionParserResultTypeName(actualType)
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
