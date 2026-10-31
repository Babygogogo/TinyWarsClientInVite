import {
    WarEvents_Actions_Constants_DeleteTileBuffExpr,
    Lang_Utils,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Parser,
    Lang_Constants,
    ExpressionParsers_Contexts_Tile,
    ExpressionParsers_Contexts_TileBuff,
    type BaseWar_Interface_IBwWar,
    type Tiles_Tile,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { TileBuff as ProtoTileBuff } from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type { WeaDeleteTileBuffExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaDeleteTileBuffExpr.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaDeleteTileBuffExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getConTileFilter(),
            expressionInfo       : WarEvents_Actions_Constants_DeleteTileBuffExpr.ExpressionInfoDict.ConTileFilter,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getConTileBuffFilter(),
            expressionInfo       : WarEvents_Actions_Constants_DeleteTileBuffExpr.ExpressionInfoDict.ConTileBuffFilter,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaDeleteTileBuffExpr>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0079, data.getConTileFilter() ?? Lang_Constants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaDeleteTileBuffExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        `${WarEvents_Actions_Constants_DeleteTileBuffExpr.ExpressionInfoDict.ConTileBuffFilter.getTitleText()}: ${data.getConTileBuffFilter()}`,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0079, data.getConTileFilter() ?? Lang_Constants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaDeleteTileBuffExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_DeleteTileBuffExpr.ExpressionInfoDict.ConTileFilter;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getConTileFilter(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_DeleteTileBuffExpr.ExpressionInfoDict.ConTileBuffFilter;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getConTileBuffFilter(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function evalConTileFilter(action: WeaDeleteTileBuffExpr, tile: Tiles_Tile.Tile): boolean {
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalConTileBuffFilter(action: WeaDeleteTileBuffExpr, tile: Tiles_Tile.Tile, buff: ProtoTileBuff): boolean {
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(action.getConTileBuffFilter() ?? ``).eval(new ExpressionParsers_Contexts_TileBuff.TileBuff(buff, tile), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(action: WeaDeleteTileBuffExpr, war: BaseWar_Interface_IBwWar.IBwWar, isFast: boolean): Promise<void> {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithoutExtraData(action: WeaDeleteTileBuffExpr, war: BaseWar_Interface_IBwWar.IBwWar, isFast: boolean): Promise<void> {
    const newTileDataDict = new Map<Tiles_Tile.Tile, ProtoTileBuff[]>();
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
