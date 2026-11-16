import {
    type Turns_Manager,
    AuxiliaryTypes_ChangedThingsForWarOperation,
} from "../../internal.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function runAsOuterWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): void {
    // nothing to do
}

export function runAsInnerWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation({
        units : turnManager.getWar().getUnitMap().getAllUnits().filter(v => v.updateBuffArrayOnPlayerTurnSwitched(!isFastExecute)),
    });
}
