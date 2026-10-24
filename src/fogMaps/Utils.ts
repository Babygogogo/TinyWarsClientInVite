import * as FogMapsConstants from "./Constants.ts";

export function checkIsValidForcedFogCode(forcedFogCode: number): boolean {
    return FogMapsConstants.AllForcedFogCodeArray.includes(forcedFogCode);
}
