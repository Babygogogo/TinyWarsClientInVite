import {
    Players_Utils_Filter,
    Tiles_Utils_Filter,
    Units_Utils_Filter,
    ValueAndComparators_Utils,
    Tiles_Utils_Serialization,
    GameConfigs_GameConfig,
    Lang_Utils,
    TileBases_Utils,
    TileDecorations_Utils,
    TileObjects_Utils,
    Players_Constants,
    Lang_Constants,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
    type Tiles_Tile,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { WeaSetTileTypeSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetTileTypeSimple.ts";

export function checkIsValid(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetTileTypeSimple>, gameConfig: GameConfigs_GameConfig.GameConfig, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetTileTypeSimple>): string | null {
    if (!data) {
        return null;
    }

    const actTextArray: string[] = [];
    {
        if (data.getActChangeTileBase()) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.TileBase));
        }
    }
    {
        if ((data.getActChangeTileDecoration()) || (data.getActDeleteTileDecoration())) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.TileDecoration));
        }
    }
    {
        if ((data.getActChangeTileObject()) || (data.getActDeleteTileObject())) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.TileObject));
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
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetTileTypeSimple>): string | null {
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
        if (data.getActChangeTileBase()) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.TileBase));
        }
    }
    {
        if ((data.getActChangeTileDecoration()) || (data.getActDeleteTileDecoration())) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.TileDecoration));
        }
    }
    {
        if ((data.getActChangeTileObject()) || (data.getActDeleteTileObject())) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.TileObject));
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

export function getErrorTip(data: WeaSetTileTypeSimple, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
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
        if ((filter != null) &&
            (!Players_Utils_Filter.checkIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.PlayerFilter));
        }
    }
    {
        const filter = data.getConTileFilter();
        if ((filter != null) &&
            (!Tiles_Utils_Filter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileFilter));
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if ((comparator != null) &&
            (!ValueAndComparators_Utils.checkIsValid(comparator))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Comparator));
        }
    }

    {
        const actChangeTileBase = data.getActChangeTileBase();
        const actTileBaseType = data.getActTileBaseType();
        const actTileBaseShapeId = data.getActTileBaseShapeId();
        if (!actChangeTileBase) {
            if ((actTileBaseType != null) || (actTileBaseShapeId != null)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileBase));
            }
        } else {
            if ((actTileBaseType == null) || (actTileBaseShapeId == null)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileBase));
            }

            const cfg = TileBases_Utils.getTileBaseCfg(actTileBaseType);
            if (cfg == null) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileBase));
            }
            if ((actTileBaseShapeId < 0) || (actTileBaseShapeId >= cfg.shapesCount)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileBase));
            }
        }
    }
    {
        const actTileChangeDecoration = data.getActChangeTileDecoration();
        const actTileDecorationType = data.getActTileDecorationType();
        const actTileDecorationShapeId = data.getActTileDecorationShapeId();
        if (data.getActDeleteTileDecoration()) {
            if (actTileChangeDecoration) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileDecoration));
            }
        } else {
            if (!actTileChangeDecoration) {
                if ((actTileDecorationType != null) || (actTileDecorationShapeId != null)) {
                    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileDecoration));
                }
            } else {
                if ((actTileDecorationType == null) || (actTileDecorationShapeId == null)) {
                    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileDecoration));
                }

                const cfg = TileDecorations_Utils.getTileDecorationCfg(actTileDecorationType);
                if (cfg == null) {
                    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileDecoration));
                }
                if ((actTileDecorationShapeId < 0) || (actTileDecorationShapeId >= cfg.shapesCount)) {
                    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileDecoration));
                }
            }
        }
    }
    {
        const actChangeTileObject = data.getActChangeTileObject();
        const actTileObjectType = data.getActTileObjectType();
        const actTileObjectShapeId = data.getActTileObjectShapeId();
        if (data.getActDeleteTileObject()) {
            if (actChangeTileObject) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileObject));
            }
        } else {
            if (!actChangeTileObject) {
                if ((actTileObjectType != null) || (actTileObjectShapeId != null)) {
                    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileObject));
                }
            } else {
                if ((actTileObjectType == null) || (actTileObjectShapeId == null)) {
                    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileObject));
                }

                const cfg = TileObjects_Utils.getTileObjectCfg(actTileObjectType);
                if (cfg == null) {
                    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileObject));
                }
                if ((actTileObjectShapeId < 0) || (actTileObjectShapeId >= cfg.shapesCount)) {
                    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileObject));
                }
            }
        }
    }

    if ((!data.getActChangeTileBase()) &&
        (!data.getActChangeTileDecoration()) &&
        (!data.getActDeleteTileDecoration()) &&
        (!data.getActChangeTileObject()) &&
        (!data.getActDeleteTileObject())
    ) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0957);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetTileTypeSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaSetTileTypeSimple, isFastExecute: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const targetTileArray: Tiles_Tile.Tile[] = [];
    {
        const unitMap = war.getUnitMap();
        const conTileFilter = data.getConTileFilter();
        const conPlayerFilter = data.getConPlayerFilter();
        const conUnitFilter = data.getConUnitFilter();
        const conUnitComparator = data.getConUnitComparator();
        const playerFilterDict = new Map<Players_IPlayer.IPlayer, boolean>();
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
        const gameConfig = war.getGcData();
        for (const tile of targetTileArray) {
            const newTileObjectType = data.getActDeleteTileObject()
                ? 0
                : (data.getActChangeTileObject()
                    ? (data.getActTileObjectType() ?? 0)
                    : tile.getObjectType()
                );
            const newTileObjectCfg = TileObjects_Utils.getTileObjectCfg(newTileObjectType);
            if (newTileObjectCfg == null) {
                continue;
            }

            const newTileBaseType = data.getActChangeTileBase()
                ? (data.getActTileBaseType() ?? 0)
                : tile.getBaseType();
            const newTileTemplateCfg = gameConfig.getTileTemplateCfgByBaseTypeAndObjectType(newTileBaseType, newTileObjectType);
            if (newTileTemplateCfg == null) {
                continue;
            }

            const isSameTileTypeId  = newTileTemplateCfg.getTileTypeId() === tile.getTileTypeId();
            const maxBuildPoint     = newTileTemplateCfg.getMaxBuildPoint() ?? 0;
            const maxCapturePoint   = newTileTemplateCfg.getMaxCapturePoint() ?? 0;
            const maxHp             = newTileTemplateCfg.getMaxHp() ?? 0;

            const tileData          = Tiles_Utils_Serialization.create({
                gridIndex   : tile.getGridIndex().toProto().toJson(),
                playerIndex : newTileObjectCfg.isNeutralOnly
                    ? Players_Constants.PlayerIndex.Neutral
                    : tile.getPlayerIndex(),

                baseType    : newTileBaseType,
                baseShapeId : data.getActChangeTileBase()
                    ? (data.getActTileBaseShapeId() ?? 0)
                    : tile.getBaseShapeId(),

                decorationType : data.getActDeleteTileDecoration()
                    ? 0
                    : (data.getActChangeTileDecoration()
                        ? (data.getActTileDecorationType() ?? 0)
                        : tile.getDecorationType()
                    ),
                decorationShapeId : data.getActDeleteTileDecoration()
                    ? 0
                    : (data.getActChangeTileDecoration()
                        ? (data.getActTileDecorationShapeId() ?? 0)
                        : tile.getDecorationShapeId()
                    ),

                objectType    : newTileObjectType,
                objectShapeId : data.getActDeleteTileObject()
                    ? 0
                    : (data.getActChangeTileObject()
                        ? (data.getActTileObjectShapeId() ?? 0)
                        : tile.getObjectShapeId()
                    ),

                customNameId           : tile.getCustomNameId() ?? null,
                isHighlighted          : tile.getIsHighlighted(),
                unfixedBuffArray       : tile.getUnfixedBuffList().map(v => v.toJson()),
                groupedLocationIdArray : tile.getGroupedLocationIdArray(),

                currentBuildPoint   : tile.getMaxBuildPoint() == null   ? maxBuildPoint     : Math.min(tile.getCurrentBuildPoint(), maxBuildPoint),
                currentCapturePoint : tile.getMaxCapturePoint() == null ? maxCapturePoint   : Math.min(tile.getCurrentCapturePoint(), maxCapturePoint),
                currentHp           : tile.getMaxHp() == null           ? maxHp             : Math.min(tile.getCurrentHp(), maxHp),

                customBuildingData    : isSameTileTypeId ? tile.getCustomBuildingData()?.toJson() ?? null     : null,
                customCrystalData     : isSameTileTypeId ? tile.getCustomCrystalData()?.toJson() ?? null      : null,
                customCannonData      : isSameTileTypeId ? tile.getCustomCannonData()?.toJson() ?? null       : null,
                customLaserTurretData : isSameTileTypeId ? tile.getCustomLaserTurretData()?.toJson() ?? null  : null,
            });

            tile.init(tileData, gameConfig);
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
