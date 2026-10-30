import {
    Utils_ClientErrorCode,
    Bots_Utils,
    Helpers_Misc,
    type BaseWar_Interface_IBwWar,
} from "../internal.ts";
import type { WoContainer } from "../proto/schema/CommonProto/WarOperation/WoContainer.ts";

const _calculatingWars = new Set<BaseWar_Interface_IBwWar.IBwWar>();

export async function getNextOperation(war: BaseWar_Interface_IBwWar.IBwWar): Promise<WoContainer> {
    if (_calculatingWars.has(war)) {
        throw Helpers_Misc.newError(`Calculating.`, Utils_ClientErrorCode.ClientErrorCode.SpwRobot_GetNextAction_00);
    }

    _calculatingWars.add(war);
    const action = await Bots_Utils.doGetNextOperation(war);
    action.setOperationId(war.getExecutedOperationManager().getExecutedOperationsCount());
    _calculatingWars.delete(war);

    return action;
}
