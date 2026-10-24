import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesCachedDataAccessor from "../auxiliaryTypes/CachedDataAccessor.ts";
import * as GameConfigGcData from "./GcData.ts";
import * as GameConfigGcProxy from "./GcProxy.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as HelpersText from "../helpers/Text.ts";
import * as ProtoSchemaCommonProtoConfigFullConfig from "../proto/schema/CommonProto/Config/FullConfig.ts";
import * as VendorEgretRes from "../vendor/egret/Res.ts";

const _latestVersionAccessor    = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<null, string>({
    reqData : () => GameConfigGcProxy.reqCommonLatestConfigVersion(),
});
const _gameConfigAccessor       = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<string, GameConfigGcData.GcData>({
    reqData : async (version: string) => {
        const configBin : AuxiliaryTypesAuxiliaryTypes.Undefinable<ArrayBuffer> = await VendorEgretRes.getResByUrl(
            `resource/config/FullConfig${version}.bin`,
            void 0,
            null,
            VendorEgretRes.ResourceItemHelper.TYPE_BIN
        );
        const rawConfig = configBin ? ProtoSchemaCommonProtoConfigFullConfig.FullConfig.decode(new Uint8Array(configBin)) : null;

        if (rawConfig == null) {
            _gameConfigAccessor.setData(version, null);
        } else {
            _gameConfigAccessor.setData(version, new GameConfigGcData.GcData(version, rawConfig));
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
    return HelpersMisc.getExisted(await _latestVersionAccessor.getData(null));
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

    return `${version[0]}${HelpersText.getNumText(num, 7)}`;
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

    return `${version[0]}${HelpersText.getNumText(num, 7)}`;
}

export async function getGameConfig(version: string): Promise<GameConfigGcData.GcData> {
    return HelpersMisc.getExisted(await _gameConfigAccessor.getData(version));
}
export async function getLatestGameConfig(): Promise<GameConfigGcData.GcData> {
    return await getGameConfig(await getLatestConfigVersion());
}
