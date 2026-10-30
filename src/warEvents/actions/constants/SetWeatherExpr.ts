import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants,
    type ExpressionParsers_Types,
} from "../../../internal.ts";

export const ExpressionInfoDict: {
    WeatherType                         : ExpressionParsers_Types.EpExpressionInfo;
    WeatherTurnsCount                   : ExpressionParsers_Types.EpExpressionInfo;
} = {
    WeatherType       : {
        contextType     : ExpressionParsers_Enums.ContextType.Weather,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.Weather),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0526),
    },
    WeatherTurnsCount : {
        contextType     : ExpressionParsers_Enums.ContextType.Weather,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.Turns),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0527),
    },
};
