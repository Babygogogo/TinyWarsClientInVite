

interface UiLayoutAttr {
    orientation?        : number;
    multiItemsPerBlock? : number;

    paddingTop?         : number;
    paddingBottom?      : number;
    paddingLeft?        : number;
    paddingRight?       : number;
    horizontalGap?      : number;
    verticalGap?        : number;
    horizontalAlign?    : number;
    verticalAlign?      : number;
}

export interface UiSkinAttrs {
    x?                      : number;
    y?                      : number;
    scaleX?                 : number;
    scaleY?                 : number;
    anchorOffsetX?          : number;
    anchorOffsetY?          : number;
    alpha?                  : number;
    visible?                : number;
    rotation?               : number;
    width?                  : number;
    height?                 : number;
    left?                   : number;
    right?                  : number;
    top?                    : number;
    bottom?                 : number;
    horizontalCenter?       : number,
    verticalCenter?         : number,
    minWidth?               : number,
    maxWidth?               : number,
    minHeight?              : number,
    maxHeight?              : number,

    source?                 : string;
    icon?                   : string;
    label?                  : string;
    scale9Grid?             : number[];
    smoothing?              : number;

    touchEnabled?           : number;
    touchChildren?          : number;

    layoutAttrs?            : UiLayoutAttr;

    text?                   : string;
    textColor?              : string;
    size?                   : number;
    bold?                   : number;
    italic?                 : number;
    lineSpacing?            : number;
    horizontalAlign?        : number;
    verticalAlign?          : number;
    stroke?                 : number;
    strokeColor?            : string;
    maxChars?               : number;
    restrict?               : string;
    displayAsPassword?      : number;
    multiline?              : number;
    autoShrinkWidth?        : number;

    requireSelection?       : number;
    allowMultiSelection?    : number;

    // [key: string]       : any;
}
