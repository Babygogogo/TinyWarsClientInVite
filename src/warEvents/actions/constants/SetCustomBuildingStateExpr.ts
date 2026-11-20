import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants, Lang_TextType,
    type ExpressionParsers_Types,
} from "../../../internal.ts";

export const ExpressionInfoDict: {
    ConTileFilter                   : ExpressionParsers_Types.EpExpressionInfo;
    ActDefenseAmount                : ExpressionParsers_Types.EpExpressionInfo;
    ActDefenseUnitTypeArray         : ExpressionParsers_Types.EpExpressionInfo;
    ActMaxCapturePoint              : ExpressionParsers_Types.EpExpressionInfo;
    ActIsDefeatedOnCapture          : ExpressionParsers_Types.EpExpressionInfo;
    ActRepairNormalizedHp           : ExpressionParsers_Types.EpExpressionInfo;
    ActRepairUnitTypeArray          : ExpressionParsers_Types.EpExpressionInfo;
    ActIncomePerTurn                : ExpressionParsers_Types.EpExpressionInfo;
    ActVisionRange                  : ExpressionParsers_Types.EpExpressionInfo;
    ActIsVisionEnabledForAllPlayers : ExpressionParsers_Types.EpExpressionInfo;
    ActHideUnitTypeArray            : ExpressionParsers_Types.EpExpressionInfo;
    ActProduceUnitTypeArray         : ExpressionParsers_Types.EpExpressionInfo;
    ActGlobalAttackBonus            : ExpressionParsers_Types.EpExpressionInfo;
    ActGlobalDefenseBonus           : ExpressionParsers_Types.EpExpressionInfo;
    ActUnitTypeArrayForCoBoard      : ExpressionParsers_Types.EpExpressionInfo;
    ActBlockEnemyUnitTypeArray      : ExpressionParsers_Types.EpExpressionInfo;
} = {
    ConTileFilter : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : true,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.TileFilter),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0662),
    },
    ActDefenseAmount : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.DefBonus$),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0685),
    },
    ActDefenseUnitTypeArray : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.NumberArray],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.DefensibleUnits),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0686),
    },
    ActMaxCapturePoint : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.MaxCapturePoint),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0687),
    },
    ActIsDefeatedOnCapture : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.DefeatIfCaptured),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0688),
    },
    ActRepairNormalizedHp : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.RepairHpAmount),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0689),
    },
    ActRepairUnitTypeArray : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.NumberArray],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.RepairableUnits),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0690),
    },
    ActIncomePerTurn : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.Income),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0691),
    },
    ActVisionRange : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.VisionRange),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0692),
    },
    ActIsVisionEnabledForAllPlayers : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.SharedVision),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0693),
    },
    ActHideUnitTypeArray : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.NumberArray],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.HidableUnits),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0694),
    },
    ActProduceUnitTypeArray : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.NumberArray],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.ProducibleUnits),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0695),
    },
    ActGlobalAttackBonus : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.GlobalAtkBonus),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0696),
    },
    ActGlobalDefenseBonus : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.GlobalDefBonus),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0697),
    },
    ActUnitTypeArrayForCoBoard : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.NumberArray],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.CoBoardableUnit),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0698),
    },
    ActBlockEnemyUnitTypeArray : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.NumberArray],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.BlockableEnemyUnits),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0699),
    },
};
