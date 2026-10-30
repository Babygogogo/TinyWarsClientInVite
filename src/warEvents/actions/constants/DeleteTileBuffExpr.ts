import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants,
    type ExpressionParsers_Types,
} from "../../../internal.ts";

export const ExpressionInfoDict: {
    ConTileFilter           : ExpressionParsers_Types.EpExpressionInfo;
    ConTileBuffFilter       : ExpressionParsers_Types.EpExpressionInfo;
} = {
    ConTileFilter: {
        contextType     : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.TileFilter),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0662),
    },
    ConTileBuffFilter: {
        contextType     : ExpressionParsers_Enums.ContextType.TileBuff,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.B1235),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0760),
    },
};
