import * as ExpressionParsersEnums from "../../../expressionParsers/Enums.ts";
import type * as ExpressionParsersTypes from "../../../expressionParsers/Types.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConTileFilter           : ExpressionParsersTypes.EpExpressionInfo;
    ConBuffFilter           : ExpressionParsersTypes.EpExpressionInfo;
    ActBuffType             : ExpressionParsersTypes.EpExpressionInfo;
    ActExpiringTurnIndex    : ExpressionParsersTypes.EpExpressionInfo;
    ActExpiringPlayerIndex  : ExpressionParsersTypes.EpExpressionInfo;
    ActExtraParams          : ExpressionParsersTypes.EpExpressionInfo;
} = {
    ConTileFilter: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.TileFilter),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0662),
    },
    ConBuffFilter: {
        contextType     : ExpressionParsersEnums.ContextType.TileBuff,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1235),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0765),
    },
    ActBuffType: {
        contextType     : ExpressionParsersEnums.ContextType.TileBuff,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B0805),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0766),
    },
    ActExpiringTurnIndex: {
        contextType     : ExpressionParsersEnums.ContextType.TileBuff,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.EndTurnIndex),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0767),
    },
    ActExpiringPlayerIndex: {
        contextType     : ExpressionParsersEnums.ContextType.TileBuff,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.EndPlayerIndex),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0768),
    },
    ActExtraParams: {
        contextType     : ExpressionParsersEnums.ContextType.TileBuff,
        resultTypes     : [ExpressionParsersEnums.ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1229),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0769),
    },
};
