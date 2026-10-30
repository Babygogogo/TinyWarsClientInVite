import {
    ContextType,
    ResultType,
} from "../../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../../expressionParsers/Types.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConTileFilter                       : EpExpressionInfo;
    ActBaseType                         : EpExpressionInfo;
    ActBaseShapeId                      : EpExpressionInfo;
    ActObjectType                       : EpExpressionInfo;
    ActObjectShapeId                    : EpExpressionInfo;
    ActDecorationType                   : EpExpressionInfo;
    ActDecorationShapeId                : EpExpressionInfo;
    ActUnitHandler                      : EpExpressionInfo;
    ActUnitFilter                       : EpExpressionInfo;
} = {
    ConTileFilter       : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.TileFilter),
        getHelpText     : () => getText(TextType.A0648),
    },
    ActBaseType : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1199),
        getHelpText     : () => getText(TextType.A0649),
    },
    ActBaseShapeId : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1200),
        getHelpText     : () => getText(TextType.A0650),
    },
    ActObjectType : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1201),
        getHelpText     : () => getText(TextType.A0651),
    },
    ActObjectShapeId : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1202),
        getHelpText     : () => getText(TextType.A0652),
    },
    ActDecorationType : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1203),
        getHelpText     : () => getText(TextType.A0653),
    },
    ActDecorationShapeId : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1204),
        getHelpText     : () => getText(TextType.A0654),
    },
    ActUnitHandler : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1205),
        getHelpText     : () => getText(TextType.A0655),
    },
    ActUnitFilter : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.UnitFilter),
        getHelpText     : () => getText(TextType.A0656),
    },
};
