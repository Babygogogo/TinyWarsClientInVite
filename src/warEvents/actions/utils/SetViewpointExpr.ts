import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersContextsWar from "../../../expressionParsers/contexts/War.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNullableUnit from "../../../expressionParsers/results/NullableUnit.ts";
import * as ExpressionParsersResultsNullableUnitArray from "../../../expressionParsers/results/NullableUnitArray.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as ExpressionParsersResultsPosition from "../../../expressionParsers/results/Position.ts";
import * as ExpressionParsersResultsPositionArray from "../../../expressionParsers/results/PositionArray.ts";
import * as ExpressionParsersResultsTile from "../../../expressionParsers/results/Tile.ts";
import * as ExpressionParsersResultsTileArray from "../../../expressionParsers/results/TileArray.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NumbersUtils from "../../../numbers/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetViewpointExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetViewpointExpr.ts";
import * as VendorEgretEgret from "../../../vendor/egret/Egret.ts";
import * as WarEventsActionsConstantsSetViewpointExpr from "../constants/SetViewpointExpr.ts";

type WeaSetViewpointExpr    = ProtoSchemaCommonProtoWarEventWeaSetViewpointExpr.WeaSetViewpointExpr;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetViewpointExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getTargets(),
            expressionInfo          : WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.Targets,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getNeedFocusEffect(),
            expressionInfo          : WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.NeedFocusEffect,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getIsOneByOne(),
            expressionInfo          : WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.IsOneByOne,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getInterval(),
            expressionInfo          : WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.Interval,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetViewpointExpr>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0046, data.getTargets());
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetViewpointExpr>): string | null {
    if (data == null) {
        return null;
    }

    const textArray = [
        data.getNeedFocusEffect()    ? `${WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.NeedFocusEffect.getTitleText()}: ${data.getNeedFocusEffect()}`   : null,
        data.getIsOneByOne()         ? `${WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.IsOneByOne.getTitleText()}: ${data.getIsOneByOne()}`             : null,
        data.getInterval()           ? `${WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.Interval.getTitleText()}: ${data.getInterval()}`                 : null,
    ].filter(v => v != null).join(`\n`);

    return `${LangUtils.getFormattedText(LangConstants.TextType.F0046, data.getTargets() ?? LangConstants.UndefinedError)}\n${textArray}`;
}

export function getErrorTip(data: WeaSetViewpointExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.Targets;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getTargets(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.NeedFocusEffect;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getNeedFocusEffect(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.IsOneByOne;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getIsOneByOne(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetViewpointExpr.ExpressionInfoDict.Interval;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getInterval(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

export async function applyWithExtraData(action: WeaSetViewpointExpr, isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    return applyWithoutExtraData(action, isFast, war);
}
export async function applyWithoutExtraData(action: WeaSetViewpointExpr, isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    return doApply({
        gridIndexArray      : getTargetGridIndexArray(action.getTargets() ?? ``, war),
        isNeedFocusEffect   : getIsNeedFocusEffect(action.getNeedFocusEffect(), war),
        isOneByOne          : getIsOneByOne(action.getIsOneByOne(), war),
        interval            : getInterval(action.getInterval(), war),
        war                 : war,
        isFastExecute       : isFast,
    });
}
export async function doApply({ gridIndexArray, isNeedFocusEffect, isOneByOne, interval, war, isFastExecute }: {
    gridIndexArray      : AuxiliaryTypesGridIndex.GridIndex[];
    isNeedFocusEffect   : boolean;
    isOneByOne          : boolean;
    interval            : number;
    war                 : BaseWarInterfaceIBwWar.IBwWar;
    isFastExecute       : boolean;
}): Promise<void> {
    if (isFastExecute) {
        return;
    }
    if (gridIndexArray.length <= 0) {
        return;
    }

    const cursor        = war.getCursor();
    const warView       = war.getView();
    const visualEffect  = war.getGridVisualEffect();
    if (isOneByOne) {
        for (const gridIndex of gridIndexArray) {
            cursor.setGridIndex(gridIndex);
            cursor.updateView();
            warView.moveGridToCenter(gridIndex);

            if (isNeedFocusEffect) {
                visualEffect.showEffectAiming(gridIndex, interval);
                await new Promise<void>(resolve => {
                    VendorEgretEgret.setTimeout(() => resolve(), null, interval);
                });
            }
        }
    } else {
        cursor.setGridIndex(gridIndexArray[0]);
        cursor.updateView();
        warView.moveGridToCenter(getCenterGridIndex(gridIndexArray));

        if (isNeedFocusEffect) {
            for (const gridIndex of gridIndexArray) {
                visualEffect.showEffectAiming(gridIndex, interval);
            }
            await new Promise<void>(resolve => {
                VendorEgretEgret.setTimeout(() => resolve(), null, interval);
            });
        }
    }
}
function getTargetGridIndexArray(str: string, war: BaseWarInterfaceIBwWar.IBwWar): AuxiliaryTypesGridIndex.GridIndex[] {
    const gridIdSet = new Set<number>();
    const mapSize   = war.getTileMap().getMapSize();
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(str).eval(new ExpressionParsersContextsWar.War(war), false);
        if (result instanceof ExpressionParsersResultsNullableUnit.NullableUnit) {
            const unit = result.unit;
            if (unit) {
                gridIdSet.add(unit.getGridIndex().getGridId(mapSize));
            }
        } else if (result instanceof ExpressionParsersResultsNullableUnitArray.NullableUnitArray) {
            for (const data of result.array) {
                const unit = data.unit;
                if (unit) {
                    gridIdSet.add(unit.getGridIndex().getGridId(mapSize));
                }
            }
        } else if (result instanceof ExpressionParsersResultsTile.Tile) {
            gridIdSet.add(result.tile.getGridIndex().getGridId(mapSize));
        } else if (result instanceof ExpressionParsersResultsTileArray.TileArray) {
            for (const tile of result.array) {
                gridIdSet.add(tile.getGridIndex().getGridId(mapSize));
            }
        } else if (result instanceof ExpressionParsersResultsPosition.Position) {
            const gridIndex = new AuxiliaryTypesGridIndex.GridIndex(result.x, result.y);
            if (gridIndex.checkIsInsideMap(mapSize)) {
                gridIdSet.add(gridIndex.getGridId(mapSize));
            }
        } else if (result instanceof ExpressionParsersResultsPositionArray.PositionArray) {
            for (const data of result.positionArray) {
                const gridIndex = new AuxiliaryTypesGridIndex.GridIndex(data.x, data.y);
                if (gridIndex.checkIsInsideMap(mapSize)) {
                    gridIdSet.add(gridIndex.getGridId(mapSize));
                }
            }
        }
    } catch {
        // nothing to do
    }

    return [...gridIdSet].map(v => AuxiliaryTypesGridIndex.GridIndex.getGridIndexByGridId(v, mapSize));
}
function getCenterGridIndex(gridIndexArray: AuxiliaryTypesGridIndex.GridIndex[]): AuxiliaryTypesGridIndex.GridIndex {
    let x = 0;
    let y = 0;
    for (const g of gridIndexArray) {
        x += g.getX();
        y += g.getY();
    }

    const length = gridIndexArray.length;
    return new AuxiliaryTypesGridIndex.GridIndex(
        Math.floor(x / length),
        Math.floor(y / length)
    );
}
function getIsOneByOne(str: AuxiliaryTypesAuxiliaryTypes.Undefinable<string>, war: BaseWarInterfaceIBwWar.IBwWar): boolean {
    if (!str) {
        return false;
    }

    try {
        const result = ExpressionParsersParser.Parser.getParseResult(str).eval(new ExpressionParsersContextsWar.War(war), false);
        return (result instanceof ExpressionParsersResultsNum.Num) && (result.num !== 0);
    } catch {
        return false;
    }
}
function getInterval(str: AuxiliaryTypesAuxiliaryTypes.Undefinable<string>, war: BaseWarInterfaceIBwWar.IBwWar): number {
    if (!str) {
        return 1000;
    }

    try {
        const result = ExpressionParsersParser.Parser.getParseResult(str).eval(new ExpressionParsersContextsWar.War(war), false);
        if (result instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : 100,
                maxValue    : 3000,
                rawValue    : Math.floor(result.num),
            });
        } else {
            return 1000;
        }
    } catch {
        return 1000;
    }
}
function getIsNeedFocusEffect(str: AuxiliaryTypesAuxiliaryTypes.Undefinable<string>, war: BaseWarInterfaceIBwWar.IBwWar): boolean {
    if (!str) {
        return false;
    }

    try {
        const result = ExpressionParsersParser.Parser.getParseResult(str).eval(new ExpressionParsersContextsWar.War(war), false);
        return (result instanceof ExpressionParsersResultsNum.Num) && (result.num !== 0);
    } catch {
        return false;
    }
}
