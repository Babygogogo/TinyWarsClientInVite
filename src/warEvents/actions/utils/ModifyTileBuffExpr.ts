import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersContextsTile from "../../../expressionParsers/contexts/Tile.ts";
import * as ExpressionParsersContextsTileBuff from "../../../expressionParsers/contexts/TileBuff.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as ExpressionParsersResultsNumArray from "../../../expressionParsers/results/NumArray.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NumbersUtils from "../../../numbers/Utils.ts";
import type * as ProtoSchemaCommonProtoStructureTileBuff from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaModifyTileBuffExpr from "../../../proto/schema/CommonProto/WarEvent/WeaModifyTileBuffExpr.ts";
import * as TileBuffsUtilsCommon from "../../../tileBuffs/utils/Common.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as WarEventsActionsConstantsModifyTileBuffExpr from "../constants/ModifyTileBuffExpr.ts";

type WeaModifyTileBuffExpr  = ProtoSchemaCommonProtoWarEventWeaModifyTileBuffExpr.WeaModifyTileBuffExpr;
type ITile                  = TilesITile.ITile;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaModifyTileBuffExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getConTileFilter(),
            expressionInfo          : WarEventsActionsConstantsModifyTileBuffExpr.ExpressionInfoDict.ConTileFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getConBuffFilter(),
            expressionInfo          : WarEventsActionsConstantsModifyTileBuffExpr.ExpressionInfoDict.ConBuffFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActBuffType(),
            expressionInfo          : WarEventsActionsConstantsModifyTileBuffExpr.ExpressionInfoDict.ActBuffType,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActExpiringTurnIndex(),
            expressionInfo          : WarEventsActionsConstantsModifyTileBuffExpr.ExpressionInfoDict.ActExpiringTurnIndex,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActExpiringPlayerIndex(),
            expressionInfo          : WarEventsActionsConstantsModifyTileBuffExpr.ExpressionInfoDict.ActExpiringPlayerIndex,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActExtraParams(),
            expressionInfo          : WarEventsActionsConstantsModifyTileBuffExpr.ExpressionInfoDict.ActExtraParams,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaModifyTileBuffExpr>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0081, data.getConTileFilter() ?? LangConstants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaModifyTileBuffExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        `${LangUtils.getText(LangConstants.TextType.AbnormalStates)}: ${data.getConBuffFilter()}`,
        data.getActBuffType()            ? `${WarEventsActionsConstantsModifyTileBuffExpr.ExpressionInfoDict.ActBuffType.getTitleText()}: ${data.getActBuffType()}`                       : null,
        data.getActExpiringTurnIndex()   ? `${WarEventsActionsConstantsModifyTileBuffExpr.ExpressionInfoDict.ActExpiringTurnIndex.getTitleText()}: ${data.getActExpiringTurnIndex()}`     : null,
        data.getActExpiringPlayerIndex() ? `${WarEventsActionsConstantsModifyTileBuffExpr.ExpressionInfoDict.ActExpiringPlayerIndex.getTitleText()}: ${data.getActExpiringPlayerIndex()}` : null,
        data.getActExtraParams()         ? `${WarEventsActionsConstantsModifyTileBuffExpr.ExpressionInfoDict.ActExtraParams.getTitleText()}: ${data.getActExtraParams()}`                 : null,
    ].filter(v => v != null).join(`\n`);

    return `${LangUtils.getFormattedText(LangConstants.TextType.F0081, data.getConTileFilter() ?? LangConstants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaModifyTileBuffExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsModifyTileBuffExpr.ExpressionInfoDict.ConTileFilter;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getConTileFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsModifyTileBuffExpr.ExpressionInfoDict.ConBuffFilter;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getConBuffFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsModifyTileBuffExpr.ExpressionInfoDict.ActBuffType;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActBuffType(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsModifyTileBuffExpr.ExpressionInfoDict.ActExpiringTurnIndex;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActExpiringTurnIndex(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsModifyTileBuffExpr.ExpressionInfoDict.ActExpiringPlayerIndex;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActExpiringPlayerIndex(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsModifyTileBuffExpr.ExpressionInfoDict.ActExtraParams;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActExtraParams(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function evalConTileFilter(action: WeaModifyTileBuffExpr, tile: ITile): boolean {
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        return (result instanceof ExpressionParsersResultsNum.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalConBuffFilter(action: WeaModifyTileBuffExpr, tile: ITile, oldBuff: ProtoSchemaCommonProtoStructureTileBuff.TileBuff): boolean {
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(action.getConBuffFilter() ?? ``).eval(new ExpressionParsersContextsTileBuff.TileBuff(oldBuff, tile), false);
        return (result instanceof ExpressionParsersResultsNum.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActBuffType(action: WeaModifyTileBuffExpr, tile: ITile, oldBuff: ProtoSchemaCommonProtoStructureTileBuff.TileBuff): number {
    const defaultValue  = oldBuff.getBuffTypeId();
    const act           = action.getActBuffType();
    if (!act) {
        return defaultValue;
    }

    try {
        const result = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTileBuff.TileBuff(oldBuff, tile), false);
        return result instanceof ExpressionParsersResultsNum.Num
            ? NumbersUtils.getValueInInt32(result.num)
            : defaultValue;
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActExpiringTurnIndex(action: WeaModifyTileBuffExpr, tile: ITile, oldBuff: ProtoSchemaCommonProtoStructureTileBuff.TileBuff): AuxiliaryTypesAuxiliaryTypes.Undefinable<number> {
    const defaultValue  = oldBuff.getExpiringTurnIndex();
    const act           = action.getActExpiringTurnIndex();
    if (!act) {
        return defaultValue;
    }

    try {
        const result = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTileBuff.TileBuff(oldBuff, tile), false);
        if (result instanceof ExpressionParsersResultsNum.Num) {
            const newValue = NumbersUtils.getValueInInt32(result.num);
            return newValue >= 0 ? newValue : null;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActExpiringPlayerIndex(action: WeaModifyTileBuffExpr, tile: ITile, oldBuff: ProtoSchemaCommonProtoStructureTileBuff.TileBuff): AuxiliaryTypesAuxiliaryTypes.Undefinable<number> {
    const defaultValue  = oldBuff.getExpiringPlayerIndex();
    const act           = action.getActExpiringPlayerIndex();
    if (!act) {
        return defaultValue;
    }

    try {
        const result = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTileBuff.TileBuff(oldBuff, tile), false);
        if (result instanceof ExpressionParsersResultsNum.Num) {
            const newValue = NumbersUtils.getValueInInt32(result.num);
            return newValue >= 0 ? newValue : null;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActExtraParams(action: WeaModifyTileBuffExpr, tile: ITile, oldBuff: ProtoSchemaCommonProtoStructureTileBuff.TileBuff): number[] {
    const defaultValue  = oldBuff.getExtraParamArray();
    const act           = action.getActExtraParams();
    if (!act) {
        return defaultValue;
    }

    try {
        const result = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTileBuff.TileBuff(oldBuff, tile), false);
        return result instanceof ExpressionParsersResultsNumArray.NumArray
            ? result.numberArray.map(v => NumbersUtils.getValueInInt32(v))
            : defaultValue;
    } catch (Exception) {
        return defaultValue;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(action: WeaModifyTileBuffExpr, war: BaseWarInterfaceIBwWar.IBwWar, isFast: boolean): Promise<void> {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithoutExtraData(action: WeaModifyTileBuffExpr, war: BaseWarInterfaceIBwWar.IBwWar, isFast: boolean): Promise<void> {
    const newBuffArrayDict = new Map<ITile, ProtoSchemaCommonProtoStructureTileBuff.TileBuff[]>();
    for (const tile of war.getTileMap().getAllTiles()) {
        if (!evalConTileFilter(action, tile)) {
            continue;
        }

        const oldBuffArray = tile.getUnfixedBuffList();
        if ((oldBuffArray == null) || (!oldBuffArray.length)) {
            continue;
        }

        const newBuffArray  : ProtoSchemaCommonProtoStructureTileBuff.TileBuff[] = [];
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
function createModifiedBuff(action: WeaModifyTileBuffExpr, tile: ITile, oldBuff: ProtoSchemaCommonProtoStructureTileBuff.TileBuff): ProtoSchemaCommonProtoStructureTileBuff.TileBuff | null {
    const newBuffType               = evalActBuffType(action, tile, oldBuff);
    const rawNewExpiringTurnIndex   = evalActExpiringTurnIndex(action, tile, oldBuff);
    const rawNewExpiringPlayerIndex = evalActExpiringPlayerIndex(action, tile, oldBuff);
    const newExtraParams            = evalActExtraParams(action, tile, oldBuff);
    const newExpiringTurnIndex      = rawNewExpiringPlayerIndex == null ? null : rawNewExpiringTurnIndex;
    const newExpiringPlayerIndex    = rawNewExpiringTurnIndex == null ? null : rawNewExpiringPlayerIndex;
    const newBuff                   = TileBuffsUtilsCommon.create({
        buffTypeId          : newBuffType,
        expiringTurnIndex   : newExpiringTurnIndex,
        expiringPlayerIndex : newExpiringPlayerIndex,
        extraParams         : newExtraParams,
    });
    return (TileBuffsUtilsCommon.checkIsValid(newBuff)) && (!TileBuffsUtilsCommon.checkIsSame(newBuff, oldBuff)) ? newBuff : null;
}
