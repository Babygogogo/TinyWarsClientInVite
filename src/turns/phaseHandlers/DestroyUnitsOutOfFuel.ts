import {
    type Turns_Manager,
    AuxiliaryTypes_ChangedThingsForWarOperation,
    Destructions_Utils,
} from "../../internal.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function runAsOuterWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): void {
    // nothing to do
}

export function runAsInnerWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const playerIndex           = turnManager.getPlayerIndexInTurn();
    const war                   = turnManager.getWar();
    const fogMap                = war.getFogMap();
    const isPathVisionEnabled   = war.getGcData().getSystemCfg().getIsPathVisionEnabled();
    const changedThings         = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();

    for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
        if ((unit.checkIsDestroyedOnOutOfFuel())    &&
            (unit.getCurrentFuel() <= 0)            &&
            (unit.getPlayerIndex() === playerIndex)
        ) {
            const gridIndex = unit.getGridIndex();
            if (isPathVisionEnabled) {
                fogMap.updateMapFromPathsByUnitAndPath({
                    unit           : unit,
                    unitVisionInfo : unit.getVisionInfo(),
                    path           : [gridIndex],
                });
            }

            changedThings.mergeFrom(Destructions_Utils.destroyUnitOnMap(war, gridIndex, !isFastExecute));
        }
    }

    return changedThings;
}
