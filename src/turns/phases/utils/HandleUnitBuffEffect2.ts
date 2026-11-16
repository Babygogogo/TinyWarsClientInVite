import {
    type Turns_Manager,
    AuxiliaryTypes_ChangedThingsForWarOperation,
    Destructions_Utils,
    Helpers_Misc,
    UnitBuffs_Constants,
} from "../../../internal.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function runAsOuterWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): void {
    // nothing to do
}

export function runAsLocalWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const playerIndex   = turnManager.getPlayerIndexInTurn();
    const war           = Helpers_Misc.getExisted(turnManager.getWar());
    const unitMap       = war.getUnitMap();
    const units         = unitMap.getAllUnits().filter(v => v.getPlayerIndex() === playerIndex).sort((v1, v2) => v1.getUnitId() - v2.getUnitId());
    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    for (const unit of units) {
        const gridIndex = unit.getGridIndex();
        const unitId    = unit.getUnitId();
        if (unitMap.getUnit(gridIndex, unitId) == null) {
            continue;
        }

        let isModified = false;
        for (const buff of unit.getBuffList()) {
            const buffTypeId = buff.getBuffTypeId();
            if (buffTypeId === UnitBuffs_Constants.BuffTypeId.Disease) {
                isModified = true;

                const newHp = unit.getCurrentHp() - 10;
                if (newHp > 0) {
                    unit.setCurrentHp(newHp);
                    changedThings.addUnit(unit);
                } else {
                    if (unit.getLoaderUnitId() != null) {
                        changedThings.mergeFrom(Destructions_Utils.destroyUnitLoaded(war, unitId));
                    } else {
                        changedThings.mergeFrom(Destructions_Utils.destroyUnitOnMap(war, gridIndex, !isFastExecute));
                    }
                    break;
                }
            }
        }

        if ((isModified) && (!isFastExecute) && (unitMap.getUnit(gridIndex, unitId))) {
            unit.flushDataToView();
        }
    }

    return changedThings;
}
