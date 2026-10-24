import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoSystemVoteForDraw from "../../../proto/schema/CommonProto/WarOperation/WoSystemVoteForDraw.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export function revise(war: IBwWar, rawAction: ProtoSchemaCommonProtoWarOperationWoSystemVoteForDraw.WoSystemVoteForDraw, requesterUserId: Undefinable<number>): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer {
    if (requesterUserId != null) {
        throw HelpersMisc.newError(`Invalid requesterUserId.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemVoteForDraw_00);
    }

    const playerIndex = rawAction.getPlayerIndex();
    if (playerIndex == null) {
        throw HelpersMisc.newError(`Empty playerIndex.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemVoteForDraw_01);
    }
    if (!war.getPlayerManager().checkHasPlayer(playerIndex)) {
        throw HelpersMisc.newError(`Invalid playerIndex.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemVoteForDraw_02);
    }

    const isAgree = rawAction.getIsAgree();
    if (isAgree == null) {
        throw HelpersMisc.newError(`Invalid isAgree.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemVoteForDraw_03);
    }
    if (!war.getDrawVoteManager().checkCanVote(playerIndex, isAgree)) {
        throw HelpersMisc.newError(`Cannot vote.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemVoteForDraw_04);
    }

    return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
        WoSystemVoteForDraw: {
            playerIndex : playerIndex,
            isAgree     : isAgree,
        },
    });
}
