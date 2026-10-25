import { ContextType, ResultType } from "../../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../../expressionParsers/Types.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    WeatherType                         : EpExpressionInfo;
    WeatherTurnsCount                   : EpExpressionInfo;
} = {
    WeatherType       : {
        contextType     : ContextType.Weather,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.Weather),
        getHelpText     : () => getText(TextType.A0526),
    },
    WeatherTurnsCount : {
        contextType     : ContextType.Weather,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.Turns),
        getHelpText     : () => getText(TextType.A0527),
    },
};
