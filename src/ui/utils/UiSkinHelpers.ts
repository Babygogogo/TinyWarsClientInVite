import { TreeNode } from "../../auxiliaryTypes/TreeNode.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { getSkin } from "../../ResManager.ts";
import type { IUiComponent } from "../interfaces/IUiComponent.ts";
import { UiCommonEventType } from "../types/UiCommonEventType.ts";
import { UiComponentType } from "../types/UiComponentType.ts";
import type { UiSkin as UiTypesUiSkin } from "../types/UiSkin.ts";
import type { UiSkinAttrs as UiTypesUiSkinAttrs } from "../types/UiSkinAttrs.ts";
import { UiSkinState } from "../types/UiSkinState.ts";
import {
    getUiContainerClass,
    getUiLayoutClass,
    getUiScrollerClass,
    getUiScrollListClass,
    getUiImageClass,
    getUiLabelClass,
    getUiButtonClass,
    getUiTextInputClass,
    getUiPromptedInputClass,
    getUiListClass,
    getUiTabClass,
    getUiProgressBarClass,
    getUiRadioButtonClass,
    getUiSwitchClass,
    getUiZoomableComponentClass,
    getUiZoomableMapClass,
    getUiMapInfoClass,
    getUiCoInfoClass,
    getUiContainerBaseClass,
} from "./UiFactory.ts";
import { loadSizerOptions } from "./UiSizerHelpers.ts";

type UiSkinAttrs        = UiTypesUiSkinAttrs;
type UiSkin             = UiTypesUiSkin;
type IUiSkinLoader      = IUiComponent;

const UiSkinDefaultAttrs: UiSkinAttrs = {
    x                   : 0,
    y                   : 0,
    scaleX              : 1,
    scaleY              : 1,
    anchorOffsetX       : 0,
    anchorOffsetY       : 0,
    alpha               : 1,
    visible             : 1,
    rotation            : 0,
    source              : "",
    smoothing           : 1,
    icon                : "",
    label               : "",
    text                : "",
    textColor           : "#FFFFFF",
    size                : 30,
    bold                : 0,
    italic              : 0,
    lineSpacing         : 0,
    horizontalAlign     : 0,
    verticalAlign       : 0,
    stroke              : 0,
    strokeColor         : "#000000",
    restrict            : "",
    displayAsPassword   : 0,
    multiline           : 0,
    // autoShrinkWidth     : 0,
};
function getDefaultTouchEnabled(uiType: UiComponentType): boolean {
    return (uiType === UiComponentType.Button)
        || (uiType === UiComponentType.TextInput)
        || (uiType === UiComponentType.Scroller)
        || (uiType === UiComponentType.ScrollList);
}
function getDefaultTouchChildren(uiType: UiComponentType): boolean {
    return (uiType !== UiComponentType.Button)
        && (uiType !== UiComponentType.TextInput);
}

interface ResultForLoadSkin {
    ui                  : IUiSkinLoader;
    nonNestedChildren   : TreeNode<IUiSkinLoader>[];
}

// const debugLoadedSkinSet = new Set<IUiSkinLoader>();
// function debugUpdateLoadedSkinSet(ui: IUiSkinLoader): void {
//     if (!debugLoadedSkinSet.has(ui)) {
//         debugLoadedSkinSet.add(ui);
//     } else {
//         throw newError(`ui.updateOnLoadedSkin() has been called more than once!`);
//     }
// }
// const debugLoadedSkinAttrSet = new Set<IUiSkinLoader>();

export function loadSkinByPath<T extends IUiSkinLoader>(root: T, skinPath: string): T {
    return loadSkin(root, getExisted(getSkin(skinPath)));
}
export function loadSkin<T extends IUiSkinLoader>(root: T, skin: UiSkin): T {
    doLoadSkin({
        root            : root,
        ui              : root,
        skin            : skin,
        isNestedSkin    : false,
        isRootSkin      : true,
    });

    return root;
}
function doLoadSkin({ root, ui, skin, isNestedSkin, isRootSkin }: {
    root            : IUiSkinLoader;
    ui              : IUiSkinLoader;
    skin            : UiSkin;
    isNestedSkin    : boolean;
    isRootSkin      : boolean;
}): ResultForLoadSkin {
    const skinInfo = ui.checkAndInitSkinInfo();
    if (skinInfo.getNonNestedSkinChildren()) {
        throw newError(`ui.getNonNestedSkinChildren() must be null here.`);
    }
    if (isNestedSkin) {
        if (!skinInfo.getSkin()) {
            throw newError(`ui.getLoadedSkin() must not be null here.`);
        }
    } else {
        if (skinInfo.getSkin()) {
            throw newError(`ui.getLoadedSkin() must be null here.`);
        }
        skinInfo.setSkin(skin);
    }

    const nonNestedChildren : TreeNode<IUiSkinLoader>[] = [];
    const nestedSkin        = getNestedSkin(skin);
    if (nestedSkin) {
        doLoadSkin({
            root            : ui,
            ui              : ui,
            skin            : nestedSkin,
            isNestedSkin    : true,
            isRootSkin      : false,
        });
    } else {
        const directSkinChildren: WeakRef<IUiSkinLoader>[] = [];
        for (const childSkin of skin.$$ ?? []) {
            const result = doLoadSkin({
                root            : root,
                ui              : createUiByName(getExisted(childSkin.uiType)),
                skin            : childSkin,
                isNestedSkin    : false,
                isRootSkin      : false,
            });

            const childUi   = result.ui;
            const node      = new TreeNode(childUi);
            for (const childNode of result.nonNestedChildren) {
                node.addChild(childNode.clone());
            }
            nonNestedChildren.push(node);

            if (ui instanceof getUiContainerClass()) {
                ui.addUiChild(childUi);
            } else if (ui instanceof getUiLayoutClass()) {
                ui.addItem(childUi, false);
            } else if (ui instanceof getUiScrollerClass()) {
                ui.initViewport(childUi);
            } else if (ui instanceof getUiScrollListClass()) {
                ui.initViewport(childUi as unknown as any);
            } else {
                // ui.addChild(childUi);
                throw newError(`Cannot add child.`);
            }
            directSkinChildren.push(new WeakRef(childUi));

            const childId = childSkin.id;
            if (childId != null) {
                if ((root as any)[childId] != null) {
                    throw new Error(`child id is used: ${childId}.`);
                }
                (root as any)[childId] = childUi;
            }
        }
        ui.updateOnLoadedSkinChildren?.call(ui);
        skinInfo.setNonNestedSkinChildren(nonNestedChildren.map(v => v.convert(data => new WeakRef(data))));
        skinInfo.setDirectSkinChildren(directSkinChildren);
    }

    {   // debug
        if (!skinInfo.getNonNestedSkinChildren()) {
            throw newError(`ui.getNonNestedSkinChildren() must not be null here.`);
        }
        const temp = nonNestedChildren.flatMap(v => v.bfs());
        if (new Set(temp).size !== temp.length) {
            throw newError(`nonNestedChildren contains duplicated element.`);
        }
    }

    if ((isNestedSkin) || (isRootSkin)) {
        const state = skin.currentState ?? "";
        for (const childNode of nonNestedChildren) {
            for (const child of childNode.dfs()) {
                const childSkinInfo = getExisted(child.getSkinInfo());
                loadSkinAttrs(child, state, getNestedSkin(getExisted(childSkinInfo.getSkin()))?.currentState);
                childSkinInfo.setIsLoaded(true);
                child.getEventAgent().dispatchUiCommonEvent(UiCommonEventType.SkinLoaded);
                child.updateOnLoadedSkin?.call(child);
                // debugUpdateLoadedSkinSet(child);
            }
        }

        if (isRootSkin) {
            loadSkinAttrs(ui, state, undefined);
            skinInfo.setIsLoaded(true);
            ui.getEventAgent().dispatchUiCommonEvent(UiCommonEventType.SkinLoaded);
            ui.updateOnLoadedSkin?.call(ui);
            // debugUpdateLoadedSkinSet(ui);
        }
    }

    return {
        ui                  : ui,
        nonNestedChildren   : nonNestedChildren,
    };
}
function createUiByName(name: UiComponentType): IUiSkinLoader {
    switch (name) {
        case UiComponentType.Image              : return new (getUiImageClass())();                 // 仅属性
        case UiComponentType.Image9             : return new (getUiImageClass())();                 // 仅属性
        case UiComponentType.Label              : return new (getUiLabelClass())();                 // 仅属性
        case UiComponentType.Group              : return new (getUiContainerClass())();             // 仅属性
        case UiComponentType.Button             : return new (getUiButtonClass())();                // 带皮肤
        case UiComponentType.Layout             : return new (getUiLayoutClass())();                // 仅属性
        case UiComponentType.Scroller           : return new (getUiScrollerClass())();              // 带皮肤 ??
        case UiComponentType.ScrollList         : return new (getUiScrollListClass())();
        case UiComponentType.TextInput          : return new (getUiTextInputClass())();             // 带皮肤
        case UiComponentType.PromptedInput      : return new (getUiPromptedInputClass())();         // 带皮肤
        case UiComponentType.List               : return new (getUiListClass())();
        case UiComponentType.Tab                : return new (getUiTabClass())();
        case UiComponentType.ProgressBar        : return new (getUiProgressBarClass())();
        case UiComponentType.RadioButton        : return new (getUiRadioButtonClass())();
        case UiComponentType.Switch             : return new (getUiSwitchClass())();
        case UiComponentType.ZoomableComponent  : return new (getUiZoomableComponentClass())();
        case UiComponentType.ZoomableMap        : return new (getUiZoomableMapClass())();
        case UiComponentType.MapInfo            : return new (getUiMapInfoClass())();
        case UiComponentType.CoInfo             : return new (getUiCoInfoClass())();
        default                                 : throw new Error(`Unknown skin name: ${name}`);
    }
}

function getNestedSkin(skin: UiSkin): UiSkin | undefined {
    const nestedSkinName = skin.nestedSkinName;
    return nestedSkinName == null ? skin.nestedSkin : getExisted(getSkin(nestedSkinName));
}
export function getRevisedAttrValue<K extends keyof UiSkinAttrs>(
    oldSkinAttrs    : UiSkinAttrs | undefined,
    newSkinAttrs    : UiSkinAttrs,
    key             : K
): { needChange: boolean, value: UiSkinAttrs[K] } {
    const newValue = newSkinAttrs[key];
    return (oldSkinAttrs != null) && (oldSkinAttrs[key] == newValue)
        ? { needChange: false,  value: undefined }
        : { needChange: true,   value: newValue };
}

export function loadSkinStateRecursively(ui: IUiSkinLoader, state: UiSkinState): void {
    const skinInfo = getExisted(ui.getSkinInfo());
    for (const childNode of getExisted(skinInfo.getNonNestedSkinChildren())) {
        for (const rawChild of childNode.dfs()) {
            const child = rawChild.deref();
            if (child) {
                loadSkinAttrs(child, state, getExisted(child.getSkinInfo()).getLoadedSkinNestedState());
            }
        }
    }
    loadSkinAttrs(ui, getExisted(skinInfo.getLoadedSkinState()), state);
}
function loadSkinAttrs(ui: IUiSkinLoader, state: string, nestedState: string | undefined): void {
    const skinInfo  = getExisted(ui.getSkinInfo());
    const skinAttrs = generateSkinAttrs(getExisted(skinInfo.getSkin()), state, nestedState);
    ui.loadSkinAttrs(skinInfo.getLoadedSkinAttrs(), skinAttrs);
    skinInfo.setLoadedSkinAttrs(skinAttrs);
    skinInfo.setLoadedSkinState(state);
    skinInfo.setLoadedSkinNestedState(nestedState);

    // if (debugLoadedSkinAttrSet.has(ui)) {
    //     throw new Error("asdf");
    // }
    // debugLoadedSkinAttrSet.add(ui);
}
export function commonLoadSkinAttrs(
    ui              : IUiSkinLoader,
    oldSkinAttrs    : UiSkinAttrs | undefined,
    newSkinAttrs    : UiSkinAttrs
): void {
    const x             = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "x");
    const y             = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "y");
    const scaleX        = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "scaleX");
    const scaleY        = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "scaleY");
    const pivotX        = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "anchorOffsetX");
    const pivotY        = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "anchorOffsetY");
    const alpha         = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "alpha");
    const visible       = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "visible");
    const rotation      = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "rotation");
    const width         = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "width");
    const height        = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "height");
    const touchEnabled  = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "touchEnabled");
    const touchChildren = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "touchChildren");
    // if (width == null) {
    //     warn(`IUiSkinLoader.loadSkinForComplexUi() width is not specified: ${JSON.stringify(attrs)}`);
    //     width = 0;    // 指定默认宽度以避免子ui错乱
    // }
    // if (height == null) {
    //     warn(`IUiSkinLoader.loadSkinForComplexUi() height is not specified: ${JSON.stringify(attrs)}`);
    //     height = 0;   // 指定默认高度以避免子ui错乱
    // }

    (x.needChange)              && (ui.setX(getExisted(x.value)));
    (y.needChange)              && (ui.setY(getExisted(y.value)));
    (scaleX.needChange)         && (ui.setScaleX(getExisted(scaleX.value)));
    (scaleY.needChange)         && (ui.setScaleY(getExisted(scaleY.value)));
    (pivotX.needChange)         && (ui.setAnchorOffsetX(getExisted(pivotX.value)));
    (pivotY.needChange)         && (ui.setAnchorOffsetY(getExisted(pivotY.value)));
    (alpha.needChange)          && (ui.setAlpha(getExisted(alpha.value)));
    (visible.needChange)        && (ui.setIsVisible(!!visible.value));
    (rotation.needChange)       && (ui.setRotationInDegree(getExisted(rotation.value)));
    (touchEnabled.needChange)   && (ui.setIsTouchEnabled(!!touchEnabled.value));
    (touchChildren.needChange)  && (ui instanceof getUiContainerBaseClass()) && (ui.setIsTouchChildrenEnabled(!!touchChildren.value));

    if (width.needChange) {
        const rawValue  = width.value;
        // if (ui instanceof UiContainer) {
        //     ui.setUnscaledManualWidth(rawValue);
        // } else {
        //     (rawValue != null) && (ui.width = rawValue * ui.getScaleX());
        // }
        ui.setUnscaledManualWidth(rawValue);
    }
    if (height.needChange) {
        const rawValue = height.value;
        // if (ui instanceof UiContainer) {
        //     ui.setUnscaledManualHeight(rawValue);
        // } else {
        //     (rawValue != null) && (ui.height = rawValue * ui.getScaleY());
        // }
        ui.setUnscaledManualHeight(rawValue);
    }
}
export function commonLoadSkinAttrsForSizer(ui: IUiSkinLoader & IUiComponent, oldSkinAttrs: UiSkinAttrs | undefined, newSkinAttrs: UiSkinAttrs): void {
    // if ((width == null)                                     &&
    //     ((attrs?.left == null) || (attrs?.right == null))
    // ) {
    //     warn(`IUiSkinLoader.loadSkinForComplexUiSizer() width is not specified: ${JSON.stringify(attrs)}`);
    //     width = 0;    // 指定默认宽度以避免子ui错乱
    // }
    // if ((height == null)                                    &&
    //     ((attrs?.top == null) || (attrs?.bottom == null))
    // ) {
    //     warn(`IUiSkinLoader.loadSkinForComplexUiSizer() height is not specified: ${JSON.stringify(attrs)}`);
    //     height = 0;   // 指定默认高度以避免子ui错乱
    // }

    commonLoadSkinAttrs(ui, oldSkinAttrs, newSkinAttrs);
    loadSizerOptions(ui, newSkinAttrs);
}

function mergeSkinAttrs(src: UiSkinAttrs | undefined, dst: UiSkinAttrs): void {
    if (src == null) {
        return;
    }

    for (const key in src) {
        const value = (src as any)[key];
        if (value != null) {
            (dst as any)[key] = value;
        }
    }
}
function generateSkinAttrsForState(skinAttrDict: Record<string, UiSkinAttrs> | undefined, state: string | undefined): UiSkinAttrs | undefined {
    if (skinAttrDict == null) {
        return undefined;
    }

    const defaultAttrs  = skinAttrDict[UiSkinState.Default];
    const attrs         = skinAttrDict[state ?? UiSkinState.Default];
    const dstAttrs      = deepClone(defaultAttrs) ?? {};
    if ((attrs != null) && (attrs != defaultAttrs)) {
        for (const key in attrs) {
            const value = (attrs as any)[key];
            if (value != null) {
                (dstAttrs as any)[key] = value;
            }
        }
    }
    return dstAttrs;
}
function generateSkinAttrs(skin: UiSkin, state: string | undefined, nestedState: string | undefined): UiSkinAttrs {
    const dstAttrs          = deepClone(UiSkinDefaultAttrs);
    const uiType            = getExisted(skin.uiType);
    dstAttrs.touchChildren  = getDefaultTouchChildren(uiType) ? 1 : 0;
    dstAttrs.touchEnabled   = getDefaultTouchEnabled(uiType) ? 1 : 0;

    const skinAttrs         = generateSkinAttrsForState(skin.$, state);
    const nestedSkinAttrs   = generateSkinAttrsForState(getNestedSkin(skin)?.$, nestedState);
    mergeSkinAttrs(nestedSkinAttrs, dstAttrs);
    mergeSkinAttrs(skinAttrs, dstAttrs);
    return dstAttrs;
}

function deepClone<T>(src: T): T {
    if ((src == null) || (typeof src != "object")) {
        return src;
    } else {
        const dst: any = (src instanceof Array) ? [] : {};
        for (const i in src) {
            dst[i] = deepClone(src[i]);
        }
        return dst;
    }
}

// export function destroyDirectSkinChildren(children: WeakRef<IUiSkinLoader>[] | undefined): void {
//     if (children) {
//         for (const child of children) {
//             child.deref()?.destroy({ children: true });
//         }
//     }
// }
