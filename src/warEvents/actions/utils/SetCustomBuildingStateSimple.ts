import {
    Tiles_Constants_CustomLimits,
    Players_Utils_Filter,
    Tiles_Utils_Filter,
    Units_Utils_Filter,
    ValueAndComparators_Utils,
    ArrayModifiers_Utils,
    MultiplierAndOffsets_Utils,
    Tiles_Utils_Serialization,
    Lang_Utils,
    Tiles_Utils_Common,
    Numbers_Utils,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
    type Tiles_ITile,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { WeaSetCustomBuildingStateSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomBuildingStateSimple.ts";
import { TileCustomBuildingData } from "../../../proto/schema/CommonProto/WarSerialization/TileCustomBuildingData.ts";

export function checkIsValid(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomBuildingStateSimple>, gameConfig: GameConfigs_GameConfig.GameConfig, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomBuildingStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const actTextArray: string[] = [];
    {
        const act = data.getActDefenseAmount();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.DefBonus$));
        }
    }
    {
        const act = data.getActDefenseUnitTypeArray();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.DefensibleUnits));
        }
    }
    {
        const act1 = data.getActMaxCapturePoint();
        const act2 = data.getActDeleteMaxCapturePoint();
        if ((act1 != null) || (act2)) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.MaxCapturePoint));
        }
    }
    {
        const act = data.getActIsDefeatedOnCapture();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.DefeatIfCaptured));
        }
    }
    {
        const act1 = data.getActRepairNormalizedHp();
        const act2 = data.getActDeleteRepairNormalizedHp();
        if ((act1 != null) || (act2)) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.RepairHpAmount));
        }
    }
    {
        const act = data.getActRepairUnitTypeArray();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.RepairableUnits));
        }
    }
    {
        const act = data.getActIncomePerTurn();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.Income));
        }
    }
    {
        const act = data.getActVisionRange();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.VisionRange));
        }
    }
    {
        const act = data.getActIsVisionEnabledForAllPlayers();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.SharedVision));
        }
    }
    {
        const act = data.getActHideUnitTypeArray();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.HidableUnits));
        }
    }
    {
        const act = data.getActProduceUnitTypeArray();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.ProducibleUnits));
        }
    }
    {
        const act = data.getActGlobalAttackBonus();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.GlobalAtkBonus));
        }
    }
    {
        const act = data.getActGlobalDefenseBonus();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.GlobalDefBonus));
        }
    }
    {
        const act = data.getActUnitTypeArrayForCoBoard();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.CoBoardableUnit));
        }
    }
    {
        const act = data.getActBlockEnemyUnitTypeArray();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.BlockableEnemyUnits));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.A0957));
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0254,
        Lang_Utils.getText(Lang_Constants.TextType.MystBuilding),
        actTextArray.join(`, `),
    );
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomBuildingStateSimple>): string | null {
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
        const act = data.getActDefenseAmount();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.DefBonus$));
        }
    }
    {
        const act = data.getActDefenseUnitTypeArray();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.DefensibleUnits));
        }
    }
    {
        const act1 = data.getActMaxCapturePoint();
        const act2 = data.getActDeleteMaxCapturePoint();
        if ((act1 != null) || (act2)) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.MaxCapturePoint));
        }
    }
    {
        const act = data.getActIsDefeatedOnCapture();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.DefeatIfCaptured));
        }
    }
    {
        const act1 = data.getActRepairNormalizedHp();
        const act2 = data.getActDeleteRepairNormalizedHp();
        if ((act1 != null) || (act2)) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.RepairHpAmount));
        }
    }
    {
        const act = data.getActRepairUnitTypeArray();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.RepairableUnits));
        }
    }
    {
        const act = data.getActIncomePerTurn();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.Income));
        }
    }
    {
        const act = data.getActVisionRange();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.VisionRange));
        }
    }
    {
        const act = data.getActIsVisionEnabledForAllPlayers();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.SharedVision));
        }
    }
    {
        const act = data.getActHideUnitTypeArray();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.HidableUnits));
        }
    }
    {
        const act = data.getActProduceUnitTypeArray();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.ProducibleUnits));
        }
    }
    {
        const act = data.getActGlobalAttackBonus();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.GlobalAtkBonus));
        }
    }
    {
        const act = data.getActGlobalDefenseBonus();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.GlobalDefBonus));
        }
    }
    {
        const act = data.getActUnitTypeArrayForCoBoard();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.CoBoardableUnit));
        }
    }
    {
        const act = data.getActBlockEnemyUnitTypeArray();
        if (act != null) {
            actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.BlockableEnemyUnits));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.A0957));
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0255,
        Lang_Utils.getText(Lang_Constants.TextType.MystBuilding),
        conTextArray.join(`\n`),
        Lang_Utils.getText(Lang_Constants.TextType.MystBuilding),
        actTextArray.join(`, `),
    );
}

export function getErrorTip(data: WeaSetCustomBuildingStateSimple, mapSize: AuxiliaryTypes_MapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
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
        const act = data.getActDefenseAmount();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.DefBonus$));
        }
    }
    {
        const act = data.getActDefenseUnitTypeArray();
        if ((act != null)                                                                               &&
            (!ArrayModifiers_Utils.checkIsValid(act, new Set(gameConfig.getAllUnitTypeArray())))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.DefensibleUnits));
        }
    }
    {
        const act = data.getActMaxCapturePoint();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.MaxCapturePoint));
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
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.RepairHpAmount));
        }
    }
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActDeleteRepairNormalizedHp();
    }
    {
        const act = data.getActRepairUnitTypeArray();
        if ((act != null)                                                                               &&
            (!ArrayModifiers_Utils.checkIsValid(act, new Set(gameConfig.getAllUnitTypeArray())))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.RepairableUnits));
        }
    }
    {
        const act = data.getActIncomePerTurn();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Income));
        }
    }
    {
        const act = data.getActVisionRange();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.VisionRange));
        }
    }
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActIsVisionEnabledForAllPlayers();
    }
    {
        const act = data.getActHideUnitTypeArray();
        if ((act != null)                                                                               &&
            (!ArrayModifiers_Utils.checkIsValid(act, new Set(gameConfig.getAllUnitTypeArray())))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.HidableUnits));
        }
    }
    {
        const act = data.getActProduceUnitTypeArray();
        if ((act != null)                                                                               &&
            (!ArrayModifiers_Utils.checkIsValid(act, new Set(gameConfig.getAllUnitTypeArray())))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.ProducibleUnits));
        }
    }
    {
        const act = data.getActGlobalAttackBonus();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.GlobalAtkBonus));
        }
    }
    {
        const act = data.getActGlobalDefenseBonus();
        if ((act != null)                                       &&
            (!MultiplierAndOffsets_Utils.checkIsValid(act))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.GlobalDefBonus));
        }
    }
    {
        const act = data.getActUnitTypeArrayForCoBoard();
        if ((act != null)                                                                               &&
            (!ArrayModifiers_Utils.checkIsValid(act, new Set(gameConfig.getAllUnitTypeArray())))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.CoBoardableUnit));
        }
    }
    {
        const act = data.getActBlockEnemyUnitTypeArray();
        if ((act != null)                                                                               &&
            (!ArrayModifiers_Utils.checkIsValid(act, new Set(gameConfig.getAllUnitTypeArray())))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.BlockableEnemyUnits));
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
        return Lang_Utils.getText(Lang_Constants.TextType.A0957);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetCustomBuildingStateSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetCustomBuildingStateSimple, isFastExecute: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const targetTileArray: Tiles_ITile.ITile[] = [];
    {
        const unitMap           = war.getUnitMap();
        const conTileFilter     = action.getConTileFilter();
        const conPlayerFilter   = action.getConPlayerFilter();
        const conUnitFilter     = action.getConUnitFilter();
        const conUnitComparator = action.getConUnitComparator();
        const playerFilterDict  = new Map<Players_IPlayer.IPlayer, boolean>();
        for (const tile of war.getTileMap().getAllTiles()) {
            if (!tile.getIsCustomizableBuilding()) {
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

    const dataDict = new Map<Tiles_ITile.ITile, TileCustomBuildingData>();
    {
        for (const tile of targetTileArray) {
            dataDict.set(tile, TileCustomBuildingData.fromJson({
                defenseAmount                : evalActDefenseAmount(action, tile),
                isDefeatedOnCapture          : evalActIsDefeatedOnCapture(action, tile),
                incomePerTurn                : evalActIncomePerTurn(action, tile),
                visionRange                  : evalActVisionRange(action, tile),
                isVisionEnabledForAllPlayers : evalActIsVisionEnabledForAllPlayers(action, tile),
                globalAttackBonus            : evalActGlobalAttackBonus(action, tile),
                globalDefenseBonus           : evalActGlobalDefenseBonus(action, tile),
                defenseUnitTypeArray         : evalActDefenseUnitTypeArray(action, tile),
                maxCapturePoint              : evalActMaxCapturePoint(action, tile),
                repairNormalizedHp           : evalActRepairNormalizedHp(action, tile),
                repairUnitTypeArray          : evalActRepairUnitTypeArray(action, tile),
                hideUnitTypeArray            : evalActHideUnitTypeArray(action, tile),
                produceUnitTypeArray         : evalActProduceUnitTypeArray(action, tile),
                unitTypeArrayForCoBoard      : evalActUnitTypeArrayForCoBoard(action, tile),
                blockEnemyUnitTypeArray      : evalActBlockEnemyUnitTypeArray(action, tile),
            }));
        }
    }

    {
        for (const [tile, tileCustomBuildingData] of dataDict) {
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

                currentBuildPoint   : Math.min(tile.getCurrentBuildPoint(),     Tiles_Utils_Common.getMaxBuildPoint(cfg, tileCustomBuildingData) ?? 0),
                currentCapturePoint : Math.min(tile.getCurrentCapturePoint(),   Tiles_Utils_Common.getMaxCapturePoint(cfg, tileCustomBuildingData) ?? 0),
                currentHp           : Math.min(tile.getCurrentHp(),             Tiles_Utils_Common.getMaxHp(cfg, tileCustomBuildingData) ?? 0),

                customBuildingData    : tileCustomBuildingData.toJson(),
                customCrystalData     : null,
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
function evalActDefenseAmount(action: WeaSetCustomBuildingStateSimple, tile: Tiles_ITile.ITile): number {
    const defaultValue  = tile.getDefenseAmount();
    const act           = action.getActDefenseAmount();
    if (!act) {
        return defaultValue;
    }

    return Numbers_Utils.getValueInRange({
        minValue : Tiles_Constants_CustomLimits.Building.DefenseAmount.MinValue,
        maxValue : Tiles_Constants_CustomLimits.Building.DefenseAmount.MaxValue,
        rawValue : MultiplierAndOffsets_Utils.getResultValue(act, defaultValue),
    });
}
function evalActDefenseUnitTypeArray(action: WeaSetCustomBuildingStateSimple, tile: Tiles_ITile.ITile): number[] {
    const defaultValue  = tile.getDefenseUnitTypeArray() ?? [];
    const act           = action.getActDefenseUnitTypeArray();
    if (!act) {
        return defaultValue;
    }

    const gameConfig = tile.getGameConfig();
    return ArrayModifiers_Utils.getResultValue(act, defaultValue).filter(v => gameConfig.checkIsValidUnitType(v));
}
function evalActMaxCapturePoint(action: WeaSetCustomBuildingStateSimple, tile: Tiles_ITile.ITile): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
    if (action.getActDeleteMaxCapturePoint()) {
        return null;
    }

    const defaultValue  = tile.getMaxCapturePoint();
    const act           = action.getActMaxCapturePoint();
    if (act == null) {
        return defaultValue;
    }

    return Numbers_Utils.getValueInRange({
        minValue : Tiles_Constants_CustomLimits.Building.MaxCapturePoint.MinValue,
        maxValue : Tiles_Constants_CustomLimits.Building.MaxCapturePoint.MaxValue,
        rawValue : MultiplierAndOffsets_Utils.getResultValue(act, defaultValue ?? 0),
    });
}
function evalActIsDefeatedOnCapture(action: WeaSetCustomBuildingStateSimple, tile: Tiles_ITile.ITile): boolean {
    const defaultValue  = tile.getIsDefeatedOnCapture();
    const act           = action.getActIsDefeatedOnCapture();
    if (act == null) {
        return defaultValue;
    }

    return act;
}
function evalActRepairNormalizedHp(action: WeaSetCustomBuildingStateSimple, tile: Tiles_ITile.ITile): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
    if (action.getActDeleteRepairNormalizedHp()) {
        return null;
    }

    const defaultValue  = tile.getRepairNormalizedHp();
    const act           = action.getActRepairNormalizedHp();
    if (act == null) {
        return defaultValue;
    }

    return Numbers_Utils.getValueInRange({
        minValue : Tiles_Constants_CustomLimits.Building.RepairNormalizedHp.MinValue,
        maxValue : Tiles_Constants_CustomLimits.Building.RepairNormalizedHp.MaxValue,
        rawValue : MultiplierAndOffsets_Utils.getResultValue(act, defaultValue ?? 0),
    });
}
function evalActRepairUnitTypeArray(action: WeaSetCustomBuildingStateSimple, tile: Tiles_ITile.ITile): number[] {
    const defaultValue  = tile.getRepairUnitTypeArray() ?? [];
    const act           = action.getActRepairUnitTypeArray();
    if (act == null) {
        return defaultValue;
    }

    const gameConfig = tile.getGameConfig();
    return ArrayModifiers_Utils.getResultValue(act, defaultValue).filter(v => gameConfig.checkIsValidUnitType(v));
}
function evalActIncomePerTurn(action: WeaSetCustomBuildingStateSimple, tile: Tiles_ITile.ITile): number {
    const defaultValue  = tile.getIncomePerTurn();
    const act           = action.getActIncomePerTurn();
    if (act == null) {
        return defaultValue;
    }

    return Numbers_Utils.getValueInRange({
        minValue : Tiles_Constants_CustomLimits.Building.IncomePerTurn.MinValue,
        maxValue : Tiles_Constants_CustomLimits.Building.IncomePerTurn.MaxValue,
        rawValue : MultiplierAndOffsets_Utils.getResultValue(act, defaultValue),
    });
}
function evalActVisionRange(action: WeaSetCustomBuildingStateSimple, tile: Tiles_ITile.ITile): number {
    const defaultValue  = tile.getCfgVisionRange();
    const act           = action.getActVisionRange();
    if (act == null) {
        return defaultValue;
    }

    return Numbers_Utils.getValueInRange({
        minValue : Tiles_Constants_CustomLimits.Building.VisionRange.MinValue,
        maxValue : Tiles_Constants_CustomLimits.Building.VisionRange.MaxValue,
        rawValue : MultiplierAndOffsets_Utils.getResultValue(act, defaultValue),
    });
}
function evalActIsVisionEnabledForAllPlayers(action: WeaSetCustomBuildingStateSimple, tile: Tiles_ITile.ITile): boolean {
    const defaultValue  = tile.getIsVisionEnabledForAllPlayers();
    const act           = action.getActIsVisionEnabledForAllPlayers();
    if (act == null) {
        return defaultValue;
    }

    return act;
}
function evalActHideUnitTypeArray(action: WeaSetCustomBuildingStateSimple, tile: Tiles_ITile.ITile): number[] {
    const defaultValue  = tile.getHideUnitTypeArray() ?? [];
    const act           = action.getActHideUnitTypeArray();
    if (act == null) {
        return defaultValue;
    }

    const gameConfig = tile.getGameConfig();
    return ArrayModifiers_Utils.getResultValue(act, defaultValue).filter(v => gameConfig.checkIsValidUnitType(v));
}
function evalActProduceUnitTypeArray(action: WeaSetCustomBuildingStateSimple, tile: Tiles_ITile.ITile): number[] {
    const defaultValue  = tile.getRegularProducibleUnitTypeArray() ?? [];
    const act           = action.getActProduceUnitTypeArray();
    if (act == null) {
        return defaultValue;
    }

    const gameConfig = tile.getGameConfig();
    return ArrayModifiers_Utils.getResultValue(act, defaultValue).filter(v => gameConfig.checkIsValidUnitType(v));
}
function evalActGlobalAttackBonus(action: WeaSetCustomBuildingStateSimple, tile: Tiles_ITile.ITile): number {
    const defaultValue  = tile.getGlobalAttackBonus();
    const act           = action.getActGlobalAttackBonus();
    if (!act) {
        return defaultValue;
    }

    return Numbers_Utils.getValueInRange({
        minValue : Tiles_Constants_CustomLimits.Building.GlobalAttackBonus.MinValue,
        maxValue : Tiles_Constants_CustomLimits.Building.GlobalAttackBonus.MaxValue,
        rawValue : MultiplierAndOffsets_Utils.getResultValue(act, defaultValue),
    });
}
function evalActGlobalDefenseBonus(action: WeaSetCustomBuildingStateSimple, tile: Tiles_ITile.ITile): number {
    const defaultValue  = tile.getGlobalDefenseBonus();
    const act           = action.getActGlobalDefenseBonus();
    if (!act) {
        return defaultValue;
    }

    return Numbers_Utils.getValueInRange({
        minValue : Tiles_Constants_CustomLimits.Building.GlobalDefenseBonus.MinValue,
        maxValue : Tiles_Constants_CustomLimits.Building.GlobalDefenseBonus.MaxValue,
        rawValue : MultiplierAndOffsets_Utils.getResultValue(act, defaultValue),
    });
}
function evalActUnitTypeArrayForCoBoard(action: WeaSetCustomBuildingStateSimple, tile: Tiles_ITile.ITile): number[] {
    const defaultValue  = tile.getCoBoardUnitTypeArray() ?? [];
    const act           = action.getActUnitTypeArrayForCoBoard();
    if (act == null) {
        return defaultValue;
    }

    const gameConfig = tile.getGameConfig();
    return ArrayModifiers_Utils.getResultValue(act, defaultValue).filter(v => gameConfig.checkIsValidUnitType(v));
}
function evalActBlockEnemyUnitTypeArray(action: WeaSetCustomBuildingStateSimple, tile: Tiles_ITile.ITile): number[] {
    const defaultValue  = tile.getBlockEnemyUnitTypeArray() ?? [];
    const act           = action.getActBlockEnemyUnitTypeArray();
    if (act == null) {
        return defaultValue;
    }

    const gameConfig = tile.getGameConfig();
    return ArrayModifiers_Utils.getResultValue(act, defaultValue).filter(v => gameConfig.checkIsValidUnitType(v));
}
