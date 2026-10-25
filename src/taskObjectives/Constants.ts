import { ContextType, ResultType } from "../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../expressionParsers/Types.ts";
import { TextType } from "../lang/Constants.ts";
import { getText } from "../lang/Utils.ts";

export const ExpressionInfoDict: {
    UpdaterForCurrentProgress   : EpExpressionInfo;
} = {
    UpdaterForCurrentProgress   : {
        contextType     : ContextType.TaskObjective,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1226),
        getHelpText     : () => getText(TextType.A0730),
    },
};
