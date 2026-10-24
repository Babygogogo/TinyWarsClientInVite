import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersContextsUnit from "../../../expressionParsers/contexts/Unit.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNullableUnit from "../../../expressionParsers/results/NullableUnit.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as HelpersTeam from "../../../helpers/Team.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetUnitTypeExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitTypeExpr.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialUnit from "../../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import * as ProtoSchemaCommonProtoWarSerializationWsUnitStatistics from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import type * as UnitsIUnit from "../../../units/IUnit.ts";
import * as UnitsUtilsCommon from "../../../units/utils/Common.ts";
import * as UnitsUtilsSerialization from "../../../units/utils/Serialization.ts";
import * as VisibilitiesUtils from "../../../visibilities/Utils.ts";
import * as WarEventsActionsConstantsSetUnitTypeExpr from "../constants/SetUnitTypeExpr.ts";

type WeaSetUnitTypeExpr = ProtoSchemaCommonProtoWarEventWeaSetUnitTypeExpr.WeaSetUnitTypeExpr;
type IUnit              = UnitsIUnit.IUnit;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitTypeExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getConUnitFilter(),
            expressionInfo          : WarEventsActionsConstantsSetUnitTypeExpr.ExpressionInfoDict.ConUnitFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActUnitType(),
            expressionInfo          : WarEventsActionsConstantsSetUnitTypeExpr.ExpressionInfoDict.ActUnitType,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitTypeExpr>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0051, data.getConUnitFilter() ?? LangConstants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitTypeExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActUnitType()    ? `${WarEventsActionsConstantsSetUnitTypeExpr.ExpressionInfoDict.ActUnitType.getTitleText()}: ${data.getActUnitType()}`   : null,
    ].filter(v => v != null).join(`\n`);

    return `${LangUtils.getFormattedText(LangConstants.TextType.F0051, data.getConUnitFilter() ?? LangConstants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetUnitTypeExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsSetUnitTypeExpr.ExpressionInfoDict.ConUnitFilter;
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
        const info      = WarEventsActionsConstantsSetUnitTypeExpr.ExpressionInfoDict.ActUnitType;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActUnitType(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForUnit(action: WeaSetUnitTypeExpr, unit: IUnit): boolean {
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(action.getConUnitFilter() ?? ``).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        return (result instanceof ExpressionParsersResultsNum.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActUnitType(action: WeaSetUnitTypeExpr, unit: IUnit): number | null {
    const act = action.getActUnitType();
    if (!act) {
        return null;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
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
export async function applyWithoutExtraData(action: WeaSetUnitTypeExpr, isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const newUnitDataDict = new Map<IUnit, ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit>();
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
function createNewUnitData(action: WeaSetUnitTypeExpr, unit: IUnit): ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit | null {
    const newUnitType = evalActUnitType(action, unit);
    if (newUnitType == null) {
        return null;
    }

    return UnitsUtilsSerialization.createNewUnitDataForChangeType(unit, newUnitType);
}
function applyNewUnitDataDict(dict: Map<IUnit, ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit>, war: BaseWarInterfaceIBwWar.IBwWar, isFast: boolean): void {
    const mapSize                 = war.getTileMap().getMapSize();
    const observerTeamIndexesDict = new Map<number, number[] | null>();
    for (const [unit] of dict) {
        const gridIndex   = unit.getGridIndex();
        const gridId      = gridIndex.getGridId(mapSize);
        if (!observerTeamIndexesDict.has(gridId)) {
            observerTeamIndexesDict.set(gridId, VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex }));
        }
    }

    const gameConfig              = war.getGcData();
    const warStatisticsManager    = war.getWarStatisticsManager();
    for (const [unit, unitData] of dict) {
        {
            const observerTeamIndexes = observerTeamIndexesDict.get(unit.getGridIndex().getGridId(mapSize));
            if (observerTeamIndexes != null) {
                const groupedObserverTeamIndexes = HelpersTeam.encodeTeamIndex(observerTeamIndexes);
                warStatisticsManager.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                    unitType                    : unit.getUnitType(),
                    dstPlayerIndex              : unit.getPlayerIndex(),
                    normalizedHpGain            : 0,
                    normalizedHpLoss            : unit.getNormalizedCurrentHp(),
                    unitGain                    : 0,
                    unitLoss                    : 1,
                    groupedObserverTeamIndexes  : groupedObserverTeamIndexes,
                }));

                const newUnitType = unitData.getUnitType() ?? 0;
                warStatisticsManager.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                    unitType                    : newUnitType,
                    dstPlayerIndex              : unitData.getPlayerIndex() ?? 0,
                    normalizedHpGain            : UnitsUtilsCommon.getNormalizedHp(unitData.getCurrentHp() ?? UnitsConstants.Hp.MaxHp),
                    normalizedHpLoss            : 0,
                    unitGain                    : 1,
                    unitLoss                    : 0,
                    groupedObserverTeamIndexes  : groupedObserverTeamIndexes
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
