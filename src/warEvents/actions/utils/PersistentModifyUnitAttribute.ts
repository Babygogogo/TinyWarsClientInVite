import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { Unit } from "../../../expressionParsers/contexts/Unit.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { NullableUnit } from "../../../expressionParsers/results/NullableUnit.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { getMpwWarClass } from "../../../gameHelpers/GhFactory.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText, getText, getTextForYesOrNo } from "../../../lang/Utils.ts";
import type { WeaPersistentModifyUnitAttribute } from "../../../proto/schema/CommonProto/WarEvent/WeaPersistentModifyUnitAttribute.ts";
import type { IUnit } from "../../../units/IUnit.ts";
import { ExpressionInfoDict } from "../constants/PersistentModifyUnitAttribute.ts";

export function checkIsValid(action: Undefinable<WeaPersistentModifyUnitAttribute>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getConUnitFilter(),
            expressionInfo          : ExpressionInfoDict.ConUnitFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActAttackPowerModifier(),
            expressionInfo          : ExpressionInfoDict.ActAttackPowerModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActDefenseModifier(),
            expressionInfo          : ExpressionInfoDict.ActDefenseModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActMaxAttackRangeModifier(),
            expressionInfo          : ExpressionInfoDict.ActMaxAttackRangeModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCanAttackAfterMoving(),
            expressionInfo          : ExpressionInfoDict.ActCanAttackAfterMoving,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActMoveRangeModifier(),
            expressionInfo          : ExpressionInfoDict.ActMoveRangeModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActLuckLowerLimitModifier(),
            expressionInfo          : ExpressionInfoDict.ActLuckLowerLimitModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActLuckUpperLimitModifier(),
            expressionInfo          : ExpressionInfoDict.ActLuckUpperLimitModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActVisionRangeModifier(),
            expressionInfo          : ExpressionInfoDict.ActVisionRangeModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActIsPenetratingVision(),
            expressionInfo          : ExpressionInfoDict.ActIsPenetratingVision,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActFlareRangeModifier(),
            expressionInfo          : ExpressionInfoDict.ActFlareRangeModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActFlareRadiusModifier(),
            expressionInfo          : ExpressionInfoDict.ActFlareRadiusModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaPersistentModifyUnitAttribute>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0044, data.getConUnitFilter() ?? UndefinedError);
}
export function getDetailDesc(data: Undefinable<WeaPersistentModifyUnitAttribute>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        `${getText(TextType.B1170)}: ${getTextForYesOrNo(data.getIsEffectiveInMpw())}`,
        data.getActAttackPowerModifier()     ? `${ExpressionInfoDict.ActAttackPowerModifier.getTitleText()}: ${data.getActAttackPowerModifier()}`         : null,
        data.getActDefenseModifier()         ? `${ExpressionInfoDict.ActDefenseModifier.getTitleText()}: ${data.getActDefenseModifier()}`                 : null,
        data.getActMaxAttackRangeModifier()  ? `${ExpressionInfoDict.ActMaxAttackRangeModifier.getTitleText()}: ${data.getActMaxAttackRangeModifier()}`   : null,
        data.getActCanAttackAfterMoving()    ? `${ExpressionInfoDict.ActCanAttackAfterMoving.getTitleText()}: ${data.getActCanAttackAfterMoving()}`       : null,
        data.getActMoveRangeModifier()       ? `${ExpressionInfoDict.ActMoveRangeModifier.getTitleText()}: ${data.getActMoveRangeModifier()}`             : null,
        data.getActLuckLowerLimitModifier()  ? `${ExpressionInfoDict.ActLuckLowerLimitModifier.getTitleText()}: ${data.getActLuckLowerLimitModifier()}`   : null,
        data.getActLuckUpperLimitModifier()  ? `${ExpressionInfoDict.ActLuckUpperLimitModifier.getTitleText()}: ${data.getActLuckUpperLimitModifier()}`   : null,
        data.getActVisionRangeModifier()     ? `${ExpressionInfoDict.ActVisionRangeModifier.getTitleText()}: ${data.getActVisionRangeModifier()}`         : null,
        data.getActIsPenetratingVision()     ? `${ExpressionInfoDict.ActIsPenetratingVision.getTitleText()}: ${data.getActIsPenetratingVision()}`         : null,
        data.getActFlareRangeModifier()      ? `${ExpressionInfoDict.ActFlareRangeModifier.getTitleText()}: ${data.getActFlareRangeModifier()}`           : null,
        data.getActFlareRadiusModifier()     ? `${ExpressionInfoDict.ActFlareRadiusModifier.getTitleText()}: ${data.getActFlareRadiusModifier()}`         : null,
    ].filter(v => v != null).join(`\n`);

    return `${getFormattedText(TextType.F0044, data.getConUnitFilter() ?? UndefinedError)}\n${additionalText}`;
}

export function getErrorTip(data: WeaPersistentModifyUnitAttribute, customCounterNameSet: Set<string>): string | null {
    {
        const info      = ExpressionInfoDict.ConUnitFilter;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getConUnitFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActAttackPowerModifier;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActAttackPowerModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActDefenseModifier;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActDefenseModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActMaxAttackRangeModifier;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActMaxAttackRangeModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCanAttackAfterMoving;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCanAttackAfterMoving(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActMoveRangeModifier;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActMoveRangeModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActLuckLowerLimitModifier;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActLuckLowerLimitModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActLuckUpperLimitModifier;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActLuckUpperLimitModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActVisionRangeModifier;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActVisionRangeModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActIsPenetratingVision;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActIsPenetratingVision(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActFlareRangeModifier;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActFlareRangeModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActFlareRadiusModifier;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActFlareRadiusModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}


function checkIsMeet(action: WeaPersistentModifyUnitAttribute, unit: IUnit): boolean {
    const war = unit.getWar();
    if ((!action.getIsEffectiveInMpw()) && (war instanceof getMpwWarClass())) {
        return false;
    }

    try {
        const epResult = Parser.getParseResult(action.getConUnitFilter() ?? ``).eval(new Unit(new NullableUnit(war, unit)), true);
        return (epResult instanceof Num) && (epResult.num != 0);
    } catch {
        return false;
    }
}

export function getAttackPowerModifierForUnit(action: WeaPersistentModifyUnitAttribute, unit: IUnit): number {
    const str = action.getActAttackPowerModifier();
    if (!str) {
        return 0;
    }

    if (!checkIsMeet(action, unit)) {
        return 0;
    }

    try {
        const epResult = Parser.getParseResult(str).eval(new Unit(new NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

export function getDefenseModifierForUnit(action: WeaPersistentModifyUnitAttribute, unit: IUnit): number {
    const str = action.getActDefenseModifier();
    if (!str) {
        return 0;
    }

    if (!checkIsMeet(action, unit)) {
        return 0;
    }

    try {
        const epResult = Parser.getParseResult(str).eval(new Unit(new NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

export function getFlareRadiusModifierForUnit(action: WeaPersistentModifyUnitAttribute, unit: IUnit): number {
    const str = action.getActFlareRadiusModifier();
    if (!str) {
        return 0;
    }

    if (!checkIsMeet(action, unit)) {
        return 0;
    }

    try {
        const epResult = Parser.getParseResult(str).eval(new Unit(new NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

export function getFlareRangeModifierForUnit(action: WeaPersistentModifyUnitAttribute, unit: IUnit): number {
    const str = action.getActFlareRangeModifier();
    if (!str) {
        return 0;
    }

    if (!checkIsMeet(action, unit)) {
        return 0;
    }

    try {
        const epResult = Parser.getParseResult(str).eval(new Unit(new NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

export function getLuckLowerLimitModifierForUnit(action: WeaPersistentModifyUnitAttribute, unit: IUnit): number {
    const str = action.getActLuckLowerLimitModifier();
    if (!str) {
        return 0;
    }

    if (!checkIsMeet(action, unit)) {
        return 0;
    }

    try {
        const epResult = Parser.getParseResult(str).eval(new Unit(new NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

export function getLuckUpperLimitModifierForUnit(action: WeaPersistentModifyUnitAttribute, unit: IUnit): number {
    const str = action.getActLuckUpperLimitModifier();
    if (!str) {
        return 0;
    }

    if (!checkIsMeet(action, unit)) {
        return 0;
    }

    try {
        const epResult = Parser.getParseResult(str).eval(new Unit(new NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

export function getMaxAttackRangeModifierForUnit(action: WeaPersistentModifyUnitAttribute, unit: IUnit): number {
    const str = action.getActMaxAttackRangeModifier();
    if (!str) {
        return 0;
    }

    if (!checkIsMeet(action, unit)) {
        return 0;
    }

    try {
        const epResult = Parser.getParseResult(str).eval(new Unit(new NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

export function getVisionRangeModifierForUnit(action: WeaPersistentModifyUnitAttribute, unit: IUnit): number {
    const str = action.getActVisionRangeModifier();
    if (!str) {
        return 0;
    }

    if (!checkIsMeet(action, unit)) {
        return 0;
    }

    try {
        const epResult = Parser.getParseResult(str).eval(new Unit(new NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

export function getIsPenetratingVisionForUnit(action: WeaPersistentModifyUnitAttribute, unit: IUnit): boolean | null {
    const str = action.getActIsPenetratingVision();
    if (!str) {
        return null;
    }

    if (!checkIsMeet(action, unit)) {
        return null;
    }

    try {
        const epResult = Parser.getParseResult(str).eval(new Unit(new NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof Num) {
            return epResult.num !== 0;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

export function getMoveRangeModifierForUnit(action: WeaPersistentModifyUnitAttribute, unit: IUnit): number {
    const str = action.getActMoveRangeModifier();
    if (!str) {
        return 0;
    }

    if (!checkIsMeet(action, unit)) {
        return 0;
    }

    try {
        const epResult = Parser.getParseResult(str).eval(new Unit(new NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

export function getCanAttackAfterMovingForUnit(action: WeaPersistentModifyUnitAttribute, unit: IUnit): boolean | null {
    const str = action.getActCanAttackAfterMoving();
    if (!str) {
        return null;
    }

    if (!checkIsMeet(action, unit)) {
        return null;
    }

    try {
        const epResult = Parser.getParseResult(str).eval(new Unit(new NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof Num) {
            return epResult.num !== 0;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

export function applyWithExtraData(_action: WeaPersistentModifyUnitAttribute, war: IBwWar, actionId: number): void {
    war.getWarEventManager().updateOpaIdArrayOnExecuteAction(actionId);
}
export function applyWithoutExtraData(_action: WeaPersistentModifyUnitAttribute, war: IBwWar, actionId: number): void {
    war.getWarEventManager().updateOpaIdArrayOnExecuteAction(actionId);
}
