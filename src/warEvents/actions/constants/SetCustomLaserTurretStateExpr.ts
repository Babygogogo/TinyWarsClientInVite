import * as ExpressionParsersEnums from "../../../expressionParsers/Enums.ts";
import type * as ExpressionParsersTypes from "../../../expressionParsers/Types.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConTileFilter                   : ExpressionParsersTypes.EpExpressionInfo;
    ActRangeForUp                   : ExpressionParsersTypes.EpExpressionInfo;
    ActRangeForDown                 : ExpressionParsersTypes.EpExpressionInfo;
    ActRangeForLeft                 : ExpressionParsersTypes.EpExpressionInfo;
    ActRangeForRight                : ExpressionParsersTypes.EpExpressionInfo;
    ActPriority                     : ExpressionParsersTypes.EpExpressionInfo;
    ActCanAffectSelf                : ExpressionParsersTypes.EpExpressionInfo;
    ActCanAffectAlly                : ExpressionParsersTypes.EpExpressionInfo;
    ActCanAffectEnemy               : ExpressionParsersTypes.EpExpressionInfo;
    ActOffsetHp                     : ExpressionParsersTypes.EpExpressionInfo;
    ActCanBeFatal                   : ExpressionParsersTypes.EpExpressionInfo;
    ActOffsetFuelPercentage         : ExpressionParsersTypes.EpExpressionInfo;
    ActOffsetPrimaryAmmoPercentage  : ExpressionParsersTypes.EpExpressionInfo;
} = {
    ConTileFilter: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.TileFilter),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0662),
    },
    ActRangeForUp: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.RangeUp),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0680),
    },
    ActRangeForDown: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.RangeDown),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0681),
    },
    ActRangeForLeft: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.RangeLeft),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0682),
    },
    ActRangeForRight: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.RangeRight),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0683),
    },
    ActPriority: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.Priority),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0671),
    },
    ActCanAffectSelf: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.AffectOwner),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0672),
    },
    ActCanAffectAlly: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.AffectAlly),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0673),
    },
    ActCanAffectEnemy: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.AffectEnemy),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0674),
    },
    ActOffsetHp: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.UnitsHpOffset),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0677),
    },
    ActCanBeFatal: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.CanBeFatal),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0967),
    },
    ActOffsetFuelPercentage: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.UnitsFuelOffset$),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0678),
    },
    ActOffsetPrimaryAmmoPercentage: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.UnitsPriAmmoOffset$),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0679),
    },
};
