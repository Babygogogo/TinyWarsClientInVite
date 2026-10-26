import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { IBwWarStatisticsManager } from "../../../baseWar/interface/IBwWarStatisticsManager.ts";
import type { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { encodeTeamIndex } from "../../../helpers/Team.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getFormattedText, getText } from "../../../lang/Utils.ts";
import { PlayerIndex } from "../../../players/Constants.ts";
import type { IPlayer } from "../../../players/IPlayer.ts";
import { checkIsValidPlayerIndex } from "../../../players/utils/Common.ts";
import { getDescForEmbed, checkIsValid as PlayersUtilsFilterCheckIsValid, checkIsMeet } from "../../../players/utils/Filter.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { TileFilter } from "../../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type { WeaSetUnitOwnershipSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitOwnershipSimple.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type { ITile } from "../../../tiles/ITile.ts";
import {
    getDescForEmbed as TilesUtilsFilterGetDescForEmbed,
    checkIsValid as TilesUtilsFilterCheckIsValid,
    checkIsMeet as TilesUtilsFilterCheckIsMeet,
} from "../../../tiles/utils/Filter.ts";
import type { IUnit } from "../../../units/IUnit.ts";
import {
    getDescForEmbed as UnitsUtilsFilterGetDescForEmbed,
    checkIsValid as UnitsUtilsFilterCheckIsValid,
    checkIsMeet as UnitsUtilsFilterCheckIsMeet,
} from "../../../units/utils/Filter.ts";
import { getObserverTeamIndexListForUnitOnMap } from "../../../visibilities/Utils.ts";

export function checkIsValid(data: Undefinable<WeaSetUnitOwnershipSimple>, gameConfig: GameConfig, mapSize: MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: Undefinable<WeaSetUnitOwnershipSimple>): string | null {
    if (!data) {
        return null;
    }

    return getFormattedText(
        TextType.F0250,
        `P${data.getActPlayerIndex()}`
    );
}
export function getDetailDesc(data: Undefinable<WeaSetUnitOwnershipSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            conTextArray.push(`- ${UnitsUtilsFilterGetDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            conTextArray.push(`- (${getText(TextType.B1422)}) ${getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            conTextArray.push(`- (${getText(TextType.B1423)}) ${TilesUtilsFilterGetDescForEmbed(filter)}`);
        }
    }

    if (!conTextArray.length) {
        conTextArray.push(`- ${getText(TextType.A0944)}`);
    }

    return getFormattedText(
        TextType.F0251,
        conTextArray.join(`\n`),
        `P${data.getActPlayerIndex()}`
    );
}

export function getErrorTip(data: WeaSetUnitOwnershipSimple, mapSize: MapSize, playersCountUnneutral: number, gameConfig: GameConfig): string | null {
    {
        const filter = data.getConUnitFilter();
        if ((filter != null)                                                                            &&
            (!UnitsUtilsFilterCheckIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitFilter));
        }
    }

    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                                    &&
            (!PlayersUtilsFilterCheckIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.PlayerFilter));
        }
    }

    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                            &&
            (!TilesUtilsFilterCheckIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.TileFilter));
        }
    }

    {
        const playerIndex = data.getActPlayerIndex();
        if ((playerIndex == null)                                                           ||
            (playerIndex === PlayerIndex.Neutral)       ||
            (!checkIsValidPlayerIndex(playerIndex, playersCountUnneutral))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.PlayerIndex));
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetUnitOwnershipSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaSetUnitOwnershipSimple, isFastExecute: boolean, war: IBwWar): Promise<void> {
    const targetUnitSet     = new Set<IUnit>();
    const unitMap           = war.getUnitMap();
    const newPlayerIndex    = getExisted(data.getActPlayerIndex());
    {
        const tileMap           = war.getTileMap();
        const conUnitFilter     = data.getConUnitFilter();
        const conPlayerFilter   = data.getConPlayerFilter();
        const playerFilterDict  = new Map<IPlayer, boolean>();
        const conTileFilter     = data.getConTileFilter();
        const tileFilterDict    = new Map<ITile, boolean>();
        for (const unit of unitMap.getAllUnits()) {
            if (unit.getPlayerIndex() === newPlayerIndex) {
                continue;
            }

            if ((conUnitFilter != null) && (!UnitsUtilsFilterCheckIsMeet(conUnitFilter, unit))) {
                continue;
            }

            if ((conPlayerFilter != null) && (!checkIsMeetConPlayerFilter(playerFilterDict, conPlayerFilter, unit.getPlayer()))) {
                continue;
            }

            const gridIndex = unit.getGridIndex();
            if ((conTileFilter != null) && (!checkIsMeetConTileFilter(tileFilterDict, conTileFilter, tileMap.getTile(gridIndex)))) {
                continue;
            }

            targetUnitSet.add(getExisted(unitMap.getUnitOnMap(gridIndex)));
        }

        if (!targetUnitSet.size) {
            return;
        }
    }

    {
        const mapSize                   = unitMap.getMapSize();
        const observerTeamIndexesDict   = new Map<number, number[] | null>();
        for (const unit of targetUnitSet) {
            const gridIndex   = unit.getGridIndex();
            const gridId      = gridIndex.getGridId(mapSize);
            if (!observerTeamIndexesDict.has(gridId)) {
                observerTeamIndexesDict.set(gridId, getObserverTeamIndexListForUnitOnMap({ war, gridIndex }));
            }
        }

        const warStatisticsManager  = war.getWarStatisticsManager();
        const isLoadedUnitVisible   = true;
        for (const unit of targetUnitSet) {
            const loadedUnits           = unitMap.getUnitsLoadedByLoader(unit, true);
            const observerTeamIndexes   = observerTeamIndexesDict.get(unit.getGridIndex().getGridId(mapSize));
            if (observerTeamIndexes != null) {
                const groupedObserverTeamIndexes = encodeTeamIndex(observerTeamIndexes);
                updateWarStatisticsManager(warStatisticsManager, unit, newPlayerIndex, groupedObserverTeamIndexes);

                if (isLoadedUnitVisible) {
                    for (const loadedUnit of loadedUnits) {
                        updateWarStatisticsManager(warStatisticsManager, loadedUnit, newPlayerIndex, groupedObserverTeamIndexes);
                    }
                }
            }

            unit.setPlayerIndex(newPlayerIndex);
            for (const loadedUnit of loadedUnits) {
                loadedUnit.setPlayerIndex(newPlayerIndex);
            }

            if (!isFastExecute) {
                unit.updateView();
            }
        }
    }
}
function checkIsMeetConPlayerFilter(resultDict: Map<IPlayer, boolean>, filter: PlayerFilter, player: IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function checkIsMeetConTileFilter(resultDict: Map<ITile, boolean>, filter: TileFilter, tile: ITile): boolean {
    if (!resultDict.has(tile)) {
        resultDict.set(tile, TilesUtilsFilterCheckIsMeet(filter, tile));
    }
    return !!resultDict.get(tile);
}
function updateWarStatisticsManager(warStatisticsManager: IBwWarStatisticsManager, unit: IUnit, newPlayerIndex: number, groupedObserverTeamIndexes: number): void {
    const unitType      = unit.getUnitType();
    const normalizedHp  = unit.getNormalizedCurrentHp();
    warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
        unitType                    : unitType,
        dstPlayerIndex              : unit.getPlayerIndex(),
        normalizedHpGain            : 0,
        normalizedHpLoss            : normalizedHp,
        unitGain                    : 0,
        unitLoss                    : 1,
        groupedObserverTeamIndexes  : groupedObserverTeamIndexes
    }));
    warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
        unitType                    : unitType,
        dstPlayerIndex              : newPlayerIndex,
        normalizedHpGain            : normalizedHp,
        normalizedHpLoss            : 0,
        unitGain                    : 1,
        unitLoss                    : 0,
        groupedObserverTeamIndexes  : groupedObserverTeamIndexes
    }));
}
