import {
    FogMaps_Constants,
} from "../internal.ts";

export function checkIsValidForcedFogCode(forcedFogCode: number): boolean {
    return FogMaps_Constants.AllForcedFogCodeArray.includes(forcedFogCode);
}
