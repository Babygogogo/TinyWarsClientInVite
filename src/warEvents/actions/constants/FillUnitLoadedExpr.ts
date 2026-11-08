import {
    ExpressionParsers_Enums,
    Lang_Utils,
    Lang_Constants,
    type ExpressionParsers_Types,
} from "../../../internal.ts";

export const ExpressionInfoDict: {
    ConUnitFilter                       : ExpressionParsers_Types.EpExpressionInfo;
    ActUnitType                         : ExpressionParsers_Types.EpExpressionInfo;
    ActActionState                      : ExpressionParsers_Types.EpExpressionInfo;
    ActCurrentHp                        : ExpressionParsers_Types.EpExpressionInfo;
    ActPrimaryWeaponCurrentAmmo         : ExpressionParsers_Types.EpExpressionInfo;
    ActFlareCurrentAmmo                 : ExpressionParsers_Types.EpExpressionInfo;
    ActCurrentFuel                      : ExpressionParsers_Types.EpExpressionInfo;
    ActIsDiving                         : ExpressionParsers_Types.EpExpressionInfo;
    ActCurrentBuildMaterial             : ExpressionParsers_Types.EpExpressionInfo;
    ActCurrentProduceMaterial           : ExpressionParsers_Types.EpExpressionInfo;
    ActCurrentPromotion                 : ExpressionParsers_Types.EpExpressionInfo;
    ActIsCoOnboard                      : ExpressionParsers_Types.EpExpressionInfo;
    ActAiMode                           : ExpressionParsers_Types.EpExpressionInfo;
    ActGroupedTagId                     : ExpressionParsers_Types.EpExpressionInfo;
    ActForbiddenGroupedLocationIdArray  : ExpressionParsers_Types.EpExpressionInfo;
    ActAiWeightedDestination            : ExpressionParsers_Types.EpExpressionInfo;
} = {
    ConUnitFilter : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : true,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.UnitFilter),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0605),
    },
    ActUnitType : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : true,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B0525),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0606),
    },
    ActActionState : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B0367),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0607),
    },
    ActCurrentHp : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.Hp),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0609),
    },
    ActPrimaryWeaponCurrentAmmo : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.PrimaryWeaponAmmo),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0608),
    },
    ActFlareCurrentAmmo : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.FlareAmmo),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0611),
    },
    ActCurrentFuel : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.Fuel),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0612),
    },
    ActIsDiving : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.B0371),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0610),
    },
    ActCurrentBuildMaterial : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.BuildMaterial),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0613),
    },
    ActCurrentProduceMaterial : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.ProductionMaterial),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0614),
    },
    ActCurrentPromotion : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.Promotion),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0615),
    },
    ActIsCoOnboard : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.CoOnboard),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0616),
    },
    ActAiMode : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.Number],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.AiMode),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0617),
    },
    ActGroupedTagId : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.NumberArray],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.Tags),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0618),
    },
    ActForbiddenGroupedLocationIdArray : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.NumberArray],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.NoEntryLocations),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0619),
    },
    ActAiWeightedDestination : {
        contextType  : ExpressionParsers_Enums.ContextType.Unit,
        resultTypes  : [ExpressionParsers_Enums.ResultType.NumberArray],
        isRequired   : false,
        getTitleText : () => Lang_Utils.getText(Lang_Constants.TextType.AiDestination),
        getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0620),
    },
};
