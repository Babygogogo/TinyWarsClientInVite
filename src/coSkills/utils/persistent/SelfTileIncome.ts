import {
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_GridIndex,
} from "../../../internal.ts";
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
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    tileTypeId                  : number;
    gridIndex                   : AuxiliaryTypes_GridIndex.GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => AuxiliaryTypes_GridIndex.GridIndex[];
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
        coSkillAreaType             : cfg.getCoSkillAreaTypeId(),
        coZoneRadius                : coZoneRadius,
        getCoGridIndexArrayOnMap    : getCoGridIndexArrayOnMap,
    })) {
        return 1;
    }

    return (cfg.getMultiplierPct()) / 100;
}
