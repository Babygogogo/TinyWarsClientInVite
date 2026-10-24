import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as HelpersTeam from "../../../helpers/Team.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as PlayersIPlayer from "../../../players/IPlayer.ts";
import * as PlayersUtilsFilter from "../../../players/utils/Filter.ts";
import type * as ProtoSchemaCommonProtoStructurePlayerFilter from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type * as ProtoSchemaCommonProtoStructureTileFilter from "../../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetUnitTypeSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitTypeSimple.ts";
import * as ProtoSchemaCommonProtoWarSerializationWsUnitStatistics from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as TilesUtilsFilter from "../../../tiles/utils/Filter.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import type * as UnitsIUnit from "../../../units/IUnit.ts";
import * as UnitsUtilsCommon from "../../../units/utils/Common.ts";
import * as UnitsUtilsFilter from "../../../units/utils/Filter.ts";
import * as UnitsUtilsSerialization from "../../../units/utils/Serialization.ts";
import * as VisibilitiesUtils from "../../../visibilities/Utils.ts";

type PlayerFilter           = ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter;
type TileFilter             = ProtoSchemaCommonProtoStructureTileFilter.TileFilter;
type WeaSetUnitTypeSimple   = ProtoSchemaCommonProtoWarEventWeaSetUnitTypeSimple.WeaSetUnitTypeSimple;
type IPlayer                = PlayersIPlayer.IPlayer;
type IUnit                  = UnitsIUnit.IUnit;
type ITile                  = TilesITile.ITile;

export function checkIsValid(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitTypeSimple>, gameConfig: GameConfigGcData.GcData, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitTypeSimple>, gameConfig: GameConfigGcData.GcData): string | null {
    if (!data) {
        return null;
    }

    const unitType = data.getActUnitType();
    return LangUtils.getFormattedText(
        LangConstants.TextType.F0252,
        unitType == null ? LangConstants.UndefinedError : LangUtils.getUnitName(unitType, gameConfig)
    );
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitTypeSimple>, gameConfig: GameConfigGcData.GcData): string | null {
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

    const unitType = data.getActUnitType();
    return LangUtils.getFormattedText(
        LangConstants.TextType.F0253,
        conTextArray.join(`\n`),
        unitType == null ? LangConstants.UndefinedError : LangUtils.getUnitName(unitType, gameConfig)
    );
}

export function getErrorTip(data: WeaSetUnitTypeSimple, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): string | null {
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
        const unitType = data.getActUnitType();
        if ((unitType == null)                              ||
            (!gameConfig.checkIsValidUnitType(unitType))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0525));
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetUnitTypeSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaSetUnitTypeSimple, isFastExecute: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const targetUnitArray       : IUnit[] = [];
    const unitMap               = war.getUnitMap();
    const newUnitType           = HelpersMisc.getExisted(data.getActUnitType());
    {
        const tileMap               = war.getTileMap();
        const conUnitFilter         = data.getConUnitFilter();
        const conPlayerFilter       = data.getConPlayerFilter();
        const playerFilterDict      = new Map<IPlayer, boolean>();
        const conTileFilter         = data.getConTileFilter();
        const tileFilterDict        = new Map<ITile, boolean>();
        const unitInfoArray         : { unit: IUnit, depth: number }[] = [];

        for (const unit of unitMap.getAllUnits()) {
            if (unit.getUnitType() === newUnitType) {
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

            unitInfoArray.push({ unit, depth: getLoadDepth(unit) });
        }

        if (!unitInfoArray.length) {
            return;
        }

        unitInfoArray.sort((v1, v2) => (v2.depth - v1.depth));
        for (const info of unitInfoArray) {
            targetUnitArray.push(info.unit);
        }
    }

    {
        const mapSize                   = unitMap.getMapSize();
        const observerTeamIndexesDict   = new Map<number, number[] | null>();
        for (const unit of targetUnitArray) {
            const gridIndex   = unit.getGridIndex();
            const gridId      = gridIndex.getGridId(mapSize);
            if (!observerTeamIndexesDict.has(gridId)) {
                observerTeamIndexesDict.set(gridId, VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex }));
            }
        }

        const warStatisticsManager  = war.getWarStatisticsManager();
        const gameConfig            = war.getGcData();
        const newUnitTemplateCfg    = HelpersMisc.getExisted(gameConfig.getUnitTemplateCfg(newUnitType));
        const newMaxLoadCount       = newUnitTemplateCfg.getMaxLoadUnitsCount() ?? 0;
        const newLoadUnitCategoryId = newUnitTemplateCfg.getLoadUnitCategoryId();
        for (const unit of targetUnitArray) {
            {
                const loaderUnit = unit.getLoaderUnit();
                if (loaderUnit != null) {
                    const category = loaderUnit.getLoadUnitCategoryId();
                    if ((category == null) || (!gameConfig.checkIsUnitTypeInCategory(newUnitType, category))) {
                        continue;
                    }
                }
            }

            {
                const loadedUnits = unit.getLoadedUnits();
                if (loadedUnits.length) {
                    if ((loadedUnits.length > newMaxLoadCount)                                                              ||
                        (newLoadUnitCategoryId == null)                                                                       ||
                        (loadedUnits.some(v => !gameConfig.checkIsUnitTypeInCategory(v.getUnitType(), newLoadUnitCategoryId)))
                    ) {
                        continue;
                    }
                }
            }

            const newUnitData = UnitsUtilsSerialization.createNewUnitDataForChangeType(unit, newUnitType);
            {
                const observerTeamIndexes = observerTeamIndexesDict.get(unit.getGridIndex().getGridId(mapSize));
                if (observerTeamIndexes != null) {
                    const groupedObserverTeamIndexes = HelpersTeam.encodeTeamIndex(observerTeamIndexes);
                    warStatisticsManager.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                        unitType                    : unit.getUnitType(),
                        dstPlayerIndex              : unit.getPlayerIndex(),
                        normalizedHpGain            : 0,
                        normalizedHpLoss            : unit.getNormalizedCurrentHp(),
                        unitGain                    : 0,
                        unitLoss                    : 1,
                        groupedObserverTeamIndexes  : groupedObserverTeamIndexes,
                    }));

                    warStatisticsManager.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                        unitType                    : newUnitType,
                        dstPlayerIndex              : newUnitData.getPlayerIndex() ?? 0,
                        normalizedHpGain            : UnitsUtilsCommon.getNormalizedHp(newUnitData.getCurrentHp() ?? UnitsConstants.Hp.MaxHp),
                        normalizedHpLoss            : 0,
                        unitGain                    : 1,
                        unitLoss                    : 0,
                        groupedObserverTeamIndexes  : groupedObserverTeamIndexes
                    }));
                }
            }

            unit.init(newUnitData, gameConfig);
            unit.startRunning(war);

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
function getLoadDepth(unit: IUnit): number {
    let depth       = 0;
    let loaderUnit  = unit.getLoaderUnit();
    while (loaderUnit != null) {
        ++depth;
        loaderUnit = loaderUnit.getLoaderUnit();
    }
    return depth;
}
