import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoPlayerSurrender from "../../../proto/schema/CommonProto/WarOperation/WoPlayerSurrender.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export function revise(war: IBwWar, rawAction: ProtoSchemaCommonProtoWarOperationWoPlayerSurrender.WoPlayerSurrender, requesterUserId: Undefinable<number>): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer {
    const playerIndex   = HelpersMisc.getExisted(rawAction.getPlayerIndex(), UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerSurrender_00);
    const player        = war.getPlayer(playerIndex);
    if ((player.getUserId() == null)                            ||
        (player.checkIsNeutral())                               ||
        (player.getAliveState() !== PlayersConstants.AliveStateId.Alive)   ||
        (player.getUserId() != requesterUserId)
    ) {
        throw HelpersMisc.newError(`Invalid playerIndex or aliveState.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerSurrender_01);
    }

    return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
        WoPlayerSurrender: {
            playerIndex : playerIndex,
        },
    });
}
