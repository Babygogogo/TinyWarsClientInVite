import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import {
    TypeName,
    ConfigDict,
} from "./Constants.ts";
import type { GameVersionConfig } from "./Types.ts";
import { getExisted } from "../helpers/Misc.ts";

export function getGameEssentialConfig(version: TypeName): Undefinable<GameVersionConfig> {
    return ConfigDict.get(version);
}
export function getCurrentGameEssentialConfig(): GameVersionConfig {
    return getExisted(getGameEssentialConfig(window.GAME_VERSION));
}
