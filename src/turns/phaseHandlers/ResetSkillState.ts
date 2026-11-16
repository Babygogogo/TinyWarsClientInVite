import {
    CoSkills_Constants,
    type Turns_Manager,
    AuxiliaryTypes_ChangedThingsForWarOperation,
} from "../../internal.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function runAsOuterWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): void {
    // nothing to do
}

export function runAsInnerWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const war       = turnManager.getWar();
    const player    = war.getPlayerInTurn();
    player.setCoIsDestroyedInTurn(false);
    player.setCoUsingSkillType(CoSkills_Constants.SkillTypeId.Passive);

    if (!isFastExecute) {
        war.getTileMap().getView()?.updateCoZone();
    }

    return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation({ players : [player] });
}
