import * as ExpressionParsersEnums from "../../../expressionParsers/Enums.ts";
import type * as ExpressionParsersTypes from "../../../expressionParsers/Types.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConUnitFilter                       : ExpressionParsersTypes.EpExpressionInfo;
    ActUnitType                         : ExpressionParsersTypes.EpExpressionInfo;
    ActActionState                      : ExpressionParsersTypes.EpExpressionInfo;
    ActCurrentHp                        : ExpressionParsersTypes.EpExpressionInfo;
    ActPrimaryWeaponCurrentAmmo         : ExpressionParsersTypes.EpExpressionInfo;
    ActFlareCurrentAmmo                 : ExpressionParsersTypes.EpExpressionInfo;
    ActCurrentFuel                      : ExpressionParsersTypes.EpExpressionInfo;
    ActIsDiving                         : ExpressionParsersTypes.EpExpressionInfo;
    ActCurrentBuildMaterial             : ExpressionParsersTypes.EpExpressionInfo;
    ActCurrentProduceMaterial           : ExpressionParsersTypes.EpExpressionInfo;
    ActCurrentPromotion                 : ExpressionParsersTypes.EpExpressionInfo;
    ActIsCoOnboard                      : ExpressionParsersTypes.EpExpressionInfo;
    ActAiMode                           : ExpressionParsersTypes.EpExpressionInfo;
    ActGroupedTagId                     : ExpressionParsersTypes.EpExpressionInfo;
    ActForbiddenGroupedLocationIdArray  : ExpressionParsersTypes.EpExpressionInfo;
    ActAiWeightedDestination            : ExpressionParsersTypes.EpExpressionInfo;
} = {
    ConUnitFilter       : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.UnitFilter),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0605),
    },
    ActUnitType : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B0525),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0606),
    },
    ActActionState : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B0367),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0607),
    },
    ActCurrentHp : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.Hp),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0609),
    },
    ActPrimaryWeaponCurrentAmmo : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.PrimaryWeaponAmmo),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0608),
    },
    ActFlareCurrentAmmo : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.FlareAmmo),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0611),
    },
    ActCurrentFuel : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.Fuel),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0612),
    },
    ActIsDiving : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B0371),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0610),
    },
    ActCurrentBuildMaterial : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.BuildMaterial),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0613),
    },
    ActCurrentProduceMaterial : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.ProductionMaterial),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0614),
    },
    ActCurrentPromotion : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.Promotion),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0615),
    },
    ActIsCoOnboard : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.CoOnboard),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0616),
    },
    ActAiMode : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.AiMode),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0617),
    },
    ActGroupedTagId : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.Tags),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0618),
    },
    ActForbiddenGroupedLocationIdArray : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.NoEntryLocations),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0619),
    },
    ActAiWeightedDestination : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.AiDestination),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0620),
    },
};
