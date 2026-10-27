import type { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import type { SelfUnitCommonAttributes } from "../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitCommonAttributes";

export function getTotalOffset({
    cfg,
    gameConfig,
    unitTypeId,
    tileTypeId,
    weatherTypeId,
    isCoOnboard,
    gridIndex,
    coZoneRadius,
    getCoGridIndexArrayOnMap,
}: {
    cfg                         : SelfUnitCommonAttributes | null | undefined;
    gameConfig                  : GameConfig;
    unitTypeId                  : number;
    tileTypeId                  : number;
    weatherTypeId               : number;
    isCoOnboard                 : boolean;
    gridIndex                   : GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => GridIndex[];
}): number {
    if (cfg == null) {
        return 0;
    }

    const conditions        = cfg.getConditions();
    const moveRangeOffsets  = cfg.getMoveRangeOffsets();
    if ((conditions == null) || (moveRangeOffsets == null)) {
        return 0;
    }

    {
        if (!gameConfig.checkIsUnitTypeInCategory(unitTypeId, conditions.getUnitCategoryId())) {
            return 0;
        }

        if (!gameConfig.checkIsTileTypeInCategory(tileTypeId, conditions.getTileCategoryId())) {
            return 0;
        }

        if (!gameConfig.checkIsWeatherTypeInCategory(weatherTypeId, conditions.getWeatherCategoryId())) {
            return 0;
        }

        if ((!isCoOnboard)                                                  &&
            (!gridIndex.checkIsInsideCoSkillArea({
                coSkillAreaType          : conditions.getCoSkillAreaTypeId(),
                coZoneRadius             : coZoneRadius,
                getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
            }))
        ) {
            return 0;
        }
    }

    return moveRangeOffsets.getOffset() ?? 0;
}
