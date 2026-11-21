import {
    AuxiliaryTypes_AuxiliaryTypes,
    type AuxiliaryTypes_GridIndex,
    type GameConfigs_GameConfig,
} from "../../../../internal.ts";
import type { Conditions } from "../../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitCommonAttributes/Conditions.ts";

export function checkIsMeet({
    conditions,
    gameConfig,
    unitTypeId,
    tileTypeId,
    weatherTypeId,
    isCoOnboard,
    isInCozByPreviewSettings,
    gridIndex,
    coZoneRadius,
    getCoGridIndexArrayOnMap,
}: {
    conditions                  : AuxiliaryTypes_AuxiliaryTypes.Undefinable<Conditions>;
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    unitTypeId                  : number;
    tileTypeId                  : number;
    weatherTypeId               : number;
    isCoOnboard                 : boolean;
    isInCozByPreviewSettings    : boolean;
    gridIndex                   : AuxiliaryTypes_GridIndex.GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => AuxiliaryTypes_GridIndex.GridIndex[];
}): boolean {
    if (conditions == null) {
        return false;
    }

    if (!gameConfig.checkIsUnitTypeInCategory(unitTypeId, conditions.getUnitCategoryId())) {
        return false;
    }

    if (!gameConfig.checkIsTileTypeInCategory(tileTypeId, conditions.getTileCategoryId())) {
        return false;
    }

    if (!gameConfig.checkIsWeatherTypeInCategory(weatherTypeId, conditions.getWeatherCategoryId())) {
        return false;
    }

    if ((!isCoOnboard)                                                  &&
        (!isInCozByPreviewSettings)                                     &&
        (!gridIndex.checkIsInsideCoSkillArea({
            coSkillAreaType          : conditions.getCoSkillAreaTypeId(),
            coZoneRadius             : coZoneRadius,
            getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
        }))
    ) {
        return false;
    }

    return true;
}

export function checkIsMeetForDamageCalculatorPanel({
    conditions,
    gameConfig,
    unitTypeId,
    tileTypeId,
    weatherTypeId,
}: {
    conditions      : AuxiliaryTypes_AuxiliaryTypes.Undefinable<Conditions>;
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    unitTypeId      : number;
    tileTypeId      : number;
    weatherTypeId   : number;
}): boolean {
    if (conditions == null) {
        return false;
    }

    if (!gameConfig.checkIsUnitTypeInCategory(unitTypeId, conditions.getUnitCategoryId())) {
        return false;
    }

    if (!gameConfig.checkIsTileTypeInCategory(tileTypeId, conditions.getTileCategoryId())) {
        return false;
    }

    if (!gameConfig.checkIsWeatherTypeInCategory(weatherTypeId, conditions.getWeatherCategoryId())) {
        return false;
    }

    return true;
}
