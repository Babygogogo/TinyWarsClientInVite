import {
    WarOperations_Constants,
} from "../internal.ts";

export function checkIsValidWarOperationsLimit(warOperationsLimit: number): boolean {
    return (warOperationsLimit >= WarOperations_Constants.Common.MinLimit)
        && (warOperationsLimit <= WarOperations_Constants.Common.MaxLimit);
}
