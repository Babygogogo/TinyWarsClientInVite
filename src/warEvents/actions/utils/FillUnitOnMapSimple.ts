import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import * as HelpersCollection from "../../../helpers/Collection.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as HelpersTeam from "../../../helpers/Team.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapSimple from "../../../proto/schema/CommonProto/WarEvent/WeaFillUnitOnMapSimple.ts";
import * as ProtoSchemaCommonProtoWarSerializationWsUnitStatistics from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type * as TilesITileMap from "../../../tiles/ITileMap.ts";
import * as TilesUtilsFilter from "../../../tiles/utils/Filter.ts";
import type * as UnitsIUnitMap from "../../../units/IUnitMap.ts";
import * as UnitsUtilsSerialization from "../../../units/utils/Serialization.ts";
import * as VisibilitiesUtils from "../../../visibilities/Utils.ts";

type WeaFillUnitOnMapSimple = ProtoSchemaCommonProtoWarEventWeaFillUnitOnMapSimple.WeaFillUnitOnMapSimple;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaFillUnitOnMapSimple>, gameConfig: GameConfigGcData.GcData, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number): boolean {
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
        if ((conTileFilter != null) && (!TilesUtilsFilter.checkIsValid(conTileFilter, playersCountUnneutral, mapSize, gameConfig))) {
            return false;
        }
    }

    const unitData = rawUnitData.clone();
    unitData.createIfNotExistsGridIndex().loadJson({x: 0, y: 0});
    if (UnitsUtilsSerialization.getErrorCodeForUnitDataIgnoringUnitId({
        unitData                : unitData,
        gameConfig              : gameConfig,
        mapSize                 : mapSize,
        playersCountUnneutral   : playersCountUnneutral,
    })) {
        return false;
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaFillUnitOnMapSimple>, gameConfig: GameConfigGcData.GcData): string | null {
    if (!data) {
        return null;
    }

    const conTileFilter         = data.getConTileFilter();
    const textForConTileFilter  = ((conTileFilter == null) || (TilesUtilsFilter.checkIsEmpty(conTileFilter)))
        ? null
        : LangUtils.getText(LangConstants.TextType.B1068);

    const textArray = HelpersCollection.getNonNullElements([
        textForConTileFilter,
    ]);

    const actIsInTurn           = data.getActIsInTurn();
    const textForActIsInTurn    = actIsInTurn
        ? LangUtils.getText(LangConstants.TextType.A0419)
        : null;

    const unitType          = data.getActUnitData()?.getUnitType();
    const textForUnitType   = unitType == null ? `??` : (LangUtils.getUnitName(unitType, gameConfig) ?? `??`);
    if (textArray.length <= 0) {
        return LangUtils.getFormattedText(
            LangConstants.TextType.F0180,
            textForUnitType,
        ) + (textForActIsInTurn ? ` ${textForActIsInTurn}` : ``);
    } else {
        return LangUtils.getFormattedText(
            LangConstants.TextType.F0166,
            textArray.join(`${LangUtils.getText(LangConstants.TextType.B0783)}`),
            textForUnitType,
        ) + (textForActIsInTurn ? ` ${textForActIsInTurn}` : ``);
    }
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaFillUnitOnMapSimple>, gameConfig: GameConfigGcData.GcData): string | null {
    return getBriefDesc(data, gameConfig);
}

export function getErrorTip(data: WeaFillUnitOnMapSimple, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): string | null {
    {
        const conTileFilter = data.getConTileFilter();
        if ((conTileFilter != null) && (!TilesUtilsFilter.checkIsValid(conTileFilter, playersCountUnneutral, mapSize, gameConfig))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileFilter));
        }
    }

    const rawUnitData = data.getActUnitData();
    if ((rawUnitData == null) || (rawUnitData.getLoaderUnitId() != null)) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1058));
    }

    const unitData = rawUnitData.clone();
    unitData.createIfNotExistsGridIndex().loadJson({ x: 0, y: 0 });
    if (UnitsUtilsSerialization.getErrorCodeForUnitDataIgnoringUnitId({
        unitData                : unitData,
        mapSize                 : mapSize,
        playersCountUnneutral   : playersCountUnneutral,
        gameConfig              : gameConfig,
    })) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1058));
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaFillUnitOnMapSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaFillUnitOnMapSimple, isFastExecute: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const rawUnitData = HelpersMisc.getExisted(action.getActUnitData());
    if (rawUnitData.getLoaderUnitId() != null) {
        throw HelpersMisc.newError(`non-null loaderUnitId.`);
    }

    const playerIndex = action.getActIsInTurn() ? war.getPlayerIndexInTurn() : (rawUnitData.getPlayerIndex() ?? PlayersConstants.PlayerIndex.Neutral);
    if (playerIndex === PlayersConstants.PlayerIndex.Neutral) {
        return;
    }

    const gameConfig                = war.getGcData();
    const unitMap                   = war.getUnitMap();
    const tileMap                   = war.getTileMap();
    const warStatisticsManager      = war.getWarStatisticsManager();
    const canBeBlockedByUnit        = action.getActCanBeBlockedByUnit() ?? false;
    const needMovableTile           = action.getActNeedMovableTile() ?? false;
    const moveType                  = HelpersMisc.getExisted(gameConfig.getUnitTemplateCfg(HelpersMisc.getExisted(rawUnitData.getUnitType()))?.getMoveTypeId());
    const conTileFilter             = action.getConTileFilter();
    const candidateGridIndexArray   = tileMap.getTiles(t => (conTileFilter == null) || (TilesUtilsFilter.checkIsMeet(conTileFilter, t))).map(v => v.getGridIndex());

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
                    unitType                    : unit.getUnitType(),
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
