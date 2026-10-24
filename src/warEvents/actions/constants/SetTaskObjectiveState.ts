import * as ExpressionParsersEnums from "../../../expressionParsers/Enums.ts";
import type * as ExpressionParsersTypes from "../../../expressionParsers/Types.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConTaskObjectiveFilter          : ExpressionParsersTypes.EpExpressionInfo;
    ActProgress                     : ExpressionParsersTypes.EpExpressionInfo;
    ActIsHidden                     : ExpressionParsersTypes.EpExpressionInfo;
    ActIsProgressUpdaterDisabled    : ExpressionParsersTypes.EpExpressionInfo;
} = {
    ConTaskObjectiveFilter       : {
        contextType     : ExpressionParsersEnums.ContextType.TaskObjective,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1223),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0727),
    },
    ActProgress : {
        contextType     : ExpressionParsersEnums.ContextType.TaskObjective,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1221),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0728),
    },
    ActIsHidden : {
        contextType     : ExpressionParsersEnums.ContextType.TaskObjective,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1222),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0729),
    },
    ActIsProgressUpdaterDisabled : {
        contextType     : ExpressionParsersEnums.ContextType.TaskObjective,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1227),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0732),
    },
};
