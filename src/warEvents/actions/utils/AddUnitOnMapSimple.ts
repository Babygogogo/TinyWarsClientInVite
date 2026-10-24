import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as HelpersTeam from "../../../helpers/Team.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaAddUnitOnMapSimple from "../../../proto/schema/CommonProto/WarEvent/WeaAddUnitOnMapSimple.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaAddUnitOnMapSimpleDataForAddUnit from "../../../proto/schema/CommonProto/WarEvent/WeaAddUnitOnMapSimple/DataForAddUnit.ts";
import * as ProtoSchemaCommonProtoWarSerializationWsUnitStatistics from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type * as TilesITileMap from "../../../tiles/ITileMap.ts";
import type * as UnitsIUnitMap from "../../../units/IUnitMap.ts";
import * as UnitsUtilsSerialization from "../../../units/utils/Serialization.ts";
import * as VisibilitiesUtils from "../../../visibilities/Utils.ts";
import * as WarEventsActionsConstantsAddUnitOnMapSimple from "../constants/AddUnitOnMapSimple.ts";

type WeaAddUnitOnMapSimple  = ProtoSchemaCommonProtoWarEventWeaAddUnitOnMapSimple.WeaAddUnitOnMapSimple;

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaAddUnitOnMapSimple>, gameConfig: GameConfigGcData.GcData): string | null {
    if (!data) {
        return null;
    } else {
        const unitCountDict = new Map<number, number>();
        for (const unitData of data.getUnitArray()) {
            const unitType = HelpersMisc.getExisted(unitData.getUnitData()).getUnitType();
            unitCountDict.set(unitType, (unitCountDict.get(unitType) || 0) + 1);
        }

        const unitNameArray: string[] = [];
        for (const [unitType, count] of unitCountDict) {
            unitNameArray.push(`${LangUtils.getUnitName(unitType, gameConfig)} * ${count}`);
        }
        return LangUtils.getFormattedText(LangConstants.TextType.F0059, unitNameArray.join(", "));
    }
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaAddUnitOnMapSimple>, gameConfig: GameConfigGcData.GcData): string | null {
    return getBriefDesc(data, gameConfig);
}

export function checkIsValid({ action, gameConfig, mapSize, playersCountUnneutral }: {
    action                  : AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaAddUnitOnMapSimple>;
    gameConfig              : GameConfigGcData.GcData;
    mapSize                 : AuxiliaryTypesMapSize.MapSize;
    playersCountUnneutral   : number;
}): boolean {
    if (action == null) {
        return false;
    }

    const unitArray = action.getUnitArray();
    if ((unitArray == null)                                              ||
        (unitArray.length <= 0)                                          ||
        (unitArray.length > WarEventsActionsConstantsAddUnitOnMapSimple.Common.MaxCount)
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

        if (UnitsUtilsSerialization.getErrorCodeForUnitDataIgnoringUnitId({
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

export function getErrorTip(data: WeaAddUnitOnMapSimple, war: BaseWarInterfaceIBwWar.IBwWar): string | null {
    const unitArray     = data.getUnitArray();
    const unitsCount    = unitArray.length;
    if ((unitsCount <= 0) || (unitsCount > WarEventsActionsConstantsAddUnitOnMapSimple.Common.MaxCount)) {
        return `${LangUtils.getText(LangConstants.TextType.A0191)} (${unitsCount} / ${WarEventsActionsConstantsAddUnitOnMapSimple.Common.MaxCount})`;
    }

    const mapSize               = war.getTileMap().getMapSize();
    const playersCountUnneutral = war.getPlayersCountUnneutral();
    const validator             = (v: ProtoSchemaCommonProtoWarEventWeaAddUnitOnMapSimpleDataForAddUnit.DataForAddUnit) => {
        const unitData = HelpersMisc.getExisted(v.getUnitData());
        return (v.getCanBeBlockedByUnit() != null)
            && (v.getNeedMovableTile() != null)
            && (unitData.getLoaderUnitId() == null)
            && (!UnitsUtilsSerialization.getErrorCodeForUnitDataIgnoringUnitId({
                unitData,
                mapSize,
                playersCountUnneutral,
                gameConfig: war.getGcData(),
            }));
    };
    if (!unitArray.every(validator)) {
        return LangUtils.getText(LangConstants.TextType.A0169);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(action: WeaAddUnitOnMapSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaAddUnitOnMapSimple, isFastExecute: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const unitArray = action.getUnitArray();
    if ((unitArray == null) || (!unitArray.length)) {
        throw HelpersMisc.newError(`Empty unitArray.`);
    }

    const unitMap               = war.getUnitMap();
    const tileMap               = war.getTileMap();
    const playerManager         = war.getPlayerManager();
    const gameConfig            = war.getGcData();
    const warStatisticsManager  = war.getWarStatisticsManager();
    const mapSize               = unitMap.getMapSize();
    for (const data of unitArray) {
        const unitData = HelpersMisc.getExisted(data.getUnitData());
        if (unitData.getLoaderUnitId() != null) {
            throw HelpersMisc.newError(`unitData.loaderUnitId != null: ${unitData.getLoaderUnitId()}`);
        }

        const canBeBlockedByUnit    = HelpersMisc.getExisted(data.getCanBeBlockedByUnit());
        const needMovableTile       = HelpersMisc.getExisted(data.getNeedMovableTile());
        const unitId                = unitMap.getNextUnitId();
        const unitType              = unitData.getUnitType();
        const moveType              = HelpersMisc.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getMoveTypeId());
        const rawGridIndex          = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(unitData.getGridIndex()));
        if (UnitsUtilsSerialization.getErrorCodeForUnitDataIgnoringUnitId({
            unitData,
            mapSize,
            gameConfig,
            playersCountUnneutral   : PlayersConstants.PlayerIndex.Max,
        })) {
            throw HelpersMisc.newError(`Invalid unitData: ${JSON.stringify(unitData)}`);
        }

        const playerIndex   = unitData.getPlayerIndex();
        const player        = playerManager.getPlayer(playerIndex);
        if (player == null) {
            continue;
        }
        if (player.getAliveState() === PlayersConstants.AliveStateId.Dead) {
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

        const unit = new (GameHelpersGhFactory.getUnitClass())();
        unit.init(revisedUnitData, gameConfig);
        unit.startRunning(war);
        unit.startRunningView();
        unitMap.setNextUnitId(unitId + 1);
        unitMap.setUnitOnMap(unit);
        (!isFastExecute) && (unit.updateView());

        {
            const observerTeamIndexes = VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex });
            if (observerTeamIndexes != null) {
                warStatisticsManager.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                    unitType                    : unitType,
                    dstPlayerIndex              : playerIndex,
                    unitGain                    : 1,
                    unitLoss                    : 0,
                    normalizedHpGain            : unit.getNormalizedCurrentHp(),
                    normalizedHpLoss            : 0,
                    groupedObserverTeamIndexes  : HelpersTeam.encodeTeamIndex(observerTeamIndexes),
                }));
            }
        }
    }
}
function getGridIndexForAddUnit({ origin, unitMap, tileMap, moveType, needMovableTile, canBeBlockedByUnit }: {
    origin              : AuxiliaryTypesGridIndex.GridIndex;
    unitMap             : UnitsIUnitMap.IUnitMap;
    tileMap             : TilesITileMap.ITileMap;
    moveType            : number;
    needMovableTile     : boolean;
    canBeBlockedByUnit  : boolean;
}): AuxiliaryTypesGridIndex.GridIndex | null {
    const mapSize = tileMap.getMapSize();
    if ((canBeBlockedByUnit) && (unitMap.getUnitOnMap(origin))) {
        return null;
    }

    const { width, height } = mapSize.getWH();
    const maxDistance = Math.max(
        origin.getDistance(new AuxiliaryTypesGridIndex.GridIndex(0,         0           )),
        origin.getDistance(new AuxiliaryTypesGridIndex.GridIndex(0,         height - 1  )),
        origin.getDistance(new AuxiliaryTypesGridIndex.GridIndex(width - 1, 0           )),
        origin.getDistance(new AuxiliaryTypesGridIndex.GridIndex(width - 1, height - 1  )),
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
