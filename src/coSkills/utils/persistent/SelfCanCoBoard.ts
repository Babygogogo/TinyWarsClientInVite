import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import type * as ProtoSchemaCommonProtoConfigCoSkillCfgPersistentSelfCanCoBoard from "../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfCanCoBoard.ts";

export function checkCanCoBoard({
    cfg,
    gameConfig,
    unitTypeId,
    tileTypeId,
    isOwnTile,
}: {
    cfg             : ProtoSchemaCommonProtoConfigCoSkillCfgPersistentSelfCanCoBoard.SelfCanCoBoard | null | undefined;
    gameConfig      : GameConfigGcData.GcData;
    unitTypeId      : number;
    tileTypeId      : number;
    isOwnTile       : boolean;
}): boolean | null {
    if (cfg == null) {
        return null;
    }

    {
        const unitCategoryId = cfg.getUnitCategoryId();
        if ((unitCategoryId != null) && (!gameConfig.checkIsUnitTypeInCategory(unitTypeId, unitCategoryId))) {
            return null;
        }
    }

    {
        const tileCategoryId = cfg.getTileCategoryId();
        if ((tileCategoryId != null) && (!gameConfig.checkIsTileTypeInCategory(tileTypeId, tileCategoryId))) {
            return null;
        }
    }

    {
        const isOwnTileValue = cfg.getIsOwnTile();
        if ((isOwnTileValue != null) && (isOwnTile !== isOwnTileValue)) {
            return null;
        }
    }

    return !!cfg.getCanBoard();
}
