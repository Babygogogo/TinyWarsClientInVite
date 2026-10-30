
import {
    registerVersionController,
    loadConfig,
    loadGroup,
    getResByUrl,
    type IVersionController,
} from "./egret/Res.ts";

import type { UiSkin } from "./ui/types/UiSkin.ts";
import { error } from "./Logger.ts";
import { show } from "./FloatText.ts";

export type { UiComponentType } from "./ui/types/UiComponentType.ts";
export type { UiSkin } from "./ui/types/UiSkin.ts";
export type { UiSkinAttrs } from "./ui/types/UiSkinAttrs.ts";

const ALL_SKINS_FILENAME = "resource/AllSkins.json";

let _isLoadedMainResource   = false;
const _skinDict             = new Map<string, UiSkin>();
const _modules              = import.meta.glob(
    "./assets/**/*.*",
    {
        query : "?url",
        eager : true,
    }
);

export async function init(): Promise<void> {
    registerVersionController(new VersionController());

    await loadConfig("default.res.json", "resource/");
    await Promise.all([
        _initAllSkins(),
    ]);
    // ResAutoRelease.startAutoRelease();
}

export function loadMainRes(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        loadGroup("main")?.then(
            () => {
                _isLoadedMainResource = true;
                resolve();
            },
            (reason) => {
                error("ResManager.loadMainRes() error! ", reason);
                show("Error loading main resource! " + reason);
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
    const rawSkinDict   = await getResByUrl(ALL_SKINS_FILENAME) as Record<string, UiSkin>;
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

class VersionController implements IVersionController {
    public async init(): Promise<void> {
        // nothing to do
    }

    public getVirtualUrl(url: string): string {
        return (_modules[`./assets/${url}`] as any).default || '';
    }
}
