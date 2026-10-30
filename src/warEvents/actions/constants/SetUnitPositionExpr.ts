import {
    ContextType,
    ResultType,
} from "../../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../../expressionParsers/Types.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConUnitFilter                       : EpExpressionInfo;
    ActDestination                      : EpExpressionInfo;
    ActAlternativeTileFilter            : EpExpressionInfo;
} = {
    ConUnitFilter       : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.UnitFilter),
        getHelpText     : () => getText(TextType.A0645),
    },
    ActDestination : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Tile, ResultType.Position],
        isRequired      : true,
        getTitleText    : () => getText(TextType.B1196),
        getHelpText     : () => getText(TextType.A0646),
    },
    ActAlternativeTileFilter : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1197),
        getHelpText     : () => getText(TextType.A0647),
    },
};
