import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import type { SelfUnitCommonAttributes } from "../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitCommonAttributes";
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

export function getTotalDefensePercentOffset({
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
    cfg                         : SelfUnitCommonAttributes | null | undefined;
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

    const conditions            = cfg.getConditions();
    const defensePercentOffsets = cfg.getDefensePercentOffsets();
    if ((conditions == null) || (defensePercentOffsets == null)) {
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

    return (defensePercentOffsets.getOffsetPct())
        + (defensePercentOffsets.getFundConversion()) * fund / 10000
        + ((defensePercentOffsets.getOffsetPctFromPromotion())[promotion] ?? 0)
        + getTotalPctFromTileDefense(defensePercentOffsets.getOffsetPctFromTileDefense(), tileDefenseAmount, canTileDefendUnit)
        + (hp > 0 ? (defensePercentOffsets.getOffsetPctFromHp())[getNormalizedHp(hp) - 1] ?? 0 : 0)
        + getTotalPctFromOwnTiles(defensePercentOffsets.getOffsetPctFromOwnTile(), getOwnTilesCount)
        + getTotalOffsetPctFromAgainstSpecificEnemy(gameConfig, defensePercentOffsets.getOffsetPctAgainstSpecificEnemy(), unitTypeId1)
        + (unitTypeId1 != unitTypeId2 ? 0 : defensePercentOffsets.getOffsetPctAgainstSameEnemy());
}

export function getTotalDefensePercentOffsetForDamageCalculatorPanel({
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
    cfg                 : SelfUnitCommonAttributes | null | undefined;
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

    const conditions            = cfg.getConditions();
    const defensePercentOffsets = cfg.getDefensePercentOffsets();
    if ((conditions == null) || (defensePercentOffsets == null)) {
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

    return (defensePercentOffsets.getOffsetPct())
        + (defensePercentOffsets.getFundConversion()) * fund / 10000
        + ((defensePercentOffsets.getOffsetPctFromPromotion())[promotion] ?? 0)
        + getTotalPctFromTileDefense(defensePercentOffsets.getOffsetPctFromTileDefense(), tileDefenseAmount, canTileDefendUnit)
        + (hp > 0 ? (defensePercentOffsets.getOffsetPctFromHp())[getNormalizedHp(hp) - 1] ?? 0 : 0)
        + getTotalPctFromOwnTiles(defensePercentOffsets.getOffsetPctFromOwnTile(), getOwnTilesCount)
        + getTotalOffsetPctFromAgainstSpecificEnemy(gameConfig, defensePercentOffsets.getOffsetPctAgainstSpecificEnemy(), unitTypeId1)
        + (unitTypeId1 != unitTypeId2 ? 0 : defensePercentOffsets.getOffsetPctAgainstSameEnemy());
}
