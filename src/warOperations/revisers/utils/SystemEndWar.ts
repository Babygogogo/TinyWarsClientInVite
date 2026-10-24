import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoSystemEndWar from "../../../proto/schema/CommonProto/WarOperation/WoSystemEndWar.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";

type IBwWar             = BaseWarInterfaceIBwWar.IBwWar;
type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function revise(war: IBwWar, rawAction: ProtoSchemaCommonProtoWarOperationWoSystemEndWar.WoSystemEndWar, requesterUserId: Undefinable<number>): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer {
    if (requesterUserId != null) {
        throw HelpersMisc.newError(`Invalid requesterUserId.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemEndWar_00);
    }

    if (!war.checkCanEnd()) {
        throw HelpersMisc.newError(`Can not end.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemEndWar_01);
    }

    return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
        WoSystemEndWar: {
        },
    });
}
