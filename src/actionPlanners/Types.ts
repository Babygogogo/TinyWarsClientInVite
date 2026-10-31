import {
    type AuxiliaryTypes_GridIndex,
    type Units_Unit,
} from "../internal.ts";

export interface ChosenUnitForDrop {
    unit        : Units_Unit.Unit;
    destination : AuxiliaryTypes_GridIndex.GridIndex;
}
