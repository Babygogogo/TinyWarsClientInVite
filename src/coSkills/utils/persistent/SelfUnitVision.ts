import {
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_GridIndex,
} from "../../../internal.ts";
import type { SelfUnitVision } from "../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitVision.ts";

export function getTotalRangeOffset({
    cfg,
    gameConfig,
    unitTypeId,
    isCoOnboard,
    gridIndex,
    coZoneRadius,
    getCoGridIndexArrayOnMap,
}: {
    cfg                         : SelfUnitVision | null | undefined;
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    unitTypeId                  : number;
    isCoOnboard                 : boolean;
    gridIndex                   : AuxiliaryTypes_GridIndex.GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => AuxiliaryTypes_GridIndex.GridIndex[];
}): number {
    if (cfg == null) {
        return 0;
    }

    const rangeOffset = cfg.getRangeOffset();
    if (rangeOffset === 0) {
        return 0;
    }

    {
        const unitCategoryId = cfg.getUnitCategoryId();
        if ((unitCategoryId != null) && (!gameConfig.checkIsUnitTypeInCategory(unitTypeId, unitCategoryId))) {
            return 0;
        }
    }

    if ((!isCoOnboard)                                                  &&
        (!gridIndex.checkIsInsideCoSkillArea({
            coSkillAreaType          : cfg.getCoSkillAreaTypeId(),
            coZoneRadius             : coZoneRadius,
            getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
        }))
    ) {
        return 0;
    }

    return rangeOffset;
}
export function checkCanSeeThrough({
    cfg,
    gameConfig,
    unitTypeId,
    isCoOnboard,
    gridIndex,
    coZoneRadius,
    getCoGridIndexArrayOnMap,
}: {
    cfg                         : SelfUnitVision | null | undefined;
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    unitTypeId                  : number;
    isCoOnboard                 : boolean;
    gridIndex                   : AuxiliaryTypes_GridIndex.GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => AuxiliaryTypes_GridIndex.GridIndex[];
}): boolean {
    if (cfg == null) {
        return false;
    }

    const canSeeThrough = !!cfg.getCanSeeThrough();
    if (!canSeeThrough) {
        return false;
    }

    {
        const unitCategoryId = cfg.getUnitCategoryId();
        if ((unitCategoryId != null) && (!gameConfig.checkIsUnitTypeInCategory(unitTypeId, unitCategoryId))) {
            return false;
        }
    }

    if ((!isCoOnboard)                                                  &&
        (!gridIndex.checkIsInsideCoSkillArea({
            coSkillAreaType          : cfg.getCoSkillAreaTypeId(),
            coZoneRadius             : coZoneRadius,
            getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
        }))
    ) {
        return false;
    }

    return canSeeThrough;
}
