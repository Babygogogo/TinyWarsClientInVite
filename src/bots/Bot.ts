import {
    Utils_ClientErrorCode,
    Bots_Utils,
    Helpers_Misc,
    type BaseWar_Model_War,
} from "../internal.ts";
import type { WoContainer } from "../proto/schema/CommonProto/WarOperation/WoContainer.ts";

const _calculatingWars = new Set<BaseWar_Model_War.War>();

export async function getNextOperation(war: BaseWar_Model_War.War): Promise<WoContainer> {
    if (_calculatingWars.has(war)) {
        throw Helpers_Misc.newError(`Calculating.`, Utils_ClientErrorCode.ClientErrorCode.SpwRobot_GetNextAction_00);
    }

    _calculatingWars.add(war);
    const action = await Bots_Utils.doGetNextOperation(war);
    action.setOperationId(war.getExecutedOperationManager().getExecutedOperationsCount());
    _calculatingWars.delete(war);

    return action;
}
