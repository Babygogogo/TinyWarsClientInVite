import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn from "../../../proto/schema/CommonProto/WarOperation/WoPlayerEndTurn.ts";
import * as TurnsConstants from "../../../turns/Constants.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function revise(war: IBwWar, rawAction: ProtoSchemaCommonProtoWarOperationWoPlayerEndTurn.WoPlayerEndTurn, requesterUserId: Undefinable<number>): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer {
    if (war.getTurnPhaseCode() !== TurnsConstants.PhaseCode.Main) {
        throw HelpersMisc.newError(`Invalid turnPhaseCode.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerEndTurn_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null)                                      ||
        (playerInTurn.getAliveState() !== PlayersConstants.AliveStateId.Alive) ||
        (playerInTurn.getUserId() != requesterUserId)
    ) {
        throw HelpersMisc.newError(`Invalid aliveState.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerEndTurn_01);
    }

    if (war.getDrawVoteManager().checkNeedVoteBeforeEndTurn(playerInTurn.getPlayerIndex())) {
        throw HelpersMisc.newError(`The player hasn't voted for draw.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerEndTurn_02);
    }

    return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
        WoPlayerEndTurn  : {},
    });
}
