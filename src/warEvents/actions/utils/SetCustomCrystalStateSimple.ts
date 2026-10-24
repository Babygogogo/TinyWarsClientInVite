import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as MultiplierAndOffsetsUtils from "../../../multiplierAndOffsets/Utils.ts";
import * as NumbersUtils from "../../../numbers/Utils.ts";
import type * as PlayersIPlayer from "../../../players/IPlayer.ts";
import * as PlayersUtilsFilter from "../../../players/utils/Filter.ts";
import type * as ProtoSchemaCommonProtoStructurePlayerFilter from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetCustomCrystalStateSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCrystalStateSimple.ts";
import * as ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData from "../../../proto/schema/CommonProto/WarSerialization/TileCustomCrystalData.ts";
import * as TilesConstantsCustomLimits from "../../../tiles/constants/CustomLimits.ts";
import * as TilesConstantsMapWeapon from "../../../tiles/constants/MapWeapon.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as TilesUtilsFilter from "../../../tiles/utils/Filter.ts";
import * as TilesUtilsSerialization from "../../../tiles/utils/Serialization.ts";
import * as UnitsUtilsFilter from "../../../units/utils/Filter.ts";
import * as ValueAndComparatorsUtils from "../../../valueAndComparators/Utils.ts";

type PlayerFilter                       = ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter;
type WeaSetCustomCrystalStateSimple     = ProtoSchemaCommonProtoWarEventWeaSetCustomCrystalStateSimple.WeaSetCustomCrystalStateSimple;
type IPlayer                            = PlayersIPlayer.IPlayer;
type ITile                              = TilesITile.ITile;

export function checkIsValid(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomCrystalStateSimple>, gameConfig: GameConfigGcData.GcData, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomCrystalStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const actTextArray: string[] = [];
    {
        const act = data.getActRadius();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.EffectiveRadius));
        }
    }
    {
        const act = data.getActPriority();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.Priority));
        }
    }
    {
        const act = data.getActCanAffectSelf();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.AffectOwner));
        }
    }
    {
        const act = data.getActCanAffectAlly();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.AffectAlly));
        }
    }
    {
        const act = data.getActCanAffectEnemy();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.AffectEnemy));
        }
    }
    {
        const act = data.getActOffsetFund();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.FundOffset));
        }
    }
    {
        const act = data.getActOffsetEnergyPercentage();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.CoEnergyOffset$));
        }
    }
    {
        const act = data.getActOffsetHp();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.UnitsHpOffset));
        }
    }
    {
        const act = data.getActOffsetFuelPercentage();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.UnitsFuelOffset$));
        }
    }
    {
        const act = data.getActOffsetPrimaryAmmoPercentage();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.UnitsPriAmmoOffset$));
        }
    }
    {
        const act = data.getActCanBeFatal();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.CanBeFatal));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(LangUtils.getText(LangConstants.TextType.A0957));
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0254,
        LangUtils.getText(LangConstants.TextType.MystCrystal),
        actTextArray.join(`, `),
    );
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomCrystalStateSimple>): string | null {
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
        const act = data.getActRadius();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.EffectiveRadius));
        }
    }
    {
        const act = data.getActPriority();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.Priority));
        }
    }
    {
        const act = data.getActCanAffectSelf();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.AffectOwner));
        }
    }
    {
        const act = data.getActCanAffectAlly();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.AffectAlly));
        }
    }
    {
        const act = data.getActCanAffectEnemy();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.AffectEnemy));
        }
    }
    {
        const act = data.getActOffsetFund();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.FundOffset));
        }
    }
    {
        const act = data.getActOffsetEnergyPercentage();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.CoEnergyOffset$));
        }
    }
    {
        const act = data.getActOffsetHp();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.UnitsHpOffset));
        }
    }
    {
        const act = data.getActOffsetFuelPercentage();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.UnitsFuelOffset$));
        }
    }
    {
        const act = data.getActOffsetPrimaryAmmoPercentage();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.UnitsPriAmmoOffset$));
        }
    }
    {
        const act = data.getActCanBeFatal();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.CanBeFatal));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(LangUtils.getText(LangConstants.TextType.A0957));
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0255,
        LangUtils.getText(LangConstants.TextType.MystCrystal),
        conTextArray.join(`\n`),
        LangUtils.getText(LangConstants.TextType.MystCrystal),
        actTextArray.join(`, `),
    );
}

export function getErrorTip(data: WeaSetCustomCrystalStateSimple, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): string | null {
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
        const act = data.getActRadius();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.EffectiveRadius));
        }
    }
    {
        const act = data.getActPriority();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Priority));
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
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.FundOffset));
        }
    }
    {
        const act = data.getActOffsetEnergyPercentage();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.CoEnergyOffset$));
        }
    }
    {
        const act = data.getActOffsetHp();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitsHpOffset));
        }
    }
    {
        const act = data.getActOffsetFuelPercentage();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitsFuelOffset$));
        }
    }
    {
        const act = data.getActOffsetPrimaryAmmoPercentage();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitsPriAmmoOffset$));
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
        return LangUtils.getText(LangConstants.TextType.A0957);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetCustomCrystalStateSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetCustomCrystalStateSimple, isFastExecute: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const targetTileArray: ITile[] = [];
    {
        const unitMap           = war.getUnitMap();
        const conTileFilter     = action.getConTileFilter();
        const conPlayerFilter   = action.getConPlayerFilter();
        const conUnitFilter     = action.getConUnitFilter();
        const conUnitComparator = action.getConUnitComparator();
        const playerFilterDict  = new Map<IPlayer, boolean>();
        for (const tile of war.getTileMap().getAllTiles()) {
            if (tile.getMapWeaponType() !== TilesConstantsMapWeapon.TypeId.CustomCrystal) {
                continue;
            }

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

    const dataDict = new Map<ITile, ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData.TileCustomCrystalData>();
    {
        for (const tile of targetTileArray) {
            dataDict.set(tile, ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData.TileCustomCrystalData.fromJson({
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
            const newData   = TilesUtilsSerialization.create({
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
        resultDict.set(player, PlayersUtilsFilter.checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function evalActRadius(action: WeaSetCustomCrystalStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCrystalData()?.getRadius() ?? 0;
    const act           = action.getActRadius();
    if (!act) {
        return defaultValue;
    }

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Crystal.Radius.MinValue,
        maxValue    : TilesConstantsCustomLimits.Crystal.Radius.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue),
    });
}
function evalActPriority(action: WeaSetCustomCrystalStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCrystalData()?.getPriority() ?? 0;
    const act           = action.getActPriority();
    if (act == null) {
        return defaultValue;
    }

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Crystal.Priority.MinValue,
        maxValue    : TilesConstantsCustomLimits.Crystal.Priority.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue),
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

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Crystal.OffsetFund.MinValue,
        maxValue    : TilesConstantsCustomLimits.Crystal.OffsetFund.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue),
    });
}
function evalActOffsetEnergyPercentage(action: WeaSetCustomCrystalStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCrystalData()?.getOffsetEnergyPercentage() ?? 0;
    const act           = action.getActOffsetEnergyPercentage();
    if (!act) {
        return defaultValue;
    }

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Crystal.OffsetEnergyPercentage.MinValue,
        maxValue    : TilesConstantsCustomLimits.Crystal.OffsetEnergyPercentage.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue),
    });
}
function evalActOffsetHp(action: WeaSetCustomCrystalStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCrystalData()?.getOffsetHp() ?? 0;
    const act           = action.getActOffsetHp();
    if (!act) {
        return defaultValue;
    }

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Crystal.OffsetHp.MinValue,
        maxValue    : TilesConstantsCustomLimits.Crystal.OffsetHp.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue),
    });
}
function evalActOffsetFuelPercentage(action: WeaSetCustomCrystalStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCrystalData()?.getOffsetFuelPercentage() ?? 0;
    const act           = action.getActOffsetFuelPercentage();
    if (!act) {
        return defaultValue;
    }

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Crystal.OffsetFuelPercentage.MinValue,
        maxValue    : TilesConstantsCustomLimits.Crystal.OffsetFuelPercentage.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue),
    });
}
function evalActOffsetPrimaryAmmoPercentage(action: WeaSetCustomCrystalStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCrystalData()?.getOffsetPrimaryAmmoPercentage() ?? 0;
    const act           = action.getActOffsetPrimaryAmmoPercentage();
    if (!act) {
        return defaultValue;
    }

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Crystal.OffsetPrimaryAmmoPercentage.MinValue,
        maxValue    : TilesConstantsCustomLimits.Crystal.OffsetPrimaryAmmoPercentage.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue),
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
