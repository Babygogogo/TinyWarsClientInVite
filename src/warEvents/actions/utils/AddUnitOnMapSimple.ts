import {
    AuxiliaryTypes_GridIndex,
    Units_Unit,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
    Players_Constants,
    WarEvents_Actions_Constants_AddUnitOnMapSimple,
    Helpers_Team,
    Units_Utils_Serialization,
    Helpers_Misc,
    Lang_Utils,
    Visibilities_Utils,
    Lang_Constants,
    type Tiles_TileMap,
    type Units_UnitMap,
} from "../../../internal.ts";

import type { WeaAddUnitOnMapSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaAddUnitOnMapSimple.ts";
import type { DataForAddUnit } from "../../../proto/schema/CommonProto/WarEvent/WeaAddUnitOnMapSimple/DataForAddUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaAddUnitOnMapSimple>, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    if (!data) {
        return null;
    } else {
        const unitCountDict = new Map<number, number>();
        for (const unitData of data.getUnitArray()) {
            const unitType = Helpers_Misc.getExisted(unitData.getUnitData()).getUnitType();
            unitCountDict.set(unitType, (unitCountDict.get(unitType) || 0) + 1);
        }

        const unitNameArray: string[] = [];
        for (const [unitType, count] of unitCountDict) {
            unitNameArray.push(`${Lang_Utils.getUnitName(unitType, gameConfig)} * ${count}`);
        }
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0059, unitNameArray.join(", "));
    }
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaAddUnitOnMapSimple>, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    return getBriefDesc(data, gameConfig);
}

export function checkIsValid({ action, gameConfig, mapSize, playersCountUnneutral }: {
    action                  : AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaAddUnitOnMapSimple>;
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    mapSize                 : AuxiliaryTypes_MapSize.MapSize;
    playersCountUnneutral   : number;
}): boolean {
    if (action == null) {
        return false;
    }

    const unitArray = action.getUnitArray();
    if ((unitArray == null)                                              ||
        (unitArray.length <= 0)                                          ||
        (unitArray.length > WarEvents_Actions_Constants_AddUnitOnMapSimple.Common.MaxCount)
    ) {
        return false;
    }

    for (const data of unitArray) {
        const needMovableTile       = data.getNeedMovableTile();
        const canBeBlockedByUnit    = data.getCanBeBlockedByUnit();
        const unitData              = data.getUnitData();
        if ((needMovableTile == null) || (canBeBlockedByUnit == null) || (unitData == null)) {
            return false;
        }

        if (unitData.getLoaderUnitId() != null) {
            return false;
        }

        if (Units_Utils_Serialization.getErrorCodeForUnitDataIgnoringUnitId({
            unitData,
            playersCountUnneutral,
            gameConfig,
            mapSize,
        })) {
            return false;
        }
    }

    return true;
}

export function getErrorTip(data: WeaAddUnitOnMapSimple, war: BaseWar_Interface_IBwWar.IBwWar): string | null {
    const unitArray     = data.getUnitArray();
    const unitsCount    = unitArray.length;
    if ((unitsCount <= 0) || (unitsCount > WarEvents_Actions_Constants_AddUnitOnMapSimple.Common.MaxCount)) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.A0191)} (${unitsCount} / ${WarEvents_Actions_Constants_AddUnitOnMapSimple.Common.MaxCount})`;
    }

    const mapSize               = war.getTileMap().getMapSize();
    const playersCountUnneutral = war.getPlayersCountUnneutral();
    const validator             = (v: DataForAddUnit) => {
        const unitData = Helpers_Misc.getExisted(v.getUnitData());
        return (v.getCanBeBlockedByUnit() != null)
            && (v.getNeedMovableTile() != null)
            && (unitData.getLoaderUnitId() == null)
            && (!Units_Utils_Serialization.getErrorCodeForUnitDataIgnoringUnitId({
                unitData,
                mapSize,
                playersCountUnneutral,
                gameConfig : war.getGcData(),
            }));
    };
    if (!unitArray.every(validator)) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0169);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(action: WeaAddUnitOnMapSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaAddUnitOnMapSimple, isFastExecute: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const unitArray = action.getUnitArray();
    if ((unitArray == null) || (!unitArray.length)) {
        throw Helpers_Misc.newError(`Empty unitArray.`);
    }

    const unitMap               = war.getUnitMap();
    const tileMap               = war.getTileMap();
    const playerManager         = war.getPlayerManager();
    const gameConfig            = war.getGcData();
    const warStatisticsManager  = war.getWarStatisticsManager();
    const mapSize               = unitMap.getMapSize();
    for (const data of unitArray) {
        const unitData = Helpers_Misc.getExisted(data.getUnitData());
        if (unitData.getLoaderUnitId() != null) {
            throw Helpers_Misc.newError(`unitData.loaderUnitId != null: ${unitData.getLoaderUnitId()}`);
        }

        const canBeBlockedByUnit    = Helpers_Misc.getExisted(data.getCanBeBlockedByUnit());
        const needMovableTile       = Helpers_Misc.getExisted(data.getNeedMovableTile());
        const unitId                = unitMap.getNextUnitId();
        const unitType              = unitData.getUnitType();
        const moveType              = Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getMoveTypeId());
        const rawGridIndex          = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(unitData.getGridIndex()));
        if (Units_Utils_Serialization.getErrorCodeForUnitDataIgnoringUnitId({
            unitData,
            mapSize,
            gameConfig,
            playersCountUnneutral : Players_Constants.PlayerIndex.Max,
        })) {
            throw Helpers_Misc.newError(`Invalid unitData: ${JSON.stringify(unitData)}`);
        }

        const playerIndex   = unitData.getPlayerIndex();
        const player        = playerManager.getPlayer(playerIndex);
        if (player == null) {
            continue;
        }
        if (player.getAliveState() === Players_Constants.AliveStateId.Dead) {
            continue;
        }

        const gridIndex = getGridIndexForAddUnit({
            origin : rawGridIndex,
            tileMap,
            unitMap,
            canBeBlockedByUnit,
            needMovableTile,
            moveType,
        });
        if (gridIndex == null) {
            continue;
        }

        const revisedUnitData = unitData.clone();
        revisedUnitData.setGridIndex(gridIndex.toProto());
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
                    unitType                   : unitType,
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
    unitMap             : Units_UnitMap.UnitMap;
    tileMap             : Tiles_TileMap.TileMap;
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
