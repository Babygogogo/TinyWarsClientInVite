import { ContextType, ResultType } from "../expressionParsers/Enums.ts";
import type { EpExpressionInfo as ExpressionParsersTypesEpExpressionInfo } from "../expressionParsers/Types.ts";
import { TextType } from "../lang/Constants.ts";
import { getText } from "../lang/Utils.ts";

type EpExpressionInfo   = ExpressionParsersTypesEpExpressionInfo;

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
