import {
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_GridIndexAndWeight,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Results_NumArray,
    ExpressionParsers_Parser,
    ExpressionParsers_Contexts_Tile,
    Units_Unit,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
    Units_Constants,
    Units_Utils_Common,
    Units_Utils_Serialization,
    Locations_Utils,
    Helpers_Team,
    WarEvents_Actions_Constants_FillUnitOnMapExpr,
    Helpers_Misc,
    Lang_Utils,
    Visibilities_Utils,
    Numbers_Utils,
    Locations_Constants,
    Players_Constants,
    Lang_Constants,
    type Tiles_ITile,
    type Units_IUnit,
} from "../../../internal.ts";

import type { WeaFillUnitOnMapExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaFillUnitOnMapExpr.ts";
import type { SerialUnit } from "../../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaFillUnitOnMapExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getConTileFilter(),
            expressionInfo          : WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ConTileFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActUnitType(),
            expressionInfo          : WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActUnitType,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActPlayerIndex(),
            expressionInfo          : WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActPlayerIndex,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActActionState(),
            expressionInfo          : WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActActionState,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActCurrentHp(),
            expressionInfo          : WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActCurrentHp,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActPrimaryWeaponCurrentAmmo(),
            expressionInfo          : WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActFlareCurrentAmmo(),
            expressionInfo          : WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActFlareCurrentAmmo,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActCurrentFuel(),
            expressionInfo          : WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActCurrentFuel,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActIsCapturingTile(),
            expressionInfo          : WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActIsCapturingTile,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActIsDiving(),
            expressionInfo          : WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActIsDiving,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActCurrentBuildMaterial(),
            expressionInfo          : WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActCurrentBuildMaterial,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActCurrentProduceMaterial(),
            expressionInfo          : WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActCurrentProduceMaterial,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActCurrentPromotion(),
            expressionInfo          : WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActCurrentPromotion,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActIsBuildingTile(),
            expressionInfo          : WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActIsBuildingTile,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActIsCoOnboard(),
            expressionInfo          : WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActIsCoOnboard,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActAiMode(),
            expressionInfo          : WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActAiMode,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActGroupedTagId(),
            expressionInfo          : WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActGroupedTagId,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActForbiddenGroupedLocationIdArray(),
            expressionInfo          : WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActAiWeightedDestination(),
            expressionInfo          : WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActAiWeightedDestination,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaFillUnitOnMapExpr>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0048, data.getConTileFilter() ?? Lang_Constants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaFillUnitOnMapExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActUnitType()                        ? `${WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActUnitType.getTitleText()}: ${data.getActUnitType()}`                                               : null,
        data.getActPlayerIndex()                     ? `${WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActPlayerIndex.getTitleText()}: ${data.getActPlayerIndex()}`                                         : null,
        data.getActActionState()                     ? `${WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActActionState.getTitleText()}: ${data.getActActionState()}`                                         : null,
        data.getActIsCoOnboard()                     ? `${WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActIsCoOnboard.getTitleText()}: ${data.getActIsCoOnboard()}`                                         : null,
        data.getActCurrentPromotion()                ? `${WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActCurrentPromotion.getTitleText()}: ${data.getActCurrentPromotion()}`                               : null,
        data.getActCurrentHp()                       ? `${WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActCurrentHp.getTitleText()}: ${data.getActCurrentHp()}`                                             : null,
        data.getActPrimaryWeaponCurrentAmmo()        ? `${WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo.getTitleText()}: ${data.getActPrimaryWeaponCurrentAmmo()}`               : null,
        data.getActFlareCurrentAmmo()                ? `${WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActFlareCurrentAmmo.getTitleText()}: ${data.getActFlareCurrentAmmo()}`                               : null,
        data.getActCurrentFuel()                     ? `${WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActCurrentFuel.getTitleText()}: ${data.getActCurrentFuel()}`                                         : null,
        data.getActCurrentBuildMaterial()            ? `${WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActCurrentBuildMaterial.getTitleText()}: ${data.getActCurrentBuildMaterial()}`                       : null,
        data.getActCurrentProduceMaterial()          ? `${WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActCurrentProduceMaterial.getTitleText()}: ${data.getActCurrentProduceMaterial()}`                   : null,
        data.getActIsDiving()                        ? `${WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActIsDiving.getTitleText()}: ${data.getActIsDiving()}`                                               : null,
        data.getActIsBuildingTile()                  ? `${WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActIsBuildingTile.getTitleText()}: ${data.getActIsBuildingTile()}`                                   : null,
        data.getActIsCapturingTile()                 ? `${WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActIsCapturingTile.getTitleText()}: ${data.getActIsCapturingTile()}`                                 : null,
        data.getActGroupedTagId()                    ? `${WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActGroupedTagId.getTitleText()}: ${data.getActGroupedTagId()}`                                       : null,
        data.getActForbiddenGroupedLocationIdArray() ? `${WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray.getTitleText()}: ${data.getActForbiddenGroupedLocationIdArray()}` : null,
        data.getActAiMode()                          ? `${WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActAiMode.getTitleText()}: ${data.getActAiMode()}`                                                   : null,
        data.getActAiWeightedDestination()           ? `${WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActAiWeightedDestination.getTitleText()}: ${data.getActAiWeightedDestination()}`                     : null,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0048, data.getConTileFilter() ?? Lang_Constants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaFillUnitOnMapExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ConTileFilter;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getConTileFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActUnitType;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActUnitType(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActPlayerIndex;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActPlayerIndex(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActActionState;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActActionState(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActCurrentHp;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActCurrentHp(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActPrimaryWeaponCurrentAmmo(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActFlareCurrentAmmo;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActFlareCurrentAmmo(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActCurrentFuel;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActCurrentFuel(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActIsCapturingTile;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActIsCapturingTile(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActIsDiving;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActIsDiving(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActCurrentBuildMaterial;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActCurrentBuildMaterial(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActCurrentProduceMaterial;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActCurrentProduceMaterial(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActCurrentPromotion;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActCurrentPromotion(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActIsBuildingTile;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActIsBuildingTile(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActIsCoOnboard;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActIsCoOnboard(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActAiMode;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActAiMode(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActGroupedTagId;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActGroupedTagId(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActForbiddenGroupedLocationIdArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitOnMapExpr.ExpressionInfoDict.ActAiWeightedDestination;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActAiWeightedDestination(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForTile(action: WeaFillUnitOnMapExpr, tile: Tiles_ITile.ITile): boolean {
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActPlayerIndex(action: WeaFillUnitOnMapExpr, tile: Tiles_ITile.ITile): number | null {
    const act = action.getActPlayerIndex();
    if (!act) {
        return null;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const playerIndex = Math.floor(epResult.num);
            return (playerIndex >= Players_Constants.PlayerIndex.First) && (playerIndex <= tile.getWar().getPlayerManager().getTotalPlayersCount(false)) ? playerIndex : null;
        } else {
            return null;
        }
    } catch (Exception) {
        return null;
    }
}
function evalActUnitType(action: WeaFillUnitOnMapExpr, tile: Tiles_ITile.ITile): number | null {
    const act = action.getActUnitType();
    if (!act) {
        return null;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const unitType = Math.floor(epResult.num);
            return (tile.getGameConfig().checkIsValidUnitType(unitType)) ? unitType : null;
        } else {
            return null;
        }
    } catch (Exception) {
        return null;
    }
}
function evalActActionState(action: WeaFillUnitOnMapExpr, tile: Tiles_ITile.ITile): number {
    const defaultValue  = Units_Constants.ActionStateId.Idle;
    const act             = action.getActActionState();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const actionState = Math.floor(epResult.num);
            return (Units_Utils_Common.checkIsValidActionStateId(actionState)) ? actionState : defaultValue;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActPrimaryWeaponCurrentAmmo(action: WeaFillUnitOnMapExpr, tile: Tiles_ITile.ITile, unitType: number): number {
    const defaultValue = tile.getGameConfig().getUnitTemplateCfg(unitType)?.getPrimaryWeaponMaxAmmo() ?? 0;
    if (defaultValue <= 0) {
        return defaultValue;
    }

    const act = action.getActPrimaryWeaponCurrentAmmo();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
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
function evalActCurrentHp(action: WeaFillUnitOnMapExpr, tile: Tiles_ITile.ITile, unitType: number): number {
    const defaultValue = Helpers_Misc.getExisted(tile.getGameConfig().getUnitTemplateCfg(unitType)?.getMaxHp());
    const act = action.getActCurrentHp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
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
function evalActIsDiving(action: WeaFillUnitOnMapExpr, tile: Tiles_ITile.ITile, unitType: number): boolean {
    const unitCfg = Helpers_Misc.getExisted(tile.getGameConfig().getUnitTemplateCfg(unitType));
    if (unitCfg.getDiveCfg() == null) {
        return false;
    }

    const defaultValue    = !!unitCfg.getDiveCfg()?.getIsDivedByDefault();
    const act             = action.getActIsDiving();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num !== 0;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActFlareCurrentAmmo(action: WeaFillUnitOnMapExpr, tile: Tiles_ITile.ITile, unitType: number): number {
    const defaultValue = tile.getGameConfig().getUnitTemplateCfg(unitType)?.getFlareMaxAmmo() ?? 0;
    if (defaultValue <= 0) {
        return defaultValue;
    }

    const act = action.getActFlareCurrentAmmo();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
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
function evalActCurrentFuel(action: WeaFillUnitOnMapExpr, tile: Tiles_ITile.ITile, unitType: number): number {
    const defaultValue = Helpers_Misc.getExisted(tile.getGameConfig().getUnitTemplateCfg(unitType)?.getMaxFuel());
    const act = action.getActCurrentFuel();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
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
function evalActCurrentBuildMaterial(action: WeaFillUnitOnMapExpr, tile: Tiles_ITile.ITile, unitType: number): number {
    const defaultValue = tile.getGameConfig().getUnitTemplateCfg(unitType)?.getMaxBuildMaterial() ?? 0;
    if (defaultValue <= 0) {
        return defaultValue;
    }

    const act = action.getActCurrentBuildMaterial();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
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
function evalActCurrentProduceMaterial(action: WeaFillUnitOnMapExpr, tile: Tiles_ITile.ITile, unitType: number): number {
    const defaultValue = tile.getGameConfig().getUnitTemplateCfg(unitType)?.getMaxProduceMaterial() ?? 0;
    if (defaultValue <= 0) {
        return defaultValue;
    }

    const act = action.getActCurrentProduceMaterial();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
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
function evalActCurrentPromotion(action: WeaFillUnitOnMapExpr, tile: Tiles_ITile.ITile): number {
    const defaultValue    = tile.getGameConfig().getUnitMaxPromotion();
    const act             = action.getActCurrentPromotion();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
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
function evalActIsCoOnboard(action: WeaFillUnitOnMapExpr, tile: Tiles_ITile.ITile): boolean {
    const defaultValue  = false;
    const act             = action.getActIsCoOnboard();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num !== 0;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActAiMode(action: WeaFillUnitOnMapExpr, tile: Tiles_ITile.ITile): number {
    const defaultValue  = Units_Constants.AiModeId.Normal;
    const act             = action.getActAiMode();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const aiMode = Math.floor(epResult.num);
            return (Units_Utils_Common.checkIsValidAiModeId(aiMode)) ? aiMode : defaultValue;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActGroupedTagId(action: WeaFillUnitOnMapExpr, tile: Tiles_ITile.ITile): number {
    const defaultValue  = 0;
    const act             = action.getActGroupedTagId();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_NumArray.NumArray) {
            return Units_Utils_Common.getEncodedTagId(epResult.numberArray.map(v => Numbers_Utils.getValueInRange({
                minValue    : Units_Constants.TagId.MinTagId,
                maxValue    : Units_Constants.TagId.MaxTagId,
                rawValue    : Math.floor(v),
            })));
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActForbiddenGroupedLocationIdArray(action: WeaFillUnitOnMapExpr, tile: Tiles_ITile.ITile): number[] {
    const act = action.getActForbiddenGroupedLocationIdArray();
    if (!act) {
        return [];
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_NumArray.NumArray) {
            return Locations_Utils.encode(epResult.numberArray.map(v => Numbers_Utils.getValueInRange({
                minValue    : Locations_Constants.MinId,
                maxValue    : Locations_Constants.MaxId,
                rawValue    : Math.floor(v),
            })));
        } else {
            return [];
        }
    } catch (Exception) {
        return [];
    }
}
function evalActAiWeightedDestination(action: WeaFillUnitOnMapExpr, tile: Tiles_ITile.ITile): AuxiliaryTypes_GridIndexAndWeight.GridIndexAndWeight | null {
    const act = action.getActAiWeightedDestination();
    if (!act) {
        return null;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_NumArray.NumArray) {
            if (epResult.numberArray.length !== 3) {
                return null;
            }

            const arr       = epResult.numberArray.map(v => Numbers_Utils.getValueInInt32(v));
            const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(arr[0], arr[1]);
            if (!gridIndex.checkIsInsideMap(tile.getWar().getTileMap().getMapSize())) {
                return null;
            }

            return new AuxiliaryTypes_GridIndexAndWeight.GridIndexAndWeight(gridIndex, arr[2]);
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
export async function applyWithoutExtraData(action: WeaFillUnitOnMapExpr, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
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
function createNewUnitData(action: WeaFillUnitOnMapExpr, tile: Tiles_ITile.ITile, unitId: number): SerialUnit | null {
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

    return Units_Utils_Serialization.create({
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
function applyNewUnitDataArray(unitDataArray: SerialUnit[], war: BaseWar_Interface_IBwWar.IBwWar, isFast: boolean): void {
    const unitMap       = war.getUnitMap();
    const gameConfig    = war.getGcData();
    const unitArray     : Units_IUnit.IUnit[] = [];
    for (const unitData of unitDataArray) {
        const unit = new Units_Unit.Unit();
        unit.init(unitData, gameConfig);
        unit.startRunning(war);
        unit.startRunningView();
        unitMap.setUnitOnMap(unit);
        (!isFast) && (unit.updateView());

        unitArray.push(unit);
    }

    const warStatisticsManager = war.getWarStatisticsManager();
    for (const unit of unitArray) {
        const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex: unit.getGridIndex() });
        if (observerTeamIndexes != null) {
            warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                unitType                    : unit.getUnitType(),
                dstPlayerIndex              : unit.getPlayerIndex(),
                unitGain                    : 1,
                unitLoss                    : 0,
                normalizedHpGain            : unit.getNormalizedCurrentHp(),
                normalizedHpLoss            : 0,
                groupedObserverTeamIndexes  : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
            }));
        }
    }
}
