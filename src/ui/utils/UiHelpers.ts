import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as GeometriesUtils from "../../geometries/Utils.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as GraphicsUtils from "../../graphics/Utils.ts";
import * as NumbersConstants from "../../numbers/Constants.ts";
import * as StagesStageManager from "../../stages/StageManager.ts";
import type * as UiInterfacesIUiComponent from "../interfaces/IUiComponent.ts";
import type * as UiTypesUiAabbParams from "../types/UiAabbParams.ts";
import * as UiUtilsUiFactory from "./UiFactory.ts";
import * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

const COLOR_MATRIX_FILTERS = {
    [GraphicsConstants.ColorId.Gray]: new VendorEgretEgret.ColorMatrixFilter([
        0.3, 0.6, 0, 0, 0,
        0.3, 0.6, 0, 0, 0,
        0.3, 0.6, 0, 0, 0,
        0, 0, 0, 1, 0
    ]),

    [GraphicsConstants.ColorId.Dark]: new VendorEgretEgret.ColorMatrixFilter([
        0.625,  0,      0,      0,  0,
        0,      0.625,  0,      0,  0,
        0,      0,      0.625,  0,  0,
        0,      0,      0,      1,  0
    ]),
};

export function changeColor(obj: VendorEgretEgret.DisplayObject | UiInterfacesIUiComponent.IUiComponent, color: GraphicsConstants.ColorId, value = 100): void {
    if (GraphicsUtils.checkIsWebGl()) {
        if ((color === GraphicsConstants.ColorId.Gray) || (color === GraphicsConstants.ColorId.Dark)) {
            (obj as any).filters = [COLOR_MATRIX_FILTERS[color]];
        } else if (color === GraphicsConstants.ColorId.Origin) {
            (obj as any).filters = null;
        } else {
            (obj as any).filters = [new VendorEgretEgret.ColorMatrixFilter(getColorMatrix(color, value) ?? void 0)];
        }
    }
}
function getColorMatrix(color: GraphicsConstants.ColorId, value = 100): number[] | null {
    switch (color) {
        case GraphicsConstants.ColorId.Blue:
            return [
                1, 0, 0, 0, 0,
                0, 1, 0, 0, 0,
                0, 0, 1, 0, value,
                0, 0, 0, 1, 0
            ];

        case GraphicsConstants.ColorId.Green:
            return [
                1, 0, 0, 0, 0,
                0, 1, 0, 0, value,
                0, 0, 1, 0, 0,
                0, 0, 0, 1, 0
            ];

        case GraphicsConstants.ColorId.Red:
            return [
                1, 0, 0, 0, value,
                0, 1, 0, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 0, 1, 0
            ];

        case GraphicsConstants.ColorId.White:
            return [
                1, 0, 0, 0, value,
                0, 1, 0, 0, value,
                0, 0, 1, 0, value,
                0, 0, 0, 1, 0
            ];

        case GraphicsConstants.ColorId.Yellow:
            return [
                1, 0, 0, 0, value,
                0, 1, 0, 0, value,
                0, 0, 1, 0, 0,
                0, 0, 0, 1, 0
            ];

        default:
            return null;
    }
}

export function checkIsInStage(con: VendorEgretEgret.DisplayObject): boolean {
    return con.stage != null;
}
export function getWorldAlpha(con: VendorEgretEgret.DisplayObject | null): number {
    const stage = StagesStageManager.getStage();
    let alpha   = 1;
    while ((con != null) && (con !== stage)) {
        alpha   *= con.alpha;
        con     = con.parent;
    }
    return alpha;
}
export function getWorldScale(con: VendorEgretEgret.DisplayObject | null): { x: number, y: number } {
    let x = 1;
    let y = 1;
    while (con) {
        x *= con.scaleX;
        y *= con.scaleY;
        con = con.parent;
    }
    return { x: x, y: y };
}
export function getWorldVisible(con: VendorEgretEgret.DisplayObject | null): boolean {
    const stage = StagesStageManager.getStage();
    while (con !== stage) {
        if ((con == null) || (!con.visible)) {
            return false;
        }
        con = con.parent;
    }
    return true;
}
export function getAabbToParent({ unscaledWidth, unscaledHeight, scaleX, scaleY, rotationInDegree, anchorOffsetX, anchorOffsetY }: UiTypesUiAabbParams.UiAabbParams): AuxiliaryTypesAuxiliaryTypes.Rectangle {
    const tempX1            = (0               - anchorOffsetX) * scaleX + anchorOffsetX;
    const tempX2            = (unscaledWidth   - anchorOffsetX) * scaleX + anchorOffsetX;
    const tempY1            = (0               - anchorOffsetY) * scaleY + anchorOffsetY;
    const tempY2            = (unscaledHeight  - anchorOffsetY) * scaleY + anchorOffsetY;
    // const { x: x1, y: y1 }  = AuxiliaryHelpers.getRotatedPointInDegree(tempX1,  tempY1, rotationInDegree,   anchorOffsetX,  anchorOffsetY);
    // const { x: x2, y: y2 }  = AuxiliaryHelpers.getRotatedPointInDegree(tempX1,  tempY2, rotationInDegree,   anchorOffsetX,  anchorOffsetY);
    // const { x: x3, y: y3 }  = AuxiliaryHelpers.getRotatedPointInDegree(tempX2,  tempY1, rotationInDegree,   anchorOffsetX,  anchorOffsetY);
    // const { x: x4, y: y4 }  = AuxiliaryHelpers.getRotatedPointInDegree(tempX2,  tempY2, rotationInDegree,   anchorOffsetX,  anchorOffsetY);
    const radians           = rotationInDegree * NumbersConstants.DegToRad;
    const sinValue          = Math.sin(radians);
    const cosValue          = Math.cos(radians);
    const { x: x1, y: y1 }  = GeometriesUtils.getRotatedPoint(tempX1, tempY1, sinValue, cosValue, anchorOffsetX, anchorOffsetY);
    const { x: x2, y: y2 }  = GeometriesUtils.getRotatedPoint(tempX1, tempY2, sinValue, cosValue, anchorOffsetX, anchorOffsetY);
    const { x: x3, y: y3 }  = GeometriesUtils.getRotatedPoint(tempX2, tempY1, sinValue, cosValue, anchorOffsetX, anchorOffsetY);
    const { x: x4, y: y4 }  = GeometriesUtils.getRotatedPoint(tempX2, tempY2, sinValue, cosValue, anchorOffsetX, anchorOffsetY);
    const minX              = Math.min(x1, x2, x3, x4);
    const minY              = Math.min(y1, y2, y3, y4);
    const maxX              = Math.max(x1, x2, x3, x4);
    const maxY              = Math.max(y1, y2, y3, y4);
    return {
        x       : minX - anchorOffsetX,
        y       : minY - anchorOffsetY,
        width   : maxX - minX,
        height  : maxY - minY,
    };
}

// export function getAabb(container: egret.DisplayObject): UiTypes.UiAabb {
//     const scaledWidth       = container.width * (container.scaleX >= 0 ? 1 : -1);
//     const scaledHeight      = container.height * (container.scaleY >= 0 ? 1 : -1);
//     const rotationInDegree  = container.rotation;
//     const anchorOffsetX     = container.anchorOffsetX;
//     const anchorOffsetY     = container.anchorOffsetY;
//     const points    = [
//         AuxiliaryHelpers.getRotatedPointInDegree(0,             0,              rotationInDegree,   anchorOffsetX,  anchorOffsetY),
//         AuxiliaryHelpers.getRotatedPointInDegree(scaledWidth,   0,              rotationInDegree,   anchorOffsetX,  anchorOffsetY),
//         AuxiliaryHelpers.getRotatedPointInDegree(0,             scaledHeight,   rotationInDegree,   anchorOffsetX,  anchorOffsetY),
//         AuxiliaryHelpers.getRotatedPointInDegree(scaledWidth,   scaledHeight,   rotationInDegree,   anchorOffsetX,  anchorOffsetY),
//     ];
//     const xArray = points.map(v => v.x);
//     const yArray = points.map(v => v.y);
//     return {
//         minX    : Math.min(...xArray),
//         minY    : Math.min(...yArray),
//         maxX    : Math.max(...xArray),
//         maxY    : Math.max(...yArray),
//     };
// }

type HitTestResult = {
    /**
     * 给定点所命中的target内显示层级最高、嵌套最深的子元素（可以是target自身），会考虑touchEnabled / touchChildren
     *
     * 也就是说，如果未命中，或者命中的所有元素都不可触摸，则此值会是undefined
     */
    mostInnerObject : VendorEgretEgret.DisplayObject | undefined;
    /** 表示指定点是否命中target或其子元素，不考虑touchEnabled / touchChildren */
    isInTarget      : boolean;
};
/** 查找给定点所命中的可触摸元素，比如查找玩家触摸了舞台中的哪个按钮 */
export function hitTestTarget(target: VendorEgretEgret.DisplayObject, stageX: number, stageY: number): HitTestResult {
    // if (target instanceof UiFactory.getUiScrollerBaseClass()) {
    //     const { x, y }          = target.globalToLocal(stageX, stageY);
    //     const { width, height } = getUnscaledSize(target);
    //     if ((x >= 0) && (y >= 0) && (x <= (width ?? 0)) && (y <= (height ?? 0))) {
    //         let a = 0;
    //     }
    // }

    return target instanceof VendorEgretEgret.DisplayObjectContainer
        ? hitTestContainer(target, stageX, stageY)
        : hitTestObject(target, stageX, stageY);
}
function hitTestObject(obj: VendorEgretEgret.DisplayObject, stageX: number, stageY: number): HitTestResult {
    const isInTarget = (obj.$touchEnabled) && (checkIsInTarget(obj, stageX, stageY, false));
    return {
        mostInnerObject : isInTarget ? obj : undefined,
        isInTarget      : isInTarget,
    };
}
function hitTestContainer(con: VendorEgretEgret.DisplayObjectContainer, stageX: number, stageY: number): HitTestResult {
    const touchEnabled = con.$touchEnabled;
    if (!con.$touchChildren) {
        const isInTarget = (touchEnabled) && (checkIsInTarget(con, stageX, stageY, false));
        return {
            mostInnerObject : isInTarget ? con : undefined,
            isInTarget      : isInTarget,
        };
    } else {
        if ((!con.$visible)             ||
            ((con as any).$scaleX == 0) ||
            ((con as any).$scaleY == 0)
        ) {
            return {
                mostInnerObject : undefined,
                isInTarget      : false,
            };
        }

        {
            const m         = con.$getInvertedConcatenatedMatrix();
            const localX    = m.a * stageX + m.c * stageY + m.tx;
            const localY    = m.b * stageX + m.d * stageY + m.ty;
            {
                const rect = con.$scrollRect ?? con.$maskRect;
                if ((rect) && (!rect.contains(localX, localY))) {
                    return {
                        mostInnerObject : undefined,
                        isInTarget      : false,
                    };
                }
            }
            {
                const mask = con.$mask;
                if ((mask) && (!mask.$hitTest(stageX, stageY))) {
                    return {
                        mostInnerObject : undefined,
                        isInTarget      : false,
                    };
                }
            }
        }

        const children = con.$children;
        for (let i = children.length - 1; i >= 0; --i) {
            const child = children[i];
            if (child.$maskedObject) {
                continue;
            }

            const mostInnerObject = hitTestTarget(child, stageX, stageY).mostInnerObject;
            if (mostInnerObject) {
                return {
                    mostInnerObject : mostInnerObject,
                    isInTarget      : true,
                };
            }
        }

        const isInTarget = (touchEnabled) && (checkIsInTarget(con, stageX, stageY, false));
        return {
            mostInnerObject : isInTarget ? con : undefined,
            isInTarget      : isInTarget,
        };
    }
}
/**  不考虑touchEnabled */
function checkIsInTarget(target: VendorEgretEgret.DisplayObject | VendorEgretEgret.DisplayObjectContainer, stageX: number, stageY: number, checkChildren: boolean): boolean {
    return target instanceof VendorEgretEgret.DisplayObjectContainer
        ? checkIsInContainer(target, stageX, stageY, checkChildren)
        : checkIsInObject(target, stageX, stageY);
}
/**  不考虑touchEnabled */
function checkIsInObject(obj: VendorEgretEgret.DisplayObject, stageX: number, stageY: number): boolean {
    if ((!obj.$renderNode)                              ||
        (!obj.$visible)                                 ||
        ((obj as any).$scaleX == 0)                     ||
        ((obj as any).$scaleY == 0)
    ) {
        return false;
    }

    const m = obj.$getInvertedConcatenatedMatrix();
    if (m.a == 0 && m.b == 0 && m.c == 0 && m.d == 0) {
        return false;
    }

    const localX = m.a * stageX + m.c * stageY + m.tx;
    const localY = m.b * stageX + m.d * stageY + m.ty;
    if (!obj.$getContentBounds().contains(localX, localY)) {
        return false;
    }

    if (!obj.$children) {
        {
            const rect = obj.$scrollRect ?? obj.$maskRect;
            if ((rect) && (!rect.contains(localX, localY))) {
                return false;
            }
        }

        {
            const mask = obj.$mask;
            if ((mask) && (!mask.$hitTest(stageX, stageY))) {
                return false;
            }
        }
    }

    if (obj instanceof VendorEgretEgret.Shape) {
        return obj.$graphics.$hitTest(stageX, stageY) != null;
    } else {
        return true;
    }
}
/**  不考虑touchEnabled */
function checkIsInContainer(con: VendorEgretEgret.DisplayObjectContainer, stageX: number, stageY: number, checkChildren: boolean): boolean {
    if ((!con.$visible)             ||
        ((con as any).$scaleX == 0) ||
        ((con as any).$scaleY == 0)
    ) {
        return false;
    }

    {
        const matrix    = con.$getInvertedConcatenatedMatrix();
        const localX    = matrix.a * stageX + matrix.c * stageY + matrix.tx;
        const localY    = matrix.b * stageX + matrix.d * stageY + matrix.ty;
        {
            const rect = con.$scrollRect ?? con.$maskRect;
            if ((rect) && (!rect.contains(localX, localY))) {
                return false;
            }
        }
        {
            const mask = con.$mask;
            if ((mask) && (!mask.$hitTest(stageX, stageY))) {
                return false;
            }
        }
        {
            // TODO 如果点在容器范围内直接返回true，不考虑子项，但不知道对不对
            if ((localX >= 0) && (localY >= 0)) {
                const size = getUnscaledSize(con);
                if ((localX <= size.width) && (localY <= size.height)) {
                    return true;
                }
            }
        }
    }

    if (checkChildren) {
        const children = con.$children;
        for (let i = children.length - 1; i >= 0; i--) {
            const child = children[i];
            if (child.$maskedObject) {
                continue;
            }

            if (checkIsInTarget(child, stageX, stageY, checkChildren)) {
                return true;
            }
        }
    }

    return false;
}
export function getUnscaledSize(obj: VendorEgretEgret.DisplayObject): AuxiliaryTypesAuxiliaryTypes.Size {
    if ((obj instanceof UiUtilsUiFactory.getUiContainerBaseClass())    ||
        (obj instanceof UiUtilsUiFactory.getUiImageClass())            ||
        (obj instanceof UiUtilsUiFactory.getUiLabelClass())
    ) {
        return { width: obj.getUnscaledWidth(), height: obj.getUnscaledHeight() };
    } else {
        return { width: obj.width, height: obj.height };
    }
}

// export function removeAndDestroyDirectChildren(container: Container, options: DestroyOptions | undefined): void {
//     for (const child of container.removeChildren()) {
//         child.destroy(options);
//     }
// }
