import {
    Players_Utils_Filter,
    Tiles_Utils_Filter,
    Units_Utils_Filter,
    Destructions_Utils,
    Lang_Utils,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
    type Tiles_Tile,
    type Units_Unit,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { TileFilter } from "../../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type { WeaDestroyUnitSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaDestroyUnitSimple.ts";

export function checkIsValid(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaDestroyUnitSimple>, gameConfig: GameConfigs_GameConfig.GameConfig, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaDestroyUnitSimple>): string | null {
    if (!data) {
        return null;
    }

    return Lang_Utils.getText(Lang_Constants.TextType.A0955);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaDestroyUnitSimple>): string | null {
    if (!data) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            subTextArray.push(`- ${Units_Utils_Filter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            subTextArray.push(`- (${Lang_Utils.getText(Lang_Constants.TextType.B1422)}) ${Players_Utils_Filter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            subTextArray.push(`- (${Lang_Utils.getText(Lang_Constants.TextType.B1423)}) ${Tiles_Utils_Filter.getDescForEmbed(filter)}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.A0944)}`);
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0248,
        subTextArray.join(`\n`),
    );
}

export function getErrorTip(data: WeaDestroyUnitSimple, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                                    &&
            (!Players_Utils_Filter.checkIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.PlayerFilter));
        }
    }

    {
        const filter = data.getConUnitFilter();
        if ((filter != null)                                                                            &&
            (!Units_Utils_Filter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.UnitFilter));
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

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaDestroyUnitSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaDestroyUnitSimple, isFastExecute: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const unitMap           = war.getUnitMap();
    const tileMap           = war.getTileMap();
    const conUnitFilter     = data.getConUnitFilter();
    const conPlayerFilter   = data.getConPlayerFilter();
    const playerFilterDict  = new Map<Players_IPlayer.IPlayer, boolean>();
    const conTileFilter     = data.getConTileFilter();
    const tileFilterDict    = new Map<Tiles_Tile.Tile, boolean>();
    const targetUnitArray   : Units_Unit.Unit[] = [];
    for (const unit of unitMap.getAllUnits()) {
        if ((conUnitFilter != null) && (!Units_Utils_Filter.checkIsMeet(conUnitFilter, unit))) {
            continue;
        }

        if ((conPlayerFilter != null) && (!checkIsMeetConPlayerFilter(playerFilterDict, conPlayerFilter, unit.getPlayer()))) {
            continue;
        }

        if ((conTileFilter != null) && (!checkIsMeetConTileFilter(tileFilterDict, conTileFilter, tileMap.getTile(unit.getGridIndex())))) {
            continue;
        }

        targetUnitArray.push(unit);
    }
    for (const unit of targetUnitArray) {
        if (unit.getLoaderUnitId() == null) {
            const gridIndex = unit.getGridIndex();
            if (unitMap.getUnitOnMap(gridIndex) === unit) {
                Destructions_Utils.destroyUnitOnMap(war, gridIndex, !isFastExecute);
            }
        } else {
            const unitId = unit.getUnitId();
            if (unitMap.getUnitLoadedById(unitId) === unit) {
                Destructions_Utils.destroyUnitLoaded(war, unitId);
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
