import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import * as AuxiliaryTypesGridIndexAndWeight from "../../../auxiliaryTypes/GridIndexAndWeight.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersContextsTile from "../../../expressionParsers/contexts/Tile.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as ExpressionParsersResultsNumArray from "../../../expressionParsers/results/NumArray.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as HelpersTeam from "../../../helpers/Team.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as LocationsConstants from "../../../locations/Constants.ts";
import * as LocationsUtils from "../../../locations/Utils.ts";
import * as NumbersUtils from "../../../numbers/Utils.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr from "../../../proto/schema/CommonProto/WarEvent/WeaFillUnitOnMapExpr.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialUnit from "../../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import * as ProtoSchemaCommonProtoWarSerializationWsUnitStatistics from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import type * as UnitsIUnit from "../../../units/IUnit.ts";
import * as UnitsUtilsCommon from "../../../units/utils/Common.ts";
import * as UnitsUtilsSerialization from "../../../units/utils/Serialization.ts";
import * as VisibilitiesUtils from "../../../visibilities/Utils.ts";
import * as WarEventsActionsConstantsFillUnitOnMapExpr from "../constants/FillUnitOnMapExpr.ts";

type ITile                  = TilesITile.ITile;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getConTileFilter(),
            expressionInfo          : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ConTileFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActUnitType(),
            expressionInfo          : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActUnitType,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActPlayerIndex(),
            expressionInfo          : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActPlayerIndex,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActActionState(),
            expressionInfo          : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActActionState,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCurrentHp(),
            expressionInfo          : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentHp,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActPrimaryWeaponCurrentAmmo(),
            expressionInfo          : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActFlareCurrentAmmo(),
            expressionInfo          : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActFlareCurrentAmmo,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCurrentFuel(),
            expressionInfo          : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentFuel,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActIsCapturingTile(),
            expressionInfo          : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActIsCapturingTile,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActIsDiving(),
            expressionInfo          : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActIsDiving,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCurrentBuildMaterial(),
            expressionInfo          : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentBuildMaterial,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCurrentProduceMaterial(),
            expressionInfo          : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentProduceMaterial,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCurrentPromotion(),
            expressionInfo          : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentPromotion,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActIsBuildingTile(),
            expressionInfo          : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActIsBuildingTile,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActIsCoOnboard(),
            expressionInfo          : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActIsCoOnboard,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActAiMode(),
            expressionInfo          : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActAiMode,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActGroupedTagId(),
            expressionInfo          : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActGroupedTagId,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActForbiddenGroupedLocationIdArray(),
            expressionInfo          : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActAiWeightedDestination(),
            expressionInfo          : WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActAiWeightedDestination,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0048, data.getConTileFilter() ?? LangConstants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActUnitType()                        ? `${WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActUnitType.getTitleText()}: ${data.getActUnitType()}`                                               : null,
        data.getActPlayerIndex()                     ? `${WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActPlayerIndex.getTitleText()}: ${data.getActPlayerIndex()}`                                         : null,
        data.getActActionState()                     ? `${WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActActionState.getTitleText()}: ${data.getActActionState()}`                                         : null,
        data.getActIsCoOnboard()                     ? `${WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActIsCoOnboard.getTitleText()}: ${data.getActIsCoOnboard()}`                                         : null,
        data.getActCurrentPromotion()                ? `${WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentPromotion.getTitleText()}: ${data.getActCurrentPromotion()}`                               : null,
        data.getActCurrentHp()                       ? `${WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentHp.getTitleText()}: ${data.getActCurrentHp()}`                                             : null,
        data.getActPrimaryWeaponCurrentAmmo()        ? `${WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo.getTitleText()}: ${data.getActPrimaryWeaponCurrentAmmo()}`               : null,
        data.getActFlareCurrentAmmo()                ? `${WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActFlareCurrentAmmo.getTitleText()}: ${data.getActFlareCurrentAmmo()}`                               : null,
        data.getActCurrentFuel()                     ? `${WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentFuel.getTitleText()}: ${data.getActCurrentFuel()}`                                         : null,
        data.getActCurrentBuildMaterial()            ? `${WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentBuildMaterial.getTitleText()}: ${data.getActCurrentBuildMaterial()}`                       : null,
        data.getActCurrentProduceMaterial()          ? `${WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentProduceMaterial.getTitleText()}: ${data.getActCurrentProduceMaterial()}`                   : null,
        data.getActIsDiving()                        ? `${WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActIsDiving.getTitleText()}: ${data.getActIsDiving()}`                                               : null,
        data.getActIsBuildingTile()                  ? `${WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActIsBuildingTile.getTitleText()}: ${data.getActIsBuildingTile()}`                                   : null,
        data.getActIsCapturingTile()                 ? `${WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActIsCapturingTile.getTitleText()}: ${data.getActIsCapturingTile()}`                                 : null,
        data.getActGroupedTagId()                    ? `${WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActGroupedTagId.getTitleText()}: ${data.getActGroupedTagId()}`                                       : null,
        data.getActForbiddenGroupedLocationIdArray() ? `${WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray.getTitleText()}: ${data.getActForbiddenGroupedLocationIdArray()}` : null,
        data.getActAiMode()                          ? `${WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActAiMode.getTitleText()}: ${data.getActAiMode()}`                                                   : null,
        data.getActAiWeightedDestination()           ? `${WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActAiWeightedDestination.getTitleText()}: ${data.getActAiWeightedDestination()}`                     : null,
    ].filter(v => v != null).join(`\n`);

    return `${LangUtils.getFormattedText(LangConstants.TextType.F0048, data.getConTileFilter() ?? LangConstants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ConTileFilter;
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
        const info      = WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActUnitType;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActUnitType(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActPlayerIndex;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActPlayerIndex(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActActionState;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActActionState(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentHp;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCurrentHp(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActPrimaryWeaponCurrentAmmo(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActFlareCurrentAmmo;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActFlareCurrentAmmo(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentFuel;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCurrentFuel(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActIsCapturingTile;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActIsCapturingTile(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActIsDiving;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActIsDiving(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentBuildMaterial;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCurrentBuildMaterial(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentProduceMaterial;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCurrentProduceMaterial(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActCurrentPromotion;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCurrentPromotion(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActIsBuildingTile;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActIsBuildingTile(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActIsCoOnboard;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActIsCoOnboard(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActAiMode;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActAiMode(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActGroupedTagId;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActGroupedTagId(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActForbiddenGroupedLocationIdArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitOnMapExpr.ExpressionInfoDict.ActAiWeightedDestination;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActAiWeightedDestination(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForTile(action: ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr, tile: ITile): boolean {
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        return (result instanceof ExpressionParsersResultsNum.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActPlayerIndex(action: ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr, tile: ITile): number | null {
    const act = action.getActPlayerIndex();
    if (!act) {
        return null;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const playerIndex = Math.floor(epResult.num);
            return (playerIndex >= PlayersConstants.PlayerIndex.First) && (playerIndex <= tile.getWar().getPlayerManager().getTotalPlayersCount(false)) ? playerIndex : null;
        } else {
            return null;
        }
    } catch (Exception) {
        return null;
    }
}
function evalActUnitType(action: ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr, tile: ITile): number | null {
    const act = action.getActUnitType();
    if (!act) {
        return null;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const unitType = Math.floor(epResult.num);
            return (tile.getGameConfig().checkIsValidUnitType(unitType)) ? unitType : null;
        } else {
            return null;
        }
    } catch (Exception) {
        return null;
    }
}
function evalActActionState(action: ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr, tile: ITile): number {
    const defaultValue  = UnitsConstants.ActionStateId.Idle;
    const act             = action.getActActionState();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const actionState = Math.floor(epResult.num);
            return (UnitsUtilsCommon.checkIsValidActionStateId(actionState)) ? actionState : defaultValue;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActPrimaryWeaponCurrentAmmo(action: ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr, tile: ITile, unitType: number): number {
    const defaultValue = tile.getGameConfig().getUnitTemplateCfg(unitType)?.getPrimaryWeaponMaxAmmo() ?? 0;
    if (defaultValue <= 0) {
        return defaultValue;
    }

    const act = action.getActPrimaryWeaponCurrentAmmo();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
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
function evalActCurrentHp(action: ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr, tile: ITile, unitType: number): number {
    const defaultValue = HelpersMisc.getExisted(tile.getGameConfig().getUnitTemplateCfg(unitType)?.getMaxHp());
    const act = action.getActCurrentHp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
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
function evalActIsDiving(action: ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr, tile: ITile, unitType: number): boolean {
    const unitCfg = HelpersMisc.getExisted(tile.getGameConfig().getUnitTemplateCfg(unitType));
    if (unitCfg.getDiveCfg() == null) {
        return false;
    }

    const defaultValue    = !!unitCfg.getDiveCfg()?.getIsDivedByDefault();
    const act             = action.getActIsDiving();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return epResult.num !== 0;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActFlareCurrentAmmo(action: ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr, tile: ITile, unitType: number): number {
    const defaultValue = tile.getGameConfig().getUnitTemplateCfg(unitType)?.getFlareMaxAmmo() ?? 0;
    if (defaultValue <= 0) {
        return defaultValue;
    }

    const act = action.getActFlareCurrentAmmo();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
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
function evalActCurrentFuel(action: ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr, tile: ITile, unitType: number): number {
    const defaultValue = HelpersMisc.getExisted(tile.getGameConfig().getUnitTemplateCfg(unitType)?.getMaxFuel());
    const act = action.getActCurrentFuel();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
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
function evalActCurrentBuildMaterial(action: ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr, tile: ITile, unitType: number): number {
    const defaultValue = tile.getGameConfig().getUnitTemplateCfg(unitType)?.getMaxBuildMaterial() ?? 0;
    if (defaultValue <= 0) {
        return defaultValue;
    }

    const act = action.getActCurrentBuildMaterial();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
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
function evalActCurrentProduceMaterial(action: ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr, tile: ITile, unitType: number): number {
    const defaultValue = tile.getGameConfig().getUnitTemplateCfg(unitType)?.getMaxProduceMaterial() ?? 0;
    if (defaultValue <= 0) {
        return defaultValue;
    }

    const act = action.getActCurrentProduceMaterial();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
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
function evalActCurrentPromotion(action: ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr, tile: ITile): number {
    const defaultValue    = tile.getGameConfig().getUnitMaxPromotion();
    const act             = action.getActCurrentPromotion();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
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
function evalActIsCoOnboard(action: ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr, tile: ITile): boolean {
    const defaultValue  = false;
    const act             = action.getActIsCoOnboard();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return epResult.num !== 0;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActAiMode(action: ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr, tile: ITile): number {
    const defaultValue  = UnitsConstants.AiModeId.Normal;
    const act             = action.getActAiMode();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const aiMode = Math.floor(epResult.num);
            return (UnitsUtilsCommon.checkIsValidAiModeId(aiMode)) ? aiMode : defaultValue;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActGroupedTagId(action: ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr, tile: ITile): number {
    const defaultValue  = 0;
    const act             = action.getActGroupedTagId();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNumArray.NumArray) {
            return UnitsUtilsCommon.getEncodedTagId(epResult.numberArray.map(v => NumbersUtils.getValueInRange({
                minValue    : UnitsConstants.TagId.MinTagId,
                maxValue    : UnitsConstants.TagId.MaxTagId,
                rawValue    : Math.floor(v),
            })));
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActForbiddenGroupedLocationIdArray(action: ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr, tile: ITile): number[] {
    const act = action.getActForbiddenGroupedLocationIdArray();
    if (!act) {
        return [];
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNumArray.NumArray) {
            return LocationsUtils.encode(epResult.numberArray.map(v => NumbersUtils.getValueInRange({
                minValue    : LocationsConstants.MinId,
                maxValue    : LocationsConstants.MaxId,
                rawValue    : Math.floor(v),
            })));
        } else {
            return [];
        }
    } catch (Exception) {
        return [];
    }
}
function evalActAiWeightedDestination(action: ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr, tile: ITile): AuxiliaryTypesGridIndexAndWeight.GridIndexAndWeight | null {
    const act = action.getActAiWeightedDestination();
    if (!act) {
        return null;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNumArray.NumArray) {
            if (epResult.numberArray.length !== 3) {
                return null;
            }

            const arr       = epResult.numberArray.map(v => NumbersUtils.getValueInInt32(v));
            const gridIndex = new AuxiliaryTypesGridIndex.GridIndex(arr[0], arr[1]);
            if (!gridIndex.checkIsInsideMap(tile.getWar().getTileMap().getMapSize())) {
                return null;
            }

            return new AuxiliaryTypesGridIndexAndWeight.GridIndexAndWeight(gridIndex, arr[2]);
        } else {
            return null;
        }
    } catch (Exception) {
        return null;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr, isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const unitMap         = war.getUnitMap();
    let nextUnitId      = unitMap.getNextUnitId();
    const newUnitDataList : ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit[] = [];
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
function createNewUnitData(action: ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapExpr.WeaFillUnitOnMapExpr, tile: ITile, unitId: number): ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit | null {
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

    return UnitsUtilsSerialization.create({
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
function applyNewUnitDataArray(unitDataArray: ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit[], war: BaseWarInterfaceIBwWar.IBwWar, isFast: boolean): void {
    const unitMap       = war.getUnitMap();
    const gameConfig    = war.getGcData();
    const unitArray     : UnitsIUnit.IUnit[] = [];
    for (const unitData of unitDataArray) {
        const unit = new (GameHelpersGhFactory.getUnitClass())();
        unit.init(unitData, gameConfig);
        unit.startRunning(war);
        unit.startRunningView();
        unitMap.setUnitOnMap(unit);
        (!isFast) && (unit.updateView());

        unitArray.push(unit);
    }

    const warStatisticsManager = war.getWarStatisticsManager();
    for (const unit of unitArray) {
        const observerTeamIndexes = VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex: unit.getGridIndex() });
        if (observerTeamIndexes != null) {
            warStatisticsManager.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                unitType                    : unit.getUnitType(),
                dstPlayerIndex              : unit.getPlayerIndex(),
                unitGain                    : 1,
                unitLoss                    : 0,
                normalizedHpGain            : unit.getNormalizedCurrentHp(),
                normalizedHpLoss            : 0,
                groupedObserverTeamIndexes  : HelpersTeam.encodeTeamIndex(observerTeamIndexes),
            }));
        }
    }
}
