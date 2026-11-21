import {
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions,
    type AuxiliaryTypes_GridIndex,
    type GameConfigs_GameConfig,
} from "../../../../internal.ts";
import type { SelfUnitCommonAttributes } from "../../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitCommonAttributes.ts";

export function getTotalRangeOffset({
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
}): number {
    if (cfg == null) {
        return 0;
    }

    const visions = cfg.getVisions();
    if (visions == null) {
        return 0;
    }

    const rangeOffset = visions.getRangeOffset();
    if (rangeOffset === 0) {
        return 0;
    }

    if (!CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions.checkIsMeet({
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
    })) {
        return 0;
    }

    return rangeOffset;
}
export function checkCanSeeThrough({
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
}): boolean {
    if (cfg == null) {
        return false;
    }

    const conditions    = cfg.getConditions();
    const visions       = cfg.getVisions();
    if ((conditions == null) || (visions == null)) {
        return false;
    }

    const canSeeThrough = visions.getCanSeeThrough();
    if (!canSeeThrough) {
        return false;
    }

    if (!CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions.checkIsMeet({
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
    })) {
        return false;
    }

    return canSeeThrough;
}
