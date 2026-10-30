import {
    Players_Utils_Filter,
    Tiles_Utils_Filter,
    Units_Utils_Filter,
    ValueAndComparators_Utils,
    MultiplierAndOffsets_Utils,
    Tiles_Utils_Serialization,
    Tiles_Constants_CustomLimits,
    Lang_Utils,
    Numbers_Utils,
    Lang_Constants,
    Tiles_Constants_MapWeapon,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
    type Tiles_ITile,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { WeaSetCustomCrystalStateSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCrystalStateSimple.ts";
import { TileCustomCrystalData } from "../../../proto/schema/CommonProto/WarSerialization/TileCustomCrystalData.ts";

export function checkIsValid(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomCrystalStateSimple>, gameConfig: GameConfigs_GameConfig.GameConfig, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomCrystalStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const actTextArray: string[] = [];
    {
        const act = data.getActRadius();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.EffectiveRadius));
        }
    }
    {
        const act = data.getActPriority();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.Priority));
        }
    }
    {
        const act = data.getActCanAffectSelf();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.AffectOwner));
        }
    }
    {
        const act = data.getActCanAffectAlly();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.AffectAlly));
        }
    }
    {
        const act = data.getActCanAffectEnemy();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.AffectEnemy));
        }
    }
    {
        const act = data.getActOffsetFund();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.FundOffset));
        }
    }
    {
        const act = data.getActOffsetEnergyPercentage();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.CoEnergyOffset$));
        }
    }
    {
        const act = data.getActOffsetHp();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.UnitsHpOffset));
        }
    }
    {
        const act = data.getActOffsetFuelPercentage();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.UnitsFuelOffset$));
        }
    }
    {
        const act = data.getActOffsetPrimaryAmmoPercentage();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.UnitsPriAmmoOffset$));
        }
    }
    {
        const act = data.getActCanBeFatal();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.CanBeFatal));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.A0957));
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0254,
        Lang_Utils.getText(Lang_Constants.TextType.MystCrystal),
        actTextArray.join(`, `),
    );
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomCrystalStateSimple>): string | null {
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
        const act = data.getActRadius();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.EffectiveRadius));
        }
    }
    {
        const act = data.getActPriority();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.Priority));
        }
    }
    {
        const act = data.getActCanAffectSelf();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.AffectOwner));
        }
    }
    {
        const act = data.getActCanAffectAlly();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.AffectAlly));
        }
    }
    {
        const act = data.getActCanAffectEnemy();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.AffectEnemy));
        }
    }
    {
        const act = data.getActOffsetFund();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.FundOffset));
        }
    }
    {
        const act = data.getActOffsetEnergyPercentage();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.CoEnergyOffset$));
        }
    }
    {
        const act = data.getActOffsetHp();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.UnitsHpOffset));
        }
    }
    {
        const act = data.getActOffsetFuelPercentage();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.UnitsFuelOffset$));
        }
    }
    {
        const act = data.getActOffsetPrimaryAmmoPercentage();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.UnitsPriAmmoOffset$));
        }
    }
    {
        const act = data.getActCanBeFatal();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.CanBeFatal));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.A0957));
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0255,
        Lang_Utils.getText(Lang_Constants.TextType.MystCrystal),
        conTextArray.join(`\n`),
        Lang_Utils.getText(Lang_Constants.TextType.MystCrystal),
        actTextArray.join(`, `),
    );
}

export function getErrorTip(data: WeaSetCustomCrystalStateSimple, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
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
        const act = data.getActRadius();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.EffectiveRadius));
        }
    }
    {
        const act = data.getActPriority();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Priority));
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
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.FundOffset));
        }
    }
    {
        const act = data.getActOffsetEnergyPercentage();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.CoEnergyOffset$));
        }
    }
    {
        const act = data.getActOffsetHp();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.UnitsHpOffset));
        }
    }
    {
        const act = data.getActOffsetFuelPercentage();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.UnitsFuelOffset$));
        }
    }
    {
        const act = data.getActOffsetPrimaryAmmoPercentage();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.UnitsPriAmmoOffset$));
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
        return Lang_Utils.getText(Lang_Constants.TextType.A0957);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetCustomCrystalStateSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetCustomCrystalStateSimple, isFastExecute: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const targetTileArray: Tiles_ITile.ITile[] = [];
    {
        const unitMap           = war.getUnitMap();
        const conTileFilter     = action.getConTileFilter();
        const conPlayerFilter   = action.getConPlayerFilter();
        const conUnitFilter     = action.getConUnitFilter();
        const conUnitComparator = action.getConUnitComparator();
        const playerFilterDict  = new Map<Players_IPlayer.IPlayer, boolean>();
        for (const tile of war.getTileMap().getAllTiles()) {
            if (tile.getMapWeaponType() !== Tiles_Constants_MapWeapon.TypeId.CustomCrystal) {
                continue;
            }

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

    const dataDict = new Map<Tiles_ITile.ITile, TileCustomCrystalData>();
    {
        for (const tile of targetTileArray) {
            dataDict.set(tile, TileCustomCrystalData.fromJson({
                radius                      : evalActRadius(action, tile),
                priority                    : evalActPriority(action, tile),
                canAffectSelf               : evalActCanAffectSelf(action, tile),
                canAffectAlly               : evalActCanAffectAlly(action, tile),
                canAffectEnemy              : evalActCanAffectEnemy(action, tile),
                offsetFund                  : evalActOffsetFund(action, tile),
                offsetEnergyPercentage      : evalActOffsetEnergyPercentage(action, tile),
                offsetHp                    : evalActOffsetHp(action, tile),
                offsetFuelPercentage        : evalActOffsetFuelPercentage(action, tile),
                offsetPrimaryAmmoPercentage : evalActOffsetPrimaryAmmoPercentage(action, tile),
                canBeFatal                  : evalActCanBeFatal(action, tile),
            }));
        }
    }

    {
        for (const [tile, tileCustomCrystalData] of dataDict) {
            const cfg       = tile.getTemplateCfg();
            const newData   = Tiles_Utils_Serialization.create({
                gridIndex         : tile.getGridIndex().toProto().toJson(),
                playerIndex       : tile.getPlayerIndex(),
                baseType          : tile.getBaseType(),
                baseShapeId       : tile.getBaseShapeId(),
                decorationType    : tile.getDecorationType(),
                decorationShapeId : tile.getDecorationShapeId(),
                objectType        : tile.getObjectType(),
                objectShapeId     : tile.getObjectShapeId(),

                customNameId           : tile.getCustomNameId() ?? null,
                unfixedBuffArray       : tile.getUnfixedBuffList().map(v => v.toJson()),
                groupedLocationIdArray : tile.getGroupedLocationIdArray(),
                isHighlighted          : tile.getIsHighlighted(),

                currentBuildPoint   : Math.min(tile.getCurrentBuildPoint(),     cfg.getMaxBuildPoint() ?? 0),
                currentCapturePoint : Math.min(tile.getCurrentCapturePoint(),   cfg.getMaxCapturePoint() ?? 0),
                currentHp           : Math.min(tile.getCurrentHp(),             cfg.getMaxHp() ?? 0),

                customBuildingData    : null,
                customCrystalData     : tileCustomCrystalData.toJson(),
                customCannonData      : null,
                customLaserTurretData : null,
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
function checkIsMeetConPlayerFilter(resultDict: Map<Players_IPlayer.IPlayer, boolean>, filter: PlayerFilter, player: Players_IPlayer.IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, Players_Utils_Filter.checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function evalActRadius(action: WeaSetCustomCrystalStateSimple, tile: Tiles_ITile.ITile): number {
    const defaultValue  = tile.getFinalCrystalData()?.getRadius() ?? 0;
    const act           = action.getActRadius();
    if (!act) {
        return defaultValue;
    }

    return Numbers_Utils.getValueInRange({
        minValue : Tiles_Constants_CustomLimits.Crystal.Radius.MinValue,
        maxValue : Tiles_Constants_CustomLimits.Crystal.Radius.MaxValue,
        rawValue : MultiplierAndOffsets_Utils.getResultValue(act, defaultValue),
    });
}
function evalActPriority(action: WeaSetCustomCrystalStateSimple, tile: Tiles_ITile.ITile): number {
    const defaultValue  = tile.getFinalCrystalData()?.getPriority() ?? 0;
    const act           = action.getActPriority();
    if (act == null) {
        return defaultValue;
    }

    return Numbers_Utils.getValueInRange({
        minValue : Tiles_Constants_CustomLimits.Crystal.Priority.MinValue,
        maxValue : Tiles_Constants_CustomLimits.Crystal.Priority.MaxValue,
        rawValue : MultiplierAndOffsets_Utils.getResultValue(act, defaultValue),
    });
}
function evalActCanAffectSelf(action: WeaSetCustomCrystalStateSimple, tile: Tiles_ITile.ITile): boolean {
    const defaultValue  = !!tile.getFinalCrystalData()?.getCanAffectSelf();
    const act           = action.getActCanAffectSelf();
    if (act == null) {
        return defaultValue;
    }

    return act;
}
function evalActCanAffectAlly(action: WeaSetCustomCrystalStateSimple, tile: Tiles_ITile.ITile): boolean {
    const defaultValue  = !!tile.getFinalCrystalData()?.getCanAffectAlly();
    const act           = action.getActCanAffectAlly();
    if (act == null) {
        return defaultValue;
    }

    return act;
}
function evalActCanAffectEnemy(action: WeaSetCustomCrystalStateSimple, tile: Tiles_ITile.ITile): boolean {
    const defaultValue  = !!tile.getFinalCrystalData()?.getCanAffectEnemy();
    const act           = action.getActCanAffectEnemy();
    if (act == null) {
        return defaultValue;
    }

    return act;
}
function evalActOffsetFund(action: WeaSetCustomCrystalStateSimple, tile: Tiles_ITile.ITile): number {
    const defaultValue  = tile.getFinalCrystalData()?.getOffsetFund() ?? 0;
    const act           = action.getActOffsetFund();
    if (act == null) {
        return defaultValue;
    }

    return Numbers_Utils.getValueInRange({
        minValue : Tiles_Constants_CustomLimits.Crystal.OffsetFund.MinValue,
        maxValue : Tiles_Constants_CustomLimits.Crystal.OffsetFund.MaxValue,
        rawValue : MultiplierAndOffsets_Utils.getResultValue(act, defaultValue),
    });
}
function evalActOffsetEnergyPercentage(action: WeaSetCustomCrystalStateSimple, tile: Tiles_ITile.ITile): number {
    const defaultValue  = tile.getFinalCrystalData()?.getOffsetEnergyPercentage() ?? 0;
    const act           = action.getActOffsetEnergyPercentage();
    if (!act) {
        return defaultValue;
    }

    return Numbers_Utils.getValueInRange({
        minValue : Tiles_Constants_CustomLimits.Crystal.OffsetEnergyPercentage.MinValue,
        maxValue : Tiles_Constants_CustomLimits.Crystal.OffsetEnergyPercentage.MaxValue,
        rawValue : MultiplierAndOffsets_Utils.getResultValue(act, defaultValue),
    });
}
function evalActOffsetHp(action: WeaSetCustomCrystalStateSimple, tile: Tiles_ITile.ITile): number {
    const defaultValue  = tile.getFinalCrystalData()?.getOffsetHp() ?? 0;
    const act           = action.getActOffsetHp();
    if (!act) {
        return defaultValue;
    }

    return Numbers_Utils.getValueInRange({
        minValue : Tiles_Constants_CustomLimits.Crystal.OffsetHp.MinValue,
        maxValue : Tiles_Constants_CustomLimits.Crystal.OffsetHp.MaxValue,
        rawValue : MultiplierAndOffsets_Utils.getResultValue(act, defaultValue),
    });
}
function evalActOffsetFuelPercentage(action: WeaSetCustomCrystalStateSimple, tile: Tiles_ITile.ITile): number {
    const defaultValue  = tile.getFinalCrystalData()?.getOffsetFuelPercentage() ?? 0;
    const act           = action.getActOffsetFuelPercentage();
    if (!act) {
        return defaultValue;
    }

    return Numbers_Utils.getValueInRange({
        minValue : Tiles_Constants_CustomLimits.Crystal.OffsetFuelPercentage.MinValue,
        maxValue : Tiles_Constants_CustomLimits.Crystal.OffsetFuelPercentage.MaxValue,
        rawValue : MultiplierAndOffsets_Utils.getResultValue(act, defaultValue),
    });
}
function evalActOffsetPrimaryAmmoPercentage(action: WeaSetCustomCrystalStateSimple, tile: Tiles_ITile.ITile): number {
    const defaultValue  = tile.getFinalCrystalData()?.getOffsetPrimaryAmmoPercentage() ?? 0;
    const act           = action.getActOffsetPrimaryAmmoPercentage();
    if (!act) {
        return defaultValue;
    }

    return Numbers_Utils.getValueInRange({
        minValue : Tiles_Constants_CustomLimits.Crystal.OffsetPrimaryAmmoPercentage.MinValue,
        maxValue : Tiles_Constants_CustomLimits.Crystal.OffsetPrimaryAmmoPercentage.MaxValue,
        rawValue : MultiplierAndOffsets_Utils.getResultValue(act, defaultValue),
    });
}
function evalActCanBeFatal(action: WeaSetCustomCrystalStateSimple, tile: Tiles_ITile.ITile): boolean {
    const defaultValue  = !!tile.getFinalCrystalData()?.getCanBeFatal();
    const act           = action.getActCanBeFatal();
    if (act == null) {
        return defaultValue;
    }

    return act;
}
