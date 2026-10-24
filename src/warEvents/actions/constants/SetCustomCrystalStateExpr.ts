import * as ExpressionParsersEnums from "../../../expressionParsers/Enums.ts";
import type * as ExpressionParsersTypes from "../../../expressionParsers/Types.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConTileFilter                   : ExpressionParsersTypes.EpExpressionInfo;
    ActRadius                       : ExpressionParsersTypes.EpExpressionInfo;
    ActPriority                     : ExpressionParsersTypes.EpExpressionInfo;
    ActCanAffectSelf                : ExpressionParsersTypes.EpExpressionInfo;
    ActCanAffectAlly                : ExpressionParsersTypes.EpExpressionInfo;
    ActCanAffectEnemy               : ExpressionParsersTypes.EpExpressionInfo;
    ActOffsetFund                   : ExpressionParsersTypes.EpExpressionInfo;
    ActOffsetEnergyPercentage       : ExpressionParsersTypes.EpExpressionInfo;
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
    ActRadius: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.EffectiveRadius),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0670),
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
    ActOffsetFund: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.FundOffset),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0675),
    },
    ActOffsetEnergyPercentage: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.CoEnergyOffset$),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0676),
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
