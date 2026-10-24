import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as PlayersIPlayer from "../../../players/IPlayer.ts";
import * as PlayersUtilsFilter from "../../../players/utils/Filter.ts";
import type * as ProtoSchemaCommonProtoStructurePlayerFilter from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type * as ProtoSchemaCommonProtoStructureTileFilter from "../../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetUnitPositionSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitPositionSimple.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as TilesUtilsFilter from "../../../tiles/utils/Filter.ts";
import type * as UnitsIUnit from "../../../units/IUnit.ts";
import * as UnitsUtilsFilter from "../../../units/utils/Filter.ts";

type PlayerFilter               = ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter;
type TileFilter                 = ProtoSchemaCommonProtoStructureTileFilter.TileFilter;
type WeaSetUnitPositionSimple   = ProtoSchemaCommonProtoWarEventWeaSetUnitPositionSimple.WeaSetUnitPositionSimple;
type IPlayer                    = PlayersIPlayer.IPlayer;
type IUnit                      = UnitsIUnit.IUnit;
type ITile                      = TilesITile.ITile;

export function checkIsValid(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitPositionSimple>, gameConfig: GameConfigGcData.GcData, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitPositionSimple>): string | null {
    if (!data) {
        return null;
    }

    return LangUtils.getText(LangConstants.TextType.A0956);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitPositionSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            conTextArray.push(`- ${UnitsUtilsFilter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            conTextArray.push(`- (${LangUtils.getText(LangConstants.TextType.B1422)}) ${PlayersUtilsFilter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            conTextArray.push(`- (${LangUtils.getText(LangConstants.TextType.B1423)}) ${TilesUtilsFilter.getDescForEmbed(filter)}`);
        }
    }

    if (!conTextArray.length) {
        conTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.A0944)}`);
    }

    const actTextArray: string[] = [];
    {
        const filter = data.getActTileFilter();
        if (filter != null) {
            actTextArray.push(`- ${TilesUtilsFilter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getActPlayerFilter();
        if (filter != null) {
            actTextArray.push(`- (${LangUtils.getText(LangConstants.TextType.B1421)}) ${PlayersUtilsFilter.getDescForEmbed(filter)}`);
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.A0944)}`);
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0249,
        conTextArray.join(`\n`),
        actTextArray.join(`\n`),
    );
}

export function getErrorTip(data: WeaSetUnitPositionSimple, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): string | null {
    {
        const filter = data.getConUnitFilter();
        if ((filter != null)                                                                            &&
            (!UnitsUtilsFilter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitFilter));
        }
    }

    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                                    &&
            (!PlayersUtilsFilter.checkIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.PlayerFilter));
        }
    }

    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                            &&
            (!TilesUtilsFilter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileFilter));
        }
    }

    {
        const filter = data.getActTileFilter();
        if ((filter != null)                                                                            &&
            (!TilesUtilsFilter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileFilter));
        }
    }

    {
        const filter = data.getActPlayerFilter();
        if ((filter != null)                                                                    &&
            (!PlayersUtilsFilter.checkIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.PlayerFilter));
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetUnitPositionSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaSetUnitPositionSimple, isFastExecute: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
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
            if ((conUnitFilter != null) && (!UnitsUtilsFilter.checkIsMeet(conUnitFilter, unit))) {
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
                if ((actTileFilter != null) && (!TilesUtilsFilter.checkIsMeet(actTileFilter, tile))) {
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
        resultDict.set(player, PlayersUtilsFilter.checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function checkIsMeetConTileFilter(resultDict: Map<ITile, boolean>, filter: TileFilter, tile: ITile): boolean {
    if (!resultDict.has(tile)) {
        resultDict.set(tile, TilesUtilsFilter.checkIsMeet(filter, tile));
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
function moveUnit(unit: IUnit, gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
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
