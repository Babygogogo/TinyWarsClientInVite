import { ContextType, ResultType } from "../../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../../expressionParsers/Types.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConUnitFilter                       : EpExpressionInfo;
    ActPlayerIndex                      : EpExpressionInfo;
} = {
    ConUnitFilter       : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.UnitFilter),
        getHelpText     : () => getText(TextType.A0624),
    },
    ActPlayerIndex : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.PlayerIndex),
        getHelpText     : () => getText(TextType.A0625),
    },
};
