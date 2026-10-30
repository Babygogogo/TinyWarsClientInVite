import {
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_GridIndex,
} from "../../../internal.ts";
import type { SelfUnitPromotionAfterBattle } from "../../../proto/schema/CommonProto/Config/CoSkillCfg/InstantMisc/SelfUnitPromotionAfterBattle.ts";

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
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    unitTypeId                  : number;
    isCoOnboard                 : boolean;
    gridIndex                   : AuxiliaryTypes_GridIndex.GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => AuxiliaryTypes_GridIndex.GridIndex[];
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
            coSkillAreaType          : cfg.getCoSkillAreaTypeId(),
            coZoneRadius             : coZoneRadius,
            getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
        }))
    ) {
        return 0;
    }

    const arr = cfg.getOffsetFromDamageDealt();
    return (arr.length ? arr[Math.min(targetLostNormalizedHp, arr.length - 1)] : 0)
        + (isTargetKilled ? cfg.getOffsetFromKill() : 0);
}
