import {
    type AuxiliaryTypes_GridIndex,
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions,
    type GameConfigs_GameConfig,
} from "../../../../internal.ts";
import type { SelfUnitCommonAttributes } from "../../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitCommonAttributes.ts";

export function checkIsInvisible({
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

    return (cfg.getInvisibilities()?.getIsInvisible() ?? false)
        && CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions.checkIsMeet({
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
        });
}
