import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { War } from "../../../expressionParsers/contexts/War.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { NullableUnit } from "../../../expressionParsers/results/NullableUnit.ts";
import { NullableUnitArray } from "../../../expressionParsers/results/NullableUnitArray.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { Position } from "../../../expressionParsers/results/Position.ts";
import { PositionArray } from "../../../expressionParsers/results/PositionArray.ts";
import { Tile } from "../../../expressionParsers/results/Tile.ts";
import { TileArray } from "../../../expressionParsers/results/TileArray.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import { getValueInRange } from "../../../numbers/Utils.ts";
import type {
    WeaSetViewpointExpr as ProtoSchemaCommonProtoWarEventWeaSetViewpointExpr,
} from "../../../proto/schema/CommonProto/WarEvent/WeaSetViewpointExpr.ts";
import { setTimeout } from "../../../vendor/egret/Egret.ts";
import { ExpressionInfoDict } from "../constants/SetViewpointExpr.ts";

type WeaSetViewpointExpr    = ProtoSchemaCommonProtoWarEventWeaSetViewpointExpr;

export function checkIsValid(action: Undefinable<WeaSetViewpointExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getTargets(),
            expressionInfo          : ExpressionInfoDict.Targets,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getNeedFocusEffect(),
            expressionInfo          : ExpressionInfoDict.NeedFocusEffect,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getIsOneByOne(),
            expressionInfo          : ExpressionInfoDict.IsOneByOne,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getInterval(),
            expressionInfo          : ExpressionInfoDict.Interval,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaSetViewpointExpr>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0046, data.getTargets());
}
export function getDetailDesc(data: Undefinable<WeaSetViewpointExpr>): string | null {
    if (data == null) {
        return null;
    }

    const textArray = [
        data.getNeedFocusEffect()    ? `${ExpressionInfoDict.NeedFocusEffect.getTitleText()}: ${data.getNeedFocusEffect()}`   : null,
        data.getIsOneByOne()         ? `${ExpressionInfoDict.IsOneByOne.getTitleText()}: ${data.getIsOneByOne()}`             : null,
        data.getInterval()           ? `${ExpressionInfoDict.Interval.getTitleText()}: ${data.getInterval()}`                 : null,
    ].filter(v => v != null).join(`\n`);

    return `${getFormattedText(TextType.F0046, data.getTargets() ?? UndefinedError)}\n${textArray}`;
}

export function getErrorTip(data: WeaSetViewpointExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = ExpressionInfoDict.Targets;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getTargets(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.NeedFocusEffect;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getNeedFocusEffect(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.IsOneByOne;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getIsOneByOne(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.Interval;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getInterval(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

export async function applyWithExtraData(action: WeaSetViewpointExpr, isFast: boolean, war: IBwWar): Promise<void> {
    return applyWithoutExtraData(action, isFast, war);
}
export async function applyWithoutExtraData(action: WeaSetViewpointExpr, isFast: boolean, war: IBwWar): Promise<void> {
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
    gridIndexArray      : GridIndex[];
    isNeedFocusEffect   : boolean;
    isOneByOne          : boolean;
    interval            : number;
    war                 : IBwWar;
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
                    setTimeout(() => resolve(), null, interval);
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
                setTimeout(() => resolve(), null, interval);
            });
        }
    }
}
function getTargetGridIndexArray(str: string, war: IBwWar): GridIndex[] {
    const gridIdSet = new Set<number>();
    const mapSize   = war.getTileMap().getMapSize();
    try {
        const result = Parser.getParseResult(str).eval(new War(war), false);
        if (result instanceof NullableUnit) {
            const unit = result.unit;
            if (unit) {
                gridIdSet.add(unit.getGridIndex().getGridId(mapSize));
            }
        } else if (result instanceof NullableUnitArray) {
            for (const data of result.array) {
                const unit = data.unit;
                if (unit) {
                    gridIdSet.add(unit.getGridIndex().getGridId(mapSize));
                }
            }
        } else if (result instanceof Tile) {
            gridIdSet.add(result.tile.getGridIndex().getGridId(mapSize));
        } else if (result instanceof TileArray) {
            for (const tile of result.array) {
                gridIdSet.add(tile.getGridIndex().getGridId(mapSize));
            }
        } else if (result instanceof Position) {
            const gridIndex = new GridIndex(result.x, result.y);
            if (gridIndex.checkIsInsideMap(mapSize)) {
                gridIdSet.add(gridIndex.getGridId(mapSize));
            }
        } else if (result instanceof PositionArray) {
            for (const data of result.positionArray) {
                const gridIndex = new GridIndex(data.x, data.y);
                if (gridIndex.checkIsInsideMap(mapSize)) {
                    gridIdSet.add(gridIndex.getGridId(mapSize));
                }
            }
        }
    } catch {
        // nothing to do
    }

    return [...gridIdSet].map(v => GridIndex.getGridIndexByGridId(v, mapSize));
}
function getCenterGridIndex(gridIndexArray: GridIndex[]): GridIndex {
    let x = 0;
    let y = 0;
    for (const g of gridIndexArray) {
        x += g.getX();
        y += g.getY();
    }

    const length = gridIndexArray.length;
    return new GridIndex(
        Math.floor(x / length),
        Math.floor(y / length)
    );
}
function getIsOneByOne(str: Undefinable<string>, war: IBwWar): boolean {
    if (!str) {
        return false;
    }

    try {
        const result = Parser.getParseResult(str).eval(new War(war), false);
        return (result instanceof Num) && (result.num !== 0);
    } catch {
        return false;
    }
}
function getInterval(str: Undefinable<string>, war: IBwWar): number {
    if (!str) {
        return 1000;
    }

    try {
        const result = Parser.getParseResult(str).eval(new War(war), false);
        if (result instanceof Num) {
            return getValueInRange({
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
function getIsNeedFocusEffect(str: Undefinable<string>, war: IBwWar): boolean {
    if (!str) {
        return false;
    }

    try {
        const result = Parser.getParseResult(str).eval(new War(war), false);
        return (result instanceof Num) && (result.num !== 0);
    } catch {
        return false;
    }
}
