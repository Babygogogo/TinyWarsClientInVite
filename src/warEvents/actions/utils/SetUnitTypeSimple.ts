import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { encodeTeamIndex } from "../../../helpers/Team.ts";
import {
    TextType,
    UndefinedError,
} from "../../../lang/Constants.ts";
import {
    getFormattedText,
    getUnitName,
    getText,
} from "../../../lang/Utils.ts";
import type { IPlayer } from "../../../players/IPlayer.ts";
import {
    getDescForEmbed as getPlayersDescForEmbed,
    checkIsValid as checkIsValidPlayerFilter,
    checkIsMeet as checkIsMeetPlayerFilter,
} from "../../../players/utils/Filter.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { TileFilter } from "../../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type { WeaSetUnitTypeSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitTypeSimple.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type { ITile } from "../../../tiles/ITile.ts";
import {
    getDescForEmbed as getTilesDescForEmbed,
    checkIsValid as checkIsValidTileFilter,
    checkIsMeet as checkIsMeetTileFilter,
} from "../../../tiles/utils/Filter.ts";
import type { IUnit } from "../../../units/IUnit.ts";
import { getNormalizedHp } from "../../../units/utils/Common.ts";
import {
    getDescForEmbed as getUnitsDescForEmbed,
    checkIsValid as checkIsValidUnitFilter,
    checkIsMeet as checkIsMeetUnitFilter,
} from "../../../units/utils/Filter.ts";
import { createNewUnitDataForChangeType } from "../../../units/utils/Serialization.ts";
import { getObserverTeamIndexListForUnitOnMap } from "../../../visibilities/Utils.ts";

export function checkIsValid(data: Undefinable<WeaSetUnitTypeSimple>, gameConfig: GameConfig, mapSize: MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: Undefinable<WeaSetUnitTypeSimple>, gameConfig: GameConfig): string | null {
    if (!data) {
        return null;
    }

    const unitType = data.getActUnitType();
    return getFormattedText(
        TextType.F0252,
        unitType == null ? UndefinedError : getUnitName(unitType, gameConfig)
    );
}
export function getDetailDesc(data: Undefinable<WeaSetUnitTypeSimple>, gameConfig: GameConfig): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            conTextArray.push(`- ${getUnitsDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            conTextArray.push(`- (${getText(TextType.B1422)}) ${getPlayersDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            conTextArray.push(`- (${getText(TextType.B1423)}) ${getTilesDescForEmbed(filter)}`);
        }
    }

    if (!conTextArray.length) {
        conTextArray.push(`- ${getText(TextType.A0944)}`);
    }

    const unitType = data.getActUnitType();
    return getFormattedText(
        TextType.F0253,
        conTextArray.join(`\n`),
        unitType == null ? UndefinedError : getUnitName(unitType, gameConfig)
    );
}

export function getErrorTip(data: WeaSetUnitTypeSimple, mapSize: MapSize, playersCountUnneutral: number, gameConfig: GameConfig): string | null {
    {
        const filter = data.getConUnitFilter();
        if ((filter != null)                                                                            &&
            (!checkIsValidUnitFilter(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitFilter));
        }
    }

    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                                    &&
            (!checkIsValidPlayerFilter(filter, playersCountUnneutral, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.PlayerFilter));
        }
    }

    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                            &&
            (!checkIsValidTileFilter(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.TileFilter));
        }
    }

    {
        const unitType = data.getActUnitType();
        if ((unitType == null)                              ||
            (!gameConfig.checkIsValidUnitType(unitType))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.B0525));
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetUnitTypeSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaSetUnitTypeSimple, isFastExecute: boolean, war: IBwWar): Promise<void> {
    const targetUnitArray       : IUnit[] = [];
    const unitMap               = war.getUnitMap();
    const newUnitType           = data.getActUnitType();
    {
        const tileMap               = war.getTileMap();
        const conUnitFilter         = data.getConUnitFilter();
        const conPlayerFilter       = data.getConPlayerFilter();
        const playerFilterDict      = new Map<IPlayer, boolean>();
        const conTileFilter         = data.getConTileFilter();
        const tileFilterDict        = new Map<ITile, boolean>();
        const unitInfoArray         : { unit: IUnit, depth: number }[] = [];

        for (const unit of unitMap.getAllUnits()) {
            if (unit.getUnitType() === newUnitType) {
                continue;
            }

            if ((conUnitFilter != null) && (!checkIsMeetUnitFilter(conUnitFilter, unit))) {
                continue;
            }

            if ((conPlayerFilter != null) && (!checkIsMeetConPlayerFilter(playerFilterDict, conPlayerFilter, unit.getPlayer()))) {
                continue;
            }

            if ((conTileFilter != null) && (!checkIsMeetConTileFilter(tileFilterDict, conTileFilter, tileMap.getTile(unit.getGridIndex())))) {
                continue;
            }

            unitInfoArray.push({ unit, depth: getLoadDepth(unit) });
        }

        if (!unitInfoArray.length) {
            return;
        }

        unitInfoArray.sort((v1, v2) => (v2.depth - v1.depth));
        for (const info of unitInfoArray) {
            targetUnitArray.push(info.unit);
        }
    }

    {
        const mapSize                   = unitMap.getMapSize();
        const observerTeamIndexesDict   = new Map<number, number[] | null>();
        for (const unit of targetUnitArray) {
            const gridIndex   = unit.getGridIndex();
            const gridId      = gridIndex.getGridId(mapSize);
            if (!observerTeamIndexesDict.has(gridId)) {
                observerTeamIndexesDict.set(gridId, getObserverTeamIndexListForUnitOnMap({ war, gridIndex }));
            }
        }

        const warStatisticsManager  = war.getWarStatisticsManager();
        const gameConfig            = war.getGcData();
        const newUnitTemplateCfg    = getExisted(gameConfig.getUnitTemplateCfg(newUnitType));
        const newMaxLoadCount       = newUnitTemplateCfg.getMaxLoadUnitsCount() ?? 0;
        const newLoadUnitCategoryId = newUnitTemplateCfg.getLoadUnitCategoryId();
        for (const unit of targetUnitArray) {
            {
                const loaderUnit = unit.getLoaderUnit();
                if (loaderUnit != null) {
                    const category = loaderUnit.getLoadUnitCategoryId();
                    if ((category == null) || (!gameConfig.checkIsUnitTypeInCategory(newUnitType, category))) {
                        continue;
                    }
                }
            }

            {
                const loadedUnits = unit.getLoadedUnits();
                if (loadedUnits.length) {
                    if ((loadedUnits.length > newMaxLoadCount)                                                              ||
                        (newLoadUnitCategoryId == null)                                                                       ||
                        (loadedUnits.some(v => !gameConfig.checkIsUnitTypeInCategory(v.getUnitType(), newLoadUnitCategoryId)))
                    ) {
                        continue;
                    }
                }
            }

            const newUnitData = createNewUnitDataForChangeType(unit, newUnitType);
            {
                const observerTeamIndexes = observerTeamIndexesDict.get(unit.getGridIndex().getGridId(mapSize));
                if (observerTeamIndexes != null) {
                    const groupedObserverTeamIndexes = encodeTeamIndex(observerTeamIndexes);
                    warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                        unitType                    : unit.getUnitType(),
                        dstPlayerIndex              : unit.getPlayerIndex(),
                        normalizedHpGain            : 0,
                        normalizedHpLoss            : unit.getNormalizedCurrentHp(),
                        unitGain                    : 0,
                        unitLoss                    : 1,
                        groupedObserverTeamIndexes  : groupedObserverTeamIndexes,
                    }));

                    warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                        unitType                    : newUnitType,
                        dstPlayerIndex              : newUnitData.getPlayerIndex(),
                        normalizedHpGain            : getNormalizedHp(newUnitData.getCurrentHp()),
                        normalizedHpLoss            : 0,
                        unitGain                    : 1,
                        unitLoss                    : 0,
                        groupedObserverTeamIndexes  : groupedObserverTeamIndexes
                    }));
                }
            }

            unit.init(newUnitData, gameConfig);
            unit.startRunning(war);

            if (!isFastExecute) {
                unit.updateView();
            }
        }
    }
}
function checkIsMeetConPlayerFilter(resultDict: Map<IPlayer, boolean>, filter: PlayerFilter, player: IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, checkIsMeetPlayerFilter(filter, player));
    }
    return !!resultDict.get(player);
}
function checkIsMeetConTileFilter(resultDict: Map<ITile, boolean>, filter: TileFilter, tile: ITile): boolean {
    if (!resultDict.has(tile)) {
        resultDict.set(tile, checkIsMeetTileFilter(filter, tile));
    }
    return !!resultDict.get(tile);
}
function getLoadDepth(unit: IUnit): number {
    let depth       = 0;
    let loaderUnit  = unit.getLoaderUnit();
    while (loaderUnit != null) {
        ++depth;
        loaderUnit = loaderUnit.getLoaderUnit();
    }
    return depth;
}
