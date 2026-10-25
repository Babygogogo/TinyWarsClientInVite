import type { GridIndex } from "../auxiliaryTypes/GridIndex.ts";
import type { IUnit } from "../units/IUnit.ts";

export interface ChosenUnitForDrop {
    unit        : IUnit;
    destination : GridIndex;
}
