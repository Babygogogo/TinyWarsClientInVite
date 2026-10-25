import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { Tile } from "../../../expressionParsers/contexts/Tile.ts";
import { TileBuff } from "../../../expressionParsers/contexts/TileBuff.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { NumArray } from "../../../expressionParsers/results/NumArray.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText, getText } from "../../../lang/Utils.ts";
import { getValueInInt32 } from "../../../numbers/Utils.ts";
import type { TileBuff as ProtoSchemaCommonProtoStructureTileBuff } from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type {
    WeaModifyTileBuffExpr as ProtoSchemaCommonProtoWarEventWeaModifyTileBuffExpr,
} from "../../../proto/schema/CommonProto/WarEvent/WeaModifyTileBuffExpr.ts";
import { create, checkIsValid as TileBuffsUtilsCommonCheckIsValid, checkIsSame } from "../../../tileBuffs/utils/Common.ts";
import type { ITile as TilesITile } from "../../../tiles/ITile.ts";
import { ExpressionInfoDict } from "../constants/ModifyTileBuffExpr.ts";

type WeaModifyTileBuffExpr  = ProtoSchemaCommonProtoWarEventWeaModifyTileBuffExpr;
type ITile                  = TilesITile;

export function checkIsValid(action: Undefinable<WeaModifyTileBuffExpr>, customCounterNameSet: Set<string>): boolean {
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
            str                     : action.getConBuffFilter(),
            expressionInfo          : ExpressionInfoDict.ConBuffFilter,
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

export function getBriefDesc(data: Undefinable<WeaModifyTileBuffExpr>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0081, data.getConTileFilter() ?? UndefinedError);
}
export function getDetailDesc(data: Undefinable<WeaModifyTileBuffExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        `${getText(TextType.AbnormalStates)}: ${data.getConBuffFilter()}`,
        data.getActBuffType()            ? `${ExpressionInfoDict.ActBuffType.getTitleText()}: ${data.getActBuffType()}`                       : null,
        data.getActExpiringTurnIndex()   ? `${ExpressionInfoDict.ActExpiringTurnIndex.getTitleText()}: ${data.getActExpiringTurnIndex()}`     : null,
        data.getActExpiringPlayerIndex() ? `${ExpressionInfoDict.ActExpiringPlayerIndex.getTitleText()}: ${data.getActExpiringPlayerIndex()}` : null,
        data.getActExtraParams()         ? `${ExpressionInfoDict.ActExtraParams.getTitleText()}: ${data.getActExtraParams()}`                 : null,
    ].filter(v => v != null).join(`\n`);

    return `${getFormattedText(TextType.F0081, data.getConTileFilter() ?? UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaModifyTileBuffExpr, customCounterNameSet: Set<string>): string | null {
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
        const info      = ExpressionInfoDict.ConBuffFilter;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getConBuffFilter(),
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

function evalConTileFilter(action: WeaModifyTileBuffExpr, tile: ITile): boolean {
    try {
        const result = Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new Tile(tile), false);
        return (result instanceof Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalConBuffFilter(action: WeaModifyTileBuffExpr, tile: ITile, oldBuff: ProtoSchemaCommonProtoStructureTileBuff): boolean {
    try {
        const result = Parser.getParseResult(action.getConBuffFilter() ?? ``).eval(new TileBuff(oldBuff, tile), false);
        return (result instanceof Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActBuffType(action: WeaModifyTileBuffExpr, tile: ITile, oldBuff: ProtoSchemaCommonProtoStructureTileBuff): number {
    const defaultValue  = oldBuff.getBuffTypeId();
    const act           = action.getActBuffType();
    if (!act) {
        return defaultValue;
    }

    try {
        const result = Parser.getParseResult(act).eval(new TileBuff(oldBuff, tile), false);
        return result instanceof Num
            ? getValueInInt32(result.num)
            : defaultValue;
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActExpiringTurnIndex(action: WeaModifyTileBuffExpr, tile: ITile, oldBuff: ProtoSchemaCommonProtoStructureTileBuff): Undefinable<number> {
    const defaultValue  = oldBuff.getExpiringTurnIndex();
    const act           = action.getActExpiringTurnIndex();
    if (!act) {
        return defaultValue;
    }

    try {
        const result = Parser.getParseResult(act).eval(new TileBuff(oldBuff, tile), false);
        if (result instanceof Num) {
            const newValue = getValueInInt32(result.num);
            return newValue >= 0 ? newValue : null;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActExpiringPlayerIndex(action: WeaModifyTileBuffExpr, tile: ITile, oldBuff: ProtoSchemaCommonProtoStructureTileBuff): Undefinable<number> {
    const defaultValue  = oldBuff.getExpiringPlayerIndex();
    const act           = action.getActExpiringPlayerIndex();
    if (!act) {
        return defaultValue;
    }

    try {
        const result = Parser.getParseResult(act).eval(new TileBuff(oldBuff, tile), false);
        if (result instanceof Num) {
            const newValue = getValueInInt32(result.num);
            return newValue >= 0 ? newValue : null;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActExtraParams(action: WeaModifyTileBuffExpr, tile: ITile, oldBuff: ProtoSchemaCommonProtoStructureTileBuff): number[] {
    const defaultValue  = oldBuff.getExtraParamArray();
    const act           = action.getActExtraParams();
    if (!act) {
        return defaultValue;
    }

    try {
        const result = Parser.getParseResult(act).eval(new TileBuff(oldBuff, tile), false);
        return result instanceof NumArray
            ? result.numberArray.map(v => getValueInInt32(v))
            : defaultValue;
    } catch (Exception) {
        return defaultValue;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(action: WeaModifyTileBuffExpr, war: IBwWar, isFast: boolean): Promise<void> {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithoutExtraData(action: WeaModifyTileBuffExpr, war: IBwWar, isFast: boolean): Promise<void> {
    const newBuffArrayDict = new Map<ITile, ProtoSchemaCommonProtoStructureTileBuff[]>();
    for (const tile of war.getTileMap().getAllTiles()) {
        if (!evalConTileFilter(action, tile)) {
            continue;
        }

        const oldBuffArray = tile.getUnfixedBuffList();
        if ((oldBuffArray == null) || (!oldBuffArray.length)) {
            continue;
        }

        const newBuffArray  : ProtoSchemaCommonProtoStructureTileBuff[] = [];
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
function createModifiedBuff(action: WeaModifyTileBuffExpr, tile: ITile, oldBuff: ProtoSchemaCommonProtoStructureTileBuff): ProtoSchemaCommonProtoStructureTileBuff | null {
    const newBuffType               = evalActBuffType(action, tile, oldBuff);
    const rawNewExpiringTurnIndex   = evalActExpiringTurnIndex(action, tile, oldBuff);
    const rawNewExpiringPlayerIndex = evalActExpiringPlayerIndex(action, tile, oldBuff);
    const newExtraParams            = evalActExtraParams(action, tile, oldBuff);
    const newExpiringTurnIndex      = rawNewExpiringPlayerIndex == null ? null : rawNewExpiringTurnIndex;
    const newExpiringPlayerIndex    = rawNewExpiringTurnIndex == null ? null : rawNewExpiringPlayerIndex;
    const newBuff                   = create({
        buffTypeId          : newBuffType,
        expiringTurnIndex   : newExpiringTurnIndex,
        expiringPlayerIndex : newExpiringPlayerIndex,
        extraParams         : newExtraParams,
    });
    return (TileBuffsUtilsCommonCheckIsValid(newBuff)) && (!checkIsSame(newBuff, oldBuff)) ? newBuff : null;
}
