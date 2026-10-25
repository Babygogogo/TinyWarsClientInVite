import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getFormattedText, getText } from "../../../lang/Utils.ts";
import type { WarEventFullData } from "../../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaStopPersistentAction } from "../../../proto/schema/CommonProto/WarEvent/WeaStopPersistentAction.ts";

export function checkIsValid(action: Undefinable<WeaStopPersistentAction>): boolean {
    if (action == null) {
        return false;
    }

    const actionIdArray = action.getActionIdArray();
    if ((actionIdArray == null)                                 ||
        (actionIdArray.length !== new Set(actionIdArray).size)
    ) {
        return false;
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaStopPersistentAction>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0130, data.getActionIdArray()?.map(v => `A${v}`).join(`/`) || `--`);
}
export function getDetailDesc(data: Undefinable<WeaStopPersistentAction>): string | null {
    return getBriefDesc(data);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getErrorTip(data: WeaStopPersistentAction, fullData: WarEventFullData): string | null {
    const actionIdArray = data.getActionIdArray();
    if ((actionIdArray == null) || (actionIdArray.length === 0)) {
        return getText(TextType.A0305);
    }

    if (actionIdArray.length !== new Set(actionIdArray).size) {
        return getText(TextType.A0306);
    }

    return null;
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(action: WeaStopPersistentAction, isFastExecute: boolean, war: IBwWar): Promise<void> {
    war.getWarEventManager().updateOpaIdArrayOnDeleteAction(action.getActionIdArray());
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithoutExtraData(action: WeaStopPersistentAction, isFastExecute: boolean, war: IBwWar): Promise<void> {
    war.getWarEventManager().updateOpaIdArrayOnDeleteAction(action.getActionIdArray());
}
