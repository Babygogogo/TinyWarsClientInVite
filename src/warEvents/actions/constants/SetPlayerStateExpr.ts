import {
    ContextType,
    ResultType,
} from "../../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../../expressionParsers/Types.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConPlayerFilter         : EpExpressionInfo;
    ActAliveState           : EpExpressionInfo;
    ActFund                 : EpExpressionInfo;
    ActCoId                 : EpExpressionInfo;
    ActCoEnergy             : EpExpressionInfo;
    ActSkipTurn             : EpExpressionInfo;
    ActCoUsingSkillType     : EpExpressionInfo;
    ActActivateCoSkillType  : EpExpressionInfo;
} = {
    ConPlayerFilter     : {
        contextType     : ContextType.Player,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.PlayerFilter),
        getHelpText     : () => getText(TextType.A0549),
    },
    ActAliveState       : {
        contextType     : ContextType.Player,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.PlayerAliveState),
        getHelpText     : () => getText(TextType.A0552),
    },
    ActFund             : {
        contextType     : ContextType.Player,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.Fund),
        getHelpText     : () => getText(TextType.A0550),
    },
    ActCoId             : {
        contextType     : ContextType.Player,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => `CO ID`,
        getHelpText     : () => getText(TextType.A0995),
    },
    ActCoEnergy         : {
        contextType     : ContextType.Player,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.CoEnergy),
        getHelpText     : () => getText(TextType.A0551),
    },
    ActSkipTurn         : {
        contextType     : ContextType.Player,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.SkipATurn),
        getHelpText     : () => getText(TextType.A0553),
    },
    ActCoUsingSkillType : {
        contextType     : ContextType.Player,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.ActivatingCoSkillType),
        getHelpText     : () => getText(TextType.A0852),
    },
    ActActivateCoSkillType   : {
        contextType     : ContextType.Player,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.TriggerCoSkillType),
        getHelpText     : () => getText(TextType.A0853),
    },
};
