import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import type * as PlayersIPlayer from "../../../players/IPlayer.ts";
import * as PlayersUtilsFilter from "../../../players/utils/Filter.ts";
import type * as ProtoSchemaCommonProtoStructurePlayerFilter from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetTileTypeSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetTileTypeSimple.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as TilesUtilsFilter from "../../../tiles/utils/Filter.ts";
import * as TilesUtilsSerialization from "../../../tiles/utils/Serialization.ts";
import * as UnitsUtilsFilter from "../../../units/utils/Filter.ts";
import * as ValueAndComparatorsUtils from "../../../valueAndComparators/Utils.ts";

type PlayerFilter                   = ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter;
type WeaSetTileTypeSimple           = ProtoSchemaCommonProtoWarEventWeaSetTileTypeSimple.WeaSetTileTypeSimple;
type IPlayer                        = PlayersIPlayer.IPlayer;

export function checkIsValid(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetTileTypeSimple>, gameConfig: GameConfigGcData.GcData, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetTileTypeSimple>): string | null {
    if (!data) {
        return null;
    }

    const actTextArray: string[] = [];
    {
        if (data.getActChangeTileBase()) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.TileBase));
        }
    }
    {
        if ((data.getActChangeTileDecoration()) || (data.getActDeleteTileDecoration())) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.TileDecoration));
        }
    }
    {
        if ((data.getActChangeTileObject()) || (data.getActDeleteTileObject())) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.TileObject));
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
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetTileTypeSimple>): string | null {
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
        if (data.getActChangeTileBase()) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.TileBase));
        }
    }
    {
        if ((data.getActChangeTileDecoration()) || (data.getActDeleteTileDecoration())) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.TileDecoration));
        }
    }
    {
        if ((data.getActChangeTileObject()) || (data.getActDeleteTileObject())) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.TileObject));
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

export function getErrorTip(data: WeaSetTileTypeSimple, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): string | null {
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
        if ((filter != null) &&
            (!PlayersUtilsFilter.checkIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.PlayerFilter));
        }
    }
    {
        const filter = data.getConTileFilter();
        if ((filter != null) &&
            (!TilesUtilsFilter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileFilter));
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if ((comparator != null) &&
            (!ValueAndComparatorsUtils.checkIsValid(comparator))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Comparator));
        }
    }

    {
        const actChangeTileBase = data.getActChangeTileBase();
        const actTileBaseType = data.getActTileBaseType();
        const actTileBaseShapeId = data.getActTileBaseShapeId();
        if (!actChangeTileBase) {
            if ((actTileBaseType != null) || (actTileBaseShapeId != null)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileBase));
            }
        } else {
            if ((actTileBaseType == null) || (actTileBaseShapeId == null)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileBase));
            }

            const cfg = gameConfig.getTileBaseCfg(actTileBaseType);
            if (cfg == null) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileBase));
            }
            if ((actTileBaseShapeId < 0) || (actTileBaseShapeId >= cfg.shapesCount)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileBase));
            }
        }
    }
    {
        const actTileChangeDecoration = data.getActChangeTileDecoration();
        const actTileDecorationType = data.getActTileDecorationType();
        const actTileDecorationShapeId = data.getActTileDecorationShapeId();
        if (data.getActDeleteTileDecoration()) {
            if (actTileChangeDecoration) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileDecoration));
            }
        } else {
            if (!actTileChangeDecoration) {
                if ((actTileDecorationType != null) || (actTileDecorationShapeId != null)) {
                    return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileDecoration));
                }
            } else {
                if ((actTileDecorationType == null) || (actTileDecorationShapeId == null)) {
                    return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileDecoration));
                }

                const cfg = gameConfig.getTileDecorationCfg(actTileDecorationType);
                if (cfg == null) {
                    return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileDecoration));
                }
                if ((actTileDecorationShapeId < 0) || (actTileDecorationShapeId >= cfg.shapesCount)) {
                    return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileDecoration));
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
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileObject));
            }
        } else {
            if (!actChangeTileObject) {
                if ((actTileObjectType != null) || (actTileObjectShapeId != null)) {
                    return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileObject));
                }
            } else {
                if ((actTileObjectType == null) || (actTileObjectShapeId == null)) {
                    return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileObject));
                }

                const cfg = gameConfig.getTileObjectCfg(actTileObjectType);
                if (cfg == null) {
                    return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileObject));
                }
                if ((actTileObjectShapeId < 0) || (actTileObjectShapeId >= cfg.shapesCount)) {
                    return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileObject));
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
        return LangUtils.getText(LangConstants.TextType.A0957);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetTileTypeSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaSetTileTypeSimple, isFastExecute: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const targetTileArray: TilesITile.ITile[] = [];
    {
        const unitMap = war.getUnitMap();
        const conTileFilter = data.getConTileFilter();
        const conPlayerFilter = data.getConPlayerFilter();
        const conUnitFilter = data.getConUnitFilter();
        const conUnitComparator = data.getConUnitComparator();
        const playerFilterDict = new Map<IPlayer, boolean>();
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
        const gameConfig = war.getGcData();
        for (const tile of targetTileArray) {
            const newTileObjectType = data.getActDeleteTileObject()
                ? 0
                : (data.getActChangeTileObject()
                    ? (data.getActTileObjectType() ?? 0)
                    : tile.getObjectType()
                );
            const newTileObjectCfg = gameConfig.getTileObjectCfg(newTileObjectType);
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

            const tileData          = TilesUtilsSerialization.create({
                gridIndex       : tile.getGridIndex().toProto().toJson(),
                playerIndex     : newTileObjectCfg.isNeutralOnly
                    ? PlayersConstants.PlayerIndex.Neutral
                    : tile.getPlayerIndex(),

                baseType        : newTileBaseType,
                baseShapeId     : data.getActChangeTileBase()
                    ? (data.getActTileBaseShapeId() ?? 0)
                    : tile.getBaseShapeId(),

                decorationType      : data.getActDeleteTileDecoration()
                    ? 0
                    : (data.getActChangeTileDecoration()
                        ? (data.getActTileDecorationType() ?? 0)
                        : tile.getDecorationType()
                    ),
                decorationShapeId   : data.getActDeleteTileDecoration()
                    ? 0
                    : (data.getActChangeTileDecoration()
                        ? (data.getActTileDecorationShapeId() ?? 0)
                        : tile.getDecorationShapeId()
                    ),

                objectType      : newTileObjectType,
                objectShapeId   : data.getActDeleteTileObject()
                    ? 0
                    : (data.getActChangeTileObject()
                        ? (data.getActTileObjectShapeId() ?? 0)
                        : tile.getObjectShapeId()
                    ),

                customNameId            : tile.getCustomNameId() ?? null,
                isHighlighted           : tile.getIsHighlighted(),
                unfixedBuffArray        : tile.getUnfixedBuffList().map(v => v.toJson()),
                groupedLocationIdArray  : tile.getGroupedLocationIdArray(),

                currentBuildPoint       : tile.getMaxBuildPoint() == null   ? maxBuildPoint     : Math.min(tile.getCurrentBuildPoint(), maxBuildPoint),
                currentCapturePoint     : tile.getMaxCapturePoint() == null ? maxCapturePoint   : Math.min(tile.getCurrentCapturePoint(), maxCapturePoint),
                currentHp               : tile.getMaxHp() == null           ? maxHp             : Math.min(tile.getCurrentHp(), maxHp),

                customBuildingData      : isSameTileTypeId ? tile.getCustomBuildingData()?.toJson() ?? null     : null,
                customCrystalData       : isSameTileTypeId ? tile.getCustomCrystalData()?.toJson() ?? null      : null,
                customCannonData        : isSameTileTypeId ? tile.getCustomCannonData()?.toJson() ?? null       : null,
                customLaserTurretData   : isSameTileTypeId ? tile.getCustomLaserTurretData()?.toJson() ?? null  : null,
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
function checkIsMeetConPlayerFilter(resultDict: Map<IPlayer, boolean>, filter: PlayerFilter, player: IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, PlayersUtilsFilter.checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
