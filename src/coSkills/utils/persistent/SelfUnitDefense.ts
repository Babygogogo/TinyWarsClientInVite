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

    {
        const unitCategoryId = cfg.getUnitCategoryId();
        if ((unitCategoryId != null) && (!gameConfig.checkIsUnitTypeInCategory(unitTypeId2, unitCategoryId))) {
            return 0;
        }
    }

    {
        const tileCategoryId = cfg.getTileCategoryId();
        if ((tileCategoryId != null) && (!gameConfig.checkIsTileTypeInCategory(tileTypeId2, tileCategoryId))) {
            return 0;
        }
    }

    {
        const weatherCategoryId = cfg.getWeatherCategoryId();
        if ((weatherCategoryId != null) && (!gameConfig.checkIsWeatherTypeInCategory(weatherTypeId, weatherCategoryId))) {
            return 0;
        }
    }

    if ((!isCoOnboard)                                                  &&
        (!isInCozByPreviewSettings)                                     &&
        (!gridIndex.checkIsInsideCoSkillArea({
            coSkillAreaType             : cfg.getCoSkillAreaTypeId() ?? 0,
            coZoneRadius                : coZoneRadius,
            getCoGridIndexArrayOnMap    : getCoGridIndexArrayOnMap,
        }))
    ) {
        return 0;
    }

    return (cfg.getOffsetPct() ?? 0)
        + (cfg.getFundConversion() ?? 0) * fund / 10000
        + ((cfg.getOffsetPctFromPromotion() ?? [])[promotion] ?? 0)
        + getTotalPctFromTileDefense(cfg.getOffsetPctFromTileDefense(), tileDefenseAmount, canTileDefendUnit)
        + (hp > 0 ? (cfg.getOffsetPctFromHp() ?? [])[getNormalizedHp(hp) - 1] ?? 0 : 0)
        + getTotalPctFromOwnTiles(cfg.getOffsetPctFromOwnTile(), getOwnTilesCount)
        + getTotalOffsetPctFromAgainstSpecificEnemy(gameConfig, cfg.getOffsetPctAgainstSpecificEnemy(), unitTypeId1)
        + (unitTypeId1 != unitTypeId2 ? 0 : cfg.getOffsetPctAgainstSameEnemy());
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

    {
        const unitCategoryId = cfg.getUnitCategoryId();
        if ((unitCategoryId != null) && (!gameConfig.checkIsUnitTypeInCategory(unitTypeId2, unitCategoryId))) {
            return 0;
        }
    }

    {
        const tileCategoryId = cfg.getTileCategoryId();
        if ((tileCategoryId != null) && (!gameConfig.checkIsTileTypeInCategory(tileTypeId2, tileCategoryId))) {
            return 0;
        }
    }

    {
        const weatherCategoryId = cfg.getWeatherCategoryId();
        if ((weatherCategoryId != null) && (!gameConfig.checkIsWeatherTypeInCategory(weatherTypeId, weatherCategoryId))) {
            return 0;
        }
    }

    return (cfg.getOffsetPct() ?? 0)
        + (cfg.getFundConversion() ?? 0) * fund / 10000
        + ((cfg.getOffsetPctFromPromotion() ?? [])[promotion] ?? 0)
        + getTotalPctFromTileDefense(cfg.getOffsetPctFromTileDefense(), tileDefenseAmount, canTileDefendUnit)
        + (hp > 0 ? (cfg.getOffsetPctFromHp() ?? [])[getNormalizedHp(hp) - 1] ?? 0 : 0)
        + getTotalPctFromOwnTiles(cfg.getOffsetPctFromOwnTile(), getOwnTilesCount)
        + getTotalOffsetPctFromAgainstSpecificEnemy(gameConfig, cfg.getOffsetPctAgainstSpecificEnemy(), unitTypeId1)
        + (unitTypeId1 != unitTypeId2 ? 0 : cfg.getOffsetPctAgainstSameEnemy());
}
