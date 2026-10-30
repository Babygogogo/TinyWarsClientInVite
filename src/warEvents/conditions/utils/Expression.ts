import {
    ExpressionParsers_Enums,
    WarEvents_Constants,
    Lang_Utils,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Parser,
    Lang_Constants,
    ExpressionParsers_Contexts_War,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WecExpression } from "../../../proto/schema/CommonProto/WarEvent/WecExpression.ts";

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecExpression>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getText(Lang_Constants.TextType.A0830);
}
export function getDetailedDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecExpression>): string | null {
    if (data == null) {
        return null;
    }

    return [
        Lang_Utils.getText(Lang_Constants.TextType.A0830),
        `${data.getExpression() ?? Lang_Constants.UndefinedError}`,
    ].join(`\n`);
}
export function getErrorTip(data: WecExpression, customCounterNameSet: Set<string>): string | null {
    const expression = data.getExpression() ?? "";
    if (expression !== expression.trim()) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0495);
    }

    if (!expression) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0129));
    }

    if (expression.length > WarEvents_Constants.Event.MaxExpressionLength) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0476);
    }

    const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString({
        str                  : expression,
        contextType          : ExpressionParsers_Enums.ContextType.War,
        resultTypes          : [ExpressionParsers_Enums.ResultType.Number],
        customCounterNameSet : customCounterNameSet,
    });
    if (errorData.errorCode) {
        return errorData.errorText ?? Lang_Utils.getErrorText(errorData.errorCode);
    }

    return null;
}

export function checkIsValid(condition: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecExpression>, customCounterNameSet: Set<string>): boolean {
    if (condition == null) {
        return false;
    }

    const expression = condition.getExpression() ?? "";
    if ((!expression)                                                                           ||
        (expression !== expression.trim())                                                      ||
        (expression.length > WarEvents_Constants.Event.MaxExpressionLength)
    ) {
        return false;
    }

    return ExpressionParsers_Parser.Parser.checkIsValidString({
        str                  : expression,
        contextType          : ExpressionParsers_Enums.ContextType.War,
        resultTypes          : [ExpressionParsers_Enums.ResultType.Number],
        customCounterNameSet : customCounterNameSet,
    });
}

export function checkIsMeet(condition: WecExpression, war: BaseWar_Interface_IBwWar.IBwWar): boolean {
    try {
        const value = ExpressionParsers_Parser.Parser.getParseResult(condition.getExpression() ?? "").eval(new ExpressionParsers_Contexts_War.War(war), false);
        return (value instanceof ExpressionParsers_Results_Num.Num) && (value.num !== 0);
    } catch {
        return false;
    }
}
