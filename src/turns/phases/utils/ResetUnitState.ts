import {
    type Turns_Manager,
    AuxiliaryTypes_ChangedThingsForWarOperation,
    Units_Constants,
} from "../../../internal.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function runAsOuterWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): void {
    // nothing to do
}

export function runAsInnerWar(turnManager: Turns_Manager.Manager): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    return runAsLocalWar(turnManager, true);
}

export function runAsUnifiedWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    return runAsLocalWar(turnManager, isFastExecute);
}

function runAsLocalWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    for (const unit of (turnManager.getWar()).getUnitMap().getAllUnits()) {
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
