import {
    Utils_ClientErrorCode,
    Helpers_Misc,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemEndWar } from "../../../proto/schema/CommonProto/WarOperation/WoSystemEndWar.ts";

 
export function revise(war: BaseWar_Model_War.War, rawAction: WoSystemEndWar, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (requesterUserId != null) {
        throw Helpers_Misc.newError(`Invalid requesterUserId.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemEndWar_00);
    }

    if (!war.checkCanEnd()) {
        throw Helpers_Misc.newError(`Can not end.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemEndWar_01);
    }

    return WoContainer.fromJson({
        WoSystemEndWar : {
        },
    });
}
