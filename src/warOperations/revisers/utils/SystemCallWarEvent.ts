import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoSystemCallWarEvent from "../../../proto/schema/CommonProto/WarOperation/WoSystemCallWarEvent.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export function revise(war: IBwWar, rawAction: ProtoSchemaCommonProtoWarOperationWoSystemCallWarEvent.WoSystemCallWarEvent, requesterUserId: Undefinable<number>): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer {
    if (requesterUserId != null) {
        throw HelpersMisc.newError(`Invalid requesterUserId.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemCallWarEvent_00);
    }

    const warEventId = HelpersMisc.getExisted(rawAction.getWarEventId(), UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemCallWarEvent_01);
    const dataIndex  = HelpersMisc.getExisted(rawAction.getNodeAndActionsIndex(), UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemCallWarEvent_02);
    if (war.getRandomNumberManager().getIsNeedSeedRandom()) {   // 由于随机条件在没有seedrandom的情况下会出现验算不通过的情况，所以只能针对性跳过验算
        const callableWarEventIdAndDataIndex = war.getWarEventManager().getCallableWarEventIdAndDataIndex();
        if ((callableWarEventIdAndDataIndex == null)                    ||
            (warEventId !== callableWarEventIdAndDataIndex.warEventId)  ||
            (dataIndex !== callableWarEventIdAndDataIndex.dataIndex)
        ) {
            throw HelpersMisc.newError(`Invalid warEventId: ${warEventId}`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemCallWarEvent_03);
        }
    }

    return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
        WoSystemCallWarEvent: {
            warEventId          : warEventId,
            nodeAndActionsIndex : dataIndex,
        },
    });
}
