import type * as AuxiliaryTypesGridIndex from "../auxiliaryTypes/GridIndex.ts";
import type * as UnitsIUnit from "../units/IUnit.ts";

export interface ChosenUnitForDrop {
    unit        : UnitsIUnit.IUnit;
    destination : AuxiliaryTypesGridIndex.GridIndex;
}
