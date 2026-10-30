import {
    checkIsValid as checkIsValidArrayModifier,
    getResultValue as getArrayModifiersResultValue,
} from "../../../arrayModifiers/Utils.ts";
import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import { TextType } from "../../../lang/Constants.ts";
import {
    getFormattedText,
    getText,
} from "../../../lang/Utils.ts";
import { AllLocationIdSet } from "../../../locations/Constants.ts";
import { encode } from "../../../locations/Utils.ts";
import {
    checkIsValid as checkIsValidMultiplierAndOffset,
    getResultValue as getMultiplierAndOffsetsResultValue,
} from "../../../multiplierAndOffsets/Utils.ts";
import type { IPlayer } from "../../../players/IPlayer.ts";
import {
    checkIsMeet as checkIsMeetPlayerFilter,
    getDescForEmbed as getPlayersDescForEmbed,
    checkIsValid as checkIsValidPlayerFilter,
} from "../../../players/utils/Filter.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { WeaSetTileStateSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetTileStateSimple.ts";
import { checkIsValidPlayerIndexForTileObject } from "../../../tileObjects/Utils.ts";
import type { ITile } from "../../../tiles/ITile.ts";
import { checkIsValidCustomNameId } from "../../../tiles/utils/Common.ts";
import {
    checkIsMeet as checkIsMeetTileFilter,
    checkIsValid as checkIsValidTileFilter,
    getDescForEmbed as getTilesDescForEmbed,
} from "../../../tiles/utils/Filter.ts";
import { create } from "../../../tiles/utils/Serialization.ts";
import {
    checkIsMeet as checkIsMeetUnitFilter,
    checkIsValid as checkIsValidUnitFilter,
} from "../../../units/utils/Filter.ts";
import {
    getDesc,
    checkIsMeet as checkIsMeetValueAndComparator,
    checkIsValid as checkIsValidValueAndComparator,
} from "../../../valueAndComparators/Utils.ts";

export function checkIsValid(data: Undefinable<WeaSetTileStateSimple>, gameConfig: GameConfig, mapSize: MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: Undefinable<WeaSetTileStateSimple>): string | null {
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
export function getDetailDesc(data: Undefinable<WeaSetTileStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            conTextArray.push(`- ${getTilesDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            conTextArray.push(`- (${getText(TextType.B1421)}) ${getPlayersDescForEmbed(filter)}`);
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

export function getErrorTip(data: WeaSetTileStateSimple, mapSize: MapSize, playersCountUnneutral: number, gameConfig: GameConfig): string | null {
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            if (!checkIsValidUnitFilter(filter, playersCountUnneutral, mapSize, gameConfig)) {
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
            (!checkIsValidPlayerFilter(filter, playersCountUnneutral, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.PlayerFilter));
        }
    }
    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                            &&
            (!checkIsValidTileFilter(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.TileFilter));
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if ((comparator != null)                            &&
            (!checkIsValidValueAndComparator(comparator))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.Comparator));
        }
    }

    {
        const act = data.getActPlayerIndex();
        if ((act != null)                                       &&
            (!checkIsValidMultiplierAndOffset(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.PlayerIndex));
        }
    }
    {
        const act = data.getActCurrentHp();
        if ((act != null)                                       &&
            (!checkIsValidMultiplierAndOffset(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.Hp));
        }
    }
    {
        const act = data.getActCurrentBuildPoint();
        if ((act != null)                                       &&
            (!checkIsValidMultiplierAndOffset(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.BuildPoint));
        }
    }
    {
        const act = data.getActCurrentCapturePoint();
        if ((act != null)                                       &&
            (!checkIsValidMultiplierAndOffset(act))
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
            (!checkIsValidArrayModifier(act, AllLocationIdSet))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.FlareAmmo));
        }
    }
    {
        const act = data.getActCustomNameId();
        if ((act != null)                                           &&
            (!checkIsValidMultiplierAndOffset(act))
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
            if ((conTileFilter != null) && (!checkIsMeetTileFilter(conTileFilter, tile))) {
                continue;
            }

            if ((conPlayerFilter != null) && (!checkIsMeetConPlayerFilter(playerFilterDict, conPlayerFilter, tile.getPlayer()))) {
                continue;
            }

            if (conUnitComparator != null) {
                let count = 0;
                for (const unit of unitMap.getAllUnitsOnGrid(tile.getGridIndex())) {
                    if ((conUnitFilter == null) || (checkIsMeetUnitFilter(conUnitFilter, unit))) {
                        ++count;
                    }
                }
                if (!checkIsMeetValueAndComparator(conUnitComparator, count)) {
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
                baseType          : tile.getBaseType(),
                baseShapeId       : tile.getBaseShapeId(),
                objectType        : tile.getObjectType(),
                objectShapeId     : tile.getObjectShapeId(),
                decorationType    : tile.getDecorationType(),
                decorationShapeId : tile.getDecorationShapeId(),
                gridIndex         : tile.getGridIndex().toProto().toJson(),
                unfixedBuffArray  : tile.getUnfixedBuffList().map(v => v.toJson()),

                customBuildingData    : tile.getCustomBuildingData()?.toJson() ?? null,
                customCannonData      : tile.getCustomCannonData()?.toJson() ?? null,
                customCrystalData     : tile.getCustomCrystalData()?.toJson() ?? null,
                customLaserTurretData : tile.getCustomLaserTurretData()?.toJson() ?? null,

                playerIndex            : evalActPlayerIndex(data, tile),
                currentHp              : evalActCurrentHp(data, tile),
                currentBuildPoint      : evalActCurrentBuildPoint(data, tile),
                currentCapturePoint    : evalActCurrentCapturePoint(data, tile),
                isHighlighted          : evalActIsHighlighted(data, tile),
                groupedLocationIdArray : evalActLocationIdArray(data, tile),
                customNameId           : evalActCustomNameId(data, tile) ?? null,
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
        resultDict.set(player, checkIsMeetPlayerFilter(filter, player));
    }
    return !!resultDict.get(player);
}
function evalActPlayerIndex(action: WeaSetTileStateSimple, tile: ITile): number {
    const defaultValue  = tile.getPlayerIndex();
    const act           = action.getActPlayerIndex();
    if (!act) {
        return defaultValue;
    }

    const newValue = getMultiplierAndOffsetsResultValue(act, defaultValue);
    if ((tile.getWar().getPlayerManager().checkHasPlayer(newValue)) &&
        (checkIsValidPlayerIndexForTileObject({ playerIndex : newValue, tileObjectType : tile.getObjectType() }))
    ) {
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

    const newValue  = getMultiplierAndOffsetsResultValue(act, defaultValue);
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

    const newValue  = getMultiplierAndOffsetsResultValue(act, defaultValue);
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

    const newValue  = getMultiplierAndOffsetsResultValue(act, defaultValue);
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
            getArrayModifiersResultValue(act, tile.getLocationIdList(true))
        );
    }
}
function evalActCustomNameId(action: WeaSetTileStateSimple, tile: ITile): Undefinable<number> {
    const defaultValue  = tile.getCustomNameId();
    const act           = action.getActCustomNameId();
    if (act == null) {
        return defaultValue;
    }

    const value = getMultiplierAndOffsetsResultValue(act, defaultValue ?? 0);
    return checkIsValidCustomNameId(value)
        ? value
        : (value < 0 ? null : defaultValue);
}
