import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";

export function fastExeUnknownAction(): void {
    throw HelpersMisc.newError(`Unknown action.`, UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_ExeUnknownAction_00);
}

export function normalExeUnknownAction(): void {
    throw HelpersMisc.newError(`Unknown action.`, UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_ExeUnknownAction_00);
}
