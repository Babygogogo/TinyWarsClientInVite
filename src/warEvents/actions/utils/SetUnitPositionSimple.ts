import {
    Players_Utils_Filter,
    Tiles_Utils_Filter,
    Units_Utils_Filter,
    Lang_Utils,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_GridIndex,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
    type Tiles_ITile,
    type Units_IUnit,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { TileFilter } from "../../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type { WeaSetUnitPositionSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitPositionSimple.ts";

export function checkIsValid(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitPositionSimple>, gameConfig: GameConfigs_GameConfig.GameConfig, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitPositionSimple>): string | null {
    if (!data) {
        return null;
    }

    return Lang_Utils.getText(Lang_Constants.TextType.A0956);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitPositionSimple>): string | null {
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

    const actTextArray: string[] = [];
    {
        const filter = data.getActTileFilter();
        if (filter != null) {
            actTextArray.push(`- ${Tiles_Utils_Filter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getActPlayerFilter();
        if (filter != null) {
            actTextArray.push(`- (${Lang_Utils.getText(Lang_Constants.TextType.B1421)}) ${Players_Utils_Filter.getDescForEmbed(filter)}`);
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.A0944)}`);
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0249,
        conTextArray.join(`\n`),
        actTextArray.join(`\n`),
    );
}

export function getErrorTip(data: WeaSetUnitPositionSimple, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
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
        const filter = data.getActTileFilter();
        if ((filter != null)                                                                            &&
            (!Tiles_Utils_Filter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileFilter));
        }
    }

    {
        const filter = data.getActPlayerFilter();
        if ((filter != null)                                                                    &&
            (!Players_Utils_Filter.checkIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.PlayerFilter));
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetUnitPositionSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaSetUnitPositionSimple, isFastExecute: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const unitMap           = war.getUnitMap();
    const tileMap           = war.getTileMap();
    const targetUnitArray   : Units_IUnit.IUnit[] = [];
    {
        const conUnitFilter     = data.getConUnitFilter();
        const conPlayerFilter   = data.getConPlayerFilter();
        const playerFilterDict  = new Map<Players_IPlayer.IPlayer, boolean>();
        const conTileFilter     = data.getConTileFilter();
        const tileFilterDict    = new Map<Tiles_ITile.ITile, boolean>();
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

        targetUnitArray.sort((v1, v2) => v1.getUnitId() - v2.getUnitId());

        if (!targetUnitArray.length) {
            return;
        }
    }

    const targetTileArray: Tiles_ITile.ITile[] = [];
    {
        const actTileFilter     = data.getActTileFilter();
        const actPlayerFilter   = data.getActPlayerFilter();
        const playerFilterDict  = new Map<Players_IPlayer.IPlayer, boolean>();
        for (const column of tileMap.getMap()) {
            for (const tile of column) {
                if ((actTileFilter != null) && (!Tiles_Utils_Filter.checkIsMeet(actTileFilter, tile))) {
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
function checkIsMeetConPlayerFilter(resultDict: Map<Players_IPlayer.IPlayer, boolean>, filter: PlayerFilter, player: Players_IPlayer.IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, Players_Utils_Filter.checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function checkIsMeetConTileFilter(resultDict: Map<Tiles_ITile.ITile, boolean>, filter: TileFilter, tile: Tiles_ITile.ITile): boolean {
    if (!resultDict.has(tile)) {
        resultDict.set(tile, Tiles_Utils_Filter.checkIsMeet(filter, tile));
    }
    return !!resultDict.get(tile);
}
function getAvailableLoader(rootLoader: Units_IUnit.IUnit, target: Units_IUnit.IUnit): Units_IUnit.IUnit | null {
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
function moveUnit(unit: Units_IUnit.IUnit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
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
