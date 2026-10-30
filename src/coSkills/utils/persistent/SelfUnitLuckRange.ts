import {
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_GridIndex,
} from "../../../internal.ts";
import type { SelfUnitLuckRange } from "../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitLuckRange.ts";

export function getTotalOffset({
    cfg,
    gameConfig,
    unitTypeId,
    isCoOnboard,
    gridIndex,
    coZoneRadius,
    getCoGridIndexArrayOnMap,
}: {
    cfg                         : SelfUnitLuckRange | null | undefined;
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    unitTypeId                  : number;
    isCoOnboard                 : boolean;
    gridIndex                   : AuxiliaryTypes_GridIndex.GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => AuxiliaryTypes_GridIndex.GridIndex[];
}): { lower: number; upper: number } {
    if (cfg == null) {
        return { lower : 0, upper : 0 };
    }

    {
        const unitCategoryId = cfg.getUnitCategoryId();
        if ((unitCategoryId != null) && (!gameConfig.checkIsUnitTypeInCategory(unitTypeId, unitCategoryId))) {
            return { lower : 0, upper : 0 };
        }
    }

    if ((!isCoOnboard)                                                  &&
        (!gridIndex.checkIsInsideCoSkillArea({
            coSkillAreaType          : cfg.getCoSkillAreaTypeId(),
            coZoneRadius             : coZoneRadius,
            getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
        }))
    ) {
        return { lower : 0, upper : 0 };
    }

    return { lower : cfg.getLowerOffset(), upper : cfg.getUpperOffset() };
}
export function getTotalOffsetForDamageCalculatorPanel({
    cfg,
    gameConfig,
    unitTypeId,
}: {
    cfg                         : SelfUnitLuckRange | null | undefined;
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    unitTypeId                  : number;
}): { lower: number; upper: number } {
    if (cfg == null) {
        return { lower : 0, upper : 0 };
    }

    {
        const unitCategoryId = cfg.getUnitCategoryId();
        if ((unitCategoryId != null) && (!gameConfig.checkIsUnitTypeInCategory(unitTypeId, unitCategoryId))) {
            return { lower : 0, upper : 0 };
        }
    }

    return { lower : cfg.getLowerOffset(), upper : cfg.getUpperOffset() };
}
