import {
    type AuxiliaryTypes_GridIndex,
    type GameConfigs_GameConfig,
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions,
} from "../../../../internal.ts";
import type { SelfUnitCommonAttributes } from "../../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitCommonAttributes.ts";

export function checkIsImmuneToWeather({
    cfg,
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
    cfg                         : SelfUnitCommonAttributes | null | undefined;
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
    return (cfg?.getImmuneToWeathers()?.getIsImmune() ?? false)
        && CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions.checkIsMeet({
            conditions               : cfg?.getConditions(),
            gameConfig               : gameConfig,
            unitTypeId               : unitTypeId,
            tileTypeId               : tileTypeId,
            weatherTypeId            : weatherTypeId,
            isCoOnboard              : isCoOnboard,
            isInCozByPreviewSettings : isInCozByPreviewSettings,
            gridIndex                : gridIndex,
            coZoneRadius             : coZoneRadius,
            getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
        });
}

export function checkIsImmuneToWeatherForDamageCalculatorPanel({
    cfg,
    gameConfig,
    unitTypeId,
    tileTypeId,
    weatherTypeId,
}: {
    cfg             : SelfUnitCommonAttributes | null | undefined;
    gameConfig      : GameConfigs_GameConfig.GameConfig;
    unitTypeId      : number;
    tileTypeId      : number;
    weatherTypeId   : number;
}): boolean {
    return (cfg?.getImmuneToWeathers()?.getIsImmune() ?? false)
        && CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions.checkIsMeetForDamageCalculatorPanel({
            conditions    : cfg?.getConditions(),
            gameConfig    : gameConfig,
            unitTypeId    : unitTypeId,
            tileTypeId    : tileTypeId,
            weatherTypeId : weatherTypeId,
        });
}
