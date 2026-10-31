import {
    Players_Utils_Filter,
    Tiles_Utils_Filter,
    Units_Utils_Filter,
    Players_Utils_Common,
    Helpers_Team,
    Helpers_Misc,
    Lang_Utils,
    Visibilities_Utils,
    Players_Constants,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type BaseWar_Interface_IBwWarStatisticsManager,
    type Players_IPlayer,
    type Tiles_Tile,
    type Units_Unit,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { TileFilter } from "../../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type { WeaSetUnitOwnershipSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitOwnershipSimple.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

export function checkIsValid(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitOwnershipSimple>, gameConfig: GameConfigs_GameConfig.GameConfig, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitOwnershipSimple>): string | null {
    if (!data) {
        return null;
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0250,
        `P${data.getActPlayerIndex()}`,
    );
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitOwnershipSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            conTextArray.push(`- ${Units_Utils_Filter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            conTextArray.push(`- (${Lang_Utils.getText(Lang_Constants.TextType.B1422)}) ${Players_Utils_Filter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            conTextArray.push(`- (${Lang_Utils.getText(Lang_Constants.TextType.B1423)}) ${Tiles_Utils_Filter.getDescForEmbed(filter)}`);
        }
    }

    if (!conTextArray.length) {
        conTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.A0944)}`);
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0251,
        conTextArray.join(`\n`),
        `P${data.getActPlayerIndex()}`,
    );
}

export function getErrorTip(data: WeaSetUnitOwnershipSimple, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    {
        const filter = data.getConUnitFilter();
        if ((filter != null)                                                                            &&
            (!Units_Utils_Filter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.UnitFilter));
        }
    }

    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                                    &&
            (!Players_Utils_Filter.checkIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.PlayerFilter));
        }
    }

    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                            &&
            (!Tiles_Utils_Filter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileFilter));
        }
    }

    {
        const playerIndex = data.getActPlayerIndex();
        if ((playerIndex == null)                                                           ||
            (playerIndex === Players_Constants.PlayerIndex.Neutral)       ||
            (!Players_Utils_Common.checkIsValidPlayerIndex(playerIndex, playersCountUnneutral))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.PlayerIndex));
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetUnitOwnershipSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaSetUnitOwnershipSimple, isFastExecute: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const targetUnitSet     = new Set<Units_Unit.Unit>();
    const unitMap           = war.getUnitMap();
    const newPlayerIndex    = data.getActPlayerIndex();
    {
        const tileMap           = war.getTileMap();
        const conUnitFilter     = data.getConUnitFilter();
        const conPlayerFilter   = data.getConPlayerFilter();
        const playerFilterDict  = new Map<Players_IPlayer.IPlayer, boolean>();
        const conTileFilter     = data.getConTileFilter();
        const tileFilterDict    = new Map<Tiles_Tile.Tile, boolean>();
        for (const unit of unitMap.getAllUnits()) {
            if (unit.getPlayerIndex() === newPlayerIndex) {
                continue;
            }

            if ((conUnitFilter != null) && (!Units_Utils_Filter.checkIsMeet(conUnitFilter, unit))) {
                continue;
            }

            if ((conPlayerFilter != null) && (!checkIsMeetConPlayerFilter(playerFilterDict, conPlayerFilter, unit.getPlayer()))) {
                continue;
            }

            const gridIndex = unit.getGridIndex();
            if ((conTileFilter != null) && (!checkIsMeetConTileFilter(tileFilterDict, conTileFilter, tileMap.getTile(gridIndex)))) {
                continue;
            }

            targetUnitSet.add(Helpers_Misc.getExisted(unitMap.getUnitOnMap(gridIndex)));
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
                observerTeamIndexesDict.set(gridId, Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex }));
            }
        }

        const warStatisticsManager  = war.getWarStatisticsManager();
        const isLoadedUnitVisible   = true;
        for (const unit of targetUnitSet) {
            const loadedUnits           = unitMap.getUnitsLoadedByLoader(unit, true);
            const observerTeamIndexes   = observerTeamIndexesDict.get(unit.getGridIndex().getGridId(mapSize));
            if (observerTeamIndexes != null) {
                const groupedObserverTeamIndexes = Helpers_Team.encodeTeamIndex(observerTeamIndexes);
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
function checkIsMeetConPlayerFilter(resultDict: Map<Players_IPlayer.IPlayer, boolean>, filter: PlayerFilter, player: Players_IPlayer.IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, Players_Utils_Filter.checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function checkIsMeetConTileFilter(resultDict: Map<Tiles_Tile.Tile, boolean>, filter: TileFilter, tile: Tiles_Tile.Tile): boolean {
    if (!resultDict.has(tile)) {
        resultDict.set(tile, Tiles_Utils_Filter.checkIsMeet(filter, tile));
    }
    return !!resultDict.get(tile);
}
function updateWarStatisticsManager(warStatisticsManager: BaseWar_Interface_IBwWarStatisticsManager.IBwWarStatisticsManager, unit: Units_Unit.Unit, newPlayerIndex: number, groupedObserverTeamIndexes: number): void {
    const unitType      = unit.getUnitType();
    const normalizedHp  = unit.getNormalizedCurrentHp();
    warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
        unitType                   : unitType,
        dstPlayerIndex             : unit.getPlayerIndex(),
        normalizedHpGain           : 0,
        normalizedHpLoss           : normalizedHp,
        unitGain                   : 0,
        unitLoss                   : 1,
        groupedObserverTeamIndexes : groupedObserverTeamIndexes,
    }));
    warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
        unitType                   : unitType,
        dstPlayerIndex             : newPlayerIndex,
        normalizedHpGain           : normalizedHp,
        normalizedHpLoss           : 0,
        unitGain                   : 1,
        unitLoss                   : 0,
        groupedObserverTeamIndexes : groupedObserverTeamIndexes,
    }));
}
