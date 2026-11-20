import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants, Lang_TextType,
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
    ConTileFilter : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : true,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.TileFilter),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0662),
    },
    ActPlayerIndex : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.PlayerIndex),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0663),
    },
    ActCurrentHp : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.Hp),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0664),
    },
    ActCurrentBuildPoint : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.BuildPoint),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0665),
    },
    ActCurrentCapturePoint : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.CapturePoint),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0666),
    },
    ActIsHighlighted : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.B0847),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0667),
    },
    ActGroupedLocationIdArray : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.NumberArray],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.Location),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0668),
    },
    ActCustomNameId : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.CustomNameId),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0961),
    },
};
