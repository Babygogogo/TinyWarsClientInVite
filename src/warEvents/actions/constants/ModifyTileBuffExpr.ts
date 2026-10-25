import { ContextType, ResultType } from "../../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../../expressionParsers/Types.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConTileFilter           : EpExpressionInfo;
    ConBuffFilter           : EpExpressionInfo;
    ActBuffType             : EpExpressionInfo;
    ActExpiringTurnIndex    : EpExpressionInfo;
    ActExpiringPlayerIndex  : EpExpressionInfo;
    ActExtraParams          : EpExpressionInfo;
} = {
    ConTileFilter: {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.TileFilter),
        getHelpText     : () => getText(TextType.A0662),
    },
    ConBuffFilter: {
        contextType     : ContextType.TileBuff,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.B1235),
        getHelpText     : () => getText(TextType.A0765),
    },
    ActBuffType: {
        contextType     : ContextType.TileBuff,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B0805),
        getHelpText     : () => getText(TextType.A0766),
    },
    ActExpiringTurnIndex: {
        contextType     : ContextType.TileBuff,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.EndTurnIndex),
        getHelpText     : () => getText(TextType.A0767),
    },
    ActExpiringPlayerIndex: {
        contextType     : ContextType.TileBuff,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.EndPlayerIndex),
        getHelpText     : () => getText(TextType.A0768),
    },
    ActExtraParams: {
        contextType     : ContextType.TileBuff,
        resultTypes     : [ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1229),
        getHelpText     : () => getText(TextType.A0769),
    },
};
