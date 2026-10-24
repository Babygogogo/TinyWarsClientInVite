import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as HelpersTeam from "../../../helpers/Team.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as PlayersIPlayer from "../../../players/IPlayer.ts";
import * as PlayersUtilsFilter from "../../../players/utils/Filter.ts";
import type * as ProtoSchemaCommonProtoStructurePlayerFilter from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type * as ProtoSchemaCommonProtoStructureTileFilter from "../../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaFillUnitLoadedSimple from "../../../proto/schema/CommonProto/WarEvent/WeaFillUnitLoadedSimple.ts";
import * as ProtoSchemaCommonProtoWarSerializationWsUnitStatistics from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as TilesUtilsFilter from "../../../tiles/utils/Filter.ts";
import type * as UnitsIUnit from "../../../units/IUnit.ts";
import * as UnitsUtilsFilter from "../../../units/utils/Filter.ts";
import * as UnitsUtilsSerialization from "../../../units/utils/Serialization.ts";
import * as VisibilitiesUtils from "../../../visibilities/Utils.ts";

type PlayerFilter               = ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter;
type TileFilter                 = ProtoSchemaCommonProtoStructureTileFilter.TileFilter;
type WeaFillUnitLoadedSimple    = ProtoSchemaCommonProtoWarEventWeaFillUnitLoadedSimple.WeaFillUnitLoadedSimple;
type IPlayer                    = PlayersIPlayer.IPlayer;
type ITile                      = TilesITile.ITile;

export function checkIsValid(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaFillUnitLoadedSimple>, gameConfig: GameConfigGcData.GcData, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaFillUnitLoadedSimple>, gameConfig: GameConfigGcData.GcData): string | null {
    if (!data) {
        return null;
    }

    const unitType = data.getActUnitData()?.getUnitType();
    return LangUtils.getFormattedText(
        LangConstants.TextType.F0247,
        data.getActLoadCount(),
        unitType == null ? LangConstants.UndefinedError : (LangUtils.getUnitName(unitType, gameConfig) ?? LangConstants.UndefinedError)
    );
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaFillUnitLoadedSimple>, gameConfig: GameConfigGcData.GcData): string | null {
    if (!data) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            subTextArray.push(`- ${UnitsUtilsFilter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            subTextArray.push(`- (${LangUtils.getText(LangConstants.TextType.B1422)}) ${PlayersUtilsFilter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            subTextArray.push(`- (${LangUtils.getText(LangConstants.TextType.B1423)}) ${TilesUtilsFilter.getDescForEmbed(filter)}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.A0944)}`);
    }

    const unitType = data.getActUnitData()?.getUnitType();
    return LangUtils.getFormattedText(
        LangConstants.TextType.F0246,
        subTextArray.join(`\n`),
        data.getActLoadCount(),
        unitType == null ? LangConstants.UndefinedError : (LangUtils.getUnitName(unitType, gameConfig) ?? LangConstants.UndefinedError)
    );
}

export function getErrorTip(data: WeaFillUnitLoadedSimple, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): string | null {
    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                                    &&
            (!PlayersUtilsFilter.checkIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.PlayerFilter));
        }
    }

    {
        const filter = data.getConUnitFilter();
        if ((filter != null)                                                                            &&
            (!UnitsUtilsFilter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitFilter));
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
        const count = data.getActLoadCount();
        if ((count == null) || (count < 1)) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1424));
        }
    }

    {
        const actUnitData = data.getActUnitData();
        if (actUnitData == null) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1058));
        }

        const unitData = actUnitData.clone();
        unitData.createIfNotExistsGridIndex().loadJson({ x: 0, y: 0 });
        unitData.setLoaderUnitId(null);

        if (UnitsUtilsSerialization.getErrorCodeForUnitDataIgnoringUnitId({
            unitData                : unitData,
            mapSize                 : mapSize,
            playersCountUnneutral   : playersCountUnneutral,
            gameConfig              : gameConfig,
        })) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1058));
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaFillUnitLoadedSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaFillUnitLoadedSimple, isFastExecute: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const unitMap           = war.getUnitMap();
    const tileMap           = war.getTileMap();
    const conUnitFilter     = data.getConUnitFilter();
    const tileFilterDict    = new Map<ITile, boolean>();
    const conPlayerFilter   = data.getConPlayerFilter();
    const playerFilterDict  = new Map<IPlayer, boolean>();
    const conTileFilter     = data.getConTileFilter();
    const loaderUnitsDict   = new Map<UnitsIUnit.IUnit, number>();
    const actLoadCount      = data.getActLoadCount() ?? 0;
    for (const unit of unitMap.getAllUnits()) {
        const remainingCount = (unit.getMaxLoadUnitsCount() ?? 0) - unit.getLoadedUnitsCount();
        if (remainingCount <= 0) {
            continue;
        }

        if ((conUnitFilter != null) && (!UnitsUtilsFilter.checkIsMeet(conUnitFilter, unit))) {
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

    const rawUnitData           = HelpersMisc.getExisted(data.getActUnitData());
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
        const observerTeamIndexes   = VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex });

        for (let i = 0; i < loadCount; ++i) {
            const revisedUnitData   = rawUnitData;
            const unitId            = unitMap.getNextUnitId();
            revisedUnitData.setGridIndex(gridIndex.toProto());
            revisedUnitData.setLoaderUnitId(loaderUnitId);
            revisedUnitData.setPlayerIndex(playerIndex);
            revisedUnitData.setUnitId(unitId);

            const unit = new (GameHelpersGhFactory.getUnitClass())();
            unit.init(revisedUnitData, gameConfig);
            unit.startRunning(war);
            unit.startRunningView();
            unitMap.setNextUnitId(unitId + 1);
            unitMap.setUnitLoaded(unit);
            (!isFastExecute) && (unit.updateView());

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
