import { ContextType, ResultType } from "../../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../../expressionParsers/Types.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ForceFogCode    : EpExpressionInfo;
    TurnsCount      : EpExpressionInfo;
} = {
    ForceFogCode       : {
        contextType     : ContextType.War,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.B1185),
        getHelpText     : () => getText(TextType.A0584),
    },
    TurnsCount : {
        contextType     : ContextType.War,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.Turns),
        getHelpText     : () => getText(TextType.A0585),
    },
};
