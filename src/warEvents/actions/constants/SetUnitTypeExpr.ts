import * as ExpressionParsersEnums from "../../../expressionParsers/Enums.ts";
import type * as ExpressionParsersTypes from "../../../expressionParsers/Types.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConUnitFilter                       : ExpressionParsersTypes.EpExpressionInfo;
    ActUnitType                         : ExpressionParsersTypes.EpExpressionInfo;
} = {
    ConUnitFilter       : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.UnitFilter),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0622),
    },
    ActUnitType : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B0525),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0623),
    },
};
