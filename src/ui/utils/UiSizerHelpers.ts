import {
    Timer_TimerModel,
    Numbers_Constants,
    Stages_StageManager,
    Numbers_Utils,
    Ui_Components_UiContainer,
    Ui_Types_UiHorizontalAlign,
    Ui_Types_UiVerticalAlign,
    type Ui_Interfaces_IUiComponent,
    type Ui_Interfaces_IUiSizerInfo,
    type AuxiliaryTypes_AuxiliaryTypes,
    type Ui_Types_UiSizerDimensionOptions,
    type Ui_Types_UiSizerHorizontalAlignOptions,
    type Ui_Types_UiSizerOptions,
    type Ui_Types_UiSizerVerticalAlignOptions,
    type Ui_Types_UiSkinAttrs,
    type Egret_Egret,
} from "../../internal.ts";

export function init(): void {
    Timer_TimerModel.addTickCallback(applyAutoSizerInfoDict, -1);
}

export function loadSizerOptions(sizer: Ui_Interfaces_IUiComponent.IUiComponent, skinAttrs: Ui_Types_UiSkinAttrs.UiSkinAttrs): void {
    const options = createSizerOptions({
        left                : skinAttrs?.left,
        right               : skinAttrs?.right,
        top                 : skinAttrs?.top,
        bottom              : skinAttrs?.bottom,
        horizontalCenter    : skinAttrs?.horizontalCenter,
        verticalCenter      : skinAttrs?.verticalCenter,
        minWidth            : skinAttrs?.minWidth,
        maxWidth            : skinAttrs?.maxWidth,
        minHeight           : skinAttrs?.minHeight,
        maxHeight           : skinAttrs?.maxHeight,
    });
    if (options != null) {
        sizer.checkAndInitSizerInfo().setSizerOptions(options);
    }
}
function createSizerOptions({
    left,
    right,
    top,
    bottom,
    horizontalCenter,
    verticalCenter,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
}: {
    left                : number | undefined;
    right               : number | undefined;
    top                 : number | undefined;
    bottom              : number | undefined;
    horizontalCenter    : number | undefined;
    verticalCenter      : number | undefined;
    minWidth            : number | undefined;
    maxWidth            : number | undefined;
    minHeight           : number | undefined;
    maxHeight           : number | undefined;
}): Ui_Types_UiSizerOptions.UiSizerOptions | undefined {
    let sizerWidth: Ui_Types_UiSizerDimensionOptions.UiSizerDimensionOptions | undefined = undefined;
    if ((left != null) && (right != null)) {
        sizerWidth = {
            percentage  : 100,
            extension   : -(left + right),
            minValue    : minWidth,
            maxValue    : maxWidth,
        };
    }

    let sizerHeight: Ui_Types_UiSizerDimensionOptions.UiSizerDimensionOptions | undefined = undefined;
    if ((top != null) && (bottom != null)) {
        sizerHeight = {
            percentage  : 100,
            extension   : -(top + bottom),
            minValue    : minHeight,
            maxValue    : maxHeight,
        };
    }

    let horizontalAlign: Ui_Types_UiSizerHorizontalAlignOptions.UiSizerHorizontalAlignOptions | undefined = undefined;
    if (left != null) {
        horizontalAlign = {
            align   : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Left,
            offset  : left,
        };
    } else if (right != null) {
        horizontalAlign = {
            align   : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Right,
            offset  : right,
        };
    } else if (horizontalCenter != null) {
        horizontalAlign = {
            align   : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center,
            offset  : horizontalCenter,
        };
    }

    let verticalAlign: Ui_Types_UiSizerVerticalAlignOptions.UiSizerVerticalAlignOptions | undefined = undefined;
    if (top != null) {
        verticalAlign = {
            align   : Ui_Types_UiVerticalAlign.UiVerticalAlign.Top,
            offset  : top,
        };
    } else if (bottom != null) {
        verticalAlign = {
            align   : Ui_Types_UiVerticalAlign.UiVerticalAlign.Bottom,
            offset  : bottom,
        };
    } else if (verticalCenter != null) {
        verticalAlign = {
            align   : Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle,
            offset  : verticalCenter,
        };
    }

    if ((horizontalAlign ?? verticalAlign ?? sizerWidth ?? sizerHeight) == null) {
        return undefined;
    } else {
        return {
            horizontalAlign : horizontalAlign,
            verticalAlign   : verticalAlign,
            width           : sizerWidth,
            height          : sizerHeight,
        };
    }
}

const AutoSizerInfoDict = new Map<Ui_Interfaces_IUiSizerInfo.IUiSizerInfo, boolean>();
/**
 * bool值标记sizer是否被手动更改过尺寸。如果是，则无论自动sizer是否有真正改变尺寸，所有子项的自动sizer都会被应用一次。
 *
 * 要求传入这个值，是因为如果手动更改的尺寸刚好与自动sizer的尺寸相同，那么自动sizer会无功而返，
 * 相关代码就会以为不需要更新子项，而实际上是需要的（因为父级已经被手动改过了）。
 *
 * 比如，如果外部手动更改了某个sizer的尺寸，那么就要同时在这里注册该sizer并传入true，
 * 以便自动sizer知道无论自动处理结果如何，都要更新所有子项。
 *
 * 如果传入的是false，则仅当自动sizer确实更改过尺寸时，才会自动更新所有子项。
 */
export function addAutoSizerInfo(sizerInfo: Ui_Interfaces_IUiSizerInfo.IUiSizerInfo, isSizeChangedManually: boolean): void {
    if ((isSizeChangedManually) || (!AutoSizerInfoDict.has(sizerInfo))) {
        AutoSizerInfoDict.set(sizerInfo, isSizeChangedManually);
    }
}
export function checkAndAddAutoSizerInfo(sizer: Ui_Interfaces_IUiComponent.IUiComponent, isSizeChangedManually: boolean): void {
    const sizerInfo = sizer.getSizerInfo();
    if (sizerInfo != null) {
        addAutoSizerInfo(sizerInfo, isSizeChangedManually);
    }
}
export function deleteAutoSizerInfo(sizerInfo: Ui_Interfaces_IUiSizerInfo.IUiSizerInfo): void {
    AutoSizerInfoDict.delete(sizerInfo);
}
function applyAutoSizerInfoDict(): void {
    if (!AutoSizerInfoDict.size) {
        return;
    }

    const infoAndDepthArray: {
        info                    : Ui_Interfaces_IUiSizerInfo.IUiSizerInfo;
        isSizeChangedManually   : boolean;
        depth                   : number;
    }[] = [];
    for (const [info, sizeChanged] of AutoSizerInfoDict) {
        const depth = getNestedDepth(info);
        if (depth != null) {
            infoAndDepthArray.push({
                info                    : info,
                isSizeChangedManually   : sizeChanged,
                depth                   : depth,
            });
        }
    }

    const appliedInfoSet = new Set<Ui_Interfaces_IUiSizerInfo.IUiSizerInfo>();
    for (const data of infoAndDepthArray.sort((v1, v2) => v1.depth - v2.depth)) {
        applySizerInfo(appliedInfoSet, data.info, data.isSizeChangedManually);
    }

    AutoSizerInfoDict.clear();
}
function getNestedDepth(sizerInfo: Ui_Interfaces_IUiSizerInfo.IUiSizerInfo): number | null {
    const stage = Stages_StageManager.getStage();
    let depth   = 1;
    let parent  = sizerInfo.getSizer().getParent();
    for (;;) {
        if (parent === stage) {
            return depth;
        } else {
            if (parent == null) {
                // HACK: return null会导致此ui的sizer流程被跳过，原意是优化性能，但是会导致特定情况下ui显示不正常，所以不能直接return null，而是根据该ui是否跑过流程来决定
                // 特定情况是指：考虑某种ui，其自身最外层不包含sizer info，但是其内部元素包含sizer info，比如button
                // 那么该button在加载皮肤时，其子元素会被正常注册到自动sizer，也就是会在下一帧运行sizer流程；button最外层没有sizer info，也就不会注册
                // 但问题在于，如果在流程开始前，这个button就被移出舞台（常见于layout暂时移除item），那么在进行sizer流程时，由于子元素不在舞台上，所以流程会被跳过
                // 即使后续该button被重新加入舞台并修改宽高位置等参数，由于button最外层并没有sizer info，所以它仍然不会被注册为自动sizer
                // 而button内部子元素也不会因为button外层参数的修改而被注册自动sizer，所以永久失去了跑sizer流程的机会，因此显示效果会有问题
                return sizerInfo.getHasEverApplied() ? null : depth;
            } else {
                ++depth;
                parent = parent.parent;
            }
        }
    }
}

function applySizerInfo(appliedInfoSet: Set<Ui_Interfaces_IUiSizerInfo.IUiSizerInfo>, sizerInfo: Ui_Interfaces_IUiSizerInfo.IUiSizerInfo, isSizeChangedManually: boolean): void {
    {
        if (appliedInfoSet.has(sizerInfo)) {
            return;
        }
        appliedInfoSet.add(sizerInfo);
    }

    let isSizeUpdated   = false;
    const sizer         = sizerInfo.getSizer();
    {
        const options = sizerInfo.getSizerOptions();
        if ((sizerInfo.getIsEnabled()) && (options != null)) {
            const { width, height } = getParentSize(sizer.getParent());
            isSizeUpdated = updateSize({
                sizer           : sizer,
                parentWidth     : width,
                widthOptions    : options?.width,
                parentHeight    : height,
                heightOptions   : options?.height,
            });
            updatePosition({
                sizer           : sizer,
                parentWidth     : width,
                widthOptions    : options?.horizontalAlign,
                parentHeight    : height,
                heightOptions   : options.verticalAlign,
            });
            sizerInfo.setHasEverApplied(true);
        }
    }

    if (((isSizeUpdated) || (isSizeChangedManually))        &&
        (sizer instanceof Ui_Components_UiContainer.UiContainer)
    ) {
        for (const child of sizer.getUiChildren()) {
            const childSizerInfo = child.getSizerInfo();
            if (childSizerInfo) {
                applySizerInfo(appliedInfoSet, childSizerInfo, !!AutoSizerInfoDict.get(childSizerInfo));
            }
        }
    }
}
function getParentSize(parent: Egret_Egret.DisplayObjectContainer | null | undefined): Partial<AuxiliaryTypes_AuxiliaryTypes.Size> {
    if (parent instanceof Ui_Components_UiContainer.UiContainer) {
        return {
            width   : parent.getUnscaledManualWidth(),
            height  : parent.getUnscaledManualHeight(),
        };
    } else {
        return {};
    }
    // temp
    // return { width: parent?.width, height: parent?.height };
}
function updateSize({ sizer, parentWidth, widthOptions, parentHeight, heightOptions }: {
    sizer           : Ui_Interfaces_IUiComponent.IUiComponent;
    parentWidth     : number | undefined;
    widthOptions    : Ui_Types_UiSizerDimensionOptions.UiSizerDimensionOptions | undefined;
    parentHeight    : number | undefined;
    heightOptions   : Ui_Types_UiSizerDimensionOptions.UiSizerDimensionOptions | undefined;
}): boolean {
    const aabbWidth = ((widthOptions == null) || (parentWidth == null))
        ? undefined
        : Numbers_Utils.getValueInRange({
            rawValue    : parentWidth * (widthOptions.percentage ?? 0) / 100 + (widthOptions.extension ?? 0),
            minValue    : widthOptions.minValue ?? 0,
            maxValue    : widthOptions.maxValue ?? Numbers_Constants.MaxValue,
        });
    const aabbHeight = ((heightOptions == null) || (parentHeight == null))
        ? undefined
        : Numbers_Utils.getValueInRange({
            rawValue    : parentHeight * (heightOptions.percentage ?? 0) / 100 + (heightOptions.extension ?? 0),
            minValue    : heightOptions.minValue ?? 0,
            maxValue    : heightOptions.maxValue ?? Numbers_Constants.MaxValue,
        });

    const rotationInRadian  = sizer.getRotationInDegree() * Numbers_Constants.DegToRad;
    const cosValue          = Math.cos(rotationInRadian);
    const sinValue          = Math.sin(rotationInRadian);
    let maxWidth1 = aabbWidth == null  ? undefined : Math.abs(aabbWidth / cosValue);
    (maxWidth1 != null) && (isNaN(maxWidth1)) && (maxWidth1 = Infinity);
    let maxWidth2 = aabbHeight == null ? undefined : Math.abs(aabbHeight / sinValue);
    (maxWidth2 != null) && (isNaN(maxWidth2)) && (maxWidth2 = Infinity);
    const maxWidth = ((maxWidth1 == null) && (maxWidth2 == null)) ? undefined : Math.min(maxWidth1 ?? Infinity, maxWidth2 ?? Infinity);

    let maxHeight1 = aabbWidth == null  ? undefined : Math.abs(aabbWidth / (-sinValue));
    (maxHeight1 != null) && (isNaN(maxHeight1)) && (maxHeight1 = Infinity);
    let maxHeight2 = aabbHeight == null ? undefined : Math.abs(aabbHeight / cosValue);
    (maxHeight2 != null) && (isNaN(maxHeight2)) && (maxHeight2 = Infinity);
    const maxHeight = ((maxHeight1 == null) && (maxHeight2 == null)) ? undefined : Math.min(maxHeight1 ?? Infinity, maxHeight2 ?? Infinity);

    if (maxWidth == null) {
        if (maxHeight == null) {
            return sizer.applySizeFromSizerInfo(undefined, undefined);
        } else {
            return sizer.applySizeFromSizerInfo(getWidth(aabbWidth, aabbHeight, maxHeight, sinValue, cosValue), maxHeight);
        }
    } else {
        if (maxHeight == null) {
            return sizer.applySizeFromSizerInfo(maxWidth, undefined);
        } else {
            const height = getHeight(aabbWidth, aabbHeight, maxWidth, sinValue, cosValue);
            if ((height == null) || (height >= 0.5)) {
                return sizer.applySizeFromSizerInfo(maxWidth, height);
            } else {
                const width = getWidth(aabbWidth, aabbHeight, maxHeight, sinValue, cosValue);
                if ((width == null) || (width >= 0.5)) {
                    return sizer.applySizeFromSizerInfo(width, maxHeight);
                } else {
                    return sizer.applySizeFromSizerInfo(maxWidth / 2, maxHeight / 2);
                }
            }
        }
    }
}
function updatePosition({ sizer, parentWidth, widthOptions, parentHeight, heightOptions }: {
    sizer           : Ui_Interfaces_IUiComponent.IUiComponent;
    parentWidth     : number | undefined;
    widthOptions    : Ui_Types_UiSizerHorizontalAlignOptions.UiSizerHorizontalAlignOptions | undefined;
    parentHeight    : number | undefined;
    heightOptions   : Ui_Types_UiSizerVerticalAlignOptions.UiSizerVerticalAlignOptions | undefined;
}): void {
    let aabb: AuxiliaryTypes_AuxiliaryTypes.Rectangle;

    let x: number | undefined;
    if (widthOptions != null) {
        aabb            ??= sizer.getAabbToParent();
        const align     = widthOptions.align ?? Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Left;
        const offset    = widthOptions.offset ?? 0;
        if (align === Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Left) {
            x = offset - aabb.x;
        } else {
            if (parentWidth != null) {
                if (align === Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center) {
                    x = offset - aabb.x + (parentWidth - aabb.width) / 2;
                } else {
                    x = - offset - aabb.x + (parentWidth - aabb.width);
                }
            }
        }
    }

    let y: number | undefined;
    if (heightOptions != null) {
        aabb            ??= sizer.getAabbToParent();
        const align     = heightOptions.align ?? Ui_Types_UiVerticalAlign.UiVerticalAlign.Top;
        const offset    = heightOptions.offset ?? 0;
        if (align === Ui_Types_UiVerticalAlign.UiVerticalAlign.Top) {
            y = offset - aabb.y;
        } else {
            if (parentHeight != null) {
                if (align === Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle) {
                    y = offset - aabb.y + (parentHeight - aabb.height) / 2;
                } else {
                    y = - offset - aabb.y + (parentHeight - aabb.height);
                }
            }
        }
    }

    sizer.applyPositionFromSizerInfo(x, y);
}
function getWidth(aabbWidth: number | undefined, aabbHeight: number | undefined, height: number, sinValue: number, cosValue: number): number | undefined {
    if (aabbHeight != null) {
        const width = Math.abs((aabbHeight - Math.abs(cosValue == 0 ? 0 : (height * cosValue))) / sinValue);
        return isNaN(width) ? Infinity : width;
    }
    if (aabbWidth != null) {
        const width = Math.abs((aabbWidth - Math.abs(sinValue == 0 ? 0 : (height * sinValue))) / cosValue);
        return isNaN(width) ? Infinity : width;
    }
    return undefined;
}
function getHeight(aabbWidth: number | undefined, aabbHeight: number | undefined, width: number, sinValue: number, cosValue: number): number | undefined {
    if (aabbHeight != null) {
        const height = Math.abs((aabbHeight - Math.abs(sinValue == 0 ? 0 : (width * sinValue))) / cosValue);
        return isNaN(height) ? Infinity : height;
    }
    if (aabbWidth != null) {
        const height = Math.abs((aabbWidth - Math.abs(cosValue == 0 ? 0 : (width * cosValue))) / sinValue);
        return isNaN(height) ? Infinity : height;
    }
    return undefined;
}
