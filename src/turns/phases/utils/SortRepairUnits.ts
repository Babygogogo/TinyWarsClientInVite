import {
    Helpers_Misc,
    Utils_ClientErrorCode,
    type Units_Unit,
} from "../../../internal.ts";

export function sorterForRepairUnits(unit1: Units_Unit.Unit, unit2: Units_Unit.Unit): number {
    const cost1 = unit1.getProductionFinalCost();
    if (cost1 == null) {
        throw Helpers_Misc.newError(`Empty cost1.`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_SorterForRepairUnits_00);
    }

    const cost2 = unit2.getProductionFinalCost();
    if (cost2 == null) {
        throw Helpers_Misc.newError(`Empty cost2.`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_SorterForRepairUnits_01);
    }

    if (cost1 !== cost2) {
        return cost2 - cost1;
    } else {
        const unitId1 = unit1.getUnitId();
        if (unitId1 == null) {
            throw Helpers_Misc.newError(`Empty unitId1.`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_SorterForRepairUnits_02);
        }

        const unitId2 = unit2.getUnitId();
        if (unitId2 == null) {
            throw Helpers_Misc.newError(`Empty unitId2.`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_SorterForRepairUnits_03);
        }

        return unitId1 - unitId2;
    }
}
