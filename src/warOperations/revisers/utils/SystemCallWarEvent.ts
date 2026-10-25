import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { newError, getExisted } from "../../../helpers/Misc.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemCallWarEvent } from "../../../proto/schema/CommonProto/WarOperation/WoSystemCallWarEvent.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";

export function revise(war: IBwWar, rawAction: WoSystemCallWarEvent, requesterUserId: Undefinable<number>): WoContainer {
    if (requesterUserId != null) {
        throw newError(`Invalid requesterUserId.`, ClientErrorCode.WarOperationReviser_ReviseSystemCallWarEvent_00);
    }

    const warEventId = getExisted(rawAction.getWarEventId(), ClientErrorCode.WarOperationReviser_ReviseSystemCallWarEvent_01);
    const dataIndex  = getExisted(rawAction.getNodeAndActionsIndex(), ClientErrorCode.WarOperationReviser_ReviseSystemCallWarEvent_02);
    if (war.getRandomNumberManager().getIsNeedSeedRandom()) {   // 由于随机条件在没有seedrandom的情况下会出现验算不通过的情况，所以只能针对性跳过验算
        const callableWarEventIdAndDataIndex = war.getWarEventManager().getCallableWarEventIdAndDataIndex();
        if ((callableWarEventIdAndDataIndex == null)                    ||
            (warEventId !== callableWarEventIdAndDataIndex.warEventId)  ||
            (dataIndex !== callableWarEventIdAndDataIndex.dataIndex)
        ) {
            throw newError(`Invalid warEventId: ${warEventId}`, ClientErrorCode.WarOperationReviser_ReviseSystemCallWarEvent_03);
        }
    }

    return WoContainer.fromJson({
        WoSystemCallWarEvent: {
            warEventId          : warEventId,
            nodeAndActionsIndex : dataIndex,
        },
    });
}
