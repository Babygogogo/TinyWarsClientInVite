import {
    Egret_Res,
    Logger,
    FloatText,
    type Ui_Types_UiSkin,
    type Ui_Types_UiComponentType,
    type Ui_Types_UiSkinAttrs,
} from "./internal.ts";

export type UiComponentType = Ui_Types_UiComponentType.UiComponentType;
export type UiSkin = Ui_Types_UiSkin.UiSkin;
export type UiSkinAttrs = Ui_Types_UiSkinAttrs.UiSkinAttrs;

const ALL_SKINS_FILENAME = "resource/AllSkins.json";

let _isLoadedMainResource   = false;
const _skinDict             = new Map<string, Ui_Types_UiSkin.UiSkin>();
const _modules              = import.meta.glob(
    "./assets/**/*.*",
    {
        query : "?url",
        eager : true,
    },
);

export async function init(): Promise<void> {
    Egret_Res.registerVersionController(new VersionController());

    await Egret_Res.loadConfig("default.res.json", "resource/");
    await Promise.all([
        _initAllSkins(),
    ]);
    // ResAutoRelease.startAutoRelease();
}

export function loadMainRes(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        Egret_Res.loadGroup("main")?.then(
            () => {
                _isLoadedMainResource = true;
                resolve();
            },
            (reason) => {
                Logger.error("ResManager.loadMainRes() error! ", reason);
                FloatText.show("Error loading main resource! " + reason);
                reject();
            },
        );
    });
}
export function checkIsLoadedMainResource(): boolean {
    return _isLoadedMainResource;
}

async function _initAllSkins(): Promise<void> {
    const skinDict      = _getSkinDict();
    const rawSkinDict   = await Egret_Res.getResByUrl(ALL_SKINS_FILENAME) as Record<string, Ui_Types_UiSkin.UiSkin>;
    for (const key in rawSkinDict) {
        const skin = rawSkinDict[key];
        skinDict.set(key, skin);

        const selfSkinName = skin.selfSkinName;
        if (selfSkinName) {
            skinDict.set(selfSkinName, skin);
        }
    }
}
function _getSkinDict(): Map<string, Ui_Types_UiSkin.UiSkin> {
    return _skinDict;
}
export function getSkin(alias: string): Ui_Types_UiSkin.UiSkin | undefined {
    return _getSkinDict().get(alias);
}

class VersionController implements Egret_Res.IVersionController {
    public async init(): Promise<void> {
        // nothing to do
    }

    public getVirtualUrl(url: string): string {
        return (_modules[`./assets/${url}`] as any).default || '';
    }
}
