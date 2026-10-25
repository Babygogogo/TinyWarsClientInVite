import { ContextType, ResultType } from "../../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../../expressionParsers/Types.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConTileFilter                   : EpExpressionInfo;
    ActRadius                       : EpExpressionInfo;
    ActPriority                     : EpExpressionInfo;
    ActCanAffectSelf                : EpExpressionInfo;
    ActCanAffectAlly                : EpExpressionInfo;
    ActCanAffectEnemy               : EpExpressionInfo;
    ActOffsetFund                   : EpExpressionInfo;
    ActOffsetEnergyPercentage       : EpExpressionInfo;
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
    ActRadius: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.EffectiveRadius),
        getHelpText     : () => getText(TextType.A0670),
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
    ActOffsetFund: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.FundOffset),
        getHelpText     : () => getText(TextType.A0675),
    },
    ActOffsetEnergyPercentage: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.CoEnergyOffset$),
        getHelpText     : () => getText(TextType.A0676),
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
