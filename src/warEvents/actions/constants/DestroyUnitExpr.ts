import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants,
    type ExpressionParsers_Types,
} from "../../../internal.ts";

export const ExpressionInfoDict: {
    ConUnitFilter           : ExpressionParsers_Types.EpExpressionInfo;
    ActPlayerAliveState     : ExpressionParsers_Types.EpExpressionInfo;
} = {
    ConUnitFilter : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : true,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.UnitFilter),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0621),
    },
    ActPlayerAliveState : {
        contextType  : ExpressionParsers_Enums.ContextType.Player,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.PlayerAliveState),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0884),
    },
};
