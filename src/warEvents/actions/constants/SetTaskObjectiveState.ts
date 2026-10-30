import {
    ContextType,
    ResultType,
} from "../../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../../expressionParsers/Types.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConTaskObjectiveFilter          : EpExpressionInfo;
    ActProgress                     : EpExpressionInfo;
    ActIsHidden                     : EpExpressionInfo;
    ActIsProgressUpdaterDisabled    : EpExpressionInfo;
} = {
    ConTaskObjectiveFilter       : {
        contextType     : ContextType.TaskObjective,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.B1223),
        getHelpText     : () => getText(TextType.A0727),
    },
    ActProgress : {
        contextType     : ContextType.TaskObjective,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1221),
        getHelpText     : () => getText(TextType.A0728),
    },
    ActIsHidden : {
        contextType     : ContextType.TaskObjective,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1222),
        getHelpText     : () => getText(TextType.A0729),
    },
    ActIsProgressUpdaterDisabled : {
        contextType     : ContextType.TaskObjective,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1227),
        getHelpText     : () => getText(TextType.A0732),
    },
};
