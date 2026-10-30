import {
    ContextType,
    ResultType,
} from "../../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../../expressionParsers/Types.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConUnitFilter           : EpExpressionInfo;
    ActPlayerAliveState     : EpExpressionInfo;
} = {
    ConUnitFilter       : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.UnitFilter),
        getHelpText     : () => getText(TextType.A0621),
    },
    ActPlayerAliveState : {
        contextType     : ContextType.Player,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.PlayerAliveState),
        getHelpText     : () => getText(TextType.A0884),
    },
};
