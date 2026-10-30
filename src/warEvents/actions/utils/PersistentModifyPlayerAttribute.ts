import {
    MultiPlayerWar_Model_MpwWar,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Contexts_NumArray,
    ExpressionParsers_Parser,
    ExpressionParsers_Contexts_Player,
    ExpressionParsers_Results_NumArray,
    type AuxiliaryTypes_GridIndex,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
    WarEvents_Actions_Constants_PersistentModifyPlayerAttribute,
    Lang_Utils,
    Lang_Constants,
    type Players_IPlayer,
} from "../../../internal.ts";

import type { WeaPersistentModifyPlayerAttribute } from "../../../proto/schema/CommonProto/WarEvent/WeaPersistentModifyPlayerAttribute.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaPersistentModifyPlayerAttribute>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getConPlayerFilter(),
            expressionInfo          : WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ConPlayerFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActBannedUnitTypeArray(),
            expressionInfo          : WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActBannedUnitTypeArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActUnbannedUnitTypeArray(),
            expressionInfo          : WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActUnbannedUnitTypeArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActCanActivateCoSkill(),
            expressionInfo          : WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActCanActivateCoSkill,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActEnergyGrowthMultiplierModifier(),
            expressionInfo          : WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActEnergyGrowthMultiplierModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActCoZoneRadiusModifier(),
            expressionInfo          : WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActCoZoneRadiusModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActAiUnitProductionBonusScore(),
            expressionInfo          : WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActAiUnitProductionBonusScore,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaPersistentModifyPlayerAttribute>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0043, data.getConPlayerFilter() ?? Lang_Constants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaPersistentModifyPlayerAttribute>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        `${Lang_Utils.getText(Lang_Constants.TextType.B1170)}: ${Lang_Utils.getTextForYesOrNo(data.getIsEffectiveInMpw())}`,
        data.getActBannedUnitTypeArray()             ? `${WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActBannedUnitTypeArray.getTitleText()}: ${data.getActBannedUnitTypeArray()}`                         : null,
        data.getActUnbannedUnitTypeArray()           ? `${WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActUnbannedUnitTypeArray.getTitleText()}: ${data.getActUnbannedUnitTypeArray()}`                     : null,
        data.getActCanActivateCoSkill()              ? `${WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActCanActivateCoSkill.getTitleText()}: ${data.getActCanActivateCoSkill()}`                           : null,
        data.getActEnergyGrowthMultiplierModifier()  ? `${WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActEnergyGrowthMultiplierModifier.getTitleText()}: ${data.getActEnergyGrowthMultiplierModifier()}`   : null,
        data.getActCoZoneRadiusModifier()            ? `${WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActCoZoneRadiusModifier.getTitleText()}: ${data.getActCoZoneRadiusModifier()}`                       : null,
        data.getActAiUnitProductionBonusScore()      ? `${WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActAiUnitProductionBonusScore.getTitleText()}: ${data.getActAiUnitProductionBonusScore()}`           : null,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0043, data.getConPlayerFilter() ?? Lang_Constants.UndefinedError)}\n${additionalText}`;
}

export function getErrorTip(data: WeaPersistentModifyPlayerAttribute, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ConPlayerFilter;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getConPlayerFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActBannedUnitTypeArray;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActBannedUnitTypeArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActUnbannedUnitTypeArray;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActUnbannedUnitTypeArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActCanActivateCoSkill;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActCanActivateCoSkill(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActEnergyGrowthMultiplierModifier;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActEnergyGrowthMultiplierModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActCoZoneRadiusModifier;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActCoZoneRadiusModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_PersistentModifyPlayerAttribute.ExpressionInfoDict.ActAiUnitProductionBonusScore;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActAiUnitProductionBonusScore(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForPlayer(action: WeaPersistentModifyPlayerAttribute, playerIndex: number, war: BaseWar_Interface_IBwWar.IBwWar): boolean {
    if ((!action.getIsEffectiveInMpw()) && (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar)) {
        return false;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(action.getConPlayerFilter() ?? ``).eval(new ExpressionParsers_Contexts_Player.Player(war.getPlayer(playerIndex)), true);
        return (epResult instanceof ExpressionParsers_Results_Num.Num) && (epResult.num != 0);
    } catch {
        return false;
    }
}

export function checkCanActivateCoSkillForPlayer(action: WeaPersistentModifyPlayerAttribute, playerIndex: number, war: BaseWar_Interface_IBwWar.IBwWar): boolean | null {
    const actCanActivate = action.getActCanActivateCoSkill();
    if (!actCanActivate) {
        return null;
    }

    if (!checkIsMeetConditionForPlayer(action, playerIndex, war)) {
        return null;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(actCanActivate).eval(new ExpressionParsers_Contexts_Player.Player(war.getPlayer(playerIndex)), true);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num !== 0;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

export function checkCanProduceUnitForPlayer(action: WeaPersistentModifyPlayerAttribute, playerIndex: number, unitType: number, war: BaseWar_Interface_IBwWar.IBwWar): boolean | null {
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

export function getActEnergyGrowthMultiplierModifierForPlayer(action: WeaPersistentModifyPlayerAttribute, playerIndex: number, war: BaseWar_Interface_IBwWar.IBwWar): number {
    const exp = action.getActEnergyGrowthMultiplierModifier();
    if (!exp) {
        return 0;
    }

    if (!checkIsMeetConditionForPlayer(action, playerIndex, war)) {
        return 0;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(exp).eval(new ExpressionParsers_Contexts_Player.Player(war.getPlayer(playerIndex)), true);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

export function getActCoZoneRadiusModifierForPlayer(action: WeaPersistentModifyPlayerAttribute, playerIndex: number, war: BaseWar_Interface_IBwWar.IBwWar): number {
    const exp = action.getActCoZoneRadiusModifier();
    if (!exp) {
        return 0;
    }

    if (!checkIsMeetConditionForPlayer(action, playerIndex, war)) {
        return 0;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(exp).eval(new ExpressionParsers_Contexts_Player.Player(war.getPlayer(playerIndex)), true);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
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
    war         : BaseWar_Interface_IBwWar.IBwWar;
    unitTypeId  : number;
    gridIndex   : AuxiliaryTypes_GridIndex.GridIndex;
 }): number {
    const exp = action.getActAiUnitProductionBonusScore();
    if (!exp) {
        return 0;
    }

    if (!checkIsMeetConditionForPlayer(action, playerIndex, war)) {
        return 0;
    }

    try {
        const temp      = new ExpressionParsers_Results_NumArray.NumArray(war, [unitTypeId, gridIndex.getX(), gridIndex.getY()]);
        const epResult  = ExpressionParsers_Parser.Parser.getParseResult(exp).eval(new ExpressionParsers_Contexts_NumArray.NumArray(temp), true);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

function getEpResultNumberArray(str: AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>, player: Players_IPlayer.IPlayer): number[] {
    if (!str) {
        return [];
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(str).eval(new ExpressionParsers_Contexts_Player.Player(player), true);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return [epResult.num];
        } else if (epResult instanceof ExpressionParsers_Results_NumArray.NumArray) {
            return epResult.numberArray;
        } else {
            return [];
        }
    } catch {
        return [];
    }
}

export function applyWithExtraData(_action: WeaPersistentModifyPlayerAttribute, war: BaseWar_Interface_IBwWar.IBwWar, actionId: number): void {
    war.getWarEventManager().updateOpaIdArrayOnExecuteAction(actionId);
}
export function applyWithoutExtraData(_action: WeaPersistentModifyPlayerAttribute, war: BaseWar_Interface_IBwWar.IBwWar, actionId: number): void {
    war.getWarEventManager().updateOpaIdArrayOnExecuteAction(actionId);
}
