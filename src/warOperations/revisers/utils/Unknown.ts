import {
    Utils_ClientErrorCode,
    WarOperations_Revisers_Result,
} from "../../../internal.ts";

export function revise(): WarOperations_Revisers_Result.Result {
    return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnknownAction_00);
}
