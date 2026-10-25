import type { StateId } from "../Constants.ts";
import type { IActionPlanner } from "../IActionPlanner.ts";
import type { GridIndex as AuxiliaryTypesGridIndex } from "../../auxiliaryTypes/GridIndex.ts";

type ApStateId  = StateId;
type GridIndex  = AuxiliaryTypesGridIndex;

export interface IState {
    getStateId(): ApStateId;

    getNextStateIdOnTap(actionPlanner: IActionPlanner, gridIndex: GridIndex): ApStateId;
    getNextStateIdOnDrag(actionPlanner: IActionPlanner): ApStateId;
    getNextStateIdOnDragEnded(actionPlanner: IActionPlanner, gridIndex: GridIndex): ApStateId;

    cancel(actionPlanner: IActionPlanner): void;

    doApplyOnTap(actionPlanner: IActionPlanner, gridIndex: GridIndex): void;
    doApplyOnDrag(actionPlanner: IActionPlanner, gridIndex: GridIndex): void;
    doApplyOnDragEnded(actionPlanner: IActionPlanner, gridIndex: GridIndex): void;
}
