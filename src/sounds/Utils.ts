import * as SoundsConstants from "./Constants.ts";
import type * as SoundsTypes from "./Types.ts";

type BgmSfxCfg = SoundsTypes.BgmSfxCfg;

let _allBgmCodeArray    : number[] | undefined;
let _allSfxCodeArray    : number[] | undefined;

export function getBgmSfxCfg(code: number): BgmSfxCfg | null {
    return SoundsConstants.BgmSfxCfgDict.get(code) ?? null;
}

export function checkIsBgm(code: number): boolean {
    return !!getBgmSfxCfg(code)?.isBgm;
}
export function checkIsSfx(code: number): boolean {
    const cfg = getBgmSfxCfg(code);
    return (cfg != null) && (!cfg.isBgm);
}

export function getAllBgmCodeArray(): number[] {
    return _allBgmCodeArray ??= generateAllBgmCodeArray();
}
function generateAllBgmCodeArray(): number[] {
    const cfgArray: BgmSfxCfg[] = [];
    for (const [, cfg] of SoundsConstants.BgmSfxCfgDict) {
        if (cfg.isBgm) {
            cfgArray.push(cfg);
        }
    }

    return cfgArray.sort((v1, v2) => v1.sortWeight - v2.sortWeight).map(v => v.code);
}

export function getAllSfxCodeArray(): number[] {
    return _allSfxCodeArray ??= generateAllSfxCodeArray();
}
function generateAllSfxCodeArray(): number[] {
    const cfgArray: BgmSfxCfg[] = [];
    for (const [, cfg] of SoundsConstants.BgmSfxCfgDict) {
        if (!cfg.isBgm) {
            cfgArray.push(cfg);
        }
    }

    return cfgArray.map(v => v.code);
}
