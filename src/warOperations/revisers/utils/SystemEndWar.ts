import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { newError } from "../../../helpers/Misc.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemEndWar } from "../../../proto/schema/CommonProto/WarOperation/WoSystemEndWar.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function revise(war: IBwWar, rawAction: WoSystemEndWar, requesterUserId: Undefinable<number>): WoContainer {
    if (requesterUserId != null) {
        throw newError(`Invalid requesterUserId.`, ClientErrorCode.WarOperationReviser_ReviseSystemEndWar_00);
    }

    if (!war.checkCanEnd()) {
        throw newError(`Can not end.`, ClientErrorCode.WarOperationReviser_ReviseSystemEndWar_01);
    }

    return WoContainer.fromJson({
        WoSystemEndWar: {
        },
    });
}
