import { CfgDict } from "./Constants.ts";
import type { MedalCfg } from "./Types.ts";

export function getMedalCfg(medalId: number): MedalCfg | null {
    return CfgDict.get(medalId) ?? null;
}

export function checkHasMedal(medalId: number): boolean {
    return CfgDict.has(medalId);
}
