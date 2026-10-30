import {
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_GridIndex,
} from "../../../internal.ts";
import type { SelfUnitCaptureAmount } from "../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitCaptureAmount.ts";

export function getTotalOffsetPct({
    cfg,
    gameConfig,
    unitTypeId,
    isCoOnboard,
    gridIndex,
    coZoneRadius,
    getCoGridIndexArrayOnMap,
}: {
    cfg                         : SelfUnitCaptureAmount | null | undefined;
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    unitTypeId                  : number;
    isCoOnboard                 : boolean;
    gridIndex                   : AuxiliaryTypes_GridIndex.GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => AuxiliaryTypes_GridIndex.GridIndex[];
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
            coSkillAreaType             : cfg.getCoSkillAreaTypeId(),
            coZoneRadius                : coZoneRadius,
            getCoGridIndexArrayOnMap    : getCoGridIndexArrayOnMap,
        }))
    ) {
        return 0;
    }

    return cfg.getOffsetPct();
}
