

 
export const enum UiInputEventType {
    KeyDown     = "KeyDown",
    KeyUp       = "KeyUp",
    KeyInput    = "KeyInput",
    FocusIn     = "FocusIn",
    FocusOut    = "FocusOut",
}

export type Mapping = {
    [T in UiInputEventType]: T extends UiInputEventType.KeyDown | UiInputEventType.KeyUp
        ? KeyboardEvent
        : T extends UiInputEventType.KeyInput ? string : undefined;
};
