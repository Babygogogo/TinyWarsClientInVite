import {
    ContextType,
    ResultType,
} from "../../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../../expressionParsers/Types.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConTileFilter                       : EpExpressionInfo;
    ActPlayerIndex                      : EpExpressionInfo;
    ActCurrentHp                        : EpExpressionInfo;
    ActCurrentBuildPoint                : EpExpressionInfo;
    ActCurrentCapturePoint              : EpExpressionInfo;
    ActIsHighlighted                    : EpExpressionInfo;
    ActGroupedLocationIdArray           : EpExpressionInfo;
    ActCustomNameId                     : EpExpressionInfo;
} = {
    ConTileFilter       : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.TileFilter),
        getHelpText     : () => getText(TextType.A0662),
    },
    ActPlayerIndex : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.PlayerIndex),
        getHelpText     : () => getText(TextType.A0663),
    },
    ActCurrentHp : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.Hp),
        getHelpText     : () => getText(TextType.A0664),
    },
    ActCurrentBuildPoint : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.BuildPoint),
        getHelpText     : () => getText(TextType.A0665),
    },
    ActCurrentCapturePoint : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.CapturePoint),
        getHelpText     : () => getText(TextType.A0666),
    },
    ActIsHighlighted : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B0847),
        getHelpText     : () => getText(TextType.A0667),
    },
    ActGroupedLocationIdArray : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => getText(TextType.Location),
        getHelpText     : () => getText(TextType.A0668),
    },
    ActCustomNameId : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.CustomNameId),
        getHelpText     : () => getText(TextType.A0961),
    },
};
