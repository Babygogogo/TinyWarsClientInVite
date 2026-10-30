import {
    ContextType,
    ResultType,
} from "../../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../../expressionParsers/Types.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConTileFilter                   : EpExpressionInfo;
    ActDefenseAmount                : EpExpressionInfo;
    ActDefenseUnitTypeArray         : EpExpressionInfo;
    ActMaxCapturePoint              : EpExpressionInfo;
    ActIsDefeatedOnCapture          : EpExpressionInfo;
    ActRepairNormalizedHp           : EpExpressionInfo;
    ActRepairUnitTypeArray          : EpExpressionInfo;
    ActIncomePerTurn                : EpExpressionInfo;
    ActVisionRange                  : EpExpressionInfo;
    ActIsVisionEnabledForAllPlayers : EpExpressionInfo;
    ActHideUnitTypeArray            : EpExpressionInfo;
    ActProduceUnitTypeArray         : EpExpressionInfo;
    ActGlobalAttackBonus            : EpExpressionInfo;
    ActGlobalDefenseBonus           : EpExpressionInfo;
    ActUnitTypeArrayForCoBoard      : EpExpressionInfo;
    ActBlockEnemyUnitTypeArray      : EpExpressionInfo;
} = {
    ConTileFilter: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.TileFilter),
        getHelpText     : () => getText(TextType.A0662),
    },
    ActDefenseAmount: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.DefBonus$),
        getHelpText     : () => getText(TextType.A0685),
    },
    ActDefenseUnitTypeArray: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => getText(TextType.DefensibleUnits),
        getHelpText     : () => getText(TextType.A0686),
    },
    ActMaxCapturePoint: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.MaxCapturePoint),
        getHelpText     : () => getText(TextType.A0687),
    },
    ActIsDefeatedOnCapture: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.DefeatIfCaptured),
        getHelpText     : () => getText(TextType.A0688),
    },
    ActRepairNormalizedHp: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.RepairHpAmount),
        getHelpText     : () => getText(TextType.A0689),
    },
    ActRepairUnitTypeArray: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => getText(TextType.RepairableUnits),
        getHelpText     : () => getText(TextType.A0690),
    },
    ActIncomePerTurn: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.Income),
        getHelpText     : () => getText(TextType.A0691),
    },
    ActVisionRange: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.VisionRange),
        getHelpText     : () => getText(TextType.A0692),
    },
    ActIsVisionEnabledForAllPlayers: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.SharedVision),
        getHelpText     : () => getText(TextType.A0693),
    },
    ActHideUnitTypeArray: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => getText(TextType.HidableUnits),
        getHelpText     : () => getText(TextType.A0694),
    },
    ActProduceUnitTypeArray: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => getText(TextType.ProducibleUnits),
        getHelpText     : () => getText(TextType.A0695),
    },
    ActGlobalAttackBonus: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.GlobalAtkBonus),
        getHelpText     : () => getText(TextType.A0696),
    },
    ActGlobalDefenseBonus: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.GlobalDefBonus),
        getHelpText     : () => getText(TextType.A0697),
    },
    ActUnitTypeArrayForCoBoard: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => getText(TextType.CoBoardableUnit),
        getHelpText     : () => getText(TextType.A0698),
    },
    ActBlockEnemyUnitTypeArray: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => getText(TextType.BlockableEnemyUnits),
        getHelpText     : () => getText(TextType.A0699),
    },
};
