import {
    Utils_ClientErrorCode,
    WarOperations_Revisers_Result,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemCallWarEvent } from "../../../proto/schema/CommonProto/WarOperation/WoSystemCallWarEvent.ts";

export function revise(war: BaseWar_Model_War.War, rawAction: WoSystemCallWarEvent, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WarOperations_Revisers_Result.Result {
    if (requesterUserId != null) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemCallWarEvent_00);
    }

    const warEventId = rawAction.getWarEventId();
    const dataIndex  = rawAction.getNodeAndActionsIndex();
    // if (war.getRandomNumberManager().getIsNeedSeedRandom()) {   // 由于随机条件在没有seedrandom的情况下会出现验算不通过的情况，所以只能针对性跳过验算
    //     const callableWarEventIdAndDataIndex = war.getWarEventManager().getCallableWarEventIdAndDataIndex();
    //     if ((callableWarEventIdAndDataIndex == null)                    ||
    //         (warEventId !== callableWarEventIdAndDataIndex.warEventId)  ||
    //         (dataIndex !== callableWarEventIdAndDataIndex.dataIndex)
    //     ) {
    //         return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemCallWarEvent_03);
    //     }
    // }

    return WarOperations_Revisers_Result.Result.create2(WoContainer.fromJson({
        WoSystemCallWarEvent : {
            warEventId          : warEventId,
            nodeAndActionsIndex : dataIndex,
        },
    }));
}
