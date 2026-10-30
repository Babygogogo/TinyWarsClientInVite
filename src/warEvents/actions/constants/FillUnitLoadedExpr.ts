import {
    ContextType,
    ResultType,
} from "../../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../../expressionParsers/Types.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConUnitFilter                       : EpExpressionInfo;
    ActUnitType                         : EpExpressionInfo;
    ActActionState                      : EpExpressionInfo;
    ActCurrentHp                        : EpExpressionInfo;
    ActPrimaryWeaponCurrentAmmo         : EpExpressionInfo;
    ActFlareCurrentAmmo                 : EpExpressionInfo;
    ActCurrentFuel                      : EpExpressionInfo;
    ActIsDiving                         : EpExpressionInfo;
    ActCurrentBuildMaterial             : EpExpressionInfo;
    ActCurrentProduceMaterial           : EpExpressionInfo;
    ActCurrentPromotion                 : EpExpressionInfo;
    ActIsCoOnboard                      : EpExpressionInfo;
    ActAiMode                           : EpExpressionInfo;
    ActGroupedTagId                     : EpExpressionInfo;
    ActForbiddenGroupedLocationIdArray  : EpExpressionInfo;
    ActAiWeightedDestination            : EpExpressionInfo;
} = {
    ConUnitFilter       : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.UnitFilter),
        getHelpText     : () => getText(TextType.A0605),
    },
    ActUnitType : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.B0525),
        getHelpText     : () => getText(TextType.A0606),
    },
    ActActionState : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B0367),
        getHelpText     : () => getText(TextType.A0607),
    },
    ActCurrentHp : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.Hp),
        getHelpText     : () => getText(TextType.A0609),
    },
    ActPrimaryWeaponCurrentAmmo : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.PrimaryWeaponAmmo),
        getHelpText     : () => getText(TextType.A0608),
    },
    ActFlareCurrentAmmo : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.FlareAmmo),
        getHelpText     : () => getText(TextType.A0611),
    },
    ActCurrentFuel : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.Fuel),
        getHelpText     : () => getText(TextType.A0612),
    },
    ActIsDiving : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B0371),
        getHelpText     : () => getText(TextType.A0610),
    },
    ActCurrentBuildMaterial : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.BuildMaterial),
        getHelpText     : () => getText(TextType.A0613),
    },
    ActCurrentProduceMaterial : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.ProductionMaterial),
        getHelpText     : () => getText(TextType.A0614),
    },
    ActCurrentPromotion : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.Promotion),
        getHelpText     : () => getText(TextType.A0615),
    },
    ActIsCoOnboard : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.CoOnboard),
        getHelpText     : () => getText(TextType.A0616),
    },
    ActAiMode : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.AiMode),
        getHelpText     : () => getText(TextType.A0617),
    },
    ActGroupedTagId : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => getText(TextType.Tags),
        getHelpText     : () => getText(TextType.A0618),
    },
    ActForbiddenGroupedLocationIdArray : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => getText(TextType.NoEntryLocations),
        getHelpText     : () => getText(TextType.A0619),
    },
    ActAiWeightedDestination : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => getText(TextType.AiDestination),
        getHelpText     : () => getText(TextType.A0620),
    },
};
