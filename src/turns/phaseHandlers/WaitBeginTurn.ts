import {
    type Turns_Manager,
    AuxiliaryTypes_ChangedThingsForWarOperation,
} from "../../internal.ts";

export function runAsOuterWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): void {
    if (!isFastExecute) {
        turnManager.getWar().getTileMap().getView()?.resetMarkLayer();
    }
}

export function runAsInnerWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    if (!isFastExecute) {
        turnManager.getWar().getTileMap().getView()?.resetMarkLayer();
    }
    return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
}
