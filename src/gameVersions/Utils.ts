import {
    GameVersions_Constants,
    Helpers_Misc,
    type GameVersions_Types,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";

export function getGameEssentialConfig(version: GameVersions_Constants.TypeName): AuxiliaryTypes_AuxiliaryTypes.Undefinable<GameVersions_Types.GameVersionConfig> {
    return GameVersions_Constants.ConfigDict.get(version);
}
export function getCurrentGameEssentialConfig(): GameVersions_Types.GameVersionConfig {
    return Helpers_Misc.getExisted(getGameEssentialConfig(window.GAME_VERSION));
}
