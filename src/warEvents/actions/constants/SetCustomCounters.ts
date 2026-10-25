import { ContextType, ResultType } from "../../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../../expressionParsers/Types.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    IdExpression    : EpExpressionInfo;
    ValueExpression : EpExpressionInfo;
} = {
    IdExpression       : {
        contextType     : ContextType.CustomCounter,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.B0792),
        getHelpText     : () => getText(TextType.A0531),
    },
    ValueExpression : {
        contextType     : ContextType.CustomCounter,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.B0803),
        getHelpText     : () => getText(TextType.A0532),
    },
};
