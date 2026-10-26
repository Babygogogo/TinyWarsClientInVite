import type { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { GameConfig } from "../../../gameConfigs/GameConfig.ts";
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
    gameConfig                  : GameConfig;
    unitTypeId                  : number;
    isCoOnboard                 : boolean;
    gridIndex                   : GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => GridIndex[];
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
            coSkillAreaType             : cfg.getCoSkillAreaTypeId() ?? 0,
            coZoneRadius                : coZoneRadius,
            getCoGridIndexArrayOnMap    : getCoGridIndexArrayOnMap,
        }))
    ) {
        return 0;
    }

    return cfg.getUpperOffset() ?? 0;
}
