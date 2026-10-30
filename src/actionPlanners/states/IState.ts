import type { StateId } from "../Constants.ts";
import type { IActionPlanner } from "../IActionPlanner.ts";
import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";

export interface IState {
    getStateId(): StateId;

    getNextStateIdOnTap(actionPlanner: IActionPlanner, gridIndex: GridIndex): StateId;
    getNextStateIdOnDrag(actionPlanner: IActionPlanner): StateId;
    getNextStateIdOnDragEnded(actionPlanner: IActionPlanner, gridIndex: GridIndex): StateId;

    cancel(actionPlanner: IActionPlanner): void;

    doApplyOnTap(actionPlanner: IActionPlanner, gridIndex: GridIndex): void;
    doApplyOnDrag(actionPlanner: IActionPlanner, gridIndex: GridIndex): void;
    doApplyOnDragEnded(actionPlanner: IActionPlanner, gridIndex: GridIndex): void;
}
