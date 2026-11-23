import {
    type AuxiliaryTypes_GridIndex,
    type GameConfigs_GameConfig,
} from "../../../../internal.ts";
import type { Conditions } from "../../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfTileCommonAttributes/Conditions.ts";

export function checkIsMeet({
    conditions,
    gameConfig,
    tileTypeId,
    weatherTypeId,
    gridIndex,
    coZoneRadius,
    getCoGridIndexArrayOnMap,
}: {
    conditions                  : Conditions | null | undefined;
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    tileTypeId                  : number;
    weatherTypeId               : number;
    gridIndex                   : AuxiliaryTypes_GridIndex.GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => AuxiliaryTypes_GridIndex.GridIndex[];
}): boolean {
    return (conditions != null)
        && gameConfig.checkIsTileTypeInCategory(tileTypeId, conditions.getTileCategoryId())
        && gameConfig.checkIsWeatherTypeInCategory(weatherTypeId, conditions.getWeatherCategoryId())
        && gridIndex.checkIsInsideCoSkillArea({
            coSkillAreaType          : conditions.getCoSkillAreaTypeId(),
            coZoneRadius             : coZoneRadius,
            getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
        });
}
