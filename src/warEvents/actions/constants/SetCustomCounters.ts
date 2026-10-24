import * as ExpressionParsersEnums from "../../../expressionParsers/Enums.ts";
import type * as ExpressionParsersTypes from "../../../expressionParsers/Types.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    IdExpression    : ExpressionParsersTypes.EpExpressionInfo;
    ValueExpression : ExpressionParsersTypes.EpExpressionInfo;
} = {
    IdExpression       : {
        contextType     : ExpressionParsersEnums.ContextType.CustomCounter,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B0792),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0531),
    },
    ValueExpression : {
        contextType     : ExpressionParsersEnums.ContextType.CustomCounter,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B0803),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0532),
    },
};
