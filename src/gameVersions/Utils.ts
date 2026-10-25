import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { TypeName, ConfigDict } from "./Constants.ts";
import type { GameVersionConfig as GameVersionsTypesGameVersionConfig } from "./Types.ts";
import { getExisted } from "../helpers/Misc.ts";

type GameVersionConfig  = GameVersionsTypesGameVersionConfig;
type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;

export function getGameEssentialConfig(version: TypeName): Undefinable<GameVersionConfig> {
    return ConfigDict.get(version);
}
export function getCurrentGameEssentialConfig(): GameVersionConfig {
    return getExisted(getGameEssentialConfig(window.GAME_VERSION));
}
