import type * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import type * as ProtoSchemaCommonProtoConfigCoSkillCfgPersistentSelfTileIncome from "../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfTileIncome.ts";

export function getTotalMultiplier({
    cfg,
    gameConfig,
    tileTypeId,
    gridIndex,
    coZoneRadius,
    getCoGridIndexArrayOnMap,
}: {
    cfg                         : ProtoSchemaCommonProtoConfigCoSkillCfgPersistentSelfTileIncome.SelfTileIncome | null | undefined;
    gameConfig                  : GameConfigGcData.GcData;
    tileTypeId                  : number;
    gridIndex                   : AuxiliaryTypesGridIndex.GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => AuxiliaryTypesGridIndex.GridIndex[];
}): number {
    if (cfg == null) {
        return 1;
    }

    {
        const tileCategoryId = cfg.getTileCategoryId();
        if ((tileCategoryId != null) && (!gameConfig.checkIsTileTypeInCategory(tileTypeId, tileCategoryId))) {
            return 1;
        }
    }

    if (!gridIndex.checkIsInsideCoSkillArea({
        coSkillAreaType             : cfg.getCoSkillAreaTypeId() ?? 0,
        coZoneRadius                : coZoneRadius,
        getCoGridIndexArrayOnMap    : getCoGridIndexArrayOnMap,
    })) {
        return 1;
    }

    return (cfg.getMultiplierPct() ?? 0) / 100;
}
