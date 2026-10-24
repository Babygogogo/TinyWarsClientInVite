import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as DestructionsUtils from "../../../destructions/Utils.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as PlayersIPlayer from "../../../players/IPlayer.ts";
import * as PlayersUtilsFilter from "../../../players/utils/Filter.ts";
import type * as ProtoSchemaCommonProtoStructurePlayerFilter from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type * as ProtoSchemaCommonProtoStructureTileFilter from "../../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaDestroyUnitSimple from "../../../proto/schema/CommonProto/WarEvent/WeaDestroyUnitSimple.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as TilesUtilsFilter from "../../../tiles/utils/Filter.ts";
import type * as UnitsIUnit from "../../../units/IUnit.ts";
import * as UnitsUtilsFilter from "../../../units/utils/Filter.ts";

type PlayerFilter           = ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter;
type TileFilter             = ProtoSchemaCommonProtoStructureTileFilter.TileFilter;
type WeaDestroyUnitSimple   = ProtoSchemaCommonProtoWarEventWeaDestroyUnitSimple.WeaDestroyUnitSimple;
type IPlayer                = PlayersIPlayer.IPlayer;
type ITile                  = TilesITile.ITile;

export function checkIsValid(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaDestroyUnitSimple>, gameConfig: GameConfigGcData.GcData, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaDestroyUnitSimple>): string | null {
    if (!data) {
        return null;
    }

    return LangUtils.getText(LangConstants.TextType.A0955);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaDestroyUnitSimple>): string | null {
    if (!data) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            subTextArray.push(`- ${UnitsUtilsFilter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            subTextArray.push(`- (${LangUtils.getText(LangConstants.TextType.B1422)}) ${PlayersUtilsFilter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            subTextArray.push(`- (${LangUtils.getText(LangConstants.TextType.B1423)}) ${TilesUtilsFilter.getDescForEmbed(filter)}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.A0944)}`);
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0248,
        subTextArray.join(`\n`),
    );
}

export function getErrorTip(data: WeaDestroyUnitSimple, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): string | null {
    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                                    &&
            (!PlayersUtilsFilter.checkIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.PlayerFilter));
        }
    }

    {
        const filter = data.getConUnitFilter();
        if ((filter != null)                                                                            &&
            (!UnitsUtilsFilter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitFilter));
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

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaDestroyUnitSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaDestroyUnitSimple, isFastExecute: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const unitMap           = war.getUnitMap();
    const tileMap           = war.getTileMap();
    const conUnitFilter     = data.getConUnitFilter();
    const conPlayerFilter   = data.getConPlayerFilter();
    const playerFilterDict  = new Map<IPlayer, boolean>();
    const conTileFilter     = data.getConTileFilter();
    const tileFilterDict    = new Map<ITile, boolean>();
    const targetUnitArray   : UnitsIUnit.IUnit[] = [];
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
    for (const unit of targetUnitArray) {
        if (unit.getLoaderUnitId() == null) {
            const gridIndex = unit.getGridIndex();
            if (unitMap.getUnitOnMap(gridIndex) === unit) {
                DestructionsUtils.destroyUnitOnMap(war, gridIndex, !isFastExecute);
            }
        } else {
            const unitId = unit.getUnitId();
            if (unitMap.getUnitLoadedById(unitId) === unit) {
                DestructionsUtils.destroyUnitLoaded(war, unitId);
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
