import {
    type AuxiliaryTypes_GridIndex,
    type Units_IUnit,
} from "../internal.ts";

export interface ChosenUnitForDrop {
    unit        : Units_IUnit.IUnit;
    destination : AuxiliaryTypes_GridIndex.GridIndex;
}
