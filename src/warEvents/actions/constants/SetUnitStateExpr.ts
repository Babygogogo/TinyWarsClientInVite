import * as ExpressionParsersEnums from "../../../expressionParsers/Enums.ts";
import type * as ExpressionParsersTypes from "../../../expressionParsers/Types.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConUnitFilter                       : ExpressionParsersTypes.EpExpressionInfo;
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
    ActCustomNameId                     : ExpressionParsersTypes.EpExpressionInfo;
    ActGroupedTagId                     : ExpressionParsersTypes.EpExpressionInfo;
    ActForbiddenGroupedLocationIdArray  : ExpressionParsersTypes.EpExpressionInfo;
    ActAiWeightedDestination            : ExpressionParsersTypes.EpExpressionInfo;
} = {
    ConUnitFilter       : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : true,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.UnitFilter),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0626),
    },
    ActActionState : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B0367),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0627),
    },
    ActCurrentHp : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.Hp),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0629),
    },
    ActPrimaryWeaponCurrentAmmo : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.PrimaryWeaponAmmo),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0628),
    },
    ActFlareCurrentAmmo : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.FlareAmmo),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0632),
    },
    ActCurrentFuel : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.Fuel),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0633),
    },
    ActIsCapturingTile : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1189),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0630),
    },
    ActIsDiving : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B0371),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0631),
    },
    ActCurrentBuildMaterial : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.BuildMaterial),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0634),
    },
    ActCurrentProduceMaterial : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.ProductionMaterial),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0635),
    },
    ActCurrentPromotion : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.Promotion),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0636),
    },
    ActIsBuildingTile : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.B1188),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0637),
    },
    ActIsCoOnboard : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.CoOnboard),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0638),
    },
    ActAiMode : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.AiMode),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0639),
    },
    ActCustomNameId : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.Number],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.CustomNameId),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0960),
    },
    ActGroupedTagId : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.Tags),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0640),
    },
    ActForbiddenGroupedLocationIdArray : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.NoEntryLocations),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0641),
    },
    ActAiWeightedDestination : {
        contextType     : ExpressionParsersEnums.ContextType.Unit,
        resultTypes     : [ExpressionParsersEnums.ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => LangUtils.getText(LangConstants.TextType.AiDestination),
        getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0642),
    },
};
