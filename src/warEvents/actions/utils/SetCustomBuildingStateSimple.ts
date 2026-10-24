import * as ArrayModifiersUtils from "../../../arrayModifiers/Utils.ts";
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
import type * as ProtoSchemaCommonProtoWarEventWeaSetCustomBuildingStateSimple from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomBuildingStateSimple.ts";
import * as ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData from "../../../proto/schema/CommonProto/WarSerialization/TileCustomBuildingData.ts";
import * as TilesConstantsCustomLimits from "../../../tiles/constants/CustomLimits.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as TilesUtilsCommon from "../../../tiles/utils/Common.ts";
import * as TilesUtilsFilter from "../../../tiles/utils/Filter.ts";
import * as TilesUtilsSerialization from "../../../tiles/utils/Serialization.ts";
import * as UnitsUtilsFilter from "../../../units/utils/Filter.ts";
import * as ValueAndComparatorsUtils from "../../../valueAndComparators/Utils.ts";

type PlayerFilter                       = ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter;
type WeaSetCustomBuildingStateSimple    = ProtoSchemaCommonProtoWarEventWeaSetCustomBuildingStateSimple.WeaSetCustomBuildingStateSimple;
type Undefinable<T>                     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;
type IPlayer                            = PlayersIPlayer.IPlayer;
type ITile                              = TilesITile.ITile;

export function checkIsValid(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomBuildingStateSimple>, gameConfig: GameConfigGcData.GcData, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomBuildingStateSimple>): string | null {
    if (!data) {
        return null;
    }

    const actTextArray: string[] = [];
    {
        const act = data.getActDefenseAmount();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.DefBonus$));
        }
    }
    {
        const act = data.getActDefenseUnitTypeArray();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.DefensibleUnits));
        }
    }
    {
        const act1 = data.getActMaxCapturePoint();
        const act2 = data.getActDeleteMaxCapturePoint();
        if ((act1 != null) || (act2)) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.MaxCapturePoint));
        }
    }
    {
        const act = data.getActIsDefeatedOnCapture();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.DefeatIfCaptured));
        }
    }
    {
        const act1 = data.getActRepairNormalizedHp();
        const act2 = data.getActDeleteRepairNormalizedHp();
        if ((act1 != null) || (act2)) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.RepairHpAmount));
        }
    }
    {
        const act = data.getActRepairUnitTypeArray();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.RepairableUnits));
        }
    }
    {
        const act = data.getActIncomePerTurn();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.Income));
        }
    }
    {
        const act = data.getActVisionRange();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.VisionRange));
        }
    }
    {
        const act = data.getActIsVisionEnabledForAllPlayers();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.SharedVision));
        }
    }
    {
        const act = data.getActHideUnitTypeArray();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.HidableUnits));
        }
    }
    {
        const act = data.getActProduceUnitTypeArray();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.ProducibleUnits));
        }
    }
    {
        const act = data.getActGlobalAttackBonus();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.GlobalAtkBonus));
        }
    }
    {
        const act = data.getActGlobalDefenseBonus();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.GlobalDefBonus));
        }
    }
    {
        const act = data.getActUnitTypeArrayForCoBoard();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.CoBoardableUnit));
        }
    }
    {
        const act = data.getActBlockEnemyUnitTypeArray();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.BlockableEnemyUnits));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(LangUtils.getText(LangConstants.TextType.A0957));
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0254,
        LangUtils.getText(LangConstants.TextType.MystBuilding),
        actTextArray.join(`, `),
    );
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomBuildingStateSimple>): string | null {
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
        const act = data.getActDefenseAmount();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.DefBonus$));
        }
    }
    {
        const act = data.getActDefenseUnitTypeArray();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.DefensibleUnits));
        }
    }
    {
        const act1 = data.getActMaxCapturePoint();
        const act2 = data.getActDeleteMaxCapturePoint();
        if ((act1 != null) || (act2)) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.MaxCapturePoint));
        }
    }
    {
        const act = data.getActIsDefeatedOnCapture();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.DefeatIfCaptured));
        }
    }
    {
        const act1 = data.getActRepairNormalizedHp();
        const act2 = data.getActDeleteRepairNormalizedHp();
        if ((act1 != null) || (act2)) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.RepairHpAmount));
        }
    }
    {
        const act = data.getActRepairUnitTypeArray();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.RepairableUnits));
        }
    }
    {
        const act = data.getActIncomePerTurn();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.Income));
        }
    }
    {
        const act = data.getActVisionRange();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.VisionRange));
        }
    }
    {
        const act = data.getActIsVisionEnabledForAllPlayers();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.SharedVision));
        }
    }
    {
        const act = data.getActHideUnitTypeArray();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.HidableUnits));
        }
    }
    {
        const act = data.getActProduceUnitTypeArray();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.ProducibleUnits));
        }
    }
    {
        const act = data.getActGlobalAttackBonus();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.GlobalAtkBonus));
        }
    }
    {
        const act = data.getActGlobalDefenseBonus();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.GlobalDefBonus));
        }
    }
    {
        const act = data.getActUnitTypeArrayForCoBoard();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.CoBoardableUnit));
        }
    }
    {
        const act = data.getActBlockEnemyUnitTypeArray();
        if (act != null) {
            actTextArray.push(LangUtils.getText(LangConstants.TextType.BlockableEnemyUnits));
        }
    }

    if (!actTextArray.length) {
        actTextArray.push(LangUtils.getText(LangConstants.TextType.A0957));
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0255,
        LangUtils.getText(LangConstants.TextType.MystBuilding),
        conTextArray.join(`\n`),
        LangUtils.getText(LangConstants.TextType.MystBuilding),
        actTextArray.join(`, `),
    );
}

export function getErrorTip(data: WeaSetCustomBuildingStateSimple, mapSize: AuxiliaryTypesMapSize.MapSize, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): string | null {
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
        const act = data.getActDefenseAmount();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.DefBonus$));
        }
    }
    {
        const act = data.getActDefenseUnitTypeArray();
        if ((act != null)                                                                               &&
            (!ArrayModifiersUtils.checkIsValid(act, new Set(gameConfig.getAllUnitTypeArray())))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.DefensibleUnits));
        }
    }
    {
        const act = data.getActMaxCapturePoint();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.MaxCapturePoint));
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
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.RepairHpAmount));
        }
    }
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActDeleteRepairNormalizedHp();
    }
    {
        const act = data.getActRepairUnitTypeArray();
        if ((act != null)                                                                               &&
            (!ArrayModifiersUtils.checkIsValid(act, new Set(gameConfig.getAllUnitTypeArray())))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.RepairableUnits));
        }
    }
    {
        const act = data.getActIncomePerTurn();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Income));
        }
    }
    {
        const act = data.getActVisionRange();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.VisionRange));
        }
    }
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const act = data.getActIsVisionEnabledForAllPlayers();
    }
    {
        const act = data.getActHideUnitTypeArray();
        if ((act != null)                                                                               &&
            (!ArrayModifiersUtils.checkIsValid(act, new Set(gameConfig.getAllUnitTypeArray())))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.HidableUnits));
        }
    }
    {
        const act = data.getActProduceUnitTypeArray();
        if ((act != null)                                                                               &&
            (!ArrayModifiersUtils.checkIsValid(act, new Set(gameConfig.getAllUnitTypeArray())))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.ProducibleUnits));
        }
    }
    {
        const act = data.getActGlobalAttackBonus();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.GlobalAtkBonus));
        }
    }
    {
        const act = data.getActGlobalDefenseBonus();
        if ((act != null)                                       &&
            (!MultiplierAndOffsetsUtils.checkIsValid(act))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.GlobalDefBonus));
        }
    }
    {
        const act = data.getActUnitTypeArrayForCoBoard();
        if ((act != null)                                                                               &&
            (!ArrayModifiersUtils.checkIsValid(act, new Set(gameConfig.getAllUnitTypeArray())))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.CoBoardableUnit));
        }
    }
    {
        const act = data.getActBlockEnemyUnitTypeArray();
        if ((act != null)                                                                               &&
            (!ArrayModifiersUtils.checkIsValid(act, new Set(gameConfig.getAllUnitTypeArray())))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.BlockableEnemyUnits));
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
        return LangUtils.getText(LangConstants.TextType.A0957);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetCustomBuildingStateSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetCustomBuildingStateSimple, isFastExecute: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
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

    const dataDict = new Map<ITile, ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData>();
    {
        for (const tile of targetTileArray) {
            dataDict.set(tile, ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData.fromJson({
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

                currentBuildPoint       : Math.min(tile.getCurrentBuildPoint(),     TilesUtilsCommon.getMaxBuildPoint(cfg, tileCustomBuildingData) ?? 0),
                currentCapturePoint     : Math.min(tile.getCurrentCapturePoint(),   TilesUtilsCommon.getMaxCapturePoint(cfg, tileCustomBuildingData) ?? 0),
                currentHp               : Math.min(tile.getCurrentHp(),             TilesUtilsCommon.getMaxHp(cfg, tileCustomBuildingData) ?? 0),

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
        resultDict.set(player, PlayersUtilsFilter.checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function evalActDefenseAmount(action: WeaSetCustomBuildingStateSimple, tile: ITile): number {
    const defaultValue  = tile.getDefenseAmount();
    const act           = action.getActDefenseAmount();
    if (!act) {
        return defaultValue;
    }

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Building.DefenseAmount.MinValue,
        maxValue    : TilesConstantsCustomLimits.Building.DefenseAmount.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue),
    });
}
function evalActDefenseUnitTypeArray(action: WeaSetCustomBuildingStateSimple, tile: ITile): number[] {
    const defaultValue  = tile.getDefenseUnitTypeArray() ?? [];
    const act           = action.getActDefenseUnitTypeArray();
    if (!act) {
        return defaultValue;
    }

    const gameConfig = tile.getGameConfig();
    return ArrayModifiersUtils.getResultValue(act, defaultValue).filter(v => gameConfig.checkIsValidUnitType(v));
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

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Building.MaxCapturePoint.MinValue,
        maxValue    : TilesConstantsCustomLimits.Building.MaxCapturePoint.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue ?? 0),
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

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Building.RepairNormalizedHp.MinValue,
        maxValue    : TilesConstantsCustomLimits.Building.RepairNormalizedHp.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue ?? 0),
    });
}
function evalActRepairUnitTypeArray(action: WeaSetCustomBuildingStateSimple, tile: ITile): number[] {
    const defaultValue  = tile.getRepairUnitTypeArray() ?? [];
    const act           = action.getActRepairUnitTypeArray();
    if (act == null) {
        return defaultValue;
    }

    const gameConfig = tile.getGameConfig();
    return ArrayModifiersUtils.getResultValue(act, defaultValue).filter(v => gameConfig.checkIsValidUnitType(v));
}
function evalActIncomePerTurn(action: WeaSetCustomBuildingStateSimple, tile: ITile): number {
    const defaultValue  = tile.getIncomePerTurn();
    const act           = action.getActIncomePerTurn();
    if (act == null) {
        return defaultValue;
    }

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Building.IncomePerTurn.MinValue,
        maxValue    : TilesConstantsCustomLimits.Building.IncomePerTurn.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue),
    });
}
function evalActVisionRange(action: WeaSetCustomBuildingStateSimple, tile: ITile): number {
    const defaultValue  = tile.getCfgVisionRange();
    const act           = action.getActVisionRange();
    if (act == null) {
        return defaultValue;
    }

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Building.VisionRange.MinValue,
        maxValue    : TilesConstantsCustomLimits.Building.VisionRange.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue),
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
    return ArrayModifiersUtils.getResultValue(act, defaultValue).filter(v => gameConfig.checkIsValidUnitType(v));
}
function evalActProduceUnitTypeArray(action: WeaSetCustomBuildingStateSimple, tile: ITile): number[] {
    const defaultValue  = tile.getRegularProducibleUnitTypeArray() ?? [];
    const act           = action.getActProduceUnitTypeArray();
    if (act == null) {
        return defaultValue;
    }

    const gameConfig = tile.getGameConfig();
    return ArrayModifiersUtils.getResultValue(act, defaultValue).filter(v => gameConfig.checkIsValidUnitType(v));
}
function evalActGlobalAttackBonus(action: WeaSetCustomBuildingStateSimple, tile: ITile): number {
    const defaultValue  = tile.getGlobalAttackBonus();
    const act           = action.getActGlobalAttackBonus();
    if (!act) {
        return defaultValue;
    }

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Building.GlobalAttackBonus.MinValue,
        maxValue    : TilesConstantsCustomLimits.Building.GlobalAttackBonus.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue),
    });
}
function evalActGlobalDefenseBonus(action: WeaSetCustomBuildingStateSimple, tile: ITile): number {
    const defaultValue  = tile.getGlobalDefenseBonus();
    const act           = action.getActGlobalDefenseBonus();
    if (!act) {
        return defaultValue;
    }

    return NumbersUtils.getValueInRange({
        minValue    : TilesConstantsCustomLimits.Building.GlobalDefenseBonus.MinValue,
        maxValue    : TilesConstantsCustomLimits.Building.GlobalDefenseBonus.MaxValue,
        rawValue    : MultiplierAndOffsetsUtils.getResultValue(act, defaultValue),
    });
}
function evalActUnitTypeArrayForCoBoard(action: WeaSetCustomBuildingStateSimple, tile: ITile): number[] {
    const defaultValue  = tile.getCoBoardUnitTypeArray() ?? [];
    const act           = action.getActUnitTypeArrayForCoBoard();
    if (act == null) {
        return defaultValue;
    }

    const gameConfig = tile.getGameConfig();
    return ArrayModifiersUtils.getResultValue(act, defaultValue).filter(v => gameConfig.checkIsValidUnitType(v));
}
function evalActBlockEnemyUnitTypeArray(action: WeaSetCustomBuildingStateSimple, tile: ITile): number[] {
    const defaultValue  = tile.getBlockEnemyUnitTypeArray() ?? [];
    const act           = action.getActBlockEnemyUnitTypeArray();
    if (act == null) {
        return defaultValue;
    }

    const gameConfig = tile.getGameConfig();
    return ArrayModifiersUtils.getResultValue(act, defaultValue).filter(v => gameConfig.checkIsValidUnitType(v));
}
