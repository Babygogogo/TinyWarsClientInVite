import { checkIsValid as ArrayModifiersUtilsCheckIsValid, getResultValue } from "../../../arrayModifiers/Utils.ts";
import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GcData } from "../../../gameConfig/GcData.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText, getFormattedText } from "../../../lang/Utils.ts";
import {
    checkIsValid as MultiplierAndOffsetsUtilsCheckIsValid,
    getResultValue as MultiplierAndOffsetsUtilsGetResultValue,
} from "../../../multiplierAndOffsets/Utils.ts";
import { getValueInRange } from "../../../numbers/Utils.ts";
import type { IPlayer } from "../../../players/IPlayer.ts";
import { getDescForEmbed, checkIsValid as PlayersUtilsFilterCheckIsValid, checkIsMeet } from "../../../players/utils/Filter.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { WeaSetCustomBuildingStateSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomBuildingStateSimple.ts";
import { TileCustomBuildingData } from "../../../proto/schema/CommonProto/WarSerialization/TileCustomBuildingData.ts";
import { Building } from "../../../tiles/constants/CustomLimits.ts";
import type { ITile } from "../../../tiles/ITile.ts";
import { getMaxBuildPoint, getMaxCapturePoint, getMaxHp } from "../../../tiles/utils/Common.ts";
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

export function checkIsValid(data: Undefinable<WeaSetCustomBuildingStateSimple>, gameConfig: GcData, mapSize: MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: Undefinable<WeaSetCustomBuildingStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const actTextArray: string[] = [];
    {
        const act = data.getActDefenseAmount();
        if (act != null) {
            actTextArray.push(getText(TextType.DefBonus$));
        }
    }
    {
        const act = data.getActDefenseUnitTypeArray();
        if (act != null) {
            actTextArray.push(getText(TextType.DefensibleUnits));
        }
    }
    {
        const act1 = data.getActMaxCapturePoint();
        const act2 = data.getActDeleteMaxCapturePoint();
        if ((act1 != null) || (act2)) {
            actTextArray.push(getText(TextType.MaxCapturePoint));
        }
    }
    {
        const act = data.getActIsDefeatedOnCapture();
        if (act != null) {
            actTextArray.push(getText(TextType.DefeatIfCaptured));
        }
    }
    {
        const act1 = data.getActRepairNormalizedHp();
        const act2 = data.getActDeleteRepairNormalizedHp();
        if ((act1 != null) || (act2)) {
            actTextArray.push(getText(TextType.RepairHpAmount));
        }
    }
    {
        const act = data.getActRepairUnitTypeArray();
        if (act != null) {
            actTextArray.push(getText(TextType.RepairableUnits));
        }
    }
    {
        const act = data.getActIncomePerTurn();
        if (act != null) {
            actTextArray.push(getText(TextType.Income));
        }
    }
    {
        const act = data.getActVisionRange();
        if (act != null) {
            actTextArray.push(getText(TextType.VisionRange));
        }
    }
    {
        const act = data.getActIsVisionEnabledForAllPlayers();
        if (act != null) {
            actTextArray.push(getText(TextType.SharedVision));
        }
    }
    {
        const act = data.getActHideUnitTypeArray();
        if (act != null) {
            actTextArray.push(getText(TextType.HidableUnits));
        }
    }
    {
        const act = data.getActProduceUnitTypeArray();
        if (act != null) {
            actTextArray.push(getText(TextType.ProducibleUnits));
        }
    }
    {
        const act = data.getActGlobalAttackBonus();
        if (act != null) {
            actTextArray.push(getText(TextType.GlobalAtkBonus));
        }
    }
    {
        const act = data.getActGlobalDefenseBonus();
        if (act != null) {
            actTextArray.push(getText(TextType.GlobalDefBonus));
        }
    }
    {
        const act = data.getActUnitTypeArrayForCoBoard();
        if (act != null) {
            actTextArray.push(getText(TextType.CoBoardableUnit));
        }
    }
    {
        const act = data.getActBlockEnemyUnitTypeArray();
        if (act != null) {
            actTextArray.push(getText(TextType.BlockableEnemyUnits));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(getText(TextType.A0957));
    }

    return getFormattedText(
        TextType.F0254,
        getText(TextType.MystBuilding),
        actTextArray.join(`, `),
    );
}
export function getDetailDesc(data: Undefinable<WeaSetCustomBuildingStateSimple>): string | null {
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
        const act = data.getActDefenseAmount();
        if (act != null) {
            actTextArray.push(getText(TextType.DefBonus$));
        }
    }
    {
        const act = data.getActDefenseUnitTypeArray();
        if (act != null) {
            actTextArray.push(getText(TextType.DefensibleUnits));
        }
    }
    {
        const act1 = data.getActMaxCapturePoint();
        const act2 = data.getActDeleteMaxCapturePoint();
        if ((act1 != null) || (act2)) {
            actTextArray.push(getText(TextType.MaxCapturePoint));
        }
    }
    {
        const act = data.getActIsDefeatedOnCapture();
        if (act != null) {
            actTextArray.push(getText(TextType.DefeatIfCaptured));
        }
    }
    {
        const act1 = data.getActRepairNormalizedHp();
        const act2 = data.getActDeleteRepairNormalizedHp();
        if ((act1 != null) || (act2)) {
            actTextArray.push(getText(TextType.RepairHpAmount));
        }
    }
    {
        const act = data.getActRepairUnitTypeArray();
        if (act != null) {
            actTextArray.push(getText(TextType.RepairableUnits));
        }
    }
    {
        const act = data.getActIncomePerTurn();
        if (act != null) {
            actTextArray.push(getText(TextType.Income));
        }
    }
    {
        const act = data.getActVisionRange();
        if (act != null) {
            actTextArray.push(getText(TextType.VisionRange));
        }
    }
    {
        const act = data.getActIsVisionEnabledForAllPlayers();
        if (act != null) {
            actTextArray.push(getText(TextType.SharedVision));
        }
    }
    {
        const act = data.getActHideUnitTypeArray();
        if (act != null) {
            actTextArray.push(getText(TextType.HidableUnits));
        }
    }
    {
        const act = data.getActProduceUnitTypeArray();
        if (act != null) {
            actTextArray.push(getText(TextType.ProducibleUnits));
        }
    }
    {
        const act = data.getActGlobalAttackBonus();
        if (act != null) {
            actTextArray.push(getText(TextType.GlobalAtkBonus));
        }
    }
    {
        const act = data.getActGlobalDefenseBonus();
        if (act != null) {
            actTextArray.push(getText(TextType.GlobalDefBonus));
        }
    }
    {
        const act = data.getActUnitTypeArrayForCoBoard();
        if (act != null) {
            actTextArray.push(getText(TextType.CoBoardableUnit));
        }
    }
    {
        const act = data.getActBlockEnemyUnitTypeArray();
        if (act != null) {
            actTextArray.push(getText(TextType.BlockableEnemyUnits));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(getText(TextType.A0957));
    }

    return getFormattedText(
        TextType.F0255,
        getText(TextType.MystBuilding),
        conTextArray.join(`\n`),
        getText(TextType.MystBuilding),
        actTextArray.join(`, `),
    );
}

export function getErrorTip(data: WeaSetCustomBuildingStateSimple, mapSize: MapSize, playersCountUnneutral: number, gameConfig: GcData): string | null {
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
        const act = data.getActDefenseAmount();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.DefBonus$));
        }
    }
    {
        const act = data.getActDefenseUnitTypeArray();
        if ((act != null)                                                                               &&
            (!ArrayModifiersUtilsCheckIsValid(act, new Set(gameConfig.getAllUnitTypeArray())))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.DefensibleUnits));
        }
    }
    {
        const act = data.getActMaxCapturePoint();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.MaxCapturePoint));
        }
    }
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActDeleteMaxCapturePoint();
    }
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActIsDefeatedOnCapture();
    }
    {
        const act = data.getActRepairNormalizedHp();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.RepairHpAmount));
        }
    }
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActDeleteRepairNormalizedHp();
    }
    {
        const act = data.getActRepairUnitTypeArray();
        if ((act != null)                                                                               &&
            (!ArrayModifiersUtilsCheckIsValid(act, new Set(gameConfig.getAllUnitTypeArray())))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.RepairableUnits));
        }
    }
    {
        const act = data.getActIncomePerTurn();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.Income));
        }
    }
    {
        const act = data.getActVisionRange();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.VisionRange));
        }
    }
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActIsVisionEnabledForAllPlayers();
    }
    {
        const act = data.getActHideUnitTypeArray();
        if ((act != null)                                                                               &&
            (!ArrayModifiersUtilsCheckIsValid(act, new Set(gameConfig.getAllUnitTypeArray())))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.HidableUnits));
        }
    }
    {
        const act = data.getActProduceUnitTypeArray();
        if ((act != null)                                                                               &&
            (!ArrayModifiersUtilsCheckIsValid(act, new Set(gameConfig.getAllUnitTypeArray())))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.ProducibleUnits));
        }
    }
    {
        const act = data.getActGlobalAttackBonus();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.GlobalAtkBonus));
        }
    }
    {
        const act = data.getActGlobalDefenseBonus();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtilsCheckIsValid(act))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.GlobalDefBonus));
        }
    }
    {
        const act = data.getActUnitTypeArrayForCoBoard();
        if ((act != null)                                                                               &&
            (!ArrayModifiersUtilsCheckIsValid(act, new Set(gameConfig.getAllUnitTypeArray())))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.CoBoardableUnit));
        }
    }
    {
        const act = data.getActBlockEnemyUnitTypeArray();
        if ((act != null)                                                                               &&
            (!ArrayModifiersUtilsCheckIsValid(act, new Set(gameConfig.getAllUnitTypeArray())))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.BlockableEnemyUnits));
        }
    }

    if (
        (data.getActDefenseAmount() == null)                 &&
        (data.getActDefenseUnitTypeArray() == null)          &&
        (data.getActMaxCapturePoint() == null)               &&
        (!data.getActDeleteMaxCapturePoint())                &&
        (data.getActIsDefeatedOnCapture() == null)           &&
        (data.getActRepairNormalizedHp() == null)            &&
        (!data.getActDeleteRepairNormalizedHp())             &&
        (data.getActRepairUnitTypeArray() == null)           &&
        (data.getActIncomePerTurn() == null)                 &&
        (data.getActVisionRange() == null)                   &&
        (data.getActIsVisionEnabledForAllPlayers() == null)  &&
        (data.getActHideUnitTypeArray() == null)             &&
        (data.getActProduceUnitTypeArray() == null)          &&
        (data.getActGlobalAttackBonus() == null)             &&
        (data.getActGlobalDefenseBonus() == null)            &&
        (data.getActUnitTypeArrayForCoBoard() == null)       &&
        (data.getActBlockEnemyUnitTypeArray() == null)
    ) {
        return getText(TextType.A0957);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetCustomBuildingStateSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetCustomBuildingStateSimple, isFastExecute: boolean, war: IBwWar): Promise<void> {
    const targetTileArray: ITile[] = [];
    {
        const unitMap           = war.getUnitMap();
        const conTileFilter     = action.getConTileFilter();
        const conPlayerFilter   = action.getConPlayerFilter();
        const conUnitFilter     = action.getConUnitFilter();
        const conUnitComparator = action.getConUnitComparator();
        const playerFilterDict  = new Map<IPlayer, boolean>();
        for (const tile of war.getTileMap().getAllTiles()) {
            if (!tile.getIsCustomizableBuilding()) {
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

    const dataDict = new Map<ITile, TileCustomBuildingData>();
    {
        for (const tile of targetTileArray) {
            dataDict.set(tile, TileCustomBuildingData.fromJson({
                defenseAmount                 : evalActDefenseAmount(action, tile),
                isDefeatedOnCapture           : evalActIsDefeatedOnCapture(action, tile),
                incomePerTurn                 : evalActIncomePerTurn(action, tile),
                visionRange                   : evalActVisionRange(action, tile),
                isVisionEnabledForAllPlayers  : evalActIsVisionEnabledForAllPlayers(action, tile),
                globalAttackBonus             : evalActGlobalAttackBonus(action, tile),
                globalDefenseBonus            : evalActGlobalDefenseBonus(action, tile),
                defenseUnitTypeArray          : evalActDefenseUnitTypeArray(action, tile),
                maxCapturePoint               : evalActMaxCapturePoint(action, tile),
                repairNormalizedHp            : evalActRepairNormalizedHp(action, tile),
                repairUnitTypeArray           : evalActRepairUnitTypeArray(action, tile),
                hideUnitTypeArray             : evalActHideUnitTypeArray(action, tile),
                produceUnitTypeArray          : evalActProduceUnitTypeArray(action, tile),
                unitTypeArrayForCoBoard       : evalActUnitTypeArrayForCoBoard(action, tile),
                blockEnemyUnitTypeArray       : evalActBlockEnemyUnitTypeArray(action, tile),
            }));
        }
    }

    {
        for (const [tile, tileCustomBuildingData] of dataDict) {
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

                currentBuildPoint       : Math.min(tile.getCurrentBuildPoint(),     getMaxBuildPoint(cfg, tileCustomBuildingData) ?? 0),
                currentCapturePoint     : Math.min(tile.getCurrentCapturePoint(),   getMaxCapturePoint(cfg, tileCustomBuildingData) ?? 0),
                currentHp               : Math.min(tile.getCurrentHp(),             getMaxHp(cfg, tileCustomBuildingData) ?? 0),

                customBuildingData      : tileCustomBuildingData.toJson(),
                customCrystalData       : null,
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
function evalActDefenseAmount(action: WeaSetCustomBuildingStateSimple, tile: ITile): number {
    const defaultValue  = tile.getDefenseAmount();
    const act           = action.getActDefenseAmount();
    if (!act) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Building.DefenseAmount.MinValue,
        maxValue    : Building.DefenseAmount.MaxValue,
        rawValue    : MultiplierAndOffsetsUtilsGetResultValue(act, defaultValue),
    });
}
function evalActDefenseUnitTypeArray(action: WeaSetCustomBuildingStateSimple, tile: ITile): number[] {
    const defaultValue  = tile.getDefenseUnitTypeArray() ?? [];
    const act           = action.getActDefenseUnitTypeArray();
    if (!act) {
        return defaultValue;
    }

    const gameConfig = tile.getGameConfig();
    return getResultValue(act, defaultValue).filter(v => gameConfig.checkIsValidUnitType(v));
}
function evalActMaxCapturePoint(action: WeaSetCustomBuildingStateSimple, tile: ITile): Undefinable<number> {
    if (action.getActDeleteMaxCapturePoint()) {
        return null;
    }

    const defaultValue  = tile.getMaxCapturePoint();
    const act           = action.getActMaxCapturePoint();
    if (act == null) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Building.MaxCapturePoint.MinValue,
        maxValue    : Building.MaxCapturePoint.MaxValue,
        rawValue    : MultiplierAndOffsetsUtilsGetResultValue(act, defaultValue ?? 0),
    });
}
function evalActIsDefeatedOnCapture(action: WeaSetCustomBuildingStateSimple, tile: ITile): boolean {
    const defaultValue  = tile.getIsDefeatedOnCapture();
    const act           = action.getActIsDefeatedOnCapture();
    if (act == null) {
        return defaultValue;
    }

    return act;
}
function evalActRepairNormalizedHp(action: WeaSetCustomBuildingStateSimple, tile: ITile): Undefinable<number> {
    if (action.getActDeleteRepairNormalizedHp()) {
        return null;
    }

    const defaultValue  = tile.getRepairNormalizedHp();
    const act           = action.getActRepairNormalizedHp();
    if (act == null) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Building.RepairNormalizedHp.MinValue,
        maxValue    : Building.RepairNormalizedHp.MaxValue,
        rawValue    : MultiplierAndOffsetsUtilsGetResultValue(act, defaultValue ?? 0),
    });
}
function evalActRepairUnitTypeArray(action: WeaSetCustomBuildingStateSimple, tile: ITile): number[] {
    const defaultValue  = tile.getRepairUnitTypeArray() ?? [];
    const act           = action.getActRepairUnitTypeArray();
    if (act == null) {
        return defaultValue;
    }

    const gameConfig = tile.getGameConfig();
    return getResultValue(act, defaultValue).filter(v => gameConfig.checkIsValidUnitType(v));
}
function evalActIncomePerTurn(action: WeaSetCustomBuildingStateSimple, tile: ITile): number {
    const defaultValue  = tile.getIncomePerTurn();
    const act           = action.getActIncomePerTurn();
    if (act == null) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Building.IncomePerTurn.MinValue,
        maxValue    : Building.IncomePerTurn.MaxValue,
        rawValue    : MultiplierAndOffsetsUtilsGetResultValue(act, defaultValue),
    });
}
function evalActVisionRange(action: WeaSetCustomBuildingStateSimple, tile: ITile): number {
    const defaultValue  = tile.getCfgVisionRange();
    const act           = action.getActVisionRange();
    if (act == null) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Building.VisionRange.MinValue,
        maxValue    : Building.VisionRange.MaxValue,
        rawValue    : MultiplierAndOffsetsUtilsGetResultValue(act, defaultValue),
    });
}
function evalActIsVisionEnabledForAllPlayers(action: WeaSetCustomBuildingStateSimple, tile: ITile): boolean {
    const defaultValue  = tile.getIsVisionEnabledForAllPlayers();
    const act           = action.getActIsVisionEnabledForAllPlayers();
    if (act == null) {
        return defaultValue;
    }

    return act;
}
function evalActHideUnitTypeArray(action: WeaSetCustomBuildingStateSimple, tile: ITile): number[] {
    const defaultValue  = tile.getHideUnitTypeArray() ?? [];
    const act           = action.getActHideUnitTypeArray();
    if (act == null) {
        return defaultValue;
    }

    const gameConfig = tile.getGameConfig();
    return getResultValue(act, defaultValue).filter(v => gameConfig.checkIsValidUnitType(v));
}
function evalActProduceUnitTypeArray(action: WeaSetCustomBuildingStateSimple, tile: ITile): number[] {
    const defaultValue  = tile.getRegularProducibleUnitTypeArray() ?? [];
    const act           = action.getActProduceUnitTypeArray();
    if (act == null) {
        return defaultValue;
    }

    const gameConfig = tile.getGameConfig();
    return getResultValue(act, defaultValue).filter(v => gameConfig.checkIsValidUnitType(v));
}
function evalActGlobalAttackBonus(action: WeaSetCustomBuildingStateSimple, tile: ITile): number {
    const defaultValue  = tile.getGlobalAttackBonus();
    const act           = action.getActGlobalAttackBonus();
    if (!act) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Building.GlobalAttackBonus.MinValue,
        maxValue    : Building.GlobalAttackBonus.MaxValue,
        rawValue    : MultiplierAndOffsetsUtilsGetResultValue(act, defaultValue),
    });
}
function evalActGlobalDefenseBonus(action: WeaSetCustomBuildingStateSimple, tile: ITile): number {
    const defaultValue  = tile.getGlobalDefenseBonus();
    const act           = action.getActGlobalDefenseBonus();
    if (!act) {
        return defaultValue;
    }

    return getValueInRange({
        minValue    : Building.GlobalDefenseBonus.MinValue,
        maxValue    : Building.GlobalDefenseBonus.MaxValue,
        rawValue    : MultiplierAndOffsetsUtilsGetResultValue(act, defaultValue),
    });
}
function evalActUnitTypeArrayForCoBoard(action: WeaSetCustomBuildingStateSimple, tile: ITile): number[] {
    const defaultValue  = tile.getCoBoardUnitTypeArray() ?? [];
    const act           = action.getActUnitTypeArrayForCoBoard();
    if (act == null) {
        return defaultValue;
    }

    const gameConfig = tile.getGameConfig();
    return getResultValue(act, defaultValue).filter(v => gameConfig.checkIsValidUnitType(v));
}
function evalActBlockEnemyUnitTypeArray(action: WeaSetCustomBuildingStateSimple, tile: ITile): number[] {
    const defaultValue  = tile.getBlockEnemyUnitTypeArray() ?? [];
    const act           = action.getActBlockEnemyUnitTypeArray();
    if (act == null) {
        return defaultValue;
    }

    const gameConfig = tile.getGameConfig();
    return getResultValue(act, defaultValue).filter(v => gameConfig.checkIsValidUnitType(v));
}
