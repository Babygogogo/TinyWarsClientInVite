import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersContextsWar from "../../../expressionParsers/contexts/War.ts";
import * as ExpressionParsersEnums from "../../../expressionParsers/Enums.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWecExpression from "../../../proto/schema/CommonProto/WarEvent/WecExpression.ts";
import * as WarEventsConstants from "../../Constants.ts";

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWecExpression.WecExpression>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getText(LangConstants.TextType.A0830);
}
export function getDetailedDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWecExpression.WecExpression>): string | null {
    if (data == null) {
        return null;
    }

    return [
        LangUtils.getText(LangConstants.TextType.A0830),
        `${data.getExpression() ?? LangConstants.UndefinedError}`
    ].join(`\n`);
}
export function getErrorTip(data: ProtoSchemaCommonProtoWarEventWecExpression.WecExpression, customCounterNameSet: Set<string>): string | null {
    const expression = data.getExpression() ?? "";
    if (expression !== expression.trim()) {
        return LangUtils.getText(LangConstants.TextType.A0495);
    }

    if (!expression) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0129));
    }

    if (expression.length > WarEventsConstants.Event.MaxExpressionLength) {
        return LangUtils.getText(LangConstants.TextType.A0476);
    }

    const errorData = ExpressionParsersParser.Parser.getErrorDataForString({
        str                     : expression,
        contextType             : ExpressionParsersEnums.ContextType.War,
        resultTypes             : [ExpressionParsersEnums.ResultType.Number],
        customCounterNameSet    : customCounterNameSet,
    });
    if (errorData.errorCode) {
        return errorData.errorText ?? LangUtils.getErrorText(errorData.errorCode);
    }

    return null;
}

export function checkIsValid(condition: AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarEventWecExpression.WecExpression>, customCounterNameSet: Set<string>): boolean {
    if (condition == null) {
        return false;
    }

    const expression = condition.getExpression() ?? "";
    if ((!expression)                                                                           ||
        (expression !== expression.trim())                                                      ||
        (expression.length > WarEventsConstants.Event.MaxExpressionLength)
    ) {
        return false;
    }

    return ExpressionParsersParser.Parser.checkIsValidString({
        str                     : expression,
        contextType             : ExpressionParsersEnums.ContextType.War,
        resultTypes             : [ExpressionParsersEnums.ResultType.Number],
        customCounterNameSet    : customCounterNameSet,
    });
}

export function checkIsMeet(condition: ProtoSchemaCommonProtoWarEventWecExpression.WecExpression, war: BaseWarInterfaceIBwWar.IBwWar): boolean {
    try {
        const value = ExpressionParsersParser.Parser.getParseResult(condition.getExpression() ?? "").eval(new ExpressionParsersContextsWar.War(war), false);
        return (value instanceof ExpressionParsersResultsNum.Num) && (value.num !== 0);
    } catch {
        return false;
    }
}
