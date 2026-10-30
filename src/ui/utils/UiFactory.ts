import type { IUiButton } from "../interfaces/IUiButton.ts";
import type { IUiCoInfo } from "../interfaces/IUiCoInfo.ts";
import type { IUiContainer } from "../interfaces/IUiContainer.ts";
import type { IUiContainerBase } from "../interfaces/IUiContainerBase.ts";
import type { IUiImage } from "../interfaces/IUiImage.ts";
import type { IUiLabel } from "../interfaces/IUiLabel.ts";
import type { IUiLayer } from "../interfaces/IUiLayer.ts";
import type { IUiLayout } from "../interfaces/IUiLayout.ts";
import type { IUiLayoutBase } from "../interfaces/IUiLayoutBase.ts";
import type { IUiList } from "../interfaces/IUiList.ts";
import type { IUiListItemRenderer } from "../interfaces/IUiListItemRenderer.ts";
import type { IUiMapInfo } from "../interfaces/IUiMapInfo.ts";
import type { IUiOpenableComponent } from "../interfaces/IUiOpenableComponent.ts";
import type { IUiPanel } from "../interfaces/IUiPanel.ts";
import type { IUiProgressBar } from "../interfaces/IUiProgressBar.ts";
import type { IUiPromptedInput } from "../interfaces/IUiPromptedInput.ts";
import type { IUiRadioButton } from "../interfaces/IUiRadioButton.ts";
import type { IUiScroller } from "../interfaces/IUiScroller.ts";
import type { IUiScrollerBase } from "../interfaces/IUiScrollerBase.ts";
import type { IUiScrollList } from "../interfaces/IUiScrollList.ts";
import type { IUiSwitch } from "../interfaces/IUiSwitch.ts";
import type { IUiTab } from "../interfaces/IUiTab.ts";
import type { IUiTextInput } from "../interfaces/IUiTextInput.ts";
import type { IUiTileView } from "../interfaces/IUiTileView.ts";
import type { IUiUnitView } from "../interfaces/IUiUnitView.ts";
import type { IUiZoomableComponent } from "../interfaces/IUiZoomableComponent.ts";
import type { IUiZoomableMap } from "../interfaces/IUiZoomableMap.ts";
import type { UiLayoutOptions } from "../types/UiLayoutOptions.ts";
import type { UiListItemData } from "../types/UiListItemData.ts";
import type { UiScrollerOptions } from "../types/UiScrollerOptions.ts";
import type { UiSizerOptions } from "../types/UiSizerOptions.ts";
import type { UiUnitViewData } from "../types/UiUnitViewData.ts";

let _uiButton                   : new () => IUiButton;
let _uiCoInfo                   : new () => IUiCoInfo;
let _uiContainer                : new () => IUiContainer;
let _uiContainerBase            : new () => IUiContainerBase;
let _uiImage                    : new (
    _?: {
        textureSourceName?  : string;
        scale9Grid?         : number[];
        callbackOnLoaded?   : (s: IUiImage) => void;
    }
) => IUiImage;
let _uiLabel                    : new () => IUiLabel;
let _uiLayer                    : new () => IUiLayer;
let _uiLayout                   : new (layoutOptions?: UiLayoutOptions) => IUiLayout;
let _uiLayoutBase               : new (layoutOptions?: UiLayoutOptions) => IUiLayoutBase;
let _uiList                     : new (layoutOptions?: UiLayoutOptions) => IUiList<any>;
let _uiListItemRenderer         : new () => IUiListItemRenderer<any>;
let _uiMapInfo                  : new () => IUiMapInfo;
let _uiOpenableComponent        : new () => IUiOpenableComponent<any>;
let _uiPanel                    : new () => IUiPanel<unknown>;
let _uiProgressBar              : new () => IUiProgressBar;
let _uiPromptedInput            : new () => IUiPromptedInput;
let _uiRadioButton              : new () => IUiRadioButton;
let _uiScroller                 : new (scrollerOptions?: UiScrollerOptions) => IUiScroller<any>;
let _uiScrollerBase             : new (scrollerOptions?: UiScrollerOptions) => IUiScrollerBase;
let _uiScrollList               : new (scrollerOptions?: UiScrollerOptions) => IUiScrollList<any>;
let _uiSwitch                   : new () => IUiSwitch;
let _uiTab                      : new () => IUiTab<any, any>;
let _uiTextInput                : new () => IUiTextInput;
let _uiTileView                 : new () => IUiTileView;
let _uiUnitView                 : new (data?: UiUnitViewData, tickCount?: number) => IUiUnitView;
let _uiZoomableComponent        : new () => IUiZoomableComponent;
let _uiZoomableMap              : new (sizerOptions?: UiSizerOptions) => IUiZoomableMap;

export function init({
    uiButton,
    uiCoInfo,
    uiContainer,
    uiContainerBase,
    uiImage,
    uiLabel,
    uiLayer,
    uiLayout,
    uiLayoutBase,
    uiList,
    uiListItemRenderer,
    uiMapInfo,
    uiOpenableComponent,
    uiPanel,
    uiProgressBar,
    uiPromptedInput,
    uiRadioButton,
    uiScroller,
    uiScrollerBase,
    uiScrollList,
    uiSwitch,
    uiTab,
    uiTextInput,
    uiTileView,
    uiUnitView,
    uiZoomableComponent,
    uiZoomableMap,
}: {
    uiButton                    : new () => IUiButton;
    uiCoInfo                    : new () => IUiCoInfo;
    uiContainer                 : new () => IUiContainer;
    uiContainerBase             : new () => IUiContainerBase;
    uiImage                     : new (
        _?: {
            textureSourceName?  : string;
            scale9Grid?         : number[];
            callbackOnLoaded?   : (s: IUiImage) => void;
        }
    ) => IUiImage;
    uiLabel                     : new () => IUiLabel;
    uiLayer                     : new () => IUiLayer;
    uiLayout                    : new (layoutOptions?: UiLayoutOptions) => IUiLayout;
    uiLayoutBase                : new (layoutOptions?: UiLayoutOptions) => IUiLayoutBase;
    uiList                      : new (layoutOptions?: UiLayoutOptions) => IUiList<any>;
    uiListItemRenderer          : new () => IUiListItemRenderer<any>;
    uiMapInfo                   : new () => IUiMapInfo;
    uiOpenableComponent         : new () => IUiOpenableComponent<any>;
    uiPanel                     : new () => IUiPanel<unknown>;
    uiProgressBar               : new () => IUiProgressBar;
    uiPromptedInput             : new () => IUiPromptedInput;
    uiRadioButton               : new () => IUiRadioButton;
    uiScroller                  : new (scrollerOptions?: UiScrollerOptions) => IUiScroller<any>;
    uiScrollerBase              : new (scrollerOptions?: UiScrollerOptions) => IUiScrollerBase;
    uiScrollList                : new (scrollerOptions?: UiScrollerOptions) => IUiScrollList<any>;
    uiSwitch                    : new () => IUiSwitch;
    uiTab                       : new () => IUiTab<any, any>;
    uiTextInput                 : new () => IUiTextInput;
    uiTileView                  : new () => IUiTileView;
    uiUnitView                  : new () => IUiUnitView;
    uiZoomableComponent         : new () => IUiZoomableComponent;
    uiZoomableMap               : new () => IUiZoomableMap;
}): void {
    _uiButton                   = uiButton;
    _uiCoInfo                   = uiCoInfo;
    _uiContainer                = uiContainer;
    _uiContainerBase            = uiContainerBase;
    _uiImage                    = uiImage;
    _uiLabel                    = uiLabel;
    _uiLayer                    = uiLayer;
    _uiLayout                   = uiLayout;
    _uiLayoutBase               = uiLayoutBase;
    _uiList                     = uiList;
    _uiListItemRenderer         = uiListItemRenderer;
    _uiMapInfo                  = uiMapInfo;
    _uiOpenableComponent        = uiOpenableComponent;
    _uiPanel                    = uiPanel;
    _uiProgressBar              = uiProgressBar;
    _uiPromptedInput            = uiPromptedInput;
    _uiRadioButton              = uiRadioButton;
    _uiScrollerBase             = uiScrollerBase;
    _uiScroller                 = uiScroller;
    _uiScrollList               = uiScrollList;
    _uiSwitch                   = uiSwitch;
    _uiTab                      = uiTab;
    _uiTextInput                = uiTextInput;
    _uiTileView                 = uiTileView;
    _uiUnitView                 = uiUnitView;
    _uiZoomableComponent        = uiZoomableComponent;
    _uiZoomableMap              = uiZoomableMap;
}

export function getUiButtonClass(): new () => IUiButton {
    return _uiButton;
}
export function getUiCoInfoClass(): new (sizerOptions?: UiSizerOptions) => IUiCoInfo {
    return _uiCoInfo;
}
export function getUiContainerClass(): new () => IUiContainer {
    return _uiContainer;
}
export function getUiContainerBaseClass(): new () => IUiContainerBase {
    return _uiContainerBase;
}
export function getUiImageClass(): new (
    _?: {
        textureSourceName?  : string;
        scale9Grid?         : number[];
        callbackOnLoaded?   : (s: IUiImage) => void;
    }
) => IUiImage {
    return _uiImage;
}
export function getUiLabelClass(): new () => IUiLabel {
    return _uiLabel;
}
export function getUiLayerClass(): new () => IUiLayer {
    return _uiLayer;
}
export function getUiLayoutClass(): new (layoutOptions?: UiLayoutOptions) => IUiLayout {
    return _uiLayout;
}
export function getUiLayoutBaseClass(): new (layoutOptions?: UiLayoutOptions) => IUiLayoutBase {
    return _uiLayoutBase;
}
export function getUiListClass(): new (layoutOptions?: UiLayoutOptions) => IUiList<any> {
    return _uiList;
}
export function getUiListItemRendererClass(): new () => IUiListItemRenderer<any> {
    return _uiListItemRenderer;
}
export function getUiMapInfoClass(): new () => IUiMapInfo {
    return _uiMapInfo;
}
export function getUiOpenableComponentClass(): new () => IUiOpenableComponent<any> {
    return _uiOpenableComponent;
}
export function getUiPanelClass(): new () => IUiPanel<unknown> {
    return _uiPanel;
}
export function getUiProgressBarClass(): new () => IUiProgressBar {
    return _uiProgressBar;
}
export function getUiPromptedInputClass(): new () => IUiPromptedInput {
    return _uiPromptedInput;
}
export function getUiRadioButtonClass(): new () => IUiRadioButton {
    return _uiRadioButton;
}
export function getUiScrollerClass(): new (scrollerOptions?: UiScrollerOptions) => IUiScroller<any> {
    return _uiScroller;
}
export function getUiScrollerBaseClass(): new (scrollerOptions?: UiScrollerOptions) => IUiScrollerBase {
    return _uiScrollerBase;
}
export function getUiScrollListClass(): new (scrollerOptions?: UiScrollerOptions) => IUiScrollList<any> {
    return _uiScrollList;
}
export function getUiSwitchClass(): new () => IUiSwitch {
    return _uiSwitch;
}
export function getUiTabClass(): new () => IUiTab<any, any> {
    return _uiTab;
}
export function getUiTextInputClass(): new () => IUiTextInput {
    return _uiTextInput;
}
export function getUiTileViewClass(): new () => IUiTileView {
    return _uiTileView;
}
export function getUiUnitViewClass(): new (data?: UiUnitViewData, tickCount?: number) => IUiUnitView {
    return _uiUnitView;
}
export function getUiZoomableComponentClass(): new () => IUiZoomableComponent {
    return _uiZoomableComponent;
}
export function getUiZoomableMapClass(): new () => IUiZoomableMap {
    return _uiZoomableMap;
}
