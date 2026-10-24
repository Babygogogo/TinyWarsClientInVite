import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersContextsNumArray from "../../../expressionParsers/contexts/NumArray.ts";
import * as ExpressionParsersContextsPlayer from "../../../expressionParsers/contexts/Player.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as ExpressionParsersResultsNumArray from "../../../expressionParsers/results/NumArray.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as PlayersIPlayer from "../../../players/IPlayer.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaPersistentModifyPlayerAttribute from "../../../proto/schema/CommonProto/WarEvent/WeaPersistentModifyPlayerAttribute.ts";
import * as WarEventsActionsConstantsPersistentModifyPlayerAttribute from "../constants/PersistentModifyPlayerAttribute.ts";

type WeaPersistentModifyPlayerAttribute = ProtoSchemaCommonProtoWarEventWeaPersistentModifyPlayerAttribute.WeaPersistentModifyPlayerAttribute;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaPersistentModifyPlayerAttribute>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getConPlayerFilter(),
            expressionInfo          : WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ConPlayerFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActBannedUnitTypeArray(),
            expressionInfo          : WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActBannedUnitTypeArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActUnbannedUnitTypeArray(),
            expressionInfo          : WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActUnbannedUnitTypeArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCanActivateCoSkill(),
            expressionInfo          : WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActCanActivateCoSkill,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActEnergyGrowthMultiplierModifier(),
            expressionInfo          : WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActEnergyGrowthMultiplierModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCoZoneRadiusModifier(),
            expressionInfo          : WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActCoZoneRadiusModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActAiUnitProductionBonusScore(),
            expressionInfo          : WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActAiUnitProductionBonusScore,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaPersistentModifyPlayerAttribute>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0043, data.getConPlayerFilter() ?? LangConstants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaPersistentModifyPlayerAttribute>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        `${LangUtils.getText(LangConstants.TextType.B1170)}: ${LangUtils.getTextForYesOrNo(data.getIsEffectiveInMpw())}`,
        data.getActBannedUnitTypeArray()             ? `${WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActBannedUnitTypeArray.getTitleText()}: ${data.getActBannedUnitTypeArray()}`                         : null,
        data.getActUnbannedUnitTypeArray()           ? `${WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActUnbannedUnitTypeArray.getTitleText()}: ${data.getActUnbannedUnitTypeArray()}`                     : null,
        data.getActCanActivateCoSkill()              ? `${WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActCanActivateCoSkill.getTitleText()}: ${data.getActCanActivateCoSkill()}`                           : null,
        data.getActEnergyGrowthMultiplierModifier()  ? `${WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActEnergyGrowthMultiplierModifier.getTitleText()}: ${data.getActEnergyGrowthMultiplierModifier()}`   : null,
        data.getActCoZoneRadiusModifier()            ? `${WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActCoZoneRadiusModifier.getTitleText()}: ${data.getActCoZoneRadiusModifier()}`                       : null,
        data.getActAiUnitProductionBonusScore()      ? `${WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActAiUnitProductionBonusScore.getTitleText()}: ${data.getActAiUnitProductionBonusScore()}`           : null,
    ].filter(v => v != null).join(`\n`);

    return `${LangUtils.getFormattedText(LangConstants.TextType.F0043, data.getConPlayerFilter() ?? LangConstants.UndefinedError)}\n${additionalText}`;
}

export function getErrorTip(data: WeaPersistentModifyPlayerAttribute, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ConPlayerFilter;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getConPlayerFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActBannedUnitTypeArray;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActBannedUnitTypeArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActUnbannedUnitTypeArray;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActUnbannedUnitTypeArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActCanActivateCoSkill;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCanActivateCoSkill(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActEnergyGrowthMultiplierModifier;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActEnergyGrowthMultiplierModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActCoZoneRadiusModifier;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCoZoneRadiusModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsPersistentModifyPlayerAttribute.ExpressionInfoDict.ActAiUnitProductionBonusScore;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActAiUnitProductionBonusScore(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForPlayer(action: WeaPersistentModifyPlayerAttribute, playerIndex: number, war: BaseWarInterfaceIBwWar.IBwWar): boolean {
    if ((!action.getIsEffectiveInMpw()) && (war instanceof GameHelpersGhFactory.getMpwWarClass())) {
        return false;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(action.getConPlayerFilter() ?? ``).eval(new ExpressionParsersContextsPlayer.Player(war.getPlayer(playerIndex)), true);
        return (epResult instanceof ExpressionParsersResultsNum.Num) && (epResult.num != 0);
    } catch {
        return false;
    }
}

export function checkCanActivateCoSkillForPlayer(action: WeaPersistentModifyPlayerAttribute, playerIndex: number, war: BaseWarInterfaceIBwWar.IBwWar): boolean | null {
    const actCanActivate = action.getActCanActivateCoSkill();
    if (!actCanActivate) {
        return null;
    }

    if (!checkIsMeetConditionForPlayer(action, playerIndex, war)) {
        return null;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(actCanActivate).eval(new ExpressionParsersContextsPlayer.Player(war.getPlayer(playerIndex)), true);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return epResult.num !== 0;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

export function checkCanProduceUnitForPlayer(action: WeaPersistentModifyPlayerAttribute, playerIndex: number, unitType: number, war: BaseWarInterfaceIBwWar.IBwWar): boolean | null {
    const actBannedUnitTypeArray    = action.getActBannedUnitTypeArray();
    const actUnbannedUnitTypeArray  = action.getActUnbannedUnitTypeArray();
    if ((!actBannedUnitTypeArray) && (!actUnbannedUnitTypeArray)) {
        return null;
    }

    if (!checkIsMeetConditionForPlayer(action, playerIndex, war)) {
        return null;
    }

    const player = war.getPlayer(playerIndex);
    return (getEpResultNumberArray(actUnbannedUnitTypeArray, player).map(v => Math.floor(v)).indexOf(unitType) >= 0)
        ? true
        : ((getEpResultNumberArray(actBannedUnitTypeArray, player).map(v => Math.floor(v)).indexOf(unitType) >= 0)
            ? false
            : null
        );
}

export function getActEnergyGrowthMultiplierModifierForPlayer(action: WeaPersistentModifyPlayerAttribute, playerIndex: number, war: BaseWarInterfaceIBwWar.IBwWar): number {
    const exp = action.getActEnergyGrowthMultiplierModifier();
    if (!exp) {
        return 0;
    }

    if (!checkIsMeetConditionForPlayer(action, playerIndex, war)) {
        return 0;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(exp).eval(new ExpressionParsersContextsPlayer.Player(war.getPlayer(playerIndex)), true);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

export function getActCoZoneRadiusModifierForPlayer(action: WeaPersistentModifyPlayerAttribute, playerIndex: number, war: BaseWarInterfaceIBwWar.IBwWar): number {
    const exp = action.getActCoZoneRadiusModifier();
    if (!exp) {
        return 0;
    }

    if (!checkIsMeetConditionForPlayer(action, playerIndex, war)) {
        return 0;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(exp).eval(new ExpressionParsersContextsPlayer.Player(war.getPlayer(playerIndex)), true);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

export function getActAiUnitProductionBonusScore({ action, playerIndex, war, unitTypeId, gridIndex }: {
    action      : WeaPersistentModifyPlayerAttribute;
    playerIndex : number;
    war         : BaseWarInterfaceIBwWar.IBwWar;
    unitTypeId  : number;
    gridIndex   : AuxiliaryTypesGridIndex.GridIndex;
 }): number {
    const exp = action.getActAiUnitProductionBonusScore();
    if (!exp) {
        return 0;
    }

    if (!checkIsMeetConditionForPlayer(action, playerIndex, war)) {
        return 0;
    }

    try {
        const temp      = new ExpressionParsersResultsNumArray.NumArray(war, [unitTypeId, gridIndex.getX(), gridIndex.getY()]);
        const epResult  = ExpressionParsersParser.Parser.getParseResult(exp).eval(new ExpressionParsersContextsNumArray.NumArray(temp), true);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

function getEpResultNumberArray(str: AuxiliaryTypesAuxiliaryTypes.Undefinable<string>, player: PlayersIPlayer.IPlayer): number[] {
    if (!str) {
        return [];
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(str).eval(new ExpressionParsersContextsPlayer.Player(player), true);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return [epResult.num];
        } else if (epResult instanceof ExpressionParsersResultsNumArray.NumArray) {
            return epResult.numberArray;
        } else {
            return [];
        }
    } catch {
        return [];
    }
}

export function applyWithExtraData(_action: WeaPersistentModifyPlayerAttribute, war: BaseWarInterfaceIBwWar.IBwWar, actionId: number): void {
    war.getWarEventManager().updateOpaIdArrayOnExecuteAction(actionId);
}
export function applyWithoutExtraData(_action: WeaPersistentModifyPlayerAttribute, war: BaseWarInterfaceIBwWar.IBwWar, actionId: number): void {
    war.getWarEventManager().updateOpaIdArrayOnExecuteAction(actionId);
}
