import {
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions,
    Units_Utils_Common,
    type AuxiliaryTypes_AuxiliaryTypes,
    type AuxiliaryTypes_GridIndex,
    type GameConfigs_GameConfig,
} from "../../../../internal.ts";
import type { SelfUnitCommonAttributes } from "../../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitCommonAttributes.ts";

function getTotalPctFromOwnTiles(cfg: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>, getOwnTilesCount: (tileCategoryId: number) => number): number {
    if (!cfg?.length) {
        return 0;
    } else {
        return getOwnTilesCount(cfg[0]) * cfg[1];
    }
}
function getTotalPctFromTileDefense(cfg: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>, tileDefenseAmount: number, canTileDefendUnit: boolean): number {
    if (!cfg?.length) {
        return 0;
    } else {
        return ((canTileDefendUnit) || (!cfg[1])) ? cfg[0] / 100 * tileDefenseAmount : 0;
    }
}

export function getTotalOffsetPct({
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
    fund,
    promotion,
    hp,
    isCounter,
    tileDefenseAmount,
    canTileDefendUnit,
    getOwnTilesCount,
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
    fund                        : number;
    promotion                   : number;
    hp                          : number;
    isCounter                   : boolean;
    tileDefenseAmount           : number;
    canTileDefendUnit           : boolean;
    getOwnTilesCount            : (tileCategoryId: number) => number;
}): number {
    if (cfg == null) {
        return 0;
    }

    const offensePercentOffsets = cfg.getOffensePercentOffsets();
    if ((offensePercentOffsets == null)                                                 ||
        (!CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions.checkIsMeet({
            conditions               : cfg.getConditions(),
            gameConfig               : gameConfig,
            unitTypeId               : unitTypeId,
            tileTypeId               : tileTypeId,
            weatherTypeId            : weatherTypeId,
            isCoOnboard              : isCoOnboard,
            isInCozByPreviewSettings : isInCozByPreviewSettings,
            gridIndex                : gridIndex,
            coZoneRadius             : coZoneRadius,
            getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
        }))
    ) {
        return 0;
    }

    return (offensePercentOffsets.getOffsetPct())
        + (offensePercentOffsets.getFundConversion()) * fund / 10000
        + (isCoOnboard ? offensePercentOffsets.getOffsetPctFromCoUnit() : 0)
        + ((offensePercentOffsets.getOffsetPctFromPromotion())[promotion] ?? 0)
        + (isCounter ? offensePercentOffsets.getOffsetPctOnCounter() : 0)
        + getTotalPctFromOwnTiles(offensePercentOffsets.getOffsetPctFromOwnTile(), getOwnTilesCount)
        + getTotalPctFromTileDefense(offensePercentOffsets.getOffsetPctFromTileDefense(), tileDefenseAmount, canTileDefendUnit)
        + (hp > 0 ? (offensePercentOffsets.getOffsetPctFromHp())[Units_Utils_Common.getNormalizedHp(hp) - 1] ?? 0 : 0);
}

export function getTotalOffsetPctForDamageCalculatorPanel({
    cfg,
    gameConfig,
    unitTypeId,
    tileTypeId,
    weatherTypeId,
    fund,
    promotion,
    hp,
    isCounter,
    isCoOnboard,
    tileDefenseAmount,
    canTileDefendUnit,
    getOwnTilesCount,
}: {
    cfg                 : SelfUnitCommonAttributes | null | undefined;
    gameConfig          : GameConfigs_GameConfig.GameConfig;
    unitTypeId          : number;
    tileTypeId          : number;
    weatherTypeId       : number;
    fund                : number;
    promotion           : number;
    hp                  : number;
    isCounter           : boolean;
    isCoOnboard         : boolean;
    tileDefenseAmount   : number;
    canTileDefendUnit   : boolean;
    getOwnTilesCount    : (tileCategoryId: number) => number;
}): number {
    if (cfg == null) {
        return 0;
    }

    const offensePercentOffsets = cfg.getOffensePercentOffsets();
    if ((offensePercentOffsets == null)                                                                         ||
        (!CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions.checkIsMeetForDamageCalculatorPanel({
            conditions    : cfg.getConditions(),
            gameConfig    : gameConfig,
            unitTypeId    : unitTypeId,
            tileTypeId    : tileTypeId,
            weatherTypeId : weatherTypeId,
        }))
    ) {
        return 0;
    }

    return (offensePercentOffsets.getOffsetPct())
        + (offensePercentOffsets.getFundConversion()) * fund / 10000
        + (isCoOnboard ? offensePercentOffsets.getOffsetPctFromCoUnit() : 0)
        + ((offensePercentOffsets.getOffsetPctFromPromotion())[promotion] ?? 0)
        + (isCounter ? offensePercentOffsets.getOffsetPctOnCounter() : 0)
        + getTotalPctFromOwnTiles(offensePercentOffsets.getOffsetPctFromOwnTile(), getOwnTilesCount)
        + getTotalPctFromTileDefense(offensePercentOffsets.getOffsetPctFromTileDefense(), tileDefenseAmount, canTileDefendUnit)
        + (hp > 0 ? (offensePercentOffsets.getOffsetPctFromHp())[Units_Utils_Common.getNormalizedHp(hp) - 1] ?? 0 : 0);
}
