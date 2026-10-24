import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import type * as ProtoSchemaCommonProtoConfigCoSkillCfgPersistentSelfUnitCost from "../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitCost.ts";

export function getTotalMultiplier({ cfg, gameConfig, unitTypeId }: {
    cfg        : ProtoSchemaCommonProtoConfigCoSkillCfgPersistentSelfUnitCost.SelfUnitCost | null | undefined;
    gameConfig : GameConfigGcData.GcData;
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
