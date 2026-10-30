import {
    ContextType,
    ResultType,
} from "../../../expressionParsers/Enums.ts";
import type { EpExpressionInfo } from "../../../expressionParsers/Types.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";

export const ExpressionInfoDict: {
    ConTileFilter                       : EpExpressionInfo;
    ActUnitType                         : EpExpressionInfo;
    ActPlayerIndex                      : EpExpressionInfo;
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
    ActGroupedTagId                     : EpExpressionInfo;
    ActForbiddenGroupedLocationIdArray  : EpExpressionInfo;
    ActAiWeightedDestination            : EpExpressionInfo;
} = {
    ConTileFilter       : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.TileFilter),
        getHelpText     : () => getText(TextType.A0586),
    },
    ActUnitType : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.B0525),
        getHelpText     : () => getText(TextType.A0588),
    },
    ActPlayerIndex : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : true,
        getTitleText    : () => getText(TextType.PlayerIndex),
        getHelpText     : () => getText(TextType.A0587),
    },
    ActActionState : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B0367),
        getHelpText     : () => getText(TextType.A0589),
    },
    ActCurrentHp : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.Hp),
        getHelpText     : () => getText(TextType.A0591),
    },
    ActPrimaryWeaponCurrentAmmo : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.PrimaryWeaponAmmo),
        getHelpText     : () => getText(TextType.A0590),
    },
    ActFlareCurrentAmmo : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.FlareAmmo),
        getHelpText     : () => getText(TextType.A0594),
    },
    ActCurrentFuel : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.Fuel),
        getHelpText     : () => getText(TextType.A0595),
    },
    ActIsCapturingTile : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1189),
        getHelpText     : () => getText(TextType.A0592),
    },
    ActIsDiving : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B0371),
        getHelpText     : () => getText(TextType.A0593),
    },
    ActCurrentBuildMaterial : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.BuildMaterial),
        getHelpText     : () => getText(TextType.A0596),
    },
    ActCurrentProduceMaterial : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.ProductionMaterial),
        getHelpText     : () => getText(TextType.A0597),
    },
    ActCurrentPromotion : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.Promotion),
        getHelpText     : () => getText(TextType.A0598),
    },
    ActIsBuildingTile : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.B1188),
        getHelpText     : () => getText(TextType.A0599),
    },
    ActIsCoOnboard : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.CoOnboard),
        getHelpText     : () => getText(TextType.A0600),
    },
    ActAiMode : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.Number],
        isRequired      : false,
        getTitleText    : () => getText(TextType.AiMode),
        getHelpText     : () => getText(TextType.A0601),
    },
    ActGroupedTagId : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => getText(TextType.Tags),
        getHelpText     : () => getText(TextType.A0602),
    },
    ActForbiddenGroupedLocationIdArray : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => getText(TextType.NoEntryLocations),
        getHelpText     : () => getText(TextType.A0603),
    },
    ActAiWeightedDestination : {
        contextType     : ContextType.Tile,
        resultTypes     : [ResultType.NumberArray],
        isRequired      : false,
        getTitleText    : () => getText(TextType.AiDestination),
        getHelpText     : () => getText(TextType.A0604),
    },
};
