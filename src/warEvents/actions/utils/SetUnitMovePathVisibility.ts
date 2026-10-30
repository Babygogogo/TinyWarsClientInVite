import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { Position } from "../../../expressionParsers/contexts/Position.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { NumArray } from "../../../expressionParsers/results/NumArray.ts";
import { Position as ResultsPosition } from "../../../expressionParsers/results/Position.ts";
import {
    TextType,
    UndefinedError,
} from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import { getValueInInt32 } from "../../../numbers/Utils.ts";
import type { WeaSetUnitMovePathVisibility } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitMovePathVisibility.ts";
import { ExpressionInfoDict } from "../constants/SetUnitMovePathVisibility.ts";

export function checkIsValid(action: Undefinable<WeaSetUnitMovePathVisibility>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getConPositionFilter(),
            expressionInfo          : ExpressionInfoDict.ConPositionFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActVisibilityArray(),
            expressionInfo          : ExpressionInfoDict.ActVisibilityArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaSetUnitMovePathVisibility>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0207, data.getConPositionFilter() ?? UndefinedError);
}
export function getDetailDesc(data: Undefinable<WeaSetUnitMovePathVisibility>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActVisibilityArray() ? `${ExpressionInfoDict.ActVisibilityArray.getTitleText()}: ${data.getActVisibilityArray()}` : null,
    ].filter(v => v != null).join(`\n`);

    return `${getFormattedText(TextType.F0207, data.getConPositionFilter() ?? UndefinedError)}\n${additionalText}`;
}

export function getErrorTip(data: WeaSetUnitMovePathVisibility, customCounterNameSet: Set<string>): string | null {
    {
        const info      = ExpressionInfoDict.ConPositionFilter;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getConPositionFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActVisibilityArray;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActVisibilityArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForPosition(action: WeaSetUnitMovePathVisibility, war: IBwWar, x: number, y: number): boolean {
    try {
        const result = Parser.getParseResult(action.getConPositionFilter() ?? ``)
            .eval(new Position(new ResultsPosition(war, x, y)), false);
        return (result instanceof Num) && (result.num !== 0);
    } catch {
        return false;
    }
}

function evalActVisibilityArray(action: WeaSetUnitMovePathVisibility, war: IBwWar, gridIndex: GridIndex): number[] {
    const defaultValue  = war.getFogMap().getRawVisibilityFromPathsForAllPlayers(gridIndex);
    const act           = action.getActVisibilityArray();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act)
            .eval(new Position(new ResultsPosition(war, gridIndex.getX(), gridIndex.getY())), false);
        if (epResult instanceof NumArray) {
            return epResult.numberArray.map(v => getValueInInt32(v));
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
export function applyWithoutExtraData(action: WeaSetUnitMovePathVisibility, war: IBwWar): void {
    const fogMap            = war.getFogMap();
    const { width, height } = fogMap.getMapSize().getWH();
    const newVisibilityDict = new Map<GridIndex, number[]>();
    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
            if (!checkIsMeetConditionForPosition(action, war, x, y)) {
                continue;
            }

            const gridIndex = new GridIndex(x, y);
            newVisibilityDict.set(gridIndex, evalActVisibilityArray(action, war, gridIndex));
        }
    }

    for (const [gridIndex, visibilityArray] of newVisibilityDict) {
        fogMap.updateRawVisibilityFromPathsForAllPlayers(gridIndex, visibilityArray);
    }
}
