import * as ExpressionParsersEnums from "../../../expressionParsers/Enums.ts";
import type * as ExpressionParsersTypes from "../../../expressionParsers/Types.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConPositionFilter   : ExpressionParsersTypes.EpExpressionInfo;
    ActVisibilityArray  : ExpressionParsersTypes.EpExpressionInfo;
} = {
    ConPositionFilter   : {
        contextType     : ExpressionParsersEnums.ContextType.Position,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1073),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0882),
    },
    ActVisibilityArray  : {
        contextType     : ExpressionParsersEnums.ContextType.Position,
        resultTypes     : [ExpressionParsersEnums.ResultType.NumberArray],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1339),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0883),
    },
};
