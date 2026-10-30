import {
    Players_Utils_Filter,
    Tiles_Utils_Filter,
    Units_Utils_Filter,
    Units_Utils_Serialization,
    Helpers_Team,
    Helpers_Misc,
    Lang_Utils,
    Units_Utils_Common,
    Visibilities_Utils,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
    type Tiles_ITile,
    type Units_IUnit,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { TileFilter } from "../../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type { WeaSetUnitTypeSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitTypeSimple.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

export function checkIsValid(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitTypeSimple>, gameConfig: GameConfigs_GameConfig.GameConfig, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitTypeSimple>, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    if (!data) {
        return null;
    }

    const unitType = data.getActUnitType();
    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0252,
        unitType == null ? Lang_Constants.UndefinedError : Lang_Utils.getUnitName(unitType, gameConfig),
    );
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitTypeSimple>, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
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

    const unitType = data.getActUnitType();
    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0253,
        conTextArray.join(`\n`),
        unitType == null ? Lang_Constants.UndefinedError : Lang_Utils.getUnitName(unitType, gameConfig),
    );
}

export function getErrorTip(data: WeaSetUnitTypeSimple, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
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
        const unitType = data.getActUnitType();
        if ((unitType == null)                              ||
            (!gameConfig.checkIsValidUnitType(unitType))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0525));
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetUnitTypeSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaSetUnitTypeSimple, isFastExecute: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const targetUnitArray       : Units_IUnit.IUnit[] = [];
    const unitMap               = war.getUnitMap();
    const newUnitType           = data.getActUnitType();
    {
        const tileMap               = war.getTileMap();
        const conUnitFilter         = data.getConUnitFilter();
        const conPlayerFilter       = data.getConPlayerFilter();
        const playerFilterDict      = new Map<Players_IPlayer.IPlayer, boolean>();
        const conTileFilter         = data.getConTileFilter();
        const tileFilterDict        = new Map<Tiles_ITile.ITile, boolean>();
        const unitInfoArray         : { unit: Units_IUnit.IUnit, depth: number }[] = [];

        for (const unit of unitMap.getAllUnits()) {
            if (unit.getUnitType() === newUnitType) {
                continue;
            }

            if ((conUnitFilter != null) && (!Units_Utils_Filter.checkIsMeet(conUnitFilter, unit))) {
                continue;
            }

            if ((conPlayerFilter != null) && (!checkIsMeetConPlayerFilter(playerFilterDict, conPlayerFilter, unit.getPlayer()))) {
                continue;
            }

            if ((conTileFilter != null) && (!checkIsMeetConTileFilter(tileFilterDict, conTileFilter, tileMap.getTile(unit.getGridIndex())))) {
                continue;
            }

            unitInfoArray.push({ unit, depth : getLoadDepth(unit) });
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
                observerTeamIndexesDict.set(gridId, Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex }));
            }
        }

        const warStatisticsManager  = war.getWarStatisticsManager();
        const gameConfig            = war.getGcData();
        const newUnitTemplateCfg    = Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(newUnitType));
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

            const newUnitData = Units_Utils_Serialization.createNewUnitDataForChangeType(unit, newUnitType);
            {
                const observerTeamIndexes = observerTeamIndexesDict.get(unit.getGridIndex().getGridId(mapSize));
                if (observerTeamIndexes != null) {
                    const groupedObserverTeamIndexes = Helpers_Team.encodeTeamIndex(observerTeamIndexes);
                    warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                        unitType                   : unit.getUnitType(),
                        dstPlayerIndex             : unit.getPlayerIndex(),
                        normalizedHpGain           : 0,
                        normalizedHpLoss           : unit.getNormalizedCurrentHp(),
                        unitGain                   : 0,
                        unitLoss                   : 1,
                        groupedObserverTeamIndexes : groupedObserverTeamIndexes,
                    }));

                    warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                        unitType                   : newUnitType,
                        dstPlayerIndex             : newUnitData.getPlayerIndex(),
                        normalizedHpGain           : Units_Utils_Common.getNormalizedHp(newUnitData.getCurrentHp()),
                        normalizedHpLoss           : 0,
                        unitGain                   : 1,
                        unitLoss                   : 0,
                        groupedObserverTeamIndexes : groupedObserverTeamIndexes,
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
function getLoadDepth(unit: Units_IUnit.IUnit): number {
    let depth       = 0;
    let loaderUnit  = unit.getLoaderUnit();
    while (loaderUnit != null) {
        ++depth;
        loaderUnit = loaderUnit.getLoaderUnit();
    }
    return depth;
}
