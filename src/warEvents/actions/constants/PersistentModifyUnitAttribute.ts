import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants,
    type ExpressionParsers_Types,
} from "../../../internal.ts";

export const ExpressionInfoDict: {
    ConUnitFilter               : ExpressionParsers_Types.EpExpressionInfo;
    ActAttackPowerModifier      : ExpressionParsers_Types.EpExpressionInfo;
    ActDefenseModifier          : ExpressionParsers_Types.EpExpressionInfo;
    ActMaxAttackRangeModifier   : ExpressionParsers_Types.EpExpressionInfo;
    ActCanAttackAfterMoving     : ExpressionParsers_Types.EpExpressionInfo;
    ActMoveRangeModifier        : ExpressionParsers_Types.EpExpressionInfo;
    ActLuckLowerLimitModifier   : ExpressionParsers_Types.EpExpressionInfo;
    ActLuckUpperLimitModifier   : ExpressionParsers_Types.EpExpressionInfo;
    ActVisionRangeModifier      : ExpressionParsers_Types.EpExpressionInfo;
    ActIsPenetratingVision      : ExpressionParsers_Types.EpExpressionInfo;
    ActFlareRangeModifier       : ExpressionParsers_Types.EpExpressionInfo;
    ActFlareRadiusModifier      : ExpressionParsers_Types.EpExpressionInfo;
} = {
    ConUnitFilter : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : true,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.UnitFilter),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0539),
    },
    ActAttackPowerModifier : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B0183),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0540),
    },
    ActDefenseModifier : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.DefBonus$),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0541),
    },
    ActMaxAttackRangeModifier : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B1077),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0543),
    },
    ActCanAttackAfterMoving : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B0346),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0548),
    },
    ActMoveRangeModifier : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B1078),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0542),
    },
    ActLuckLowerLimitModifier : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B1085),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0544),
    },
    ActLuckUpperLimitModifier : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B1086),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0545),
    },
    ActVisionRangeModifier : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B1084),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0643),
    },
    ActIsPenetratingVision : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B1195),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0644),
    },
    ActFlareRangeModifier : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B1087),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0546),
    },
    ActFlareRadiusModifier : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B1088),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0547),
    },
};
