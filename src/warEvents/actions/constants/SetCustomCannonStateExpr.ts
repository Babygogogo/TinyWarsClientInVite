import {
    ContextType,
    ResultType,
} from "../../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../../expressionParsers/Types.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConTileFilter                   : EpExpressionInfo;
    ActRangeForUp                   : EpExpressionInfo;
    ActRangeForDown                 : EpExpressionInfo;
    ActRangeForLeft                 : EpExpressionInfo;
    ActRangeForRight                : EpExpressionInfo;
    ActPriority                     : EpExpressionInfo;
    ActCanAffectSelf                : EpExpressionInfo;
    ActCanAffectAlly                : EpExpressionInfo;
    ActCanAffectEnemy               : EpExpressionInfo;
    ActMaxTargetCount               : EpExpressionInfo;
    ActOffsetHp                     : EpExpressionInfo;
    ActCanBeFatal                   : EpExpressionInfo;
    ActOffsetFuelPercentage         : EpExpressionInfo;
    ActOffsetPrimaryAmmoPercentage  : EpExpressionInfo;
} = {
    ConTileFilter: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.TileFilter),
        getHelpText     : () => getText(TextType.A0662),
    },
    ActRangeForUp: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.RangeUp),
        getHelpText     : () => getText(TextType.A0680),
    },
    ActRangeForDown: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.RangeDown),
        getHelpText     : () => getText(TextType.A0681),
    },
    ActRangeForLeft: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.RangeLeft),
        getHelpText     : () => getText(TextType.A0682),
    },
    ActRangeForRight: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.RangeRight),
        getHelpText     : () => getText(TextType.A0683),
    },
    ActPriority: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.Priority),
        getHelpText     : () => getText(TextType.A0671),
    },
    ActCanAffectSelf: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.AffectOwner),
        getHelpText     : () => getText(TextType.A0672),
    },
    ActCanAffectAlly: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.AffectAlly),
        getHelpText     : () => getText(TextType.A0673),
    },
    ActCanAffectEnemy: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.AffectEnemy),
        getHelpText     : () => getText(TextType.A0674),
    },
    ActMaxTargetCount: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.MaxTargets),
        getHelpText     : () => getText(TextType.A0684),
    },
    ActOffsetHp: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.UnitsHpOffset),
        getHelpText     : () => getText(TextType.A0677),
    },
    ActCanBeFatal: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.CanBeFatal),
        getHelpText     : () => getText(TextType.A0967),
    },
    ActOffsetFuelPercentage: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.UnitsFuelOffset$),
        getHelpText     : () => getText(TextType.A0678),
    },
    ActOffsetPrimaryAmmoPercentage: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.UnitsPriAmmoOffset$),
        getHelpText     : () => getText(TextType.A0679),
    },
};
