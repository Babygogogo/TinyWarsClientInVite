import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { IBwWarStatisticsManager } from "../../../baseWar/interface/IBwWarStatisticsManager.ts";
import { Unit } from "../../../expressionParsers/contexts/Unit.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { NullableUnit } from "../../../expressionParsers/results/NullableUnit.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { encodeTeamIndex } from "../../../helpers/Team.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import { PlayerIndex } from "../../../players/Constants.ts";
import type {
    WeaSetUnitOwnershipExpr as ProtoSchemaCommonProtoWarEventWeaSetUnitOwnershipExpr,
} from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitOwnershipExpr.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type { IUnit as UnitsIUnit } from "../../../units/IUnit.ts";
import { getObserverTeamIndexListForUnitOnMap } from "../../../visibilities/Utils.ts";
import { ExpressionInfoDict } from "../constants/SetUnitOwnershipExpr.ts";

type WeaSetUnitOwnershipExpr    = ProtoSchemaCommonProtoWarEventWeaSetUnitOwnershipExpr;
type IUnit                      = UnitsIUnit;

export function checkIsValid(action: Undefinable<WeaSetUnitOwnershipExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getConUnitFilter(),
            expressionInfo          : ExpressionInfoDict.ConUnitFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActPlayerIndex(),
            expressionInfo          : ExpressionInfoDict.ActPlayerIndex,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaSetUnitOwnershipExpr>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0052, data.getConUnitFilter() ?? UndefinedError);
}
export function getDetailDesc(data: Undefinable<WeaSetUnitOwnershipExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActPlayerIndex()                     ? `${ExpressionInfoDict.ActPlayerIndex.getTitleText()}: ${data.getActPlayerIndex()}`                                         : null,
    ].filter(v => v != null).join(`\n`);

    return `${getFormattedText(TextType.F0052, data.getConUnitFilter() ?? UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetUnitOwnershipExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = ExpressionInfoDict.ConUnitFilter;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getConUnitFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActPlayerIndex;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActPlayerIndex(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForUnit(action: WeaSetUnitOwnershipExpr, unit: IUnit): boolean {
    try {
        const result = Parser.getParseResult(action.getConUnitFilter() ?? ``).eval(new Unit(new NullableUnit(unit.getWar(), unit)), false);
        return (result instanceof Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActPlayerIndex(action: WeaSetUnitOwnershipExpr, unit: IUnit): number | null {
    const act = action.getActPlayerIndex();
    if (!act) {
        return null;
    }

    try {
        const war       = unit.getWar();
        const epResult  = Parser.getParseResult(act).eval(new Unit(new NullableUnit(war, unit)), false);
        if (epResult instanceof Num) {
            const playerIndex = Math.floor(epResult.num);
            return (playerIndex != unit.getPlayerIndex()) && (playerIndex >= PlayerIndex.First) && (playerIndex <= war.getPlayerManager().getTotalPlayersCount(false))
                ? playerIndex : null;
        } else {
            return null;
        }

    } catch (Exception) {
        return null;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(action: WeaSetUnitOwnershipExpr): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetUnitOwnershipExpr, isFast: boolean, war: IBwWar): Promise<void> {
    const newPlayerIndexDict = new Map<IUnit, number>();
    for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
        if (!checkIsMeetConditionForUnit(action, unit)) {
            continue;
        }

        const newPlayerIndex = evalActPlayerIndex(action, unit);
        if (newPlayerIndex != null) {
            newPlayerIndexDict.set(unit, newPlayerIndex);
        }
    }

    applyNewUnitDataDict(newPlayerIndexDict, war, isFast);
}
function applyNewUnitDataDict(dict: Map<IUnit, number>, war: IBwWar, isFast: boolean): void {
    const unitMap                   = war.getUnitMap();
    const mapSize                   = unitMap.getMapSize();
    const observerTeamIndexesDict   = new Map<number, number[] | null>();
    for (const [unit] of dict) {
        const gridIndex   = unit.getGridIndex();
        const gridId      = gridIndex.getGridId(mapSize);
        if (!observerTeamIndexesDict.has(gridId)) {
            observerTeamIndexesDict.set(gridId, getObserverTeamIndexListForUnitOnMap({ war, gridIndex }));
        }
    }

    const warStatisticsManager  = war.getWarStatisticsManager();
    const isLoadedUnitVisible   = true;
    for (const [unit, newPlayerIndex] of dict) {
        const loadedUnits = unitMap.getUnitsLoadedByLoader(unit, true);
        const observerTeamIndexes   = observerTeamIndexesDict.get(unit.getGridIndex().getGridId(mapSize));
        if (observerTeamIndexes != null) {
            const groupedObserverTeamIndexes = encodeTeamIndex(observerTeamIndexes);
            updateWarStatisticsManager(warStatisticsManager, unit, newPlayerIndex, groupedObserverTeamIndexes);

            if (isLoadedUnitVisible) {
                for (const loadedUnit of loadedUnits) {
                    updateWarStatisticsManager(warStatisticsManager, loadedUnit, newPlayerIndex, groupedObserverTeamIndexes);
                }
            }
        }

        unit.setPlayerIndex(newPlayerIndex);
        for (const loadedUnit of loadedUnits) {
            loadedUnit.setPlayerIndex(newPlayerIndex);
        }

        if (!isFast) {
            unit.updateView();
        }
    }
}

function updateWarStatisticsManager(warStatisticsManager: IBwWarStatisticsManager, unit: IUnit, newPlayerIndex: number, groupedObserverTeamIndexes: number): void {
    const unitType      = unit.getUnitType();
    const normalizedHp  = unit.getNormalizedCurrentHp();
    warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
        unitType                    : unitType,
        dstPlayerIndex              : unit.getPlayerIndex(),
        normalizedHpGain            : 0,
        normalizedHpLoss            : normalizedHp,
        unitGain                    : 0,
        unitLoss                    : 1,
        groupedObserverTeamIndexes  : groupedObserverTeamIndexes
    }));
    warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
        unitType                    : unitType,
        dstPlayerIndex              : newPlayerIndex,
        normalizedHpGain            : normalizedHp,
        normalizedHpLoss            : 0,
        unitGain                    : 1,
        unitLoss                    : 0,
        groupedObserverTeamIndexes  : groupedObserverTeamIndexes
    }));
}
