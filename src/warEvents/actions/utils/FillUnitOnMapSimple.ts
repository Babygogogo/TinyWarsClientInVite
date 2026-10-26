import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GcData } from "../../../gameConfigs/GcData.ts";
import { getUnitClass } from "../../../gameHelpers/GhFactory.ts";
import { getNonNullElements } from "../../../helpers/Collection.ts";
import { getExisted, newError } from "../../../helpers/Misc.ts";
import { encodeTeamIndex } from "../../../helpers/Team.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText, getUnitName, getFormattedText } from "../../../lang/Utils.ts";
import { PlayerIndex } from "../../../players/Constants.ts";
import type { WeaFillUnitOnMapSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaFillUnitOnMapSimple.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type { ITileMap } from "../../../tiles/ITileMap.ts";
import { checkIsValid as TilesUtilsFilterCheckIsValid, checkIsEmpty, checkIsMeet } from "../../../tiles/utils/Filter.ts";
import type { IUnitMap } from "../../../units/IUnitMap.ts";
import { getErrorCodeForUnitDataIgnoringUnitId } from "../../../units/utils/Serialization.ts";
import { getObserverTeamIndexListForUnitOnMap } from "../../../visibilities/Utils.ts";

export function checkIsValid(action: Undefinable<WeaFillUnitOnMapSimple>, gameConfig: GcData, mapSize: MapSize, playersCountUnneutral: number): boolean {
    if (action == null) {
        return false;
    }

    const rawUnitData = action.getActUnitData();
    if ((rawUnitData == null)               ||
        (rawUnitData.getLoaderUnitId() != null)
    ) {
        return false;
    }

    {
        const conTileFilter = action.getConTileFilter();
        if ((conTileFilter != null) && (!TilesUtilsFilterCheckIsValid(conTileFilter, playersCountUnneutral, mapSize, gameConfig))) {
            return false;
        }
    }

    const unitData = rawUnitData.clone();
    unitData.createIfNotExistsGridIndex().loadJson({x: 0, y: 0});
    if (getErrorCodeForUnitDataIgnoringUnitId({
        unitData                : unitData,
        gameConfig              : gameConfig,
        mapSize                 : mapSize,
        playersCountUnneutral   : playersCountUnneutral,
    })) {
        return false;
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaFillUnitOnMapSimple>, gameConfig: GcData): string | null {
    if (!data) {
        return null;
    }

    const conTileFilter         = data.getConTileFilter();
    const textForConTileFilter  = ((conTileFilter == null) || (checkIsEmpty(conTileFilter)))
        ? null
        : getText(TextType.B1068);

    const textArray = getNonNullElements([
        textForConTileFilter,
    ]);

    const actIsInTurn           = data.getActIsInTurn();
    const textForActIsInTurn    = actIsInTurn
        ? getText(TextType.A0419)
        : null;

    const unitType          = data.getActUnitData()?.getUnitType();
    const textForUnitType   = unitType == null ? `??` : (getUnitName(unitType, gameConfig) ?? `??`);
    if (textArray.length <= 0) {
        return getFormattedText(
            TextType.F0180,
            textForUnitType,
        ) + (textForActIsInTurn ? ` ${textForActIsInTurn}` : ``);
    } else {
        return getFormattedText(
            TextType.F0166,
            textArray.join(`${getText(TextType.B0783)}`),
            textForUnitType,
        ) + (textForActIsInTurn ? ` ${textForActIsInTurn}` : ``);
    }
}
export function getDetailDesc(data: Undefinable<WeaFillUnitOnMapSimple>, gameConfig: GcData): string | null {
    return getBriefDesc(data, gameConfig);
}

export function getErrorTip(data: WeaFillUnitOnMapSimple, mapSize: MapSize, playersCountUnneutral: number, gameConfig: GcData): string | null {
    {
        const conTileFilter = data.getConTileFilter();
        if ((conTileFilter != null) && (!TilesUtilsFilterCheckIsValid(conTileFilter, playersCountUnneutral, mapSize, gameConfig))) {
            return getFormattedText(TextType.F0091, getText(TextType.TileFilter));
        }
    }

    const rawUnitData = data.getActUnitData();
    if ((rawUnitData == null) || (rawUnitData.getLoaderUnitId() != null)) {
        return getFormattedText(TextType.F0091, getText(TextType.B1058));
    }

    const unitData = rawUnitData.clone();
    unitData.createIfNotExistsGridIndex().loadJson({ x: 0, y: 0 });
    if (getErrorCodeForUnitDataIgnoringUnitId({
        unitData                : unitData,
        mapSize                 : mapSize,
        playersCountUnneutral   : playersCountUnneutral,
        gameConfig              : gameConfig,
    })) {
        return getFormattedText(TextType.F0091, getText(TextType.B1058));
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaFillUnitOnMapSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaFillUnitOnMapSimple, isFastExecute: boolean, war: IBwWar): Promise<void> {
    const rawUnitData = getExisted(action.getActUnitData());
    if (rawUnitData.getLoaderUnitId() != null) {
        throw newError(`non-null loaderUnitId.`);
    }

    const playerIndex = action.getActIsInTurn() ? war.getPlayerIndexInTurn() : (rawUnitData.getPlayerIndex() ?? PlayerIndex.Neutral);
    if (playerIndex === PlayerIndex.Neutral) {
        return;
    }

    const gameConfig                = war.getGcData();
    const unitMap                   = war.getUnitMap();
    const tileMap                   = war.getTileMap();
    const warStatisticsManager      = war.getWarStatisticsManager();
    const canBeBlockedByUnit        = action.getActCanBeBlockedByUnit() ?? false;
    const needMovableTile           = action.getActNeedMovableTile() ?? false;
    const moveType                  = getExisted(gameConfig.getUnitTemplateCfg(getExisted(rawUnitData.getUnitType()))?.getMoveTypeId());
    const conTileFilter             = action.getConTileFilter();
    const candidateGridIndexArray   = tileMap.getTiles(t => (conTileFilter == null) || (checkIsMeet(conTileFilter, t))).map(v => v.getGridIndex());

    for (const gridIndex of candidateGridIndexArray) {
        const targetGridIndex = getGridIndexForAddUnit({
            origin              : gridIndex,
            tileMap             : tileMap,
            unitMap             : unitMap,
            canBeBlockedByUnit  : canBeBlockedByUnit,
            needMovableTile     : needMovableTile,
            moveType            : moveType
        });
        if (targetGridIndex == null) {
            continue;
        }

        const revisedUnitData   = rawUnitData.clone();
        const unitId            = unitMap.getNextUnitId();
        revisedUnitData.setGridIndex(targetGridIndex.toProto());
        revisedUnitData.setPlayerIndex(playerIndex);
        revisedUnitData.setUnitId(unitId);

        const unit = new (getUnitClass())();
        unit.init(revisedUnitData, gameConfig);
        unit.startRunning(war);
        unit.startRunningView();
        unitMap.setNextUnitId(unitId + 1);
        unitMap.setUnitOnMap(unit);
        (!isFastExecute) && (unit.updateView());

        {
            const observerTeamIndexes = getObserverTeamIndexListForUnitOnMap({ war, gridIndex });
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
function getGridIndexForAddUnit({ origin, unitMap, tileMap, moveType, needMovableTile, canBeBlockedByUnit }: {
    origin              : GridIndex;
    unitMap             : IUnitMap;
    tileMap             : ITileMap;
    moveType            : number;
    needMovableTile     : boolean;
    canBeBlockedByUnit  : boolean;
}): GridIndex | null {
    const mapSize = tileMap.getMapSize();
    if ((canBeBlockedByUnit) && (unitMap.getUnitOnMap(origin))) {
        return null;
    }

    const { width, height } = mapSize.getWH();
    const maxDistance = Math.max(
        origin.getDistance(new GridIndex(0,         0           )),
        origin.getDistance(new GridIndex(0,         height - 1  )),
        origin.getDistance(new GridIndex(width - 1, 0           )),
        origin.getDistance(new GridIndex(width - 1, height - 1  )),
    );

    for (let distance = 0; distance <= maxDistance; ++distance) {
        const gridIndex = origin.getGridsWithinDistance({
            minDistance : distance,
            maxDistance : distance,
            mapSize,
            predicate   : (g): boolean => {
                if (unitMap.getUnitOnMap(g)) {
                    return false;
                }

                const tile = tileMap.getTile(g);
                if ((needMovableTile) && (tile.getMoveCostByMoveType(moveType) == null)) {
                    return false;
                }

                return true;
            }
        })[0];
        if (gridIndex) {
            return gridIndex;
        }
    }

    return null;
}
