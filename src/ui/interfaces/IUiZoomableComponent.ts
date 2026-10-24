import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import type * as UiInterfacesIUiComponent from "./IUiComponent.ts";
import type * as UiInterfacesIUiContainerBase from "./IUiContainerBase.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

type Point = AuxiliaryTypesAuxiliaryTypes.Point;

export interface IUiZoomableComponent extends UiInterfacesIUiContainerBase.IUiContainerBase {
    setMouseWheelListenerEnabled(enabled: boolean): void;

    getTouchListenerEnabled(): boolean;
    setTouchListenerEnabled(enabled: boolean, mouseStyle?: HelpersPointerInput.MouseStyleType): void;

    addContent(content: UiInterfacesIUiComponent.IUiComponent): void;
    removeContent<T extends UiInterfacesIUiComponent.IUiComponent>(content: T): T | undefined;
    removeAllContents(): UiInterfacesIUiComponent.IUiComponent[];
    getContentsContainerLocalToGlobal(point: Point): VendorEgretEgret.Point;
    getContentsContainerGlobalToLocal(point: Point): VendorEgretEgret.Point;

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

    setZoomByTouches(currGlobalPoints: AuxiliaryTypesAuxiliaryTypes.TouchPoints, prevGlobalPoints: AuxiliaryTypesAuxiliaryTypes.TouchPoints): void;

    setDragByTouches(currGlobalPoint: Point, prevGlobalPoint: Point): void;

    getRevisedContentX(contentX: number): number;
    getRevisedContentY(contentY: number): number;
}
