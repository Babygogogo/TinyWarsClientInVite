import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { GcData } from "../../../gameConfig/GcData.ts";
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
    gameConfig                  : GcData;
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

    {
        const unitCategoryId = cfg.getUnitCategoryId();
        if ((unitCategoryId != null) && (!gameConfig.checkIsUnitTypeInCategory(unitTypeId, unitCategoryId))) {
            return 0;
        }
    }

    {
        const tileCategoryId = cfg.getTileCategoryId();
        if ((tileCategoryId != null) && (!gameConfig.checkIsTileTypeInCategory(tileTypeId, tileCategoryId))) {
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
        + (isCoOnboard ? cfg.getOffsetPctFromCoUnit() ?? 0 : 0)
        + ((cfg.getOffsetPctFromPromotion() ?? [])[promotion] ?? 0)
        + (isCounter ? cfg.getOffsetPctOnCounter() ?? 0 : 0)
        + getTotalPctFromOwnTiles(cfg.getOffsetPctFromOwnTile(), getOwnTilesCount)
        + getTotalPctFromTileDefense(cfg.getOffsetPctFromTileDefense(), tileDefenseAmount, canTileDefendUnit)
        + (hp > 0 ? (cfg.getOffsetPctFromHp() ?? [])[getNormalizedHp(hp) - 1] ?? 0 : 0);
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
    gameConfig          : GcData;
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

    {
        const unitCategoryId = cfg.getUnitCategoryId();
        if ((unitCategoryId != null) && (!gameConfig.checkIsUnitTypeInCategory(unitTypeId, unitCategoryId))) {
            return 0;
        }
    }

    {
        const tileCategoryId = cfg.getTileCategoryId();
        if ((tileCategoryId != null) && (!gameConfig.checkIsTileTypeInCategory(tileTypeId, tileCategoryId))) {
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
        + (isCoOnboard ? cfg.getOffsetPctFromCoUnit() ?? 0 : 0)
        + ((cfg.getOffsetPctFromPromotion() ?? [])[promotion] ?? 0)
        + (isCounter ? cfg.getOffsetPctOnCounter() ?? 0 : 0)
        + getTotalPctFromOwnTiles(cfg.getOffsetPctFromOwnTile(), getOwnTilesCount)
        + getTotalPctFromTileDefense(cfg.getOffsetPctFromTileDefense(), tileDefenseAmount, canTileDefendUnit)
        + (hp > 0 ? (cfg.getOffsetPctFromHp() ?? [])[getNormalizedHp(hp) - 1] ?? 0 : 0);
}
