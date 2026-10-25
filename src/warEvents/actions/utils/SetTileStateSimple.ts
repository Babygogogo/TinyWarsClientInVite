import { checkIsValid as ArrayModifiersUtilsCheckIsValid, getResultValue } from "../../../arrayModifiers/Utils.ts";
import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { GcData } from "../../../gameConfig/GcData.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText, getFormattedText } from "../../../lang/Utils.ts";
import { AllLocationIdSet } from "../../../locations/Constants.ts";
import { encode } from "../../../locations/Utils.ts";
import {
    checkIsValid as MultiplierAndOffsetsUtilsCheckIsValid,
    getResultValue as MultiplierAndOffsetsUtilsGetResultValue,
} from "../../../multiplierAndOffsets/Utils.ts";
import type { IPlayer as PlayersIPlayer } from "../../../players/IPlayer.ts";
import { getDescForEmbed, checkIsValid as PlayersUtilsFilterCheckIsValid, checkIsMeet } from "../../../players/utils/Filter.ts";
import type {
    PlayerFilter as ProtoSchemaCommonProtoStructurePlayerFilter,
} from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type {
    WeaSetTileStateSimple as ProtoSchemaCommonProtoWarEventWeaSetTileStateSimple,
} from "../../../proto/schema/CommonProto/WarEvent/WeaSetTileStateSimple.ts";
import type { ITile as TilesITile } from "../../../tiles/ITile.ts";
import { checkIsValidCustomNameId } from "../../../tiles/utils/Common.ts";
import {
    getDescForEmbed as TilesUtilsFilterGetDescForEmbed,
    checkIsValid as TilesUtilsFilterCheckIsValid,
    checkIsMeet as TilesUtilsFilterCheckIsMeet,
} from "../../../tiles/utils/Filter.ts";
import { create } from "../../../tiles/utils/Serialization.ts";
import { checkIsValid as UnitsUtilsFilterCheckIsValid, checkIsMeet as UnitsUtilsFilterCheckIsMeet } from "../../../units/utils/Filter.ts";
import {
    getDesc,
    checkIsValid as ValueAndComparatorsUtilsCheckIsValid,
    checkIsMeet as ValueAndComparatorsUtilsCheckIsMeet,
} from "../../../valueAndComparators/Utils.ts";

type PlayerFilter                       = ProtoSchemaCommonProtoStructurePlayerFilter;
type WeaSetTileStateSimple              = ProtoSchemaCommonProtoWarEventWeaSetTileStateSimple;
type Undefinable<T>                     = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;
type IPlayer                            = PlayersIPlayer;
type ITile                              = TilesITile;

export function checkIsValid(data: AuxiliaryTypesAuxiliaryTypesUndefinable<WeaSetTileStateSimple>, gameConfig: GcData, mapSize: MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypesUndefinable<WeaSetTileStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const actTextArray: string[] = [];
    {
        const act = data.getActPlayerIndex();
        if (act != null) {
            actTextArray.push(getText(TextType.PlayerIndex));
        }
    }
    {
        const act = data.getActCurrentHp();
        if (act != null) {
            actTextArray.push(getText(TextType.Hp));
        }
    }
    {
        const act = data.getActCurrentBuildPoint();
        if (act != null) {
            actTextArray.push(getText(TextType.BuildPoint));
        }
    }
    {
        const act = data.getActCurrentCapturePoint();
        if (act != null) {
            actTextArray.push(getText(TextType.CapturePoint));
        }
    }
    {
        const act = data.getActIsHighlighted();
        if (act != null) {
            actTextArray.push(getText(TextType.IsHighlighted));
        }
    }
    {
        const act = data.getActLocationIdArray();
        if (act != null) {
            actTextArray.push(getText(TextType.Location));
        }
    }
    {
        const act = data.getActCustomNameId();
        if (act != null) {
            actTextArray.push(getText(TextType.CustomNameId));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(getText(TextType.A0957));
    }

    return getFormattedText(
        TextType.F0254,
        getText(TextType.Tiles),
        actTextArray.join(`, `),
    );
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypesUndefinable<WeaSetTileStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            conTextArray.push(`- ${TilesUtilsFilterGetDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            conTextArray.push(`- (${getText(TextType.B1421)}) ${getDescForEmbed(filter)}`);
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if (comparator != null) {
            conTextArray.push(`- ${getDesc(
                comparator,
                getText(data.getConUnitFilter() == null ? TextType.B1418 : TextType.B1419)
            )}`);
        }
    }

    if (!conTextArray.length) {
        conTextArray.push(`- ${getText(TextType.A0944)}`);
    }

    const actTextArray: string[] = [];
    {
        const act = data.getActPlayerIndex();
        if (act != null) {
            actTextArray.push(getText(TextType.PlayerIndex));
        }
    }
    {
        const act = data.getActCurrentHp();
        if (act != null) {
            actTextArray.push(getText(TextType.Hp));
        }
    }
    {
        const act = data.getActCurrentBuildPoint();
        if (act != null) {
            actTextArray.push(getText(TextType.BuildPoint));
        }
    }
    {
        const act = data.getActCurrentCapturePoint();
        if (act != null) {
            actTextArray.push(getText(TextType.CapturePoint));
        }
    }
    {
        const act = data.getActIsHighlighted();
        if (act != null) {
            actTextArray.push(getText(TextType.IsHighlighted));
        }
    }
    {
        const act = data.getActLocationIdArray();
        if (act != null) {
            actTextArray.push(getText(TextType.Location));
        }
    }
    {
        const act = data.getActCustomNameId();
        if (act != null) {
            actTextArray.push(getText(TextType.CustomNameId));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(getText(TextType.A0957));
    }

    return getFormattedText(
        TextType.F0255,
        getText(TextType.Tiles),
        conTextArray.join(`\n`),
        getText(TextType.Tiles),
        actTextArray.join(`, `),
    );
}

export function getErrorTip(data: WeaSetTileStateSimple, mapSize: MapSize, playersCountUnneutral: number, gameConfig: GcData): string | null {
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            if (!UnitsUtilsFilterCheckIsValid(filter, playersCountUnneutral, mapSize, gameConfig)) {
                return getFormattedText(TextType.F0091, getText(TextType.UnitFilter));
            }
            if (data.getConUnitComparator() == null) {
                return getFormattedText(TextType.F0091, getText(TextType.Comparator));
            }
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                                    &&
            (!PlayersUtilsFilterCheckIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.PlayerFilter));
        }
    }
    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                            &&
            (!TilesUtilsFilterCheckIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.TileFilter));
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if ((comparator != null)                            &&
            (!ValueAndComparatorsUtilsCheckIsValid(comparator))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.Comparator));
        }
    }

    {
        const act = data.getActPlayerIndex();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.PlayerIndex));
        }
    }
    {
        const act = data.getActCurrentHp();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.Hp));
        }
    }
    {
        const act = data.getActCurrentBuildPoint();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.BuildPoint));
        }
    }
    {
        const act = data.getActCurrentCapturePoint();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.CapturePoint));
        }
    }
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActIsHighlighted();
    }
    {
        const act = data.getActLocationIdArray();
        if ((act != null)                                                                                           &&
            (!ArrayModifiersUtilsCheckIsValid(act, AllLocationIdSet))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.FlareAmmo));
        }
    }
    {
        const act = data.getActCustomNameId();
        if ((act != null)                                           &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.CustomNameId));
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
        return getText(TextType.A0957);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetTileStateSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaSetTileStateSimple, isFastExecute: boolean, war: IBwWar): Promise<void> {
    const targetTileArray: ITile[] = [];
    {
        const unitMap           = war.getUnitMap();
        const conTileFilter     = data.getConTileFilter();
        const conPlayerFilter   = data.getConPlayerFilter();
        const conUnitFilter     = data.getConUnitFilter();
        const conUnitComparator = data.getConUnitComparator();
        const playerFilterDict  = new Map<IPlayer, boolean>();
        for (const tile of war.getTileMap().getAllTiles()) {
            if ((conTileFilter != null) && (!TilesUtilsFilterCheckIsMeet(conTileFilter, tile))) {
                continue;
            }

            if ((conPlayerFilter != null) && (!checkIsMeetConPlayerFilter(playerFilterDict, conPlayerFilter, tile.getPlayer()))) {
                continue;
            }

            if (conUnitComparator != null) {
                let count = 0;
                for (const unit of unitMap.getAllUnitsOnGrid(tile.getGridIndex())) {
                    if ((conUnitFilter == null) || (UnitsUtilsFilterCheckIsMeet(conUnitFilter, unit))) {
                        ++count;
                    }
                }
                if (!ValueAndComparatorsUtilsCheckIsMeet(conUnitComparator, count)) {
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
            const tileData = create({
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
        resultDict.set(player, checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function evalActPlayerIndex(action: WeaSetTileStateSimple, tile: ITile): number {
    const defaultValue  = tile.getPlayerIndex();
    const act           = action.getActPlayerIndex();
    if (!act) {
        return defaultValue;
    }

    const newValue = MultiplierAndOffsetsUtilsGetResultValue(act, defaultValue);
    if ((tile.getWar().getPlayerManager().checkHasPlayer(newValue)) && (GcData.checkIsValidPlayerIndexForTileObject({ playerIndex: newValue, tileObjectType: tile.getObjectType() }))) {
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

    const newValue  = MultiplierAndOffsetsUtilsGetResultValue(act, defaultValue);
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

    const newValue  = MultiplierAndOffsetsUtilsGetResultValue(act, defaultValue);
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

    const newValue  = MultiplierAndOffsetsUtilsGetResultValue(act, defaultValue);
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
        return encode(
            getResultValue(act, tile.getLocationIdList(true))
        );
    }
}
function evalActCustomNameId(action: WeaSetTileStateSimple, tile: ITile): Undefinable<number> {
    const defaultValue  = tile.getCustomNameId();
    const act           = action.getActCustomNameId();
    if (act == null) {
        return defaultValue;
    }

    const value = MultiplierAndOffsetsUtilsGetResultValue(act, defaultValue ?? 0);
    return checkIsValidCustomNameId(value)
        ? value
        : (value < 0 ? null : defaultValue);
}
