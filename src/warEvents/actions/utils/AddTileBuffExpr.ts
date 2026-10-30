import {
    TileBuffs_Utils_Common,
    WarEvents_Actions_Constants_AddTileBuffExpr,
    Lang_Utils,
    Numbers_Utils,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Results_NumArray,
    ExpressionParsers_Parser,
    Lang_Constants,
    ExpressionParsers_Contexts_Tile,
    type BaseWar_Interface_IBwWar,
    type Tiles_ITile,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { TileBuff } from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type { WeaAddTileBuffExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaAddTileBuffExpr.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaAddTileBuffExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getConTileFilter(),
            expressionInfo       : WarEvents_Actions_Constants_AddTileBuffExpr.ExpressionInfoDict.ConTileFilter,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActBuffType(),
            expressionInfo       : WarEvents_Actions_Constants_AddTileBuffExpr.ExpressionInfoDict.ActBuffType,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActExpiringTurnIndex(),
            expressionInfo       : WarEvents_Actions_Constants_AddTileBuffExpr.ExpressionInfoDict.ActExpiringTurnIndex,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActExpiringPlayerIndex(),
            expressionInfo       : WarEvents_Actions_Constants_AddTileBuffExpr.ExpressionInfoDict.ActExpiringPlayerIndex,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActExtraParams(),
            expressionInfo       : WarEvents_Actions_Constants_AddTileBuffExpr.ExpressionInfoDict.ActExtraParams,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaAddTileBuffExpr>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0080, data.getConTileFilter() ?? Lang_Constants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaAddTileBuffExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        `${Lang_Utils.getText(Lang_Constants.TextType.B0805)}: ${data.getActBuffType()}`,
        data.getActExpiringTurnIndex()   ? `${WarEvents_Actions_Constants_AddTileBuffExpr.ExpressionInfoDict.ActExpiringTurnIndex.getTitleText()}: ${data.getActExpiringTurnIndex()}`     : null,
        data.getActExpiringPlayerIndex() ? `${WarEvents_Actions_Constants_AddTileBuffExpr.ExpressionInfoDict.ActExpiringPlayerIndex.getTitleText()}: ${data.getActExpiringPlayerIndex()}` : null,
        data.getActExtraParams()         ? `${WarEvents_Actions_Constants_AddTileBuffExpr.ExpressionInfoDict.ActExtraParams.getTitleText()}: ${data.getActExtraParams()}`                 : null,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0080, data.getConTileFilter() ?? Lang_Constants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaAddTileBuffExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_AddTileBuffExpr.ExpressionInfoDict.ConTileFilter;
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
        const info      = WarEvents_Actions_Constants_AddTileBuffExpr.ExpressionInfoDict.ActBuffType;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActBuffType(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_AddTileBuffExpr.ExpressionInfoDict.ActExpiringTurnIndex;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActExpiringTurnIndex(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_AddTileBuffExpr.ExpressionInfoDict.ActExpiringPlayerIndex;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActExpiringPlayerIndex(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_AddTileBuffExpr.ExpressionInfoDict.ActExtraParams;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActExtraParams(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function evalConTileFilter(action: WeaAddTileBuffExpr, tile: Tiles_ITile.ITile): boolean {
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActBuffType(action: WeaAddTileBuffExpr, tile: Tiles_ITile.ITile): number {
    const defaultValue = 0;
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(action.getActBuffType() ?? ``).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        return result instanceof ExpressionParsers_Results_Num.Num
            ? Numbers_Utils.getValueInInt32(result.num)
            : defaultValue;
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActExpiringTurnIndex(action: WeaAddTileBuffExpr, tile: Tiles_ITile.ITile): number {
    const defaultValue  = -1;
    const act           = action.getActExpiringTurnIndex();
    if (!act) {
        return defaultValue;
    }

    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        return result instanceof ExpressionParsers_Results_Num.Num
            ? Numbers_Utils.getValueInInt32(result.num)
            : defaultValue;
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActExpiringPlayerIndex(action: WeaAddTileBuffExpr, tile: Tiles_ITile.ITile): number {
    const defaultValue  = 0;
    const act           = action.getActExpiringPlayerIndex();
    if (!act) {
        return defaultValue;
    }

    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        return result instanceof ExpressionParsers_Results_Num.Num
            ? Numbers_Utils.getValueInInt32(result.num)
            : defaultValue;
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActExtraParams(action: WeaAddTileBuffExpr, tile: Tiles_ITile.ITile): number[] {
    const defaultValue  : number[]  = [];
    const act           = action.getActExtraParams();
    if (!act) {
        return defaultValue;
    }

    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        return result instanceof ExpressionParsers_Results_NumArray.NumArray
            ? result.numberArray.map(v => Numbers_Utils.getValueInInt32(v))
            : defaultValue;
    } catch (Exception) {
        return defaultValue;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(action: WeaAddTileBuffExpr, war: BaseWar_Interface_IBwWar.IBwWar, isFast: boolean): Promise<void> {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithoutExtraData(action: WeaAddTileBuffExpr, war: BaseWar_Interface_IBwWar.IBwWar, isFast: boolean): Promise<void> {
    const newBuffDict = new Map<Tiles_ITile.ITile, TileBuff>();
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
function createTileBuff(action: WeaAddTileBuffExpr, tile: Tiles_ITile.ITile): TileBuff | null {
    const buffType      = evalActBuffType(action, tile);
    const extraParams   = evalActExtraParams(action, tile);
    const newBuff       = TileBuffs_Utils_Common.create({
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

    return TileBuffs_Utils_Common.checkIsValid(newBuff) ? newBuff : null;
}
