import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants, Lang_TextType,
    type ExpressionParsers_Types,
} from "../../../internal.ts";

export const ExpressionInfoDict: {
    ConUnitFilter                       : ExpressionParsers_Types.EpExpressionInfo;
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
    ActCustomNameId                     : ExpressionParsers_Types.EpExpressionInfo;
    ActGroupedTagId                     : ExpressionParsers_Types.EpExpressionInfo;
    ActForbiddenGroupedLocationIdArray  : ExpressionParsers_Types.EpExpressionInfo;
    ActAiWeightedDestination            : ExpressionParsers_Types.EpExpressionInfo;
} = {
    ConUnitFilter : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : true,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.UnitFilter),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0626),
    },
    ActActionState : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.B0367),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0627),
    },
    ActCurrentHp : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.Hp),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0629),
    },
    ActPrimaryWeaponCurrentAmmo : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.PrimaryWeaponAmmo),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0628),
    },
    ActFlareCurrentAmmo : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.FlareAmmo),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0632),
    },
    ActCurrentFuel : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.Fuel),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0633),
    },
    ActIsCapturingTile : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.B1189),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0630),
    },
    ActIsDiving : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.B0371),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0631),
    },
    ActCurrentBuildMaterial : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.BuildMaterial),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0634),
    },
    ActCurrentProduceMaterial : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.ProductionMaterial),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0635),
    },
    ActCurrentPromotion : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.Promotion),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0636),
    },
    ActIsBuildingTile : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.B1188),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0637),
    },
    ActIsCoOnboard : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.CoOnboard),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0638),
    },
    ActAiMode : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.AiMode),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0639),
    },
    ActCustomNameId : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.CustomNameId),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0960),
    },
    ActGroupedTagId : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.NumberArray],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.Tags),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0640),
    },
    ActForbiddenGroupedLocationIdArray : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.NumberArray],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.NoEntryLocations),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0641),
    },
    ActAiWeightedDestination : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.NumberArray],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_TextType.TextType.AiDestination),
        getHelpText  : () => Lang_Utils.getText(Lang_TextType.TextType.A0642),
    },
};
