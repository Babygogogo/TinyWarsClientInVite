import * as MedalsConstants from "./Constants.ts";
import type * as MedalsTypes from "./Types.ts";

export function getMedalCfg(medalId: number): MedalsTypes.MedalCfg | null {
    return MedalsConstants.CfgDict.get(medalId) ?? null;
}

export function checkHasMedal(medalId: number): boolean {
    return MedalsConstants.CfgDict.has(medalId);
}
