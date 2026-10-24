import * as ExpressionParsersEnums from "../../../expressionParsers/Enums.ts";
import type * as ExpressionParsersTypes from "../../../expressionParsers/Types.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConTileFilter                       : ExpressionParsersTypes.EpExpressionInfo;
    ActPlayerIndex                      : ExpressionParsersTypes.EpExpressionInfo;
    ActCurrentHp                        : ExpressionParsersTypes.EpExpressionInfo;
    ActCurrentBuildPoint                : ExpressionParsersTypes.EpExpressionInfo;
    ActCurrentCapturePoint              : ExpressionParsersTypes.EpExpressionInfo;
    ActIsHighlighted                    : ExpressionParsersTypes.EpExpressionInfo;
    ActGroupedLocationIdArray           : ExpressionParsersTypes.EpExpressionInfo;
    ActCustomNameId                     : ExpressionParsersTypes.EpExpressionInfo;
} = {
    ConTileFilter       : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.TileFilter),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0662),
    },
    ActPlayerIndex : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.PlayerIndex),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0663),
    },
    ActCurrentHp : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.Hp),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0664),
    },
    ActCurrentBuildPoint : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.BuildPoint),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0665),
    },
    ActCurrentCapturePoint : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.CapturePoint),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0666),
    },
    ActIsHighlighted : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B0847),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0667),
    },
    ActGroupedLocationIdArray : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.Location),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0668),
    },
    ActCustomNameId : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.CustomNameId),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0961),
    },
};
