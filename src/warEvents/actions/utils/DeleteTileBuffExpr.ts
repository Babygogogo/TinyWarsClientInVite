import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersContextsTile from "../../../expressionParsers/contexts/Tile.ts";
import * as ExpressionParsersContextsTileBuff from "../../../expressionParsers/contexts/TileBuff.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoStructureTileBuff from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaDeleteTileBuffExpr from "../../../proto/schema/CommonProto/WarEvent/WeaDeleteTileBuffExpr.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as WarEventsActionsConstantsDeleteTileBuffExpr from "../constants/DeleteTileBuffExpr.ts";

type TileBuff               = ProtoSchemaCommonProtoStructureTileBuff.TileBuff;
type WeaDeleteTileBuffExpr  = ProtoSchemaCommonProtoWarEventWeaDeleteTileBuffExpr.WeaDeleteTileBuffExpr;
type ITile                  = TilesITile.ITile;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaDeleteTileBuffExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getConTileFilter(),
            expressionInfo          : WarEventsActionsConstantsDeleteTileBuffExpr.ExpressionInfoDict.ConTileFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getConTileBuffFilter(),
            expressionInfo          : WarEventsActionsConstantsDeleteTileBuffExpr.ExpressionInfoDict.ConTileBuffFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaDeleteTileBuffExpr>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0079, data.getConTileFilter() ?? LangConstants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaDeleteTileBuffExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        `${WarEventsActionsConstantsDeleteTileBuffExpr.ExpressionInfoDict.ConTileBuffFilter.getTitleText()}: ${data.getConTileBuffFilter()}`,
    ].filter(v => v != null).join(`\n`);

    return `${LangUtils.getFormattedText(LangConstants.TextType.F0079, data.getConTileFilter() ?? LangConstants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaDeleteTileBuffExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsDeleteTileBuffExpr.ExpressionInfoDict.ConTileFilter;
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
        const info      = WarEventsActionsConstantsDeleteTileBuffExpr.ExpressionInfoDict.ConTileBuffFilter;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getConTileBuffFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function evalConTileFilter(action: WeaDeleteTileBuffExpr, tile: ITile): boolean {
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        return (result instanceof ExpressionParsersResultsNum.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalConTileBuffFilter(action: WeaDeleteTileBuffExpr, tile: ITile, buff: TileBuff): boolean {
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(action.getConTileBuffFilter() ?? ``).eval(new ExpressionParsersContextsTileBuff.TileBuff(buff, tile), false);
        return (result instanceof ExpressionParsersResultsNum.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(action: WeaDeleteTileBuffExpr, war: BaseWarInterfaceIBwWar.IBwWar, isFast: boolean): Promise<void> {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithoutExtraData(action: WeaDeleteTileBuffExpr, war: BaseWarInterfaceIBwWar.IBwWar, isFast: boolean): Promise<void> {
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
