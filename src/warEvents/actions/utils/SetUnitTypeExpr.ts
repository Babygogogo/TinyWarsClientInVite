import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { Unit } from "../../../expressionParsers/contexts/Unit.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { NullableUnit } from "../../../expressionParsers/results/NullableUnit.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { encodeTeamIndex } from "../../../helpers/Team.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import type {
    WeaSetUnitTypeExpr as ProtoSchemaCommonProtoWarEventWeaSetUnitTypeExpr,
} from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitTypeExpr.ts";
import type { SerialUnit } from "../../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import { Hp } from "../../../units/Constants.ts";
import type { IUnit as UnitsIUnit } from "../../../units/IUnit.ts";
import { getNormalizedHp } from "../../../units/utils/Common.ts";
import { createNewUnitDataForChangeType } from "../../../units/utils/Serialization.ts";
import { getObserverTeamIndexListForUnitOnMap } from "../../../visibilities/Utils.ts";
import { ExpressionInfoDict } from "../constants/SetUnitTypeExpr.ts";

type WeaSetUnitTypeExpr = ProtoSchemaCommonProtoWarEventWeaSetUnitTypeExpr;
type IUnit              = UnitsIUnit;

export function checkIsValid(action: Undefinable<WeaSetUnitTypeExpr>, customCounterNameSet: Set<string>): boolean {
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
            str                     : action.getActUnitType(),
            expressionInfo          : ExpressionInfoDict.ActUnitType,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaSetUnitTypeExpr>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0051, data.getConUnitFilter() ?? UndefinedError);
}
export function getDetailDesc(data: Undefinable<WeaSetUnitTypeExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActUnitType()    ? `${ExpressionInfoDict.ActUnitType.getTitleText()}: ${data.getActUnitType()}`   : null,
    ].filter(v => v != null).join(`\n`);

    return `${getFormattedText(TextType.F0051, data.getConUnitFilter() ?? UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetUnitTypeExpr, customCounterNameSet: Set<string>): string | null {
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
        const info      = ExpressionInfoDict.ActUnitType;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActUnitType(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForUnit(action: WeaSetUnitTypeExpr, unit: IUnit): boolean {
    try {
        const result = Parser.getParseResult(action.getConUnitFilter() ?? ``).eval(new Unit(new NullableUnit(unit.getWar(), unit)), false);
        return (result instanceof Num) && (result.num !== 0);
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
        const epResult = Parser.getParseResult(act).eval(new Unit(new NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof Num) {
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
export async function applyWithoutExtraData(action: WeaSetUnitTypeExpr, isFast: boolean, war: IBwWar): Promise<void> {
    const newUnitDataDict = new Map<IUnit, SerialUnit>();
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
function createNewUnitData(action: WeaSetUnitTypeExpr, unit: IUnit): SerialUnit | null {
    const newUnitType = evalActUnitType(action, unit);
    if (newUnitType == null) {
        return null;
    }

    return createNewUnitDataForChangeType(unit, newUnitType);
}
function applyNewUnitDataDict(dict: Map<IUnit, SerialUnit>, war: IBwWar, isFast: boolean): void {
    const mapSize                 = war.getTileMap().getMapSize();
    const observerTeamIndexesDict = new Map<number, number[] | null>();
    for (const [unit] of dict) {
        const gridIndex   = unit.getGridIndex();
        const gridId      = gridIndex.getGridId(mapSize);
        if (!observerTeamIndexesDict.has(gridId)) {
            observerTeamIndexesDict.set(gridId, getObserverTeamIndexListForUnitOnMap({ war, gridIndex }));
        }
    }

    const gameConfig              = war.getGcData();
    const warStatisticsManager    = war.getWarStatisticsManager();
    for (const [unit, unitData] of dict) {
        {
            const observerTeamIndexes = observerTeamIndexesDict.get(unit.getGridIndex().getGridId(mapSize));
            if (observerTeamIndexes != null) {
                const groupedObserverTeamIndexes = encodeTeamIndex(observerTeamIndexes);
                warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                    unitType                    : unit.getUnitType(),
                    dstPlayerIndex              : unit.getPlayerIndex(),
                    normalizedHpGain            : 0,
                    normalizedHpLoss            : unit.getNormalizedCurrentHp(),
                    unitGain                    : 0,
                    unitLoss                    : 1,
                    groupedObserverTeamIndexes  : groupedObserverTeamIndexes,
                }));

                const newUnitType = unitData.getUnitType() ?? 0;
                warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                    unitType                    : newUnitType,
                    dstPlayerIndex              : unitData.getPlayerIndex() ?? 0,
                    normalizedHpGain            : getNormalizedHp(unitData.getCurrentHp() ?? Hp.MaxHp),
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
