import {
    Utils_ClientErrorCode,
    Helpers_Misc,
} from "../../../internal.ts";

export function fastExeUnknownAction(): void {
    throw Helpers_Misc.newError(`Unknown action.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_ExeUnknownAction_00);
}

export function normalExeUnknownAction(): void {
    throw Helpers_Misc.newError(`Unknown action.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_ExeUnknownAction_00);
}
