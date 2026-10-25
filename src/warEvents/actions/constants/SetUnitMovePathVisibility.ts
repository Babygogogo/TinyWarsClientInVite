import { ContextType, ResultType } from "../../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../../expressionParsers/Types.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConPositionFilter   : EpExpressionInfo;
    ActVisibilityArray  : EpExpressionInfo;
} = {
    ConPositionFilter   : {
        contextType     : ContextType.Position,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.B1073),
        getHelpText     : () => getText(TextType.A0882),
    },
    ActVisibilityArray  : {
        contextType     : ContextType.Position,
        resultTypes     : [ResultType.NumberArray],
        isRequired      : true,
        getTitleText    : () => getText(TextType.B1339),
        getHelpText     : () => getText(TextType.A0883),
    },
};
