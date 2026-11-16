import {
    type Turns_Manager,
    AuxiliaryTypes_ChangedThingsForWarOperation,
    Helpers_Misc,
} from "../../../internal.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function runAsOuterWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): void {
    // nothing to do
}

export function runAsLocalWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation({
        tiles : Helpers_Misc.getExisted(turnManager.getWar()).getTileMap().getAllTiles().filter(v => v.updateUnfixedBuffArrayOnPlayerTurnSwitched(!isFastExecute)),
    });
}
