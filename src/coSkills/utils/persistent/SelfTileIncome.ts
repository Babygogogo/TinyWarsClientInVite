import type { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import type { SelfTileIncome } from "../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfTileIncome.ts";

export function getTotalMultiplier({
    cfg,
    gameConfig,
    tileTypeId,
    gridIndex,
    coZoneRadius,
    getCoGridIndexArrayOnMap,
}: {
    cfg                         : SelfTileIncome | null | undefined;
    gameConfig                  : GameConfig;
    tileTypeId                  : number;
    gridIndex                   : GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => GridIndex[];
}): number {
    if (cfg == null) {
        return 1;
    }

    {
        const tileCategoryId = cfg.getTileCategoryId();
        if ((tileCategoryId != null) && (!gameConfig.checkIsTileTypeInCategory(tileTypeId, tileCategoryId))) {
            return 1;
        }
    }

    if (!gridIndex.checkIsInsideCoSkillArea({
        coSkillAreaType             : cfg.getCoSkillAreaTypeId() ?? 0,
        coZoneRadius                : coZoneRadius,
        getCoGridIndexArrayOnMap    : getCoGridIndexArrayOnMap,
    })) {
        return 1;
    }

    return (cfg.getMultiplierPct() ?? 0) / 100;
}
