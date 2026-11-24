import type {
    AuxiliaryTypes_GridIndex,
    GameConfigs_GameConfig,
    Tiles_TileMap,
    Units_Unit,
} from "../../../internal.ts";
import type { Conditions } from "../../../proto/schema/CommonProto/Config/CoSkillCfg/InstantManual/UnitAttributes/Conditions.ts";

export function checkIsMeet({
    conditions, unit, tileMap, weatherTypeId, coGridIndexList, coZoneRadius, gameConfig,
}: {
    conditions      : Conditions;
    unit            : Units_Unit.Unit;
    tileMap         : Tiles_TileMap.TileMap;
    weatherTypeId   : number;
    coGridIndexList  : AuxiliaryTypes_GridIndex.GridIndex[];
    coZoneRadius    : number;
    gameConfig      : GameConfigs_GameConfig.GameConfig;
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

    return unit.getIsCoOnboard() || gridIndex.checkIsInsideCoSkillArea({
        coSkillAreaType          : conditions.getCoSkillAreaTypeId(),
        getCoGridIndexArrayOnMap : () => coGridIndexList,
        coZoneRadius             : coZoneRadius,
    });
}
