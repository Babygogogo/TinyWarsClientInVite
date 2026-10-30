import {
    WarEvents_Actions_Constants_SetViewpointExpr,
    Lang_Utils,
    Numbers_Utils,
    AuxiliaryTypes_GridIndex,
    ExpressionParsers_Results_NullableUnit,
    ExpressionParsers_Results_NullableUnitArray,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Parser,
    ExpressionParsers_Results_Position,
    ExpressionParsers_Results_PositionArray,
    Egret_Egret,
    Lang_Constants,
    ExpressionParsers_Results_Tile,
    ExpressionParsers_Results_TileArray,
    ExpressionParsers_Contexts_War,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaSetViewpointExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetViewpointExpr.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetViewpointExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getTargets(),
            expressionInfo          : WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.Targets,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getNeedFocusEffect(),
            expressionInfo          : WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.NeedFocusEffect,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getIsOneByOne(),
            expressionInfo          : WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.IsOneByOne,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getInterval(),
            expressionInfo          : WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.Interval,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetViewpointExpr>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0046, data.getTargets());
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetViewpointExpr>): string | null {
    if (data == null) {
        return null;
    }

    const textArray = [
        data.getNeedFocusEffect()    ? `${WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.NeedFocusEffect.getTitleText()}: ${data.getNeedFocusEffect()}`   : null,
        data.getIsOneByOne()         ? `${WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.IsOneByOne.getTitleText()}: ${data.getIsOneByOne()}`             : null,
        data.getInterval()           ? `${WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.Interval.getTitleText()}: ${data.getInterval()}`                 : null,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0046, data.getTargets() ?? Lang_Constants.UndefinedError)}\n${textArray}`;
}

export function getErrorTip(data: WeaSetViewpointExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.Targets;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getTargets(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.NeedFocusEffect;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getNeedFocusEffect(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.IsOneByOne;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getIsOneByOne(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetViewpointExpr.ExpressionInfoDict.Interval;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getInterval(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

export async function applyWithExtraData(action: WeaSetViewpointExpr, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    return applyWithoutExtraData(action, isFast, war);
}
export async function applyWithoutExtraData(action: WeaSetViewpointExpr, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
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
    gridIndexArray      : AuxiliaryTypes_GridIndex.GridIndex[];
    isNeedFocusEffect   : boolean;
    isOneByOne          : boolean;
    interval            : number;
    war                 : BaseWar_Interface_IBwWar.IBwWar;
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
                    Egret_Egret.setTimeout(() => resolve(), null, interval);
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
                Egret_Egret.setTimeout(() => resolve(), null, interval);
            });
        }
    }
}
function getTargetGridIndexArray(str: string, war: BaseWar_Interface_IBwWar.IBwWar): AuxiliaryTypes_GridIndex.GridIndex[] {
    const gridIdSet = new Set<number>();
    const mapSize   = war.getTileMap().getMapSize();
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(str).eval(new ExpressionParsers_Contexts_War.War(war), false);
        if (result instanceof ExpressionParsers_Results_NullableUnit.NullableUnit) {
            const unit = result.unit;
            if (unit) {
                gridIdSet.add(unit.getGridIndex().getGridId(mapSize));
            }
        } else if (result instanceof ExpressionParsers_Results_NullableUnitArray.NullableUnitArray) {
            for (const data of result.array) {
                const unit = data.unit;
                if (unit) {
                    gridIdSet.add(unit.getGridIndex().getGridId(mapSize));
                }
            }
        } else if (result instanceof ExpressionParsers_Results_Tile.Tile) {
            gridIdSet.add(result.tile.getGridIndex().getGridId(mapSize));
        } else if (result instanceof ExpressionParsers_Results_TileArray.TileArray) {
            for (const tile of result.array) {
                gridIdSet.add(tile.getGridIndex().getGridId(mapSize));
            }
        } else if (result instanceof ExpressionParsers_Results_Position.Position) {
            const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(result.x, result.y);
            if (gridIndex.checkIsInsideMap(mapSize)) {
                gridIdSet.add(gridIndex.getGridId(mapSize));
            }
        } else if (result instanceof ExpressionParsers_Results_PositionArray.PositionArray) {
            for (const data of result.positionArray) {
                const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(data.x, data.y);
                if (gridIndex.checkIsInsideMap(mapSize)) {
                    gridIdSet.add(gridIndex.getGridId(mapSize));
                }
            }
        }
    } catch {
        // nothing to do
    }

    return [...gridIdSet].map(v => AuxiliaryTypes_GridIndex.GridIndex.getGridIndexByGridId(v, mapSize));
}
function getCenterGridIndex(gridIndexArray: AuxiliaryTypes_GridIndex.GridIndex[]): AuxiliaryTypes_GridIndex.GridIndex {
    let x = 0;
    let y = 0;
    for (const g of gridIndexArray) {
        x += g.getX();
        y += g.getY();
    }

    const length = gridIndexArray.length;
    return new AuxiliaryTypes_GridIndex.GridIndex(
        Math.floor(x / length),
        Math.floor(y / length)
    );
}
function getIsOneByOne(str: AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>, war: BaseWar_Interface_IBwWar.IBwWar): boolean {
    if (!str) {
        return false;
    }

    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(str).eval(new ExpressionParsers_Contexts_War.War(war), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
    } catch {
        return false;
    }
}
function getInterval(str: AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>, war: BaseWar_Interface_IBwWar.IBwWar): number {
    if (!str) {
        return 1000;
    }

    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(str).eval(new ExpressionParsers_Contexts_War.War(war), false);
        if (result instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
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
function getIsNeedFocusEffect(str: AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>, war: BaseWar_Interface_IBwWar.IBwWar): boolean {
    if (!str) {
        return false;
    }

    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(str).eval(new ExpressionParsers_Contexts_War.War(war), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
    } catch {
        return false;
    }
}
