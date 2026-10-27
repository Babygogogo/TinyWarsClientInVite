import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import type { SelfUnitDefense } from "../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitDefense.ts";
import { getNormalizedHp } from "../../../units/utils/Common.ts";

function getTotalPctFromOwnTiles(cfg: Undefinable<number[]>, getOwnTilesCount: (tileCategoryId: number) => number): number {
    if (!cfg?.length) {
        return 0;
    } else {
        return getOwnTilesCount(cfg[0]) * cfg[1];
    }
}
function getTotalPctFromTileDefense(cfg: Undefinable<number[]>, tileDefenseAmount: number, canTileDefendUnit: boolean): number {
    if (!cfg?.length) {
        return 0;
    } else {
        return ((canTileDefendUnit) || (!cfg[1])) ? cfg[0] / 100 * tileDefenseAmount : 0;
    }
}
function getTotalOffsetPctFromAgainstSpecificEnemy(gameConfig: GameConfig, cfg: Undefinable<number[]>, attackerUnitTypeId: number | null): number {
    if ((!cfg) || (cfg.length !== 2) || (attackerUnitTypeId == null)) {
        return 0;
    }
    return gameConfig.checkIsUnitTypeInCategory(attackerUnitTypeId, cfg[0])
        ? cfg[1]
        : 0;
}

export function getTotalOffsetPct({
    cfg,
    gameConfig,
    unitTypeId1,
    unitTypeId2,
    tileTypeId2,
    weatherTypeId,
    isCoOnboard,
    isInCozByPreviewSettings,
    gridIndex,
    coZoneRadius,
    getOwnTilesCount,
    getCoGridIndexArrayOnMap,
    fund,
    promotion,
    hp,
    tileDefenseAmount,
    canTileDefendUnit,
}: {
    cfg                         : SelfUnitDefense | null | undefined;
    gameConfig                  : GameConfig;
    unitTypeId1                 : number | null;
    unitTypeId2                 : number;
    tileTypeId2                 : number;
    weatherTypeId               : number;
    isCoOnboard                 : boolean;
    isInCozByPreviewSettings    : boolean;
    gridIndex                   : GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => GridIndex[];
    getOwnTilesCount            : (tileCategoryId: number) => number;
    fund                        : number;
    promotion                   : number;
    hp                          : number;
    tileDefenseAmount           : number;
    canTileDefendUnit           : boolean;
}): number {
    if (cfg == null) {
        return 0;
    }

    const conditions                = cfg.getConditions();
    const defensePercentOffsetFrom  = cfg.getDefensePercentOffsetFrom();
    if ((conditions == null) || (defensePercentOffsetFrom == null)) {
        return 0;
    }

    {
        if (!gameConfig.checkIsUnitTypeInCategory(unitTypeId2, conditions.getUnitCategoryId())) {
            return 0;
        }

        if (!gameConfig.checkIsTileTypeInCategory(tileTypeId2, conditions.getTileCategoryId())) {
            return 0;
        }

        if (!gameConfig.checkIsWeatherTypeInCategory(weatherTypeId, conditions.getWeatherCategoryId())) {
            return 0;
        }

        if ((!isCoOnboard)                                                  &&
            (!isInCozByPreviewSettings)                                     &&
            (!gridIndex.checkIsInsideCoSkillArea({
                coSkillAreaType          : conditions.getCoSkillAreaTypeId(),
                coZoneRadius             : coZoneRadius,
                getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
            }))
        ) {
            return 0;
        }
    }

    return (defensePercentOffsetFrom.getOffsetPct() ?? 0)
        + (defensePercentOffsetFrom.getFundConversion() ?? 0) * fund / 10000
        + ((defensePercentOffsetFrom.getOffsetPctFromPromotion() ?? [])[promotion] ?? 0)
        + getTotalPctFromTileDefense(defensePercentOffsetFrom.getOffsetPctFromTileDefense(), tileDefenseAmount, canTileDefendUnit)
        + (hp > 0 ? (defensePercentOffsetFrom.getOffsetPctFromHp() ?? [])[getNormalizedHp(hp) - 1] ?? 0 : 0)
        + getTotalPctFromOwnTiles(defensePercentOffsetFrom.getOffsetPctFromOwnTile(), getOwnTilesCount)
        + getTotalOffsetPctFromAgainstSpecificEnemy(gameConfig, defensePercentOffsetFrom.getOffsetPctAgainstSpecificEnemy(), unitTypeId1)
        + (unitTypeId1 != unitTypeId2 ? 0 : defensePercentOffsetFrom.getOffsetPctAgainstSameEnemy());
}

export function getTotalOffsetPctForDamageCalculatorPanel({
    cfg,
    gameConfig,
    unitTypeId1,
    unitTypeId2,
    tileTypeId2,
    weatherTypeId,
    fund,
    promotion,
    hp,
    tileDefenseAmount,
    canTileDefendUnit,
    getOwnTilesCount,
}: {
    cfg                 : SelfUnitDefense | null | undefined;
    gameConfig          : GameConfig;
    unitTypeId1         : number;
    unitTypeId2         : number;
    tileTypeId2         : number;
    weatherTypeId       : number;
    fund                : number;
    promotion           : number;
    hp                  : number;
    tileDefenseAmount   : number;
    canTileDefendUnit   : boolean;
    getOwnTilesCount    : (tileCategoryId: number) => number;
}): number {
    if (cfg == null) {
        return 0;
    }

    const conditions                = cfg.getConditions();
    const defensePercentOffsetFrom  = cfg.getDefensePercentOffsetFrom();
    if ((conditions == null) || (defensePercentOffsetFrom == null)) {
        return 0;
    }

    {
        if (!gameConfig.checkIsUnitTypeInCategory(unitTypeId2, conditions.getUnitCategoryId())) {
            return 0;
        }

        if (!gameConfig.checkIsTileTypeInCategory(tileTypeId2, conditions.getTileCategoryId())) {
            return 0;
        }

        if (!gameConfig.checkIsWeatherTypeInCategory(weatherTypeId, conditions.getWeatherCategoryId())) {
            return 0;
        }
    }

    return (defensePercentOffsetFrom.getOffsetPct() ?? 0)
        + (defensePercentOffsetFrom.getFundConversion() ?? 0) * fund / 10000
        + ((defensePercentOffsetFrom.getOffsetPctFromPromotion() ?? [])[promotion] ?? 0)
        + getTotalPctFromTileDefense(defensePercentOffsetFrom.getOffsetPctFromTileDefense(), tileDefenseAmount, canTileDefendUnit)
        + (hp > 0 ? (defensePercentOffsetFrom.getOffsetPctFromHp() ?? [])[getNormalizedHp(hp) - 1] ?? 0 : 0)
        + getTotalPctFromOwnTiles(defensePercentOffsetFrom.getOffsetPctFromOwnTile(), getOwnTilesCount)
        + getTotalOffsetPctFromAgainstSpecificEnemy(gameConfig, defensePercentOffsetFrom.getOffsetPctAgainstSpecificEnemy(), unitTypeId1)
        + (unitTypeId1 != unitTypeId2 ? 0 : defensePercentOffsetFrom.getOffsetPctAgainstSameEnemy());
}
