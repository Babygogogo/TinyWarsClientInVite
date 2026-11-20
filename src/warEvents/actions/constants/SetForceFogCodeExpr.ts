import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants, Lang_TextType,
    type ExpressionParsers_Types,
} from "../../../internal.ts";

export const ExpressionInfoDict: {
    ForceFogCode    : ExpressionParsers_Types.EpExpressionInfo;
    TurnsCount      : ExpressionParsers_Types.EpExpressionInfo;
} = {
    ForceFogCode : {
        contextType  : ExpressionParsers_Enums.ContextType.War,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : true,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.B1185),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0584),
    },
    TurnsCount : {
        contextType  : ExpressionParsers_Enums.ContextType.War,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.Turns),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0585),
    },
};
