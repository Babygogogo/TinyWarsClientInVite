import {
    AuxiliaryTypes_CachedDataAccessor,
    GameConfigs_GameConfig,
    Helpers_Misc,
    Helpers_Text,
    Egret_Res,
    GameConfigs_Gateway,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import { FullConfig } from "../proto/schema/CommonProto/Config/FullConfig.ts";

const _latestVersionAccessor    = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<null, string>({
    reqData : () => GameConfigs_Gateway.reqCommonLatestConfigVersion(),
});
const _gameConfigAccessor       = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<string, GameConfigs_GameConfig.GameConfig>({
    reqData : async (version: string) => {
        const configBin : AuxiliaryTypes_AuxiliaryTypes.Undefinable<ArrayBuffer> = await Egret_Res.getResByUrl(
            `resource/config/FullConfig${version}.bin`,
            void 0,
            null,
            Egret_Res.ResourceItemHelper.TYPE_BIN
        );
        const rawConfig = configBin ? FullConfig.decode(new Uint8Array(configBin)) : null;

        if (rawConfig == null) {
            _gameConfigAccessor.setData(version, null);
        } else {
            _gameConfigAccessor.setData(version, new GameConfigs_GameConfig.GameConfig(version, rawConfig));
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
    return Helpers_Misc.getExisted(await _latestVersionAccessor.getData(null));
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

    return `${version[0]}${Helpers_Text.getNumText(num, 7)}`;
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

    return `${version[0]}${Helpers_Text.getNumText(num, 7)}`;
}

export async function getGameConfig(version: string): Promise<GameConfigs_GameConfig.GameConfig> {
    return Helpers_Misc.getExisted(await _gameConfigAccessor.getData(version));
}
export async function getLatestGameConfig(): Promise<GameConfigs_GameConfig.GameConfig> {
    return await getGameConfig(await getLatestConfigVersion());
}
