import {
    Utils_ClientErrorCode,
    Helpers_Misc,
} from "../../../internal.ts";
import type { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export function revise(): WoContainer {
    throw Helpers_Misc.newError(`Invalid action.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnknownAction_00);
}
