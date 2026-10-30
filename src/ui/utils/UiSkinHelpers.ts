import {
    Helpers_Misc,
    ResManager,
    AuxiliaryTypes_TreeNode,
    Ui_Components_UiButton,
    Ui_Components_UiCoInfo,
    Ui_Types_UiCommonEventType,
    Ui_Types_UiComponentType,
    Ui_Components_UiContainer,
    Ui_Components_UiContainerBase,
    Ui_Components_UiImage,
    Ui_Components_UiLabel,
    Ui_Components_UiLayout,
    Ui_Components_UiList,
    Ui_Components_UiMapInfo,
    Ui_Components_UiProgressBar,
    Ui_Components_UiPromptedInput,
    Ui_Components_UiRadioButton,
    Ui_Components_UiScroller,
    Ui_Components_UiScrollList,
    Ui_Types_UiSkinState,
    Ui_Components_UiSwitch,
    Ui_Components_UiTab,
    Ui_Components_UiTextInput,
    Ui_Components_UiZoomableComponent,
    Ui_Components_UiZoomableMap,
    type Ui_Interfaces_IUiComponent,
    type Ui_Types_UiSkin,
    type Ui_Types_UiSkinAttrs,
    Ui_Utils_UiSizerHelpers,
} from "../../internal.ts";

const UiSkinDefaultAttrs: Ui_Types_UiSkinAttrs.UiSkinAttrs = {
    x                 : 0,
    y                 : 0,
    scaleX            : 1,
    scaleY            : 1,
    anchorOffsetX     : 0,
    anchorOffsetY     : 0,
    alpha             : 1,
    visible           : 1,
    rotation          : 0,
    source            : "",
    smoothing         : 1,
    icon              : "",
    label             : "",
    text              : "",
    textColor         : "#FFFFFF",
    size              : 30,
    bold              : 0,
    italic            : 0,
    lineSpacing       : 0,
    horizontalAlign   : 0,
    verticalAlign     : 0,
    stroke            : 0,
    strokeColor       : "#000000",
    restrict          : "",
    displayAsPassword : 0,
    multiline         : 0,
    // autoShrinkWidth     : 0,
};
function getDefaultTouchEnabled(uiType: Ui_Types_UiComponentType.UiComponentType): boolean {
    return (uiType === Ui_Types_UiComponentType.UiComponentType.Button)
        || (uiType === Ui_Types_UiComponentType.UiComponentType.TextInput)
        || (uiType === Ui_Types_UiComponentType.UiComponentType.Scroller)
        || (uiType === Ui_Types_UiComponentType.UiComponentType.ScrollList);
}
function getDefaultTouchChildren(uiType: Ui_Types_UiComponentType.UiComponentType): boolean {
    return (uiType !== Ui_Types_UiComponentType.UiComponentType.Button)
        && (uiType !== Ui_Types_UiComponentType.UiComponentType.TextInput);
}

interface ResultForLoadSkin {
    ui                  : Ui_Interfaces_IUiComponent.IUiComponent;
    nonNestedChildren   : AuxiliaryTypes_TreeNode.TreeNode<Ui_Interfaces_IUiComponent.IUiComponent>[];
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

export function loadSkinByPath<T extends Ui_Interfaces_IUiComponent.IUiComponent>(root: T, skinPath: string): T {
    return loadSkin(root, Helpers_Misc.getExisted(ResManager.getSkin(skinPath)));
}
export function loadSkin<T extends Ui_Interfaces_IUiComponent.IUiComponent>(root: T, skin: Ui_Types_UiSkin.UiSkin): T {
    doLoadSkin({
        root         : root,
        ui           : root,
        skin         : skin,
        isNestedSkin : false,
        isRootSkin   : true,
    });

    return root;
}
function doLoadSkin({ root, ui, skin, isNestedSkin, isRootSkin }: {
    root            : Ui_Interfaces_IUiComponent.IUiComponent;
    ui              : Ui_Interfaces_IUiComponent.IUiComponent;
    skin            : Ui_Types_UiSkin.UiSkin;
    isNestedSkin    : boolean;
    isRootSkin      : boolean;
}): ResultForLoadSkin {
    const skinInfo = ui.checkAndInitSkinInfo();
    if (skinInfo.getNonNestedSkinChildren()) {
        throw Helpers_Misc.newError(`ui.getNonNestedSkinChildren() must be null here.`);
    }
    if (isNestedSkin) {
        if (!skinInfo.getSkin()) {
            throw Helpers_Misc.newError(`ui.getLoadedSkin() must not be null here.`);
        }
    } else {
        if (skinInfo.getSkin()) {
            throw Helpers_Misc.newError(`ui.getLoadedSkin() must be null here.`);
        }
        skinInfo.setSkin(skin);
    }

    const nonNestedChildren : AuxiliaryTypes_TreeNode.TreeNode<Ui_Interfaces_IUiComponent.IUiComponent>[] = [];
    const nestedSkin        = getNestedSkin(skin);
    if (nestedSkin) {
        doLoadSkin({
            root         : ui,
            ui           : ui,
            skin         : nestedSkin,
            isNestedSkin : true,
            isRootSkin   : false,
        });
    } else {
        const directSkinChildren: WeakRef<Ui_Interfaces_IUiComponent.IUiComponent>[] = [];
        for (const childSkin of skin.$$ ?? []) {
            const result = doLoadSkin({
                root         : root,
                ui           : createUiByName(Helpers_Misc.getExisted(childSkin.uiType)),
                skin         : childSkin,
                isNestedSkin : false,
                isRootSkin   : false,
            });

            const childUi   = result.ui;
            const node      = new AuxiliaryTypes_TreeNode.TreeNode(childUi);
            for (const childNode of result.nonNestedChildren) {
                node.addChild(childNode.clone());
            }
            nonNestedChildren.push(node);

            if (ui instanceof Ui_Components_UiContainer.UiContainer) {
                ui.addUiChild(childUi);
            } else if (ui instanceof Ui_Components_UiLayout.UiLayout) {
                ui.addItem(childUi, false);
            } else if (ui instanceof Ui_Components_UiScroller.UiScroller) {
                ui.initViewport(childUi);
            } else if (ui instanceof Ui_Components_UiScrollList.UiScrollList) {
                ui.initViewport(childUi as unknown as any);
            } else {
                // ui.addChild(childUi);
                throw Helpers_Misc.newError(`Cannot add child.`);
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
            throw Helpers_Misc.newError(`ui.getNonNestedSkinChildren() must not be null here.`);
        }
        const temp = nonNestedChildren.flatMap(v => v.bfs());
        if (new Set(temp).size !== temp.length) {
            throw Helpers_Misc.newError(`nonNestedChildren contains duplicated element.`);
        }
    }

    if ((isNestedSkin) || (isRootSkin)) {
        const state = skin.currentState ?? "";
        for (const childNode of nonNestedChildren) {
            for (const child of childNode.dfs()) {
                const childSkinInfo = Helpers_Misc.getExisted(child.getSkinInfo());
                loadSkinAttrs(child, state, getNestedSkin(Helpers_Misc.getExisted(childSkinInfo.getSkin()))?.currentState);
                childSkinInfo.setIsLoaded(true);
                child.getEventAgent().dispatchUiCommonEvent(Ui_Types_UiCommonEventType.UiCommonEventType.SkinLoaded);
                child.updateOnLoadedSkin?.call(child);
                // debugUpdateLoadedSkinSet(child);
            }
        }

        if (isRootSkin) {
            loadSkinAttrs(ui, state, undefined);
            skinInfo.setIsLoaded(true);
            ui.getEventAgent().dispatchUiCommonEvent(Ui_Types_UiCommonEventType.UiCommonEventType.SkinLoaded);
            ui.updateOnLoadedSkin?.call(ui);
            // debugUpdateLoadedSkinSet(ui);
        }
    }

    return {
        ui                : ui,
        nonNestedChildren : nonNestedChildren,
    };
}
function createUiByName(name: Ui_Types_UiComponentType.UiComponentType): Ui_Interfaces_IUiComponent.IUiComponent {
    switch (name) {
        case Ui_Types_UiComponentType.UiComponentType.Image              : return new Ui_Components_UiImage.UiImage();                 // 仅属性
        case Ui_Types_UiComponentType.UiComponentType.Image9             : return new Ui_Components_UiImage.UiImage();                 // 仅属性
        case Ui_Types_UiComponentType.UiComponentType.Label              : return new Ui_Components_UiLabel.UiLabel();                 // 仅属性
        case Ui_Types_UiComponentType.UiComponentType.Group              : return new Ui_Components_UiContainer.UiContainer();             // 仅属性
        case Ui_Types_UiComponentType.UiComponentType.Button             : return new Ui_Components_UiButton.UiButton();                // 带皮肤
        case Ui_Types_UiComponentType.UiComponentType.Layout             : return new Ui_Components_UiLayout.UiLayout();                // 仅属性
        case Ui_Types_UiComponentType.UiComponentType.Scroller           : return new Ui_Components_UiScroller.UiScroller();              // 带皮肤 ??
        case Ui_Types_UiComponentType.UiComponentType.ScrollList         : return new Ui_Components_UiScrollList.UiScrollList();
        case Ui_Types_UiComponentType.UiComponentType.TextInput          : return new Ui_Components_UiTextInput.UiTextInput();             // 带皮肤
        case Ui_Types_UiComponentType.UiComponentType.PromptedInput      : return new Ui_Components_UiPromptedInput.UiPromptedInput();         // 带皮肤
        case Ui_Types_UiComponentType.UiComponentType.List               : return new Ui_Components_UiList.UiList();
        case Ui_Types_UiComponentType.UiComponentType.Tab                : return new Ui_Components_UiTab.UiTab();
        case Ui_Types_UiComponentType.UiComponentType.ProgressBar        : return new Ui_Components_UiProgressBar.UiProgressBar();
        case Ui_Types_UiComponentType.UiComponentType.RadioButton        : return new Ui_Components_UiRadioButton.UiRadioButton();
        case Ui_Types_UiComponentType.UiComponentType.Switch             : return new Ui_Components_UiSwitch.UiSwitch();
        case Ui_Types_UiComponentType.UiComponentType.ZoomableComponent  : return new Ui_Components_UiZoomableComponent.UiZoomableComponent();
        case Ui_Types_UiComponentType.UiComponentType.ZoomableMap        : return new Ui_Components_UiZoomableMap.UiZoomableMap();
        case Ui_Types_UiComponentType.UiComponentType.MapInfo            : return new Ui_Components_UiMapInfo.UiMapInfo();
        case Ui_Types_UiComponentType.UiComponentType.CoInfo             : return new Ui_Components_UiCoInfo.UiCoInfo();
        default                                 : throw new Error(`Unknown skin name: ${name}`);
    }
}

function getNestedSkin(skin: Ui_Types_UiSkin.UiSkin): Ui_Types_UiSkin.UiSkin | undefined {
    const nestedSkinName = skin.nestedSkinName;
    return nestedSkinName == null ? skin.nestedSkin : Helpers_Misc.getExisted(ResManager.getSkin(nestedSkinName));
}
export function getRevisedAttrValue<K extends keyof Ui_Types_UiSkinAttrs.UiSkinAttrs>(
    oldSkinAttrs    : Ui_Types_UiSkinAttrs.UiSkinAttrs | undefined,
    newSkinAttrs    : Ui_Types_UiSkinAttrs.UiSkinAttrs,
    key             : K,
): { needChange: boolean, value: Ui_Types_UiSkinAttrs.UiSkinAttrs[K] } {
    const newValue = newSkinAttrs[key];
    return (oldSkinAttrs != null) && (oldSkinAttrs[key] == newValue)
        ? { needChange : false,  value : undefined }
        : { needChange : true,   value : newValue };
}

export function loadSkinStateRecursively(ui: Ui_Interfaces_IUiComponent.IUiComponent, state: Ui_Types_UiSkinState.UiSkinState): void {
    const skinInfo = Helpers_Misc.getExisted(ui.getSkinInfo());
    for (const childNode of Helpers_Misc.getExisted(skinInfo.getNonNestedSkinChildren())) {
        for (const rawChild of childNode.dfs()) {
            const child = rawChild.deref();
            if (child) {
                loadSkinAttrs(child, state, Helpers_Misc.getExisted(child.getSkinInfo()).getLoadedSkinNestedState());
            }
        }
    }
    loadSkinAttrs(ui, Helpers_Misc.getExisted(skinInfo.getLoadedSkinState()), state);
}
function loadSkinAttrs(ui: Ui_Interfaces_IUiComponent.IUiComponent, state: string, nestedState: string | undefined): void {
    const skinInfo  = Helpers_Misc.getExisted(ui.getSkinInfo());
    const skinAttrs = generateSkinAttrs(Helpers_Misc.getExisted(skinInfo.getSkin()), state, nestedState);
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
    ui              : Ui_Interfaces_IUiComponent.IUiComponent,
    oldSkinAttrs    : Ui_Types_UiSkinAttrs.UiSkinAttrs | undefined,
    newSkinAttrs    : Ui_Types_UiSkinAttrs.UiSkinAttrs,
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

    (x.needChange)              && (ui.setX(Helpers_Misc.getExisted(x.value)));
    (y.needChange)              && (ui.setY(Helpers_Misc.getExisted(y.value)));
    (scaleX.needChange)         && (ui.setScaleX(Helpers_Misc.getExisted(scaleX.value)));
    (scaleY.needChange)         && (ui.setScaleY(Helpers_Misc.getExisted(scaleY.value)));
    (pivotX.needChange)         && (ui.setAnchorOffsetX(Helpers_Misc.getExisted(pivotX.value)));
    (pivotY.needChange)         && (ui.setAnchorOffsetY(Helpers_Misc.getExisted(pivotY.value)));
    (alpha.needChange)          && (ui.setAlpha(Helpers_Misc.getExisted(alpha.value)));
    (visible.needChange)        && (ui.setIsVisible(!!visible.value));
    (rotation.needChange)       && (ui.setRotationInDegree(Helpers_Misc.getExisted(rotation.value)));
    (touchEnabled.needChange)   && (ui.setIsTouchEnabled(!!touchEnabled.value));
    (touchChildren.needChange)  && (ui instanceof Ui_Components_UiContainerBase.UiContainerBase) && (ui.setIsTouchChildrenEnabled(!!touchChildren.value));

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
export function commonLoadSkinAttrsForSizer(ui: Ui_Interfaces_IUiComponent.IUiComponent & Ui_Interfaces_IUiComponent.IUiComponent, oldSkinAttrs: Ui_Types_UiSkinAttrs.UiSkinAttrs | undefined, newSkinAttrs: Ui_Types_UiSkinAttrs.UiSkinAttrs): void {
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
    Ui_Utils_UiSizerHelpers.loadSizerOptions(ui, newSkinAttrs);
}

function mergeSkinAttrs(src: Ui_Types_UiSkinAttrs.UiSkinAttrs | undefined, dst: Ui_Types_UiSkinAttrs.UiSkinAttrs): void {
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
function generateSkinAttrsForState(skinAttrDict: Record<string, Ui_Types_UiSkinAttrs.UiSkinAttrs> | undefined, state: string | undefined): Ui_Types_UiSkinAttrs.UiSkinAttrs | undefined {
    if (skinAttrDict == null) {
        return undefined;
    }

    const defaultAttrs  = skinAttrDict[Ui_Types_UiSkinState.UiSkinState.Default];
    const attrs         = skinAttrDict[state ?? Ui_Types_UiSkinState.UiSkinState.Default];
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
function generateSkinAttrs(skin: Ui_Types_UiSkin.UiSkin, state: string | undefined, nestedState: string | undefined): Ui_Types_UiSkinAttrs.UiSkinAttrs {
    const dstAttrs          = deepClone(UiSkinDefaultAttrs);
    const uiType            = Helpers_Misc.getExisted(skin.uiType);
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
