import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    Helpers_Misc,
    Players_Constants,
    Turns_Constants,
    type Turns_Manager,
} from "../../../internal.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function runAsOuterWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): void {
    // nothing to do
}

export function runAsLocalWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const playerIndex = turnManager.getPlayerIndexInTurn();
    if (playerIndex === Players_Constants.PlayerIndex.Neutral) {
        return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    }

    const war       = Helpers_Misc.getExisted(turnManager.getWar());
    const tileMap   = war.getTileMap();
    let totalIncome = tileMap.getTotalIncomeForPlayer(playerIndex);
    if (turnManager.getTurnIndex() === Turns_Constants.TurnIndex.FirstIndex) {
        totalIncome += war.getCommonSettingManager().getPlayerRule(playerIndex).getInitialFund();
    }

    const player = war.getPlayer(playerIndex);
    player.setFund(player.getFund() + totalIncome, !isFastExecute);
    return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation({ players : [player] });
}
