import {
    TileBuffs_Utils_Common,
    WarEvents_Actions_Constants_ModifyTileBuffExpr,
    Lang_Utils,
    Numbers_Utils,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Results_NumArray,
    ExpressionParsers_Parser,
    Lang_Constants,
    ExpressionParsers_Contexts_Tile,
    ExpressionParsers_Contexts_TileBuff,
    type BaseWar_Interface_IBwWar,
    type Tiles_Tile,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { TileBuff as ProtoTileBuff } from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type { WeaModifyTileBuffExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaModifyTileBuffExpr.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaModifyTileBuffExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getConTileFilter(),
            expressionInfo       : WarEvents_Actions_Constants_ModifyTileBuffExpr.ExpressionInfoDict.ConTileFilter,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getConBuffFilter(),
            expressionInfo       : WarEvents_Actions_Constants_ModifyTileBuffExpr.ExpressionInfoDict.ConBuffFilter,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActBuffType(),
            expressionInfo       : WarEvents_Actions_Constants_ModifyTileBuffExpr.ExpressionInfoDict.ActBuffType,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActExpiringTurnIndex(),
            expressionInfo       : WarEvents_Actions_Constants_ModifyTileBuffExpr.ExpressionInfoDict.ActExpiringTurnIndex,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActExpiringPlayerIndex(),
            expressionInfo       : WarEvents_Actions_Constants_ModifyTileBuffExpr.ExpressionInfoDict.ActExpiringPlayerIndex,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActExtraParams(),
            expressionInfo       : WarEvents_Actions_Constants_ModifyTileBuffExpr.ExpressionInfoDict.ActExtraParams,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaModifyTileBuffExpr>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0081, data.getConTileFilter() ?? Lang_Constants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaModifyTileBuffExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        `${Lang_Utils.getText(Lang_Constants.TextType.AbnormalStates)}: ${data.getConBuffFilter()}`,
        data.getActBuffType()            ? `${WarEvents_Actions_Constants_ModifyTileBuffExpr.ExpressionInfoDict.ActBuffType.getTitleText()}: ${data.getActBuffType()}`                       : null,
        data.getActExpiringTurnIndex()   ? `${WarEvents_Actions_Constants_ModifyTileBuffExpr.ExpressionInfoDict.ActExpiringTurnIndex.getTitleText()}: ${data.getActExpiringTurnIndex()}`     : null,
        data.getActExpiringPlayerIndex() ? `${WarEvents_Actions_Constants_ModifyTileBuffExpr.ExpressionInfoDict.ActExpiringPlayerIndex.getTitleText()}: ${data.getActExpiringPlayerIndex()}` : null,
        data.getActExtraParams()         ? `${WarEvents_Actions_Constants_ModifyTileBuffExpr.ExpressionInfoDict.ActExtraParams.getTitleText()}: ${data.getActExtraParams()}`                 : null,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0081, data.getConTileFilter() ?? Lang_Constants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaModifyTileBuffExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_ModifyTileBuffExpr.ExpressionInfoDict.ConTileFilter;
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
        const info      = WarEvents_Actions_Constants_ModifyTileBuffExpr.ExpressionInfoDict.ConBuffFilter;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getConBuffFilter(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_ModifyTileBuffExpr.ExpressionInfoDict.ActBuffType;
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
        const info      = WarEvents_Actions_Constants_ModifyTileBuffExpr.ExpressionInfoDict.ActExpiringTurnIndex;
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
        const info      = WarEvents_Actions_Constants_ModifyTileBuffExpr.ExpressionInfoDict.ActExpiringPlayerIndex;
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
        const info      = WarEvents_Actions_Constants_ModifyTileBuffExpr.ExpressionInfoDict.ActExtraParams;
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

function evalConTileFilter(action: WeaModifyTileBuffExpr, tile: Tiles_Tile.Tile): boolean {
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalConBuffFilter(action: WeaModifyTileBuffExpr, tile: Tiles_Tile.Tile, oldBuff: ProtoTileBuff): boolean {
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(action.getConBuffFilter() ?? ``).eval(new ExpressionParsers_Contexts_TileBuff.TileBuff(oldBuff, tile), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActBuffType(action: WeaModifyTileBuffExpr, tile: Tiles_Tile.Tile, oldBuff: ProtoTileBuff): number {
    const defaultValue  = oldBuff.getBuffTypeId();
    const act           = action.getActBuffType();
    if (!act) {
        return defaultValue;
    }

    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_TileBuff.TileBuff(oldBuff, tile), false);
        return result instanceof ExpressionParsers_Results_Num.Num
            ? Numbers_Utils.getValueInInt32(result.num)
            : defaultValue;
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActExpiringTurnIndex(action: WeaModifyTileBuffExpr, tile: Tiles_Tile.Tile, oldBuff: ProtoTileBuff): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
    const defaultValue  = oldBuff.getExpiringTurnIndex();
    const act           = action.getActExpiringTurnIndex();
    if (!act) {
        return defaultValue;
    }

    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_TileBuff.TileBuff(oldBuff, tile), false);
        if (result instanceof ExpressionParsers_Results_Num.Num) {
            const newValue = Numbers_Utils.getValueInInt32(result.num);
            return newValue >= 0 ? newValue : null;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActExpiringPlayerIndex(action: WeaModifyTileBuffExpr, tile: Tiles_Tile.Tile, oldBuff: ProtoTileBuff): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
    const defaultValue  = oldBuff.getExpiringPlayerIndex();
    const act           = action.getActExpiringPlayerIndex();
    if (!act) {
        return defaultValue;
    }

    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_TileBuff.TileBuff(oldBuff, tile), false);
        if (result instanceof ExpressionParsers_Results_Num.Num) {
            const newValue = Numbers_Utils.getValueInInt32(result.num);
            return newValue >= 0 ? newValue : null;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActExtraParams(action: WeaModifyTileBuffExpr, tile: Tiles_Tile.Tile, oldBuff: ProtoTileBuff): number[] {
    const defaultValue  = oldBuff.getExtraParamArray();
    const act           = action.getActExtraParams();
    if (!act) {
        return defaultValue;
    }

    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_TileBuff.TileBuff(oldBuff, tile), false);
        return result instanceof ExpressionParsers_Results_NumArray.NumArray
            ? result.numberArray.map(v => Numbers_Utils.getValueInInt32(v))
            : defaultValue;
    } catch (Exception) {
        return defaultValue;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(action: WeaModifyTileBuffExpr, war: BaseWar_Interface_IBwWar.IBwWar, isFast: boolean): Promise<void> {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithoutExtraData(action: WeaModifyTileBuffExpr, war: BaseWar_Interface_IBwWar.IBwWar, isFast: boolean): Promise<void> {
    const newBuffArrayDict = new Map<Tiles_Tile.Tile, ProtoTileBuff[]>();
    for (const tile of war.getTileMap().getAllTiles()) {
        if (!evalConTileFilter(action, tile)) {
            continue;
        }

        const oldBuffArray = tile.getUnfixedBuffList();
        if ((oldBuffArray == null) || (!oldBuffArray.length)) {
            continue;
        }

        const newBuffArray  : ProtoTileBuff[] = [];
        let isModified      = false;
        for (const oldBuff of oldBuffArray) {
            if (!evalConBuffFilter(action, tile, oldBuff)) {
                newBuffArray.push(oldBuff);
                continue;
            }

            const modifiedBuff = createModifiedBuff(action, tile, oldBuff);
            if (modifiedBuff == null) {
                newBuffArray.push(oldBuff);
            } else {
                isModified = true;
                newBuffArray.push(modifiedBuff);
            }
        }

        if (isModified) {
            newBuffArrayDict.set(tile, newBuffArray);
        }
    }

    for (const [tile, buffArray] of newBuffArrayDict) {
        tile.setUnfixedBuffList(buffArray);

        // if (!isFast) {
        //     tile.flushDataToView();
        // }
    }
}
function createModifiedBuff(action: WeaModifyTileBuffExpr, tile: Tiles_Tile.Tile, oldBuff: ProtoTileBuff): ProtoTileBuff | null {
    const newBuffType               = evalActBuffType(action, tile, oldBuff);
    const rawNewExpiringTurnIndex   = evalActExpiringTurnIndex(action, tile, oldBuff);
    const rawNewExpiringPlayerIndex = evalActExpiringPlayerIndex(action, tile, oldBuff);
    const newExtraParams            = evalActExtraParams(action, tile, oldBuff);
    const newExpiringTurnIndex      = rawNewExpiringPlayerIndex == null ? null : rawNewExpiringTurnIndex;
    const newExpiringPlayerIndex    = rawNewExpiringTurnIndex == null ? null : rawNewExpiringPlayerIndex;
    const newBuff                   = TileBuffs_Utils_Common.create({
        buffTypeId          : newBuffType,
        expiringTurnIndex   : newExpiringTurnIndex,
        expiringPlayerIndex : newExpiringPlayerIndex,
        extraParams         : newExtraParams,
    });
    return (TileBuffs_Utils_Common.checkIsValid(newBuff)) && (!TileBuffs_Utils_Common.checkIsSame(newBuff, oldBuff)) ? newBuff : null;
}
