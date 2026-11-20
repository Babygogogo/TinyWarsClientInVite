import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants, Lang_TextType,
    type ExpressionParsers_Types,
} from "../../../internal.ts";

export const ExpressionInfoDict: {
    ConTileFilter                       : ExpressionParsers_Types.EpExpressionInfo;
    ActUnitType                         : ExpressionParsers_Types.EpExpressionInfo;
    ActPlayerIndex                      : ExpressionParsers_Types.EpExpressionInfo;
    ActActionState                      : ExpressionParsers_Types.EpExpressionInfo;
    ActCurrentHp                        : ExpressionParsers_Types.EpExpressionInfo;
    ActPrimaryWeaponCurrentAmmo         : ExpressionParsers_Types.EpExpressionInfo;
    ActFlareCurrentAmmo                 : ExpressionParsers_Types.EpExpressionInfo;
    ActCurrentFuel                      : ExpressionParsers_Types.EpExpressionInfo;
    ActIsCapturingTile                  : ExpressionParsers_Types.EpExpressionInfo;
    ActIsDiving                         : ExpressionParsers_Types.EpExpressionInfo;
    ActCurrentBuildMaterial             : ExpressionParsers_Types.EpExpressionInfo;
    ActCurrentProduceMaterial           : ExpressionParsers_Types.EpExpressionInfo;
    ActCurrentPromotion                 : ExpressionParsers_Types.EpExpressionInfo;
    ActIsBuildingTile                   : ExpressionParsers_Types.EpExpressionInfo;
    ActIsCoOnboard                      : ExpressionParsers_Types.EpExpressionInfo;
    ActAiMode                           : ExpressionParsers_Types.EpExpressionInfo;
    ActGroupedTagId                     : ExpressionParsers_Types.EpExpressionInfo;
    ActForbiddenGroupedLocationIdArray  : ExpressionParsers_Types.EpExpressionInfo;
    ActAiWeightedDestination            : ExpressionParsers_Types.EpExpressionInfo;
} = {
    ConTileFilter : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : true,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.TileFilter),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0586),
    },
    ActUnitType : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : true,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.B0525),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0588),
    },
    ActPlayerIndex : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : true,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.PlayerIndex),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0587),
    },
    ActActionState : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.B0367),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0589),
    },
    ActCurrentHp : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.Hp),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0591),
    },
    ActPrimaryWeaponCurrentAmmo : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.PrimaryWeaponAmmo),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0590),
    },
    ActFlareCurrentAmmo : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.FlareAmmo),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0594),
    },
    ActCurrentFuel : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.Fuel),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0595),
    },
    ActIsCapturingTile : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.B1189),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0592),
    },
    ActIsDiving : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.B0371),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0593),
    },
    ActCurrentBuildMaterial : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.BuildMaterial),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0596),
    },
    ActCurrentProduceMaterial : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.ProductionMaterial),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0597),
    },
    ActCurrentPromotion : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.Promotion),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0598),
    },
    ActIsBuildingTile : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.B1188),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0599),
    },
    ActIsCoOnboard : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.CoOnboard),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0600),
    },
    ActAiMode : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.AiMode),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0601),
    },
    ActGroupedTagId : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.NumberArray],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.Tags),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0602),
    },
    ActForbiddenGroupedLocationIdArray : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.NumberArray],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.NoEntryLocations),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0603),
    },
    ActAiWeightedDestination : {
        contextType  : ExpressionParsers_Enums.ContextType.Tile,
        resultTypes  : [ExpressionParsers_Enums.ResultType.NumberArray],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.AiDestination),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0604),
    },
};
