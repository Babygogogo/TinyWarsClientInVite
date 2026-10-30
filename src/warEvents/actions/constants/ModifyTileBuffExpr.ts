import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants,
    type ExpressionParsers_Types,
} from "../../../internal.ts";

export const ExpressionInfoDict: {
    ConTileFilter           : ExpressionParsers_Types.EpExpressionInfo;
    ConBuffFilter           : ExpressionParsers_Types.EpExpressionInfo;
    ActBuffType             : ExpressionParsers_Types.EpExpressionInfo;
    ActExpiringTurnIndex    : ExpressionParsers_Types.EpExpressionInfo;
    ActExpiringPlayerIndex  : ExpressionParsers_Types.EpExpressionInfo;
    ActExtraParams          : ExpressionParsers_Types.EpExpressionInfo;
} = {
    ConTileFilter: {
        contextType     : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.TileFilter),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0662),
    },
    ConBuffFilter: {
        contextType     : ExpressionParsers_Enums.ContextType.TileBuff,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.B1235),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0765),
    },
    ActBuffType: {
        contextType     : ExpressionParsers_Enums.ContextType.TileBuff,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.B0805),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0766),
    },
    ActExpiringTurnIndex: {
        contextType     : ExpressionParsers_Enums.ContextType.TileBuff,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.EndTurnIndex),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0767),
    },
    ActExpiringPlayerIndex: {
        contextType     : ExpressionParsers_Enums.ContextType.TileBuff,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.EndPlayerIndex),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0768),
    },
    ActExtraParams: {
        contextType     : ExpressionParsers_Enums.ContextType.TileBuff,
        resultTypes     : [ExpressionParsers_Enums.ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.B1229),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0769),
    },
};
