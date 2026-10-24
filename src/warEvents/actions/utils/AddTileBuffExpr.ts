import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersContextsTile from "../../../expressionParsers/contexts/Tile.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as ExpressionParsersResultsNumArray from "../../../expressionParsers/results/NumArray.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NumbersUtils from "../../../numbers/Utils.ts";
import type * as ProtoSchemaCommonProtoStructureTileBuff from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaAddTileBuffExpr from "../../../proto/schema/CommonProto/WarEvent/WeaAddTileBuffExpr.ts";
import * as TileBuffsUtilsCommon from "../../../tileBuffs/utils/Common.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as WarEventsActionsConstantsAddTileBuffExpr from "../constants/AddTileBuffExpr.ts";

type TileBuff           = ProtoSchemaCommonProtoStructureTileBuff.TileBuff;
type WeaAddTileBuffExpr = ProtoSchemaCommonProtoWarEventWeaAddTileBuffExpr.WeaAddTileBuffExpr;
type ITile              = TilesITile.ITile;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaAddTileBuffExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getConTileFilter(),
            expressionInfo          : WarEventsActionsConstantsAddTileBuffExpr.ExpressionInfoDict.ConTileFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActBuffType(),
            expressionInfo          : WarEventsActionsConstantsAddTileBuffExpr.ExpressionInfoDict.ActBuffType,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActExpiringTurnIndex(),
            expressionInfo          : WarEventsActionsConstantsAddTileBuffExpr.ExpressionInfoDict.ActExpiringTurnIndex,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActExpiringPlayerIndex(),
            expressionInfo          : WarEventsActionsConstantsAddTileBuffExpr.ExpressionInfoDict.ActExpiringPlayerIndex,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActExtraParams(),
            expressionInfo          : WarEventsActionsConstantsAddTileBuffExpr.ExpressionInfoDict.ActExtraParams,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaAddTileBuffExpr>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0080, data.getConTileFilter() ?? LangConstants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaAddTileBuffExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        `${LangUtils.getText(LangConstants.TextType.B0805)}: ${data.getActBuffType()}`,
        data.getActExpiringTurnIndex()   ? `${WarEventsActionsConstantsAddTileBuffExpr.ExpressionInfoDict.ActExpiringTurnIndex.getTitleText()}: ${data.getActExpiringTurnIndex()}`     : null,
        data.getActExpiringPlayerIndex() ? `${WarEventsActionsConstantsAddTileBuffExpr.ExpressionInfoDict.ActExpiringPlayerIndex.getTitleText()}: ${data.getActExpiringPlayerIndex()}` : null,
        data.getActExtraParams()         ? `${WarEventsActionsConstantsAddTileBuffExpr.ExpressionInfoDict.ActExtraParams.getTitleText()}: ${data.getActExtraParams()}`                 : null,
    ].filter(v => v != null).join(`\n`);

    return `${LangUtils.getFormattedText(LangConstants.TextType.F0080, data.getConTileFilter() ?? LangConstants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaAddTileBuffExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsAddTileBuffExpr.ExpressionInfoDict.ConTileFilter;
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
        const info      = WarEventsActionsConstantsAddTileBuffExpr.ExpressionInfoDict.ActBuffType;
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
        const info      = WarEventsActionsConstantsAddTileBuffExpr.ExpressionInfoDict.ActExpiringTurnIndex;
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
        const info      = WarEventsActionsConstantsAddTileBuffExpr.ExpressionInfoDict.ActExpiringPlayerIndex;
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
        const info      = WarEventsActionsConstantsAddTileBuffExpr.ExpressionInfoDict.ActExtraParams;
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

function evalConTileFilter(action: WeaAddTileBuffExpr, tile: ITile): boolean {
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        return (result instanceof ExpressionParsersResultsNum.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActBuffType(action: WeaAddTileBuffExpr, tile: ITile): number {
    const defaultValue = 0;
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(action.getActBuffType() ?? ``).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        return result instanceof ExpressionParsersResultsNum.Num
            ? NumbersUtils.getValueInInt32(result.num)
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
        const result = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        return result instanceof ExpressionParsersResultsNum.Num
            ? NumbersUtils.getValueInInt32(result.num)
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
        const result = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        return result instanceof ExpressionParsersResultsNum.Num
            ? NumbersUtils.getValueInInt32(result.num)
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
        const result = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        return result instanceof ExpressionParsersResultsNumArray.NumArray
            ? result.numberArray.map(v => NumbersUtils.getValueInInt32(v))
            : defaultValue;
    } catch (Exception) {
        return defaultValue;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(action: WeaAddTileBuffExpr, war: BaseWarInterfaceIBwWar.IBwWar, isFast: boolean): Promise<void> {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithoutExtraData(action: WeaAddTileBuffExpr, war: BaseWarInterfaceIBwWar.IBwWar, isFast: boolean): Promise<void> {
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
    const newBuff       = TileBuffsUtilsCommon.create({
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

    return TileBuffsUtilsCommon.checkIsValid(newBuff) ? newBuff : null;
}
