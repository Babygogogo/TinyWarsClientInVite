import { newError } from "../../../helpers/Misc.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";

export function fastExeUnknownAction(): void {
    throw newError(`Unknown action.`, ClientErrorCode.WarOperationExecutor_ExeUnknownAction_00);
}

export function normalExeUnknownAction(): void {
    throw newError(`Unknown action.`, ClientErrorCode.WarOperationExecutor_ExeUnknownAction_00);
}
