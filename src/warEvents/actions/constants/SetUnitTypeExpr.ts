import { ContextType, ResultType } from "../../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../../expressionParsers/Types.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConUnitFilter                       : EpExpressionInfo;
    ActUnitType                         : EpExpressionInfo;
} = {
    ConUnitFilter       : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.UnitFilter),
        getHelpText     : () => getText(TextType.A0622),
    },
    ActUnitType : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.B0525),
        getHelpText     : () => getText(TextType.A0623),
    },
};
