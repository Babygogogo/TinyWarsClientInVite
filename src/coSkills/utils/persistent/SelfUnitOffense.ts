import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import type { SelfUnitOffense } from "../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitOffense.ts";
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
    cfg                         : SelfUnitOffense | null | undefined;
    gameConfig                  : GameConfig;
    unitTypeId                  : number;
    tileTypeId                  : number;
    weatherTypeId               : number;
    isCoOnboard                 : boolean;
    isInCozByPreviewSettings    : boolean;
    gridIndex                   : GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => GridIndex[];
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

    const conditions                = cfg.getConditions();
    const offensePercentOffsetFrom  = cfg.getOffensePercentOffsetFrom();
    if ((conditions == null) || (offensePercentOffsetFrom == null)) {
        return 0;
    }

    {
        if (!gameConfig.checkIsUnitTypeInCategory(unitTypeId, conditions.getUnitCategoryId())) {
            return 0;
        }

        if (!gameConfig.checkIsTileTypeInCategory(tileTypeId, conditions.getTileCategoryId())) {
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

    return (offensePercentOffsetFrom.getOffsetPct() ?? 0)
        + (offensePercentOffsetFrom.getFundConversion() ?? 0) * fund / 10000
        + (isCoOnboard ? offensePercentOffsetFrom.getOffsetPctFromCoUnit() ?? 0 : 0)
        + ((offensePercentOffsetFrom.getOffsetPctFromPromotion() ?? [])[promotion] ?? 0)
        + (isCounter ? offensePercentOffsetFrom.getOffsetPctOnCounter() ?? 0 : 0)
        + getTotalPctFromOwnTiles(offensePercentOffsetFrom.getOffsetPctFromOwnTile(), getOwnTilesCount)
        + getTotalPctFromTileDefense(offensePercentOffsetFrom.getOffsetPctFromTileDefense(), tileDefenseAmount, canTileDefendUnit)
        + (hp > 0 ? (offensePercentOffsetFrom.getOffsetPctFromHp() ?? [])[getNormalizedHp(hp) - 1] ?? 0 : 0);
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
    cfg                 : SelfUnitOffense | null | undefined;
    gameConfig          : GameConfig;
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

    const conditions                = cfg.getConditions();
    const offensePercentOffsetFrom  = cfg.getOffensePercentOffsetFrom();
    if ((conditions == null) || (offensePercentOffsetFrom == null)) {
        return 0;
    }

    {
        if (!gameConfig.checkIsUnitTypeInCategory(unitTypeId, conditions.getUnitCategoryId())) {
            return 0;
        }

        if (!gameConfig.checkIsTileTypeInCategory(tileTypeId, conditions.getTileCategoryId())) {
            return 0;
        }

        if (!gameConfig.checkIsWeatherTypeInCategory(weatherTypeId, conditions.getWeatherCategoryId())) {
            return 0;
        }
    }

    return (offensePercentOffsetFrom.getOffsetPct() ?? 0)
        + (offensePercentOffsetFrom.getFundConversion() ?? 0) * fund / 10000
        + (isCoOnboard ? offensePercentOffsetFrom.getOffsetPctFromCoUnit() ?? 0 : 0)
        + ((offensePercentOffsetFrom.getOffsetPctFromPromotion() ?? [])[promotion] ?? 0)
        + (isCounter ? offensePercentOffsetFrom.getOffsetPctOnCounter() ?? 0 : 0)
        + getTotalPctFromOwnTiles(offensePercentOffsetFrom.getOffsetPctFromOwnTile(), getOwnTilesCount)
        + getTotalPctFromTileDefense(offensePercentOffsetFrom.getOffsetPctFromTileDefense(), tileDefenseAmount, canTileDefendUnit)
        + (hp > 0 ? (offensePercentOffsetFrom.getOffsetPctFromHp() ?? [])[getNormalizedHp(hp) - 1] ?? 0 : 0);
}
