import type * as ExpressionParsersEnums from "./Enums.ts";
import type * as ExpressionParsersFunctionInfo from "./FunctionInfo.ts";
import type * as LangConstants from "../lang/Constants.ts";

export interface EpExpressionInfo {
    contextType     : ExpressionParsersEnums.ContextType;
    resultTypes     : ExpressionParsersEnums.ResultType[];
    isRequired      : boolean;
    getTitleText    : () => string;
    getHelpText     : () => string;
}

export interface EpVariableInfo {
    desc            : LangConstants.TextType;
    resultType      : ExpressionParsersEnums.ResultType;
    isExtension     : boolean;
    isHidden?       : boolean;
}

export type EpFunctionInfoDict = Map<string, ExpressionParsersFunctionInfo.FunctionInfo>;

export type EpVariableInfoDict = Map<string, EpVariableInfo>;

// const IdentifierArray = [
//     // 不能重复；有新增时必须在最后面插入
//     "abs",
//     "floor",
//     "ceil",
//     "min",
//     "max",
//     "isAmong",
//     "selfId",
//     "id",
//     "selfValue",
//     "value",
//     "war",
//     "enabled",
//     "playerIndex",
//     "teamIndex",
//     "fund",
//     "aliveState",
//     "skipTurn",
//     "coActiveSkill",
//     "coDiedInTurn",
//     "coCategory",
//     "coPowerTimes",
//     "coEnergy",
//     "x",
//     "y",
//     "type",
//     "highlighted",
//     "hasUnit",
//     "unit",
//     "player",
//     "hp",
//     "capturePoint",
//     "buildPoint",
//     "inLocation",
//     "distanceToGrid",
//     "distanceToLocation",
//     "index",
//     "phase",
//     "loader",
//     "loaderId",
//     "actionState",
//     "coOnboard",
//     "capturing",
//     "building",
//     "dived",
//     "aiMode",
//     "tile",
//     "exist",
//     "promotion",
//     "cost",
//     "primaryAmmo",
//     "flareAmmo",
//     "buildMaterial",
//     "produceMaterial",
//     "loadedUnitsCount",
//     "hasTag",
//     "hasProhibitedLocation",
//     "turn",
//     "weather",
//     "fog",
//     "random",
//     "customCounter",
//     "expiringPlayerIndex",
//     "expiringTurnIndex",
//     "allUnits",
//     "allTiles",
//     "allPlayers",
//     "length",
//     "get",
//     "where",
//     "select",
//     "array",
//     "mean",
//     "sum",
//     "all",
//     "any",
//     "income",
//     "allUnitStatistics",
//     "unitType",
//     "unitGain",
//     "unitLoss",
//     "unitRemain",
//     "hpGain",
//     "hpLoss",
//     "hpRemain",
//     "merge",
// ];
// const IdentifierCodes = generateIdentifierCodes();
// const IdentifierNames = generateIdentifierNames();

// export function getIdentifierCode(identifierName: string): number | null {
//     return IdentifierCodes.get(identifierName) ?? null;
// }
// export function getIdentifierName(identifierCode: number): string | null {
//     return IdentifierNames.get(identifierCode) ?? null;
// }

// function generateIdentifierCodes(): Map<string, number> {
//     const dict  = new Map<string, number>();
//     for (let i = 0; i < IdentifierArray.length; ++i) {
//         const name = IdentifierArray[i];
//         if (dict.has(name)) {
//             throw Helpers.newError(`Duplicated identifier name: ${name}`);
//         }

//         dict.set(IdentifierArray[i], i + 1);
//     }
//     return dict;
// }
// function generateIdentifierNames(): Map<number, string> {
//     const dict = new Map<number, string>();
//     for (let i = 0; i < IdentifierArray.length; ++i) {
//         dict.set(i + 1, IdentifierArray[i]);
//     }
//     return dict;
// }
