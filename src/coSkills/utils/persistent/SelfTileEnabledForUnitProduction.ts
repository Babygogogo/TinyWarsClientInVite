import type * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import type * as ProtoSchemaCommonProtoConfigCoSkillCfgPersistentSelfTileEnabledForUnitProduction from "../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfTileEnabledForUnitProduction.ts";

export function checkIsEffective({
    cfg,
    gameConfig,
    tileTypeId,
    gridIndex,
    coZoneRadius,
    getCoGridIndexArrayOnMap,
}: {
    cfg                         : ProtoSchemaCommonProtoConfigCoSkillCfgPersistentSelfTileEnabledForUnitProduction.SelfTileEnabledForUnitProduction | null | undefined;
    gameConfig                  : GameConfigGcData.GcData;
    tileTypeId                  : number;
    gridIndex                   : AuxiliaryTypesGridIndex.GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => AuxiliaryTypesGridIndex.GridIndex[];
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
        coSkillAreaType             : cfg.getCoSkillAreaTypeId() ?? 0,
        coZoneRadius                : coZoneRadius,
        getCoGridIndexArrayOnMap    : getCoGridIndexArrayOnMap,
    })) {
        return false;
    }

    return true;
}
