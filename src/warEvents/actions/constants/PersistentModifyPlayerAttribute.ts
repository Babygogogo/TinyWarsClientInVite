import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants,
    type ExpressionParsers_Types,
} from "../../../internal.ts";

export const ExpressionInfoDict: {
    ConPlayerFilter                     : ExpressionParsers_Types.EpExpressionInfo;
    ActBannedUnitTypeArray              : ExpressionParsers_Types.EpExpressionInfo;
    ActUnbannedUnitTypeArray            : ExpressionParsers_Types.EpExpressionInfo;
    ActCanActivateCoSkill               : ExpressionParsers_Types.EpExpressionInfo;
    ActEnergyGrowthMultiplierModifier   : ExpressionParsers_Types.EpExpressionInfo;
    ActCoZoneRadiusModifier             : ExpressionParsers_Types.EpExpressionInfo;
    ActAiUnitProductionBonusScore       : ExpressionParsers_Types.EpExpressionInfo;
} = {
    ConPlayerFilter : {
        contextType  : ExpressionParsers_Enums.ContextType.Player,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : true,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.PlayerFilter),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0533),
    },
    ActBannedUnitTypeArray : {
        contextType  : ExpressionParsers_Enums.ContextType.Player,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number, ExpressionParsers_Enums.ResultType.NumberArray],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B0895),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0534),
    },
    ActUnbannedUnitTypeArray : {
        contextType  : ExpressionParsers_Enums.ContextType.Player,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number, ExpressionParsers_Enums.ResultType.NumberArray],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B1081),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0535),
    },
    ActCanActivateCoSkill : {
        contextType  : ExpressionParsers_Enums.ContextType.Player,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B0897),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0536),
    },
    ActEnergyGrowthMultiplierModifier : {
        contextType  : ExpressionParsers_Enums.ContextType.Player,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B1089),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0537),
    },
    ActCoZoneRadiusModifier : {
        contextType  : ExpressionParsers_Enums.ContextType.Player,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B1231),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0747),
    },
    ActAiUnitProductionBonusScore : {
        contextType  : ExpressionParsers_Enums.ContextType.NumberArray,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B1449),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0966),
    },
};
