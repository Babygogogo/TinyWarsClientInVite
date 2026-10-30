import {
    ContextType,
    ResultType,
} from "../../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../../expressionParsers/Types.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConUnitFilter               : EpExpressionInfo;
    ActAttackPowerModifier      : EpExpressionInfo;
    ActDefenseModifier          : EpExpressionInfo;
    ActMaxAttackRangeModifier   : EpExpressionInfo;
    ActCanAttackAfterMoving     : EpExpressionInfo;
    ActMoveRangeModifier        : EpExpressionInfo;
    ActLuckLowerLimitModifier   : EpExpressionInfo;
    ActLuckUpperLimitModifier   : EpExpressionInfo;
    ActVisionRangeModifier      : EpExpressionInfo;
    ActIsPenetratingVision      : EpExpressionInfo;
    ActFlareRangeModifier       : EpExpressionInfo;
    ActFlareRadiusModifier      : EpExpressionInfo;
} = {
    ConUnitFilter: {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.UnitFilter),
        getHelpText     : () => getText(TextType.A0539),
    },
    ActAttackPowerModifier: {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B0183),
        getHelpText     : () => getText(TextType.A0540),
    },
    ActDefenseModifier: {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.DefBonus$),
        getHelpText     : () => getText(TextType.A0541),
    },
    ActMaxAttackRangeModifier: {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1077),
        getHelpText     : () => getText(TextType.A0543),
    },
    ActCanAttackAfterMoving: {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B0346),
        getHelpText     : () => getText(TextType.A0548),
    },
    ActMoveRangeModifier: {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1078),
        getHelpText     : () => getText(TextType.A0542),
    },
    ActLuckLowerLimitModifier: {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1085),
        getHelpText     : () => getText(TextType.A0544),
    },
    ActLuckUpperLimitModifier: {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1086),
        getHelpText     : () => getText(TextType.A0545),
    },
    ActVisionRangeModifier: {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1084),
        getHelpText     : () => getText(TextType.A0643),
    },
    ActIsPenetratingVision: {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1195),
        getHelpText     : () => getText(TextType.A0644),
    },
    ActFlareRangeModifier: {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1087),
        getHelpText     : () => getText(TextType.A0546),
    },
    ActFlareRadiusModifier: {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1088),
        getHelpText     : () => getText(TextType.A0547),
    },
};
