import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import { TextType } from "../../../lang/Constants.ts";
import {
    getText,
    getFormattedText,
} from "../../../lang/Utils.ts";
import {
    checkIsValid as checkIsValidMultiplierAndOffset,
    getResultValue,
} from "../../../multiplierAndOffsets/Utils.ts";
import { getValueInRange } from "../../../numbers/Utils.ts";
import type { IPlayer } from "../../../players/IPlayer.ts";
import {
    getDescForEmbed as getPlayersDescForEmbed,
    checkIsValid as checkIsValidPlayerFilter,
    checkIsMeet as checkIsMeetPlayerFilter,
} from "../../../players/utils/Filter.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { WeaSetCustomCannonStateSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCannonStateSimple.ts";
import { TileCustomCannonData } from "../../../proto/schema/CommonProto/WarSerialization/TileCustomCannonData.ts";
import { Cannon } from "../../../tiles/constants/CustomLimits.ts";
import { TypeId } from "../../../tiles/constants/MapWeapon.ts";
import type { ITile } from "../../../tiles/ITile.ts";
import {
    getDescForEmbed as getTilesDescForEmbed,
    checkIsValid as checkIsValidTileFilter,
    checkIsMeet as checkIsMeetTileFilter,
} from "../../../tiles/utils/Filter.ts";
import { create } from "../../../tiles/utils/Serialization.ts";
import {
    checkIsValid as checkIsValidUnitFilter,
    checkIsMeet as checkIsMeetUnitFilter,
} from "../../../units/utils/Filter.ts";
import {
    getDesc,
    checkIsValid as checkIsValidValueAndComparator,
    checkIsMeet as checkIsMeetValueAndComparator,
} from "../../../valueAndComparators/Utils.ts";

export function checkIsValid(data: Undefinable<WeaSetCustomCannonStateSimple>, gameConfig: GameConfig, mapSize: MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: Undefinable<WeaSetCustomCannonStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const actTextArray: string[] = [];
    {
        const act = data.getActRangeForUp();
        if (act != null) {
            actTextArray.push(getText(TextType.RangeUp));
        }
    }
    {
        const act = data.getActRangeForDown();
        if (act != null) {
            actTextArray.push(getText(TextType.RangeDown));
        }
    }
    {
        const act = data.getActRangeForLeft();
        if (act != null) {
            actTextArray.push(getText(TextType.RangeLeft));
        }
    }
    {
        const act = data.getActRangeForRight();
        if (act != null) {
            actTextArray.push(getText(TextType.RangeRight));
        }
    }
    {
        const act = data.getActPriority();
        if (act != null) {
            actTextArray.push(getText(TextType.Priority));
        }
    }
    {
        const act = data.getActCanAffectSelf();
        if (act != null) {
            actTextArray.push(getText(TextType.AffectOwner));
        }
    }
    {
        const act = data.getActCanAffectAlly();
        if (act != null) {
            actTextArray.push(getText(TextType.AffectAlly));
        }
    }
    {
        const act = data.getActCanAffectEnemy();
        if (act != null) {
            actTextArray.push(getText(TextType.AffectEnemy));
        }
    }
    {
        const act = data.getActMaxTargetCount();
        if (act != null) {
            actTextArray.push(getText(TextType.MaxTargets));
        }
    }
    {
        const act = data.getActOffsetHp();
        if (act != null) {
            actTextArray.push(getText(TextType.UnitsHpOffset));
        }
    }
    {
        const act = data.getActOffsetFuelPercentage();
        if (act != null) {
            actTextArray.push(getText(TextType.UnitsFuelOffset$));
        }
    }
    {
        const act = data.getActOffsetPrimaryAmmoPercentage();
        if (act != null) {
            actTextArray.push(getText(TextType.UnitsPriAmmoOffset$));
        }
    }
    {
        const act = data.getActCanBeFatal();
        if (act != null) {
            actTextArray.push(getText(TextType.CanBeFatal));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(getText(TextType.A0957));
    }

    return getFormattedText(
        TextType.F0254,
        getText(TextType.MystCannon),
        actTextArray.join(`, `),
    );
}
export function getDetailDesc(data: Undefinable<WeaSetCustomCannonStateSimple>): string | null {
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
        const act = data.getActRangeForUp();
        if (act != null) {
            actTextArray.push(getText(TextType.RangeUp));
        }
    }
    {
        const act = data.getActRangeForDown();
        if (act != null) {
            actTextArray.push(getText(TextType.RangeDown));
        }
    }
    {
        const act = data.getActRangeForLeft();
        if (act != null) {
            actTextArray.push(getText(TextType.RangeLeft));
        }
    }
    {
        const act = data.getActRangeForRight();
        if (act != null) {
            actTextArray.push(getText(TextType.RangeRight));
        }
    }
    {
        const act = data.getActPriority();
        if (act != null) {
            actTextArray.push(getText(TextType.Priority));
        }
    }
    {
        const act = data.getActCanAffectSelf();
        if (act != null) {
            actTextArray.push(getText(TextType.AffectOwner));
        }
    }
    {
        const act = data.getActCanAffectAlly();
        if (act != null) {
            actTextArray.push(getText(TextType.AffectAlly));
        }
    }
    {
        const act = data.getActCanAffectEnemy();
        if (act != null) {
            actTextArray.push(getText(TextType.AffectEnemy));
        }
    }
    {
        const act = data.getActMaxTargetCount();
        if (act != null) {
            actTextArray.push(getText(TextType.MaxTargets));
        }
    }
    {
        const act = data.getActOffsetHp();
        if (act != null) {
            actTextArray.push(getText(TextType.UnitsHpOffset));
        }
    }
    {
        const act = data.getActOffsetFuelPercentage();
        if (act != null) {
            actTextArray.push(getText(TextType.UnitsFuelOffset$));
        }
    }
    {
        const act = data.getActOffsetPrimaryAmmoPercentage();
        if (act != null) {
            actTextArray.push(getText(TextType.UnitsPriAmmoOffset$));
        }
    }
    {
        const act = data.getActCanBeFatal();
        if (act != null) {
            actTextArray.push(getText(TextType.CanBeFatal));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(getText(TextType.A0957));
    }

    return getFormattedText(
        TextType.F0255,
        getText(TextType.MystCannon),
        conTextArray.join(`\n`),
        getText(TextType.MystCannon),
        actTextArray.join(`, `),
    );
}

export function getErrorTip(data: WeaSetCustomCannonStateSimple, mapSize: MapSize, playersCountUnneutral: number, gameConfig: GameConfig): string | null {
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
        const act = data.getActRangeForUp();
        if ((act != null)                                       &&
            (!checkIsValidMultiplierAndOffset(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.RangeUp));
        }
    }
    {
        const act = data.getActRangeForDown();
        if ((act != null)                                       &&
            (!checkIsValidMultiplierAndOffset(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.RangeDown));
        }
    }
    {
        const act = data.getActRangeForLeft();
        if ((act != null)                                       &&
            (!checkIsValidMultiplierAndOffset(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.RangeLeft));
        }
    }
    {
        const act = data.getActRangeForRight();
        if ((act != null)                                       &&
            (!checkIsValidMultiplierAndOffset(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.RangeRight));
        }
    }
    {
        const act = data.getActPriority();
        if ((act != null)                                       &&
            (!checkIsValidMultiplierAndOffset(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.Priority));
        }
    }
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActCanAffectSelf();
    }
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActCanAffectAlly();
    }
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActCanAffectEnemy();
    }
    {
        const act = data.getActMaxTargetCount();
        if ((act != null)                                       &&
            (!checkIsValidMultiplierAndOffset(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.MaxTargets));
        }
    }
    {
        const act = data.getActOffsetHp();
        if ((act != null)                                       &&
            (!checkIsValidMultiplierAndOffset(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitsHpOffset));
        }
    }
    {
        const act = data.getActOffsetFuelPercentage();
        if ((act != null)                                       &&
            (!checkIsValidMultiplierAndOffset(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitsFuelOffset$));
        }
    }
    {
        const act = data.getActOffsetPrimaryAmmoPercentage();
        if ((act != null)                                       &&
            (!checkIsValidMultiplierAndOffset(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitsPriAmmoOffset$));
        }
    }
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActCanBeFatal();
    }

    if (
        (data.getActRangeForUp() == null)                    &&
        (data.getActRangeForDown() == null)                  &&
        (data.getActRangeForLeft() == null)                  &&
        (data.getActRangeForRight() == null)                 &&
        (data.getActPriority() == null)                      &&
        (data.getActCanAffectSelf() == null)                 &&
        (data.getActCanAffectAlly() == null)                 &&
        (data.getActCanAffectEnemy() == null)                &&
        (data.getActMaxTargetCount() == null)                &&
        (data.getActOffsetHp() == null)                      &&
        (data.getActOffsetFuelPercentage() == null)          &&
        (data.getActOffsetPrimaryAmmoPercentage() == null)   &&
        (data.getActCanBeFatal() == null)
    ) {
        return getText(TextType.A0957);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetCustomCannonStateSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetCustomCannonStateSimple, isFastExecute: boolean, war: IBwWar): Promise<void> {
    const targetTileArray: ITile[] = [];
    {
        const unitMap           = war.getUnitMap();
        const conTileFilter     = action.getConTileFilter();
        const conPlayerFilter   = action.getConPlayerFilter();
        const conUnitFilter     = action.getConUnitFilter();
        const conUnitComparator = action.getConUnitComparator();
        const playerFilterDict  = new Map<IPlayer, boolean>();
        for (const tile of war.getTileMap().getAllTiles()) {
            if (tile.getMapWeaponType() !== TypeId.CustomCannon) {
                continue;
            }

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

    const dataDict = new Map<ITile, TileCustomCannonData>();
    {
        for (const tile of targetTileArray) {
            dataDict.set(tile, TileCustomCannonData.fromJson({
                rangeForUp                      : evalActRangeForUp(action, tile),
                rangeForDown                    : evalActRangeForDown(action, tile),
                rangeForLeft                    : evalActRangeForLeft(action, tile),
                rangeForRight                   : evalActRangeForRight(action, tile),
                priority                        : evalActPriority(action, tile),
                canAffectSelf                   : evalActCanAffectSelf(action, tile),
                canAffectAlly                   : evalActCanAffectAlly(action, tile),
                canAffectEnemy                  : evalActCanAffectEnemy(action, tile),
                maxTargetCount                  : evalActMaxTargetCount(action, tile),
                offsetHp                        : evalActOffsetHp(action, tile),
                offsetFuelPercentage            : evalActOffsetFuelPercentage(action, tile),
                offsetPrimaryAmmoPercentage     : evalActOffsetPrimaryAmmoPercentage(action, tile),
                canBeFatal                      : evalActCanBeFatal(action, tile),
            }));
        }
    }

    {
        for (const [tile, tileCustomCannonData] of dataDict) {
            const cfg       = tile.getTemplateCfg();
            const newData   = create({
                gridIndex               : tile.getGridIndex().toProto().toJson(),
                playerIndex             : tile.getPlayerIndex(),
                baseType                : tile.getBaseType(),
                baseShapeId             : tile.getBaseShapeId(),
                decorationType          : tile.getDecorationType(),
                decorationShapeId       : tile.getDecorationShapeId(),
                objectType              : tile.getObjectType(),
                objectShapeId           : tile.getObjectShapeId(),

                customNameId            : tile.getCustomNameId() ?? null,
                unfixedBuffArray        : tile.getUnfixedBuffList().map(v => v.toJson()),
                groupedLocationIdArray  : tile.getGroupedLocationIdArray(),
                isHighlighted           : tile.getIsHighlighted(),

                currentBuildPoint       : Math.min(tile.getCurrentBuildPoint(),     cfg.getMaxBuildPoint() ?? 0),
                currentCapturePoint     : Math.min(tile.getCurrentCapturePoint(),   cfg.getMaxCapturePoint() ?? 0),
                currentHp               : Math.min(tile.getCurrentHp(),             cfg.getMaxHp() ?? 0),

                customBuildingData      : null,
                customCrystalData       : null,
                customCannonData        : tileCustomCannonData.toJson(),
                customLaserTurretData   : null,
            });

            tile.init(newData, tile.getGameConfig());
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
function evalActRangeForUp(action: WeaSetCustomCannonStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCannonData()?.getRangeForUp() ?? 0;
    const act           = action.getActRangeForUp();
    if (!act) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Cannon.RangeForUp.MinValue,
        maxValue    : Cannon.RangeForUp.MaxValue,
        rawValue    : getResultValue(act, defaultValue),
    });
}
function evalActRangeForDown(action: WeaSetCustomCannonStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCannonData()?.getRangeForDown() ?? 0;
    const act           = action.getActRangeForDown();
    if (!act) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Cannon.RangeForDown.MinValue,
        maxValue    : Cannon.RangeForDown.MaxValue,
        rawValue    : getResultValue(act, defaultValue),
    });
}
function evalActRangeForLeft(action: WeaSetCustomCannonStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCannonData()?.getRangeForLeft() ?? 0;
    const act           = action.getActRangeForLeft();
    if (!act) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Cannon.RangeForLeft.MinValue,
        maxValue    : Cannon.RangeForLeft.MaxValue,
        rawValue    : getResultValue(act, defaultValue),
    });
}
function evalActRangeForRight(action: WeaSetCustomCannonStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCannonData()?.getRangeForRight() ?? 0;
    const act           = action.getActRangeForRight();
    if (!act) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Cannon.RangeForRight.MinValue,
        maxValue    : Cannon.RangeForRight.MaxValue,
        rawValue    : getResultValue(act, defaultValue),
    });
}
function evalActPriority(action: WeaSetCustomCannonStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCannonData()?.getPriority() ?? 0;
    const act           = action.getActPriority();
    if (act == null) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Cannon.Priority.MinValue,
        maxValue    : Cannon.Priority.MaxValue,
        rawValue    : getResultValue(act, defaultValue),
    });
}
function evalActCanAffectSelf(action: WeaSetCustomCannonStateSimple, tile: ITile): boolean {
    const defaultValue  = !!tile.getFinalCannonData()?.getCanAffectSelf();
    const act           = action.getActCanAffectSelf();
    if (act == null) {
        return defaultValue;
    }

    return act;
}
function evalActCanAffectAlly(action: WeaSetCustomCannonStateSimple, tile: ITile): boolean {
    const defaultValue  = !!tile.getFinalCannonData()?.getCanAffectAlly();
    const act           = action.getActCanAffectAlly();
    if (act == null) {
        return defaultValue;
    }

    return act;
}
function evalActCanAffectEnemy(action: WeaSetCustomCannonStateSimple, tile: ITile): boolean {
    const defaultValue  = !!tile.getFinalCannonData()?.getCanAffectEnemy();
    const act           = action.getActCanAffectEnemy();
    if (act == null) {
        return defaultValue;
    }

    return act;
}
function evalActMaxTargetCount(action: WeaSetCustomCannonStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCannonData()?.getMaxTargetCount() ?? 0;
    const act           = action.getActMaxTargetCount();
    if (!act) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Cannon.MaxTargetCount.MinValue,
        maxValue    : Cannon.MaxTargetCount.MaxValue,
        rawValue    : getResultValue(act, defaultValue),
    });
}
function evalActOffsetHp(action: WeaSetCustomCannonStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCannonData()?.getOffsetHp() ?? 0;
    const act           = action.getActOffsetHp();
    if (!act) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Cannon.OffsetHp.MinValue,
        maxValue    : Cannon.OffsetHp.MaxValue,
        rawValue    : getResultValue(act, defaultValue),
    });
}
function evalActOffsetFuelPercentage(action: WeaSetCustomCannonStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCannonData()?.getOffsetFuelPercentage() ?? 0;
    const act           = action.getActOffsetFuelPercentage();
    if (!act) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Cannon.OffsetFuelPercentage.MinValue,
        maxValue    : Cannon.OffsetFuelPercentage.MaxValue,
        rawValue    : getResultValue(act, defaultValue),
    });
}
function evalActOffsetPrimaryAmmoPercentage(action: WeaSetCustomCannonStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCannonData()?.getOffsetPrimaryAmmoPercentage() ?? 0;
    const act           = action.getActOffsetPrimaryAmmoPercentage();
    if (!act) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Cannon.OffsetPrimaryAmmoPercentage.MinValue,
        maxValue    : Cannon.OffsetPrimaryAmmoPercentage.MaxValue,
        rawValue    : getResultValue(act, defaultValue),
    });
}
function evalActCanBeFatal(action: WeaSetCustomCannonStateSimple, tile: ITile): boolean {
    const defaultValue  = !!tile.getFinalCannonData()?.getCanBeFatal();
    const act           = action.getActCanBeFatal();
    if (act == null) {
        return defaultValue;
    }

    return act;
}
