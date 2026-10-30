import {
    Units_Unit,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
    Players_Utils_Filter,
    Tiles_Utils_Filter,
    Units_Utils_Filter,
    Helpers_Team,
    Units_Utils_Serialization,
    Helpers_Misc,
    Lang_Utils,
    Visibilities_Utils,
    Lang_Constants,
    type Players_IPlayer,
    type Tiles_ITile,
    type Units_IUnit,
} from "../../../internal.ts";

import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { TileFilter } from "../../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type { WeaFillUnitLoadedSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaFillUnitLoadedSimple.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

export function checkIsValid(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaFillUnitLoadedSimple>, gameConfig: GameConfigs_GameConfig.GameConfig, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaFillUnitLoadedSimple>, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    if (!data) {
        return null;
    }

    const unitType = data.getActUnitData()?.getUnitType();
    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0247,
        data.getActLoadCount(),
        unitType == null ? Lang_Constants.UndefinedError : (Lang_Utils.getUnitName(unitType, gameConfig) ?? Lang_Constants.UndefinedError),
    );
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaFillUnitLoadedSimple>, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
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

    const unitType = data.getActUnitData()?.getUnitType();
    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0246,
        subTextArray.join(`\n`),
        data.getActLoadCount(),
        unitType == null ? Lang_Constants.UndefinedError : (Lang_Utils.getUnitName(unitType, gameConfig) ?? Lang_Constants.UndefinedError),
    );
}

export function getErrorTip(data: WeaFillUnitLoadedSimple, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
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

    {
        const count = data.getActLoadCount();
        if ((count == null) || (count < 1)) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B1424));
        }
    }

    {
        const actUnitData = data.getActUnitData();
        if (actUnitData == null) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B1058));
        }

        const unitData = actUnitData.clone();
        unitData.createIfNotExistsGridIndex().loadJson({ x : 0, y : 0 });
        unitData.setLoaderUnitId(null);

        if (Units_Utils_Serialization.getErrorCodeForUnitDataIgnoringUnitId({
            unitData              : unitData,
            mapSize               : mapSize,
            playersCountUnneutral : playersCountUnneutral,
            gameConfig            : gameConfig,
        })) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B1058));
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaFillUnitLoadedSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaFillUnitLoadedSimple, isFastExecute: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const unitMap           = war.getUnitMap();
    const tileMap           = war.getTileMap();
    const conUnitFilter     = data.getConUnitFilter();
    const tileFilterDict    = new Map<Tiles_ITile.ITile, boolean>();
    const conPlayerFilter   = data.getConPlayerFilter();
    const playerFilterDict  = new Map<Players_IPlayer.IPlayer, boolean>();
    const conTileFilter     = data.getConTileFilter();
    const loaderUnitsDict   = new Map<Units_IUnit.IUnit, number>();
    const actLoadCount      = data.getActLoadCount();
    for (const unit of unitMap.getAllUnits()) {
        const remainingCount = (unit.getMaxLoadUnitsCount() ?? 0) - unit.getLoadedUnitsCount();
        if (remainingCount <= 0) {
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

        loaderUnitsDict.set(unit, Math.min(actLoadCount, remainingCount));
    }

    const rawUnitData           = Helpers_Misc.getExisted(data.getActUnitData());
    const unitType              = rawUnitData.getUnitType();
    const gameConfig            = war.getGcData();
    const warStatisticsManager  = war.getWarStatisticsManager();
    for (const [loaderUnit, loadCount] of loaderUnitsDict) {
        {
            const loadUnitCategory = loaderUnit.getLoadUnitCategoryId();
            if ((loadUnitCategory == null) || (!gameConfig.checkIsUnitTypeInCategory(unitType, loadUnitCategory))) {
                continue;
            }
        }

        const gridIndex             = loaderUnit.getGridIndex();
        const loaderUnitId          = loaderUnit.getUnitId();
        const playerIndex           = loaderUnit.getPlayerIndex();
        const observerTeamIndexes   = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex });

        for (let i = 0; i < loadCount; ++i) {
            const revisedUnitData   = rawUnitData;
            const unitId            = unitMap.getNextUnitId();
            revisedUnitData.setGridIndex(gridIndex.toProto());
            revisedUnitData.setLoaderUnitId(loaderUnitId);
            revisedUnitData.setPlayerIndex(playerIndex);
            revisedUnitData.setUnitId(unitId);

            const unit = new Units_Unit.Unit();
            unit.init(revisedUnitData, gameConfig);
            unit.startRunning(war);
            unit.startRunningView();
            unitMap.setNextUnitId(unitId + 1);
            unitMap.setUnitLoaded(unit);
            (!isFastExecute) && (unit.updateView());

            if (observerTeamIndexes != null) {
                warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                    unitType                   : unit.getUnitType(),
                    dstPlayerIndex             : playerIndex,
                    unitGain                   : 1,
                    unitLoss                   : 0,
                    normalizedHpGain           : unit.getNormalizedCurrentHp(),
                    normalizedHpLoss           : 0,
                    groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                }));
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
