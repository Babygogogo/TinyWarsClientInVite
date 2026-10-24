import type * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import type * as ProtoSchemaCommonProtoConfigCoSkillCfgPersistentSelfUnitLuckRange from "../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitLuckRange.ts";

export function getTotalOffset({
    cfg,
    gameConfig,
    unitTypeId,
    isCoOnboard,
    gridIndex,
    coZoneRadius,
    getCoGridIndexArrayOnMap,
}: {
    cfg                         : ProtoSchemaCommonProtoConfigCoSkillCfgPersistentSelfUnitLuckRange.SelfUnitLuckRange | null | undefined;
    gameConfig                  : GameConfigGcData.GcData;
    unitTypeId                  : number;
    isCoOnboard                 : boolean;
    gridIndex                   : AuxiliaryTypesGridIndex.GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => AuxiliaryTypesGridIndex.GridIndex[];
}): { lower: number; upper: number } {
    if (cfg == null) {
        return { lower: 0, upper: 0 };
    }

    {
        const unitCategoryId = cfg.getUnitCategoryId();
        if ((unitCategoryId != null) && (!gameConfig.checkIsUnitTypeInCategory(unitTypeId, unitCategoryId))) {
            return { lower: 0, upper: 0 };
        }
    }

    if ((!isCoOnboard)                                                  &&
        (!gridIndex.checkIsInsideCoSkillArea({
            coSkillAreaType             : cfg.getCoSkillAreaTypeId() ?? 0,
            coZoneRadius                : coZoneRadius,
            getCoGridIndexArrayOnMap    : getCoGridIndexArrayOnMap,
        }))
    ) {
        return { lower: 0, upper: 0 };
    }

    return { lower: cfg.getLowerOffset() ?? 0, upper: cfg.getUpperOffset() ?? 0 };
}
export function getTotalOffsetForDamageCalculatorPanel({
    cfg,
    gameConfig,
    unitTypeId,
}: {
    cfg                         : ProtoSchemaCommonProtoConfigCoSkillCfgPersistentSelfUnitLuckRange.SelfUnitLuckRange | null | undefined;
    gameConfig                  : GameConfigGcData.GcData;
    unitTypeId                  : number;
}): { lower: number; upper: number } {
    if (cfg == null) {
        return { lower: 0, upper: 0 };
    }

    {
        const unitCategoryId = cfg.getUnitCategoryId();
        if ((unitCategoryId != null) && (!gameConfig.checkIsUnitTypeInCategory(unitTypeId, unitCategoryId))) {
            return { lower: 0, upper: 0 };
        }
    }

    return { lower: cfg.getLowerOffset() ?? 0, upper: cfg.getUpperOffset() ?? 0 };
}
