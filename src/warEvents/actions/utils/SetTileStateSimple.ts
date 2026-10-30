import {
    Locations_Constants,
    Players_Utils_Filter,
    Tiles_Utils_Filter,
    Units_Utils_Filter,
    ValueAndComparators_Utils,
    ArrayModifiers_Utils,
    Tiles_Utils_Common,
    MultiplierAndOffsets_Utils,
    TileObjects_Utils,
    Tiles_Utils_Serialization,
    Locations_Utils,
    GameConfigs_GameConfig,
    Lang_Utils,
    Lang_Constants,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
    type Tiles_ITile,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { WeaSetTileStateSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetTileStateSimple.ts";

export function checkIsValid(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetTileStateSimple>, gameConfig: GameConfigs_GameConfig.GameConfig, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetTileStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const actTextArray: string[] = [];
    {
        const act = data.getActPlayerIndex();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.PlayerIndex));
        }
    }
    {
        const act = data.getActCurrentHp();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.Hp));
        }
    }
    {
        const act = data.getActCurrentBuildPoint();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.BuildPoint));
        }
    }
    {
        const act = data.getActCurrentCapturePoint();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.CapturePoint));
        }
    }
    {
        const act = data.getActIsHighlighted();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.IsHighlighted));
        }
    }
    {
        const act = data.getActLocationIdArray();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.Location));
        }
    }
    {
        const act = data.getActCustomNameId();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.CustomNameId));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.A0957));
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0254,
        Lang_Utils.getText(Lang_Constants.TextType.Tiles),
        actTextArray.join(`, `),
    );
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetTileStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            conTextArray.push(`- ${Tiles_Utils_Filter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            conTextArray.push(`- (${Lang_Utils.getText(Lang_Constants.TextType.B1421)}) ${Players_Utils_Filter.getDescForEmbed(filter)}`);
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if (comparator != null) {
            conTextArray.push(`- ${ValueAndComparators_Utils.getDesc(
                comparator,
                Lang_Utils.getText(data.getConUnitFilter() == null ? Lang_Constants.TextType.B1418 : Lang_Constants.TextType.B1419),
            )}`);
        }
    }

    if (!conTextArray.length) {
        conTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.A0944)}`);
    }

    const actTextArray: string[] = [];
    {
        const act = data.getActPlayerIndex();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.PlayerIndex));
        }
    }
    {
        const act = data.getActCurrentHp();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.Hp));
        }
    }
    {
        const act = data.getActCurrentBuildPoint();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.BuildPoint));
        }
    }
    {
        const act = data.getActCurrentCapturePoint();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.CapturePoint));
        }
    }
    {
        const act = data.getActIsHighlighted();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.IsHighlighted));
        }
    }
    {
        const act = data.getActLocationIdArray();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.Location));
        }
    }
    {
        const act = data.getActCustomNameId();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.CustomNameId));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.A0957));
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0255,
        Lang_Utils.getText(Lang_Constants.TextType.Tiles),
        conTextArray.join(`\n`),
        Lang_Utils.getText(Lang_Constants.TextType.Tiles),
        actTextArray.join(`, `),
    );
}

export function getErrorTip(data: WeaSetTileStateSimple, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            if (!Units_Utils_Filter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.UnitFilter));
            }
            if (data.getConUnitComparator() == null) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Comparator));
            }
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                                    &&
            (!Players_Utils_Filter.checkIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.PlayerFilter));
        }
    }
    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                            &&
            (!Tiles_Utils_Filter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileFilter));
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if ((comparator != null)                            &&
            (!ValueAndComparators_Utils.checkIsValid(comparator))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Comparator));
        }
    }

    {
        const act = data.getActPlayerIndex();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.PlayerIndex));
        }
    }
    {
        const act = data.getActCurrentHp();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Hp));
        }
    }
    {
        const act = data.getActCurrentBuildPoint();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.BuildPoint));
        }
    }
    {
        const act = data.getActCurrentCapturePoint();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.CapturePoint));
        }
    }
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActIsHighlighted();
    }
    {
        const act = data.getActLocationIdArray();
        if ((act != null)                                                                                           &&
            (!ArrayModifiers_Utils.checkIsValid(act, Locations_Constants.AllLocationIdSet))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.FlareAmmo));
        }
    }
    {
        const act = data.getActCustomNameId();
        if ((act != null)                                           &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.CustomNameId));
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
        return Lang_Utils.getText(Lang_Constants.TextType.A0957);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetTileStateSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaSetTileStateSimple, isFastExecute: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const targetTileArray: Tiles_ITile.ITile[] = [];
    {
        const unitMap           = war.getUnitMap();
        const conTileFilter     = data.getConTileFilter();
        const conPlayerFilter   = data.getConPlayerFilter();
        const conUnitFilter     = data.getConUnitFilter();
        const conUnitComparator = data.getConUnitComparator();
        const playerFilterDict  = new Map<Players_IPlayer.IPlayer, boolean>();
        for (const tile of war.getTileMap().getAllTiles()) {
            if ((conTileFilter != null) && (!Tiles_Utils_Filter.checkIsMeet(conTileFilter, tile))) {
                continue;
            }

            if ((conPlayerFilter != null) && (!checkIsMeetConPlayerFilter(playerFilterDict, conPlayerFilter, tile.getPlayer()))) {
                continue;
            }

            if (conUnitComparator != null) {
                let count = 0;
                for (const unit of unitMap.getAllUnitsOnGrid(tile.getGridIndex())) {
                    if ((conUnitFilter == null) || (Units_Utils_Filter.checkIsMeet(conUnitFilter, unit))) {
                        ++count;
                    }
                }
                if (!ValueAndComparators_Utils.checkIsMeet(conUnitComparator, count)) {
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
            const tileData = Tiles_Utils_Serialization.create({
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
function checkIsMeetConPlayerFilter(resultDict: Map<Players_IPlayer.IPlayer, boolean>, filter: PlayerFilter, player: Players_IPlayer.IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, Players_Utils_Filter.checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function evalActPlayerIndex(action: WeaSetTileStateSimple, tile: Tiles_ITile.ITile): number {
    const defaultValue  = tile.getPlayerIndex();
    const act           = action.getActPlayerIndex();
    if (!act) {
        return defaultValue;
    }

    const newValue = MultiplierAndOffsets_Utils.getResultValue(act, defaultValue);
    if ((tile.getWar().getPlayerManager().checkHasPlayer(newValue)) &&
        (TileObjects_Utils.checkIsValidPlayerIndexForTileObject({ playerIndex : newValue, tileObjectType : tile.getObjectType() }))
    ) {
        return newValue;
    } else {
        return defaultValue;
    }
}
function evalActCurrentHp(action: WeaSetTileStateSimple, tile: Tiles_ITile.ITile): number {
    const defaultValue  = tile.getCurrentHp();
    const act           = action.getActCurrentHp();
    if (!act) {
        return defaultValue;
    }

    const newValue  = MultiplierAndOffsets_Utils.getResultValue(act, defaultValue);
    return (newValue > (tile.getMaxHp() ?? 0))
        ? defaultValue
        : (newValue < 0 ? 0 : newValue);
}
function evalActCurrentBuildPoint(action: WeaSetTileStateSimple, tile: Tiles_ITile.ITile): number {
    const defaultValue  = tile.getCurrentBuildPoint();
    const act           = action.getActCurrentBuildPoint();
    if (!act) {
        return defaultValue;
    }

    const newValue  = MultiplierAndOffsets_Utils.getResultValue(act, defaultValue);
    return (newValue > (tile.getMaxBuildPoint() ?? 0))
        ? defaultValue
        : (newValue < 0 ? 0 : newValue);
}
function evalActCurrentCapturePoint(action: WeaSetTileStateSimple, tile: Tiles_ITile.ITile): number {
    const defaultValue  = tile.getCurrentCapturePoint();
    const act           = action.getActCurrentCapturePoint();
    if (!act) {
        return defaultValue;
    }

    const newValue  = MultiplierAndOffsets_Utils.getResultValue(act, defaultValue);
    return (newValue > (tile.getMaxCapturePoint() ?? 0))
        ? defaultValue
        : (newValue < 0 ? 0 : newValue);
}
function evalActIsHighlighted(action: WeaSetTileStateSimple, tile: Tiles_ITile.ITile): boolean {
    return action.getActIsHighlighted() ?? tile.getIsHighlighted();
}
function evalActLocationIdArray(action: WeaSetTileStateSimple, tile: Tiles_ITile.ITile): number[] {
    const act = action.getActLocationIdArray();
    if (act == null) {
        return tile.getGroupedLocationIdArray();
    } else {
        return Locations_Utils.encode(
            ArrayModifiers_Utils.getResultValue(act, tile.getLocationIdList(true)),
        );
    }
}
function evalActCustomNameId(action: WeaSetTileStateSimple, tile: Tiles_ITile.ITile): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
    const defaultValue  = tile.getCustomNameId();
    const act           = action.getActCustomNameId();
    if (act == null) {
        return defaultValue;
    }

    const value = MultiplierAndOffsets_Utils.getResultValue(act, defaultValue ?? 0);
    return Tiles_Utils_Common.checkIsValidCustomNameId(value)
        ? value
        : (value < 0 ? null : defaultValue);
}
