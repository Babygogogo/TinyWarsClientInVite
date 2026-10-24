import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoPlayerVoteForDraw from "../../../proto/schema/CommonProto/WarOperation/WoPlayerVoteForDraw.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export function revise(war: IBwWar, rawAction: ProtoSchemaCommonProtoWarOperationWoPlayerVoteForDraw.WoPlayerVoteForDraw, requesterUserId: Undefinable<number>): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer {
    const playerIndex = rawAction.getPlayerIndex();
    if (playerIndex == null) {
        throw HelpersMisc.newError(`Empty playerIndex.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_00);
    }
    if (!war.getPlayerManager().checkHasPlayer(playerIndex)) {
        throw HelpersMisc.newError(`Invalid playerIndex.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_01);
    }
    if (playerIndex === PlayersConstants.PlayerIndex.Neutral) {
        throw HelpersMisc.newError(`Invalid neutral playerIndex.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_02);
    }

    const player = war.getPlayer(playerIndex);
    if ((player.getAliveState() !== PlayersConstants.AliveStateId.Alive)   ||
        (player.getUserId() != requesterUserId)
    ) {
        throw HelpersMisc.newError(`Invalid aliveState.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_03);
    }

    const isAgree = rawAction.getIsAgree();
    if (isAgree == null) {
        throw HelpersMisc.newError(`Invalid isAgree: ${isAgree}`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_04);
    }
    if (!war.getDrawVoteManager().checkCanVote(playerIndex, isAgree)) {
        throw HelpersMisc.newError(`Cannot vote currently: ${isAgree}`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_05);
    }

    return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
        WoPlayerVoteForDraw: {
            playerIndex : playerIndex,
            isAgree     : isAgree,
        },
    });
}
