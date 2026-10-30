import {
    type Egret_Egret,
    type Ui_Interfaces_IUiEventAgent,
    type Ui_Interfaces_IUiSizerInfo,
    type Ui_Interfaces_IUiSkinInfo,
    type Helpers_PointerInput,
    type AuxiliaryTypes_AuxiliaryTypes,
    type Ui_Types_UiSkinAttrs,
} from "../../internal.ts";

export interface IUiComponent {
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // event
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getEventAgent(): Ui_Interfaces_IUiEventAgent.IUiEventAgent;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // sizer
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    checkAndInitSizerInfo(): Ui_Interfaces_IUiSizerInfo.IUiSizerInfo;
    getSizerInfo(): Ui_Interfaces_IUiSizerInfo.IUiSizerInfo | undefined;
    destroySizerInfo(): void;

    applySizeFromSizerInfo(width: number | undefined, height: number | undefined): boolean;
    applyPositionFromSizerInfo(x: number | undefined, y: number | undefined): void;

    setCallbackOnAppliedSizeFromSizerInfo(callback: (component: IUiComponent, width: number | undefined, height: number | undefined) => void): void;
    setCallbackOnAppliedPositionFromSizerInfo(callback: (component: IUiComponent, x: number | undefined, y: number | undefined) => void): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // skin
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    checkAndInitSkinInfo(): Ui_Interfaces_IUiSkinInfo.IUiSkinInfo;
    getSkinInfo(): Ui_Interfaces_IUiSkinInfo.IUiSkinInfo | undefined;

    loadSkinAttrs(oldSkinAttrs: Ui_Types_UiSkinAttrs.UiSkinAttrs | undefined, newSkinAttrs: Ui_Types_UiSkinAttrs.UiSkinAttrs): void;
    updateOnLoadedSkinChildren?(): void;
    updateOnLoadedSkin?(): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // others
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getIsTouchEnabled(): boolean;
    setIsTouchEnabled(enabled: boolean): void;
    getMouseStyle(): Helpers_PointerInput.MouseStyleType | undefined;
    setMouseStyle(style: Helpers_PointerInput.MouseStyleType): void;
    getParent(): Egret_Egret.DisplayObjectContainer | undefined | null;
    getAabbToParent(): AuxiliaryTypes_AuxiliaryTypes.Rectangle;
    localToGlobal(x: number, y: number, resultPoint?: Egret_Egret.Point): Egret_Egret.Point;
    globalToLocal(x: number, y: number, resultPoint?: Egret_Egret.Point): Egret_Egret.Point;

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
