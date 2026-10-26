import type { GcData } from "../../../gameConfigs/GcData.ts";
import type { SelfCanCoBoard } from "../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfCanCoBoard.ts";

export function checkCanCoBoard({
    cfg,
    gameConfig,
    unitTypeId,
    tileTypeId,
    isOwnTile,
}: {
    cfg             : SelfCanCoBoard | null | undefined;
    gameConfig      : GcData;
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
