import * as ExpressionParsersEnums from "../../../expressionParsers/Enums.ts";
import type * as ExpressionParsersTypes from "../../../expressionParsers/Types.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConTileFilter                   : ExpressionParsersTypes.EpExpressionInfo;
    ActDefenseAmount                : ExpressionParsersTypes.EpExpressionInfo;
    ActDefenseUnitTypeArray         : ExpressionParsersTypes.EpExpressionInfo;
    ActMaxCapturePoint              : ExpressionParsersTypes.EpExpressionInfo;
    ActIsDefeatedOnCapture          : ExpressionParsersTypes.EpExpressionInfo;
    ActRepairNormalizedHp           : ExpressionParsersTypes.EpExpressionInfo;
    ActRepairUnitTypeArray          : ExpressionParsersTypes.EpExpressionInfo;
    ActIncomePerTurn                : ExpressionParsersTypes.EpExpressionInfo;
    ActVisionRange                  : ExpressionParsersTypes.EpExpressionInfo;
    ActIsVisionEnabledForAllPlayers : ExpressionParsersTypes.EpExpressionInfo;
    ActHideUnitTypeArray            : ExpressionParsersTypes.EpExpressionInfo;
    ActProduceUnitTypeArray         : ExpressionParsersTypes.EpExpressionInfo;
    ActGlobalAttackBonus            : ExpressionParsersTypes.EpExpressionInfo;
    ActGlobalDefenseBonus           : ExpressionParsersTypes.EpExpressionInfo;
    ActUnitTypeArrayForCoBoard      : ExpressionParsersTypes.EpExpressionInfo;
    ActBlockEnemyUnitTypeArray      : ExpressionParsersTypes.EpExpressionInfo;
} = {
    ConTileFilter: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.TileFilter),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0662),
    },
    ActDefenseAmount: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.DefBonus$),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0685),
    },
    ActDefenseUnitTypeArray: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.DefensibleUnits),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0686),
    },
    ActMaxCapturePoint: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.MaxCapturePoint),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0687),
    },
    ActIsDefeatedOnCapture: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.DefeatIfCaptured),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0688),
    },
    ActRepairNormalizedHp: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.RepairHpAmount),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0689),
    },
    ActRepairUnitTypeArray: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.RepairableUnits),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0690),
    },
    ActIncomePerTurn: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.Income),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0691),
    },
    ActVisionRange: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.VisionRange),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0692),
    },
    ActIsVisionEnabledForAllPlayers: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.SharedVision),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0693),
    },
    ActHideUnitTypeArray: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.HidableUnits),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0694),
    },
    ActProduceUnitTypeArray: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.ProducibleUnits),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0695),
    },
    ActGlobalAttackBonus: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.GlobalAtkBonus),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0696),
    },
    ActGlobalDefenseBonus: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.GlobalDefBonus),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0697),
    },
    ActUnitTypeArrayForCoBoard: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.CoBoardableUnit),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0698),
    },
    ActBlockEnemyUnitTypeArray: {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.BlockableEnemyUnits),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0699),
    },
};
