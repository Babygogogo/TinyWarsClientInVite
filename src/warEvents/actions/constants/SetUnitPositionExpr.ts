import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants,
    type ExpressionParsers_Types,
} from "../../../internal.ts";

export const ExpressionInfoDict: {
    ConUnitFilter                       : ExpressionParsers_Types.EpExpressionInfo;
    ActDestination                      : ExpressionParsers_Types.EpExpressionInfo;
    ActAlternativeTileFilter            : ExpressionParsers_Types.EpExpressionInfo;
} = {
    ConUnitFilter       : {
        contextType     : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.UnitFilter),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0645),
    },
    ActDestination : {
        contextType     : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Tile, ExpressionParsers_Enums.ResultType.Position],
        isRequired      : true,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.B1196),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0646),
    },
    ActAlternativeTileFilter : {
        contextType     : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.B1197),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0647),
    },
};
