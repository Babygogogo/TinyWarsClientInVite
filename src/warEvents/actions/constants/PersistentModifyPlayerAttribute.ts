import * as ExpressionParsersEnums from "../../../expressionParsers/Enums.ts";
import type * as ExpressionParsersTypes from "../../../expressionParsers/Types.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConPlayerFilter                     : ExpressionParsersTypes.EpExpressionInfo;
    ActBannedUnitTypeArray              : ExpressionParsersTypes.EpExpressionInfo;
    ActUnbannedUnitTypeArray            : ExpressionParsersTypes.EpExpressionInfo;
    ActCanActivateCoSkill               : ExpressionParsersTypes.EpExpressionInfo;
    ActEnergyGrowthMultiplierModifier   : ExpressionParsersTypes.EpExpressionInfo;
    ActCoZoneRadiusModifier             : ExpressionParsersTypes.EpExpressionInfo;
    ActAiUnitProductionBonusScore       : ExpressionParsersTypes.EpExpressionInfo;
} = {
    ConPlayerFilter: {
        contextType     : ExpressionParsersEnums.ContextType.Player,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.PlayerFilter),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0533),
    },
    ActBannedUnitTypeArray: {
        contextType     : ExpressionParsersEnums.ContextType.Player,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number, ExpressionParsersEnums.ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B0895),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0534),
    },
    ActUnbannedUnitTypeArray: {
        contextType     : ExpressionParsersEnums.ContextType.Player,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number, ExpressionParsersEnums.ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1081),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0535),
    },
    ActCanActivateCoSkill: {
        contextType     : ExpressionParsersEnums.ContextType.Player,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B0897),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0536),
    },
    ActEnergyGrowthMultiplierModifier: {
        contextType     : ExpressionParsersEnums.ContextType.Player,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1089),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0537),
    },
    ActCoZoneRadiusModifier: {
        contextType     : ExpressionParsersEnums.ContextType.Player,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1231),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0747),
    },
    ActAiUnitProductionBonusScore: {
        contextType     : ExpressionParsersEnums.ContextType.NumberArray,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1449),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0966),
    },
};
