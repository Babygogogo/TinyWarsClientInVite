import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText, getFormattedText } from "../../../lang/Utils.ts";
import type { IPlayer } from "../../../players/IPlayer.ts";
import { getDescForEmbed, checkIsValid as PlayersUtilsFilterCheckIsValid, checkIsMeet } from "../../../players/utils/Filter.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { TileFilter } from "../../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type { WeaSetUnitPositionSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitPositionSimple.ts";
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

export function checkIsValid(data: Undefinable<WeaSetUnitPositionSimple>, gameConfig: GameConfig, mapSize: MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: Undefinable<WeaSetUnitPositionSimple>): string | null {
    if (!data) {
        return null;
    }

    return getText(TextType.A0956);
}
export function getDetailDesc(data: Undefinable<WeaSetUnitPositionSimple>): string | null {
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

    const actTextArray: string[] = [];
    {
        const filter = data.getActTileFilter();
        if (filter != null) {
            actTextArray.push(`- ${TilesUtilsFilterGetDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getActPlayerFilter();
        if (filter != null) {
            actTextArray.push(`- (${getText(TextType.B1421)}) ${getDescForEmbed(filter)}`);
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(`- ${getText(TextType.A0944)}`);
    }

    return getFormattedText(
        TextType.F0249,
        conTextArray.join(`\n`),
        actTextArray.join(`\n`),
    );
}

export function getErrorTip(data: WeaSetUnitPositionSimple, mapSize: MapSize, playersCountUnneutral: number, gameConfig: GameConfig): string | null {
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
        const filter = data.getActTileFilter();
        if ((filter != null)                                                                            &&
            (!TilesUtilsFilterCheckIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.TileFilter));
        }
    }

    {
        const filter = data.getActPlayerFilter();
        if ((filter != null)                                                                    &&
            (!PlayersUtilsFilterCheckIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.PlayerFilter));
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetUnitPositionSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaSetUnitPositionSimple, isFastExecute: boolean, war: IBwWar): Promise<void> {
    const unitMap           = war.getUnitMap();
    const tileMap           = war.getTileMap();
    const targetUnitArray   : IUnit[] = [];
    {
        const conUnitFilter     = data.getConUnitFilter();
        const conPlayerFilter   = data.getConPlayerFilter();
        const playerFilterDict  = new Map<IPlayer, boolean>();
        const conTileFilter     = data.getConTileFilter();
        const tileFilterDict    = new Map<ITile, boolean>();
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

        targetUnitArray.sort((v1, v2) => v1.getUnitId() - v2.getUnitId());

        if (!targetUnitArray.length) {
            return;
        }
    }

    const targetTileArray: ITile[] = [];
    {
        const actTileFilter     = data.getActTileFilter();
        const actPlayerFilter   = data.getActPlayerFilter();
        const playerFilterDict  = new Map<IPlayer, boolean>();
        for (const column of tileMap.getMap()) {
            for (const tile of column) {
                if ((actTileFilter != null) && (!TilesUtilsFilterCheckIsMeet(actTileFilter, tile))) {
                    continue;
                }

                if ((actPlayerFilter != null) && (!checkIsMeetConPlayerFilter(playerFilterDict, actPlayerFilter, tile.getPlayer()))) {
                    continue;
                }

                targetTileArray.push(tile);
            }
        }

        if (!targetTileArray.length) {
            return;
        }
    }

    for (const unit of targetUnitArray) {
        const oldGridIndex = unit.getGridIndex();

        for (const tile of targetTileArray) {
            const newGridIndex = tile.getGridIndex();
            if (oldGridIndex.checkIsEqual(newGridIndex)) {
                break;
            }

            const existingUnit = unitMap.getUnitOnMap(newGridIndex);
            if (existingUnit == null) {
                moveUnit(unit, newGridIndex);
                unit.setLoaderUnitId(null);
                unitMap.setUnitOnMap(unit);
                break;

            } else {
                const loader = getAvailableLoader(existingUnit, unit);
                if (loader != null) {
                    moveUnit(unit, newGridIndex);
                    unit.setLoaderUnitId(loader.getUnitId());
                    unitMap.setUnitLoaded(unit);
                    break;
                }
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
function getAvailableLoader(rootLoader: IUnit, target: IUnit): IUnit | null {
    const loaderArray = [rootLoader];
    for (let i = 0; i < loaderArray.length; ++i) {
        const loader = loaderArray[i];
        if (loader.checkCanLoadUnit(target)) {
            return loader;
        }

        loaderArray.push(...loader.getLoadedUnits().sort((v1, v2) => v1.getUnitId() - v2.getUnitId()));
    }
    return null;
}
function moveUnit(unit: IUnit, gridIndex: GridIndex): void {
    const unitMap = unit.getWar().getUnitMap();
    if (unit.getLoaderUnitId() == null) {
        unitMap.removeUnitOnMap(unit.getGridIndex(), false);
    } else {
        unitMap.removeUnitLoaded(unit.getUnitId());
    }

    unit.setGridIndex(gridIndex);
    for (const loadedUnit of unitMap.getUnitsLoadedByLoader(unit, true)) {
        loadedUnit.setGridIndex(gridIndex);
    }
}
