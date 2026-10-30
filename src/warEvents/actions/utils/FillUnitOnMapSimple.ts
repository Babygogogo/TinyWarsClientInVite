import {
    AuxiliaryTypes_GridIndex,
    Units_Unit,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
    Tiles_Utils_Filter,
    Helpers_Team,
    Units_Utils_Serialization,
    Helpers_Misc,
    Lang_Utils,
    Helpers_Collection,
    Visibilities_Utils,
    Players_Constants,
    Lang_Constants,
    type Tiles_ITileMap,
    type Units_IUnitMap,
} from "../../../internal.ts";

import type { WeaFillUnitOnMapSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaFillUnitOnMapSimple.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaFillUnitOnMapSimple>, gameConfig: GameConfigs_GameConfig.GameConfig, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number): boolean {
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
        if ((conTileFilter != null) && (!Tiles_Utils_Filter.checkIsValid(conTileFilter, playersCountUnneutral, mapSize, gameConfig))) {
            return false;
        }
    }

    const unitData = rawUnitData.clone();
    unitData.createIfNotExistsGridIndex().loadJson({ x : 0, y : 0 });
    if (Units_Utils_Serialization.getErrorCodeForUnitDataIgnoringUnitId({
        unitData              : unitData,
        gameConfig            : gameConfig,
        mapSize               : mapSize,
        playersCountUnneutral : playersCountUnneutral,
    })) {
        return false;
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaFillUnitOnMapSimple>, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    if (!data) {
        return null;
    }

    const conTileFilter         = data.getConTileFilter();
    const textForConTileFilter  = ((conTileFilter == null) || (Tiles_Utils_Filter.checkIsEmpty(conTileFilter)))
        ? null
        : Lang_Utils.getText(Lang_Constants.TextType.B1068);

    const textArray = Helpers_Collection.getNonNullElements([
        textForConTileFilter,
    ]);

    const actIsInTurn           = data.getActIsInTurn();
    const textForActIsInTurn    = actIsInTurn
        ? Lang_Utils.getText(Lang_Constants.TextType.A0419)
        : null;

    const unitType          = data.getActUnitData()?.getUnitType();
    const textForUnitType   = unitType == null ? `??` : (Lang_Utils.getUnitName(unitType, gameConfig) ?? `??`);
    if (textArray.length <= 0) {
        return Lang_Utils.getFormattedText(
            Lang_Constants.TextType.F0180,
            textForUnitType,
        ) + (textForActIsInTurn ? ` ${textForActIsInTurn}` : ``);
    } else {
        return Lang_Utils.getFormattedText(
            Lang_Constants.TextType.F0166,
            textArray.join(`${Lang_Utils.getText(Lang_Constants.TextType.B0783)}`),
            textForUnitType,
        ) + (textForActIsInTurn ? ` ${textForActIsInTurn}` : ``);
    }
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaFillUnitOnMapSimple>, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    return getBriefDesc(data, gameConfig);
}

export function getErrorTip(data: WeaFillUnitOnMapSimple, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    {
        const conTileFilter = data.getConTileFilter();
        if ((conTileFilter != null) && (!Tiles_Utils_Filter.checkIsValid(conTileFilter, playersCountUnneutral, mapSize, gameConfig))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileFilter));
        }
    }

    const rawUnitData = data.getActUnitData();
    if ((rawUnitData == null) || (rawUnitData.getLoaderUnitId() != null)) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B1058));
    }

    const unitData = rawUnitData.clone();
    unitData.createIfNotExistsGridIndex().loadJson({ x : 0, y : 0 });
    if (Units_Utils_Serialization.getErrorCodeForUnitDataIgnoringUnitId({
        unitData              : unitData,
        mapSize               : mapSize,
        playersCountUnneutral : playersCountUnneutral,
        gameConfig            : gameConfig,
    })) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B1058));
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaFillUnitOnMapSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaFillUnitOnMapSimple, isFastExecute: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const rawUnitData = Helpers_Misc.getExisted(action.getActUnitData());
    if (rawUnitData.getLoaderUnitId() != null) {
        throw Helpers_Misc.newError(`non-null loaderUnitId.`);
    }

    const playerIndex = action.getActIsInTurn() ? war.getPlayerIndexInTurn() : (rawUnitData.getPlayerIndex());
    if (playerIndex === Players_Constants.PlayerIndex.Neutral) {
        return;
    }

    const gameConfig                = war.getGcData();
    const unitMap                   = war.getUnitMap();
    const tileMap                   = war.getTileMap();
    const warStatisticsManager      = war.getWarStatisticsManager();
    const canBeBlockedByUnit        = action.getActCanBeBlockedByUnit();
    const needMovableTile           = action.getActNeedMovableTile();
    const moveType                  = Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(rawUnitData.getUnitType())?.getMoveTypeId());
    const conTileFilter             = action.getConTileFilter();
    const candidateGridIndexArray   = tileMap.getTiles(t => (conTileFilter == null) || (Tiles_Utils_Filter.checkIsMeet(conTileFilter, t))).map(v => v.getGridIndex());

    for (const gridIndex of candidateGridIndexArray) {
        const targetGridIndex = getGridIndexForAddUnit({
            origin             : gridIndex,
            tileMap            : tileMap,
            unitMap            : unitMap,
            canBeBlockedByUnit : canBeBlockedByUnit,
            needMovableTile    : needMovableTile,
            moveType           : moveType,
        });
        if (targetGridIndex == null) {
            continue;
        }

        const revisedUnitData   = rawUnitData.clone();
        const unitId            = unitMap.getNextUnitId();
        revisedUnitData.setGridIndex(targetGridIndex.toProto());
        revisedUnitData.setPlayerIndex(playerIndex);
        revisedUnitData.setUnitId(unitId);

        const unit = new Units_Unit.Unit();
        unit.init(revisedUnitData, gameConfig);
        unit.startRunning(war);
        unit.startRunningView();
        unitMap.setNextUnitId(unitId + 1);
        unitMap.setUnitOnMap(unit);
        (!isFastExecute) && (unit.updateView());

        {
            const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex });
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
function getGridIndexForAddUnit({ origin, unitMap, tileMap, moveType, needMovableTile, canBeBlockedByUnit }: {
    origin              : AuxiliaryTypes_GridIndex.GridIndex;
    unitMap             : Units_IUnitMap.IUnitMap;
    tileMap             : Tiles_ITileMap.ITileMap;
    moveType            : number;
    needMovableTile     : boolean;
    canBeBlockedByUnit  : boolean;
}): AuxiliaryTypes_GridIndex.GridIndex | null {
    const mapSize = tileMap.getMapSize();
    if ((canBeBlockedByUnit) && (unitMap.getUnitOnMap(origin))) {
        return null;
    }

    const { width, height } = mapSize.getWH();
    const maxDistance = Math.max(
        origin.getDistance(new AuxiliaryTypes_GridIndex.GridIndex(0,         0           )),
        origin.getDistance(new AuxiliaryTypes_GridIndex.GridIndex(0,         height - 1  )),
        origin.getDistance(new AuxiliaryTypes_GridIndex.GridIndex(width - 1, 0           )),
        origin.getDistance(new AuxiliaryTypes_GridIndex.GridIndex(width - 1, height - 1  )),
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
            },
        })[0];
        if (gridIndex) {
            return gridIndex;
        }
    }

    return null;
}
