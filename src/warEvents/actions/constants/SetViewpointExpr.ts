import * as ExpressionParsersEnums from "../../../expressionParsers/Enums.ts";
import type * as ExpressionParsersTypes from "../../../expressionParsers/Types.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    Targets             : ExpressionParsersTypes.EpExpressionInfo;
    NeedFocusEffect     : ExpressionParsersTypes.EpExpressionInfo;
    IsOneByOne          : ExpressionParsersTypes.EpExpressionInfo;
    Interval            : ExpressionParsersTypes.EpExpressionInfo;
} = {
    Targets       : {
        contextType     : ExpressionParsersEnums.ContextType.War,
        resultTypes     : [
            ExpressionParsersEnums.ResultType.Position,
            ExpressionParsersEnums.ResultType.PositionArray,
            ExpressionParsersEnums.ResultType.Unit,
            ExpressionParsersEnums.ResultType.UnitArray,
            ExpressionParsersEnums.ResultType.Tile,
            ExpressionParsersEnums.ResultType.TileArray,
        ],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1183),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0580),
    },
    NeedFocusEffect : {
        contextType     : ExpressionParsersEnums.ContextType.War,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B0714),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0581),
    },
    IsOneByOne : {
        contextType     : ExpressionParsersEnums.ContextType.War,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1184),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0582),
    },
    Interval : {
        contextType     : ExpressionParsersEnums.ContextType.War,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1035),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0583),
    },
};
