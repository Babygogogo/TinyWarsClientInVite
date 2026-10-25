import { ContextType, ResultType } from "../../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../../expressionParsers/Types.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConUnitFilter                       : EpExpressionInfo;
    ActActionState                      : EpExpressionInfo;
    ActCurrentHp                        : EpExpressionInfo;
    ActPrimaryWeaponCurrentAmmo         : EpExpressionInfo;
    ActFlareCurrentAmmo                 : EpExpressionInfo;
    ActCurrentFuel                      : EpExpressionInfo;
    ActIsCapturingTile                  : EpExpressionInfo;
    ActIsDiving                         : EpExpressionInfo;
    ActCurrentBuildMaterial             : EpExpressionInfo;
    ActCurrentProduceMaterial           : EpExpressionInfo;
    ActCurrentPromotion                 : EpExpressionInfo;
    ActIsBuildingTile                   : EpExpressionInfo;
    ActIsCoOnboard                      : EpExpressionInfo;
    ActAiMode                           : EpExpressionInfo;
    ActCustomNameId                     : EpExpressionInfo;
    ActGroupedTagId                     : EpExpressionInfo;
    ActForbiddenGroupedLocationIdArray  : EpExpressionInfo;
    ActAiWeightedDestination            : EpExpressionInfo;
} = {
    ConUnitFilter       : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.UnitFilter),
        getHelpText     : () => getText(TextType.A0626),
    },
    ActActionState : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B0367),
        getHelpText     : () => getText(TextType.A0627),
    },
    ActCurrentHp : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.Hp),
        getHelpText     : () => getText(TextType.A0629),
    },
    ActPrimaryWeaponCurrentAmmo : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.PrimaryWeaponAmmo),
        getHelpText     : () => getText(TextType.A0628),
    },
    ActFlareCurrentAmmo : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.FlareAmmo),
        getHelpText     : () => getText(TextType.A0632),
    },
    ActCurrentFuel : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.Fuel),
        getHelpText     : () => getText(TextType.A0633),
    },
    ActIsCapturingTile : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1189),
        getHelpText     : () => getText(TextType.A0630),
    },
    ActIsDiving : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B0371),
        getHelpText     : () => getText(TextType.A0631),
    },
    ActCurrentBuildMaterial : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.BuildMaterial),
        getHelpText     : () => getText(TextType.A0634),
    },
    ActCurrentProduceMaterial : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.ProductionMaterial),
        getHelpText     : () => getText(TextType.A0635),
    },
    ActCurrentPromotion : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.Promotion),
        getHelpText     : () => getText(TextType.A0636),
    },
    ActIsBuildingTile : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1188),
        getHelpText     : () => getText(TextType.A0637),
    },
    ActIsCoOnboard : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.CoOnboard),
        getHelpText     : () => getText(TextType.A0638),
    },
    ActAiMode : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.AiMode),
        getHelpText     : () => getText(TextType.A0639),
    },
    ActCustomNameId : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.CustomNameId),
        getHelpText     : () => getText(TextType.A0960),
    },
    ActGroupedTagId : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => getText(TextType.Tags),
        getHelpText     : () => getText(TextType.A0640),
    },
    ActForbiddenGroupedLocationIdArray : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => getText(TextType.NoEntryLocations),
        getHelpText     : () => getText(TextType.A0641),
    },
    ActAiWeightedDestination : {
        contextType     : ContextType.Unit,
        resultTypes     : [ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => getText(TextType.AiDestination),
        getHelpText     : () => getText(TextType.A0642),
    },
};
