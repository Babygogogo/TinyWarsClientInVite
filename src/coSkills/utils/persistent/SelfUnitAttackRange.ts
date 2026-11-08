import {
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_GridIndex,
} from "../../../internal.ts";
import type { SelfUnitAttackRange } from "../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitAttackRange.ts";

export function getTotalUpperOffset({
    cfg,
    gameConfig,
    unitTypeId,
    isCoOnboard,
    gridIndex,
    coZoneRadius,
    getCoGridIndexArrayOnMap,
}: {
    cfg                         : SelfUnitAttackRange | null | undefined;
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

    return cfg.getUpperOffset();
}
