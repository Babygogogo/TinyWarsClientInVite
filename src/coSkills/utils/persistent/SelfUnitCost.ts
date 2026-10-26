import type { GcData } from "../../../gameConfigs/GcData.ts";
import type { SelfUnitCost } from "../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitCost.ts";

export function getTotalMultiplier({ cfg, gameConfig, unitTypeId }: {
    cfg        : SelfUnitCost | null | undefined;
    gameConfig : GcData;
    unitTypeId : number;
}): number {
    if (cfg == null) {
        return 1;
    }

    {
        const unitCategoryId = cfg.getUnitCategoryId();
        if ((unitCategoryId != null) && (!gameConfig.checkIsUnitTypeInCategory(unitTypeId, unitCategoryId))) {
            return 1;
        }
    }

    return (cfg.getMultiplierPct() ?? 0) / 100;
}
