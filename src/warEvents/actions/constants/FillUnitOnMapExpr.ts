import * as ExpressionParsersEnums from "../../../expressionParsers/Enums.ts";
import type * as ExpressionParsersTypes from "../../../expressionParsers/Types.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConTileFilter                       : ExpressionParsersTypes.EpExpressionInfo;
    ActUnitType                         : ExpressionParsersTypes.EpExpressionInfo;
    ActPlayerIndex                      : ExpressionParsersTypes.EpExpressionInfo;
    ActActionState                      : ExpressionParsersTypes.EpExpressionInfo;
    ActCurrentHp                        : ExpressionParsersTypes.EpExpressionInfo;
    ActPrimaryWeaponCurrentAmmo         : ExpressionParsersTypes.EpExpressionInfo;
    ActFlareCurrentAmmo                 : ExpressionParsersTypes.EpExpressionInfo;
    ActCurrentFuel                      : ExpressionParsersTypes.EpExpressionInfo;
    ActIsCapturingTile                  : ExpressionParsersTypes.EpExpressionInfo;
    ActIsDiving                         : ExpressionParsersTypes.EpExpressionInfo;
    ActCurrentBuildMaterial             : ExpressionParsersTypes.EpExpressionInfo;
    ActCurrentProduceMaterial           : ExpressionParsersTypes.EpExpressionInfo;
    ActCurrentPromotion                 : ExpressionParsersTypes.EpExpressionInfo;
    ActIsBuildingTile                   : ExpressionParsersTypes.EpExpressionInfo;
    ActIsCoOnboard                      : ExpressionParsersTypes.EpExpressionInfo;
    ActAiMode                           : ExpressionParsersTypes.EpExpressionInfo;
    ActGroupedTagId                     : ExpressionParsersTypes.EpExpressionInfo;
    ActForbiddenGroupedLocationIdArray  : ExpressionParsersTypes.EpExpressionInfo;
    ActAiWeightedDestination            : ExpressionParsersTypes.EpExpressionInfo;
} = {
    ConTileFilter       : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.TileFilter),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0586),
    },
    ActUnitType : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B0525),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0588),
    },
    ActPlayerIndex : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.PlayerIndex),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0587),
    },
    ActActionState : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B0367),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0589),
    },
    ActCurrentHp : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.Hp),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0591),
    },
    ActPrimaryWeaponCurrentAmmo : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.PrimaryWeaponAmmo),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0590),
    },
    ActFlareCurrentAmmo : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.FlareAmmo),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0594),
    },
    ActCurrentFuel : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.Fuel),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0595),
    },
    ActIsCapturingTile : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1189),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0592),
    },
    ActIsDiving : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B0371),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0593),
    },
    ActCurrentBuildMaterial : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.BuildMaterial),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0596),
    },
    ActCurrentProduceMaterial : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.ProductionMaterial),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0597),
    },
    ActCurrentPromotion : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.Promotion),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0598),
    },
    ActIsBuildingTile : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1188),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0599),
    },
    ActIsCoOnboard : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.CoOnboard),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0600),
    },
    ActAiMode : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.AiMode),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0601),
    },
    ActGroupedTagId : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.Tags),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0602),
    },
    ActForbiddenGroupedLocationIdArray : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.NoEntryLocations),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0603),
    },
    ActAiWeightedDestination : {
        contextType     : ExpressionParsersEnums.ContextType.Tile,
        resultTypes     : [ExpressionParsersEnums.ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.AiDestination),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0604),
    },
};
