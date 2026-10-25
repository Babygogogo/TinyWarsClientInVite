import { newError } from "../../../helpers/Misc.ts";
import type { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";

export function revise(): WoContainer {
    throw newError(`Invalid action.`, ClientErrorCode.WarOperationReviser_ReviseUnknownAction_00);
}
