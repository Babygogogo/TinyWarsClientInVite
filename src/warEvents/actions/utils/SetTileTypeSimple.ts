import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import { TextType } from "../../../lang/Constants.ts";
import {
    getFormattedText,
    getText,
} from "../../../lang/Utils.ts";
import { PlayerIndex } from "../../../players/Constants.ts";
import type { IPlayer } from "../../../players/IPlayer.ts";
import {
    checkIsMeet as checkIsMeetPlayerFilter,
    getDescForEmbed as getPlayersDescForEmbed,
    checkIsValid as checkIsValidPlayerFilter,
} from "../../../players/utils/Filter.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { WeaSetTileTypeSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetTileTypeSimple.ts";
import { getTileBaseCfg } from "../../../tileBases/Utils.ts";
import { getTileDecorationCfg } from "../../../tileDecorations/Utils.ts";
import { getTileObjectCfg } from "../../../tileObjects/Utils.ts";
import type { ITile } from "../../../tiles/ITile.ts";
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

export function checkIsValid(data: Undefinable<WeaSetTileTypeSimple>, gameConfig: GameConfig, mapSize: MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: Undefinable<WeaSetTileTypeSimple>): string | null {
    if (!data) {
        return null;
    }

    const actTextArray: string[] = [];
    {
        if (data.getActChangeTileBase()) {
            actTextArray.push(getText(TextType.TileBase));
        }
    }
    {
        if ((data.getActChangeTileDecoration()) || (data.getActDeleteTileDecoration())) {
            actTextArray.push(getText(TextType.TileDecoration));
        }
    }
    {
        if ((data.getActChangeTileObject()) || (data.getActDeleteTileObject())) {
            actTextArray.push(getText(TextType.TileObject));
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
export function getDetailDesc(data: Undefinable<WeaSetTileTypeSimple>): string | null {
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
        if (data.getActChangeTileBase()) {
            actTextArray.push(getText(TextType.TileBase));
        }
    }
    {
        if ((data.getActChangeTileDecoration()) || (data.getActDeleteTileDecoration())) {
            actTextArray.push(getText(TextType.TileDecoration));
        }
    }
    {
        if ((data.getActChangeTileObject()) || (data.getActDeleteTileObject())) {
            actTextArray.push(getText(TextType.TileObject));
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

export function getErrorTip(data: WeaSetTileTypeSimple, mapSize: MapSize, playersCountUnneutral: number, gameConfig: GameConfig): string | null {
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
        if ((filter != null) &&
            (!checkIsValidPlayerFilter(filter, playersCountUnneutral, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.PlayerFilter));
        }
    }
    {
        const filter = data.getConTileFilter();
        if ((filter != null) &&
            (!checkIsValidTileFilter(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.TileFilter));
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if ((comparator != null) &&
            (!checkIsValidValueAndComparator(comparator))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.Comparator));
        }
    }

    {
        const actChangeTileBase = data.getActChangeTileBase();
        const actTileBaseType = data.getActTileBaseType();
        const actTileBaseShapeId = data.getActTileBaseShapeId();
        if (!actChangeTileBase) {
            if ((actTileBaseType != null) || (actTileBaseShapeId != null)) {
                return getFormattedText(TextType.F0091, getText(TextType.TileBase));
            }
        } else {
            if ((actTileBaseType == null) || (actTileBaseShapeId == null)) {
                return getFormattedText(TextType.F0091, getText(TextType.TileBase));
            }

            const cfg = getTileBaseCfg(actTileBaseType);
            if (cfg == null) {
                return getFormattedText(TextType.F0091, getText(TextType.TileBase));
            }
            if ((actTileBaseShapeId < 0) || (actTileBaseShapeId >= cfg.shapesCount)) {
                return getFormattedText(TextType.F0091, getText(TextType.TileBase));
            }
        }
    }
    {
        const actTileChangeDecoration = data.getActChangeTileDecoration();
        const actTileDecorationType = data.getActTileDecorationType();
        const actTileDecorationShapeId = data.getActTileDecorationShapeId();
        if (data.getActDeleteTileDecoration()) {
            if (actTileChangeDecoration) {
                return getFormattedText(TextType.F0091, getText(TextType.TileDecoration));
            }
        } else {
            if (!actTileChangeDecoration) {
                if ((actTileDecorationType != null) || (actTileDecorationShapeId != null)) {
                    return getFormattedText(TextType.F0091, getText(TextType.TileDecoration));
                }
            } else {
                if ((actTileDecorationType == null) || (actTileDecorationShapeId == null)) {
                    return getFormattedText(TextType.F0091, getText(TextType.TileDecoration));
                }

                const cfg = getTileDecorationCfg(actTileDecorationType);
                if (cfg == null) {
                    return getFormattedText(TextType.F0091, getText(TextType.TileDecoration));
                }
                if ((actTileDecorationShapeId < 0) || (actTileDecorationShapeId >= cfg.shapesCount)) {
                    return getFormattedText(TextType.F0091, getText(TextType.TileDecoration));
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
                return getFormattedText(TextType.F0091, getText(TextType.TileObject));
            }
        } else {
            if (!actChangeTileObject) {
                if ((actTileObjectType != null) || (actTileObjectShapeId != null)) {
                    return getFormattedText(TextType.F0091, getText(TextType.TileObject));
                }
            } else {
                if ((actTileObjectType == null) || (actTileObjectShapeId == null)) {
                    return getFormattedText(TextType.F0091, getText(TextType.TileObject));
                }

                const cfg = getTileObjectCfg(actTileObjectType);
                if (cfg == null) {
                    return getFormattedText(TextType.F0091, getText(TextType.TileObject));
                }
                if ((actTileObjectShapeId < 0) || (actTileObjectShapeId >= cfg.shapesCount)) {
                    return getFormattedText(TextType.F0091, getText(TextType.TileObject));
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
        return getText(TextType.A0957);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetTileTypeSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaSetTileTypeSimple, isFastExecute: boolean, war: IBwWar): Promise<void> {
    const targetTileArray: ITile[] = [];
    {
        const unitMap = war.getUnitMap();
        const conTileFilter = data.getConTileFilter();
        const conPlayerFilter = data.getConPlayerFilter();
        const conUnitFilter = data.getConUnitFilter();
        const conUnitComparator = data.getConUnitComparator();
        const playerFilterDict = new Map<IPlayer, boolean>();
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
        const gameConfig = war.getGcData();
        for (const tile of targetTileArray) {
            const newTileObjectType = data.getActDeleteTileObject()
                ? 0
                : (data.getActChangeTileObject()
                    ? (data.getActTileObjectType() ?? 0)
                    : tile.getObjectType()
                );
            const newTileObjectCfg = getTileObjectCfg(newTileObjectType);
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

            const tileData          = create({
                gridIndex   : tile.getGridIndex().toProto().toJson(),
                playerIndex : newTileObjectCfg.isNeutralOnly
                    ? PlayerIndex.Neutral
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
function checkIsMeetConPlayerFilter(resultDict: Map<IPlayer, boolean>, filter: PlayerFilter, player: IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, checkIsMeetPlayerFilter(filter, player));
    }
    return !!resultDict.get(player);
}
