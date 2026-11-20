import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants, Lang_TextType,
    type ExpressionParsers_Types,
} from "../../../internal.ts";

export const ExpressionInfoDict: {
    ConPositionFilter   : ExpressionParsers_Types.EpExpressionInfo;
    ActVisibilityArray  : ExpressionParsers_Types.EpExpressionInfo;
} = {
    ConPositionFilter : {
        contextType  : ExpressionParsers_Enums.ContextType.Position,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : true,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.B1073),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0882),
    },
    ActVisibilityArray : {
        contextType  : ExpressionParsers_Enums.ContextType.Position,
        resultTypes  : [ExpressionParsers_Enums.ResultType.NumberArray],
        isRequired   : true,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.B1339),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0883),
    },
};
