import {
    type AuxiliaryTypes_GridIndex,
    CoSkills_Utils_Persistent_SelfTileCommonAttributes_Conditions,
    type GameConfigs_GameConfig,
} from "../../../../internal.ts";
import type { SelfTileCommonAttributes } from "../../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfTileCommonAttributes.ts";

export function getMultiplierPct({
    cfg,
    ...context
}: {
    cfg                         : SelfTileCommonAttributes | null | undefined;
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    tileTypeId                  : number;
    weatherTypeId               : number;
    gridIndex                   : AuxiliaryTypes_GridIndex.GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => AuxiliaryTypes_GridIndex.GridIndex[];
}): number | null {
    const multiplierPct = cfg?.getRepairCosts()?.getMultiplierPct();
    if ((multiplierPct == null) ||
        (!CoSkills_Utils_Persistent_SelfTileCommonAttributes_Conditions.checkIsMeet({
            ...context,
            conditions : cfg?.getConditions(),
        }))
    ) {
        return null;
    }

    return multiplierPct;
}
