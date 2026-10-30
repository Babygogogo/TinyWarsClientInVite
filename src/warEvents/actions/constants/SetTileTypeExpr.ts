import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants,
    type ExpressionParsers_Types,
} from "../../../internal.ts";

export const ExpressionInfoDict: {
    ConTileFilter                       : ExpressionParsers_Types.EpExpressionInfo;
    ActBaseType                         : ExpressionParsers_Types.EpExpressionInfo;
    ActBaseShapeId                      : ExpressionParsers_Types.EpExpressionInfo;
    ActObjectType                       : ExpressionParsers_Types.EpExpressionInfo;
    ActObjectShapeId                    : ExpressionParsers_Types.EpExpressionInfo;
    ActDecorationType                   : ExpressionParsers_Types.EpExpressionInfo;
    ActDecorationShapeId                : ExpressionParsers_Types.EpExpressionInfo;
    ActUnitHandler                      : ExpressionParsers_Types.EpExpressionInfo;
    ActUnitFilter                       : ExpressionParsers_Types.EpExpressionInfo;
} = {
    ConTileFilter       : {
        contextType     : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.TileFilter),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0648),
    },
    ActBaseType : {
        contextType     : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.B1199),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0649),
    },
    ActBaseShapeId : {
        contextType     : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.B1200),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0650),
    },
    ActObjectType : {
        contextType     : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.B1201),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0651),
    },
    ActObjectShapeId : {
        contextType     : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.B1202),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0652),
    },
    ActDecorationType : {
        contextType     : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.B1203),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0653),
    },
    ActDecorationShapeId : {
        contextType     : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.B1204),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0654),
    },
    ActUnitHandler : {
        contextType     : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.B1205),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0655),
    },
    ActUnitFilter : {
        contextType     : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes     : [ExpressionParsers_Enums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => Lang_Utils.getText(Lang_Constants.TextType.UnitFilter),
        getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0656),
    },
};
