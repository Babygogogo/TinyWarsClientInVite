import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as BaseWarInterfaceIBwWarStatisticsManager from "../../../baseWar/interface/IBwWarStatisticsManager.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as HelpersTeam from "../../../helpers/Team.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import type * as PlayersIPlayer from "../../../players/IPlayer.ts";
import * as PlayersUtilsCommon from "../../../players/utils/Common.ts";
import * as PlayersUtilsFilter from "../../../players/utils/Filter.ts";
import type * as ProtoSchemaCommonProtoStructurePlayerFilter from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type * as ProtoSchemaCommonProtoStructureTileFilter from "../../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetUnitOwnershipSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitOwnershipSimple.ts";
import * as ProtoSchemaCommonProtoWarSerializationWsUnitStatistics from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as TilesUtilsFilter from "../../../tiles/utils/Filter.ts";
import type * as UnitsIUnit from "../../../units/IUnit.ts";
import * as UnitsUtilsFilter from "../../../units/utils/Filter.ts";
import * as VisibilitiesUtils from "../../../visibilities/Utils.ts";

type PlayerFilter               = ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter;
type TileFilter                 = ProtoSchemaCommonProtoStructureTileFilter.TileFilter;
type WeaSetUnitOwnershipSimple  = ProtoSchemaCommonProtoWarEventWeaSetUnitOwnershipSimple.WeaSetUnitOwnershipSimple;
type IPlayer                    = PlayersIPlayer.IPlayer;
type IUnit                      = UnitsIUnit.IUnit;
type ITile                      = TilesITile.ITile;

export function checkIsValid(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitOwnershipSimple>, gameConfig: GameConfigGcData.GcData, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitOwnershipSimple>): string | null {
    if (!data) {
        return null;
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0250,
        `P${data.getActPlayerIndex()}`
    );
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitOwnershipSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            conTextArray.push(`- ${UnitsUtilsFilter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            conTextArray.push(`- (${LangUtils.getText(LangConstants.TextType.B1422)}) ${PlayersUtilsFilter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            conTextArray.push(`- (${LangUtils.getText(LangConstants.TextType.B1423)}) ${TilesUtilsFilter.getDescForEmbed(filter)}`);
        }
    }

    if (!conTextArray.length) {
        conTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.A0944)}`);
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0251,
        conTextArray.join(`\n`),
        `P${data.getActPlayerIndex()}`
    );
}

export function getErrorTip(data: WeaSetUnitOwnershipSimple, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): string | null {
    {
        const filter = data.getConUnitFilter();
        if ((filter != null)                                                                            &&
            (!UnitsUtilsFilter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitFilter));
        }
    }

    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                                    &&
            (!PlayersUtilsFilter.checkIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.PlayerFilter));
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

    {
        const playerIndex = data.getActPlayerIndex();
        if ((playerIndex == null)                                                           ||
            (playerIndex === PlayersConstants.PlayerIndex.Neutral)       ||
            (!PlayersUtilsCommon.checkIsValidPlayerIndex(playerIndex, playersCountUnneutral))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.PlayerIndex));
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetUnitOwnershipSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaSetUnitOwnershipSimple, isFastExecute: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const targetUnitSet     = new Set<IUnit>();
    const unitMap           = war.getUnitMap();
    const newPlayerIndex    = HelpersMisc.getExisted(data.getActPlayerIndex());
    {
        const tileMap           = war.getTileMap();
        const conUnitFilter     = data.getConUnitFilter();
        const conPlayerFilter   = data.getConPlayerFilter();
        const playerFilterDict  = new Map<IPlayer, boolean>();
        const conTileFilter     = data.getConTileFilter();
        const tileFilterDict    = new Map<ITile, boolean>();
        for (const unit of unitMap.getAllUnits()) {
            if (unit.getPlayerIndex() === newPlayerIndex) {
                continue;
            }

            if ((conUnitFilter != null) && (!UnitsUtilsFilter.checkIsMeet(conUnitFilter, unit))) {
                continue;
            }

            if ((conPlayerFilter != null) && (!checkIsMeetConPlayerFilter(playerFilterDict, conPlayerFilter, unit.getPlayer()))) {
                continue;
            }

            const gridIndex = unit.getGridIndex();
            if ((conTileFilter != null) && (!checkIsMeetConTileFilter(tileFilterDict, conTileFilter, tileMap.getTile(gridIndex)))) {
                continue;
            }

            targetUnitSet.add(HelpersMisc.getExisted(unitMap.getUnitOnMap(gridIndex)));
        }

        if (!targetUnitSet.size) {
            return;
        }
    }

    {
        const mapSize                   = unitMap.getMapSize();
        const observerTeamIndexesDict   = new Map<number, number[] | null>();
        for (const unit of targetUnitSet) {
            const gridIndex   = unit.getGridIndex();
            const gridId      = gridIndex.getGridId(mapSize);
            if (!observerTeamIndexesDict.has(gridId)) {
                observerTeamIndexesDict.set(gridId, VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex }));
            }
        }

        const warStatisticsManager  = war.getWarStatisticsManager();
        const isLoadedUnitVisible   = true;
        for (const unit of targetUnitSet) {
            const loadedUnits           = unitMap.getUnitsLoadedByLoader(unit, true);
            const observerTeamIndexes   = observerTeamIndexesDict.get(unit.getGridIndex().getGridId(mapSize));
            if (observerTeamIndexes != null) {
                const groupedObserverTeamIndexes = HelpersTeam.encodeTeamIndex(observerTeamIndexes);
                updateWarStatisticsManager(warStatisticsManager, unit, newPlayerIndex, groupedObserverTeamIndexes);

                if (isLoadedUnitVisible) {
                    for (const loadedUnit of loadedUnits) {
                        updateWarStatisticsManager(warStatisticsManager, loadedUnit, newPlayerIndex, groupedObserverTeamIndexes);
                    }
                }
            }

            unit.setPlayerIndex(newPlayerIndex);
            for (const loadedUnit of loadedUnits) {
                loadedUnit.setPlayerIndex(newPlayerIndex);
            }

            if (!isFastExecute) {
                unit.updateView();
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
function updateWarStatisticsManager(warStatisticsManager: BaseWarInterfaceIBwWarStatisticsManager.IBwWarStatisticsManager, unit: IUnit, newPlayerIndex: number, groupedObserverTeamIndexes: number): void {
    const unitType      = unit.getUnitType();
    const normalizedHp  = unit.getNormalizedCurrentHp();
    warStatisticsManager.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
        unitType                    : unitType,
        dstPlayerIndex              : unit.getPlayerIndex(),
        normalizedHpGain            : 0,
        normalizedHpLoss            : normalizedHp,
        unitGain                    : 0,
        unitLoss                    : 1,
        groupedObserverTeamIndexes  : groupedObserverTeamIndexes
    }));
    warStatisticsManager.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
        unitType                    : unitType,
        dstPlayerIndex              : newPlayerIndex,
        normalizedHpGain            : normalizedHp,
        normalizedHpLoss            : 0,
        unitGain                    : 1,
        unitLoss                    : 0,
        groupedObserverTeamIndexes  : groupedObserverTeamIndexes
    }));
}
