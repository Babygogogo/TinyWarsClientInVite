import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoSystemHandleBootPlayer from "../../../proto/schema/CommonProto/WarOperation/WoSystemHandleBootPlayer.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function revise(war: IBwWar, rawAction: ProtoSchemaCommonProtoWarOperationWoSystemHandleBootPlayer.WoSystemHandleBootPlayer, requesterUserId: Undefinable<number>): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer {
    if (requesterUserId != null) {
        throw HelpersMisc.newError(`Invalid requesterUserId.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemHandleBootPlayer_00);
    }

    if (!war.checkIsBoot()) {
        throw HelpersMisc.newError(`Is not boot.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemHandleBootPlayer_01);
    }

    return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
        WoSystemHandleBootPlayer: {
        },
    });
}
