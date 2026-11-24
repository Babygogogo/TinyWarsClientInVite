import type {
    AuxiliaryTypes_GridIndex,
    GameConfigs_GameConfig,
    Tiles_TileMap,
    Units_Unit,
} from "../../../internal.ts";
import type { Conditions } from "../../../proto/schema/CommonProto/Config/CoSkillCfg/InstantManual/UnitAttributes/Conditions.ts";

export function checkIsMeet({
    conditions,
    unit,
    tileMap,
    weatherTypeId,
    skillUserCoGridIndexList,
    skillUserCoZoneRadius,
    gameConfig,
    isSkillUserCoOnboard,
}: {
    conditions                  : Conditions;
    unit                        : Units_Unit.Unit;
    tileMap                     : Tiles_TileMap.TileMap;
    weatherTypeId               : number;
    skillUserCoGridIndexList    : AuxiliaryTypes_GridIndex.GridIndex[];
    skillUserCoZoneRadius       : number;
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    isSkillUserCoOnboard        : boolean;
}): boolean {
    if (!unit.checkIsMeetLoadedState(conditions.getUnitLoadedStateId())) {
        return false;
    }

    if (!gameConfig.checkIsUnitTypeInCategory(unit.getUnitTypeId(), conditions.getUnitCategoryId())) {
        return false;
    }

    const gridIndex = unit.getGridIndex();
    if (!gameConfig.checkIsTileTypeInCategory(tileMap.getTile(gridIndex).getTileTypeId(), conditions.getTileCategoryId())) {
        return false;
    }

    if (!gameConfig.checkIsWeatherTypeInCategory(weatherTypeId, conditions.getWeatherCategoryId())) {
        return false;
    }

    return (isSkillUserCoOnboard)
        || (gridIndex.checkIsInsideCoSkillArea({
            coSkillAreaType          : conditions.getCoSkillAreaTypeId(),
            getCoGridIndexArrayOnMap : () => skillUserCoGridIndexList,
            coZoneRadius             : skillUserCoZoneRadius,
        }));
}
