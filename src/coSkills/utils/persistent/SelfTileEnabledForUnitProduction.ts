import type { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import type { SelfTileEnabledForUnitProduction } from "../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfTileEnabledForUnitProduction.ts";

export function checkIsEffective({
    cfg,
    gameConfig,
    tileTypeId,
    gridIndex,
    coZoneRadius,
    getCoGridIndexArrayOnMap,
}: {
    cfg                         : SelfTileEnabledForUnitProduction | null | undefined;
    gameConfig                  : GameConfig;
    tileTypeId                  : number;
    gridIndex                   : GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => GridIndex[];
}): boolean {
    if (cfg == null) {
        return false;
    }

    {
        const tileCategoryId = cfg.getTileCategoryId();
        if ((tileCategoryId != null) && (!gameConfig.checkIsTileTypeInCategory(tileTypeId, tileCategoryId))) {
            return false;
        }
    }

    if (!gridIndex.checkIsInsideCoSkillArea({
        coSkillAreaType             : cfg.getCoSkillAreaTypeId(),
        coZoneRadius                : coZoneRadius,
        getCoGridIndexArrayOnMap    : getCoGridIndexArrayOnMap,
    })) {
        return false;
    }

    return true;
}
