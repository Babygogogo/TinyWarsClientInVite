import {
    Units_Utils_Common,
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_GridIndex,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { SelfUnitCommonAttributes } from "../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitCommonAttributes";

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

    const conditions            = cfg.getConditions();
    const offensePercentOffsets = cfg.getOffensePercentOffsets();
    if ((conditions == null) || (offensePercentOffsets == null)) {
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

    const conditions            = cfg.getConditions();
    const offensePercentOffsets = cfg.getOffensePercentOffsets();
    if ((conditions == null) || (offensePercentOffsets == null)) {
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

    return (offensePercentOffsets.getOffsetPct())
        + (offensePercentOffsets.getFundConversion()) * fund / 10000
        + (isCoOnboard ? offensePercentOffsets.getOffsetPctFromCoUnit() : 0)
        + ((offensePercentOffsets.getOffsetPctFromPromotion())[promotion] ?? 0)
        + (isCounter ? offensePercentOffsets.getOffsetPctOnCounter() : 0)
        + getTotalPctFromOwnTiles(offensePercentOffsets.getOffsetPctFromOwnTile(), getOwnTilesCount)
        + getTotalPctFromTileDefense(offensePercentOffsets.getOffsetPctFromTileDefense(), tileDefenseAmount, canTileDefendUnit)
        + (hp > 0 ? (offensePercentOffsets.getOffsetPctFromHp())[Units_Utils_Common.getNormalizedHp(hp) - 1] ?? 0 : 0);
}
