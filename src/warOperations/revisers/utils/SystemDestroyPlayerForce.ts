import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoSystemDestroyPlayerForce from "../../../proto/schema/CommonProto/WarOperation/WoSystemDestroyPlayerForce.ts";
import * as TurnsConstants from "../../../turns/Constants.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export function revise(war: IBwWar, rawAction: ProtoSchemaCommonProtoWarOperationWoSystemDestroyPlayerForce.WoSystemDestroyPlayerForce, requesterUserId: Undefinable<number>): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer {
    if (requesterUserId != null) {
        throw HelpersMisc.newError(`Invalid requesterUserId.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemDestroyPlayerForce_00);
    }

    if (war.getTurnPhaseCode() !== TurnsConstants.PhaseCode.Main) {
        throw HelpersMisc.newError(`Invalid turnPhaseCode.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemDestroyPlayerForce_01);
    }

    const targetPlayerIndex = rawAction.getTargetPlayerIndex();
    if ((targetPlayerIndex == null) || (targetPlayerIndex === PlayersConstants.PlayerIndex.Neutral)) {
        throw HelpersMisc.newError(`Invalid targetPlayerIndex: ${targetPlayerIndex}`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemDestroyPlayerForce_02);
    }

    const player = war.getPlayer(targetPlayerIndex);
    if ((player == null) || (player.getAliveState() !== PlayersConstants.AliveStateId.Dying)) {
        throw HelpersMisc.newError(`Invalid aliveState.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemDestroyPlayerForce_03);
    }

    return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
        WoSystemDestroyPlayerForce: {
            targetPlayerIndex,
        },
    });
}
