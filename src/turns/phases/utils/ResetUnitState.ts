import {
    type Turns_Manager,
    AuxiliaryTypes_ChangedThingsForWarOperation,
    Helpers_Misc,
    Units_Constants,
} from "../../../internal.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function runAsOuterWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): void {
    // nothing to do
}

export function runAsLocalWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    for (const unit of Helpers_Misc.getExisted(turnManager.getWar()).getUnitMap().getAllUnits()) {
        if (unit.getPlayerIndex() === playerIndex) {
            unit.setActionState(Units_Constants.ActionStateId.Idle);
            changedThings.addUnit(unit);

            if (!isFastExecute) {
                unit.flushDataToView();
            }
        }
    }

    return changedThings;
}
