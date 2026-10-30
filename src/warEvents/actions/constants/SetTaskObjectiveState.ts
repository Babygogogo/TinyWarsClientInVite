import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants,
    type ExpressionParsers_Types,
} from "../../../internal.ts";

export const ExpressionInfoDict: {
    ConTaskObjectiveFilter          : ExpressionParsers_Types.EpExpressionInfo;
    ActProgress                     : ExpressionParsers_Types.EpExpressionInfo;
    ActIsHidden                     : ExpressionParsers_Types.EpExpressionInfo;
    ActIsProgressUpdaterDisabled    : ExpressionParsers_Types.EpExpressionInfo;
} = {
    ConTaskObjectiveFilter       : {
        contextType     : ExpressionParsers_Enums.ContextType.TaskObjective,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.B1223),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0727),
    },
    ActProgress : {
        contextType     : ExpressionParsers_Enums.ContextType.TaskObjective,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.B1221),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0728),
    },
    ActIsHidden : {
        contextType     : ExpressionParsers_Enums.ContextType.TaskObjective,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.B1222),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0729),
    },
    ActIsProgressUpdaterDisabled : {
        contextType     : ExpressionParsers_Enums.ContextType.TaskObjective,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.B1227),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0732),
    },
};
