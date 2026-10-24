import * as ExpressionParsersEnums from "../../../expressionParsers/Enums.ts";
import type * as ExpressionParsersTypes from "../../../expressionParsers/Types.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConUnitFilter               : ExpressionParsersTypes.EpExpressionInfo;
    ActAttackPowerModifier      : ExpressionParsersTypes.EpExpressionInfo;
    ActDefenseModifier          : ExpressionParsersTypes.EpExpressionInfo;
    ActMaxAttackRangeModifier   : ExpressionParsersTypes.EpExpressionInfo;
    ActCanAttackAfterMoving     : ExpressionParsersTypes.EpExpressionInfo;
    ActMoveRangeModifier        : ExpressionParsersTypes.EpExpressionInfo;
    ActLuckLowerLimitModifier   : ExpressionParsersTypes.EpExpressionInfo;
    ActLuckUpperLimitModifier   : ExpressionParsersTypes.EpExpressionInfo;
    ActVisionRangeModifier      : ExpressionParsersTypes.EpExpressionInfo;
    ActIsPenetratingVision      : ExpressionParsersTypes.EpExpressionInfo;
    ActFlareRangeModifier       : ExpressionParsersTypes.EpExpressionInfo;
    ActFlareRadiusModifier      : ExpressionParsersTypes.EpExpressionInfo;
} = {
    ConUnitFilter: {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.UnitFilter),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0539),
    },
    ActAttackPowerModifier: {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B0183),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0540),
    },
    ActDefenseModifier: {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.DefBonus$),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0541),
    },
    ActMaxAttackRangeModifier: {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1077),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0543),
    },
    ActCanAttackAfterMoving: {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B0346),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0548),
    },
    ActMoveRangeModifier: {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1078),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0542),
    },
    ActLuckLowerLimitModifier: {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1085),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0544),
    },
    ActLuckUpperLimitModifier: {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1086),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0545),
    },
    ActVisionRangeModifier: {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1084),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0643),
    },
    ActIsPenetratingVision: {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1195),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0644),
    },
    ActFlareRangeModifier: {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1087),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0546),
    },
    ActFlareRadiusModifier: {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1088),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0547),
    },
};
