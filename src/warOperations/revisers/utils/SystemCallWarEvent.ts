import {
    Utils_ClientErrorCode,
    Helpers_Misc,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemCallWarEvent } from "../../../proto/schema/CommonProto/WarOperation/WoSystemCallWarEvent.ts";

export function revise(war: BaseWar_Interface_IBwWar.IBwWar, rawAction: WoSystemCallWarEvent, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (requesterUserId != null) {
        throw Helpers_Misc.newError(`Invalid requesterUserId.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemCallWarEvent_00);
    }

    const warEventId = rawAction.getWarEventId();
    const dataIndex  = rawAction.getNodeAndActionsIndex();
    if (war.getRandomNumberManager().getIsNeedSeedRandom()) {   // 由于随机条件在没有seedrandom的情况下会出现验算不通过的情况，所以只能针对性跳过验算
        const callableWarEventIdAndDataIndex = war.getWarEventManager().getCallableWarEventIdAndDataIndex();
        if ((callableWarEventIdAndDataIndex == null)                    ||
            (warEventId !== callableWarEventIdAndDataIndex.warEventId)  ||
            (dataIndex !== callableWarEventIdAndDataIndex.dataIndex)
        ) {
            throw Helpers_Misc.newError(`Invalid warEventId: ${warEventId}`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemCallWarEvent_03);
        }
    }

    return WoContainer.fromJson({
        WoSystemCallWarEvent: {
            warEventId          : warEventId,
            nodeAndActionsIndex : dataIndex,
        },
    });
}
