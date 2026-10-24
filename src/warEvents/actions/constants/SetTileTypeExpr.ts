import * as ExpressionParsersEnums from "../../../expressionParsers/Enums.ts";
import type * as ExpressionParsersTypes from "../../../expressionParsers/Types.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConTileFilter                       : ExpressionParsersTypes.EpExpressionInfo;
    ActBaseType                         : ExpressionParsersTypes.EpExpressionInfo;
    ActBaseShapeId                      : ExpressionParsersTypes.EpExpressionInfo;
    ActObjectType                       : ExpressionParsersTypes.EpExpressionInfo;
    ActObjectShapeId                    : ExpressionParsersTypes.EpExpressionInfo;
    ActDecorationType                   : ExpressionParsersTypes.EpExpressionInfo;
    ActDecorationShapeId                : ExpressionParsersTypes.EpExpressionInfo;
    ActUnitHandler                      : ExpressionParsersTypes.EpExpressionInfo;
    ActUnitFilter                       : ExpressionParsersTypes.EpExpressionInfo;
} = {
    ConTileFilter       : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.TileFilter),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0648),
    },
    ActBaseType : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1199),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0649),
    },
    ActBaseShapeId : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1200),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0650),
    },
    ActObjectType : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1201),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0651),
    },
    ActObjectShapeId : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1202),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0652),
    },
    ActDecorationType : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1203),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0653),
    },
    ActDecorationShapeId : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1204),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0654),
    },
    ActUnitHandler : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1205),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0655),
    },
    ActUnitFilter : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.UnitFilter),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0656),
    },
};
