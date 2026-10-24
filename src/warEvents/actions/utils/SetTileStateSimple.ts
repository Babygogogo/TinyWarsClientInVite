import * as ArrayModifiersUtils from "../../../arrayModifiers/Utils.ts";
import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as LocationsConstants from "../../../locations/Constants.ts";
import * as LocationsUtils from "../../../locations/Utils.ts";
import * as MultiplierAndOffsetsUtils from "../../../multiplierAndOffsets/Utils.ts";
import type * as PlayersIPlayer from "../../../players/IPlayer.ts";
import * as PlayersUtilsFilter from "../../../players/utils/Filter.ts";
import type * as ProtoSchemaCommonProtoStructurePlayerFilter from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetTileStateSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetTileStateSimple.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as TilesUtilsCommon from "../../../tiles/utils/Common.ts";
import * as TilesUtilsFilter from "../../../tiles/utils/Filter.ts";
import * as TilesUtilsSerialization from "../../../tiles/utils/Serialization.ts";
import * as UnitsUtilsFilter from "../../../units/utils/Filter.ts";
import * as ValueAndComparatorsUtils from "../../../valueAndComparators/Utils.ts";

type PlayerFilter                       = ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter;
type WeaSetTileStateSimple              = ProtoSchemaCommonProtoWarEventWeaSetTileStateSimple.WeaSetTileStateSimple;
type Undefinable<T>                     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;
type IPlayer                            = PlayersIPlayer.IPlayer;
type ITile                              = TilesITile.ITile;

export function checkIsValid(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetTileStateSimple>, gameConfig: GameConfigGcData.GcData, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetTileStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const actTextArray: string[] = [];
    {
        const act = data.getActPlayerIndex();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.PlayerIndex));
        }
    }
    {
        const act = data.getActCurrentHp();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.Hp));
        }
    }
    {
        const act = data.getActCurrentBuildPoint();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.BuildPoint));
        }
    }
    {
        const act = data.getActCurrentCapturePoint();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.CapturePoint));
        }
    }
    {
        const act = data.getActIsHighlighted();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.IsHighlighted));
        }
    }
    {
        const act = data.getActLocationIdArray();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.Location));
        }
    }
    {
        const act = data.getActCustomNameId();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.CustomNameId));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(LangUtils.getText(LangConstants.TextType.A0957));
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0254,
        LangUtils.getText(LangConstants.TextType.Tiles),
        actTextArray.join(`, `),
    );
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetTileStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            conTextArray.push(`- ${TilesUtilsFilter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            conTextArray.push(`- (${LangUtils.getText(LangConstants.TextType.B1421)}) ${PlayersUtilsFilter.getDescForEmbed(filter)}`);
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if (comparator != null) {
            conTextArray.push(`- ${ValueAndComparatorsUtils.getDesc(
                comparator,
                LangUtils.getText(data.getConUnitFilter() == null ? LangConstants.TextType.B1418 : LangConstants.TextType.B1419)
            )}`);
        }
    }

    if (!conTextArray.length) {
        conTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.A0944)}`);
    }

    const actTextArray: string[] = [];
    {
        const act = data.getActPlayerIndex();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.PlayerIndex));
        }
    }
    {
        const act = data.getActCurrentHp();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.Hp));
        }
    }
    {
        const act = data.getActCurrentBuildPoint();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.BuildPoint));
        }
    }
    {
        const act = data.getActCurrentCapturePoint();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.CapturePoint));
        }
    }
    {
        const act = data.getActIsHighlighted();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.IsHighlighted));
        }
    }
    {
        const act = data.getActLocationIdArray();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.Location));
        }
    }
    {
        const act = data.getActCustomNameId();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.CustomNameId));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(LangUtils.getText(LangConstants.TextType.A0957));
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0255,
        LangUtils.getText(LangConstants.TextType.Tiles),
        conTextArray.join(`\n`),
        LangUtils.getText(LangConstants.TextType.Tiles),
        actTextArray.join(`, `),
    );
}

export function getErrorTip(data: WeaSetTileStateSimple, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): string | null {
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            if (!UnitsUtilsFilter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitFilter));
            }
            if (data.getConUnitComparator() == null) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Comparator));
            }
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
        const comparator = data.getConUnitComparator();
        if ((comparator != null)                            &&
            (!ValueAndComparatorsUtils.checkIsValid(comparator))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Comparator));
        }
    }

    {
        const act = data.getActPlayerIndex();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.PlayerIndex));
        }
    }
    {
        const act = data.getActCurrentHp();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Hp));
        }
    }
    {
        const act = data.getActCurrentBuildPoint();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.BuildPoint));
        }
    }
    {
        const act = data.getActCurrentCapturePoint();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.CapturePoint));
        }
    }
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActIsHighlighted();
    }
    {
        const act = data.getActLocationIdArray();
        if ((act != null)                                                                                           &&
            (!ArrayModifiersUtils.checkIsValid(act, LocationsConstants.AllLocationIdSet))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.FlareAmmo));
        }
    }
    {
        const act = data.getActCustomNameId();
        if ((act != null)                                           &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.CustomNameId));
        }
    }

    if ((data.getActPlayerIndex() == null)           &&
        (data.getActCurrentHp() == null)             &&
        (data.getActCurrentBuildPoint() == null)     &&
        (data.getActCurrentCapturePoint() == null)   &&
        (data.getActIsHighlighted() == null)         &&
        (data.getActLocationIdArray() == null)       &&
        (data.getActCustomNameId() == null)
    ) {
        return LangUtils.getText(LangConstants.TextType.A0957);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetTileStateSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaSetTileStateSimple, isFastExecute: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const targetTileArray: ITile[] = [];
    {
        const unitMap           = war.getUnitMap();
        const conTileFilter     = data.getConTileFilter();
        const conPlayerFilter   = data.getConPlayerFilter();
        const conUnitFilter     = data.getConUnitFilter();
        const conUnitComparator = data.getConUnitComparator();
        const playerFilterDict  = new Map<IPlayer, boolean>();
        for (const tile of war.getTileMap().getAllTiles()) {
            if ((conTileFilter != null) && (!TilesUtilsFilter.checkIsMeet(conTileFilter, tile))) {
                continue;
            }

            if ((conPlayerFilter != null) && (!checkIsMeetConPlayerFilter(playerFilterDict, conPlayerFilter, tile.getPlayer()))) {
                continue;
            }

            if (conUnitComparator != null) {
                let count = 0;
                for (const unit of unitMap.getAllUnitsOnGrid(tile.getGridIndex())) {
                    if ((conUnitFilter == null) || (UnitsUtilsFilter.checkIsMeet(conUnitFilter, unit))) {
                        ++count;
                    }
                }
                if (!ValueAndComparatorsUtils.checkIsMeet(conUnitComparator, count)) {
                    continue;
                }
            }

            targetTileArray.push(tile);
        }

        if (!targetTileArray.length) {
            return;
        }
    }

    {
        for (const tile of targetTileArray) {
            const tileData = TilesUtilsSerialization.create({
                baseType                : tile.getBaseType(),
                baseShapeId             : tile.getBaseShapeId(),
                objectType              : tile.getObjectType(),
                objectShapeId           : tile.getObjectShapeId(),
                decorationType          : tile.getDecorationType(),
                decorationShapeId       : tile.getDecorationShapeId(),
                gridIndex               : tile.getGridIndex().toProto().toJson(),
                unfixedBuffArray        : tile.getUnfixedBuffList().map(v => v.toJson()),

                customBuildingData      : tile.getCustomBuildingData()?.toJson() ?? null,
                customCannonData        : tile.getCustomCannonData()?.toJson() ?? null,
                customCrystalData       : tile.getCustomCrystalData()?.toJson() ?? null,
                customLaserTurretData   : tile.getCustomLaserTurretData()?.toJson() ?? null,

                playerIndex             : evalActPlayerIndex(data, tile),
                currentHp               : evalActCurrentHp(data, tile),
                currentBuildPoint       : evalActCurrentBuildPoint(data, tile),
                currentCapturePoint     : evalActCurrentCapturePoint(data, tile),
                isHighlighted           : evalActIsHighlighted(data, tile),
                groupedLocationIdArray  : evalActLocationIdArray(data, tile),
                customNameId            : evalActCustomNameId(data, tile) ?? null,
            });

            tile.init(tileData, tile.getGameConfig());
            tile.startRunning(war);

            // tile.startRunningView();
            if (!isFastExecute) {
                tile.flushDataToView();
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
function evalActPlayerIndex(action: WeaSetTileStateSimple, tile: ITile): number {
    const defaultValue  = tile.getPlayerIndex();
    const act           = action.getActPlayerIndex();
    if (!act) {
        return defaultValue;
    }

    const newValue = MultiplierAndOffsetsUtils.getResultValue(act, defaultValue);
    if ((tile.getWar().getPlayerManager().checkHasPlayer(newValue)) && (tile.getGameConfig().checkIsValidPlayerIndexForTileObject({ playerIndex: newValue, tileObjectType: tile.getObjectType() }))) {
        return newValue;
    } else {
        return defaultValue;
    }
}
function evalActCurrentHp(action: WeaSetTileStateSimple, tile: ITile): number {
    const defaultValue  = tile.getCurrentHp();
    const act           = action.getActCurrentHp();
    if (!act) {
        return defaultValue;
    }

    const newValue  = MultiplierAndOffsetsUtils.getResultValue(act, defaultValue);
    return (newValue > (tile.getMaxHp() ?? 0))
        ? defaultValue
        : (newValue < 0 ? 0 : newValue);
}
function evalActCurrentBuildPoint(action: WeaSetTileStateSimple, tile: ITile): number {
    const defaultValue  = tile.getCurrentBuildPoint();
    const act           = action.getActCurrentBuildPoint();
    if (!act) {
        return defaultValue;
    }

    const newValue  = MultiplierAndOffsetsUtils.getResultValue(act, defaultValue);
    return (newValue > (tile.getMaxBuildPoint() ?? 0))
        ? defaultValue
        : (newValue < 0 ? 0 : newValue);
}
function evalActCurrentCapturePoint(action: WeaSetTileStateSimple, tile: ITile): number {
    const defaultValue  = tile.getCurrentCapturePoint();
    const act           = action.getActCurrentCapturePoint();
    if (!act) {
        return defaultValue;
    }

    const newValue  = MultiplierAndOffsetsUtils.getResultValue(act, defaultValue);
    return (newValue > (tile.getMaxCapturePoint() ?? 0))
        ? defaultValue
        : (newValue < 0 ? 0 : newValue);
}
function evalActIsHighlighted(action: WeaSetTileStateSimple, tile: ITile): boolean {
    return action.getActIsHighlighted() ?? tile.getIsHighlighted();
}
function evalActLocationIdArray(action: WeaSetTileStateSimple, tile: ITile): number[] {
    const act = action.getActLocationIdArray();
    if (act == null) {
        return tile.getGroupedLocationIdArray();
    } else {
        return LocationsUtils.encode(
            ArrayModifiersUtils.getResultValue(act, tile.getLocationIdList(true))
        );
    }
}
function evalActCustomNameId(action: WeaSetTileStateSimple, tile: ITile): Undefinable<number> {
    const defaultValue  = tile.getCustomNameId();
    const act           = action.getActCustomNameId();
    if (act == null) {
        return defaultValue;
    }

    const value = MultiplierAndOffsetsUtils.getResultValue(act, defaultValue ?? 0);
    return TilesUtilsCommon.checkIsValidCustomNameId(value)
        ? value
        : (value < 0 ? null : defaultValue);
}
