import {
    type Ui_Types_UiOrientation,
} from "../../internal.ts";

/**
 * @param options
 * @param {number} options.background - background color of the UiScrollList.
 * @param {number} options.width - width of the UiScrollList.
 * @param {number} options.height - height of the UiScrollList.
 * @param {number} options.radius - radius of the UiScrollList and its masks corners.
 * @param {number} options.elementsMargin - margin between elements.
 * @param {boolean} options.disableDynamicRendering - disables dynamic rendering of the UiScrollList,
 * so even elements the are not visible will be rendered. Be careful with this options as it can impact performance.
 * @param {boolean} [options.globalScroll=true] - if true, the UiScrollList will scroll even if the mouse is not over it.
 * @param {boolean} [options.shiftScroll=false] - if true, the UiScrollList will only scroll horizontally if the shift key
 * is pressed, and the type is set to 'horizontal'.
 */
export interface UiScrollerOptions {
    orientation?                : Ui_Types_UiOrientation.UiOrientation;
    cornerRadius?               : number;
    disableEasing?              : boolean;
    dragTrashHold?              : number;
    globalScroll?               : boolean;
    shiftScroll?                : boolean;
    proximityDebounce?          : number;
    // disableProximityCheck?      : boolean;
}
