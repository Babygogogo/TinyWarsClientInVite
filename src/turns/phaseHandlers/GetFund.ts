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
    const war           = turnManager.getWar();
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const player        = war.getPlayer(playerIndex);
    const currentFund   = player.getFund();
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    let totalIncome     = war.getTileMap().getTotalIncomeForPlayer(playerIndex);
    if (turnManager.getTurnIndex() === Turns_Constants.TurnIndex.FirstIndex) {
        totalIncome += war.getCommonSettingManager().getPlayerRule(playerIndex).getInitialFund();
    }

    player.setFund(currentFund + totalIncome);
    changedThings.addPlayer(player);

    return changedThings;
}
