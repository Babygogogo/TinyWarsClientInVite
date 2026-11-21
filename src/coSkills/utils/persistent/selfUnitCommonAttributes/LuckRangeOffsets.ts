import {
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_GridIndex,
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions,
} from "../../../../internal.ts";
import type { SelfUnitCommonAttributes } from "../../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitCommonAttributes.ts";

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
    cfg                         : SelfUnitCommonAttributes | null | undefined;
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    unitTypeId                  : number;
    tileTypeId                  : number;
    weatherTypeId               : number;
    isCoOnboard                 : boolean;
    gridIndex                   : AuxiliaryTypes_GridIndex.GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => AuxiliaryTypes_GridIndex.GridIndex[];
}): { lower: number; upper: number } {
    if (cfg == null) {
        return { lower : 0, upper : 0 };
    }

    const luckRangeOffsets = cfg.getLuckRangeOffsets();
    if ((luckRangeOffsets == null) ||
        (!CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions.checkIsMeet({
            conditions               : cfg.getConditions(),
            gameConfig               : gameConfig,
            unitTypeId               : unitTypeId,
            tileTypeId               : tileTypeId,
            weatherTypeId            : weatherTypeId,
            isCoOnboard              : isCoOnboard,
            isInCozByPreviewSettings : false,
            gridIndex                : gridIndex,
            coZoneRadius             : coZoneRadius,
            getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
        }))
    ) {
        return { lower : 0, upper : 0 };
    }

    return { lower : luckRangeOffsets.getLowerOffset(), upper : luckRangeOffsets.getUpperOffset() };
}
export function getTotalOffsetForDamageCalculatorPanel({
    cfg,
    gameConfig,
    unitTypeId,
    tileTypeId,
    weatherTypeId,
}: {
    cfg                         : SelfUnitCommonAttributes | null | undefined;
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    unitTypeId                  : number;
    tileTypeId                  : number;
    weatherTypeId               : number;
}): { lower: number; upper: number } {
    if (cfg == null) {
        return { lower : 0, upper : 0 };
    }

    const luckRangeOffsets = cfg.getLuckRangeOffsets();
    if ((luckRangeOffsets == null) ||
        (!CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions.checkIsMeetForDamageCalculatorPanel({
            conditions    : cfg.getConditions(),
            gameConfig    : gameConfig,
            unitTypeId    : unitTypeId,
            tileTypeId    : tileTypeId,
            weatherTypeId : weatherTypeId,
        }))
    ) {
        return { lower : 0, upper : 0 };
    }

    return { lower : luckRangeOffsets.getLowerOffset(), upper : luckRangeOffsets.getUpperOffset() };
}
