import { AllForcedFogCodeArray } from "./Constants.ts";

export function checkIsValidForcedFogCode(forcedFogCode: number): boolean {
    return AllForcedFogCodeArray.includes(forcedFogCode);
}
