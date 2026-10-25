import { ContextType, ResultType } from "../../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../../expressionParsers/Types.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConPlayerFilter                     : EpExpressionInfo;
    ActBannedUnitTypeArray              : EpExpressionInfo;
    ActUnbannedUnitTypeArray            : EpExpressionInfo;
    ActCanActivateCoSkill               : EpExpressionInfo;
    ActEnergyGrowthMultiplierModifier   : EpExpressionInfo;
    ActCoZoneRadiusModifier             : EpExpressionInfo;
    ActAiUnitProductionBonusScore       : EpExpressionInfo;
} = {
    ConPlayerFilter: {
        contextType     : ContextType.Player,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.PlayerFilter),
        getHelpText     : () => getText(TextType.A0533),
    },
    ActBannedUnitTypeArray: {
        contextType     : ContextType.Player,
        resultTypes     : [ResultType.Number, ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B0895),
        getHelpText     : () => getText(TextType.A0534),
    },
    ActUnbannedUnitTypeArray: {
        contextType     : ContextType.Player,
        resultTypes     : [ResultType.Number, ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1081),
        getHelpText     : () => getText(TextType.A0535),
    },
    ActCanActivateCoSkill: {
        contextType     : ContextType.Player,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B0897),
        getHelpText     : () => getText(TextType.A0536),
    },
    ActEnergyGrowthMultiplierModifier: {
        contextType     : ContextType.Player,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1089),
        getHelpText     : () => getText(TextType.A0537),
    },
    ActCoZoneRadiusModifier: {
        contextType     : ContextType.Player,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1231),
        getHelpText     : () => getText(TextType.A0747),
    },
    ActAiUnitProductionBonusScore: {
        contextType     : ContextType.NumberArray,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1449),
        getHelpText     : () => getText(TextType.A0966),
    },
};
