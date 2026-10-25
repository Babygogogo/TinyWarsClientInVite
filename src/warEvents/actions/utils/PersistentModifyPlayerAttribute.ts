import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { NumArray } from "../../../expressionParsers/contexts/NumArray.ts";
import { Player } from "../../../expressionParsers/contexts/Player.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { NumArray as ExpressionParsersResultsNumArray } from "../../../expressionParsers/results/NumArray.ts";
import { getMpwWarClass } from "../../../gameHelpers/GhFactory.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText, getText, getTextForYesOrNo } from "../../../lang/Utils.ts";
import type { IPlayer } from "../../../players/IPlayer.ts";
import type {
    WeaPersistentModifyPlayerAttribute as ProtoSchemaCommonProtoWarEventWeaPersistentModifyPlayerAttribute,
} from "../../../proto/schema/CommonProto/WarEvent/WeaPersistentModifyPlayerAttribute.ts";
import { ExpressionInfoDict } from "../constants/PersistentModifyPlayerAttribute.ts";

type WeaPersistentModifyPlayerAttribute = ProtoSchemaCommonProtoWarEventWeaPersistentModifyPlayerAttribute;

export function checkIsValid(action: Undefinable<WeaPersistentModifyPlayerAttribute>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getConPlayerFilter(),
            expressionInfo          : ExpressionInfoDict.ConPlayerFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActBannedUnitTypeArray(),
            expressionInfo          : ExpressionInfoDict.ActBannedUnitTypeArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActUnbannedUnitTypeArray(),
            expressionInfo          : ExpressionInfoDict.ActUnbannedUnitTypeArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCanActivateCoSkill(),
            expressionInfo          : ExpressionInfoDict.ActCanActivateCoSkill,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActEnergyGrowthMultiplierModifier(),
            expressionInfo          : ExpressionInfoDict.ActEnergyGrowthMultiplierModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCoZoneRadiusModifier(),
            expressionInfo          : ExpressionInfoDict.ActCoZoneRadiusModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActAiUnitProductionBonusScore(),
            expressionInfo          : ExpressionInfoDict.ActAiUnitProductionBonusScore,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaPersistentModifyPlayerAttribute>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0043, data.getConPlayerFilter() ?? UndefinedError);
}
export function getDetailDesc(data: Undefinable<WeaPersistentModifyPlayerAttribute>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        `${getText(TextType.B1170)}: ${getTextForYesOrNo(data.getIsEffectiveInMpw())}`,
        data.getActBannedUnitTypeArray()             ? `${ExpressionInfoDict.ActBannedUnitTypeArray.getTitleText()}: ${data.getActBannedUnitTypeArray()}`                         : null,
        data.getActUnbannedUnitTypeArray()           ? `${ExpressionInfoDict.ActUnbannedUnitTypeArray.getTitleText()}: ${data.getActUnbannedUnitTypeArray()}`                     : null,
        data.getActCanActivateCoSkill()              ? `${ExpressionInfoDict.ActCanActivateCoSkill.getTitleText()}: ${data.getActCanActivateCoSkill()}`                           : null,
        data.getActEnergyGrowthMultiplierModifier()  ? `${ExpressionInfoDict.ActEnergyGrowthMultiplierModifier.getTitleText()}: ${data.getActEnergyGrowthMultiplierModifier()}`   : null,
        data.getActCoZoneRadiusModifier()            ? `${ExpressionInfoDict.ActCoZoneRadiusModifier.getTitleText()}: ${data.getActCoZoneRadiusModifier()}`                       : null,
        data.getActAiUnitProductionBonusScore()      ? `${ExpressionInfoDict.ActAiUnitProductionBonusScore.getTitleText()}: ${data.getActAiUnitProductionBonusScore()}`           : null,
    ].filter(v => v != null).join(`\n`);

    return `${getFormattedText(TextType.F0043, data.getConPlayerFilter() ?? UndefinedError)}\n${additionalText}`;
}

export function getErrorTip(data: WeaPersistentModifyPlayerAttribute, customCounterNameSet: Set<string>): string | null {
    {
        const info      = ExpressionInfoDict.ConPlayerFilter;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getConPlayerFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActBannedUnitTypeArray;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActBannedUnitTypeArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActUnbannedUnitTypeArray;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActUnbannedUnitTypeArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCanActivateCoSkill;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCanActivateCoSkill(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActEnergyGrowthMultiplierModifier;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActEnergyGrowthMultiplierModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCoZoneRadiusModifier;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCoZoneRadiusModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActAiUnitProductionBonusScore;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActAiUnitProductionBonusScore(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForPlayer(action: WeaPersistentModifyPlayerAttribute, playerIndex: number, war: IBwWar): boolean {
    if ((!action.getIsEffectiveInMpw()) && (war instanceof getMpwWarClass())) {
        return false;
    }

    try {
        const epResult = Parser.getParseResult(action.getConPlayerFilter() ?? ``).eval(new Player(war.getPlayer(playerIndex)), true);
        return (epResult instanceof Num) && (epResult.num != 0);
    } catch {
        return false;
    }
}

export function checkCanActivateCoSkillForPlayer(action: WeaPersistentModifyPlayerAttribute, playerIndex: number, war: IBwWar): boolean | null {
    const actCanActivate = action.getActCanActivateCoSkill();
    if (!actCanActivate) {
        return null;
    }

    if (!checkIsMeetConditionForPlayer(action, playerIndex, war)) {
        return null;
    }

    try {
        const epResult = Parser.getParseResult(actCanActivate).eval(new Player(war.getPlayer(playerIndex)), true);
        if (epResult instanceof Num) {
            return epResult.num !== 0;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

export function checkCanProduceUnitForPlayer(action: WeaPersistentModifyPlayerAttribute, playerIndex: number, unitType: number, war: IBwWar): boolean | null {
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

export function getActEnergyGrowthMultiplierModifierForPlayer(action: WeaPersistentModifyPlayerAttribute, playerIndex: number, war: IBwWar): number {
    const exp = action.getActEnergyGrowthMultiplierModifier();
    if (!exp) {
        return 0;
    }

    if (!checkIsMeetConditionForPlayer(action, playerIndex, war)) {
        return 0;
    }

    try {
        const epResult = Parser.getParseResult(exp).eval(new Player(war.getPlayer(playerIndex)), true);
        if (epResult instanceof Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

export function getActCoZoneRadiusModifierForPlayer(action: WeaPersistentModifyPlayerAttribute, playerIndex: number, war: IBwWar): number {
    const exp = action.getActCoZoneRadiusModifier();
    if (!exp) {
        return 0;
    }

    if (!checkIsMeetConditionForPlayer(action, playerIndex, war)) {
        return 0;
    }

    try {
        const epResult = Parser.getParseResult(exp).eval(new Player(war.getPlayer(playerIndex)), true);
        if (epResult instanceof Num) {
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
    war         : IBwWar;
    unitTypeId  : number;
    gridIndex   : GridIndex;
 }): number {
    const exp = action.getActAiUnitProductionBonusScore();
    if (!exp) {
        return 0;
    }

    if (!checkIsMeetConditionForPlayer(action, playerIndex, war)) {
        return 0;
    }

    try {
        const temp      = new ExpressionParsersResultsNumArray(war, [unitTypeId, gridIndex.getX(), gridIndex.getY()]);
        const epResult  = Parser.getParseResult(exp).eval(new NumArray(temp), true);
        if (epResult instanceof Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

function getEpResultNumberArray(str: Undefinable<string>, player: IPlayer): number[] {
    if (!str) {
        return [];
    }

    try {
        const epResult = Parser.getParseResult(str).eval(new Player(player), true);
        if (epResult instanceof Num) {
            return [epResult.num];
        } else if (epResult instanceof ExpressionParsersResultsNumArray) {
            return epResult.numberArray;
        } else {
            return [];
        }
    } catch {
        return [];
    }
}

export function applyWithExtraData(_action: WeaPersistentModifyPlayerAttribute, war: IBwWar, actionId: number): void {
    war.getWarEventManager().updateOpaIdArrayOnExecuteAction(actionId);
}
export function applyWithoutExtraData(_action: WeaPersistentModifyPlayerAttribute, war: IBwWar, actionId: number): void {
    war.getWarEventManager().updateOpaIdArrayOnExecuteAction(actionId);
}
