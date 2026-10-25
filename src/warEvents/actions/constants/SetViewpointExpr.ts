import { ContextType, ResultType } from "../../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../../expressionParsers/Types.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    Targets             : EpExpressionInfo;
    NeedFocusEffect     : EpExpressionInfo;
    IsOneByOne          : EpExpressionInfo;
    Interval            : EpExpressionInfo;
} = {
    Targets       : {
        contextType     : ContextType.War,
        resultTypes     : [
            ResultType.Position,
            ResultType.PositionArray,
            ResultType.Unit,
            ResultType.UnitArray,
            ResultType.Tile,
            ResultType.TileArray,
        ],
        isRequired      : true,
        getTitleText    : () => getText(TextType.B1183),
        getHelpText     : () => getText(TextType.A0580),
    },
    NeedFocusEffect : {
        contextType     : ContextType.War,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B0714),
        getHelpText     : () => getText(TextType.A0581),
    },
    IsOneByOne : {
        contextType     : ContextType.War,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1184),
        getHelpText     : () => getText(TextType.A0582),
    },
    Interval : {
        contextType     : ContextType.War,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1035),
        getHelpText     : () => getText(TextType.A0583),
    },
};
