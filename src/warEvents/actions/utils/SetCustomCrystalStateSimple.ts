import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GcData } from "../../../gameConfig/GcData.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText, getFormattedText } from "../../../lang/Utils.ts";
import { checkIsValid as MultiplierAndOffsetsUtilsCheckIsValid, getResultValue } from "../../../multiplierAndOffsets/Utils.ts";
import { getValueInRange } from "../../../numbers/Utils.ts";
import type { IPlayer as PlayersIPlayer } from "../../../players/IPlayer.ts";
import { getDescForEmbed, checkIsValid as PlayersUtilsFilterCheckIsValid, checkIsMeet } from "../../../players/utils/Filter.ts";
import type {
    PlayerFilter as ProtoSchemaCommonProtoStructurePlayerFilter,
} from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type {
    WeaSetCustomCrystalStateSimple as ProtoSchemaCommonProtoWarEventWeaSetCustomCrystalStateSimple,
} from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCrystalStateSimple.ts";
import { TileCustomCrystalData } from "../../../proto/schema/CommonProto/WarSerialization/TileCustomCrystalData.ts";
import { Crystal } from "../../../tiles/constants/CustomLimits.ts";
import { TypeId } from "../../../tiles/constants/MapWeapon.ts";
import type { ITile as TilesITile } from "../../../tiles/ITile.ts";
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
type WeaSetCustomCrystalStateSimple     = ProtoSchemaCommonProtoWarEventWeaSetCustomCrystalStateSimple;
type IPlayer                            = PlayersIPlayer;
type ITile                              = TilesITile;

export function checkIsValid(data: Undefinable<WeaSetCustomCrystalStateSimple>, gameConfig: GcData, mapSize: MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: Undefinable<WeaSetCustomCrystalStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const actTextArray: string[] = [];
    {
        const act = data.getActRadius();
        if (act != null) {
            actTextArray.push(getText(TextType.EffectiveRadius));
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
        const act = data.getActOffsetFund();
        if (act != null) {
            actTextArray.push(getText(TextType.FundOffset));
        }
    }
    {
        const act = data.getActOffsetEnergyPercentage();
        if (act != null) {
            actTextArray.push(getText(TextType.CoEnergyOffset$));
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
        getText(TextType.MystCrystal),
        actTextArray.join(`, `),
    );
}
export function getDetailDesc(data: Undefinable<WeaSetCustomCrystalStateSimple>): string | null {
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
        const act = data.getActRadius();
        if (act != null) {
            actTextArray.push(getText(TextType.EffectiveRadius));
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
        const act = data.getActOffsetFund();
        if (act != null) {
            actTextArray.push(getText(TextType.FundOffset));
        }
    }
    {
        const act = data.getActOffsetEnergyPercentage();
        if (act != null) {
            actTextArray.push(getText(TextType.CoEnergyOffset$));
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
        getText(TextType.MystCrystal),
        conTextArray.join(`\n`),
        getText(TextType.MystCrystal),
        actTextArray.join(`, `),
    );
}

export function getErrorTip(data: WeaSetCustomCrystalStateSimple, mapSize: MapSize, playersCountUnneutral: number, gameConfig: GcData): string | null {
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
        const act = data.getActRadius();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.EffectiveRadius));
        }
    }
    {
        const act = data.getActPriority();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
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
        const act = data.getActOffsetFund();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.FundOffset));
        }
    }
    {
        const act = data.getActOffsetEnergyPercentage();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.CoEnergyOffset$));
        }
    }
    {
        const act = data.getActOffsetHp();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitsHpOffset));
        }
    }
    {
        const act = data.getActOffsetFuelPercentage();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitsFuelOffset$));
        }
    }
    {
        const act = data.getActOffsetPrimaryAmmoPercentage();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitsPriAmmoOffset$));
        }
    }
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActCanBeFatal();
    }

    if (
        (data.getActRadius() == null)                        &&
        (data.getActPriority() == null)                      &&
        (data.getActCanAffectSelf() == null)                 &&
        (data.getActCanAffectAlly() == null)                 &&
        (data.getActCanAffectEnemy() == null)                &&
        (data.getActOffsetFund() == null)                    &&
        (data.getActOffsetEnergyPercentage() == null)        &&
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
export async function applyWithExtraData(_action: WeaSetCustomCrystalStateSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetCustomCrystalStateSimple, isFastExecute: boolean, war: IBwWar): Promise<void> {
    const targetTileArray: ITile[] = [];
    {
        const unitMap           = war.getUnitMap();
        const conTileFilter     = action.getConTileFilter();
        const conPlayerFilter   = action.getConPlayerFilter();
        const conUnitFilter     = action.getConUnitFilter();
        const conUnitComparator = action.getConUnitComparator();
        const playerFilterDict  = new Map<IPlayer, boolean>();
        for (const tile of war.getTileMap().getAllTiles()) {
            if (tile.getMapWeaponType() !== TypeId.CustomCrystal) {
                continue;
            }

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

    const dataDict = new Map<ITile, TileCustomCrystalData>();
    {
        for (const tile of targetTileArray) {
            dataDict.set(tile, TileCustomCrystalData.fromJson({
                radius                          : evalActRadius(action, tile),
                priority                        : evalActPriority(action, tile),
                canAffectSelf                   : evalActCanAffectSelf(action, tile),
                canAffectAlly                   : evalActCanAffectAlly(action, tile),
                canAffectEnemy                  : evalActCanAffectEnemy(action, tile),
                offsetFund                      : evalActOffsetFund(action, tile),
                offsetEnergyPercentage          : evalActOffsetEnergyPercentage(action, tile),
                offsetHp                        : evalActOffsetHp(action, tile),
                offsetFuelPercentage            : evalActOffsetFuelPercentage(action, tile),
                offsetPrimaryAmmoPercentage     : evalActOffsetPrimaryAmmoPercentage(action, tile),
                canBeFatal                      : evalActCanBeFatal(action, tile),
            }));
        }
    }

    {
        for (const [tile, tileCustomCrystalData] of dataDict) {
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
                customCrystalData       : tileCustomCrystalData.toJson(),
                customCannonData        : null,
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
        resultDict.set(player, checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function evalActRadius(action: WeaSetCustomCrystalStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCrystalData()?.getRadius() ?? 0;
    const act           = action.getActRadius();
    if (!act) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Crystal.Radius.MinValue,
        maxValue    : Crystal.Radius.MaxValue,
        rawValue    : getResultValue(act, defaultValue),
    });
}
function evalActPriority(action: WeaSetCustomCrystalStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCrystalData()?.getPriority() ?? 0;
    const act           = action.getActPriority();
    if (act == null) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Crystal.Priority.MinValue,
        maxValue    : Crystal.Priority.MaxValue,
        rawValue    : getResultValue(act, defaultValue),
    });
}
function evalActCanAffectSelf(action: WeaSetCustomCrystalStateSimple, tile: ITile): boolean {
    const defaultValue  = !!tile.getFinalCrystalData()?.getCanAffectSelf();
    const act           = action.getActCanAffectSelf();
    if (act == null) {
        return defaultValue;
    }

    return act;
}
function evalActCanAffectAlly(action: WeaSetCustomCrystalStateSimple, tile: ITile): boolean {
    const defaultValue  = !!tile.getFinalCrystalData()?.getCanAffectAlly();
    const act           = action.getActCanAffectAlly();
    if (act == null) {
        return defaultValue;
    }

    return act;
}
function evalActCanAffectEnemy(action: WeaSetCustomCrystalStateSimple, tile: ITile): boolean {
    const defaultValue  = !!tile.getFinalCrystalData()?.getCanAffectEnemy();
    const act           = action.getActCanAffectEnemy();
    if (act == null) {
        return defaultValue;
    }

    return act;
}
function evalActOffsetFund(action: WeaSetCustomCrystalStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCrystalData()?.getOffsetFund() ?? 0;
    const act           = action.getActOffsetFund();
    if (act == null) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Crystal.OffsetFund.MinValue,
        maxValue    : Crystal.OffsetFund.MaxValue,
        rawValue    : getResultValue(act, defaultValue),
    });
}
function evalActOffsetEnergyPercentage(action: WeaSetCustomCrystalStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCrystalData()?.getOffsetEnergyPercentage() ?? 0;
    const act           = action.getActOffsetEnergyPercentage();
    if (!act) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Crystal.OffsetEnergyPercentage.MinValue,
        maxValue    : Crystal.OffsetEnergyPercentage.MaxValue,
        rawValue    : getResultValue(act, defaultValue),
    });
}
function evalActOffsetHp(action: WeaSetCustomCrystalStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCrystalData()?.getOffsetHp() ?? 0;
    const act           = action.getActOffsetHp();
    if (!act) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Crystal.OffsetHp.MinValue,
        maxValue    : Crystal.OffsetHp.MaxValue,
        rawValue    : getResultValue(act, defaultValue),
    });
}
function evalActOffsetFuelPercentage(action: WeaSetCustomCrystalStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCrystalData()?.getOffsetFuelPercentage() ?? 0;
    const act           = action.getActOffsetFuelPercentage();
    if (!act) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Crystal.OffsetFuelPercentage.MinValue,
        maxValue    : Crystal.OffsetFuelPercentage.MaxValue,
        rawValue    : getResultValue(act, defaultValue),
    });
}
function evalActOffsetPrimaryAmmoPercentage(action: WeaSetCustomCrystalStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCrystalData()?.getOffsetPrimaryAmmoPercentage() ?? 0;
    const act           = action.getActOffsetPrimaryAmmoPercentage();
    if (!act) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Crystal.OffsetPrimaryAmmoPercentage.MinValue,
        maxValue    : Crystal.OffsetPrimaryAmmoPercentage.MaxValue,
        rawValue    : getResultValue(act, defaultValue),
    });
}
function evalActCanBeFatal(action: WeaSetCustomCrystalStateSimple, tile: ITile): boolean {
    const defaultValue  = !!tile.getFinalCrystalData()?.getCanBeFatal();
    const act           = action.getActCanBeFatal();
    if (act == null) {
        return defaultValue;
    }

    return act;
}
