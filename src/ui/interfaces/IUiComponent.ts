import type { Rectangle } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MouseStyleType } from "../../helpers/PointerInput.ts";
import type { IUiEventAgent } from "./IUiEventAgent.ts";
import type { IUiSizerInfo } from "./IUiSizerInfo.ts";
import type { IUiSkinInfo } from "./IUiSkinInfo.ts";
import type { UiSkinAttrs } from "../types/UiSkinAttrs.ts";
import type {
    DisplayObjectContainer,
    Point,
} from "../../vendor/egret/Egret.ts";

export interface IUiComponent {
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // event
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getEventAgent(): IUiEventAgent;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // sizer
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    checkAndInitSizerInfo(): IUiSizerInfo;
    getSizerInfo(): IUiSizerInfo | undefined;
    destroySizerInfo(): void;

    applySizeFromSizerInfo(width: number | undefined, height: number | undefined): boolean;
    applyPositionFromSizerInfo(x: number | undefined, y: number | undefined): void;

    setCallbackOnAppliedSizeFromSizerInfo(callback: (component: IUiComponent, width: number | undefined, height: number | undefined) => void): void;
    setCallbackOnAppliedPositionFromSizerInfo(callback: (component: IUiComponent, x: number | undefined, y: number | undefined) => void): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // skin
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    checkAndInitSkinInfo(): IUiSkinInfo;
    getSkinInfo(): IUiSkinInfo | undefined;

    loadSkinAttrs(oldSkinAttrs: UiSkinAttrs | undefined, newSkinAttrs: UiSkinAttrs): void;
    updateOnLoadedSkinChildren?(): void;
    updateOnLoadedSkin?(): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // others
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getIsTouchEnabled(): boolean;
    setIsTouchEnabled(enabled: boolean): void;
    getMouseStyle(): MouseStyleType | undefined;
    setMouseStyle(style: MouseStyleType): void;
    getParent(): DisplayObjectContainer | undefined | null;
    getAabbToParent(): Rectangle;
    localToGlobal(x: number, y: number, resultPoint?: Point): Point;
    globalToLocal(x: number, y: number, resultPoint?: Point): Point;

    getX(): number;
    setX(x: number): void;
    getY(): number;
    setY(y: number): void;
    getAnchorOffsetX(): number;
    setAnchorOffsetX(anchorOffsetX: number): void;
    getAnchorOffsetY(): number;
    setAnchorOffsetY(anchorOffsetY: number): void;
    getScaleX(): number;
    setScaleX(scaleX: number): void;
    getScaleY(): number;
    setScaleY(scaleY: number): void;
    getRotationInDegree(): number;
    setRotationInDegree(rotation: number): void;
    getIsVisible(): boolean;
    setIsVisible(isVisible: boolean): void;
    getAlpha(): number;
    setAlpha(alpha: number): void;
    getUnscaledWidth(): number;
    getUnscaledHeight(): number;
    getScaledWidth(): number;
    getScaledHeight(): number;
    getUnscaledManualWidth(): number | undefined;
    setUnscaledManualWidth(width: number | undefined): boolean;
    getUnscaledManualHeight(): number | undefined;
    setUnscaledManualHeight(height: number | undefined): boolean;
}
