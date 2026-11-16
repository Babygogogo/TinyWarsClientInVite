import {
    type Turns_Manager,
    AuxiliaryTypes_ChangedThingsForWarOperation,
    Helpers_Misc,
} from "../../../internal.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function runAsOuterWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): void {
    // nothing to do
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function runAsLocalWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    turnManager.setHasUnitOnBeginningTurn(Helpers_Misc.getExisted(turnManager.getWar()).getUnitMap().checkHasUnitForPlayer(turnManager.getPlayerIndexInTurn()));
    return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
}
