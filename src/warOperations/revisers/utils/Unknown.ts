import * as HelpersMisc from "../../../helpers/Misc.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";

export function revise(): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer {
    throw HelpersMisc.newError(`Invalid action.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnknownAction_00);
}
