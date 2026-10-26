import type { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import type {
    SelfUnitPromotionAfterBattle,
} from "../../../proto/schema/CommonProto/Config/CoSkillCfg/InstantMisc/SelfUnitPromotionAfterBattle.ts";

export function getTotalOffset({
    cfg,
    gameConfig,
    unitTypeId,
    isCoOnboard,
    gridIndex,
    coZoneRadius,
    getCoGridIndexArrayOnMap,
    targetLostNormalizedHp,
    isTargetKilled,
}: {
    cfg                         : SelfUnitPromotionAfterBattle | null | undefined;
    gameConfig                  : GameConfig;
    unitTypeId                  : number;
    isCoOnboard                 : boolean;
    gridIndex                   : GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => GridIndex[];
    targetLostNormalizedHp      : number;
    isTargetKilled              : boolean;
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

    const arr = cfg.getOffsetFromDamageDealt() ?? [];
    return (arr.length ? arr[Math.min(targetLostNormalizedHp, arr.length - 1)] : 0)
        + (isTargetKilled ? cfg.getOffsetFromKill() ?? 0 : 0);
}
