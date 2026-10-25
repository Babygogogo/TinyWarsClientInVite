import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import { doGetNextOperation } from "./Utils.ts";
import { newError } from "../helpers/Misc.ts";
import type { WoContainer } from "../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";

const _calculatingWars = new Set<IBwWar>();

export async function getNextOperation(war: IBwWar): Promise<WoContainer> {
    if (_calculatingWars.has(war)) {
        throw newError(`Calculating.`, ClientErrorCode.SpwRobot_GetNextAction_00);
    }

    _calculatingWars.add(war);
    const action = await doGetNextOperation(war);
    action.setOperationId(war.getExecutedOperationManager().getExecutedOperationsCount());
    _calculatingWars.delete(war);

    return action;
}
