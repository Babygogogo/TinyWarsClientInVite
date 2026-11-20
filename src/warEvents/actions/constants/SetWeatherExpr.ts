import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants, Lang_TextType,
    type ExpressionParsers_Types,
} from "../../../internal.ts";

export const ExpressionInfoDict: {
    WeatherType                         : ExpressionParsers_Types.EpExpressionInfo;
    WeatherTurnsCount                   : ExpressionParsers_Types.EpExpressionInfo;
} = {
    WeatherType : {
        contextType  : ExpressionParsers_Enums.ContextType.Weather,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : true,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.Weather),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0526),
    },
    WeatherTurnsCount : {
        contextType  : ExpressionParsers_Enums.ContextType.Weather,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : true,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.Turns),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0527),
    },
};
