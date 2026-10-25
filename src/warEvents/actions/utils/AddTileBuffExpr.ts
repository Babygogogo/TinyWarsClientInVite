import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { Tile } from "../../../expressionParsers/contexts/Tile.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { NumArray } from "../../../expressionParsers/results/NumArray.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText, getText } from "../../../lang/Utils.ts";
import { getValueInInt32 } from "../../../numbers/Utils.ts";
import type { TileBuff } from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type { WeaAddTileBuffExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaAddTileBuffExpr.ts";
import { create, checkIsValid as TileBuffsUtilsCommonCheckIsValid } from "../../../tileBuffs/utils/Common.ts";
import type { ITile } from "../../../tiles/ITile.ts";
import { ExpressionInfoDict } from "../constants/AddTileBuffExpr.ts";

export function checkIsValid(action: Undefinable<WeaAddTileBuffExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getConTileFilter(),
            expressionInfo          : ExpressionInfoDict.ConTileFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActBuffType(),
            expressionInfo          : ExpressionInfoDict.ActBuffType,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActExpiringTurnIndex(),
            expressionInfo          : ExpressionInfoDict.ActExpiringTurnIndex,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActExpiringPlayerIndex(),
            expressionInfo          : ExpressionInfoDict.ActExpiringPlayerIndex,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActExtraParams(),
            expressionInfo          : ExpressionInfoDict.ActExtraParams,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaAddTileBuffExpr>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0080, data.getConTileFilter() ?? UndefinedError);
}
export function getDetailDesc(data: Undefinable<WeaAddTileBuffExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        `${getText(TextType.B0805)}: ${data.getActBuffType()}`,
        data.getActExpiringTurnIndex()   ? `${ExpressionInfoDict.ActExpiringTurnIndex.getTitleText()}: ${data.getActExpiringTurnIndex()}`     : null,
        data.getActExpiringPlayerIndex() ? `${ExpressionInfoDict.ActExpiringPlayerIndex.getTitleText()}: ${data.getActExpiringPlayerIndex()}` : null,
        data.getActExtraParams()         ? `${ExpressionInfoDict.ActExtraParams.getTitleText()}: ${data.getActExtraParams()}`                 : null,
    ].filter(v => v != null).join(`\n`);

    return `${getFormattedText(TextType.F0080, data.getConTileFilter() ?? UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaAddTileBuffExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = ExpressionInfoDict.ConTileFilter;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getConTileFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActBuffType;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActBuffType(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActExpiringTurnIndex;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActExpiringTurnIndex(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActExpiringPlayerIndex;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActExpiringPlayerIndex(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActExtraParams;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActExtraParams(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function evalConTileFilter(action: WeaAddTileBuffExpr, tile: ITile): boolean {
    try {
        const result = Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new Tile(tile), false);
        return (result instanceof Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActBuffType(action: WeaAddTileBuffExpr, tile: ITile): number {
    const defaultValue = 0;
    try {
        const result = Parser.getParseResult(action.getActBuffType() ?? ``).eval(new Tile(tile), false);
        return result instanceof Num
            ? getValueInInt32(result.num)
            : defaultValue;
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActExpiringTurnIndex(action: WeaAddTileBuffExpr, tile: ITile): number {
    const defaultValue  = -1;
    const act           = action.getActExpiringTurnIndex();
    if (!act) {
        return defaultValue;
    }

    try {
        const result = Parser.getParseResult(act).eval(new Tile(tile), false);
        return result instanceof Num
            ? getValueInInt32(result.num)
            : defaultValue;
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActExpiringPlayerIndex(action: WeaAddTileBuffExpr, tile: ITile): number {
    const defaultValue  = 0;
    const act           = action.getActExpiringPlayerIndex();
    if (!act) {
        return defaultValue;
    }

    try {
        const result = Parser.getParseResult(act).eval(new Tile(tile), false);
        return result instanceof Num
            ? getValueInInt32(result.num)
            : defaultValue;
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActExtraParams(action: WeaAddTileBuffExpr, tile: ITile): number[] {
    const defaultValue  : number[]  = [];
    const act           = action.getActExtraParams();
    if (!act) {
        return defaultValue;
    }

    try {
        const result = Parser.getParseResult(act).eval(new Tile(tile), false);
        return result instanceof NumArray
            ? result.numberArray.map(v => getValueInInt32(v))
            : defaultValue;
    } catch (Exception) {
        return defaultValue;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(action: WeaAddTileBuffExpr, war: IBwWar, isFast: boolean): Promise<void> {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithoutExtraData(action: WeaAddTileBuffExpr, war: IBwWar, isFast: boolean): Promise<void> {
    const newBuffDict = new Map<ITile, TileBuff>();
    for (const tile of war.getTileMap().getAllTiles()) {
        if (!evalConTileFilter(action, tile)) {
            continue;
        }

        const newBuff = createTileBuff(action, tile);
        if (newBuff) {
            newBuffDict.set(tile, newBuff);
        }
    }

    for (const [tile, buff] of newBuffDict) {
        tile.addUnfixedBuff(buff, false);
    }
}
function createTileBuff(action: WeaAddTileBuffExpr, tile: ITile): TileBuff | null {
    const buffType      = evalActBuffType(action, tile);
    const extraParams   = evalActExtraParams(action, tile);
    const newBuff       = create({
        buffTypeId          : buffType,
        expiringTurnIndex   : null,
        expiringPlayerIndex : null,
        extraParams         : extraParams,
    });

    const expiringTurnIndex     = evalActExpiringTurnIndex(action, tile);
    const expiringPlayerIndex   = evalActExpiringPlayerIndex(action, tile);
    if ((expiringTurnIndex >= 0) && (expiringPlayerIndex >= 0)) {
        newBuff.setExpiringTurnIndex(expiringTurnIndex);
        newBuff.setExpiringPlayerIndex(expiringPlayerIndex);
    }

    return TileBuffsUtilsCommonCheckIsValid(newBuff) ? newBuff : null;
}
