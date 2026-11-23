import {
    type AuxiliaryTypes_GridIndex,
    CoSkills_Utils_Persistent_SelfTileCommonAttributes_Conditions,
    type GameConfigs_GameConfig,
} from "../../../../internal.ts";
import type { SelfTileCommonAttributes } from "../../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfTileCommonAttributes.ts";

export function getAmountAndCostModifier({
    cfg,
    gameConfig,
    tileTypeId,
    weatherTypeId,
    gridIndex,
    coZoneRadius,
    getCoGridIndexArrayOnMap,
}: {
    cfg                         : SelfTileCommonAttributes | null | undefined;
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    tileTypeId                  : number;
    weatherTypeId               : number;
    gridIndex                   : AuxiliaryTypes_GridIndex.GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => AuxiliaryTypes_GridIndex.GridIndex[];
}): { amountModifier: number, costMultiplierPct: number } {
    const effect = cfg?.getRepairAmountOffsets();
    if ((effect == null) ||
        (!CoSkills_Utils_Persistent_SelfTileCommonAttributes_Conditions.checkIsMeet({
            conditions               : cfg?.getConditions(),
            gameConfig               : gameConfig,
            tileTypeId               : tileTypeId,
            weatherTypeId            : weatherTypeId,
            gridIndex                : gridIndex,
            coZoneRadius             : coZoneRadius,
            getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
        }))
    ) {
        return { amountModifier: 0, costMultiplierPct: 100 };
    }

    return { amountModifier: effect.getOffset(), costMultiplierPct: effect.getCostMultiplierPct() ?? 100 };
}
