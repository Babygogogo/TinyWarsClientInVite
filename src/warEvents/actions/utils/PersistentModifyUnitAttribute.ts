import {
    MultiPlayerWar_Model_MpwWar,
    ExpressionParsers_Results_NullableUnit,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Parser,
    ExpressionParsers_Contexts_Unit,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
    WarEvents_Actions_Constants_PersistentModifyUnitAttribute,
    Lang_Utils,
    Lang_Constants,
    type Units_IUnit,
} from "../../../internal.ts";

import type { WeaPersistentModifyUnitAttribute } from "../../../proto/schema/CommonProto/WarEvent/WeaPersistentModifyUnitAttribute.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaPersistentModifyUnitAttribute>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getConUnitFilter(),
            expressionInfo       : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ConUnitFilter,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActAttackPowerModifier(),
            expressionInfo       : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActAttackPowerModifier,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActDefenseModifier(),
            expressionInfo       : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActDefenseModifier,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActMaxAttackRangeModifier(),
            expressionInfo       : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActMaxAttackRangeModifier,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCanAttackAfterMoving(),
            expressionInfo       : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActCanAttackAfterMoving,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActMoveRangeModifier(),
            expressionInfo       : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActMoveRangeModifier,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActLuckLowerLimitModifier(),
            expressionInfo       : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckLowerLimitModifier,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActLuckUpperLimitModifier(),
            expressionInfo       : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckUpperLimitModifier,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActVisionRangeModifier(),
            expressionInfo       : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActVisionRangeModifier,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActIsPenetratingVision(),
            expressionInfo       : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActIsPenetratingVision,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActFlareRangeModifier(),
            expressionInfo       : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRangeModifier,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActFlareRadiusModifier(),
            expressionInfo       : WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRadiusModifier,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaPersistentModifyUnitAttribute>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0044, data.getConUnitFilter() ?? Lang_Constants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaPersistentModifyUnitAttribute>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        `${Lang_Utils.getText(Lang_Constants.TextType.B1170)}: ${Lang_Utils.getTextForYesOrNo(data.getIsEffectiveInMpw())}`,
        data.getActAttackPowerModifier()     ? `${WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActAttackPowerModifier.getTitleText()}: ${data.getActAttackPowerModifier()}`         : null,
        data.getActDefenseModifier()         ? `${WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActDefenseModifier.getTitleText()}: ${data.getActDefenseModifier()}`                 : null,
        data.getActMaxAttackRangeModifier()  ? `${WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActMaxAttackRangeModifier.getTitleText()}: ${data.getActMaxAttackRangeModifier()}`   : null,
        data.getActCanAttackAfterMoving()    ? `${WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActCanAttackAfterMoving.getTitleText()}: ${data.getActCanAttackAfterMoving()}`       : null,
        data.getActMoveRangeModifier()       ? `${WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActMoveRangeModifier.getTitleText()}: ${data.getActMoveRangeModifier()}`             : null,
        data.getActLuckLowerLimitModifier()  ? `${WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckLowerLimitModifier.getTitleText()}: ${data.getActLuckLowerLimitModifier()}`   : null,
        data.getActLuckUpperLimitModifier()  ? `${WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckUpperLimitModifier.getTitleText()}: ${data.getActLuckUpperLimitModifier()}`   : null,
        data.getActVisionRangeModifier()     ? `${WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActVisionRangeModifier.getTitleText()}: ${data.getActVisionRangeModifier()}`         : null,
        data.getActIsPenetratingVision()     ? `${WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActIsPenetratingVision.getTitleText()}: ${data.getActIsPenetratingVision()}`         : null,
        data.getActFlareRangeModifier()      ? `${WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRangeModifier.getTitleText()}: ${data.getActFlareRangeModifier()}`           : null,
        data.getActFlareRadiusModifier()     ? `${WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRadiusModifier.getTitleText()}: ${data.getActFlareRadiusModifier()}`         : null,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0044, data.getConUnitFilter() ?? Lang_Constants.UndefinedError)}\n${additionalText}`;
}

export function getErrorTip(data: WeaPersistentModifyUnitAttribute, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ConUnitFilter;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getConUnitFilter(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActAttackPowerModifier;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActAttackPowerModifier(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActDefenseModifier;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActDefenseModifier(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActMaxAttackRangeModifier;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActMaxAttackRangeModifier(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActCanAttackAfterMoving;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActCanAttackAfterMoving(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActMoveRangeModifier;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActMoveRangeModifier(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckLowerLimitModifier;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActLuckLowerLimitModifier(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActLuckUpperLimitModifier;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActLuckUpperLimitModifier(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActVisionRangeModifier;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActVisionRangeModifier(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActIsPenetratingVision;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActIsPenetratingVision(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRangeModifier;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActFlareRangeModifier(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_PersistentModifyUnitAttribute.ExpressionInfoDict.ActFlareRadiusModifier;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActFlareRadiusModifier(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeet(action: WeaPersistentModifyUnitAttribute, unit: Units_IUnit.IUnit): boolean {
    const war = unit.getWar();
    if ((!action.getIsEffectiveInMpw()) && (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar)) {
        return false;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(action.getConUnitFilter() ?? ``).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(war, unit)), true);
        return (epResult instanceof ExpressionParsers_Results_Num.Num) && (epResult.num != 0);
    } catch {
        return false;
    }
}

export function getAttackPowerModifierForUnit(action: WeaPersistentModifyUnitAttribute, unit: Units_IUnit.IUnit): number {
    const str = action.getActAttackPowerModifier();
    if (!str) {
        return 0;
    }

    if (!checkIsMeet(action, unit)) {
        return 0;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(str).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

export function getDefenseModifierForUnit(action: WeaPersistentModifyUnitAttribute, unit: Units_IUnit.IUnit): number {
    const str = action.getActDefenseModifier();
    if (!str) {
        return 0;
    }

    if (!checkIsMeet(action, unit)) {
        return 0;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(str).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

export function getFlareRadiusModifierForUnit(action: WeaPersistentModifyUnitAttribute, unit: Units_IUnit.IUnit): number {
    const str = action.getActFlareRadiusModifier();
    if (!str) {
        return 0;
    }

    if (!checkIsMeet(action, unit)) {
        return 0;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(str).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

export function getFlareRangeModifierForUnit(action: WeaPersistentModifyUnitAttribute, unit: Units_IUnit.IUnit): number {
    const str = action.getActFlareRangeModifier();
    if (!str) {
        return 0;
    }

    if (!checkIsMeet(action, unit)) {
        return 0;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(str).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

export function getLuckLowerLimitModifierForUnit(action: WeaPersistentModifyUnitAttribute, unit: Units_IUnit.IUnit): number {
    const str = action.getActLuckLowerLimitModifier();
    if (!str) {
        return 0;
    }

    if (!checkIsMeet(action, unit)) {
        return 0;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(str).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

export function getLuckUpperLimitModifierForUnit(action: WeaPersistentModifyUnitAttribute, unit: Units_IUnit.IUnit): number {
    const str = action.getActLuckUpperLimitModifier();
    if (!str) {
        return 0;
    }

    if (!checkIsMeet(action, unit)) {
        return 0;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(str).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

export function getMaxAttackRangeModifierForUnit(action: WeaPersistentModifyUnitAttribute, unit: Units_IUnit.IUnit): number {
    const str = action.getActMaxAttackRangeModifier();
    if (!str) {
        return 0;
    }

    if (!checkIsMeet(action, unit)) {
        return 0;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(str).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

export function getVisionRangeModifierForUnit(action: WeaPersistentModifyUnitAttribute, unit: Units_IUnit.IUnit): number {
    const str = action.getActVisionRangeModifier();
    if (!str) {
        return 0;
    }

    if (!checkIsMeet(action, unit)) {
        return 0;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(str).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

export function getIsPenetratingVisionForUnit(action: WeaPersistentModifyUnitAttribute, unit: Units_IUnit.IUnit): boolean | null {
    const str = action.getActIsPenetratingVision();
    if (!str) {
        return null;
    }

    if (!checkIsMeet(action, unit)) {
        return null;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(str).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num !== 0;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

export function getMoveRangeModifierForUnit(action: WeaPersistentModifyUnitAttribute, unit: Units_IUnit.IUnit): number {
    const str = action.getActMoveRangeModifier();
    if (!str) {
        return 0;
    }

    if (!checkIsMeet(action, unit)) {
        return 0;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(str).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num;
        } else {
            return 0;
        }
    } catch {
        return 0;
    }
}

export function getCanAttackAfterMovingForUnit(action: WeaPersistentModifyUnitAttribute, unit: Units_IUnit.IUnit): boolean | null {
    const str = action.getActCanAttackAfterMoving();
    if (!str) {
        return null;
    }

    if (!checkIsMeet(action, unit)) {
        return null;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(str).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), true);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num !== 0;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

export function applyWithExtraData(_action: WeaPersistentModifyUnitAttribute, war: BaseWar_Interface_IBwWar.IBwWar, actionId: number): void {
    war.getWarEventManager().updateOpaIdArrayOnExecuteAction(actionId);
}
export function applyWithoutExtraData(_action: WeaPersistentModifyUnitAttribute, war: BaseWar_Interface_IBwWar.IBwWar, actionId: number): void {
    war.getWarEventManager().updateOpaIdArrayOnExecuteAction(actionId);
}
