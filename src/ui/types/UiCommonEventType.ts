

 
export const enum UiCommonEventType {
    AddedToParent              = "added",               // egret.Event.ADDED
    AddedToStage               = "addedToStage",        // egret.Event.ADDED_TO_STAGE
    RemovedFromParent          = "removed",             // egret.Event.REMOVED
    RemovedFromStage           = "removedFromStage",    // egret.Event.REMOVED_FROM_STAGE
    EnterFrame                 = "enterFrame",          // egret.Event.ENTER_FRAME

    // export const PointerTap                 = egret.TouchEvent.TOUCH_TAP;
    // export const PointerDown                = egret.TouchEvent.TOUCH_BEGIN;
    // export const PointerUp                  = egret.TouchEvent.TOUCH_END;
    // export const PointerUpOutside           = egret.TouchEvent.TOUCH_RELEASE_OUTSIDE;
    // export const PointerOver                = "pointerover";
    // export const PointerOut                 = "pointerout";
    // export const PointerMove                = "pointermove";
    // export const PointerGlobalMove          = "globalpointermove";

    // export const MouseTap                   = "click";
    // export const MouseDown                  = "mousedown";
    // export const MouseUp                    = "mouseup";
    // export const MouseUpOutside             = "mouseupoutside";
    // export const MouseOver                  = "mouseover";
    // export const MouseOut                   = "mouseout";
    // export const MouseMove                  = "mousemove";
    // export const MouseGlobalMove            = "globalmousemove";

    ListItemSelectedByTap      = `ListItemSelectedByTap`,
    ListItemDeselectedByTap    = `ListItemDeselectedByTap`,

    SkinLoaded                 = `SkinLoaded`,
}
