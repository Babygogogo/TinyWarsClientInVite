import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants, Lang_TextType,
    type ExpressionParsers_Types,
} from "../../../internal.ts";

export const ExpressionInfoDict: {
    IdExpression    : ExpressionParsers_Types.EpExpressionInfo;
    ValueExpression : ExpressionParsers_Types.EpExpressionInfo;
} = {
    IdExpression : {
        contextType  : ExpressionParsers_Enums.ContextType.CustomCounter,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : true,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.B0792),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0531),
    },
    ValueExpression : {
        contextType  : ExpressionParsers_Enums.ContextType.CustomCounter,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : true,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.B0803),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0532),
    },
};
