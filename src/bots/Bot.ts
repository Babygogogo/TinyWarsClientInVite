import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import * as BotsUtils from "./Utils.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoContainer from "../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";

type WoContainer    = ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer;
type IBwWar         = BaseWarInterfaceIBwWar.IBwWar;

const _calculatingWars = new Set<IBwWar>();

export async function getNextOperation(war: IBwWar): Promise<WoContainer> {
    if (_calculatingWars.has(war)) {
        throw HelpersMisc.newError(`Calculating.`, UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetNextAction_00);
    }

    _calculatingWars.add(war);
    const action = await BotsUtils.doGetNextOperation(war);
    action.setOperationId(war.getExecutedOperationManager().getExecutedOperationsCount());
    _calculatingWars.delete(war);

    return action;
}
