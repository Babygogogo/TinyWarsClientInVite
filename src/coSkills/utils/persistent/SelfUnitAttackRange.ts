import type * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import type * as ProtoSchemaCommonProtoConfigCoSkillCfgPersistentSelfUnitAttackRange from "../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitAttackRange.ts";

export function getTotalUpperOffset({
    cfg,
    gameConfig,
    unitTypeId,
    isCoOnboard,
    gridIndex,
    coZoneRadius,
    getCoGridIndexArrayOnMap,
}: {
    cfg                         : ProtoSchemaCommonProtoConfigCoSkillCfgPersistentSelfUnitAttackRange.SelfUnitAttackRange | null | undefined;
    gameConfig                  : GameConfigGcData.GcData;
    unitTypeId                  : number;
    isCoOnboard                 : boolean;
    gridIndex                   : AuxiliaryTypesGridIndex.GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => AuxiliaryTypesGridIndex.GridIndex[];
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
