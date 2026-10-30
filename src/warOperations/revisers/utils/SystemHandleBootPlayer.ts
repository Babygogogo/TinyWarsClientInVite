import {
    Utils_ClientErrorCode,
    Helpers_Misc,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemHandleBootPlayer } from "../../../proto/schema/CommonProto/WarOperation/WoSystemHandleBootPlayer.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function revise(war: BaseWar_Interface_IBwWar.IBwWar, rawAction: WoSystemHandleBootPlayer, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (requesterUserId != null) {
        throw Helpers_Misc.newError(`Invalid requesterUserId.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemHandleBootPlayer_00);
    }

    if (!war.checkIsBoot()) {
        throw Helpers_Misc.newError(`Is not boot.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemHandleBootPlayer_01);
    }

    return WoContainer.fromJson({
        WoSystemHandleBootPlayer: {
        },
    });
}
