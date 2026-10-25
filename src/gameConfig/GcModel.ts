import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { CachedDataAccessor } from "../auxiliaryTypes/CachedDataAccessor.ts";
import { GcData } from "./GcData.ts";
import { reqCommonLatestConfigVersion } from "./GcProxy.ts";
import { getExisted } from "../helpers/Misc.ts";
import { getNumText } from "../helpers/Text.ts";
import { FullConfig } from "../proto/schema/CommonProto/Config/FullConfig.ts";
import { getResByUrl, ResourceItemHelper } from "../vendor/egret/Res.ts";

const _latestVersionAccessor    = new CachedDataAccessor<null, string>({
    reqData : () => reqCommonLatestConfigVersion(),
});
const _gameConfigAccessor       = new CachedDataAccessor<string, GcData>({
    reqData : async (version: string) => {
        const configBin : Undefinable<ArrayBuffer> = await getResByUrl(
            `resource/config/FullConfig${version}.bin`,
            void 0,
            null,
            ResourceItemHelper.TYPE_BIN
        );
        const rawConfig = configBin ? FullConfig.decode(new Uint8Array(configBin)) : null;

        if (rawConfig == null) {
            _gameConfigAccessor.setData(version, null);
        } else {
            _gameConfigAccessor.setData(version, new GcData(version, rawConfig));
        }
    },
});

////////////////////////////////////////////////////////////////////////////////
// Exports.
////////////////////////////////////////////////////////////////////////////////
export function init(): void {
    // nothing to do.
}

export async function getLatestConfigVersion(): Promise<string> {
    return getExisted(await _latestVersionAccessor.getData(null));
}
export function setLatestConfigVersion(version: string): void {
    _latestVersionAccessor.setData(null, version);
}
async function getLatestConfigNum(): Promise<number> {
    return parseInt((await getLatestConfigVersion()).substring(1));
}
export async function getPreviousConfigVersion(version: string): Promise<string | null> {
    if (version.length != 8) {
        return null;
    }

    const rawNum = parseInt(version.substring(1));
    if (isNaN(rawNum)) {
        return null;
    }

    const num = rawNum - 1;
    if ((num < 0) || (num > await getLatestConfigNum())) {
        return null;
    }

    return `${version[0]}${getNumText(num, 7)}`;
}
export async function getNextConfigVersion(version: string): Promise<string | null> {
    if (version.length != 8) {
        return null;
    }

    const rawNum = parseInt(version.substring(1));
    if (isNaN(rawNum)) {
        return null;
    }

    const num = rawNum + 1;
    if ((num < 0) || (num > await getLatestConfigNum())) {
        return null;
    }

    return `${version[0]}${getNumText(num, 7)}`;
}

export async function getGameConfig(version: string): Promise<GcData> {
    return getExisted(await _gameConfigAccessor.getData(version));
}
export async function getLatestGameConfig(): Promise<GcData> {
    return await getGameConfig(await getLatestConfigVersion());
}
