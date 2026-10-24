import * as ExpressionParsersEnums from "../../../expressionParsers/Enums.ts";
import type * as ExpressionParsersTypes from "../../../expressionParsers/Types.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    WeatherType                         : ExpressionParsersTypes.EpExpressionInfo;
    WeatherTurnsCount                   : ExpressionParsersTypes.EpExpressionInfo;
} = {
    WeatherType       : {
        contextType     : ExpressionParsersEnums.ContextType.Weather,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.Weather),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0526),
    },
    WeatherTurnsCount : {
        contextType     : ExpressionParsersEnums.ContextType.Weather,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.Turns),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0527),
    },
};
