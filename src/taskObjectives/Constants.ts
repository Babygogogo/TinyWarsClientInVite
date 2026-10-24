import * as ExpressionParsersEnums from "../expressionParsers/Enums.ts";
import type * as ExpressionParsersTypes from "../expressionParsers/Types.ts";
import * as LangConstants from "../lang/Constants.ts";
import * as LangUtils from "../lang/Utils.ts";

type EpExpressionInfo   = ExpressionParsersTypes.EpExpressionInfo;

export const ExpressionInfoDict: {
    UpdaterForCurrentProgress   : EpExpressionInfo;
} = {
    UpdaterForCurrentProgress   : {
        contextType     : ExpressionParsersEnums.ContextType.TaskObjective,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1226),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0730),
    },
};
