import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants,
    type ExpressionParsers_Types,
} from "../../../internal.ts";

export const ExpressionInfoDict: {
    ConTileFilter                   : ExpressionParsers_Types.EpExpressionInfo;
    ActRangeForUp                   : ExpressionParsers_Types.EpExpressionInfo;
    ActRangeForDown                 : ExpressionParsers_Types.EpExpressionInfo;
    ActRangeForLeft                 : ExpressionParsers_Types.EpExpressionInfo;
    ActRangeForRight                : ExpressionParsers_Types.EpExpressionInfo;
    ActPriority                     : ExpressionParsers_Types.EpExpressionInfo;
    ActCanAffectSelf                : ExpressionParsers_Types.EpExpressionInfo;
    ActCanAffectAlly                : ExpressionParsers_Types.EpExpressionInfo;
    ActCanAffectEnemy               : ExpressionParsers_Types.EpExpressionInfo;
    ActMaxTargetCount               : ExpressionParsers_Types.EpExpressionInfo;
    ActOffsetHp                     : ExpressionParsers_Types.EpExpressionInfo;
    ActCanBeFatal                   : ExpressionParsers_Types.EpExpressionInfo;
    ActOffsetFuelPercentage         : ExpressionParsers_Types.EpExpressionInfo;
    ActOffsetPrimaryAmmoPercentage  : ExpressionParsers_Types.EpExpressionInfo;
} = {
    ConTileFilter : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : true,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.TileFilter),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0662),
    },
    ActRangeForUp : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.RangeUp),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0680),
    },
    ActRangeForDown : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.RangeDown),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0681),
    },
    ActRangeForLeft : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.RangeLeft),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0682),
    },
    ActRangeForRight : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.RangeRight),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0683),
    },
    ActPriority : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.Priority),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0671),
    },
    ActCanAffectSelf : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.AffectOwner),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0672),
    },
    ActCanAffectAlly : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.AffectAlly),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0673),
    },
    ActCanAffectEnemy : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.AffectEnemy),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0674),
    },
    ActMaxTargetCount : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.MaxTargets),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0684),
    },
    ActOffsetHp : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.UnitsHpOffset),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0677),
    },
    ActCanBeFatal : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.CanBeFatal),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0967),
    },
    ActOffsetFuelPercentage : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.UnitsFuelOffset$),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0678),
    },
    ActOffsetPrimaryAmmoPercentage : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.UnitsPriAmmoOffset$),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0679),
    },
};
