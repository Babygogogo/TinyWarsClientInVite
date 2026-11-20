import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants, Lang_TextType,
    type ExpressionParsers_Types,
} from "../../../internal.ts";

export const ExpressionInfoDict: {
    ConPlayerFilter         : ExpressionParsers_Types.EpExpressionInfo;
    ActAliveState           : ExpressionParsers_Types.EpExpressionInfo;
    ActFund                 : ExpressionParsers_Types.EpExpressionInfo;
    ActCoId                 : ExpressionParsers_Types.EpExpressionInfo;
    ActCoEnergy             : ExpressionParsers_Types.EpExpressionInfo;
    ActSkipTurn             : ExpressionParsers_Types.EpExpressionInfo;
    ActCoUsingSkillType     : ExpressionParsers_Types.EpExpressionInfo;
    ActActivateCoSkillType  : ExpressionParsers_Types.EpExpressionInfo;
} = {
    ConPlayerFilter : {
        contextType  : ExpressionParsers_Enums.ContextType.Player,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : true,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.PlayerFilter),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0549),
    },
    ActAliveState : {
        contextType  : ExpressionParsers_Enums.ContextType.Player,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.PlayerAliveState),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0552),
    },
    ActFund : {
        contextType  : ExpressionParsers_Enums.ContextType.Player,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.Fund),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0550),
    },
    ActCoId : {
        contextType  : ExpressionParsers_Enums.ContextType.Player,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => `CO ID`,
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0995),
    },
    ActCoEnergy : {
        contextType  : ExpressionParsers_Enums.ContextType.Player,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.CoEnergy),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0551),
    },
    ActSkipTurn : {
        contextType  : ExpressionParsers_Enums.ContextType.Player,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.SkipATurn),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0553),
    },
    ActCoUsingSkillType : {
        contextType  : ExpressionParsers_Enums.ContextType.Player,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.ActivatingCoSkillType),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0852),
    },
    ActActivateCoSkillType : {
        contextType  : ExpressionParsers_Enums.ContextType.Player,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.TriggerCoSkillType),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0853),
    },
};
