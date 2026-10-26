import type { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { GcData } from "../../../gameConfigs/GcData.ts";
import type { SelfUnitFuelConsumption } from "../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitFuelConsumption.ts";

export function getTotalOffset({
    cfg,
    gameConfig,
    unitTypeId,
    isCoOnboard,
    gridIndex,
    coZoneRadius,
    getCoGridIndexArrayOnMap,
}: {
    cfg                         : SelfUnitFuelConsumption | null | undefined;
    gameConfig                  : GcData;
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

    return cfg.getOffset() ?? 0;
}
