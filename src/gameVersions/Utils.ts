import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as GameVersionsConstants from "./Constants.ts";
import type * as GameVersionsTypes from "./Types.ts";
import * as HelpersMisc from "../helpers/Misc.ts";

type GameVersionConfig  = GameVersionsTypes.GameVersionConfig;
type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export function getGameEssentialConfig(version: GameVersionsConstants.TypeName): Undefinable<GameVersionConfig> {
    return GameVersionsConstants.ConfigDict.get(version);
}
export function getCurrentGameEssentialConfig(): GameVersionConfig {
    return HelpersMisc.getExisted(getGameEssentialConfig(window.GAME_VERSION));
}
