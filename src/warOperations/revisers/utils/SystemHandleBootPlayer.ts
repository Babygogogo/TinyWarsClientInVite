import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { newError } from "../../../helpers/Misc.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemHandleBootPlayer } from "../../../proto/schema/CommonProto/WarOperation/WoSystemHandleBootPlayer.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function revise(war: IBwWar, rawAction: WoSystemHandleBootPlayer, requesterUserId: Undefinable<number>): WoContainer {
    if (requesterUserId != null) {
        throw newError(`Invalid requesterUserId.`, ClientErrorCode.WarOperationReviser_ReviseSystemHandleBootPlayer_00);
    }

    if (!war.checkIsBoot()) {
        throw newError(`Is not boot.`, ClientErrorCode.WarOperationReviser_ReviseSystemHandleBootPlayer_01);
    }

    return WoContainer.fromJson({
        WoSystemHandleBootPlayer: {
        },
    });
}
