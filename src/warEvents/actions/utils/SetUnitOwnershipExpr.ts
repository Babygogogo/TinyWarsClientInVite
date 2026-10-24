import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as BaseWarInterfaceIBwWarStatisticsManager from "../../../baseWar/interface/IBwWarStatisticsManager.ts";
import * as ExpressionParsersContextsUnit from "../../../expressionParsers/contexts/Unit.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNullableUnit from "../../../expressionParsers/results/NullableUnit.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as HelpersTeam from "../../../helpers/Team.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetUnitOwnershipExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitOwnershipExpr.ts";
import * as ProtoSchemaCommonProtoWarSerializationWsUnitStatistics from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type * as UnitsIUnit from "../../../units/IUnit.ts";
import * as VisibilitiesUtils from "../../../visibilities/Utils.ts";
import * as WarEventsActionsConstantsSetUnitOwnershipExpr from "../constants/SetUnitOwnershipExpr.ts";

type WeaSetUnitOwnershipExpr    = ProtoSchemaCommonProtoWarEventWeaSetUnitOwnershipExpr.WeaSetUnitOwnershipExpr;
type IUnit                      = UnitsIUnit.IUnit;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitOwnershipExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getConUnitFilter(),
            expressionInfo          : WarEventsActionsConstantsSetUnitOwnershipExpr.ExpressionInfoDict.ConUnitFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActPlayerIndex(),
            expressionInfo          : WarEventsActionsConstantsSetUnitOwnershipExpr.ExpressionInfoDict.ActPlayerIndex,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitOwnershipExpr>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0052, data.getConUnitFilter() ?? LangConstants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitOwnershipExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActPlayerIndex()                     ? `${WarEventsActionsConstantsSetUnitOwnershipExpr.ExpressionInfoDict.ActPlayerIndex.getTitleText()}: ${data.getActPlayerIndex()}`                                         : null,
    ].filter(v => v != null).join(`\n`);

    return `${LangUtils.getFormattedText(LangConstants.TextType.F0052, data.getConUnitFilter() ?? LangConstants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetUnitOwnershipExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsSetUnitOwnershipExpr.ExpressionInfoDict.ConUnitFilter;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getConUnitFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetUnitOwnershipExpr.ExpressionInfoDict.ActPlayerIndex;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActPlayerIndex(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForUnit(action: WeaSetUnitOwnershipExpr, unit: IUnit): boolean {
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(action.getConUnitFilter() ?? ``).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        return (result instanceof ExpressionParsersResultsNum.Num) && (result.num !== 0);
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
        const epResult  = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(war, unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const playerIndex = Math.floor(epResult.num);
            return (playerIndex != unit.getPlayerIndex()) && (playerIndex >= PlayersConstants.PlayerIndex.First) && (playerIndex <= war.getPlayerManager().getTotalPlayersCount(false))
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
export async function applyWithoutExtraData(action: WeaSetUnitOwnershipExpr, isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
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
function applyNewUnitDataDict(dict: Map<IUnit, number>, war: BaseWarInterfaceIBwWar.IBwWar, isFast: boolean): void {
    const unitMap                   = war.getUnitMap();
    const mapSize                   = unitMap.getMapSize();
    const observerTeamIndexesDict   = new Map<number, number[] | null>();
    for (const [unit] of dict) {
        const gridIndex   = unit.getGridIndex();
        const gridId      = gridIndex.getGridId(mapSize);
        if (!observerTeamIndexesDict.has(gridId)) {
            observerTeamIndexesDict.set(gridId, VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex }));
        }
    }

    const warStatisticsManager  = war.getWarStatisticsManager();
    const isLoadedUnitVisible   = true;
    for (const [unit, newPlayerIndex] of dict) {
        const loadedUnits = unitMap.getUnitsLoadedByLoader(unit, true);
        const observerTeamIndexes   = observerTeamIndexesDict.get(unit.getGridIndex().getGridId(mapSize));
        if (observerTeamIndexes != null) {
            const groupedObserverTeamIndexes = HelpersTeam.encodeTeamIndex(observerTeamIndexes);
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

function updateWarStatisticsManager(warStatisticsManager: BaseWarInterfaceIBwWarStatisticsManager.IBwWarStatisticsManager, unit: IUnit, newPlayerIndex: number, groupedObserverTeamIndexes: number): void {
    const unitType      = unit.getUnitType();
    const normalizedHp  = unit.getNormalizedCurrentHp();
    warStatisticsManager.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
        unitType                    : unitType,
        dstPlayerIndex              : unit.getPlayerIndex(),
        normalizedHpGain            : 0,
        normalizedHpLoss            : normalizedHp,
        unitGain                    : 0,
        unitLoss                    : 1,
        groupedObserverTeamIndexes  : groupedObserverTeamIndexes
    }));
    warStatisticsManager.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
        unitType                    : unitType,
        dstPlayerIndex              : newPlayerIndex,
        normalizedHpGain            : normalizedHp,
        normalizedHpLoss            : 0,
        unitGain                    : 1,
        unitLoss                    : 0,
        groupedObserverTeamIndexes  : groupedObserverTeamIndexes
    }));
}
