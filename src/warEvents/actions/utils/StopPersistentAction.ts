import {
    Lang_Utils,
    Lang_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WarEventFullData } from "../../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WeaStopPersistentAction } from "../../../proto/schema/CommonProto/WarEvent/WeaStopPersistentAction.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaStopPersistentAction>): boolean {
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

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaStopPersistentAction>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0130, data.getActionIdArray()?.map(v => `A${v}`).join(`/`) || `--`);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaStopPersistentAction>): string | null {
    return getBriefDesc(data);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getErrorTip(data: WeaStopPersistentAction, fullData: WarEventFullData): string | null {
    const actionIdArray = data.getActionIdArray();
    if ((actionIdArray == null) || (actionIdArray.length === 0)) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0305);
    }

    if (actionIdArray.length !== new Set(actionIdArray).size) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0306);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(action: WeaStopPersistentAction, isFastExecute: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    war.getWarEventManager().updateOpaIdArrayOnDeleteAction(action.getActionIdArray());
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithoutExtraData(action: WeaStopPersistentAction, isFastExecute: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    war.getWarEventManager().updateOpaIdArrayOnDeleteAction(action.getActionIdArray());
}
