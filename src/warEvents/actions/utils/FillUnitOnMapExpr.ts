import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import { GridIndexAndWeight } from "../../../auxiliaryTypes/GridIndexAndWeight.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { Tile } from "../../../expressionParsers/contexts/Tile.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { NumArray } from "../../../expressionParsers/results/NumArray.ts";
import { getUnitClass } from "../../../gameHelpers/GhFactory.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { encodeTeamIndex } from "../../../helpers/Team.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import { MinId, MaxId } from "../../../locations/Constants.ts";
import { encode } from "../../../locations/Utils.ts";
import { getValueInRange, getValueInInt32 } from "../../../numbers/Utils.ts";
import { PlayerIndex } from "../../../players/Constants.ts";
import type { WeaFillUnitOnMapExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaFillUnitOnMapExpr.ts";
import type { SerialUnit } from "../../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type { ITile as TilesITile } from "../../../tiles/ITile.ts";
import { ActionStateId, AiModeId, TagId } from "../../../units/Constants.ts";
import type { IUnit } from "../../../units/IUnit.ts";
import { checkIsValidActionStateId, checkIsValidAiModeId, getEncodedTagId } from "../../../units/utils/Common.ts";
import { create } from "../../../units/utils/Serialization.ts";
import { getObserverTeamIndexListForUnitOnMap } from "../../../visibilities/Utils.ts";
import { ExpressionInfoDict } from "../constants/FillUnitOnMapExpr.ts";

type ITile                  = TilesITile;

export function checkIsValid(action: Undefinable<WeaFillUnitOnMapExpr>, customCounterNameSet: Set<string>): boolean {
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
            str                     : action.getActUnitType(),
            expressionInfo          : ExpressionInfoDict.ActUnitType,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActPlayerIndex(),
            expressionInfo          : ExpressionInfoDict.ActPlayerIndex,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActActionState(),
            expressionInfo          : ExpressionInfoDict.ActActionState,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCurrentHp(),
            expressionInfo          : ExpressionInfoDict.ActCurrentHp,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActPrimaryWeaponCurrentAmmo(),
            expressionInfo          : ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActFlareCurrentAmmo(),
            expressionInfo          : ExpressionInfoDict.ActFlareCurrentAmmo,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCurrentFuel(),
            expressionInfo          : ExpressionInfoDict.ActCurrentFuel,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActIsCapturingTile(),
            expressionInfo          : ExpressionInfoDict.ActIsCapturingTile,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActIsDiving(),
            expressionInfo          : ExpressionInfoDict.ActIsDiving,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCurrentBuildMaterial(),
            expressionInfo          : ExpressionInfoDict.ActCurrentBuildMaterial,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCurrentProduceMaterial(),
            expressionInfo          : ExpressionInfoDict.ActCurrentProduceMaterial,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCurrentPromotion(),
            expressionInfo          : ExpressionInfoDict.ActCurrentPromotion,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActIsBuildingTile(),
            expressionInfo          : ExpressionInfoDict.ActIsBuildingTile,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActIsCoOnboard(),
            expressionInfo          : ExpressionInfoDict.ActIsCoOnboard,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActAiMode(),
            expressionInfo          : ExpressionInfoDict.ActAiMode,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActGroupedTagId(),
            expressionInfo          : ExpressionInfoDict.ActGroupedTagId,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActForbiddenGroupedLocationIdArray(),
            expressionInfo          : ExpressionInfoDict.ActForbiddenGroupedLocationIdArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActAiWeightedDestination(),
            expressionInfo          : ExpressionInfoDict.ActAiWeightedDestination,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaFillUnitOnMapExpr>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0048, data.getConTileFilter() ?? UndefinedError);
}
export function getDetailDesc(data: Undefinable<WeaFillUnitOnMapExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActUnitType()                        ? `${ExpressionInfoDict.ActUnitType.getTitleText()}: ${data.getActUnitType()}`                                               : null,
        data.getActPlayerIndex()                     ? `${ExpressionInfoDict.ActPlayerIndex.getTitleText()}: ${data.getActPlayerIndex()}`                                         : null,
        data.getActActionState()                     ? `${ExpressionInfoDict.ActActionState.getTitleText()}: ${data.getActActionState()}`                                         : null,
        data.getActIsCoOnboard()                     ? `${ExpressionInfoDict.ActIsCoOnboard.getTitleText()}: ${data.getActIsCoOnboard()}`                                         : null,
        data.getActCurrentPromotion()                ? `${ExpressionInfoDict.ActCurrentPromotion.getTitleText()}: ${data.getActCurrentPromotion()}`                               : null,
        data.getActCurrentHp()                       ? `${ExpressionInfoDict.ActCurrentHp.getTitleText()}: ${data.getActCurrentHp()}`                                             : null,
        data.getActPrimaryWeaponCurrentAmmo()        ? `${ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo.getTitleText()}: ${data.getActPrimaryWeaponCurrentAmmo()}`               : null,
        data.getActFlareCurrentAmmo()                ? `${ExpressionInfoDict.ActFlareCurrentAmmo.getTitleText()}: ${data.getActFlareCurrentAmmo()}`                               : null,
        data.getActCurrentFuel()                     ? `${ExpressionInfoDict.ActCurrentFuel.getTitleText()}: ${data.getActCurrentFuel()}`                                         : null,
        data.getActCurrentBuildMaterial()            ? `${ExpressionInfoDict.ActCurrentBuildMaterial.getTitleText()}: ${data.getActCurrentBuildMaterial()}`                       : null,
        data.getActCurrentProduceMaterial()          ? `${ExpressionInfoDict.ActCurrentProduceMaterial.getTitleText()}: ${data.getActCurrentProduceMaterial()}`                   : null,
        data.getActIsDiving()                        ? `${ExpressionInfoDict.ActIsDiving.getTitleText()}: ${data.getActIsDiving()}`                                               : null,
        data.getActIsBuildingTile()                  ? `${ExpressionInfoDict.ActIsBuildingTile.getTitleText()}: ${data.getActIsBuildingTile()}`                                   : null,
        data.getActIsCapturingTile()                 ? `${ExpressionInfoDict.ActIsCapturingTile.getTitleText()}: ${data.getActIsCapturingTile()}`                                 : null,
        data.getActGroupedTagId()                    ? `${ExpressionInfoDict.ActGroupedTagId.getTitleText()}: ${data.getActGroupedTagId()}`                                       : null,
        data.getActForbiddenGroupedLocationIdArray() ? `${ExpressionInfoDict.ActForbiddenGroupedLocationIdArray.getTitleText()}: ${data.getActForbiddenGroupedLocationIdArray()}` : null,
        data.getActAiMode()                          ? `${ExpressionInfoDict.ActAiMode.getTitleText()}: ${data.getActAiMode()}`                                                   : null,
        data.getActAiWeightedDestination()           ? `${ExpressionInfoDict.ActAiWeightedDestination.getTitleText()}: ${data.getActAiWeightedDestination()}`                     : null,
    ].filter(v => v != null).join(`\n`);

    return `${getFormattedText(TextType.F0048, data.getConTileFilter() ?? UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaFillUnitOnMapExpr, customCounterNameSet: Set<string>): string | null {
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
        const info      = ExpressionInfoDict.ActUnitType;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActUnitType(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActPlayerIndex;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActPlayerIndex(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActActionState;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActActionState(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCurrentHp;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCurrentHp(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActPrimaryWeaponCurrentAmmo(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActFlareCurrentAmmo;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActFlareCurrentAmmo(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCurrentFuel;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCurrentFuel(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActIsCapturingTile;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActIsCapturingTile(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActIsDiving;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActIsDiving(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCurrentBuildMaterial;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCurrentBuildMaterial(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCurrentProduceMaterial;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCurrentProduceMaterial(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCurrentPromotion;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCurrentPromotion(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActIsBuildingTile;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActIsBuildingTile(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActIsCoOnboard;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActIsCoOnboard(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActAiMode;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActAiMode(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActGroupedTagId;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActGroupedTagId(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActForbiddenGroupedLocationIdArray;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActForbiddenGroupedLocationIdArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActAiWeightedDestination;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActAiWeightedDestination(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForTile(action: WeaFillUnitOnMapExpr, tile: ITile): boolean {
    try {
        const result = Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new Tile(tile), false);
        return (result instanceof Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActPlayerIndex(action: WeaFillUnitOnMapExpr, tile: ITile): number | null {
    const act = action.getActPlayerIndex();
    if (!act) {
        return null;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            const playerIndex = Math.floor(epResult.num);
            return (playerIndex >= PlayerIndex.First) && (playerIndex <= tile.getWar().getPlayerManager().getTotalPlayersCount(false)) ? playerIndex : null;
        } else {
            return null;
        }
    } catch (Exception) {
        return null;
    }
}
function evalActUnitType(action: WeaFillUnitOnMapExpr, tile: ITile): number | null {
    const act = action.getActUnitType();
    if (!act) {
        return null;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            const unitType = Math.floor(epResult.num);
            return (tile.getGameConfig().checkIsValidUnitType(unitType)) ? unitType : null;
        } else {
            return null;
        }
    } catch (Exception) {
        return null;
    }
}
function evalActActionState(action: WeaFillUnitOnMapExpr, tile: ITile): number {
    const defaultValue  = ActionStateId.Idle;
    const act             = action.getActActionState();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            const actionState = Math.floor(epResult.num);
            return (checkIsValidActionStateId(actionState)) ? actionState : defaultValue;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActPrimaryWeaponCurrentAmmo(action: WeaFillUnitOnMapExpr, tile: ITile, unitType: number): number {
    const defaultValue = tile.getGameConfig().getUnitTemplateCfg(unitType)?.getPrimaryWeaponMaxAmmo() ?? 0;
    if (defaultValue <= 0) {
        return defaultValue;
    }

    const act = action.getActPrimaryWeaponCurrentAmmo();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : 0,
                maxValue    : defaultValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentHp(action: WeaFillUnitOnMapExpr, tile: ITile, unitType: number): number {
    const defaultValue = getExisted(tile.getGameConfig().getUnitTemplateCfg(unitType)?.getMaxHp());
    const act = action.getActCurrentHp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : 1,
                maxValue    : defaultValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
// function evalActIsCapturingTile(action: IWeaFillUnitOnMapExpr, tile: BaseWar.IBwTile, unitType: number): boolean {
//     if (!tile.getGameConfig().getUnitTemplateCfg(unitType)?.canCaptureTile) {
//         return false;
//     }

//     const defaultValue  = false;
//     const act             = action.actIsCapturingTile;
//     if (!act) {
//         return defaultValue;
//     }

//     try {
//         const epResult = ExpressionParser.EpParser.getParseResult(act).eval(new ExpressionParser.EpContextTile(tile), false);
//         if (epResult instanceof ExpressionParser.EpResultNumber) {
//             return epResult.num !== 0;
//         } else {
//             return defaultValue;
//         }
//     } catch (Exception) {
//         return defaultValue;
//     }
// }
function evalActIsDiving(action: WeaFillUnitOnMapExpr, tile: ITile, unitType: number): boolean {
    const unitCfg = getExisted(tile.getGameConfig().getUnitTemplateCfg(unitType));
    if (unitCfg.getDiveCfg() == null) {
        return false;
    }

    const defaultValue    = !!unitCfg.getDiveCfg()?.getIsDivedByDefault();
    const act             = action.getActIsDiving();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return epResult.num !== 0;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActFlareCurrentAmmo(action: WeaFillUnitOnMapExpr, tile: ITile, unitType: number): number {
    const defaultValue = tile.getGameConfig().getUnitTemplateCfg(unitType)?.getFlareMaxAmmo() ?? 0;
    if (defaultValue <= 0) {
        return defaultValue;
    }

    const act = action.getActFlareCurrentAmmo();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : 0,
                maxValue    : defaultValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentFuel(action: WeaFillUnitOnMapExpr, tile: ITile, unitType: number): number {
    const defaultValue = getExisted(tile.getGameConfig().getUnitTemplateCfg(unitType)?.getMaxFuel());
    const act = action.getActCurrentFuel();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : 0,
                maxValue    : defaultValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentBuildMaterial(action: WeaFillUnitOnMapExpr, tile: ITile, unitType: number): number {
    const defaultValue = tile.getGameConfig().getUnitTemplateCfg(unitType)?.getMaxBuildMaterial() ?? 0;
    if (defaultValue <= 0) {
        return defaultValue;
    }

    const act = action.getActCurrentBuildMaterial();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : 0,
                maxValue    : defaultValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentProduceMaterial(action: WeaFillUnitOnMapExpr, tile: ITile, unitType: number): number {
    const defaultValue = tile.getGameConfig().getUnitTemplateCfg(unitType)?.getMaxProduceMaterial() ?? 0;
    if (defaultValue <= 0) {
        return defaultValue;
    }

    const act = action.getActCurrentProduceMaterial();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : 0,
                maxValue    : defaultValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentPromotion(action: WeaFillUnitOnMapExpr, tile: ITile): number {
    const defaultValue    = tile.getGameConfig().getUnitMaxPromotion();
    const act             = action.getActCurrentPromotion();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : 0,
                maxValue    : defaultValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
// function evalActIsBuildingTile(action: IWeaFillUnitOnMapExpr, tile: BaseWar.IBwTile, unitType: number): boolean {
//     const maxBuildMaterial = tile.getGameConfig().getUnitTemplateCfg(unitType)?.maxBuildMaterial;
//     if ((maxBuildMaterial == null) || (maxBuildMaterial <= 0)) {
//         return false;
//     }

//     const defaultValue  = false;
//     const act             = action.actIsBuildingTile;
//     if (!act) {
//         return defaultValue;
//     }

//     try {
//         const epResult = ExpressionParser.EpParser.getParseResult(act).eval(new ExpressionParser.EpContextTile(tile), false);
//         if (epResult instanceof ExpressionParser.EpResultNumber) {
//             return epResult.num !== 0;
//         } else {
//             return defaultValue;
//         }
//     } catch (Exception) {
//         return defaultValue;
//     }
// }
function evalActIsCoOnboard(action: WeaFillUnitOnMapExpr, tile: ITile): boolean {
    const defaultValue  = false;
    const act             = action.getActIsCoOnboard();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return epResult.num !== 0;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActAiMode(action: WeaFillUnitOnMapExpr, tile: ITile): number {
    const defaultValue  = AiModeId.Normal;
    const act             = action.getActAiMode();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            const aiMode = Math.floor(epResult.num);
            return (checkIsValidAiModeId(aiMode)) ? aiMode : defaultValue;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActGroupedTagId(action: WeaFillUnitOnMapExpr, tile: ITile): number {
    const defaultValue  = 0;
    const act             = action.getActGroupedTagId();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof NumArray) {
            return getEncodedTagId(epResult.numberArray.map(v => getValueInRange({
                minValue    : TagId.MinTagId,
                maxValue    : TagId.MaxTagId,
                rawValue    : Math.floor(v),
            })));
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActForbiddenGroupedLocationIdArray(action: WeaFillUnitOnMapExpr, tile: ITile): number[] {
    const act = action.getActForbiddenGroupedLocationIdArray();
    if (!act) {
        return [];
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof NumArray) {
            return encode(epResult.numberArray.map(v => getValueInRange({
                minValue    : MinId,
                maxValue    : MaxId,
                rawValue    : Math.floor(v),
            })));
        } else {
            return [];
        }
    } catch (Exception) {
        return [];
    }
}
function evalActAiWeightedDestination(action: WeaFillUnitOnMapExpr, tile: ITile): GridIndexAndWeight | null {
    const act = action.getActAiWeightedDestination();
    if (!act) {
        return null;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof NumArray) {
            if (epResult.numberArray.length !== 3) {
                return null;
            }

            const arr       = epResult.numberArray.map(v => getValueInInt32(v));
            const gridIndex = new GridIndex(arr[0], arr[1]);
            if (!gridIndex.checkIsInsideMap(tile.getWar().getTileMap().getMapSize())) {
                return null;
            }

            return new GridIndexAndWeight(gridIndex, arr[2]);
        } else {
            return null;
        }
    } catch (Exception) {
        return null;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaFillUnitOnMapExpr): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaFillUnitOnMapExpr, isFast: boolean, war: IBwWar): Promise<void> {
    const unitMap         = war.getUnitMap();
    let nextUnitId      = unitMap.getNextUnitId();
    const newUnitDataList : SerialUnit[] = [];
    for (const tile of war.getTileMap().getAllTiles()) {
        if ((unitMap.getUnitOnMap(tile.getGridIndex()) != null)                 ||
            (!checkIsMeetConditionForTile(action, tile))
        ) {
            continue;
        }

        const newUnitData = createNewUnitData(action, tile, nextUnitId);
        if (newUnitData == null) {
            continue;
        }

        newUnitDataList.push(newUnitData);
        ++nextUnitId;
    }

    unitMap.setNextUnitId(nextUnitId);
    applyNewUnitDataArray(newUnitDataList, war, isFast);
}
function createNewUnitData(action: WeaFillUnitOnMapExpr, tile: ITile, unitId: number): SerialUnit | null {
    const unitType = evalActUnitType(action, tile);
    if (unitType == null) {
        return null;
    }

    const playerIndex = evalActPlayerIndex(action, tile);
    if (playerIndex == null) {
        return null;
    }

    // 为防止随机数导致结果不稳定，此处eval系列函数的顺序一旦写下就不能更改，后续新属性只能添加在最后
    // 必须保证函数顺序前后端相同
    const actionState                       = evalActActionState(action, tile);
    const currentHp                         = evalActCurrentHp(action, tile, unitType);
    const aiMode                            = evalActAiMode(action, tile);
    const groupedTagId                      = evalActGroupedTagId(action, tile);
    const currentPromotion                  = evalActCurrentPromotion(action, tile);
    const isDiving                          = evalActIsDiving(action, tile, unitType);
    const isCoOnboard                       = evalActIsCoOnboard(action, tile);
    const currentBuildMaterial              = evalActCurrentBuildMaterial(action, tile, unitType);
    const aiWeightedDestination             = evalActAiWeightedDestination(action, tile)?.toProto();
    const forbiddenGroupedLocationIdArray   = evalActForbiddenGroupedLocationIdArray(action, tile);
    const primaryWeaponCurrentAmmo          = evalActPrimaryWeaponCurrentAmmo(action, tile, unitType);
    const flareCurrentAmmo                  = evalActFlareCurrentAmmo(action, tile, unitType);
    const currentProduceMaterial            = evalActCurrentProduceMaterial(action, tile, unitType);
    const currentFuel                       = evalActCurrentFuel(action, tile, unitType);

    return create({
        unitType                        : unitType,
        unitId                          : unitId,
        playerIndex                     : playerIndex,
        gridIndex                       : tile.getGridIndex().getXY(),

        actionState                     : actionState,
        currentHp                       : currentHp,
        aiMode                          : aiMode,
        groupedTagId                    : groupedTagId,
        customNameId                    : null,

        currentPromotion                : currentPromotion,
        isDiving                        : isDiving,
        isCoOnboard                     : isCoOnboard,
        currentBuildMaterial            : currentBuildMaterial,

        aiWeightedDestination           : aiWeightedDestination?.toJson() ?? null,
        forbiddenGroupedLocationIdArray : forbiddenGroupedLocationIdArray,
        buffArray                       : [],

        primaryWeaponCurrentAmmo        : primaryWeaponCurrentAmmo,
        flareCurrentAmmo                : flareCurrentAmmo,
        currentProduceMaterial          : currentProduceMaterial,
        currentFuel                     : currentFuel,
        loaderUnitId                    : null,
    });
}
function applyNewUnitDataArray(unitDataArray: SerialUnit[], war: IBwWar, isFast: boolean): void {
    const unitMap       = war.getUnitMap();
    const gameConfig    = war.getGcData();
    const unitArray     : IUnit[] = [];
    for (const unitData of unitDataArray) {
        const unit = new (getUnitClass())();
        unit.init(unitData, gameConfig);
        unit.startRunning(war);
        unit.startRunningView();
        unitMap.setUnitOnMap(unit);
        (!isFast) && (unit.updateView());

        unitArray.push(unit);
    }

    const warStatisticsManager = war.getWarStatisticsManager();
    for (const unit of unitArray) {
        const observerTeamIndexes = getObserverTeamIndexListForUnitOnMap({ war, gridIndex: unit.getGridIndex() });
        if (observerTeamIndexes != null) {
            warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                unitType                    : unit.getUnitType(),
                dstPlayerIndex              : unit.getPlayerIndex(),
                unitGain                    : 1,
                unitLoss                    : 0,
                normalizedHpGain            : unit.getNormalizedCurrentHp(),
                normalizedHpLoss            : 0,
                groupedObserverTeamIndexes  : encodeTeamIndex(observerTeamIndexes),
            }));
        }
    }
}
