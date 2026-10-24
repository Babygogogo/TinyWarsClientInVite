import type * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import type * as ProtoSchemaCommonProtoConfigCoSkillCfgPersistentSelfUnitMoveRange from "../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitMoveRange.ts";

export function getTotalOffset({
    cfg,
    gameConfig,
    unitTypeId,
    tileTypeId,
    weatherTypeId,
    isCoOnboard,
    gridIndex,
    coZoneRadius,
    getCoGridIndexArrayOnMap,
}: {
    cfg                         : ProtoSchemaCommonProtoConfigCoSkillCfgPersistentSelfUnitMoveRange.SelfUnitMoveRange | null | undefined;
    gameConfig                  : GameConfigGcData.GcData;
    unitTypeId                  : number;
    tileTypeId                  : number;
    weatherTypeId               : number;
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

    {
        const tileCategoryId = cfg.getTileCategoryId();
        if ((tileCategoryId != null) && (!gameConfig.checkIsTileTypeInCategory(tileTypeId, tileCategoryId))) {
            return 0;
        }
    }

    {
        const weatherCategoryId = cfg.getWeatherCategoryId();
        if ((weatherCategoryId != null) && (!gameConfig.checkIsWeatherTypeInCategory(weatherTypeId, weatherCategoryId))) {
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
