import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants,
    type ExpressionParsers_Types,
} from "../../../internal.ts";

export const ExpressionInfoDict: {
    Targets             : ExpressionParsers_Types.EpExpressionInfo;
    NeedFocusEffect     : ExpressionParsers_Types.EpExpressionInfo;
    IsOneByOne          : ExpressionParsers_Types.EpExpressionInfo;
    Interval            : ExpressionParsers_Types.EpExpressionInfo;
} = {
    Targets : {
        contextType : ExpressionParsers_Enums.ContextType.War,
        resultTypes : [
            ExpressionParsers_Enums.ResultType.Position,
            ExpressionParsers_Enums.ResultType.PositionArray,
            ExpressionParsers_Enums.ResultType.Unit,
            ExpressionParsers_Enums.ResultType.UnitArray,
            ExpressionParsers_Enums.ResultType.Tile,
            ExpressionParsers_Enums.ResultType.TileArray,
        ],
        isRequired   : true,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B1183),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0580),
    },
    NeedFocusEffect : {
        contextType  : ExpressionParsers_Enums.ContextType.War,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B0714),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0581),
    },
    IsOneByOne : {
        contextType  : ExpressionParsers_Enums.ContextType.War,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B1184),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0582),
    },
    Interval : {
        contextType  : ExpressionParsers_Enums.ContextType.War,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B1035),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0583),
    },
};
