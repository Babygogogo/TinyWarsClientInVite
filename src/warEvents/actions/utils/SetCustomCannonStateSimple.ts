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
import type * as ProtoSchemaCommonProtoWarEventWeaSetCustomCannonStateSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCannonStateSimple.ts";
import * as ProtoSchemaCommonProtoWarSerializationTileCustomCannonData from "../../../proto/schema/CommonProto/WarSerialization/TileCustomCannonData.ts";
import * as TilesConstantsCustomLimits from "../../../tiles/constants/CustomLimits.ts";
import * as TilesConstantsMapWeapon from "../../../tiles/constants/MapWeapon.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as TilesUtilsFilter from "../../../tiles/utils/Filter.ts";
import * as TilesUtilsSerialization from "../../../tiles/utils/Serialization.ts";
import * as UnitsUtilsFilter from "../../../units/utils/Filter.ts";
import * as ValueAndComparatorsUtils from "../../../valueAndComparators/Utils.ts";

type PlayerFilter                       = ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter;
type WeaSetCustomCannonStateSimple      = ProtoSchemaCommonProtoWarEventWeaSetCustomCannonStateSimple.WeaSetCustomCannonStateSimple;
type IPlayer                            = PlayersIPlayer.IPlayer;
type ITile                              = TilesITile.ITile;

export function checkIsValid(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomCannonStateSimple>, gameConfig: GameConfigGcData.GcData, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomCannonStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const actTextArray: string[] = [];
    {
        const act = data.getActRangeForUp();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.RangeUp));
        }
    }
    {
        const act = data.getActRangeForDown();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.RangeDown));
        }
    }
    {
        const act = data.getActRangeForLeft();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.RangeLeft));
        }
    }
    {
        const act = data.getActRangeForRight();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.RangeRight));
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
        const act = data.getActMaxTargetCount();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.MaxTargets));
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
        LangUtils.getText(LangConstants.TextType.MystCannon),
        actTextArray.join(`, `),
    );
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomCannonStateSimple>): string | null {
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
        const act = data.getActRangeForUp();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.RangeUp));
        }
    }
    {
        const act = data.getActRangeForDown();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.RangeDown));
        }
    }
    {
        const act = data.getActRangeForLeft();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.RangeLeft));
        }
    }
    {
        const act = data.getActRangeForRight();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.RangeRight));
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
        const act = data.getActMaxTargetCount();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.MaxTargets));
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
        LangUtils.getText(LangConstants.TextType.MystCannon),
        conTextArray.join(`\n`),
        LangUtils.getText(LangConstants.TextType.MystCannon),
        actTextArray.join(`, `),
    );
}

export function getErrorTip(data: WeaSetCustomCannonStateSimple, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): string | null {
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
        const act = data.getActRangeForUp();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.RangeUp));
        }
    }
    {
        const act = data.getActRangeForDown();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.RangeDown));
        }
    }
    {
        const act = data.getActRangeForLeft();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.RangeLeft));
        }
    }
    {
        const act = data.getActRangeForRight();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.RangeRight));
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
        const act = data.getActMaxTargetCount();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.MaxTargets));
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
        return LangUtils.getText(LangConstants.TextType.A0957);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetCustomCannonStateSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetCustomCannonStateSimple, isFastExecute: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const targetTileArray: ITile[] = [];
    {
        const unitMap           = war.getUnitMap();
        const conTileFilter     = action.getConTileFilter();
        const conPlayerFilter   = action.getConPlayerFilter();
        const conUnitFilter     = action.getConUnitFilter();
        const conUnitComparator = action.getConUnitComparator();
        const playerFilterDict  = new Map<IPlayer, boolean>();
        for (const tile of war.getTileMap().getAllTiles()) {
            if (tile.getMapWeaponType() !== TilesConstantsMapWeapon.TypeId.CustomCannon) {
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

    const dataDict = new Map<ITile, ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData>();
    {
        for (const tile of targetTileArray) {
            dataDict.set(tile, ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData.fromJson({
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
        resultDict.set(player, PlayersUtilsFilter.checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function evalActRangeForUp(action: WeaSetCustomCannonStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCannonData()?.getRangeForUp() ?? 0;
    const act           = action.getActRangeForUp();
    if (!act) {
        return defaultValue;
    }

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Cannon.RangeForUp.MinValue,
        maxValue    : TilesConstantsCustomLimits.Cannon.RangeForUp.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue),
    });
}
function evalActRangeForDown(action: WeaSetCustomCannonStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCannonData()?.getRangeForDown() ?? 0;
    const act           = action.getActRangeForDown();
    if (!act) {
        return defaultValue;
    }

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Cannon.RangeForDown.MinValue,
        maxValue    : TilesConstantsCustomLimits.Cannon.RangeForDown.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue),
    });
}
function evalActRangeForLeft(action: WeaSetCustomCannonStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCannonData()?.getRangeForLeft() ?? 0;
    const act           = action.getActRangeForLeft();
    if (!act) {
        return defaultValue;
    }

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Cannon.RangeForLeft.MinValue,
        maxValue    : TilesConstantsCustomLimits.Cannon.RangeForLeft.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue),
    });
}
function evalActRangeForRight(action: WeaSetCustomCannonStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCannonData()?.getRangeForRight() ?? 0;
    const act           = action.getActRangeForRight();
    if (!act) {
        return defaultValue;
    }

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Cannon.RangeForRight.MinValue,
        maxValue    : TilesConstantsCustomLimits.Cannon.RangeForRight.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue),
    });
}
function evalActPriority(action: WeaSetCustomCannonStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCannonData()?.getPriority() ?? 0;
    const act           = action.getActPriority();
    if (act == null) {
        return defaultValue;
    }

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Cannon.Priority.MinValue,
        maxValue    : TilesConstantsCustomLimits.Cannon.Priority.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue),
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

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Cannon.MaxTargetCount.MinValue,
        maxValue    : TilesConstantsCustomLimits.Cannon.MaxTargetCount.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue),
    });
}
function evalActOffsetHp(action: WeaSetCustomCannonStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCannonData()?.getOffsetHp() ?? 0;
    const act           = action.getActOffsetHp();
    if (!act) {
        return defaultValue;
    }

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Cannon.OffsetHp.MinValue,
        maxValue    : TilesConstantsCustomLimits.Cannon.OffsetHp.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue),
    });
}
function evalActOffsetFuelPercentage(action: WeaSetCustomCannonStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCannonData()?.getOffsetFuelPercentage() ?? 0;
    const act           = action.getActOffsetFuelPercentage();
    if (!act) {
        return defaultValue;
    }

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Cannon.OffsetFuelPercentage.MinValue,
        maxValue    : TilesConstantsCustomLimits.Cannon.OffsetFuelPercentage.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue),
    });
}
function evalActOffsetPrimaryAmmoPercentage(action: WeaSetCustomCannonStateSimple, tile: ITile): number {
    const defaultValue  = tile.getFinalCannonData()?.getOffsetPrimaryAmmoPercentage() ?? 0;
    const act           = action.getActOffsetPrimaryAmmoPercentage();
    if (!act) {
        return defaultValue;
    }

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Cannon.OffsetPrimaryAmmoPercentage.MinValue,
        maxValue    : TilesConstantsCustomLimits.Cannon.OffsetPrimaryAmmoPercentage.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue),
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
