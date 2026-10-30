import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { War } from "../../../expressionParsers/contexts/War.ts";
import {
    ContextType,
    ResultType,
} from "../../../expressionParsers/Enums.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import {
    TextType,
    UndefinedError,
} from "../../../lang/Constants.ts";
import {
    getText,
    getFormattedText,
    getErrorText,
} from "../../../lang/Utils.ts";
import type { WecExpression } from "../../../proto/schema/CommonProto/WarEvent/WecExpression.ts";
import { Event } from "../../Constants.ts";

export function getBriefDesc(data: Undefinable<WecExpression>): string | null {
    if (data == null) {
        return null;
    }

    return getText(TextType.A0830);
}
export function getDetailedDesc(data: Undefinable<WecExpression>): string | null {
    if (data == null) {
        return null;
    }

    return [
        getText(TextType.A0830),
        `${data.getExpression() ?? UndefinedError}`
    ].join(`\n`);
}
export function getErrorTip(data: WecExpression, customCounterNameSet: Set<string>): string | null {
    const expression = data.getExpression() ?? "";
    if (expression !== expression.trim()) {
        return getText(TextType.A0495);
    }

    if (!expression) {
        return getFormattedText(TextType.F0091, getText(TextType.B0129));
    }

    if (expression.length > Event.MaxExpressionLength) {
        return getText(TextType.A0476);
    }

    const errorData = Parser.getErrorDataForString({
        str                     : expression,
        contextType             : ContextType.War,
        resultTypes             : [ResultType.Number],
        customCounterNameSet    : customCounterNameSet,
    });
    if (errorData.errorCode) {
        return errorData.errorText ?? getErrorText(errorData.errorCode);
    }

    return null;
}

export function checkIsValid(condition: Undefinable<WecExpression>, customCounterNameSet: Set<string>): boolean {
    if (condition == null) {
        return false;
    }

    const expression = condition.getExpression() ?? "";
    if ((!expression)                                                                           ||
        (expression !== expression.trim())                                                      ||
        (expression.length > Event.MaxExpressionLength)
    ) {
        return false;
    }

    return Parser.checkIsValidString({
        str                     : expression,
        contextType             : ContextType.War,
        resultTypes             : [ResultType.Number],
        customCounterNameSet    : customCounterNameSet,
    });
}

export function checkIsMeet(condition: WecExpression, war: IBwWar): boolean {
    try {
        const value = Parser.getParseResult(condition.getExpression() ?? "").eval(new War(war), false);
        return (value instanceof Num) && (value.num !== 0);
    } catch {
        return false;
    }
}
