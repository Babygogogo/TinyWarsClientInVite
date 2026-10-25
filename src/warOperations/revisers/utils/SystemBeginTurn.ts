import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { newError } from "../../../helpers/Misc.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemBeginTurn } from "../../../proto/schema/CommonProto/WarOperation/WoSystemBeginTurn.ts";
import { PhaseCode } from "../../../turns/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function revise(war: IBwWar, rawAction: WoSystemBeginTurn, requesterUserId: Undefinable<number>): WoContainer {
    if (requesterUserId != null) {
        throw newError(`Invalid requesterUserId.`, ClientErrorCode.WarOperationReviser_ReviseSystemBeginTurn_00);
    }

    if (war.getTurnPhaseCode() !== PhaseCode.WaitBeginTurn) {
        throw newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarOperationReviser_ReviseSystemBeginTurn_01);
    }

    return WoContainer.fromJson({
        WoSystemBeginTurn: {
        },
    });
}
