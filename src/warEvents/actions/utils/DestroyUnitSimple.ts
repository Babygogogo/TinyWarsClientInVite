import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { destroyUnitOnMap, destroyUnitLoaded } from "../../../destructions/Utils.ts";
import type { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText, getFormattedText } from "../../../lang/Utils.ts";
import type { IPlayer } from "../../../players/IPlayer.ts";
import { getDescForEmbed, checkIsValid as PlayersUtilsFilterCheckIsValid, checkIsMeet } from "../../../players/utils/Filter.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { TileFilter } from "../../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type { WeaDestroyUnitSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaDestroyUnitSimple.ts";
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

export function checkIsValid(data: Undefinable<WeaDestroyUnitSimple>, gameConfig: GameConfig, mapSize: MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: Undefinable<WeaDestroyUnitSimple>): string | null {
    if (!data) {
        return null;
    }

    return getText(TextType.A0955);
}
export function getDetailDesc(data: Undefinable<WeaDestroyUnitSimple>): string | null {
    if (!data) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            subTextArray.push(`- ${UnitsUtilsFilterGetDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            subTextArray.push(`- (${getText(TextType.B1422)}) ${getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            subTextArray.push(`- (${getText(TextType.B1423)}) ${TilesUtilsFilterGetDescForEmbed(filter)}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(`- ${getText(TextType.A0944)}`);
    }

    return getFormattedText(
        TextType.F0248,
        subTextArray.join(`\n`),
    );
}

export function getErrorTip(data: WeaDestroyUnitSimple, mapSize: MapSize, playersCountUnneutral: number, gameConfig: GameConfig): string | null {
    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                                    &&
            (!PlayersUtilsFilterCheckIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.PlayerFilter));
        }
    }

    {
        const filter = data.getConUnitFilter();
        if ((filter != null)                                                                            &&
            (!UnitsUtilsFilterCheckIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitFilter));
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

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaDestroyUnitSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaDestroyUnitSimple, isFastExecute: boolean, war: IBwWar): Promise<void> {
    const unitMap           = war.getUnitMap();
    const tileMap           = war.getTileMap();
    const conUnitFilter     = data.getConUnitFilter();
    const conPlayerFilter   = data.getConPlayerFilter();
    const playerFilterDict  = new Map<IPlayer, boolean>();
    const conTileFilter     = data.getConTileFilter();
    const tileFilterDict    = new Map<ITile, boolean>();
    const targetUnitArray   : IUnit[] = [];
    for (const unit of unitMap.getAllUnits()) {
        if ((conUnitFilter != null) && (!UnitsUtilsFilterCheckIsMeet(conUnitFilter, unit))) {
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
                destroyUnitOnMap(war, gridIndex, !isFastExecute);
            }
        } else {
            const unitId = unit.getUnitId();
            if (unitMap.getUnitLoadedById(unitId) === unit) {
                destroyUnitLoaded(war, unitId);
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
