import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import type * as UiInterfacesIUiEventAgent from "./IUiEventAgent.ts";
import type * as UiInterfacesIUiSizerInfo from "./IUiSizerInfo.ts";
import type * as UiInterfacesIUiSkinInfo from "./IUiSkinInfo.ts";
import type * as UiTypesUiSkinAttrs from "../types/UiSkinAttrs.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export interface IUiComponent {
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // event
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getEventAgent(): UiInterfacesIUiEventAgent.IUiEventAgent;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // sizer
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    checkAndInitSizerInfo(): UiInterfacesIUiSizerInfo.IUiSizerInfo;
    getSizerInfo(): UiInterfacesIUiSizerInfo.IUiSizerInfo | undefined;
    destroySizerInfo(): void;

    applySizeFromSizerInfo(width: number | undefined, height: number | undefined): boolean;
    applyPositionFromSizerInfo(x: number | undefined, y: number | undefined): void;

    setCallbackOnAppliedSizeFromSizerInfo(callback: (component: IUiComponent, width: number | undefined, height: number | undefined) => void): void;
    setCallbackOnAppliedPositionFromSizerInfo(callback: (component: IUiComponent, x: number | undefined, y: number | undefined) => void): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // skin
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    checkAndInitSkinInfo(): UiInterfacesIUiSkinInfo.IUiSkinInfo;
    getSkinInfo(): UiInterfacesIUiSkinInfo.IUiSkinInfo | undefined;

    loadSkinAttrs(oldSkinAttrs: UiTypesUiSkinAttrs.UiSkinAttrs | undefined, newSkinAttrs: UiTypesUiSkinAttrs.UiSkinAttrs): void;
    updateOnLoadedSkinChildren?(): void;
    updateOnLoadedSkin?(): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // others
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getIsTouchEnabled(): boolean;
    setIsTouchEnabled(enabled: boolean): void;
    getMouseStyle(): HelpersPointerInput.MouseStyleType | undefined;
    setMouseStyle(style: HelpersPointerInput.MouseStyleType): void;
    getParent(): VendorEgretEgret.DisplayObjectContainer | undefined | null;
    getAabbToParent(): AuxiliaryTypesAuxiliaryTypes.Rectangle;
    localToGlobal(x: number, y: number, resultPoint?: VendorEgretEgret.Point): VendorEgretEgret.Point;
    globalToLocal(x: number, y: number, resultPoint?: VendorEgretEgret.Point): VendorEgretEgret.Point;

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
