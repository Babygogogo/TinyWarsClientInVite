import {
    type Turns_Manager,
    AuxiliaryTypes_ChangedThingsForWarOperation,
    Players_Constants,
} from "../../internal.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function runAsOuterWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): void {
    // nothing to do
}

export function runAsInnerWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const war           = turnManager.getWar();
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const player        = war.getPlayer(playerIndex);
    const unitMap       = war.getUnitMap();
    const hasUnit       = unitMap.checkHasUnitForPlayer(playerIndex);
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    if ((turnManager.getHasUnitOnBeginningTurn())   &&
        (!hasUnit)
    ) {
        player.setAliveState(Players_Constants.AliveStateId.Dying);
        changedThings.addPlayer(player);
    }

    if ((!isFastExecute) && (hasUnit)) {
        for (const unit of unitMap.getAllUnitsOnMap()) {
            if (unit.getPlayerIndex() === playerIndex) {
                unit.flushDataToView();
            }
        }
    }

    return changedThings;
}
