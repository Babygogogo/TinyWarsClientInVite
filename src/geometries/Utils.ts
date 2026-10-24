import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as NumbersConstants from "../numbers/Constants.ts";

export function getPointDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}
export function getSquaredPointDistance(x1: number, y1: number, x2: number, y2: number): number {
    return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
}
export function getSquaredPointDistance2(point1: AuxiliaryTypesAuxiliaryTypes.Point | undefined, point2: AuxiliaryTypesAuxiliaryTypes.Point | undefined): number | undefined {
    if ((point1 == null) || (point2 == null)) {
        return undefined;
    } else {
        return getSquaredPointDistance(point1.x, point1.y, point2.x, point2.y);
    }
}

/** 计算点(x,y)围绕原点(0,0)顺时针旋转clockwiseDegree后的坐标 */
export function getRotatedPointInDegree(x: number, y: number, clockwiseDegree: number, originX = 0, originY = 0): AuxiliaryTypesAuxiliaryTypes.Point {
    // DEG_TO_RAD == Math.PI / 180
    return getRotatedPointInRadian(x, y, clockwiseDegree * NumbersConstants.DegToRad, originX, originY);
}
/** 计算点(x,y)围绕原点(0,0)顺时针旋转clockwiseRadian后的坐标 */
export function getRotatedPointInRadian(x: number, y: number, clockwiseRadian: number, originX = 0, originY = 0): AuxiliaryTypesAuxiliaryTypes.Point {
    // 正常坐标系下的逆时针旋转公式和pixi坐标系（y轴反向）的顺时针公式相同
    // 如果是正常坐标系的顺时针旋转，则使用 -clockwiseRadian
    return getRotatedPoint(x, y, Math.sin(clockwiseRadian), Math.cos(clockwiseRadian), originX, originY);
}
/** 计算点(x,y)围绕原点(0,0)顺时针旋转clockwiseRadian后的坐标 */
export function getRotatedPoint(x: number, y: number, sinValue: number, cosValue: number, originX = 0, originY = 0): AuxiliaryTypesAuxiliaryTypes.Point {
    return {
        x   : (x - originX) * cosValue - (y - originY) * sinValue + originX,
        y   : (x - originX) * sinValue + (y - originY) * cosValue + originY,
    };
}
