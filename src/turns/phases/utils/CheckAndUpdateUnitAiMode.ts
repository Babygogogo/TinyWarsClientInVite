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
    const war           = Helpers_Misc.getExisted(turnManager.getWar());
    const playerInTurn  = war.getPlayerInTurn();
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    if (playerInTurn.getUserId() == null) {
        const playerIndex = playerInTurn.getPlayerIndex();
        for (const unit of war.getUnitMap().getAllUnits()) {
            if ((unit.getPlayerIndex() === playerIndex) && (unit.checkAndUpdateAiMode())) {
                changedThings.addUnit(unit);
            }
        }
    }

    return changedThings;
}
