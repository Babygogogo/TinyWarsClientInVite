import {
    Utils_ClientErrorCode,
    Helpers_Misc,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemHandleBootPlayer } from "../../../proto/schema/CommonProto/WarOperation/WoSystemHandleBootPlayer.ts";

 
export function revise(war: BaseWar_Model_War.War, rawAction: WoSystemHandleBootPlayer, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (requesterUserId != null) {
        throw Helpers_Misc.newError(`Invalid requesterUserId.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemHandleBootPlayer_00);
    }

    if (!war.checkIsBoot()) {
        throw Helpers_Misc.newError(`Is not boot.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemHandleBootPlayer_01);
    }

    return WoContainer.fromJson({
        WoSystemHandleBootPlayer : {
        },
    });
}
