import {
    Turns_Constants,
    type Turns_Manager,
    AuxiliaryTypes_ChangedThingsForWarOperation,
} from "../../internal.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function runAsOuterWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): void {
    // nothing to do
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function runAsInnerWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const turnIndex     = turnManager.getTurnIndex();
    const war           = turnManager.getWar();
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    if (turnIndex > Turns_Constants.TurnIndex.FirstIndex) {
        for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
            if (unit.getPlayerIndex() === playerIndex) {
                const currentFuel = unit.getCurrentFuel();
                const consumption = unit.getFuelConsumptionPerTurn();
                if (consumption !== 0) {
                    unit.setCurrentFuel(Math.max(0, currentFuel - consumption));
                    changedThings.addUnit(unit);
                }
            }
        }
    }

    return changedThings;
}
