
import * as Res from "./vendor/egret/Res";

// type UiSkin = Ui.Types.UiSkin;

export type UiComponentType =
    | "Image"
    | "Image9"
    | "Label"
    | "Group"
    | "Button"
    | "Layout"
    | "Scroller"
    | "ScrollList"
    | "TextInput"
    | "PromptedInput"
    | "List"
    | "Tab"
    | "ProgressBar"
    | "RadioButton"
    | "Switch"
    | "ZoomableComponent"
    | "ZoomableMap"
    | "MapInfo"
    | "CoInfo"
    | "General";
export interface UiSkin {
    id?             : string;
    uiType?         : UiComponentType;
    selfSkinName?   : string;
    currentState?   : string;
    nestedSkin?     : UiSkin;
    nestedSkinName? : string;
    itemSkin?       : UiSkin;
    itemSkinName?   : string;
    $?              : Record<string, UiSkinAttrs>;
    $$?             : UiSkin[];
}
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


const ALL_SKINS_FILENAME = "resource/AllSkins.json";

let _isLoadedMainResource   = false;
const _skinDict             = new Map<string, UiSkin>();
const _modules              = import.meta.glob(
    "./assets/**/*.*",
    {
        query: "?url",
        eager: true,
    }
);

export async function init(): Promise<void> {
    Res.registerVersionController(new VersionController());

    await Res.loadConfig("default.res.json", "resource/");
    await Promise.all([
        _initAllSkins(),
    ]);
    // ResAutoRelease.startAutoRelease();
}

export function loadMainRes(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        Res.loadGroup("main")?.then(
            () => {
                _isLoadedMainResource = true;
                resolve();
            },
            (reason) => {
                // Logger.error("ResManager.loadMainRes() error! ", reason);
                // FloatText.show("Error loading main resource! " + reason);
                console.log(reason);
                reject();
            }
        );
    });
}
export function checkIsLoadedMainResource(): boolean {
    return _isLoadedMainResource;
}

async function _initAllSkins(): Promise<void> {
    const skinDict      = _getSkinDict();
    const rawSkinDict   = await Res.getResByUrl(ALL_SKINS_FILENAME) as Record<string, UiSkin>;
    for (const key in rawSkinDict) {
        const skin = rawSkinDict[key];
        skinDict.set(key, skin);

        const selfSkinName = skin.selfSkinName;
        if (selfSkinName) {
            skinDict.set(selfSkinName, skin);
        }
    }
}
function _getSkinDict(): Map<string, UiSkin> {
    return _skinDict;
}
export function getSkin(alias: string): UiSkin | undefined {
    return _getSkinDict().get(alias);
}

class VersionController implements Res.IVersionController {
    public async init(): Promise<void> {
        // nothing to do
    }

    public getVirtualUrl(url: string): string {
        return (_modules[`./assets/${url}`] as any).default || '';
    }
}
