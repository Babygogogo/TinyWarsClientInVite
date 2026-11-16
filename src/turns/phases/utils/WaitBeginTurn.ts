import {
    type Turns_Manager,
    AuxiliaryTypes_ChangedThingsForWarOperation,
    Helpers_Misc,
} from "../../../internal.ts";

export function runAsOuterWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): void {
    if (!isFastExecute) {
        Helpers_Misc.getExisted(turnManager.getWar()).getTileMap().getView()?.resetMarkLayer();
    }
}

export function runAsLocalWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    if (!isFastExecute) {
        Helpers_Misc.getExisted(turnManager.getWar()).getTileMap().getView()?.resetMarkLayer();
    }
    return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
}
