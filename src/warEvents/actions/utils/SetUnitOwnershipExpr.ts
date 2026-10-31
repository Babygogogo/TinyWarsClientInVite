import {
    Helpers_Team,
    WarEvents_Actions_Constants_SetUnitOwnershipExpr,
    Lang_Utils,
    Visibilities_Utils,
    ExpressionParsers_Results_NullableUnit,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Parser,
    Players_Constants,
    Lang_Constants,
    ExpressionParsers_Contexts_Unit,
    type BaseWar_Interface_IBwWar,
    type BaseWar_Interface_IBwWarStatisticsManager,
    type Units_Unit,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaSetUnitOwnershipExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitOwnershipExpr.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitOwnershipExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getConUnitFilter(),
            expressionInfo       : WarEvents_Actions_Constants_SetUnitOwnershipExpr.ExpressionInfoDict.ConUnitFilter,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActPlayerIndex(),
            expressionInfo       : WarEvents_Actions_Constants_SetUnitOwnershipExpr.ExpressionInfoDict.ActPlayerIndex,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitOwnershipExpr>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0052, data.getConUnitFilter() ?? Lang_Constants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitOwnershipExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActPlayerIndex()                     ? `${WarEvents_Actions_Constants_SetUnitOwnershipExpr.ExpressionInfoDict.ActPlayerIndex.getTitleText()}: ${data.getActPlayerIndex()}`                                         : null,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0052, data.getConUnitFilter() ?? Lang_Constants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetUnitOwnershipExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_SetUnitOwnershipExpr.ExpressionInfoDict.ConUnitFilter;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getConUnitFilter(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetUnitOwnershipExpr.ExpressionInfoDict.ActPlayerIndex;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActPlayerIndex(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForUnit(action: WeaSetUnitOwnershipExpr, unit: Units_Unit.Unit): boolean {
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(action.getConUnitFilter() ?? ``).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActPlayerIndex(action: WeaSetUnitOwnershipExpr, unit: Units_Unit.Unit): number | null {
    const act = action.getActPlayerIndex();
    if (!act) {
        return null;
    }

    try {
        const war       = unit.getWar();
        const epResult  = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(war, unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const playerIndex = Math.floor(epResult.num);
            return (playerIndex != unit.getPlayerIndex()) && (playerIndex >= Players_Constants.PlayerIndex.First) && (playerIndex <= war.getPlayerManager().getTotalPlayersCount(false))
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
export async function applyWithoutExtraData(action: WeaSetUnitOwnershipExpr, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const newPlayerIndexDict = new Map<Units_Unit.Unit, number>();
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
function applyNewUnitDataDict(dict: Map<Units_Unit.Unit, number>, war: BaseWar_Interface_IBwWar.IBwWar, isFast: boolean): void {
    const unitMap                   = war.getUnitMap();
    const mapSize                   = unitMap.getMapSize();
    const observerTeamIndexesDict   = new Map<number, number[] | null>();
    for (const [unit] of dict) {
        const gridIndex   = unit.getGridIndex();
        const gridId      = gridIndex.getGridId(mapSize);
        if (!observerTeamIndexesDict.has(gridId)) {
            observerTeamIndexesDict.set(gridId, Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex }));
        }
    }

    const warStatisticsManager  = war.getWarStatisticsManager();
    const isLoadedUnitVisible   = true;
    for (const [unit, newPlayerIndex] of dict) {
        const loadedUnits = unitMap.getUnitsLoadedByLoader(unit, true);
        const observerTeamIndexes   = observerTeamIndexesDict.get(unit.getGridIndex().getGridId(mapSize));
        if (observerTeamIndexes != null) {
            const groupedObserverTeamIndexes = Helpers_Team.encodeTeamIndex(observerTeamIndexes);
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

function updateWarStatisticsManager(warStatisticsManager: BaseWar_Interface_IBwWarStatisticsManager.IBwWarStatisticsManager, unit: Units_Unit.Unit, newPlayerIndex: number, groupedObserverTeamIndexes: number): void {
    const unitType      = unit.getUnitType();
    const normalizedHp  = unit.getNormalizedCurrentHp();
    warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
        unitType                   : unitType,
        dstPlayerIndex             : unit.getPlayerIndex(),
        normalizedHpGain           : 0,
        normalizedHpLoss           : normalizedHp,
        unitGain                   : 0,
        unitLoss                   : 1,
        groupedObserverTeamIndexes : groupedObserverTeamIndexes,
    }));
    warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
        unitType                   : unitType,
        dstPlayerIndex             : newPlayerIndex,
        normalizedHpGain           : normalizedHp,
        normalizedHpLoss           : 0,
        unitGain                   : 1,
        unitLoss                   : 0,
        groupedObserverTeamIndexes : groupedObserverTeamIndexes,
    }));
}
