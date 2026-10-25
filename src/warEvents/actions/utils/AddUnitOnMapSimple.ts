import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GcData } from "../../../gameConfig/GcData.ts";
import { getUnitClass } from "../../../gameHelpers/GhFactory.ts";
import { getExisted, newError } from "../../../helpers/Misc.ts";
import { encodeTeamIndex } from "../../../helpers/Team.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getUnitName, getFormattedText, getText } from "../../../lang/Utils.ts";
import { PlayerIndex, AliveStateId } from "../../../players/Constants.ts";
import type {
    WeaAddUnitOnMapSimple as ProtoSchemaCommonProtoWarEventWeaAddUnitOnMapSimple,
} from "../../../proto/schema/CommonProto/WarEvent/WeaAddUnitOnMapSimple.ts";
import type { DataForAddUnit } from "../../../proto/schema/CommonProto/WarEvent/WeaAddUnitOnMapSimple/DataForAddUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type { ITileMap } from "../../../tiles/ITileMap.ts";
import type { IUnitMap } from "../../../units/IUnitMap.ts";
import { getErrorCodeForUnitDataIgnoringUnitId } from "../../../units/utils/Serialization.ts";
import { getObserverTeamIndexListForUnitOnMap } from "../../../visibilities/Utils.ts";
import { Common } from "../constants/AddUnitOnMapSimple.ts";

type WeaAddUnitOnMapSimple  = ProtoSchemaCommonProtoWarEventWeaAddUnitOnMapSimple;

export function getBriefDesc(data: Undefinable<WeaAddUnitOnMapSimple>, gameConfig: GcData): string | null {
    if (!data) {
        return null;
    } else {
        const unitCountDict = new Map<number, number>();
        for (const unitData of data.getUnitArray()) {
            const unitType = getExisted(unitData.getUnitData()).getUnitType();
            unitCountDict.set(unitType, (unitCountDict.get(unitType) || 0) + 1);
        }

        const unitNameArray: string[] = [];
        for (const [unitType, count] of unitCountDict) {
            unitNameArray.push(`${getUnitName(unitType, gameConfig)} * ${count}`);
        }
        return getFormattedText(TextType.F0059, unitNameArray.join(", "));
    }
}
export function getDetailDesc(data: Undefinable<WeaAddUnitOnMapSimple>, gameConfig: GcData): string | null {
    return getBriefDesc(data, gameConfig);
}

export function checkIsValid({ action, gameConfig, mapSize, playersCountUnneutral }: {
    action                  : Undefinable<WeaAddUnitOnMapSimple>;
    gameConfig              : GcData;
    mapSize                 : MapSize;
    playersCountUnneutral   : number;
}): boolean {
    if (action == null) {
        return false;
    }

    const unitArray = action.getUnitArray();
    if ((unitArray == null)                                              ||
        (unitArray.length <= 0)                                          ||
        (unitArray.length > Common.MaxCount)
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

        if (getErrorCodeForUnitDataIgnoringUnitId({
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

export function getErrorTip(data: WeaAddUnitOnMapSimple, war: IBwWar): string | null {
    const unitArray     = data.getUnitArray();
    const unitsCount    = unitArray.length;
    if ((unitsCount <= 0) || (unitsCount > Common.MaxCount)) {
        return `${getText(TextType.A0191)} (${unitsCount} / ${Common.MaxCount})`;
    }

    const mapSize               = war.getTileMap().getMapSize();
    const playersCountUnneutral = war.getPlayersCountUnneutral();
    const validator             = (v: DataForAddUnit) => {
        const unitData = getExisted(v.getUnitData());
        return (v.getCanBeBlockedByUnit() != null)
            && (v.getNeedMovableTile() != null)
            && (unitData.getLoaderUnitId() == null)
            && (!getErrorCodeForUnitDataIgnoringUnitId({
                unitData,
                mapSize,
                playersCountUnneutral,
                gameConfig: war.getGcData(),
            }));
    };
    if (!unitArray.every(validator)) {
        return getText(TextType.A0169);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(action: WeaAddUnitOnMapSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaAddUnitOnMapSimple, isFastExecute: boolean, war: IBwWar): Promise<void> {
    const unitArray = action.getUnitArray();
    if ((unitArray == null) || (!unitArray.length)) {
        throw newError(`Empty unitArray.`);
    }

    const unitMap               = war.getUnitMap();
    const tileMap               = war.getTileMap();
    const playerManager         = war.getPlayerManager();
    const gameConfig            = war.getGcData();
    const warStatisticsManager  = war.getWarStatisticsManager();
    const mapSize               = unitMap.getMapSize();
    for (const data of unitArray) {
        const unitData = getExisted(data.getUnitData());
        if (unitData.getLoaderUnitId() != null) {
            throw newError(`unitData.loaderUnitId != null: ${unitData.getLoaderUnitId()}`);
        }

        const canBeBlockedByUnit    = getExisted(data.getCanBeBlockedByUnit());
        const needMovableTile       = getExisted(data.getNeedMovableTile());
        const unitId                = unitMap.getNextUnitId();
        const unitType              = unitData.getUnitType();
        const moveType              = getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getMoveTypeId());
        const rawGridIndex          = getExisted(GridIndex.convertGridIndex(unitData.getGridIndex()));
        if (getErrorCodeForUnitDataIgnoringUnitId({
            unitData,
            mapSize,
            gameConfig,
            playersCountUnneutral   : PlayerIndex.Max,
        })) {
            throw newError(`Invalid unitData: ${JSON.stringify(unitData)}`);
        }

        const playerIndex   = unitData.getPlayerIndex();
        const player        = playerManager.getPlayer(playerIndex);
        if (player == null) {
            continue;
        }
        if (player.getAliveState() === AliveStateId.Dead) {
            continue;
        }

        const gridIndex = getGridIndexForAddUnit({
            origin  : rawGridIndex,
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
                    unitType                    : unitType,
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
