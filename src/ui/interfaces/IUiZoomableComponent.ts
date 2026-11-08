import {
    type AuxiliaryTypes_AuxiliaryTypes,
    type Egret_Egret,
    type Ui_Interfaces_IUiComponent,
    type Ui_Interfaces_IUiContainerBase,
    type Helpers_PointerInput,
} from "../../internal.ts";

export interface IUiZoomableComponent extends Ui_Interfaces_IUiContainerBase.IUiContainerBase {
    setMouseWheelListenerEnabled(enabled: boolean): void;

    getTouchListenerEnabled(): boolean;
    setTouchListenerEnabled(enabled: boolean, mouseStyle?: Helpers_PointerInput.MouseStyleType): void;

    addContent(content: Ui_Interfaces_IUiComponent.IUiComponent): void;
    removeContent<T extends Ui_Interfaces_IUiComponent.IUiComponent>(content: T): T | undefined;
    removeAllContents(): Ui_Interfaces_IUiComponent.IUiComponent[];
    getContentsContainerLocalToGlobal(point: AuxiliaryTypes_AuxiliaryTypes.Point): Egret_Egret.Point;
    getContentsContainerGlobalToLocal(point: AuxiliaryTypes_AuxiliaryTypes.Point): Egret_Egret.Point;

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

    setZoomByTouches(currGlobalPoints: AuxiliaryTypes_AuxiliaryTypes.TouchPoints, prevGlobalPoints: AuxiliaryTypes_AuxiliaryTypes.TouchPoints): void;

    setDragByTouches(currGlobalPoint: AuxiliaryTypes_AuxiliaryTypes.Point, prevGlobalPoint: AuxiliaryTypes_AuxiliaryTypes.Point): void;

    getRevisedContentX(contentX: number): number;
    getRevisedContentY(contentY: number): number;
}
