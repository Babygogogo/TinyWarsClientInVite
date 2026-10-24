import * as ExpressionParsersEnums from "../../../expressionParsers/Enums.ts";
import type * as ExpressionParsersTypes from "../../../expressionParsers/Types.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ForceFogCode    : ExpressionParsersTypes.EpExpressionInfo;
    TurnsCount      : ExpressionParsersTypes.EpExpressionInfo;
} = {
    ForceFogCode       : {
        contextType     : ExpressionParsersEnums.ContextType.War,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1185),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0584),
    },
    TurnsCount : {
        contextType     : ExpressionParsersEnums.ContextType.War,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.Turns),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0585),
    },
};
