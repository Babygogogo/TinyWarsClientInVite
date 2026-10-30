import {
    WarEvents_Actions_Constants_SetUnitMovePathVisibility,
    Lang_Utils,
    Numbers_Utils,
    AuxiliaryTypes_GridIndex,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Results_NumArray,
    ExpressionParsers_Parser,
    ExpressionParsers_Contexts_Position,
    ExpressionParsers_Results_Position,
    Lang_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaSetUnitMovePathVisibility } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitMovePathVisibility.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitMovePathVisibility>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getConPositionFilter(),
            expressionInfo          : WarEvents_Actions_Constants_SetUnitMovePathVisibility.ExpressionInfoDict.ConPositionFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActVisibilityArray(),
            expressionInfo          : WarEvents_Actions_Constants_SetUnitMovePathVisibility.ExpressionInfoDict.ActVisibilityArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitMovePathVisibility>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0207, data.getConPositionFilter() ?? Lang_Constants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitMovePathVisibility>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActVisibilityArray() ? `${WarEvents_Actions_Constants_SetUnitMovePathVisibility.ExpressionInfoDict.ActVisibilityArray.getTitleText()}: ${data.getActVisibilityArray()}` : null,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0207, data.getConPositionFilter() ?? Lang_Constants.UndefinedError)}\n${additionalText}`;
}

export function getErrorTip(data: WeaSetUnitMovePathVisibility, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_SetUnitMovePathVisibility.ExpressionInfoDict.ConPositionFilter;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getConPositionFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetUnitMovePathVisibility.ExpressionInfoDict.ActVisibilityArray;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActVisibilityArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForPosition(action: WeaSetUnitMovePathVisibility, war: BaseWar_Interface_IBwWar.IBwWar, x: number, y: number): boolean {
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(action.getConPositionFilter() ?? ``)
            .eval(new ExpressionParsers_Contexts_Position.Position(new ExpressionParsers_Results_Position.Position(war, x, y)), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
    } catch {
        return false;
    }
}

function evalActVisibilityArray(action: WeaSetUnitMovePathVisibility, war: BaseWar_Interface_IBwWar.IBwWar, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number[] {
    const defaultValue  = war.getFogMap().getRawVisibilityFromPathsForAllPlayers(gridIndex);
    const act           = action.getActVisibilityArray();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act)
            .eval(new ExpressionParsers_Contexts_Position.Position(new ExpressionParsers_Results_Position.Position(war, gridIndex.getX(), gridIndex.getY())), false);
        if (epResult instanceof ExpressionParsers_Results_NumArray.NumArray) {
            return epResult.numberArray.map(v => Numbers_Utils.getValueInInt32(v));
        } else {
            return defaultValue;
        }
    } catch {
        return defaultValue;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function applyWithExtraData(_action: WeaSetUnitMovePathVisibility): void {
    // nothing to do
}
export function applyWithoutExtraData(action: WeaSetUnitMovePathVisibility, war: BaseWar_Interface_IBwWar.IBwWar): void {
    const fogMap            = war.getFogMap();
    const { width, height } = fogMap.getMapSize().getWH();
    const newVisibilityDict = new Map<AuxiliaryTypes_GridIndex.GridIndex, number[]>();
    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
            if (!checkIsMeetConditionForPosition(action, war, x, y)) {
                continue;
            }

            const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(x, y);
            newVisibilityDict.set(gridIndex, evalActVisibilityArray(action, war, gridIndex));
        }
    }

    for (const [gridIndex, visibilityArray] of newVisibilityDict) {
        fogMap.updateRawVisibilityFromPathsForAllPlayers(gridIndex, visibilityArray);
    }
}
