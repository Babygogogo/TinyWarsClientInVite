import {
    Units_Utils_Serialization,
    Helpers_Team,
    WarEvents_Actions_Constants_SetUnitTypeExpr,
    Lang_Utils,
    Units_Utils_Common,
    Visibilities_Utils,
    ExpressionParsers_Results_NullableUnit,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Parser,
    Lang_Constants,
    ExpressionParsers_Contexts_Unit,
    type BaseWar_Interface_IBwWar,
    type Units_IUnit,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaSetUnitTypeExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitTypeExpr.ts";
import type { SerialUnit } from "../../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitTypeExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getConUnitFilter(),
            expressionInfo       : WarEvents_Actions_Constants_SetUnitTypeExpr.ExpressionInfoDict.ConUnitFilter,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActUnitType(),
            expressionInfo       : WarEvents_Actions_Constants_SetUnitTypeExpr.ExpressionInfoDict.ActUnitType,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitTypeExpr>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0051, data.getConUnitFilter() ?? Lang_Constants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitTypeExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActUnitType()    ? `${WarEvents_Actions_Constants_SetUnitTypeExpr.ExpressionInfoDict.ActUnitType.getTitleText()}: ${data.getActUnitType()}`   : null,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0051, data.getConUnitFilter() ?? Lang_Constants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetUnitTypeExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_SetUnitTypeExpr.ExpressionInfoDict.ConUnitFilter;
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
        const info      = WarEvents_Actions_Constants_SetUnitTypeExpr.ExpressionInfoDict.ActUnitType;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActUnitType(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForUnit(action: WeaSetUnitTypeExpr, unit: Units_IUnit.IUnit): boolean {
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(action.getConUnitFilter() ?? ``).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActUnitType(action: WeaSetUnitTypeExpr, unit: Units_IUnit.IUnit): number | null {
    const act = action.getActUnitType();
    if (!act) {
        return null;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const newUnitType = Math.floor(epResult.num);
            if (newUnitType === unit.getUnitType()) {
                return null;
            }

            const gameConfig            = unit.getGcData();
            const newUnitTemplateCfg    = gameConfig.getUnitTemplateCfg(newUnitType);
            if (newUnitTemplateCfg == null) {
                return null;
            }

            {
                const loaderUnit = unit.getLoaderUnit();
                if (loaderUnit != null) {
                    const loadUnitCategory = loaderUnit.getLoadUnitCategoryId();
                    if ((loadUnitCategory == null)                                              ||
                        (!gameConfig.checkIsUnitTypeInCategory(newUnitType, loadUnitCategory))
                    ) {
                        return null;
                    }
                }
            }

            {
                const loadedUnits = unit.getLoadedUnits();
                if (loadedUnits.length > 0) {
                    const maxLoadUnitsCount = newUnitTemplateCfg.getMaxLoadUnitsCount();
                    if ((maxLoadUnitsCount == null) || (loadedUnits.length > maxLoadUnitsCount)) {
                        return null;
                    }

                    const loadUnitCategoryId = newUnitTemplateCfg.getLoadUnitCategoryId();
                    if ((loadUnitCategoryId == null)                                                                          ||
                        (loadedUnits.some(v => !gameConfig.checkIsUnitTypeInCategory(v.getUnitType(), loadUnitCategoryId)))
                    ) {
                        return null;
                    }
                }
            }

            return newUnitType;

        } else {
            return null;
        }
    } catch {
        return null;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetUnitTypeExpr): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetUnitTypeExpr, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const newUnitDataDict = new Map<Units_IUnit.IUnit, SerialUnit>();
    for (const unit of war.getUnitMap().getAllUnits().sort((v1, v2) => v1.getUnitId() - v2.getUnitId())) {
        if (!checkIsMeetConditionForUnit(action, unit)) {
            continue;
        }

        const newUnitData = createNewUnitData(action, unit);
        if (newUnitData != null) {
            newUnitDataDict.set(unit, newUnitData);
        }
    }

    applyNewUnitDataDict(newUnitDataDict, war, isFast);
}
function createNewUnitData(action: WeaSetUnitTypeExpr, unit: Units_IUnit.IUnit): SerialUnit | null {
    const newUnitType = evalActUnitType(action, unit);
    if (newUnitType == null) {
        return null;
    }

    return Units_Utils_Serialization.createNewUnitDataForChangeType(unit, newUnitType);
}
function applyNewUnitDataDict(dict: Map<Units_IUnit.IUnit, SerialUnit>, war: BaseWar_Interface_IBwWar.IBwWar, isFast: boolean): void {
    const mapSize                 = war.getTileMap().getMapSize();
    const observerTeamIndexesDict = new Map<number, number[] | null>();
    for (const [unit] of dict) {
        const gridIndex   = unit.getGridIndex();
        const gridId      = gridIndex.getGridId(mapSize);
        if (!observerTeamIndexesDict.has(gridId)) {
            observerTeamIndexesDict.set(gridId, Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex }));
        }
    }

    const gameConfig              = war.getGcData();
    const warStatisticsManager    = war.getWarStatisticsManager();
    for (const [unit, unitData] of dict) {
        {
            const observerTeamIndexes = observerTeamIndexesDict.get(unit.getGridIndex().getGridId(mapSize));
            if (observerTeamIndexes != null) {
                const groupedObserverTeamIndexes = Helpers_Team.encodeTeamIndex(observerTeamIndexes);
                warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                    unitType                   : unit.getUnitType(),
                    dstPlayerIndex             : unit.getPlayerIndex(),
                    normalizedHpGain           : 0,
                    normalizedHpLoss           : unit.getNormalizedCurrentHp(),
                    unitGain                   : 0,
                    unitLoss                   : 1,
                    groupedObserverTeamIndexes : groupedObserverTeamIndexes,
                }));

                const newUnitType = unitData.getUnitType();
                warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                    unitType                   : newUnitType,
                    dstPlayerIndex             : unitData.getPlayerIndex(),
                    normalizedHpGain           : Units_Utils_Common.getNormalizedHp(unitData.getCurrentHp()),
                    normalizedHpLoss           : 0,
                    unitGain                   : 1,
                    unitLoss                   : 0,
                    groupedObserverTeamIndexes : groupedObserverTeamIndexes,
                }));
            }
        }

        unit.init(unitData, gameConfig);
        unit.startRunning(war);
        if (!isFast) {
            unit.updateView();
        }
    }
}
