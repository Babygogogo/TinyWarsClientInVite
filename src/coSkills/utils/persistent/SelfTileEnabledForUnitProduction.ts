import {
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_GridIndex,
} from "../../../internal.ts";
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
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    tileTypeId                  : number;
    gridIndex                   : AuxiliaryTypes_GridIndex.GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => AuxiliaryTypes_GridIndex.GridIndex[];
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
        coSkillAreaType          : cfg.getCoSkillAreaTypeId(),
        coZoneRadius             : coZoneRadius,
        getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
    })) {
        return false;
    }

    return true;
}
