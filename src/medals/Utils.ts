import {
    Medals_Constants,
    type Medals_Types,
} from "../internal.ts";

export function getMedalCfg(medalId: number): Medals_Types.MedalCfg | null {
    return Medals_Constants.CfgDict.get(medalId) ?? null;
}

export function checkHasMedal(medalId: number): boolean {
    return Medals_Constants.CfgDict.has(medalId);
}
