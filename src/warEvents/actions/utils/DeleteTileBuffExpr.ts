import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { Tile } from "../../../expressionParsers/contexts/Tile.ts";
import { TileBuff as ExpressionParsersContextsTileBuff } from "../../../expressionParsers/contexts/TileBuff.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import type { TileBuff } from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type { WeaDeleteTileBuffExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaDeleteTileBuffExpr.ts";
import type { ITile } from "../../../tiles/ITile.ts";
import { ExpressionInfoDict } from "../constants/DeleteTileBuffExpr.ts";

export function checkIsValid(action: Undefinable<WeaDeleteTileBuffExpr>, customCounterNameSet: Set<string>): boolean {
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
            str                     : action.getConTileBuffFilter(),
            expressionInfo          : ExpressionInfoDict.ConTileBuffFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaDeleteTileBuffExpr>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0079, data.getConTileFilter() ?? UndefinedError);
}
export function getDetailDesc(data: Undefinable<WeaDeleteTileBuffExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        `${ExpressionInfoDict.ConTileBuffFilter.getTitleText()}: ${data.getConTileBuffFilter()}`,
    ].filter(v => v != null).join(`\n`);

    return `${getFormattedText(TextType.F0079, data.getConTileFilter() ?? UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaDeleteTileBuffExpr, customCounterNameSet: Set<string>): string | null {
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
        const info      = ExpressionInfoDict.ConTileBuffFilter;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getConTileBuffFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function evalConTileFilter(action: WeaDeleteTileBuffExpr, tile: ITile): boolean {
    try {
        const result = Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new Tile(tile), false);
        return (result instanceof Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalConTileBuffFilter(action: WeaDeleteTileBuffExpr, tile: ITile, buff: TileBuff): boolean {
    try {
        const result = Parser.getParseResult(action.getConTileBuffFilter() ?? ``).eval(new ExpressionParsersContextsTileBuff(buff, tile), false);
        return (result instanceof Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(action: WeaDeleteTileBuffExpr, war: IBwWar, isFast: boolean): Promise<void> {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithoutExtraData(action: WeaDeleteTileBuffExpr, war: IBwWar, isFast: boolean): Promise<void> {
    const newTileDataDict = new Map<ITile, TileBuff[]>();
    for (const tile of war.getTileMap().getAllTiles()) {
        if (!evalConTileFilter(action, tile)) {
            continue;
        }

        const oldBuffArray = tile.getUnfixedBuffList();
        if ((oldBuffArray == null) || (!oldBuffArray.length)) {
            continue;
        }

        const newBuffArray = oldBuffArray.filter(v => !evalConTileBuffFilter(action, tile, v));
        if (newBuffArray.length !== oldBuffArray.length) {
            newTileDataDict.set(tile, newBuffArray);
        }
    }

    for (const [tile, buffArray] of newTileDataDict) {
        tile.setUnfixedBuffList(buffArray);

        // if (!isFast) {
        //     tile.flushDataToView();
        // }
    }
}
