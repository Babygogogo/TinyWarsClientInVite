import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersContextsUnit from "../../../expressionParsers/contexts/Unit.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNullableUnit from "../../../expressionParsers/results/NullableUnit.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaPersistentModifyUnitAttribute from "../../../proto/schema/CommonProto/WarEvent/WeaPersistentModifyUnitAttribute.ts";
import type * as UnitsIUnit from "../../../units/IUnit.ts";
import * as WarEventsActionsConstantsPersistentModifyUnitAttribute from "../constants/PersistentModifyUnitAttribute.ts";

type WeaPersistentModifyUnitAttribute   = ProtoSchemaCommonProtoWarEventWeaPersistentModifyUnitAttribute.WeaPersistentModifyUnitAttribute;
type IUnit                              = UnitsIUnit.IUnit;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaPersistentModifyUnitAttribute>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getConUnitFilter(),
            expressionInfo          : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ConUnitFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActAttackPowerModifier(),
            expressionInfo          : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActAttackPowerModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActDefenseModifier(),
            expressionInfo          : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActDefenseModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActMaxAttackRangeModifier(),
            expressionInfo          : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActMaxAttackRangeModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCanAttackAfterMoving(),
            expressionInfo          : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActCanAttackAfterMoving,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActMoveRangeModifier(),
            expressionInfo          : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActMoveRangeModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActLuckLowerLimitModifier(),
            expressionInfo          : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckLowerLimitModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActLuckUpperLimitModifier(),
            expressionInfo          : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckUpperLimitModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActVisionRangeModifier(),
            expressionInfo          : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActVisionRangeModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActIsPenetratingVision(),
            expressionInfo          : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActIsPenetratingVision,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActFlareRangeModifier(),
            expressionInfo          : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRangeModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActFlareRadiusModifier(),
            expressionInfo          : WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRadiusModifier,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaPersistentModifyUnitAttribute>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0044, data.getConUnitFilter() ?? LangConstants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaPersistentModifyUnitAttribute>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        `${LangUtils.getText(LangConstants.TextType.B1170)}: ${LangUtils.getTextForYesOrNo(data.getIsEffectiveInMpw())}`,
        data.getActAttackPowerModifier()     ? `${WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActAttackPowerModifier.getTitleText()}: ${data.getActAttackPowerModifier()}`         : null,
        data.getActDefenseModifier()         ? `${WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActDefenseModifier.getTitleText()}: ${data.getActDefenseModifier()}`                 : null,
        data.getActMaxAttackRangeModifier()  ? `${WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActMaxAttackRangeModifier.getTitleText()}: ${data.getActMaxAttackRangeModifier()}`   : null,
        data.getActCanAttackAfterMoving()    ? `${WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActCanAttackAfterMoving.getTitleText()}: ${data.getActCanAttackAfterMoving()}`       : null,
        data.getActMoveRangeModifier()       ? `${WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActMoveRangeModifier.getTitleText()}: ${data.getActMoveRangeModifier()}`             : null,
        data.getActLuckLowerLimitModifier()  ? `${WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckLowerLimitModifier.getTitleText()}: ${data.getActLuckLowerLimitModifier()}`   : null,
        data.getActLuckUpperLimitModifier()  ? `${WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckUpperLimitModifier.getTitleText()}: ${data.getActLuckUpperLimitModifier()}`   : null,
        data.getActVisionRangeModifier()     ? `${WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActVisionRangeModifier.getTitleText()}: ${data.getActVisionRangeModifier()}`         : null,
        data.getActIsPenetratingVision()     ? `${WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActIsPenetratingVision.getTitleText()}: ${data.getActIsPenetratingVision()}`         : null,
        data.getActFlareRangeModifier()      ? `${WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRangeModifier.getTitleText()}: ${data.getActFlareRangeModifier()}`           : null,
        data.getActFlareRadiusModifier()     ? `${WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRadiusModifier.getTitleText()}: ${data.getActFlareRadiusModifier()}`         : null,
    ].filter(v => v != null).join(`\n`);

    return `${LangUtils.getFormattedText(LangConstants.TextType.F0044, data.getConUnitFilter() ?? LangConstants.UndefinedError)}\n${additionalText}`;
}

export function getErrorTip(data: WeaPersistentModifyUnitAttribute, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ConUnitFilter;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getConUnitFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActAttackPowerModifier;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActAttackPowerModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActDefenseModifier;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActDefenseModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActMaxAttackRangeModifier;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActMaxAttackRangeModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActCanAttackAfterMoving;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCanAttackAfterMoving(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActMoveRangeModifier;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActMoveRangeModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckLowerLimitModifier;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActLuckLowerLimitModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckUpperLimitModifier;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActLuckUpperLimitModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActVisionRangeModifier;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActVisionRangeModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActIsPenetratingVision;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActIsPenetratingVision(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRangeModifier;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActFlareRangeModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsPersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRadiusModifier;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActFlareRadiusModifier(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}


function checkIsMeet(action: WeaPersistentModifyUnitAttribute, unit: IUnit): boolean {
    const war = unit.getWar();
    if ((!action.getIsEffectiveInMpw()) && (war instanceof GameHelpersGhFactory.getMpwWarClass())) {
        return false;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(action.getConUnitFilter() ?? ``).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(war, unit)), true);
        return (epResult instanceof ExpressionParsersResultsNum.Num) && (epResult.num != 0);
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(str).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(str).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(str).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(str).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(str).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(str).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(str).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(str).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(str).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(str).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(str).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return epResult.num !== 0;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

export function applyWithExtraData(_action: WeaPersistentModifyUnitAttribute, war: BaseWarInterfaceIBwWar.IBwWar, actionId: number): void {
    war.getWarEventManager().updateOpaIdArrayOnExecuteAction(actionId);
}
export function applyWithoutExtraData(_action: WeaPersistentModifyUnitAttribute, war: BaseWarInterfaceIBwWar.IBwWar, actionId: number): void {
    war.getWarEventManager().updateOpaIdArrayOnExecuteAction(actionId);
}
