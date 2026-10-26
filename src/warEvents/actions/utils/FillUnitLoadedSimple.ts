import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GcData } from "../../../gameConfigs/GcData.ts";
import { getUnitClass } from "../../../gameHelpers/GhFactory.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { encodeTeamIndex } from "../../../helpers/Team.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText, getUnitName, getText } from "../../../lang/Utils.ts";
import type { IPlayer } from "../../../players/IPlayer.ts";
import { getDescForEmbed, checkIsValid as PlayersUtilsFilterCheckIsValid, checkIsMeet } from "../../../players/utils/Filter.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { TileFilter } from "../../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type { WeaFillUnitLoadedSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaFillUnitLoadedSimple.ts";
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
import { getErrorCodeForUnitDataIgnoringUnitId } from "../../../units/utils/Serialization.ts";
import { getObserverTeamIndexListForUnitOnMap } from "../../../visibilities/Utils.ts";

export function checkIsValid(data: Undefinable<WeaFillUnitLoadedSimple>, gameConfig: GcData, mapSize: MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: Undefinable<WeaFillUnitLoadedSimple>, gameConfig: GcData): string | null {
    if (!data) {
        return null;
    }

    const unitType = data.getActUnitData()?.getUnitType();
    return getFormattedText(
        TextType.F0247,
        data.getActLoadCount(),
        unitType == null ? UndefinedError : (getUnitName(unitType, gameConfig) ?? UndefinedError)
    );
}
export function getDetailDesc(data: Undefinable<WeaFillUnitLoadedSimple>, gameConfig: GcData): string | null {
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

    const unitType = data.getActUnitData()?.getUnitType();
    return getFormattedText(
        TextType.F0246,
        subTextArray.join(`\n`),
        data.getActLoadCount(),
        unitType == null ? UndefinedError : (getUnitName(unitType, gameConfig) ?? UndefinedError)
    );
}

export function getErrorTip(data: WeaFillUnitLoadedSimple, mapSize: MapSize, playersCountUnneutral: number, gameConfig: GcData): string | null {
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

    {
        const count = data.getActLoadCount();
        if ((count == null) || (count < 1)) {
            return getFormattedText(TextType.F0091, getText(TextType.B1424));
        }
    }

    {
        const actUnitData = data.getActUnitData();
        if (actUnitData == null) {
            return getFormattedText(TextType.F0091, getText(TextType.B1058));
        }

        const unitData = actUnitData.clone();
        unitData.createIfNotExistsGridIndex().loadJson({ x: 0, y: 0 });
        unitData.setLoaderUnitId(null);

        if (getErrorCodeForUnitDataIgnoringUnitId({
            unitData                : unitData,
            mapSize                 : mapSize,
            playersCountUnneutral   : playersCountUnneutral,
            gameConfig              : gameConfig,
        })) {
            return getFormattedText(TextType.F0091, getText(TextType.B1058));
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaFillUnitLoadedSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaFillUnitLoadedSimple, isFastExecute: boolean, war: IBwWar): Promise<void> {
    const unitMap           = war.getUnitMap();
    const tileMap           = war.getTileMap();
    const conUnitFilter     = data.getConUnitFilter();
    const tileFilterDict    = new Map<ITile, boolean>();
    const conPlayerFilter   = data.getConPlayerFilter();
    const playerFilterDict  = new Map<IPlayer, boolean>();
    const conTileFilter     = data.getConTileFilter();
    const loaderUnitsDict   = new Map<IUnit, number>();
    const actLoadCount      = data.getActLoadCount() ?? 0;
    for (const unit of unitMap.getAllUnits()) {
        const remainingCount = (unit.getMaxLoadUnitsCount() ?? 0) - unit.getLoadedUnitsCount();
        if (remainingCount <= 0) {
            continue;
        }

        if ((conUnitFilter != null) && (!UnitsUtilsFilterCheckIsMeet(conUnitFilter, unit))) {
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

    const rawUnitData           = getExisted(data.getActUnitData());
    const unitType              = rawUnitData.getUnitType() ?? 0;
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
        const observerTeamIndexes   = getObserverTeamIndexListForUnitOnMap({ war, gridIndex });

        for (let i = 0; i < loadCount; ++i) {
            const revisedUnitData   = rawUnitData;
            const unitId            = unitMap.getNextUnitId();
            revisedUnitData.setGridIndex(gridIndex.toProto());
            revisedUnitData.setLoaderUnitId(loaderUnitId);
            revisedUnitData.setPlayerIndex(playerIndex);
            revisedUnitData.setUnitId(unitId);

            const unit = new (getUnitClass())();
            unit.init(revisedUnitData, gameConfig);
            unit.startRunning(war);
            unit.startRunningView();
            unitMap.setNextUnitId(unitId + 1);
            unitMap.setUnitLoaded(unit);
            (!isFastExecute) && (unit.updateView());

            if (observerTeamIndexes != null) {
                warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                    unitType                    : unit.getUnitType(),
                    dstPlayerIndex              : playerIndex,
                    unitGain                    : 1,
                    unitLoss                    : 0,
                    normalizedHpGain            : unit.getNormalizedCurrentHp(),
                    normalizedHpLoss            : 0,
                    groupedObserverTeamIndexes  : encodeTeamIndex(observerTeamIndexes),
                }));
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
