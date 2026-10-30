import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants,
    type ExpressionParsers_Types,
} from "../../../internal.ts";

export const ExpressionInfoDict: {
    ConTileFilter                       : ExpressionParsers_Types.EpExpressionInfo;
    ActPlayerIndex                      : ExpressionParsers_Types.EpExpressionInfo;
    ActCurrentHp                        : ExpressionParsers_Types.EpExpressionInfo;
    ActCurrentBuildPoint                : ExpressionParsers_Types.EpExpressionInfo;
    ActCurrentCapturePoint              : ExpressionParsers_Types.EpExpressionInfo;
    ActIsHighlighted                    : ExpressionParsers_Types.EpExpressionInfo;
    ActGroupedLocationIdArray           : ExpressionParsers_Types.EpExpressionInfo;
    ActCustomNameId                     : ExpressionParsers_Types.EpExpressionInfo;
} = {
    ConTileFilter       : {
        contextType     : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.TileFilter),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0662),
    },
    ActPlayerIndex : {
        contextType     : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.PlayerIndex),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0663),
    },
    ActCurrentHp : {
        contextType     : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.Hp),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0664),
    },
    ActCurrentBuildPoint : {
        contextType     : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.BuildPoint),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0665),
    },
    ActCurrentCapturePoint : {
        contextType     : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.CapturePoint),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0666),
    },
    ActIsHighlighted : {
        contextType     : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.B0847),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0667),
    },
    ActGroupedLocationIdArray : {
        contextType     : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes     : [ExpressionParsers_Enums.ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.Location),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0668),
    },
    ActCustomNameId : {
        contextType     : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.CustomNameId),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0961),
    },
};
