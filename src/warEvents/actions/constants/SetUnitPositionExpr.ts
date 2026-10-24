import * as ExpressionParsersEnums from "../../../expressionParsers/Enums.ts";
import type * as ExpressionParsersTypes from "../../../expressionParsers/Types.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConUnitFilter                       : ExpressionParsersTypes.EpExpressionInfo;
    ActDestination                      : ExpressionParsersTypes.EpExpressionInfo;
    ActAlternativeTileFilter            : ExpressionParsersTypes.EpExpressionInfo;
} = {
    ConUnitFilter       : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.UnitFilter),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0645),
    },
    ActDestination : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Tile, ExpressionParsersEnums.ResultType.Position],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1196),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0646),
    },
    ActAlternativeTileFilter : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1197),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0647),
    },
};
