import type {
    Point as AuxiliaryTypesPoint,
    TouchPoints,
} from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MouseStyleType } from "../../helpers/PointerInput.ts";
import type { IUiComponent } from "./IUiComponent.ts";
import type { IUiContainerBase } from "./IUiContainerBase.ts";
import type { Point as EgretPoint } from "../../vendor/egret/Egret.ts";

export interface IUiZoomableComponent extends IUiContainerBase {
    setMouseWheelListenerEnabled(enabled: boolean): void;

    getTouchListenerEnabled(): boolean;
    setTouchListenerEnabled(enabled: boolean, mouseStyle?: MouseStyleType): void;

    addContent(content: IUiComponent): void;
    removeContent<T extends IUiComponent>(content: T): T | undefined;
    removeAllContents(): IUiComponent[];
    getContentsContainerLocalToGlobal(point: AuxiliaryTypesPoint): EgretPoint;
    getContentsContainerGlobalToLocal(point: AuxiliaryTypesPoint): EgretPoint;

    getContentWidth(): number;
    getContentHeight(): number;
    setContentSize(width: number, height: number): void;

    setBoundarySpacings(left?: number, right?: number, top?: number, bottom?: number): void;

    setContentX(x: number, needRevise: boolean): void;
    set customContentX(x: number);
    get customContentX(): number;
    getContentX(): number;
    setContentY(y: number, needRevise: boolean): void;
    set customContentY(y: number);
    get customContentY(): number;
    getContentY(): number;
    tweenContentToPoint(contentX: number, contentY: number, needRevise: boolean): void;

    setContentScale(scale: number, needRevise: boolean): void;
    getContentScale(): number;

    setZoomByScroll(stageX: number, stageY: number, scrollValue: number): void;

    setZoomByTouches(currGlobalPoints: TouchPoints, prevGlobalPoints: TouchPoints): void;

    setDragByTouches(currGlobalPoint: AuxiliaryTypesPoint, prevGlobalPoint: AuxiliaryTypesPoint): void;

    getRevisedContentX(contentX: number): number;
    getRevisedContentY(contentY: number): number;
}
