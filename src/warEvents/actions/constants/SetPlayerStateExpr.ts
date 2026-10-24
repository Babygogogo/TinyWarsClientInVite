import * as ExpressionParsersEnums from "../../../expressionParsers/Enums.ts";
import type * as ExpressionParsersTypes from "../../../expressionParsers/Types.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConPlayerFilter         : ExpressionParsersTypes.EpExpressionInfo;
    ActAliveState           : ExpressionParsersTypes.EpExpressionInfo;
    ActFund                 : ExpressionParsersTypes.EpExpressionInfo;
    ActCoId                 : ExpressionParsersTypes.EpExpressionInfo;
    ActCoEnergy             : ExpressionParsersTypes.EpExpressionInfo;
    ActSkipTurn             : ExpressionParsersTypes.EpExpressionInfo;
    ActCoUsingSkillType     : ExpressionParsersTypes.EpExpressionInfo;
    ActActivateCoSkillType  : ExpressionParsersTypes.EpExpressionInfo;
} = {
    ConPlayerFilter     : {
        contextType     : ExpressionParsersEnums.ContextType.Player,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.PlayerFilter),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0549),
    },
    ActAliveState       : {
        contextType     : ExpressionParsersEnums.ContextType.Player,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.PlayerAliveState),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0552),
    },
    ActFund             : {
        contextType     : ExpressionParsersEnums.ContextType.Player,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.Fund),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0550),
    },
    ActCoId             : {
        contextType     : ExpressionParsersEnums.ContextType.Player,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => `CO ID`,
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0995),
    },
    ActCoEnergy         : {
        contextType     : ExpressionParsersEnums.ContextType.Player,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.CoEnergy),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0551),
    },
    ActSkipTurn         : {
        contextType     : ExpressionParsersEnums.ContextType.Player,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.SkipATurn),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0553),
    },
    ActCoUsingSkillType : {
        contextType     : ExpressionParsersEnums.ContextType.Player,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.ActivatingCoSkillType),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0852),
    },
    ActActivateCoSkillType   : {
        contextType     : ExpressionParsersEnums.ContextType.Player,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.TriggerCoSkillType),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0853),
    },
};
