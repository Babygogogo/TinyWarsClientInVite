import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants, Lang_TextType,
    type ExpressionParsers_Types,
} from "../internal.ts";

export const ExpressionInfoDict: {
    UpdaterForCurrentProgress   : ExpressionParsers_Types.EpExpressionInfo;
} = {
    UpdaterForCurrentProgress : {
        contextType  : ExpressionParsers_Enums.ContextType.TaskObjective,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.B1226),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0730),
    },
};

export const enum Common {
    MaxObjectivesCount = 10,
    MaxDescLength = 100,
}
